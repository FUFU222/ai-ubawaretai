---
article: 'google-gemini-interactions-api-ga-2026'
level: 'child'
---

Google が **Gemini Interactions API** を一般提供にしました。これは、Gemini のモデルやエージェントを使うための新しい標準 API です。これまでの `generateContent` API は残りますが、Google は新しい開発では Interactions API を使うことをすすめています。

大事なのは、名前が変わっただけではないことです。Interactions API は、会話や作業を `Interaction` という単位で扱います。そこには、ユーザーの入力、モデルの出力、ツール呼び出し、途中の実行ステップなどが入ります。つまり、AI が最後に何を答えたかだけでなく、途中で何をしたかを見やすくするための仕組みです。

## 何が便利になるのか

1つ目は、会話の続きが扱いやすくなることです。前の会話 ID を渡すと、サーバー側にある履歴を使って次のやり取りを続けられます。毎回、長い会話履歴をアプリから送り直す必要が減ります。

2つ目は、長くかかる処理をバックグラウンドで走らせやすくなることです。たとえば、社内文書を調べる、コードを調査する、複雑なレポートを作る、といった処理はすぐ終わりません。`background=True` を使うと、こうした処理をサーバー側で進められます。

3つ目は、エージェント機能とつながりやすいことです。以前の [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) では、Google がエージェントを動かす実行環境を用意し始めた話をしました。今回の Interactions API は、そのエージェントを呼び出すための入口にもなります。

## 気をつけること

便利になる一方で、注意点もあります。Interactions API は、初期設定ではやり取りを保存します。Google の説明では、有料プランでは 55 日、無料プランでは 1 日保存されます。保存したくない場合は `store=false` を使えますが、その場合は会話の継続やバックグラウンド実行の一部が使えなくなります。

会社で使うなら、送ってよいデータかどうかを先に決める必要があります。個人情報、顧客の秘密、契約書、ソースコードなどを入れる場合は、社内ルールや顧客との契約を確認しなければなりません。

料金も見ておく必要があります。Google は Gemini API に Standard、Flex、Priority などの実行の分け方を用意しています。以前の [Gemini API Flex/Priority](/blog/google-gemini-api-flex-priority-2026/) の話と同じく、安くても遅くてよい処理と、多少高くても確実に通したい処理を分けて考えることが重要です。

## すぐ全部を移行すべきか

すでに `generateContent` API で短い要約や分類だけをしているなら、すぐ全部を置き換える必要はありません。Google は `generateContent` を今後もサポートすると説明しています。

一方で、新しく AI アプリを作る場合や、長い会話、ツール利用、エージェント、調査タスクを作る場合は Interactions API から始めるほうが自然です。[Google AI Studio の拡張](/blog/google-ai-studio-android-workspace-2026/) と合わせると、Google は試作、エージェント実行、API 実装を一つの流れにまとめようとしているように見えます。

日本の開発チームは、まず小さな社内用途から試すのがよいです。たとえば、社内文書の調査、問い合わせメモの整理、開発タスクの調査、レポート作成補助などです。そのうえで、どのデータを保存してよいか、どのログを残すか、どの料金 tier を使うかを決めるべきです。

## 出典

- [Interactions API: our primary interface for Gemini models and agents](https://blog.google/innovation-and-ai/technology/developers-tools/interactions-api-general-availability/) - Google
- [Interactions API | Gemini API](https://ai.google.dev/gemini-api/docs/interactions-overview) - Google AI for Developers
- [Migrating to the Interactions API](https://ai.google.dev/gemini-api/docs/migrate-to-interactions) - Google AI for Developers
