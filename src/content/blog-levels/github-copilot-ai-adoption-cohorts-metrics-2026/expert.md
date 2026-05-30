---
article: 'github-copilot-ai-adoption-cohorts-metrics-2026'
level: 'expert'
---

## 更新の位置づけ

GitHub Copilot usage metrics APIに追加されたAI adoption phaseは、Copilot導入を「利用率」から「利用形態の成熟度」へ引き上げるための指標だ。GitHubは2026年5月29日のChangelogで、直近28日間のCopilot product usageをもとに、engaged userをAI adoption phaseへ分類すると説明した。

これは単独の小さなAPI項目追加ではない。5月には、[AI Credits移行に備えるusage report](/blog/github-copilot-ai-credits-usage-report-2026/)が出て、Copilot利用を金額感で見る必要が強まった。さらに、[チーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)によって、user-teams reportとper-user reportを結合し、部門やチーム単位で利用を見られるようになった。今回のAI adoption phaseは、その上に「どの使い方まで進んだか」を重ねる更新だ。

CopilotのsurfaceはすでにIDE補完だけではない。Copilot CLI、Copilot cloud agent、Copilot code review、GitHub Copilot app、GitHub.com、mobile、IDE agent modeなどへ広がっている。[Copilot cloud agentのREST API公開](/blog/github-copilot-cloud-agent-rest-api-2026/)は、社内ポータルや定期ジョブからagent taskを起動する道を開いた。[GitHub Copilot appの技術プレビュー](/blog/github-copilot-app-technical-preview-2026/)は、issueやpull requestを起点にagent sessionを扱う作業面を前面に出した。

その結果、CopilotのKPIをactive userとacceptance rateだけで見るのは粗くなっている。補完を毎日使う人と、CLI、cloud agent、code reviewを組み合わせてagentic workflowを作る人では、組織に与える影響も、費用構造も、統制すべきリスクも違う。AI adoption phaseは、この違いをAPI上で扱うための分類だ。

## データモデルの読み方

今回の新フィールドは2種類に分けて考えるとよい。

1つ目は、user-level reportに追加される `ai_adoption_phase` だ。ユーザー単位で、その人がどのphaseに分類されているかを示す。2つ目は、enterprise / organization level reportに追加される `totals_by_ai_adoption_phase` だ。これはphase別に集計された指標を返す配列で、全体の中でどの段階の利用者がどの程度いるかを見るために使う。

GitHubが示したphaseは4つだ。

Phase 0はNo cohortで、engagement条件を満たさないユーザーだ。Phase 1はCode firstで、コード補完やIDE agent modeを使っているユーザーを指す。Phase 2はAgent firstで、Copilot cloud agent、Copilot code review、Copilot CLIのようなGitHubベースagent surfaceを1つ使っているユーザーだ。Phase 3はMulti-agentで、2つ以上のGitHubベースagent surfaceを使っているか、GitHub Copilot appを使っているユーザーだ。

分類条件には、過去28日間のうち少なくとも2日の利用という要件が入る。ここは重要だ。1回だけ試したユーザーをAgent firstやMulti-agentに入れると、導入施策の成果が過大に見える。2日以上という閾値は厳密な定着とは言えないが、単発トライアルをある程度除くための実務的な線引きだ。

また、`ai_adoption_phase` にはversionが付く。GitHubは、Copilotのsurfaceが増えても分類ロジックを進化させられるようにする意図を示している。長期の時系列分析では、このversionを必ず保存しておくべきだ。将来v2の分類が導入されたとき、v1と混ぜて推移を見ると、実際の行動変化と分類ルール変更を取り違える可能性がある。

## 集計指標としての意味

enterprise / organization levelの `totals_by_ai_adoption_phase` は、phaseごとのengaged usersだけを見るためのものではない。GitHubの説明では、user-initiated interaction average、code generationとacceptance activityの平均、追加・削除行の平均、PR作成・merge・review、median time-to-merge averageなどもphase別に見られる。

