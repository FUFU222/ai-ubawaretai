---
article: 'google-gemini-agent-platform-runtime-identity-2026'
level: 'expert'
---

Google CloudのGemini Enterprise Agent Platform更新は、agentic AIをアプリケーション運用の対象へ押し出すものだ。Agent Runtime、Agent Memory Bank、Agent Identity、Agent Gateway、Agent Registry、Agent Evaluation、Agent Observabilityが同じ発表に並んでいるため、個別機能の追加として読むより、実行、権限、記憶、制御、登録、評価、観測を一つの運用面に寄せる動きとして読むほうが実務に合う。

Google Cloud Blogは2026年7月30日、Agent Platformの主要機能を広く利用可能にすると説明した。Agent Runtimeは複雑な長時間エージェントを最大7日間動かす用途、Agent Memory Bankは構造化schemaで会話文脈や過去の判断を維持する用途、Agent Identityはエージェントに最小権限のIDを持たせる用途、Agent Gatewayはpolicy enforcementと保護の用途、Agent Registryはagent sprawlの可視化と再利用の用途として示されている。

このサイトでは、[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/)でTraceとMetrics、[Gemini Parallel検索](/blog/google-gemini-parallel-web-search-grounding-2026/)でWeb groundingのデータフロー、[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/)で評価ループを扱った。今回のRuntimeとIdentityは、それらを実行環境と権限境界へ接続する話である。

## Runtimeはコンテナ基盤ではなくagent lifecycleで見る

Agent Runtimeのドキュメントは、これをfully-managedなruntimeとして説明している。エージェントのデプロイ、管理、スケールをGoogle Cloud側のサービスとして扱い、開発者はインフラよりエージェントロジックへ集中できる。VPC Service Controls、認証、IAM、function calling、Agent2Agent open protocol、ADKやLangGraphなどのフレームワーク対応も含まれる。

ここで重要なのは、Runtimeを「エージェント用のCloud Run」のように単純化しないことだ。AIエージェントは、通常のWeb APIと違って、複数stepの計画、tool呼び出し、再試行、human-in-the-loop、状態保持、評価、traceを持つ。デプロイできるだけでは本番運用にならない。Runtimeが提供する価値は、agent lifecycleをクラウド運用の単位へ寄せる点にある。

最大7日間の実行は、設計上の前提を変える。短いチャットなら、失敗してもユーザーが再入力すれば済む場合が多い。しかし数日走るagentでは、途中失敗、外部APIのrate limit、権限変更、credential失効、ユーザーの追加指示、対象データの更新、下流システムの障害が起こる。checkpoint、resume、cancel、escalation、timeout、budget capを最初から設計しなければならない。

日本企業の業務に置き換えると、IT障害調査、問い合わせ分類、サプライヤー監視、申請書類の整合性確認、営業リスト更新、規制変更モニタリングなどが候補になる。ただし、長時間動かせることと、長時間任せてよいことは別である。重要な変更や顧客影響がある処理では、途中承認と停止条件を入れる必要がある。

## Memory Bankは便利な記憶ではなく保持ポリシーである

Agent Memory Bankは、低レイテンシのpersonalizationや長時間タスクの継続性を目的にしている。構造化schemaに基づき、ユーザーの好み、過去の判断、アカウント履歴などを維持し、次の実行に引き継ぐ設計だと説明されている。

これはUX上は有用だが、企業運用ではretention policyで見るべきだ。何を記憶してよいのか、誰の同意で記憶するのか、どの業務目的に限るのか、保存期間は何日か、ユーザー退職時や部署異動時にどう消すのか、評価データへ二次利用してよいのかを決める必要がある。

特に日本では、個人情報、顧客情報、医療・金融・人事関連情報、委託先情報が会話文脈に混ざる。Memory Bankを単なる「作業効率化の記憶」として広く許すと、後から削除や説明が難しくなる。schemaを設計するときは、保存してよいfieldと保存してはいけないfieldを明示し、自由文を丸ごと記憶する運用は避けたい。

MemoryはEvaluationとも関係する。記憶があるagentとないagentでは、同じテストプロンプトでも挙動が変わる。回帰評価では、memory stateを固定するのか、空にするのか、本番代表状態を使うのかを分ける必要がある。評価失敗がpromptの問題なのか、古いmemoryの問題なのかを切り分けられないと改善できない。

