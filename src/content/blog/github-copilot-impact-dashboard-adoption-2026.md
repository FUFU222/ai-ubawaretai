---
title: 'Copilot impact dashboard、PR効果を管理者が測る'
description: 'Copilot impact dashboardを解説。日本企業がGitHub Copilotの導入効果をactive user数だけでなく、AI adoption cohort、PR throughput、merge velocityから読む実務を整理する。'
pubDate: '2026-07-23'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '管理者設定', '開発者ツール', '日本企業', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年7月22日**、GitHub Copilot の利用指標に **Copilot metrics impact dashboard** を追加した。対象は enterprise administrators と organization owners で、単に active user が何人いるかを見るのではなく、Copilot の利用段階と pull request の流れを同じ画面で確認するための dashboard である。

この更新は、[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)の続きとして読むと分かりやすい。5月の API 更新で AI adoption phase が data として入った。今回の impact dashboard は、その cohort 情報を管理者が画面上で読み、導入施策へ移しやすくする更新である。

さらに、[GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)で扱った repository-level metrics と合わせると、Copilot の評価軸は「誰が使ったか」から「どの段階で、どのコードベースの PR flow に効いているか」へ広がる。日本企業にとっては、ライセンス配布後の月次レビューを作り直すきっかけになる。

## 事実: impact dashboardで何が見えるか

GitHub Changelog によると、新しい dashboard は engaged users を AI adoption phase ごとに分け、各 cohort の pull request 関連指標を表示する。Phase 1 は Code-first、Phase 2 は Agent-first、Phase 3 は Multi-agent または Copilot app の利用を含む段階で、これに Passive、つまり licensed だが十分に engagement していない利用者の segment が加わる。

dashboard の card には、phase ごとの users、全体に占める share、ユーザーあたり月間 pull requests merged、median pull request merge velocity、ユーザーあたり1日平均 lines of code などが並ぶ。単純な利用人数だけでなく、利用の深さと PR output を同時に見る設計である。

もう1つ重要なのが adoption multiplier だ。これは Passive cohort と engaged Copilot users を比べ、code shipped と pull request merge speed の差を見せる。GitHub は、bottom-line-up-front の throughput / speed comparison として説明している。管理者向けの月次資料では、この値を「Copilot が使われている」ではなく「使い方が深い cohort で PR flow がどう違うか」を話す入口にできる。

dashboard は過去6か月の trend も持つ。cohort mix がどう動いたか、pull request throughput がどう変わったかを見られるため、1回の研修、モデル変更、cloud agent 有効化、code review 導入が時間差でどの phase に出たかを追いやすい。さらに recommended next steps があり、管理者が次にどの機能や設定を促すべきかを示す。

## 事実: 利用条件と指標の前提

GitHub Docs では、impact dashboard は Copilot usage metrics へのアクセス権を持つ enterprise owners、organization administrators、billing managers、または `View Enterprise Copilot Metrics` 権限を持つ custom role が使えると説明している。前提として Copilot usage metrics policy を有効にする必要がある。

dashboard に出る cohort assignment は、Copilot usage metrics API の `ai_adoption_phase` と同じ分類を使い、直近28日間の Copilot product usage に基づく。つまり、ある日の単発利用ではなく、rolling 28-day window で phase が決まる。GitHub Docs も、古い利用日が window から外れることで phase が変わることは expected behavior だと説明している。

data reference では、impact dashboard metrics として engagement trends、adoption cohort distribution、adoption multiplier、recommendations が示されている。ここでの pull request output は、PR merged per user per month や time to merge pull requests のような活動指標であり、品質、売上、障害減少を直接証明するものではない。

この前提は日本企業では特に大切だ。Copilot の導入報告は、seat 数、active user、AI Credits 消費に寄りやすい。しかし、[Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/)で整理した通り、費用と利用量は導入効果そのものではない。impact dashboard は費用 report の代替ではなく、利用成熟度と PR flow を読むための補助線である。

## 分析: 日本企業はactive userから卒業する必要がある

ここからは分析だ。

Copilot 導入の初期段階では、active user 数を追うのは自然である。ライセンスが配られ、IDE extension が入り、使い始めているかを見なければならない。しかし、Copilot が CLI、cloud agent、code review、Copilot app、複数モデルへ広がると、active user だけでは管理指標として粗くなる。

同じ active user でも、毎日補完だけを使う人と、cloud agent に issue 修正を任せ、code review でレビュー修正を受け、Copilot app で agent session を扱う人では意味が違う。前者は入力補助に近い。後者は開発 workflow の再設計に近い。impact dashboard の cohort は、この差を経営や情シスに説明しやすくする。

