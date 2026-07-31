---
article: 'github-copilot-remote-control-managed-devices-2026'
level: 'expert'
---

GitHubの**2026年7月30日**の更新は、Copilot CLI remote controlを企業導入している組織にとって、運用境界を引き直す材料になる。新しい `remoteControl` enterprise managed setting により、Copilot CLI sessionをhostする端末側で、遠隔操作を無効化するか、無制限に許すか、指定organizationへのSSO承認を条件にするかを配布できるようになった。

これは、remote controlそのもののGAではない。[Copilot CLI遠隔操作GA、承認待ち開発の運用設計](/blog/github-copilot-cli-remote-control-ga-2026/)で扱った通り、remote controlはすでにGitHub.comやGitHub MobileからCLI sessionを監視し、質問やpermission requestに答えられる機能として一般提供されている。今回の焦点は、その機能を端末管理のレイヤーで制御できるようになった点にある。

既存の [GitHub Copilot MDM設定、端末統制を標準化](/blog/github-copilot-mdm-managed-settings-2026/) では、Copilotのmanaged settingsをMDMやfile-based configurationで端末へ配れるようになったことを整理した。さらに [GitHub Copilot app統制、既定有効の管理線](/blog/github-copilot-app-policy-managed-settings-2026/) では、app、CLI、VS Code、cloud agentを同じguardrailで管理する流れを扱った。今回の`remoteControl`は、このmanaged settings体系へremote controlの端末条件を加える更新である。

## Fact: remoteControl controls the host device side

GitHub Changelogは、企業とorganizationが遠隔操作されるCopilot sessionをhostできるデバイスを制限できるようになったと説明している。ここで制御されるのは、remote interfaceを開くスマートフォンやブラウザだけではない。より正確には、Copilot CLI sessionが動いているhost deviceが、遠隔操作を受け付ける条件である。

managed settings referenceでは、`remoteControl`の目的は「このdeviceでhostされたCopilot sessionをremote controlできるか」を制限することだと示されている。これは細かいが重要な区別だ。ユーザーが別端末でhostしたsessionを操作する能力を全体的に止める設定ではなく、その設定が入った端末で始まったsessionの被操作条件を決める。

`mode`は3種類ある。`disabled`は、その端末でhostされたsessionのremote controlを止める。`enabled`は、制限なく許可する。`requireSSO`は、遠隔操作するclientが、`githubDotComOrganizations`で指定したorganizationにSSO authorizationを持つ場合だけ許可する。`requireSSO`ではorganization loginの配列が必須になる。

この仕様は、端末管理の現実に合っている。会社支給PCではremote controlを許したいが、個人端末や共有端末では止めたい。開発基盤チームの検証端末では一時的に緩くしたいが、委託先所有PCでは許したくない。GitHub account policyだけでは表現しにくい差を、host device側のmanaged settingsで表現できる。

## Fact: policy enablement and managed setting restriction are separate

remote controlの導入で誤解しやすいのは、enterprise policyとmanaged settingsの違いである。GitHub Docsのremote control概念ページでは、organizationやenterpriseのseatで使う場合、管理者が"Store local sessions in the Cloud" policyを有効化し、View and controlにする必要があると説明されている。このpolicyが無効または未設定なら、session syncingやremote controlは使えない。

一方、`remoteControl` managed settingは、その大枠のpolicyが許可されている場合に、端末ごとの条件を重ねる。したがって、policyは「remote controlを組織として開くか」を決め、managed settingは「この端末で始まったsessionは、どんなremote clientから操作されてよいか」を決める。

この二層構造は、企業にとって強力だが、運用が曖昧だと問い合わせが増える。たとえば、organization policyはView and controlなのに、端末側の`remoteControl.mode`が`disabled`なら、利用者はremote controlを使えない。`requireSSO`にした場合、SSO authorizationが切れている、別organizationで認証している、GitHub Mobile側のaccountが違う、という理由でも失敗する。

導入時には、利用者向けの説明を「remote controlが有効です」だけで終わらせてはいけない。どの端末で、どのorganizationのSSOを条件に、どのclientから、どの種類のsessionを操作できるのかを明文化する必要がある。ヘルプデスクも、policy、managed settings、SSO、client version、端末sleep、network connectionを切り分けるrunbookを持つべきだ。

## Fact: deployment method decides operational ownership

`remoteControl`はenterprise managed settingsの一部なので、配布方法はserver-managed、MDM-managed、file-basedの3つである。GitHub Docsは、server-managedを多くのenterpriseの既定選択肢とし、review workflowやaudit historyに向くと説明している。MDM-managedは、macOSやWindowsのdevice group targetingが必要なIT部門に向く。file-basedは、server-managedやMDM-managedが使えない環境、container、Codespaces、Linux系の開発環境に向く。

remote controlの端末制御では、配布方法がそのまま運用責任を決める。server-managedを使うなら、GitHub enterprise ownerと`.github-private` repositoryのreviewerが設定変更のownerになる。MDM-managedを使うなら、Intune、Jamf、Group Policyなどを持つ情シスがownerになる。file-basedを使うなら、端末イメージ、container base image、開発環境templateのownerが責任を持つ。

