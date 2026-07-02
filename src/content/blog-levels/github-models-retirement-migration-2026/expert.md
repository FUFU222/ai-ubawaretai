---
article: 'github-models-retirement-migration-2026'
level: 'expert'
---

GitHub Modelsの完全終了は、個別モデルのretirementではなく、AI application development surface全体の廃止である。GitHubは2026年7月1日、GitHub Modelsを7月30日に完全終了すると発表した。playground、model catalog、inference API、BYOK endpoint、関連UIが対象で、既存のactive usageを持つ顧客も例外ではない。

移行期間は約4週間で、7月16日と23日にはbrownoutが予定されている。日本企業では、この短い期間にcode dependency、organization secret、prompt asset、evaluation result、data classification、provider contract、billing ownerを同時に移さなければならない。

今回の終了を「Azure AI Foundryへendpointを変えるだけ」と扱うと、GitHub Modelsが担っていたprompt、evaluation、catalog、organization managementの資産が抜け落ちる。一方、すべてをCopilotへ移すと、自社アプリ向けの汎用inference APIと、repository中心のagent workflowを混同する。[Copilot app BYOKのモデル調達と統制](/blog/github-copilot-app-byok-model-providers-2026/)で扱ったmodel routingとも境界を分ける必要がある。

## 事実: 6月の新規停止から7月の全停止へ進んだ

6月16日のGitHub Changelogは、GitHub Modelsのretirementに向けたfirst stepとして、新しいorganizationとenterpriseの利用開始を停止した。この時点では、既存顧客はplayground、API、modelsを継続利用でき、full retirementのtimelineは後日案内するとされていた。

7月1日の更新で、そのtimelineが確定した。7月30日以降、playground、model catalog、inference API、BYOK endpointsは利用できず、関連UIも削除される。new customerだけではなく、existing customer with active usageにも適用される。

7月16日と23日にはbrief brownoutが行われる。GitHubの表現では、brownout中のGitHub Models requestsはtemporarily return errorsとなり、その後restoreされる。発表本文は停止時刻、継続時間、region、error codeを明示していない。そのため、特定error codeだけを監視するより、GitHub Modelsのhost、client名、credential、workflow単位で失敗を追える状態にしておくほうがよい。

GitHub Docsが示すGitHub Modelsは、単なるinference proxyではない。model catalog、free prototyping、prompt optimization、evaluation、prompt repository、organization usage managementなどを含むdeveloper tool suiteとして説明されている。移行対象はruntime dependencyとdevelopment lifecycle assetの両方である。

## 依存関係をruntime、control plane、assetに分ける

移行台帳では、GitHub Modelsへの依存を3層に分けると漏れを減らせる。

第一はruntime dependencyである。production application、internal tool、GitHub Actions、scheduled job、evaluation script、local CLIからinference APIやBYOK endpointを呼ぶ経路が該当する。ここではbase URL、SDK、authentication header、model identifier、request schema、streaming、retry、timeout、fallbackを記録する。

第二はcontrol plane dependencyである。organization policy、access management、model availability、usage reporting、billing owner、secret distribution、network allowlistが該当する。新providerへruntimeを移しても、誰がmodel deploymentを作成し、誰がquotaを変更し、誰が利用ログを見るかが未定なら本番運用は成立しない。

第三はdevelopment assetである。playground prompt、saved prompt、evaluation dataset、scoring rubric、model comparison result、parameter preset、reproduction noteが該当する。これらはAPI call countに表れにくいが、消えるとmodel selectionの根拠と回帰試験が失われる。

repository scanだけで見つかるのは主に第一層だ。GitHub organization secrets、environment secrets、Actions history、network logs、billing record、team wiki、個人検証repositoryも照合する必要がある。とくにplaygroundだけで管理したpromptはgit logに残らないため、利用者への申告依頼とasset exportを別作業にする。

## 分析: GitHubが示す2つの代替はユースケース分岐である

ここからは分析だ。

GitHubは、new and existing projects that need AI model accessにはAzure AI Foundry、AI-powered workflows directly on GitHubにはGitHub Copilotを案内している。これは、代替製品を二つ並べただけではなく、GitHub Modelsに混在していた用途を分解する指示と読むべきだ。

Copilotへ寄せられるのは、developerがrepository、Issue、Pull Request、IDE、CLIの文脈でコードを理解し、変更し、レビューするworkflowである。[CopilotのAutopilot、CLI、worktree運用](/blog/github-copilot-autopilot-vscode-2026/)が示すように、Copilotはcoding agentのexecution surfaceを広げている。既存のGitHub Models利用が「READMEから質問する」「Issueを分類する」「pull requestの下書きを作る」といった開発workflowなら、custom API integrationを維持せずCopilot capabilityへ置き換えられる可能性がある。

一方、自社productのchat、document classification、semantic extraction、customer-facing generation、backend batchからmodelを呼ぶ用途は、Copilotへの移行ではない。モデルAPIを提供するplatformへ移し、application architectureとして再検証する必要がある。Azure AI FoundryはGitHubが明示した候補だが、自動移行、API compatibility、同一model availabilityまで発表が保証しているわけではない。

