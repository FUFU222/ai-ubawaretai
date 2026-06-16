---
title: 'GitHub Copilot使用指標、DAU計測補正の実務'
description: 'GitHub Copilot使用指標がサーバー側信号を加え、DAUと28日 active user の母集団を補正。日本企業がBI、部門別定着率、請求照合をどう見直すか実務向けに整理する。'
pubDate: '2026-06-16'
category: 'news'
tags: ['GitHub Copilot', '管理者設定', '開発者ツール', 'AIエージェント', 'SaaSコスト管理', 'GitHub Enterprise Cloud']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月15日**、Copilot usage metrics reports の active user 計測に server-side telemetry を加えた。これまで IDE などの client telemetry だけでは拾えなかった利用者を、GitHub 側で活動確認できる場合に enterprise single-day report と 28-day report へ含める。結果として、DAU や 28日 active user の上位集計は増える可能性がある。

ただし、これは「社内で急に Copilot 利用が増えた」というニュースではない。計測の母集団が補正され、これまで見えていなかった active user が見えるようになる変更だ。[GitHub AI使用レポート、6月締めの請求列変更対応](/blog/github-ai-usage-report-fields-2026/) が AI Credits の金額・数量列をどう読むかの話だったのに対し、今回は adoption KPI と利用者母数の定義に効く。

日本企業では、Copilot 導入率、部門別 active user、請求対象 seat、活動ログ、BI dashboard を並べて説明する場面が増えている。[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/) のように部門別定着を見る組織ほど、今回の DAU 補正を単純な成長として扱わず、計測定義の変更として注記する必要がある。

## 事実: server-side telemetry がactive userを補完する

GitHub Changelog によると、Copilot usage reports はこれまで主に IDE や client から送られる client-side telemetry を基にしていた。client telemetry は利用機能や IDE、モデル、コード生成に関する詳細を持つ一方で、ネットワーク、proxy、client settings などにより GitHub 側へ届かないことがある。その場合、実際には active で billed user でも、usage report から抜けることがあった。

今回の更新では、GitHub が server-side telemetry で active と確認でき、かつ client telemetry では捕捉できていなかった利用者を enterprise single-day report と 28-day report に含める。GitHub は、これにより daily active user coverage が上がると説明している。

典型例として、従来の single-day report が client telemetry 由来の 1,000 daily active users を示していた場合、更新後は server-side telemetry で確認された 50 users が加わり、1,050 と表示される可能性がある。これは既存 users の行動が変わったという意味ではなく、これまで欠落していた active users が top-level totals に入るという意味だ。

GitHub Docs でも、Copilot usage metrics は dashboard、API、code generation dashboard、NDJSON export など複数の形で扱われる。したがって、今回の変更は UI だけの見え方ではなく、API や export を使う社内 BI にも影響する前提で読むべきだ。

## 事実: 詳細内訳はすぐには埋まらない

重要なのは、server-side telemetry で拾われた users が完全な詳細データを持つわけではない点だ。GitHub は、server-side telemetry には client telemetry が持つような IDE、feature、model、lines-of-code activity などの rich per-interaction detail がまだ含まれないと説明している。

そのため、top-level の active user totals は増える一方で、`totals_by_ide` や `totals_by_feature` のような dimensional breakdown には、その分の詳細が入らないことがある。つまり、DAU は増えたのに IDE 別・機能別の合計が以前ほどきれいに対応しない、または unattributed の比率が上がるように見える可能性がある。

ここを読み間違えると、現場への説明が難しくなる。管理者 dashboard で DAU が増えたからといって、すぐに「VS Code 利用が伸びた」「Chat の利用が増えた」「Code Review が広がった」と判断してはいけない。今回の更新で強くなるのは active user の捕捉であり、機能別行動の粒度は今後段階的に補完される領域だ。

これは [GitHub Copilot Code Review、組織単位の設定管理へ](/blog/github-copilot-code-review-org-controls-2026/) のような機能別展開を追うときにも効く。Code Review、CLI、cloud agent、IDE 補完を個別に評価するなら、top-level DAU と feature breakdown の差分を「未分類の active user」として扱う必要がある。

## 分析: 導入KPIの基準線を引き直す変更である

ここからは分析だ。

