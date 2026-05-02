---
article: 'cursor-security-review-beta-2026'
level: 'expert'
---

Cursor が **2026年4月30日** に公開した `Cursor Security Review` は、AI コーディングツールの競争軸が「どれだけ速く書けるか」から、「どれだけ安全に変更を通せるか」へ移りつつあることを示す更新だ。機能自体はまだ **Teams / Enterprise 向け beta** だが、設計思想はかなりはっきりしている。PR ごとのレビューを担う `Security Reviewer` と、定期的な保守監視を担う `Vulnerability Scanner` を分け、さらに **MCP で既存セキュリティツールをつなぎ込む前提**で出してきた。

この流れは、単独では見るべきでない。ここ数週間だけでも、[GitHub Copilot code reviewが6月からActions minutes課金対象に。日本チームは何を見直すべきか](/blog/github-copilot-code-review-actions-minutes-2026/) が示したように、AI レビューはすでに「レビュー品質」だけでなく「実行コストと管理責任」の話になっている。さらに、[OpenAI、GPT-5.4-Cyberを限定提供へ。Trusted Access for Cyber拡大で「守る側のAI」を前に進めた](/blog/openai-gpt-54-cyber-trusted-access-2026/) は、防御向け能力を誰にどう開くかというモデル側の制度設計を前に進めた。Cursor の今回の発表は、その能力を **日常のリポジトリ運用へ落とし込むアプリケーション層**の変化として読むのが妥当だ。

## 事実: Security Review は何を約束しているのか

Cursor の changelog は非常に短いが、実務的には重要な論点を多く含んでいる。まず明示されているのは、`Cursor Security Review` が **Apr 30, 2026** に公開され、**Teams and Enterprise plans** で beta として使えることだ。ベータ機能なので、一般提供や標準化を前提に読むべきではないが、Cursor がこの領域を組織向け戦略の一部として置いていることは明確だ。

機能は 2 本立てだ。

1. `Security Reviewer`
2. `Vulnerability Scanner`

Security Reviewer は **every PR** を対象に、次の観点を見るとされる。

- security vulnerabilities
- auth regressions
- privacy and data-handling risks
- agent tool auto-approvals
- prompt injection attacks

そして結果は、**exact diff location** に、**severity** と **remediation** を伴う inline comments として残す。ここは普通の「AI がざっくり危険そうと言う」レビューとは違う。PR の差分に対して、修正すべき箇所を diff 上で返す設計なので、開発者の作業単位にかなり近い。

もう一方の Vulnerability Scanner は、**scheduled scans** により、コードベースを継続的に巡回する。対象は既知の脆弱性、outdated dependencies、configuration issues だ。検出結果は Slack に送れる。つまり Cursor は、PR レビューと依存関係 / 設定監視をひとつのセキュリティ面として束ね始めたことになる。

## 事実: MCP で既存ツール群を前提にしている

今回の発表で最も重要なのは、Cursor が Security Review を自前 AI の判定だけで閉じていない点だ。changelog は、**triggers の調整、独自 instructions の追加、custom tooling の付与、outputs の共有方法**を調整できると書いている。さらに例として、既存の **SAST、SCA、secrets scanners** を MCP server として差し込み、review の一部として使えるとしている。

この一文が示すのは、Cursor がこの機能を「置き換え製品」ではなく **オーケストレーション層**としても見せたいということだ。日本企業では、CodeQL、Snyk、Dependabot、Trivy、各種 secrets scanner、社内静的解析、外部監査ルールなど、すでに何らかの検査資産がある場合が多い。新しい AI 機能が成功しやすいのは、こうした既存資産を無効化するときではなく、**結果の束ね方と一次トリアージを高速化する**ときだ。Cursor は最初からそこに合わせにきている。

## 事実: Teams / Enterprise の管理機能と結びついている

pricing page を見ると、Cursor の Business Plans はかなり管理者寄りだ。Teams は **$40 / user / mo.** で、共有 chats / commands / rules、centralized team billing、usage analytics and reporting、org-wide privacy mode controls、role-based access control、SAML/OIDC SSO を含む。Enterprise は custom pricing で、そこに **pooled usage、invoice / PO billing、SCIM、AI code tracking API and audit logs、granular admin and model controls** が足される。

この構造は Security Review と相性がいい。なぜなら、セキュリティレビューを組織で回すには、少なくとも次の管理面が必要だからだ。

- 誰が有効化できるか
- どのモデルを許可するか
- 実行量を誰が監視するか
- 誰がログを後追いできるか
- どの認証方式でメンバーを管理するか

Cursor は feature page ではなく pricing page で、すでにその前提を出している。つまり Security Review は、IDE 便利機能の延長ではなく、**Enterprise governance の上に置く機能**として見られている。

また changelog では、security agents は **existing usage pool** から引くとされる。別課金が増えるわけではないが、逆に言えば、レビューを回せばその分だけ通常の agent 利用枠を食う。ここは Copilot の Actions minutes 議論と同じで、導入時に「便利だから全部オン」で済ませると、あとで請求やキャパシティの説明責任が発生する。

## 事実: Privacy Mode は日本企業の導入可否に直結する

