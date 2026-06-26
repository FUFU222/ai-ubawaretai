---
article: 'github-copilot-jira-ga-agent-pr-2026'
level: 'child'
---

GitHubは2026年6月25日、**GitHub Copilot for Jira**が一般提供になったと発表しました。これは、JiraのチケットからGitHub Copilot coding agentを呼び出し、GitHubのリポジトリで作業させ、draft pull requestを作らせるための連携です。

これまで、Jiraは「何を作るか」を管理し、GitHubは「どう実装するか」を管理する場所として分かれていました。Copilot for Jiraでは、その間にAIエージェントが入ります。Jiraの作業項目をCopilotに割り当てると、Copilotがチケットの説明やコメントを読み、GitHub側で実装作業を進めます。

## 何ができるのか

GitHub Docsでは、Jira workspaceからCopilot cloud agentを起動できると説明されています。起動方法は、Jiraの担当者欄でGitHub Copilotを割り当てる、コメントで`@GitHub Copilot`とmentionする、Jira automationから起動する、という形です。

Copilotは、チケットのtitle、description、labels、comments、acceptance criteriaなどを文脈として使います。作業が始まると、Jiraのchat panelで進捗を見られます。作業結果はGitHub上のpull requestとして確認します。

つまり、これは単なる通知連携ではありません。Jiraに書いた要求が、そのままAIエージェントへの作業依頼になります。

## 使う前に必要なもの

GitHub Marketplaceの説明では、Jira CloudでRovoが有効になっていること、GitHub側でCopilot coding agentが有効になっていること、接続済みのGitHub repositoryがあることが条件として挙げられています。

また、GitHub Docsでは、ユーザーがGitHub accountをJira側で接続する必要があること、repositoryへのwrite accessを持つユーザーだけがそのrepositoryでCopilot cloud agentを動かせることも説明されています。

会社で使う場合は、Jira管理者だけでなく、GitHub organization ownerやCopilot管理者も関係します。Jiraにアプリを入れただけでは終わりません。

## 日本のチームで注意すること

一番大事なのは、チケットの書き方です。CopilotはJiraのチケットを読んで作業します。チケットがあいまいだと、Copilotのpull requestもあいまいになります。

たとえば「ログイン画面を直す」だけでは足りません。どのリポジトリなのか、何を直すのか、どの画面か、期待する挙動は何か、テストはどう確認するかを書く必要があります。

[Copilot Agent tasks API](/blog/github-copilot-agent-tasks-api-pro-2026/)と同じように、AIエージェントは便利ですが、作業の入口が簡単になるほど、依頼内容の品質が重要になります。

## 費用とレビューも見る

GitHub Docsでは、Copilot cloud agentがGitHub Actions minutesとAI Creditsを使うと説明されています。[Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)を使っている組織では、Jiraから起動した作業も費用管理の対象になります。

また、Copilotが作ったpull requestは、人間がレビューする必要があります。AIが作ったから正しいとは限りません。[Copilot code review](/blog/github-copilot-code-review-agents-md-2026/)のような自動レビューも役立ちますが、最終的には担当者が仕様、テスト、セキュリティを確認する必要があります。

## まとめ

Copilot for Jiraは、JiraチケットからGitHub Copilot coding agentを起動し、pull requestまでつなげる機能です。Jiraを中心に開発を管理しているチームには便利です。

ただし、導入するときは、チケットの書き方、起動できる人、対象リポジトリ、費用、レビュー責任を先に決める必要があります。Copilot for Jiraは、Jira運用そのものの品質を問う機能です。

## 出典

- [GitHub Copilot for Jira is now generally available](https://github.blog/changelog/month/06-2026/#github-copilot-for-jira-is-now-generally-available) - GitHub Changelog, 2026-06-25
- [Integrating Copilot cloud agent with Jira](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/integrate-cloud-agent-with-jira) - GitHub Docs
- [GitHub Copilot for Jira](https://github.com/marketplace/github-copilot-for-jira) - GitHub Marketplace
