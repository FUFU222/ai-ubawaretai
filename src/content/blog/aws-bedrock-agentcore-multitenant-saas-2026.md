---
title: 'AgentCoreマルチテナント、SaaS AI基盤の分離設計'
description: 'AgentCoreマルチテナント設計をAWS公式実装から整理。日本のSaaS企業がテナント分離、料金階層、監査ログ、原価配賦をどう設計し、商用AI基盤の価格と権限を固めるべきか解説する。'
pubDate: '2026-06-25'
category: 'news'
tags: ['AWS', 'Amazon Bedrock', 'AgentCore', 'AIエージェント', 'SaaSコスト管理', '企業導入', '開発基盤']
series: 'aws-bedrock-agentcore-2026'
draft: false
---

AWS は **2026年6月23日**、Amazon Bedrock AgentCore を使って pooled deployment model のマルチテナント AI アプリを作る実装記事を公開した。題材は医療 AI アシスタントだが、記事の主眼は医療そのものではない。複数の顧客や事業部を、共有インフラの上で分離しながら、料金階層、データアクセス、コスト追跡、監査をどう成立させるかである。

これは、以前整理した [AWS Bedrock AgentCore の managed harness と CLI](/blog/aws-bedrock-agentcore-harness-cli-2026-04-22/) の続きとして読むと分かりやすい。4月の記事では、エージェントをどう素早く作り、Runtime、Gateway、Memory、Observability へどう載せるかが焦点だった。今回の焦点は、その先の **SaaS 本番運用で、1つのエージェント基盤を複数テナントにどう安全に使わせるか** に移っている。

さらに直近では [Bedrock AgentCore Payments と x402](/blog/aws-bedrock-agentcore-payments-x402-2026/) も扱った。支払いを伴うエージェントを顧客向けに出すなら、テナントごとの利用量、外部 API 利用、請求、監査を切り分けられなければならない。今回のマルチテナント設計は、その前提になる基盤設計だ。[Google Cloud の Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) や [Mistral Workflows](/blog/mistral-workflows-enterprise-ai-2026/) と並べて見ても、各社の競争軸は「賢いモデル」から「エージェントを安全に本番運用する制御面」へ移っている。

## 事実: AWSはAgentCoreでテナント分離を実装例として示した

AWS の公式ブログは、マルチテナント AI アプリに必要な要件として、顧客間の tenant isolation、サービス階層ごとの機能差、テナント単位の cost tracking、観測性を挙げている。実装例では医療機関向けアシスタントを題材にし、Basic と Premium の 2 つの tier を持たせ、各 tier の中で clinic や hospital を tenant として扱う。

重要なのは、AWS が「テナントごとに全部を分ける」silo model ではなく、共有インフラを使う pool isolation model を中心にしていることだ。公式記事では、共通の実行基盤を使いながら、scope identifier、access policy、data partitioning によって論理分離する構成が示されている。これは SaaS 企業にとって現実的な設計である。すべての顧客へ専用基盤を用意すれば分離は説明しやすいが、原価と運用負荷が重くなる。共有基盤に寄せるほど、分離をコードレビューや運用注意だけに頼らない仕組みが必要になる。

AgentCore のドキュメント上でも、Runtime、Memory、Gateway、Identity、Observability、Policy、Registry などは、エージェントを安全に本番運用するための部品として整理されている。今回の記事は、それらを SaaS の tenant boundary に結びつける実装例だと読める。

## 事実: tier、tenant、userの階層で分離している

AWS の構成は、Tier、Tenant、User の 3 層を明示している。Basic tier では小規模クリニック向けに比較的軽いモデルと文書検索を中心にし、Premium tier では病院や専門施設向けに高機能モデルや追加ツールを使う。さらに各 tenant の中で user を分け、会話履歴やメモリが別ユーザーへ漏れないようにする。

この階層化は、日本の SaaS 企業にもそのまま当てはまりやすい。たとえば、Basic、Business、Enterprise のプランを持ち、同じ AI アシスタントを複数企業へ提供する場合、プランごとに使えるモデル、ツール、上限、SLA、監査ログの粒度を変えたい。さらに企業内では部門や担当者ごとに権限が違う。AI エージェントが社内文書、顧客データ、外部 API を横断するほど、この階層を曖昧にできない。

AWS の例では、Cognito の JWT claim に tier、clinic_id、role などを持たせ、その tenant context を API Gateway、Lambda、AgentCore Runtime、Gateway、Memory、Knowledge Base へ渡している。ここでのポイントは、tenant_id を単なるアプリケーション内の変数にしないことだ。後段の IAM、Gateway、Memory、検索フィルタ、ログに同じ文脈を流し、分離を複数レイヤーで確認できるようにしている。

## 事実: メモリとツール呼び出しはアプリコードだけに頼らない

エージェント基盤で怖いのは、回答文の取り違えだけではない。Memory に残った会話、Knowledge Base の検索結果、Gateway 経由のツール呼び出し、外部 API の結果が、別テナントへ混ざることが最も大きなリスクになる。

AWS の実装例では、AgentCore Memory の namespace を tier、clinic_id、user_id を含む形で組み立て、さらに STS session tags と ABAC を使って tenant scope を絞る。つまり「このコードパスなら filter しているはず」という信頼だけでなく、取得する一時認証情報の側にも tenant boundary を持たせる。Knowledge Base でも metadata filter に clinic_id を使い、S3 では tier と tenant の prefix を分ける。

