---
article: 'google-swe-efficiency-performance-agent-2026'
level: 'expert'
---

SWE-fficiency は、AI コーディングエージェントの評価を「issue を直せたか」から「実リポジトリの性能改善を専門家水準に近づけられるか」へ引き上げるベンチマークである。Google の ICML 2026 採択論文一覧に掲載され、arXiv v3 では ICML 2026 登場、データ、コード、leaderboard の公開が示されている。

実務的に重要なのは、SWE-fficiency が性能最適化を isolated coding problem として扱わないことだ。agent は complete codebase、slow workload、unit test suite を与えられ、ボトルネックを調べ、関連箇所と関連テストを探し、正しさを維持しながら speedup を出す必要がある。

これは [Google Jules評価](/blog/google-jules-proactive-coding-agent-eval-2026/) が扱った insight policy の次に来る論点でもある。Jules 評価では、agent がコードベースや bug 履歴から何を重要な洞察として拾うかが問われた。SWE-fficiency では、その洞察を性能 patch へ接続し、専門家の speedup と比較する。

また、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) のような agent runtime が整っても、それだけでは性能改善の品質は保証されない。[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) で見たように、agent の変更は独立した評価と失敗分析にかける必要がある。SWE-fficiency は、その評価対象に performance engineering を明示的に入れる。

## 事実: タスク生成は実PRと実workloadに寄せている

SWE-fficiency のデータセットは、性能改善を含む GitHub pull request をもとに作られている。論文は、keyword filtering、static analysis、coverage tooling、execution validation を組み合わせ、性能改善 baseline と関連 unit test を確認する pipeline を説明している。

対象は 9 つの widely used Python repository だ。numpy、pandas、scipy、scikit-learn、matplotlib、xarray、sympy、dask、astropy が含まれる。これらはライブラリ内部の抽象化、vectorized operation、indexing、I/O、lazy computation、数式処理、distributed execution などが混在するため、単純な関数置換だけでは改善しにくい。

タスク数は 498。各 task は complete repository snapshot、performance workload script、existing unit test suite を含む。agent または人間は、workload を速くしつつ、既存 unit test を通す patch を作る。つまり、評価は「テストを通したか」だけではなく、「expert patch と比べてどれだけ速くできたか」を見る。

この設計は、日本企業の実務に近い。社内の性能課題でも、問題文に「この関数をこう直せ」と書かれていることは少ない。ログ、profile、trace、ユーザー操作、過去の PR、テストをつなぎ、どこが本当に効いているかを探す必要がある。

## 事実: Speedup Ratioは専門家との差を直接見る

SWE-fficiency の中心指標は Speedup Ratio、略して SR である。SR は `(LM speedup) / (Expert speedup)` で定義される。SR 1.0x は人間専門家の改善に一致し、1.0x を超えると専門家を上回る。

この指標は、単純な runtime 改善率より実務に向いている。なぜなら、task ごとに専門家が達成した改善幅が違うからだ。1.1x の改善が限界に近い task と、100x 超の改善余地がある task を同じ絶対値で比べると、モデルの実力を読み誤る。専門家 baseline で割ることで、その task で期待される改善余地に対する到達度を見られる。

プロジェクトページは、SR を harmonic mean で集計すると説明している。これは、一部の task で大きな成功を出しても、多くの task で失敗すれば全体評価が上がりにくい設計だ。性能最適化の導入判断でも、派手な 1 件より再現性のある広い成功率が重要になる。

実験条件も明示されている。評価では OpenHands と SWE-agent scaffolds を使い、file-editing tools と bash terminal interface を持つ agent を走らせる。環境は containerized、CPU/memory pinning、4 vCPU、16GB RAM per worker、3-hour time limit、100 max actions per task とされる。これは短い補完ではなく、現実的な探索予算を与えた評価である。

## 事実: 失敗は局所化と正しさ維持に集中する

論文の abstract とプロジェクトページは、現行 agent が平均で expert speedup の 0.23x 未満にとどまると報告している。さらに、失敗要因として、optimization opportunity の localization、複数関数をまたぐ実行 reasoning、proposed edit の correctness maintenance が挙げられている。

