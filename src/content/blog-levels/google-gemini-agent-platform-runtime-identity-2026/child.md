---
article: 'google-gemini-agent-platform-runtime-identity-2026'
level: 'child'
---

Google Cloudは、Gemini Enterprise Agent Platformの重要な機能を広く使えるようにしました。中心になるのは、AIエージェントを長く動かすAgent Runtime、エージェントに専用のIDを持たせるAgent Identity、エージェントを一覧で管理するAgent Registry、出入り口を制御するAgent Gatewayです。

これは「AIチャットが少し便利になった」という話ではありません。AIエージェントが、数日かかる仕事を進めたり、社内システムにアクセスしたり、他のツールを呼び出したりする段階に近づいたという話です。

## 何が変わったのか

Agent Runtimeは、AIエージェントを動かすための実行基盤です。Google Cloudの説明では、複雑なエージェントや長時間の作業を任せられ、最大7日間動かせるとされています。たとえば、営業の見込み客対応、サプライチェーン監視、ITインシデント対応のように、すぐには終わらない仕事が想定されています。

Agent Memory Bankは、AIエージェントが過去の会話や判断を覚えておくための仕組みです。長い仕事では、途中で文脈を失うと同じ質問を繰り返したり、前に決めたことを忘れたりします。Memory Bankは、そうした問題を減らすための部品です。

以前の[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/)では、AIエージェントの動きをTraceやMetricsで見る重要性を扱いました。今回の更新は、そこからさらに進んで、長時間動くエージェントをどう管理するかに近づいています。

## Agent Identityが大事な理由

AIエージェントが社内システムに触るなら、「誰の権限で動いているのか」が重要になります。人間のアカウントをそのまま使うのか、共有のサービスアカウントを使うのか、エージェントごとのIDを使うのかで、監査のしやすさが変わります。

Agent Identityは、エージェントごとに権限を持たせるための仕組みです。Google Cloudは、最小権限や監査に使えるものとして説明しています。これにより、どのエージェントが、どのデータへ、どの権限でアクセスしたのかを追いやすくなります。

日本企業では、AIエージェントを本番業務に入れる前に、エージェントのowner、使えるデータ、使えるツール、停止方法を台帳にする必要があります。これは開発チームだけでなく、情シス、セキュリティ、法務、内部監査にも関係します。

## GatewayとRegistryは何をするのか

Agent Gatewayは、エージェントが外部ツールや他のエージェントとやり取りするときの管理点です。どのアクセスを許すか、どのやり取りを止めるか、危険な入力やデータ漏えいをどう防ぐかを考える場所になります。

Agent Registryは、会社の中にあるAIエージェントを集めて見られる場所です。エージェントが増えると、似たものがいくつも作られたり、誰も管理していない古いエージェントが残ったりします。Registryは、その広がりすぎを防ぐために重要です。

[Gemini Parallel検索](/blog/google-gemini-parallel-web-search-grounding-2026/)のように、AIエージェントが外部情報を使う場面では、根拠やログも必要になります。さらに[Gemini 3.6 Flashのデータレジデンシー](/blog/google-gemini-36-flash-us-data-residency-2026/)で扱ったように、どの地域や条件でデータを扱うかも確認しなければなりません。

## 日本企業が最初に決めること

まず、AIエージェントに任せる仕事の範囲を小さくします。いきなり顧客対応や支払い処理のような重要業務に入れるのではなく、社内調査、一次分類、資料整理、監視通知のように、人間が確認できる仕事から始めるほうが安全です。

次に、エージェントごとのIDと権限を決めます。読み取りだけでよいのか、作成や更新も許すのか、削除は絶対に許さないのかを分けます。人間が承認する場面も決めておきます。

さらに、記憶とログの扱いを決めます。何をMemory Bankに残すのか、Traceに個人情報が入る可能性はあるのか、どれくらい保存するのか、誰が見られるのかを確認します。

## まとめ

Gemini Enterprise Agent Platformの今回の更新は、AIエージェントを本番業務で動かすための土台を広げるものです。Agent Runtimeは長く動かすため、Agent Identityは権限を分けるため、GatewayとRegistryは増えすぎるエージェントを管理するために重要です。

便利さだけを見て導入すると、誰が何をしたのか分からなくなります。日本企業は、AIエージェントを増やす前に、owner、権限、記憶、ログ、費用、停止手順を決めるべきです。

## 出典

- [What's new in Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise-agent-platform) - Google Cloud Blog, 2026-07-30
- [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime) - Google Cloud Documentation
- [Use Agent Identity with Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity) - Google Cloud Documentation
