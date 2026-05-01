---
title: 'Gemini Embedding 2でRAGは変わるか。日本実装要点を整理'
description: 'Gemini Embedding 2の一般提供と4月30日の活用ガイドを踏まえ、マルチモーダルRAG・再ランキング・コスト最適化の実装要点を、日本の開発チームと事業会社向けに整理する。'
pubDate: '2026-04-30'
category: 'news'
tags: ['Google', 'Google DeepMind', 'Gemini API', 'マルチモーダル', 'AI開発']
draft: false
---

Google DeepMind と Google Developers が、**Gemini Embedding 2 の一般提供**と、その具体的な**実装ガイド**を相次いで打ち出した。派手な新モデル発表ではないが、日本の開発チームにとってはかなり重要だ。理由は単純で、今回の主題が「もっと賢い会話モデル」ではなく、**社内文書、画像、動画、音声を横断して扱う検索基盤をどう作るか** にあるからだ。

RAG はこの1年で一気に普及したが、実務ではすぐ壁に当たる。テキストは引けても画像やPDFが弱い、検索結果の並び順が荒い、ベクトルの保存コストが重い、部門ごとに別々の埋め込みパイプラインが増える。この問題に対して Google は、先週の GA 告知で「本番投入できる段階に入った」と示し、4月30日の開発者ブログで「どう使えば retrieval が改善するか」まで踏み込んで説明した。

以前このサイトで扱った [Gemini API Docs MCP](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) が「最新ドキュメントをどう供給するか」の話だったとすれば、今回の焦点は**その前段で、何をどう見つけて agent に渡すか** だ。さらに、[Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) が企業向けのエージェント基盤を拡張している流れと合わせて見ると、Google が retrieval 層まで一体で押さえにきていることが分かる。

以下では、まず一次ソースで確認できる事実を整理し、その後で日本の開発チームにとっての実装判断を分けて考える。

## 事実: 何が発表されたのか

4月30日の Google Developers Blog は、Gemini Embedding 2 を使った **agentic multimodal RAG、visual search、reranking、clustering** の実装パターンをまとめたものだった。記事は、Gemini Embedding 2 が**テキスト、画像、動画、音声、文書を単一の埋め込み空間に写像する**と説明している。しかも 1 回の呼び出しで、**8,192 トークンのテキスト、6 枚の画像、120 秒の動画、180 秒の音声、6 ページの PDF** を扱える。

その少し前の公式 GA 告知では、Gemini Embedding 2 が **Gemini API と Vertex AI で一般提供**になったこと、そして preview 中に出てきたマルチモーダル検索や動画分析のユースケースを、より安定した形で本番移行できるようにしたことが示されている。つまり今回は「新しい概念の紹介」ではなく、**本番運用へ進める段階に入ったので、具体的な使い方を公開した**流れとして読むのが正確だ。

重要なのは、埋め込みの対象がテキストだけではない点だ。多くのチームは、RAG と言うと長文ドキュメント検索を想像しがちだが、実務では製品画像、録音、画面キャプチャ、動画断片、PDF 図表が混ざる。Gemini Embedding 2 は、その混在データを**同じ retrieval パイプラインで扱える**ことを売りにしている。

## 事実: 実装上のポイントは「前処理」より「検索設計」にある

4月30日の開発者ブログで特に重要なのは、単に API の引数一覧を載せたのではなく、**検索品質を上げるための運用パターン**を示していることだ。

第一に、Google は `task prefixes` を使った非対称検索を強く勧めている。短い質問文と長い文書では、そのまま同じ形で埋め込むより、「これは質問」「これは文書」と役割を明示したほうが retrieval 精度が上がる、という考え方だ。ブログでは question answering、fact checking、code retrieval、search result などの prefix 例が出ている。これは日本の RAG 実装でも重要で、**ただ全文をベクトル化するだけでは精度が頭打ちになる**ことを意味する。

第二に、Google は reranking をはっきり推奨している。最初に広く候補を拾い、その後に埋め込み同士の類似度で並べ替えて最終結果を絞るやり方だ。RAG が現場で使い物にならない理由の多くは、「見つからない」より「近いけれど違う文書が上に来る」にある。今回のブログは、その解像度で手を入れにきた。

