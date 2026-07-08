---
title: 'GitHub Copilot MDM設定、端末統制を標準化'
description: 'GitHub CopilotのMDM管理設定を解説。日本企業がVS CodeとCopilot CLIの設定、plugin、BYOK、監査、例外運用を端末管理でどう標準化すべきか整理する。'
pubDate: '2026-07-09'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'VS Code', '管理者設定', 'AIガバナンス', '情シス', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月8日**、GitHub Copilotのmanaged settingsを、native MDMとfile-based configurationで端末へ直接配布できるようにしたと発表した。対象はGitHub Copilot CLIとVS Codeで、既存のserver-managed channelに加え、Microsoft Intune、Jamf、Group Policy、Chef、Puppet、Ansibleのような端末管理・構成管理の経路から設定を固定できる。

今回の焦点は、便利な設定項目が増えたことではない。Copilotの統制がGitHubアカウント側だけでなく、会社支給端末の管理面にも入ってきたことだ。これまでの[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)や[Copilot strict marketplace](/blog/github-copilot-strict-marketplaces-plugin-controls-2026/)は、企業が配るpluginやmarketplaceをどう標準化するかを扱った。今回の更新は、その標準をどのチャネルで端末へ届け、どの設定をユーザーが上書きできない状態にするかという実務に踏み込む。

日本企業では、Copilot導入が開発部門だけの判断から、情シス、セキュリティ、法務、委託管理、FinOpsを巻き込む段階へ移っている。GitHub側のAI controlsだけを整えても、端末上のVS CodeやCopilot CLIで別の設定が残れば、運用説明は弱くなる。MDM配布は、そのずれを減らすための重要な部品になる。

## 事実: MDM、server、fileの3経路で同じキーを配る

GitHub Changelogによると、managed settingsは3つのdelivery channelで配布できる。第一はnative MDMで、Windowsでは`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\GitHubCopilot`、macOSでは`com.github.copilot`のmanaged preferencesを読む。第二はfile-basedで、macOS、Windows、Linuxの既定パスに`managed-settings.json`を置く。第三はserver-managedで、開発者がサインインしたGitHubアカウントに紐づくorganizationまたはenterprise側の設定を解決する。

VS Codeの公式ドキュメントも、Copilot managed settingsを「VS CodeとGitHub Copilot CLIへ同じ構成を適用する中央管理レイヤー」と説明している。通常のVS Code enterprise policyとは別のCopilot固有の配布チャネルと設定形を使う点が重要だ。つまり、VS CodeだけをADMXやconfiguration profileで縛る話ではなく、Copilot CLIにも同じ設定を届けるための仕組みである。

優先順位は明確だ。複数チャネルが設定を提供する場合、Native MDM、Server-managed、File-basedの順に、最も優先順位の高いチャネルが丸ごと勝つ。設定単位で細かくmergeされるのではなく、ひとつのauthoritative channelが選ばれる。VS Code Docsでは、この優先順位はVS Code 1.128以降で適用されるとされている。

file-basedの場合、macOSは`/Library/Application Support/GitHubCopilot/managed-settings.json`、Windowsは`%ProgramFiles%\GitHubCopilot\managed-settings.json`、Linuxは`/etc/github-copilot/managed-settings.json`が案内されている。POSIX環境では、symlink、root所有でないfile、world-writableなfileは拒否される。これは単なる配置場所ではなく、端末上の改ざんを避けるための安全条件だ。

## 事実: 対象はpermission、model、plugin、marketplace、telemetry

Changelogでは、device-level channelがserver-managed channelと同じmanaged setting keysを支えると説明されている。例として、`permissions.disableBypassPermissionsMode`、`model`、`enabledPlugins`、`extraKnownMarketplaces`、`strictKnownMarketplaces`、OpenTelemetry export向けの`telemetry.*`が挙げられている。

ここから読み取れる実務上の意味は大きい。`permissions.disableBypassPermissionsMode`は、開発者がpermission bypassに逃げる余地を狭める。`model`は既定モデルの統制に関わる。`enabledPlugins`と`extraKnownMarketplaces`は、企業標準pluginや社内marketplaceの配布に関わる。`strictKnownMarketplaces`は、承認済み以外のmarketplaceを使わせないための設定だ。

この並びは、Copilotの企業管理が「契約した人だけに使わせる」段階から、「どの端末で、どのモデルを既定にし、どのpluginを入れ、どのmarketplaceを許し、どのtelemetryをどこへ送るか」を設計する段階へ進んだことを示している。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)で扱った実行記録と組み合わせれば、設定統制と実活動の監査を分けて見られる。

ただし、すべてをMDMで固定すればよいわけではない。モデルやpluginを強く固定すると、研究開発や検証チームの速度を落とすことがある。逆に、委託先や高機密repositoryでは、標準外pluginや個人BYOKを許すと責任境界が曖昧になる。端末管理は万能の禁止機能ではなく、組織ごとの例外設計と合わせて使うべきだ。

## 日本企業に効くのは端末とアカウントの分離

今回の更新が日本企業で効く場面は、アカウント統制だけでは足りないケースだ。

たとえば、会社支給PCではCopilot BusinessまたはEnterpriseの管理下で使わせたいが、開発者が個人GitHubアカウント、OSS活動、委託先アカウント、検証用アカウントを切り替えることがある。server-managedだけに頼ると、サインイン先によって適用される設定が変わる。MDMで端末側の最低基準を置けば、誰がサインインしても、会社端末として守るべき下限を作れる。

