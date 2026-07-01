---
title: 'Google Agent評価基盤、回帰を防ぐ5段階の実装'
description: 'Google Agent Quality Flywheelは、coding agentから評価データ作成、推論、AutoRater採点、失敗分析、改善を回す仕組みだ。日本企業が本番AIエージェントの回帰を防ぎ、改善効果を測る設計と注意点を整理する。'
pubDate: '2026-07-01'
category: 'news'
tags: ['Google Cloud', 'Gemini Enterprise', 'AIエージェント', '開発者ツール', '監査ログ', '日本企業']
series: 'google-gemini-enterprise-agent-platform-2026'
draft: false
---

Google は2026年6月30日、**Agent Quality Flywheel** を coding agent から動かすための skill を公開した。狙いは、AIエージェントのpromptや実装を直したときに、「目の前の失敗は直ったが、別のケースを壊した」という回帰を減らすことだ。開発者は自然言語で評価したい懸念を伝え、skillがデータ準備、推論、採点、失敗分析、改善後の再評価を組み立てる。

これは単なる評価CLIのラッパーではない。Googleは、改善案を作る側と評価する側を分け、Gemini Enterprise Agent PlatformのGenAI evaluation serviceが独立して採点する構成を示した。エージェント自身に自分の修正を採点させないことで、指標に合わせただけの改善を避ける設計である。

このサイトでは、[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) でtraceやOpenTelemetryを扱い、[Gemini EnterpriseとAsana連携](/blog/google-gemini-enterprise-asana-flash-admin-2026/) では業務エージェントの管理境界を整理した。今回の更新は、その運用データを「改善が本当に効いたか」を判定する工程へつなぐものだ。

日本企業にとって重要なのは、評価をPoCの最後に一度だけ行う検品から、変更のたびに回す開発工程へ変えられる点にある。ただし、AutoRaterの点数をそのまま品質保証として扱ってはいけない。Google自身も、model-basedな採点は方向性を示す信号であり、単一スコアの絶対値よりも同じ条件での前後差を重視すべきだと説明している。

## 事実: 5段階の評価フライホイール

Google Developers Blogが示した工程は5段階だ。

1. **Prepare Data**: OpenTelemetry trace、手作業のケース、合成シナリオから評価データを作る。
2. **Run Inference**: 評価対象のエージェントをデータ上で動かし、traceを生成する。既存traceがあれば省略できる。
3. **Grade**: adaptive AutoRaterまたはcustom metricで採点する。この段階は毎回実行する。
4. **Analyze Failures**: rubricの判定理由を読み、失敗が10件以上ならAutomatic Loss Analysisでクラスタ化する。
5. **Optimize & Iterate**: 原因に絞った変更を加え、推論と採点を再実行し、baselineと比較する。

Googleはこの流れを、単発のテストではなく反復ループとして説明している。初回は5段階を順番に実行し、その後は品質目標を満たすまで2〜5を回す。対象はADKだけに限定されない。Googleが案内する `agent-platform-eval-flywheel` はEvaluation SDKを直接使う構成で、任意のframeworkを対象にできるとしている。

公式例では、旅行計画エージェントが会話途中で変更された日程やホテル希望を最終回答へ反映できるかを評価した。adaptiveなmulti-turn task successだけでは、複数の評価基準へ点数が分散し、「変更を守ったか」という一つの問題を継続的に数えにくかった。そこでskillは `revision_honored` というcustom rubricを追加し、変更を無視した比率を前後比較できる形にした。

この例が示すのは、万能な一つのスコアを探すのではなく、変更対象に対応する安定した指標を用意する必要性だ。広い健全性はadaptive metricで見つつ、今回直した挙動はcustom rubricや決定的なcountで測る。両方が揃って初めて、局所修正と全体回帰を同時に確認できる。

## 事実: AutoRaterとcustom metricの役割

Gemini Enterprise Agent Platformの公式ドキュメントでは、評価指標を3種類に分けている。Google管理のpredefined metric、自然言語rubricを使うcustom LLM metric、Python関数で判定するcustom code metricだ。

