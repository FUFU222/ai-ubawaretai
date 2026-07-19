---
article: 'google-gemini-agent-platform-13-demos-2026'
level: 'expert'
---

Google Cloud の 2026年7月18日発表は、Gemini Enterprise Agent Platform を実務で評価しているチームにとって、かなり重要な材料です。13本の hands-on demos は、個別機能の紹介というより、agent を本番へ持ち込むための lifecycle map として読めます。

この文脈は、既存の [Gemini API Managed Agentsで変わる開発基盤](/blog/google-gemini-api-managed-agents-2026/) から続いています。Managed Agents は、agent 実行環境を API や platform 側へ寄せる話でした。今回の 13 demos は、その実行環境の周辺にある scaffold、deploy、gateway、evaluation、observability、human-in-the-loop をどう組み合わせるかを示します。さらに [Conductor Plugin、Antigravityで仕様駆動AI開発へ](/blog/google-conductor-plugin-antigravity-sdd-2026/) のような仕様駆動の作業状態管理ともつながります。

[Google ADKとA2A、混在エージェント連携の実務](/blog/google-adk-a2a-cross-language-agents-2026/) では、Python、Go、Java などの agent を A2A で接続する論点を扱いました。今回の demos には、その A2A だけでなく、MCP、Agent Runtime、Agent Gateway、AutoRaters、Agent Registry が並びます。つまり、Google は agent を「LLM + tools」ではなく、組織の開発・運用・監査対象として見せています。

## 事実: demosは実装、実行、統制、改善の順に並ぶ

Google Cloud の記事は、13本の demos を Build、Scale、Govern、Optimize に分けています。Build では、ADK foundation、event-driven approval agent、MCP tools、Agent-to-UI が扱われます。ここで重要なのは、agent の入力と出力だけでなく、承認、PII redaction、prompt-injection defense、compliance analysis、human-in-the-loop、LLM-as-judge evaluation が早い段階から出てくることです。

Scale では Agent Runtime、長時間実行、checkpoint and resume、Memory Bank、Cloud Run dashboard、OIDC-authenticated Pub/Sub pipeline などが出ます。PoC では、1回の prompt にうまく返るかだけを見がちです。しかし実務 agent は、数日かかる承認、途中で人間入力を待つ workflow、container restart、session resume、manager dashboard を必要とします。Google の demos は、そこを agent architecture の一部として扱っています。

Govern では secure agentic coding と Agent Gateway が示されます。secure agentic coding は、TDD、STRIDE threat model、Semgrep pre-commit hook、PreToolUse gate を組み合わせ、危険な secret や tool action を実装前後で捕まえる設計です。Agent Gateway は runtime governance で、agent が内部 tool や external API へ出るときの identity、authorization、content screening を扱います。

Optimize では、agent quality flywheel が中心です。評価データを作り、agent を走らせ、AutoRaters または custom metrics で採点し、failure cluster を見て、改善をかけ、baseline と比較します。これは [Google Jules評価、プロアクティブAI開発の現実解](/blog/google-jules-proactive-coding-agent-eval-2026/) で見た agent 評価の考え方を、一般の enterprise agent へ広げるものです。

## 事実: Agents CLIはplatform knowledgeをcoding agentへ入れる

Agents CLI docs は、Agents CLI を「Google Cloud 上で AI agents を build、evaluate、deploy するための CLI と skills package」として説明しています。ADK が agent 本体を作る軸だとすると、Agents CLI は scaffold、evaluation、deployment、observability を周辺から支えます。さらに、Antigravity CLI、Claude Code、Codex などの coding agent に skills を入れる利用形態が示されています。

ここは実務上の変化です。従来は、agent framework の SDK、Cloud Run や Vertex AI の deploy 設定、evaluation service、observability、security policy が別々に学ばれがちでした。Agents CLI は、coding agent がその platform knowledge を参照しながら project scaffold や eval を進める形へ寄せています。

ただし、これは人間の設計責任を消すものではありません。Agents CLI が scaffold できるとしても、どの業務を対象にするか、どの tool を許すか、どの data を扱わせるか、どの metric で成功と見るかは企業側の判断です。Google Developers Blog の flywheel 記事でも、評価 skill は autonomous ではなく、人間が承認する前提だと整理されています。

## 分析: PoCから本番に進めない理由を潰す構成

日本企業の AI agent 導入では、PoC の demo は作れても、次の段階で止まりやすいです。原因はだいたい4つあります。第一に、tool permission が曖昧です。第二に、社内データや個人情報の出入りを監査できません。第三に、agent の品質を prompt の感触でしか判断していません。第四に、承認待ち、失敗時、再開時の workflow が設計されていません。

今回の 13 demos は、この4つを明確に分解しています。tool permission は Agent Gateway、Agent Identity、IAP、IAM で扱います。データ出入りは Model Armor、prompt-injection defense、PII redaction、Cloud Trace、Logging、BigQuery Agent Analytics で扱います。品質は AutoRaters、custom metrics、User Simulator、failure analysis で扱います。workflow は human-in-the-loop、Pub/Sub、Cloud Run dashboard、checkpoint and resume で扱います。

