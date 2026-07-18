---
article: 'github-copilot-app-usage-metrics-api-2026'
level: 'expert'
---

GitHub が2026年7月17日に発表した Copilot app usage metrics API 追加は、管理APIの小さなフィールド追加として流されやすい。しかし enterprise 運用では、Copilot の利用面を「IDE補完中心」から「app、agent、review、PR lifecycleを含む複数surface」へ分解するための重要な更新である。GitHub Copilot app の active user、session、request、prompt、token usage を専用セクションで取得できるようになったため、採用、定着、AI実行量を同じAPI系列で追いやすくなった。

このサイトでは、同日の[GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)で repository-level report を扱った。repo report は、coding agent と code review がどの repository のPR activityに現れたかを見る。今回のapp指標は、Copilot app という利用面そのものの採用と消費を見る。さらに、費用側では[GitHub Copilot AI Credits課金、6月運用の初期設計](/blog/github-copilot-ai-credits-billing-budgets-2026/)と接続し、導入状況側では[Copilot usage metrics APIのAI adoption cohorts](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)と合わせて読むべき更新である。

## 事実: 追加フィールドはapp専用の採用量と実行量を返す

GitHub Changelog によると、Copilot usage metrics API は enterprise と organization の 1-day / 28-day reports で GitHub Copilot app usage を返すようになった。追加された主なフィールドは `daily_active_copilot_app_users` と `totals_by_copilot_app` である。前者はその日に Copilot app で active だった distinct users を表し、後者は app 専用の合計セクションとして session_count、request_count、prompt_count、token_usage を含む。

token_usage の内訳には、prompt token、output token、requestあたり平均tokenが含まれる。これは、Copilot app の利用を単なる回数ではなく、AI実行量に近い粒度で見られることを意味する。request数が同じでも、長い文脈を読ませるagent的な使い方と短い相談では token usage が変わる。したがって、Copilot app 指標は採用率だけではなく、運用負荷や費用説明の前段にもなる。

GitHub は、Copilot app usage が generic totals、feature totals、model totals、language totals、lines-of-code metrics と分離されるとも説明している。この分離は重要だ。app activity を既存のIDE補完やLoC指標へ混ぜると、利用が増えた理由を誤って解釈しやすい。専用セクションで返るからこそ、Copilot app の導入施策、教育、budget制御を別管理できる。

また、activity がない enterprise / organization では `daily_active_copilot_app_users` と `totals_by_copilot_app` が `null` になる。既存のETLでは、このnullをゼロへ変換する前に、元のnull性を保持したほうがよい。nullは「activityなしとして返った」ことを示す運用上の状態であり、API不備、権限不足、report未生成、真のゼロを区別する調査の入口になるからだ。

## 事実: usage metrics API全体では日次処理と権限設計が前提になる

GitHub Docs は Copilot usage metrics を、organization や enterprise における Copilot の adoption、engagement、code generation、pull request lifecycle trends を見るための仕組みとして説明している。データは定期的に更新され、通常は対象日が閉じてから最大2 full UTC days の範囲で利用可能になる。つまり、当日リアルタイム監視ではなく、日次・週次の運用分析に使うデータである。

権限も設計に入れる必要がある。Docs では endpoint ごとに、enterprise owner、organization owner、billing manager、Copilot metrics を閲覧できるcustom role、fine-grained token permission などが示されている。特に日本企業で自動収集する場合、個人PATで始めると退職、異動、権限変更で壊れやすい。GitHub App installation token や専用の管理者権限、監査可能な保管方法を前提にしたほうがよい。

API response の取り込みも、1-day report と 28-day report を混同しないことが重要だ。1-day は日次の変化を見る。28-day は短期のノイズをならし、導入キャンペーンや教育施策の前後比較に向く。Copilot app のsessionやtoken_usageは日ごとの業務イベントに影響されやすいので、単日だけで評価するより、1-dayを蓄積し、28-dayで傾向を補助する設計が現実的である。

## 分析: app指標はagent採用の先行指標になる

ここからは分析だ。

Copilot app 指標は、coding agent やPR activityの成果指標そのものではない。しかし、agent的な利用がどの程度組織に入り始めているかを見る先行指標にはなる。Copilot app でsessionやrequestが増えている段階では、ユーザーはまだ調査、相談、設計整理、タスク分解に使っているかもしれない。その後、repo-level reportで coding agent PR や code review activity が増えれば、app上の探索が実際の開発フローに接続し始めたと読める。

逆に、app active users は増えているのに repo report が伸びない場合、いくつかの仮説が立つ。ユーザーがappを相談だけに使っている。agent実行に必要なrepository権限や設定が足りない。issue templateやテスト手順が整っておらず、app上で作業計画までは進むがPR化できない。code reviewやbranch policyが厳しすぎてagent PRがmergeされない。こうした仮説を出すためには、app指標とrepo指標を同じdashboard上で分けて並べる必要がある。

この意味で、Copilot app 指標は「利用率の数字」ではなく、agent adoption funnel の上流である。seat assignment、app active user、session、request、prompt、token usage、coding agent PR creation、merge、code review suggestion、review cycle、defect、AI Credits の順に並べると、どこで詰まっているかが見える。日本企業のように組織、子会社、委託先、リポジトリ責任、予算責任が複雑な環境では、この分解がないと原因を見誤る。

## 実務: データモデルはuser、team、surface、costを分ける

最初に作るべきなのは、単一の巨大なCopilot利用表ではない。user、team、surface、costを分けたデータモデルである。

user dimension には GitHub user id、login、enterprise membership、organization membership、seat assignment、雇用区分、所属部門、職種、利用許可区分を置く。ただし個人評価に直結しないよう、可視化の粒度は原則としてteam以上にする。個人単位のbudgetやtroubleshootingは必要だが、月次の経営資料では匿名化または集計を基本にしたほうが安全である。

