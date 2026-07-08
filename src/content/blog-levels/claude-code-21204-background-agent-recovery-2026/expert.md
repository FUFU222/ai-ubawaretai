---
article: 'claude-code-21204-background-agent-recovery-2026'
level: 'expert'
---

Claude Code 2.1.204 は、release note だけを見ると headless `SessionStart` hook の streaming 修正である。だが 2.1.203 と連続した update として読むと、企業が Claude Code を常駐 agent、CI worker、remote-controlled local session、multi-worktree automation に組み込むときの failure mode がかなり見えてくる。

重要なのは、2.1.203/2.1.204 が「agent が賢くなった」release ではないことだ。むしろ、agent runtime が途中で止まり、再開し、別 UI から操作され、daemon をまたぎ、worktree を分け、gateway を通り、hook と OTel を吐くときの制御面を直している。これは platform engineering の話である。

この記事では、公開 changelog、npm metadata、Claude Code docs から確認できる事実を前提に、企業運用でどの regression test を組むべきかを整理する。[Claude Code 2.1.200の復旧設計](/blog/claude-code-21200-manual-background-recovery-2026/) と [Claude Code 2.1.201のmessage構造検証](/blog/claude-code-21201-system-role-harness-reminders-2026/) の次に見るべき領域は、session identity と execution location である。

## 事実: 2.1.204はSessionStart hookの可観測性を直した

npm metadata では `@anthropic-ai/claude-code` の 2.1.204 が 2026年7月8日 00:04:57 UTC に公開されている。公式 changelog の該当項目は、headless session の `SessionStart` hook 中に hook event が streaming されず、remote worker が mid-hook で idle reap され得る問題を修正した、というものだ。

この記述から分かる範囲は限定される。修正対象は hook 実行そのものではなく、hook event の streaming と remote worker の idle 判定である。したがって、利用者が見る通常の対話 UI だけで差を確認するのは難しい。headless execution、remote worker、hook lifecycle、idle timeout を持つ環境で再現性を見るべき更新である。

`SessionStart` hook は、実装次第で policy check、workspace setup、credential check、repository metadata capture、monitoring bootstrap を担う。ここで progress signal が出なければ、supervisor は「作業中」と「沈黙」を区別できない。特に remote worker が idle reap されるなら、session は model call 前に死ぬ。これは AI quality ではなく orchestration quality の問題だ。

## 事実: 2.1.203はdaemon、worktree、Remote Controlをまたぐ

2.1.203 の changelog は、常駐 session の不具合修正が大半を占める。login expiry warning や Manual permission badge のような UX もあるが、企業運用で重いのは background daemon、worktree isolation、environment inheritance、Remote Control、agent command routing である。

daemon token stale により background session が attach、reply、stop に永久応答しなくなる問題は、operations 上の重大な failure mode だ。stop が効かない agent は、長時間課金だけでなく、repository や SaaS に対する tool call を継続する可能性がある。`claude agents` へ戻ったときに running subagents を止めて prompt を最初から re-run していた問題も、idempotency を壊す。

worktree-isolated subagent が親 checkout で shell command を実行する問題は、execution location の取り違えである。multi-repo workspace の nested repository で worktree creation が拒否される問題も、isolation guarantee の前提を揺らす。AI agent の出力品質を評価する前に、どの filesystem tree で command が走ったかを保証しなければならない。

Remote Control 関連では、mobile/web から interactive session へ送った command が `Unknown command` になる問題、caption なしの image/file が silently drop される問題、permission mode 表示が誤る問題が修正されている。Remote Control docs は、web/mobile が local machine 上の session を操作する window であり、code は local filesystem に触ると説明している。つまり Remote Control は cloud IDE ではなく、local execution を遠隔操作する UI である。入力欠落や mode 表示の誤りは、local code execution の監査に直結する。

## 分析: test matrixはversion確認だけでは足りない

ここからは分析である。

企業が Claude Code を標準化するとき、よくある確認は `claude --version` と代表 task の smoke test で終わる。しかし 2.1.203/2.1.204 の修正範囲を見ると、それでは不十分だ。version が同じでも、実行面は CLI foreground、headless runner、background daemon、Remote Control、desktop/IDE、agent view で異なる。

少なくとも、次の軸で matrix を作るべきだ。

- foreground interactive session と headless session
- local terminal と Remote Control mobile/web
- single checkout と worktree-isolated subagent
- direct Anthropic endpoint と社内 gateway / `ANTHROPIC_BASE_URL`
- short task と long-running background task
- hook なし、短い `SessionStart` hook、長い `SessionStart` hook
- attach/reply/stop を行う session と放置される session

この matrix は重く見えるが、すべてを毎回 full test にする必要はない。release adoption の gate として代表 case を選び、残りは週次または月次の platform regression に入れる方法でよい。重要なのは、AI answer の見た目ではなく、session identity、location、routing、observability を別々に測ることだ。

## 復旧時の同一性をどう測るか

background session の復旧は、「また動いた」だけでは合格にできない。同じ作業として戻ったかを測る必要がある。具体的には、session id、agent id、working directory、branch、worktree path、prompt hash、parent/child relation、model/provider、permission mode、gateway route を採取する。

