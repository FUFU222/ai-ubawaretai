---
article: 'github-copilot-cli-1071-autopilot-plan-2026'
level: 'expert'
---

GitHub Copilot CLI 1.0.71は、agent platformとしてのCLIを運用するためのcontrol surfaceを少しずつ締めたreleaseである。主な焦点は、`copilot -p --autopilot` のhang回避、Plan modeにおけるbuilt-in mutatorのhard-block、LSP read/renameへのsandbox policy適用、MCP tool list更新、plugin marketplace操作の追加だ。

この更新を単なるbug fix集として扱うと、社内展開時の意味を見落とす。CLI agentは、IDE内補完よりも実行権限に近い。shellを動かし、fileを読み書きし、LSPでsymbolをたどり、MCPやplugin経由で外部toolを呼ぶ。さらに[Copilot CLI遠隔操作](/blog/github-copilot-cli-remote-control-ga-2026/)や[Copilot CLIセッション上限](/blog/github-copilot-cli-ai-credit-session-limits-2026/)が示すように、人間が画面を見続けない運用へ広がっている。

したがって1.0.71の評価軸は、「どの機能が増えたか」ではなく、「どの失敗モードが明示的に扱えるようになったか」である。

## Release 1.0.71の運用上の焦点

GitHubは2026年7月16日のreleaseで、多数のCLI更新を列挙している。その中で企業運用に直接効く項目は、少なくとも次の五つに分けられる。

第一に、Autopilotの終了条件である。`copilot -p --autopilot` がbackground shellやagentの生存でhangし続けず、`COPILOT_TASK_WAIT_TIMEOUT_SECONDS` timeoutを尊重するようになった。これはnoninteractive jobや社内orchestratorにCLIを組み込む場合、task stateを外側から判断しやすくする。

第二に、Plan modeのwrite boundaryである。Plan mode中にbuilt-in tool callsがworkspaceを変更しようとするとhard-blockされる。対象にはfile編集、mutating shell command、pull request作成のようなbuilt-in mutatorが含まれる。一方で、MCPとexternal toolは許可されるため、Plan modeをread-onlyと定義するにはtool policyを補完する必要がある。

第三に、LSPのsandbox適用である。LSP file readとrename editにもsandbox filesystem policyが効く。GitHub DocsはLSPを、定義ジャンプ、参照検索、rename、document symbolsなどを正確に扱うための仕組みとして説明している。LSPは精度とtoken効率に効くが、file accessの別経路でもある。

第四に、MCP構成の鮮度と永続化である。MCP serverが変わった際にtool listを更新し、GitHub MCP toolset/tool configを `settings.json` に保存できるようになっている。MCPはAI agentの外部権限面なので、tool listと実際の接続状態がずれると監査や説明が弱くなる。

第五に、plugin marketplaceとextension運用である。plugin marketplaceのlist/add/remove、browse/updateがCLIから扱えるようになり、repo-enabled pluginが `/plugin list` やskill pickerで見えるようになった。GitHub Docsはextensionsが端末上で利用者権限のcodeを実行することを説明しており、pluginやextensionは単なるUI拡張ではない。

## Autopilot timeoutを失敗モデルに入れる

Autopilotは、human-in-the-loopを減らしてtaskを進めるための機能である。GitHub DocsのAutopilot説明は、Copilot CLIがより自律的に作業できるようにする概念を示している。しかし、企業運用で重要なのは「自律性」そのものではなく、どの条件で止まり、どの成果物を残し、誰が次の判断をするかである。

1.0.71以前の失敗モードとして考えるべきなのは、foregroundのturnは終わっているように見えるのに、background shellやagentが残り、`-p --autopilot` が外側から見ると完了しない状態である。人間がterminalを見ていれば介入できるかもしれないが、scheduler、CI、社内bot、nightly investigationではそうはいかない。

timeout尊重は、この失敗モードを減らす。ただし、timeoutは完了保証ではない。timeout後に中間成果物があるか、変更fileが整合しているか、testが途中か、background processが完全に消えたかは別に確認する必要がある。外側のwrapperでは、CLI timeout、process timeout、artifact保存、workspace cleanup、retry budgetを分けて扱うべきだ。

たとえば、CI失敗調査の自動runでは、次のstateを区別したい。

1. `completed`: 原因、再現手順、修正候補がartifactに保存された
2. `timeout_checkpointed`: timeoutしたが調査ログと未完了項目がある
3. `timeout_dirty`: timeoutし、workspace変更やbackground processが残った
4. `tool_denied`: shell、file、MCPの承認で止まった
5. `quality_rejected`: outputは出たがtestやreview基準を満たさない

