---
article: 'google-gemini-api-managed-agents-2026'
level: 'expert'
---

Google の **Gemini API Managed Agents** は、Gemini API の位置づけをかなり変える更新だ。これまでの API は、モデルへ入力を渡して出力を受け取る、あるいは tool calling や grounding を組み合わせるものとして理解されやすかった。今回の発表は、その上に「Google 管理のエージェント実行環境」を載せる。

公式発表では、Managed Agents によって、1 回の API call で Antigravity agent を起動できる。エージェントは、隔離された一時的な Linux 環境内で、推論、計画、ツール呼び出し、コード実行、ファイル管理、Web ブラウジングを行う。さらに、各 interaction は環境を作成または受け取り、後続の呼び出しでファイルと状態を保ったまま再開できる。

この流れは、[Gemini API Docs MCP と Agent Skills](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) で見えた「エージェントへ正しい文脈を渡す」話とつながる。さらに [Gemini API File Search](/blog/google-gemini-file-search-multimodal-rag-2026/) は検索・根拠側を、[Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) は企業向け統制側を扱っていた。Managed Agents は、その間にある実行基盤を埋める発表だ。

## 事実: Antigravity agentをAPIから使える

Google は Managed Agents を、Gemini API のプレビューとして発表した。基盤になるのは **Antigravity agent** で、Gemini 3.5 Flash 上に構築され、Interactions API と Google AI Studio から利用できる。

ここで重要なのは、Google が「モデル」ではなく「agent harness」と「infrastructure」へのアクセスを前面に出していることだ。Deep Research は Google が用意した managed agent だったが、今回 Google は、そのエージェントハーネスと基盤を開発者がカスタム agent に使えるようにすると説明している。

エージェント定義は、`AGENTS.md` や `SKILL.md` のような Markdown ファイルで行える。これは開発チームにとって意味が大きい。エージェントの目的、制約、手順、スキルを、アプリコードから完全に切り離さず、リポジトリの一部としてレビューし、差分管理できるからだ。

Google AI Studio には custom templates も用意される。つまり、API だけでなく、プロトタイピングと管理の入口も同時に出している。企業向けには、Gemini Enterprise Agent Platform 上での managed agents support が private preview とされている。

## Interactions APIとの関係

Managed Agents の入口として出てくるのが Interactions API だ。Google は 2025年12月に、Interactions API をモデルとエージェントのための統一インターフェースとして発表していた。そこでは、Gemini モデルと Gemini Deep Research のような built-in agent を、同じ `/interactions` の面で扱う構想が示されていた。

generateContent は、単発または比較的短い生成処理には分かりやすい。一方で、エージェントは複雑な文脈管理を必要とする。中間の思考、ツール呼び出し、状態、長い作業履歴、再開が絡む。Google は、この複雑さを generateContent に押し込むと壊れやすい API になるため、Interactions API を用意したと説明している。

Managed Agents は、その構想が一段進んだものだ。Deep Research のような Google 提供 agent だけでなく、開発者が定義した custom agent も、Interactions API 上で扱う方向へ進んでいる。つまり、Gemini API は「モデル API」と「agent runtime API」の両方を持つ形になりつつある。

## 分析: エージェント基盤の責任境界が変わる

自前で agent harness を作る場合、チームは多くの責任を持つ。コード実行環境の隔離、ファイルシステムの管理、ネットワークの制御、ツール権限、セッション復元、ログ、リトライ、タイムアウト、コスト上限、ユーザーごとの作業空間分離。プロトタイプでは軽く見えるが、本番ではここが最も重い。

Managed Agents は、この重さを API ベンダー側へ寄せる。これは、クラウド時代にアプリサーバーやデータベース運用の一部がマネージドサービスへ移ったのと似ている。ただし、AI エージェントでは責任境界がさらに厄介だ。なぜなら、エージェントは単に計算するだけでなく、外部情報を読み、コードを実行し、ファイルを書き換え、場合によっては業務判断に近い出力を作るからだ。

したがって、Managed Agents を使うチームは「Google が sandbox を用意するから安全」とは考えないほうがよい。安全性の焦点は、サンドボックスの有無だけではない。何を入力するか。どのツールを渡すか。どの外部通信を許すか。作業後のファイルを誰が読めるか。出力を自動適用するか。ログに何が残るか。ここは利用側の設計が残る。

## 日本企業での設計論点

日本企業で最初に検討すべきなのは、データ境界だ。顧客情報、個人情報、契約書、設計資料、社内規程、ソースコードを扱う場合、エージェント環境へ渡した時点でデータ処理の責任が発生する。プレビュー段階では、契約、データ保持、リージョン、ログ閲覧、削除手順を特に確認したい。

次に、権限モデルだ。エージェントが Web を見られること、ファイルを編集できること、コードを実行できることは、それぞれ別のリスクを持つ。Web 参照は情報流出やプロンプトインジェクションに近い問題を持つ。ファイル編集は破壊的変更のリスクを持つ。コード実行は supply chain や秘密情報露出のリスクを持つ。

3つ目は、人間レビューの設計だ。特に開発支援用途では、エージェントが修正案を作ることと、その修正を main branch へ入れることは別だ。レビュー前に diff を見せ、テスト結果を添付し、関連 Issue や要件との対応を確認できるようにする。ここは [Gemini API の Flex/Priority](/blog/google-gemini-api-flex-priority-2026/) で扱った実行ティアの考え方ともつながる。重要な作業ほど、速さより確認性と失敗時の制御が必要になる。

