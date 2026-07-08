---
article: 'github-copilot-review-cycles-adoption-phase-2026'
level: 'expert'
---

GitHubの2026年7月7日Changelogは、Copilot usage metrics APIのAI adoption phase集計に、review cycleとtime to first reviewを追加したと告知した。短い更新だが、Copilotを開発基盤として運用する企業には重要である。AI利用の成熟度を、active userやinteractionだけでなく、PRレビューの待ち時間と手戻りに接続できるからだ。

この更新は、[Copilot導入cohortでAI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)の自然な続きである。5月の更新で、GitHubはユーザーをAI adoption phaseに分類し始めた。7月の更新では、そのphaseごとにPRレビューのライフサイクル指標が入った。さらに、[Copilot使用指標補正、7月レポート比較の注意点](/blog/github-copilot-usage-metrics-accuracy-2026/)で扱ったように、7月はusage metrics自体の精度改善も入っている。新しいbaselineを作るには、phase、レビュー指標、計測変更を同時に扱う必要がある。

日本企業での読み方は明確だ。Copilot導入を「何人が使ったか」から「レビュー滞留が減ったか」「手戻りが減ったか」「費用増に見合うプロセス改善があるか」へ進める材料になる。ただし、この指標だけで生産性を証明できるわけではない。merged PR限定、merge日計上、PRサイズ依存、品質指標との分離という制約を理解して使う必要がある。

## 事実: 追加された指標の位置づけ

GitHub Changelogによると、今回追加されたのはAI adoption phaseごとのreview cycle数と、PR作成から最初のreview submissionまでの時間である。これらはCopilot usage metrics APIのPR lifecycle metricsとして、phase別の平均値を確認するために使われる。

AI adoption phaseは、直近28日間の利用surfaceをもとにユーザーを分類する。Code firstはコード補完やIDE agent modeを使う段階、Agent firstはCopilot cloud agent、Copilot code review、Copilot CLIなどGitHubベースのagent surfaceを1つ使う段階、Multi-agentは複数surfaceまたはGitHub Copilot appを使う段階として扱われる。

これまでphase別に見られたのは、主にengaged users、user-initiated interactions、code generation、PR作成やmergeに関わる平均値だった。今回、review cycleとtime to first reviewが加わることで、AI活用段階とレビュー運用を同じデータモデルで比較できる。

ここで注意すべきなのは、phaseがPR単位ではなくユーザーの利用段階に基づく点だ。Multi-agent phaseのユーザーが作ったPRでも、当該PRで必ず複数agentを使ったとは限らない。したがって、この指標は「AI利用成熟度の高いユーザー群のPRレビュー傾向」を見るものであり、「このPRはAIで何分短縮された」と直接言えるものではない。

## 事実: merged PRだけが対象になる

GitHubの説明では、PR lifecycle metricsはmerged PRを対象にする。closed without mergeのPRは除外される。同じPRはmergeされた日に1回だけcountされる。

この仕様は、月次レポートの読み方に強い影響を持つ。たとえば、月内にmergeされたPRは指標へ入るが、まだopenの大きなPRは入らない。レビュー待ちで止まっているPRほど集計から漏れやすいという見方もできる。

また、merge日に計上されるため、月末やリリース直前にまとめてmergeする組織では、該当月の平均が大きく振れる可能性がある。first reviewまでの時間が短く見えても、未merge PRの滞留が増えているなら、プロセス全体は改善していない。

review cycle数も同様である。小さなPRへ分割する文化が進めばcycle数は下がりやすい。レビュー基準が緩くなってもcycle数は下がる。反対に、セキュリティ観点や品質観点を強めればcycle数は一時的に増えることがある。したがって、review cycleは単純に低いほど良い指標ではない。

## 指標設計: 何を同じ表に並べるか

日本企業がこの指標を使うなら、まずphase別の人数、PR数、first reviewまでの時間、review cycle数を同じ表に置く。enterprise全体、organization、主要チーム、主要リポジトリの4階層で見ると、全社平均に埋もれる差が出やすい。

