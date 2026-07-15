---
article: 'github-copilot-visual-studio-mcp-usage-cpp-2026'
level: 'child'
---

GitHub CopilotのVisual Studio向け更新では、MCP、使用量通知、C++ modernization agentが大きなポイントです。むずかしく聞こえますが、まとめると「AIに何をつなげてよいか」「どれくらい使っているか」「古いC++コードをどう直すか」を、Visual Studioの中で扱いやすくする更新です。

## MCP trustは接続前の確認

MCPは、AIが外部ツールやデータにアクセスするための仕組みです。たとえば、リポジトリ情報、社内ツール、セキュリティ検査、ドキュメントなどをAIが見られるようにできます。

便利ですが、何でもつなげてよいわけではありません。知らないMCP serverを信頼すると、AIが余計な情報を読んだり、望まない操作をしたりする可能性があります。今回のVisual Studio更新では、MCP serverを使う前に信頼するか確認する流れが入っています。

会社で使うなら、個人ごとに判断するより、開発基盤チームが「使ってよいMCP server一覧」を決めるほうが安全です。

## 使用量通知は費用管理につながる

GitHub Copilotは、チャットやエージェント機能を多く使うとAI Creditsを消費します。これは、席数だけで費用が決まる普通のSaaSとは少し違います。同じ人数でも、軽く補完を使うチームと、長いエージェント作業を多く走らせるチームでは、使う量が変わります。

Visual Studioにusage notificationが出ると、開発者は作業中に使用量を意識しやすくなります。ただし、通知だけで十分ではありません。会社側では、誰にどれくらいの上限を渡すか、上限に近づいたらどうするかを決める必要があります。

## C++ modernization agentは古いコードの見直しに使う

C++ modernization agentは、古いC++コードをより新しい書き方へ直す支援をする機能です。日本の製造業、組込み、金融システム、ゲーム開発などでは、長く使われているC++コードが多く残っています。

ただし、AIの提案をそのまま採用してはいけません。C++では、性能、メモリ、安全性、既存ライブラリとの互換性が大切です。まずは小さく、テストがある部分から試し、人間がレビューする形が安全です。

## 日本のチームが見るべきこと

今回の更新は、Visual Studioを使う開発チームにとって、AI機能を本番運用へ近づけるものです。

確認すべきことは4つあります。

1つ目は、社内のVisual Studioで本当に使えるかです。標準端末やVDIでは、発表された機能がすぐ見えないことがあります。

2つ目は、使ってよいMCP serverを決めることです。

3つ目は、Copilotの使用量と予算上限を決めることです。

4つ目は、C++ modernization agentをどのコードから試すか決めることです。

## まとめ

CopilotのVisual Studio更新は、AIを便利にするだけでなく、会社で安全に使うための管理にも関係しています。MCP trust、使用量通知、C++ modernization agentを別々に見るのではなく、Visual Studioを使う開発環境全体のルールとして考えることが大切です。

## 出典

- [GitHub Copilot in Visual Studio - June update](https://github.blog/changelog/2026-07-14-github-copilot-in-visual-studio-june-update/) - GitHub Changelog, 2026-07-14
- [Visual Studio 2026 release notes](https://learn.microsoft.com/en-us/visualstudio/releases/2026/release-notes) - Microsoft Learn, accessed 2026-07-15
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs, accessed 2026-07-15
