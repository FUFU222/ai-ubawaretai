---
title: 'Gemini Interactions API GA、移行判断を整理'
description: 'GoogleがGemini Interactions APIを一般提供。日本の開発チームがgenerateContentから移行する前に、状態保持、背景実行、データ保持、コストをどう確認すべきか整理する。'
pubDate: '2026-06-23'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', '開発者ツール', '開発基盤']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google が **2026年6月23日**、Gemini API の **Interactions API** を一般提供にした。Google はこれを、Gemini モデルとエージェントに触るための primary interface と位置づけている。従来の `generateContent` API は引き続きサポートされるが、新規開発では Interactions API を推奨する、というメッセージがかなり明確になった。

この更新は、単なるエンドポイント名の変更ではない。Interactions API は、会話やタスクを `Interaction` という単位で扱い、実行ステップ、サーバー側の状態保持、長時間処理、Managed Agents、Deep Research などを同じ設計面へ寄せる。以前取り上げた [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) や [Google AI Studio の拡張](/blog/google-ai-studio-android-workspace-2026/) が実行環境や試作導線の話だったとすれば、今回の GA はその下にある API インターフェースの標準化だ。

日本の開発チームにとって重要なのは、「すぐ全コードを置き換えるべきか」ではない。むしろ、既存の `generateContent` 実装を残しつつ、新規のエージェント系機能、長時間ジョブ、複数ツールを使う業務アプリ、監査しやすい UI をどこから Interactions API へ寄せるかを決めることだ。

## 事実: Interactions API が推奨インターフェースになった

Google の公式発表では、Interactions API は Gemini モデルとエージェントを扱う単一の統合エンドポイントとして説明されている。モデル ID を渡せば通常の推論になり、agent ID を渡せばエージェント実行になる。さらに、`background=True` を使うと、長く走る処理をサーバー側で非同期実行できる。

GA にあわせて、スキーマは stable になり、ドキュメントの既定も Interactions API に移った。Google は、legacy の `generateContent` API は今後も fully supported としつつ、長時間実行、エージェント、フロンティア機能は Interactions API 側へ寄っていく見通しを示している。これは、Gemini を単発のテキスト生成 API として使う段階から、状態を持つ AI アプリ基盤として扱う段階へ移す動きだ。

ドキュメント上の中核は `Interaction` リソースである。1 回の会話ターンやタスク実行を、時系列の `steps` として保存する。そこには user input、model output、function call、function result、モデルの思考ステップなどが入り得る。開発者は最終テキストだけを見ることもできるが、複雑な UI や監査では途中のステップを読む設計にできる。

この点は、すでに [Gemini API Docs MCP と Agent Skills](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) で見え始めていた流れともつながる。Google は、エージェントが最新ドキュメントを読み、正しい API パターンを使い、さらに Interactions API の step 構造で実行を観測できる方向へ開発者体験を揃えつつある。

## 事実: 状態保持と background execution が設計を変える

Interactions API の特徴で、日本企業が最初に確認すべきなのはサーバー側状態保持だ。API は既定で Interaction object を保存し、後続リクエストで `previous_interaction_id` を渡すと、過去の会話履歴を再送しなくても文脈を継続できる。これにより、長いチャット履歴や業務タスクの再開をアプリ側で丸ごと抱え込む必要が減る。

一方で、状態をサーバー側に置くことは、データ保持の論点を増やす。Google のドキュメントでは、Paid Tier は Interaction を 55 日、Free Tier は 1 日保持すると説明されている。保存を望まない場合は `store=false` を指定できるが、その場合は `background=true` や `previous_interaction_id` を使えない。つまり、便利な状態管理と、保持期間を短くしたい要件はトレードオフになる。

background execution も同じだ。Deep Research や長い分析、複数ツールを使うエージェント処理を同期レスポンスに閉じ込めるより、サーバー側で走らせて後から確認するほうが自然な場面は多い。社内文書の調査、競合調査、コードベース解析、営業資料生成のような処理では、ユーザーが画面を開いたまま待つ設計よりも、ジョブとして扱うほうが運用しやすい。

ただし、background execution は「投げれば終わり」ではない。失敗時の再実行、途中状態の表示、完了通知、削除、ログ保管、アクセス権の再確認が必要になる。特に日本の受託開発、金融、医療、製造、自治体向けシステムでは、AI が何を参照し、どの tool call を行い、なぜその結果になったかを説明できることが重要だ。Interactions API の steps は、その説明責任に使える可能性がある。

