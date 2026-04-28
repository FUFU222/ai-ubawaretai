---
title: 'GitHub Copilot code reviewが6月からActions minutes課金対象に。日本チームは何を見直すべきか'
description: 'GitHubが2026年4月27日にCopilot code reviewの課金変更を公表。6月1日からAI Creditsに加えてActions minutesも効く構造を、日本企業向けに整理する。'
pubDate: '2026-04-28'
category: 'news'
tags: ['GitHub Copilot', 'GitHub Actions', 'コードレビュー', '開発生産性', 'SaaSコスト管理', '自動レビュー', '日本企業', 'AIエージェント']
draft: false
---

GitHubが**2026年4月27日**、GitHub Copilot code reviewの課金方法を見直すと発表しました。ポイントは単純ですが重いです。**2026年6月1日**から、Copilot code reviewはこれまでのCopilot側の利用量だけでなく、**GitHub Actions minutesも消費する**ようになります。しかも対象はprivate repositoryで動くレビューです。

この変更は、日本の開発組織にとってかなり実務的です。なぜなら、Copilot code reviewは「便利かどうか」だけでなく、**誰の予算に乗るのか、どのrunnerで回すのか、全PR自動レビューをどこまで広げるのか**に直結するからです。特に、Copilotを導入済みでprivate repository中心、かつGitHub Actionsの月次消費を厳しく見ているチームほど影響を受けます。

以下ではまず事実を整理し、その上で日本企業の開発・情シス・管理者が今月中に見直すべき点を分けて見ます。

## 事実: 2026年6月1日から何が変わるのか

GitHub Changelogによると、**2026年6月1日**からCopilot code reviewは2つの軸で請求されます。

- Copilotの利用そのものは、request-based billingではなく**AI Creditsベースのusage-based billing**へ移る
- private repositoryでGitHub-hosted runner上で走るcode reviewは、**GitHub Actions minutes**も消費する

ここで重要なのは、「Copilot code review 1回 = Copilot側だけの話ではなくなる」ことです。6月以降は、同じレビューでも**AI利用コストとCI実行コストの両方**を意識しなければなりません。

一方で、GitHubは**public repositoryには変更なし**とも案内しています。public repositoryではActions minutesは引き続き無料です。つまり影響が大きいのは、社内開発や商用開発でprivate repositoryを中心に使っている組織です。

さらにChangelogでは、この変更が次のプランに適用されると明記されています。

- GitHub Copilot Pro
- GitHub Copilot Pro+
- GitHub Copilot Business
- GitHub Copilot Enterprise

加えて、**Copilotライセンスを持たないユーザーのPRを組織課金でレビューしている場合も含まれる**点が重要です。GitHubはすでに、管理者がポリシーを有効化すれば、非ライセンス利用者のPRにもCopilot code reviewを広げられるようにしています。今回の課金変更は、その運用にもそのまま乗ってきます。

## 事実: runnerの選び方で請求構造が変わる

GitHub Docsを読むと、Copilot code reviewはGitHub Actionsを使って動作します。料金ページでは、**GitHub-hosted runnerを使うcode review runsは6月1日からActions minutesを消費する**一方、**self-hosted runnerはActions minutesを消費しない**と整理されています。また、larger runnerは標準runnerと異なる料金で扱われます。

このため、6月以降はrunner方針がそのままコスト方針になります。

- GitHub-hosted runner: 運用は軽いが、private repositoryのreview回数が増えるほどActions minutesも増える
- self-hosted runner: Actions minutesは消費しないが、運用管理、セキュリティ、スケール設計は自前になる
- larger runner: 性能要件に応じて使えるが、標準minute単価とは別に見る必要がある

日本の現場では「AIレビューの品質」ばかりに目が向きがちですが、今回の発表で現実には**runner選択が予算設計の一部**になりました。

## 事実: 6月1日までは従来扱いだが、監視項目は先に変わる

GitHubは、**6月1日までは従来どおりCopilot premium request側の扱い**で、Actions minutesは消費しないとしています。つまり請求の切り替え日は明確です。ただし、だからといって5月末まで何もしなくてよいわけではありません。

Docsの料金ページでは、6月以降の監視方法として次の見方が案内されています。

- GitHub Actions metricsで `copilot-pull-request-reviewer` workflow を見る
- Billing usage reportでは `workflow_path` でcode review起因の実行を追う
- 6月1日を境に `workflow_path` の識別子が変わる

つまり、5月中にやるべきことは「請求が来てから驚く」ことではなく、**どのリポジトリでどれだけ自動レビューが走っているかを先に可視化すること**です。

## 分析: 日本企業で最初に論点になるのは“全PR自動レビュー”の範囲

ここからは分析です。

