---
article: 'spring-ai-117-200m7-gemini-mcp-security-2026'
level: 'expert'
---

Spring AI `1.1.7` と `2.0.0-M7` は、Java / Spring Boot で生成AIアプリケーションを組むチームにとって、依存ライブラリ更新以上の意味を持つ。`1.1.7` は CVE-2026-41863 の修正を含む現行系の安定更新であり、`2.0.0-M7` は MCP transport、tool calling、Gemini 2.5 Flash、OpenAI streaming 修正、Kotlin schema 修正を含む次期系の設計変更である。

実務上の要点は、セキュリティ更新とアーキテクチャ検証を分けることだ。CVE の影響確認と `1.1.7` 適用は、現行本番系のリスク低減として扱う。一方、`2.0.0-M7` は milestone release なので、MCP / tool calling / provider abstraction の移行検証として扱う。この二つを混ぜると、緊急性のある脆弱性対応が milestone 検証に巻き込まれ、逆に次期設計の破壊的変更が本番更新の議論に紛れ込む。

この論点は、以前の [AnthropicのStainless買収、SDKとMCPの現実](/blog/anthropic-stainless-sdk-mcp-platform-2026/) とつながる。エージェント時代の開発基盤では、モデル、SDK、MCP server、tool schema、認証、監査ログが別々の部品ではなくなる。Spring AI の今回の更新は、その変化が Java エコシステムにも具体的に入ってきたことを示している。