team dimension には organization team、社内組織、cost center、プロダクト、委託先有無、データ機密度を置く。GitHubのteam membershipと社内の部門表は一致しないことが多いので、別のmapping tableが必要になる。ここを省くと、Copilot app利用が増えても、どの事業部の施策として説明するのか分からなくなる。

surface dimension には Copilot app、IDE、Chat、code review、coding agent、CLI、third-party coding agents を置く。今回の `totals_by_copilot_app` はこのsurface分類の1つとして格納する。source API上は同じusage metrics系列でも、業務意味は違う。IDE補完のacceptance rateとCopilot appのtoken_usageを同じ評価式に入れてはいけない。

cost dimension には AI Credits、billing report、budget、cost center、user-level budget、追加課金可否を置く。usage metrics APIは請求明細そのものではない。金額の正はbilling側に置き、usage metricsは費用変動の説明変数として使う。特に Copilot app のtoken_usageは、AI Credits増加の原因分析に役立つが、そこから請求額を完全再現しようとすると運用が壊れやすい。

## 実務: dashboardは「採用」「定着」「消費」「成果」を分離する

dashboardは少なくとも4つに分けるべきだ。

1つ目は採用dashboardである。`daily_active_copilot_app_users`、対象seat数、週次active users、初回利用日、教育参加有無を置く。目的は、Copilot appがどのチームに広がっているかを見ることだ。ここでは値が増えること自体が施策の前進になりうる。

2つ目は定着dashboardである。session_count、request_count、prompt_count、active userあたりsession、active userあたりrequestを置く。目的は、試用で終わっているのか、業務の中に入っているのかを見ることだ。定着dashboardでは、人数の増加だけでなく、一定期間継続して使っているかを見る。

3つ目は消費dashboardである。token_usage、AI Credits、budget消化率、cost center、user-level budget到達件数を置く。ここでは増加が常に良いとは限らない。価値あるheavy usageは許可すべきだが、無駄な長文依頼や失敗したagent sessionが増えているなら、教育やprompt template、repository context整備が必要になる。

4つ目は成果dashboardである。repo-level PR activity、merge rate、review cycle、review suggestion adoption、post-merge defect、incident修正時間を置く。Copilot app 指標は成果dashboardの入力ではあるが、成果そのものではない。app token usage が多いチームほど成果が高いという単純な相関を期待しないほうがよい。

## 注意点: 指標を人事評価に使うと利用が歪む

Copilot app 指標は管理に便利だが、個人評価に直結させると歪みやすい。active daysを増やすために不要な起動が増える。prompt_countを成果のように扱うと、短く分ければよい依頼が増える。token_usageを低く抑えることだけを求めると、複雑な調査や設計支援にAIを使わなくなる。

より安全なのは、チーム単位のenablementに使うことだ。app active usersが少ないがPR滞留が大きいチームには、研修やユースケース整理を提案する。app token_usageが急増しているがrepo-level成果が見えないチームには、使い方の棚卸しを依頼する。repo-level activityは増えているがcode reviewのcycleが短くならないチームには、レビュー設定、test command、CODEOWNERS、content exclusionを確認する。

日本企業では、労務、組合、委託先、個人情報保護の観点もある。GitHub user単位の利用指標は、本人の働き方に近い情報を含みうる。収集目的、保管期間、閲覧権限、集計粒度を先に決め、個人監視ではなく開発基盤改善のためのデータとして扱うべきである。

## 実装手順: まず90日だけの運用実験にする

実務的には、いきなり全社KPIにせず、90日間の運用実験として始めるのがよい。

最初の30日は、データ収集とschema確認に使う。1-day report と 28-day report を取り込み、`daily_active_copilot_app_users` と `totals_by_copilot_app` のnull、欠損、scope差、日次遅延を確認する。GitHub側のデータ更新が最大2 full UTC days程度かかる前提で、dashboardの更新時刻を決める。

次の30日は、チーム別のbaselineを作る。active users、session、request、prompt、token_usage を、team、organization、cost center、職種ごとに見る。この段階では評価しない。どのチームが自然に使っているか、どこでapp利用がまったくないか、どこで少数heavy userがいるかを把握する。

最後の30日は、repo指標や費用指標と接続する。Copilot app の利用が多いチームで、repo-level PR activity、code review activity、AI Credits消費、budget到達がどう動いたかを見る。ここで初めて、教育、設定、予算、対象チーム拡大の判断をする。

この90日運用の出口は、KPIの固定ではなく、管理者向けの運用ルールである。誰がdashboardを見るのか。どの閾値で調査するのか。どのデータは個人単位で見ないのか。budget到達時に誰が例外承認するのか。app利用が増えたチームに何を支援するのか。ここまで決めてから本番KPIにしたほうがよい。

## まとめ

GitHub Copilot app usage metrics API の追加は、Copilot app の利用人数とAI実行量を enterprise / organization の管理面へ引き上げる更新である。`daily_active_copilot_app_users` と `totals_by_copilot_app` により、appの採用、session、request、prompt、token usage を専用セクションとして追える。

ただし、この指標は成果の代理ではない。日本企業は、Copilot app 指標を採用と消費の入口として扱い、repo-level PR activity、AI Credits、budget、review cycle、品質指標と結びつけて読むべきだ。個人監視や単純なtoken削減に使うのではなく、どのチームにenablement、権限整備、repository整備、budget調整が必要かを見つけるための運用データとして扱うことが重要である。

## 出典

- [GitHub Copilot app now available in the usage metrics API](https://github.blog/changelog/2026-07-17-github-copilot-app-now-available-in-the-usage-metrics-api/) - GitHub Changelog, 2026-07-17
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