今回の変更は、Copilot の価値や利用量を直接増やす機能ではない。より正確に言えば、これまで report 上で見えていなかった active users が見えるようになり、導入 KPI の基準線が変わる。したがって、日本企業の管理者は、6月15日前後の DAU 増加を通常の利用増と同列に扱わないほうがよい。

特に、社内で「Copilot 利用率 70%」「部門別 DAU」「28日 active rate」「seat 消化率」といった数字を経営会議や生成AI推進会議に出している場合、今回の補正後に数値が上がる可能性がある。その上昇を施策効果として説明すると、翌月以降の評価がぶれる。正しい説明は「計測対象に server-side telemetry 由来の active users が加わったため、基準線を再設定した」である。

これは請求照合にも関係する。GitHub は、この更新により usage reports が activity log や billing により近づき、missing users をめぐる support escalation を減らせると説明している。日本企業では、請求対象 seat はあるのに usage report に出ない、または活動ログでは使っているように見えるのに DAU に出ない、といった問い合わせが起きやすい。今回の変更は、そのズレを減らす方向の修正だ。

ただし、請求の数字と利用価値の数字は同じではない。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理したように、AI Credits や usage-based billing では費用管理の粒度が細かくなる。active user が増えて見えることと、AI Credits 消費が増えることは別の現象として分ける必要がある。

## 実務: BIと月次レポートで直すべき点

第一に、6月15日を境に annotation を入れる。Looker、Power BI、BigQuery、Spreadsheet、社内ポータルで DAU や 28-day active user を出している場合、GitHub Copilot usage metrics の active-user definition に server-side telemetry が加わったことを注記する。折れ線グラフだけを見る人が、計測補正を利用増と誤読しないようにするためだ。

第二に、top-level と breakdown を分けて見る。DAU、WAU、MAU、28-day active users は捕捉率が上がる。一方で、IDE 別、feature 別、model 別、lines-of-code activity は、server-side telemetry 由来 users では空欄や未分類になりやすい。部門別 dashboard では、active user totals と feature attribution rate を別指標にしたほうが安全だ。

第三に、活動ログ・請求・usage metrics の照合表を作る。GitHub の説明では、今回の目的のひとつは activity log や billing との一貫性を高めることだ。日本企業では、情シス、開発部門、経理が別々の数字を見がちなので、同じ期間・同じ enterprise/org scope で、billed users、activity log users、usage metrics active users を並べる表を用意するとよい。

第四に、施策評価の前後比較を再設計する。6月前半に Copilot 推進施策を行い、6月後半に DAU が上がった場合、施策効果と計測補正が混ざる。可能なら 6月15日前後を除外した cohort、または6月15日以降を新しい baseline とした比較を使う。これは [Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/) のような cohort 分析では特に重要だ。

第五に、未分類率を KPI に入れる。top-level active user が増えた一方で feature breakdown が追いつかない場合、管理者は「利用者は見えたが、何に使っているかはまだ見えない」状態を把握する必要がある。unattributed users の比率、IDE attribution rate、feature attribution rate を月次で追えば、GitHub が今後詳細を補完したときにも変化を説明しやすい。

## まとめ

GitHub Copilot usage metrics の 2026年6月15日更新は、client telemetry だけでは漏れていた active users を server-side telemetry で補完し、enterprise single-day report と 28-day report の DAU coverage を高める変更だ。active user totals は増える可能性があるが、IDE、feature、model、lines-of-code activity の詳細内訳はすぐには埋まらない。

日本企業にとっての実務ポイントは、Copilot の利用が急増したと短絡しないことだ。6月15日前後の DAU 変動には計測定義変更の注記を入れ、top-level active users と feature breakdown を分ける。活動ログ、請求、usage metrics を同じ期間と scope で照合し、部門別の導入 KPI は新しい baseline に引き直す。

Copilot 管理は、seat 配布から利用実態・費用・部門別効果を説明する段階へ移っている。今回の更新は、その説明を少し正確にするための土台だ。BI の数字が上がったときほど、まず見るべきなのは施策の成功ではなく、metric contract の変更である。

## 出典

- [Copilot usage metrics now include more of your active users](https://github.blog/changelog/2026-06-15-copilot-usage-metrics-now-include-more-of-your-active-users/) - GitHub Changelog, 2026-06-15
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
