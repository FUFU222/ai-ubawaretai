---
article: 'github-copilot-code-review-skills-mcp-ga-2026'
level: 'child'
---

GitHubは**2026年7月29日**、Copilot code reviewで**Agent skillsとMCPを一般提供**にした。これにより、Copilot code reviewはpull requestの差分を見るだけでなく、repositoryに用意されたskillsやMCP serverを使って、レビューに必要な文脈を取り込めるようになる。

簡単に言うと、レビューAIに「この種類のPRではこの観点を見て」「必要ならこの読み取り専用ツールで確認して」と指示しやすくなった。これは[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/)や[Copilot code review、AGENTS.mdでPR規約を反映](/blog/github-copilot-code-review-agents-md-2026/)の次の段階である。

## 何が変わったのか

1つ目は、Agent skillsがCopilot code reviewで使えるようになったことだ。Agent skillは、AI agent向けの手順書のようなものだ。たとえば「UI変更ではスクリーンショットを確認する」「認可変更では権限昇格を確認する」「DB migrationではrollback手順を見る」といったレビュー観点をまとめられる。

2つ目は、MCP serverをレビューで使えることだ。MCPは、Copilotが外部ツールや追加文脈へ接続するための仕組みである。GitHubの発表では、GitHub MCP serverとPlaywright MCP serverが全リポジトリで既定有効になる。UI変更ならPlaywrightで画面を確認し、GitHub MCPで関連issueを見るような使い方が考えられる。

3つ目は、すでにCopilot coding agentでMCPを設定しているrepositoryでは、そのMCPがCopilot code reviewにも適用される点だ。cloud agent用の設定だと思っていたものが、PRレビューにも広がる可能性がある。

## read-onlyでも確認は必要

GitHubは、Copilot code reviewでのMCP tool callはread-onlyだと説明している。つまり、PRレビュー中に外部システムを書き換えたり、issueを勝手に変更したりするものではない。

ただし、read-onlyなら何でも安全というわけではない。読み取りだけでも、顧客名、社内URL、障害情報、脆弱性の詳細、未公開仕様を取得できる場合がある。AIレビューに外部文脈を読ませるなら、どのMCPが何を読めるかを管理者が説明できる状態にしておく必要がある。

この点は、[Copilot app独立policy、既定有効を管理する方法](/blog/github-copilot-app-policy-managed-settings-2026/)で扱ったmanaged settingsや、[Copilotセッション監査API、EMU企業の導入設計](/blog/github-copilot-agent-session-streaming-api-2026/)で扱ったsession記録ともつながる。

## 日本企業が最初にやること

まず、Copilot code reviewを使っているrepositoryを一覧にする。どのrepositoryでレビューAIを使い、どのteamが管理し、人間reviewerがどこまで最終確認するかを整理する。

次に、Agent skillsを棚卸しする。skillsがあるなら、誰が管理しているか、どのPRに効くか、古い手順が残っていないかを見る。AIに渡す手順が古いと、レビューコメントも古くなる。

最後に、MCP serverを確認する。GitHub MCP、Playwright MCP、社内MCPを分け、それぞれ何を読めるか、secretを使うか、ログがどこに残るかを確認する。cloud agent用MCPがあるrepositoryでは、code reviewにも使われる前提で見直す。

## まとめ

今回の一般提供で、Copilot code reviewはPR差分だけを見るレビューAIから、skillsとMCPを使って周辺文脈を確認するレビュー基盤へ近づいた。

日本の開発チームは、まず小さく試すのがよい。1つの非機密repositoryでAgent skillを作り、Playwright MCPやGitHub MCPの使われ方を確認し、人間reviewerと結果を比べる。そのうえで、read-onlyの範囲、監査ログ、費用、secret管理を整えてから広げるべきだ。

## 出典

- [Copilot code review: Agent skills and MCP now generally available](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/) - GitHub Changelog, 2026-07-29
- [Configure MCP servers for your repository](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers) - GitHub Docs
- [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) - GitHub Docs