Cursor の security page は **Last updated April 24, 2026**。Security Review そのものの仕様書ではないが、組織導入で効く論点は十分出ている。

まず、Cursor は **SOC 2 Type II** の報告書を trust portal 経由で提供し、年 1 回以上の第三者ペネトレーションテストを約束している。インフラ側では、サブプロセッサー管理、最小権限、多要素認証、ログとアクティビティ監視、中国系インフラや中国本社サブプロセッサーを使わない方針なども明示している。

日本企業で特に重いのは、**Privacy Mode** の説明だ。security page では、privacy mode は settings でも team / enterprise admin でも有効にでき、有効化時には **コードデータがモデルプロバイダーに保存されず、学習にも使われない** ように、技術的制御と契約上の ZDR 条項を適用するとしている。pricing page でも、team admin が org-wide privacy mode controls を持てると示している。さらに team member には default on だと書いてある。

これは日本の情シスや法務にとってかなり重要だ。AI の導入議論では、「便利かどうか」より先に「コードが学習に回るのか」「管理者が強制できるのか」で止まることが多い。Cursor はその質問への答えを、機能紹介ではなく **管理設定と契約前提**として出している。

## 分析: なぜ今 Security Review なのか

ここからは分析だ。

Cursor がこのタイミングで Security Review を出した背景には、AI コーディング市場の成熟がある。補完や実装支援はもはや差別化になりにくい。比較記事で触れた [AIコーディングツール5つを使い比べた正直な感想](/blog/ai-coding-tools-comparison-2026/) でも、Cursor は「フロントエンド開発の最適解」としての UX が強みだった。しかし企業予算を本格的に取りにいくなら、IDE 体験だけでは足りない。**レビュー、監査、セキュリティ、管理者統制**まで持たないと、Teams / Enterprise では勝ちづらい。

Security Reviewer が見る対象に **auth regressions** や **privacy and data-handling risks**、さらに **agent tool auto-approvals** や **prompt injection attacks** が入っているのは、その文脈で理解しやすい。Cursor は「AI が書いたコードのセキュリティ」だけでなく、「AI エージェントを使う開発体制そのものの安全性」へ監査対象を広げている。これは、コーディングエージェントが日常化した 2026 年らしい論点だ。

## 分析: 日本企業では“全部置換”より“前処理の自動化”が現実的

日本企業でこの手の機能を入れるとき、最初から全部を AI に任せるのは現実的ではない。稟議、監査、責任分界、外部委託との契約などが絡むためだ。むしろ相性がよいのは、**既存の AppSec フローは残したまま、一次レビューと通知整理だけを AI 化する** 使い方である。

たとえば次のような導入順が考えやすい。

1. 重要プロダクトの main repository だけ Security Reviewer を有効化する
2. secrets scanner や dependency scanner を MCP で差し込む
3. Vulnerability Scanner は週次で回し、Slack はセキュリティ担当と開発リードに限定する
4. false positive と true positive の比率を見ながら対象リポジトリを増やす

このやり方なら、「既存ツールを捨てるか」という組織内対立を避けやすい。Cursor を **社内セキュリティ運用の front door** として使い、最終判定は既存ルールに戻す設計だ。

## 分析: 課金と責任者を先に決めないと失敗しやすい

もう 1 つの落とし穴はコストだ。Security Review は既存 usage pool を使うので、PR 数が多い組織ほど「どの程度の頻度で常時レビューを掛けるか」がコスト設計になる。特に monorepo、microservice 多数、bot PR 多発の環境では、Security Reviewer を全件に掛けると想像以上に利用量が積み上がる可能性がある。

ここで重要なのは、導入前に次を明確にすることだ。

- どの repository を対象にするか
- どの PR 種別までレビューするか
- 誰が usage analytics を監視するか
- Slack 通知を誰が受けるか
- false positive の責任を誰が引き取るか

AI レビュー製品は、技術的には入れやすくても、責任分界が曖昧だとすぐに止まりやすい。日本企業では特に、情シス、セキュリティ、開発、マネージャーのどこが owner かを先に決めた方がよい。

## まとめ

Cursor Security Review はまだ beta だが、意味は小さくない。Cursor はここで、AI コーディングツールを「書く」「直す」から、「**守る、見張る、記録する**」方向へ広げ始めた。しかもそのやり方は、MCP で既存ツールをつなぎ、Teams / Enterprise の管理基盤と privacy mode の上に載せるという、かなり企業寄りの設計だ。

日本の開発組織が見るべきなのは、機能の派手さではない。**既存の SAST / SCA / secrets scanner をどう取り込み、どこまで一次トリアージを AI に任せ、どの単位で運用責任を持つか** である。そこが整理できれば、Cursor Security Review は「AI が危ないコードを見つけてくれるかもしれない」機能ではなく、**AI を使った AppSec 運用の入口**として検討する価値がある。

## 出典

- [Cursor Security Review](https://cursor.com/changelog/04-30-26) — Cursor Changelog, 2026-04-30
- [Cursor セキュリティ](https://cursor.com/ja/security) — Cursor, updated 2026-04-24
- [Cursor Pricing](https://cursor.com/pricing) — Cursor