## Agent Identityで認可の主語を変える

Agent Identityは今回の更新の中で最も本番運用に効く。Google Cloudは、エージェントにネイティブなIAM型を与え、最小権限、Runtimeへのアクセス紐づけ、監査、credential lifecycle管理を支えるものとして説明している。関連ドキュメントでは、Agent Runtime上のエージェントにidentityを使い、Google Cloud APIやthird-party serviceへの認証・認可を扱う流れが示されている。

従来の自動化では、サービスアカウントを作り、必要そうな権限を付け、バッチやbotがそれを使うことが多かった。AIエージェントでは、このやり方がさらに危険になる。agentは人間の依頼を解釈し、toolを選び、場合によっては別agentへ委譲し、途中で判断を変える。広いサービスアカウントを与えると、意図しないtool pathでも権限が通ってしまう。

Agent Identityで変えるべきなのは、認可の主語である。「この部署のサービスアカウントならアクセス可」ではなく、「このエージェントは、このownerのもとで、この用途に限り、このresourceへ、このactionだけ可能」と表現する。たとえば、サプライヤー監視agentはBigQueryの取引先マスタをreadできるがupdateできない。問い合わせ分類agentはチケットにlabelを付けられるがcloseできない。障害調査agentはログを読めるが本番設定を書き換えられない。

ここは[Gemini 3.6 Flashのデータレジデンシー](/blog/google-gemini-36-flash-us-data-residency-2026/)で扱った地域統制とも接続する。モデルやデータの地域条件を満たしていても、agent identityが広すぎれば権限事故は起こる。逆にidentityを絞っても、ログが残らず評価もなければ説明責任は弱い。

## Gatewayはpolicy plane、Registryはinventory plane

Agent Gatewayは、agent ecosystemの中央制御点として見ると分かりやすい。Google Cloudの発表では、IAM conditionsや自然言語ルールによる細かなアクセス制御、Model Armorによるprompt injection、tool poisoning、data leakageへの保護が説明されている。実装上は、agentがtoolや外部システムへ出る前のpolicy planeとして設計する。

Gatewayで見るべきpolicyは少なくとも5つある。第一に、どのagentがどのtoolを呼べるか。第二に、どのdata classificationを外部toolへ渡せるか。第三に、どのoperationは人間承認が必要か。第四に、どのprompt injectionやtool poisoning signalで止めるか。第五に、どのegress先を許すかである。

Agent Registryはinventory planeである。組織内のAIエージェント、サーバー、接続を集約し、再利用と管理を助ける。現場がagentを作りやすくなると、PoC、shadow automation、退職者が作ったagent、古いAPI keyを持つagent、同じ業務を重複処理するagentが増える。Registryがないと、AI活用が広がるほど統制が弱くなる。

日本企業での最低ルールは、Registry未登録agentを本番データに接続しないことだ。登録項目には、owner、承認者、利用部署、利用目的、データ分類、Agent Identity、Gateway経路、接続tool、評価セット、監視dashboard、費用code、更新期限、停止手順を含める。owner不明、更新期限切れ、評価未実施、Gateway未経由のagentは停止候補にする。

## ObservabilityとEvaluationを分離する

Agent Observabilityは、reasoning、tool utilization、execution performanceをtraceやdashboardで見るための機能として説明されている。Agent Evaluationは、本番中の性能低下やbehavioral driftを検知し、pre-built metric、custom Python、LLM-as-a-judge、adaptive rubricなどで評価する機能である。

この2つは混同しやすい。Observabilityは事実を記録する。Evaluationは良否を判定する。Traceにすべてのstepが残っていても、agentが間違った業務判断をしていれば品質は悪い。逆に、評価点が高くても、traceが不十分なら事故時に説明できない。

実務では、TraceをEvidence substrateとして扱い、Evaluationはその上に載せる。たとえば、user request、memory read/write、tool selection、Google Cloud API call、third-party API call、Gateway decision、human approval、final action、error handlingをtraceに残す。そのtraceをもとに、task success、policy compliance、tool use quality、latency、cost、human intervention rateを評価する。

