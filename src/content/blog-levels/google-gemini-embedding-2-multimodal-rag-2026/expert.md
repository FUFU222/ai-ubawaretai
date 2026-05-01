---
article: 'google-gemini-embedding-2-multimodal-rag-2026'
level: 'expert'
---

Gemini Embedding 2 の一般提供と 4 月 30 日の実装ガイド公開は、Google が retrieval 層を**単なる補助機能ではなく、agent 時代の基盤部品**として押し出し始めたシグナルだ。ここを「embedding モデルが 1 つ増えた」で済ませると、今回の更新の価値をほぼ取り逃がす。

いまの AI アプリは、良い会話モデルさえ入れれば競争力が出る段階を過ぎつつある。差が出るのは、モデルへ渡す文脈をどう集め、どう並べ、どうコスト管理し、どう複数モダリティへ広げるかだ。RAG が広がるほど、この retrieval 層の設計が雑だと品質もコストもすぐ頭打ちになる。Google は今回、そこへかなり正面から手を入れてきた。

以前このサイトで扱った [Gemini API Docs MCP](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) は「正しい公式知識を agent に供給する」話だった。今回の Gemini Embedding 2 は、そのさらに前段、つまり**何を検索し、何を候補に残し、どの順番で agent に渡すか**の部分を引き受ける。さらに [Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) がエージェントの実行・記憶・統制をまとめ始めていることを考えると、Google は retrieval、context supply、agent runtime を同じ地平で揃えにきている。

以下では、まず一次ソースで確認できる事実を整理し、その後で日本の開発組織、SaaS、事業会社、情シス、AI 基盤チームにとって何が本当の論点になるかを考える。

## 事実: 先週のGAと4月30日の開発者ガイドは役割が違う

Gemini Embedding 2 まわりの情報は、少なくとも 2 つの層に分かれている。

1 つ目は、Google の公式 blog による **GA 告知**だ。ここでのメッセージは明快で、Gemini Embedding 2 が **Gemini API と Vertex AI で一般提供**になり、preview 段階の試作から本番移行できるレベルの安定性と最適化を備えた、というものだった。つまり「使えるかどうか」の話である。

2 つ目が、4 月 30 日の Google Developers Blog による **実装ガイド**だ。こちらは、一般提供の事実だけでなく、**agentic multimodal RAG、visual search、reranking、clustering、classification、anomaly detection** までユースケースを分解し、「どう使うと retrieval が良くなるか」を具体的に説明している。つまり「どう使うか」の話である。

この違いは大きい。多くのベンダー発表は GA の時点で止まる。しかし今回は、その直後に retrieval 設計の要点まで出している。これは Google が、Gemini Embedding 2 を単なるモデルカタログの 1 行ではなく、**使い方込みで採用を伸ばしたい中核部品**として見ていることを示している。

## 事実: モデルの価値は“単一モダリティの改善”ではなく“単一空間への統合”にある

Gemini Embedding 2 の売りは、単にテキスト埋め込み精度が上がったことではない。Google はこれを **Gemini API 初のネイティブなマルチモーダル埋め込みモデル**として説明している。テキスト、画像、動画、音声、文書を**同じ意味空間に置ける**ため、検索側の設計を一本化しやすい。

開発者ブログにある仕様では、1 回の呼び出しで **8,192 トークンのテキスト、6 画像、120 秒動画、180 秒音声、6 ページ PDF** を扱える。しかも入力を 1 種類ずつに分ける必要はなく、**画像 + テキストのような interleaved input** を単一リクエストで投げられる。これは重要で、実務上のデータはほぼ常に複合だからだ。

社内ナレッジ検索を考えても、文章だけでは終わらない。製品写真、UI スクリーンショット、営業スライド、添付 PDF、録音メモ、短いデモ動画が混ざる。従来の構成では、テキストは一つの embedding、画像検索は別モデル、音声は文字起こし前処理、PDF は OCR 前提、といった継ぎはぎになりやすい。Gemini Embedding 2 の価値は、その継ぎはぎを減らし、**検索と再ランキングの土台を揃えられる**ことにある。

## 事実: Googleが強調しているのはAPI呼び出しよりretrieval設計

4 月 30 日の記事で見逃せないのが、Google が実装の勘所を **task prefixes** と **reranking** に置いていることだ。

task prefixes は、質問と文書をただベクトル化するのではなく、「これは質問」「これは事実確認」「これはコード検索」「これは検索結果」など、役割を文字列で明示して埋め込みへ渡す方法だ。ブログでは question answering、fact checking、code retrieval、search result などの例が出ている。これは非対称検索の精度を上げる典型手法だが、Google が公式ガイドでここまで前に出すのは珍しい。