Gateway 側でも tenant context を header として伝播し、Lambda target に渡す設計が示されている。さらに AgentCore Policy では Cedar policy を使い、たとえば Basic tier は特定ツールを営業時間内に制限し、Premium tier は条件を変える、といった tier differentiation を gateway layer で実行する。これは機能フラグというより、エージェントが呼べる行動そのものを tier と tenant の文脈で制御する話である。

## 事実: コスト配賦はBedrock Projectsと構造化ログを組み合わせる

今回の記事で実務的に大きいのは、cost attribution まで含めている点だ。AWS の例では、tier ごとに Bedrock Project を分け、CostCenter、Tier、Application などの cost allocation tag を付ける。これにより、モデル利用費を Cost Explorer で tier 単位に見る導線ができる。

ただし、Bedrock Projects だけで個別 tenant まで細かく分ける設計には限界がある。公式記事では、per-clinic の粒度については、agent invocation 後に token usage を structured JSON として CloudWatch に記録し、clinic_id、tier、model_id、input_tokens、output_tokens などを集計する例が示されている。つまり、請求に近い粒度はログとメトリクスで補う構成だ。

これは日本企業の導入判断にかなり効く。SaaS の AI 機能は、顧客ごとの原価が読めないと価格設計ができない。特に LLM は、同じ月額プランでも一部の tenant が大量に使うと粗利が崩れやすい。テナント単位の token、tool call、Gateway 呼び出し、外部 API 利用を追えるようにしておかないと、販売後に「便利だが儲からない」機能になりやすい。

## 考察: 日本のSaaS企業はまず分離境界を表にすべき

ここからは分析だ。

日本の SaaS 企業が AgentCore の今回の記事から学ぶべきことは、AWS の構成をそのままコピーすることではない。最初にやるべきなのは、自社サービスの tenant boundary を表にすることだ。どのデータが tenant ごとに分かれるのか、どのツールが plan ごとに許可されるのか、どのログを顧客へ提示できるのか、どの原価を請求単位に反映するのかを明文化する。

AI エージェントは、従来の Web アプリより境界が見えにくい。画面上は1つのチャットでも、裏側では Memory、検索、外部 API、コード実行、支払い、通知、CRM 更新が動く。だからこそ、tenant_id を DB の where 条件に入れるだけでは足りない。Identity、Gateway、Memory、Knowledge Base、Observability、Billing のすべてに tenant context を流す設計が必要になる。

特に日本市場では、Enterprise 顧客ほど「他社データと混ざらないか」「ログを監査できるか」「部署別に費用を見られるか」を確認する。AI 機能の精度が高くても、この説明が弱いと導入は止まりやすい。逆に、分離と配賦を説明できれば、AI 機能を単なる追加オプションではなく、上位プランの価値として売りやすくなる。

## 実装前に決める5項目

第一に、tenant context の正本を決める。Cognito、Entra ID、Auth0、既存 SSO、社内 tenant table のどれを起点にするかを決め、tier、tenant_id、user_id、role をどこから取得するかを固定する。

第二に、分離するリソースを分類する。Memory、Knowledge Base、S3 prefix、DynamoDB partition key、Gateway target、外部 API credential、payment limit、evaluation dataset を、tenant 単位、tier 単位、共通基盤のどれに置くかを分ける。

第三に、tier differentiation を仕様化する。Basic と Premium の違いを、モデルの違いだけでなく、使える tool、rate limit、営業時間制限、最大 token、外部 API 利用、監査ログ保持期間として定義する。

第四に、cost attribution を設計する。クラウド請求で見える単位と、アプリログで補う単位を分ける。Bedrock Projects、CloudWatch Logs、構造化メトリクス、課金 DB をどう接続するかを先に決める。

第五に、監査と顧客説明を決める。どの agent が、誰の代理で、どの tenant data を読み、どの tool を呼び、どのモデルを使い、どの出力を返したかを後から説明できる必要がある。

## まとめ: AgentCoreの本番論点はSaaS設計そのものになった

今回の AgentCore マルチテナント記事は、AI エージェントのニュースというより、SaaS 基盤設計のニュースである。共有インフラを使って原価を抑えながら、tenant isolation、tier differentiation、cost attribution、observability を同時に満たす必要があるからだ。

日本企業が今見るべきなのは、AgentCore を使うかどうかだけではない。自社の AI 機能が、テナント分離、料金階層、監査ログ、原価配賦を説明できる状態になっているかである。ここを先に設計できるチームほど、AI エージェントを PoC から顧客向け SaaS 機能へ進めやすくなる。

## 出典

- [Shared infrastructure, isolated tenants: Pool model multi-tenancy with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/shared-infrastructure-isolated-tenants-pool-model-multi-tenancy-with-amazon-bedrock-agentcore/) - AWS Machine Learning Blog, 2026-06-23
- [What is Amazon Bedrock AgentCore?](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) - AWS Documentation
- [Explore SaaS Tenant Isolation Strategies in New SaaS Whitepaper](https://aws.amazon.com/blogs/apn/explore-saas-tenant-isolation-strategies-in-new-saas-whitepaper/) - AWS APN Blog
- [Security practices in AWS multi-tenant SaaS environments](https://aws.amazon.com/blogs/security/security-practices-in-aws-multi-tenant-saas-environments/) - AWS Security Blog
