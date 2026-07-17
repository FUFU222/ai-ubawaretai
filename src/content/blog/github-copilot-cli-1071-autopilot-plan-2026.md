---
title: 'Copilot CLI 1.0.71、Planと自律実行の安全線'
description: 'Copilot CLI 1.0.71のAutopilot停止、Plan modeの変更ブロック、LSP sandbox、MCP/plugin管理を整理。日本企業がCLI agentを安全に更新する確認点を解説する。'
pubDate: '2026-07-17'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'AIエージェント', '開発者ツール', '管理者設定', 'セキュリティ', '企業導入']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月16日**、GitHub Copilot CLI **1.0.71**を公開した。大きな見出しになりやすい新モデル追加ではないが、実務上はかなり重要な更新である。`copilot -p --autopilot` の停止条件、Plan mode中の変更ブロック、LSP file readとrename editへのsandbox policy適用、MCP tool list更新、plugin marketplace操作など、CLI agentを社内運用する時に問題になりやすい境界がまとめて締められた。

これは[Copilot CLIセッション上限](/blog/github-copilot-cli-ai-credit-session-limits-2026/)のような費用ガードレールだけでは埋まらない領域だ。費用を止めても、計画中に編集が混ざる、背景プロセスが残る、MCP toolの状態が古い、LSPが想定外のfileを読む、といった問題は別に起きる。さらに[Copilot CLI遠隔操作](/blog/github-copilot-cli-remote-control-ga-2026/)や[Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)で扱ったように、CLIは個人端末の便利ツールから、企業が配布・監査するagent runtimeへ近づいている。

日本の開発チームにとって今回の焦点は、「最新版へ上げれば便利になる」ではない。Autopilot、Plan mode、LSP、MCP、plugin marketplaceを、どの権限境界で使わせるかを再確認する更新である。

## 事実: AutopilotとPlan modeの境界が変わった

Release 1.0.71で最初に見るべきなのは、`copilot -p --autopilot` がbackground shellやagentの生存によってhangし続けないようになった点だ。GitHubは、plainな `-p` と同じく `COPILOT_TASK_WAIT_TIMEOUT_SECONDS` timeoutを尊重するようになったと説明している。

Autopilotは、人間の承認待ちを減らしてtask completionを進めるためのモードである。GitHub Docsも、Copilot CLIが自律的に作業できるようにする概念としてAutopilotを説明している。だが、自律実行を許すほど、終了条件は重要になる。背景でshellやsubagentが残ったままturnが終わらなければ、非対話run、scheduler、CI連携、社内wrapperでは「まだ動いているのか、止まるべきなのか」を判断しにくい。

今回の修正は、Autopilotを常に安全にするものではない。timeoutを尊重するようになった、という範囲で見るべきだ。長時間のtest、migration、build、外部API呼び出しをAutopilotに任せるなら、CLI側のtimeoutだけでなく、呼び出し側のjob timeout、process kill、artifact保存、再実行条件を別に持つ必要がある。

もう一つ重要なのが、Plan mode中のworkspace変更ブロックである。Release 1.0.71では、Plan modeがbuilt-in tool callsのうちworkspaceを変更するものをhard-blockするようになった。GitHubの説明では、agentがplanning中にfile編集やmutating shell commandを実行できなくなる。pull requestを開くようなbuilt-in mutatorもブロック対象だ。一方、MCPやexternal toolは引き続き許可されると明記されている。

この差は実務で大きい。Plan modeを「読むだけ」「設計だけ」と社内に説明していても、外部MCP toolが変更能力を持つなら、完全なread-only境界とは言えない。日本企業の運用では、Plan modeの安心感を過大評価せず、MCP serverごとのtool権限、workspace trust、sandbox、承認UI、ログを合わせて確認するべきだ。

## 事実: LSP、MCP、pluginも運用面で更新された

Release 1.0.71は、agentの実行制御だけでなく、周辺の開発基盤にも触れている。LSP file readとrename editにsandbox filesystem policyを適用する変更は、特に注目したい。

GitHub Docsによると、Copilot CLIはLSP serverを使って、定義ジャンプ、参照検索、rename、document symbolsなどをより正確に扱える。LSPはtoken効率やrefactoring精度に効くため、CLI agentが大きなcodebaseを扱う上では有用だ。一方で、LSPはfile内容やsymbol情報にアクセスする。今回、LSP経由の読み取りやrename editにもsandbox policyが適用されることは、「通常のfile toolだけ縛ればよい」という発想では足りないことを示している。

MCPまわりでは、serverが変わった時にMCP tool listを最新に保つ更新、`settings.json` へのGitHub MCP toolset/tool config永続化、`--add-github-mcp-tool "*"` で全GitHub MCP toolsを有効化する挙動などが入っている。MCPはagentが外部サービスやrepository情報へアクセスする接続面であるため、tool listの古さは単なるUI不具合ではなく、許可済みtoolと実際に使えるtoolのズレになり得る。

plugin marketplaceについても、list/add/remove、browse/updateのsubcommandsが追加された。GitHub Docsは、Copilot CLIのextensionsやpluginsがtool、slash command、agent skill、hook、integrationを追加できると説明している。Release 1.0.71ではrepo-enabled pluginが `/plugin list` やskill pickerに表示されるようにもなった。つまり、CLIの機能拡張は個人の手元だけでなく、repositoryやmarketplaceを通じて配布・発見される運用に寄っている。

ここは[Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/)や[GitHub Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)とつながる。AI agentの品質はモデルだけでは決まらない。どのtool、plugin、MCP server、LSPが読み込まれているかが、実際の作業範囲を決める。