predefined metricには、最終応答品質、hallucination、tool use quality、安全性がある。multi-turn向けには、会話全体の目的達成を測るtask success、tool選択や引数を測るtool use quality、目的へ至る経路を測るtrajectory qualityが用意される。adaptive rubricは、エージェントの設定やユーザーの目的に応じて評価基準を生成できるため、事前に正解文をすべて用意できない業務エージェントへ使いやすい。

一方、custom LLM metricは「契約更新の提案で必ず根拠条項を示したか」「途中で変更された納期を最終回答へ反映したか」のような、企業固有の要件に向く。custom code metricは、JSON schema、必須field、特定toolの実行結果、金額上限など、プログラムで判定できる条件に向く。

事実としてもう一つ重要なのは、Agent Platformの評価機能が発表時点でPreviewであることだ。公式ドキュメントにはPre-GA条件が適用され、提供形態やsupportが限定される可能性があると明記されている。本番の唯一の品質ゲートへ直ちに据えるのではなく、既存のテストや人間レビューと併用する判断が必要になる。

## 分析: 改善側と採点側を分ける意味

ここからは分析だ。

AIエージェントの評価で最も危険なのは、改善するモデルと採点するモデルが同じ文脈と目的を共有し、点数だけを上げる変更へ寄ることだ。たとえば、丁寧さを測るrubricがあると、回答を長くするだけで点数が上がる場合がある。tool useを評価すると、不要なtool callを増やす方向へ最適化されるかもしれない。

Googleが「optimizer never grades its own work」と強調したのは、この問題を避けるためだ。coding agentは評価計画や修正案を作るが、採点は別のevaluation serviceへ渡す。完全な独立ではなくても、少なくとも同じ実行主体が自分の変更をそのまま合格にしない構造になる。

日本企業でこの原則を使うなら、モデルだけでなく権限と記録も分けたい。変更を作るCI jobと評価jobを分離し、評価データ、metric version、threshold、baselineを変更PRから勝手に書き換えられないようにする。custom rubricを更新する場合は、agent本体の変更とは別にreviewする。評価結果にはモデル名、設定、データセットversion、実行日時を残す。

これは従来のソフトウェアテストと同じ発想に見えるが、生成AIでは重要度が上がる。出力が非決定的で、評価側もmodel-basedだからだ。評価者を分けるだけで真実が得られるわけではない。それでも、変更者と判定者を分け、結果を前回baselineと比較可能にすることで、少なくとも「直した本人の印象だけで公開する」状態から抜けられる。

## 分析: 本番traceと合成シナリオをどう使い分けるか

合成シナリオは、評価データがない初期段階に有効だ。個人情報や顧客データを持ち込まず、境界条件、途中変更、tool失敗、曖昧な依頼などを大量に作れる。新しい業務エージェントのcold startでは、最初の回帰セットを作る現実的な方法になる。

ただし、合成データだけでは利用者の言い回し、社内用語、業務の例外、長い会話の脱線、実際のtool latencyを再現しきれない。Googleも合成シナリオはbootstrapであり、本番データが評価loopを鋭くすると説明している。したがって、運用開始後は同意・匿名化・アクセス制御を前提に、本番traceから代表ケースを抽出する必要がある。

[Google Julesのプロアクティブ評価](/blog/google-jules-proactive-coding-agent-eval-2026/) でも、エージェントの評価には結果だけでなく、根拠と実行過程を見る必要があった。業務エージェントも同じだ。最終回答が正しく見えても、禁止されたtoolを使ったり、古い顧客情報を参照したり、途中のユーザー訂正を無視したりすることがある。final response、tool call、state change、承認履歴を一つのtraceとして評価できる設計が必要だ。

日本で本番traceを評価へ回す際は、個人情報保護と目的外利用に注意したい。評価用datasetへ格納する前に、氏名、メール、顧客ID、契約番号をマスキングし、raw traceへのアクセスを限定する。保存期間と削除手順を決め、評価結果から原文へ戻れる人を最小化する。品質改善の名目で会話ログを無期限に蓄積する運用は避けるべきだ。

## 日本企業向けの回帰ゲート設計

最初に、失敗を4種類へ分けると設計しやすい。