これは[GitHub Copilot app全開放とBYOK](/blog/github-copilot-app-all-users-byok-2026/)の論点ともつながる。Copilot appやCLIが広がるほど、会社契約の外側にある個人provider keyや個人アカウントが同じ端末へ入りやすくなる。MDM managed settingsは、その端末で許すモデル、plugin、marketplace、permissionを先に決める材料になる。

委託開発でも同じだ。委託先端末まで自社MDMで管理できるとは限らないが、少なくとも自社貸与端末、常駐者向け端末、VDI、開発用macOS fleetでは、Copilot CLIとVS Codeの設定を同じ基準にできる。逆に、端末を管理できない契約では、GitHub側policy、repository rule、監査ログ、契約条項で補う必要がある。

情シスにとっては、Copilotが「IDE拡張」から「端末上で動くagent基盤」に近づいていることを示す更新でもある。CLIはsession history、logs、hooks、MCP config、permissions configをローカルに持つ。これらを完全にMDMだけで見通せるわけではないが、最低限のmanaged settingsを配れることは、端末標準の一部としてCopilotを扱う出発点になる。

## 導入時に先に決める5つのこと

第一に、authoritative channelを決める。会社支給端末ではNative MDMを最優先にし、BYODや管理外端末ではserver-managedに寄せるのか。あるいは、Linux開発環境ではfile-basedを使うのか。優先順位が丸ごと勝つ仕様なので、「一部はMDM、一部はserver」と考えると事故が起きる。どのチャネルを正とするかを利用者と管理者が同じ理解にしておく必要がある。

第二に、最初に固定する設定を絞る。いきなりすべてのmodel、plugin、telemetryを固定すると、現場が詰まりやすい。初期段階では、permission bypassの扱い、承認済みmarketplace、最低限のenabled plugin、OpenTelemetryの送信先の有無から始めるのが現実的だ。便利系pluginや部署固有のagent skillは、全社MDMではなくorganizationやrepositoryの標準に残す選択肢もある。

第三に、例外申請を設計する。研究開発、AI基盤、セキュリティ検証、OSS保守では、標準外modelや追加marketplaceが必要になることがある。例外を口頭で済ませると、後から監査できない。誰が、どの端末で、どの期間、どの設定を外すのかを記録し、期限が来たら戻す仕組みを作る。

第四に、監査ログとつなげる。設定を配っただけでは、実際にどのsessionで何が起きたかは分からない。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のようなactivity record、GitHub audit log、端末管理ツールの配布成功ログを突き合わせる必要がある。設定の期待値と実活動を別々に持つことで、問題発生時に「設定ミス」「端末未反映」「利用者の逸脱」「機能仕様」のどれかを切り分けやすくなる。

第五に、利用者説明を用意する。managed settingsはユーザー体験を変える。モデルが固定される、pluginを追加できない、permission bypassができない、telemetryが指定先へ送られる、といった変化は、突然起きると反発を招く。何を守るためにどこを固定するのか、例外はどう申請するのかを短いガイドにするべきだ。

## 急いで全社展開しなくてよい

今回の更新は一般提供だが、導入は段階的でよい。最初は開発基盤チームやセキュリティチームの端末に限定し、Native MDM、server-managed、file-basedの優先順位が期待通りに動くかを見る。VS Code 1.128以降の挙動、Copilot CLIでの反映タイミング、既存の`.github-private`設定との関係、Linuxでのfile ownership条件を確認する。

次に、既存のCopilot標準と衝突しないかを見る。[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)で配っているplugin、[Copilot strict marketplace](/blog/github-copilot-strict-marketplaces-plugin-controls-2026/)で制限しているmarketplace、BYOK運用、OpenTelemetry送信先が矛盾していないかを台帳化する。設定が複数箇所に散るほど、変更時の影響範囲を見誤る。

最後に、ロールバックを練習する。MDMで誤った`enabledPlugins`や`strictKnownMarketplaces`を配ると、開発者のagent作業が止まる可能性がある。無効化、前バージョンへの戻し、反映確認、利用者通知をrunbookに入れる。Copilotは開発速度に直結するため、端末統制は障害対応の対象でもある。

## まとめ

GitHub CopilotのMDM managed settings対応は、VS CodeとCopilot CLIの企業統制を端末管理へ広げる更新だ。Native MDM、server-managed、file-basedの3チャネルで同じキーを配り、優先順位はNative MDM、Server-managed、File-basedの順になる。対象にはpermission、model、plugin、marketplace、OpenTelemetry設定が含まれる。

日本企業が見るべきポイントは、設定項目の数ではない。会社支給端末で、誰がどのアカウントでサインインしても守るべき下限を作れることだ。BYOK、plugin、監査ログ、委託先端末、Linux開発環境を含めて、GitHub側policyと端末側policyの役割を分ける必要がある。

まずは小さく、authoritative channel、固定する設定、例外申請、監査連携、ロールバックを決める。Copilotを開発者個人の設定に任せる段階から、端末標準として管理する段階へ移すための準備が求められる。

## 出典

- [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli) - GitHub Changelog, 2026-07-08
- [Manage AI settings in enterprise environments](https://code.visualstudio.com/docs/enterprise/ai-settings) - Visual Studio Code Docs
- [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) - GitHub Docs
- [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/policies) - GitHub Docs
