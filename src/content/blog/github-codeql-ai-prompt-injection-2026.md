---
title: 'CodeQL AI検査、プロンプト注入をSAST標準へ入れる'
description: 'CodeQL AI検査がsystem prompt injectionを検出。日本の開発チームがAIアプリのSAST、PR検査、Copilot運用へどう組み込むか実務目線で整理する。'
pubDate: '2026-07-12'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'CodeQL', 'セキュリティ', '開発者ツール', 'AIエージェント']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月10日**、CodeQL 2.26.0 の更新として、JavaScript / TypeScript 向けに **AI の system prompt injection を検出する query** を追加したと発表した。対象は、信頼できないユーザー入力が AI モデルの system prompt に流れ込み、攻撃者がモデルの振る舞いを変えられるようなコードである。

これは単なる CodeQL の細かな query 追加ではない。日本の開発組織では、OpenAI、Anthropic、Google GenAI SDK、agent framework、MCP、RAG、社内チャットボットを組み合わせた AI アプリが増えている。これまで prompt injection は「プロンプト設計」や「利用者教育」の話として扱われがちだったが、今回の更新はそれを **コードのデータフローとして静的解析する** 方向へ寄せた。

すでにこのサイトでは、[GitHub第三者agent検証](/blog/github-third-party-agent-security-validation-2026/) で AI agent が作った PR の受け入れ検査を、[Copilot CLI security review](/blog/github-copilot-cli-security-review-2026/) で commit 前の検査を扱った。今回の CodeQL 更新は、そのさらに基礎にある SAST の層で、AI アプリ固有の危険な入力経路を見つける話である。

## 事実: CodeQLにsystem prompt injection検査が入った

GitHub Changelog は、CodeQL 2.26.0 が Kotlin 2.4.0 対応に加えて、JavaScript / TypeScript の `js/system-prompt-injection` query を追加したと説明している。この query は、信頼できない user-provided values が AI model の system prompt に流れるケースを検出する。

CodeQL の 2.26.0 changelog でも、新しい security query が 1 件追加され、Default suite は 497 個の security query、170 の CWE を対象にすると整理されている。新 query の説明は、ユーザー制御値が system prompt に入ることで、攻撃者がモデルの behavior を操作できる、というものだ。

重要なのは、検査対象が OpenAI だけに閉じていない点である。GitHub Changelog は、OpenAI、Anthropic、Google GenAI SDK の追加 API に prompt injection sink を足したと説明している。例として、Sora prompts、OpenAI Realtime session instructions、Anthropic legacy completion prompts、Google GenAI cached content と system instructions が挙げられている。

つまり、AI アプリのセキュリティ確認は、特定ベンダーの使い方だけではなくなっている。フロントエンドや Node.js のサーバーで、ユーザー入力、URL query、DB の値、外部文書の内容をそのまま system prompt、tool description、agent instruction に混ぜていないかを、通常のデータフロー解析の対象として見る必要が出てきた。

## 事実: tool descriptionも攻撃面になる

CodeQL の query help は、system prompt にユーザー入力を直接結合する例を危険なコードとして示している。たとえば、`persona` のようなユーザー制御値を system role の文に埋め込むと、その値が単なるデータではなく、モデルへの信頼済み命令として扱われる可能性がある。

修正方針は明確だ。ユーザー制御値は system prompt に入れず、user role の message として渡す。どうしても system prompt に影響させる必要がある場合は、固定の allowlist による検証を挟む。これは入力検証としては古典的だが、AI アプリでは「どの role に入れるか」「どの instructions と同じ信頼境界に置くか」が新しい実装論点になる。

さらに query help は、agent framework の tool description にユーザー入力を混ぜる例も危険として扱う。tool description は開発者から見ると説明文に見えやすい。しかし、モデルにとっては tool をどう使うか判断するための信頼済み文脈である。ここに外部入力が入ると、攻撃者は tool の意味や使い方を間接的に変えられる。

この点は [ChatGPT Lockdown Mode](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) の論点ともつながる。Lockdown Mode は外部コンテンツ由来の prompt injection と data exfiltration を運用設定で抑える話だった。CodeQL の新 query は、AI アプリを作る側が、そもそも信頼できない値を信頼済み prompt 領域へ入れていないかを開発時点で見る話である。

## 分析: 日本のAIアプリ開発ではSAST基準を更新する

ここからは分析である。

