---
article: 'github-copilot-agent-finder-ard-2026'
level: 'child'
---

GitHub は2026年6月17日、GitHub Copilot の **Agent finder** を出しました。これは、Copilot が仕事に必要な MCP server、skill、canvas、agent、tool を探しやすくする機能です。

たとえば、開発者が「この障害調査に必要な observability tool を使いたい」と説明すると、Agent finder は登録された AI resource の中から候補を探します。GitHub の公開 catalog を使うことも、会社が用意した private registry を使うこともできます。

これは [Copilot appキャンバス](/blog/github-copilot-app-canvases-agent-work-2026/) のように agent の作業を見える化する話とは少し違います。Agent finder は、agent がどの道具を見つけられるかを扱う機能です。

## ARDとは何か

Agent finder は **Agentic Resource Discovery、ARD** という仕様を使っています。ARD は、AI agent が tools、skills、agents を見つけるための仕組みです。

これまで、AI agent に外部 tool を使わせるには、人間が先に MCP server の URL を設定したり、skill を入れたりする必要がありました。少数ならそれでよいですが、会社の中に多数の tool や agent が増えると管理が難しくなります。

ARD では、提供者が `ai-catalog.json` のような catalog を公開し、registry がそれを検索できるようにします。agent は registry に「こういう仕事をしたい」と問い合わせ、候補を見つけます。つまり、最初から全部を agent に持たせるのではなく、必要なときに探す考え方です。

## 何が便利になるのか

一番分かりやすい利点は、agent に大量の tool 説明を最初から渡さなくてよいことです。使うか分からない tool を全部 context に入れると、無駄が多く、間違った tool を選ぶ可能性もあります。

Agent finder では、自然文のタスクから候補を探します。GitHub は、候補が rank 付きで返り、Copilot が必要に応じて読み込めると説明しています。ただし、見つけたものを勝手に install する機能ではありません。ここは重要です。

日本企業では、この「発見」と「導入」を分けられる点が実務的です。開発者は便利な resource を見つけられますが、実際に使う前に、管理者や AppSec が確認できます。

## 会社で使うときの注意点

最初に決めるべきなのは、どの registry を使うかです。公開 catalog を自由に探すと、便利な反面、会社が承認していない tool も見える可能性があります。業務 repository では、まず会社が管理する private registry から始める方が安全です。

次に、誰が resource を登録できるかを決めます。MCP server は外部 API や社内 system に触れることがあります。skill は agent の振る舞いを変えます。agent profile は作業の進め方を変えます。どれも単なる便利メモではなく、権限を持つ設定として扱うべきです。

既存の [Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/) ともつながります。会社が標準で配る plugin と、Agent finder で探す resource を分けないと、現場はどれを使えばよいか分からなくなります。

## MCPとの関係

MCP は agent が tool を呼ぶための仕組みです。Agent finder は、その MCP server を探すための入口になり得ます。つまり、MCP は「呼び出す」、ARD は「探す」と考えると分かりやすいです。

ただし、MCP server は強い権限を持つことがあります。issue tracker を読む、cloud console を見る、observability data を取る、ticket を作る、社内 document を検索する、ということが起こり得ます。[GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱ったように、agent に tool を渡す前には、秘密情報や依存関係、接続先を確認する必要があります。

Agent finder で MCP server が見つかりやすくなるなら、なおさら登録時の審査が重要になります。便利な server を見つけることと、本番業務で使ってよいことは別です。

## どう始めるとよいか

最初は小さな範囲で試すのがよいです。たとえば、開発基盤チームだけで private registry を作り、CI 失敗調査、依存関係更新、ドキュメント更新、release note 作成のような低リスクな task に絞ります。

次に、resource ごとに owner を決めます。誰が管理しているのか、何ができるのか、どの repository で使えるのか、どんなデータを読むのか、いつ見直すのかを記録します。

さらに、ログを残します。誰が何を探し、どの resource を使い、どの agent session で動いたかを追えるようにします。[Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) のような設定棚卸しと合わせると、後から説明しやすくなります。

Agent finder は、Copilot に道具を増やす機能ではなく、道具を探す方法を管理する機能です。日本企業で使うなら、まず private registry、承認済み resource、owner、ログを用意し、発見できる範囲を狭く始めるのが安全です。

## 出典

- [Agent finder for GitHub Copilot now available](https://github.blog/changelog/2026-06-17-agent-finder-for-github-copilot-now-available/) - GitHub Changelog, 2026-06-17
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) - Google Developers Blog, 2026-06-17
- [Agentic Resource Discovery: Let agents search for tools, skills, and other agents](https://huggingface.co/blog/agentic-resource-discovery-launch) - Hugging Face, 2026-06-17
- [Agentic Resource Discovery specification](https://github.com/ards-project/ard-spec) - ards-project