ここで注意すべきなのは、GitHubが平均値として出すと説明している点だ。phase内のユーザー数が違う場合、合計値だけを見ると大きいphaseが常に強く見える。平均値なら、Code firstの大多数とMulti-agentの少数を比較しやすい。

ただし、平均値にも罠がある。Multi-agent phaseの人数が少ない時期は、数人のheavy userに指標が引っ張られる。特に日本企業で先行PoCチームだけがagent機能を使っている場合、phase別平均は「成熟した全社運用」ではなく「先進利用者の振る舞い」を表すことがある。ダッシュボードでは、phase別人数、平均、中央値、上位パーセンタイルを分けて見るのがよい。

また、Copilot usage metricsは利用データであって成果データではない。PR作成数やtime-to-mergeが含まれていても、品質、保守性、障害率、開発者満足度までは直接示さない。AI adoption phaseは、成果評価そのものではなく、成果評価を始めるためのセグメントと考えるべきだ。

## REST API運用の前提

この機能はREST APIで使う管理者向けの更新だ。GitHub DocsのCopilot usage metrics REST APIでは、enterpriseでCopilot usage metrics policyを有効にする必要があり、enterprise owner、billing manager、またはView Enterprise Copilot Metrics相当の権限を持つユーザーが取得できると説明されている。

レポート取得は、APIがdownload linksを返し、そのURLからレポート本体を取得する形式だ。daily report、latest 28-day report、organization report、user report、user-teams reportなどを、定時ジョブで取り込み、raw tableとして保存する運用になる。

AI adoption phaseを使うなら、最低限次のデータを保持したい。

- report_dayまたはreport_start_day / report_end_day
- enterprise / organization ID
- user_idとlogin
- ai_adoption_phase valueとversion
- phase別のengaged usersとactivity metrics
- feature、surface、model、PR関連指標
- team_id、team slug、社内部門コードとの対応

特にuser_idをキーにすることが重要だ。loginやteam slugは変更される可能性がある。社内DWHでは、GitHub user_id、GitHub team_id、社内従業員ID、部門コード、原価センターを履歴付きで結ぶべきだ。

前回のチーム別metricsと同じく、単純合計には注意がいる。user-teams reportでは複数チーム所属のユーザーが複数行に出るため、チーム別phase人数を合計してorganization全体のphase人数に戻すのは危険だ。全社のphase分布はenterprise / organization level reportを正とし、チーム別分析は管理単位ごとの説明として扱うのがよい。

## 日本企業の管理設計

日本企業でこの指標を使う場合、最初に決めるべきなのは「phaseを何の意思決定に使うか」だ。

1つ目は教育投資だ。Code first比率が高く、Agent firstへ進まない部門では、Copilot CLI、code review、cloud agentの使い方を知らないだけかもしれない。ここでは、全社員向けの抽象的なAI研修より、日常タスクに近い演習が効く。たとえば、既存issueの調査、テスト修正、PR説明文作成、レビュー指摘の修正といった具体的な流れで、agent面を使う機会を作る。

2つ目は権限とガバナンスだ。Agent firstやMulti-agentが増えている部門では、単に利用を伸ばすだけでなく、repository access、secret、runner、branch protection、review requirement、audit logを再点検する必要がある。agentが触れる範囲が広がるほど、従来の人間前提の権限設計では粗くなる。

3つ目は予算配賦だ。AI Credits移行後は、人数だけで費用を割ると実態とずれる。Code first中心の部門とMulti-agent中心の部門では、同じseat数でも消費と価値の出方が違う。phase別の平均interactionやmodel利用を部門別metricsと重ねることで、「この部門は高いがagent活用が進み成果指標も改善している」「この部門は高コストモデルを試行錯誤で使っているだけ」といった会話ができる。

4つ目は社内標準化だ。Multi-agent phaseで良い結果を出しているチームがあれば、そのprompt、workflow、権限設定、review gate、rollback方法を社内テンプレート化する価値がある。逆に、Multi-agent比率が高いのに障害やレビュー差し戻しが増えているなら、agent利用の自由度を下げるのではなく、使い方の標準を作るべきだ。

