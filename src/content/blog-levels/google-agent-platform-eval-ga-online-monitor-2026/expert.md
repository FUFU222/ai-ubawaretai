---
article: 'google-agent-platform-eval-ga-online-monitor-2026'
level: 'expert'
---

Google が 2026年7月31日に発表した Gemini Enterprise Agent Platform の agent and model evaluations GA は、AIエージェント運用の責任境界を一段具体化する更新である。Preview期の評価機能は、主に「エージェント改善をどう回すか」という開発工程の話として読まれやすかった。GA後の焦点は、開発時の実験、本番trace、online monitor、drift alert、Cloud Storage artifact、metric registryを、企業のリリース統制へどう接続するかに移る。

このサイトでは [Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) で、coding agentから評価データ作成、推論、採点、失敗分析、改善を回すPreview期の流れを整理した。さらに [Gemini Agent PlatformのRuntimeとIdentity](/blog/google-gemini-agent-platform-runtime-identity-2026/) では、長時間実行、Agent Identity、Gateway、Registryを本番運用の土台として扱った。今回のGAは、この二つを接続する。つまり、エージェントに権限を与えて本番で動かすなら、その行動品質を継続的に測り、悪化したら止められる構造が必要になる。

結論から言えば、日本企業はこの機能を単なるAutoRaterとして扱うべきではない。設計対象は、評価データ、metric、judge model、trace sampling、費用上限、重大失敗の停止条件、監査ログ保存、例外承認、owner台帳まで含む。AIエージェントの品質保証は、モデル選定ではなく運用システムになる。

## Fact: GAで評価面が本番運用に近づいた

Google Developers Blogは、Agent Platformの評価機能が一般提供になり、開発時と公開後の両方でagentとmodelを測れると説明している。開発者は、local experimentで速く試し、server-side experimentでartifactをCloud Storageへ保存できる。さらに、すでにdeployed agentでtelemetryを有効にしている場合、既存sessionやtraceを評価したり、user simulatorでtraceを作ったりできる。

metricは20以上のpre-built metricから始められる。quality、safety、grounding、agent tool use、trajectory、summarization、translationなどが対象になる。adaptive rubricsは、評価ケース、developer instruction、tool declarationからケース固有の判定基準を作る。custom code metricやcustom LLM-as-a-judge metricは、組織内のversioned registryへ置ける。

この構成が重要なのは、評価条件を再利用できる点だ。PoCごとに別々のスプレッドシートで採点すると、改善したのか、評価者が変わったのか、ケースが変わったのか分からない。metric registryとartifact保存を使えば、少なくとも同じ評価条件で前後比較する足場ができる。

公式ドキュメントのagent evaluation手順は、eval case定義、inference、trace生成、metric計算、分析、最適化という流れである。traceは、モデルの入出力だけでなくtool callを含む行動記録として扱われる。ここが従来のチャット評価と違う。エージェント品質は、最後の文章だけでなく、どのtoolを、どの順番で、どの引数で、どの状態に対して使ったかに依存する。

## Fact: online monitorは回帰検知の入口になる

Googleは、online monitors and telemetry integrationsをGA発表の柱に置いている。本番trafficから得られるtraceを評価し、score-over-time chartやdrift alertを出せる。全リクエストを採点する必要はなく、samplingやtargeted filtersで対象を絞れると説明されている。