要するに、Google は「埋め込みモデルが賢いから全部うまくいく」とは言っていない。むしろ、**検索の目的を埋め込みへ伝えろ** と言っている。これは実務的だ。RAG が悪化する多くのケースは、モデル性能不足というより「検索クエリと文書の役割を分けていない」「候補取得と最終選別を一つにまとめている」ことにあるからだ。

さらに、Google は reranking も明示的に勧めている。初段で広く候補を引き、その後に query と検索結果を再比較して順位を詰める。ハイブリッド検索や二段検索を組む人には当たり前に見えるが、Google が公式ブログでここを押すのは、**RAG の評価軸が“見つけたか”から“上位に正しいものを置けたか”へ移った**ことを示している。

## 事実: 次元圧縮とBatch運用まで含めてコストの話をしている

埋め込みモデルの本番運用では、精度より先に**保存コスト**と**再インデックスコスト**が問題になることが多い。Gemini Embedding 2 では、その点もかなり意識されている。

Google は、Gemini Embedding 2 が **Matryoshka Representation Learning (MRL)** に基づき、既定の 3072 次元から `output_dimensionality` で小さく落とせると説明している。推奨は 1536 または 768 だ。これは、検索精度を保ちながらベクトル容量と転送量を減らす現実的な手段になる。

また、開発者ブログでは **Batch API が既定の embedding 価格の 50%** で高スループット処理に向くとも説明している。ここはかなり重要だ。多くのチームは「オンライン検索応答」と「夜間の再埋め込み」を同じ設計で考えてしまうが、本来は分けるべきである。大量更新を安い経路へ逃がし、オンライン側は低遅延優先にする。この切り分けは、以前扱った [Gemini API の Flex / Priority ティア](/blog/google-gemini-api-flex-priority-2026/) と合わせるとさらに意味が強くなる。検索基盤の更新と推論の配信を、それぞれ違う経済性で設計できるからだ。

## 事実: 早期導入事例は“検索精度”の数字を前面に出している

Google が示す事例も、今回の主眼をよく表している。

Harvey は、法務検索で **Recall@20 precision が 3% 改善**したとされる。Supermemory は **Recall@1 が 40% 改善**したという。Nuuly は、商品画像検索で **Match@20 を 60% から 87% 近くへ**、全体識別率を **74% 超から 90% 超へ**伸ばしたとされる。

これらの数値はベンダー選定事例なので、そのまま絶対視はできない。それでも意味はある。Google が「トークンコストが安い」「ベンチマークで勝った」よりも、**retrieval 品質の指標**を前面に出しているからだ。市場がようやく、会話モデルの派手な比較から、**検索・再ランキング・文脈供給の改善幅**を測る段階へ移ったと見てよい。

## 考察: 日本企業のRAGが詰まる場所にかなり近い

ここからは考察だ。

日本企業の RAG は、PoC の時点ではうまく見える。しかし本番に寄せると、次のような問題で止まりやすい。

- データが PDF、表、画像、動画、録音に広がる
- 部門ごとに検索対象が違い、個別前処理が乱立する
- ベクトル DB の容量と再構築時間が重くなる
- 候補検索の精度が足りず、人手ルールが増える
- chat モデルを強くしても retrieval 品質が改善しない

Gemini Embedding 2 は、この全部を一気に解決するわけではない。ただし、**解決の起点を一つに寄せやすくする**。そこが価値だ。

特に日本の大企業では、テキストだけを対象にした検索改善は既に一定進んでいる。一方、画像添付の報告書、点検記録、コールログ、写真付き FAQ、図面 PDF が絡むと、精度も運用も急に難しくなる。そこへ単一空間のマルチモーダル embedding を入れられるなら、検索設計の複雑さをかなり下げられる。

## 考察: 相性が良いのはFAQより“半構造・複合データ検索”

Gemini Embedding 2 の最初の当たり所は、一般的な FAQ bot よりも、**半構造・複合データが混ざる社内検索**だと思う。

たとえば、次のようなユースケースは相性が良い。

- 提案書本文とスライド図版をまたぐ営業ナレッジ検索
- 事故写真、点検票、過去対応ログをまとめて引く保守業務
- コール録音、FAQ、画面キャプチャを束ねたサポート検索
- 製品画像、仕様 PDF、不具合報告を横断する品質管理検索

