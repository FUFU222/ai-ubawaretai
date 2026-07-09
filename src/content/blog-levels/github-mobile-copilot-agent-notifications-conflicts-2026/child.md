---
article: 'github-mobile-copilot-agent-notifications-conflicts-2026'
level: 'child'
---

GitHub Mobileで、Copilotの作業を外出先から追いやすくなりました。2026年7月8日の更新で、Copilot CLI sessionが人間の入力を待っているときにMobileへ通知できるようになり、Pull Requestのmerge conflictもMobileからCopilot cloud agentへ直させる導線が入りました。

前に扱った[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)では、CLIで動いているagentをMobileやWebから見る話でした。今回はそこから一歩進み、止まっている作業に気づく通知と、PR上の衝突解消をMobileから始める話です。

## 何が変わったのか

一つ目は通知です。Copilot CLIに調査や修正を任せていると、途中で「このコマンドを実行してよいか」「どちらの方針で進めるか」のように聞かれることがあります。これまでは端末を見ていないと気づきにくい場面がありました。Mobile通知があれば、待ち状態を見つけやすくなります。

二つ目はPRの衝突解消です。merge conflictがあるPRをMobileで見たとき、Copilot cloud agentに解消案を作らせることができます。PCを開く前に、まずagentに初稿を作らせるという使い方がしやすくなります。

## なぜ便利なのか

AIエージェントは、長い作業の途中で止まりやすいからです。テストを実行した後、追加の許可が必要になる。衝突が起きて、どちらの変更を残すか確認が必要になる。こうした待ち時間が積み重なると、せっかくagentに任せても進みません。

Mobile通知は、その待ち時間を減らします。会議の合間や移動中に「これは進めてよい」と返せれば、作業は次へ進みます。衝突解消も、翌朝まで放置するのではなく、先に案を作らせておけます。

## 注意すること

ただし、スマートフォンだけで何でも承認するのは危険です。小さい画面ではdiffを読み落としやすく、通知だけ見て判断すると、重要な変更を見逃すことがあります。特に認証、課金、個人情報、DB migration、本番障害に関係する変更は、Mobileで軽く承認しないルールが必要です。

会社で使うなら、端末管理も大事です。個人スマホで通知を受けてよいのか、業務用スマホだけにするのか、通知にrepository名やPR名を出してよいのかを決めます。Copilot設定を会社で管理する流れは、[GitHub Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)ともつながります。

## まず試すなら

最初は低リスクなrepositoryで試すのがよいです。ドキュメント修正、lint修正、テスト追加、軽い衝突解消のような作業から始めます。Mobile通知で本当に待ち時間が減ったか、逆に通知が多すぎないかを見ます。

Copilot cloud agentを使う場合は、費用も確認します。小さな衝突解消でも、使う回数が増えるとAI Creditsに影響します。便利だから全員に開くのではなく、チーム単位で効果とコストを見て広げる方が安全です。

## まとめ

GitHub Mobileは、Copilotの補助画面から、agent作業を進める入口へ近づいています。通知で止まっている作業に気づき、PRの衝突解消をcloud agentへ渡せるのは便利です。

一方で、Mobile承認は慎重に扱う必要があります。通知、端末、費用、人間レビューを決めてから使えば、外出先の短い時間を開発フローの遅れ解消に使いやすくなります。

## 出典

- [GitHub Mobile: Live notifications for Copilot CLI sessions](https://github.blog/changelog/2026-07-08-github-mobile-live-notifications-for-copilot-cli-sessions/) - GitHub Changelog, 2026年7月8日
- [GitHub Mobile: Fix merge conflicts with Copilot cloud agent](https://github.blog/changelog/2026-07-08-github-mobile-fix-merge-conflicts-with-copilot-cloud-agent/) - GitHub Changelog, 2026年7月8日
- [Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github) - GitHub Docs
