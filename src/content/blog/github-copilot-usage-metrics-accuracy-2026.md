---
title: 'GitHub Copilot使用指標補正、7月レポート比較の注意点'
description: 'GitHub Copilot usage metricsの集計精度が改善。CLI提案行数、IDE識別、AI Credits帰属の補正を整理し、日本企業が7月の増加を導入効果と誤認せず、月次レポートと予算比較を再基準化する手順を解説する。'
pubDate: '2026-07-04'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'Copilot CLI', 'SaaSコスト管理', '従量課金', '開発生産性', '管理者設定', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは2026年7月2日、**GitHub Copilot usage metrics**の集計精度と対象範囲を改善した。変更は3つある。Copilot CLIの提案行数がレポートへ入るようになり、サーバー側のtelemetryだけで確認されていた利用者にもIDEとplugin versionが表示され、これまで一部欠けていたAI Credits消費が正しいorganizationまたはenterpriseへ帰属するようになった。

管理者にとって重要なのは、7月の数値が増えても、それだけで利用拡大や生産性向上を意味しない点だ。同じ活動でも、計測対象の追加と帰属補正によって `loc_suggested_to_add_sum`、`totals_by_ide`、`ai_credits_used` が増える可能性がある。6月以前と7月以降をそのまま比較すれば、計測変更を導入効果と誤読しかねない。

今回の更新は、[Copilot導入cohortでAI活用度を部門別に測る方法](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)や、[Copilotチーム別metrics APIで部門予算を見る方法](/blog/github-copilot-team-metrics-api-2026/)と組み合わせて読む必要がある。また、AI Creditsは利用指標と請求管理で役割が異なるため、[AI Credits使用量レポートの見積もり方法](/blog/github-copilot-ai-credits-usage-report-2026/)とも照合したい。

## 事実: usage metricsで3つの補正が入った

1つ目は、Copilot CLIの提案行数だ。CLI activityが `loc_suggested_to_add_sum` と `loc_suggested_to_delete_sum` に反映されるようになった。これらは以前、CLIでは常に0だった。Copilot CLI 1.0.57以降が提案行数の対象となり、1.0.64以降では、同じeditを提案とacceptで二重に数えないようcode generationが重複排除される。

ただし、1.0.57以上1.0.64未満では、CLIのcode generation activityがわずかに過少集計される可能性がある。したがって、会社内で複数バージョンが混在している状態では、CLI利用者数やsession数だけでなく、`last_known_cli_version` も保存して比較条件へ入れる必要がある。

2つ目は、IDE識別の対象拡大だ。これまでサーバー側telemetryだけで確認されていた利用者についても、IDEとplugin versionが `totals_by_ide` に表示される。GitHubは、これにより `totals_by_ide` がより多くのCopilot利用者を反映すると説明している。IDE別の利用者が増えても、必ずしも新しい利用者が増えたとは限らない。従来「IDE不明」または内訳外だった人が分類された可能性を先に見るべきだ。

3つ目は、AI Creditsの帰属補正である。GitHubは、実際には利用しているのに一部ユーザーの値が `0.0` になる2つの問題を修正した。organizationに関連付けられていなかった消費が落ちていた問題と、サーバー側telemetryだけで見えていた利用者をbilling dataへ結び付けられていなかった問題だ。補正後は該当消費が正しいorganizationまたはenterpriseへ帰属し、`ai_credits_used` へ含まれる。

GitHubによれば、過去に見落とされていた利用分のAI Credits合計は増える一方、すでに報告済みだった値は変更されない。つまり、全利用者へ一律の倍率補正がかかるわけではない。影響は、organization未帰属の利用やserver-side-only userをどれだけ含んでいたかで変わる。

## 事実: dashboard、API、請求は同じ数字ではない

usage metricsを予算資料へ使う際は、データ面の違いを明確にする必要がある。GitHub Docsでは、dashboard、API、NDJSON exportは同じ基礎telemetryを使うが、集計と表示方法が異なると説明している。

dashboardは主に28日rolling window、APIとNDJSON exportは日次レコードである。さらにIDE telemetryは非同期処理され、直近日は不完全に見える場合がある。通常は丸3 UTC日以内に確定するため、月次締め当日に最新3日を確定値として扱うと、後日再取得した値とずれる可能性がある。

Copilot CLIもIDE指標とは別に集計される。GitHub Docsによると、CLI usageはIDE-based active user countや `totals_by_ide`、`totals_by_feature` へは入らず、`daily_active_cli_users` や `totals_by_cli` で扱う。今回CLIの提案行数が追加されたからといって、dashboard上のIDE active userへCLI利用者を単純に足せるわけではない。

また、per-user reportの `ai_credits_used` は消費分析用であり、請求書合計を再現する項目ではない。feature、model、surface別にも分解されない。予算差異を説明するときは、usage metricsで利用傾向を見て、billing reportやcost centerの課金情報で金額を確認する必要がある。

## 分析: 7月の増加を導入効果と断定できない

ここからは分析だ。

今回の補正は、実利用をより正確に見せる改善である。しかし時系列分析では、観測方法が変わった「計測上の段差」になる。7月のCLI提案行数、IDE別利用者、AI Creditsが6月より増えても、増加分には少なくとも3種類が混ざる。

