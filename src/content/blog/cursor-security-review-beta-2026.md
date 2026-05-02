---
title: 'Cursor Security Review、AIコード監査はどう変わるか'
description: 'Cursor Security Reviewが2026年4月30日にベータ公開。日本の開発組織向けに、常時PR監査、脆弱性スキャン、MCP連携、プライバシーモード、Teams/Enterprise運用の論点を整理する。'
pubDate: '2026-05-02'
category: 'news'
tags: ['Cursor', 'コードレビュー', 'セキュリティ', '脆弱性対応', 'AIエージェント', '開発者ツール']
draft: false
---

Cursor が **2026年4月30日** に公開した `Cursor Security Review` は、単なるコードレビュー補助ではない。**PRごとの常時セキュリティレビュー**と、**定期的な脆弱性スキャン**を、AI エージェントとして IDE の外まで拡張しようとする更新だ。Cursor はこれを **Teams / Enterprise 向けのベータ機能**として出し、Security Reviewer と Vulnerability Scanner の 2 本立てで提供を始めた。

この更新が面白いのは、「AI コーディングツールがコードを書く段階」から、「AI がレビューと保守運用まで面倒を見る段階」に明確に進んだことだ。これまでこのサイトでは [AIコーディングツール5つを使い比べた正直な感想](/blog/ai-coding-tools-comparison-2026/) や [GitHub Copilot code reviewが6月からActions minutes課金対象に。日本チームは何を見直すべきか](/blog/github-copilot-code-review-actions-minutes-2026/) を通じて、AI が補完、実装、レビューへ広がる流れを追ってきた。今回の Cursor の動きは、その次にある **セキュリティ運用の常時化** を狙っている。

以下では、まず一次ソースで確認できる事実を整理し、そのうえで日本の開発組織、情シス、セキュリティ担当にどこが効くのかを分けて考える。

## 事実: 4月30日に何が発表されたのか

Cursor の changelog によると、`Cursor Security Review` は **Apr 30, 2026** に公開され、**Teams と Enterprise プランで beta** として提供が始まった。起動できるのは 2 種類の常時セキュリティエージェントだ。

- `Security Reviewer`
- `Vulnerability Scanner`

公式説明では、Security Reviewer は **すべての PR を対象**に、セキュリティ脆弱性、認証回りの後退、プライバシーやデータハンドリングのリスク、agent tool の自動承認、そして prompt injection attacks を確認する。結果は diff 上の該当箇所に、**重大度と remediation 付きの inline comment** として残す。

一方の Vulnerability Scanner は、コードベースを **scheduled scans** で定期巡回し、既知の脆弱性、古い依存関係、設定不備を確認する。検出結果は **Slack へ送信できる** と案内されている。ここは単発のレビュー機能ではなく、リポジトリ全体の保守監視に踏み込んでいる点が重要だ。

さらに Cursor は、これらのセキュリティエージェントを固定的なブラックボックスとしてではなく、**triggers、instructions、custom tooling、outputs の共有方法を調整できる** と説明している。加えて、既存の **SAST、SCA、secrets scanner** を MCP server 経由で review に差し込める例まで明示している。つまり Cursor 単体の判定だけで完結させるのではなく、既存のセキュリティツール群へ乗りにいく設計だ。

## 事実: Teams / Enterprise の運用条件はどうなっているか

ここで見逃せないのが、Security Review が最初から **組織向けプラン前提** で出ていることだ。Cursor の pricing page では、Business Plans として次の条件が並んでいる。

- Teams: **$40 / user / month**
- Enterprise: **custom**

Teams には、共有 chats / commands / rules、centralized team billing、usage analytics and reporting、org-wide privacy mode controls、role-based access control、SAML/OIDC SSO が含まれる。Enterprise ではそこに加えて、**pooled usage、SCIM、AI code tracking API and audit logs、granular admin and model controls** が入る。

この構成から読み取れるのは、Cursor が Security Review を「個人の便利機能」ではなく、**管理者が制御する組織機能**として出していることだ。実際、changelog でも有効化主体は developer ではなく **admins** だとされている。

また、Cursor は同じ changelog の中で、security agents は **existing usage pool から消費する** と書いている。つまり別 SKU を新設したというより、既存の組織利用量の上でセキュリティレビューを回す方式だ。ここは導入障壁を下げる一方で、運用側には「どこまで常時実行するか」を先に決める必要がある。

## 事実: プライバシーモードとセキュリティ統制はどう説明されているか

