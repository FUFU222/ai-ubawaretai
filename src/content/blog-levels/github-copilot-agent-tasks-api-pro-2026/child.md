---
article: 'github-copilot-agent-tasks-api-pro-2026'
level: 'child'
---

GitHubは**2026年6月4日**、Copilot cloud agentをAPIから起動する**Agent tasks REST API**をCopilot Pro、Pro+、Maxでも使えるようにした。これまではBusinessやEnterpriseでの利用を前提に語られやすかったが、今回の更新で個人向け有料プランの開発者も、APIからagentタスクを試しやすくなる。

簡単に言うと、Copilotに「このリポジトリでこの作業をして」とプログラムから頼める入口が広がったということだ。画面で毎回依頼するだけでなく、スクリプトや社内ツールからタスクを始め、状態を確認できる。

## 何ができるのか

GitHub Docsでは、Agent tasks APIに作業内容の`prompt`を渡し、必要に応じてbase branch、利用モデル、pull requestを作るかどうかを指定できると説明している。つまり、ドキュメント更新、軽いリファクタ、テスト追加、依存関係調査などを、APIからcloud agentへ渡せる。

この仕組みは、すでに扱った[Copilot cloud agent API化](/blog/github-copilot-cloud-agent-rest-api-2026/)の続きとして見るとわかりやすい。5月の記事では、内製ポータルや企業の自動化基盤から起動する話が中心だった。今回のPro展開では、小さなチームや個人開発者が先に試せる意味が大きい。

## 注意点はあるのか

注意点はある。APIで起動するagentは、利用者の権限、Copilotプラン、対象リポジトリの設定に従う。誰でもどのリポジトリでも使えるわけではない。会社のコードで試すなら、個人の便利機能ではなくチームの開発運用として扱うべきだ。

費用も見る必要がある。[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降、Copilotの重い使い方は予算管理と切り離せない。コード補完と違い、cloud agentのような作業はtoken量や実行内容で消費が増えやすい。

## 何から試すべきか

最初は、失敗しても捨てやすい作業から試すのがよい。README更新、社内ドキュメントの下書き、lint修正、テスト追加案、依存関係更新の一次調査などだ。こうした作業なら、agentの結果を人間が見て、使うかどうか判断しやすい。

逆に、認可、課金、個人情報、DB migration、セキュリティ境界の変更をいきなりAPIで任せるのは危険だ。Copilot cloud agentは作業を進める手助けであって、設計責任やレビュー責任をなくすものではない。

## まとめ

Agent tasks REST APIのPro、Pro+、Max展開は、Copilot cloud agentをより身近な開発自動化の入口にする更新だ。日本のチームでは、まず小さなリポジトリと低リスクな作業で試し、権限、費用、PRレビュー、失敗時の扱いを決めてから広げるのが現実的である。

## 出典

- [Agent tasks REST API now available for Copilot Pro, Pro+, and Max](https://github.blog/changelog/2026-06-04-agent-tasks-rest-api-now-available-for-copilot-pro-pro-and-max/) - GitHub Changelog, 2026-06-04
- [Using Copilot cloud agent via the API](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-via-the-api) - GitHub Docs
- [REST API endpoints for agent tasks](https://docs.github.com/en/rest/agent-tasks/agent-tasks?apiVersion=2026-03-10) - GitHub Docs
