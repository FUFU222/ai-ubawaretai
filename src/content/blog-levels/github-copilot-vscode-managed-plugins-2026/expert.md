---
article: 'github-copilot-vscode-managed-plugins-2026'
level: 'expert'
---

GitHub Copilot の enterprise-managed plugins が VS Code に広がったことは、GitHub の agentic coding 戦略を読むうえでかなり重要だ。5月の時点では、企業管理者が Copilot CLI 向けに plugin marketplace と enabled plugin を配れる、という話だった。2026年6月5日の Changelog では、VS Code 1.122 もこの enterprise-managed capability をサポートし、企業の baseline standards が Copilot CLI と VS Code clients の両方に適用されると説明された。

この差分は小さくない。CLI は長時間タスク、自動化、remote control、定期実行に強い。一方、VS Code は日常の編集、レビュー、terminal、browser、agent mode、MCP 利用が集まる作業面だ。両方に同じ plugin 標準を配れるなら、Copilot は個人の AI 補助から、企業が設定し、配布し、説明する開発基盤に近づく。

この更新は、単独で読むよりシリーズの流れで見るべきだ。[GitHub Copilot CLI企業管理、プラグイン標準配布の実務](/blog/github-copilot-cli-enterprise-plugins-2026/) では CLI 向けの標準配布を扱った。[GitHub Copilot設定監査API、agent統制の要点](/blog/github-copilot-cloud-agent-config-audit-api-2026/) では cloud agent 設定を棚卸しする API を扱った。[Copilot appキャンバス、agent作業の見える化](/blog/github-copilot-app-canvases-agent-work-2026/) では、人間が agent 作業をレビューする画面の話を扱った。今回の VS Code 対応は、その中で「開発者の端末上の標準配布」を IDE まで広げる部品だ。

## 事実関係: settings.jsonをCLIとVS Codeが読む

GitHub Changelog の事実は明確だ。先月の Copilot CLI 向け public preview で、enterprise administrators は Copilot CLI users に plugin を configure and distribute できるようになった。今回 VS Code release version 1.122 がその enterprise-managed capability を追加し、企業が設定した baseline standards がすべてのユーザーの Copilot CLI と VS Code clients に適用される。

設定点は `.github-private/.github/copilot/settings.json` だ。GitHub Docs では、enterprise owners が enterprise の `.github-private` repository にある `.github/copilot/` directory へ `settings.json` を作成または編集する手順が示されている。top-level property は主に 2 つで、`extraKnownMarketplaces` が追加 plugin marketplace、`enabledPlugins` が自動インストールする plugin を表す。

`extraKnownMarketplaces` は、marketplace 名ごとに source provider と repository を定義する。Docs の例では provider は `github`、repository は `OWNER/REPO` 形式だ。`enabledPlugins` は `PLUGIN-NAME@MARKETPLACE-NAME` を key にして `true` を指定する。変更を `.github-private` の default branch に push すると、対象ユーザーは次回認証時に marketplace と pre-installed plugins を見る。

今回の Changelog は、VS Code と Copilot CLI の両方がこの settings を automatically pull and apply すると説明している。ここが今回の新しさだ。企業標準が「CLI にだけ入る設定」から、「IDE と CLI のクライアント標準」に拡張された。

## pluginは能力配布であり、拡張機能配布だけではない

enterprise-managed plugins を普通の IDE extension 配布と同じものとして扱うと見誤る。GitHub は、plugins support many extensibility types と説明している。具体的には、custom agents、skills の共有、developer onboarding の短縮、hooks、MCP configurations の常時有効化が挙げられている。

custom agents は、特定の役割、手順、利用ツール、対象タスクを持つ agent profile に近い。skills は、組織の作業手順や専門知識を agent に渡す単位になる。hooks は tool call の前後や session lifecycle に介入する。MCP configuration は agent がどの外部能力やデータソースへアクセスできるかを決める。

つまり enterprise-managed plugins は、開発者の画面に便利ボタンを増やすだけではない。agent が何を知り、何を呼び、どこで止まり、どんな確認を走らせるかを企業が配る仕組みになる。これは endpoint management、developer environment management、security baseline の交点にある。

日本企業で問題になるのもここだ。個人が勝手に plugin を増やすことを完全に禁止すると、現場の探索は止まる。しかし自由にすると、AI がどの toolset で作業したのか説明しにくい。enterprise-managed plugins は、最低限の標準を会社側で配り、それ以外の探索余地を organization や repository、個人設定に分けるための土台として使える。

## IDEとCLIで標準が分かれるリスク

今回 VS Code が対応したことで、逆に見えるリスクもある。企業が Copilot CLI だけを管理対象として見ていた場合、VS Code 側の agent 利用が抜け落ちる。

たとえば CLI では社内 marketplace だけを許し、secret scanning 補助 plugin と危険コマンド確認 hook を標準配布しているとする。一方で VS Code 側では、開発者が個別に MCP server を追加し、agent mode で terminal や repository を触っている。この状態では「Copilot の企業標準を配った」とは言い切れない。標準が効く surface と効かない surface が混在するからだ。

