---
article: 'github-copilot-mdm-managed-settings-2026'
level: 'child'
---

GitHubは2026年7月8日、GitHub Copilotの管理設定を、MDMや設定ファイルで端末へ配れるようにしたと発表しました。対象はVS CodeとGitHub Copilot CLIです。

これまでも、会社はGitHub側の設定でCopilotを管理できました。今回の違いは、会社支給PCそのものに設定を配れることです。Microsoft Intune、Jamf、Group PolicyのようなMDMや、Chef、Puppet、Ansibleのような構成管理から、Copilotの設定を端末へ届けられます。

## 何が変わったのか

管理設定の配り方は3つあります。

1つ目はNative MDMです。Windowsではregistry、macOSではmanaged preferencesを使います。2つ目はfile-basedです。決められた場所に`managed-settings.json`を置きます。Linuxではこの方法を使います。3つ目はserver-managedです。これは、開発者がサインインしたGitHubアカウントに紐づく会社側設定を読む方法です。

複数の設定がある場合、優先順位はNative MDM、Server-managed、File-basedの順です。細かく混ぜるのではなく、優先順位の高い設定元が勝ちます。ここを理解しないと、「MDMではA、GitHub側ではBを設定したのに、なぜ反映されないのか」という混乱が起きます。

## どんな設定を管理できるのか

GitHubの発表では、permission bypassを無効にする設定、既定モデル、enabled plugins、追加marketplace、承認済みmarketplaceだけに制限する設定、OpenTelemetryの送信設定などが例として挙げられています。

これは、Copilotをただ使わせるかどうかの話ではありません。どのモデルを使うか、どのpluginを入れるか、どのmarketplaceからpluginを取得してよいか、どこへtelemetryを送るかを、会社が端末側から決められるということです。

たとえば、[Copilot strict marketplace](/blog/github-copilot-strict-marketplaces-plugin-controls-2026/)で扱ったように、承認済みmarketplaceだけに絞る設定があります。今回のMDM対応により、その設定を会社支給PCへ直接配りやすくなります。

## なぜ日本企業に関係するのか

日本企業では、開発者が会社支給PCで複数のGitHubアカウントを使うことがあります。会社アカウント、個人アカウント、委託先用アカウント、OSS活動用アカウントが混ざる場合です。

GitHub側のserver-managed設定だけに頼ると、サインインするアカウントによって効く設定が変わります。MDMで端末側の最低限のルールを配れば、会社支給PCではどのアカウントでも守るべき下限を作れます。

これは[GitHub Copilot app全開放とBYOK](/blog/github-copilot-app-all-users-byok-2026/)の話ともつながります。Copilot appやCLIが広がると、個人のmodel provider keyや個人設定が会社端末に入りやすくなります。MDM管理設定は、その端末で許す範囲を決める助けになります。

## 最初に決めること

最初に、どの設定元を正にするかを決めます。会社支給PCはMDMを正にするのか、管理外端末はserver-managedだけにするのか、Linux開発環境はfile-basedにするのかを分けます。

次に、固定する設定を絞ります。最初から全部を固定すると、開発者が必要な検証をできなくなる場合があります。まずはpermission bypass、承認済みmarketplace、最低限のplugin、telemetryの方針から始めるのが現実的です。

例外申請も必要です。研究開発やセキュリティ検証では、標準外のmodelやpluginが必要になることがあります。誰が、いつまで、どの端末で例外を使うのかを記録します。

最後に、監査とつなげます。設定を配っただけでは、実際にどんな使われ方をしたかは分かりません。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のような活動記録や、MDMの配布成功ログと合わせて確認します。

## まとめ

GitHub CopilotのMDM managed settings対応により、VS CodeとCopilot CLIの設定を端末管理から標準化しやすくなりました。GitHub側の設定だけでなく、会社支給PCのルールとしてCopilotを管理できるようになります。

重要なのは、強く縛ることではありません。会社端末で守る最低基準、例外の扱い、監査ログとのつなぎ方を決めることです。まずは少数の端末で試し、優先順位と反映タイミングを確認してから広げるのが安全です。

## 出典

- [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli) - GitHub Changelog, 2026-07-08
- [Manage AI settings in enterprise environments](https://code.visualstudio.com/docs/enterprise/ai-settings) - Visual Studio Code Docs
- [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) - GitHub Docs
