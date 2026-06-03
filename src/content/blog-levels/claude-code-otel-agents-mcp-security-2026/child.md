---
article: 'claude-code-otel-agents-mcp-security-2026'
level: 'child'
---

Claude Code `2.1.161` では、AIエージェントをチームで使うときに大事な修正がいくつか入りました。新しいモデルの発表ではありませんが、会社で使うなら見ておきたい内容です。

主なポイントは四つです。OpenTelemetry のメトリクスに custom labels を付けやすくなったこと、`claude agents` の進み具合が見やすくなったこと、MCP の設定表示で秘密情報が出にくくなったこと、並列ツール実行で一つの失敗が他の結果を巻き込まなくなったことです。

## 何が変わったのか

Claude Code は、コードを書くだけでなく、ファイルを読み、コマンドを実行し、外部ツールにつなぎ、複数の background agents を走らせることがあります。

今回の `2.1.161` では、`OTEL_RESOURCE_ATTRIBUTES` の値がメトリクスのラベルとして使われるようになりました。たとえば、team や repo のような情報を付けておけば、どのチームやリポジトリで Claude Code の利用が多いかを見やすくなります。

また、`claude agents` では、複数に分かれた作業の `done/total` が見やすくなりました。AIに複数の作業を任せると、どれが終わっていて、どれが長く止まっているのかを確認する必要があります。この表示改善は、運用では役に立ちます。

## なぜ会社利用で大事なのか

個人で使うなら、Claude Code が便利かどうかだけでも判断できます。しかし会社で使う場合は、誰がどれだけ使ったか、どのリポジトリで使ったか、費用をどこに配賦するか、ログをどう残すかが必要になります。

この点は、前に扱った [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) とつながります。Bedrock や Vertex などを通して使う場合、便利さだけでなく、会社の監査や請求の仕組みに合わせる必要があります。

さらに、[Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) のように、AIに長い作業を任せられるほど、作業の見える化が大切になります。作業が長くなるほど、途中で何が起きたのかを説明できる必要があるからです。

## MCP秘密情報の修正を見る

MCP は、Claude Code を外部ツールにつなぐ仕組みです。GitHub、社内API、チケット管理、DBなどにつながる可能性があります。

便利ですが、設定にアクセストークンや認証ヘッダーが含まれることがあります。今回の更新では、`claude mcp list`、`get`、`add` が terminal に secrets を出していた問題が修正されました。`${VAR}` は展開されず、credential headers や URL secrets は redacted されます。

これは、画面共有やログ保存の事故を減らすために重要です。ただし、これだけでMCPが安全になるわけではありません。誰がMCP serverを追加できるか、どの接続先を許すか、ログをどこに残すかは会社側で決める必要があります。

## チームが確認すること

まず、メトリクスのラベル名を決めましょう。`team`、`repo`、`environment` のように、少ない軸から始めるのが現実的です。チームごとに違う表記を使うと、あとから集計しにくくなります。

次に、MCP の確認コマンドを実際に試し、秘密情報が出ないことを確認します。あわせて、MCP server 名やURLをログに残してよいかも確認します。

最後に、background agents の止め方を決めます。[Claude CodeのPowerShellとMCP修正](/blog/claude-code-2149-powershell-mcp-2026/) でも見たように、AIコーディングツールではモデルだけでなく、コマンド、権限、作業場所の管理が大切です。

## まとめ

Claude Code `2.1.161` は、小さな運用修正に見えます。しかし、チームや repo ごとの利用把握、MCP秘密情報の保護、background agents の管理、並列実行の失敗分離は、会社でAIエージェントを使うための土台です。

日本の開発チームは、この更新をきっかけに、便利さだけでなく、ログ、費用、権限、停止手順を確認するとよいです。

## 出典

- [Claude Code Changelog](https://code.claude.com/docs/en/changelog) - Anthropic, 2026-06-02
- [Monitoring](https://code.claude.com/docs/en/monitoring-usage) - Claude Code Docs
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view) - Claude Code Docs
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) - Claude Code Docs