この失敗は、性能エンジニアリングの難しさそのものだ。遅い workload があっても、真の原因は浅い call site ではなく、データ構造、キャッシュ、型変換、境界条件、I/O、内部 API の使い方にあることが多い。agent が近くの関数をいじって小さな改善を出しても、専門家の patch が触った本質的な箇所には届かない。

プロジェクトページの key findings は、LM が expert-level wins を行動軌跡の早い段階で見つけることがある一方、専門家に届かない場合は satisficing optimization を提出しやすいと示している。つまり、agent は「少し速くなった」時点で探索を止める傾向がある。企業の CI で小さな speedup だけを合格にすると、この傾向を助長する。

もう一つの問題は correctness である。性能改善は、allocation を減らす、branch を消す、cache を追加する、近似を使う、処理順序を変えるといった変更を伴う。いずれも edge case を壊しやすい。unit test が通るだけでは足りない場合もあるが、少なくとも unit test を通さない patch は採用候補から外すべきである。

## 分析: 実務導入では「速度」「正しさ」「説明」を分離する

ここからは分析だ。

AI agent の性能 patch を受け入れるとき、1 つの PR comment で「速くなりました」と説明させるだけでは不十分である。評価は少なくとも 3 層に分ける必要がある。

第一に速度である。benchmark は、同一 commit、同一環境、同一入力、十分な反復、warm-up、外れ値処理、confidence interval を持つべきだ。特に Python の性能測定では、CPU frequency、cache 状態、I/O、dependency version、random seed、並列度が結果を揺らす。agent の出した単発計測値だけを信じると、誤採用につながる。

第二に正しさである。unit test は最低条件だが、性能 patch では property-based test、representative workload、boundary input、既知 bug regression も重要になる。SWE-fficiency は既存 unit test suite と coverage analysis を使うが、社内システムではそれに加えて業務データの匿名サンプルや domain-specific invariant を使いたい。

第三に説明である。性能 patch は「何を削ったか」より「なぜその変更で主要 workload が速くなるか」が大事だ。agent には、ボトルネック仮説、profile 証拠、変更箇所、正しさへの影響、比較した代替案、採用しなかった案を出させる。説明が薄い patch は、speedup が出ていても人間 reviewer の負担を下げない。

この 3 層を分ければ、AI を完全自動採用する必要はない。agent が profile 調査と仮説生成で価値を出し、人間が実装を仕上げる形も十分に現実的である。むしろ、SWE-fficiency の現状値を考えると、最初の導入はその形が妥当だ。

## CIに組み込むなら設計すべきゲート

日本企業が SWE-fficiency 的な考え方を社内 CI に入れるなら、まず benchmark gate と correctness gate を別 job にする。benchmark job は performance runner を固定し、通常の shared CI runner とは分ける。correctness job は unit test、integration test、型検査、lint を担当する。両方の結果が揃うまで、AI patch を merge 可能にしない。

次に、AI patch 用の PR template を用意する。必須項目は、対象 workload、baseline runtime、patched runtime、反復回数、測定環境、関連 test、想定副作用、rollback 方法、agent が参照したファイルである。これは監査のためだけでなく、reviewer が差分の読み方を決めるために必要だ。

さらに、変更範囲ごとに承認者を変える。leaf function の micro-optimization なら通常 reviewer でよい。一方、共通 data structure、scheduler、cache、database access、numerical behavior に触る patch は domain owner の承認を必要にする。AI が作ったかどうかにかかわらず、性能 patch は影響範囲で review level を変えるべきだ。

最後に、採用後の runtime monitoring と結びつける。benchmark で速くなった patch が本番で効くとは限らない。リリース後に latency、CPU、memory、error rate、domain-specific metric を見る。性能改善をうたう AI patch ほど、リリース後の観測期間を短く切り、悪化時の rollback を準備する必要がある。

## AI agentに任せる範囲を段階化する

最初の段階は read-only diagnosis でよい。agent は workload、profile、recent PR、関連 test を読み、上位 3 つのボトルネック候補と根拠を出す。patch は作らせない。この段階で、人間 reviewer が「調査時間が短くなった」と感じるかを見る。

