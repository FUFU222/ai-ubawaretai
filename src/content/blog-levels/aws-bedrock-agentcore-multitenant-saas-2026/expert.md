---
article: 'aws-bedrock-agentcore-multitenant-saas-2026'
level: 'expert'
---

AWS が 2026年6月23日に公開した Amazon Bedrock AgentCore のマルチテナント実装記事は、AI エージェントを SaaS として提供する企業にとってかなり実務的な内容だった。表面的には、医療機関向け AI アシスタントを題材にしたサンプル実装である。しかし中身は、shared infrastructure、tenant isolation、service tier differentiation、cost attribution、observability をどう組み合わせるかという、SaaS AI 基盤そのものの設計論になっている。

以前の [AWS Bedrock AgentCore harness/CLI 記事](/blog/aws-bedrock-agentcore-harness-cli-2026-04-22/) では、AgentCore を使ってエージェントを速く試し、本番運用へ寄せる入口を整理した。その後の [Bedrock AgentCore Payments 記事](/blog/aws-bedrock-agentcore-payments-x402-2026/) では、エージェントが外部サービスへ支払い、顧客へ価値単位で課金する時の論点を扱った。今回の multi-tenancy は、その2つを支える基盤設計である。テナント分離と利用量配賦が弱ければ、顧客向けエージェント課金は成立しない。

同じ大きな流れは、[Google Cloud の Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) や [Mistral Workflows](/blog/mistral-workflows-enterprise-ai-2026/) でも見えていた。企業向け AI エージェントの競争軸は、モデルの性能比較だけではなく、Identity、Gateway、Memory、Policy、Observability、Billing を含む control plane に移っている。AWS の今回の記事は、その中でも SaaS の tenant boundary に焦点を当てたものだ。

## 事実: pool modelで共有インフラと分離を両立する構成

AWS の記事は、マルチテナント AI アプリケーションに必要な要素をかなり明確に置いている。顧客間の complete tenant isolation、service tier ごとの capability 差、tenant ごとの cost tracking、tenant 単位の observability がないと、顧客データの露出、サービス品質の不一致、予期しないコスト増が起こり得る、という問題設定だ。

実装例は healthcare AI assistant だが、抽象化すると Tier、Tenant、User の 3 層になる。Basic tier は小規模クリニック向けに文書検索中心の軽量構成、Premium tier は病院や専門施設向けに高度な reasoning と web search tool を含む構成としている。その上で、各 tier の中に clinic や hospital という tenant があり、さらに user ごとの memory や権限を分ける。

この設計が重要なのは、silo model ではなく pool isolation model を前提にしている点だ。すべての tenant に専用 agent、専用 gateway、専用 storage、専用 model endpoint を用意すれば説明は簡単だが、SaaS としての原価効率と運用効率は落ちる。pool model は共有インフラを使う代わりに、tenant context、access policy、data partitioning、structured logging を複数レイヤーで徹底する必要がある。

日本の SaaS 企業にとっても、この選択は現実的だ。Enterprise 顧客だけに専用基盤を出す hybrid model はあり得るが、標準プランの AI 機能まで tenant ごとに完全分離すると、価格に乗せにくい。したがって多くの会社では、pool を基本にしつつ、特定の高リスクデータや上位プランだけ silo または bridge に寄せる設計になる。その時、今回の記事は「pool でも何を分離境界として扱うべきか」の参考になる。

## 事実: tenant contextをIdentityからRuntimeまで流す

AWS の構成では、Cognito が user authentication と tenant metadata の起点になる。JWT claim に tier、clinic_id、role などを持たせ、API Gateway、Lambda、AgentCore Runtime、Gateway、Memory、Knowledge Base へ tenant context を伝播する。

ここで重要なのは、tenant_id をアプリケーションコードの内部変数に閉じ込めていないことだ。AgentCore Runtime の inbound JWT authorizer で token を検証し、Gateway でも同じ token と tenant header を扱い、下流の Lambda では trusted tenant headers をもとに scoped credentials を発行する。さらに STS session tags と ABAC を使い、DynamoDB や Memory へのアクセスを tenant scope に制限する。

これは、AI エージェントの multi-tenancy では特に重要になる。従来の CRUD アプリなら、DB の query 条件に tenant_id を入れる設計でかなりの範囲を説明できた。しかしエージェントは、Memory、Knowledge Base、MCP tool、外部 API、code execution、payment などにまたがって動く。どこか1箇所で tenant context が落ちると、別テナントの情報を参照したり、別テナントのコストとして計上したりする可能性がある。

