---
article: 'github-copilot-cloud-agent-automations-2026'
level: 'child'
---

GitHubが**2026年6月2日**に、Copilot cloud agentを自動実行する**automations**を公開した。これまでは、人がIssueやGitHub画面、CLI、APIなどからCopilot cloud agentに作業を頼む形が中心だった。今回の更新では、あらかじめタスクを作っておくと、スケジュールやリポジトリイベントに応じてagentが自動で動く。

たとえば、毎朝Issueを分類する、毎晩失敗テストを見て修正を試す、毎週リリースノートを下書きする、といった使い方が想定されている。以前の[Copilot cloud agent REST API化](/blog/github-copilot-cloud-agent-rest-api-2026/)は外部システムから起動する話だった。今回は、GitHub側に定義した条件で起動する話だ。

## 何ができるのか

GitHub Docsでは、automationを作るときに、名前、prompt、trigger、モデル、使えるtoolを決めると説明されている。triggerは定期実行ならhourly、daily、weeklyを選べる。イベントなら、Issue作成、Pull Request作成、Pull Request同期が対象になる。

automationは単一リポジトリにscopeされる。対象はprivateとinternal repositoryで、public repositoryにはまだ対応していない。Copilot Pro、Pro+、Max、Business、Enterpriseで使えるが、BusinessやEnterpriseでは管理者がCopilot cloud agentやautomationsを許可している必要がある。

ここで大事なのは、automationが「勝手に広い範囲で動くもの」ではなく、リポジトリ、trigger、toolを決めて動かすものだという点だ。うまく絞れば便利だが、雑に作るとPRやIssue更新が増えすぎる。

## なぜ注意が必要なのか

automationは、人が毎回開始ボタンを押さなくても動く。そのため、便利さと同時に、管理の責任も増える。たとえばPRが更新されるたびにautomationが走る設定にすると、AI CreditsやGitHub Actions minutesを継続的に消費する可能性がある。

この点は、[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)で扱った予算管理とつながる。手動利用なら「誰がたくさん使ったか」を見やすいが、自動実行では、作成者が忘れたautomationが毎週動き続けることもあり得る。利用量、実行回数、失敗回数を見られる運用が必要になる。

また、automationにはtoolを選ぶ仕組みがある。Issue分類だけならlabel更新だけでよいかもしれない。テスト修正ならcode変更とPR作成が必要かもしれない。最初から広いtoolを許すのではなく、タスクごとに必要最小限にするのが安全だ。

## 日本のチームでの使い方

最初に試しやすいのは、失敗しても戻しやすい作業だ。たとえば、Issueのラベル付け、READMEの定期更新、release noteの下書き、古い依存関係の調査、軽いテスト修正などが向いている。

逆に、認証、課金、個人情報、DB migration、本番設定に関わる変更をいきなりautomationに任せるのは危ない。人が起動しないぶん、気づかないうちに変更案が作られる。こうした領域では、まず人間が手動でagentを使い、レビュー基準が安定してから自動化を考えるほうがよい。

[GitHub Copilot app](/blog/github-copilot-app-technical-preview-2026/)からもautomationを扱える。Copilot appでは、保存したautomationの予定、対象repository、最終実行状態を見られる。さらにRun in the cloudを使うと、PCがオフでもcloud sandboxで実行できる。これは便利だが、個人の作業メモではなくチームの開発運用として見るべきだ。

## まず決めること

導入前に、少なくとも次を決めたい。どのリポジトリで使うか。誰がautomationを作ってよいか。どのtriggerを許すか。どのtoolを有効にするか。PRを作ったら誰がレビューするか。AI CreditsとActions minutesをどう確認するか。

GitHubのautomationsは、Copilot cloud agentをより日常の開発運用に近づける更新だ。ただし、自動化は便利なほど見えにくくなる。日本の開発チームは、まず小さな定型作業から始め、結果、費用、レビュー負荷を見ながら広げるのが現実的だ。

## 出典

- [Schedule and automate tasks with Copilot cloud agent](https://github.blog/changelog/2026-06-02-schedule-and-automate-tasks-with-copilot-cloud-agent/) - GitHub Changelog, 2026-06-02
- [About Copilot automations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automations) - GitHub Docs
- [Using automations in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/using-automations) - GitHub Docs