さらに、CVE-2026-41863 は「LLM が影響した filename」を安全な入力と見なしてはいけないことを教えている。これは [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱った agent workflow の事前検査や、[npm Staged Publishing、公開前検証を標準化](/blog/npm-staged-publishing-install-controls-2026/) で扱った供給網防御と同じ方向だ。AI 開発では、成果物が生成される前、tool が実行される前、file が書き込まれる前に境界を置く必要がある。

## 事実: CVEはAnthropic Skills API supportのfile writeリスク

Spring Security Advisory は、CVE-2026-41863 を medium severity として公開している。説明では、Spring AI の Anthropic Skills API support が、LLM の影響を受けた filename を sanitization しないまま `Path.resolve` に使い、file write 前の制御が不足していたとされる。攻撃者は、意図された target directory の外側、場合によっては restricted directories へ file を書き込ませられる可能性がある。

影響範囲は Spring AI `1.1.0 - 1.1.x` で、fix version は `1.1.7` だ。ここで注意すべきなのは、脆弱性の形が典型的な path traversal に見えても、入力の由来が AI エージェント特有である点だ。filename は直接ユーザーが入力した文字列だけでなく、LLM の出力、retrieval data、tool response、prompt injection の影響を受ける可能性がある。

したがって、対策は version update だけでは完結しない。Spring AI を使うアプリケーション側でも、file write を行う tool や skill の boundary を確認する必要がある。具体的には、書き込み root を job / tenant / user 単位で固定し、normalized path が root 外へ出ないことを検査し、symlink や overwrite を制限し、拡張子と MIME type を allowlist 化し、書き込み操作を audit log に残す。

日本企業の利用シナリオでは、社内文書生成、契約書ドラフト、設計書生成、コード生成、テストデータ生成、添付ファイル変換のように、AI が file を作る用途が多い。これらは便利だが、出力先 path を緩く扱うと、別 tenant の領域、既存成果物、設定ファイル、secret 周辺に影響する。Spring AI の CVE は、AI tool の入出力を通常の untrusted input と同じか、それ以上に慎重に扱うべきだという警告である。

## 事実: 2.0.0-M7はMCP transportとtool callingを動かす

Spring Blog と GitHub release notes では、`2.0.0-M7` の変更として、SSE transports の deprecation、Streamable HTTP の default server protocol 化、`ToolCallAdvisor` の標準化、`ToolSpec` fluent API、MCP SDK 2.0.0-M3 breaking API changes への対応が挙げられている。Kotlin nullable fields が MCP tool input schema で required として扱われる問題の修正も含まれる。

MCP transport の変更は、アプリコードだけの問題ではない。企業環境では、HTTP transport は ingress controller、API gateway、service mesh、corporate proxy、WAF、header normalization、timeout、observability、trace propagation、監査ログに触れる。SSE 前提で設計していた場合、Streamable HTTP への移行で接続維持、retry、load balancer、connection limit、security validator の挙動を確認する必要がある。

Spring AI 2.0 upgrade notes では、MCP client customizer や transport customizer 周辺の変更も示されている。たとえば、旧 API の import や implements の置換、transport builder ごとの manual step、header 名の lowercase normalization などは、認証・監査・tenant 分離に関わる実装へ影響しうる。MCP を社内基盤として使うなら、upgrade notes を単なる移行表ではなく security review checklist として読むべきだ。

`ToolCallAdvisor` と `ToolSpec` も重要である。tool calling は、LLM が外部機能を呼ぶ権限境界だ。schema が広すぎる、required / nullable の扱いがズレる、tool selection の advisor chain が想定と違う、metadata が欠ける、といった問題は、誤実行や監査不能につながる。`2.0.0-M7` はこの領域の標準化へ進んでいるが、既存実装との互換性は必ず検証する必要がある。

## 事実: Gemini 2.5 Flashとprovider抽象化の更新

`2.0.0-M7` は Gemini 2.5 Flash への置き換えと Google Client Library BOM の更新も含む。Spring Blog では Gemini updates として示され、GitHub release notes では `GEMINI_2_0_FLASH` から `GEMINI_2_5_FLASH` への置き換え、Google client library BOM の更新が列挙されている。

Spring AI のような abstraction layer を使う価値は、OpenAI、Anthropic、Google など複数 provider を Spring の作法で扱いやすくする点にある。しかし abstraction は provider 差を消すものではない。Gemini の model update は、tokenization、tool calling、streaming、response metadata、safety filtering、latency、cost、retry behavior、quota handling に影響する可能性がある。

[Google Gemini API管理エージェント、移行期の実装負債を減らす](/blog/google-gemini-api-managed-agents-2026/) で見たように、Gemini API 周辺は agent platform と managed execution の方向へ動いている。Spring AI 側で Gemini 2.5 Flash へ追随することは、Java アプリがこの流れを取り込む入口になる。一方で、日本語業務アプリでは、英語ベンチマークだけではなく、日本語 prompt、社内用語、長文、tool call、RAG context を含む評価が必要だ。

## 分析: 更新判断は3本のレーンに分ける

ここからは分析だ。第一レーンは security patch である。Spring AI `1.1.x` を使っている組織は、まず CVE-2026-41863 の影響有無を確認し、`1.1.7` への更新を検討する。Anthropic Skills API support を使っていない場合でも、同じアプリ内に file write tool があるなら、path handling の棚卸しを行うべきだ。ここでは milestone の `2.0.0-M7` 検証を混ぜない。

第二レーンは MCP migration である。MCP server / client を使っている、またはこれから作るチームは、SSE から Streamable HTTP への移行、customizer API、header normalization、security validator、gateway 設定、observability を検証する。MCP は社内ツール接続の入口になりやすいため、開発チームだけでなく platform / security / SRE を巻き込むべきである。

第三レーンは provider regression である。Gemini 2.5 Flash、OpenAI streaming chunk fix、Kotlin schema 修正、Docker Model Runner 修正などは、AI アプリの runtime behavior に影響する。小さな evaluation set を作り、既存 version と `2.0.0-M7` の挙動を比較する。評価項目には、日本語品質、tool selection、schema validation、streaming completeness、metadata preservation、timeout、retry、cost を含める。

この3レーンを分けると、意思決定が明確になる。security patch は早く、MCP migration は設計レビュー付きで、provider regression は評価データ付きで進める。全部を「Spring AI 更新」とまとめると、優先順位がぼやける。

## 分析: LLM由来入力はユーザー入力より複雑

CVE-2026-41863 の教訓は、LLM 由来入力を user input と同じ扱いにするだけでは足りない点にある。従来の Web application security では、request parameter、header、cookie、uploaded file を untrusted input として扱う。AI application では、それに加えて model output、retrieved document、tool response、system prompt に混入した instruction、conversation state が実行入力になる。

filename はその代表例だ。ユーザーが「report.md として保存して」と言った場合もあれば、LLM が文脈から filename を生成する場合もある。retrieval された markdown に path らしき文字列が入っている場合もある。tool response から次の tool call の argument が組み立てられる場合もある。これらのどこかに攻撃者の意図が入ると、アプリ側の file write が危険になる。

したがって、Spring AI を使う Java チームは、tool argument validation を framework 任せにしないほうがよい。controller / service / tool boundary で、domain-specific validator を持つ。file path なら root containment、allowed extension、max size、overwrite policy、temporary directory、cleanup policy を明示する。外部 API 呼び出しなら allowed host、method、scope、rate limit を明示する。database query なら read-only / write capability を分ける。

この考え方は、AI エージェントを社内システムに入れるほど重要になる。エージェントは便利な facade だが、実行するのは最終的に Java code、database、filesystem、HTTP client、message queue である。LLM の自然言語出力に見えるものを、最終的には低レベルの side effect に変換している。その変換点が最も危ない。

## 日本企業向けの実装チェック

まず dependency 管理を確認する。Spring AI を使っている repository を洗い出し、`1.1.x` 系の version、Anthropic Skills API support、file write tool、MCP module、Gemini / OpenAI provider を一覧化する。SBOM や dependency graph がある場合は、Spring AI module 単位で追えるようにする。

次に file boundary を確認する。AI が file を生成する全機能について、保存先 root、tenant / user 分離、path normalization、symlink 対策、overwrite policy、拡張子 allowlist、scan、audit log、retention を見直す。CVE に直接該当しなくても、同じパターンの危険は社内実装に入りやすい。

MCP については、transport と security を同時に見る。SSE 前提の client / server、proxy 設定、keep-alive、timeout、header 依存、customizer API、lowercase header normalization、security validator のテストを作る。社内 gateway 経由で MCP を提供するなら、Streamable HTTP を前提に observability と rate limit を再設計する。

tool calling については、schema と権限を分けて review する。`ToolSpec` の導入で tool 定義が書きやすくなっても、入力 schema が広ければ危険は残る。nullable、required、enum、format、max length、allowed operation を最小化し、tool ごとに execution policy を持つ。人間承認が必要な tool と自動実行可能な tool を分ける。

provider update については、evaluation を小さく始める。Gemini 2.5 Flash、OpenAI streaming、Kotlin schema、Docker Model Runner など、今回触れられた変更点に対応する regression case を作る。日本語 prompt、社内文書 RAG、tool call、long output、streaming interruption、retry を含めると、単なる unit test より実務に近い。

## まとめ

Spring AI `1.1.7` と `2.0.0-M7` は、Java 生成AIアプリの運用成熟度を測るよい材料だ。`1.1.7` は CVE-2026-41863 への現行系対応として、`2.0.0-M7` は MCP transport、tool calling、Gemini 2.5 Flash、provider abstraction の次期検証として扱う。

日本の Spring Boot チームは、今回の更新を「AI ライブラリの新機能」としてではなく、AI エージェントの信頼境界をどこに置くかという設計問題として読むべきだ。LLM 由来 path、tool argument、MCP transport、provider library、監査ログをまとめて review できるチームほど、生成AIアプリを本番へ持ち込みやすくなる。

## 出典

- [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-M7-available-now/) - Spring Blog, 2026-05-23
- [CVE-2026-41863: LLM-influenced filename used unsanitized in Path.resolve before file write in Spring AI support for Anthropic Skills API](https://spring.io/security/cve-2026-41863/) - Spring Security Advisory, 2026-05-23
- [Spring AI 2.0.0-M7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M7) - GitHub Releases
- [Spring AI 1.1.7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7) - GitHub Releases
- [Spring AI 2.0 upgrade notes](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html) - Spring AI Reference
