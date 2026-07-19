---
article: 'google-gemini-agent-platform-13-demos-2026'
level: 'child'
---

Google Cloud が、Gemini Enterprise Agent Platform のための 13本の hands-on demos を公開しました。これは「AI agent の作り方サンプルが増えた」というだけではありません。AI agent を作る、動かす、守る、改善する、という流れをまとめて見せた更新です。

これまで AI agent の PoC では、ひとまず動くものを作ることが中心になりがちでした。しかし会社で使うには、それだけでは足りません。誰の権限で社内 API を呼ぶのか、個人情報を外に出さないか、間違った答えをどう見つけるか、人間がどこで確認するかを決める必要があります。

## 何が公開されたのか

今回の 13 demos は、そのために Build、Scale、Govern、Optimize という流れを示しています。Build は ADK を使った agent 作成です。Scale は Agent Runtime や Cloud Run に載せ、長く動く agent や管理画面を扱います。Govern は Agent Gateway、Agent Identity、IAM、Model Armor などで agent の通信と権限を守る層です。Optimize は AutoRaters や評価データを使い、agent の改善を感覚だけで進めないための仕組みです。

## なぜAgents CLIが大事なのか

特に大事なのは Agents CLI です。Google の説明では、Agents CLI は ADK で作るだけでなく、scaffold、evaluation、deployment、observability を助ける CLI と skills package です。Antigravity CLI、Claude Code、Codex のような coding agent に skills を入れて、開発者が editor から agent 作成を進められるようにする考え方です。

日本の会社では、AI agent を「便利なチャットボット」として始めても、本番化の段階で止まりやすいです。社内データを読むならログが必要です。社内システムを操作するなら権限管理が必要です。顧客対応に使うなら人間への引き継ぎも必要です。今回の demos は、その不足しがちな部分を最初から設計に入れるための道具として読めます。

## どこを守るべきか

たとえば Agent Gateway の codelab では、agent が内部 tool や API へアクセスするときに、Agent Identity、IAP、IAM、Model Armor を使って制御する構成が示されています。これは、アプリのコードだけで「この API は呼んでよい」と決めるのではなく、agent そのものに識別子を持たせ、ネットワークと権限の層で守る考え方です。

また、品質評価の flywheel も重要です。AI agent は、1つの例でよく見えても、別の例で静かに間違うことがあります。Google Developers Blog の記事では、評価データを作り、agent を走らせ、採点し、失敗を見て、改善して、もう一度比べる流れが説明されています。修正する AI と採点する仕組みを分ける点も、会社のレビューに近い考え方です。

## 最初にどう試すか

最初に試すなら、すべての demo を一気にやる必要はありません。社内 FAQ、経費申請の一次チェック、営業資料の分類など、人間が確認できる低リスクな業務を1つ選びます。そのうえで、ADK で作る、Agent Runtime へ載せる、Agent Gateway で権限を絞る、評価ケースで改善を測る、という順に小さく確認するのが現実的です。

今回の更新で分かるのは、AI agent の競争が「賢いモデルを選ぶ」だけではなくなっていることです。これからは、作った agent をどう動かし、どう守り、どう測り、どう改善するかが重要になります。Gemini Agent Platform の 13 demos は、その本番導入のチェックリストとして使えます。

## 出典

- [13 hands-on demos to build on Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/13-demos-on-gemini-enterprise-agent-platform) - Google Cloud Blog, 2026-07-18
- [Getting Started - agents-cli](https://google.github.io/agents-cli/guide/getting-started/) - Google
- [Governing agentic workloads with Agent Gateway on Gemini Enterprise Agent Platform](https://codelabs.developers.google.com/cloudnet-agent-gateway) - Google Codelabs
- [Driving the Agent Quality Flywheel from Your Coding Agent](https://developers.googleblog.com/driving-the-agent-quality-flywheel-from-your-coding-agent/) - Google Developers Blog, 2026-06-30
