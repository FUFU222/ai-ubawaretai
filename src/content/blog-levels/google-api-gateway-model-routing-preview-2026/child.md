---
article: 'google-api-gateway-model-routing-preview-2026'
level: 'child'
---

Google Cloud API Gatewayに、AIモデルを振り分ける **model routing** がPublic Previewとして追加された。アプリはOpenAI互換の形式でrequestを送り、Gateway側がGemini、Claude、OpenAI OSS-GPT familyなど、Vertex AI Model Garden上のモデルへrouteする。

ポイントは、アプリごとにモデル切り替えproxyを作らなくてもよくなる可能性があることだ。AIアプリが増えると、チームごとにendpoint、API key、retry、timeout、ログ、費用集計を実装しがちになる。API Gatewayで共通化できれば、platform teamが入口とrouting ruleをまとめて管理しやすくなる。

## 何が変わるのか

これまで複数モデルを使うアプリでは、コードの中で「この処理はGemini」「この処理はClaude」のように分けたり、LiteLLMなどのproxyを自分たちで運用したりすることが多かった。Googleのmodel routingでは、OpenAPI 3.xのspecにbackendとrouterを書く。requestの`model`名をGatewayが見て、設定されたdefault modelやruleに従って振り分ける。

たとえば、通常はGeminiへ送り、特定の`model`指定だけClaudeへ送る構成ができる。別のpathではOpenAI OSS-GPTをdefaultにし、Gemini指定時だけGeminiへ送ることもできる。アプリ側はOpenAI互換APIの形を保ちやすい。

これは [Gemini Agent PlatformのRuntimeとIdentity](/blog/google-gemini-agent-platform-runtime-identity-2026/) で扱ったエージェント運用とつながる。エージェントがどのIDで動き、どのGatewayを通り、どのモデルへ出ていくかをそろえると、後から説明しやすい。

## ただし制約がある

Public Previewなので、制約は必ず確認したい。model routingはVertex AI Model Garden上のMaaS modelを前提にしており、同じrouterのbackendは同じhostnameを共有する必要がある。どんな外部LLM endpointにも自由に投げられる汎用proxyではない。

OpenAPI 3.xが必須で、OpenAPI 2.0 / Swaggerは対象外だ。既存Gatewayに後からmodel routingを有効化することもできない。切り替えるには新しいAPI configとGateway instanceを作る必要がある。

さらに、VPC Service Controlsには対応しない。request-side streaming、gRPC、WebSockets、Gemini Liveも対象外で、text-based prompt requestが中心になる。機密データや閉域網を前提にした本番基盤では、すぐ中核に置けない場合がある。

## 日本企業はどう試すべきか

最初は低リスクな用途で試すのがよい。社内開発支援、評価環境、非機密の問い合わせ分類、モデル比較用のsandboxなどが候補になる。顧客情報や個人情報を含む業務に入れる前に、requestの分類、利用可能モデル、ログ保存、費用上限を決める。

導入時は、OpenAPI specをGitで管理する。default modelを変えると、明示的なmodel指定がないrequestの挙動が変わる。これは小さな設定変更ではなく、品質、費用、契約条件に影響する変更としてreviewしたほうがよい。

監査ログも考える必要がある。API Gatewayのログだけで、すべてのrouting decisionを細かく説明できるとは限らない。アプリ側でもrequest ID、用途、指定model、tenant、data classificationを残すと、[Google Agent評価GA](/blog/google-agent-platform-eval-ga-online-monitor-2026/) のような評価・監視の仕組みにつなげやすい。

## まとめ

Google API Gateway model routingは、AIアプリのモデル選択をmanaged gatewayへ寄せる機能だ。OpenAI互換requestを保ちながら、Vertex AI上のGemini、Claude、OpenAI OSS-GPT familyへ振り分けられる。

ただし、Public Previewの制約は大きい。VPC Service Controls非対応、host制約、OpenAPI 3.x必須、既存Gatewayへの後付け不可を前提に、まず限定用途で検証するのが現実的だ。日本企業では、便利なrouting機能としてだけでなく、AI基盤の出口管理、費用管理、監査ログ設計の部品として見るべきである。

## 出典

- [A unified API for AI model routing](https://developers.googleblog.com/a-unified-api-for-ai-model-routing/) - Google Developers Blog, 2026-08-04
- [Overview of model routing](https://docs.cloud.google.com/api-gateway/docs/model-routing-overview) - Google Cloud Documentation, last updated 2026-08-04
- [Configure model routing](https://docs.cloud.google.com/api-gateway/docs/model-routing-configure) - Google Cloud Documentation, last updated 2026-08-04
