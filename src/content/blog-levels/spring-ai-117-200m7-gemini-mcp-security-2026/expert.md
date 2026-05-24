---
article: 'spring-ai-117-200m7-gemini-mcp-security-2026'
level: 'expert'
---

Spring AI 1.0.8、1.1.7、2.0.0-M7 の同時リリースは、Java の生成 AI アプリ基盤が「便利な抽象化」から「運用対象のミドルウェア」へ移ったことを示している。今回の中心は、新モデルの華やかな発表ではない。CVE-2026-41863、MCP transport、ToolCallAdvisor、ToolSpec、Gemini 2.5 Flash、OpenAI streaming という、地味だが本番運用に効く変更群である。

日本の大企業や SIer は Spring Boot を広く使っている。だから Spring AI の更新は、Python や TypeScript の AI SDK だけを追っていると見落としやすいが、業務システムへ生成 AI を組み込む現場には直撃する。特に既存の Spring Security、Actuator、Micrometer、Gateway、Batch、Cloud Config と組み合わせて AI 機能を足している組織では、フレームワーク更新がセキュリティ、監査、通信、UI まで波及する。

## 事実: 1.1.7は安定系のセキュリティ更新

Spring の 2026年5月23日の告知では、1.0.8、1.1.7、2.0.0-M7 が公開された。安定系の実務判断では、まず 1.1.7 を見るべきだ。Spring Security Advisory は CVE-2026-41863 を公開し、Spring AI の Anthropic Skills API support に関係するファイル書き込みリスクを説明している。

問題の形は、LLM が影響したファイル名を十分にサニタイズしないまま `Path.resolve` に渡し、ファイル書き込みに使う可能性があるというものだ。アドバイザリの影響範囲は 1.1.x 系で、OSS の修正バージョンは 1.1.7 とされている。つまり、Spring AI を直接使っていない読者にも一般化できる教訓は、LLM の出力を内部値として扱わないことだ。

これは、従来の path traversal や unsafe file write の再来に見える。しかし AI アプリでは入力源が違う。ユーザーが直接フォームに入れた文字列だけでなく、モデルが生成した tool argument、agent が選んだ output filename、skill 実行の中間成果物がファイル操作に入る。従来なら controller や request DTO で検証していた境界が、AI orchestration layer の奥へ移動する。

ここで重要なのは、AI フレームワークが「安全な抽象化」を提供していても、アプリ固有の許可範囲は消えないことだ。保存してよいディレクトリ、上書きしてよいファイル、拡張子、ファイルサイズ、ユーザーごとの namespace は、アプリ側が決める。Spring AI の修正を取り込んだ後も、AI が生成したファイル名を business identifier と同一視しない設計が必要になる。

## 分析: Skills API利用チームは影響調査を狭く切れる

今回の CVE は、Spring AI 全機能が一律に危険という話ではない。Anthropic Skills API support とファイル書き込みの組み合わせが論点だ。したがって、実務では影響調査を雑に全社展開するより、該当面を狭く切るほうがよい。

まず、依存関係を棚卸しする。Maven、Gradle、SBOM、依存関係管理ツールで Spring AI のバージョンを確認する。次に、Anthropic 関連 starter、Skills API、ファイル生成、artifact 出力、ユーザーアップロードと AI 生成物の結合箇所を探す。最後に、保存先が固定されているか、パス正規化後に許可 root 配下であることを確認しているか、既存ファイル上書きを制限しているかを見る。

この整理は、[OpenAI TanStack 供給網攻撃](/blog/openai-tanstack-npm-supply-chain-2026/) で扱った依存関係対応とも通じる。AI ツールの事故は、モデル性能だけで起きるのではない。依存ライブラリ、CI/CD、署名、認証情報、ローカルファイル操作という古典的な面から起きる。Spring AI の CVE は、Java 側の AI 導入でも同じ基本が必要だと示している。