次に、[GitHub Copilotチーム別metrics API、部門予算の見方](/blog/github-copilot-team-metrics-api-2026/)で整理したuser-teams reportとの接続が必要になる。AI adoption phaseとレビュー指標をチーム別に見るには、ユーザー、日付、organization、team membershipの扱いを揃える必要がある。複数チーム所属のユーザーは二重計上に注意する。

三つ目に、PRサイズを入れる。変更行数、ファイル数、reviewer数、repository種別、language、生成コード比率を併記する。review cycleが減った理由が、AI活用ではなくPR分割の進展かもしれないからだ。

四つ目に、品質指標を入れる。merge後のrevert、incident、bug ticket、QA差し戻し、セキュリティ指摘、顧客影響を追う。time to first reviewが短くなっても、品質指標が悪化するなら、レビュー速度の改善とは呼びにくい。

五つ目に、AI CreditsやActions minutesを入れる。Copilot code review、cloud agent、CLIを使うほど、AI Creditsや実行基盤コストが増える可能性がある。review cycleが下がり、first reviewが早まり、品質が維持されているなら費用増を説明しやすい。費用だけ増えてレビュー指標が変わらないなら、導入ガイドや対象範囲を見直すべきだ。

## 分析: Copilot導入効果の説明が変わる

ここからは分析だ。

Copilot導入の説明は、これまで利用率に寄りがちだった。何席配ったか、active userが何人か、accept率が何%か、AI Creditsをどれだけ使ったかである。これらは導入の広がりを測るには有効だが、開発プロセスの改善を直接示さない。

今回のreview metricsは、導入効果の説明を一段業務側へ寄せる。開発者がCopilotを使いこなすほど、PRがレビューへ出るまでの準備が早くなるのか。AIが下書きや修正を助けることで、レビューの往復が減るのか。逆に、agentが大きな差分を作ることで、人間レビューの負荷が増えるのか。こうした問いをデータで立てられる。

ただし、相関と因果を混同してはいけない。Multi-agent phaseのチームは、もともと開発基盤が整い、レビュー文化が成熟している可能性がある。そうしたチームはCopilotなしでもfirst reviewが早いかもしれない。AI活用が原因なのか、成熟したチームがAIも早く採用した結果なのかを分ける必要がある。

実務では、導入前後比較、チーム間比較、PRサイズ調整、レビュー体制変更の注記を組み合わせる。可能なら、Copilot活用を広げる前にbaselineを保存し、導入後の変化を同じ定義で追う。7月のusage metrics補正が入った後は、補正前後を同一系列として扱わないほうがよい。

## Copilot code reviewとの関係

今回の指標は、Copilot code reviewの運用評価にも使える。だが、Copilot code reviewを入れればreview cycleが自動的に減るとは限らない。

[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/)で整理したように、Copilot code reviewはrunner、content exclusion、custom instructions、Actions、AI Creditsと結びつく。AIレビューが有効でも、重要なファイルがcontent exclusionで見えなければ、コメントは浅くなる。custom instructionsが散らかっていれば、レビュー観点がぶれる。runner設定が不適切なら、内部依存やテスト前提を読めない場合がある。

したがって、review cycleが増えたときは、AIが悪いと即断しない。PRサイズが大きくなったのか、content exclusionで文脈が欠けたのか、instructionsが過剰に細かいのか、レビュー基準が厳しくなったのかを切り分ける。

逆に、review cycleが減ったときも注意が必要だ。AIレビューに依存しすぎて、人間が深い設計レビューを省略している可能性がある。特に認証、課金、個人情報、セキュリティ境界、データ移行のPRでは、cycle数よりレビュー観点の網羅性を優先するべきだ。

## 日本企業向けの運用モデル

第一段階は、月次のCopilot adoption reportにreview metricsを追加することだ。既存のactive users、AI adoption phase、AI Credits、team metricsに、first review timeとreview cycleを並べる。最初から成果評価に使うのではなく、3か月程度はbaseline作成として扱う。

第二段階は、チームごとの差分を見ることだ。Multi-agent比率が高いチーム、Code firstに偏るチーム、AI Credits消費が高いチーム、レビュー滞留が長いチームを分類する。この4象限で見ると、教育すべきチーム、費用を増やす価値があるチーム、レビュー体制を直すべきチームが分かれやすい。