これらは、会話モデルを変えても改善しにくい。必要なのは「賢い答え」より先に、**正しい候補集合を作る retrieval** だからだ。Google は今回、そこへかなり実務的な手を出している。

## 考察: Googleはretrievalからagent runtimeまでの一体化を狙っている

Gemini Embedding 2 を単独で見ると、単なる検索技術の更新に見える。だが Google の他の発表と合わせると違う絵が出る。

Docs MCP は、agent に**最新の公式知識**を渡す仕組みだ。Gemini Enterprise Agent Platform は、agent の**実行、記憶、ID、評価、監視**を揃える仕組みだ。今回の Gemini Embedding 2 は、その間にある **retrieval と context supply** を担う。

つまり Google は、

- 何を見つけるか
- 何を agent に見せるか
- agent をどう実行・統制するか

をバラバラに売るのではなく、一体の物語にし始めている。これは Azure / Microsoft 365 側や OpenAI 周辺の enterprise 戦略と競合するうえで、かなり重要な動きだ。日本企業が今後ベンダーを選ぶとき、比較軸はモデル性能単体ではなく、**retrieval から governance までどこまで連続しているか**になる可能性が高い。

## 考察: 導入時の論点は“モデル選定”より“評価設計”

実務で最も重要なのは、Gemini Embedding 2 を採用するかどうかではなく、**どう評価するか**だ。

見るべきなのは、少なくとも次の 4 点になる。

1. **検索品質**  
   Recall@k、MRR、top-1 hit、曖昧クエリの取りこぼし率をどう測るか。

2. **モダリティ混在時の改善幅**  
   テキスト単独より、画像・PDF・音声を混ぜたときに実際どれだけ改善するか。

3. **ストレージ効率**  
   3072 次元のまま持つか、1536 / 768 へ落とすかで、検索精度と容量がどう変わるか。

4. **再インデックス運用**  
   日次更新をオンラインで回すか、Batch API へ逃がすか、再生成時刻をどう管理するか。

この評価をせずに「マルチモーダルだから強そう」で入れると、ほぼ確実に失敗する。逆に、この評価設計を先に置けば、Gemini Embedding 2 はかなり扱いやすい。

## 考察: 日本のチームが最初にやるべきこと

最初の一歩は広くないほうがよい。おすすめは、**1 つの高価値検索業務を選び、候補検索と reranking を別々に評価する**ことだ。

現実的な進め方は次のようになる。

1. 画像や PDF が混ざる既存業務を 1 つ選ぶ。
2. 現在の検索失敗例を 50〜100 件集める。
3. Gemini Embedding 2 で単純埋め込み、task prefix あり、reranking ありの 3 パターンを比べる。
4. 次元を 3072 / 1536 / 768 で比べる。
5. nightly update は Batch API へ寄せ、オンライン検索と切り分ける。

ここまでやれば、Gemini Embedding 2 が「効く業務」と「効かない業務」はかなり見えてくるはずだ。もし検索改善が出るなら、その次に Agent Platform や Docs MCP とつなぎ、agent 側の精度向上へ持っていける。

## まとめ

Gemini Embedding 2 の本質は、Google が retrieval を**agent 時代の独立した設計対象**として扱い始めたことにある。GA 告知で本番投入の準備が整ったと示し、4 月 30 日の開発者ブログで task prefixes、reranking、次元圧縮、Batch 運用まで含めた具体策を出した。ここまで来ると、単なるモデルカタログではない。

日本の開発チームや事業会社にとって重要なのは、今回の更新を「embedding 追加」と軽く読むのではなく、**複合データ検索をどうやり直すかの実装材料**として見ることだ。RAG が伸び悩んでいる理由が chat モデルではなく retrieval にあるなら、Gemini Embedding 2 はかなり有力な選択肢になる。逆に、評価設計なしで導入すると、マルチモーダルという言葉だけが先行して終わる。

次に見るべきなのは、Google がこの retrieval 層を Agent Platform や Docs MCP とどこまで滑らかにつなげるかだ。もしそこが進めば、Gemini 系の価値は「良いモデル」ではなく、**検索、文脈供給、agent 実行まで揃った業務基盤**へ変わっていく。

## 出典

- [Building with Gemini Embedding 2: Agentic multimodal RAG and beyond](https://developers.googleblog.com/building-with-gemini-embedding-2/) - Google Developers Blog
- [Gemini Embedding 2 is now generally available](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2-generally-available/) - Google
- [Embeddings](https://ai.google.dev/api/embeddings) - Google AI for Developers
- [Gemini API pricing](https://ai.google.dev/pricing) - Google AI for Developers
