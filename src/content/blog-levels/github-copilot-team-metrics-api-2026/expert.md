---
article: 'github-copilot-team-metrics-api-2026'
level: 'expert'
---

## 更新の位置づけ

GitHub Copilot usage metrics APIに追加されたteam-level metricsは、完成済みのチーム別集計APIではなく、**日次の所属データと日次の利用データを結合するための材料**だ。GitHubは2026年5月14日のChangelogで、Copilotライセンスを持つユーザーとチーム所属を対応させるuser-teams reportを公開し、既存のper-user usage reportと組み合わせることでチーム別metricsを作れると説明した。

この更新は、[AI Credits移行に備えるusage report](/blog/github-copilot-ai-credits-usage-report-2026/)の後続として見ると分かりやすい。April usage reportは、6月1日のusage-based billing移行に向けて「どのくらい消費しそうか」を見る材料だった。今回のuser-teams reportは、その消費を組織構造へ結び直すための材料だ。

Copilotの利用面は広がっている。[Copilot cloud agentのREST API公開](/blog/github-copilot-cloud-agent-rest-api-2026/)により、社内ポータルや定期ジョブからagent taskを起動しやすくなった。[GitHub Copilot appの技術プレビュー](/blog/github-copilot-app-technical-preview-2026/)では、issue、pull request、session、reviewをデスクトップ上で扱う体験が前面に出ている。IDE補完だけを前提にした利用計測では、こうしたagentic workflowの説明が足りなくなる。

日本企業の文脈では、ここが重要だ。Copilotの費用が開発者全体の固定席課金に近い間は、部門別配賦は比較的単純にできた。しかしAI Credits、Actions minutes、agent session、model selectionが絡むと、同じseat数でもチームごとの消費が大きく変わる。team-level metricsは、Copilotを「全社導入した便利ツール」から「部門別に管理するAI開発基盤」へ移すための観測点になる。

## APIとデータモデル

今回の中心は、user-teams reportだ。GitHub Changelogによると、新しいエンドポイントは次の2系統で提供される。

- `GET /enterprises/{enterprise}/copilot/metrics/reports/user-teams-1-day`
- `GET /orgs/{org}/copilot/metrics/reports/user-teams-1-day`

REST APIの呼び出し結果は、レポート本体を直接返すのではなく、時間制限付きのdownload URLを返す。実データは、そのURLから取得するNDJSONまたはJSONレポートに含まれる。この形式は、GitHubのusage metricsをDWHやETLに取り込む前提としては扱いやすいが、管理画面で即座に見る用途ではない。

team-level metricsを作るには、user-teams reportとper-user usage metrics reportを日次で結合する。organization単位なら、`organization_user_teams_1_day` と `organization_users_1_day` を使う。enterpriseまたはbusiness team単位なら、`enterprise_user_teams_1_day` と `users_1_day` を使う。

join keyは、`user_id`、`day`、そしてorganizationまたはenterpriseのentity IDだ。結合後、`team_id` と `slug` でgroup byし、active users、interaction、code generation、accepted lines、model別、feature別、IDE別、language別の指標を集計する。Docsは、rolling windowを作る場合も、まず日次同士で結合し、それから期間集計するよう示している。

ここで設計上重要なのは、GitHubがチーム別の事前集計を提供していないことだ。つまり、企業側が「どのチームを管理単位とするか」「複数所属をどう読むか」「部門コードや原価センターとどう結ぶか」を決める余地が残っている。これは手間でもあるが、日本企業の複雑な組織構造に合わせるにはむしろ必要な余白でもある。

## ダッシュボードではなくデータパイプラインの更新

今回のリリースを、管理画面の改善として捉えると期待値を間違える。GitHub Changelogは、team-level metricsがREST APIのみで提供され、今回のリリースにはdashboard surfaceがないと説明している。

そのため、実装対象はGitHub管理画面を見ている管理者だけではない。社内のデータ基盤、FinOps担当、開発生産性チーム、Platform Engineeringチームが関わる更新だ。usage metricsを取り込み、チームマスタ、GitHub team、部門コード、人事組織、原価センター、プロダクトラインへつなげる設計が必要になる。

Copilot usage metrics全体にも注意がいる。GitHub Docsは、metricsが複数surfaceのtelemetryから作られ、IDE由来のmetricsではエンドユーザー側のtelemetry有効化が必要になると説明している。また、licenseやseat managementはusage metrics reportsに含まれず、Copilot user management APIが正とされる。

したがって、監査や請求説明で使う場合、usage metricsだけで完結させるべきではない。最低でも次の4種類を分けて扱うべきだ。

- seatとライセンス割当: Copilot user management系のデータ
- 所属と権限: GitHub team、enterprise team、社内組織マスタ
- 実利用: Copilot usage metrics API
- 請求・予算: AI Credits、Actions minutes、cost center、社内配賦ルール

この分離をしないと、たとえば「seatはあるが使っていない」「使っているが小規模チームでteam reportに出ていない」「複数チーム所属で二重に見える」「organization合計とteam合計が合わない」といった状態を誤って異常値として扱ってしまう。

## 集計上の罠

team-level metricsで最も危ないのは、数字を合計しすぎることだ。

