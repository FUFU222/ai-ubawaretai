---
title: 'Spring AI更新、CVEとMCP移行をJavaチームが読む'
description: 'Spring AI 1.1.7と2.0.0-M7の更新を整理。CVE修正、MCP移行、Gemini 2.5 Flash対応から、日本のJava開発チームが今見るべき点を具体的に解説する。'
pubDate: '2026-05-24'
category: 'news'
tags: ['Spring AI', 'AIエージェント', 'MCP', 'Gemini API', 'セキュリティ', '開発者ツール']
draft: false
---

Spring AI が **2026年5月23日** に、1.0.8、1.1.7、2.0.0-M7 をまとめて公開した。派手なモデル発表ではないが、日本の Java / Spring Boot チームにはかなり実務的な更新だ。安定系にはセキュリティ修正が入り、2.0 系のマイルストーンには MCP transport の変更、ToolCallAdvisor の改善、Gemini 2.5 Flash 関連の更新、OpenAI streaming 修正が含まれる。

これは「Spring AI を使っている人だけの小さな話」ではない。Java で生成 AI アプリを本番に入れる企業は、モデル API だけでなく、ツール呼び出し、ファイル生成、MCP 連携、ストリーミング応答、依存ライブラリの更新判断まで面倒を見る必要がある。以前扱った [Google Gemini API のエージェント基盤](/blog/google-gemini-api-managed-agents-2026/) や [Gemini API Docs MCP](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) と同じく、AI アプリはフレームワーク側の変更が業務設計に直結する段階に入っている。

## 事実: 3系統のリリースが同時に出た

Spring の発表では、1.0.8、1.1.7、2.0.0-M7 が同日に案内された。1.0.8 と 1.1.7 は既存系統の修正リリースで、2.0.0-M7 は次期 2.0 に向けたマイルストーンという位置づけだ。

安定系を見るうえで重要なのは、1.1.7 が CVE-2026-41863 の修正を含む点だ。Spring のセキュリティアドバイザリによれば、Anthropic Skills API を使う Spring AI の一部機能で、LLM が影響したファイル名が十分に無害化されないまま `Path.resolve` に渡され、ファイル書き込みに使われる可能性があった。アドバイザリの影響範囲は 1.1.x 系で、OSS の修正バージョンは 1.1.7 とされている。

2.0.0-M7 は、より広い設計変更を含む。リリースノートでは、MCP の Streamable HTTP transport を既定にする変更、MCP Sync / Async client の SseClientTransport 対応、OpenAI Chat API の streaming レスポンス処理修正、Gemini 2.5 Flash 更新、ToolCallAdvisor の挙動改善、ToolSpec の導入などが並ぶ。

ここで分けて見るべきなのは、1.1.7 は「今すぐ確認する安定系更新」、2.0.0-M7 は「次期移行に向けて検証する更新」だということだ。日本企業の本番システムでは、M7 をそのまま本番投入するより、まず 1.1.7 でセキュリティ修正を取り込み、並行して 2.0 系の差分を検証するのが現実的だ。

## CVEはファイル書き込み境界の問題として読む

CVE-2026-41863 は、AI アプリ特有の怖さをよく示している。通常の Web アプリなら、入力値のサニタイズやパストラバーサル対策は古典的な話だ。しかし生成 AI アプリでは、入力値が人間のフォーム入力だけとは限らない。LLM が作ったファイル名、ツール呼び出しの引数、エージェントが選んだ保存先が、そのままアプリのファイル操作に流れ込む可能性がある。

Spring のアドバイザリは、Anthropic Skills API 支援機能に関係する問題として説明している。つまり、Claude や Skills API を使う Java アプリで、AI が作った成果物をローカルやサーバー側に保存するような使い方をしているチームは、単に「チャット応答を表示するだけ」のアプリより注意が必要だ。

この論点は、[Anthropic の Stainless SDK と MCP Platform](/blog/anthropic-stainless-sdk-mcp-platform-2026/) で扱ったような、AI ツール実行基盤の広がりともつながる。ツールやスキルが増えるほど、LLM の出力は画面上のテキストではなく、ファイル、API、データベース、社内システムへの操作になる。そうなると、AI が生成した値を「信頼できる内部値」として扱う設計は危ない。

日本の開発現場では、Spring Boot の標準的な Web セキュリティや認可設計には慣れていても、LLM が生成するツール引数の信頼境界はまだ曖昧になりやすい。今回の CVE は、AI アプリでも従来の入力検証、出力先制限、許可ディレクトリ固定、ファイル名正規化が必要だと確認する材料になる。

## 2.0.0-M7のMCP変更は移行計画が必要

2.0.0-M7 で注目したいのは MCP まわりだ。リリースノートでは、Streamable HTTP transport の既定化や、SseClientTransport の sync / async client 対応が挙げられている。これは単なる実装詳細ではない。MCP は、AI アプリが社内ツール、ドキュメント、データソース、業務 API とつながるための接続面になりつつある。