日本企業では、PoC で作った AI ツールが本番相当の社内データに触れていることがある。正式サービスではないから脆弱性管理から外れる、という扱いは危ない。むしろ AI PoC は例外的な権限やローカルファイル操作を持ちやすい。Spring AI の更新は、PoC 資産も SBOM と脆弱性管理に入れるきっかけにすべきだ。

## 2.0.0-M7のMCP変更はプロトコル移行だけではない

2.0.0-M7 では、MCP の Streamable HTTP transport が既定になる変更が目立つ。加えて、MCP Sync / Async client の SseClientTransport 対応も入っている。表面上は transport の選択肢に見えるが、企業アーキテクチャでは通信境界、認証、監査、ネットワーク機器の挙動に関わる。

MCP は、LLM アプリが外部ツールを呼ぶための汎用接続面として広がっている。[Gemini API Docs MCP と Agent Skills](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) で見たように、ベンダー自身がドキュメントやツール呼び出しを MCP 経由で扱う流れがある。また、[Anthropic Stainless SDK と MCP Platform](/blog/anthropic-stainless-sdk-mcp-platform-2026/) のように、SDK 生成や API 接続の整備ともつながる。

Spring AI が MCP を扱うということは、Java の業務アプリが MCP server を client として呼ぶ、または社内機能を MCP server として提供する可能性があるということだ。ここで transport が変わると、HTTP gateway、WAF、社内 proxy、mTLS、認可 middleware、request logging、observability の設計が変わる。

たとえば、SSE 前提の実装では connection の寿命、proxy buffering、idle timeout、再接続、client cancel が問題になりやすい。Streamable HTTP を既定にするなら、それらの一部は改善する可能性があるが、既存の監視やテストが新しい通信パターンを想定していないと別の問題が出る。MCP は UI から見えにくいが、実際には AI agent の手足になる通信面だ。

## ToolCallAdvisorとToolSpecは運用設計に効く

2.0.0-M7 には、ToolCallAdvisor の改善と ToolSpec の導入も含まれる。ここは、AI agent を実務に入れるチームほど重い。tool calling は、単にモデルに関数を呼ばせる機能ではない。どの tool を提示するか、いつ呼ばせるか、戻り値をどう要約するか、失敗時に再試行するか、ログに何を残すかという運用設計である。

ToolSpec のような抽象化が整うと、モデル provider ごとの差を吸収しやすくなる。一方で、抽象化が増えるほど、実際にどの tool schema がモデルへ渡されたのか、どの advisor が介入したのか、どの戻り値が最終回答に含まれたのかを追跡する必要が出る。AI アプリの監査では、最終回答だけ見ても不十分だ。

この点は [Google Gemini API のエージェント基盤](/blog/google-gemini-api-managed-agents-2026/) と同じ方向を向いている。モデルを単体で呼ぶ段階から、tool、memory、retrieval、agent runtime を束ねる段階へ進むほど、アプリフレームワークの設計が重要になる。Spring AI は、Java チームにこの層を Spring の構成管理や依存注入の中で扱わせる役割を担う。

実務では、tool calling の評価項目を増やすべきだ。期待する tool が選ばれるか、禁止 tool が呼ばれないか、ユーザー権限に応じて tool set が変わるか、tool error が prompt injection のように回答へ混ざらないか、戻り値に個人情報や秘密情報が含まれたときに redaction できるか。2.0 系の変更を追うなら、単に API 差分を読むだけでは足りない。

## GeminiとOpenAI streamingは抽象化の限界を示す

2.0.0-M7 は Gemini 2.5 Flash の更新と OpenAI Chat API streaming レスポンス修正も含む。これは、Spring AI がマルチプロバイダ抽象化である以上、避けられない領域だ。

モデル provider は、同じ「チャット」「ツール呼び出し」「ストリーミング」と呼ばれる機能でも、細部が違う。部分応答の単位、tool call delta の表現、finish reason、usage 情報のタイミング、エラーオブジェクト、safety block、rate limit、retry-after の扱いが違う。フレームワークはそれを標準化しようとするが、すべての差を隠し切ることはできない。