第二段階は patch suggestion である。agent に diff を作らせるが、CI は advisory 扱いにし、merge は人間が書き直した patch に限定する。ここで、AI の仮説が実装に使えたか、差分がどの程度そのまま残ったか、誤った局所化がどれだけあったかを記録する。

第三段階は low-risk auto patch である。対象は、純粋関数、局所的な allocation 削減、明確な algorithmic shortcut、既存 test が厚い箇所に限定する。PR は自動作成しても、merge は人間承認にする。benchmark と unit test が不安定な repository は対象外にする。

第四段階は broader performance work だが、ここへ進むには失敗データが必要である。SWE-fficiency が示すように、agent は正しい場所を外しやすい。過去の失敗分類から、どのリポジトリ、どの subsystem、どの変更種別なら成功率が高いかを見てから範囲を広げるべきである。

## 評価データを社内で作る方法

社内版 SWE-fficiency を小さく作るなら、過去 6 か月から 1 年の性能改善 PR を集める。対象は、明確な before-after 計測があり、関連 test があり、rollback されていないものに限定する。PR description、profile、benchmark log、review comment を整理し、人間専門家の baseline とする。

次に、修正前 commit を復元し、workload script と test command を固定する。AI agent には、修正後 diff を見せずに同じ課題へ挑ませる。比較は、速度、正しさ、変更範囲、説明、reviewer 工数で行う。人間 patch と完全一致する必要はないが、同等の speedup と同等の正しさを求める。

データセットは大きくなくてよい。最初は 10 件でも十分だ。重要なのは、成功例だけでなく失敗例を残すことだ。agent が間違ったファイルを編集した、benchmark を誤読した、test を壊した、説明が不足した、環境依存の改善を主張した、といった失敗が次の guardrail になる。

この評価は一度作って終わりではない。agent、model、prompt、tool、runtime が変わるたびに再評価する。ここで [Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/) の考え方が効く。固定回帰セット、直近の本番課題、合成された境界条件を分け、改善と回帰を同時に見るべきである。

## 日本市場で特に注意したい領域

金融、製造、医療、公共、広告配信、物流のように、性能と正しさが直接事業影響につながる領域では、AI patch の扱いを厳しくする必要がある。高速化が誤計算、欠損、順序変更、丸め誤差、監査ログ欠落を引き起こす可能性があるからだ。

日本企業では、委託先や SI パートナーが AI を使って性能改善を提案する場面も増える。その場合、契約上の成果物に AI 利用の明示、計測条件、再現手順、生成差分の検証責任を含めるべきだ。発注側が「AI が作ったので分からない」という説明を受け入れる必要はない。

また、性能改善はコスト削減の根拠に使われやすい。CPU 使用率が下がる、cloud cost が下がる、batch window が短くなる、といった説明は経営判断に直結する。AI patch の効果を費用計画に入れるなら、短期 benchmark ではなく、本番観測を含めた数週間の確認が必要になる。

## まとめ

SWE-fficiency は、AI コーディングエージェントを実務投入する企業にとって、かなり現実的な警告である。498 タスク、9 実リポジトリ、実 workload、専門家 speedup baseline という設計は、agent が単に PR を作れるかではなく、性能エンジニアリングの核心に届くかを問う。

現行 agent が平均で 0.23x 未満の expert speedup にとどまるという結果は、性能改善を完全自動化するにはまだ距離があることを示す。一方で、調査、仮説生成、候補 patch、benchmark 補助としては価値を出せる可能性がある。導入の鍵は、AI を置き換えではなく、性能改善プロセスの一部として設計することだ。

日本の開発組織は、SWE-fficiency を外部 benchmark として眺めるだけでなく、自社の過去 PR を使った小さな社内版評価を作るべきである。速度、正しさ、説明、reviewer 工数、本番観測を分けて測れば、AI agent をどこまで任せられるかを現実的に判断できる。

## 出典

- [Google at ICML 2026](https://research.google/conferences-and-events/google-at-icml-2026/) - Google Research, 2026-07-06
- [SWE-fficiency: Can Language Models Optimize Real-World Repositories on Real Workloads?](https://arxiv.org/abs/2511.06090) - arXiv, revised 2026-06-27
- [SWE-fficiency project and leaderboard](https://swefficiency.com/) - SWE-fficiency project
