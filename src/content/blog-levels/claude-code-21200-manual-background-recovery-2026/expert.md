---
article: 'claude-code-21200-manual-background-recovery-2026'
level: 'expert'
---

Claude Code 2.1.200 は、agent runtime の派手な能力追加ではなく、human-in-the-loop と supervisor recovery の境界を修正した release である。企業の platform team にとっては、新しい tool よりもこちらの方が重要になり得る。

常駐型 coding agent の障害は、単純な crash だけではない。質問待ちなのか、permission 待ちなのか、process は死んでいるが session state は生きているのか、cancel 済みの turn が復旧対象に戻っていないか、古い binary が新しい state を引き継いでいないかを区別する必要がある。2.1.200 の変更群は、まさにこの state machine の曖昧さを減らしている。

既存の [Claude Code 2.1.161におけるOpenTelemetryとbackground agents](/blog/claude-code-otel-agents-mcp-security-2026/) は、agent の活動を team、repository、費用単位で観測する論点を扱った。今回の更新は、その観測対象が停止した後に、何を同じ実行として復旧させるかを扱う。可観測性と復旧可能性は別の品質属性であり、両方が必要だ。

## 事実: 2.1.200が変更した状態遷移

公式 release notes の変更を、運用上の状態遷移に分けると理解しやすい。

### 人間入力待ち

`AskUserQuestion` dialog は、既定では auto-continue しなくなった。idle timeout が必要な場合は `/config` で opt-in する。この既定変更は、無応答を暗黙の意思決定として扱わない方向である。

また、従来 `default` と呼ばれていた permission mode は、CLI、`--help`、VS Code、JetBrains で Manual と表示される。CLI option と settings では `manual` が `default` と並んで受理される。これは表示・alias の変更であり、permission semantics が全面的に別物になったという記述ではない。

`AskUserQuestion` と permission prompt は、runtime では異なる event として扱うべきだ。前者はタスクの意味や選択に関する入力、後者は tool invocation の許可である。permission rule を定義しても、仕様判断の委譲範囲は定義できない。

### session processの復旧

sleep/wake 後や stalled session の reopen 後に background session が mid-turn で静かに停止する不具合が修正された。公式 agent view ドキュメントは、2.1.200 以降、sleep 中も session を保持し、wake 後に supervisor が process へ再接続すると説明している。応答しない session を開いた場合は process を再起動し、中断した response から続ける。

ここで「response から続ける」と「turn を最初から再実行する」は同じではない。外部副作用のある tool call が完了している場合、turn 全体の replay は重複を生む。2.1.200 が、stall respawn 後に `Esc` で cancel された turn を再実行する問題を直したことは、cancel intent を durable state として扱う必要性を示している。

### daemon ownershipの復旧

crash 後に stale `daemon.lock` が残り、その lock に記録された PID が OS によって別 process へ再利用されると、background agent が起動しなくなる問題が修正された。PID は時点をまたいだ一意 identifier ではないため、PID の存在確認だけで lock owner を判断すると誤る。

さらに、古い build を再インストールした場合の daemon handover も修正され、version 文字列だけではなく embedded build timestamp で recency を判定するようになった。roster についても、一時破損で orphan cleanup が恒久的に無効になる問題、旧 binary が新 binary の field を保持しない問題、restart 時に socket auth token が消える問題が対象になっている。

これは agent daemon が単一 process ではなく、versioned schema と credential を持つ control plane であることを示す。rollback は binary の差し替えだけでは完了しない。

## 分析: exactly-onceではなく再入可能性を設計する

ここからは運用設計上の分析である。

distributed system と同様に、coding agent の実行で厳密な exactly-once を保証するのは難しい。local process が tool result を保存する直前に落ちた場合、外部 API 側では成功していても、session state 側では未完了に見える可能性がある。したがって、supervisor が改善されても、業務側は idempotency と reconciliation を持つべきだ。

たとえば次のように設計する。