第三に、**Matryoshka Representation Learning (MRL)** による次元削減が実務上かなり効く。Gemini Embedding 2 は既定では 3072 次元だが、`output_dimensionality` を使って 1536 や 768 へ落とせる。Google はこれを、精度を大きく落としすぎずにストレージ効率を上げる方法として説明している。ベクトル DB のコストが気になって PoC から先へ進めないチームには、この設計自由度が大きい。

## 事実: 早期利用企業の数字も出ている

Google は導入企業の例もいくつか挙げている。法律向けの Harvey は、従来の埋め込みより **Recall@20 precision が 3% 向上**したと説明されている。Supermemory は、検索の **Recall@1 が 40% 改善**したとされる。さらに Nuuly は、画像ベースの商品照合で **Match@20 を 60% から 87% 近くまで改善**し、全体の識別成功率も 74% 超から 90% 超へ引き上げたという。

もちろん、これらは Google が選んだ事例であり、そのまま自社に転写はできない。ただ少なくとも、今回のメッセージが「embedding もできます」ではなく、**retrieval の精度改善をどう測るか** に寄っていることは読み取れる。これはかなり健全だ。

## 考察: 日本のRAG開発で何が変わるか

ここからは考察だ。

日本企業の RAG は、実際には 2 つの課題で止まりやすい。1 つは**データがテキスト以外に広がる**こと、もう 1 つは**検索品質を上げるのに人手調整が増えすぎる**ことだ。Gemini Embedding 2 は、この両方に対して「別々の仕組みを足さずに済ませる」方向を示している。

たとえば製造、流通、不動産、保険のような業種では、検索対象が文書だけで完結しない。画像付き報告書、点検動画、音声記録、図面 PDF が混ざる。そこへテキスト専用 embedding を足し、画像検索用の別モデルを足し、音声は別前処理にしていると、運用がすぐ壊れる。Gemini Embedding 2 の価値は、そこを**単一空間で寄せて、RAG の設計をシンプルにできる**点にある。

さらに、[Gemini API の Flex / Priority ティア](/blog/google-gemini-api-flex-priority-2026/) と組み合わせると、retrieval 基盤のコスト設計まで考えやすくなる。大量の再インデックスや夜間 embedding は Flex 寄り、ユーザー向け検索応答は Standard や高信頼側へ寄せる、という分け方ができるからだ。モデル単体ではなく、**retrieval と推論の両方を運用設計として分けられる**のは Google の強みになりうる。

## 日本のチームはどこから試すべきか

いきなり全社検索を置き換える必要はない。最初に試すべきなのは、**画像や PDF が混ざるのに、いまはテキスト検索へ無理やり寄せている業務**だと思う。

候補になりやすいのは、FAQ よりも次のような領域だ。

- 営業資料や提案書の横断検索
- 製品画像とカタログ説明をまたぐ社内検索
- コールログとマニュアル PDF を組み合わせたサポート検索
- 監査・法務向けの文書と添付画像の照合

この種のユースケースでは、単純なチャットボット改善より、**検索で取り出せる情報の幅を広げる**ほうが効果が出やすい。もし既に Google Cloud 側で Agent Platform を見ているなら、retrieval 層を Gemini Embedding 2 で揃えるかは今のうちに検討しておいたほうがよい。

## まとめ

Gemini Embedding 2 の意味は、「Google が埋め込みモデルを増やした」ことではない。重要なのは、**マルチモーダル RAG を本番設計として扱える段階に入った**ことと、4月30日の開発者ブログで retrieval 改善の具体的な作法まで公開したことだ。

日本の開発チームにとっては、モデルの派手さより、画像・音声・PDF を含む社内データ検索をどこまで単純化できるかが実務上の論点になる。RAG が伸び悩んでいるチームほど、今回の更新は「もう一度 retrieval 設計をやり直す材料」として見る価値がある。

## 出典

- [Building with Gemini Embedding 2: Agentic multimodal RAG and beyond](https://developers.googleblog.com/building-with-gemini-embedding-2/) - Google Developers Blog
- [Gemini Embedding 2 is now generally available](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2-generally-available/) - Google
- [Embeddings](https://ai.google.dev/api/embeddings) - Google AI for Developers
- [Gemini API pricing](https://ai.google.dev/pricing) - Google AI for Developers
