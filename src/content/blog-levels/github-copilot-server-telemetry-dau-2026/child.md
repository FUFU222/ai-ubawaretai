---
article: 'github-copilot-server-telemetry-dau-2026'
level: 'child'
draft: false
---

GitHub は 2026年6月15日、Copilot の usage metrics で active user を数える方法を更新しました。これまでは、IDE などの client から送られる telemetry が中心でした。しかし、ネットワークや proxy、client settings の影響で、その情報が GitHub に届かないことがあります。その場合、実際には Copilot を使っている人でも、usage report では active user として見えないことがありました。

今回の変更では、GitHub 側の server-side telemetry で active と確認できる user も、enterprise single-day report と 28-day report に入ります。つまり、DAU や 28日 active user の数字が増える可能性があります。ただし、それは「急に利用が増えた」という意味ではなく、「これまで見えていなかった利用者が見えるようになった」という意味です。

## 何が変わったのか

GitHub の説明では、client telemetry はとても詳しい情報を持っています。どの IDE を使ったか、どの feature を使ったか、どの model を使ったか、コード生成に関する情報などです。しかし、その telemetry が届かないと、active な billed user でも report から抜けることがありました。

server-side telemetry を加えることで、GitHub はこの抜けを減らします。たとえば、これまで 1,000 daily active users と出ていた report が、今回の変更後に 1,050 と出るかもしれません。この追加分は、client telemetry では見えていなかったけれど、server-side telemetry では active と確認できた users です。

## 注意すること

注意点は、追加で見える users について、すべての詳細がすぐに分かるわけではないことです。GitHub は、server-side telemetry には IDE、feature、model、lines-of-code activity のような細かい per-interaction detail がまだないと説明しています。

そのため、DAU は増えたのに、IDE 別や feature 別の内訳が増えないことがあります。これは矛盾ではありません。active user としては見えるようになったが、何をどう使ったかの詳細分類はまだ空欄になりやすい、という状態です。

## 日本企業での見方

日本企業では、Copilot の導入状況を部門別に見たり、請求対象 seat と usage report を照合したりすることがあります。このとき、6月15日前後の数字をそのまま「利用が伸びた」と説明すると危険です。計測方法が変わったため、まず baseline を引き直す必要があります。

[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/) のように部門別の定着を見る場合は、6月15日以降を新しい基準にするのが安全です。また、[GitHub AI使用レポート、6月締めの請求列変更対応](/blog/github-ai-usage-report-fields-2026/) と同じく、社内 BI や spreadsheet には「この日から定義が変わった」と注記しておくべきです。

[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) と合わせて見ると、active user の数字と費用の数字は分けて考える必要があります。active user が多く見えるようになることと、AI Credits の消費が増えることは同じではありません。

## 実務で確認すること

まず、社内 dashboard に6月15日の注記を入れます。DAU や 28日 active user のグラフが急に上がっても、計測補正による上昇かもしれないからです。

次に、top-level の active user と、IDE 別・feature 別の内訳を分けて見ます。active user は増えているのに内訳が増えていない場合、server-side telemetry 由来の未分類 users が増えた可能性があります。

最後に、請求、activity log、usage metrics を同じ期間で比べます。GitHub は、今回の変更により report が activity log や billing に近づくと説明しています。情シス、開発部門、経理が同じ数字を見られるように、期間と scope をそろえることが大切です。

## まとめ

GitHub Copilot usage metrics は、server-side telemetry を使って active user の抜けを減らすようになりました。これにより DAU や 28日 active user は増える可能性があります。

ただし、それは必ずしも利用増ではありません。日本のチームは、6月15日以降を新しい baseline として扱い、active user totals と詳細内訳を分けて見るべきです。

## 出典

- [Copilot usage metrics now include more of your active users](https://github.blog/changelog/2026-06-15-copilot-usage-metrics-now-include-more-of-your-active-users/) - GitHub Changelog, 2026-06-15
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