## 分析: 日本企業はモード別の責任線を定義すべき

ここからは分析である。

今回の1.0.71は、Copilot CLIを社内標準ツールとして配る組織ほど重い。個人開発者なら「hangが減った」「Plan modeが安全になった」で済むかもしれない。しかし企業利用では、Autopilot、Plan mode、interactive、noninteractive、remote control、plugin付きsessionが混在する。どのモードで何を許すかを言語化しないと、利用者も管理者も同じ「Copilot CLI」という名前で違うリスクを想像する。

まずAutopilotは、承認待ちを減らす代わりに、終了条件、費用上限、変更範囲、command allowlistを明確にする必要がある。[Copilot CLIのAI credit session limit](/blog/github-copilot-cli-ai-credit-session-limits-2026/)で扱ったように、1回のsession費用をsoft capで区切れるとしても、subagentやbackground workを含む実行の失敗半径は別に設計する。timeout、credit limit、job timeout、branch保護、rollbackを重ねるのが現実的だ。

次にPlan modeは、設計レビューの入口として扱う。Release 1.0.71でbuilt-in mutatorがhard-blockされたことにより、「まずPlan modeで調査と設計を出させ、人間が承認してから実装へ移る」運用は組みやすくなった。ただしMCPとexternal toolが引き続き許可される点を前提に、Plan mode用のtool profileを別にしたほうがよい。たとえば、Plan modeではread-only GitHub MCP、issue参照、docs検索だけを許可し、ticket更新、PR作成、secret操作、cloud write APIは外す。

LSPは、開発者体験と統制の両方に効く。精度が上がれば、agentが不要なfileを大量に読む必要は減る。一方、renameや参照検索は広範囲に影響する。sandbox policyがLSP read/renameへ適用されるようになったことを踏まえ、企業は「LSPがあるから安全」でも「LSPは危険だから禁止」でもなく、repository別に許可範囲を決めるべきだ。機密度の高いmonorepoでは、最初にread-only用途で導入し、rename editは人間承認付きにするのが妥当である。

plugin marketplaceとextensionsは、端末管理の対象になる。GitHub Docsはextensionsが利用者の権限で端末上のcodeを実行するため、信頼できるcodeだけを読み込むよう警告している。日本企業では、npm packageやVS Code extensionと同じく、Copilot CLI plugin/extensionにも承認済み入手元、version固定、更新確認、削除手順を持つべきだ。MDMや`.github-private`だけでなく、repository内設定、user config、plugin marketplaceの3層を棚卸しする必要がある。

## 導入チェックリスト

1.0.71へ更新するだけでなく、次の確認をrunbook化したい。

第一に、CLI versionを揃える。開発基盤チーム、CI runner、VDI、委託先端末で `copilot update stable` または配布手段を確認し、1.0.71以降が入っていることを記録する。単に最新版を推奨するのではなく、Plan mode hard-blockとAutopilot timeout修正が入ったversionを最低ラインにする。

第二に、Autopilotの利用場面を分ける。低リスクの調査、test失敗の切り分け、documentation修正ではAutopilotを許可し、認証、課金、database migration、production config、個人情報を含む変更ではPlan modeまたはinteractiveに限定する。長時間taskでは `COPILOT_TASK_WAIT_TIMEOUT_SECONDS`、job timeout、AI credit session limit、最大retry回数をセットで設計する。

第三に、Plan modeのtool profileを作る。Release 1.0.71はbuilt-in mutatorを止めるが、MCPとexternal toolは別枠である。社内の「Plan modeはread-only」という説明を使うなら、それを支えるMCP allowlistとexternal tool policyが必要だ。GitHub issueを読むtool、repository検索、docs検索は許しても、PR作成、label変更、cloud resource変更は外す、といった分離を行う。

第四に、LSPとsandboxの確認を行う。LSP serverを導入しているrepositoryでは、sandbox policyが期待どおりfile readとrename editに効くかを検証する。特にmonorepo、generated code、submodule、vendor directory、secret-like fileを含むrepositoryでは、agentが読める範囲とrenameできる範囲をテストケースにしておく。

第五に、plugin marketplaceとextensionを棚卸しする。repo-enabled pluginがUIに出るようになったことで、利用者は何が有効かを見つけやすくなる。一方で、marketplace追加やplugin更新の操作がCLIからできるようになるほど、承認済みmarketplace以外をどう扱うかが重要になる。既に[Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)を進めている組織は、CLI plugin/extensionも端末標準の一部として管理対象に含めるべきだ。

## まとめ

Copilot CLI 1.0.71は、派手な新機能よりも運用品質の更新である。Autopilotのhang回避、Plan mode中のbuilt-in mutator hard-block、LSP read/renameへのsandbox policy適用、MCP tool list更新、plugin marketplace操作の追加は、CLI agentを企業の開発基盤へ入れる時の境界を明確にする。

日本の開発チームは、今回の更新を「安定版へ上げる作業」だけで終わらせないほうがよい。Autopilot、Plan mode、LSP、MCP、pluginごとに、許可するtask、使えるtool、停止条件、監査ログ、更新手順を分ける。そうして初めて、Copilot CLIを個人の便利ツールから、説明可能なagent実行面へ近づけられる。

## 出典

- [Release 1.0.71 - github/copilot-cli](https://github.com/github/copilot-cli/releases/tag/v1.0.71) - GitHub, 2026-07-16
- [Allowing GitHub Copilot CLI to work autonomously](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) - GitHub Docs
- [Using LSP servers with GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/lsp-servers) - GitHub Docs
- [About extensions for GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-extensions) - GitHub Docs
