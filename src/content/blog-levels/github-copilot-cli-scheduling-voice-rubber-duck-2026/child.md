---
article: 'github-copilot-cli-scheduling-voice-rubber-duck-2026'
level: 'child'
---

GitHubは2026年6月2日に、GitHub Copilot CLIの新しい更新を出した。主な内容は、画面を見やすくする実験的なUI、別のAIに意見をもらうrubber duck、あとでpromptを送る `/after`、くり返しpromptを送る `/every`、声でpromptを入れるvoice inputだ。

簡単に言うと、Copilot CLIを「terminalで一度質問する道具」から、「少し長い作業をterminalで進め続ける道具」に近づける更新である。ただし、何でも自動で安全に動かしてよいという意味ではない。

## 何ができるようになったのか

`/every` は、決めた時間ごとに同じpromptをCopilotへ送る機能だ。たとえば「30分ごとにtestを実行して失敗をまとめて」と頼める。`/after` は、決めた時間がたったあとに1回だけpromptを送る機能だ。たとえば「10分後にdeploy画面が見えるか確認して」と頼める。

rubber duckは、Copilot CLIの中にいるcritic agentだ。Copilotが作ったplan、設計、実装、testを見て、見落としや問題点を指摘する。rubber duck自身がfileを書き換えるわけではなく、指摘を受けたCopilot本体が次にどうするかを決める。

voice inputは、keyboardで打つ代わりに話してpromptを入れる機能だ。GitHub Docsでは、音声の文字起こしはlocal machine上で行われ、audioはnetworkへ送られないと説明されている。ただし、現在の対応は英語とスペイン語のdictationで、日本語を自然に話して使う前提ではない。

## cloud automationとは違う

ここで大事なのは、CLIの `/every` や `/after` と、GitHub側のcloud automationは別物だという点だ。

CLIのscheduleは、開いているCopilot CLI sessionの中で動く。そのsessionが動いている間だけ有効だ。terminalを閉じたり、PCがsleepしたり、sessionを終えたりすると、正式な夜間jobのようには扱えない。

一方、GitHubのcloud agent automationsは、GitHub側にautomationを作って、scheduleやIssue/PRイベントでcloud agentを起動する。毎晩走らせる、PRが作られたら動かす、Issueを分類する、といったチーム運用にはcloud automationのほうが向いている。

CLIのscheduleは、自分が今やっている作業の少し先を自動化するものと考えると分かりやすい。たとえば、deployを待ちながら5分後に確認する、test修正中に30分ごとに再実行する、といった使い方だ。

## 日本のチームで注意すること

まず、rubber duckを「品質保証そのもの」と考えないことが大切だ。別のAIが意見をくれるのは役に立つが、最終的なcode review、security review、業務ルールの確認は人間が行う必要がある。大きな変更では、rubber duckの指摘をPR本文や作業メモに残すと、あとから確認しやすい。

次に、voice inputは端末ルールと合わせて考える必要がある。音声がlocalで処理されるとしても、会社のPCでmicrophoneを使ってよいか、会議室や客先で話してよいか、VDIで動くかは別問題だ。日本語入力が主なチームでは、まず英語promptに慣れている少人数で試すほうがよい。

最後に、費用を見る必要がある。Copilot CLIを使うとAI Creditsが消費される。`/every` やvoice inputで使いやすくなると、promptの回数も増えやすい。便利になった分、手戻りが減ったのか、それとも利用回数だけ増えたのかを見ないと、導入効果は判断できない。

## どこから試すか

最初は、開発基盤チームやPlatform Engineeringチームで試すのがよい。対象は、test再実行、PR comment確認、release note下書き、軽い調査のように、失敗しても捨てられる作業が向いている。

逆に、production database、認証、課金、個人情報、本番deployに直結する作業を、最初からCLI scheduleで動かすべきではない。そうした作業は、承認、ログ、停止条件、review担当を先に決めてから扱うべきだ。

GitHub Copilot CLIの今回の更新は、terminalでのAI作業を便利にする。しかし便利になるほど、どの作業を任せるか、どこで人間が止めるか、いくら使うかを決める必要がある。

## 出典

- [Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) - GitHub Changelog, 2026-06-02
- [Scheduling prompts in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/schedule-prompts) - GitHub Docs
- [Use voice input with Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/voice-input) - GitHub Docs
- [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) - GitHub Docs
