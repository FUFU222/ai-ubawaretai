---
title: 'GoogleAgent評価GA、CI監視ゲート設計の要点'
description: 'Google Agent評価GAを整理。Gemini Enterprise Agent Platformの実験、オンライン監視、adaptive rubricsを、日本企業が本番AIエージェントのCI、監査、費用管理へどう入れるか解説する。'
pubDate: '2026-08-01'
category: 'news'
tags: ['Google Cloud', 'Gemini Enterprise', 'AIエージェント', '開発者ツール', '監査ログ', '日本企業']
series: 'google-gemini-enterprise-agent-platform-2026'
draft: false
---

Google は **2026年7月31日**、Gemini Enterprise Agent Platform の agent and model evaluations を一般提供にしたと発表した。開発時の評価ケースと、本番投入後の実利用traceを同じ評価エンジンで測れるようにする更新である。20以上の事前定義metric、DeepMindと連携したadaptive rubrics、custom code metric、LLM-as-a-judge、user simulator、environment simulator、online monitor、drift alert が主な部品として示された。

これは「評価機能が増えた」という小さな話ではない。AIエージェントを本番業務へ入れる企業にとって、失敗を検知する場所が PoC の末尾から、開発中のCI、リリース前の承認、本番後の監視へ広がるという話である。日本企業では、AIエージェントの品質説明が、情シス、法務、内部監査、事業部門、委託先管理にまたがりやすい。GAになったことで、評価基盤を「試験的な採点」ではなく、運用設計の標準部品として検討しやすくなった。

このサイトでは以前、[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) でPreview期の評価フライホイールを扱い、[Gemini Agent PlatformのRuntimeとIdentity](/blog/google-gemini-agent-platform-runtime-identity-2026/) では長時間実行と権限台帳を整理した。今回はその続きとして、評価機能がGAになったあと、日本の開発チームがCIゲート、オンライン監視、監査証跡、費用管理をどうつなぐべきかに絞る。

## 事実: 実験と本番traceを同じ評価面で扱う

Google Developers Blog が強調している事実は、Agent Platform の評価が開発時と本番後の両方を対象にする点だ。開発者はローカル実験で評価ケースを作り、サーバー側実験ではCloud Storageにartifactを残せる。本番後は、すでに収集しているtraceやsessionを評価し、online monitorでlive trafficを継続的に採点できる。

ここで重要なのは、開発時の評価と本番監視が別々の道具にならないことだ。PoCでは合格したが、本番ではユーザーの言い回し、toolの遅延、権限エラー、業務例外によって品質が落ちることがある。逆に、本番で見つかった失敗を次の固定回帰セットへ戻せなければ、同じ事故を繰り返す。Googleの今回のGAは、実験、trace、監視、改善を一つの循環へ載せる狙いがある。

公式ドキュメントでは、評価の工程を eval case の定義、inference、trace生成、metric計算、分析、最適化として整理している。traceはモデル入力、応答、tool callを含む行動記録であり、AIエージェントの品質を「最後の回答だけ」で見ないための材料になる。

日本企業では、このtrace中心の考え方が特に大事だ。社内FAQエージェントでも、CRM更新エージェントでも、最終回答が自然に見えるだけでは足りない。どのデータを参照したか、どのtoolを呼んだか、承認を飛ばしていないか、途中のユーザー訂正を反映したか、個人情報を不要に展開していないかを後から説明できる必要がある。

## 事実: metric、simulator、online monitorの役割

Googleが示したmetricは大きく三つに分けられる。第一に、ROUGE、BLEU、exact matchのような参照ベースや計算ベースのmetric。第二に、Task Success、Tool Use Quality、Trajectory Quality、Safety、Grounding、HallucinationのようなAIエージェント向けの事前定義metric。第三に、企業側が作るcustom code metricやcustom LLM-as-a-judge metricである。

adaptive rubric は、評価ケース、開発者指示、tool宣言からケースごとの判定基準を作る。全ケースへ同じ採点文を当てるより、複雑なmulti-turn agentには向いている。一方で、企業固有の禁止条件、金額上限、承認要否、個人情報分類は、custom metricや決定的なcode checkで補う必要がある。

simulatorも実務上の価値がある。user simulatorは、途中で要件を変える、曖昧に依頼する、確認を求めるといったmulti-turnの会話を作れる。environment simulatorは、tool呼び出しへ失敗、遅延、mock dataを注入できる。これは、本番のCRMや基幹APIを壊さずに、エージェントが障害時にどう動くかを評価するための部品だ。

