---
article: 'github-vss-api-copilot-license-management-2026'
level: 'expert'
---

GitHubが2026年7月16日に追加したVisual Studio Subscription(VSS)管理REST APIは、Copilotそのものの機能更新ではない。だが、GitHub Enterprise CloudとGitHub CopilotをMicrosoft契約の上で運用している企業にとっては、かなり重要な管理面の更新である。VSS UPNとGitHub handleの照合を、UI手作業からAPI管理へ移せるからだ。

直近のGitHub Copilot運用は、AI Credits、cost center、usage metrics、Code Quality、security reviewのような「使った後の統制」に話題が寄っていた。たとえば[Copilot部門予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/)では1人あたりのAI Credits上限を、[AI使用レポートの請求列変更](/blog/github-ai-usage-report-fields-2026/)では請求データの読み替えを扱った。今回のVSS APIは、それらの前にある「そもそも誰がGitHub Enterpriseを使う権利を持つのか」を整える機能だ。

日本企業では、Visual Studio Subscription with GitHub Enterprise、GitHub Enterprise Cloud、GitHub Copilot Business/Enterprise、Microsoft Entra ID、SCIM、購買台帳が別々の担当者に分かれやすい。ID照合が曖昧なままCopilotの利用量だけを見ても、費用説明は安定しない。

## 事実: 追加されたAPIの役割

GitHub Changelogは、GitHub Enterprise Cloud管理者がVSS assignmentをprogrammaticに管理できるようになったと説明している。追加された操作は、Enterprise内のVSS割り当て一覧を返すGET、VSS UPNをGitHub handleへ対応付けるPUT、手動matchを削除するDELETEである。

GETは、現在の割り当てとGitHub userへのmatch状態を棚卸しするために使う。PUTは、UPN-to-GitHub-handle crosswalkをもとにbulk matchingするために使う。DELETEは、誤った手動matchを取り消し、正しい再照合へ戻すために使う。

GitHubが明示している重要なユースケースは、VSS UPN形式がSCIM identitiesと一致しない組織だ。この場合、自動照合が効かず、従来はUIで個別に直す必要があった。APIが入ることで、IdP、VSS、GitHub Enterpriseの差分を定期的に比較し、照合候補をレビューしてから一括反映できる。

ここで注意すべきなのは、PUTを単純な「名寄せスクリプト」にしないことだ。GitHub Docsは、GitHub accountとVisual Studio account for a single licenseは同じ人物に属する必要があると説明している。つまり、照合はコスト削減だけではなく、契約準拠と本人性確認の作業である。

## VSSとGitHub Enterpriseの照合モデル

GitHub Docsによると、Visual Studio subscriptions with GitHub Enterpriseは、Microsoft Enterprise Agreementのもとで提供される組み合わせだ。Visual Studio subscriberは、GitHub Enterprise部分を使うために、GitHub Enterprise配下のorganizationへ参加する必要がある。

GitHub Enterprise Cloudでは、GitHub personal accountのverified emailがVisual Studio accountのUPNと一致すると、Visual Studio subscriberがVSSライセンスを自動消費する。Enterprise Managed Usersの場合は、Visual Studio UPNがSCIM `userName` attribute、またはGitHub accountに紐づくlinked identityのemail addressと一致することが重要になる。

この仕組みは、個人アカウント中心のGitHub Enterprise Cloudでは便利だが、日本企業のID設計とは衝突しやすい。社内UPNが`employee-id@example.co.jp`で、GitHubのverified emailが`firstname.lastname@example.com`の場合、自動照合は外れる。海外拠点や買収会社、旧姓利用、出向者、委託先アカウントが混ざると、さらに複雑になる。

Enterprise Managed Usersを使う組織でも、SCIMのsource attributeが本当にVSS UPNと一致しているとは限らない。Entra IDでUPNをログイン名として使い、mail属性を通知用に使い、GitHub linked identityには別属性が入っている構成もあり得る。今回のAPIは、こうした差分を棚卸しし、手動matchを管理する現実的な逃げ道になる。

## Copilot運用での位置づけ

今回のAPIは、Copilot license APIではない。にもかかわらずCopilot運用で重要なのは、GitHub Enterprise license、Copilot seat、AI Credits usage、cost centerが月次説明で結びつくからである。