したがって、tenant context は「ログイン時の属性」ではなく、agent invocation の実行文脈として扱う必要がある。Identity から Runtime、Gateway、Memory、Observability まで同じ文脈を流せることが、エージェント SaaS の基礎になる。

## 事実: MemoryとKnowledge Baseは二重に分離する

AWS の例では、AgentCore Memory に hierarchical namespace を使い、tier、clinic_id、user_id を含む actor_id で会話履歴や preferences を分ける。さらに STS AssumeRole と session tags によって、取得する一時認証情報そのものを tenant scope にする。つまり、アプリケーションロジックと IAM レイヤーの両方で分離する構成だ。

Knowledge Base でも同じ発想が出ている。S3 は tier ごとに bucket を分け、tenant ごとに prefix を切る。検索時には metadata filter で clinic_id を指定し、要求元 tenant の文書だけを retrieval 対象にする。これは単純な filter ではあるが、S3 prefix、Gateway header、Knowledge Base metadata、ログの clinic_id が揃っている点が重要だ。

エージェントでは、Memory の漏えいと retrieval の漏えいは UX 上も検知しにくい。回答に「どこかで見た情報」が混ざっても、ユーザーはそれが別テナント由来だと気づかない場合がある。だからこそ、分離は prompt instruction で「他社データを見ない」と書く話ではない。namespace、credential、metadata、policy、trace の各層で同じ tenant boundary を持たせる必要がある。

## 事実: GatewayとPolicyでtier差を実行時に制御する

AWS の構成では、AgentCore Gateway が Lambda functions を MCP-compatible tools として公開し、agent が tenant context を含む header とともに tool を呼ぶ。Gateway は JWT authorization や IAM authorization を扱い、target Lambda へ tenant header を伝播する。これにより、tool 側が毎回独自に tenant routing を再実装する必要を減らしている。

さらに AgentCore Policy では、Cedar policy を使って tier-specific action boundaries を作っている。例として、Basic tier は `patient_context` tool を営業時間内だけ許可し、Premium tier はより広く許可する、といった差を gateway layer で実行している。ここは、SaaS のプラン差を実装するときに重要なヒントになる。

多くの SaaS では、プラン差を UI の表示制御や feature flag で表現しがちだ。しかし AI エージェントでは、UI に見えていない tool call が価値とリスクの本体になる。ユーザーが「高精度調査をして」と依頼した時、agent がどの tool を使えるか、どの時間帯に呼べるか、どの外部 API にアクセスできるかを、サーバー側の policy として制御する必要がある。

この点で、tier differentiation は商品企画だけの話ではない。プラン表に書かれた「高度な分析」「追加データ連携」「24時間利用」を、Gateway、Policy、rate limit、model selection、cost attribution へ落とし込む設計が必要になる。

## 事実: cost attributionは二段構えになっている

AWS の記事では、コスト配賦が per-tier と per-clinic の二段構えで説明されている。per-tier では Bedrock Projects を使い、CostCenter、Tier、Application などの cost allocation tag を付けて、Cost Explorer でモデル呼び出し費用を見られるようにする。

一方、per-clinic のようなより細かい粒度では、Bedrock Projects だけに頼らず、agent invocation 後に token usage を structured JSON としてログに残す。clinic_id、tier、user_id、model_id、input_tokens、output_tokens、total_tokens を CloudWatch に出し、Logs Insights で tenant 単位に集計する。この構成は、請求や原価計算の正本をどこに置くかという実務上の問いを含んでいる。

日本の SaaS 企業では、AI 機能の価格設計がまだ荒くなりやすい。月額プランに含める、一定回数まで無料、超過分は追加課金、Enterprise だけ別見積もり、という選択肢はある。しかしどの選択肢でも、tenant ごとの実消費を見られなければ、粗利管理ができない。

さらに、AI エージェントは token だけでなく tool call、browser 操作、code interpreter、external API、payment を使う可能性がある。したがって、原価配賦はクラウド請求の tag だけでは完結しない。アプリケーション側の structured usage log と billing ledger を結びつける必要がある。

## 分析: tenant isolationは「情報漏えい対策」だけではない

ここからは分析だ。

AI SaaS の tenant isolation は、単なるセキュリティ項目ではない。商品設計、原価管理、SLA、監査、カスタマーサクセスの全てに関わる。

第一に、情報漏えいを防ぐ。これは当然だが、Memory や retrieval の混線は通常の DB 漏えいより発見が難しいため、より強い設計が必要になる。

