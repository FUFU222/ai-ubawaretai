---
article: 'github-copilot-team-managed-settings-2026'
level: 'child'
---

GitHub Copilotで、会社の管理者がteamごとに一部の設定を変えられるようになりました。発表日は2026年8月3日です。対象は enterprise managed settings という仕組みで、会社がCopilotの標準設定をまとめて配るためのものです。

これまでは、全員に同じ設定を配る考え方が中心でした。今回の更新では、全社の標準を残したまま、特定のenterprise teamだけ設定を変えられます。たとえば、通常の開発チームには安全寄りの標準設定を配り、AI推進チームやセキュリティチームだけに追加のモデル選択やpluginを試させる、という使い方ができます。

## 何が変わるのか

管理者は、まず `copilot/managed-settings.json` に全社の標準設定を書きます。ここで「teamが変えてよい項目」を `overridable` として指定します。teamが変えてよいと指定されていない項目は、全社設定のままです。

次に、`copilot/team-mappings.json` で、どのteamにどの設定ファイルを使わせるかを結びつけます。実際のteam別設定は `copilot/teams/` の下に置きます。これにより、1つの標準設定を守りながら、teamごとの例外を管理できます。

重要なのは、何でも自由に変えられるわけではないことです。GitHub Docsでは、モデルの扱いやbypass permissionの扱いなど、team別に上書きできる項目が説明されています。また、pluginやmarketplaceは、全社の基本設定にteam別の追加分を重ねる考え方です。

## なぜ日本企業に関係するのか

日本企業では、同じGitHub環境の中に、社員、委託先、複数部署、セキュリティ担当、開発基盤担当が混ざることがあります。全員に同じCopilot設定を配ると、必要な人には制限が強すぎ、逆に不要な人には権限が広すぎることがあります。

team別設定を使うと、役割に合わせた調整がしやすくなります。たとえば、開発基盤チームは新しいpluginを検証する。セキュリティチームは特定のreview toolを使う。通常開発チームは安全な標準設定をそのまま使う。このように分けられます。

ただし、teamのメンバー管理が大事になります。異動した人、退職した人、契約が終わった委託先がteamに残っていると、意図しない設定が残ります。Copilotの設定だけでなく、GitHub teamの棚卸しも必要です。

## 最初にやること

まず、どの項目をteamが変えてよいかを少なくします。最初から多くの例外を作ると、あとで説明できなくなります。モデル選択やbypass permissionなど、目的がはっきりしている項目から始めるのが現実的です。

次に、例外を渡すteamを1つか2つに絞ります。AI推進チーム、セキュリティチーム、開発基盤チームなど、利用目的と責任者が明確なteamが向いています。teamごとに「なぜ標準設定と違う必要があるのか」を短く書いておきます。

最後に、設定変更をpull requestで管理します。誰が、どのteamに、どの設定を、いつまで許すのかを残します。これにより、あとから監査や費用確認をするときに説明しやすくなります。

## 注意する点

複数のteamに所属する人は、より緩い設定の影響を受ける可能性があります。たとえば、普段は通常開発チームにいる人が、AI推進チームにも入っている場合、その人だけ特別な設定を得るかもしれません。兼務者は必ず確認するべきです。

また、pluginやmarketplaceを増やすと便利になりますが、外部のコードや設定を使う経路も増えます。誰がpluginを管理するのか、private repositoryに誰がアクセスできるのか、不要になったpluginをいつ外すのかを決めておく必要があります。

## まとめ

GitHub Copilotのteam managed settingsは、全社の標準を守りつつ、必要なteamだけに例外を渡すための機能です。日本企業では、部門別のAI利用、委託先管理、plugin検証、費用管理に関係します。

大切なのは、設定を細かくすることそのものではありません。team台帳、責任者、承認、棚卸し、ロールバックを一緒に決めることです。小さなpilotから始め、問題があればすぐ戻せる状態で試すのが安全です。

## 出典

- [Enterprise team specialization for managed settings](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/) - GitHub Changelog, 2026-08-03
- [Enterprise managed settings reference](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/enterprise-managed-settings-reference) - GitHub Docs
- [Configuring enterprise-managed settings](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings) - GitHub Docs