4つ目は、監査と説明責任だ。エージェントが何を見て、何を実行し、どのファイルを作り、どの外部情報を使ったのかを後から追える必要がある。出力だけが残っていても、業務システムでは足りない。特に金融、医療、公共、製造品質、セキュリティ領域では、エージェント実行ログをどの粒度で保存するかが導入可否に直結する。

## ユースケース別の向き不向き

Managed Agents と相性がよいのは、隔離環境とファイル状態が価値になる作業だ。

たとえば、開発支援エージェントは有望だ。リポジトリを読み、テストを走らせ、失敗ログを解釈し、修正案を作る。こうした作業は、単発のチャットより実行環境が重要になる。ただし、企業コードを外部環境に渡すため、まずは非機密リポジトリや社内ツールから試すのが現実的だ。

調査エージェントも向いている。競合調査、法規制調査、セキュリティ脆弱性の確認、SaaS 更新監視のように、Web を見て、途中メモを残し、最終レポートを作る作業では、ファイルと状態の保持が効く。日本市場では、英語一次ソースを読み、日本語の意思決定資料へ落とすワークフローに価値がある。

一方で、高頻度・低遅延のチャット応答には向かない可能性がある。Managed Agents は、エージェント環境を使う分、単純な generateContent より重くなるはずだ。FAQ 応答や短い要約であれば、通常の Gemini API、RAG、function calling のほうが単純で安い可能性が高い。

また、規制業務の完全自動化にも慎重であるべきだ。法務、与信、医療助言、採用判断のような領域では、エージェントが長い作業をこなせることより、判断根拠と責任分界が重要になる。Managed Agents は作業補助としては強いが、最終判断者を置き換える根拠にはならない。

## 既存基盤との比較

すでに LangGraph、Temporal、独自 worker、コンテナサンドボックス、Kubernetes job、Browser automation、MCP server を組み合わせた agent 基盤を持っているチームもある。そうしたチームが Managed Agents を見るときは、置き換えではなく、責任分担で考えるべきだ。

Google 側に寄せる価値があるのは、標準的なファイル作業、調査、コード実行、エージェントセッション管理だ。一方、自社特有の業務承認、既存システム連携、国内法務要件、データレジデンシー、監査ログ連携は、自社側で持つ必要が残る。

また、vendor lock-in も論点になる。`AGENTS.md` や `SKILL.md` のようなファイルによる定義は、移植性が比較的高い。一方、Antigravity agent の挙動、Interactions API の session model、Google AI Studio の template、Enterprise Agent Platform の governance は Google 固有だ。将来の移行可能性を考えるなら、エージェント指示、ツール定義、業務ルール、評価データはできるだけ自社リポジトリ側に残したほうがよい。

## 実装時のチェックリスト

最初の検証では、用途をかなり狭くするべきだ。たとえば「公開情報を調べて Markdown レポートを作る」「社内のサンプルリポジトリでテスト失敗を説明する」「FAQ データから差分更新案を作る」程度がよい。最初から顧客データや本番コードを渡す必要はない。

次に、入力データを分類する。公開情報、社内限定、顧客限定、個人情報、秘密情報を分け、Managed Agents へ渡してよい範囲を決める。分類できないデータは渡さない、というルールが必要だ。

3つ目は、ツール権限を最小化する。Web ブラウズ、ファイル編集、コード実行を全部有効にするのではなく、ユースケースに必要なものだけ使う。特に外部ネットワークとコード実行を同時に許す場合は、プロンプトインジェクションと秘密情報流出を想定する。

4つ目は、成果物の採用フローを作る。エージェントが作ったファイルは、必ず差分として表示し、人間が承認してから反映する。開発用途ならテスト結果、調査用途なら出典、業務文書ならレビュー者を添える。

5つ目は、評価データを持つ。Managed Agents が便利に見えても、毎回正しいとは限らない。日本語資料、社内ルール、業界用語、既存コードベースで、期待する成果物のサンプルと失敗例を蓄積し、モデルや agent 設定を変えたときに比較できるようにする。

## まとめ

Gemini API Managed Agents は、Google が Gemini API をエージェント実行基盤へ広げる明確な一手だ。Antigravity agent、隔離 Linux 環境、Interactions API、Google AI Studio、Markdown ベースの agent 定義を組み合わせ、開発者が自前で抱えていた agent harness の一部をマネージド化する。

日本の開発チームにとっては、プロトタイプを本番に近づける際の重い足場を減らせる可能性がある。特に、調査、開発支援、社内文書処理、SaaS 内の作業エージェントでは、検証する価値がある。

ただし、これは責任を消す仕組みではない。むしろ、責任境界を設計し直す仕組みだ。どのデータを渡すか、どのツールを許すか、どこで人間が確認するか、ログと削除をどう扱うか。Managed Agents の評価は、モデル性能だけでなく、この運用設計とセットで行うべきだ。

## 出典

- [Introducing Managed Agents in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/managed-agents-gemini-api/) - Google, 2026-05-19
- [Agents Overview](https://ai.google.dev/gemini-api/docs/agents) - Google AI for Developers
- [Interactions API](https://ai.google.dev/gemini-api/docs/interactions) - Google AI for Developers
- [I/O 2026: Antigravity 2.0 と新しい Gemini のエージェントツール](https://blog.google/intl/ja-jp/company-news/technology/google-io-2026-developer-highlights/) - Google Japan, 2026-05-20
