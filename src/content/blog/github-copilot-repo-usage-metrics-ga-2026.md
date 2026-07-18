---
title: 'GitHub Copilot repo指標、PR効果を測る実務'
description: 'GitHub Copilot repo指標のGAを解説。日本企業がリポジトリ別にcoding agentとcode reviewのPR活動、費用、レビュー品質をどう読むか整理する。'
pubDate: '2026-07-18'
category: 'news'
tags: ['GitHub Copilot', '開発生産性', 'SaaSコスト管理', '管理者設定', 'コードレビュー', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月17日**、GitHub Copilot usage metrics REST API で **repository-level activity** を一般提供した。新しい `repos-1-day` report により、Copilot coding agent が作成・mergeした pull request と、Copilot code review がreviewした pull request を、enterprise または organization 内のリポジトリ単位で見られるようになる。

これは単なる集計粒度の追加ではない。これまでの Copilot metrics は、利用者、organization、team、AI adoption phase を中心に見ていた。今回、リポジトリ別の PR activity が入ることで、「どの人が使ったか」だけでなく、「どのコードベースで agent と AI review がPR運用に効いているか」を問えるようになる。

今回の記事は、[Copilot使用指標補正、7月レポート比較の注意点](/blog/github-copilot-usage-metrics-accuracy-2026/)と[GitHub Copilotレビュー指標、PR待ち時間で導入効果を測る](/blog/github-copilot-review-cycles-adoption-phase-2026/)の続きとして読むと分かりやすい。さらに、repo別の活動量は費用説明にもつながるため、[GitHub Copilot AI credit pool、部門配賦の実務](/blog/github-copilot-ai-credit-pool-cost-center-2026/)と切り離さないほうがよい。

## 事実: repo単位の1日レポートが追加された

GitHub Changelog によると、今回追加されたのは1日単位のリポジトリ別 report を返す2つの REST API endpoint である。enterprise scope では `GET /enterprises/{enterprise}/copilot/metrics/reports/repos-1-day?day=YYYY-MM-DD`、organization scope では `GET /orgs/{org}/copilot/metrics/reports/repos-1-day?day=YYYY-MM-DD` を使う。

レスポンスそのものは、NDJSONファイルなどへの download links と report day を返す形式である。GitHub Docs は、この report が指定日のリポジトリ別 pull request metrics を含み、activity があったリポジトリだけが含まれると説明している。つまり、全リポジトリの静的台帳ではなく、当日に Copilot coding agent または Copilot code review の PR activity があった repository を見る report と捉えるのが正確だ。

対象 activity は主に2つある。1つ目は Copilot coding agent が作成した PR と merge した PR。2つ目は Copilot code review がreviewした PR で、suggestion counts は comment type 別に分解される。ここでいう repository-level は、IDE補完やChatの全利用をrepo別に分解するものではなく、PR activity、とくに coding agent と code review の動きを見るための粒度である。

アクセス権も重要だ。Changelog は、enterprise owners、billing managers、organization owners、`View Copilot Metrics` 権限を持つ custom role が report にアクセスできると説明している。Docs 側では enterprise では `View Enterprise Copilot Metrics`、organization では `View Organization Copilot Metrics` の fine-grained permission が示されている。さらに、Copilot usage metrics policy が有効であることも前提になる。

## 事実: 既存metricsとは役割が違う

GitHub Docs は Copilot usage metrics について、engagement、activity、code generation、pull request lifecycle trends を見るための可視化だと説明している。dashboard、API、NDJSON export、code generation dashboard という複数の入口があり、enterprise、organization、user レベルの詳細データも扱える。

今回の repository report は、その中でも「コードベース別のPR活動」を補う位置づけである。user report は誰が使ったかを見る。user-teams report は team 別の集計を作るための join table になる。aggregated 1-day / 28-day report は scope 全体の傾向を見る。repo report は、agent や AI review がどの repository の PR flow に現れているかを見る。

ここを混同すると、月次資料が壊れる。たとえば、repo report に出ない repository は「Copilotを使っていない」とは限らない。IDE補完やChatは使われていても、当日に Copilot coding agent や Copilot code review のPR activityがなければ repo report には出ない可能性がある。逆に、repo report に activity があるからといって、その repository の開発生産性が上がったとはまだ言えない。

また、repository report は請求 report でもない。AI Credits の費用配賦や overage は billing report、cost center、budget 設定側で確認する必要がある。usage metrics は利用と活動の説明、billing は金額の説明、PR品質はレビューや欠陥指標の説明である。この3つを分けることが、導入後の運用では重要になる。

## 分析: 導入効果の単位が「人」から「コードベース」へ広がる

ここからは分析だ。

Copilot導入の初期評価は、seat数、active user、AI Credits、モデル利用量に寄りやすい。これらは管理上必要だが、現場の問いとは少しずれる。開発責任者が知りたいのは、「どのリポジトリでPRが進みやすくなったか」「どのコードベースでAIレビューが役立っているか」「どの領域でagent導入の下準備が足りないか」である。

repository-level metrics は、この問いに近い。たとえば、同じ organization 内でも、社内ツール、顧客向けSaaS、基幹システム、モバイルアプリ、インフラIaCでは、PRの性格が違う。coding agent がよく PR を作れる repository と、review だけ効く repository と、人間の文脈が多すぎて agent が伸びない repository は分かれる。

日本企業では、repository と費用責任の境界が一致しないことも多い。共通基盤 repository は複数事業部が使い、顧客別 repository は委託先や子会社が関わり、legacy repository は少人数の保守チームが持つ。repo別に Copilot PR activity を見られるようになると、どのコードベースに enablement、ドキュメント整備、custom instructions、CODEOWNERS整備を優先すべきかを決めやすくなる。

ただし、この指標は「AIが書いたPRが多い repository ほど良い」と読むものではない。PR activity が多い repository は、単に開発量が多いだけかもしれない。review suggestion が多い repository は、AIがよく働いたのではなく、コード品質やテスト不足の問題が多い可能性もある。repo別指標は結論ではなく、掘るべき場所を見つけるための入口である。

## 実務: repo台帳と指標を結びつける

最初にやるべきことは、repository master を作ることだ。repository名、owner、CODEOWNERS、主担当部門、cost center、システム区分、データ機密度、委託先有無、Copilot code review の有効化状況、cloud agent の利用可否を1つの台帳にそろえる。repo report の `repository_id` や name を、この台帳に join できなければ、数字は単なるランキングで終わる。

次に、PR activity を3つに分ける。Copilot coding agent が PR を作った件数、merge された件数、Copilot code review がreviewした件数である。ここに PRサイズ、merge lead time、review cycle、revert、post-merge defect を足す。repo別に見るなら、利用量より先に「PRがどの程度小さく、どの程度安全に流れているか」を見るほうが実務的だ。

3つ目に、enablement対象を選ぶ。Copilot code review は多いが merge まで遅い repository では、[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/)で扱った runner、content exclusion、custom instructions を見直す。coding agent の PR は多いが merge率が低い repository では、issue template、test command、ローカル再現手順、branch policy の整備が足りない可能性がある。

4つ目に、費用と合わせる。repo別 PR activity と cost center 別 AI Credits を同じ表に置けば、AI利用がどのコードベースでPR throughputに結びついているかを説明しやすい。ただし、usage metricsだけで請求額を再現しない。金額は billing report と budget 側を正とし、repo report は「どこで活動が起きたか」を説明する補助線にする。

## 注意点: repo別指標は監視にも評価にも強すぎる

repository-level metrics は便利だが、使い方を誤ると現場を歪める。特に、repo別の Copilot PR activity をそのままチーム評価に使うのは危険である。保守が中心の repository、規制対象の repository、顧客個別の小規模 repository、運用変更だけの repository では、AI PR activity が少なくて当然のケースがある。

また、Copilot code review の suggestion count を品質不良の証拠として扱うのも危ない。AI review のコメントは、custom instructions、読み込める文脈、runner環境、content exclusion、PRサイズに影響される。comment type 別に分かれることは有用だが、重大度や採用率、人間reviewerの判断と合わせなければ、数字だけが独り歩きする。

日本企業で現実的なのは、repo別指標を「改善候補の発見」に使うことだ。たとえば、AI review が多いのに人間review cycleが減らない repository、coding agent PR が多いのに merge されない repository、AI activity がほぼないがPR滞留が大きい repository を見つける。その後、リポジトリ担当者と一緒に原因を確認する。

## まとめ

GitHub Copilot の repository-level usage metrics GA は、Copilot管理を人・部門・費用だけでなく、コードベース単位へ広げる更新である。Copilot coding agent と Copilot code review の PR activity を repository 別に見られることで、どのコードベースで agent 導入が進み、どこに enablement や統制整備が必要かを判断しやすくなる。

一方で、repo report は成果や請求の代替ではない。IDE補完やChatの全利用をrepo別に示すものでもない。日本企業は、repo台帳、CODEOWNERS、cost center、PR品質指標を結びつけたうえで、repository-level metrics を改善候補の発見に使うべきだ。数字を評価に直結させるより、どの repository で何を整えるべきかを決めるための地図として扱うほうが安全である。

## 出典

- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