この点は、[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で扱ったtraceやmetricsと明確に接続する。Observabilityは、latency、error、tool call、reasoning trace、実行性能を見る。Evaluationは、それが業務目的に照らして良かったかを判定する。両者を混同すると、本番運用を誤る。ログがきれいでも回答が間違っていることはあるし、回答が良くても権限や費用の面で失敗していることもある。

online monitorの実務価値は、公開後に起きる分布変化を拾える点だ。PoCの評価セットでは、よくある質問、想定された顧客属性、安定したtool応答だけを入れがちである。本番では、曖昧な依頼、途中変更、権限不足、古いデータ、tool timeout、利用者の誤入力、組織内の方言が混ざる。これを本番traceから拾い、次の評価セットへ戻せるかどうかが、AIエージェント運用の成熟度になる。

ただし、online monitorは万能ではない。LLM-as-a-judgeを大量に回せば費用が増える。traceには個人情報や顧客情報が含まれる。judge model自体の挙動も変わる可能性がある。したがって、監視対象をrisk-basedに絞り、評価結果を意思決定に使う前に、人間が読むsample reviewを残す必要がある。

## Analysis: リリースゲートは平均点では作れない

ここからは分析だ。

企業がAIエージェントをCI/CDへ組み込むとき、最初に陥りやすいのは、総合スコアを一つ作り、その閾値で合否を決める設計である。これは分かりやすいが危険だ。Task Successの平均が上がっても、禁止toolの実行が1件増えれば本番投入できない場合がある。Final Response Qualityが高くても、承認なしに顧客データを書き換えたら事故である。

リリースゲートは、平均改善指標とzero tolerance条件を分けるべきである。平均改善指標には、task success、tool use quality、trajectory quality、grounding、業務固有rubricを置く。zero tolerance条件には、個人情報漏えい、顧客間データ混在、承認なしの書き込み、禁止API呼び出し、金額上限超過、法務レビューなしの外部送信を置く。

この分離は、日本企業の承認実務に合う。稟議やリリース判定では、全体の便利さよりも、起きてはいけない事故が起きていないかが先に問われる。AIエージェントでも同じだ。平均点は改善の説明に使う。重大失敗は停止条件に使う。両者を混ぜると、重大事故が平均に埋もれる。

また、評価datasetは三層に分けたい。第一は固定回帰セットで、過去の重大失敗や規制上の禁止条件を守る。第二は変更対象セットで、今回の修正が狙った挙動を改善したかを見る。第三は本番sampleセットで、最近の利用傾向や想定外の入力を拾う。この三つを一つの点数にまとめると、どこが改善し、どこが悪化したか分からなくなる。

## Analysis: 評価条件も構成管理の対象になる

AIエージェント本体をGitで管理しても、評価条件が手作業で変わるなら再現性は低い。GA後のAgent Platform evaluationを企業運用に入れるなら、評価条件そのものを構成管理の対象にする必要がある。

残すべき項目は多い。dataset ID、dataset version、case生成方法、raw traceの保管場所、マスキング処理、metric ID、metric version、judge model、judge prompt、tool schema version、agent version、threshold、実行日時、実行者、例外承認、失敗クラスタ、修正PR、再評価結果を残す。Cloud Storage artifactはその一部になるが、会社側の変更管理台帳ともつなげなければならない。

特にcustom rubricはレビュー対象である。たとえば、営業エージェントに「顧客へ積極的に提案する」rubricを入れると、過剰な売り込みを高評価にする可能性がある。法務エージェントに「簡潔に結論を出す」rubricを入れると、必要な留保を省く可能性がある。rubricは仕様であり、プロンプトの一部であり、品質保証の基準でもある。agent本体と同じくらい慎重に扱うべきだ。

judge modelの変更も注意が必要だ。同じ出力でも、judge modelが変われば点数が変わる。企業の説明責任では、「前回よりスコアが上がった」だけでは足りない。どのjudge model、どのrubric、どのdatasetで上がったのかを残す必要がある。

## Analysis: SaaS操作エージェントでは評価対象が広がる

[Gemini EnterpriseとAsana連携](/blog/google-gemini-enterprise-asana-flash-admin-2026/) で整理したように、AIエージェントは検索や要約だけでなく、業務SaaSを操作する方向へ進んでいる。タスク作成、更新、削除、ステータス投稿、CRM更新、承認依頼、メール送信のような操作が入ると、評価対象は回答文から状態変化へ広がる。

この場合、Final Response Qualityだけを見ても不十分である。評価すべきは、正しい対象を選んだか、権限内の操作だったか、承認を取ったか、dry-runと本実行を分けたか、失敗時にrollbackできるか、監査ログでAI経由と分かるかである。environment simulatorで503、遅延、権限不足、競合更新を注入する意味はここにある。

日本企業では、業務SaaSの管理者とAI基盤の管理者が別部門であることが多い。Asana、Salesforce、ServiceNow、Jira、Google Workspace、Microsoft 365、社内ワークフローの権限設計がばらばらなら、AIエージェント評価もばらばらになる。Agent Platform側の評価だけでなく、接続先SaaSの監査ログ、権限、復旧手順と突合する必要がある。

## Implementation: 90日で本番評価を入れる

最初の30日は、対象を一つに絞る。すでに人間が確認している業務、たとえば社内問い合わせ分類、障害一次調査、営業資料検索、契約更新チェック、チケットtriageから選ぶ。過去の失敗例を20から50件集め、個人情報や顧客名をマスキングし、固定回帰セットを作る。

この時点で、metricは増やしすぎない。Task Success、Tool Use Quality、安全条件、業務固有rubricの4種類程度でよい。重大失敗はcode metricまたは人間reviewで確認する。LLM judgeへすべてを任せると、誤判定の原因が読めなくなる。

31日目から60日目は、CIにsoft gateとして入れる。deployを自動停止する前に、baselineとの差分、case別悪化、重大失敗数、judgeの誤判定を2から3週間見る。評価結果を開発チームだけでなく、業務ownerと情シスが読める形式にする。ここでrubricを修正する場合は、agent本体の変更と別PRにする。

61日目から90日目は、本番trace samplingを始める。全trafficではなく、高リスクtoolを呼んだsession、低評価feedbackが付いたsession、retryやtimeoutが多いsession、権限エラーが出たsessionから評価する。online monitorでdrift alertを出し、重大失敗が検出されたときの停止手順を確認する。

同時に費用上限を置く。評価は無料の副産物ではない。LLM-as-a-judge、server-side experiment、Cloud Storage artifact、本番traceの保管、dashboard、運用者のレビュー時間がかかる。評価費用をagent運用費から切り離すと、品質改善にかかる本当のコストが見えなくなる。

## Governance: 日本企業の台帳項目

エージェント台帳には、少なくとも次の項目を入れる。agent名、owner、部署、利用者範囲、Agent Identity、接続データ、tool権限、Gateway経路、Registry登録、評価dataset、metric、monitor設定、重大失敗条件、停止手順、費用上限、保存期間、監査ログ場所である。

評価台帳には、dataset version、metric version、judge model、threshold、実行履歴、失敗クラスタ、例外承認、再評価結果を入れる。AIエージェントの公開承認では、モデル名やプロンプトだけでなく、どの評価条件を満たしたかを確認する。

ログ台帳には、raw trace、マスキング済みtrace、評価結果、monitor alert、human review、修正PRを分けて保存する。個人情報保護の観点では、品質改善目的でraw traceを無期限に残す運用は避けるべきだ。評価用datasetへ入れる前に、氏名、メール、顧客ID、契約番号、社内機密を除去し、rawへ戻れる権限を最小化する。

この台帳化は面倒に見えるが、本番AIエージェントでは避けにくい。エージェントは人間の依頼を受け、toolを呼び、業務データを変える。事故が起きたとき、企業は「モデルがそう言った」ではなく、「どの評価、権限、監視、承認で公開したか」を説明する必要がある。

## まとめ

Gemini Enterprise Agent Platformのagent and model evaluations GAは、AIエージェント評価をPoCの検品から本番運用の制御面へ移す更新である。pre-built metric、adaptive rubrics、custom metric、simulator、online monitor、drift alert、Cloud Storage artifactにより、開発時の実験と公開後のtrace評価をつなぎやすくなる。

日本企業が見るべき焦点は、評価機能の有無ではない。CIゲート、本番監視、重大失敗の停止条件、評価条件のversion管理、traceのマスキング、費用上限、監査台帳を一体で設計できるかである。AIエージェントを業務SaaSや社内APIへ接続するほど、評価は品質改善の道具から、リリース統制と説明責任の基盤へ変わる。

## 出典

- [Agent and Model Evaluations in Gemini Enterprise Agent Platform are now GA](https://developers.googleblog.com/agent-and-model-evaluations-in-gemini-enterprise-agent-platform-are-now-ga/) - Google Developers Blog, 2026-07-31
- [Agent evaluation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/agent-evaluation) - Google Cloud Documentation, last updated 2026-07-30
- [Scale your agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) - Google Cloud Documentation