逆もある。VS Code では社内 agent skill が整っているのに、Copilot CLI の長時間タスクや [GitHub Copilot CLI刷新、定期実行と音声入力の運用点](/blog/github-copilot-cli-scheduling-voice-rubber-duck-2026/) で扱った scheduled prompts では同じ skill が入らない。開発者は同じ Copilot と認識していても、実際には agent の能力とガードレールが違う。

この差分は、監査時に問題になりやすい。AI が出したコードや設定変更に問題があったとき、「どの標準 plugin が入っていたか」「どの MCP registry を使ったか」「どの hooks が効いていたか」を説明する必要がある。CLI と IDE で基準が違うと、説明の粒度が落ちる。

## AI Controlsとlocal agentsの境界を誤解しない

今回の記事で最も注意したいのは、GitHub の AI Controls と VS Code local agents の境界だ。

GitHub Docs の Agent management for enterprises は、AI Controls view を、enterprise の AI policies と agents を管理・監視する中央面として説明している。Agents page では Copilot cloud agent、custom agents、agent sessions、third-party agents などを扱う。MCP servers についても、enterprise owners が dedicated MCP policies を通じて利用可否、MCP registry、外部 tools を制御できる。

一方で同じ Docs は、Visual Studio Code で動く local agents は GitHub では管理されず、IDE 側の機能と設定で扱われると明記している。この一文は実務上かなり重い。VS Code 上の agent 体験は GitHub Copilot の一部として使われるが、すべてが GitHub の central controls に吸い込まれるわけではない。

さらに、private MCP registries は Copilot CLI と IDEs には適用されるが、GitHub で動く Copilot cloud agent には別の構成経路がある。cloud agent では repository level の MCP configuration や enterprise level の custom agent profiles で扱う。つまり、MCP ひとつを見ても、CLI、IDE、cloud agent で管理経路が分かれる。

日本企業がやるべきなのは、「GitHub の管理画面で全部見る」でも「VS Code は端末管理だけで見る」でもない。Copilot surface ごとに、どの管理面が効くかを表にすることだ。VS Code client settings、Copilot CLI enterprise plugin standards、AI Controls、MCP policies、repository-level cloud agent config、endpoint management を並べて、重複と抜けを確認する必要がある。

## MCPは許可リストと実行ログの両方で見る

MCP は AI agent の権限境界である。GitHub MCP Server だけでも、issues、pull requests、code search、secret protection、Dependabot、repository operations などへ到達できる。社内 MCP server を足せば、チケット管理、ログ、CI、デプロイ、社内ドキュメント、顧客対応システムまで広がる。

そのため、VS Code と CLI の両方に plugin 標準を配れることは、MCP の許可リストを整えるうえで価値がある。承認済み marketplace と enabled plugin を定め、private MCP registry を使わせることで、少なくとも「どの入口を公式に認めているか」は説明しやすくなる。

ただし、それだけでは足りない。MCP server が提供する toolset の粒度、repository scope、credential の扱い、ログの残り方、個人設定の上書き可否まで見ないと、実際のリスクは分からない。標準配布は入口の制御であって、実行時の完全な証跡ではない。

日本の大企業では、まず MCP server を 3 分類するとよい。1つ目は企業標準で配るもの。たとえば GitHub 公式や社内で検証済みのセキュリティ確認系だ。2つ目は organization または repository ごとに許すもの。業務固有のチケットやドキュメント連携がここに入る。3つ目は個人検証のみで、本番 repository では使わないものだ。この分類を settings.json、AI Controls、開発者ガイドに反映する。

## hooksは強制停止と観測を分ける

hooks は強力だが、扱いを間違えると開発体験を壊す。enterprise-managed plugins で hooks を常時有効化できるなら、企業としては多くのチェックを入れたくなる。しかし agentic workflow は連続実行が価値なので、確認が多すぎるとユーザーは迂回する。

設計の基本は、強制停止する hooks と観測だけの hooks を分けることだ。

強制停止に向くのは、秘密情報を含む可能性が高いファイルの外部送信、production branch への直接操作、未承認 domain へのアクセス、削除系コマンド、認可されていない credential の読み取りなどだ。ここは false negative のほうが危険なので、多少の確認コストを受け入れやすい。

観測に向くのは、テスト未実行、差分の大きさ、依存関係 update、長時間セッション、コストが高いモデル利用、同じエラーの反復などだ。毎回止めるより、PR コメントや session summary、監査ログに出したほうが現場に受け入れられる。

この設計は [Copilot Actions修復、CI失敗対応を個人開発へ拡張](/blog/github-copilot-actions-fix-agent-pro-2026/) のような自動修復系ともつながる。AI が CI 失敗を直すなら、便利さの裏で「どこまで自動修正してよいか」「どの失敗は人間へ戻すか」を hooks や policy に落とす必要がある。

## モデル・課金・pluginを混ぜない

