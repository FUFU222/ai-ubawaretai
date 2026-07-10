---
article: 'github-copilot-vscode-multichat-agent-sessions-2026'
level: 'expert'
---

VS Code 1.128の複数チャットagent sessionは、GitHub Copilotの利用面を「単一のchat pane」から「session内の作業分岐管理」へ進める更新である。GitHubの2026年7月8日付Changelogは、VS Code v1.123からv1.127までのCopilot更新をまとめ、agent作業管理、usage理解、model選択、Autopilot改善を強調した。VS Code 1.128側では、Claude agent-host sessionで複数chatを持てるようになり、同じsession内で比較、分岐、並列作業を扱えるようになった。

この更新は、[GitHub CopilotにAutopilot登場](/blog/github-copilot-autopilot-vscode-2026/)で扱った自律実行の延長線上にあるが、同じものではない。Autopilotが「途中承認で止まらない」方向の話なら、複数chatは「同じ作業領域の中で会話と判断経路を分ける」方向の話である。[GitHub Copilot OTel管理](/blog/github-copilot-opentelemetry-managed-export-2026/)や[GitHub Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)と合わせて見ると、GitHubとMicrosoftはCopilotを個人の補完機能ではなく、企業が観測・配布・レビューできるagent runtimeへ寄せている。

## 事実: session、chat、worktreeの境界

VS CodeのAgents windowドキュメントは、agent host session内で複数chatをside by sideに実行できると説明している。各chatは独自のconversation、title、status、agentまたはlanguage model selectionを持つ。一方で、sessionのworkspaceとworktreeは共有される。これは境界を理解しないと誤用しやすい。

sessionは作業単位であり、workspace、worktree、changes panel、terminal、browser tab、task実行の文脈を持つ。chatはそのsession内の会話単位である。chatを追加しても別のbranchや別の作業copyが作られるわけではない。したがって、複数chatは「同じ作業場所で別々の思考や指示を走らせる」機能であり、「安全な並列開発環境を自動生成する」機能ではない。

この違いは実務上かなり大きい。たとえば、chat Aがdomain modelを変更し、chat Bが同じ前提を知らずにcontrollerを修正すると、差分は1つのworktreeに集まる。changes panelは変更をまとめて見せるが、変更の由来を自動で設計判断に変換してくれるわけではない。PR前に、人間が採用した設計と捨てた設計を整理する必要がある。

一方、forkは有用だ。forkは特定の会話地点までの履歴を引き継いだpeer chatを作り、そこから独立に走らせる。要件整理までは共有し、その後に「最小変更」「互換性重視」「将来拡張」の3案を比較する、といった使い方に向く。これはLLMに複数案を出させるだけよりも、作業文脈と差分を比較しやすい。

## 事実: 対応session typeと第三者agent

ドキュメント上、複数chatは対応するagent host sessionで利用できる。例としてCopilot CLIとClaude sessionsが挙げられている。他のsession typeでは単一chatになる。企業展開では、対象機能がどのclient、どのextension、どのplan、どのpolicy状態で使えるかを実機で確認する必要がある。

Third-party agentsのドキュメントでは、VS CodeがClaude AgentやOpenAI Codexのような外部agentを同じagent session管理面に載せる方向を示している。Claude agentはAnthropicのClaude Agent SDKを使い、VS Code内でworkspaceに対して自律的に計画、実行、反復できる。cloud-based third-party agentはCopilot plan経由で有効化される場合があり、billingやavailabilityはCopilot側の条件に依存する。

ここで日本企業が注意すべきなのは、同じVS Code画面に見えても、背後のagent provider、billing、data flow、tooling、permission modelが異なる可能性がある点だ。Claude agent、Copilot CLI、Copilot cloud agent、Codex extensionを同じ「AI機能」として扱うと、監査や費用配賦が曖昧になる。

したがって、標準化するならagent typeごとに最低限の台帳を持つべきだ。対象plan、利用可能部署、許可repository、local/cloud、利用model、入力可能データ、terminal可否、browser可否、MCP可否、ログ取得、費用の見方を分ける。UIが統合されるほど、運用台帳の粒度は細かくする必要がある。

## 分析: 複数chatの設計パターン

複数chatは、無秩序に増やすと認知負荷が上がる。実務では、最初からchat patternを決めるほうがよい。

第一のパターンは、**research / plan / review**である。research chatはread-onlyに近く使い、既存仕様、関連file、過去のPR、同種bug、テスト位置を調べる。plan chatはresearchの結果を受け、変更案、影響範囲、rollback、migration、test planを作る。review chatは実装後のdiffを読み、仕様逸脱、破壊的変更、認可、例外処理、ログ、テスト不足を確認する。

第二のパターンは、**A案 / B案 / judge**である。forkで同じ前提からA案とB案を作り、judge chatで比較表を作らせる。judge chatには、diff量、既存patternとの一致、risk、test追加量、reviewしやすさ、将来変更の余地を評価軸として渡す。最終判断は人間が行い、採用しなかった案はPR本文か設計メモに短く残す。

第三のパターンは、**implementation / test / docs**である。ただしこれは同じfileを触らない範囲に限定したほうがよい。実装chatがAPIを変える途中で、test chatが古いAPI前提でテストを書くと手戻りになる。先にinterfaceを固定し、test chatにはそのinterfaceだけを渡す。docs chatは実装完了後に回すほうが安定する。

第四のパターンは、**incident triage**である。障害調査では、facts chat、hypothesis chat、mitigation chatを分ける。facts chatはログ、時刻、影響範囲、再現条件だけを整理する。hypothesis chatは原因仮説を列挙する。mitigation chatは暫定対応と恒久対応を分ける。この形は、監査や事後報告で「事実」と「推測」を混ぜないために効く。