まず、VSS照合はGitHub Enterprise licenseの消費を左右する。VSSに含まれる権利を持つ人が正しく照合されていなければ、Enterprise licenseの見え方がずれる。利用者が退職・異動しているのに照合だけが残れば、契約上の権利と現実の利用者がずれる。これはCopilot以前の問題だが、Copilot導入後はAI利用者台帳としても表面化する。

次に、Copilot seatの割り当て説明に影響する。Copilotを誰へ配るかは、GitHub Enterprise memberであること、organizationに所属していること、部門やcost centerが分かることと結びつく。VSS照合が整理されていないと、Copilot seatの付与・解除、AI Creditsの部門配賦、利用者教育の対象者がずれやすい。

さらに、AI Creditsの分析にも間接的に効く。[Copilot使用指標の補正](/blog/github-copilot-usage-metrics-accuracy-2026/)で扱ったように、usage metricsやbilling reportsは列定義や集計精度が変わる。そうした変化を読む前に、対象ユーザーのライセンス台帳が安定していなければ、増減の理由を機能利用なのか、ID照合の修正なのか切り分けられない。

## 推奨するデータフロー

第一の入力は、Visual Studio Subscription管理ポータルからのVSS割り当て一覧である。少なくともUPN、subscription状態、割り当て日、失効または削除予定日を持つ。ここにはGitHub handleを無理に混ぜず、Microsoft側の契約・権利台帳として扱う。

第二の入力は、GitHub Enterprise CloudのVSS APIから取得するassignment一覧である。ここでGitHub userへmatch済みか、手動matchか、自動matchか、未照合かを分類する。APIのGET結果をそのまま更新対象にせず、まず差分レポートにする。

第三の入力は、IdP/SCIMの属性である。UPN、mail、preferred username、employee ID、department code、termination stateを、必要最小限に絞って照合する。GitHubへ渡す対応表には、過剰な個人情報を入れない。照合に必要なのはVSS UPN、GitHub handle、根拠、承認者、期限で十分なことが多い。

第四の入力は、GitHub Enterprise memberとCopilot seatの台帳である。VSS照合だけを正しくしても、organization invitation未承諾やCopilot seat未付与なら、利用者は期待通りに使えない。逆に、VSS照合が消えた人にCopilot seatが残っていれば、退職・異動・契約変更の処理漏れとして検知できる。

第五の入力は、billing/usage系のデータである。[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)で整理したように、AI Creditsは利用量管理であり、VSS照合は権利管理である。月次レポートでは同じ部署コードで突き合わせるが、指標の意味は分ける。

## API実行時の統制設計

API実行は、GET、plan、approve、apply、verifyの5段階に分けるべきだ。

GETでは、現状のVSS assignmentとmatch状態を取得する。ここでは何も変更しない。出力を日付付きで保管し、前回との差分を作る。

planでは、VSS UPNとGitHub handleの対応表を読み込み、PUT候補とDELETE候補を生成する。自動match済みのユーザーを上書きしようとしていないか、退職者に追加matchしようとしていないか、1つのUPNが複数handleへ向いていないか、1つのhandleが複数UPNへ向いていないかを検査する。

approveでは、人間が差分を見る。承認者はGitHub Enterprise ownerだけでは足りない場合がある。Microsoft 365/Entra ID管理者、Visual Studio subscription admin、情シス、購買または経理が関わることもある。特にDELETEは、誤照合を直す操作である一方、正しい照合を外すリスクもある。

applyでは、承認済み差分だけをPUT/DELETEする。GitHub Actionsや社内CIで実行し、tokenは短命または管理されたsecretとして扱う。個人端末からの実行は、ログ、再現性、退職時の権限剥奪で問題が出やすい。

verifyでは、再度GETして期待状態と一致するか確認する。さらにLicensing画面、Visual Studio側の管理ポータル、Copilot seat一覧、AI usage reportへの波及を翌営業日または請求締め前に確認する。

## 例外管理と監査ログ

手動matchは例外である。APIで簡単に作れるようになったからこそ、例外理由を残す必要がある。よくある理由は、UPNとGitHub verified emailが違う、旧ドメインを利用している、買収会社のIdP移行中、個人アカウントからEMUへの移行前、出向者や委託先の扱いが契約上特殊、などだ。

