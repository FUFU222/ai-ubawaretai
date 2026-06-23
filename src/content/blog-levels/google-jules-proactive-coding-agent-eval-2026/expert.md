---
article: 'google-jules-proactive-coding-agent-eval-2026'
level: 'expert'
---

Google の **Measuring What Matters with Jules** は、AI コーディングエージェントの評価軸を、修正タスクの達成率から、長い開発文脈に対する洞察の質へ広げる記事である。Jules という名前は Google Labs の coding agent 文脈で出ているが、この記事の実務的な価値は製品紹介よりも、agent evaluation の設計にある。

日本企業が AI コーディング agent を導入するとき、PoC はどうしても「この issue を直せた」「テストが通った」「PR を作れた」という見せ方になりやすい。しかし、開発組織に本当に影響するのは、agent が長く動いたときに、どの情報を集め、どの問題を重要と判断し、どの時点で人間を中断するかである。Google の記事は、この部分を **insight policy** として測ろうとしている。

この論点は、既存の Google agent 基盤記事の続きとして読むと分かりやすい。[Gemini Code AssistからAntigravityへの移行](/blog/google-antigravity-code-assist-migration-2026/) は開発者の操作面、[Google Colab CLI](/blog/google-colab-cli-agent-runtime-2026/) は agent が使える実行環境、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) は API 側の agent 実行基盤を扱った。Jules の評価記事は、その上に「実行した agent のふるまいをどう測るか」を置く。

## 事実: GoogleはInsight Policyを評価対象に置いた

Google Developers Blog は、AI coding agents が reactive assistant から proactive engine へ進みつつあると説明する。ここでいう proactive は、単にスケジュール実行するという意味だけではない。コードベースや開発状態を継続的に取り込み、リスク、関連する不具合、診断的な観察を見つけ、開発者が聞く前に提示する能力を含む。

記事は、SWE-Bench のような benchmark が狭いタスクの完了能力を測るのに対し、goal に対する benchmark が不足していると指摘する。ゴール型の作業では、問題文が明確に与えられていない。agent は、コードベースを探索し、関連する証拠を集め、何が開発者の上位目的に効くかを判断しなければならない。

そこで Google は、agent の insight policy を評価する必要があると述べている。これは、何を重要と見るか、どの証拠で支えるか、開発者に通知するか、質問するか、下書きを作るか、あるいは黙るかを決める方針である。企業導入に置き換えると、これは agent の「割り込み方針」であり、単なるモデル性能ではない。

## 事実: Bug履歴からゴールを復元する

Google の評価セット作成では、内部コードベースの 705 bugs と 1,178 CLs が使われた。記事は、時間的に近く、意味的にも似た bug 群をまとめることで、開発者が実際に取り組んでいた上位ゴールを推定する方法を説明している。個々の bug は狭いが、短期間に複数の関連 bug が修正されていれば、その背後に共通の engineering effort があるという仮説である。

この設計は実務的に重要だ。企業の issue tracker には「ログが出ない」「timeout する」「特定環境でだけ失敗する」といった断片が並ぶ。人間の tech lead は、それらをまとめて「sandbox 実行の信頼性」「認証トークン更新の境界」「マルチテナント設定の破綻」のような上位課題として扱う。プロアクティブ agent の評価も、同じ粒度を復元できるかを見るべきだということになる。

評価時には、修正前のコード状態に agent を戻し、最大 3 round の探索を許し、最終的に出した insight を ground truth target と比較する。Google の記事では、LLM judge を使って 1 から 5 のスコアを付け、top score や Hit@K を見る。これは、agent が最終パッチを出せたかではなく、上位の候補洞察に正しい診断が入ったかを見る設計である。

## 事実: 論文はプロアクティブ性を三段階で整理する

arXiv 論文 **Agentic Coding Needs Proactivity, Not Just Autonomy** は、プロアクティブな coding agent について、Reactive、Scheduled、Situation Aware の 3 段階で整理している。Reactive は利用者の依頼へ反応する段階、Scheduled は定期実行や webhook によって動く段階、Situation Aware は文脈を見て、どのタイミングで何を出すべきか判断する段階である。