今回の変更で最も見直し対象になりやすいのは、**Copilot code reviewをどこまで自動で走らせるか**です。GitHub Docsでは、Copilot code reviewは手動依頼だけでなく、設定次第でpull request作成時や新しいpushごとに自動実行できます。これは便利ですが、private repository中心の組織では、そのまま**review回数 = コスト増**につながります。

たとえば次のような運用は、6月以降にコストが跳ねやすいです。

- 全repositoryで新規PRごとに自動レビュー
- draft PRにもレビュー
- pushごとに再レビュー
- 非ライセンス利用者のPRまで全面展開

逆に、まず見直しやすいのは次のポイントです。

- 重要repositoryだけ自動レビューを有効化する
- draft段階では止めて、open化後だけにする
- pushごとの再レビューを限定する
- 非ライセンス利用者への展開は、レビュー価値が高い組織だけに絞る

日本企業では、予算管理が開発部門と情報システム部門で分かれていることが珍しくありません。そのため、Copilotライセンス費用は開発部門、Actions超過分はプラットフォームや情シス側という形で、**請求の見え方が分断される**恐れがあります。今回の変更を軽く見ると、利用拡大は現場、請求確認は別部署、という典型的なねじれが起きます。

## 分析: self-hosted runnerは節約策だが、単純な正解ではない

「self-hosted runnerならActions minutesを消費しない」と聞くと、すぐにそちらへ寄せたくなります。ただ、これは**コストの付け替え**であって、無料化ではありません。

self-hosted runnerへ寄せると、少なくとも次を自前で持つ必要があります。

- 実行基盤の保守
- ネットワークと権限制御
- 機密コードを扱うreview実行環境の監査
- 障害時の復旧とスケーリング

特に日本企業では、GitHub-hosted runnerを避ける理由が「コスト」だけでなく「社内規程」「データ持ち出し管理」「監査説明」にあることも多いです。その場合、self-hosted runnerは自然な選択肢ですが、逆に言えば**運用責任まで引き受けられる組織だけが得をする**施策でもあります。

## 分析: 影響が大きいのは“開発者ライセンス外のPRもレビューしている組織”

もう1つ見落としにくいのが、非ライセンス利用者の扱いです。GitHubのプランページとDocsでは、Copilot code reviewを**Copilot seatを持たないメンバーのPRにも広げられる**と説明しています。これは、QA、PM、アナリスト、外部協力者などのPRも含めてレビュー網を広げたい組織には便利です。

ただし、そこに自動レビューを掛けると、6月以降はその分だけAI CreditsとActions minutesの両方が増えます。つまり、これまで「seatを配らなくてもPRレビューだけは広げられる」という拡張策だったものが、今後は**利用カバレッジを広げるほど運用コストの議論が必要になる仕組み**へ変わります。

## 日本の開発組織が今月中にやるべきこと

今回の発表を受けて、日本の開発組織がすぐやるべきことは大きく4つです。

1つ目は、**private repositoryでCopilot code reviewをどこまで自動化しているか棚卸しすること**です。手動中心なのか、全PR自動なのか、pushごと再レビューなのかで影響が変わります。

2つ目は、**GitHub Actions usageをcode review起点で見える化すること**です。6月以降の請求先読みには、通常のCI minutesとCopilot review起点のminutesを分けて見る必要があります。

3つ目は、**runner方針を決めること**です。GitHub-hosted runnerのまま行くのか、larger runnerを使うのか、一部をself-hostedへ寄せるのかを決めないと、レビュー設計と予算設計が噛み合いません。

4つ目は、**予算責任者を明確にすること**です。開発部門、プラットフォームチーム、情シス、購買のどこがAI CreditsとActions超過分を見るのかを曖昧にしない方がよいです。

## まとめ

GitHubの**2026年4月27日**の発表は、Copilot code reviewを単なるAI機能ではなく、**AI利用量とCI実行量の両方で管理する対象**へ変える更新でした。6月1日以降、private repositoryでGitHub-hosted runner上のレビューを広く自動化しているチームほど、影響は小さくありません。

日本の開発チームにとって大事なのは、慌てて機能を止めることではなく、**どこで自動レビューを走らせるか、どのrunnerで回すか、誰の予算で持つか**を先に整理することです。Copilot code reviewは便利ですが、今回の変更でその価値は「レビュー品質」だけでなく、「コストを読める運用を作れるか」で決まる段階に入りました。

## 出典

- [GitHub Copilot code review will start consuming GitHub Actions minutes on June 1, 2026](https://github.blog/changelog/2026-04-27-github-copilot-code-review-will-start-consuming-github-actions-minutes-on-june-1-2026/) — GitHub Changelog, 2026-04-27
- [About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review) — GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) — GitHub Docs
- [GitHub Copilot plans](https://github.com/features/copilot/plans) — GitHub
