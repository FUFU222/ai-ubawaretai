---
article: 'openai-responses-web-search-token-budget-2026'
level: 'child'
---

OpenAI APIのWeb検索に、`return_token_budget`という新しい設定が追加された。名前だけ見ると少し難しいが、考え方はシンプルだ。AIにWeb検索をさせるとき、短く調べてすぐ答えるのか、もう少し長く調べてから答えるのかを分けやすくする設定である。

以前取り上げた[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)は、ChatGPTの管理者向け検索設定の話だった。今回はChatGPTの画面ではなく、開発者がOpenAI APIで調査AIを作るときの話だ。

## 事実: どこで使う設定か

OpenAIの説明では、`return_token_budget`はResponses APIのhosted `web_search` toolで使う。対象はGPT-5以降のreasoning web searchだ。古い検索API、Chat Completionsの検索モデル、`web_search_preview`などには使わない。

値は細かい数字ではなく、基本は`default`か`unlimited`で考える。`default`は通常の検索、`unlimited`は長めの検索を許す選択肢だと見ればよい。

## 事実: 検索結果を無限に読めるわけではない

ここで誤解しやすい点がある。`return_token_budget`を使っても、AIが検索結果を無限に読めるわけではない。

OpenAIには別に`search_context_size`という設定がある。これは検索結果からどれくらいの文脈をモデルに渡すかを調整するものだ。`low`、`medium`、`high`のように選ぶ。ただし、これも正確なトークン数や出典数を保証する設定ではない。

つまり、`search_context_size`は「読ませる量」、`return_token_budget`は「調べる粘り方」に近い。両方を分けて考えるとわかりやすい。

## 日本の仕事でどこに効くか

日本企業で使いやすいのは、1ページだけ見れば答えられる質問ではない。たとえば、あるAIサービスの料金、利用条件、提供リージョン、廃止予定、セキュリティ条件を確認したいときは、公式ブログ、ドキュメント、価格表、ヘルプページをまたいで読む必要がある。

このような調査では、短い検索だけだと重要な制約を見落とすことがある。[OpenAI「GPT-5.5」公開。Codex 400KとAPI単価は日本の開発チームに何を変えるか](/blog/openai-gpt-55-codex-chatgpt-api-2026/)のように、モデル発表、API価格、ChatGPT側の提供条件を分けて確認する場面では、長めの検索が役に立つ可能性がある。

## 使いすぎに注意する

ただし、すべての質問で`unlimited`を使うのはよくない。長く調べるほど、時間もコストも増える。ユーザーが待つ時間も長くなる。

実装するなら、簡単な質問は通常検索にする。価格改定、規約変更、規制文書、複数ソース比較のように、見落としが大きな問題になる質問だけ長めの検索を許す。この使い分けが大事だ。

また、長く検索した結果が本当に正しいかも確認する必要がある。出典が公式か、日付が新しいか、古いページを混ぜていないか、わからない点をわからないと書いているかを見る。

## まとめ

`return_token_budget`は、OpenAI APIで作る調査AIを少し賢く運用するための設定だ。ポイントは、AIに長く調べさせる価値がある質問だけを選ぶことにある。

社内FAQのような軽い質問には不要だ。一方で、調達、法務、セキュリティ、技術選定の前段で公式情報を横断確認するなら、試す価値がある。

## 出典

- [OpenAI API Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI, 2026-05-11
- [Web search | OpenAI API](https://developers.openai.com/api/docs/guides/tools-web-search) - OpenAI
- [Models | OpenAI API](https://developers.openai.com/api/docs/models) - OpenAI
