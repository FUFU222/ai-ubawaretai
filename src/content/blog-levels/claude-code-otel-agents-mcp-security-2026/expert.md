---
article: 'claude-code-otel-agents-mcp-security-2026'
level: 'expert'
---

Claude Code `2.1.161` は、モデル性能や大きな製品発表ではなく、運用品質の changelog である。だが、AIコーディングエージェントを企業利用へ持ち込む観点では、この種の更新のほうが重要な場合がある。

2026年6月2日の Claude Code changelog には、`OTEL_RESOURCE_ATTRIBUTES` を metric datapoints の labels に含める変更、`claude agents` の fan out 表示改善、parallel tool calls の失敗分離、`claude mcp` の secrets redaction、OpenTelemetry log events の初期化前 drop 修正、background sessions や Windows hooks の修正が並んでいる。

これらは個別には小さい。しかし合わせて見ると、Claude Code が「強いモデルを呼ぶCLI」から「複数作業を走らせ、外部ツールにつなぎ、組織で観測する開発エージェント」へ移っていることが分かる。[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) と同じく、論点はモデル選択そのものではなく、運用の説明可能性へ移っている。

## 事実整理: 2.1.161の変更を運用面で読む

`2.1.161` の第一のポイントは、OpenTelemetry のラベルである。`OTEL_RESOURCE_ATTRIBUTES` の値が metric datapoints の labels に含まれることで、team、repo、service、environment などの custom dimensions を使って Claude Code usage metrics を slice しやすくなる。

第二のポイントは、background agents の見通しである。`claude agents` の rows は fan out された作業について `done/total` を detail の前に表示し、peek では最も長く走っている item を示す。複数作業を並列に走らせると、単に「動いている」だけでは不十分で、どの subtask が詰まっているかを早く把握する必要がある。

第三のポイントは、parallel tool calls の失敗分離である。failed Bash command が同じ batch 内の other calls をキャンセルしなくなり、各 tool は独立して結果を返す。AIエージェントの実行ログを読むとき、これは重要だ。一つのコマンド失敗で周辺の観測結果まで消えると、レビュー担当者は何が確認済みかを再構成しなければならない。

第四のポイントは、MCP secrets の redaction である。`claude mcp list/get/add` が secrets を terminal に出していた問題が修正され、`${VAR}` references は展開されず、credential headers と URL secrets は redacted される。MCP は external tools 接続の中心になるため、設定表示の安全性は基本要件である。

## OpenTelemetryラベルは費用配賦だけではない

Monitoring docs は、Claude Code が usage、costs、tool activity を OpenTelemetry で export できると説明している。metrics、logs/events、traces を backend に送る構成で、管理者は managed settings によって組織へ telemetry settings を配布できる。

この前提に `OTEL_RESOURCE_ATTRIBUTES` labels が加わると、企業での使い道が広がる。典型的には費用配賦だ。部門、repo、プロダクト、委託先、開発環境ごとに Claude Code の利用量を分けて見たい。特に [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) で扱ったように、長時間タスクや dynamic workflows が増えると、単なるユーザー別 usage だけでは費用の説明が難しくなる。

しかし、ラベルの価値は費用配賦に限らない。セキュリティ、品質、教育投資、委託先管理にも使える。たとえば、`risk_class=high` の作業で tool execution が増えていないか、特定 repo で background agents が長時間化していないか、新規導入チームの usage が急増していないかを監視できる。

実務で重要なのは、ラベルを先に標準化することだ。`team=platform` と `team=Platform` と `department=platform engineering` が混ざると、集計は壊れる。`repo` も GitHub の正式 repo 名に合わせるのか、社内システムのプロダクト名に合わせるのかを決める必要がある。

また、Monitoring docs が metrics cardinality control を説明している点も無視できない。session id や account uuid や version を含めるかどうかは、監視 backend の費用、保存量、クエリ性能に影響する。Claude Code telemetry は「全部出せばよい」ではない。監査で説明したい軸を少数に絞り、必要な時だけ詳細ログへ降りる設計にしたほうが運用しやすい。