日本の業務アプリでは、streaming UI の品質が思った以上に重要になる。コールセンター支援、社内検索、コードレビュー、提案書作成では、利用者は応答が少しずつ出ることを期待する。streaming が途中で止まる、同じ文が重複する、tool call の途中状態が表示される、キャンセル後に課金やログが残る、といった問題は UX だけでなく監査にも影響する。

Gemini 更新も、単なるモデル名変更ではない。[Gemini API の managed agents](/blog/google-gemini-api-managed-agents-2026/) のように、Google 側は agent runtime、RAG、tool use、マルチモーダルを広げている。Spring AI 側で Gemini 2.5 Flash の扱いが変わるなら、Java アプリの評価セットにも Gemini 固有のケースを入れるべきだ。

## 日本企業向けの更新戦略

第一に、1.1.7 はセキュリティ更新として優先する。Anthropic Skills API を使っていなくても、Spring AI を使うプロジェクトの依存関係を棚卸しし、バージョンを固定している理由を確認する。更新できない場合は、該当機能の未使用確認、ファイル書き込み境界、許可ディレクトリ、ランタイム権限を記録する。

第二に、2.0.0-M7 は検証ラインに入れる。本番導入ではなく、MCP、tool calling、Gemini、OpenAI streaming を代表するテストケースを作る。ここで見るべきなのは、コンパイル互換性だけではない。会話ログ、tool call trace、latency、エラー時の fallback、proxy 経由の streaming、timeout、認証失敗時のメッセージまで含める。

第三に、MCP server / client の許可リストを作る。開発者がローカルで好きな MCP server をつなぐ段階と、企業アプリが本番で社内データへアクセスする段階は違う。どの server が正式に許可され、どの credential を使い、どのログが残り、どの情報分類のデータを返してよいかを明文化する必要がある。

第四に、AI が生成した値の validation policy を共通部品に寄せる。ファイル名、URL、SQL 条件、API parameter、メール宛先、チケット更新内容、コードパッチなど、AI の出力が副作用を持つ箇所は増える。個別実装で対応すると漏れるため、Spring の Validator、service layer、policy object、gateway filter などで境界を作るほうがよい。

第五に、Dependabot や Renovate のルールを AI ライブラリ向けに少し厚くする。[GitHub Dependabot のAIエージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) のように依存更新自体も AI 支援が進むが、AI フレームワークは通常の patch 更新より挙動差が大きい。セキュリティ patch は早く、M 系列や milestone は検証 branch へ、というルールを分ける。

## まとめ

Spring AI の 2026年5月23日更新は、Java の生成 AI アプリ運用で見落としやすい現実をまとめて示した。安定系では CVE-2026-41863 の修正が必要であり、2.0.0-M7 では MCP transport、ToolCallAdvisor、ToolSpec、Gemini、OpenAI streaming のような実行基盤の変更が進んでいる。

日本企業が見るべきなのは、モデル発表の有無ではない。Spring Boot で AI 機能を業務システムに組み込むなら、フレームワーク更新は通信境界、ツール権限、ファイル書き込み、監査ログ、UI 応答品質を変える。まず 1.1.7 を適用または影響除外し、2.0 系は MCP と tool calling を中心に検証する。それが、Java の AI アプリを PoC から運用へ持っていくための現実的な順序だ。

## 出典

- [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-M7-available-now/) - Spring, 2026-05-23
- [CVE-2026-41863](https://spring.io/security/cve-2026-41863/) - Spring Security Advisory, 2026-05-23
- [Spring AI 2.0.0-M7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M7) - GitHub Releases, 2026-05-23
- [Spring AI 1.1.7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7) - GitHub Releases, 2026-05-23
- [Spring AI 2.0 upgrade notes](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html) - Spring AI Reference