この区別がなければ、timeout修正が入っても、運用上は「たまに落ちるCLI」になる。逆にstateを分ければ、[Copilot cloud agent automations](/blog/github-copilot-cloud-agent-automations-2026/)のような無人起動でも、再実行、人間引き継ぎ、打ち切りを機械的に選びやすい。

## Plan mode hard-blockを承認設計へ組み込む

Plan mode中のbuilt-in mutator hard-blockは、開発組織にとって分かりやすい改善である。設計を作らせてから実装へ進めるworkflowでは、計画段階でfile編集や変更系commandが混ざるとreview責任が曖昧になる。1.0.71により、少なくともbuilt-in toolの範囲では、Plan modeの説明と実際の挙動が近づく。

ただし、ここで「Plan modeなら安全」と短絡してはいけない。release noteはMCPとexternal toolが引き続き許可されると明示している。MCP serverがissue更新、PR作成、cloud resource変更、ticket操作、database照会を持つ場合、Plan modeの境界はbuilt-in toolだけでは完結しない。

実務では、Plan mode用profileを作るのがよい。

- 読み取り: repository search、GitHub issue/PR read、docs search、dependency metadata
- 条件付き: LSP read、CI log read、package registry read
- 原則禁止: file write、shell mutator、PR作成、issue/label変更、secret操作、cloud write API
- 例外承認: migration計画、security incident、release hotfixの調査に限り一時的に追加

このprofileを作ると、社内説明が安定する。「Plan modeはbuilt-in mutatorを止める。ただし、MCPとexternal toolは別にallowlistで縛る」という二層の説明になる。これは[Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)や[Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)のような管理面とも合わせやすい。

また、Plan modeとAutopilotを同じ承認レベルに置かないほうがよい。Plan modeは意思決定前の調査・設計、Autopilotは実行継続を許すモードである。Plan modeで設計を出し、人間が変更範囲、test plan、rollback、費用上限を承認し、その後にinteractiveまたはAutopilotへ進む。これを標準のrunbookにする。

## LSP sandboxとrename editの扱い

LSPは、agentにとって強い武器である。GitHub Docsは、LSP serverによりCopilot CLIがcode structureをより正確に理解し、definition、references、hover、rename、document symbols、workspace symbol searchなどを扱えると説明している。text searchだけでは誤検知しやすい大規模codebaseで、LSPは精度とtoken効率を上げる。

しかし、LSPはfile accessの迂回路にもなり得る。file toolにsandboxを掛けても、LSP経由のreadやrenameが同じ境界に従わなければ、policyは穴になる。1.0.71でLSP file readとrename editにsandbox filesystem policyが適用されることは、この点をGitHub側も明確に扱い始めたと読める。

日本企業が確認すべきは、次の四つである。

第一に、sandbox対象外にしたい領域がないか。generated code、vendor、large binary、secret-like fixtures、customer dataを含むsample directoryは、agentが読む必要があるかを見直す。

第二に、rename editの承認線である。LSP renameは正確な一括変更に向くが、影響範囲が広い。Plan modeではrename editを禁止し、implementation modeでもreview前にdiff、test、typecheckを必須にする。

第三に、LSP serverの導入経路である。GitHub Docsは、project config、plugin config、user configの優先順位でLSP serverが読み込まれると説明している。repositoryが独自LSPを配る場合、全員に同じ挙動を提供できる一方、そのconfig自体が信頼境界になる。

第四に、委託先端末やVDIでの差分である。LSP serverが入っていない端末ではagentの探索方法が変わり、token消費や変更精度も変わる。同じpromptでも結果が変わるため、標準環境での検証を先に行う。

## MCPとplugin marketplaceの管理

MCPとpluginは、Copilot CLIの能力を拡張する入口である。Release 1.0.71では、MCP tool listの鮮度、GitHub MCP toolset/tool configの永続化、plugin marketplace操作、repo-enabled pluginの表示が更新されている。これは、CLIの実行面が「単体binary」から「設定、marketplace、repository、plugin、MCP serverを含むruntime」へ広がっていることを示す。

MCP tool listが古いと、利用者は使えると思ったtoolが使えない、または無効化したと思ったtoolが残っているように見える可能性がある。監査では、policy上のallowlist、CLIが認識しているtool list、実際にcallできるtoolの三つを照合する必要がある。

