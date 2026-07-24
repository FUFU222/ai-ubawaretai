---
article: 'github-mcp-server-stateless-spec-2026'
level: 'child'
---

GitHub は、GitHub MCP Server が次の MCP 仕様に先に対応したと発表しました。MCP は、AI が外部ツールやデータに接続するための標準です。GitHub Copilot がリポジトリ、Issue、PR、セキュリティ機能などを扱うとき、その接続面として MCP が使われます。

今回のポイントは、MCP がより **stateless** な仕組みに変わることです。stateless とは、サーバー側が「前回の会話の続き」を protocol の session として持ち続けなくても、1回ごとの request で必要な情報を受け取って処理できる考え方です。

## 何が変わるのか

これまでの MCP では、client が最初に `initialize` を呼び、server が session id を返し、その session id を後の request でも使う流れがありました。大きな会社で複数の server instance を動かす場合、この session をどこに保存するか、同じ user を同じ server に送るかが問題になりやすくなります。

次の MCP 仕様では、protocol-level session がなくなります。request ごとに protocol version や client 情報が入り、どの server instance に届いても処理しやすくなります。GitHub MCP Server でも Redis session を外し、`initialize` に関連する database write や、毎回の database read を減らしたと説明されています。

これは、社内で MCP server を運用する会社にとって大事です。server を増やしたり、API gateway の後ろに置いたり、rate limit や監査ログを入れたりしやすくなるからです。

## なぜCopilot利用企業に関係するのか

GitHub Copilot は、ただコード補完をするだけの製品ではなくなっています。[GitHub Agent Finder](/blog/github-copilot-agent-finder-ard-2026/) のように、agent が必要な MCP server や skill を探す仕組みが出ています。[GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) では、secret scanning や dependency scanning を MCP 経由で使う話もありました。

つまり、MCP は「詳しい人だけが使う拡張」ではなく、AI agent が会社の開発ツールへ触れる入口になっています。入口が増えるほど、どの tool を使えるか、どの repository で許すか、どんなログを残すかが重要になります。

今回の仕様では、`Mcp-Method` や `Mcp-Name` のような header も重要になります。これにより、gateway や proxy が request body を深く読まなくても、どの method や tool が呼ばれているかを見やすくなります。社内の監査やセキュリティチームにとっては、ログ設計がしやすくなる可能性があります。

## 注意すべきこと

stateless になると運用は楽になりますが、それだけで安全になるわけではありません。MCP server は、AI に外部ツールを渡す場所です。GitHub、社内チケット、クラウド、顧客データ、CI などにつながる tool を渡せば、AI agent が触れる範囲も広がります。

そのため、日本企業では、まず read-only tool と write tool を分けるべきです。情報を見るだけの tool と、Issue を変更する、PR を作る、設定を変える tool ではリスクが違います。[GitHub Copilot Issue自動化](/blog/github-copilot-issue-agent-automation-controls-2026/) で扱った承認 UI と同じく、人間が確認しやすい仕組みは大事ですが、本当の権限境界は tool と permission で作る必要があります。

## 何から確認するべきか

最初に、社内で使っている MCP server の一覧を作ります。GitHub MCP Server、社内ツール用 MCP、ローカル MCP、個人が入れた MCP を分けます。次に、それぞれがどの client から使われているかを見ます。Copilot CLI、VS Code、JetBrains、社内 agent runner で更新タイミングが違うことがあるからです。

次に、session に依存している実装がないかを確認します。古い仕組みで user state や repository state を server 側 session に隠しているなら、短い handle や tool の引数として明示する形へ移す必要があります。

最後に、conformance tests を CI に入れることを検討します。MCP server は「動いた」だけでは不十分です。仕様に沿っているかを自動で確かめられれば、SDK 更新や protocol 移行で壊れにくくなります。

## まとめ

GitHub MCP Server の次期 MCP 仕様対応は、Copilot と外部ツールの接続を本番運用しやすくする更新です。日本企業は、MCP server を増やす前に、どの tool を許可するか、どこでログを取るか、session に隠していた状態をどう扱うかを確認するべきです。

## 出典

- [GitHub MCP Server supports the next MCP specification](https://github.blog/changelog/2026-07-23-github-mcp-server-supports-the-next-mcp-specification/) - GitHub Changelog, 2026-07-23
- [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) - Model Context Protocol Blog, 2026-05-21
- [Model Context Protocol draft specification](https://modelcontextprotocol.io/specification/draft) - Model Context Protocol