[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/)で整理したように、評価者と修正者を分けることも重要だ。agent prompt、tool schema、Gateway policy、memory schemaを変更するPRが、同じPRで評価rubricを緩められると意味がない。固定回帰セット、本番sample、探索用合成scenarioを分け、重大事故caseはzero toleranceにする。

## 本番導入の参照アーキテクチャ

最初の層は、agent definitionである。目的、対象業務、禁止業務、入力、出力、tool、承認点、failure modeを定義する。ここに「ユーザーが便利なら何でもする」というagentを置かない。

次の層は、identity and authorizationである。Agent Identityを発行し、resourceごとの権限を最小化する。人間の代理で動く場合は、user delegationとagent privilegeを混同しない。人間が見られるデータをagentがすべて見られるわけではなく、agent用途に必要な範囲だけを許す。

3つ目は、runtime and stateである。Agent Runtimeへdeployし、長時間実行のtimeout、budget、checkpoint、retry、cancel、resumeを設定する。Memory Bankを使う場合は、schema、retention、masking、delete flowを定義する。

4つ目は、gateway and tool governanceである。Agent Gatewayを通して、tool call、external API、MCP server、SaaS connector、database actionを制御する。Model Armorやsemantic policyは補助であり、最終的にはIAM、network、application-level approvalを組み合わせる。

5つ目は、registry and lifecycleである。Agent Registryに登録し、owner、version、approved use、last review、deprecation dateを管理する。agentは作って終わりではない。model、tool、API、契約、法規制、組織構造が変われば、agentの権限と評価も更新が必要になる。

6つ目は、evaluation and observabilityである。Traceは常時、Evaluationは変更時と定期実行で回す。重大failureはdeploy gateにし、通常品質は改善指標にする。costやlatencyはSREだけでなく、部門配賦や事業効果の説明にも使う。

## 日本企業での30日導入手順

最初の1週は、対象業務を一つに絞る。社内問い合わせ分類、IT障害一次調査、規制ニュースの監視、社内文書の要約など、人間が最終確認できるものがよい。顧客に直接返信する、支払いを実行する、人事評価を変更する、契約条件を書き換えるような業務は初期対象から外す。

2週目は、Agent Identityと権限を設計する。読み取り、作成、更新、削除、外部送信を分ける。不要な書き込み権限を付けない。もし作成や更新が必要なら、人間承認を入れ、操作前後の差分をtraceに残す。

3週目は、Runtime、Memory、Gateway、Registryをつなぐ。Runtimeにはtimeout、budget、retry、cancelを入れる。Memoryは保存fieldを限定する。Gatewayには禁止tool、禁止data、承認必須operationを置く。Registryにはownerと更新期限を入れる。

4週目は、評価と監視を回す。固定caseを20件ほど作り、成功条件、禁止条件、重大failureを定義する。Traceでtool pathを確認し、Evaluationで回答や操作の妥当性を見る。合格しても本番は限定公開にし、数週間はwarning gateで運用する。

## まとめ

Gemini Enterprise Agent PlatformのAgent RuntimeとAgent Identity更新は、エージェントを本番業務へ接続するための基盤が具体化していることを示す。Runtimeは長時間実行、Memory Bankは状態保持、Identityは最小権限、Gatewayはpolicy enforcement、Registryはinventory、EvaluationとObservabilityは継続改善を担う。

日本企業は、この更新を「Google Cloudでエージェントが作りやすくなった」とだけ読まないほうがよい。実務上の主語は、作成ではなく運用である。エージェントが数日走り、社内外のsystemに触れ、記憶を持ち、評価されながら改善されるなら、ID、権限、記憶、Gateway、Registry、Trace、評価、費用、停止手順を同時に設計する必要がある。

今回の記事は`google-gemini-enterprise-agent-platform-2026` seriesの中でも統制の中核に近い。既存のseriesTitle記事が基礎記事として機能しているため、自動でpillar指定はしないが、Runtime、Identity、Gateway、Registryを一枚の導入チェックリストへ整理できる点で、今後のpillar候補として人間レビューに回す価値がある。

## 出典

- [What's new in Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise-agent-platform) - Google Cloud Blog, 2026-07-30
- [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime) - Google Cloud Documentation, last updated 2026-07-29
- [Use Agent Identity with Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity) - Google Cloud Documentation
- [Agents overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents) - Google Cloud Documentation