## 分析: まず新規とエージェント系から移行するのが現実的

ここからは分析だ。既存の Gemini API 利用が、短い要約、分類、単発の文章生成、フォーム補助だけなら、すぐ全面移行する必要はない。`generateContent` は引き続きサポートされるため、安定して動いている単発処理を急いで触ると、むしろテストコストと障害リスクが増える。

一方で、新規の AI アプリは Interactions API を前提にしたほうがよい。理由は、今後のドキュメント、SDK サンプル、エージェント機能、Managed Agents、Deep Research、マルチモーダル生成がこの面に集まりやすいからだ。社内で「Gemini を使う標準パターン」を作るなら、これから書くコードを legacy 形式に寄せる理由は弱い。

移行の第一候補は、状態を持つ業務アシスタントだ。たとえば、問い合わせ対応、社内規程確認、見積もり支援、開発調査、データ分析補助のように、複数ターンで文脈が続き、途中で tool call が入り、結果を UI に表示したいアプリは Interactions API の step 構造と相性がよい。

第二候補は、エージェント型の開発・運用支援だ。[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) はリモート環境でコード実行やファイル操作を扱う話だった。Interactions API が GA になったことで、エージェントを呼び出す側の API も安定したと見られる。日本の開発組織では、まず社内リポジトリの調査、テスト失敗の要約、ドキュメント更新案、リリースノート生成のような低リスク領域から始めるのが現実的だ。

第三候補は、コストを設計したいワークロードだ。[Gemini API の Flex と Priority](/blog/google-gemini-api-flex-priority-2026/) で整理したように、Google は推論の安さと信頼性を service tier で分け始めている。Interactions API でも、長時間処理や background 処理をどう流すかはコスト設計とセットになる。夜間バッチや社内調査は Flex、ユーザー対面の重要処理は Priority、といった分け方を検討しやすくなる。

## 実務チェック: データ保持、監査、料金、SDK を見る

日本のチームが移行判断で見るべき項目は4つある。

1つ目はデータ保持だ。Interactions API は既定で保存される。Paid Tier の 55 日保持を許容できる業務なのか、`store=false` が必要なのか、そもそも Gemini API に送ってよいデータなのかを決める必要がある。個人情報、顧客秘密、未公開財務情報、医療情報、契約書、ソースコードなどは、サービス規約、社内規程、顧客契約と照らして扱うべきだ。

2つ目は監査ログだ。`steps` は UI 表示にもデバッグにも使えるが、それを社内ログへどう残すかは別問題である。API 側で Interaction が消える前に、必要な監査情報を自社のログ基盤、チケット、DWH、SIEM へ保存するのか。逆に、保存しすぎて不要な個人情報を残さないか。ここを設計しないまま本番化すると、後から説明責任とプライバシー対応で詰まる。

3つ目は料金と tier だ。Gemini 3.5 Flash などの料金表では、Standard、Batch、Flex、Priority で input、output、context caching、grounding の扱いが分かれている。Interactions API そのものの採用と、どのモデル・tier を使うかは分けて考えるべきだ。特に grounding with Google Search や Maps は追加課金条件があるため、検索を多用するエージェントでは試算が必要になる。

4つ目は SDK と移行テストだ。Google GenAI SDK では Python と JavaScript から Interactions API を扱える。既存の `generateContent` 実装を移す場合、レスポンスの取り出し方が変わる。単純な `.text` 相当で足りる処理もあれば、画像、音声、tool call、thought、複数出力が混ざる処理では `steps` を明示的に読む必要がある。テストでは最終出力だけでなく、途中ステップの有無や順序も確認したい。

今回の GA は、Gemini API を使うすべてのチームに「明日までに移行せよ」と迫るものではない。だが、Google がどこを新しい標準面にするかはかなり見えた。日本の開発チームは、既存実装を守りながら、新規エージェント、長時間処理、監査が必要な業務アプリから Interactions API を試すのがよい。重要なのは、API 置換ではなく、状態、データ、コスト、説明責任を含めて設計を更新することだ。

## 出典

- [Interactions API: our primary interface for Gemini models and agents](https://blog.google/innovation-and-ai/technology/developers-tools/interactions-api-general-availability/) - Google, 2026-06-23
- [Interactions API | Gemini API](https://ai.google.dev/gemini-api/docs/interactions-overview) - Google AI for Developers, last updated 2026-06-23
- [Migrating to the Interactions API](https://ai.google.dev/gemini-api/docs/migrate-to-interactions) - Google AI for Developers
- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) - Google AI for Developers
