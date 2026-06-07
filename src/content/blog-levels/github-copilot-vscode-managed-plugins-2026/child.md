---
article: 'github-copilot-vscode-managed-plugins-2026'
level: 'child'
---

GitHub Copilot の企業向け plugin 管理が、VS Code でも使える公開プレビューになりました。少し難しく聞こえますが、要するに「会社が認めた Copilot plugin や設定を、開発者の VS Code と Copilot CLI にそろえて配れるようになった」という話です。

以前このサイトでは [GitHub Copilot CLI の企業向け plugin 管理](/blog/github-copilot-cli-enterprise-plugins-2026/) を取り上げました。今回は、その仕組みが CLI だけでなく VS Code にも広がった点が新しいところです。

## 何が変わったのか

GitHub の発表によると、VS Code 1.122 が enterprise-managed plugins に対応しました。会社の管理者は `.github-private/.github/copilot/settings.json` という場所に設定を書きます。そこに「この plugin marketplace を使ってよい」「この plugin は自動で入れる」と書くと、対象ユーザーが VS Code や Copilot CLI にログインしたときに反映されます。

対象になるのは、Copilot Business や Copilot Enterprise を enterprise account 経由で使っているユーザーです。個人が勝手に何でも入れるのではなく、会社として確認した plugin を標準にしやすくなります。

## なぜVS Code対応が大事なのか

CLI だけを管理できても、実際の開発では足りないことがあります。多くの開発者は、日常の編集、Copilot Chat、agent mode、MCP、terminal 操作を VS Code の中で使います。つまり、AI エージェントを本当に使う場所は IDE です。

もし CLI では安全な plugin が入っているのに、VS Code では別の設定になっていると、会社として説明しにくくなります。逆に VS Code と CLI の両方で同じ最低限の plugin や hooks を配れれば、新しく入った人も同じ設定から始められます。

この点は [Copilot app のキャンバス機能](/blog/github-copilot-app-canvases-agent-work-2026/) ともつながります。AI エージェントの作業場所が増えるほど、「どこで何を許すか」をそろえる必要が出てきます。

## MCPとhooksに注意する

plugin 管理で特に大事なのは MCP と hooks です。

MCP は、AI エージェントが外部ツールやデータにアクセスするための仕組みです。便利ですが、社内リポジトリ、issue、秘密情報、依存関係、社内ツールなどに触れる入口にもなります。だから、会社として「この MCP server は使ってよい」「これは使わない」と決める必要があります。

hooks は、AI が何かを実行する前後に確認やチェックを入れる仕組みです。たとえば、危ないコマンドを止める、秘密情報が混ざっていないか確認する、大きすぎる変更ではレビューを促す、といった使い方ができます。

ただし、何でも止めればよいわけではありません。確認が多すぎると、開発者は使いにくく感じます。最初は、本当に止めたい危険操作と、最低限のセキュリティ確認に絞るのがよいです。

## 日本企業での始め方

最初から全社展開するより、小さな pilot から始めるのが現実的です。

まず、`.github-private` の設定を誰が管理するかを決めます。開発基盤チーム、セキュリティ担当、情シスが確認してから変更する形が安全です。

次に、標準で入れる plugin を少なく絞ります。秘密情報チェック、社内ルールを教える skill、承認済み MCP registry への誘導など、最低限のものから始めます。

そして、VS Code と Copilot CLI の両方で同じように反映されるかを確認します。設定を変えたとき、ユーザー側でどう見えるか、失敗したときに戻せるかも見ておくべきです。

## 気をつけたい境界

GitHub Docs では、VS Code で動く local agents は GitHub 側で完全に管理されるものではなく、IDE 側の設定として扱われると説明されています。つまり、「GitHub の AI Controls を入れたから全部大丈夫」と考えるのは危険です。

VS Code、Copilot CLI、cloud agent、MCP server は似ていますが、管理できる場所が少しずつ違います。会社では、どの機能をどこで管理するのかを一覧にしておくと、あとから困りにくくなります。

## まとめ

Copilot の VS Code 管理 plugin は、AI コーディングエージェントを会社で安全に使うための配布機能です。CLI だけでなく IDE にも標準を配れるようになることで、開発者ごとの設定のばらつきを減らせます。

日本の開発チームでは、まず小さく試し、承認済み plugin、MCP、hooks を少数だけ標準化するのがよいです。大事なのは、AI を自由に使わせるか禁止するかではなく、会社として説明できる使い方にそろえることです。

## 出典

- [Enterprise-managed plugins in VS Code in public preview](https://github.blog/changelog/2026-06-05-enterprise-managed-plugins-in-vs-code-in-public-preview/) - GitHub Changelog, 2026-06-05
- [Configuring enterprise plugin standards for Copilot CLI](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/agents/enterprise-management) - GitHub Docs
