---
title: 'Google API Gatewayモデルルーティング、AI基盤統制の実装点'
description: 'Google API GatewayモデルルーティングPublic Previewを整理。OpenAI互換API、Vertex AI、GeminiやClaudeを日本企業のAI基盤統制へどう組み込むか解説する。'
pubDate: '2026-08-04'
category: 'news'
tags: ['Google Cloud', 'Vertex AI', 'API', 'AIエージェント', 'AIガバナンス', '開発基盤', '監査ログ']
series: 'google-gemini-enterprise-agent-platform-2026'
draft: false
---

Google は **2026年8月4日**、Google Cloud API Gateway で **model routing** を Public Preview として提供すると発表した。開発者は OpenAI 互換のprompt requestをAPI Gatewayへ送り、Gateway側でGemini、Anthropic Claude、OpenAI OSS-GPT familyのVertex AI Model Garden上のモデルへ振り分けられる。

これは「GeminiをOpenAI SDKから呼べる」だけの話ではない。AIアプリやAIエージェントの出口を、個別アプリのproxy実装ではなく、Google Cloudのmanaged gatewayへ寄せる更新である。Googleは、単独のrate limitingやtoken trackingにも使える一方、Gemini Enterprise Agent Platformと組み合わせ、agent egressをAgent Gatewayで統制した後にAPI Gatewayでモデル選択を処理する構成を例示している。

このサイトでは、[Gemini Agent PlatformのRuntimeとIdentity](/blog/google-gemini-agent-platform-runtime-identity-2026/) でエージェントの実行IDと権限を扱い、[Google Agent評価GA](/blog/google-agent-platform-eval-ga-online-monitor-2026/) でCI評価と本番監視を整理した。今回のmodel routingは、その前段にある「どのモデルへ、どの条件で、誰が呼び出したか」をgatewayでそろえる話として読むべきだ。

## 事実: OpenAI互換リクエストをGatewayで受ける

Google Developers Blogによると、API Gatewayのmodel routingは、OpenAI互換のrequestを受け、payloadをin-flightで変換し、Vertex AI上の対象モデルへ送る。開発者はアプリ側でproviderごとのendpointをhardcodeしたり、LiteLLMのような自前proxyを運用したりせず、Gatewayに対して標準的なPOST requestを送る構成を取れる。

routing logicはOpenAPI 3.x specificationに書く。`x-google-api-management` extensionの中でbackendを定義し、routerごとにdefault modelとrulesを設定する。たとえば、あるpathではGeminiをdefaultにし、payloadの`model`がClaudeを指定したときだけClaudeへ送る。別のpathではOpenAI OSS-GPTをdefaultにし、Gemini指定時だけGeminiへ送る、といった設計ができる。

公式blogが示したポイントは、router内のbackendが同じhostを共有する必要があることだ。つまり、任意の外部LLM endpointを横断する汎用proxyではなく、Vertex AI Model Garden上の同じhostへ向けたmanaged routingとして理解するのが正確である。これは自由度を狭める一方、企業側から見ると、モデル呼び出しの出口をGoogle Cloud上の管理面へ寄せやすい。

日本の開発チームにとっての利点は、既存のOpenAI互換clientを完全に書き換えずに、モデル選択とgateway統制を分けられる点だ。アプリは`model`名を指定し、Gatewayはその値を見てルールに従う。複数の事業部やプロダクトがそれぞれproxyを持つより、platform teamが共通のOpenAPI spec、認証、quota、logging、routing ruleを管理するほうが、運用事故を減らしやすい。

## 事実: Public Previewの制約は本番設計に効く

Google Cloud documentationは、model routingを「managed traffic management layer」と説明している。対象はOpenAI互換prompt requestで、Vertex AI Model GardenのMaaS modelへroutingする。use caseとしては、model selection、OpenAPI specification authoring、Gateway deployment、prompt routingが挙げられている。

ただし、Public Previewの制約は軽くない。routingはpayload内の`model` tagまたはnameだけを基準にする。OpenAPI 3.xが必須で、OpenAPI 2.0 / Swaggerは使えない。既存Gatewayに後からmodel routingを有効化することも、model routing付きGatewayから無効化することもできず、切り替え時は新しいAPI configとGateway instanceを作る必要がある。

さらに、VPC Service Controlsには対応しない。Private Service Connect endpoint構成も制約に入る。request-side streaming、gRPC、WebSockets、Gemini Liveも対象外で、text-based prompt requestを前提にする。response streamingは扱えるが、リアルタイム音声や双方向streamingのgatewayとして見るべきではない。

この制約は、日本企業の導入判断で重要だ。金融、公共、医療、製造の一部では、VPC Service Controlsやprivate connectivityを前提にAI基盤を設計している場合がある。その環境へPublic Previewのmodel routingをそのまま本番中核に置くのは難しい。まずは非機密の開発支援、社内PoC、評価基盤、低リスクのagent egressから検証するほうが現実的である。

もう一つの注意点は、documentationが「`model` fieldがない場合に、Public Previewでは本来rejectすべきrequestを誤って処理する」と明記していることだ。これは小さな仕様メモではない。client側で必ず`model` fieldを入れるvalidationを行い、Gateway前段でもschema validationやtestを置く必要がある。

## 分析: 自前proxy削減と統制強化は別物

ここからは分析だ。

