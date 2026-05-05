---
article: 'github-mcp-server-security-scanning-2026'
level: 'child'
---

GitHub が、GitHub MCP Server から使えるセキュリティ検査を強化しました。2026年5月5日に、secret scanning は一般提供になり、dependency scanning は公開プレビューになりました。

これは、AI エージェントにコードを書かせる前後で「秘密情報が混ざっていないか」「危ない依存関係を追加していないか」を確認しやすくする更新です。

## 何ができるようになったのか

secret scanning は、API キー、token、credential のような秘密情報がコードに入っていないかを見る機能です。GitHub MCP Server 経由で使うと、GitHub Copilot CLI や Visual Studio Code の Copilot Chat から、コミット前やプルリクエスト前に現在の変更を確認できます。

dependency scanning は、追加した依存関係に既知の脆弱性がないかを見る機能です。GitHub MCP Server の `dependabot` toolset として公開プレビューになりました。AI エージェントに「この branch で追加した依存関係を調べて」と頼むと、GitHub Advisory Database を使って、影響する package、重大度、直すべき version を返す仕組みです。

## なぜAIエージェントと関係があるのか

AI エージェントは、ただ質問に答えるだけではありません。最近は、issue を読み、コードを書き、依存関係を追加し、PR まで作ることがあります。便利ですが、そのぶんミスの影響も大きくなります。

たとえば、エージェントがサンプル設定を作るときに、うっかり token に見える値を入れるかもしれません。新しい library を入れるときに、脆弱性がある version を選ぶかもしれません。人間がレビューで気づければよいですが、毎回すべてを丁寧に見るのは大変です。

今回の更新は、その手前に検査を置くものです。エージェントが作業したあと、commit する前に「この変更を scan して」と聞けるようになるのがポイントです。

## 日本のチームではどう使うべきか

最初から全リポジトリで広く使うより、まずは対象を絞るのが現実的です。外部公開サービス、OSS 依存が多いサービス、API キー漏えいの影響が大きいリポジトリから試すとよいでしょう。

大事なのは、MCP Server の toolset を管理することです。MCP は AI に外部ツールを使わせるための仕組みなので、どの toolset を許可するかが権限設計になります。`dependabot` や secret protection 系の toolset は便利ですが、誰でも自由に使える状態にする前に、対象リポジトリ、承認ルール、ログの見方を決める必要があります。

## 注意点

この機能を入れても、セキュリティレビューが不要になるわけではありません。secret scanning は秘密情報の漏えいを減らしますが、社内だけで意味を持つ機密文字列をすべて理解するわけではありません。dependency scanning も既知の脆弱性には強いですが、ライセンスや保守状況までは別に見る必要があります。

つまり、AI エージェントに全部任せるための機能ではなく、エージェントが作業した内容を人間が安全にレビューしやすくする機能です。

## まとめ

GitHub MCP Server の security scanning 更新は、AI コーディングの実務にかなり近いニュースです。モデルが賢くなるだけでは、現場では足りません。AI が作った変更を commit する前に、秘密情報と依存関係を確認できることが重要です。

日本の開発チームは、まず小さなリポジトリで Copilot CLI や VS Code Copilot Chat から試し、MCP toolset の権限を決めるところから始めるのがよいと思います。

## 出典

- [Secret scanning with GitHub MCP Server is now generally available](https://github.blog/changelog/2026-05-05-secret-scanning-with-github-mcp-server-is-now-generally-available/) - GitHub Changelog, 2026-05-05
- [Dependency scanning with GitHub MCP Server is in public preview](https://github.blog/changelog/2026-05-05-dependency-scanning-with-github-mcp-server-is-in-public-preview/) - GitHub Changelog, 2026-05-05
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs
