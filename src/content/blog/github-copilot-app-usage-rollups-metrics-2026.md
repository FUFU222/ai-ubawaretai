---
title: 'GitHub Copilot app利用指標統合、月次BIの再設計'
description: 'GitHub Copilot app利用指標のrollup統合を解説。日本企業がユーザー別、モデル別、言語別の月次BIとAI Credits管理、効果測定をどう更新すべきか整理する。'
pubDate: '2026-07-29'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '管理者設定', '開発者ツール', '日本企業', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年7月28日**、GitHub Copilot app の利用指標を Copilot usage metrics API のより広い rollup に統合した。これまで app の利用は専用 section で見える範囲が中心だったが、今回から user-level report、feature、model、language、code activity、daily active users の集計に入る。

この更新は、[Copilot impact dashboard](/blog/github-copilot-impact-dashboard-adoption-2026/)で扱った導入効果測定と、[Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/)で扱った利用可否・managed settings の次に来る話である。app を誰に開けるかを決めた後、管理者は「その app 利用がどのユーザー、どのモデル、どの言語、どのコード活動に現れたか」を月次で読めるようにする必要がある。

さらに、[AI使用レポートの請求列変更](/blog/github-ai-usage-report-fields-2026/)や[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)をすでに運用へ入れている企業では、BI の前提をそのままにしないほうがよい。Copilot app が標準 rollup に入ると、active user、model別利用、language別利用、lines of code 指標の分母が変わる可能性がある。

## 事実: Copilot app activityが標準rollupへ入った

GitHub Changelog によると、今回の更新では Copilot app activity が enterprise-user report と organization-user report で個別ユーザーへ attribution される。これにより、app を使ったユーザーを識別し、session、request、prompt、token usage をユーザー単位で見やすくなる。

また、`copilot_app` という feature value が追加され、`totals_by_feature`、`totals_by_model_feature`、`totals_by_language_feature`、`totals_by_language_model` に app 活動が入る。つまり、app でどの model が使われ、どの language の作業に寄っているかを、既存の dimensional breakdown と同じ形で扱えるようになる。

コード活動の扱いも変わる。GitHub は、top-level の code generation、code acceptance、lines added、lines deleted の totals に Copilot app activity が含まれると説明している。加えて、`daily_active_users` は Copilot app だけを使ったユーザーも数えるようになる。

ここで重要なのは、GitHub Copilot app が単なるチャット client ではないことだ。app は agent session、cloud sandbox、branch、pull request、model selection、MCP、skills などを扱う開発面である。その活動が標準指標に入ると、従来の IDE や chat 中心のダッシュボードに、agent desktop の作業量が混ざってくる。

## 事実: 7月17日の専用sectionから一段進んだ

7月17日の GitHub Changelog では、Copilot usage metrics API に `daily_active_copilot_app_users` と `totals_by_copilot_app` が追加された。これは、enterprise と organization の 1-day / 28-day reports で app の distinct active users、session count、request count、prompt count、token usage を見るための更新だった。

ただし、その時点では app usage は専用 section として扱われ、feature、model、language、lines-of-code の汎用 rollup とは分けて説明されていた。7月28日の更新は、この段階からさらに進み、app 活動を標準の比較軸へ畳み込む変更である。

GitHub Docs の usage metrics reference では、dashboard と API は adoption、usage、code generation activity を一貫した fields で表すと説明されている。per-user reports には `user_id`、`user_login`、`ai_credits_used`、`used_*` indicators、`ai_adoption_phase` が入り、aggregated reports には active-user counts、pull request activity、adoption phase totals などが入る。

同じ Docs では、`totals_by_*` は breakdown object の array で、feature、language、model などの dimension を持つと整理されている。今回の `copilot_app` feature value は、この枠組みの中に app を入れるものだ。日本企業のデータチームから見ると、新しい列が増えただけでなく、既存集計の意味が更新されたと考えたほうがよい。

## 分析: 月次BIの数字は連続性を失う可能性がある

ここからは分析である。

最初に確認すべきは active user の段差だ。7月28日以降、Copilot app だけを使ったユーザーが `daily_active_users` に入るなら、導入率や利用率の時系列が急に上がることがある。これは利用が突然伸びた場合もあるが、定義変更で見える範囲が増えただけの場合もある。

次に、model別の費用読みが変わる。Copilot app は agent session や長い context を扱いやすく、モデル選択の幅も広い。`totals_by_model_feature` に app 活動が入ると、これまで IDE chat や agent mode として見ていた model mix に app の作業が混ざる。高性能 model の利用増を見つけたとき、それが VS Code 由来なのか app 由来なのかを分けて説明できなければ、費用対策が粗くなる。

language別の見方も変わる。app が repository 横断の修正、複数 file の変更、agent session の生成物を扱うなら、`totals_by_language_feature` や `totals_by_language_model` の language distribution にも影響する。特定言語の app 利用が増えているなら、その言語の CI、formatter、test、review owner が agent 作業に耐えられているかを見る必要がある。

lines of code 指標は特に慎重に読むべきだ。top-level の code generation、acceptance、lines added、lines deleted に app activity が入ると、過去の IDE 中心の値と比較したときに、増減の理由が分かりにくくなる。日本企業の月次会議で「Copilot によるコード量が増えた」と報告するなら、定義変更、app rollout、対象組織、利用ポリシーを同じスライドに書いたほうがよい。

## 実務: 30日で直すdashboardとデータ辞書

最初の1週間は、データ辞書を更新する。`daily_active_users`、`totals_by_feature`、`totals_by_model_feature`、`totals_by_language_feature`、`totals_by_language_model`、code activity totals に Copilot app が含まれる前提を明記する。7月17日以前、7月17日から7月27日、7月28日以降で app 指標の扱いが違うことも注記する。

2週目は、BI に surface dimension を追加する。`copilot_app` を feature として扱えるなら、IDE、CLI、cloud agent、code review、app を同じ dashboard で見るだけでなく、必要な画面では app を除外した比較も残す。これは、過去との連続性を見るためである。

3週目は、費用と adoption をつなぎ直す。per-user report の `ai_credits_used` は消費分析のための値であり、請求そのものの完全な代替ではない。とはいえ、user、feature、model、language の breakdown と組み合わせれば、どの部門が app で重い agent work を増やしているかを早く見つけられる。

4週目は、運用会議の見方を変える。app 利用が増えている部門には、[Copilot app統制](/blog/github-copilot-app-policy-managed-settings-2026/)で整理した policy、managed settings、plugin allowlist、approval prompt の状態を合わせて確認する。impact dashboard の cohort が進んでいる部門には、PR throughput だけでなく review 負荷、CI再実行、AI Credits、手戻りも見る。

## 注意点: 生産性評価に直結しない

Copilot app activity が標準 rollup に入ると、管理者は個人別の利用を見やすくなる。しかし、個人評価へ直結させるのは危険である。app を多く使った人が必ず高い成果を出したとは限らない。逆に、基幹系や規制業務では、意図的に app を使わせない判断もあり得る。

また、GitHub Docs は telemetry の前提にも注意を促している。IDE-based metrics は IDE telemetry に依存し、telemetry が無効なら detailed breakdown に出ない場合がある。一方で server-side telemetry により active user counts へ出るユーザーもいる。dashboard、API、export は同じ underlying telemetry から派生するが、集計単位と表示の違いを理解して reconciliation する必要がある。

したがって、日本企業では Copilot app の rollup 統合を「より細かく監視できるようになった」とだけ見ないほうがよい。これは、AI 開発基盤の月次 BI を、client別、model別、language別、費用別、効果別に再設計する合図である。

## まとめ

GitHub Copilot app 利用指標の rollup 統合は、Copilot app を enterprise metrics の本流へ入れる更新である。user-level attribution、feature/model/language breakdown、code activity totals、daily active users に app activity が入ることで、管理者は app の利用実態をより標準的な形で分析できる。

日本企業にとっての実務価値は、月次 BI と AI Credits 管理を更新できることだ。ただし、定義変更による段差、telemetry の欠落、surface 別の違い、個人評価への誤用には注意がいる。Copilot app を広げるなら、policy と managed settings だけでなく、指標定義とレポート運用も同時に直すべきである。

## 出典

- [GitHub Copilot app usage metrics now expand across report rollups](https://github.blog/changelog/2026-07-28-github-copilot-app-usage-metrics-now-expand-across-report-rollups/) - GitHub Changelog, 2026-07-28
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs, accessed 2026-07-29
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/rest/copilot/copilot-usage-metrics) - GitHub Docs, accessed 2026-07-29
- [GitHub Copilot app now available in the usage metrics API](https://github.blog/changelog/2026-07-17-github-copilot-app-now-available-in-the-usage-metrics-api) - GitHub Changelog, 2026-07-17
