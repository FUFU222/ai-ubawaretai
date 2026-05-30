---
title: 'Copilot導入cohort、AI活用度を部門別に測る'
description: 'Copilot導入cohortがusage metrics APIに追加。日本企業がAI Credits移行後に部門別のAI活用度、agent定着、教育投資をどう測るべきか整理する。'
pubDate: '2026-05-30'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'SaaSコスト管理', '管理者設定', '開発者ツール', '日本企業', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年5月29日**、GitHub Copilot usage metrics APIに、ユーザーごとのAI活用段階を示す**AI adoption phase**を追加した。これにより、Copilotを使っている人数だけでなく、補完中心なのか、単一agent面を使い始めたのか、複数のagent面へ広がっているのかを、28日間の利用データから見られるようになる。

これは、[Copilot使用量レポートでAI Creditsを見積もる流れ](/blog/github-copilot-ai-credits-usage-report-2026/)や、[チーム別metrics APIで部門別の利用を作る流れ](/blog/github-copilot-team-metrics-api-2026/)の続きとして見るべき更新だ。金額とチームは見え始めた。今回のcohort追加は、その利用がどの成熟段階にあるのかを説明する材料になる。

特に、[Copilot cloud agentをREST APIから起動する運用](/blog/github-copilot-cloud-agent-rest-api-2026/)や[GitHub Copilot appの技術プレビュー](/blog/github-copilot-app-technical-preview-2026/)が進むほど、Copilotは「IDE補完」だけではなくなる。日本企業では、補完の利用率だけで導入効果を語る段階から、agentic workflowがどの部門に定着しているかを見る段階へ移りつつある。

## 事実: AI adoption phaseが追加された

今回追加されたのは、Copilot usage metrics APIの user-level report に入る `ai_adoption_phase` と、enterprise / organization level report に入る `totals_by_ai_adoption_phase` だ。GitHubの説明では、各ユーザーは直近28日間のCopilot利用面に基づいて、AI adoption phaseへ分類される。

分類は4段階だ。Phase 0は、cohort条件を満たさないユーザー。Phase 1はCode firstで、コード補完やIDE agent modeを使っているユーザー。Phase 2はAgent firstで、Copilot cloud agent、Copilot code review、Copilot CLIのようなGitHubベースのagent surfaceを1つ使っているユーザー。Phase 3はMulti-agentで、複数のGitHubベースagent surfaceを使っているか、GitHub Copilot appを使っているユーザーだ。

条件は「過去28日間のうち少なくとも2日使ったsurface」を見る。1回だけ試した人をすぐagent利用者として数えるのではなく、最低限の反復利用を見ている点が実務的だ。さらに、`ai_adoption_phase` には version が付き、今後Copilotのsurfaceが増えても分類ロジックを進化させられるようにしている。

enterprise / organization levelでは、phase別に total engaged users、user-initiated interaction average、code generationやacceptance activityの平均、追加・削除行、PR作成・merge・review、median time-to-mergeの平均などを見られる。ここで重要なのは、集計が「合計」ではなく、phase内ユーザーあたり平均として出ることだ。

## 事実: REST APIで管理者が使う指標

この機能は、Copilot usage metricsへアクセスできるenterprise administratorやorganization owner向けのREST API更新だ。GitHub DocsのREST API説明では、Copilot usage metrics policyをenterprise全体で有効にする必要があり、enterprise owner、billing manager、または適切なfine-grained権限を持つユーザーがレポートを取得できる。

レポートはAPI呼び出しで直接巨大なデータを返すのではなく、ダウンロードURLを返す形式だ。1日単位のenterprise report、28日間のlatest report、user-teams report、organization reportなどを取得し、DWHやBIへ取り込む設計に向いている。

前回の[チーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)では、user-teams reportとper-user reportを結合し、どのチームがどれだけ使っているかを作る方法が追加された。今回のAI adoption phaseは、その同じ管理データに「使い方の成熟度」を足す。つまり、部門別の利用量だけではなく、部門ごとのCode first比率、Agent first比率、Multi-agent比率を作れるようになる。

