---
article: 'neon-functions-ai-gateway-discord-bot-2026'
level: 'child'
---

Neonは2026年7月24日のchangelogで、Neon backend上にAIアプリを作るための新しいガイドを追加した。分かりやすい例は、Neon FunctionsとNeon AI GatewayでDiscord botを作るガイドである。

これは「Discord botが作れる」というだけの話ではない。NeonはPostgresの会社として知られているが、今回のガイドでは、Postgres、serverless functions、AI Gatewayを同じbackendとして扱う。つまり、データベースの近くにAI呼び出しと実行環境を置く考え方だ。

AI Gatewayの考え方は[Vercel AI Gateway、Gemini新モデルを実装する要点](/blog/vercel-ai-gateway-gemini-36-flash-lite-2026/)でも出てきた。Vercelの記事ではモデル呼び出しの入口をそろえる話が中心だった。Neonの場合は、さらにPostgresやbranch運用と一緒に考える点が特徴になる。

## 何が発表されたのか

NeonのDiscord botガイドでは、Neon Functionsでbotのendpointを動かし、Neon AI GatewayでLLMのチャット応答や画像生成を呼び出す。botはDiscordのslash commandを受け取り、`/chat` で文章回答、`/imagine` で画像生成を返す。

Neon AI Gatewayは、OpenAIやGoogleなどのモデルを、Neon credentialから呼び出す仕組みとして説明されている。既存のOpenAI SDKやGoogle Gen AI SDKを大きく変えず、endpointをNeon側に向ける使い方ができる。

ただし、重要な制約もある。Neonのbackend beta guideでは、Functions、Object Storage、AI Gatewayはbetaであり、AWS US East (Ohio)、つまり `aws-us-east-2` で使う前提だと説明されている。AI Gatewayは有料プランが必要で、beta中のinferenceは無料とされているが、本番ワークロードにはまだ推奨されていない。

## なぜ日本チームに関係するのか

日本の開発チームがAIアプリを作るとき、よく問題になるのは「LLM API、DB、ファイル、実行環境が別々になる」ことだ。最初は動いても、あとから費用、ログ、権限、テストデータ、顧客データの場所が分かりにくくなる。

Neonの方向性は、これらをPostgres中心のbackendにまとめるものとして読める。branchごとにDBを分けるチームなら、AI Gatewayもbranch endpointに寄せることで、開発環境とAI呼び出しの境界をそろえやすい。

一方で、便利さだけで本番投入を決めるのは危険だ。モデル呼び出しが簡単になっても、MCPや外部ツールの権限設計は別に必要になる。[GitHub MCP Server対応、次期MCP仕様の運用点](/blog/github-mcp-server-stateless-spec-2026/)で整理したように、AIが道具を使う場合は、認証、監査、許可範囲を明確にしなければならない。

## 最初に確認すること

まず、リージョンを確認する。日本の顧客データや個人情報を扱うなら、`aws-us-east-2` のbeta環境に本番データを置けるかは慎重に判断する必要がある。最初は匿名化した検証データや社内向けの低リスク用途に限定するのがよい。

次に、費用上限を考える。beta中に無料でも、将来の課金やモデル単価は変わる可能性がある。OpenAI APIでは[OpenAI API支出上限、日本企業の429停止運用設計](/blog/openai-api-hard-spend-limits-2026/)で扱ったように、hard capやalertを運用に入れることが重要になる。Neon経由でも同じ発想が必要だ。

最後に、botの権限を小さくする。Discord botの例をSlackやTeamsに応用する場合でも、最初は読み取り中心、社内向け、短時間の処理に限定したい。顧客へ直接返答するbotや、社内システムを書き換えるbotは、ログと承認フローを整えてからにすべきだ。

## まとめ

Neonの7月24日の更新は、Neon FunctionsとNeon AI Gatewayを使ってAIアプリbackendを作る入口を示したものだ。Postgresに近い場所でAI呼び出しを扱いたいチームには、PoCの価値がある。

ただし、現時点ではbetaで、リージョンやプラン条件もある。日本のチームは、まず社内PoCで使い、データの置き場所、費用、credential、ログ、権限を確認してから本番候補として判断するのが安全だ。

## 出典

- [Neon changelog](https://neon.com/docs/changelog) - Neon Docs, 2026-07-24
- [Build a Discord Bot with Neon Functions and Neon AI Gateway](https://neon.com/guides/discord-bot-on-neon-functions) - Neon Guides
- [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) - Neon Docs
- [Neon backend beta guide](https://neon.com/docs/get-started/backend-beta) - Neon Docs