移行先の選定では、provider brandよりinterface contractを見るべきだ。最低限、model identifier、API version、authentication、content type、stream format、tool calling schema、structured output、context limit、token accounting、rate limit、quota scope、retry-after、error taxonomy、regional availabilityを比較する。

## BYOKという同名機能を混同しない

GitHub ModelsのBYOK endpointは7月30日の終了対象である。一方、GitHub Copilot appにもBYOKがあり、OpenAI、Azure OpenAI、Microsoft Foundry、Anthropic、Ollama、Foundry Local、LM Studio、OpenAI-compatible endpointなどをagent sessionで使える。

名称は同じだが、利用目的とcontrol planeが異なる。GitHub Models BYOKはGitHub Models surface上の機能であり、Copilot app BYOKはCopilot agent sessionのmodel provider設定である。credentialの保存、supported provider、user experience、admin policy、billing route、loggingも同一とは限らない。

移行台帳に`BYOK: yes`というbooleanだけを持たせるのは不十分だ。`product`, `surface`, `endpoint`, `provider`, `credential owner`, `billing account`, `data region`, `admin policy`を分ける。これにより、GitHub ModelsのBYOKだけを終了対象として抽出し、Copilot appやCLIのBYOKまで誤って停止する事故を防げる。

さらに、GitHub ModelsのAPIをCopilot app BYOKへ移すという発想も慎重に扱う必要がある。Copilot appはagentic developer workflowのsurfaceであり、任意のapplication backendが呼ぶ汎用API endpointの代替ではない。人間がCopilot appから作業するユースケースへ再設計できる場合だけ候補になる。

## migration matrixを用途別に作る

実務では、次の4分類でmigration matrixを作ると判断しやすい。

### 1. Developer assistance

コード探索、test作成、Issue分類、PR説明、repository documentationなど、開発者がGitHub上で行う作業である。Copilot Chat、CLI、coding agent、Copilot appへの置換可能性を評価する。API integrationを維持する価値が低ければ、managed workflowへ寄せて保守対象を減らす。

### 2. Product inference

customer-facing application、社内業務application、batch processing、API productなどからmodelを呼ぶ用途である。Azure AI Foundryなどのmodel platformを選び、deployment、identity、network、quota、observabilityを設計する。source codeのendpoint差し替えだけでなく、contract testとload testが必要になる。

### 3. Evaluation and prototyping

playground、model comparison、prompt optimization、evaluation datasetを使う用途である。新providerのevaluation toolへ移すか、promptとdatasetをrepositoryでversion controlし、provider-independentなtest harnessへ移す。終了を機に、再現不能な手作業評価を減らす価値がある。

### 4. Dormant experiment

owner不明、利用者なし、最後の実行が古い、評価基準なし、production pathなしのPoCである。移行せず終了する。credentialを失効し、必要な学びだけdocumentationへ残す。retirement対応で最も避けるべきなのは、使われていないPoCを惰性で別providerへコピーし、管理負債を延命することである。

## provider移行で必ず再試験する項目

API providerを変える場合、同じmodel family名でも同一挙動を期待してはいけない。hosting provider、API version、safety setting、default parameter、tokenizer、system prompt handling、tool implementationが違えば結果は変わる。

まずgolden datasetを用意する。production trafficから個人情報と秘密情報を除去した代表入力、失敗しやすいedge case、長文、tool call、structured output、multilingual inputを含める。日本企業向けには、日本語の敬語、全角半角、住所、法人名、和暦、帳票形式を含むcaseを明示的に入れる。

次に品質、latency、costを同時に測る。accuracyやhuman ratingだけでなく、input/output token、cached token、tool call count、retry、p50/p95 latency、timeout、refusal、JSON parse failureを記録する。品質が同じでもtoken量やretryが増えれば総費用は上がる。

さらにfailure semanticsを確認する。429、5xx、content filtering、context overflow、invalid tool schema、stream interruptionがどのstatusとbodyで返るかを見る。旧clientのretry条件をそのまま使うと、non-retryable errorを連打したり、retryable errorで即時失敗したりする。

最後にdata governanceを確認する。region、retention、training usage、logging、private endpoint、managed identity、key rotation、subprocessor、support accessの条件を、現在のGitHub Models利用時と比較する。動作確認が通っても、data classificationに適合しなければ移行完了ではない。

## brownoutをchaos testとして設計する

7月16日と23日のbrownoutは、外部service dependency failureを実環境で観測する機会になる。ただしGitHubは時刻とerror detailを示していないため、brownout頼みの試験にしてはいけない。自前でもGitHub Models endpointをblockする、credentialを無効化する、timeoutを注入するなどのfailure testを先に行う。

7月16日までに確認するのは、dependency detectionである。旧endpointへのrequestがmonitoringで識別できるか、alertがownerへ届くか、利用者へ意味のあるmessageを返せるか、queueが無限retryしないかを見る。

