---
article: 'vercel-ai-gateway-gemini-36-flash-lite-2026'
level: 'expert'
---

Vercel AI GatewayでGemini 3.6 FlashとGemini 3.5 Flash-Liteが使えるようになった。実装者向けに見るべき点は、`model` slugが増えたことではなく、アプリケーション内部のモデルルーティング、コスト境界、ログ方針、fallback、評価をどう切るかである。

AI SDKでは `google/gemini-3.6-flash` と `google/gemini-3.5-flash-lite` を指定できる。これ自体は簡単だ。しかし、本番環境でモデル名を直接コードへ散らすと、後から利用停止、価格変更、ABテスト、顧客別制御を入れるときに苦しくなる。Gatewayを使うなら、モデル選択もプロダクト設定の一部として扱うべきだ。

GitHub Copilot内のモデル追加については、[Gemini 3.6 FlashがCopilotへ、価格連動の移行線](/blog/github-copilot-gemini-36-flash-rollout-2026/)で扱った。今回のVercel更新は、IDEやCopilot設定ではなく、自社アプリ、社内AIツール、agent backendが直接モデルを呼ぶための話である。

## 事実関係

Vercelの2026年7月21日のChangelogでは、Gemini 3.6 FlashとGemini 3.5 Flash-LiteがAI Gatewayで利用可能になったと発表されている。Gemini 3.6 Flashは、coding、agentic tasks、web developmentでの改善が説明され、Gemini 3.5 Flashより少ないtokenやmodel callで結果を出せる可能性があるとされる。

Gemini 3.5 Flash-Liteは、より狭いsubagentに向く低コスト、低レイテンシの選択肢として説明されている。ここでいうsubagentは、主担当モデルが全体を考え、軽量モデルが分類、抽出、チェック、短い変換を担うような構成を指すと考えると実装しやすい。

GoogleのGemini APIリリースノートでも、同日にGemini 3.6 FlashとGemini 3.5 Flash-Liteの一般提供が示されている。Google側では、3.6 Flashはコードとagentic planningで効率を高め、3.5 Flash-Liteは低レイテンシで費用効率のよいsubagent向けモデルとして説明される。

Vercel AI GatewayのDocsでは、AI SDK v5/v6、OpenAI互換API、Anthropic互換APIから複数モデルへアクセスでき、利用量と費用の監視、budget、load balancing、fallbackを扱えると説明されている。さらにVercelは、BYOK、provider pricingへのno markup、zero data retention、routing rules、custom reportingにも触れている。

同じ日にVercel AI GatewayへLaguna S 2.1も追加されている。これは別トピックだが、AI Gatewayがチャットモデルの置き場ではなく、コーディングエージェントや長時間タスク向けモデルを並べる実行入口になりつつあることを示している。

## 推奨アーキテクチャ: モデルを機能ロールで抽象化する

本番アプリでは、`google/gemini-3.6-flash` を直接ビジネスロジックに埋め込むのではなく、機能ロールを定義するほうがよい。たとえば `coding_agent_primary`、`support_triage_fast`、`rag_answering`、`summarization_batch`、`policy_check_light` のようなロールを置き、ロールからGateway model slugへ解決する。

この構成にすると、モデル変更をコードデプロイなしに扱いやすくなる。Gemini 3.6 Flashの評価が良ければ `coding_agent_primary` に割り当て、Gemini 3.5 Flash-Liteの再試行率が低ければ `support_triage_fast` に割り当てる。品質が落ちた場合は、ロール単位で戻せる。

また、Gatewayの利用量を読むときも、モデル名だけでは足りない。`google/gemini-3.6-flash` の費用が増えていても、それがRAG回答なのか、社内コード修正なのか、顧客向けチャットなのかが分からなければ対策できない。機能ロール、顧客ID、部署、環境、リリースバージョンなどをメタデータとして持つ設計が必要になる。