優先順位も重要だ。GitHub Docsのreferenceでは、複数のsettings sourceがある場合、MDM-managed、server-managed、file-based、user-levelの順に優先される。つまり、MDMで`disabled`を配っている端末では、server-managedで`requireSSO`を入れても、端末側のMDM設定が勝つ。逆に、MDMがない端末ではserver-managedやfile-basedが効く。

日本企業で起きやすい失敗は、複数部門が別経路で設定を配り、どれが勝っているか分からなくなることだ。開発基盤チームが`.github-private`を更新し、情シスがMDM profileを更新し、SREがLinux imageにfile-based設定を入れる。これらが同じ端末で競合すると、利用者からは不安定に見える。設定台帳では、値だけでなく配布経路と優先順位を記録する必要がある。

## Analysis: remote approval is a control plane, not a convenience toggle

ここからは分析である。

remote controlを便利機能としてだけ見ると、導入判断を誤る。Copilot CLIのhost端末では、shell command、file operation、tool executionが実行される。remote interfaceは直接マシンへログインするわけではないが、permission requestの承認、質問への回答、plan approval、追加prompt、operation cancelを送れる。これは人間のcontrol planeである。

つまり、remote controlを許すとは、端末の前にいない人間がagent作業の判断を返せるようにすることだ。承認者の文脈は浅くなりやすい。移動中のスマートフォン画面では、terminal全体、差分、secretの有無、対象path、実行中のbranchを見落とす可能性がある。一方で、承認待ち時間を短くできる価値は大きい。ここは生産性と統制の設計問題であり、単純なオンオフではない。

`requireSSO`は、このcontrol planeに最低限の企業境界を入れる。遠隔操作するclientが指定organizationにSSO authorizationを持っていなければ、host端末上のsessionを操作できない。これにより、個人GitHub account、SSOが切れたmobile client、誤ったorganization文脈からの操作を減らせる。

ただし、`requireSSO`は万能ではない。SSO authorizationは、remote側clientの組織認証状態を確認するものであり、remote側デバイス自体がMDM管理されているか、スマートフォンに画面ロックがあるか、通知に機密情報が出ないか、紛失時にremote wipeできるかまでは保証しない。host deviceとremote clientの両方を見なければならない。

## Japanese enterprise model: classify devices before enabling policy

日本企業では、remote control policyを先に全社有効にするより、端末分類を先に作るほうがよい。最低でも、会社支給のMDM管理PC、開発用VDI、管理済みLinux workstation、委託先貸与端末、委託先所有端末、個人所有端末、共有端末、顧客環境端末を分ける。

会社支給のMDM管理PCでは、`remoteControl.mode`を`requireSSO`にするのが標準候補になる。対象organizationは、実際に業務repositoryを持つorganizationに絞る。複数organizationを広く入れると、SSO条件が緩くなる。子会社や委託先との共同organizationを含める場合は、どの契約・どの作業範囲で遠隔承認を許すかを確認する。

開発用VDIや管理済みLinux workstationでは、file-basedまたはimage-levelの設定が現実的な場合がある。ここでは、file ownership、配布手順、base image更新、利用者が上書きできないかを確認する。GitHub Docsはfile-based deploymentについて、ファイルを受け取っていないmachineは制限されないと説明している。したがって、配布漏れの検知が必要になる。

委託先所有端末やBYODでは、初期値は`disabled`が妥当だ。理由は、GitHubのseatやSSOだけでは、端末の物理管理、OS更新、secret storage、local logs、screen capture、malware protection、離任時のwipeを担保できないからだ。どうしても許す場合は、契約、端末要件、MFA、SSO、禁止承認、session logging、pull request reviewをセットで例外承認にする。

共有端末や顧客環境端末も慎重に扱う。remote controlは本人だけが操作できる設計でも、host端末上のsessionにはローカル環境の権限が残る。共有端末でagent sessionをhostし、別デバイスから承認し続ける運用は、責任分界が崩れやすい。少なくともpilot段階では止めるべきだ。

## Governance matrix for remoteControl

実務では、次のようなmatrixを作るとよい。行には端末カテゴリを置く。列には、remote control policy、`remoteControl.mode`、対象organization、配布方式、remote client条件、禁止承認、ログ確認、owner、例外期限を置く。

たとえば、会社支給MacはpolicyをView and control、modeを`requireSSO`、organizationを本番開発org、配布方式をMDM-managed、remote client条件を会社GitHub accountとMFA、禁止承認を本番DBとsecretにする。開発基盤検証端末は、30日だけ`enabled`にし、検証後に`requireSSO`へ戻す。BYODはpolicy対象外または`disabled`にする。

このmatrixは、監査だけでなく障害対応にも使える。remote controlが使えない問い合わせが来たとき、端末カテゴリと配布経路を見れば、仕様通りなのか、SSO切れなのか、MDM反映漏れなのかを切り分けられる。設定をGitHub側と端末側に分けるほど、こうした台帳が必要になる。

