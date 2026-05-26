---
article: 'lovable-custom-mcp-cloud-health-2026'
level: 'child'
---

Lovableは、AIでアプリを作れるサービスです。2026年5月25日、LovableはCustom MCP serversを全プランで使えるようにしたと発表しました。5月24日には、Lovable Cloudのdatabase health checkも追加しています。

これは「新しいボタンが増えた」というだけの話ではありません。Lovableが、外部ツールの情報を読みながらアプリを作り、作った後のデータベースの状態もチャットで確認できる方向へ進んでいるということです。

## Custom MCP serversとは何か

MCPは、AIが外部ツールやデータに接続するための仕組みです。Lovableでは、Chat connectorsとしてMCP serverをつなげます。たとえば、Notion、Jira、Linear、Miroのようなツールの情報を、Lovable Agentがアプリ作成の文脈として使えるようになります。

今回の更新では、Custom MCP serversが全プランで使えるようになりました。つまり、標準の連携だけでなく、自社のAPIや内部ツールをLovableにつなげる道が広がります。

これは便利ですが、注意も必要です。AIが社内ツールを読めるということは、社内情報への入口が増えるということでもあります。[Amazon Quickのデスクトップ版](/blog/amazon-quick-desktop-free-plus-2026/)でも見たように、AIツールがMCPやローカル環境へつながるほど、どこまで許可するかを決める必要があります。

## Lovable MCP serverとは違う

名前が似ていますが、Chat connectorsとLovable MCP serverは違います。

Chat connectorsは、Lovableから外部ツールへ接続するためのものです。LovableがJiraやNotionなどの情報を読んで、アプリ作成に使うイメージです。

Lovable MCP serverは、外部のAIツールからLovableを操作するための研究プレビューです。Claude DesktopやCursorなどのMCP対応ツールから、Lovableのプロジェクトを見たり、作ったり、メッセージを送ったりする方向の仕組みです。

会社で使うなら、この2つを分けて考えることが大切です。前者は「Lovableが社内データを読む権限」、後者は「外部AIがLovableを操作する権限」です。

## database health checkで何ができるか

Lovable Cloud database health checkは、Lovable Cloudのデータベースの状態をチャットから確認する機能です。公式Changelogでは、接続数、メモリ、ディスク使用量、稼働時間などの状態を要約できると説明されています。

たとえば、アプリが遅いときに、クエリが遅いのか、接続が増えすぎているのか、メモリやディスクが足りないのかを切り分ける助けになります。

ただし、これは本格的な監視の代わりではありません。顧客向けアプリや個人情報を扱うアプリでは、ログ、バックアップ、権限管理、復旧手順も必要です。health checkは、問題が起きたときの最初の確認として使うのがよいです。

## 日本のチームが見るポイント

日本の開発チームやプロダクトチームは、まず誰がCustom MCP serverを追加できるかを決めるべきです。全員が自由に追加できると、知らないうちに社内データや顧客情報へAIがアクセスできる状態になるかもしれません。

次に、何を接続してよいかを決めます。公開情報、社内資料、顧客情報、ソースコード、個人情報は同じではありません。最初はテスト用のデータや、読み取りだけの接続から始めるのが安全です。

[Cursor Cloud Agentの環境管理](/blog/cursor-cloud-agent-dev-environments-2026/)でも、AIエージェントの実行環境や権限を管理する必要性がありました。Lovableでも同じです。AIがアプリを作る場所でも、接続先と権限の管理は必要になります。

## まとめ

Lovableの今回の更新は、AIアプリビルダーがより実務に近づいていることを示しています。Custom MCP serversで社内ツールにつながりやすくなり、database health checkで運用中の問題も見つけやすくなります。

一方で、便利になるほど管理も必要です。まずは小さな社内ツールで、承認済みのMCP serverだけを使い、テストデータから始める。DB診断の結果はチケットや運用記録に残す。そうすれば、Lovableを単なる試作ツールではなく、管理された開発の道具として使いやすくなります。

## 出典

- [Lovable changelog](https://docs.lovable.dev/changelog?page=1) - Lovable Documentation
- [Chat connectors (MCP)](https://docs.lovable.dev/integrations/mcp-servers) - Lovable Documentation
- [Lovable MCP server (research preview)](https://docs.lovable.dev/integrations/lovable-mcp-server) - Lovable Documentation