日本企業では、部門ごとの導入速度にも差が出やすい。先進的な platform team は Agent-first へ進む一方、基幹系や委託先を含む repository では Code-first に留まることがある。これは悪いことではない。規制、テスト整備、CODEOWNERS、CI の安定性、データ分類によって適切な進め方は違う。重要なのは、全社平均で隠さず、cohort と PR 指標で見えるようにすることだ。

また、adoption multiplier は強い数字に見えるため、読み方を誤ると危険である。engaged users の PR throughput が高いとしても、Copilot が原因とは限らない。もともと開発量が多いチームが Copilot を深く使っている可能性もある。だからこそ、dashboard は「成果証明」ではなく、どの cohort と repository を深掘りするかを決める入口として扱うべきである。

## 実務: 月次レビューにどう組み込むか

最初に作るべき月次レビューは、4つの表で十分だ。

1つ目は cohort distribution である。enterprise 全体、主要 organization、主要部門ごとに Passive、Phase 1、Phase 2、Phase 3 の比率を並べる。ここでは「Phase 3 が多いほど偉い」としない。部門の業務リスクや repository の整備状況に対して、意図した段階にいるかを見る。

2つ目は PR 指標である。PR merged per user per month、median merge velocity、pull request throughput を cohort 別に見る。可能なら、[GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)の repository-level report と合わせ、どのコードベースで差が出ているか確認する。

3つ目は enablement backlog である。Passive が多い部門には license assignment、IDE setup、onboarding を見る。Phase 1 で止まる部門には Copilot CLI、code review、cloud agent の小さな実演が効く。Phase 2 から Phase 3 に進まない場合は、複数 agent surface を安全に使うための権限、レビュー、runner、MCP、firewall 設定を整える必要がある。

4つ目は費用との接続である。[GitHub Copilot部門予算UI、情シスが月次統制へ移す実務](/blog/github-copilot-cost-center-budgets-ui-2026/)で扱った cost center budget と、impact dashboard の cohort を並べる。Agent-first や Multi-agent が増えるほど、AI Credits 消費も増えやすい。高い利用が悪いのではなく、PR flow、レビュー負荷、手戻り削減と合わせて説明できるかが論点になる。

## 注意点: dashboardを評価制度に直結しない

impact dashboard は便利だが、現場評価に直結させると逆効果になりやすい。Phase 3 の人数を増やすこと自体を KPI にすると、不要な agent surface を使う行動を生む。PR merge velocity だけを見ると、小さく安全な改善ではなく、数字をよく見せるための PR 分割やレビュー省略を誘発する可能性がある。

日本企業では、開発組織の成熟度、委託構造、基幹システム、品質保証プロセスが部門ごとに違う。impact dashboard は、それらを無視して一列に並べるためのものではない。むしろ、各部門の導入段階に合った支援を見つけるための管理画面として使うべきである。

もう1つの注意点は、dashboard が示すのは GitHub Copilot の観測できる利用に限られることだ。開発者が別の AI coding tool を使っている、社内 proxy や端末設定で telemetry が欠ける、GitHub 外のレビュー workflow がある、といった場合には数字の解釈が変わる。usage metrics を絶対視せず、現場ヒアリング、DORA metrics、品質指標、コスト report と合わせて読む必要がある。

## まとめ

Copilot impact dashboard は、GitHub Copilot の導入管理を active user 数から一段進める更新である。AI adoption phase、adoption multiplier、PR throughput、merge velocity を同じ画面で見ることで、管理者は「誰が使っているか」だけでなく「どの深さの利用が PR flow に現れているか」を議論しやすくなる。

日本企業にとっての使いどころは、月次の AI 開発基盤レビューだ。cohort、repository、cost center、enablement backlog をつなげれば、Copilot 導入はライセンス配布の話から、開発 workflow をどこまで変えるかの話へ移る。ただし、dashboard は成果証明そのものではない。数字を評価に直結させず、改善対象を見つける地図として扱うのが安全である。

## 出典

- [New Copilot usage metrics impact dashboard](https://github.blog/changelog/2026-07-22-new-copilot-usage-metrics-impact-dashboard/) - GitHub Changelog, 2026-07-22
- [Viewing the Copilot impact dashboard](https://docs.github.com/en/copilot/how-tos/administer-copilot/view-impact-dashboard) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [Interpreting usage and adoption metrics for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/interpret-copilot-metrics) - GitHub Docs