この論点は、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/)で扱ったエージェント基盤設計とも近い。ただし、Managed Agentsはエージェント実行、ツール、状態管理の話であり、Vercel AI Gatewayはモデル呼び出しの統制点である。実行基盤、モデルGateway、データ取得、評価基盤を分けて責務を整理したい。

## 3.6 Flashと3.5 Flash-Liteの使い分け

Gemini 3.6 Flashは、長めのコンテキストを読み、複数ステップの計画を立て、コードやWeb開発に関わる作業を進める候補にする。たとえば、PRの差分説明、複数ファイルにまたがるリファクタ提案、UI仕様から実装タスクを分解する処理、テスト失敗ログの原因候補整理などである。

Gemini 3.5 Flash-Liteは、短い入力を高頻度で処理する場所に置く。問い合わせカテゴリ分類、機密情報らしさの一次判定、短い要約、レビューコメントのラベル付け、RAG前の検索クエリ整形、agentが使う小さな判断などが候補になる。

重要なのは、Liteを「安いから全部に使う」と見ないことだ。低コストモデルで失敗が増え、再試行や人間レビューが増えれば、総コストは下がらない。逆に、3.6 Flashをすべての軽量処理に使うと、品質差が出にくい処理でも費用だけ上がる。用途別に成功率、平均呼び出し回数、再試行率、完了時間、レビュー差し戻しを測る必要がある。

## Grounding、RAG、外部データを混ぜない

Gatewayでモデルを選べることと、回答の根拠を管理できることは別である。たとえばGeminiを使った検索groundingについては、[Gemini API parallel web search grounding](/blog/google-gemini-parallel-web-search-grounding-2026/)で整理したように、検索範囲、出典、引用、再現性、監査が別に必要になる。

RAGも同じだ。[Gemini File Searchのmultimodal RAG](/blog/google-gemini-file-search-multimodal-rag-2026/)で扱ったように、ファイルを根拠にするなら、投入対象、権限、削除、更新、引用、評価データを管理しなければならない。Gatewayを経由してGemini 3.6 Flashを呼ぶだけでは、誤った文書を根拠にするリスクは消えない。

したがって、アプリ側では「モデルGateway」「検索/取得」「プロンプト組み立て」「回答評価」「監査ログ」を分離するのがよい。モデルを変えるABテストと、検索対象を変えるABテストを同時に行うと、どちらが品質に効いたのか分からなくなる。

## 予算、BYOK、ログの設計

AI Gatewayの価値は、モデルの呼び出しを1か所で観測できる点にある。日本企業で本番化するなら、最初にbudgetの単位を決める。開発環境、本番環境、顧客向け機能、社内向け機能、部門、プロジェクトで、どこに上限を置くのかを決める必要がある。

API keyも1本で全用途に使わないほうがよい。PoC、社内ツール、本番顧客機能、batch処理で分ける。漏えい時の影響範囲を狭められるだけでなく、費用の原因も追いやすくなる。Vercelが説明するAPI key budgetsを使うなら、キー設計そのものが運用設計になる。

BYOKを使うかどうかは、費用だけで決めない。既存のGoogle契約、監査要件、プロバイダー側のログ保持、社内の鍵管理、障害時の責任分界を確認する。BYOKにすると購買や請求の説明はしやすくなる場合があるが、キー管理の責任も自社側に寄る。

ログは最小化の方針を先に決める。モデル入力にはソースコード、顧客名、メール本文、障害ログ、個人情報が入りうる。調査のために全文ログを残したくなるが、後で削除や開示対応が難しくなることがある。プロンプト全文、出力全文、メタデータ、token数、エラーコード、評価結果を分け、どこまで保存するかを用途別に決める。

## Fallbackとrouting rulesの注意点

Fallbackは可用性を高めるが、品質の差異を生む。Gemini 3.6 Flashから別モデルへ落とした場合、コード変更の提案粒度、日本語説明、tool useの安定性、JSON出力の厳密さが変わる可能性がある。

