---
title: 'Copilot strict marketplace、plugin統制の実務'
description: 'GitHub CopilotのstrictKnownMarketplacesを整理。日本企業がVS CodeとCLIのplugin導入を許可リスト化し、MCPやhooksをどう統制すべきか解説する。'
pubDate: '2026-06-26'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'VS Code', 'AIエージェント', '開発者ツール', '管理者設定', 'エンタープライズAI']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月25日**、GitHub Copilot の enterprise-managed settings に **`strictKnownMarketplaces`** を追加した。対象は VS Code と GitHub Copilot CLI で、企業が明示した plugin marketplace だけから plugin を導入できるようにする設定だ。

これは plugin 標準配布の小さな追加ではない。以前の [GitHub Copilot CLI企業管理、プラグイン標準配布の実務](/blog/github-copilot-cli-enterprise-plugins-2026/) や [Copilot VS Code管理plugin、IDE統制の実務](/blog/github-copilot-vscode-managed-plugins-2026/) では、企業が marketplace と自動インストール plugin を配れるようになったことを扱った。今回の更新は、その次の段階として「承認済み以外を入れない」運用に寄せるものだ。

日本の開発組織では、AI エージェントの plugin、MCP server、hooks、skills が増えるほど、便利さより先に「誰が何を許可したのか」を説明できる必要がある。今回の記事では、公式情報で確認できる事実と、企業導入で先に決めるべき実務を分けて整理する。

## 事実: 許可済みmarketplaceだけに絞れる

GitHub Changelog によると、`strictKnownMarketplaces` は VS Code と GitHub Copilot CLI の enterprise-managed settings で使える。企業管理者は、企業の `.github-private` リポジトリに置く `copilot/managed-settings.json` で、利用可能な plugin marketplace と自動インストール plugin を定義できる。

Docs では、この管理ファイルが `extraKnownMarketplaces`、`strictKnownMarketplaces`、`enabledPlugins` を top-level property として持つことが示されている。`extraKnownMarketplaces` は利用者に見せる追加 marketplace、`enabledPlugins` は全社で自動インストールする plugin、そして `strictKnownMarketplaces` は plugin 導入元を企業が明示した marketplace だけに制限する設定である。

ここで重要なのは、`strictKnownMarketplaces` が「推奨 marketplace の表示」ではなく、plugin installation の入口を絞る設定として説明されている点だ。GitHub repository 形式の marketplace だけでなく、git URL を指す marketplace も指定できる。つまり、社内 registry、信頼済み外部 registry、検証用 registry を分け、開発者が任意の marketplace から plugin を持ち込む状態を抑えられる。

設定は、対象ユーザーが次にサポート対象クライアントから認証したときに見える。これは即時のネットワーク遮断ではなく、Copilot の enterprise managed settings とクライアント認証に寄った制御だと読むべきだ。ローカル IDE の別経路、手動で入れた外部ツール、GitHub 上の cloud agent 設定まですべて同じ設定で覆うものではない。

## 既存のmanaged pluginsと何が違うのか

これまでの enterprise-managed plugins は、主に「企業標準を配る」機能として意味が大きかった。承認済み marketplace を追加し、社内 plugin、MCP configuration、hooks、custom agents、skills を配る。これにより、開発者ごとのばらつきを減らせる。

一方で、配れるだけでは統制として不十分なことがある。標準 plugin が自動で入っていても、開発者が別の marketplace から便利な plugin を追加できるなら、監査時には「標準は配ったが、非標準も混ざった」状態になる。`strictKnownMarketplaces` は、この抜け道を狭めるための設定として見るべきだ。

この違いは、日本企業の導入判断では大きい。SI、金融、製造、公共系の開発では、外部 plugin や MCP server がどのデータへ触るかを先に確認したい。承認済み marketplace だけに限定できれば、plugin 審査、棚卸し、更新レビュー、停止手順を registry 単位で設計しやすくなる。

ただし、これで AI エージェント統制が完了するわけではない。[GitHub Agent Finder、ARDで社内ツール発見へ](/blog/github-copilot-agent-finder-ard-2026/) で扱ったように、Copilot は必要な AI resource を見つける discovery layer も持ち始めている。標準配布、許可済み marketplace、発見可能 resource、実際に agent が呼べる MCP を別々に棚卸ししないと、どこで何を許したかが曖昧になる。

## 日本企業で効く運用シナリオ

第一に効くのは、開発基盤チームが Copilot CLI と VS Code の導入標準を持つケースだ。新しい開発者に「この marketplace から必要な plugin を入れてください」と説明するだけでは、後から個人ごとの差分が増える。`strictKnownMarketplaces` を使えば、少なくとも Copilot の管理対象クライアントでは、会社が認めた入口へ寄せられる。