## ダッシュボードの設計例

実務上は、1枚のダッシュボードで全てを説明しようとしないほうがよい。少なくとも3つのビューに分ける。

第1は導入成熟度ビューだ。enterprise全体と主要organizationごとに、Phase 0、Code first、Agent first、Multi-agentの人数と比率を月次で見る。ここにはactive user数も並べるが、主役はphaseの遷移だ。Code firstからAgent firstへ進んだ人数、Agent firstからMulti-agentへ進んだ人数を見る。

第2は部門別ビューだ。team-level metricsと社内部門マスタを結合し、部門ごとのphase分布、主要surface、model、AI Credits見積もりを並べる。複数所属があるため、全社合計の再現には使わず、各部門の利用傾向を見る用途に限定する。

第3は成果照合ビューだ。PR数、time-to-merge、review回数、revert、障害、デプロイ頻度、開発者アンケートなどとphaseを突き合わせる。ここで初めて「Multi-agent化が本当に効いているか」を評価する。usage metricsだけで成果を断言しないことが重要だ。

この3ビューを分けると、経営、情シス、開発責任者、Platform Engineeringが同じ数字を別の目的で使いやすくなる。経営は成熟度と投資対効果、情シスは権限とリスク、開発責任者は教育と運用改善、Platform Engineeringはデータパイプラインと標準化を見る。

## 監査と説明責任

AI adoption phaseは便利だが、監査で使うなら説明可能性が必要だ。GitHub側の分類は明示されているものの、会社の業務上の意味づけは自社で定義しなければならない。

たとえば、Multi-agentを「高度活用」と呼ぶなら、その定義を社内ドキュメントに残すべきだ。GitHub Copilot appを使うだけでMulti-agentに入るため、必ずしも複数agentの複雑な自動化を実運用しているとは限らない。言葉だけが先行すると、経営層には過大に見える。

また、Phase 0を「未活用」と断定するのも危険だ。roleや業務によっては、Copilotを使わないことが自然な場合がある。データ閲覧者、PM、セキュリティレビュー担当、外部委託管理者など、コードを書く頻度が低い人を同じ基準で評価すると誤った圧力になる。

さらに、phase別の比較を個人評価に使うべきではない。usage metricsは組織導入と運用改善のためのデータであり、個人の能力評価に直結させると、無意味な利用増や高コストなagent実行を誘発する。日本企業では人事評価との結びつきに敏感なので、利用目的を明確に制限したほうがよい。

## まとめ

GitHub Copilot usage metrics APIのAI adoption phaseは、Copilot導入管理の粒度を変える更新だ。これまでは、seat、active user、completion、chat、team-level usageのように、誰がどれだけ使ったかが中心だった。今回のcohort追加により、Code first、Agent first、Multi-agentという使い方の段階を見られるようになる。

日本企業にとっての価値は、部門別のAI活用度、教育投資、AI Credits配賦、agent権限設計を同じ会話に載せられることだ。ただし、phaseは成果そのものではなく、成果を分析するためのセグメントである。PR品質、リードタイム、障害率、開発者体験と合わせて読まなければ、単なる利用促進KPIになってしまう。

Copilotは補完ツールから、agentic workflowを含む開発基盤へ移っている。AI adoption phaseは、その移行がどの部門で、どの深さまで進んでいるかを測るための現実的な入口になる。

## 出典

- [Copilot usage metrics API adds cohorts for AI adoption](https://github.blog/changelog/2026-05-29-copilot-usage-metrics-api-adds-cohorts-for-ai-adoption/) - GitHub Changelog, 2026-05-29
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics) - GitHub Docs
- [Team-level Copilot usage metrics now available via API](https://github.blog/changelog/2026-05-14-team-level-copilot-usage-metrics-now-available-via-api/) - GitHub Changelog, 2026-05-14
