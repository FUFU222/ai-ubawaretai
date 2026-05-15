---
title: 'GitHub Copilotチーム別metrics API、部門予算の見方'
description: 'GitHub Copilotチーム別metrics APIが登場。日本企業がAI Credits移行後に部門別の利用、予算配賦、導入効果、管理者レポートをどう見直すべきか整理する。'
pubDate: '2026-05-15'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', '開発者ツール', '日本企業', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年5月14日**、GitHub Copilot usage metrics APIに、チーム単位の利用状況を組み立てるための**user-teams report**を追加した。これにより、Copilotライセンスを持つユーザーがどのチームに所属しているかを日次で取得し、既存のユーザー別usage reportと結合できるようになった。

これは単なる集計列の追加ではない。6月1日のAI Credits移行を前に、すでに[Copilot使用量レポートで予算を確認する動き](/blog/github-copilot-ai-credits-usage-report-2026/)が始まっている。今回の更新は、その見積もりを「誰が使ったか」から「どのチームが使ったか」へ寄せるための材料だ。

特に、[Copilot cloud agentをREST APIから起動する流れ](/blog/github-copilot-cloud-agent-rest-api-2026/)や[GitHub Copilot appの技術プレビュー](/blog/github-copilot-app-technical-preview-2026/)が進むほど、Copilotの利用はIDE補完だけではなくなる。日本企業では、開発部門、事業部、情シス、購買がそれぞれ違う予算責任を持つため、チーム別metricsはかなり実務的な意味を持つ。

## 事実: user-teams reportで所属と利用を結合する

今回追加されたのは、チーム別に集計済みの完成レポートではない。GitHub ChangelogとDocsは、チーム別metricsを作るには、user-teams reportとper-user usage metrics reportを結合すると説明している。

新しいエンドポイントは、enterprise向けとorganization向けに用意されている。どちらもREST APIで呼び出すと、NDJSONレポートを取得するための署名付きダウンロードURLを返す。user-teams reportの各行には、対象日、ユーザーID、ユーザーlogin、チームID、チームslug、enterpriseまたはorganization IDが含まれる。

実務上のポイントは、join keyが明確なことだ。日次のuser-teams reportと日次のper-user usage reportを、`user_id`、`day`、entity IDで結合し、`team_id`や`slug`でgroup byする。これにより、active users、code generation、chat、IDE、language、feature、modelといった粒度でチーム単位の利用状況を作れる。

つまり、GitHubは「ダッシュボードのチーム別タブ」を出したのではなく、BIや社内FinOps基盤に載せやすい材料を出した。すでにGitHubのデータをBigQuery、Snowflake、Databricks、社内DWHへ流している企業なら、Copilotの利用状況を既存の部門コードや原価センターと結びやすくなる。

## 事実: REST APIのみで、ダッシュボード面はまだない

重要なのは、今回のteam-level metricsがREST API経由だけで提供される点だ。GitHub Changelogは、このリリースではチーム別metricsのダッシュボード画面はないと説明している。

利用できるのは、enterprise administrators、organization owners、billing managers、そして`View Enterprise Copilot Metrics`権限を持つenterprise custom roleのユーザーだ。つまり、個々の開発者が自分でチーム別レポートを見に行く機能ではなく、管理者が権限を持って取得し、必要な範囲へ展開するためのAPIだ。

Copilot usage metrics自体も、全ての利用面を完全に含むわけではない。GitHub Docsは、metricsが複数のCopilot surfaceのtelemetryに基づく一方で、IDE側のtelemetry設定に依存する部分があると説明している。また、ライセンスやseat管理はusage metricsではなく、Copilot user management APIが正とされる。

このため、日本企業でダッシュボードを作るなら、usage metricsだけで「誰が契約済みか」「誰にseatが割り当たっているか」まで判断しないほうがよい。ライセンス管理、チーム所属、実利用、請求・予算を別データとして持ち、最後にレポート側で突き合わせる設計が必要になる。

## 事実: 小規模チームと複数所属には注意が必要

チーム別metricsには、読み間違えやすい制約がある。

1つ目は、小規模チームの扱いだ。Docsでは、Copilot seatを持つユーザーが5人未満のチームはuser-teams reportから除外されると説明されている。活動自体はper-user usage reportに残るが、team rowがないため、チーム別集計には出てこない。

