---
title: 'OpenAI APIのWeb検索強化、調査AI設計の要点'
description: 'OpenAI APIのWeb検索にreturn_token_budgetが追加。長い調査AIを作る日本の開発チーム向けに、search_context_sizeとの違い、評価、費用、タイムアウト設計を整理する。'
pubDate: '2026-05-13'
category: 'news'
tags: ['OpenAI', 'API', 'AI検索', 'Reasoning', '開発者ツール']
draft: false
---

OpenAIが2026年5月11日のAPI Changelogで、Responses APIのhosted `web_search` toolに **`return_token_budget`** を追加した。派手な新モデル発表ではないが、調査AIや評価用エージェントを作っている日本の開発チームにはかなり実務的な更新だ。

これまでOpenAIのWeb検索まわりでは、ChatGPT側の管理設定を扱った[OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)や、GPT-5.5のAPI提供条件を扱った[OpenAI「GPT-5.5」公開。Codex 400KとAPI単価は日本の開発チームに何を変えるか](/blog/openai-gpt-55-codex-chatgpt-api-2026/)が重要だった。今回の話はそれらとは少し違う。管理者向けの検索制御でも、モデル全体の性能紹介でもなく、**API実装者がWeb検索の長さをどこまで許すか** の設計論点である。

## 事実: 何が追加されたのか

OpenAI API Changelogによると、2026年5月11日にResponses APIのWeb検索ツールへ`return_token_budget`が追加された。説明では、GPT-5以降のreasoning web searchで、より長いWeb検索実行を選べるようにするためのパラメータとして位置づけられている。

OpenAIのWeb searchガイドを見ると、このパラメータはhosted Responses APIの`web_search` toolにだけ適用される。対象はGPT-5+ reasoning web searchであり、非reasoningのWeb検索、古いSearch API系の経路、container web search、Chat Completionsの検索モデル、`web_search_preview`には適用されない。値としては`default`と`unlimited`が示されており、数値で細かく指定するタイプの予算ではない。

ここで重要なのは、`return_token_budget`が検索結果の投入量を直接増やす設定ではない点だ。OpenAIは、これはsearch context windowを変えるものではないと説明している。Responses APIのWeb検索では、モデルのコンテキストが大きくても検索コンテキスト側には別の上限がある。たとえばGPT-5.5のように大きなモデルコンテキストを持つモデルでも、Web検索コンテキストは別枠で考える必要がある。

## 事実: search_context_sizeとは役割が違う

既存の`search_context_size`は、Web検索結果からどれくらいの文脈をモデルへ渡すかを調整する設定だ。`low`、`medium`、`high`のように使い分け、簡単な確認なら少なめ、詳細な根拠が必要なら多めにする。ただし、OpenAIはこれも厳密なトークン数や出典数を保証するものではないと説明している。

`return_token_budget`は、そこから一段前の実行設計に近い。検索結果をどれだけ詰め込むかではなく、GPT-5+ reasoning web searchに対して、長い検索過程を許すかどうかを指定する。つまり、`search_context_size`は「検索結果をどれだけ読ませるか」、`return_token_budget`は「検索をどこまで粘らせるか」に近い。

この違いを混同すると、実装判断を誤る。たとえば「出典をもっと増やしたい」だけなら、まず`search_context_size`やプロンプト、評価指標を見るべきだ。一方で「複数の公式ページを横断して、矛盾や更新時期まで見てほしい」という用途なら、`return_token_budget`を`unlimited`にする候補が出てくる。

## 考察: 日本の開発チームで効く場面

ここからは考察だ。

日本の開発チームで効きやすいのは、1回の検索で答えが出るQ&Aではなく、**調査プロセス自体に価値があるワークロード** だ。たとえば、SaaSの価格改定、AIモデルの提供条件、規約変更、クラウドのリージョン対応、行政・規制文書の更新などは、単一ページだけでは判断しにくい。公式ブログ、docs、pricing、deprecation、help centerをまたいで確認する必要がある。

このサイトでも、[GPT-5.5 InstantでChatGPT標準運用はどう変わるか](/blog/openai-gpt-55-instant-chatgpt-default-2026/)のように、モデル名、ChatGPT側の体験、APIの`chat-latest`、管理者向けの意味を切り分けて読む記事が増えている。実務ではこの種の確認を毎回人間が手で行うのは重い。Responses APIで調査AIを組むなら、短い検索で済ませる質問と、長い検索を許す質問を分ける価値がある。

特に日本企業では、稟議、調達、セキュリティ審査、法務確認の前段で「一次情報の差分をまとめる」仕事が多い。ここでAIに求めるのは、単にもっともらしい要約ではなく、どのページを根拠に、どの制約を確認し、どこが未確定なのかを分けることだ。`return_token_budget`は、こうした高めの調査負荷をAPI側で明示的に許すスイッチとして読める。

## 考察: 先に設計すべきこと

ただし、`unlimited`を常用すればよいわけではない。長く検索できるということは、応答時間、ツール利用コスト、失敗時の再試行、ログ量が増えるということでもある。日本の業務システムに組み込むなら、少なくとも3つの設計を先に決めたい。

1つ目は、質問の分類だ。社内FAQ、用語確認、既知URLの要約は`default`でよい。複数ソースの照合、価格・提供条件・規制変更の確認、競合比較、評価データ作成だけを`unlimited`候補にする。ユーザーに自由入力させるだけでは、簡単な質問まで重い検索へ流れやすい。

2つ目は、評価基準だ。長く検索した結果が本当に良くなったかを、人間の感覚だけで判断しないほうがよい。出典の一次情報率、回答内の未確認事項の明示、日付の扱い、誤引用、古いページの混入、出典URLの到達性を評価する。長い検索は、情報量を増やす一方でノイズも増やす。

3つ目は、タイムアウトとフォールバックだ。社内チャットの即答UIに`unlimited`をそのまま入れると、待ち時間が体験を壊す可能性がある。バックグラウンド実行、非同期通知、途中結果の保存、再実行の上限、失敗時に`default`へ戻す処理を用意したほうがよい。

## まとめ

今回の`return_token_budget`追加は、OpenAI APIのWeb検索を「使うか使わないか」から、「どの調査だけ長く走らせるか」へ進める更新だ。日本の開発チームにとっては、調査AI、AI評価基盤、社内の技術調査支援、プロダクト企画の一次情報チェックに効く。

一方で、これは検索コンテキストを無限に広げる設定ではない。`search_context_size`、モデルのコンテキスト、Web検索コンテキスト、reasoning web searchの実行時間を分けて設計する必要がある。まずは高価値な調査タスクだけに限定し、評価とログを見ながら広げるのが現実的だ。

## 出典

- [OpenAI API Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI, 2026-05-11
- [Web search | OpenAI API](https://developers.openai.com/api/docs/guides/tools-web-search) - OpenAI
- [Models | OpenAI API](https://developers.openai.com/api/docs/models) - OpenAI
