---
article: 'github-copilot-app-usage-rollups-metrics-2026'
level: 'expert'
---

GitHub Copilot app の usage metrics rollup 統合は、単なるフィールド追加ではない。Copilot app という agent-native desktop surface が、Copilot usage metrics API の user、feature、model、language、code activity、active-user count の標準集計へ入る変更である。企業のデータ基盤から見ると、これは「新しい dashboard が増えた」ではなく、「既存 dashboard の分母と分類が変わった」と読むべき更新だ。

既にこのサイトでは、[Copilot impact dashboard](/blog/github-copilot-impact-dashboard-adoption-2026/)で adoption cohort と PR output を、[Copilot app policy と managed settings](/blog/github-copilot-app-policy-managed-settings-2026/)で app の利用制御を扱った。今回の更新は、その2つをデータ運用で接続する。つまり、app を許可した後に、誰が、どの model で、どの language の作業をし、どれだけ code activity と AI Credits に効いたかをどう読むかである。

さらに、[GitHub AI usage report fields](/blog/github-ai-usage-report-fields-2026/)で扱った列定義の変更や、[Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)で扱った予算統制とも直結する。Copilot app activity が標準 rollup に入ると、AI Credits、モデル配賦、言語別利用、active user、code generation の報告線を同時に更新しなければならない。

## 事実: 7月28日のrollup統合で何が入ったか

GitHub は 2026年7月28日、Copilot app usage metrics が Copilot usage metrics API のより広い rollup へ広がったと発表した。Changelog の主なポイントは4つである。

第一に、individual Copilot app activity が enterprise-user report と organization-user report で users に attribution される。これにより、管理者は app activity を enterprise 全体の総量だけでなく、ユーザー単位で読める。

第二に、`totals_by_copilot_app` の user-level section が入り、session count、request count、prompt count、token usage breakdown を扱える。これは 7月17日の専用 section 追加で示された方向性を、個別ユーザーの分析へ広げる意味を持つ。

第三に、`copilot_app` feature value が `totals_by_feature`、`totals_by_model_feature`、`totals_by_language_feature`、`totals_by_language_model` へ入る。これが最も重要である。app activity が feature/model/language の標準 dimension に入るため、既存の BI で Copilot app を比較対象として扱える。

第四に、top-level の code generation、code acceptance、lines added、lines deleted totals と `daily_active_users` に app activity が反映される。これにより、Copilot app だけを使ったユーザーや app 由来のコード活動が、従来よりも見えやすくなる。

## 事実: GitHub Docs上のmetrics構造とどう接続するか

GitHub Docs の Copilot usage metrics reference は、dashboard と API が adoption、usage、code generation activity を一貫した fields で表すと説明している。reports は scope と granularity によって形が違う。per-user reports は `user_id`、`user_login`、`ai_credits_used`、`used_*` indicators、`ai_adoption_phase` を持ち、aggregated reports は active-user counts、pull request activity、`totals_by_ai_adoption_phase` などを持つ。

この構造では、`totals_by_*` fields が重要になる。Docs は、`totals_by_ide`、`totals_by_feature`、`totals_by_language_feature`、`totals_by_language_model`、`totals_by_model_feature` を breakdown objects として定義している。各 object は dimension fields と metric fields を持つ。今回の更新は、この dimension の中に `copilot_app` を入れる変更である。

REST API 側では、enterprise、organization、repository、user-level の reports を download link で取得する。28-day report は daily aggregated records の配列を含み、repository-level report は PR activity があった repository を1行として扱う。つまり、app activity の追加は API endpoint そのものの使い方よりも、取得後の NDJSON / warehouse / BI transformation に影響する。

また、reconciliation docs は、dashboard、API、export files が同じ underlying telemetry から派生していても、aggregation と presentation が違うと説明している。IDE telemetry が無効な場合は detailed IDE-based breakdown に出ない一方、server-side telemetry によって active-user counts に現れる場合がある。Copilot app activity を読むときも、この前提を忘れると「ユーザー数は合うが breakdown が合わない」問題を誤診しやすい。