## MCP redactionは最終防衛線ではない

MCP docs は、Claude Code が local stdio server や remote HTTP server に接続し、外部ツールを利用できることを示している。GitHub、チケット管理、社内DB、Slack、検索、デプロイ基盤などが MCP 経由でつながると、Claude Code の実行面はコード編集を超える。

今回の `claude mcp` secrets redaction は重要だが、これを「MCPは安全になった」と読むのは危ない。修正されたのは、設定表示コマンドが terminal に secrets を出す問題である。MCP server の設計、OAuth scope、tool permissions、ログ保存、promptやtool contentの扱いは別途管理しなければならない。

企業では terminal 出力がさまざまな場所へ流れる。画面共有、障害報告、CI logs、チケット、チャット、ナレッジベース、ペア作業の録画などだ。credential header や URL token が出ないことは必須だが、server名やURL、tool名も機微情報になる場合がある。社内DBや顧客管理システムへ接続する MCP server の存在自体を誰に見せるかは、セキュリティ部門と決める必要がある。

実務的には、MCP を三層に分けたい。第一層は個人検証用で、ローカルだけ、期限付き、顧客データなし。第二層はチーム標準で、repoやチケットのような開発業務に限定。第三層は業務システム接続で、承認、監査、scope、保存期間を明示する。Claude Code の redaction 修正は、この三層運用のうち「表示事故を減らす」部品であって、全体の統制ではない。

## background agentsはローカルプロセス管理として見る

Agent view docs によれば、background sessions は per-user supervisor process の下で動く。各 session は独立した Claude Code process で、状態は disk に保存される。session が完了して unattached のまま一定時間たつと process は止まり、次に attach、peek、reply したときに再開される。

この仕組みは、開発者には便利だ。複数の調査や修正を並列に走らせ、必要なものだけ attach して見ることができる。一方、企業運用では「ローカルに残る状態」「daemonが管理するプロセス」「再開時のモデルや設定」「worktreeやshell subprocessの後始末」を理解しなければならない。

今回の changelog では、background subagent output が `claude -p` stdout を壊す問題、workflow agents が background sessions の isolated worktree 内で編集できない問題、background sessions が daemon 環境の stale model で起動する問題なども修正されている。これは、background agents が単なるUI機能ではなく、実行環境そのものに関わることを示している。

[Claude Code 2.1.149/2.1.150のPowerShellとMCP修正](/blog/claude-code-2149-powershell-mcp-2026/) でも、shell、worktree、MCP、usage表示のような周辺機構が企業導入で重要になると整理した。今回も同じだ。AIエージェント運用では、モデルが正しくても、daemon、worktree、clipboard、IME、terminal、stdout が不安定なら、現場の信頼は下がる。

日本企業が background agents を許可するなら、管理項目を明確にしたい。どのディレクトリで起動してよいか、worktree はどこに作るか、長時間実行を誰が止めるか、daemon log を誰が読めるか、退職者や委託契約終了時に local state をどう消すか、CIや共有端末で使ってよいかを決める必要がある。

## parallel tool callsの失敗分離は「継続可否」のルールを要求する

parallel tool calls で一つの Bash command 失敗が他の tool calls をキャンセルしなくなったことは、作業効率を上げる可能性がある。たとえば、複数ファイルの読み取り、依存情報の確認、軽いコマンド実行が並列に走る場合、一つの失敗で全体が空振りしなくなる。

しかし、企業運用では「結果が返った」ことと「進めてよい」ことを分ける必要がある。テストコマンドが失敗したが、別の調査結果は得られた。lint は失敗したが、ファイル読み取りは成功した。security scan は失敗したが、修正案は生成された。このとき、AIエージェントが成功した結果だけを使って次へ進むと、重要な検証失敗を見落とす可能性がある。