そのため、fallbackは「同じ品質を保証する魔法」ではなく、障害時モードとして設計する。顧客向け回答では、fallback時に短い回答へ切り替える、信頼度を下げる、人間確認へ回す、再試行を促すなどのUXが必要になる。社内向けコード生成では、fallbackモデルの出力は必ずレビュー必須にする判断もありうる。

Routing rulesも同じである。費用上限に近づいたらLiteへ寄せる、夜間batchだけ安価モデルへ回す、特定顧客のデータはBYOK経由のモデルだけにする、といったルールは有効だ。ただし、ルールが増えるほど、障害調査は難しくなる。ログには、最終的に選ばれたモデルだけでなく、なぜ選ばれたかを残したい。

## 評価データセットを先に作る

Gemini 3.6 Flashと3.5 Flash-Liteを入れる前に、小さな評価データセットを作るべきだ。問い合わせ分類なら実データを匿名化した50件、RAGなら社内文書から答えが分かる30問、コード支援なら過去の小さな修正タスク10件程度でよい。

評価項目は、正答率だけでは足りない。日本語の説明品質、根拠の有無、禁止データの混入、JSON schema違反、処理時間、token、再試行、fallback発生率を見る。高性能モデルで正答率が上がっても、schema違反が増えるなら本番APIには入れにくい。

また、モデル更新のたびに同じ評価を走らせる。Gateway経由でモデルを切り替えやすいことは、評価なしに切り替えてよいという意味ではない。特に顧客向け機能では、モデル名変更を通常の依存関係更新と同じように扱い、変更履歴と承認を残すべきだ。

## 導入順序

第一段階では、社内向けの低リスク機能でGatewayを通す。PR説明、エラーログ要約、問い合わせカテゴリ分類、社内ドキュメントの回答下書きが候補になる。この段階では、モデルロール、メタデータ、budget、ログ方針を固めることを目的にする。

第二段階では、Gemini 3.6 FlashとGemini 3.5 Flash-Liteの役割を分ける。3.6 Flashは長めの推論とagentic workflowへ、3.5 Flash-Liteは短い補助処理へ寄せる。両方を同じタスクに並べて、品質と費用の差を測る。

第三段階で、fallbackとrouting rulesを入れる。最初から複雑なroutingを入れると原因分析が難しい。まず単一モデルで品質と費用を把握し、その後に障害時fallback、予算上限時の切り替え、顧客別ルールを足すほうがよい。

第四段階で、顧客向け機能へ広げる。ここでは、データ保護、監査ログ、利用規約、エラー表示、人間確認、削除要求対応を含めて確認する。Gatewayは運用を楽にするが、プロダクト責任を代替しない。

## まとめ

Vercel AI GatewayのGemini 3.6 FlashとGemini 3.5 Flash-Lite対応は、AI SDK利用チームにとって実装しやすい更新である。`model` slugを変えるだけで試せるため、PoCの入口は低い。

一方で、本番導入の要点は、モデル名ではなく運用設計にある。機能ロールでモデルを抽象化し、budgetとAPI keyを分け、ログを最小化し、fallbackを品質モードとして扱い、評価データセットで切り替えを検証する。日本のWeb開発チームは、この順序で進めると、Gemini新モデルを便利な実験で終わらせず、管理可能なAI基盤として使いやすくなる。

## 出典

- [Gemini 3.6 Flash and Gemini 3.5 Flash-Lite are now available on AI Gateway](https://vercel.com/changelog/gemini-3-6-flash-3-5-flash-lite-on-ai-gateway) - Vercel Changelog, 2026-07-21
- [AI Gateway](https://vercel.com/docs/ai-gateway) - Vercel Docs
- [Release notes | Gemini API](https://ai.google.dev/gemini-api/docs/changelog) - Google AI for Developers, 2026-07-21
- [Laguna S 2.1 is now available on AI Gateway](https://vercel.com/changelog/laguna-s-2-1-is-now-available-on-ai-gateway) - Vercel Changelog, 2026-07-21