最近の GitHub Copilot は、AI Credits、model picker、large context、reasoning level、individual plan の agent entry point など、同時に多くの更新が出ている。そのため、管理者はすべてを「Copilot 設定」としてひとまとめにしがちだ。

しかし、モデル管理、課金管理、plugin 管理、MCP 管理、hooks 管理は別レイヤーだ。

モデル管理は、どの model provider や model family を使うか、BYOK を認めるか、コストと性能をどう選ぶかの問題だ。課金管理は、AI Credits、budget、usage report、premium request の問題だ。plugin 管理は、agent にどの拡張能力を持たせるかの問題だ。MCP 管理は、外部 tool と data source への到達範囲だ。hooks 管理は、agent の実行前後で何を止め、何を記録するかだ。

[Copilot大文脈と推論設定、AI Credits運用基準](/blog/github-copilot-context-reasoning-ai-credits-2026/) で扱ったように、モデルとコストの設計はすでに複雑になっている。そこへ plugin と MCP を混ぜると、現場は理解できない。運用ドキュメントでは、少なくとも「モデル」「接続」「自動実行」「ログ」「費用」を別セクションに分けるべきだ。

## 導入順序: まず台帳、その次にsettings.json

日本企業がこの機能を試すなら、最初に settings.json を書くより先に台帳を作るべきだ。

台帳には、plugin 名、marketplace、owner、対象 surface、含まれる MCP server、含まれる hooks、触るデータ、必要 credential、ログの有無、更新手順、緊急停止方法を書く。すでに開発者が使っている非公式 plugin や MCP server も集め、承認、保留、禁止に分ける。

次に、pilot 用の marketplace を 1 つだけ用意する。最初から複数 marketplace を認めると、問題発生時に切り分けが難しい。社内で検証済みの plugin を置き、`extraKnownMarketplaces` に登録する。`enabledPlugins` には、秘密情報検査、社内標準 instructions、危険操作確認 hook など、最低限のものだけを入れる。

3つ目に、VS Code と CLI の両方で反映を検証する。ユーザーが認証したタイミングで何が起きるか、既存 plugin と競合しないか、設定を戻したときにどう見えるか、plugin install に失敗したときのエラーは理解できるかを確認する。公開プレビューでは、この運用検証が仕様理解と同じくらい重要だ。

4つ目に、AI Controls と MCP policies の表と突き合わせる。settings.json で配った plugin が参照する MCP server が、enterprise の MCP policy と矛盾していないかを見る。cloud agent 側に同じ MCP を使わせる必要があるなら、repository-level config や custom agent profile も別途確認する。

5つ目に、開発者向け説明を短く作る。どの plugin が自動で入るか、何が禁止されるか、個人が追加してよいものは何か、困ったときに誰へ聞くかを 1 ページにまとめる。標準配布は説明なしに進めると、開発者から見ると突然の制限に見える。

## どこまで全社標準にするか

enterprise-managed plugins は、全社一律に使うほど効果が大きいが、やりすぎると現場差分を潰す。日本企業では、金融、公共、組み込み、研究開発、Web サービス、社内業務システムでリスク許容度が違う。全員に同じ agent と同じ MCP を強制するのは現実的ではない。

全社標準に向くのは、低レイヤーの安全系だ。秘密情報検査、危険操作警告、承認済み marketplace、基本的な社内 instructions などである。業務別 agent、部署固有 skill、特定 SaaS 連携 MCP は、organization または repository 単位に寄せたほうがよい。

この分け方をしないと、plugin 標準はすぐ肥大化する。最初は便利でも、半年後には誰も使わない agent や古い hooks が残り、開発者体験を悪化させる。台帳に最終利用日、owner、削除判断日を入れておくとよい。

## まとめ

Copilot VS Code の enterprise-managed plugins 対応は、GitHub Copilot の企業管理が CLI から IDE へ広がる重要な更新だ。`.github-private/.github/copilot/settings.json` に定義した plugin marketplace と enabled plugin を、Copilot Business / Enterprise の VS Code と Copilot CLI clients が取得して適用する。

この更新の本質は、plugin 配布ではなく agent 能力の標準配布にある。custom agents、skills、hooks、MCP configurations は、開発者の生産性だけでなく、情報セキュリティ、監査、再現性、コスト、オンボーディングに関わる。

日本企業が今やるべきことは、すぐ全社展開することではない。まず Copilot surface ごとの管理境界を表にし、plugin / MCP / hooks の台帳を作り、小さな pilot で VS Code と CLI の反映を確認することだ。GitHub の agent 面が増えるほど、個人任せの設定ではなく、会社が説明できる標準配布へ寄せる必要がある。

## 出典

- [Enterprise-managed plugins in VS Code in public preview](https://github.blog/changelog/2026-06-05-enterprise-managed-plugins-in-vs-code-in-public-preview/) - GitHub Changelog, 2026-06-05
- [Configuring enterprise plugin standards for Copilot CLI](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/agents/enterprise-management) - GitHub Docs
- [Visual Studio Code 1.122](https://code.visualstudio.com/updates/v1_122) - Visual Studio Code
