---
article: 'openai-responses-web-search-token-budget-2026'
level: 'expert'
---

OpenAI API Changelogの2026年5月11日更新で、Responses APIのhosted `web_search` toolに`return_token_budget`が追加された。小さなパラメータ追加に見えるが、調査AI、評価エージェント、社内ナレッジ補助ツールを作っているチームには設計上の意味がある。これは単に「Web検索が強くなった」という話ではない。**長い検索を許す条件を、API呼び出し側が明示的に持つ** という話である。

OpenAIの最近の更新は、ChatGPT側の管理設定、Codex、API、モデル提供条件が密接に絡んでいる。[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)ではChatGPTワークスペースの検索経路制御を扱った。[GPT-5.5 InstantでChatGPT標準運用はどう変わるか](/blog/openai-gpt-55-instant-chatgpt-default-2026/)では、ChatGPTの標準体験とAPIの`chat-latest`のような実装面をつないだ。今回の`return_token_budget`は、その流れの中でもかなり開発者寄りだ。

## 事実: 対象はhosted Responses API web_search

まず仕様を切り分ける。

OpenAI API Changelogでは、`return_token_budget`はResponses APIのWeb検索ツールに追加された機能として説明されている。目的は、GPT-5以降のreasoning web searchで、より長いWeb検索の実行を選べるようにすることだ。

Web searchガイド側では、適用範囲がかなり限定されている。対象はhosted Responses APIの`web_search` toolであり、GPT-5+ reasoning web searchに対する設定である。非reasoningのWeb検索、legacy Search API paths、container web search、Chat Completions search models、`web_search_preview`には適用されない。値としては`default`と`unlimited`が示されており、任意の数値を入れて細かく上限調整する設計ではない。

この限定は重要だ。既存のChat Completions検索モデルを使っている実装や、旧`web_search_preview`をそのまま使っている実装では、同じ設定名だけを足しても意味がない。新規実装ではResponses APIのhosted `web_search`に寄せるべきだが、既存実装を移行する場合は、レスポンス形式、引用処理、ツール実行ログ、タイムアウト、課金の見え方まで確認する必要がある。

## 事実: search_context_sizeとは別の制御である

Web searchガイドには、すでに`search_context_size`がある。これは検索結果からモデルへ渡す文脈量を調整する設定で、`low`、`medium`、`high`を使い分ける。簡単なlookupなら`low`、一般的な用途なら`medium`、検索結果の詳細が必要なら`high`という整理になる。ただし、OpenAIはこれが正確なトークン数や出典数を保証するものではないと説明している。

`return_token_budget`はこれと役割が違う。OpenAIは、このパラメータはsearch context windowを変えないと明記している。つまり、検索過程を長く許すことと、最終的にモデルが読む検索コンテキスト量は別の問題だ。

実装上は、次のように分けるとよい。

`search_context_size`は、取得された検索結果のどの程度を回答生成に使わせるかの設定である。`return_token_budget`は、GPT-5+ reasoning web searchが検索・検討・回収にどこまで時間と推論を使えるかの設定に近い。前者は根拠投入量、後者は探索の粘り方である。

この違いを理解しないと、評価が崩れる。たとえば「回答に出典が少ない」という不満に対して`return_token_budget`を`unlimited`にしても、期待どおり改善するとは限らない。出典数や引用粒度は、検索コンテキスト、プロンプト、回答フォーマット、評価基準の影響を受ける。一方で「公式docs、pricing、changelog、deprecationをまたいだ確認が浅い」という問題なら、長い検索を許す価値がある。

## 事実: モデルの巨大コンテキストとは独立して見る

OpenAIのModelsページでは、GPT-5.5のようなモデルが大きなコンテキストを持つことが示されている。しかしWeb searchガイドでは、Responses APIのWeb検索コンテキストには別の制限があると説明されている。大きなモデルコンテキストを選んだからといって、Web検索から投入される情報量が同じだけ大きくなるわけではない。

この点は日本のRAGや調査AI設計で誤解されやすい。モデルのcontext window、Web search context、ファイル検索の取得チャンク、社内データベースの検索結果、最終回答のmax output tokensは、それぞれ違う制約で動く。どこか1つの上限が大きくなっても、全体が自動的に深くなるわけではない。

[OpenAI「GPT-5.5」公開。Codex 400KとAPI単価は日本の開発チームに何を変えるか](/blog/openai-gpt-55-codex-chatgpt-api-2026/)で扱ったように、GPT-5.5はAPIやCodexで長文脈を前面に出している。しかしWeb検索つき調査では、長文脈モデルを選ぶだけでは足りない。検索をどこまで走らせるか、何を根拠として残すか、回答にどの粒度で引用するかを別に設計する必要がある。

## 考察: return_token_budgetが効くワークロード

ここからは考察だ。

`return_token_budget`が効くのは、短い検索で十分なタスクではない。むしろ、探索範囲を少し広げないと誤った判断をしやすいタスクに向く。

1つ目は、AIベンダーの提供条件確認だ。モデル提供状況、API対応、ChatGPT側の提供範囲、価格、rate limits、deprecation、地域・プラン制約は、1ページだけでは終わらないことが多い。公式ブログは前向きな発表を載せ、docsは実装条件を載せ、help centerはプランやUI挙動を載せ、pricingページは単価を載せる。この分散を短い検索で片付けると、重要な制約を落としやすい。