plugin marketplaceは、配布と統制の両面を持つ。承認済みpluginを全員へ届けるには便利だが、marketplace追加やplugin更新がCLIからできるなら、誰がどのmarketplaceを追加できるか、version pinningはどうするか、脆弱性や不正pluginの削除手順はどうするかを決める必要がある。

GitHub Docsは、extensionsがNode.js moduleとして端末上で動き、toolsやslash commandsを追加できると説明している。さらに、extensionsは利用者の権限で実行されるため信頼できるcodeだけを読み込むべきだと警告している。これは、AI agentの安全性だけでなく、通常のendpoint securityの話でもある。

したがって、企業では次の棚卸しを行う。

1. User configのextensionsとplugins
2. Repository配下のextensions、plugin、LSP config
3. `.github-private` やenterprise-managed settingsの標準
4. MCP serverの接続先、toolset、credential owner
5. plugin marketplaceの追加権限、更新権限、削除手順

この棚卸しは[Copilot VS Code複数chat agent session](/blog/github-copilot-vscode-multichat-agent-sessions-2026/)のようなIDE内agent運用とも関係する。CLI、VS Code、cloud agentが同じ名前のCopilotでも、読み込むtool、設定、sandboxは完全には同じではない。surface別に差分を管理する必要がある。

## 日本企業向け rollout runbook

1.0.71以降を社内標準にする場合、最初にversion inventoryを取る。対象は開発者端末、VDI、CI runner、self-hosted runner、remote development環境、委託先に貸与している端末である。標準versionを文書化し、1.0.71未満ではAutopilotやPlan modeの社内標準runbookを使わせない。

次に、mode別policyを作る。

| mode | 主用途 | 許可する作業 | 禁止または要承認 |
|---|---|---|---|
| Plan mode | 調査、設計、見積もり | read-only search、docs、issue read | file write、PR作成、ticket更新、cloud write |
| Interactive | 小規模修正、手元確認 | file edit、test、限定shell | secret操作、本番接続、広範囲migration |
| Autopilot | 低リスク自律実行 | test調査、docs修正、issue整理 | auth、billing、database、production config |
| Noninteractive | scheduled / CI連携 | artifact出力、分析、提案 | 自動merge、無制限retry、credential変更 |

三つ目はtimeoutとcreditを同時に設計することだ。Autopilot timeoutはhang対策であり、AI credit session limitは費用のsoft capであり、CI job timeoutは外側の停止条件である。どれか一つだけでは足りない。各automationには、最大runtime、最大credits、最大attempts、dirty workspace時の扱い、artifact保存先を持たせる。

四つ目はsandbox regression testを作ることだ。LSP read、LSP rename、file read、shell command、MCP read、MCP writeをそれぞれテストする。許可されるべき操作と拒否されるべき操作を小さなfixture repositoryで確認し、CLI update時に再実行する。1.0.71のような運用更新は、目視では効いているか分かりにくい。

五つ目はpluginとMCPのchange controlである。marketplace追加、plugin update、MCP server追加、toolset変更を通常の開発環境変更として扱う。リリース前にsecurity review、互換性確認、rollback手順を置く。特にpluginやextensionが端末上でcodeを実行することを、利用者教育に含める。

最後に、ログと説明責任を残す。Plan modeでどのtoolが使われたか、Autopilotがどこでtimeoutしたか、LSP renameが何を変更したか、MCP toolがどの外部resourceへアクセスしたかを、後から追える形にする。これがないと、AI agentの導入効果だけでなく、事故時の切り分けも説明できない。

## まとめ

Copilot CLI 1.0.71は、GitHub Copilotを企業のagent runtimeとして扱うための地味だが重要な更新である。Autopilot timeout、Plan mode hard-block、LSP sandbox、MCP tool list、plugin marketplaceは、それぞれ停止、変更、読み取り、外部接続、拡張配布の境界に関わる。

日本企業は、このreleaseを「アップデートしてください」という通知で終わらせず、mode別policy、tool allowlist、sandbox test、plugin/MCP change control、timeout/credit設計へ落とすべきだ。Copilot CLIの価値は、自律性を上げることだけではなく、自律性の境界を説明できる形で運用することにある。

## 出典

- [Release 1.0.71 - github/copilot-cli](https://github.com/github/copilot-cli/releases/tag/v1.0.71) - GitHub, 2026-07-16
- [Allowing GitHub Copilot CLI to work autonomously](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) - GitHub Docs
- [Using LSP servers with GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/lsp-servers) - GitHub Docs
- [About extensions for GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-extensions) - GitHub Docs