第一は実際の利用増加だ。利用者が増えた、CLI sessionが増えた、より多くのAI Creditsを使ったという変化である。第二は計測範囲の拡大だ。以前0だったCLI提案行数や、内訳に入らなかったserver-side-only userが見えるようになった。第三は帰属の補正だ。実際には消費済みだったが、organizationやbilling dataとの対応付けに失敗していた値が入った。

usage metricsだけから、この3つを完全に分解できるとは限らない。だから月次報告では「7月に増えた」という結論より先に、計測変更日、CLI version分布、再取得日時、対象scopeを記録する必要がある。前年同月比や前月比のグラフには、2026年7月2日の仕様変更を注記し、補正前後を連続した同一定義の系列として扱わないほうが安全だ。

日本企業では、月初の経営会議、部門別原価配賦、半期KPI、ベンダー更新判断が同じデータへ依存することがある。指標の増加を「Copilot研修が成功した」「開発生産性が上がった」「予算超過が発生した」と即断すると、教育投資や予算削減の判断を誤る。利用量は成果ではなく、成果を説明するための入力データの1つにすぎない。

## 実務: 7月を再基準化する5つの手順

最初に、**計測変更の境界を固定する**。2026年7月2日をchange pointとしてデータ辞書へ登録し、変更前と変更後の定義を残す。レポートには「CLI提案行数、IDE識別、AI Credits帰属の精度改善により、7月以降は6月以前と単純比較できない」と注記する。

次に、**確定済み期間を再取得する**。直近3 UTC日はtelemetryが未確定の可能性があるため、比較には少なくとも4日前までの日次データを使う。NDJSON exportを保存している場合も、早い時点のexportと確定後の再exportを区別し、`created_at` または取得時刻を残す。

3つ目に、**CLI versionを揃える**。提案行数は1.0.57以降、重複排除は1.0.64以降という境界がある。標準バージョンを1.0.64以降へ上げ、古いversionの比率をレポートする。移行中は、CLI LoCの増減を導入効果KPIへ直接使わず、session count、request count、prompt countと併記する。

4つ目に、**scopeごとの役割を分ける**。enterprise全体の傾向はaggregated report、部門分析はper-user reportとuser-teams reportのjoin、請求はbilling reportを正とする。[チーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)で注意した通り、複数チーム所属を単純合計すると二重計上が起こり得る。usage metricsの `ai_credits_used` を請求書の代替にしない。

最後に、**成果指標と分離して再評価する**。利用増加と同じ期間のPR lead time、review turnaround、defect、revert、開発者アンケートを確認する。CLI提案行数が増えても、accepted LoCや成果物品質が同じなら、計測範囲の追加または無効な提案の増加かもしれない。逆にAI Creditsが増えても、移行工数や障害対応時間が下がっていれば、予算増に合理性がある。

## 月次レポートに入れる注記例

社内資料では、次のように事実と評価を分けると誤読を減らせる。

> 2026年7月2日、GitHub Copilot usage metricsでCLI提案行数、IDE識別、AI Credits帰属の集計精度が改善された。7月の増加には計測対象追加と帰属補正が含まれる可能性があるため、6月以前との単純な増減率は導入効果の判定に使用しない。CLI 1.0.64以降への更新と、3 UTC日経過後の再取得を完了してから新しいbaselineを設定する。

そのうえで、表にはreport scope、対象期間、取得日時、CLI version構成、active users、CLI sessions、suggested LoC、acceptedまたはadded LoC、AI Credits、請求額、成果指標を並べる。1つの「Copilot利用率」へまとめるより、どの観測面が動いたかを分けたほうが意思決定に使いやすい。

## 管理者チェックリスト

- 2026年7月2日の計測変更をデータ辞書と月次資料へ記録した
- Copilot CLIを1.0.64以降へ更新する計画がある
- `last_known_cli_version` とreport取得日時を保存している
- 直近3 UTC日を暫定値として扱っている
- dashboardの28日windowとAPIの日次集計を直接比較していない
- CLI usageをIDE active userへ混ぜていない
- `ai_credits_used` を請求書合計の代替にしていない
- enterprise、organization、teamのscopeを揃えている
- 7月以降に新しいbaselineを設定している
- 利用量とPR品質、障害率、開発者体験を分けて評価している

## まとめ

GitHub Copilot usage metricsの精度改善により、CLI提案行数、IDE別利用、AI Credits消費が以前より完全に見えるようになった。管理者にとっては歓迎すべき更新だが、7月のグラフには計測上の段差が入る。

日本企業は、2026年7月2日を比較境界として明示し、CLI 1.0.64以降へ揃え、確定後の日次データを再取得する必要がある。usage metricsは利用分析、billing reportは請求照合、PRや品質指標は成果評価という役割分担も崩さないほうがよい。

7月の数値が増えたときに問うべきなのは「Copilotの効果が上がったか」だけではない。「実利用が増えたのか、見える範囲が増えたのか、帰属が直ったのか」を先に切り分ける。新しいbaselineを設定してから、予算と成果を改めて比較するのが実務的である。

## 出典

- [Improved accuracy and coverage in Copilot usage metrics reports](https://github.blog/changelog/2026-07-02-improved-accuracy-and-coverage-in-copilot-usage-metrics-reports/) - GitHub Changelog, 2026-07-02
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [Reconciling Copilot usage metrics across dashboards, APIs, and reports](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/reconciling-usage-metrics) - GitHub Docs
