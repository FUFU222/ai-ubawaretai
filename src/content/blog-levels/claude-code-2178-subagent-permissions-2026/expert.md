---
article: 'claude-code-2178-subagent-permissions-2026'
level: 'expert'
---

Claude Code 2.1.178 は、表面的には小さな changelog の積み上げに見える。しかし、企業の開発基盤として Claude Code を扱うなら、今回の更新はかなり重要である。`Tool(param:value)` permission rule、nested `.claude/skills` の近接優先、subagent 起動前の classifier 評価、subagent `disallowedTools` における MCP server-level specs 修正は、どれも agentic development の権限境界に直結している。

このサイトでは、すでに [Claude Code 2.1.149の権限修正](/blog/claude-code-2149-powershell-mcp-2026/) で PowerShell、worktree、MCP 管理設定を扱った。また [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) では、Claude Code や Cowork を安全に使うには、モデルの拒否だけでなく filesystem、network、credential、MCP、workspace の境界を設計する必要があると整理した。2.1.178 は、この流れをさらに policy authoring の粒度へ寄せている。

さらに [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、Claude Code は Anthropic 直結だけでなく Bedrock、Vertex、Foundry、LLM gateway など企業の既存基盤へ乗り始めている。実行経路、モデル選択、MCP、subagent が増えるほど、企業が説明すべき対象は増える。今回の更新は、便利さの拡大に対して最小権限を追いつかせるためのものだ。

## 事実: Tool(param:value)は許可判断の入力面を広げた

2.1.178 の主な追加は、permission rules で `Tool(param:value)` syntax を使えるようになったことだ。tool name だけでなく input parameter へ一致させ、wildcard も使える。changelog の例では、`Agent(model:opus)` により Opus subagents をブロックする使い方が示されている。

この変更の本質は、tool permission が binary allow/deny から capability policy へ近づいたことにある。企業で問題になるのは、Agent tool そのものではない。どの model、どの role、どの target、どの MCP、どの path、どの command を使うかでリスクが変わる。Bash も同じで、`npm test`、`git diff`、`curl`、`ssh`、`rm`、credential を読む command は、すべて Bash という tool name に収まってしまう。

`Tool(param:value)` は、この粗さを下げる。もちろん、すべてのリスクをこの構文だけで制御できるわけではない。実際には hooks、settings、managed settings、sandbox、MCP allowlist、network policy、endpoint policy を合わせて使う必要がある。それでも、AI agent が tool call を組み合わせる時代には、tool name より input parameter を見た制御が必要になる。

日本企業での実務価値は、モデル費用や品質だけではない。たとえば、調査用途では軽いモデルや read-only tool だけを許し、実装修正では対象 path を限定し、高リスク作業では Opus subagent や外部送信を禁止する、といった運用がしやすくなる。これを個人設定で散らすのではなく、managed settings や repository template として配るのが現実的だ。

## 事実: subagentは権限の複製点になる

Claude Code の subagent は、複雑な作業を分担するために有用である。調査、実装、テスト、レビュー、ドキュメント、ログ解析を分ければ、長い開発作業を進めやすい。しかし、企業セキュリティの観点では、subagent は権限の複製点でもある。

2.1.178 では、auto mode において subagent spawn が launch 前に classifier で評価されるようになった。changelog は、subagent が blocked action を review なしで要求できる gap を閉じたと説明している。これは、main agent の permission boundary を subagent 経由で回避しないための修正として読める。

同時に、subagent `disallowedTools` で MCP server-level specs が黙って無視される問題も修正された。`mcp__server`、`mcp__server__*`、`mcp__*` のような指定が subagent で効かないなら、MCP を subagent ごとに切る運用は成立しない。今回の修正により、MCP を含む subagent 最小権限を設計しやすくなった。

ここで重要なのは、MCP が単なる読み取り source ではないことだ。GitHub、Jira、Slack、Google Drive、Confluence、DWH、CRM、監査ログ、社内 API などへ接続する MCP は、読み取りだけでも機密情報を context に入れる。書き込みできる MCP なら、issue 更新、PR 作成、ファイル変更、チケット移動、顧客情報照会、外部送信が発生する可能性がある。

したがって、subagent policy は role-based に設計すべきだ。調査 agent は read-only MCP と限定 path、test agent は決まった command、review agent は diff と static analysis だけ、implementation agent は対象 directory と branch だけ、security agent は専用 sandbox と高い監査ログ、というように分ける。すべての subagent に同じ MCP と同じ file permission を渡すのは、分業ではなく権限拡散である。

## nested .claudeは設定のスコープ設計を変える

2.1.178 の nested `.claude` 関連更新も、企業運用では軽くない。nested `.claude/skills` が作業対象ファイルの近くで読み込まれ、名前衝突時には directory-qualified name で共存する。agent、workflow、output-style も working directory に近いものが優先される。project-scope workflow の保存先も近い既存 `.claude/workflows/` になる。

これは monorepo に向いている。大企業の repository では、フロントエンド、バックエンド、モバイル、データ、インフラ、顧客別 adapter、社内管理画面、公開 API が同居することがある。全体で1つの instruction だけを使うと、対象領域ごとの品質基準や禁止操作を表現しにくい。近い `.claude` が優先されるなら、domain-specific skills や workflows を置きやすい。

一方で、nested `.claude` は policy injection の入口にもなる。悪意がなくても、あるチームが便利な workflow を追加し、その workflow が別チームの安全基準と合わないことは起きる。委託先や外部 contributor が触れる directory に `.claude` を置けるなら、AI の作業方針や tool 利用に影響する設定変更を誰がレビューするのかを決める必要がある。

ここは、通常のソースコード管理と同じように扱うべきだ。`.claude/skills`、`.claude/agents`、`.claude/workflows`、settings、managed settings に相当するファイルは、CODEOWNERS、branch protection、review checklist の対象にする。設定ファイルだから軽いのではない。AI エージェントがどの文脈を読み、どの手順で作業し、どの出力形式を使うかを変えるので、実質的には開発プロセスのコードである。

## 分析: 権限設計は4階層で考える

日本企業が Claude Code 2.1.178 を受けて設計を見直すなら、4階層で考えるとよい。

第1階層は environment boundary である。どの directory を mount するか、workspace 外を読めるか、network egress をどこまで許すか、credential をどこに置くか、devcontainer や sandbox を使うかを決める。これは [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) の主題であり、permission prompt より先に置くべき境界である。

第2階層は tool permission である。Read、Edit、Write、Bash、Agent、MCP、browser、workflow の許可範囲を決める。今回の `Tool(param:value)` はこの階層を強化する。tool 単位の許可から、入力引数、モデル、対象 server、対象 path へ寄せられる。

第3階層は role policy である。人間の role と subagent の role を分ける。社員、委託先、SRE、AppSec、開発者、PM、QA、データ担当で、許可する作業は違う。subagent も同じで、調査、修正、テスト、レビュー、リリース支援を同じ権限にしない。

第4階層は observability である。どの tool call が実行され、どの MCP が呼ばれ、どの file が読まれ、どの command が実行され、どの subagent が何をしたかを後から見られるようにする。OpenTelemetry、proxy logs、session logs、GitHub audit logs、DLP、SIEM をどうつなぐかまで決める。権限を細かくしても、実行結果を見られなければ運用は続かない。

## 委託開発ではsubagentとMCPを標準化する

日本のシステム開発では、委託先、再委託、共同開発、社内外の混成チームが多い。Claude Code のような agent を導入するとき、全員が同じリスク感覚を持つ前提は置けない。だからこそ、subagent と MCP は個人の好みではなく、プロジェクト標準として配るべきだ。

委託先に許すべきなのは、まず低リスクな read-only 調査やテスト補助である。顧客情報、本番ログ、秘密情報、契約情報、認証基盤、課金機能に触る MCP は、委託先の端末や個人設定から直接見せないほうがよい。必要なら scoped account、sandbox data、期限付き token、監査ログ付き gateway を使う。

subagent も同じである。委託先が自由に subagent を追加できると、便利な一方で、どの subagent がどの tool を呼ぶのかを元請け側が説明しにくくなる。標準 subagent catalog を作り、allowedTools と disallowedTools を定義し、MCP server-level specs を明示する。2.1.178 の修正は、その catalog を現実に近づける。

この文脈では、[PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) のような CoE 型の運用が参考になる。大規模利用では、利用者教育だけでは足りない。標準 role、標準 workflow、レビュー責任、費用管理、監査、例外承認を一体で設計する必要がある。

## モデル制御は前後の更新と合わせて見る

今回の 2.1.178 は `Tool(param:value)` の例として `Agent(model:opus)` を挙げている。直前の 2.1.175 では `enforceAvailableModels` managed setting が追加され、2.1.176 では `availableModels` enforcement の alias bypass や `/fast` の allowlist 外切替が修正された。つまり、Claude Code ではモデル選択そのものも企業管理の対象として整備されつつある。

これは費用管理だけの話ではない。モデルごとに利用可能機能、コンテキスト、速度、コスト、クラウド経路、データ処理境界、ログの残り方が変わる可能性がある。Auto mode や subagent がモデル選択を隠すほど、企業側は「どの条件なら Opus を使ってよいか」「どの作業は Sonnet や軽量モデルでよいか」「どの経路ではモデル固定か」を決める必要がある。

`Tool(param:value)` と `availableModels` は別機能だが、運用では一緒に見るべきだ。モデル allowlist で大枠を決め、Agent tool の parameter rule で subagent ごとの利用を絞り、LLM gateway や cloud provider 側で請求・監査・ルーティングを記録する。ここまでつながって初めて、AI 開発エージェントの費用とリスクを説明できる。

## 今週の実装チェックリスト

まず、Claude Code の標準バージョンを決める。2.1.178 以降を標準にするなら、個人端末、CI、remote session、background daemon、VDI、委託先端末の更新経路を確認する。npm で配布している組織は lockfile や wrapper、MDM 配布、社内 package mirror も見る。

次に、permission rule を棚卸しする。tool name だけで広く許可している rule を洗い出し、`Tool(param:value)` で絞る候補を作る。Agent、Bash、Read、Edit、Write、MCP、browser、workflow は優先度が高い。

3つ目に、subagent catalog を作る。role、目的、allowedTools、disallowedTools、使える MCP、使える model、対象 path、出力形式、レビュー責任を表にする。subagent を自由に増やすのではなく、標準 role から始める。

4つ目に、MCP allowlist を subagent 単位へ分ける。`mcp__*` のような広い指定をどう使うか、server-level と tool-level をどう組み合わせるか、production data に触る MCP をどの role へ見せるかを決める。

5つ目に、nested `.claude` を code review 対象にする。`.claude/skills`、`.claude/workflows`、agents、output-style、settings を CODEOWNERS に含め、特定 directory だけのローカル最適化が全体 policy と矛盾しないかを見る。

6つ目に、ログを確認する。subagent が起動した事実、tool call、MCP call、拒否された action、permission prompt、model selection、remote control の接続失敗などが、後から追えるかを確認する。見えないものは運用できない。

## まとめ

Claude Code 2.1.178 は、企業が AI コーディングエージェントを本番の開発基盤へ入れるときに避けられない論点を、少しずつ設定機能へ落としている。`Tool(param:value)` は tool permission を引数条件へ広げ、subagent classifier は権限の抜け道を狭め、MCP `disallowedTools` 修正は subagent 単位の接続制御を現実的にし、nested `.claude` は monorepo 内の局所最適化を支える。

日本企業に必要なのは、Claude Code を自由化することでも、過度に禁止することでもない。作業分類、subagent role、MCP、model allowlist、nested settings、監査ログを一枚の運用設計にまとめることである。

AI エージェントの価値は、長い作業を任せられることにある。しかし長い作業を任せるほど、権限、経路、設定、ログの説明責任は増える。2.1.178 は、Claude Code を個人の開発補助から組織の開発基盤へ移すチームにとって、権限テンプレートを作り直すタイミングだ。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-16
- [@anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code) - npm package metadata
- [Claude Code settings](https://docs.anthropic.com/en/docs/claude-code/settings) - Anthropic Docs
- [Claude Code security](https://docs.anthropic.com/en/docs/claude-code/security) - Anthropic Docs
