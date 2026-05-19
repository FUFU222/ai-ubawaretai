---
article: 'github-copilot-cloud-agent-config-audit-api-2026'
level: 'child'
---

GitHubは**2026年5月18日**、Copilot cloud agentのリポジトリ設定をREST APIで確認できる新しいAPIを公開プレビューにした。名前は「Get Copilot cloud agent configuration for a repository」で、リポジトリごとにcloud agentがどんな設定で動くのかを調べられる。

簡単に言うと、これは「Copilot agentを使ってよい状態になっているか」を一覧で確認するためのAPIだ。GitHubの発表では、MCP server設定、enabled tools、GitHub Actions workflowの承認ポリシー、firewall設定を返すと説明されている。

## 何を確認できるのか

GitHub Docsでは、`GET /repos/{owner}/{repo}/copilot/cloud-agent/configuration`というendpointが示されている。返される例には、`mcp_configuration`、`enabled_tools`、`require_actions_workflow_approval`、`is_firewall_enabled`、`custom_allowlist`などが含まれる。

MCP server設定は、agentがどんな外部ツールやデータに接続できるかに関わる。enabled toolsは、CodeQL、Copilot code review、secret scanning、dependency vulnerability checksのような検証が有効かどうかを見る項目だ。Actions workflow承認やfirewallは、agentが作った変更や実行環境をどこまで制限しているかを見るために重要になる。

つまり、このAPIは新しいチャット機能ではない。管理者が「このリポジトリのCopilot cloud agentは安全に使える設定か」を確認するためのものだ。

## なぜ大事なのか

2026年5月13日には、Copilot cloud agentをREST APIから起動できるAgent tasks APIも公開プレビューになった。社内ポータルや自動化スクリプトからagentタスクを起動できるようになると便利だが、そのぶん「どの設定で動くのか」を確認する必要も増える。

たとえば、あるリポジトリではMCP serverが設定されていて、別のリポジトリでは設定されていないとする。あるリポジトリではsecret scanningが有効で、別のリポジトリでは無効かもしれない。画面を一つずつ見る運用では、こうした差を見落としやすい。

設定監査APIを使えば、複数のリポジトリを定期的にチェックして、標準から外れた設定を見つけやすくなる。日本の開発チームでは、事業部や子会社ごとにGitHubの運用が分かれていることも多い。だからこそ、APIで棚卸しできる意味は大きい。

## 最初に見るべきポイント

まず見るべきなのはMCP設定だ。MCPはagentが外部のツールやデータへ接続する仕組みなので、接続先が増えるほど便利になる一方、管理も難しくなる。承認されたMCP serverだけを使っているか、古い試験設定が残っていないかを確認したい。

次に見るべきなのは検証ツールだ。CodeQL、secret scanning、dependency vulnerability checksなどが有効なら、agentが作った変更をレビューしやすくなる。無効な場合は、なぜ無効なのか、どのレビューで補うのかを決めておく必要がある。

Actions workflowの承認とfirewall設定も大事だ。agentが作った変更でworkflowが走る場合、承認なしで危ない処理が動かないようにする必要がある。firewall設定は、agentの実行環境がどこへ通信できるかを見るための材料になる。

## まとめ

GitHub Copilot設定監査APIは、派手な機能ではないが、企業導入では重要な更新だ。Copilot cloud agentを起動するAPIが増えるほど、設定を確認するAPIも必要になる。

日本の開発組織では、まず少数のリポジトリでこのAPIを使い、MCP、検証ツール、Actions承認、firewallを一覧化するとよい。設定が見えるようになれば、どのリポジトリからcloud agent利用を広げてよいか判断しやすくなる。

## 出典

- [Audit repository Copilot cloud agent configuration via the REST API](https://github.blog/changelog/2026-05-18-audit-repository-copilot-cloud-agent-configuration-via-the-rest-api/) - GitHub Changelog, 2026-05-18
- [REST API endpoints for Copilot cloud agent repository management](https://docs.github.com/en/rest/copilot/copilot-cloud-agent-management) - GitHub Docs
- [Start Copilot cloud agent tasks via the REST API](https://github.blog/changelog/2026-05-13-start-copilot-cloud-agent-tasks-via-the-rest-api/) - GitHub Changelog, 2026-05-13
