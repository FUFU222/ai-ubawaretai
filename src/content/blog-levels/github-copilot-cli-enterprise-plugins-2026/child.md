---
article: 'github-copilot-cli-enterprise-plugins-2026'
level: 'child'
---

GitHub Copilot CLI に、会社の管理者が plugin を配れるしくみが公開プレビューで入りました。難しく聞こえますが、要するに「みんなが同じ安全な設定で AI コーディングエージェントを使い始められるようにする機能」です。

これまでは、開発者が自分のパソコンで Copilot CLI を使うとき、便利な plugin や MCP server をそれぞれ入れる形になりがちでした。少人数ならそれでも動きます。しかし会社で使うと、「誰が何を入れているのか」「危ない設定が混ざっていないか」「新しく入った人にも同じ設定を配れるか」が問題になります。

## 何ができるようになったのか

今回の更新では、GitHub Copilot Business や Copilot Enterprise を使う会社の管理者が、Copilot CLI 向けの plugin marketplace と、自動で入れる plugin を設定できます。

設定は、会社用の `.github-private` リポジトリに置く `.github/copilot/settings.json` で行います。そこに「この marketplace を使ってよい」「この plugin は全員に入れる」と書いておくと、対象ユーザーが Copilot CLI にログインしたとき、その設定が反映されます。

これは、学校や会社で同じアプリを配るのに少し似ています。全員が好きな場所から勝手に入れるのではなく、管理者が確認したものを標準として配るわけです。

## なぜMCPやhooksが大事なのか

AI エージェントは、ただ文章を返すだけではありません。コードを読んだり、コマンドを実行したり、GitHub の情報を見たり、外部ツールを呼び出したりします。その外部ツールとつなぐしくみの 1 つが MCP です。

MCP は便利ですが、何でも自由につなぐと危険です。たとえば、秘密情報、社内リポジトリ、issue、依存関係情報などに触れる可能性があります。だから、会社として「この MCP server は使ってよい」「この plugin は使わない」と決めることが大事になります。

hooks も似ています。AI が何かを実行する前後に、確認やログ出力、セキュリティチェックを入れるためのしくみです。これを会社標準で配れれば、開発者ごとのばらつきを減らせます。

## 日本の開発チームではどう使うとよいか

最初は、全部の plugin を一気に配らないほうがよいです。まずは、次のような小さなセットから始めるのが現実的です。

1つ目は、秘密情報をチェックする plugin です。API キーやトークンが混ざっていないかを、コミット前に確認できます。

2つ目は、社内の開発ルールを教える agent や skill です。レビューの観点、テストの書き方、禁止している操作などを、全員に同じ形で配れます。

3つ目は、会社が認めた MCP server だけを使う設定です。便利だからといって外部ツールを増やしすぎると、あとで管理できなくなります。

## 気をつけること

この機能はまだ public preview です。つまり、今後仕様が変わる可能性があります。本番の全社標準にする前に、一部のチームで試すのが安全です。

また、`.github-private` の設定を誰が変更できるかも大切です。ここを誰でも触れるようにすると、会社全体の AI エージェント設定が勝手に変わってしまいます。開発基盤チームやセキュリティ担当が確認してから変える運用にしたほうがよいでしょう。

## まとめ

GitHub Copilot CLI の企業向け plugin 管理は、AI エージェントを会社で使いやすくするための機能です。個人がばらばらに設定するのではなく、会社が確認した plugin、MCP、hooks を標準として配れるようになります。

日本の開発チームでは、まず小さな pilot で試し、秘密情報チェック、社内ルール、許可済み MCP から始めるのがよいです。AI を自由に使わせるか禁止するかではなく、安全に使うための共通設定を作ることが、今回のポイントです。

## 出典

- [Enterprise-managed plugins in GitHub Copilot CLI are now in public preview](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/) - GitHub Changelog, 2026-05-06
- [Configuring enterprise plugin standards for Copilot CLI](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
