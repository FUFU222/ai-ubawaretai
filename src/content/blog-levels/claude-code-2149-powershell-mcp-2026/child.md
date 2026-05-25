---
article: 'claude-code-2149-powershell-mcp-2026'
level: 'child'
---

Anthropic の Claude Code changelog では、**2026年5月23日** の `2.1.150` は内部インフラ改善で、利用者向けの変更はありません。実際に開発チームが確認すべきなのは、前日の **2026年5月22日** に出た `2.1.149` です。

この更新では、Claude Code の `/usage` が消費内訳を見やすくし、Enterprise 向けに cloud MCP connector をまとめて扱う管理設定が追加されました。さらに、PowerShell の作業ディレクトリ変更をめぐる権限境界や、git worktree の sandbox allowlist に関する修正も入っています。

つまり今回の話は、新しい AI モデルの性能ではありません。Claude Code が、どの shell で、どの directory を見て、どの MCP server や plugin を使い、どれくらい usage を消費しているかを、会社としてどう管理するかという話です。

## 何が変わったのか

一つ目は、`/usage` の表示です。Claude Code では、skills、subagents、plugins、MCP server など、いろいろな拡張を使えます。便利ですが、チーム利用では「どの使い方が上限を押し上げているのか」が分かりにくくなります。今回の更新で、usage limit の原因をカテゴリごとに見やすくする方向になりました。

二つ目は、Enterprise 管理設定です。`allowAllClaudeAiMcps` という managed setting が追加され、claude.ai 側の cloud MCP connectors を `managed-mcp.json` と一緒に扱えるようになりました。MCP は AI が外部ツールやデータに接続するための仕組みです。便利な一方で、どの connector を使ってよいかを会社が決める必要があります。

三つ目は、PowerShell と sandbox の修正です。公式 changelog では、PowerShell の `cd` 系の built-in function によって作業ディレクトリ変更が検知されず、あとから workspace 外を読める可能性があった問題が修正されたと説明されています。git worktree の write allowlist が広すぎた問題も修正されています。

## なぜWindows環境で大事なのか

日本の会社では、開発者全員が macOS や Linux だけを使っているわけではありません。Windows PC、VDI、PowerShell、Git Bash、Windows runner、Azure DevOps、社内 CI が混ざることはよくあります。

AI コーディングツールは、コマンドを提案して実行します。そのとき、ツールが「今どの directory にいるか」を正しく理解していないと、ユーザーが想定していない場所のファイルを読む可能性があります。たとえば、同じ端末に別プロジェクト、顧客資料、credential cache、社内設定ファイルがある場合、workspace 外読み取りは小さな問題ではありません。

だから、Claude Code を使っているチームは、まず Windows と PowerShell を通る経路を確認するべきです。個人端末だけでなく、CI、社内 runner、委託先端末、共用開発環境も対象にします。

## MCP管理も同じくらい大事

MCP は、AI に外部ツールを使わせるための接続面です。GitHub、Jira、Confluence、Slack、社内 API、DWH、ローカルファイルなどにつなげると、Claude Code は単なるチャットではなく、作業環境に近づきます。

ただし、接続先が増えるほど、権限管理は難しくなります。誰がどの MCP を使えるのか。社外 SaaS connector を許すのか。個人が入れた MCP と会社が承認した MCP をどう分けるのか。ログはどこに残るのか。こうした点を決めずに広げると、便利さよりも統制の難しさが先に出ます。

今回の `allowAllClaudeAiMcps` は、そうした管理の入口に関係します。会社で Claude Code を標準化するなら、MCP の利用ルールも標準化する必要があります。

## まず確認すること

最初に、Claude Code のバージョンを確認します。特に Windows 端末、PowerShell を使う CI、worktree を使う開発環境を優先します。`2.1.149` 以降へ更新できているか、固定バージョンのまま残っていないかを見ます。

次に、PowerShell 実行の許可ルールを確認します。どの command を自動承認しているか、wildcard rule が広すぎないか、作業ディレクトリ変更を含む command をどう扱っているかを見直します。

さらに、MCP を棚卸しします。`managed-mcp.json` にあるもの、cloud MCP connectors、個人が追加した MCP、plugin 経由で入った MCP を分けます。顧客データやソースコードへ触る MCP は、特に慎重に扱います。

## まとめ

Claude Code `2.1.149` は、派手な新機能の更新ではありません。しかし、企業で AI コーディングツールを安全に使ううえでは重要です。PowerShell、worktree、MCP、usage breakdown は、すべて「AI がどこまで触れるか」を決める部品だからです。

日本の開発組織は、今回の更新をきっかけに、Windows 混在環境、CI、worktree、MCP、費用管理をまとめて点検するのがよいです。Claude Code を個人の便利ツールから組織の開発基盤へ広げるなら、モデルの賢さだけでなく、実行環境の境界を管理する必要があります。

## 出典

- [Claude Code Changelog](https://code.claude.com/docs/en/changelog) - Claude Code Docs, 2026-05-23 / 2026-05-22
- [anthropics/claude-code CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) - GitHub
- [@anthropic-ai/claude-code 2.1.149 package metadata](https://security.snyk.io/package/npm/%40anthropic-ai%2Fclaude-code/2.1.149) - Snyk, 2026-05-22
- [Major Updates in Claude Code v2.1.149 to v2.1.150](https://dev.classmethod.jp/en/articles/20260524-claude-code-updates-v2-1-150/) - DevelopersIO, 2026-05-24
