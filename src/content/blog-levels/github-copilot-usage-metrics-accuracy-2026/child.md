---
article: 'github-copilot-usage-metrics-accuracy-2026'
level: 'child'
---

GitHubは2026年7月2日、会社の管理者が見る**GitHub Copilot usage metrics**を、より正確にしました。usage metricsは、Copilotを何人が使ったか、どれくらいコードを提案したか、AI Creditsをどれくらい使ったかを見るレポートです。

今回、Copilotの機能や料金が変わったわけではありません。今までレポートへ正しく入っていなかった一部の活動が見えるようになりました。そのため、7月の数字が6月より増えても、全てを「Copilotをたくさん使うようになった」と考えるのは危険です。

## 何が変わったの？

変更は3つあります。

1つ目は、**Copilot CLIの提案行数**です。Copilot CLIはterminalからAIへ作業を頼む道具です。以前は、CLIが追加や削除を提案したコード行数がレポートで0になっていました。これからは `loc_suggested_to_add_sum` と `loc_suggested_to_delete_sum` に入ります。

提案行数が入るのはCopilot CLI 1.0.57以降です。1.0.64以降では、同じ編集を二重に数えない改善も入ります。会社の中で古いversionと新しいversionが混ざっていると、利用量を公平に比較しにくくなります。

2つ目は、**IDEの識別**です。IDEはVS CodeやJetBrains製品のような開発道具です。今まではサーバー側で利用が分かっていても、どのIDEやpluginを使ったか分からない人がいました。今回の改善で、その人たちのIDEやplugin versionも `totals_by_ide` に現れます。

3つ目は、**AI Creditsの帰属**です。実際にはAI Creditsを使っているのに、organizationとの結び付きやbilling dataとの照合に失敗し、`0.0` と表示される場合がありました。修正後は、見落とされていた利用が正しいorganizationまたはenterpriseへ入ります。

## なぜ7月の数字が増えるの？

たとえば6月も7月も同じ量の仕事をしたとします。それでも、6月はCopilot CLIの提案行数が0で、7月から正しい行数が入れば、グラフは急に増えます。IDE別の人数やAI Creditsでも同じことが起こります。

数字が増える理由は3つに分けられます。実際に利用が増えた、今まで見えていなかった活動が見えるようになった、間違った場所にあった利用が正しい場所へ移った、の3つです。

レポートだけで3つを完全に分けられない場合もあります。そのため会社は、2026年7月2日に計測方法が変わったことをグラフへ書き、新しい基準を作る必要があります。7月と6月の増加率だけで、研修の成功や開発生産性の向上を決めてはいけません。

## dashboardとAPIは同じ見方ではない

GitHubのdashboard、API、NDJSON exportは、同じ元データを使っています。しかし、まとめ方や表示方法が違います。

dashboardは主に過去28日間をまとめて表示します。APIやNDJSON exportは日ごとの記録です。また、IDEから送られる情報はすぐに全て確定するとは限りません。GitHub Docsでは、通常は丸3 UTC日以内に確定すると説明しています。昨日の利用が少なく見えても、数日後には増える場合があります。

Copilot CLIの利用もIDEの利用とは別に集計されます。CLIだけを使った人を、IDEを使ったactive userと同じものとして足し算することはできません。

さらに、usage metricsの `ai_credits_used` は利用傾向を見る数字です。請求書の金額そのものではありません。お金を確認するときはbilling reportも一緒に見ます。

## 会社の管理者は何をすればいい？

まず、Copilot CLIを1.0.64以降へ揃える計画を作ります。誰がどのversionを使っているかも保存します。versionが違う期間は、提案行数だけでチームを比較しないようにします。

次に、最新3日間の数字を暫定値として扱います。月末の翌朝に取得したデータを最終値にせず、数日後にもう一度取得します。いつ取得したデータなのかも記録します。

そして、2026年7月2日より前と後を別の基準で見ます。社内レポートには「7月から計測範囲と帰属が改善されたため、6月以前と単純比較できない」と書きます。7月以降のデータが安定したら、それを新しいbaselineにします。

最後に、利用量と成果を分けます。コードの提案行数やAI Creditsが多いだけでは、仕事が速くなったとは言えません。PRを完成する時間、レビューの待ち時間、バグや修正の数、開発者の感想も一緒に確認します。

## まとめ

GitHub Copilot usage metricsは、Copilot CLIの提案行数、IDEの識別、AI Creditsの帰属が正確になりました。今まで見えていなかった活動が見えるため、7月の数字は増える可能性があります。

管理者は、増加をすぐに利用拡大や生産性向上と決めず、計測方法が変わった影響を分けて考える必要があります。CLI versionを揃え、数日後にデータを再取得し、7月以降に新しい比較基準を作ることが大切です。

## 出典

- [Improved accuracy and coverage in Copilot usage metrics reports](https://github.blog/changelog/2026-07-02-improved-accuracy-and-coverage-in-copilot-usage-metrics-reports/) - GitHub Changelog, 2026-07-02
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [Reconciling Copilot usage metrics across dashboards, APIs, and reports](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/reconciling-usage-metrics) - GitHub Docs