日本企業の導入現場では、この区別が曖昧になりやすい。定期的に CI を見る bot は Scheduled ではあるが、必ずしも Situation Aware ではない。逆に、単発で依頼された調査でも、agent が issue、PR、ログを結び、根拠を持って「今見るべき問い」を提示するなら、Situation Aware に近づく。

論文は、評価対象として Insight Decision Quality、Context Grounding Score、Learning Lift などを挙げる。これらは、出力の正しさだけでなく、根拠の接地、利用者フィードバック後の改善、不要な割り込みを避ける判断を測る方向にある。企業の評価表に落とすなら、agent の出力を「正しい/間違い」だけでなく、「根拠が追える」「通知する価値がある」「次回に改善した」と分けるべきである。

## 分析: Agent評価はPR成功率から運用品質へ移る

ここからは分析だ。

AI コーディング agent の評価は、これまで PR 成功率やテスト通過率に寄っていた。これは必要条件である。コードを書けない agent、テストを壊す agent、差分を説明できない agent は、本番導入の候補にならない。しかし、プロアクティブ agent は、成功率だけで評価すると危険である。

理由は、プロアクティブ agent の失敗が「間違ったコード」だけではないからだ。重要でない通知を大量に出す、根拠が薄いのに重大扱いする、必要なときに黙る、権限外の情報を読みに行く、過去の利用者反応を誤学習する、という失敗がある。これらは unit test では見つけにくい。

特に日本企業では、開発チームが会議、レビュー、稟議、障害対応、委託先連携を多く抱える。agent が割り込むたびに、誰かの作業が止まる。だから「洞察が正しいか」だけでなく、「その時点で知らせるべきだったか」を評価する必要がある。Google が insight policy に注目する意味はここにある。

## 日本企業向けの評価設計

第一に、評価対象を「タスク」と「ゴール」に分ける。タスク評価では、既知 issue の修正、lint 修正、テスト追加、依存関係更新などを扱う。ゴール評価では、複数 issue の関連づけ、CI 不安定化の根本原因候補、リリース前リスク、セキュリティ修正の波及範囲などを扱う。両者を同じ採点表に混ぜると、agent の強みと弱みが見えにくい。

第二に、探索予算を制御する。Google の記事は、探索 round を増やすと複雑な問題で Hit@5 が改善したと報告している。企業内 PoC でも、agent に与える時間、コマンド回数、ファイル数、参照できる issue 数、外部ツールの範囲を固定するべきだ。無制限に調べさせると、良い洞察は出るかもしれないが、コストと権限リスクを比較できない。

第三に、通知品質を明示的に採点する。たとえば、各洞察について、根拠ファイル、関連 issue、再現ログ、影響範囲、推奨アクション、緊急度を必須フィールドにする。レビュー者は、正確性、行動可能性、重複、過剰通知、見逃しを記録する。これにより、agent の価値を「なんとなく便利」ではなく、運用改善データとして扱える。

第四に、黙る判断を評価する。多くの PoC は、agent が出したものだけを評価する。しかし、プロアクティブ agent では「出さなかったもの」も重要だ。軽微な lint 警告を毎回通知しない、所有者が明確な作業には割り込まない、未確認の推測を重大 incident として扱わない、といった黙る判断を評価項目に入れる必要がある。

第五に、人間の反応をフィードバックとして集める。Insight が正しくても、開発者が無視するなら、タイミング、表現、優先度、責任者の指定が悪い可能性がある。逆に、不完全な洞察でも、事故を防いだなら価値がある。Learning Lift を見るなら、人間の accept、dismiss、defer、needs more evidence といった反応を記録する仕組みが必要になる。

## 権限とログの設計