例外には期限を付ける。期限なしの手動matchは、半年後に誰も理由を説明できなくなる。特にCopilotやGitHub Enterpriseの費用説明では、「この人はなぜVSSではなくEnterprise license消費なのか」「なぜ手動でVSSに結びつけたのか」を聞かれる。

監査ログでは、少なくとも変更前、変更後、UPN、GitHub handle、操作種別、承認者、実行者、実行日時、根拠チケットを残す。GitHub APIのレスポンスだけでは、社内承認の文脈が残らない。逆に、社内チケットだけでは、実際にGitHub側へ反映されたかが分からない。両方を紐づける必要がある。

## 30日導入計画

1週目は棚卸しに使う。VSS割り当て、GitHub Enterprise member、organization membership、Copilot seat、退職者一覧を集める。ここでいきなりPUT/DELETEしない。未照合の件数、自動matchの件数、手動matchの件数、招待未承諾の件数を把握する。

2週目は対応表とルールを作る。UPNとGitHub handleの対応表を作り、どの条件なら自動照合に戻すのか、どの条件なら手動matchを許すのか、どの条件なら削除するのかを決める。旧姓・別名・海外拠点・委託先の扱いを明文化する。

3週目はdry runを実装する。GET結果と対応表を比較し、追加、更新、削除、要確認に分類する。要確認を自動実行しないことが重要だ。1つのUPNが複数handleへ向く、退職者にmatchが残る、GitHub handleが存在しない、organizationに未参加などは人間確認に回す。

4週目は少数でapplyする。全社一括ではなく、1つのdivisionや1つのorganizationで試す。反映後に、Licensing画面、GitHub Enterprise license report、Copilot seat、AI usage reportに不自然な変化がないかを見る。問題がなければ、月次締め前の定期処理へ広げる。

## やってはいけない運用

VSS UPNとGitHub handleのCSVを、購買や人事の名簿から機械的に作って即PUTする運用は避けるべきだ。氏名一致は本人性の根拠として弱い。メールアドレスも、転送、別名、旧ドメイン、共有アドレスが混ざると危ない。最終的には、GitHub accountが誰のものか、契約上その人がVSS利用者かを確認する必要がある。

DELETEを定期クリーンアップとして乱用するのも危険だ。誤matchを削除することは必要だが、削除後に正しい自動matchへ戻るのか、未照合になるのか、別のEnterprise license消費になるのかを確認しないと、月次のライセンス数が揺れる。

Copilot費用の削減目的だけでVSS照合を変えることも避けるべきだ。VSS照合はGitHub Enterpriseの権利管理であり、AI Credits消費の直接制御ではない。Copilotの使いすぎを止めたいなら、user-level budget、cost center budget、seat管理、利用教育を使う。VSS照合は、その前提となるID・契約台帳を正すために使う。

## まとめ

VSS管理APIの追加は、GitHub Enterprise Cloudの管理者がライセンス照合を定期運用へ組み込むための更新だ。GETで現状を棚卸しし、PUTで承認済みのUPN-to-handle対応を反映し、DELETEで誤った手動matchを戻せる。

日本企業にとっての焦点は、APIそのものよりも、Visual Studio Subscription、GitHub Enterprise license、Copilot seat、AI Credits usageを同じ月次統制で説明できるようにすることだ。Copilotの利用が増えるほど、AI Creditsの細かい予算管理だけでなく、IDとライセンスの土台を自動で点検する仕組みが必要になる。

## 出典

- [REST API endpoints for Visual Studio Subscription management](https://github.blog/changelog/2026-07-16-rest-api-endpoints-for-visual-studio-subscription-management/) - GitHub Changelog, 2026-07-16
- [Setting up Visual Studio subscriptions with GitHub Enterprise](https://docs.github.com/en/enterprise-cloud@latest/billing/how-tos/set-up-payment/set-up-vs-subscription) - GitHub Docs
- [About Visual Studio subscriptions with GitHub Enterprise](https://docs.github.com/en/enterprise-cloud@latest/billing/concepts/enterprise-billing/visual-studio-subs) - GitHub Docs
- [REST API endpoints for enterprise administration](https://docs.github.com/en/enterprise-cloud@latest/rest/enterprise-admin) - GitHub Docs