model routingの価値は、自前proxyを減らせることにある。AIアプリが増えると、チームごとにprovider切り替え、API key管理、retry、timeout、logging、token集計、fallbackを実装しがちだ。最初は便利でも、半年後には誰がどのモデルへどれだけ送っているか、どのproxyが古い設定を持っているか、障害時にどこでfailoverしたかを追いにくくなる。

API Gatewayにroutingを寄せると、少なくとも入口、認証、quota、routing rule、Gateway logを共通化できる。platform teamはOpenAPI specをreviewし、model aliasやdefault modelの変更をchange managementに乗せられる。これは [Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で扱ったobservabilityの前提にもなる。呼び出し経路が散っていれば、後からtraceやmetricを集めても説明しづらい。

一方で、Gatewayが入れば統制が完成するわけではない。どのユースケースでGeminiをdefaultにするのか、どの条件でClaudeを許すのか、OpenAI OSS-GPTをどのデータ分類で使えるのか、fallback時に応答品質やデータ処理条件が変わるのかは、利用企業側が決める。model routingは交通整理の部品であり、AI利用ポリシーそのものではない。

特に日本企業では、契約、データ所在地、監査、費用配賦、障害時の説明責任が絡む。ある部門は低コストmodelで十分でも、法務レビューや障害調査では高性能modelを使いたい場合がある。逆に、個人情報や取引先情報を含むrequestでは、使えるモデルやregionを限定したい。この判断をpayloadの`model`名だけに任せるのではなく、アプリ側のpolicy、Gateway設定、IAM、ログ監査を組み合わせる必要がある。

## 日本企業の導入チェック

最初に確認するのは、対象requestの分類だ。社内検索、コード補助、問い合わせ分類、営業資料作成、顧客対応、金融判断では、許容できるモデル、ログ保存、再試行、fallbackの意味が違う。model routingを導入する前に、用途ごとのデータ分類と利用可能モデルを表にする。

次に、OpenAPI specをAI基盤の変更管理対象にする。routing rule、default model、backend address、deadline、path、authentication methodをGitで管理し、reviewを必須にする。特にdefault modelの変更は、アプリ側の明示指定がないrequestに影響する。feature flagのように軽く扱うと、品質や費用が急に変わる。

3つ目は、既存proxyとの責任分界だ。すでにLiteLLMや独自gatewayを持つ企業は、すべてを一度に置き換える必要はない。まず、Vertex AI Model Garden内で完結するrouting、OpenAI互換clientを使う新規アプリ、評価環境、agent egressの一部から始める。複数providerの横断billingや、Google Cloud外のendpointを含む要件があるなら、既存proxyとの併用を設計する。

4つ目は、監査ログの粒度だ。API Gatewayのrequest logだけでは、Public Preview時点でtarget modelごとの細かいrouting decisionを十分に見られない場面がある。documentationは、backend hostnameだけでは同じhost内の選択modelを識別できないため、test endpointの分離やresponse bodyの確認をworkaroundとして示している。したがって、本番監査では、client側でrequest ID、intended model、use case、tenant、data classificationを記録する補助ログが必要になる。

最後に、seriesで見てきたAgent Platformの台帳と結びつける。エージェントがどのAgent Identityで動き、どのAgent Gatewayを通り、どのAPI Gateway routerへ出て、どのmodel候補を使えるのかを一枚で説明できるようにする。[Gemini EnterpriseとAsana連携](/blog/google-gemini-enterprise-asana-flash-admin-2026/) のように業務SaaS操作が絡む用途では、最終応答よりも、どのモデルがどのtool decisionに影響したかが監査論点になる。

## まとめ

Google Cloud API Gatewayのmodel routingは、AI基盤の出口管理をmanaged gatewayへ寄せる更新だ。OpenAI互換requestを受け、OpenAPI 3.xで定義したrouting ruleに従い、Vertex AI Model Garden上のGemini、Claude、OpenAI OSS-GPT familyへ送れる。自前proxyを減らし、rate limiting、token tracking、認証、Gateway logを共通化する足場になる。

ただし、Public Previewの制約は明確だ。VPC Service Controls非対応、host制約、OpenAPI 3.x必須、既存Gatewayへの後付け不可、request-side streamingやGemini Live非対応、`model` field validationの注意点がある。日本企業は、いきなり全社の本番AI trafficを置くのではなく、低リスク用途、評価環境、Vertex AI内で閉じるroutingから始めるのがよい。

今回の更新は、Gemini Enterprise Agent Platformのseriesで扱ってきたRuntime、Identity、Evaluation、Observabilityに、model egressの管理面を足すものだ。AIエージェントを本番業務へ入れるなら、賢いモデルを選ぶだけでなく、どのrequestが、どのGatewayを通り、どのモデルへ届いたかを説明できる必要がある。model routingは、その説明責任を基盤側へ寄せるための新しい選択肢である。

## 出典

- [A unified API for AI model routing](https://developers.googleblog.com/a-unified-api-for-ai-model-routing/) - Google Developers Blog, 2026-08-04
- [Overview of model routing](https://docs.cloud.google.com/api-gateway/docs/model-routing-overview) - Google Cloud Documentation, last updated 2026-08-04
- [Configure model routing](https://docs.cloud.google.com/api-gateway/docs/model-routing-configure) - Google Cloud Documentation, last updated 2026-08-04