第二に、委託開発やグループ会社を含む開発体制で有効だ。委託先が使う plugin を完全に禁止するのではなく、承認済み marketplace に載せたものだけを使ってもらう。これにより、開発速度を落としすぎずに、機密リポジトリ、顧客データ、チケット、障害ログへ触る plugin の審査を前提化できる。

第三に、MCP と hooks の管理で効く。MCP server は便利だが、リポジトリ、issue、secret scanning、依存関係、社内 SaaS へ接続する強い権限を持つことがある。[GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) のように安全側に使える一方、未審査の MCP を配ると新しい攻撃面にもなる。plugin marketplace を許可リスト化することは、MCP 接続面を棚卸しする入口になる。

第四に、事故時の切り戻しがしやすくなる。ある plugin に問題があったとき、全員の端末を個別に確認するより、承認済み marketplace から対象 plugin を外す、あるいは enabled plugin を止めるほうが説明しやすい。もちろん端末側の状態確認は残るが、少なくとも管理台帳と実際の配布入口を近づけられる。

## 先に決めるべき移行手順

最初にやるべきことは、いきなり `strictKnownMarketplaces` を全社で有効にすることではない。まず、現在使っている Copilot plugin、MCP server、hooks、custom agents、skills を棚卸しする。公式 marketplace、社内 repository、個人の実験用 repository、プロジェクト固有の plugin を分ける。

次に、承認済み marketplace を少数に絞る。社内標準の security plugin、基本 hooks、社内 MCP registry、開発ルール plugin だけを載せた marketplace から始めるのがよい。便利系 plugin や部署固有 agent は、企業全体ではなく organization や pilot team の範囲で検証する。

3つ目は、審査の責任者を決めることだ。`.github-private` の設定を変更できる人、marketplace repository の maintainer、MCP server の owner、plugin の更新レビュー担当、インシデント時の停止判断者を分けておく。ここが曖昧なまま許可リストだけ作ると、実際には誰も中身を見ない registry になりやすい。

4つ目は、例外運用だ。開発者が新しい plugin を試したいとき、どう申請し、どの sandbox で検証し、どの条件で承認済み marketplace に載せるのかを短く決める。禁止だけでは現場は回らない。重要なのは、個人実験を本番リポジトリへ直結させず、検証から承認までの道を用意することだ。

## MCP、hooks、Agent finderとの境界

`strictKnownMarketplaces` は plugin marketplace の入口を絞る設定であり、すべての agent capability を一括管理する魔法の設定ではない。MCP policy、AI Controls、cloud agent の設定、Copilot app、GitHub.com 上の agent session、IDE 独自の local agent 設定は、それぞれ効く範囲が違う。

特に Agent finder との関係は分けて見る必要がある。managed plugins は企業が配るもの、strict marketplace は導入元を絞るもの、Agent finder は必要な AI resource を探すものだ。社内では、標準で必ず入れる plugin、検索で見つけてよい resource、申請後に追加する high-risk resource を分けるべきである。

hooks も同じだ。危険コマンドの前に確認する hook、差分が大きいときにレビューを促す hook、secret scanning や dependency check を呼ぶ hook は有効だが、強制しすぎると開発体験を壊す。最初は停止系よりログ系を多めにし、本当に止めるべき操作だけ強制停止にするほうが現実的だ。

## まとめ

GitHub Copilot の `strictKnownMarketplaces` は、enterprise-managed plugins を「標準配布」から「許可済み入口への制限」へ進める更新だ。VS Code と Copilot CLI で、企業が明示した marketplace からだけ plugin を導入できるようにする。

日本企業が見るべきポイントは、新しい JSON property そのものではない。AI エージェントの plugin、MCP、hooks、skills を個人任せにせず、承認済み marketplace、審査責任者、例外申請、停止手順を持てるかである。

まずは全社展開ではなく、開発基盤チームや低リスクな repository で、承認済み marketplace 1つ、enabled plugin 数個、MCP registry 1つから始めるのがよい。Copilot の agent surface が増えるほど、便利な plugin を増やすより、どの入口を許すかを先に決める価値が大きくなる。

## 出典

- [Enterprise-managed settings now support strictKnownMarketplaces in VS Code and GitHub Copilot CLI](https://github.blog/changelog/2026-06-25-enterprise-managed-settings-now-support-strictknownmarketplaces-in-vs-code-and-the-cli) - GitHub Changelog, 2026-06-25
- [Configuring enterprise plugin standards](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [About enterprise-managed plugin standards](https://docs.github.com/en/copilot/concepts/agents/about-enterprise-plugin-standards) - GitHub Docs