第二に、サービス品質を分ける。Basic tenant と Premium tenant が同じ rate limit、同じ model、同じ tool access なら、上位プランの価値を作りにくい。逆に、上位プランの高コスト処理を下位プランにも開放すると、粗利が崩れる。

第三に、費用責任を明確にする。どの tenant がどれだけ token と tool を使ったかを見られなければ、異常利用を止められない。顧客に利用明細を出すこともできない。

第四に、監査対応を可能にする。Enterprise 顧客は、誰がどのデータを使い、どの AI がどの外部ツールを呼び、どの出力を返したかを確認したがる。tenant context が trace に載っていなければ、後から説明できない。

このように考えると、tenant isolation はセキュリティチームだけの責任ではない。プロダクト、SRE、データ基盤、経理、CS、法務が同じ boundary を見て設計する必要がある。

## 設計チェックリスト: AgentCoreを使う前に決めること

AgentCore を採用するかどうかに関係なく、AI SaaS チームは次の項目を先に決めるべきだ。

1. `tenant_id`、`user_id`、`tier`、`role` の正本
2. Memory の namespace 設計
3. Retrieval 用 metadata と storage prefix
4. Tool / Gateway の tenant context 伝播方式
5. Plan ごとの model selection と tool allowlist
6. Tenant ごとの rate limit と quota
7. Per-tenant usage log の schema
8. Cost allocation tag と billing ledger の接続
9. Audit trace に残す項目
10. 例外時にどの tenant の処理を止めるか

このリストを後回しにすると、PoC は速くても本番移行で詰まる。特に危険なのは、tenant boundary を DB と UI だけで考えることだ。エージェントは UI 外の tool execution が本体なので、Gateway と Observability に tenant context を載せる設計が必要になる。

## 日本市場での適用シナリオ

日本で早く効くのは、B2B SaaS が既存プロダクトに AI アシスタントを組み込むケースだ。CRM、採用管理、法務管理、経費精算、カスタマーサポート、SFA、ナレッジ管理、開発支援などでは、顧客ごとのデータ分離が最初から前提になっている。ここに AI エージェントを足すと、既存の tenant model をそのまま AI 実行基盤へ拡張できるかが問われる。

また、SIer や managed service provider が複数顧客向けに運用 AI を提供するケースにも近い。1つの運用エージェント基盤で複数顧客のログ、チケット、監視、手順書を扱うなら、tenant isolation と per-tenant observability は必須になる。顧客ごとに専用環境を作るか、pool model で共有するかは価格とリスクのバランスになる。

金融、医療、公共、製造のようにデータ規制や契約要件が重い業界では、pool model をそのまま採用する前に、どのデータだけは silo にするかを決める必要がある。今回の AWS 記事は pool model の実装例だが、現実の設計は pool、silo、bridge の組み合わせになる可能性が高い。

## まとめ: AI SaaSの勝負はテナント境界を説明できるかに移る

Bedrock AgentCore のマルチテナント記事は、AI エージェントを SaaS として売る時の設計論点をかなり具体的に示している。Runtime、Identity、Gateway、Memory、Policy、Observability、Projects、CloudWatch を組み合わせ、共有インフラ上で tenant isolation、tier differentiation、cost attribution を成立させる構成だ。

日本企業が見るべきポイントは、AgentCore の採用可否だけではない。自社の AI 機能が、どの tenant の誰として動き、どのデータを読み、どの tool を使い、どの費用を発生させ、どの trace で説明できるのかを答えられるかである。

AI エージェントの本番化は、モデル選定だけでは進まない。テナント境界、料金階層、原価配賦、監査ログを同じ設計図に載せられるチームが、PoC から顧客向け SaaS 機能へ進みやすくなる。

## 出典

- [Shared infrastructure, isolated tenants: Pool model multi-tenancy with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/shared-infrastructure-isolated-tenants-pool-model-multi-tenancy-with-amazon-bedrock-agentcore/) - AWS Machine Learning Blog, 2026-06-23
- [What is Amazon Bedrock AgentCore?](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) - AWS Documentation
- [Explore SaaS Tenant Isolation Strategies in New SaaS Whitepaper](https://aws.amazon.com/blogs/apn/explore-saas-tenant-isolation-strategies-in-new-saas-whitepaper/) - AWS APN Blog
- [Security practices in AWS multi-tenant SaaS environments](https://aws.amazon.com/blogs/security/security-practices-in-aws-multi-tenant-saas-environments/) - AWS Security Blog
