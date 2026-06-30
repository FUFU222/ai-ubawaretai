---
article: 'claude-code-2196-org-default-mcp-security-2026'
level: 'child'
---

Claude Code 2.1.196 では、企業で使うときに大事な変更が入りました。1つは、管理者が組織の default model を設定できるようになったことです。ユーザーが自分でモデルを選んでいない場合、`/model` には `Org default` や `Role default` のように表示されます。

もう1つは MCP の安全化です。`claude mcp list` や `claude mcp get` を実行したとき、リポジトリに入っている設定ファイルだけで自己承認された MCP server を起動しないようになりました。信頼されていない workspace では、承認待ちとして扱われます。

## なぜ組織既定モデルが大事なのか

Claude Code では、作業に応じてモデルを選べます。これは便利ですが、会社で使うときは問題もあります。全員が好きなモデルを選ぶと、費用が読みにくくなります。どの作業でどのモデルを使ったかも説明しにくくなります。

組織既定モデルがあると、まず標準の出発点を決められます。たとえば、普段の調査や軽い修正は標準モデルを使い、難しい設計やセキュリティレビューだけ別モデルを許可する、といった運用がしやすくなります。

大事なのは、これが「高性能モデルを使わせないための機能」ではないことです。標準を決めることで、どこからが例外なのかを分かりやすくする機能です。

## MCPは何に注意するべきか

MCP は、Claude Code を外部ツールや社内システムにつなぐ仕組みです。GitHub、チケット管理、社内ドキュメント、監視ツールなどにつながれば、Claude Code はより多くの作業を手伝えます。

ただし、MCP server は外部サービスやローカル環境に触ることがあります。そのため、どの MCP server を使ってよいかを決めずに広げると危険です。特に、外部から clone したリポジトリに設定ファイルが入っている場合、その設定をどこまで信じるかを考える必要があります。

今回の修正は、一覧を見るような操作で未承認の MCP server が動き出すリスクを下げるものです。製品側の安全性は上がりますが、会社側で承認ルールを作ることも必要です。

## 管理者が決めること

まず、標準モデルを決める人を決めます。開発チームだけでなく、情シス、セキュリティ、AI 推進チーム、予算を見ている人も関係します。モデル選択は、性能だけでなく費用や監査にも関係するからです。

次に、設定の配り方を決めます。Claude Code には server-managed settings や endpoint-managed settings のように、管理者が設定を配る仕組みがあります。MCP についても、固定の `managed-mcp.json` を配る方法や、許可リスト、拒否リストを使う方法があります。

最後に、外部リポジトリを開くときのルールを決めます。承認待ちの MCP server が出たら誰が判断するのか、どこに記録するのかを決めておくと、現場が迷いにくくなります。

## まとめ

Claude Code 2.1.196 は、見た目には小さな更新です。しかし企業利用では、モデル選択と MCP 承認という重要な部分に関係します。

日本企業が見るべきポイントは、Claude Code を便利な個人ツールとしてだけ扱わないことです。標準モデル、管理設定、MCP の許可リスト、監査ログをセットで考えると、AI コーディングを会社の開発基盤として使いやすくなります。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-30
- [Configure server-managed settings](https://code.claude.com/docs/en/server-managed-settings) - Claude Code Docs, accessed 2026-06-30
- [Control MCP server access for your organization](https://code.claude.com/docs/en/managed-mcp) - Claude Code Docs, accessed 2026-06-30
- [Claude apps gateway for Amazon Bedrock, Google Cloud, and Microsoft Foundry](https://code.claude.com/docs/en/claude-apps-gateway) - Claude Code Docs, accessed 2026-06-30