- issue 作成や deployment request には idempotency key を付ける
- commit 作成前に working tree と HEAD を再確認する
- package publish や release 作成は、同じ version の存在確認を先に行う
- schema migration は適用済み version を問い合わせてから進める
- notification は session ID と turn ID を payload に含め、重複を抑止する
- 復旧時は「tool をもう一度呼ぶ」より「外部状態を照合する」を先にする

stalled response の継続性が上がることは、こうした guard を不要にするものではない。むしろ、長時間 session を企業運用へ載せる現実味が増すほど、外部副作用の設計責任が表に出る。

[Claude Code 2.1.178のpermission ruleとsubagent制御](/blog/claude-code-2178-subagent-permissions-2026/) で扱った最小権限も同じである。tool を呼べることと、retry してよいことは別の policy だ。permission allow rule は再実行の安全性を保証しない。

## Human-in-the-loopをSLAとして実装する

質問待ちを安全にするには、auto-continue を無効にするだけでは足りない。入力待ちが永遠に埋もれれば、運用上は停止と同じである。

公式 agent view ドキュメントでは、session state として Working、Needs input、Idle、Completed、Failed、Stopped が示されている。Needs input は特定の質問または permission decision を待っている状態であり、2.1.198 以降は background session が入力待ち、完了、失敗になった際に terminal notification channel と Notification hook を利用できる。

企業では、この event を既存の通知・当番系へ接続する。

1. `agent_needs_input` を受けたら session ID、repository、owner、質問要約、risk class を付ける
2. 低リスクな仕様確認は担当 chat へ、高リスクな本番操作は change management 系へ送る
3. 応答期限を過ぎたら auto-answer せず、owner または backup owner へ escalate する
4. 長時間応答がない session は停止または保留へ移し、cost と credential exposure を抑える
5. 回答者、回答内容、時刻を session transcript と監査ログで対応付ける

idle timeout は throughput 改善の設定であり、approval bypass として使うべきではない。timeout を使えるのは、無応答時の既定値が業務 policy として事前承認され、外部副作用が限定されている質問に絞る方がよい。

たとえば「追加の静的解析を実行するか」は既定 yes にできる場合がある。一方、「本番へ deploy するか」「顧客データを参照するか」「高額な model を追加利用するか」は timeout で進めない。

## Permission modeの名称変更を構成管理へ反映する

Manual 表示への変更は小さく見えるが、enterprise rollout では設定 drift と support drift を生み得る。

管理対象は少なくとも3層ある。

- **machine-readable value**: `default` または `manual`
- **UI label**: Manual
- **組織内の意味**: どの tool が ask、allow、deny になるか

社内標準を UI label だけで定義すると、version 差や locale 差で壊れる。反対に machine-readable value だけで手順書を書くと、利用者が画面上で見つけられない。構成管理では canonical value を一つ決め、support document では alias と UI label を併記するのがよい。

また、Manual は「すべての操作で必ず人が確認する」という意味ではない。公式 permission docs では permission mode が baseline となり、その上に allow、ask、deny rule が重なる。read-only command の扱いや protected path もあるため、実効権限は mode 名だけで評価できない。

[Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) で扱ったように、managed settings を配る組織では、設定 repository の test fixture を用意し、CLI と IDE の双方で実効状態を確認したい。

## Supervisor、lock、rosterの障害試験

2.1.200 を評価する regression test は、機能試験より fault injection に寄せるべきだ。

### sleep/wake

長い response と background tool を実行中に machine を sleep し、wake 後に同じ session が継続するか確認する。外部 API call の前後で sleep させ、重複がないかも見る。MDM の sleep policy や VPN 再接続を含む実端末で行う。

### cancelとstall respawn

意図的に network を切断して stall を作り、`Esc` で turn を cancel した後に再接続する。cancel 済み turn が復活しないこと、部分的に完了した file edit が検知されることを確認する。

### stale lockとPID reuse

直接 production state を壊すのではなく隔離環境で daemon crash を再現し、lock が残る条件と recovery を確認する。lock file の削除を runbook の第一手にせず、owner process、build timestamp、session roster を記録してから復旧する。

