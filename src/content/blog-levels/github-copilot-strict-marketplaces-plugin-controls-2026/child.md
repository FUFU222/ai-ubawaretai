---
article: 'github-copilot-strict-marketplaces-plugin-controls-2026'
level: 'child'
---

GitHub は2026年6月25日、GitHub Copilot の企業管理設定に **`strictKnownMarketplaces`** を追加しました。これは、VS Code と GitHub Copilot CLI で、会社が認めた plugin marketplace だけから plugin を入れられるようにする設定です。

前に出た [Copilot CLI企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/) や [Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/) は、会社が標準 plugin を配る話でした。今回の更新は、その標準以外を入れにくくする話です。

## 何が変わるのか

GitHub Docs では、企業の `.github-private` リポジトリに `copilot/managed-settings.json` を置く手順が説明されています。この中で、`extraKnownMarketplaces`、`strictKnownMarketplaces`、`enabledPlugins` を設定できます。

`extraKnownMarketplaces` は、利用者に見せる追加 marketplace です。`enabledPlugins` は、全社に自動インストールする plugin です。`strictKnownMarketplaces` は、plugin を入れられる marketplace を会社が明示したものだけに制限します。

つまり、会社が「この marketplace は確認済み」と決めた入口だけを使わせやすくなります。AI エージェント用の plugin、MCP server、hooks、skills が増えている会社では、どこから入った拡張かを説明しやすくなります。

## なぜ日本企業に関係するのか

日本企業では、開発者が使うツールを完全に自由にするのが難しい場合があります。顧客情報、業務コード、障害ログ、チケット、社内ドキュメントを扱うからです。AI エージェントの plugin がそれらへ触るなら、便利かどうかだけでなく、誰が審査したかが重要になります。

`strictKnownMarketplaces` を使うと、少なくとも Copilot の管理対象クライアントでは、承認済み marketplace へ入口を寄せられます。委託先やグループ会社を含む開発でも、「この marketplace にある plugin だけを使う」という説明がしやすくなります。

ただし、これだけで全部の統制が終わるわけではありません。[GitHub Agent Finder](/blog/github-copilot-agent-finder-ard-2026/) のように、AI resource を探す仕組みもあります。MCP policy、cloud agent、IDE の設定、Copilot app の設定は別に確認する必要があります。

## 最初にやること

最初は、今使っている plugin と MCP server を一覧にします。社内で作ったもの、外部から入れたもの、個人が試しているものを分けます。

次に、承認済み marketplace を少数に絞ります。最初から便利 plugin を大量に入れるより、秘密情報チェック、危険操作の警告、社内標準の instructions、基本 hooks のような安全系から始める方が現実的です。

最後に、例外申請を決めます。新しい plugin を試したい人が、どこに申請し、どの sandbox で検証し、誰が承認すれば marketplace に載せられるのかを短く決めます。禁止だけでは現場は回りません。

## まとめ

`strictKnownMarketplaces` は、Copilot の plugin 導入を会社の許可済み入口に寄せる設定です。標準 plugin を配るだけでなく、未審査の marketplace からの持ち込みを抑えやすくなります。

日本の開発チームは、まず小さな pilot で、承認済み marketplace、必須 plugin、MCP registry、例外申請の流れを確認するのがよいです。AI エージェントの道具が増えるほど、使える道具の数より、許可する入口を説明できることが大切になります。

## 出典

- [Enterprise-managed settings now support strictKnownMarketplaces in VS Code and GitHub Copilot CLI](https://github.blog/changelog/2026-06-25-enterprise-managed-settings-now-support-strictknownmarketplaces-in-vs-code-and-the-cli) - GitHub Changelog, 2026-06-25
- [Configuring enterprise plugin standards](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [About enterprise-managed plugin standards](https://docs.github.com/en/copilot/concepts/agents/about-enterprise-plugin-standards) - GitHub Docs
