---
article: 'github-copilot-impact-dashboard-adoption-2026'
level: 'child'
---

GitHub は **2026年7月22日**、GitHub Copilot の使われ方を見るための **impact dashboard** を公開しました。これは、Copilot を何人が使っているかだけではなく、どのくらい深く使われているか、そして pull request の流れにどんな違いが出ているかを見るための管理者向け画面です。

これまで Copilot の導入効果は、active user 数やライセンス数で語られがちでした。しかし、補完だけを使う人と、agent や code review まで使う人では、開発の進め方がかなり違います。impact dashboard は、その違いを段階ごとに見えるようにします。

## 何が新しいのか

新しい dashboard は、Copilot を使う人をいくつかの cohort に分けます。Phase 1 は Code-first、Phase 2 は Agent-first、Phase 3 は Multi-agent または Copilot app を使う段階です。さらに、ライセンスはあるけれど十分に使っていない Passive users も分けて見られます。

それぞれの cohort について、月あたりの merged pull request、pull request が merge される速さ、ユーザー数、全体に占める割合などが表示されます。つまり、「使っている人が多いか」だけではなく、「深く使っている人たちの PR の流れはどうか」を見られます。

## なぜ大事なのか

Copilot は、最初はコード補完の道具として使われることが多いです。しかし、今は Copilot CLI、cloud agent、code review、Copilot app など、開発作業をまとめて支援する機能が増えています。

そのため、active user 数だけでは足りません。毎日少し補完を使う人と、agent に issue 修正を任せる人を同じ1人として数えると、導入効果を見誤ります。

[Copilot導入cohortの記事](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)で扱ったように、GitHub は AI adoption phase という考え方を usage metrics に入れています。今回の dashboard は、それを管理画面で見やすくしたものです。

## 日本企業ではどう使うか

日本企業では、部門ごとに Copilot の使い方が違います。新しい開発基盤チームでは agent を試しやすくても、基幹システムや委託先が関わる repository では慎重に進める必要があります。

impact dashboard を使うなら、まず部門ごとに Passive、Phase 1、Phase 2、Phase 3 の比率を見ます。Passive が多いなら、ライセンス配布や IDE 設定がうまくいっていないかもしれません。Phase 1 で止まっているなら、code review や cloud agent の使い方を小さく試す余地があります。

次に、pull request の指標を見ます。[GitHub Copilot repo指標の記事](/blog/github-copilot-repo-usage-metrics-ga-2026/)と合わせると、どの repository で PR の流れに変化が出ているかを考えやすくなります。

## 注意すること

この dashboard は便利ですが、数字だけで「Copilot が成果を出した」と決めるものではありません。もともと開発が活発なチームほど、Copilot も深く使い、PR も多い可能性があります。

また、Phase 3 の人数を増やすことだけを目標にすると、必要のない agent 機能まで使う行動が生まれるかもしれません。大事なのは、部門や repository の状況に合った使い方になっているかを見ることです。

[Copilot使用量レポートの記事](/blog/github-copilot-ai-credits-usage-report-2026/)で見たように、AI Credits の費用も別に管理する必要があります。深い利用が増えると費用も増えやすいため、PR の改善、レビュー負荷、教育投資と一緒に見るのが安全です。

## まとめ

Copilot impact dashboard は、Copilot の導入状況を「使っている人数」から「どの段階まで使われ、PR の流れにどう出ているか」へ進める機能です。

日本企業では、月次の導入レビューで使うのが現実的です。cohort、PR 指標、repository、AI Credits を分けて見れば、Copilot を広げるべき場所、教育が必要な場所、まだ慎重に進めるべき場所を判断しやすくなります。

## 出典

- [New Copilot usage metrics impact dashboard](https://github.blog/changelog/2026-07-22-new-copilot-usage-metrics-impact-dashboard/) - GitHub Changelog, 2026-07-22
- [Viewing the Copilot impact dashboard](https://docs.github.com/en/copilot/how-tos/administer-copilot/view-impact-dashboard) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
