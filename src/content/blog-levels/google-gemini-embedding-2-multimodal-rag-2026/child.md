---
article: 'google-gemini-embedding-2-multimodal-rag-2026'
level: 'child'
---

Google が先週、**Gemini Embedding 2 を一般提供**にし、4月30日にはその具体的な使い方をまとめた開発者ブログを公開しました。

この話は、ただの「embedding モデル追加」ではありません。ポイントは、**テキストだけでなく、画像、動画、音声、PDF まで同じ検索基盤で扱いやすくなった**ことです。

RAG は広まりましたが、実際の現場では「文書だけなら引けるが、画像や添付資料が弱い」「検索結果の順番がいまいち」「ベクトル DB のコストが重い」といった悩みが残りがちです。Gemini Embedding 2 は、その壁を下げるための更新として読むのが分かりやすいです。

## 何ができるのか

Google の説明では、Gemini Embedding 2 は **100 以上の言語**に対応し、**テキスト、画像、動画、音声、文書**を単一の埋め込み空間へ写像します。

4月30日の開発者ブログでは、次のような使い方が紹介されています。

- マルチモーダル RAG
- 画像や商品写真を使った検索
- 検索結果の再ランキング
- クラスタリングや分類

さらに、1 回の呼び出しで **8,192 トークンのテキスト、6 枚の画像、120 秒の動画、180 秒の音声、6 ページの PDF** を扱えるとされています。つまり、部署ごとに別々の検索仕組みを足すのではなく、**1 本の retrieval 設計で寄せやすくなる**のが今回の価値です。

## 実務で大事なのはどこか

実務で重要なのは、モデルそのものより**検索の組み方**です。

Google は、質問と文書で役割を分ける `task prefixes` や、候補を拾ってから並べ替える reranking を勧めています。ここはかなり大事です。RAG がうまくいかない原因は「まったく見つからない」より、「近いけれど違う情報が上に来る」ことのほうが多いからです。

また、Gemini Embedding 2 は 3072 次元を 1536 や 768 へ落とせるので、**ストレージ効率を調整しながら精度とコストを両立しやすい**のも実務向きです。

以前取り上げた [Gemini API Docs MCP](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) が agent に正しいドキュメントを渡す話だったのに対し、今回の話は**その前に、正しい文脈をどう検索で引き当てるか**の話です。さらに、[Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) と合わせると、Google が検索層から agent 運用層まで一体で整えにきている流れも見えてきます。

## 日本のチームはどう見るべきか

日本の開発チームで最初に相性が良いのは、FAQ のような純テキスト検索より、**画像や PDF が混ざる社内検索**です。

たとえば、

- 提案書と添付図版をまたぐ営業検索
- 製品画像とマニュアル PDF を組み合わせたサポート検索
- 点検記録と写真を合わせて探す現場向けツール

のような領域です。

こうした業務では、チャットモデルを変えるより、**retrieval の設計を変えたほうが体験が大きく改善する**ことがあります。Gemini Embedding 2 は、そのための選択肢としてかなり現実的です。

## まとめ

Gemini Embedding 2 の本当の意味は、マルチモーダル RAG を本番向けに組みやすくしたことにあります。

日本のチームにとっては、「embedding を使うかどうか」よりも、「社内データ検索をテキスト専用前提からどこまで広げられるか」を考えるきっかけになる更新です。

## 出典

- [Building with Gemini Embedding 2: Agentic multimodal RAG and beyond](https://developers.googleblog.com/building-with-gemini-embedding-2/) - Google Developers Blog
- [Gemini Embedding 2 is now generally available](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2-generally-available/) - Google
- [Embeddings](https://ai.google.dev/api/embeddings) - Google AI for Developers