したがって、tool failure の種類ごとにブロッカー条件を決めるべきだ。テスト、型チェック、lint、migration dry-run、security scan、secret scan、permission check、dependency audit は、失敗したら原則停止する。ログ取得、補助的な検索、任意のドキュメント取得は、失敗しても人間へ明示すれば継続できる場合がある。

このルールは Claude Code の内部に完全に任せるより、社内の作業テンプレート、review checklist、CI gate、agent instructions に落とすほうがよい。AIエージェントが並列実行に強くなるほど、人間側はどの失敗を無視してよいかを明文化しなければならない。

## 日本企業の導入設計

日本企業向けには、今回の更新をきっかけに四つの設計を進めるのが現実的だ。

第一に、telemetry label schema を決める。`team`、`repo`、`environment`、`risk_class`、`cost_center` くらいから始め、値の一覧を管理する。自由入力にすると短期的には楽だが、半年後に集計できなくなる。

第二に、MCP registry を作る。許可済み MCP server、owner、scope、auth method、secret storage、log policy、利用可能チーム、失効手順を一覧にする。`claude mcp` の redaction が入った後でも、接続先管理は別途必要だ。

第三に、background agents runbook を作る。起動、attach、peek、stop、rm、daemon restart、local state cleanup、長時間実行時の連絡先を定義する。特に委託先や共有端末で使う場合、local state と credentials の扱いを曖昧にしない。

第四に、tool failure policy を作る。どの失敗は自動継続可、どの失敗は人間確認、どの失敗は作業停止かを決める。parallel tool calls の失敗分離が進むほど、このルールがないとレビューが属人的になる。

この四つは、[AnthropicのProject Glasswing拡大](/blog/anthropic-project-glasswing-expansion-critical-infra-2026/) のような防御側AI活用とも関係する。AIエージェントを防御や開発に使うなら、エージェント自身のログ、権限、失敗、秘密情報の扱いを説明できる必要がある。

## 監査担当と開発担当の見方をそろえる

開発担当は、今回の更新を「Claude Code が使いやすくなった」と見るかもしれない。監査担当は「どのログがどこに出るのか」と見る。セキュリティ担当は「MCP secrets が出なくなったとしても、tool content はどう扱うのか」と見る。経理やFinOps担当は「team/repo別に費用を見られるのか」と見る。

この見方をそろえるには、Claude Code の更新をプロダクトニュースとしてではなく、運用変更としてレビューする必要がある。新しい changelog が出たら、モデル、権限、ログ、MCP、background agents、Windows/WSL、IDE、CI、gateway、cost のどれに影響するかを分類する。影響がある場合は、社内の template や runbook を更新する。

特に Claude Code は更新頻度が高い。毎回すべてを全社展開レビューにかけるのは現実的ではないが、MCP、secrets、telemetry、permissions、background agents、worktree、shell、network に関わる変更は優先的に見るべきだ。これらは、AIの出力品質ではなく、企業の説明責任に直結する。

## まとめ

Claude Code `2.1.161` は、派手な機能発表ではない。しかし、OpenTelemetry labels、MCP secrets redaction、background agents の見通し、parallel tool calls の失敗分離は、企業がAIコーディングエージェントを運用するための重要な部品である。

日本企業が今やるべきことは、Claude Code を使うかどうかの抽象論ではない。telemetry label schema、MCP registry、background agents runbook、tool failure policy を作ることだ。

Claude Code の能力が上がるほど、開発組織は「AIが何をしたか」を説明できなければならない。今回の更新は、その説明を支える観測、秘匿、並列実行、復旧の細部を整えるものとして評価したい。

## 出典

- [Claude Code Changelog](https://code.claude.com/docs/en/changelog) - Anthropic, 2026-06-02
- [Monitoring](https://code.claude.com/docs/en/monitoring-usage) - Claude Code Docs
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view) - Claude Code Docs
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) - Claude Code Docs