online monitorは、公開後の品質低下を拾うための仕組みである。Googleは、Cloud Traceなどで集めたtraceを評価し、samplingやtargeted filtersで費用を抑えながらscore-over-timeやdrift alertを出せると説明している。ここは [Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で扱ったObservabilityの次段階として読める。Observabilityが「何が起きたか」を見るなら、Evaluationは「それは良かったか」を判定する。

## 分析: CIゲートと監査証跡へどう落とすか

ここからは分析だ。

日本企業が最初に決めるべきことは、評価を単一の合格点にしないことだ。LLM-as-a-judgeの平均点が上がっても、承認なしの書き込み、顧客間データ混在、個人情報の過剰表示が1件出れば公開を止めるべき場合がある。平均点は改善指標、重大事故は停止条件として分けるほうが現実的である。

CIゲートでは、固定回帰セットと変更対象metricを分ける。固定回帰セットは過去の重大失敗を守るために使う。変更対象metricは、今回直した挙動だけを見る。たとえば、請求問い合わせエージェントで「途中で契約プランを訂正されたら最終回答へ反映する」修正を入れたなら、そのrubricを追加し、同時に既存の安全metricとtool use metricを落としていないかを見る。

本番監視では、全trafficをLLM judgeへ流す必要はない。sampling、部署、エージェント種別、risk tag、tool呼び出し有無、顧客データ更新有無で対象を絞る。高リスク操作だけ評価頻度を上げ、低リスクの社内検索はsampleを薄くする。評価のためのモデル呼び出しも費用になるため、費用台帳に入れなければならない。

監査証跡では、評価結果だけでなく、dataset version、metric version、judge model、agent version、tool schema version、実行日時、threshold、例外承認者を残す必要がある。エージェント本体だけをGitで管理しても、評価条件が変われば合否は変わる。特に金融、医療、公共、製造の品質保証では、ある時点で何を基準に公開したかを説明できる形にしたい。

[Gemini EnterpriseとAsana連携](/blog/google-gemini-enterprise-asana-flash-admin-2026/) のように、AIが業務SaaSを操作する領域では評価の意味が重くなる。検索だけなら誤回答を人間が直せる場面も多い。しかしタスク作成、削除、ステータス更新、顧客レコード変更では、エージェントの出力が業務データに残る。ここでは、final responseの品質より、tool選択、権限、承認、rollbackが評価対象になる。

## 日本企業の90日導入順序

最初の30日は、一つの業務エージェントだけを対象にする。候補は、社内問い合わせ、障害一次調査、営業資料検索、チケット分類のように、人間が結果を確認できる用途がよい。過去の失敗例、想定問答、tool failure、途中変更、禁止操作を20から50件集め、個人情報を除去して固定回帰セットを作る。

次の30日は、CIにsoft gateとして入れる。いきなりdeployを止めず、baselineとの差分、重大失敗数、case別の悪化を毎回記録する。custom rubricは増やしすぎない。Task Success、Tool Use Quality、安全条件、業務固有rubricの4種類程度に抑え、誤判定を人間が読める量にする。

最後の30日は、本番traceのsample評価とdrift alertへ進む。全trafficではなく、高リスクtoolを呼んだsession、低評価feedbackが付いたsession、timeoutやretryが多いsessionから始める。評価結果は、開発チームだけでなく、AI推進、情シス、監査、事業ownerが見られるdashboardへ置く。

同時に、[RuntimeとIdentityの記事](/blog/google-gemini-agent-platform-runtime-identity-2026/) で整理した台帳と結びつける。エージェント名、owner、Agent Identity、利用データ、tool権限、評価セット、monitor設定、停止条件がつながっていなければ、本番運用の説明にならない。評価は独立した品質ツールではなく、エージェント台帳の一部である。

## まとめ

Gemini Enterprise Agent Platform の評価機能GAは、AIエージェントの品質管理を本番運用の部品へ引き上げる更新だ。20以上のmetric、adaptive rubrics、simulator、online monitor、drift alert、Cloud Storage artifactにより、開発時の実験と公開後のtrace評価を接続しやすくなる。

日本企業は、これを「AIがAIを採点する機能」とだけ読まないほうがよい。重要なのは、CIゲート、本番監視、監査証跡、費用台帳、停止条件を同じ設計表へ載せることだ。平均点で安心せず、重大失敗を止める。合成データだけに頼らず、本番traceを匿名化して回帰セットへ戻す。評価条件そのものをversion管理する。この運用を作れるかが、本番AIエージェント導入の次の差になる。

## 出典

- [Agent and Model Evaluations in Gemini Enterprise Agent Platform are now GA](https://developers.googleblog.com/agent-and-model-evaluations-in-gemini-enterprise-agent-platform-are-now-ga/) - Google Developers Blog, 2026-07-31
- [Agent evaluation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/agent-evaluation) - Google Cloud Documentation, last updated 2026-07-30
- [Scale your agents](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale) - Google Cloud Documentation
