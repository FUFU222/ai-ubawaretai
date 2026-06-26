---
article: 'github-copilot-strict-marketplaces-plugin-controls-2026'
level: 'expert'
---

GitHub Copilot の `strictKnownMarketplaces` は、enterprise-managed plugins の統制を一段進める更新として読むべきだ。2026年6月25日の GitHub Changelog では、VS Code と GitHub Copilot CLI の enterprise-managed settings が `strictKnownMarketplaces` をサポートし、企業が明示した marketplace だけから plugin を導入できるようになったと説明されている。

既存の [Copilot CLI企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/) と [Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/) は、企業が baseline standards として plugin marketplace と enabled plugin を配る話だった。今回の焦点は、配るだけではなく、導入元を許可リスト化できる点にある。

この差分は大きい。AI エージェントの plugin は、単なる拡張 UI ではない。custom agents、skills、hooks、MCP configuration を含み得る。つまり、plugin marketplace を開くことは、agent が利用できる能力、外部接続、実行前後の制御、社内ルールの読み込み経路を開くことに近い。

## 設定面で見るべき事実

GitHub Docs の手順では、企業の `.github-private` リポジトリに `copilot/managed-settings.json` を作る。従来の `.github/copilot/settings.json` も legacy path としてサポートされる。管理ファイルには、少なくとも `extraKnownMarketplaces`、`strictKnownMarketplaces`、`enabledPlugins` がある。

`extraKnownMarketplaces` は、ユーザーに追加で見せる marketplace を定義する。`enabledPlugins` は、`PLUGIN-NAME@MARKETPLACE-NAME` のキーで自動インストール対象を指定する。`strictKnownMarketplaces` は、plugin installation を企業が明示した marketplace に制限する。source は GitHub repository 形式だけでなく、git URL も扱える。

ここでの制御対象は、VS Code と GitHub Copilot CLI のサポート対象クライアントだ。したがって、GitHub.com 上の cloud agent、Copilot app、IDE 独自の local extension、開発者が直接動かす外部 MCP client を同じ設定で一括制御できると解釈してはいけない。

また、この機能は public preview であり、仕様変更の可能性がある。日本企業の本番標準に入れる場合は、まず pilot で反映タイミング、既存 plugin との衝突、認証し直し時の挙動、無効化時の戻り方を確認する必要がある。

## 配布統制から持ち込み統制へ

enterprise-managed plugins の初期価値は、標準配布だった。企業が社内の MCP configuration、hooks、security plugin、開発ルール、custom agent を配り、開発者の初期設定をそろえる。これはオンボーディングと再現性に効く。

しかし、標準配布だけでは「非標準の持ち込み」を止めにくい。ある開発者が外部 marketplace から便利な plugin を入れ、その plugin が repository、issue、terminal、browser、ticket、secret scanning 結果へ触るなら、企業標準が存在しても統制上の穴は残る。

`strictKnownMarketplaces` はこの穴を狭める。企業は「許可した marketplace からだけ plugin を入れる」という形で、plugin supply chain を registry 単位で扱える。これは npm や container image の registry 統制に近い。すべての package を手で審査するのではなく、どの registry を信頼するか、registry 内の更新をどう審査するか、問題時にどう止めるかを設計する。

開発基盤チームにとっては、plugin の配布台帳と実行面を近づける材料になる。情シスやセキュリティ部門にとっては、外部接続を持つ plugin の持ち込み経路を説明しやすくなる。現場開発者にとっては、何を使ってよいかを迷いにくくなる。

## MCPとhooksをどう扱うか

最も慎重に扱うべきなのは MCP と hooks だ。MCP server は、AI agent が外部ツールやデータソースに触る入口になる。GitHub、Jira、Datadog、Sentry、AWS、Google Workspace、社内文書検索、顧客管理システムのような接続先は、読み取りだけでも強い権限を持つ。

[GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱ったように、MCP はセキュリティ確認に使える。しかし、未審査の MCP を agent に渡すと、prompt injection、過剰権限、ログ残存、外部送信、誤操作のリスクも増える。plugin marketplace の許可リスト化は、MCP server をどの経路で配るかを管理するための入口になる。

hooks は、agent の tool use 前後に企業ルールを差し込める。危険な shell command の前に確認を挟む、外部 URL へのアクセス時にログを残す、差分が大きいときに human review を促す、secret scanning や dependency check を呼ぶ、といった運用が考えられる。

ただし hooks を重くしすぎると、agentic workflow の価値を壊す。実務では、初期 pilot ではログ系と警告系を中心にし、破壊的操作、本番 credential、外部送信、監査対象データへの接続だけを強制停止にする方が現実的だ。

## Agent finderとの境界

`strictKnownMarketplaces` と Agent finder は混同しない方がよい。[GitHub Agent Finder、ARDで社内ツール発見へ](/blog/github-copilot-agent-finder-ard-2026/) で整理した通り、Agent finder は MCP servers、skills、canvases、agents、tools などの AI resource を発見する discovery layer だ。

managed plugin は「企業が配るもの」、strict marketplace は「導入元を絞るもの」、Agent finder は「必要な resource を探すもの」である。ここを混ぜると、標準配布された plugin、検索で発見できる resource、実際に agent が呼べる tool の境界が曖昧になる。

推奨する台帳は、resource ごとに次の項目を持つ形だ。名前、種別、marketplace、owner、接続先、権限、対象 surface、利用可能 organization、対象 repository、ログ方針、更新日、検証日、停止手順、例外承認者。最初は spreadsheet でもよいが、最終的には `.github-private`、MCP registry、Agent finder registry、AI Controls の状態と照合できる形が望ましい。

## 日本企業の移行設計

日本企業で導入するなら、最初のゴールは「全社統一」ではなく「説明可能な最小標準」にするべきだ。すべての部署が同じ plugin を使う必要はない。だが、機密リポジトリ、顧客データ、委託開発、障害対応に関わる最低限の禁止事項と承認済み入口は統一した方がよい。

第一に、現状棚卸しを行う。開発者が使っている Copilot CLI plugin、VS Code plugin、MCP server、hooks、custom agents、skills、Agent finder registry を集める。個人実験、チーム標準、企業標準を分ける。

第二に、承認済み marketplace を設計する。企業全体の marketplace、部門別 marketplace、検証用 marketplace を分ける。検証用 marketplace から企業全体へ昇格する条件を決める。昇格条件には、権限レビュー、ログ確認、データ保持、依存関係、更新頻度、インシデント時の停止方法を含める。

第三に、`.github-private` の運用責任を明確にする。enterprise owner が設定を書けるとしても、実際の判断は開発基盤、AppSec、情シス、法務、主要事業部にまたがる。設定変更の pull request、レビューア、承認 SLA、緊急停止権限を決めるべきだ。

第四に、例外申請を軽くする。開発者が新しい plugin を使いたい場合、申請が重すぎると個人環境で回避される。sandbox repository、検証用 org、限定 marketplace、期限付き許可を用意し、良い plugin は承認済み marketplace へ取り込む。

第五に、監査レポートと結びつける。月次で、承認済み marketplace、enabled plugin、利用中 MCP、例外、停止した plugin、未解決リスクを一覧化する。Copilot の usage metrics や AI Credits レポートだけでは、plugin の権限や外部接続は見えない。費用と権限を別の表として扱う必要がある。

## 注意すべき誤解

一つ目の誤解は、`strictKnownMarketplaces` を入れれば未承認ツールがゼロになるというものだ。これは Copilot の管理対象クライアントに効く設定であり、OS 上の任意 CLI、ブラウザ拡張、別の AI coding tool、手動 MCP client までは覆わない。端末管理やネットワーク制御と組み合わせる必要がある。

二つ目は、marketplace を許可すれば中の plugin が全部安全だというものだ。registry は入口であり、plugin の更新、依存関係、接続先、権限は継続的に変わる。信頼済み marketplace でも、owner 変更や supply chain compromise は起こり得る。

三つ目は、AI エージェント統制をセキュリティ部門だけに任せることだ。plugin は開発体験そのものに影響する。強く縛りすぎると現場は使わなくなる。逆に緩すぎると監査に耐えない。開発基盤チームが developer experience と risk control の両方を見る必要がある。

## 実務チェックリスト

導入前には、まず対象 surface を分ける。VS Code、Copilot CLI、Copilot app、GitHub.com cloud agent、JetBrains、Visual Studio、Eclipse、mobile、API 経由の agent を並べ、今回の設定がどこに効くかを確認する。

次に、承認済み marketplace を決める。社内標準 marketplace は 1 つから始める。そこに、秘密情報検査、危険操作警告、基本 MCP registry、社内 coding guidance、レビュー支援 hook だけを載せる。

さらに、非標準 plugin の扱いを決める。申請先、検証環境、期限、承認者、拒否理由の記録、昇格条件を用意する。未承認 plugin をただ拒否するだけでは、現場の改善要求を拾えない。

最後に、教育資料を短く作る。開発者向けには「なぜ marketplace が絞られるのか」「どう申請するのか」「何がログに残るのか」を説明する。管理者向けには「どの JSON property が何を制御するのか」「停止時にどこを変えるのか」を説明する。

## まとめ

`strictKnownMarketplaces` は、GitHub Copilot の enterprise-managed plugins を標準配布から許可リスト型統制へ進める更新だ。VS Code と Copilot CLI の plugin 導入元を企業が明示した marketplace に制限できるため、AI agent の capability supply chain を管理しやすくなる。

ただし、これは Copilot 全体の統制を一発で完成させる設定ではない。MCP policy、Agent finder registry、cloud agent 設定、IDE local agent、端末管理、監査ログを別々に見なければならない。

日本企業では、まず小さな pilot で承認済み marketplace、enabled plugin、MCP registry、hooks、例外申請をセットで設計するのがよい。AI エージェントの生産性は、使える道具の多さだけでは決まらない。どの道具を、誰が、どの入口から、どの責任で使えるかを説明できる組織ほど、本番導入に進みやすい。

## 出典

- [Enterprise-managed settings now support strictKnownMarketplaces in VS Code and GitHub Copilot CLI](https://github.blog/changelog/2026-06-25-enterprise-managed-settings-now-support-strictknownmarketplaces-in-vs-code-and-the-cli) - GitHub Changelog, 2026-06-25
- [Configuring enterprise plugin standards](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [About enterprise-managed plugin standards](https://docs.github.com/en/copilot/concepts/agents/about-enterprise-plugin-standards) - GitHub Docs
