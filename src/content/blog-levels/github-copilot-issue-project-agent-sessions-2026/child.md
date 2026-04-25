---
article: 'github-copilot-issue-project-agent-sessions-2026'
level: 'child'
---

GitHubが**2026年4月23日**に、GitHub Copilotの**cloud agent sessionをissuesとprojectsから見て操作できる更新**を出しました。

ポイントはシンプルです。これまでagentの進捗はAgentsタブなど専用画面で追う色が強かったのに、今回から**IssueやProject boardの中でそのまま進み具合を見て、必要なら途中で指示を足せる**ようになりました。

## 何が追加されたの？

GitHub Changelogでは、主に次の4点が案内されています。

- Issueヘッダーにsession pillが出て、active / completed sessionを一覧しやすくなった
- Issueのサイドパネルから、進捗確認、ログ閲覧、steerができる
- Projectsでは「Show agent sessions」が新規・既存ビューで既定オンになった
- Project board上からsession詳細をサイドバーで開ける

つまり、Copilotに任せた作業が**チケット管理の画面から見えやすくなった**わけです。

## どうして大事なの？

日本の開発現場では、AIがコードを書けること自体より、**誰が途中経過を見るのか、どこで止めるのか、監査やレビューをどう回すのか**が重要です。

今回の更新で、PMやTech LeadはIssueやProjectを見ながらそのままagent作業を追えます。別画面へ飛ばなくても、今どこまで進んだか、方向がずれていないかを確認しやすくなります。

GitHub Docsによると、session logではCopilotの進め方や使ったtoolsを確認でき、必要なら途中で追加指示もできます。止めたいときはsession停止も可能です。完全自動というより、**人が途中でハンドルを握れる自動化**に近いです。

## 監査面では何が効く？

ここも実務では大きいです。Docsでは、Copilot cloud agentのcommitはCopilotがauthor、依頼者がco-authorとして記録され、session logへのリンクが入り、commitはVerified表示になると案内されています。

このため、単にPR差分を見るだけでなく、**誰の依頼で、どのsessionにつながる変更なのか**を追いやすいです。日本企業のようにレビューや承認の説明責任が重い組織では、この可視性がかなり効きます。

## 気をつける点は？

便利でも、運用で注意すべき点があります。

1つは、IssueをCopilotへ割り当てたあとにIssueへ追記したコメントは、自動では反映されないことです。後から条件が増えたら、Copilotが作ったPR側で伝える必要があります。

もう1つは、使えるプランやリポジトリ設定の確認です。現場が使いたくても、管理者設定で止まるケースがあります。

## 日本チームは何から始めるべき？

最初は、文言修正、テスト追加、小さなバグ修正のような**範囲が狭く、途中確認しやすいIssue**から始めるのが安全です。

同時に、次の3つだけは先に決めておくと回しやすくなります。

- 誰がsessionをsteer / stopするか
- どの種類のIssueをagentへ回すか
- どのPRでsession log確認を必須にするか

今回の更新は、Copilotが急に万能になったという話ではありません。**Issue/Project運用の中で管理しながらagentを使える形に近づいた**、と理解するのが正確です。

## 出典

- [View and manage agent sessions from issues and projects](https://github.blog/changelog/2026-04-23-view-and-manage-agent-sessions-from-issues-and-projects/)
- [Tracking GitHub Copilot's sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/track-copilot-sessions)
- [Asking GitHub Copilot to create a pull request](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-a-pr)
- [About GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)
