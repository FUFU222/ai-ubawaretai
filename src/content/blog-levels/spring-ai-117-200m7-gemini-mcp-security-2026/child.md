---
article: 'spring-ai-117-200m7-gemini-mcp-security-2026'
level: 'child'
---

Spring AI は、Java や Spring Boot で生成AIアプリを作るためのプロジェクトです。2026年5月23日に `1.0.8`、`1.1.7`、`2.0.0-M7` が公開されました。今回の更新で特に大事なのは、`1.1.7` に脆弱性修正が入り、`2.0.0-M7` に MCP や Gemini まわりの大きな変更が入ったことです。

## 何が出たのか

Spring Blog によると、`1.1.7` と `2.0.0-M7` には CVE-2026-41863 の修正が含まれます。これは、Anthropic Skills API 連携で、LLM の影響を受けた filename を安全に扱わないまま file write に使う可能性があった、という内容です。

簡単に言うと、AI が出した file name や path をそのまま信用してはいけない、という話です。AI エージェントがファイルを作る、コードを書く、資料を保存する、外部ツールを呼ぶようになると、このような境界はとても重要になります。

## 1.1.7はまず確認したい更新

Spring AI `1.1.0 - 1.1.x` を使っていて、Anthropic Skills API support に触れている場合は、`1.1.7` への更新を優先して確認すべきです。使っていない場合でも、AI が生成した filename や path を使って file を保存する実装があるなら、同じ考え方で見直したほうがよいです。

特に社内文書生成、議事録作成、コード生成、ファイル変換のような用途では、AI が何らかの file を作ることがあります。そのとき、保存先を固定する、危ない path を拒否する、既存 file の上書きを制限する、といった処理が必要です。

## 2.0.0-M7は次の設計を見る材料

`2.0.0-M7` は milestone release です。本番にすぐ入れるというより、次の Spring AI 設計を確認するための版として見るのが安全です。

大きな点は、MCP の transport です。SSE transports は deprecated になり、Streamable HTTP が default server protocol になります。MCP は AI エージェントが外部ツールやデータへ接続するための仕組みなので、transport の変更は認証、proxy、監査ログ、timeout などにも関係します。

また、`ToolCallAdvisor` が標準的な tool call 管理の方法になり、`ToolSpec` fluent API も追加されています。AI がどの tool を呼べるか、tool の入力をどう定義するかは、セキュリティにも開発体験にも関わります。

## Gemini更新も含まれる

`2.0.0-M7` では Gemini 2.5 Flash への更新と Google Client Library BOM の更新も入っています。Gemini API を Java から使っているチームは、モデル名だけでなく、応答品質、streaming、tool call、timeout、コスト、既存 prompt との相性を確認するとよいです。

Spring AI は複数の AI provider を扱いやすくしますが、provider ごとの違いがなくなるわけではありません。だから、小さな検証用プロンプトやテストを用意して、更新前後を比べることが大切です。

## 日本のチームがやること

まず、現在の Spring AI version を確認します。次に、Anthropic Skills API support や file write を伴う tool を使っているかを確認します。該当するなら `1.1.7` への更新と、path の扱いを見直します。

MCP を使っている場合は、SSE 前提の設定やテストがないかを確認します。Streamable HTTP へ移るとき、社内 proxy や認証 header、監査ログの取り方が変わる可能性があります。

最後に、`2.0.0-M7` は検証環境で試します。本番に急いで入れるより、MCP、tool calling、Gemini、OpenAI streaming の挙動を小さく比較するほうが安全です。

## まとめ

今回の Spring AI 更新は、Java の生成AIアプリを安全に運用するための確認ポイントが詰まっています。`1.1.7` は脆弱性修正として優先度が高く、`2.0.0-M7` は MCP と tool calling の次の形を見るために重要です。

AI エージェントを Spring Boot で使うなら、モデルを呼ぶだけでなく、file、path、tool、MCP transport、監査ログまでまとめて設計する必要があります。

## 出典

- [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-M7-available-now/) - Spring Blog, 2026-05-23
- [CVE-2026-41863](https://spring.io/security/cve-2026-41863/) - Spring Security Advisory, 2026-05-23
- [Spring AI 2.0.0-M7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M7) - GitHub Releases
