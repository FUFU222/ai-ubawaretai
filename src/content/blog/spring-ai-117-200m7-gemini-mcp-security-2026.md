---
title: 'Spring AI更新、CVEとMCP移行をJavaチームが読む'
description: 'Spring AI 1.1.7と2.0.0-M7を整理。CVE修正、MCP移行、Gemini更新が日本のJava開発基盤、Spring Boot運用、AIエージェント実装に与える影響を解説する。'
pubDate: '2026-05-24'
category: 'news'
tags: ['Spring AI', 'MCP', 'Gemini API', 'セキュリティ', '脆弱性対応', '開発基盤', 'AIエージェント']
draft: false
---

Spring AI チームは **2026年5月23日**、Spring AI `1.0.8`、`1.1.7`、`2.0.0-M7` を公開した。日本の Java / Spring Boot チームにとって特に見るべきなのは、安定系の `1.1.7` と次期系の `2.0.0-M7` である。前者は CVE-2026-41863 の修正を含み、後者は MCP transport、tool calling、Gemini 2.5 Flash 対応をまとめて動かしている。

これは単なるライブラリ更新ではない。Spring Boot で生成AIアプリを作る企業では、チャットモデル、ツール呼び出し、MCP server、外部API接続、ファイル生成、社内データアクセスが同じアプリの中で絡む。以前の [AnthropicのStainless買収、SDKとMCPの現実](/blog/anthropic-stainless-sdk-mcp-platform-2026/) で見たように、AI エージェントの実用性はモデル性能だけでなく、API と MCP の接続面に左右される。Spring AI の今回の更新は、その接続面を Java 側でどう保守するかという話だ。

CVE-2026-41863 は Anthropic Skills API 連携に関わるファイル書き込みリスクだ。AI が生成・選択した filename をアプリがどう信頼するかは、エージェント実装では見落とされやすい。これは [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) や [npm Staged Publishing、公開前検証を標準化](/blog/npm-staged-publishing-install-controls-2026/) と同じく、AI 開発の速度が上がるほど信頼境界を前倒しで設計する必要があることを示している。

## 事実: 1.1.7と2.0.0-M7が同時に出た

Spring Blog によると、今回のリリースは複数の release stream に対する改善、安定化、bug fix を含む。`1.1.7` と `2.0.0-M7` には CVE-2026-41863 の security fix が含まれる。`1.1.7` では Ollama の GraalVM native image 対応修正と、OpenAI streaming chunk が内部 `switchMap` により落ちる問題の修正も示されている。

`2.0.0-M7` はより大きい。Spring Blog と GitHub release notes では、SSE transports の deprecation と Streamable HTTP の既定化、`ToolCallAdvisor` の標準化、`ToolSpec` fluent API、Gemini 2.5 Flash への更新、Google Client Library BOM の更新が挙げられている。Kotlin nullable fields が MCP tool input schema で required 扱いになる問題など、AI tool schema 周辺の修正も含まれる。

ここで日本チームが分けて考えるべきなのは、`1.1.7` は現行系の安全な取り込み候補であり、`2.0.0-M7` は次期設計の検証候補だという点だ。Spring AI を本番で使っているなら、まず `1.1.7` の適用可否を確認する。一方で、MCP や tool calling の将来設計を進めているチームは、`2.0.0-M7` の breaking changes と upgrade notes を検証環境で読むべきである。

## 事実: CVEはLLM由来filenameの扱いが焦点

Spring Security Advisory は、CVE-2026-41863 を medium severity として説明している。対象は Spring AI の Anthropic Skills API support で、LLM の影響を受けた filename が unsanitized のまま `Path.resolve` に使われ、file write 前に十分に制御されない問題だ。悪意ある利用者が、意図した target directory の外側へ file を書き込ませる可能性がある。

影響範囲は Spring AI `1.1.0 - 1.1.x` とされ、修正版は `1.1.7` だ。つまり、Anthropic Skills API 連携を使っている、または試験導入しているチームは、単に dependency update として見るのではなく、file write 周辺の実装と権限も点検したほうがよい。

この脆弱性の実務的な教訓は明確だ。AI エージェントが扱う filename、path、tool argument、download artifact、generated file を「ユーザー入力より少し信頼できるもの」と見なしてはいけない。LLM の出力は、外部ユーザーの prompt、retrieval data、tool response、会話履歴の影響を受ける。したがって、path normalization、allowlist、workspace boundary、overwrite policy、audit log はアプリ側で持つ必要がある。

日本企業では、生成AIアプリが社内文書作成、議事録生成、設計書生成、コード生成、ファイル変換と結びつきやすい。Spring AI を使う場合でも、LLM が提案した file path をそのまま使わない、書き込み先を tenant / user / job ごとの sandbox に閉じる、既存ファイル上書きを明示承認にする、といった実装規約が必要になる。

## 事実: MCPはStreamable HTTP既定化へ進む

`2.0.0-M7` の大きな変更点は MCP transport だ。Spring Blog は、SSE transports が deprecated になり、Streamable HTTP が新しい default server protocol になったと説明している。GitHub release notes でも同じ変更が挙げられている。