ただし、これは自動的に導入効果を証明する指標ではない。GitHub Copilot usage metricsは利用状況、エンゲージメント、コード生成、PRライフサイクルなどを見るデータであり、成果そのものを直接測るものではない。導入効果を見るには、リードタイム、レビュー品質、障害率、開発者体験調査などと合わせて読む必要がある。

## 分析: 日本企業では「利用率」だけでは足りない

ここからは分析だ。

多くの企業では、AI導入の初期KPIが「有効化したseat数」「active user数」「補完のaccept率」になりやすい。これは導入初期には必要だが、Copilotがagent面へ広がると、それだけでは足りない。

なぜなら、同じactive userでも意味が違うからだ。毎日IDE補完だけを使うユーザーと、Copilot CLIで修正を任せ、cloud agentでissue対応を起動し、code reviewでレビュー修正を回すユーザーでは、業務フローへの入り方がまったく違う。前者は個人の入力補助、後者は開発プロセスの再設計に近い。

AI Credits移行後は、この違いが予算にも出る。[Copilot使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)で整理した通り、Copilotは固定席課金だけで説明するツールから、モデル、surface、利用量を見て管理するAI基盤へ移っている。Agent firstやMulti-agentの比率が高いチームは、費用も成果も大きく振れる可能性がある。

日本企業では、ここに部門別予算、原価センター、委託先との開発体制、情シスの統制が重なる。全社平均のactive率が高くても、agent活用が一部の先進チームに偏っているなら、教育投資の優先順位は変わる。逆に、Multi-agent比率が高くてもPR品質やレビュー負荷が改善していないなら、利用ガイドや権限設計を見直すべきだ。

## 実務: cohortをどう使うか

最初に作るべきビューは、phase別の人数推移だ。enterprise全体、organization、主要チームごとに、Phase 0、Code first、Agent first、Multi-agentの比率を月次で見る。ここで「全社で使われているか」ではなく、「どの段階へ移っているか」を確認する。

次に、チーム別metricsと組み合わせる。たとえば、ある開発チームのactive userは多いがCode firstに偏っているなら、Copilot CLIやcode reviewの実務研修が効くかもしれない。別のチームでMulti-agent比率が高く、PR作成数やtime-to-mergeも改善しているなら、その運用を社内標準として横展開できる。

さらに、AI Creditsと合わせる。Agent firstやMulti-agentは便利な一方で、利用面が広がるほど消費も増えやすい。Phase別に平均interaction、model、code generation、PR関連指標を見ることで、「高いが成果が出ている利用」と「試行錯誤だけが増えている利用」を分けられる。

最後に、権限設計へ戻す。Multi-agentが増えるなら、[Copilot cloud agentのREST API運用](/blog/github-copilot-cloud-agent-rest-api-2026/)で必要になるrepository権限、secret、runner、承認フローも再点検する必要がある。GitHub Copilot appやCLIを含む利用が広がるほど、誰がどのagent surfaceを使えるかを管理者設定で決める意味が大きくなる。

## まとめ

Copilot usage metrics APIのAI adoption phase追加は、派手な新モデル発表ではない。しかし、日本企業がCopilotを全社導入ツールからAI開発基盤へ移すうえでは、かなり重要な管理指標になる。

今回のポイントは、active user数だけでなく、Code first、Agent first、Multi-agentという段階で利用を見られることだ。部門別metrics、AI Credits、agent権限、教育投資と合わせて読むことで、Copilotの導入が「使われている」だけなのか、「開発プロセスを変え始めている」のかを説明しやすくなる。

日本企業は、まずphase別の人数とチーム別利用を月次で追い、次にコストと成果指標を重ねるべきだ。AI活用度の測定は、利用率の棒グラフから、agentic workflowの定着度を見る段階へ進んでいる。

## 出典

- [Copilot usage metrics API adds cohorts for AI adoption](https://github.blog/changelog/2026-05-29-copilot-usage-metrics-api-adds-cohorts-for-ai-adoption/) - GitHub Changelog, 2026-05-29
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics) - GitHub Docs
- [Team-level Copilot usage metrics now available via API](https://github.blog/changelog/2026-05-14-team-level-copilot-usage-metrics-now-available-via-api/) - GitHub Changelog, 2026-05-14