## 分析: 既存BIで壊れやすい箇所

ここからは分析である。

最初に壊れやすいのは時系列である。`daily_active_users` に Copilot app-only users が入ると、7月28日を境に active user が増えたように見える場合がある。これは真の adoption 増加かもしれないが、定義変更による観測範囲の拡張かもしれない。BI では、少なくとも `metric_definition_version` か注釈を持たせ、7月17日と7月28日の変更を表示できるようにしたほうがよい。

次に壊れやすいのは feature mapping である。既存の transformation が `feature in ('ask','edit','agent','code_completion')` のような固定列挙で作られている場合、`copilot_app` が unknown や others に落ちる可能性がある。unknown に落ちるだけならまだよいが、集計から除外されると、app activity が top-level totals には入るのに breakdown には出ないように見える。

model別費用の読みも変わる。Copilot app は agent session、cloud sandbox、複数ファイル編集、長い context、model selection と相性がよい。`totals_by_model_feature` に app activity が入ると、特定 model の request や token usage が増えることがある。これを「IDE chat の使いすぎ」と誤解すると、現場に効かない制限を入れることになる。必要なのは model x feature x organization の分解である。

language別 productivity も注意がいる。`totals_by_language_feature` と `totals_by_language_model` に app activity が入ることで、特定言語の generated / accepted code activity が増える場合がある。しかし、それはその言語で生産性が上がった証明ではない。app が migration や cleanup のために一時的に大量の files を触った可能性もある。言語別の数字は、repository-level PR activity、review comments、CI failures と合わせて読むべきだ。

code activity totals は、最も誤用されやすい。lines added や lines deleted が増えたことは、価値が増えたことを直接意味しない。agent が冗長な変更を作った、生成後に人間が削った、review で戻された、CI が落ちた、という可能性もある。日本企業の月次報告では、code activity は throughput の補助指標であり、品質・価値・売上の proxy として単独利用しないことを明文化したほうがよい。

## 実務: warehouse側で追加する設計

まず、raw layer は GitHub の report shape をそのまま保存する。enterprise-1-day、enterprise-28-day、org-1-day、org-28-day、user-level、user-teams、repository-level を別 table または partition として置き、source URL、report_start_day、report_end_day、created_at、ingested_at を保存する。GitHub の signed URL は期限付きなので、取得時点の raw NDJSON 保持が重要である。

次に、normalized layer で `surface` または `feature_surface` を作る。`totals_by_feature.feature = 'copilot_app'` を surface として扱い、IDE、CLI、cloud agent、code review、app と並べる。CLI は `totals_by_cli` と `daily_active_cli_users` が別扱いなので、同じ dimension に寄せる場合は出典 field を残す。

第三に、definition window を持つ。2026-07-17 以前、2026-07-17 から 2026-07-27、2026-07-28 以降で app metrics の見え方が違う。7月17日は dedicated app section の追加、7月28日は standard rollup integration として、BI の注釈に残す。月次 KPI を作る場合、7月分は日割りで分解しないと、前月比較が荒くなる。

第四に、cost allocation は user-level と model-level を分ける。GitHub Docs は `ai_credits_used` を per-user reports に含めるが、これは consumption analysis のための値であり、請求総額そのものとは限らない。部門配賦では `ai_credits_used` を user/team/org に寄せ、model/feature/language breakdown は「消費原因を推定する補助線」として扱うほうが安全である。

第五に、team-level metrics は join 前提で設計する。Docs は team-level totals が事前集計されず、user-teams report と per-user usage metrics report を join して構成すると説明している。日本企業では兼務、出向、委託、複数 organization 所属があるため、team join の有効日、優先部門、cost center mapping を別 table で管理したほうがよい。

## 実務: 監査・費用・導入支援の3画面に分ける

