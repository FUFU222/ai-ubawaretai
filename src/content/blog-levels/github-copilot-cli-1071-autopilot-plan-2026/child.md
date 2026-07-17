---
article: 'github-copilot-cli-1071-autopilot-plan-2026'
level: 'child'
---

GitHubは2026年7月16日、GitHub Copilot CLI **1.0.71**を公開しました。今回は新しいAIモデルの話ではありません。Copilot CLIを安全に止める、計画中に勝手な変更をさせない、LSPやMCPやpluginを扱いやすくする、といった運用寄りの更新です。

企業でCopilot CLIを使うなら、こうした小さく見える更新のほうが重要になることがあります。便利なagentでも、止まらない、計画だけのつもりで編集する、使えるtool一覧が古い、pluginの入手元が分からない、という状態では社内展開しにくいからです。

## 何が更新されたのか

一つ目はAutopilotです。`copilot -p --autopilot` が、background shellやagentが残ったままになってもhangし続けにくくなりました。Release 1.0.71では、plainな `-p` と同じように `COPILOT_TASK_WAIT_TIMEOUT_SECONDS` のtimeoutを尊重するようになっています。

Autopilotは、Copilot CLIにより自律的に作業させるための機能です。人の確認を減らせる反面、いつ止まるのか、どこまで自動で進めるのかを決めておく必要があります。[Copilot CLIセッション上限](/blog/github-copilot-cli-ai-credit-session-limits-2026/)で扱った費用上限と同じく、止め方はagent運用の基本です。

二つ目はPlan modeです。Plan mode中は、built-in toolがworkspaceを変更する操作をhard-blockするようになりました。計画だけを作らせている間に、file編集や変更系shell commandが混ざる事故を減らすための更新です。

ただし、MCPやexternal toolは別です。GitHubのrelease noteでは、MCPとexternal toolは引き続き許可されると説明されています。つまり、Plan modeを完全なread-onlyだと思い込まず、どのMCP toolを使わせるかを別に管理する必要があります。

## LSPとsandboxの意味

今回のreleaseでは、LSP file readとrename editにもsandbox filesystem policyが適用されます。

LSPはLanguage Server Protocolのことで、Copilot CLIが定義ジャンプ、参照検索、symbol renameなどを正確に扱うために使えます。GitHub Docsは、LSPによりtoken効率やrefactoring精度が上がると説明しています。

一方で、LSPはcodebaseの構造を深く見る機能です。普通のfile readだけを制限していても、LSP経由で読める範囲がずれていれば意味がありません。今回の更新は、agentに見せるfile境界をLSPにも適用する方向の修正です。

日本企業では、すぐに全repositoryでrename editを許可するより、まずread-onlyな調査用途から始めるほうが安全です。特にmonorepo、個人情報を含む開発環境、委託先と共有するrepositoryでは、sandboxの効き方をテストしてから広げるべきです。

## MCPとpluginも確認する

Release 1.0.71では、MCP serverが変わった時にtool listを最新に保つ修正も入っています。さらに、GitHub MCP toolsetやtool configを `settings.json` に保存する動き、plugin marketplaceをCLIから扱うsubcommandsも追加されています。

MCPやpluginは、Copilot CLIに外部能力を足す仕組みです。便利ですが、使えるtoolが増えるほど、権限や監査の確認も必要になります。[Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)のように端末へ設定を配る運用をしている会社は、CLI pluginやextensionも管理対象に入れるべきです。

GitHub Docsは、Copilot CLI extensionsが利用者の端末上でcodeを実行することを説明しています。信頼できないextensionやpluginを読み込めば、AI agent以前に端末上のscript実行リスクになります。承認済みmarketplace、version、削除手順を決めておく必要があります。

## 会社で確認すること

最初に、全員のCopilot CLI versionを確認します。今回のPlan mode hard-blockやAutopilot timeout修正を使うなら、1.0.71以降を最低ラインにします。CI runnerやVDI、貸与端末、委託先の端末も対象です。

次に、Autopilotを使ってよい仕事を決めます。資料作成、test失敗の調査、Issue整理のような低リスク作業は向いています。一方、認証、課金、database migration、本番設定、個人情報を含む変更では、Plan modeやinteractive modeに限定し、人間の承認を必須にしたほうがよいです。

さらに、Plan mode用のtool設定を分けます。Plan modeで読むだけのつもりなら、MCP toolもread-only中心にします。PR作成、label変更、cloud resource変更、secret操作などは、計画段階では外すほうが説明しやすくなります。

## まとめ

Copilot CLI 1.0.71は、派手な新機能よりも安全な運用に効く更新です。Autopilotの止まり方、Plan modeの変更ブロック、LSPへのsandbox適用、MCPとpluginの更新が中心です。

日本のチームは、単に最新版へ更新するだけでなく、Autopilot、Plan mode、LSP、MCP、pluginそれぞれの使い方を分けて決めるべきです。そうすれば、Copilot CLIを個人の便利ツールではなく、社内で説明できるagent実行環境として使いやすくなります。

## 出典

- [Release 1.0.71 - github/copilot-cli](https://github.com/github/copilot-cli/releases/tag/v1.0.71) - GitHub, 2026-07-16
- [Allowing GitHub Copilot CLI to work autonomously](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) - GitHub Docs
- [Using LSP servers with GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/lsp-servers) - GitHub Docs
- [About extensions for GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-extensions) - GitHub Docs
