---
article: 'anthropic-claude-fable-mythos5-governance-2026'
level: 'expert'
---

Anthropic の Claude Fable 5 / Claude Mythos 5 発表は、モデル性能の更新であると同時に、企業が frontier-class model をどう調達し、評価し、制御するかを問う更新である。特に日本企業にとっては、1M token context window、128k max output tokens、always-on adaptive thinking、30日 data retention、Project Glasswing 限定提供、Bedrock / Vertex AI / Microsoft Foundry / Claude Platform on AWS という複数経路が同時に出てくるため、単純な「最新モデル採用」では処理できない。

既存の [Project Glasswing初報](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) と [Project Glasswing拡大](/blog/anthropic-project-glasswing-expansion-critical-infra-2026/) では、Claude Mythos Preview が脆弱性発見を速める一方で、triage、coordinated disclosure、patch engineering、deployment がボトルネックになることを扱った。今回の Mythos 5 はその後継であり、Fable 5 は同じ能力帯の一般提供側の選択肢として読むべきである。

同時に、[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で扱った安全境界の議論も濃くなる。モデルが強くなり、長い文脈を読み、長い出力を返し、複数クラウドで動くほど、入力データ、tool access、拒否挙動、ログ、データ保持、提供経路の説明責任が増える。

## 事実: 提供範囲はFable 5とMythos 5で違う

Anthropic のモデル一覧では、Claude Fable 5 は `claude-fable-5` として、最も能力の高い widely released model と位置づけられている。提供経路は Claude API、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry で、2026年6月9日から一般提供される。

Claude Mythos 5 は `claude-mythos-5` として、Project Glasswing の承認済み顧客向けに限定提供される。これは Mythos Preview の後継であり、一般の開発者がセルフサービスで選べる通常モデルではない。Anthropic、AWS、Google Cloud の account team へ相談する必要があると説明されている。

この差分は、法務・調達・セキュリティの観点では大きい。Fable 5 は一般提供モデルとして、通常のAIアプリケーション、長時間の分析、エージェント作業、コーディング支援に使われる可能性がある。Mythos 5 は、防御的サイバーセキュリティという高リスク・高価値領域に限定して設計される。社内のモデル一覧に両者を同じ「Claude最新モデル」として並べると、利用者が用途境界を誤る。

価格も、単価だけなら input 100万 token あたり10ドル、output 100万 token あたり50ドルと公開されている。しかし enterprise 実装では、単価表よりも workload mix が重要になる。長い context を毎回入れるのか、cached input を使えるのか、出力が長くなるのか、拒否や fallback がどの単価で請求されるのかで、実際の月額は大きく変わる。

## 事実: Adaptive thinkingは唯一の思考モードになる

API release notes は、Fable 5 / Mythos 5 で adaptive thinking が唯一の thinking mode になると説明している。`thinking: {"type": "disabled"}` はサポートされず、manual extended thinking budget と assistant prefill もサポートされない。`thinking.display` は既定で `"omitted"` であり、必要に応じて `"summarized"` を指定して readable summary を受け取る。raw chain of thought は返らない。

これは実装上の breaking assumption になりうる。既存システムが「extended thinking の budget_tokens を固定して費用や品質を制御する」「assistant prefill で出力形式を誘導する」「thinking を無効化して短い応答へ寄せる」という設計をしている場合、Fable 5 / Mythos 5 では同じ制御ができない。代わりに、max_tokens、effort、タスク分割、structured output、評価セットで管理する必要がある。

さらに、Fable 5 / Mythos 5 は Claude Opus 4.7 で導入された tokenizer を使う。同じテキストでも Opus 4.7 より前のモデルに比べておおむね 30% 多く token 化される可能性があるため、既存の prompt budget をそのまま移すのは危険である。日本語、英語、コード、ログ、Markdown、PDF抽出テキストで増え方が同じとは限らないため、代表データで token counting API を使って測るべきだ。

## 事実: Refusalと保持条件が製品仕様に入る

Fable 5 は request 中と response generation 中に safety classifier を走らせる。classifier が拒否した場合、Messages API は `stop_reason: "refusal"` を返す。API release notes では、拒否前に output が生成されない request については課金されないとされ、fallbacks parameter によって別モデルで再実行する beta 機能にも触れている。ただし fallback は Message Batches API ではサポートされず、再実行先モデルの rate で課金される。

また、`stop_details.category` には既存の `cyber` と `bio` に加えて、`reasoning_extraction` が追加される。これは、モデル出力の reverse engineering や duplication に関する Terms of Service 制限に触れる request がブロックされる時に返るカテゴリである。企業アプリケーションは、拒否を単なるエラーとして扱うのではなく、カテゴリごとに user messaging、監査、fallback 可否を分ける必要がある。

データ保持も無視できない。Claude Fable 5 は Claude API で 30日間の data retention を必要とし、zero data retention では使えない。日本企業で顧客コード、個人情報、医療・金融・公共データ、未公開契約、M&A、研究情報を扱う場合、この条件は model selection の前提になる。Fable 5 を使う業務と、ZDR が必要な業務は分離したほうがよい。

## 分析: 評価軸は能力、費用、統制の三つに分ける

ここからは分析だ。

Fable 5 を評価する時、企業は「一番強いモデルだから採用する」という判断を避けるべきである。能力評価、費用評価、統制評価を分ける必要がある。

能力評価では、自社の代表タスクを使う。コーディングなら、実際のリポジトリから抽出した bug fix、migration、テスト追加、設計レビュー、セキュリティレビューを使う。文書業務なら、契約レビュー、稟議書、RFP、監査証跡、顧客問い合わせ分析を使う。研究開発なら、公開論文整理、特許調査、実験計画の論点抽出、データソース確認を使う。

費用評価では、input、cached input、output、thinking 由来の出力、tool call、再試行、拒否、fallback を分ける。Fable 5 は長い context を扱えるため、評価担当者はつい資料を大量投入したくなる。しかし、RAG や検索で十分なタスクまで 1M context 前提にすると、費用構造が悪くなる。長い context は、長い依存関係や複数資料の整合が価値を生むタスクに限定したい。

統制評価では、data retention、provider、region、ログ、アクセス権、model ID、versioning、拒否カテゴリ、fallback を見る。これは [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で扱った「モデル選択が動的になる時の説明責任」と同じ問題である。出力が良くても、どの経路で何が処理されたか説明できなければ、本番導入は難しい。

## 分析: Cloud経路はモデル名ではなく構成として扱う

Fable 5 が複数クラウドで提供されることは、日本企業には大きな利点である。AWS中心の企業は Bedrock や Claude Platform on AWS、Google Cloud 中心の企業は Vertex AI、Microsoft 連携の強い企業は Foundry 経由を検討できる。既存の請求、IAM、監査、閉域接続、ログ基盤と合わせやすい。

しかし、クラウド経路ごとの差は導入後に効く。Bedrock の global endpoint と regional endpoint、Vertex AI の global / multi-region / regional endpoint、Foundry の context window、Anthropic 直接契約の data retention、クラウド側の model lifecycle は同じではない。モデル名が同じでも、構成が違えば監査対象としては別物である。

したがって、社内のAIモデル台帳には「Claude Fable 5」とだけ書くべきではない。少なくとも、model ID、provider、endpoint type、region、data retention、ZDR可否、logging、billing account、fallback policy、approved use cases、禁止データ種別、評価日、評価データセットを入れるべきだ。金融、医療、公共、製造のように監査説明が重い領域では、この粒度が後から効く。

## 分析: Mythos 5はセキュリティ運用の処理能力とセットで見る

Mythos 5 は Project Glasswing 向けの限定モデルである。日本企業がすぐに直接使えるとは限らないが、方向性としては重要である。強いサイバー能力を持つモデルが、攻撃ではなく防御へ限定提供され、重要インフラやOSS保守の脆弱性発見に使われる流れが続いているからだ。

ただし、Mythos 5 を語る時も、モデル性能だけを見てはいけない。Project Glasswing の初期成果で見えたように、発見数が増えるほど、検証、重複排除、修正方針、開示、パッチ展開、顧客通知が詰まる。AIが高・重要度候補を大量に出せるほど、人間側の処理設計が必要になる。

日本企業が防御用途で同種の能力を検討するなら、まず findings pipeline を準備する。チケットの入口、重大度基準、再現手順、owner assignment、修正SLA、例外承認、顧客通知、SBOM連携、委託先との責任分界を決める。AIの発見能力を入れる前に、この処理能力がなければ、脆弱性 backlog を増やすだけになる。

## 実務チェックリスト

第一に、用途を tier 分けする。Tier 1 は Fable 5 を検討する高価値・高複雑タスク、Tier 2 は Opus 4.8 や Sonnet 4.6 で十分な通常タスク、Tier 3 は安価なモデルやルールベース処理でよいタスクに分ける。全タスクを Fable 5 へ寄せない。

第二に、token と費用を代表データで実測する。日本語文書、英語仕様、コード、ログ、PDF抽出テキスト、表データで token count がどう変わるかを見る。output が長くなる業務では、input 単価より output 単価の影響が大きくなる。

第三に、data retention による利用制限を明文化する。Fable 5 を使ってよいデータ、使ってはいけないデータ、匿名化すれば使えるデータを分ける。ZDR 必須の業務では別モデルや別経路を選ぶ。

第四に、拒否と fallback の処理を設計する。`stop_reason: "refusal"` と `stop_details.category` をログに残し、user へどう返すかを決める。fallback を使うなら、再実行先モデル、請求、出力品質、監査ログを明示する。

第五に、提供経路ごとの承認を分ける。Claude API で承認されたから Bedrock でもよい、Vertex で承認されたから Foundry でもよい、とはしない。経路ごとにデータ保持、region、ログ、請求、model lifecycle を確認する。

第六に、Mythos 5 を防御運用の制度設計として追う。直接利用できるかどうかより、重要インフラ、OSS、委託先ソフトウェア、SBOM、脆弱性開示の運用がどう変わるかを見る。これは日本の CSIRT、PSIRT、AppSec、調達部門に関係する。

## まとめ

Claude Fable 5 / Claude Mythos 5 は、Anthropic のモデルラインにおける大きな更新である。Fable 5 は一般提供される最高能力モデルとして、長い文脈、長い出力、高度なエージェント作業に使える。Mythos 5 は Project Glasswing の限定モデルとして、防御的サイバーセキュリティのアクセス設計を進める。

しかし、日本企業の実務では、モデル能力だけでは採用判断にならない。1M context を使う業務の選定、token 増加の実測、adaptive thinking 前提の評価、30日 data retention の許容、クラウド経路ごとの監査、拒否と fallback の処理、Mythos 5 を含む防御側AIの運用設計が必要である。

Fable 5 は「最新で強いモデル」ではなく、「評価再現性と統制を要求する高能力モデル」として扱うべきだ。導入に成功する企業は、ベンチマークの勝敗より先に、自社の評価セット、モデル台帳、データ分類、ログ設計、findings pipeline を整える企業である。

## 出典

- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) - Anthropic, 2026-06-09
- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-06-09
- [Models overview](https://docs.anthropic.com/en/docs/about-claude/models) - Anthropic Docs
- [Migrating from Claude Mythos Preview to Claude Mythos 5](https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4) - Anthropic Docs
- [Claude Fable](https://www.anthropic.com/claude/fable) - Anthropic