日本企業がこの更新でまず見るべきなのは、「うちは CodeQL を入れているか」だけではない。既存の CodeQL 運用が、AI アプリの新しい入力経路をどこまで含んでいるかだ。従来の SAST は SQL injection、XSS、path traversal、secret、弱い暗号、認可漏れを中心に設計されてきた。そこへ system prompt、agent instruction、tool schema、retrieval data、cached content が加わる。

特に危ないのは、AI 機能がプロトタイプからそのまま本番に残るケースだ。社内向けの問い合わせ bot、営業支援 agent、文書要約 API、開発者向け PR assistant は、最初は小さな便利機能として作られる。しかし、後から Slack、Drive、CRM、GitHub、社内 DB に接続されると、prompt の信頼境界は急に重要になる。

CodeQL の新 query は、こうした実装のうち「コード上で追える危険な結合」を見つける。もちろん、すべての prompt injection を検出できるわけではない。外部 PDF の本文、Web ページ、RAG の検索結果、MCP tool response に埋め込まれた命令は、実行時の文脈やデータソース設計も見なければならない。しかし、system prompt や tool description に user input を直接混ぜるような明確な危険パターンは、CI の段階で止められる可能性がある。

[GitHub Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) で扱ったように、agent が作った変更を受け入れる組織では、CodeQL、secret scanning、dependency vulnerability checks の有効状態がレビュー負荷に直結する。今回の query は、その CodeQL 側が AI アプリ特有の危険パターンへ広がったことを意味する。

## 導入前に確認する5項目

第一に、AI SDK を使っている JavaScript / TypeScript リポジトリを棚卸しする。OpenAI、Anthropic、Google GenAI SDK、agent framework、独自 wrapper、社内 prompt helper を探し、system prompt、instructions、tool description、cached content を作っている箇所を洗い出す。

第二に、CodeQL のバージョンと実行環境を確認する。github.com の code scanning 利用者には新しい CodeQL が自動展開される一方、GitHub Enterprise Server や自前 CI で古い CodeQL を固定している場合は、2.26.0 相当の query が入っているかを確認する必要がある。

第三に、AI 関連の finding を通常の脆弱性と同じ流れに載せる。system prompt injection は「AI っぽい注意喚起」ではなく、CWE-1427 に関連する入力無害化の問題である。severity、owner、修正期限、例外承認を曖昧にせず、通常の security finding と同じ台帳に入れるべきだ。

第四に、修正パターンをテンプレート化する。ユーザー入力を user role へ移す、system prompt は固定文にする、tool description は固定文と allowlist にする、topic や persona は enum にする、外部文書の内容は trusted instruction と分ける。開発者が毎回ゼロから考えなくてよい形にする。

第五に、AI agent が作ったコードにも同じ基準を適用する。Copilot、Codex、Claude Code、Cursor、社内 agent が生成した AI SDK のコードは、見た目が自然でも信頼境界を間違えることがある。[第三者agent検証](/blog/github-third-party-agent-security-validation-2026/) と同じく、どの agent が作ったかより、PR に入る前後でどの検査を通すかが重要になる。

## まとめ

CodeQL 2.26.0 の system prompt injection query は、AI アプリ開発のセキュリティが、プロンプトの注意書きからコード検査へ進み始めたことを示している。system prompt、agent instruction、tool description は、モデルにとって信頼済みの実行文脈であり、ユーザー入力を安易に混ぜるべき場所ではない。

日本の開発チームは、AI アプリを特別扱いせず、SAST、PR required checks、security review、運用設定の中に入れるべきだ。CodeQL の新 query は万能ではないが、少なくとも「信頼できない値が信頼済み prompt 領域へ流れる」明確な失敗を早く見つける助けになる。AI 機能を増やすなら、モデル選定と同じくらい、prompt の信頼境界を検査する標準を作る必要がある。

## 出典

- [CodeQL 2.26.0 adds Kotlin 2.4.0 support and AI prompt injection detection](https://github.blog/changelog/2026-07-10-codeql-2-26-0-adds-kotlin-2-4-0-support-and-ai-prompt-injection-detection/) - GitHub Changelog, 2026-07-10
- [CodeQL 2.26.0 (2026-07-08)](https://codeql.github.com/docs/codeql-overview/codeql-changelog/codeql-cli-2.26.0/) - CodeQL documentation, 2026-07-08
- [System prompt injection](https://codeql.github.com/codeql-query-help/javascript/js-system-prompt-injection/) - CodeQL query help