プロアクティブ agent の評価では、権限設計が避けられない。コードだけを読む agent と、issue、CI、Slack、Datadog、顧客チケット、設計ドキュメントまで読む agent では、出せる洞察もリスクも違う。評価時に情報源を広げるなら、どの情報源が洞察に寄与したかをログに残すべきである。

ログには、参照したリポジトリ、コマンド、ファイル、issue、PR、外部 URL、出力した洞察、通知先、利用者の反応を含めたい。これは監査のためだけではない。どの情報源が価値を生んだか、どの情報源がノイズだったかを見ないと、次の評価設計ができない。

また、権限は段階的に広げるべきだ。最初の評価では read-only、公開または低機密のリポジトリ、過去の CI ログ、匿名化された issue に限定する。書き込み、PR 作成、Slack 通知、本番監視連携は、洞察品質が確認できてから追加するほうがよい。

## 既存のproactive workとの接続

コーディング agent だけが proactive になるわけではない。[ChatGPT Scheduled tasks](/blog/openai-chatgpt-scheduled-tasks-management-2026/) のように、会話型 AI も定期実行、監視、通知へ進んでいる。つまり企業には、コーディング、調査、営業、法務、採用など複数領域で「AI が先に知らせる」機能が入ってくる。

このとき、領域ごとに別々の通知ルールを作ると破綻しやすい。共通で決めるべきなのは、通知の重大度、根拠提示、停止条件、所有者、再通知間隔、監査ログ、誤通知の報告方法である。Jules の記事は coding agent の話だが、insight policy という考え方は企業 AI 全体のガバナンスにも使える。

特に開発組織では、agent の洞察が workflow tool へ流れ込む。GitHub issue、Jira、Slack、メール、監視アラートに同じ agent が書き込むようになると、通知の重複と責任境界が問題になる。Agent を増やす前に、どのチャネルを公式通知にするか、どの通知は参考扱いにするかを決める必要がある。

## 評価テンプレート

実務では、次のような最小テンプレートから始めるとよい。

対象ゴールは 1 つに絞る。例として「直近 7 日間の CI flaky failure を分類し、再発防止につながる上位 3 件の洞察を出す」。情報源は repository、CI log、issue のみに限定する。探索予算は 30 分、read-only、外部通知なしにする。出力は、洞察、根拠、影響範囲、推奨アクション、確信度、追加確認に固定する。

採点は、人間 reviewer が正確性、根拠の十分性、行動可能性、重複、過剰通知、見逃しで見る。LLM judge を併用してもよいが、最終判定は開発者の行動変化で確認する。たとえば、洞察から issue が作られたか、修正 PR が出たか、次の incident が減ったか、無視されたかを見る。

このテンプレートを数回回すと、agent に必要な文脈と不要な文脈が見えてくる。CI log だけでは足りないのか、issue のコメントが効くのか、設計ドキュメントを入れると良くなるのか、Slack を入れるとノイズが増えるのかを比較できる。

## まとめ

Google の Jules 記事は、AI コーディング agent 評価を、タスク完了の benchmark から、ゴール発見、洞察品質、割り込み判断へ広げる重要なシグナルである。705 bugs と 1,178 CLs を使い、関連 bug 群から上位ゴールを復元する考え方は、日本企業の issue tracker や CI 履歴にも応用しやすい。

今後、AI agent はより長く、より多くの文脈を見て動く。だからこそ、企業は「どの agent が一番コードを書けるか」だけでなく、「どの agent が、いつ、何を、どの根拠で知らせるべきか」を評価する必要がある。Jules の論点は、開発組織が agent を本番導入する前に作るべき評価設計そのものである。

## 出典

- [Measuring What Matters with Jules](https://developers.googleblog.com/measuring-what-matters-with-jules/) - Google Developers Blog, 2026-06-22
- [Agentic Coding Needs Proactivity, Not Just Autonomy](https://arxiv.org/abs/2605.06717) - arXiv, 2026-05-07
- [Google Labs Code](https://labs.google/code) - Google Labs