- **業務結果の失敗**: 依頼を達成していない、変更を反映していない、必要な根拠がない。
- **実行経路の失敗**: 不要なtoolを使った、順序が不正、timeoutやretryが過剰。
- **安全・統制の失敗**: 個人情報を出した、禁止操作を実行した、人間承認を飛ばした。
- **運用品質の失敗**: latency、cost、error率、再試行回数が上限を超えた。

次に、それぞれへmetricを割り当てる。業務結果はadaptive task successと業務固有のcustom rubric、実行経路はtrajectoryやtool use quality、安全条件はcustom code metricと人手監査、運用品質は通常のobservability指標で測る。一つのLLM judgeへすべてを任せない。

公開ゲートには、平均点だけでなく重大失敗を置く。たとえばtask successの平均が上がっていても、個人情報漏えいが1件出たら公開を止める。契約金額を誤る、承認なしに更新する、顧客間データを混ぜるといった事故もzero toleranceにする。その他の指標は、baseline比で悪化率を決める。

さらに、評価データを「固定回帰セット」「直近本番サンプル」「探索用合成セット」に分ける。固定セットは過去の重大事故を守る。直近サンプルは利用傾向の変化を捉える。合成セットは未経験の境界条件を探す。三つを混ぜて一つの点数にすると、どこが改善したか分からなくなるため、結果は別々に表示する。

評価基盤は、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) のような実行基盤とは別の責任を持つ。実行環境が安定していても回答品質は保証されず、評価点が高くても権限設計は保証されない。runtime、observability、evaluation、approvalを分け、相互に証拠を渡す構成が現実的だ。

## 30日で始める段階導入

最初の1週は、対象業務を一つに絞る。問い合わせ分類、社内文書検索、障害一次調査など、出力の採否を人間が確認できる用途がよい。過去に困った失敗を20〜30件集め、個人情報を除去した固定回帰セットを作る。成功条件を自然言語だけでなく、必須fieldや禁止操作として定義する。

2週目は、predefined metricを2つ、custom metricを1つだけ使う。task success、tool use quality、業務固有rubric程度から始める。指標を増やしすぎると、どの改善がどの結果へ効いたか読めない。評価者の説明を人間が読み、明らかな誤判定を記録する。

3週目は、一つの実装変更でbefore-afterを取る。dataset、metric、model設定を固定し、複数回実行して揺れを見る。平均値だけでなく、失敗件数、重大失敗、case別の変化を確認する。評価側の誤判定が多い場合は、agentではなくrubricを先に直す。

4週目はCIへ接続する。ただし最初から完全自動でdeployを止めず、warningとして運用する。2〜3週間の結果が安定したら、重大失敗はblocking、平均指標はsoft gateにする。Preview機能の変更に備え、評価結果を自社側にも保存し、手動評価へ戻れる手順を残す。

## まとめ

Google Agent Quality Flywheelは、AIエージェントの評価を「試して良さそうだった」から、データ準備、独立採点、失敗分析、修正、再評価の反復工程へ移す提案だ。coding agentから自然言語で操作できる点は便利だが、価値の中心は自動化そのものではない。改善する側と採点する側を分け、同じbaselineで前後差を測る設計にある。

日本企業は、AutoRaterの点数を品質保証書として扱うのではなく、回帰を早く見つける信号として使うべきだ。adaptive metricで全体を見て、業務固有rubricで変更対象を測り、決定的な安全条件はcodeと人間で確認する。本番traceは匿名化とアクセス制御を前提に取り込み、固定回帰セットと分けて管理する。

Agent Platformの評価機能は発表時点でPreviewだ。まず一業務、一変更、一つのbefore-afterから始める。その小さな反復を継続できるかが、評価項目を大量に並べることより重要である。

## 出典

- [Driving the Agent Quality Flywheel from Your Coding Agent](https://developers.googleblog.com/driving-the-agent-quality-flywheel-from-your-coding-agent/) - Google Developers Blog, 2026-06-30
- [Manage evaluation metrics](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/manage-metrics) - Google Cloud Documentation
- [Analyze evaluation results and failure clusters](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/view-results) - Google Cloud Documentation