2つ目は、評価データ作成だ。社内のAI評価基盤で「この質問には、どの一次情報を見て答えるべきか」を作る場合、短い検索では正解セットが薄くなる。`unlimited`で検索した結果を人間がレビューし、評価用の根拠セットや禁止回答パターンを作るほうが向いている。これはリアルタイム回答より、オフライン評価に近い。

3つ目は、調達・法務・セキュリティの前段調査だ。日本企業では、新しいAIサービスを使う前に、データ利用、ログ、学習利用、管理者権限、サポート範囲、契約プラン、地域制約を確認する。ここでAIに期待するのは一発回答ではなく、確認項目の抜け漏れを減らすことだ。

4つ目は、技術記事や社内解説の下調べだ。このサイトのように、OpenAI、Google、Anthropic、GitHubの更新を追う場合、公式一次情報を横断しないと文脈がずれる。[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)のような管理者向け記事と、今回のAPI向け記事を混同しないためにも、検索過程で「これはChatGPT設定か、API仕様か」を見分ける必要がある。

## 考察: unlimitedを本番UIへ直結しない

`unlimited`という名前は強いが、常用設定として扱うべきではない。プロダクト設計では、長い検索を許すほど、遅延、コスト、失敗時の再実行、ログ保管、ユーザー体験の問題が増える。

まず遅延がある。ユーザーがチャットUIで「この機能は何？」と聞いただけなのに、長いWeb検索が走ると体験が悪い。即答が必要なUIでは`default`を使い、長い調査はバックグラウンドジョブやレポート生成に逃がすのが自然だ。

次にコストがある。Web検索ツールはモデルのトークン課金とは別にツール利用や処理量が絡む。長い検索を許すなら、ユーザー単位、ワークスペース単位、プロジェクト単位の上限を置きたい。特に日本企業の情シスやDX部門では、PoC段階でコストの見え方が曖昧だと本番化で止まりやすい。

さらに、長い検索はノイズも増やす。多くのページを見るほど、古い情報、類似ページ、二次情報、地域違いのページ、製品名が似た別機能を拾う可能性がある。検索を長くすれば正確になるとは限らない。むしろ、回答側に「確認できたこと」「確認できなかったこと」「日付が古い可能性」を書かせる設計が重要になる。

## 実装パターン: ルーティングを先に置く

実装では、ユーザー入力をそのまま`unlimited`に流すのではなく、前段にルーティングを置くのがよい。

軽い質問、定義確認、既知URLの要約、社内FAQ、単一公式ページの確認は`default`にする。複数の公式ソースをまたぐ比較、価格や提供条件、規約変更、モデル廃止、セキュリティアドバイザリ、行政文書の確認は`unlimited`候補にする。さらに、ユーザーが「最新」「正確に」「公式情報で」「比較して」「差分を」といった意図を出した場合だけ長い検索へ上げる。

ただし、このルーティングも完全自動にしないほうがよい。高コスト検索に入る前に、「長めの公式情報確認として実行します」のような確認を入れる設計もあり得る。社内向けなら、権限ロールによって`unlimited`を使える部署を制限するほうが現実的だ。

ログ設計も必要だ。保存すべきなのは最終回答だけではない。入力、選ばれた検索モード、参照URL、取得日時、回答に使った根拠、失敗理由、再試行回数を残す。後から「なぜこの回答になったか」を見られない調査AIは、法務・調達・セキュリティの前段には使いにくい。

## 評価設計: 長い検索の良し悪しを測る

`return_token_budget`を導入するなら、A/B評価が必要だ。`default`と`unlimited`で、回答品質がどう変わるかをタスク別に測る。

見るべき指標は、回答の長さではない。一次ソース率、公式ページの優先度、日付の明示、製品・プラン・地域の取り違え、古い情報の混入、未確認事項の明示、引用URLの到達性、回答までの時間、実行コストを見る。特に「もっと調べた結果、古い二次情報を拾って悪化した」ケースを検出できるようにする。

日本語タスクでは、英語公式情報を日本語で説明する場面が多い。ここでは翻訳品質よりも、固有名詞、プラン名、API名、日付、制約条件の保持が重要だ。たとえば`web_search`と`web_search_preview`、ChatGPT SearchとResponses API Web search、Offline web searchとAPIのhosted searchを混ぜると、記事や社内説明は一気に危うくなる。

## まとめ

`return_token_budget`は、OpenAI APIのWeb検索をより長い調査ワークロードへ寄せるための小さなスイッチだ。ただし、検索コンテキストを無限に増やすものでも、出典品質を自動保証するものでもない。役割は、GPT-5+ reasoning web searchで長めの探索を許すかどうかを、呼び出し側が選べるようにすることにある。

日本の開発チームが見るべきなのは、機能そのものより運用境界だ。どの質問だけ`unlimited`にするのか。どの部署に許可するのか。どの評価指標で改善を判断するのか。どのログを残すのか。どのUIでは非同期に回すのか。ここまで決めて初めて、長いWeb検索は業務システムに組み込める。

まずは、調達・法務・セキュリティ・技術選定のように、見落としのコストが高いタスクだけで試すのがよい。軽いチャット回答に常用するより、根拠確認と評価データ作成に絞ったほうが、この更新の価値は出しやすい。

## 出典

- [OpenAI API Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI, 2026-05-11
- [Web search | OpenAI API](https://developers.openai.com/api/docs/guides/tools-web-search) - OpenAI
- [Models | OpenAI API](https://developers.openai.com/api/docs/models) - OpenAI
