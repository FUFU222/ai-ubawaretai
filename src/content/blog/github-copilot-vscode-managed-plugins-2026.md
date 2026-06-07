---
title: 'Copilot VS Code管理plugin、IDE統制の実務'
description: 'Copilot VS Code管理plugin公開プレビューを整理。日本企業がCLIとIDEをまたぐ標準配布、MCP、hooks、AI Controlsの境界をどう設計するかを解説する。'
pubDate: '2026-06-07'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'VS Code', 'AIエージェント', '開発者ツール', 'エンタープライズAI']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月5日**、GitHub Copilot の **enterprise-managed plugins** が VS Code でも公開プレビューになったと発表した。5月に Copilot CLI 向けに始まった企業管理 plugin 標準が、VS Code 1.122 のクライアントにも広がった形だ。

これは「VS Code に plugin が入った」というだけの話ではない。GitHub は、企業が `.github-private/.github/copilot/settings.json` に定義した baseline standards を、対象ユーザーの Copilot CLI と VS Code client の両方へ適用できると説明している。つまり、AI コーディングエージェントの配布と統制が、CLI 単体から IDE まで広がり始めた。

日本の開発組織では、以前整理した [GitHub Copilot CLI企業管理、プラグイン標準配布の実務](/blog/github-copilot-cli-enterprise-plugins-2026/) の続編として読むのが自然だ。さらに [Copilot appキャンバス、agent作業の見える化](/blog/github-copilot-app-canvases-agent-work-2026/) や [GitHub Copilot設定監査API、agent統制の要点](/blog/github-copilot-cloud-agent-config-audit-api-2026/) と合わせると、GitHub は「作業面」「配布面」「監査面」を少しずつそろえている。

## 事実: VS Code 1.122が企業管理plugin標準を読む

今回の GitHub Changelog は、先月 Copilot CLI 向けに出した enterprise-managed plugins の公開プレビューを前提にしている。VS Code 1.122 がこの enterprise-managed capability をサポートし、企業が設定した baseline standards が Copilot CLI と VS Code client の両方に適用される、という説明だ。

対象は Copilot Business または Copilot Enterprise のライセンスを enterprise account 経由で受けているユーザーだ。管理者は `.github-private` リポジトリ内の `.github/copilot/settings.json` に plugin marketplace と自動インストール対象 plugin を定義する。ユーザーが VS Code または Copilot CLI から認証すると、クライアントが設定を取得して適用する。

Docs 側の手順では、`settings.json` の主要な top-level property は `extraKnownMarketplaces` と `enabledPlugins` だ。`extraKnownMarketplaces` は追加で認める plugin marketplace を定義し、`enabledPlugins` は `PLUGIN-NAME@MARKETPLACE-NAME` 形式で自動インストール対象を指定する。

ここまでの事実だけを見ると、配布機能の拡張に見える。しかし GitHub は Changelog で、plugin が custom agents、skills、hooks、MCP configurations の共有や常時有効化にも使えると説明している。ここが実務上の本題だ。

## CLI標準からIDE標準へ広がる意味

5月の Copilot CLI 向け公開プレビューでは、企業管理者が CLI ユーザーに承認済み marketplace と enabled plugin を配れることが中心だった。今回 VS Code が加わることで、同じ標準が開発者の主作業面である IDE にも届く。

日本企業では、CLI だけを標準化しても不十分なことが多い。開発者は VS Code で Copilot Chat、agent mode、MCP、terminal、browser testing を使い、必要に応じて CLI や GitHub.com の cloud agent に移る。ここで IDE と CLI の plugin 標準が別々だと、同じ会社の中で agent の能力や制約がずれる。

たとえば CLI では秘密情報検査 plugin を標準配布しているのに、VS Code 側では別の MCP server を自由に追加できる状態だと、統制の説明が難しい。逆に VS Code 側だけに便利な agent skill を入れても、CLI で長時間タスクを走らせると同じ手順が効かない。今回の更新は、その分断を縮める材料になる。

この流れは、[GitHub Copilot CLI刷新、定期実行と音声入力の運用点](/blog/github-copilot-cli-scheduling-voice-rubber-duck-2026/) で見たような CLI の自動化にも関係する。CLI が定期実行や長時間作業を担い、VS Code が日常の編集とレビューを担うなら、両方で同じ最低限の plugin と hooks が入ることはかなり重要だ。

## MCPとhooksは便利機能ではなく権限境界

今回の更新で慎重に扱うべきなのは MCP と hooks だ。

MCP は、AI エージェントが外部ツールやデータソースを呼ぶための接続面である。GitHub Docs は、enterprise owner が AI Controls の MCP policies を通じて、MCP server の利用可否、MCP registry、利用可能な外部ツールを制御できると説明している。さらに private MCP registry は Copilot CLI と IDE には適用されるが、GitHub 上で動く cloud agent には別の設定経路がある。