Cursor の日本語 security page は **2026年4月24日更新** で、機能名として Security Review の詳細仕様を説明しているわけではない。ただし、組織が導入判断をするときの前提条件はかなり明確だ。

まず Cursor は **SOC 2 Type II** の保証報告書を trust portal から提供し、少なくとも年 1 回の第三者ペネトレーションテストを実施するとしている。加えて、インフラは最小権限、多要素認証、ログ監視の原則で運用すると説明している。

より実務に効くのは **Privacy Mode** だ。security page と pricing page の両方で、privacy mode は settings でも team admin でも有効化でき、有効時は **コードデータがモデルプロバイダーに保存されず、学習にも使われない** と案内されている。しかも team member にはデフォルトで有効だと明示されている。日本企業では、AI 導入の議論が機能より先に「学習されるのか」「外部保存されるのか」で止まりやすいので、ここは PoC を前に進める説明材料になる。

同じ security page では、MCP security considerations、compliance logs、enterprise security features といった周辺ドキュメントへの導線も用意されている。したがって、Cursor は Security Review を単独機能として売るのではなく、**MCP と監査ログを含む管理基盤の上に置いている** と見た方が正確だ。

## 分析: Cursor は「AIレビュー」から「AIセキュリティ運用」へ踏み込んだ

ここから先は分析だ。

今回の発表の核心は、Cursor が GitHub Copilot 的な PR コメント生成と競争したいだけではない点にある。Security Reviewer が見る対象には、脆弱性そのものだけでなく、**auth regressions、privacy and data-handling risks、agent tool auto-approvals、prompt injection attacks** が入っている。これは単なる lint や一般品質レビューではなく、**AI エージェントを使う開発体制そのものをレビュー対象に含めた** ことを意味する。

以前取り上げた [OpenAI、GPT-5.4-Cyberを限定提供へ。Trusted Access for Cyber拡大で「守る側のAI」を前に進めた](/blog/openai-gpt-54-cyber-trusted-access-2026/) は、防御側の AI 能力を段階開放する流れを示していた。Cursor の今回の更新は、そのモデル供給側の進化を、**日常の PR 運用へ埋め込むアプリケーション側の動き**として読むと分かりやすい。モデルが強くなるだけでは現場は変わらない。CI、レビュー、Slack 通知、監査ログまでつながって初めて、チームの運用になる。

## 分析: 日本企業で効くのは「既存ツールを捨てなくてよい」点

日本の開発組織が AI セキュリティ機能を入れるとき、一番の壁は「今ある SAST や dependency scanner を置き換えるのか」という不安だ。Cursor はそこに対して、MCP 経由で **既存の SAST / SCA / secrets scanner を review に使える** と最初から言っている。これはかなり重要だ。

理由は単純で、日本企業の多くはすでに何らかの社内標準ツールや委託監査フローを持っているからだ。新しい AI ツールが成功しやすいのは、全部を置き換えるときではなく、**既存の判定結果や社内ルールを取り込んで、一次トリアージだけ高速化する** ときだ。Security Review はその方向に寄っている。

つまり PoC の現実的な始め方は、「Cursor に全部任せる」ことではない。まずは、

- 重要 PR だけ Security Reviewer を有効化する
- Vulnerability Scanner は一部リポジトリで定期実行する
- MCP で社内の secrets scanner や依存関係検査を差し込む
- Slack 通知をセキュリティ担当と開発リードだけに流す

という段階導入の方が合っている。

## まとめ

Cursor Security Review は、**2026年4月30日** に beta として始まったばかりの機能だ。だから、現時点では「これで AppSec が完成する」と見るべきではない。ただし方向性はかなり明確で、Cursor は AI コーディングツールを、実装支援から **常時セキュリティ監査の面** へ広げ始めた。

日本の開発組織にとっての論点は 3 つある。第一に、PR 単位のリスク指摘を開発フローへどう混ぜるか。第二に、既存の SAST / SCA / secrets scanner を MCP でどう再利用するか。第三に、Teams / Enterprise の管理機能、privacy mode、audit logs を踏まえて、どこまで本番運用へ寄せられるかだ。

速報としての価値は「Cursor が新機能を出した」ことだけではない。**AI がコードを書く段階から、AI がコードを守る段階へ進み始めた** ということにある。

## 出典

- [Cursor Security Review](https://cursor.com/changelog/04-30-26) — Cursor Changelog, 2026-04-30
- [Cursor セキュリティ](https://cursor.com/ja/security) — Cursor, updated 2026-04-24
- [Cursor Pricing](https://cursor.com/pricing) — Cursor