7月23日までに確認するのは、production cutoverである。primary routeを新providerへ切り替え、旧endpointを意図的に利用不能にしてもservice objectiveを満たすかを見る。fallbackを持つ場合は、どのproviderが使われたかをresponse metadataまたはserver logへ残す。

silent fallbackには注意が必要だ。GitHub Models停止時に別providerへ自動送信すると、品質だけでなくdata boundaryとbilling accountが変わる。fallback先は事前承認し、機密度の高いrequestはfail closed、低リスクrequestだけfail overするなど、data classificationで分けるべきだ。

## secretとnetworkを終了前に閉じる

cutover後もGitHub Models用credentialを残すと、古いbranch、fork、local environment、scheduled workflowから再利用される。migration completeの定義には、旧credentialのrevocationと旧endpointへのnetwork denyを含めたい。

確認対象はrepository secretだけではない。organization secret、environment secret、Codespaces secret、Actions variable、local `.env`、password manager、CI vendor、deployment platform、Kubernetes secret、cloud secret manager、社内wikiの手順書を確認する。

credential名が`GITHUB_TOKEN`のように汎用だと、静的検索で判別しにくい。endpoint host、SDK import、model identifier、HTTP header、workflow logを組み合わせて検索する。今後は`GITHUB_MODELS_*`のようにproductを識別できる命名へ統一し、retirement時に影響を切り出せるようにする。

network側では、旧hostへのegress logをcutover後も監視する。7月30日にrequestが失敗して初めて残存依存を知るのではなく、事前にdenyまたはalert-only ruleを置き、どのworkloadが接続したかをownerへ返す。

## 費用と責任分界を再設計する

Copilotへ寄せる場合、費用はAPI tokenからseatとAI Creditsへ移る可能性がある。[Copilot AI Creditsの課金・予算設計](/blog/github-copilot-ai-credits-billing-budgets-2026/)で扱ったように、共有pool、追加課金、user-level budget、cost centerを確認する必要がある。BYOK providerをCopilot appで使えば、GitHub側と外部provider側へ請求が分かれる場合もある。

Azure AI Foundryなどへ移す場合は、subscription、resource group、deployment、quota、cost center、tagging、budget alertのownerを決める。GitHub Modelsをrepository ownerが小さく試せた状態から、cloud platform teamが管理するresourceへ移すと、責任者と変更手順が変わる。

日本企業では、開発部門、情シス、cloud center of excellence、法務、情報セキュリティ、経理の承認が分かれやすい。移行ticketには、technical owner、data owner、billing owner、security approverを別欄で持たせる。一人のdeveloperがすべてを暗黙に負う形は避ける。

委託開発では、受託側のGitHub organizationでGitHub Modelsを使っていたのか、発注側のcredentialを使っていたのかを確認する。provider変更で契約主体とdata processorが変わるなら、技術移行より先に契約と責任分界の見直しが必要になる。

## 実行スケジュール

7月2日から8日はinventoryとclassificationに使う。全repository、secret、workflow、asset、billing recordを収集し、developer assistance、product inference、evaluation、dormant experimentへ分類する。

7月9日から15日はtarget architectureとcontract testに使う。Copilotへ再設計するworkflowと、model APIへ移すapplicationを分ける。golden dataset、load test、failure injection、data reviewを実施する。

7月16日のbrownoutでは、monitoringと残存dependencyを確認する。見つかったrequestにはownerと期限を割り当てる。

7月17日から22日はproduction cutoverを進める。新providerをprimaryにし、旧GitHub Models routeをfallbackまたはdisabledへ移す。

7月23日のbrownoutでは、旧endpointに依存せず業務が継続するかを確認する。未知の利用が出た場合も、無条件で旧経路へ戻さず、data classificationとbusiness criticalityで判断する。

7月24日から29日はcredential revocation、network closure、runbook更新、billing alert確認に使う。7月30日はmonitoring ownerを置き、残存request、利用者問い合わせ、unexpected costを確認する。

## まとめ

GitHub Modelsの2026年7月30日完全終了は、playground、catalog、inference API、BYOK endpointを含むservice retirementである。既存顧客も対象で、7月16日と23日にbrownoutがある。

移行の中心は、代替model選定ではない。runtime、control plane、development assetを棚卸しし、developer workflowはCopilot、product inferenceはAzure AI Foundryなどのmodel platform、不要なPoCは停止へ分けることである。

日本企業は、API compatibilityに加え、data region、retention、contract、billing、owner、secret、networkを確認する必要がある。7月23日までにproduction cutoverを終え、7月30日より前に旧credentialとendpointを閉じる。そこまで実施して初めて、GitHub Models終了への対応は完了する。

## 出典

- [GitHub Models is being fully retired on July 30, 2026](https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/) - GitHub Changelog, 2026-07-01
- [GitHub Models is no longer available to new customers](https://github.blog/changelog/2026-06-16-github-models-is-no-longer-available-to-new-customers/) - GitHub Changelog, 2026-06-16
- [GitHub Models documentation](https://docs.github.com/en/github-models) - GitHub Docs
