---
article: 'github-copilot-app-policy-managed-settings-2026'
level: 'child'
---

GitHubは2026年7月27日、**GitHub Copilot app**を管理する専用ポリシーを追加しました。これまでCopilot appの利用可否はCopilot CLIのポリシーとつながっていましたが、これからはappとCLIを別々に管理できます。

同じ日に、GitHubは**enterprise managed settings**の対象をCopilot appとCopilot cloud agentにも広げました。これは、会社が決めたCopilotの設定を、CLI、VS Code、Copilot appなどにそろえて効かせるための仕組みです。

## 何が変わったのか

大きな変更は2つあります。

1つ目は、Copilot appのpolicyが独立したことです。管理者は、appを全体で有効にする、全体で無効にする、organizationごとに判断させる、という3つから選べます。設定場所はAI ControlsのCopilot Clientsです。

2つ目は、`managed-settings.json`の対象が広がったことです。会社は、使えるplugin、使えるmarketplace、command実行やfile accessの前に承認を省略できるか、auto model selectionを既定にするか、といった設定を中央で決められます。

## なぜ大事なのか

Copilot appは、ただのチャットアプリではありません。複数のagent sessionを並行に動かし、branchを作り、pull requestを出し、CIを見て、MCP serverやskillsも使えます。[Copilot app BYOK](/blog/github-copilot-app-byok-model-providers-2026/)のように、使うモデルの選択肢も増えています。

そのため、会社が何も決めないまま広がると、誰がどのagent作業をしているのか、どのpluginを使っているのか、どの承認を省略しているのかが分かりにくくなります。今回の更新は、その管理線を引きやすくするものです。

## 最初に確認すること

まず、Copilot appが自社で既定有効になっているかを確認します。有効なら、全社員に開けたままでよいのか、pilot teamだけにするのか、organization管理者に任せるのかを決めます。

次に、managed settingsを使うかを決めます。GitHub Enterpriseの`.github-private` repositoryで管理する方法、MDMで配る方法、fileとして配る方法があります。すでに[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)のような企業管理を使っているなら、appにも同じ考え方を広げられます。

## 注意する点

承認promptのbypassは特に注意が必要です。開発者が毎回の承認を省略できると作業は速くなりますが、誤ってcommandを実行したり、想定外のfileやURLに触れたりするリスクも上がります。

また、cloud agentにはinteractive clientと同じ承認promptの考え方がそのまま当てはまりません。cloud agentを使う場合は、対象repository、使えるplugin、reviewルール、監査ログを別に確認する必要があります。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のようなログ機能と一緒に考えると分かりやすいです。

## まとめ

GitHub Copilot appの新しいpolicyは、appをCLIとは別に管理するための更新です。enterprise managed settingsの拡張は、appとcloud agentにも会社のguardrailを効かせるための更新です。

日本の会社では、まず「全社で使わせるのか」「どのpluginを許すのか」「承認省略を許すのか」「誰が費用と監査を見るのか」を決めるのがよいです。Copilot appは便利な入口ですが、開発AI agentの実行面でもあるため、先に管理ルールを作ることが大切です。

## 出典

- [Manage GitHub Copilot app access with a dedicated policy](https://github.blog/changelog/2026-07-27-manage-github-copilot-app-access-with-a-dedicated-policy/) - GitHub Changelog, 2026-07-27
- [Enterprise managed settings in the GitHub Copilot app and Copilot cloud agent](https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/) - GitHub Changelog, 2026-07-27
- [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