2つ目は、複数チーム所属の扱いだ。あるユーザーが同じ日に複数チームへ所属していれば、user-teams reportには複数行として現れる。そのユーザーの利用は、所属している各チームの集計に反映される。これは「そのチームのメンバーが使った量」を見るには自然だが、チーム行を単純合計してorganization全体の合計と比較すると二重計上が起きる。

3つ目は、28日集計との結合だ。Docsは、rolling 28-dayのper-user reportを単一日のuser-teams reportと結合しないよう警告している。チーム所属は日々変わるため、必ず日次同士を結合し、その後で必要な期間へ集計する必要がある。

ここは日本企業の人事異動、兼務、プロジェクト横断チームでは重要だ。4月の所属で5月の利用を見たり、現在の組織図で過去28日をまとめたりすると、AI Creditsの配賦や導入効果の説明がずれる。

## 分析: AI Credits移行後は部門別の説明責任が増える

ここからは分析だ。

今回のAPI追加は、6月1日のAI Credits移行とセットで見るべきだ。以前の[AI Credits見積もり記事](/blog/github-copilot-ai-credits-usage-report-2026/)で整理した通り、Copilotは固定席課金だけで説明できるツールから、モデル、surface、利用量を見て管理するAI基盤へ移りつつある。

席課金の時代は、費用配賦が比較的単純だった。開発者数に応じて部門へ割る、あるいはIT部門がまとめて負担する、という処理でも大きな違和感は出にくかった。しかしAI Creditsでは、同じ10人チームでも、軽い補完中心のチームと、Copilot CLI、cloud agent、code review、third-party agentを多用するチームで消費が変わる。

このとき、チーム別metricsがないと説明が粗くなる。全社のCopilot費用が増えたときに、どのチームのどの利用面が増えたのかが見えなければ、購買や経理は一律削減を求めやすい。逆に、チーム別に「このチームはcloud agentでリファクタを多く回している」「このチームはcode reviewの自動化が増えている」と説明できれば、コストを成果と結びつけて議論しやすい。

[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)のように、Copilot関連コストはGitHub Actions側にも広がる。AI Creditsだけでなく、Actions minutes、runner、組織別予算を合わせて見るには、チーム単位の観測軸が必要になる。

## 実務: まずはチーム別の予算ビューを作る

日本企業が最初にやるべきことは、完璧な生産性ダッシュボードを作ることではない。まず、6月以降の請求説明に耐える最低限の予算ビューを作るべきだ。

最初のビューは、team、day、active users、user initiated interactions、code generation activity、used agent、model、featureを並べる程度でよい。そこに部門コード、原価センター、プロダクトラインを紐づける。これだけでも、Copilot利用が「全社で増えた」ではなく「どの開発単位で増えたか」に変わる。

次に、チーム別metricsを合計して全社合計にしないというルールを明記する。複数所属ユーザーがいるため、チーム行は管理単位ごとの見方であり、請求総額の再現には向かない。全社合計はenterpriseまたはorganization report、チーム分析はdaily user-teams join、と用途を分ける。

最後に、5人未満チームの扱いを決める。小規模プロジェクトやPoCチームが多い会社では、team-level reportだけを見ると活動が抜ける。小規模チームはユーザー別レポートと社内組織マスタで補完する、あるいは小規模チームを上位部門へ寄せて見る、といったルールが必要だ。

## まとめ

GitHub Copilotのteam-level usage metrics APIは、派手な新機能ではない。しかし、AI Credits移行後のCopilot運用ではかなり重要な管理部品になる。

日本企業にとっての価値は、チーム別の利用状況を「開発生産性の説明」と「部門別予算配賦」の両方に使えることだ。ただし、REST APIのみ、小規模チーム除外、複数所属の二重計上、日次join必須という制約を理解して使う必要がある。Copilotを開発基盤として広げるなら、チーム別metricsは早めにDWHやBIへ取り込み、6月以降のコスト説明に備えたい。

## 出典

- [Team-level Copilot usage metrics now available via API](https://github.blog/changelog/2026-05-14-team-level-copilot-usage-metrics-now-available-via-api/) — GitHub Changelog, 2026-05-14
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) — GitHub Docs
- [Team-level Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/team-level-metrics) — GitHub Docs
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) — GitHub Docs