この違いは現場で重要だ。VS Code、Copilot CLI、cloud agent、Copilot app はすべて「Copilot」と呼ばれるが、MCP や agent 管理の効き方は同じではない。管理者は「GitHub の AI Controls で全部管理できる」と雑に理解すると危ない。特に Docs は、Visual Studio Code で動く local agents は GitHub では管理されず、IDE 側の機能と設定で扱われると明記している。

hooks も同じだ。plugin 経由で hooks を標準配布できるなら、危険コマンドの前に止める、外部アクセス時に確認する、差分が大きいときにレビューを促す、secret scanning や dependency check を呼ぶといった使い方ができる。一方で、hooks を過剰に入れると agentic workflow の速度は落ちる。

実務では、MCP と hooks を「便利な拡張」ではなく「権限境界」として棚卸しするべきだ。誰がどの marketplace を承認するのか。どの MCP server は企業標準で配るのか。どの hooks は強制停止で、どの hooks はログだけにするのか。この整理なしに自動インストールだけ始めると、統制が強まるどころか、責任の所在が見えにくくなる。

## 日本企業が最初に設計すべきこと

最初に決めるべきなのは、`.github-private` の owner だ。enterprise owner が操作できるとしても、内容は開発基盤、セキュリティ、情シス、法務、主要開発部門にまたがる。plugin は agent の能力そのものを変えるため、通常の拡張機能配布より影響が大きい。

次に、IDE と CLI を同じ台帳で管理することだ。VS Code 用、CLI 用、cloud agent 用に別々の表を作ると、後から整合しなくなる。少なくとも、承認済み marketplace、enabled plugin、MCP server、hooks、対象 surface、owner、更新日、検証状況を同じ形式で持つべきだ。

3つ目は、public preview の扱いを決めることだ。今回の機能は公開プレビューであり、仕様や挙動は変わり得る。いきなり全社標準にせず、内製基盤チームや低リスクなプロダクトで pilot し、VS Code 認証時の反映、CLI との整合、plugin 更新時の挙動、設定を戻したときのユーザー体験を確認するほうがよい。

4つ目は、ユーザーへの説明だ。自動インストールは便利だが、開発者から見ると「いつの間にか plugin が入っている」状態にもなる。なぜこの plugin が入るのか、何を止めるのか、どこまでログを残すのか、個人が追加してよい MCP は何かを短く説明する必要がある。

## 急がなくてよいこと

今回の更新を見て、すぐ全 plugin を統一しようとする必要はない。むしろ、最初は小さく絞るべきだ。

標準配布に向いているのは、秘密情報検査、危険操作警告、社内標準 instructions、承認済み MCP registry への誘導のような最低限の安全系だ。便利系の agent や部署固有の skill は、enterprise 全体ではなく organization や repository に寄せたほうがよい場合がある。

また、この更新はモデル課金やモデル廃止の話とは分けて見るべきだ。GitHub Copilot では [Copilot大文脈と推論設定、AI Credits運用基準](/blog/github-copilot-context-reasoning-ai-credits-2026/) のようにモデル選択とコスト管理の論点も増えている。しかし plugin 標準は「どのモデルで推論するか」ではなく「agent にどの能力とルールを持たせるか」の問題だ。モデルポリシー、MCP ポリシー、plugin ポリシー、hooks は別レイヤーとして管理したほうがよい。

## まとめ

Copilot VS Code の enterprise-managed plugins 公開プレビューは、GitHub Copilot の企業運用が CLI から IDE へ広がったことを示す更新だ。`.github-private/.github/copilot/settings.json` に定義した marketplace と enabled plugin を、Copilot Business / Enterprise の VS Code と Copilot CLI clients に適用できる。

日本企業が見るべきポイントは、便利な plugin の数ではない。CLI と IDE をまたぐ標準配布、MCP と hooks の権限境界、AI Controls と local agents の管理範囲の違い、そして `.github-private` の運用責任だ。

まずは pilot で、承認済み marketplace 1 つ、enabled plugin 2、3 個、最低限の MCP registry と hooks から始めるのが現実的だ。Copilot の agent surface が増えるほど、個人任せの設定ではなく、企業が説明できる標準配布に寄せる価値は大きくなる。

## 出典

- [Enterprise-managed plugins in VS Code in public preview](https://github.blog/changelog/2026-06-05-enterprise-managed-plugins-in-vs-code-in-public-preview/) - GitHub Changelog, 2026-06-05
- [Configuring enterprise plugin standards for Copilot CLI](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/agents/enterprise-management) - GitHub Docs
- [Visual Studio Code 1.122](https://code.visualstudio.com/updates/v1_122) - Visual Studio Code