### upgradeとrollback

新 build で background session を作り、旧 build を再導入した際に daemon ownership がどうなるかを観察する。schema downgrade で未知 field が失われないか、socket auth token が維持されるか、agent view が同じ roster を表示するかを確認する。

### rate limitとsubagent failure

subagent が出力前に rate limit へ到達する条件を検証し、親 agent が空文字を成功結果として扱わず、明示的な failure を受けることを確認する。[Claudeの障害・rate limit・local failureの切り分け](/blog/anthropic-claude-status-errors-reliability-2026/) と合わせ、retry budget を原因別に分ける。

## 監視指標とrunbook

最低限、次の指標を取るとよい。

- `needs_input` になった session 数と滞留時間
- background session の stall recovery 回数
- wake 後の reconnect 成功率
- daemon restart と handover 回数
- stale lock 検出数
- cancel 後に tool call が発生した件数
- subagent failure が親へ伝播した割合
- 同一 idempotency key の外部操作重複数
- binary version と supervisor build timestamp の不一致

runbook は状態ごとに分ける。

**Needs input** では、質問内容と回答権限者を確認する。**Stalled** では、同じ session の attach/reopen と supervisor recovery を先に試し、新規 session の再投入を避ける。**Failed** では rate limit、service incident、local resource、configuration corruption を切り分ける。**Stopped** では利用者の cancel intent を尊重し、自動復旧対象へ戻さない。

さらに、recovery 前後の `git status`、HEAD、worktree、process、session ID を記録する。AI agent の障害対応で最も避けたいのは、復旧担当者が状態を理解できず、別 session を起動して同じ変更を重ねることである。

## 導入判断

2.1.200 は、background session を使う組織には更新価値がある。特に laptop sleep、複数 worktree、agent view、subagent、長時間 turn を使う場合、修正対象と運用実態が重なる。

ただし、release notes を見て即時全社展開するより、次の順序が安全だ。

1. 検証 group で Manual 表示と既存 settings の互換性を確認
2. `AskUserQuestion` の待機と notification hook を確認
3. sleep/wake、cancel、stall、daemon restart の fault test を実施
4. 外部副作用のある tool に idempotency または reconciliation を追加
5. version pin と rollback runbook を更新
6. 成功、失敗、入力待ち、停止を dashboard で分離

今回の release は、agent の自律性を上げる話ではなく、自律実行と人間判断の境界を壊さないための話だ。常駐エージェントを本番運用するなら、平均完了時間だけでなく、cancel の尊重、重複副作用、入力待ち時間、復旧の一貫性を SLO に含めるべきである。

## まとめ

Claude Code 2.1.200 は、Manual permission、`AskUserQuestion` の待機、background supervisor の recovery を同時に見直した release である。これらは別機能に見えるが、共通するテーマは **誰が次の状態遷移を決めるか** だ。

質問待ちでは人間が決める。stall recovery では supervisor が同じ session を継続する。cancel 後は自動復旧しない。version handover では新しい build が ownership を持つ。subagent failure は成功へ丸めず親へ返す。この原則が揃って初めて、長時間の coding agent を組織の開発基盤として扱える。

企業側に残る責任は、外部操作の idempotency、通知 SLA、権限者の定義、version rollback、状態別 runbook である。2.1.200 は runtime の穴を埋めたが、業務の exactly-once と承認責任まで自動的に保証するわけではない。

## 出典

- [Claude Code v2.1.200 release（Anthropic公式GitHub）](https://github.com/anthropics/claude-code/releases/tag/v2.1.200)
- [Choose a permission mode（Claude Code Docs）](https://code.claude.com/docs/en/permission-modes)
- [Manage multiple agents with agent view（Claude Code Docs）](https://code.claude.com/docs/en/agent-view)
- [Create custom subagents（Claude Code Docs）](https://code.claude.com/docs/en/sub-agents)