すでに MCP は、ローカル開発者ツールから企業のエージェント基盤まで広がっている。[GitHub Dependabot のAIエージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) のように、AI が検知、修正、PR 作成まで関与する流れでは、外部ツール接続の安定性と監査性が重要になる。Spring AI の MCP transport 変更も、その大きな流れの一部として読むべきだ。

企業導入でまず見るべきなのは、既存の MCP server / client 実装がどの transport を前提にしているかだ。サンプルコードのまま SSE を使っているのか、社内プロキシや認証を挟んでいるのか、ロードバランサや gateway がストリーミングを正しく扱えるのか。Streamable HTTP が既定になるなら、通信の張り方、タイムアウト、ログ、障害時の再接続も検証対象になる。

もう一つは、MCP を「便利なプラグイン接続」としてだけ見ないことだ。社内のチケット、CRM、ナレッジ、コードリポジトリ、ファイルストレージへ AI が接続するなら、MCP transport はデータ境界そのものになる。どの server を許可するか、どのスコープで token を渡すか、ログに機密情報が残らないかを設計しなければならない。

## GeminiとOpenAIの修正はマルチモデル運用の現実

2.0.0-M7 には Gemini 2.5 Flash の更新や OpenAI Chat API の streaming レスポンス修正も入っている。ここは、Spring AI をマルチモデル抽象化として使うチームにとって重要だ。

生成 AI アプリは、モデルごとに応答形式、tool calling、streaming、token 利用、エラー形式が少しずつ違う。フレームワークはその差を隠してくれるが、完全に消してくれるわけではない。モデル側の API が変わると、アプリ側のログ、UX、タイムアウト、リトライ、評価テストに影響する。

特に Gemini は、Google 側でもエージェントや RAG 基盤の更新が続いている。Spring AI の更新を追うときは、単に `pom.xml` や `build.gradle` の依存バージョンを上げるだけでなく、自社が使っているモデル provider ごとの回帰テストを用意したほうがよい。Gemini では tool calling、長文コンテキスト、マルチモーダル入力、ファイル検索系の挙動が絡みやすい。

OpenAI streaming の修正も同じだ。チャット UI では、streaming が少し崩れるだけで利用者には「止まった」「途中で切れた」と見える。業務アプリでは、回答生成の途中経過を監査ログに残すか、最終結果だけ保存するかも設計に関わる。フレームワーク更新後は、単体テストだけでなく、実際の UI での streaming 表示、キャンセル、タイムアウト、再試行まで見る必要がある。

## 日本のJavaチームが今週確認すべきこと

まず、Spring AI を使っているプロジェクトを棚卸しする。直接依存している場合だけでなく、社内テンプレート、PoC、研究開発環境、業務効率化ツールに入っている可能性がある。生成 AI PoC は正式な資産管理から漏れやすいので、GitHub / GitLab の dependency search や SBOM で確認したほうがよい。

次に、1.1.x 系の Spring AI を使い、Anthropic Skills API 支援機能やファイル生成を扱うアプリがないかを見る。該当するなら 1.1.7 への更新を優先する。ファイル保存先を固定しているか、ユーザーや LLM が生成したファイル名をそのまま使っていないか、既存ファイルを上書きできないかも確認する。

3つ目は、2.0.0-M7 を検証ブランチで試すことだ。MCP、ToolCallAdvisor、ToolSpec、Gemini、OpenAI streaming を使っているチームは、次期 2.0 で破壊的変更や挙動差が出る可能性がある。いまのうちに、代表的な prompt、tool call、streaming UI、エラー処理を自動評価に入れる。

4つ目は、AI フレームワーク更新を通常のライブラリ更新より少し厚く扱うことだ。[OpenAI TanStack 供給網攻撃](/blog/openai-tanstack-npm-supply-chain-2026/) でも見たように、AI ツールの依存関係は開発体験だけでなく、署名、CI/CD、資格情報、配布にも波及する。Spring AI のような基盤ライブラリは、機能追加とセキュリティ修正を分けて、更新理由と検証結果を残したほうがよい。

## まとめ

Spring AI 1.0.8 / 1.1.7 / 2.0.0-M7 は、Java の生成 AI アプリが本番運用に近づいたことを示す更新だ。1.1.7 は CVE-2026-41863 の修正としてすぐ確認すべきで、2.0.0-M7 は MCP、Gemini、OpenAI streaming、tool calling 周辺の次期設計を読む材料になる。

日本の Java / Spring Boot チームは、まず安定系を更新し、Anthropic Skills API とファイル書き込みの有無を確認する。そのうえで、2.0 系の MCP transport 変更やマルチモデル挙動を検証する。AI アプリ基盤の更新は、モデル差し替えではなく、社内ツール接続とセキュリティ境界の運用そのものだ。

## 出典

- [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-M7-available-now/) - Spring, 2026-05-23
- [CVE-2026-41863](https://spring.io/security/cve-2026-41863/) - Spring Security Advisory, 2026-05-23
- [Spring AI 2.0.0-M7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M7) - GitHub Releases, 2026-05-23
- [Spring AI 1.1.7 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7) - GitHub Releases, 2026-05-23
- [Spring AI 2.0 upgrade notes](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html) - Spring AI Reference
