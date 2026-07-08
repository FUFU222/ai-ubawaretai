---
article: 'github-copilot-mdm-managed-settings-2026'
level: 'expert'
---

GitHub Copilotのmanaged settingsがnative MDMとfile-based configurationに対応したことで、Copilotの統制面はGitHub account policyだけでなくendpoint policyへ広がった。2026年7月8日のGitHub Changelogは、enterprise administratorがGitHub Copilot CLIとVS Codeに対し、MDM、file、server-managed channelの3経路で同じmanaged setting keysを配れるようになったと説明している。

これは、Copilotをdeveloper productivity toolとして導入する話から、endpoint governanceの一部として扱う話への移行である。開発者がVS Code、Copilot CLI、GitHub Copilot app、cloud agentを行き来するほど、GitHub側のAI controlsだけでは実運用を説明しにくくなる。端末上で動くCLIとIDEに最低基準を置けることは、情シスとセキュリティにとって重要な変化だ。

特に日本企業では、会社支給PC、VDI、委託先端末、BYOD、個人GitHubアカウント、Enterprise Managed Users、GitHub Enterprise Serverが混在しやすい。server-managed settingsはアカウントに追随する。一方、MDM managed settingsは端末に基準を置く。この違いを理解しないまま全社展開すると、設定の抜け道だけでなく、正当な例外まで潰すことになる。

## 事実: delivery channelは3つ、mergeではなく勝者選択