まず、複数チーム所属のユーザーがいる。Docsの例では、1人のユーザーがfrontendとbackendの両方に所属する場合、そのユーザーの活動は両方のチームに現れる。これは「各チームのメンバーがどのくらいCopilotを使ったか」を見るには正しい。しかし、frontendとbackendの数値を足してorganization合計にしようとすると、そのユーザーの活動が二重に入る。

このため、チーム別レポートは管理・分析の軸であり、請求総額の再現には使わないほうがよい。請求や全社合計はentity-level report、チーム別の比較はdaily user-teams join、と明確に分けるべきだ。

次に、5 seat未満チームの除外がある。user-teams reportでは、Copilot seatを持つユーザーが5人未満のチームは除外される。活動自体はper-user reportに残るが、team rowがない。小規模なPoC、兼務中心の横断チーム、技術検証チームが多い企業では、この制約が効く。

さらに、rolling 28-day reportとの結合も危険だ。user-teams reportは単一日の所属スナップショットなので、28日分の利用を1日の所属へ結びつけると、異動や兼務変更があった期間の利用を誤配賦する。正しい手順は、日次のuser-teamsと日次のper-user usageを結合し、その後で28日や月次へ集約することだ。

この設計はやや面倒だが、月末の部門配賦では重要になる。日本企業では、月中異動、プロジェクト兼務、出向、グループ会社横断のGitHub organization利用があり得る。現在の所属だけで過去利用をまとめると、費用説明が崩れる。

## AI Credits時代の管理ビュー

6月以降のCopilot管理では、チーム別metricsを単独で見るより、AI Creditsと合わせたビューにしたほうがよい。

まず、チームごとにactive usersと利用volumeを見る。active usersは導入率を見るために必要だが、それだけでは不十分だ。10人中8人が軽く使っているチームと、10人中2人が重いagent sessionを大量に回しているチームでは、同じactive率でも管理上の意味が違う。

次に、featureまたはsurfaceで分ける。Copilot Chat、IDE completions、Copilot CLI、code review、cloud agent、third-party agentは、同じ「Copilot利用」でも予算影響も管理論点も違う。[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)のように、AI Credits以外のコストに波及するsurfaceもある。

さらに、model別に見る。高性能モデルの利用が増えているのか、Auto model selectionや低倍率モデルへ寄っているのかで、コストと品質の判断が変わる。チーム別にmodel usageを見られるなら、単に「高いモデルを禁止する」ではなく、「このチームのこの作業には高いモデルの価値がある」と説明しやすくなる。

最後に、成果指標と混ぜすぎないことも重要だ。Copilot usage metricsは利用状況を測るデータであり、直接的な生産性そのものではない。Pull request throughput、time to merge、障害率、レビュー品質、リリース頻度と結びつけることはできるが、Copilot利用量が多いことをそのまま成果と見なすべきではない。

## 日本企業での実装パターン

現実的な実装は、3段階に分けるのがよい。

第1段階は、日次取り込みだ。enterpriseまたはorganizationのdaily user-teams reportとdaily per-user usage reportを取り込み、raw tableとして保存する。download URLは時間制限付きなので、定時ジョブで取得し、取得失敗時の再試行と欠損検知を入れる。

第2段階は、正規化だ。GitHub team slugを社内の部門マスタへ直接結びつけると、renameや兼務で壊れやすい。team_idをキーに履歴テーブルを持ち、slugは表示名として扱う。社内の原価センターやプロダクトラインは、GitHub teamに直接埋め込むより、別のmapping tableで管理したほうが変更に強い。

第3段階は、用途別ビューだ。請求説明用ビューでは、organization合計、AI Credits、追加利用設定、Actions minutesを中心にする。チームenablement用ビューでは、active users、feature別利用、IDE別利用、language別利用を見る。Platform Engineering向けビューでは、cloud agent、CLI、code review、model usageを重点的に見る。

このとき、小規模チームは別扱いにする。5 seat未満のチームがuser-teams reportに出ないなら、ユーザー別利用と社内所属マスタを使った補助集計を作る。ただし、それはGitHubのteam-level reportとは前提が違うため、同じグラフで混ぜず、脚注や別タブで扱うべきだ。

## 結論

GitHub Copilot team-level usage metrics APIは、Copilotの機能そのものを強くする更新ではない。しかし、Copilotを企業の開発基盤として広げるには、かなり重要な管理更新だ。

特に日本企業では、部門別予算、兼務、原価センター、月次配賦、情シスと開発部門の責任分界が絡む。AI Credits移行後に「誰がどれだけ使ったか」だけを見ても、費用や効果の説明は足りない。「どのチームが、どのsurfaceで、どのmodelを、どの期間に使ったか」を見られるようにすることが、Copilot運用の次の基本になる。

今回のAPIはRESTのみで、5 seat未満チーム除外や複数所属の二重計上といった制約もある。それでも、日次joinを正しく設計すれば、Copilotの利用実態を部門別の意思決定へ接続できる。6月以降の請求や利用制御に備えるなら、今のうちにteam-level metricsをDWHやBIへ取り込む設計を始める価値がある。

## 出典

- [Team-level Copilot usage metrics now available via API](https://github.blog/changelog/2026-05-14-team-level-copilot-usage-metrics-now-available-via-api/) — GitHub Changelog, 2026-05-14
- [Team-level Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/team-level-metrics) — GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) — GitHub Docs
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) — GitHub Docs