1つ目は監査画面である。見るべきものは、Copilot app activity users、app session count、request count、prompt count、token usage、app を使った organization、利用 model、利用 language である。ここでは個人を責めるのではなく、policy と managed settings の適用範囲が期待通りかを見る。

2つ目は費用画面である。`ai_credits_used`、model x feature、organization、team、cost center を並べる。高額 model の利用が増えたとき、app 由来なのか IDE agent 由来なのか、特定 language の migration 由来なのかを切り分ける。ここで [Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/) の共有プール、user-level budget、cost center budget と接続する。

3つ目は導入支援画面である。impact dashboard の adoption cohort と app activity を合わせる。Phase 2 や Phase 3 が増えているのに app activity が少ないなら、app ではなく IDE / cloud agent 中心で成熟している可能性がある。逆に app activity は多いが PR output や review quality が伸びないなら、workflow training、repository hygiene、test automation、branch protection の見直しが必要になる。

この3画面を分ける理由は、同じ数字を違う目的に使うと運用が壊れるからである。監査画面は安全性、費用画面は配賦、導入支援画面は改善策を決める。1つのランキングにまとめると、現場は「AIを使った量」で評価されていると受け止め、必要のない agent session を増やす可能性がある。

## 注意点: telemetry欠落とserver-side users

Copilot usage metrics は便利だが、完全な観測ではない。Docs は、IDE telemetry が無効な場合、per-IDE、per-feature、lines-of-code breakdown のような detailed activity が出ないことがあると説明している。一方で、server-side telemetry によって active user counts にだけ現れる場合もある。

これは Copilot app 統合後に特に重要になる。`daily_active_users` は増えているのに `totals_by_feature` の app activity が思ったほど増えない、という状況が起きたとき、原因は利用実態ではなく telemetry path の違いかもしれない。月次 BI では、active-user count と breakdown totals を常に reconcile し、不一致を障害ではなく仕様差として扱う手順を持つべきである。

また、CLI metrics は IDE telemetry と別に collect/report される。Copilot app、CLI、cloud agent、IDE agent を同じ agentic development として見たい気持ちは分かるが、出典が違うものを無理に足し合わせると、重複や欠落を生む。normalized layer では `source_report_type` と `source_metric_family` を残すことが重要である。

最後に、Copilot app の利用が増えたことを生産性向上の証明として扱わない。利用量、code activity、AI Credits は導入管理の材料であり、成果そのものではない。PR throughput、merge velocity、review defects、incident、cycle time、開発者満足度、問い合わせ件数と合わせて、はじめて判断に近づく。

## まとめ

GitHub Copilot app usage metrics の rollup 統合は、Copilot app を enterprise metrics の周辺機能から本流へ移す更新である。user attribution、`copilot_app` feature value、model/language breakdown、code activity totals、daily active users への反映により、app の利用実態を既存の usage metrics と同じ枠で扱えるようになる。

日本企業がやるべきことは明確である。7月28日以降の定義変更をデータ辞書に入れ、BI の feature mapping を更新し、app を surface として分離し、AI Credits と model/language breakdown の読み方を直す。Copilot app を展開するなら、管理ポリシーだけでなく、月次レポートの分母、注釈、配賦、導入支援の見方まで同時に更新するべきである。

## 出典

- [GitHub Copilot app usage metrics now expand across report rollups](https://github.blog/changelog/2026-07-28-github-copilot-app-usage-metrics-now-expand-across-report-rollups/) - GitHub Changelog, 2026-07-28
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs, accessed 2026-07-29
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/rest/copilot/copilot-usage-metrics) - GitHub Docs, accessed 2026-07-29
- [Reconciling Copilot usage metrics across dashboards, APIs, and reports](https://docs.github.com/enterprise-cloud@latest/copilot/reference/copilot-usage-metrics/reconciling-usage-metrics) - GitHub Docs, accessed 2026-07-29
- [GitHub Copilot app now available in the usage metrics API](https://github.blog/changelog/2026-07-17-github-copilot-app-now-available-in-the-usage-metrics-api) - GitHub Changelog, 2026-07-17