また、matrixにはモデルやpluginの設定も隣接させるべきだ。[Copilot code review Agent skills MCP GA](/blog/github-copilot-code-review-skills-mcp-ga-2026/) のように、CopilotはMCP、skills、pluginsを使って外部文脈へ接続する。remote controlで承認できるsessionが、どのpluginやMCPを使えるかを同じ表で見なければ、実行時のリスクを評価できない。

## Security review checklist

導入前のsecurity reviewでは、まずsession eventの扱いを見る。GitHub Docsは、remote controlを有効にするとconversation messages、tool execution events、permission requestsがlocal machineからGitHubへ送られ、remote commandがGitHubからCopilot CLIへpollされlocal sessionへ注入されると説明している。これらに社内コード、command output、URL、path、承認判断が含まれ得る。

次に、remote側clientを確認する。GitHub Mobileを会社端末だけで許すのか、個人スマートフォンでも許すのか。通知previewに機密情報が出ないか。端末紛失時にGitHub sessionを止められるか。SSO authorizationが切れた場合にremote controlが止まるか。MFAやpasskeyが必須か。`requireSSO`だけではここをカバーできない。

第三に、permission requestの承認基準を作る。remoteから承認できるrequestは便利だが、すべてを許してよいわけではない。`rm`、migration、production endpoint、credential file、`.env`、private key、customer export、billing operation、IAM変更、外部URL fetch、未知のscript実行は、遠隔承認禁止または二者確認にする。Copilot CLI側のpermission設定やinstructionsにも反映する。

第四に、ログと証跡を決める。GitHub上のsession表示だけで十分なのか、重要repositoryではPR commentやissueに判断理由を残すのか、audit logやSIEMへ連携するのかを決める。特に委託先開発では、誰がpermissionを承認し、その承認が契約上の作業範囲に入るのかを後から説明できる必要がある。

第五に、ロールバックを練習する。MDMで誤って`remoteControl.enabled`を広く配った場合、すぐに`disabled`へ戻せるか。server-managed設定を戻した場合、clientにどれくらいで反映されるか。file-based設定を配ったLinux環境で、古いfileが残らないか。Copilotは日常の開発速度に関わるため、設定変更も障害対応の対象になる。

## 30-day rollout plan

1週目はinventoryである。Copilot CLI利用者、remote control policyの状態、GitHub Mobile利用、MDM対象端末、BYOD、委託先端末、既存managed settings、`.github-private` repository、Linux imageを棚卸しする。既存のremote control GA記事で決めたpilot teamがあれば、その端末から始める。

2週目は設定の最小pilotを行う。管理済み端末10台未満で`requireSSO`を配り、対象organizationを1つに絞る。SSO authorizationあり、なし、別account、別organization、端末sleep、network切断、client restart、`copilot --continue`、`copilot --resume`を試す。失敗時の表示文言を記録する。

3週目は禁止条件を固める。遠隔承認禁止のcommand、path、URL、repository、branch、issue typeを整理する。Copilot CLI instructions、repository rules、セキュリティ教育、委託先作業ルールへ反映する。必要なら、remote controlを許すrepositoryを限定するために、policyだけでなく運用上のガイドを用意する。

4週目は展開判断をする。指標は、remote approval回数、承認待ち短縮、承認後のCI失敗、手戻り、禁止領域への接触、問い合わせ件数、MDM反映漏れ、SSO切れの頻度である。remote controlを使った人数だけを見ても意味がない。agent作業の停止時間が減り、レビュー品質と監査負荷が許容範囲に収まっているかを見る。

## Conclusion

`remoteControl` enterprise managed settingは、Copilot CLI remote controlを企業の端末統制へ接続する更新である。remote controlは、host端末で動くagent sessionに対して、別デバイスから人間が判断を返すcontrol planeである。便利さを最大化するだけなら全端末で有効にすればよいが、企業利用ではそれでは足りない。

日本企業は、まず端末カテゴリを分け、会社支給端末では`requireSSO`、管理外端末や共有端末では`disabled`を基本にするべきだ。server-managed、MDM-managed、file-basedの配布経路と優先順位を台帳化し、SSO、MFA、GitHub Mobile、BYOD、委託先、禁止承認、ログ、ロールバックを同じ設計に入れる。

Copilotのagent機能は、CLI、app、VS Code、code review、MCP、cloud agentへ広がっている。remote controlはその中の人間介入面を担う。だからこそ、どの端末から始まったsessionに、誰が、どのclientから、どの条件で介入してよいかを決めることが、今後のCopilot運用の基本線になる。

## 出典

- [Limit remote control to managed devices](https://github.blog/changelog/2026-07-30-limit-remote-control-to-managed-devices/) - GitHub Changelog, 2026-07-30
- [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
- [Enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-managed-settings-reference) - GitHub Docs
- [About remote control of GitHub Copilot CLI sessions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control) - GitHub Docs
