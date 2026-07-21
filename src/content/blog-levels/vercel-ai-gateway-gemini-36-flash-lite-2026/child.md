---
article: 'vercel-ai-gateway-gemini-36-flash-lite-2026'
level: 'child'
---

Vercelは2026年7月21日、Vercel AI Gatewayで**Gemini 3.6 Flash**と**Gemini 3.5 Flash-Lite**を使えるようにしたと発表しました。AI SDKでは、`google/gemini-3.6-flash` や `google/gemini-3.5-flash-lite` を指定して呼び出せます。

かんたんに言うと、Vercel上のWebアプリやAI機能から、Googleの新しいGeminiモデルを使いやすくなったという話です。ただし、モデルを増やすだけでなく、費用、ログ、失敗時の切り替えをどう管理するかも重要になります。

## AI Gatewayとは何か

AI Gatewayは、いろいろなAIモデルを共通の入口から使うための仕組みです。アプリ側から見ると、モデルごとに呼び出し方を大きく変えずに、利用量や費用を見たり、予算を決めたり、別モデルへ切り替えたりしやすくなります。

今回追加されたGemini 3.6 Flashは、コードを書く作業、Web開発、長めのAIエージェント作業に向くモデルとして説明されています。Gemini 3.5 Flash-Liteは、もっと範囲の狭い処理を低コストで回す用途に向くモデルです。

たとえば、複数ファイルを読んで修正案を出す処理にはGemini 3.6 Flashを使い、問い合わせ文を分類するだけの小さな処理にはGemini 3.5 Flash-Liteを使う、といった分け方が考えられます。

## なぜ日本の開発チームに関係するのか

日本のWeb開発チームでも、AIチャット、社内検索、問い合わせ分類、コード生成補助、営業支援などにAIを組み込むケースが増えています。こうした機能では、どのモデルを使うかによって、費用や回答品質が変わります。

GitHub Copilotの中でGeminiを使う話は、[Gemini 3.6 FlashがCopilotへ](/blog/github-copilot-gemini-36-flash-rollout-2026/)で扱いました。今回のVercel AI Gatewayは、それとは違い、自社アプリの裏側でモデルを呼ぶ話です。

そのため、開発者だけでなく、プロダクト責任者や情シスも関係します。どの機能で使うか、顧客データを送ってよいか、費用が増えたらどこで止めるかを決める必要があります。

## 使う前に決めたいこと

まず、モデルを使い分けるルールを決めます。重いコード作業や長い推論にはGemini 3.6 Flash、短い分類や要約にはGemini 3.5 Flash-Liteというように、用途を分けたほうが費用を見やすくなります。

次に、ログと予算を決めます。AI Gatewayでは利用量や費用を追いやすくなりますが、何を記録してよいかは会社ごとに違います。ソースコード、顧客情報、個人情報が入るなら、保存するログを最小限にする判断も必要です。

また、AIが失敗したときの動きも決めておくべきです。別モデルへ自動で切り替えると便利ですが、モデルが変わると回答の癖も変わります。重要な機能では、人間の確認や再試行の表示を用意したほうが安全です。

## 最初に試すなら

最初は、社内向けの小さな機能から始めるのがよいです。PR説明の下書き、エラーログの要約、問い合わせの一次分類、社内文書の回答下書きなどです。

RAGやファイル検索と組み合わせる場合は、[Gemini File Searchのmultimodal RAG](/blog/google-gemini-file-search-multimodal-rag-2026/)のように、どの文書を根拠にするかも管理する必要があります。モデルを呼べることと、正しい情報を使えることは別です。

## まとめ

Vercel AI GatewayでGemini 3.6 FlashとGemini 3.5 Flash-Liteが使えるようになり、AI SDKを使うWebアプリにGeminiの新モデルを組み込みやすくなりました。

ただし、すぐ全機能に入れるより、用途、費用、ログ、失敗時の動きを決めてから試すのが現実的です。日本のチームでは、まず社内向けの低リスク機能で、モデル別の品質と費用を比べるところから始めるとよいでしょう。

## 出典

- [Gemini 3.6 Flash and Gemini 3.5 Flash-Lite are now available on AI Gateway](https://vercel.com/changelog/gemini-3-6-flash-3-5-flash-lite-on-ai-gateway) - Vercel Changelog, 2026-07-21
- [AI Gateway](https://vercel.com/docs/ai-gateway) - Vercel Docs
- [Release notes | Gemini API](https://ai.google.dev/gemini-api/docs/changelog) - Google AI for Developers