GitHub ChangelogとVS Code Docsが示すdelivery channelは、Native MDM、Server-managed、File-basedの3つである。Native MDMはWindowsのregistry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\GitHubCopilot`、macOSの`com.github.copilot` managed preferencesから読む。File-basedはOSごとのwell-known pathに置かれた`managed-settings.json`を読む。Server-managedは、サインインしたGitHub accountに対し、enterpriseまたはorganization側で構成された設定を解決する。

優先順位はNative MDM、Server-managed、File-basedの順だ。VS Code Docsは、同じsettingが複数channelにあるとき、channel単位で最上位が勝ち、他channelは無視されると説明している。これはfield-level mergeではない。たとえばMDMが`permissions.disableBypassPermissionsMode`だけを提供し、server-managedが`enabledPlugins`を提供していても、MDM channelが存在するならserver-managed channel全体が無視される挙動になり得る。

したがって、設計の最初の論点は「どの値をどこに書くか」ではなく、「どの端末群でどのchannelをauthoritativeにするか」である。会社支給端末はNative MDM、管理外端末はServer-managed、Linux build workstationはFile-based、という分け方はあり得る。ただし、同じ利用者が複数端末を使う場合、体験差を説明できる必要がある。

File-based channelにも安全条件がある。GitHub Copilot CLI docsは、POSIX systemでfile-based managed settingsがsymlink、root所有でないfile、world-writableなfileである場合は拒否すると説明する。これは、開発者がローカルfileを書き換えて企業設定を迂回することを防ぐための最低限の保護である。configuration management toolで配る場合も、ownershipとpermissionをテスト項目に入れるべきだ。

## 事実: setting keysはagent権限境界に直結する

Changelogが挙げるsupported settingsには、`permissions.disableBypassPermissionsMode`、`model`、`enabledPlugins`、`extraKnownMarketplaces`、`strictKnownMarketplaces`、`telemetry.*`が含まれる。これは単なるUX設定ではなく、agentの権限境界、実行能力、観測可能性を左右する設定群である。

`permissions.disableBypassPermissionsMode`は、permission systemを迂回する利用者操作を止めるための設定だ。agentがファイル変更、command実行、外部tool呼び出しを行う場面では、permissionを誰が承認し、どの範囲で自動承認するかが事故の分岐点になる。

`enabledPlugins`、`extraKnownMarketplaces`、`strictKnownMarketplaces`は、Copilotの拡張面を管理する。以前の[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)では、企業がpluginやmarketplaceを標準配布できる意味を扱った。[Copilot strict marketplace](/blog/github-copilot-strict-marketplaces-plugin-controls-2026/)では、承認済みmarketplace以外を制限する意味を扱った。MDM対応は、これらをアカウント設定だけでなく端末基準として適用しやすくする。

`telemetry.*`はOpenTelemetry exportに関わる。Copilot agentの活動が標準的なobservability backendへ送れるようになるほど、どの端末から、どのcollectorへ、どのcontentを含めて送るかが統制対象になる。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のようなGitHub側session recordと、端末側OpenTelemetryは別の観測線である。両方を有効にするなら、重複、保存期間、閲覧権限、個人情報の扱いを分ける必要がある。

`model`も軽く見てはいけない。モデル選択は品質、速度、AI Credits、データ処理条件に影響する。管理者が全社既定を決めても、研究開発やセキュリティ検証では別モデルが必要になることがある。標準化と例外の両方を設計しなければ、現場は非公式な抜け道を探す。

## 推奨アーキテクチャ: baseline、overlay、exception

実務では、設定を三層に分けると扱いやすい。

Baselineは、端末種別ごとの最低基準である。会社支給PC、VDI、macOS developer fleet、Windows developer fleet、Linux workstationごとに、permission bypass、承認済みmarketplace、telemetry送信可否、file-based settingのpermissionを定義する。ここはMDMまたは構成管理で配る。

Overlayは、GitHub enterpriseまたはorganization側のpolicyである。部署やproduct lineごとのmodel、plugin、MCP registry、code review方針、BYOK可否を扱う。アカウントやorganizationに依存するため、server-managed settingsやGitHub AI controlsと相性がよい。ただし、Native MDMが存在するとserver-managed channelが無視される可能性があるため、MDM baselineを最小にするか、MDM側にoverlay相当も含めるかを決める必要がある。

Exceptionは、期間付きの逸脱である。AI基盤チームが新modelを評価する、セキュリティチームが外部toolを検証する、OSS保守チームが個人アカウントで別marketplaceを試す、といったケースがある。例外はticket、owner、期限、対象端末、対象repository、戻し手順を持つ。例外を記録しないと、半年後には標準と逸脱の区別が消える。

この三層を台帳化する。項目は、setting key、channel、対象端末群、対象organization、owner、変更日、理由、rollback commandまたはMDM profile、検証結果、関連audit log queryで十分だ。重要なのは、GitHub adminだけでなくendpoint adminも同じ台帳を見ることだ。

## BYOK、個人アカウント、委託先端末への影響

MDM managed settingsが特に効くのは、サインインアカウントだけでは統制できない場面である。開発者が会社支給PCで個人GitHubアカウントへサインインし、Copilot CLIやVS Codeを使う場合、server-managed settingsは会社enterpriseの設定を読まない可能性がある。Native MDMで端末baselineを置けば、少なくともそのPCで許さないmarketplaceやpermission bypassを制御できる。

BYOKも同じだ。[GitHub Copilot app全開放とBYOK](/blog/github-copilot-app-all-users-byok-2026/)で扱ったように、個人provider keyや会社指定provider gatewayが同じ端末に入る可能性がある。MDM settingだけで全provider credentialを管理できるわけではないが、model default、plugin、permission、telemetryを端末側で揃えることで、BYOKを許す端末と許さない端末の差を明確にできる。

委託先端末はさらに難しい。自社MDMを入れられない端末では、GitHub側policy、repository access、contract、audit log、session recordで補うしかない。逆に、自社貸与端末やVDIで委託先が作業するなら、MDM baselineは有効だ。契約書上の「指定環境で作業すること」が、実際のCopilot設定まで含むのかを明文化すべきである。

注意すべきは、MDMはCopilot外のAIツールを止めるものではないことだ。開発者が別のCLI、別のIDE extension、browser上のAI serviceを使えば、Copilot managed settingsの外に出る。したがって、MDM managed settingsはAI統制の一部であり、endpoint DLP、proxy、software inventory、GitHub policy、利用ガイドと組み合わせる必要がある。

## 監査設計: 設定配布ログと実行ログを分ける

監査では、少なくとも3種類のログを分けて持つ。

第一に、設定配布ログである。MDM profileがどの端末へ配られ、成功したか。file-based settingのchecksumとpermissionは正しいか。VS CodeとCopilot CLIがその設定を読んだか。ここは端末管理ツールの領域だ。

第二に、GitHub側policy変更ログである。enterpriseやorganizationのAI controls、`.github-private`のmanaged settings、plugin marketplace設定、MCP registry設定がいつ誰により変わったか。ここはGitHub audit logとrepository historyの領域だ。

第三に、実行活動ログである。Copilot session、prompt、response、tool call、OpenTelemetry event、CLI session data、repository actionをどう記録するか。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)はこの層の一部であり、端末側OpenTelemetryとは別の証跡になる。

インシデント時は、この3層を時系列で合わせる。たとえば「承認外pluginが使われた疑い」がある場合、まず設定配布が成功していたか、次にその時点の`strictKnownMarketplaces`が何だったか、最後にsession recordやOTel eventで実際のplugin/tool callがどう見えたかを確認する。設定だけ見ても、実行だけ見ても、原因は特定できない。

## ロールアウト手順

最初の1週間は、棚卸しに使う。対象端末、OS、VS Code version、Copilot CLI version、サインイン方式、GitHub enterprise/organization、既存の`.github-private`設定、既存plugin標準、BYOK方針を確認する。VS Code 1.128以降のprecedenceが前提になるため、client versionのばらつきは先に潰す。

2週目は、pilot profileを作る。Native MDMで最小限の設定だけを配る。たとえばpermission bypassの禁止、承認済みmarketplace、telemetry送信先なし、既定modelのみといった保守的なbaselineから始める。server-managed channelとの衝突を見るため、pilot groupには既存GitHub側設定があるユーザーも含める。

3週目は、観測を入れる。端末側の配布成功、VS Code上のmanaged表示、Copilot CLIのconfig読み込み、GitHub audit log、session recordを確認する。失敗時に何が見えるかを知るため、意図的にfile ownershipを誤らせたLinux test、古いVS Code client、MDM未反映端末を作って挙動を確認する。

4週目は、ロールバック訓練を行う。誤った`strictKnownMarketplaces`で必要pluginが消える、`model`固定で検証が止まる、`telemetry.*`設定でcollectorへ送れない、という失敗を想定する。MDM profileを戻す、fileを削除する、server-managed settingへ切り戻す、利用者へ通知する手順を検証する。

## 判断基準

全社展開してよい条件は、少なくとも次の4つだ。

第一に、authoritative channelが文書化されていること。端末種別ごとに、どのchannelが正で、どのchannelを無視するのかが決まっている。

第二に、例外処理が運用できること。標準外model、marketplace、plugin、telemetryを必要とするチームが、非公式に設定を壊さなくても申請できる。

第三に、監査時の突合ができること。設定配布、GitHub policy、実行活動を時系列で照合できる。

第四に、利用者説明があること。なぜplugin追加が制限されるのか、なぜpermission bypassができないのか、どのtelemetryが送られるのか、例外申請はどこかを開発者が理解している。

## まとめ

GitHub CopilotのMDM managed settingsは、VS CodeとCopilot CLIにまたがる企業統制を、端末管理の標準プロセスへ接続する更新である。Native MDM、Server-managed、File-basedの3チャネルは同じキーを扱うが、mergeではなく優先順位による勝者選択で動く。この仕様を前提にしないと、設定のつもり違いが起きる。

日本企業では、会社支給PC、個人アカウント、BYOK、委託先、Linux開発環境が絡むため、MDM baseline、GitHub overlay、期間付きexceptionの三層で設計するのが現実的だ。設定配布ログ、GitHub policy変更ログ、実行活動ログを分けて持ち、インシデント時に突合できるようにする。

今回の更新は、Copilotを縛るためだけの機能ではない。開発者が安心してagent機能を使える最低基準を端末に置くための機能である。強制範囲を絞り、例外を記録し、ロールバックを練習したうえで広げるべきだ。

## 出典

- [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli) - GitHub Changelog, 2026-07-08
- [Manage AI settings in enterprise environments](https://code.visualstudio.com/docs/enterprise/ai-settings) - Visual Studio Code Docs
- [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) - GitHub Docs
- [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/policies) - GitHub Docs
