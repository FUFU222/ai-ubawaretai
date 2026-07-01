---
article: 'google-agent-quality-flywheel-evaluation-2026'
level: 'expert'
---

GoogleのAgent Quality Flywheelは、評価機能の追加というより、agent engineeringの変更管理を一つのloopへまとめる提案として読むべきだ。評価dataset、実行trace、adaptive AutoRater、custom rubric、failure clustering、prompt optimizationをcoding agentがorchestrateし、改善前後の差分を残す。

企業での論点は「skillをinstallすれば品質が上がるか」ではない。評価対象、評価者、metric、dataset、thresholdのversionを分離し、AIエージェントの変更を再現可能な実験にできるかである。Google Developers Blogの例は、自然言語の依頼からskillが適切なmetricを選ぶ便利さを示す一方、adaptiveな採点の限界も明示している。

本稿では、[Gemini Enterprise Agent Platformの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で扱ったtraceを評価へ接続し、[Gemini EnterpriseとAsanaの管理境界](/blog/google-gemini-enterprise-asana-flash-admin-2026/) のような業務agentにrelease gateを置く前提で、技術構成を掘り下げる。

## 事実: skillがorchestrateする5段階

Googleが公開した流れは、Prepare Data、Run Inference、Grade、Analyze Failures、Optimize & Iterateの5段階である。

Prepare Dataでは、OpenTelemetry trace、手作りのcase、User Simulatorによる合成scenarioを評価datasetへ変換する。Run Inferenceではdatasetに対してagentを実行し、turn、tool call、state、final responseを含むtraceを得る。すでに本番traceがある場合は推論を省略し、そのtraceを直接評価できる。

Gradeは唯一、すべてのloopで実行される段階だ。Google管理のadaptive AutoRater、custom LLM rubric、custom code metricを選び、caseごとのscoreと説明を生成する。Analyze Failuresではrubric verdictを読み、失敗が10件以上ならAutomatic Loss Analysisで類似原因をcluster化する。Optimize & Iterateでは、clusterに対応するprompt、tool schema、routing、state処理などを直し、同じbaselineへ戻す。

Googleの実例は、multi-turn travel agentが途中で更新された旅行条件を最終回答へ反映できるかを測った。predefinedなmulti-turn task successは失敗を検出できたが、複数criteriaのうち一つとして平均化され、更新無視だけの安定した時系列指標にはならなかった。skillは `revision_honored` というcategorical rubricを追加し、HONORED、IGNORED、PARTIAL、NO_REVISIONの件数を比較可能にした。

これはadaptive metricの否定ではない。adaptive metricは未知の失敗を広く捉えるhealth signalとして使い、修正対象には固定rubricまたはdeterministic countを追加する、という役割分担だ。Googleの例でも、built-in metricは広い品質を示し、custom rubricは21%から5%という具体的な改善を測った。

## 評価アーキテクチャ: optimizerとevaluatorを分離する

Googleは「optimizer never grades its own work」と説明する。coding agentや自動optimizerは修正を提案するが、採点はGemini Enterprise Agent PlatformのGenAI evaluation serviceが行う。この分離は、reward hackingやmetric gamingを完全に防ぐものではないが、自己承認loopを切る最小要件になる。

実装では4つのidentityを分けるとよい。

1. **change identity**: promptやcodeを変更するCI principal。
2. **execution identity**: staging環境でagentを動かし、toolへアクセスするprincipal。
3. **evaluation identity**: datasetとmetricを読み、評価serviceを呼ぶprincipal。
4. **approval identity**: gate結果を確認し、本番反映を承認する人またはpolicy。

change identityがmetric thresholdやdatasetを同じPRで変更できると、agentの改善ではなく試験を簡単にして合格できる。metric変更は別artifactとし、owner reviewを必須にする。evaluation identityは本番toolへのwrite権限を持たず、replay用のread-only fixtureまたはsandboxへ接続する。approval identityには評価結果だけでなく、dataset version、metric version、model version、run countを渡す。

evaluation serviceが別でも、同じmodel familyを使う場合には相関したbiasが残る。たとえば、長い回答を高く評価する傾向、特定のtool orderingを好む傾向が、optimizerとjudgeの両方に現れる可能性がある。重大なdomainでは、custom code metric、人間sample review、必要に応じて異なるmodel familyのjudgeを組み合わせるべきだ。

## Metric Registryをrelease contractとして扱う

Gemini Enterprise Agent PlatformのMetric Registryは、predefined metric、custom LLM metric、custom code metricを保存し、offline evaluationとcontinuous online monitorへ再利用できる。これを単なる設定保存としてではなく、release contractとしてversion管理するとよい。

predefined metricには、single-turn向けのfinal response quality、hallucination、tool use quality、安全性、multi-turn向けのtask success、tool use quality、trajectory qualityがある。adaptive rubricはagent設定、tool declaration、user intentからcase固有criteriaを作るため、reference answerを用意しにくいagentへ向く。

custom LLM metricは、企業固有の意味条件を評価する。たとえば「契約レビューで根拠条項と不確実性を分けたか」「障害報告で観測事実と推測を混ぜていないか」「顧客の最新訂正を最終回答へ反映したか」である。rating scaleと判定理由を構造化し、同じmetric definitionを複数runへ適用する。

custom code metricは、決定的に検証できる条件へ使う。JSON schema、必須citation数、tool allowlist、金額上限、PII pattern、latency、token budget、state transitionなどだ。LLM judgeが「おそらく守った」と判定する必要がない条件はcodeへ寄せる。

metricには少なくとも次のmetadataを持たせたい。

- metric IDとsemantic version
- ownerと承認者
- 対象agent、言語、業務範囲
- 必須入力fieldと欠損時の扱い
- judge modelとsampling設定
- thresholdとblocking条件
- known limitationと誤判定例
- 作成日、最終validation日、retirement条件

Preview期間中はmanaged metricの中身やmodelが更新される可能性を考える必要がある。同じagentとdatasetでも、judge側の変更でscoreが動く可能性があるため、評価runにはjudge modelまたはservice versionを記録する。versionが公開されない場合は、定期的なcanary datasetでdriftを検出する。

## Dataset設計: 固定、直近、探索を混ぜない

agent評価datasetは、性質の異なる三つへ分けるべきだ。

**固定回帰セット**は、過去の事故、重要業務、契約上の必須条件を保持する。内容はむやみに入れ替えず、agent変更の比較軸にする。失敗が見つかったら、匿名化した最小再現caseを追加する。

**直近本番サンプル**は、利用者の言い回し、季節性、新しいtool、業務ルール変更を捉える。期間を決めてsampleし、PII除去とaccess reviewを通す。固定セットと異なり、一定期間でrolling updateする。

**探索用合成セット**は、rare caseやadversarial conditionを広げる。User Simulatorで途中変更、曖昧な指示、tool timeout、矛盾した要求、長い会話などを生成する。実利用の分布とは異なるため、合成セットのscoreを全体品質へ直接換算しない。

三つを一つの平均へ混ぜると、固定回帰が改善したのか、本番傾向が変わったのか、探索caseが難しくなったのか判断できない。dashboardとgateはdataset cohortごとに表示する。blocking条件も分け、固定回帰の重大失敗は即時block、直近sampleは悪化率、探索setは調査triggerとして使う。

本番traceには、利用者入力だけでなくtool call、tool response、state update、approval、final responseが必要だ。[Google Julesのプロアクティブ評価](/blog/google-jules-proactive-coding-agent-eval-2026/) と同様、結果だけではagentの誤った経路を見逃す。最終回答が正しくても、権限外toolを偶然使ったなら合格にできない。

## Adaptive AutoRaterの統計的な読み方

adaptive AutoRaterは、caseごとにrubricを生成し、複数sampleのmajority voteを使う。固定式のexact matchより柔軟だが、scoreは確率的な観測になる。1回の0.74と0.77を有意な改善とみなすのは危険だ。

最低限、同一条件で複数runを取り、case-level deltaを保存する。dataset全体の平均だけでなく、改善、悪化、不変のcase数を見る。重大caseは平均から切り離す。judge explanationをsample reviewし、metricが意図した失敗を本当に見ているか確認する。

before-after比較では、同じdataset、同じmetric definition、同じjudge設定を使う。agentのmodel、prompt、tool schema以外を固定する。一度に複数要素を変えると、どの変更が効いたか分からない。A/Bのrun orderも偏りを避けるため交互にし、可能なら同じcaseをpaired comparisonとして扱う。

adaptive rubricは毎回criteriaが変わるため、広いhealth signalとして見る。特定のrelease目的には固定custom rubricを追加し、categorical outcomeをcountする。Googleの旅行例で `revision_honored` を独立させたのは、このpaired comparisonを安定させるためである。

また、thresholdは初回の数字から決めない。数週間shadow runし、人間判定とのfalse positive、false negativeを確認する。blocking gateへ昇格させるのは、metricの判定理由が安定し、誤判定時のoverride手順が整ってからにする。

## Failure clusteringから修正単位を決める

失敗が少数なら、verdictを直接読むほうが速い。Googleは10件以上をfailure clusteringの目安としている。件数が増えたらAutomatic Loss Analysisを使い、症状ではなく原因候補でまとめる。

たとえば「日付を間違えた」失敗が20件あっても、原因は一つではない。state更新後にfinal answerが古い値を参照した、tool responseがtimezoneを落とした、plannerがユーザー訂正を低優先にした、judgeが和暦を誤判定した、といったclusterがあり得る。すべてへ「日付を必ず確認せよ」というpromptを足すと、tokenが増え、別の挙動を壊す。

clusterごとに修正層を選ぶ。

- instruction問題はsystem promptまたはpolicy。
- state問題はmemory schemaと更新規則。
- tool問題はschema、validation、timeout、retry。
- routing問題はclassifierとfallback。
- presentation問題はfinal response composer。
- evaluator問題はrubricまたはinput normalization。

修正後は対象clusterのmetricだけでなく、全体health metricも再実行する。局所改善が別clusterを悪化させていないかを見る。変更量を小さくし、commitとevaluation run IDを結び付ければ、悪化時に戻しやすい。

## 日本企業のデータ保護と監査証跡

本番traceを評価へ使う場合、利用目的、保存期間、アクセス権、越境移転、委託先条件を確認する必要がある。品質改善だから無条件に全会話を保存できるわけではない。特に顧客サポート、人事、金融、医療のtraceは、個人情報や要配慮情報を含みやすい。

ingestion前に、氏名、メール、電話番号、住所、顧客ID、契約番号、free text内の秘密情報を検出してmaskする。raw traceは短期・限定accessにし、評価datasetは不可逆なtokenまたは合成値へ置換する。tool responseに添付やdatabase recordが含まれる場合は、本文だけでなくmetadataも確認する。

監査証跡には、datasetの由来、匿名化処理、利用同意または社内根拠、metric、judge、結果、human override、最終承認を残す。人間がAutoRaterを覆した場合は、理由と再発防止を記録する。overrideが多いmetricはgateに向かないため、rubricの見直し対象にする。

evaluation result自体にも機密が含まれ得る。judge explanationが入力内容を再掲することがあるからだ。結果dashboardの閲覧権限とretentionもraw traceと同様に設計する。

## CI/CDへ組み込む段階

第1段階はlocalまたはmanual runだ。20〜50件の固定datasetで、metricの説明が人間判断と合うかを見る。この段階ではscoreをrelease判断に使わない。

第2段階はCI shadow modeだ。PRごとに評価し、結果をcommentするがmergeは止めない。run time、cost、flakiness、judge driftを測る。agent codeと評価artifactのcommit hashを記録する。

第3段階はselective blockingだ。PII、禁止tool、承認skip、schema破壊など決定的な重大条件だけblockする。adaptive scoreはwarningまたは人間review triggerに留める。

第4段階で、安定したcustom rubricをsoft thresholdへ上げる。baseline比の悪化、confidence interval、複数runの一致を条件にする。単発scoreで止めない。

第5段階はonline monitorとの接続だ。offlineで見つからない本番傾向を検出し、直近sample datasetへ戻す。ただしonline monitorの警告から自動でpromptを変更し、自動で本番へ出すclosed loopは避ける。Googleのskillも「提案し、人が承認する」human-in-the-loopであり、完全自律ではない。

[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) のようなruntimeを使う場合でも、evaluation planeは独立させる。runtimeのavailability、sandbox、session persistenceは実行信頼性の問題であり、task successやpolicy complianceとは別である。observabilityが証拠を集め、evaluationが比較し、approvalが採否を決める。

## 導入時の最小構成

最小構成は次の通りだ。

- 1つの業務agent
- 30件前後の匿名化固定dataset
- predefined task success
- predefined tool useまたはtrajectory quality
- 1つの業務固有custom rubric
- 2つのcustom code metric
- 変更前後それぞれ複数run
- case-level deltaとjudge explanation
- 重大失敗の手動review

custom code metricは、output schemaと禁止toolの2つから始めるとよい。custom rubricは、今回の変更目的に直接対応する一つだけにする。metricを10個並べるより、「何を直し、何が悪化してはいけないか」を説明できる構成のほうが運用しやすい。

成功条件は「平均score 0.8以上」のような一行にしない。固定回帰setで重大失敗0件、target rubricの失敗率がbaselineより改善、全体task successが許容幅を超えて悪化しない、judge誤判定率が上限以下、と複数条件へ分ける。

## まとめ

Agent Quality Flywheelの実務価値は、coding agentが評価CLIを代行することではなく、agent変更をdataset、metric、trace、before-afterへ接続する点にある。改善者と評価者を分け、adaptive metricを広いhealth signal、custom rubricを変更対象の安定指標、custom code metricを決定的な安全条件として使い分ける。

本番導入では、固定回帰、直近本番、探索合成のdatasetを分け、平均scoreではなくcase-level deltaと重大失敗を見る。judgeも確率的である以上、複数run、human sample review、metric version管理が必要だ。Preview機能を唯一のgateにせず、shadow modeから段階的にblockingへ上げる。

日本企業にとって最初の成果は、高度な自動最適化ではない。過去の事故を匿名化した再現caseにし、同じ変更を同じ条件で測り、なぜ合格したかを監査可能にすることだ。その基礎があって初めて、evaluation flywheelは継続改善の基盤になる。

## 出典

- [Driving the Agent Quality Flywheel from Your Coding Agent](https://developers.googleblog.com/driving-the-agent-quality-flywheel-from-your-coding-agent/) - Google Developers Blog, 2026-06-30
- [Manage evaluation metrics](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/manage-metrics) - Google Cloud Documentation
- [Analyze evaluation results and failure clusters](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/view-results) - Google Cloud Documentation