Claude Code docs の agent view は、background session が terminal detached でも走り続け、あとから open/reply できると説明している。この機能を CI や社内 runner で使うなら、agent view で見える状態と、実際の process / worktree / log が一致するかを検証する。

テストは破壊的である必要はない。たとえば、subagent に次のような読み取りだけの task を渡せばよい。

```text
Record pwd, git top-level, branch, current commit, selected env var names, and a marker file checksum. Do not modify files.
```

この結果を parent session、background session、Remote Control 経由の reply 後、agent view からの再 open 後で比較する。値が変わるなら、実際の migration や test runner を任せる前に原因を潰す。

## gatewayと環境変数の継承

2.1.203 には、background/agent-view session が shell-exported `ANTHROPIC_BASE_URL` を落とし、API key を default endpoint に送って 401 になる問題の修正が含まれる。この問題は、認証エラーで済めばまだよい。もし社内 gateway、proxy、audit relay、data residency routing を `ANTHROPIC_BASE_URL` に依存しているなら、route mismatch は governance incident になり得る。

[Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) で扱った managed settings と同じく、endpoint routing は利用者の気分で変えるものではない。interactive session と background session で request path が一致するか、gateway log で確認する必要がある。

OpenTelemetry docs は、Claude Code CLI が model request と tool execution の span、token/cost metrics、prompt/tool result の structured log event を出せると説明している。本文を保存するかどうかは別の privacy decision だが、少なくとも model、provider、status、retry、tool event、request id は routing audit に使える。日本企業では、まず metadata-only で collector に出し、必要な repository だけ詳細 log を有効化する段階設計が現実的だ。

## hooksの観測設計

2.1.204 の `SessionStart` hook streaming 修正は、hook を「便利な前処理」ではなく「observable lifecycle event」として設計する必要を示している。hook が長くなるほど、supervisor は progress signal を必要とする。

企業の hook には、次のような処理が入りやすい。

- repository classification
- secrets policy check
- allowed tool policy load
- proxy / certificate setup
- package install cache check
- OTel environment setup
- branch naming / ticket metadata capture

これらが沈黙したまま走ると、idle timeout との相性が悪い。hook は、成功/失敗だけでなく、開始、主要 step、終了を event として出すべきだ。2.1.204 後は、headless session でその event が worker 側に届き、idle reap の判定と矛盾しないかを見る。

## Remote Controlの監査観点

Remote Control は、便利な mobile approval UI として導入されがちだ。しかし docs の説明どおり、実行場所は local machine である。これは良い面も悪い面もある。source code を cloud VM へ移さずに済む一方、local machine の filesystem、credentials、network route がそのまま効く。

したがって、Remote Control の regression test は UI 操作だけでは足りない。mobile/web から送った slash command が session command として解釈されるか、file/image attachment が transcript と tool context に残るか、caption なしでも欠落しないか、permission mode 表示が実際の mode と一致するかを確認する。

また、管理者が Remote Control を disable できる設定や、Team/Enterprise で Owner が toggle を有効化する条件も検証対象に入る。日本企業の持ち出し端末、VDI、業務委託 PC では、同じ Claude Code でも Remote Control を許可する端末としない端末が分かれる可能性がある。ここを policy と test で分けないと、現場では「できる人とできない人がいる」だけに見える。

## 日本企業向けの導入判断

2.1.203/2.1.204 は、Claude Code を止めずに動かすためだけの release ではない。むしろ、止める、戻す、継続する、再接続する、別 UI から操作する、別 worktree で動かす、別 endpoint へ送らない、という運用境界を固める release である。

日本企業が今やるべきことは、最新版採用のチェックリストを次のように書き換えることだ。

1. Version: `@anthropic-ai/claude-code` の version と公開時刻を記録する
2. Identity: session id、agent id、worktree path、branch が復旧後も一致する
3. Control: attach、reply、stop が background session に効く
4. Routing: `ANTHROPIC_BASE_URL`、proxy、gateway、provider が foreground/background で一致する
5. Observability: hook、tool、model request、retry、stop reason が OTel または gateway log で追える
6. Remote input: mobile/web から command、file、image、permission mode が欠落なく扱われる

この checklist は [Claude CodeのOpenTelemetry監査設計](/blog/claude-code-otel-agents-mcp-security-2026/) と組み合わせると実装しやすい。ログの目的は AI の全発言を保存することではない。session がどの環境で、どの権限で、どの endpoint に、どの tool を使って作業したかを後から説明することだ。

## まとめ

Claude Code 2.1.204 の headline は、headless `SessionStart` hook の streaming 修正である。しかし実務上は、2.1.203 と合わせて、常駐 agent runtime の復旧品質を点検する release と見るべきだ。

AI coding agent を企業の CI や開発基盤へ入れると、失敗の中心は回答品質だけではなくなる。session が同じものとして戻るか、worktree が混ざらないか、stop が効くか、gateway を外れないか、hook の進行が観測できるか。ここを release gate に入れた組織ほど、長時間 agent を安全に使いやすくなる。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)
- [@anthropic-ai/claude-code npm package](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view)
- [Observability with OpenTelemetry](https://code.claude.com/docs/en/agent-sdk/observability)
- [Continue local sessions from any device with Remote Control](https://code.claude.com/docs/en/remote-control)