ここで、[Gemini Enterprise Parallel Web Search grounding](/blog/google-gemini-parallel-web-search-grounding-2026/) との接続も重要です。Parallel Web Search のように外部情報を grounding provider として使うほど、agent は社外情報、社内 tool、user request を混ぜて判断します。そこに prompt injection、古い情報、権限外 API、個人情報が混ざると、agent の便利さはそのまま事故面になります。Agent Gateway と evaluation flywheel は、その事故面を platform と process の両方で抑える層です。

## Agent Gatewayはnetwork controlではなく責任境界で見る

Agent Gateway codelab は、Agent Gateway を Agent Governance suite の networking component として説明しています。client-to-agent の ingress と agent-to-anywhere の egress を制御し、Agent Registry、Agent Identity、IAP、IAM、Model Armor と連携します。mortgage underwriting agent の例では、agent が document management、corporate email、income verification のような内部 tool へ安全にアクセスする構成が示されています。

日本企業がここで見るべきなのは、network component という言葉だけではありません。Agent Gateway は、agent の責任境界を platform 側に置くための考え方です。アプリ開発者が tool call の前に個別実装で権限チェックを書く構成では、agent が増えるほど統制がばらつきます。agent identity を持たせ、呼び出し先 tool ごとに IAM policy を置き、content screening を gateway で行うほうが、監査と標準化に向きます。

もちろん、すべての agent に最初から重い gateway 構成を入れる必要はありません。公開情報の要約や低リスク FAQ なら、軽い構成から始められます。しかし顧客情報、財務、個人情報、ソースコード、契約書、内部メール、審査判断に触れる agent では、後付けの権限管理は危険です。PoC の時点で、将来 gateway を通す前提で tool interface を分けておくべきです。

## 評価flywheelはAI agentの変更管理である

Google Developers Blog の quality flywheel 記事は、agent の改善を vibe check で終わらせないことを主題にしています。評価データは OTel traces、手作りケース、合成シナリオから作れます。採点は adaptive AutoRaters や custom metrics で行い、失敗が多ければ Automatic Loss Analysis で cluster を見る。修正後は baseline と比較します。

特に重要なのは、optimizer と evaluator を分離する考え方です。修正案を出す coding agent や automated optimizer が、そのまま自分の成果を採点すると、metric を満たす見かけの改善へ寄りやすい。独立した評価サービスで採点し、人間が結果を読む構成にすることで、改善の説明可能性が上がります。

これは日本企業の変更管理と相性がよいです。AI agent の prompt、tool、policy、model、retrieval source を変えることは、業務ロジック変更に近い。ならば、変更前後の評価、失敗ケース、承認者、rollback 条件、影響範囲を残すべきです。評価 flywheel は、AI agent のための軽量な change management として見ると導入しやすい。

## 導入ロードマップ: 最初の90日で見るべきこと

最初の30日は、業務選定と評価設計です。対象は、低リスクだが効果が測れる業務に絞ります。問い合わせ分類、経費申請の一次確認、営業資料の要約、ログ調査の補助など、人間が最終判断できるものがよい。ここで、成功 metric、失敗 metric、禁止 action、human review line、ログ保存方針を決めます。

次の30日は、ADK と Agents CLI で実装し、Agent Runtime または Cloud Run 上で動かします。local demo だけで終わらせず、session、trace、logging、費用、再開、承認待ち画面を確認します。この段階で、手元では動くが本番では誰も監視できない agent を排除します。

最後の30日は、governance と evaluation を足します。Agent Gateway を使うか、まずは軽量な IAM / service account 分離で始めるかを決めます。Model Armor や prompt-injection defense をどこに入れるかも決めます。評価 flywheel では、最低でも10から30件の業務ケースを用意し、変更前後で pass rate、重大失敗、human escalation rate を比べます。

この90日で本番投入できなくても構いません。むしろ、agent の価値と危険箇所が同じ地図上に出ることが重要です。導入判断は「この agent は賢そうか」ではなく、「この agent はどの権限で、どのデータに触れ、どの失敗を検知でき、誰が止められるか」で行うべきです。

## まとめ: Googleの狙いはagent platformの標準作業化

Gemini Agent Platform の 13 demos は、Google が agent 開発を platform lifecycle として標準化しようとしていることを示しています。ADK で作る、Agents CLI で scaffold/eval/deploy する、Agent Runtime で実行する、Agent Gateway で守る、AutoRaters で改善する。この一連の流れを、coding agent の作業面へ持ち込むのが今回の見どころです。

日本企業にとっての判断軸は、Gemini が他モデルより賢いかだけではありません。agent を本番へ入れるとき、platform が build、scale、govern、optimize をどこまでつないでくれるかです。PoC の速度だけを見ると、後から権限、ログ、評価を足すことになります。今回の demos は、その順番を逆にし、本番条件を最初から設計へ入れるための材料として使うべきです。

## 出典

- [13 hands-on demos to build on Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/13-demos-on-gemini-enterprise-agent-platform) - Google Cloud Blog, 2026-07-18
- [Getting Started - agents-cli](https://google.github.io/agents-cli/guide/getting-started/) - Google
- [Governing agentic workloads with Agent Gateway on Gemini Enterprise Agent Platform](https://codelabs.developers.google.com/cloudnet-agent-gateway) - Google Codelabs
- [Driving the Agent Quality Flywheel from Your Coding Agent](https://developers.googleblog.com/driving-the-agent-quality-flywheel-from-your-coding-agent/) - Google Developers Blog, 2026-06-30