## 権限と変更管理の設計

複数chatの導入で最も危ないのは、便利さに合わせて権限も広げてしまうことだ。chat数が増えるほど、terminal実行、file編集、browser操作、MCP tool call、外部networkの回数も増える。権限はchat単位ではなくsessionやclient設定に寄る部分があるため、どのchatが何をできるかを人間が理解していないと事故が起きる。

初期設定では、低リスクrepository、限定member、明示的なpermission level、手動diff reviewを前提にするべきだ。Autopilotやdangerous permission bypassは、隔離された環境、短命branch、secretなしのworkspace、自動test、rollback可能な変更に限る。通常の業務repositoryで、複数chatと高自律権限を同時に広げるのは避けたい。

変更管理では、chat命名を運用ルールに入れる。たとえば `research: auth flow`、`plan: minimal patch`、`review: diff risk` のように、目的と対象を短く入れる。session titleだけでは不十分だ。chat tabを閉じたり隠したりできるため、採用判断に関係したchatは消さず、PR作成まで残す運用が望ましい。

PR本文には、AI利用を大げさに書く必要はない。ただし、複数案を試したなら、採用案、破棄案、主要な人間判断、確認済みtestを残す。AIが出した案をそのまま貼るのではなく、開発者が責任を持って要約する。これは社内レビューの摩擦を減らし、後から似た修正をするときの判断材料にもなる。

## 監査と費用の見方

複数chatは、usageとobservabilityの見方も変える。1つのsession内で複数chatが動くと、利用量、tool call、失敗、retry、変更fileが従来より細かく分かれる。GitHub側のusage metricsだけでは、どのchatがどの判断に効いたかまでは分からない可能性がある。

このため、企業ではmetadata-firstの観測を設計したい。session id、workspace、repository、agent type、chat purpose、model、permission level、tool category、duration、status、change count、test resultを追えると、月次レビューで「どの使い方が価値を出したか」を判断しやすい。[GitHub Copilot使用指標補正](/blog/github-copilot-usage-metrics-accuracy-2026/)で扱ったように、請求やusage reportは運用判断の一部であり、作業品質や監査理由そのものではない。

OpenTelemetry exportを使う場合も、最初からprompt全文やtool result全文を保存する必要はない。むしろ日本企業では、本文保存は慎重に扱うべきだ。顧客情報、未公開設計、secret、脆弱性情報が混ざる可能性がある。最初はmetadata、error class、latency、tool name、client version、managed channelを取り、必要な範囲だけcontent captureを検証するほうが現実的である。

費用面では、chatを増やすと検討量も増える。A案、B案、レビュー、再修正をすべてAIに任せれば、利用量は自然に増える。これは悪いことではないが、成果と結びつけて見る必要がある。重いmodelやthird-party agentを使うchatは、設計判断や難所調査など、単価に見合う場面に寄せる。軽い確認や形式変換まで高価なagentで回さない。

## 日本企業向けの導入チェックリスト

第一に、利用面を定義する。Agents windowを使うのか、Chat viewを使うのか、Copilot CLIを使うのか、Claude agentを使うのかを分ける。同じVS Code内でも、操作面と責任境界は同じではない。

第二に、session typeごとの許可範囲を決める。local folder、GitHub repository、cloud agent、third-party agentで、データの置き場と変更の戻し方が違う。とくに顧客別repositoryや規制対象データを扱う部署では、対象repositoryを限定する。

第三に、chat patternを標準化する。最初はresearch、plan、reviewの3つに絞る。必要になってからforkやA/B比較を追加する。命名規則がないままchatを増やすと、AIの作業履歴がノイズになる。

第四に、review gateを残す。複数chatで作った変更は、changes panel、local test、PR review、branch protectionのどこかで必ず人間が確認する。AIによるreview chatは補助であり、承認者の代替ではない。

第五に、ログと保持を決める。sessionやchatの履歴をどこまで残すか、OpenTelemetryで何を取るか、prompt本文を保存するか、保持期間と閲覧権限をどうするかを明文化する。利用者が便利にchatを増やせるほど、企業側は保持と削除の方針を先に持つ必要がある。

## まとめ

VS Code 1.128の複数チャットagent sessionは、GitHub Copilotの利用を「質問応答」から「作業分岐の管理」へ近づける更新である。対応sessionでは、同じworkspaceとworktreeを共有しつつ、chatごとに会話、title、status、model selectionを分けられる。forkを使えば、同じ前提から別案を試し、人間が比較して採用できる。

日本企業にとっての本質は、AIを同時にたくさん走らせることではない。調査、計画、実装、レビュー、代替案を説明可能な単位へ分けることだ。権限、ログ、費用、PR説明、branch運用を合わせて設計すれば、複数chatはagentic codingを統制しながら進める実務的な道具になる。

## 出典

- [GitHub Copilot in Visual Studio Code, June 2026 releases](https://github.blog/changelog/2026-07-08-github-copilot-in-visual-studio-code-june-2026-releases/) - GitHub Changelog, 2026-07-08
- [Visual Studio Code 1.128](https://code.visualstudio.com/updates/v1_128) - Visual Studio Code, 2026-07-08
- [Use the Agents window (Preview)](https://code.visualstudio.com/docs/agents/agents-window) - Visual Studio Code Docs, accessed 2026-07-10
- [Third-party agents in Visual Studio Code](https://code.visualstudio.com/docs/agents/agent-types/third-party-agents) - Visual Studio Code Docs, accessed 2026-07-10
- [Copilot CLI sessions in Visual Studio Code](https://code.visualstudio.com/docs/agents/agent-types/copilot-cli) - Visual Studio Code Docs, accessed 2026-07-10
