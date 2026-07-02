---
article: 'github-copilot-cli-ai-credit-session-limits-2026'
level: 'child'
---

GitHubは2026年7月1日、GitHub Copilot CLIとSDKへ**AI credit session limit**を追加しました。これは、agentへ1回の仕事を頼んだとき、そのsessionで使うAI Creditsに上限を付ける機能です。

たとえば、夜中にtest失敗を調査させる処理へ100 creditsの上限を設定できます。GitHub Docsでは1 AI Creditを0.01米ドルと説明しているため、100 creditsは1米ドル相当が目安です。ただし、必ず1米ドル以内で止まるhard capではありません。

## なぜsoft capなのか

session limitは**soft limit**です。modelが回答を作っている途中で上限へ達しても、その回答は途中で切られません。回答が終わってから停止するため、実際の利用量は設定値を少し超える可能性があります。

利用量には、画面で見える質問と回答だけでなく、model call、subagent、contextを短くまとめるcompactionなども含まれます。複数のsubagentを使うtaskでは、質問回数が少なくてもcreditsが多くなることがあります。

そのため、上限を「絶対に超えない請求額」として会計処理へ使うのは危険です。「このtaskが想定外に長く走り続けないようにする停止目安」と考えるのが適切です。

## 対話中は`/limits`を使う

Copilot CLIを人が操作しているinteractive sessionでは、次のように設定します。

```text
/limits set max-ai-credits 100
```

上限を外す場合は `/limits unset` を使います。上限へ達するとCopilotが知らせます。必要なら値を増やし、同じsessionを続けられます。最初からtaskをやり直す必要はありません。

GitHub Docsには、30 creditsより大きい値を使うのが実用的だという注意があります。多くのmodel callが20 creditsを超えるため、小さすぎる値では意味のある作業を始めた直後に止まりやすいからです。まず少量のtaskで実測し、必要な上限を調整します。

## 無人実行は`--max-ai-credits`を使う

scriptやschedulerから人のいない状態で起動するときは、次のように指定します。

```bash
copilot -p "失敗したテストを調べて原因をまとめる" --max-ai-credits 100
```

noninteractive runでは、上限へ達すると処理が終了します。自動的に追加費用を許可して続ける仕組みではありません。呼び出し側が、途中結果を保存する、人へ通知する、残りのtaskを小さくして再実行する、または打ち切る必要があります。

[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)のような無人処理では、上限値だけでなく、停止時に何を残すかが重要です。調査メモ、変更済みfile、test log、未完了項目が残っていれば、次回は続きから始めやすくなります。

## 月次予算とは別の機能

session limitと会社の月次budgetは役割が違います。[GitHub Copilot AI Creditsの予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)は、組織や利用者が1か月に使う総量を管理します。session limitは、その中の1回だけを管理します。

1回100 credits以内でも、同じautomationを100回動かせば利用量は積み上がります。反対に、月次budgetだけでは、上限へ達するまで1回の大きなtaskが多くのcreditsを使う可能性があります。会社のbudgetとsession limitを両方使うことで、全体と1回あたりを別々に制御できます。

日本のチームが最初に試すなら、Issue要約、test失敗の一次調査、release noteの下書きなど、途中で止まっても本番へ影響しない仕事が向いています。認証、課金、database migration、本番設定の変更は、停止時の整合性と人の承認を先に決める必要があります。

## 導入時に確認すること

各automationについて、次を決めます。

- 1回のtaskで何を完了とするか
- 初期のcredit上限と、その根拠
- 上限到達時に保存する成果物
- 再実行する条件と最大回数
- 人へ引き継ぐ条件
- 月次budgetの担当部門

上限が安いほど良いわけではありません。安すぎると未完了runと再実行が増え、合計費用や確認作業が増える場合があります。上限到達率、完了率、再実行率、1件あたりcreditsを見ながら調整します。

## まとめ

AI credit session limitは、Copilot CLIとSDKの1回のtaskへ費用の停止目安を付ける機能です。人が操作する場合は `/limits`、無人処理は `--max-ai-credits` を使います。

soft capなので少し超える可能性があり、月次budgetの代わりにはなりません。taskを小さく分け、途中結果を残し、止まった後の判断を決めておくことで、無人agentを扱いやすくできます。

## 出典

- [Set AI credit session limits in Copilot CLI and SDK](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) - GitHub Changelog, 2026-07-01
- [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) - GitHub Docs, accessed 2026-07-02
- [Optimizing your AI usage to maximize efficiency and reduce cost](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) - GitHub Docs, accessed 2026-07-02
