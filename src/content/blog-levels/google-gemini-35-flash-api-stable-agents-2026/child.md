---
article: 'google-gemini-35-flash-api-stable-agents-2026'
level: 'child'
---

Google の Gemini API モデル一覧が更新され、**Gemini 3.5 Flash** が `gemini-3.5-flash` という Stable モデルとして示されました。Stable は、試験用の名前よりも本番アプリで管理しやすいモデル名です。つまり、企業が「どのモデルを使っているか」を説明しやすくなります。

この話は、ただ新しいAIモデルが出たというだけではありません。[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) のように、Google はAIエージェントを作るための土台を広げています。Gemini 3.5 Flash は、そのエージェントが考えたり、ツールを使ったり、コードを書くときの中心候補になります。

## 何が変わったのか

Gemini API の公式ドキュメントでは、Gemini 3.5 Flash が Stable として載っています。Google DeepMind のページでは、このモデルはエージェントやコーディング作業に向くと説明されています。

また、入力は最大 1M tokens、出力は最大 64k tokens とされています。テキストだけでなく、画像、動画、音声、PDFも入力できます。さらに、function calling、structured output、Search as a tool、code execution のようなツール利用にも対応します。

簡単に言うと、長い資料を読ませたり、複数の手順を考えさせたり、コードを扱う作業に使いやすいモデルです。

## なぜStableが大事なのか

AIモデルには、Preview や Experimental のように、試験的に出されるものがあります。そうしたモデルは早く試せる一方で、企業の本番システムに入れるには説明が難しいことがあります。

Stable のモデルIDなら、社内の設計書や運用手順に書きやすくなります。たとえば「この機能は `gemini-3.5-flash` を使う」と明記できます。モデルを変えるときにも、変更管理しやすくなります。

ただし、Stable だから何も確認しなくてよいわけではありません。料金、地域、データの扱い、障害時の代替手段、社内レビューは別に必要です。

## 日本のチームで試すなら

日本の会社では、チケット、仕様書、レビューコメント、障害報告が日本語で書かれることが多いです。だから、英語の性能表だけでは足りません。日本語の要件を正しく読めるか、曖昧な指示を勝手に決めつけないか、古い仕様と新しい仕様を混ぜないかを試す必要があります。

たとえば、匿名化した日本語チケットを読ませてテスト観点を作らせる。長い障害ログを渡して原因候補を整理させる。既存コードを読ませて、小さな修正案を出させる。こうした現実に近いタスクで評価すると、使える場面と危ない場面が見えます。

[Gemini API Docs MCP](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) や [Gemini API File Search](/blog/google-gemini-file-search-multimodal-rag-2026/) と組み合わせると、公式ドキュメントや社内資料を根拠として渡しやすくなります。長い入力に全部を詰め込むより、必要な資料を選んで渡すほうが確認しやすいです。

## まず決めること

最初に決めるべきことは、どの仕事で使うかです。毎日の軽い質問に全部使うより、複数ファイルの調査、UI試作、長い資料の読み取り、調査エージェントのような仕事から試すのがよいでしょう。

次に、人間がどこで確認するかを決めます。AIがコードを直せても、そのまま本番に入れてよいとは限りません。出力、根拠、ツール実行、変更差分を人間が見られるようにする必要があります。

Gemini 3.5 Flash は強いモデル候補です。しかし大事なのは、モデル名だけではなく、使い方を決めることです。日本のチームでは、Stable ID、日本語の評価、権限管理、コスト確認をセットで進めるのが現実的です。

## 出典

- [Models | Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/models) - Google AI for Developers, last updated 2026-06-01 UTC
- [Gemini 3.5 Flash](https://deepmind.google/models/gemini/flash/) - Google DeepMind
- [Gemini 3.5](https://deepmind.google/models/gemini/) - Google DeepMind
