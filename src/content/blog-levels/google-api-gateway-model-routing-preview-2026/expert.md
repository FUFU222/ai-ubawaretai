---
article: 'google-api-gateway-model-routing-preview-2026'
level: 'expert'
---

Google Cloud API Gatewayのmodel routing Public Previewは、AI platform teamにとって「OpenAI互換APIの便利機能」よりも、egress governanceの設計部品として見る価値がある。OpenAI互換のprompt requestをAPI Gatewayで受け、OpenAPI 3.x extensionに定義したrouterに従って、Vertex AI Model Garden上のGemini、Anthropic Claude、OpenAI OSS-GPT familyへdispatchする。

重要なのは、routing対象がGoogle Cloudのmanaged surfaceに寄る点だ。企業がAIアプリを増やすと、client library、provider endpoint、secret、retry、fallback、token metering、audit logがアプリごとに散る。model routingは、その一部をAPI Gatewayへ集約し、platform teamがreview可能なOpenAPI specとして扱えるようにする。

この更新は、[Gemini Agent PlatformのRuntimeとIdentity](/blog/google-gemini-agent-platform-runtime-identity-2026/) で見たAgent Identityや長時間実行、[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で見たTrace / Metrics、[Google Agent評価GA](/blog/google-agent-platform-eval-ga-online-monitor-2026/) で見たonline monitorと同じ線上にある。エージェントが本番業務へ出るほど、どのモデルへ、どの経路で、どの権限で到達したかが監査論点になる。

## Architecture: routerはOpenAPI specに閉じる

model routingでは、`x-google-api-management` extensionの下にbackendとrouterを定義する。backendはVertex AI Model Garden上のendpointを指し、routerはdefault modelとrulesを持つ。operation pathには`x-google-model-router`を付け、incoming requestの`model` fieldを見てrouteする。

この設計は、application codeからrouting logicを外へ出す効果がある。アプリはOpenAI互換のrequestをGatewayへ送り、Gatewayがruleを評価する。model alias、default、target model、deadline、backend addressがOpenAPI specにまとまるため、diff review、approval、rollback、change calendarに載せやすい。

ただし、仕様上の自由度は限定される。単一router内のbackendは同じhostnameとschemeを共有しなければならない。実務上は、globalまたは単一regionalの`aiplatform.googleapis.com` endpointを前提に設計することになる。Google Cloud外のprovider endpointを混ぜる一般的なmulti-provider proxyとしては扱えない。

OpenAI互換backendの注意点もある。documentationは、OpenAI-compatible routeでrulesの`model` selectorがdestination bodyへforwardされるため、aliasのような短縮名ではなく、Vertex AI側で有効なpublisher model identifierを使う必要があると説明している。platform側が見やすいaliasを欲しがる場合でも、実際のrouting valueと監査表示名を分けて設計したほうがよい。

## Governance: default model変更を軽く扱わない

model routingで最も事故が起きやすいのはdefault modelだ。client requestが明示的にruleへmatchしない場合、Gatewayはdefault modelへ送る。これは便利だが、defaultを変更すると、アプリ側が意図していないrequestの品質、費用、latency、データ処理条件が変わる。

日本企業のplatform teamは、default modelの変更をfeature flagのように扱わないほうがよい。変更前後で、対象path、想定client、traffic量、data classification、費用影響、fallback時の挙動、評価結果を記録する。特に顧客対応、法務、金融、医療、公共向け業務では、同じpromptでもmodel変更により表現、根拠提示、tool decisionが変わる。

ここで [Gemini EnterpriseとAsana連携](/blog/google-gemini-enterprise-asana-flash-admin-2026/) のような業務SaaS操作を考えると、論点はさらに重くなる。エージェントがタスクを作成・更新する場合、最終回答の自然さだけでなく、tool selectionや承認判断が重要になる。model routingが変われば、同じagent codeでもtool decisionの傾向が変わる可能性がある。

したがって、router changeにはevalを紐づけるべきだ。固定回帰セット、代表的な業務session、禁止操作、PII抑制、tool argument schema、latency、costをbefore-afterで測る。平均点だけでなく、zero tolerance条件を置く。これはmodel routingの機能ではなく、導入企業側の運用規律である。

## Security: VPC SC非対応とpublic endpoint前提を読む

Public Preview時点で、model routing gatewayはVPC Service Controlsをサポートしない。Private Service Connect endpoint構成も制約に含まれる。backend addressはpublic regionalまたはglobal endpointを指す前提で、configuration validationはdomain allowlistを強制しないため、trusted Vertex AI endpointだけを使うよう利用者側が確認する必要がある。

この点は、日本企業のクラウド統制に直撃する。VPC SC perimeter、閉域接続、egress control、Private Service Connectを前提にAI基盤を設計している場合、model routingを本番の機密trafficへ直接入れる判断は慎重にすべきだ。Public Previewの検証対象は、非機密データ、開発支援、評価環境、model comparison、社内sandboxなどに絞るのが現実的である。

IAMも重要だ。documentationは、API Gateway Admin roleに加え、Gatewayに使うservice accountへVertex AI User roleが必要だと説明している。つまり、Gatewayは単なるHTTP proxyではなく、Vertex AI model endpointへアクセスするprincipalを持つ。service accountの権限、keyless運用、rotation、audit log、削除手順を台帳に入れる必要がある。

requestの`model` field validationもclient任せにしないほうがよい。Public Previewでは、`model` fieldがないrequestを本来rejectすべきところ誤って処理する既知の注意点がある。client SDK、schema validation、API contract test、Gateway前段の検査で、必須fieldと許可model値を確認する。意図しないdefault fallbackは、品質事故だけでなく費用事故にもなる。

## Observability: Gateway logだけでは足りない前提で設計する

API Gatewayは標準のrequest logを出す。`httpRequest.requestUrl`、status、latency、api、apiConfig、apiMethod、backendRequest.hostname、responseDetailsなどを確認できる。model-router-specificな失敗カテゴリもログに現れる。

しかし、Public Preview時点ではper-request attribution of selected target modelが十分ではない。documentationは、同じrouter内のbackendが同一hostnameを共有するため、`backendRequest.hostname`だけでは選ばれたmodelを識別できないと説明している。workaroundとして、単一ruleのtest endpointを作る、response bodyを確認する、といった方法が示されている。

本番監査を考えるなら、アプリ側ログとGatewayログを結合できる設計が必要だ。request ID、tenant、user group、data classification、intended model、router path、client version、agent version、tool set、evaluation cohortをclientまたはagent runtime側で残す。Gateway logはtrafficとerrorを見る材料、アプリ側ログは意図と文脈を見る材料として分ける。

これは [Google Agent評価GA](/blog/google-agent-platform-eval-ga-online-monitor-2026/) で扱ったonline monitorにも関係する。評価やdrift alertを設計するには、どのmodelで生成されたtraceなのかを知る必要がある。Gatewayだけで分からないなら、trace metadataへmodel intentとrouting resultを残す補助設計が要る。

## Migration: 既存proxyを全廃する前に境界を決める

既にLiteLLMや独自proxyを運用している企業は、model routingを見てすぐ全面移行する必要はない。むしろ、要件を分けるべきだ。

Google Cloud内のVertex AI Model Gardenで完結するrouting、OpenAI互換clientを使う新規AI app、Gemini Enterprise Agent Platformのegressの一部、評価環境のmodel comparisonは、API Gateway model routingと相性がよい。Google Cloud外のproviderを広く束ねる、tenant別に複雑なpolicy engineを持つ、private endpointやVPC SCを必須にする、per-target-model billingを独自に深く出す、といった要件は、既存proxyや別のgatewayを残す理由になる。

移行計画では、まずread-onlyまたは非破壊のAI workflowを対象にする。request volume、latency、error、fallback、cost、response qualityを測り、同じprompt setで既存proxyと比較する。次に、router specのreview processを整える。最後に、agentや業務アプリの一部を段階的に切り替える。

切り戻しも設計する。API Gatewayは既存Gatewayに後からmodel routingを有効化・無効化できないため、router付きGatewayと従来経路の両方を一時的に持つことになる。DNS、client base URL、secret、quota、monitoring dashboard、runbookを二重化し、戻す条件を先に決める。

## 日本のAI基盤チーム向けチェックリスト

1つ目は、use case matrixだ。用途、data classification、許可model、default model、禁止model、region、logging、retention、人間承認、費用上限を表にする。model routingのruleは、このmatrixを実装へ落としたものとして扱う。

2つ目は、OpenAPI spec governanceだ。`x-google-api-management`と`x-google-model-router`を含むspecをGit管理し、platform、security、application ownerのreviewを通す。default model、backend address、deadline、path、authenticationの変更はrelease noteを残す。

3つ目は、identityとleast privilegeだ。Gateway service accountに必要なVertex AI権限だけを付ける。agent側のIdentity、Agent Gateway、API Gateway、Vertex AI model accessを台帳化し、誰が何を呼べるのかを説明できるようにする。

4つ目は、observability metadataだ。Gateway log、application log、agent trace、evaluation resultをrequest IDで結合する。Public Previewの制約を踏まえ、selected modelがGateway logだけで分からない場合の補助ログを持つ。

5つ目は、eval gateだ。router変更、default変更、target model追加のたびに、固定回帰セットと高リスクcaseを回す。model routingはインフラ変更に見えるが、AIシステムでは出力品質変更でもある。

## まとめ

Google Cloud API Gateway model routingは、OpenAI互換requestをmanaged gatewayで受け、Vertex AI Model Garden上のGemini、Claude、OpenAI OSS-GPT familyへrouteするためのPublic Previewだ。自前proxyの一部を減らし、OpenAPI spec、Gateway認証、quota、loggingに寄せられる点は、AI基盤チームにとって実務価値がある。

同時に、これは万能proxyではない。host制約、VPC Service Controls非対応、OpenAPI 3.x必須、既存Gatewayへの後付け不可、request-side streamingやGemini Live非対応、per-target-model observabilityの弱さを前提にする必要がある。

日本企業は、model routingを「モデルを切り替える便利機能」ではなく、Agent Identity、Agent Gateway、API Gateway、Vertex AI、evaluation、audit logをつなぐ設計面として扱うべきだ。エージェントが業務データやSaaS操作へ踏み込むほど、モデル選択はアプリ内の小さなif文では済まない。どのrequestがどのrouterを通り、どのmodel候補に到達し、何を根拠に許可されたかを説明できることが、本番AI基盤の条件になる。

## 出典

- [A unified API for AI model routing](https://developers.googleblog.com/a-unified-api-for-ai-model-routing/) - Google Developers Blog, 2026-08-04
- [Overview of model routing](https://docs.cloud.google.com/api-gateway/docs/model-routing-overview) - Google Cloud Documentation, last updated 2026-08-04
- [Configure model routing](https://docs.cloud.google.com/api-gateway/docs/model-routing-configure) - Google Cloud Documentation, last updated 2026-08-04