MCP は AI エージェントが外部ツールやデータへ接続するための重要な面になっている。だが、transport の変更は単なる設定名の差し替えではない。認証 header、proxy、timeout、streaming、observability、社内 gateway、WAF、監査ログの取り方に影響する。特に Spring Boot を社内標準にしている企業では、MCP server をアプリケーション群の一部として運用する可能性があるため、HTTP transport の既定変更はインフラ側にも確認が必要だ。

[Google、Gemini API Docs MCPを公開](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) で扱ったように、MCP はモデルに公式ドキュメントや開発者スキルを渡す導線としても広がっている。Spring AI が MCP SDK 2.0 系の変化へ追随していることは、Java チームが今後のエージェント基盤を作るうえで重要だ。ただし milestone release の変更は本番採用ではなく、互換性検証の材料として扱うべきである。

## 分析: まず1.1.7、次にM7検証を分ける

ここからは分析だ。日本の Spring Boot チームが今回すぐにやるべきことは、`1.1.7` と `2.0.0-M7` を同じ意思決定にしないことだ。CVE 修正が含まれる `1.1.7` は、影響有無を確認したうえで更新候補にする。特に Anthropic Skills API support を使っているなら、更新だけでなく file write 周辺の権限境界を見直す。

一方で、`2.0.0-M7` は milestone であり、production にそのまま入れるというより、次期設計の検証対象だ。MCP transport、`ToolCallAdvisor`、`ToolSpec`、Gemini 2.5 Flash、Kotlin schema 修正、OpenAI streaming 修正が自社コードにどう影響するかを、検証 branch や sandbox environment で見るのが現実的である。

特に大企業や SIer では、Spring Boot application は単体で完結しない。API gateway、認証基盤、監査ログ、社内プロキシ、egress control、SRE の運用 dashboard とつながる。MCP server を Spring AI で作るなら、transport の既定変更は開発チームだけでなく、platform team と security team も含めて確認する必要がある。

## 分析: Gemini更新はモデル名だけではない

`2.0.0-M7` では Gemini 2.5 Flash への更新と Google Client Library BOM の更新も入っている。これは、Google Gemini API を Java から使うチームには実務影響がある。モデル名の置き換えだけではなく、response metadata、tool calling、rate limit、library version、Spring Boot 4 との組み合わせを確認する必要がある。

[Google Gemini API管理エージェント、移行期の実装負債を減らす](/blog/google-gemini-api-managed-agents-2026/) でも触れたように、Gemini API 周辺は agent platform、RAG、tool use、managed execution の方向へ進んでいる。Spring AI が Gemini 2.5 Flash へ追随することは、Java エコシステムでもこの流れを取り込む準備が進んでいることを意味する。

ただし、モデル更新は常に検証が必要だ。日本語の応答品質、tool call の安定性、streaming の chunking、既存 prompt template との相性、cost / latency、監査ログに残る metadata は、公式 release note だけでは判断できない。Spring AI の抽象化に乗る場合でも、モデルごとの差分を測る小さな evaluation set を持つべきである。

## 導入時の確認リスト

まず、現在の Spring AI version と Anthropic Skills API support の利用有無を確認する。`1.1.0 - 1.1.x` を使っていて、該当機能に触れているなら `1.1.7` への更新を優先する。該当機能を使っていなくても、file write を伴う tool や Skills 連携があるなら、LLM 由来の path を sanitization しているかを確認する。

次に、MCP server / client の transport を棚卸しする。SSE を前提にしている設定、proxy、test、monitoring があるなら、Streamable HTTP への移行で何が変わるかを upgrade notes と検証環境で見る。header normalization や customizer API の変更も、認証・監査の実装に影響しうる。

3つ目は、tool calling の実装を確認することだ。`ToolCallAdvisor` が標準的な扱いになる流れ、`ToolSpec` fluent API、Kotlin schema 修正は、社内 tool definition の書き方や review point を変える可能性がある。AI がどの tool を呼べるか、入力 schema が本当に最小権限になっているかを見直したい。

4つ目は、Gemini と OpenAI streaming の regression test だ。Spring AI の抽象化があるからこそ、複数 provider を同じように扱える一方、provider ごとの差分は残る。日本語プロンプト、長文入力、tool call、streaming、retry、timeout を含む最小テストを作り、`2.0.0-M7` の検証 branch で比較する。

## まとめ

Spring AI `1.1.7` と `2.0.0-M7` は、日本の Java チームにとって「更新して終わり」ではない。`1.1.7` は CVE-2026-41863 を受けた現行系の安全確認、`2.0.0-M7` は MCP、tool calling、Gemini 更新を含む次期設計の検証材料として分けて扱うべきだ。

AI エージェントを Spring Boot 上で動かすなら、モデル接続だけではなく、path、tool argument、MCP transport、provider library、監査ログまでを一つの信頼境界として見る必要がある。今回のリリースは、その境界を Java 開発基盤で再点検するよいタイミングである。

## 出典

- [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-M7-available-now/) - Spring Blog, 2026-05-23
- [CVE-2026-41863: LLM-influenced filename used unsanitized in Path.resolve before file write in Spring AI support for Anthropic Skills API](https://spring.io/security/cve-2026-41863/) - Spring Security Advisory, 2026-05-23
- [Spring AI 2.0.0-M7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M7) - GitHub Releases
- [Spring AI 1.1.7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7) - GitHub Releases
- [Spring AI 2.0 upgrade notes](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html) - Spring AI Reference