第三段階は、レビューSLOに接続することだ。たとえば、通常PRは24時間以内にfirst review、重要PRは担当reviewer明示、セキュリティPRはAIレビューだけでcloseしない、といったルールを作る。Copilot指標はSLO違反の検知に使い、罰則ではなくボトルネック発見に使う。

第四段階は、費用説明に接続することだ。Agent firstやMulti-agentの比率が上がると、AI Credits消費も増えやすい。費用増を認める条件として、レビュー待ち時間、review cycle、merge lead time、品質指標のどれが改善しているかを示す。これは情シス、FinOps、開発責任者、経理の共通資料になる。

第五段階は、例外チームを深掘りすることだ。AI adoption phaseが高いのにreview cycleが多いチームは、AIが大きな差分を作りすぎている可能性がある。phaseが低いのにfirst reviewが速いチームは、そもそも人間レビュー体制が強く、AI教育の優先度は低いかもしれない。phaseが高く、AI Creditsも高く、品質が悪いチームは、すぐに利用ガイドと権限を見直す対象になる。

## データ取り込み時の注意

Copilot usage metrics APIは、レポート取得のためのURLを返す形式を使う。企業側では、日次で取得し、DWHやBIへ保存する設計が必要になる。取得時刻、API version、対象scope、report type、データ確定タイミングを保存しなければ、後から数字がずれたときに説明できない。

7月の精度改善を踏まえると、直近数日は暫定値として扱い、月次締めでは確定後に再取得する運用が望ましい。CLI versionやtelemetry条件の違いも、usage metrics全体の解釈に影響する。

チーム別に見る場合は、日次のmembershipと日次のusageを結合する。現在の組織図で過去データをまとめ直すと、異動や兼務の影響で配賦がずれる。日本企業では半期異動やプロジェクト兼務が多いため、過去時点のteam membershipを保存することが重要だ。

また、PR lifecycle metricsはmerged PRベースなので、GitHubのPRデータも別に持つべきだ。open PR age、draft duration、review requestedから未対応の時間、reviewer load、label、repository、code ownersを合わせると、Copilot metricsの解釈が安定する。

## 誤読を避けるレポート文例

社内資料では、次のように書くと誤読を減らせる。

「2026年7月7日以降、Copilot usage metrics APIではAI adoption phase別にmerged PRのfirst reviewまでの時間とreview cycle数を確認できる。本指標はmerge日に計上され、未merge PRは含まれない。したがって、レビュー滞留の評価にはopen PR age、PRサイズ、品質指標、AI Creditsを併記する。」

この注記を入れずに平均値だけを出すと、現場は「レビューが遅いチームのランキング」と受け止めやすい。目的は罰することではなく、AI導入とレビュー運用の詰まりを見つけることだと明記したほうがよい。

## まとめ

Copilot usage metrics APIへのreview cycleとtime to first review追加は、AI adoption phaseを利用分類から開発プロセス評価へ近づける更新である。日本企業は、Copilot導入の説明をactive user数やAI Creditsだけに閉じず、PRレビューの待ち時間と手戻りまで広げられる。

一方で、指標はmerged PR限定で、merge日に計上される。未merge PR、PRサイズ、品質、チーム所属、費用を一緒に見なければ、速度改善を過大評価する危険がある。まずは既存のCopilot usage metrics基盤に新フィールドを取り込み、3か月のbaselineを作る。そのうえで、教育、権限、Copilot code review設定、AI Credits予算を調整するのが現実的である。

## 出典

- [Add review cycles and time to adoption phases in the usage API](https://github.blog/changelog/2026-07-07-add-review-cycles-and-time-to-adoption-phases-in-the-usage-api/) - GitHub Changelog, 2026-07-07
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/rest/copilot/copilot-usage-metrics) - GitHub Docs
- [Copilot usage metrics API adds cohorts for AI adoption](https://github.blog/changelog/2026-05-29-copilot-usage-metrics-api-adds-cohorts-for-ai-adoption/) - GitHub Changelog, 2026-05-29
