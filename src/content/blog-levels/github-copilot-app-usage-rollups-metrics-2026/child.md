---
article: 'github-copilot-app-usage-rollups-metrics-2026'
level: 'child'
---

GitHub Copilot app の利用指標が、Copilot usage metrics API の標準的な集計に入るようになった。簡単に言うと、Copilot app を使った作業が「app専用の数字」だけでなく、ユーザー別、機能別、モデル別、言語別、コード生成量、active user 数にも反映される。

この話は、[Copilot appの管理設定](/blog/github-copilot-app-policy-managed-settings-2026/)とセットで見ると分かりやすい。管理者は、誰に app を使わせるかを決めるだけでは足りない。使わせた後に、どの部署で、どのモデルを、どの言語の作業に、どれくらい使っているかを見られる必要がある。

## 何が変わったのか

GitHub は 2026年7月28日、Copilot app activity を Copilot usage metrics API のより広い rollup に入れると発表した。具体的には、enterprise-user report と organization-user report で、app を使った活動が個別ユーザーに紐づく。

また、`copilot_app` という feature value が追加される。これにより、`totals_by_feature`、`totals_by_model_feature`、`totals_by_language_feature`、`totals_by_language_model` の中で、Copilot app の活動を見られる。たとえば、app でどのモデルがよく使われたか、どの言語の作業に使われたかを、既存の report と同じ考え方で読める。

さらに、code generation、code acceptance、lines added、lines deleted といった上位のコード活動指標にも app activity が入る。`daily_active_users` も、Copilot app だけを使ったユーザーを数えるようになる。

## なぜ日本企業に関係するのか

日本企業では、Copilot の導入状況を月次で見る会社が増えている。active user、AI Credits、モデル別利用、部門別利用、PR の変化などを dashboard にしている場合、今回の変更は数字の意味を変える。

たとえば、7月28日以降に active user が増えたとしても、それは利用が急増したからとは限らない。Copilot app だけを使った人が新しく `daily_active_users` に入った影響かもしれない。だから、[Copilot impact dashboard](/blog/github-copilot-impact-dashboard-adoption-2026/)のような効果測定を見るときも、定義変更を一緒に確認したほうがよい。

費用面でも関係する。Copilot app は agent session や長い context を扱いやすい。高性能モデルを app で多く使うと、AI Credits の消費が増えやすい。以前の[Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)の考え方を、app 利用まで含めて見直す必要がある。

## まず何をすればよいか

最初に、社内のデータ辞書を直す。`daily_active_users` や `totals_by_feature` に Copilot app が含まれることを明記する。7月17日に app 専用 section が入り、7月28日に標準 rollup へ広がった、という時系列も残す。

次に、dashboard で Copilot app を分けて見られるようにする。全体の利用量だけを見ると、IDE、CLI、cloud agent、app の違いが隠れる。特に、急に利用が増えた部署や言語がある場合は、app 由来かどうかを確認する。

最後に、数字を個人評価へ直結させない。Copilot app をたくさん使った人が必ず良い成果を出したとは限らない。逆に、厳しいシステムでは app を使わないほうが正しい場合もある。指標は、利用を罰するためではなく、導入支援、費用管理、セキュリティ確認の優先順位を決めるために使うべきである。

## まとめ

今回の更新で、GitHub Copilot app は利用指標の本流に入った。日本企業は、Copilot app を有効にするかどうかだけでなく、利用データをどう読むかを更新する必要がある。月次 BI、AI Credits 管理、モデル別利用、言語別利用、導入効果測定を同じタイミングで見直すのが現実的である。

## 出典

- [GitHub Copilot app usage metrics now expand across report rollups](https://github.blog/changelog/2026-07-28-github-copilot-app-usage-metrics-now-expand-across-report-rollups/) - GitHub Changelog, 2026-07-28
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs, accessed 2026-07-29
- [GitHub Copilot app now available in the usage metrics API](https://github.blog/changelog/2026-07-17-github-copilot-app-now-available-in-the-usage-metrics-api) - GitHub Changelog, 2026-07-17
