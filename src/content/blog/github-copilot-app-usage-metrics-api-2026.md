---
title: 'GitHub Copilot app指標、管理APIで採用を測る'
description: 'GitHub Copilot app指標がusage metrics APIに追加。日本企業がapp利用、token_usage、repo指標、AI Creditsを分けて運用する実務を整理する。'
pubDate: '2026-07-19'
category: 'news'
tags: ['GitHub Copilot', '開発生産性', 'SaaSコスト管理', '管理者設定', 'AIエージェント', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月17日**、Copilot usage metrics API に **GitHub Copilot app usage** を追加した。enterprise と organization の 1-day / 28-day report で、Copilot app の active users、session、request、prompt、token usage を既存の IDE、chat、code review、coding agent 指標と並べて確認できるようになる。

今回の更新は、前日に出た大きな機能発表ではなく、管理APIの粒度改善である。ただし日本企業にとっては重要だ。Copilot app は、IDE補完だけではなく agent 的な作業、セッション、トークン消費を伴う使い方に近い。したがって、導入効果の説明、AI Credits の予算管理、部門別の利用可視化を同じ表で扱う準備が必要になる。

この論点は、同じ日に公開された[GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)とセットで読むと分かりやすい。repo指標は「どのコードベースでPR活動が起きたか」を見る。一方、今回のapp指標は「Copilot appという利用面がどれだけ採用され、どれだけAI実行量を生んでいるか」を見る。さらに、利用量の増加は[GitHub Copilot AI credit pool、部門配賦の実務](/blog/github-copilot-ai-credit-pool-cost-center-2026/)や[Copilot usage metrics APIのAI adoption cohorts](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)と切り離せない。

## 事実: Copilot appがusage metrics APIに入った

GitHub Changelog によると、Copilot usage metrics API は enterprise と organization の 1-day / 28-day report に GitHub Copilot app の利用を含めるようになった。追加された主な項目は `daily_active_copilot_app_users` と `totals_by_copilot_app` である。

`daily_active_copilot_app_users` は、特定日に Copilot app で active だった distinct users を数える。`totals_by_copilot_app` は Copilot app 専用の集計セクションで、`session_count`、`request_count`、`prompt_count`、`token_usage` を持つ。token usage には output tokens、prompt tokens、requestあたり平均tokenなどが含まれる。

重要なのは、この app 利用が generic totals、feature totals、model totals、language totals、lines-of-code metrics とは分けて報告される点だ。つまり、Copilot app のセッションやtoken量を、IDE補完や一般的なChat利用の総量に混ぜずに見られる。Copilot app activity がない enterprise や organization では、追加フィールドは `null` として返るため、既存の取り込み処理にも大きな破壊的変更は出にくい。

GitHub Docs 側では、Copilot usage metrics が adoption、engagement、acceptance rate、LoC、pull request lifecycle metrics を見るための仕組みとして説明されている。今回の app 指標は、この大枠の中に「Copilot appという利用面」を足すものだ。成果指標そのものではなく、どの面で利用が広がっているかを見る入力データとして扱うべきである。

## 事実: repo指標とは見る対象が違う

同じ2026年7月17日に、GitHub は repository-level Copilot usage metrics の一般提供も発表している。こちらは enterprise / organization 向けに、1日単位で repository ごとの Copilot coding agent と Copilot code review の pull request activity を返す。PRを作った、mergeした、reviewした、suggestion count があった、といったコードベース単位の活動を見るためのAPIだ。

今回の Copilot app 指標はそれとは異なる。repo指標が repository と PR flow を中心にするのに対し、app指標は Copilot app の採用と実行量を中心にする。たとえば Copilot app の active users が増えているのに repo別PR activity が増えない場合、app内で調査や相談は増えているが、coding agent や code review のPR成果にはまだ移っていない可能性がある。

逆に、repo別PR activity が増えていて app 指標が伸びない場合は、Copilot app 以外の導線、たとえば IDE、GitHub.com、cloud agent、code review の自動割り当てから活動が起きているかもしれない。この差分を見ないまま「Copilotの利用が伸びた」とまとめると、導入施策の判断を誤る。

日本企業では、部門ごとの説明責任も絡む。開発部門はPR throughputを見たい。情シスや購買は利用量と費用を見たい。セキュリティや品質保証はcode reviewやPRリスクを見たい。app指標とrepo指標を分けて扱うことで、それぞれの問いに近い数字を出しやすくなる。

## 分析: app指標は「採用」と「消費」を同時に見る入口になる

ここからは分析だ。

Copilot app 指標の価値は、active user と token usage を同じ利用面で見られることにある。active user だけなら導入率の説明になる。session や request だけなら操作量の説明になる。token usage まで見ると、AI実行量、つまり費用やモデル負荷に近い説明ができる。

これは、AIエージェント導入で起きがちな「使っている人は増えたが、費用の増え方が分からない」という問題に効く。特に Copilot app は、短い補完よりも、長い文脈、複数ステップ、調査、修正案作成に寄りやすい。request数が少なくても token usage が大きい利用者やチームが出る可能性がある。

日本企業で現実的なのは、まず Copilot app を「新しい業務面」として独立に見ることだ。IDE補完、Chat、code review、coding agent、Copilot app を同じ月次利用率に丸めるのではなく、それぞれの adoption、engagement、cost proxy を分ける。そうしないと、教育施策、予算施策、ガードレール施策のどれが必要なのか判断しにくい。

もう一つ大事なのは、Copilot app 指標を成果指標に直結させないことだ。session_count が多いから生産性が高いとは言えない。prompt_count が多いから習熟しているとも限らない。token_usage が大きいチームは、複雑な課題を解いているのかもしれないし、プロンプト設計やコンテキスト整理が未熟で無駄に消費しているのかもしれない。app指標は、評価の結論ではなく、観察と改善の入口である。

## 実務: dashboardは三層に分ける

日本企業がこの更新を受けてまず作るべきなのは、三層のdashboardである。

第一層は採用である。`daily_active_copilot_app_users`、週次active users、対象seat数、部門、職種、team membership を並べる。ここでは、Copilot app を使い始めた人が誰か、特定チームに偏っていないか、教育後に増えたかを見る。既存の[GitHub Copilot appの技術プレビュー](/blog/github-copilot-app-technical-preview-2026/)を試したチームがあるなら、そのチームを先行群として分けておくと比較しやすい。

第二層は利用深度である。session_count、request_count、prompt_count、平均request数、平均prompt数を見る。active user が増えているのに session が薄いなら、試用だけで定着していない可能性がある。active user は少ないが session が深いなら、少数のheavy userが業務に組み込んでいる可能性がある。

第三層は消費である。`token_usage`、AI Credits、budget、cost center を見る。usage metrics API がそのまま請求額を返すわけではないので、金額の正はbilling report側に置く。ただし、Copilot app のtoken usageは、費用増加の説明に使える補助線になる。AI Creditsの運用は、[GitHub Copilot AI Credits課金、6月運用の初期設計](/blog/github-copilot-ai-credits-billing-budgets-2026/)で扱ったように、共有プールとuser-level budgetを分けて読む必要がある。

この三層を1つの表に無理に詰め込むより、採用、利用深度、消費を別タブにしたほうがよい。採用のKPIは増えることが望ましい場合が多い。消費のKPIは必ずしも増えればよいわけではない。利用深度は、役割やプロジェクトによって適正値が違う。違う意味の数字を同じ赤緑判定にしないことが重要だ。

## 注意点: nullとtoken_usageを読み違えない

まず `null` の扱いに注意が必要だ。GitHub は、Copilot app activity がない場合に `daily_active_copilot_app_users` と `totals_by_copilot_app` が `null` になると説明している。これはゼロと似て見えるが、データ処理上は分けたほうがよい。nullは「該当セクションが活動なしとして返った」として保持し、ETLで勝手に0へ潰す場合も、元値を別列に残すべきだ。

次に token_usage で成果を測らないことだ。token_usage は、利用されたAI実行量の説明にはなる。しかし、開発成果、品質改善、時間短縮を直接表すものではない。tokenが多いほど良いという評価にすると、無駄な長文依頼や過剰なagent実行を誘発する。逆に token を単純に削減対象にすると、価値の高い調査や設計支援まで萎縮する。

三つ目は、Copilot app 指標だけで部門別費用配賦を確定しないことだ。Copilot app は Copilot利用の一部であり、IDE、Chat、code review、coding agent、third-party agent の利用も存在する。費用配賦では billing report、AI Credits、cost center、user-level budget を正とし、app指標は「なぜそのチームの利用が増えたか」を説明する材料として使うのが安全である。

## まとめ

GitHub Copilot app が usage metrics API に入ったことで、enterprise / organization 管理者は Copilot app の active users、session、request、prompt、token usage を分けて見られるようになった。これは小さなAPI項目追加に見えるが、AIエージェント的な利用面を、採用と消費の両方から管理しやすくする更新である。

日本企業は、Copilot app 指標をrepo指標やAI Creditsと混ぜず、採用、利用深度、消費の三層で見るべきだ。active user は導入施策、session/request/prompt は定着度、token_usage は費用説明の入口として使う。成果の判定は、repo別PR activity、review cycle、品質指標、billing report と組み合わせて初めて意味を持つ。

## 出典

- [GitHub Copilot app now available in the usage metrics API](https://github.blog/changelog/2026-07-17-github-copilot-app-now-available-in-the-usage-metrics-api/) - GitHub Changelog, 2026-07-17
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
