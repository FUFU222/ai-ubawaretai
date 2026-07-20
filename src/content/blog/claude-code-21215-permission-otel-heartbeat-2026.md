---
title: 'Claude Code 2.1.215、権限修正と監査ログの実務点検'
description: 'Claude Code 2.1.215/2.1.214の権限判定、PowerShell、OpenTelemetry、長時間実行改善を、日本の開発組織が更新前に確認すべき統制項目として整理する。'
pubDate: '2026-07-20'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'AIエージェント', 'セキュリティ', '監査ログ', '開発者ツール', '管理者設定']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Code は、2026年7月19日 UTC に npm の `@anthropic-ai/claude-code` `2.1.215` が公開され、直前の `2.1.214` と合わせて、企業利用で見落としにくい権限・監査・長時間実行の修正を入れた。`2.1.215` 自体は、Claude が `/verify` と `/code-review` skills を自動実行しなくなり、利用者が必要なときに明示的に呼ぶ形へ寄せた更新である。主な実務影響は、その前の `2.1.214` にまとまっている。

この更新は、新モデルや大きなUI変更ではない。しかし日本の開発組織にとっては重要だ。Claude Code を社内標準端末、Windows、PowerShell、バックグラウンドセッション、MCP、OpenTelemetry と組み合わせるほど、細かな権限判定の修正が運用品質に直結する。以前の [Claude Code権限修正、Windows運用の点検軸](/blog/claude-code-2149-powershell-mcp-2026/) では PowerShell と worktree の境界を扱った。今回も同じく、AI コーディングエージェントを「便利なCLI」ではなく、統制対象の開発基盤として見る話である。

さらに [Claude containment、AI権限境界の実務](/blog/anthropic-claude-containment-agent-security-2026/) で整理したように、AI エージェントの安全性はモデルの拒否能力だけでは決まらない。shell の解析、ファイルパス、許可ルール、ネットワーク、監査ログ、長時間処理の状態表示がそろって初めて、企業内で説明できる運用になる。

## 事実: 2.1.215と2.1.214で何が変わったか

まず事実を分ける。

`2.1.215` では、Claude が `/verify` と `/code-review` skills を自分で勝手に走らせないようになった。必要な場合は、利用者が `/verify` または `/code-review` を明示的に呼ぶ。これは小さく見えるが、企業利用では意味がある。検証やレビューは、費用、時間、対象範囲、ログ、レビュー責任が絡むため、自動実行より明示実行のほうが運用ルールに乗せやすい。

`2.1.214` はより広い。公式 changelog では、単一セグメントの `dir/**` allow rules が想定より広い階層の `dir/` に対する書き込みを自動承認していた問題、Windows PowerShell 5.1 の permission-check bypass、Bash の file descriptor redirect や長い command、zsh の subscripts/modifiers、`help` や `man` の unsafe options をめぐる permission checks の修正が並ぶ。

加えて、remote sessions の permission prompt、Docker/Podman remote daemon flags、巨大 settings file、corporate proxy 配下の Windows streaming、PowerShell の標準入力待ち、非 UTF-8 入力、UTF-16LE 書き込み、background daemon、agent view、plugins、hooks、OpenTelemetry など、多数の運用修正が入っている。

重要なのは、これらが単なる「安定化」ではないことだ。多くは、AI エージェントがどの command を安全と判定し、どのファイルへ触れ、どのログを残し、どの長時間処理をどう見せるかに関わる。日本の開発組織が Claude Code を本番開発へ使うなら、更新内容をまとめて確認する価値がある。

## 権限判定の修正は実行境界の変更である

今回の中心は permission checks だ。`dir/**` allow rules の修正は、書いた人の意図と実際のマッチ範囲がずれる問題を直している。単一セグメントの `dir/**` は `<cwd>/dir` を指すべきであり、任意の階層にある `dir/` まで許可すると、想定外の書き込みが通る可能性がある。changelog では、hook の `if:` 条件でも同じ方向へ挙動が変わり、任意階層でマッチさせたい場合は `**/dir/**` を書く形になった。

PowerShell 5.1 の permission-check bypass や、Bash の redirect 形式の解析差分も同じ問題だ。AI エージェントの実行は、モデルが出した文字列を permission analyzer が評価し、shell が別の構文として解釈する流れになる。permission analyzer と shell parser の理解がずれると、利用者は安全だと思った command が、実際には違う場所や違う入力を扱う。

これは [Claude Code権限ルール、subagent管理を再点検](/blog/claude-code-2178-subagent-permissions-2026/) の論点にもつながる。subagent、MCP、skills、hooks が増えるほど、許可ルールは tool 名だけでは足りない。今回の修正は、細かい構文やパス指定を企業の統制面へ引き戻す更新として読むべきだ。

## WindowsとPowerShellの混在環境を先に見る

日本企業では Windows 開発端末、社内 VDI、Windows Server、PowerShell 5.1、PowerShell 7、Git Bash、WSL が混在しやすい。Claude Code を導入する時、macOS や Linux の動作だけで判断すると、Windows 固有の挙動を見落とす。

`2.1.214` では、PowerShell tool commands が標準入力待ちで timeout まで止まる問題、Python scripts が非 UTF-8 入力や非 ASCII 出力で落ちる問題、PowerShell 7 の raw ANSI escape、`where.exe` や `fc.exe` や `diff.exe` の戻り値、Windows PowerShell 5.1 の `>` / `>>` が UTF-16LE を書く問題などが修正された。これは、Windows チームにとって単なる表示問題ではない。AI が生成した script、テスト、調査 command の結果が壊れると、誤ったレビューや再実行につながる。

社内で Claude Code を標準化するなら、Windows 利用者を後回しにしないほうがよい。特に、PowerShell を使う CI、社内 proxy、EDR、文字コードが混ざるログ、古い Windows PowerShell 5.1 が残る端末を優先して検証する。AI コーディングツールは、端末差分がそのまま安全性と再現性の差になる。

## OpenTelemetryとheartbeatは運用の材料になる

`2.1.214` では、OpenTelemetry log events に `message.uuid`、`client_request_id`、`tool_source` attributes が追加された。さらに、OpenTelemetry content attributes の 60KB truncation limit を設定する `CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH` も追加されている。OTel log events が async context の外で trace context を失う問題も修正された。

これは監査ログの粒度に関わる。チームで Claude Code を使う場合、単に「誰かが AI を使った」では足りない。どの message、どの request、どの tool source、どの trace に紐づくのかを追えるほど、障害調査や費用配賦、セキュリティレビューがしやすくなる。[Claude Code監査ラベル追加、AIエージェント運用の要点](/blog/claude-code-otel-agents-mcp-security-2026/) でも触れた通り、Claude Code はすでに観測対象の開発基盤になっている。

また、長時間 tool calls に periodic progress heartbeat が追加された。これまで静かに見えた処理でも進捗信号を返せるようになる。これは開発者体験だけでなく、運用上も意味がある。長時間の build、test、migration dry-run、large repo scan、MCP refresh が黙ると、失敗なのか、詰まっているのか、単に待てばよいのか判断しづらい。heartbeat は、放置される自動処理を減らすための基礎になる。

## 日本企業が今週確認すること

日本の開発組織が最初に見るべき項目は5つある。

第一に、Claude Code の標準バージョンを決める。npm metadata では `2.1.215` が 2026年7月19日 UTC に公開されている。社内配布、VDI、CI runner、委託先端末で、どのバージョンを下限にするかを決め、古い固定バージョンを棚卸しする。

第二に、permission rules と hooks を見直す。`dir/**` を使っている場合、期待するマッチ範囲が `<cwd>/dir` なのか、任意階層の `dir/` なのかを確認する。後者なら `**/dir/**` へ明示的に変える。`deny` / `ask` rules は any-depth match を保つため、allow と hook 条件の違いも運用文書へ残したい。

第三に、Windows/PowerShell の検証を分ける。PowerShell 5.1 と 7、Git Bash、WSL、CI runner、社内 proxy、非 UTF-8 入力、非 ASCII 出力、redirect、標準入力待ちを含む小さな確認セットを作る。Windows は例外対応ではなく、導入判定の本線に入れるべきだ。

第四に、OTel の属性設計を更新する。`message.uuid`、`client_request_id`、`tool_source` をログ分析に使うかを決める。content attribute の最大長を広げる場合は、個人情報、顧客情報、社内 URL、秘密情報が監視基盤に残らないかを先に確認する。監査のために全部出す設計は、あとで保持とアクセス権の問題になる。

第五に、長時間処理の待ち方を決める。heartbeat が見えるようになっても、どの job を何分待つか、どの tool failure を止めるか、background sessions を誰が片付けるかを決めなければ運用は安定しない。特に `pkill -f`、background daemon、remote control、agent view 周辺の修正は、長時間運用をするチームほど確認したい。

## まとめ

Claude Code `2.1.215` と `2.1.214` は、派手な機能追加よりも、企業利用の足回りを固める更新である。権限判定、Windows/PowerShell、Docker/Podman、hooks、OpenTelemetry、heartbeat、background sessions は、AI コーディングエージェントを組織で使う時の実行境界そのものだ。

日本企業は、この更新を「最新版へ上げる」だけで終わらせないほうがよい。許可ルール、Windows 検証、OTel 属性、長時間処理、skills の明示実行をセットで見直すべきだ。Claude Code が個人の補助ツールから開発基盤へ近づくほど、更新管理はセキュリティ、監査、費用管理、委託先管理の共同作業になる。

## 出典

- [Claude Code CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) - Anthropic / GitHub, 2026-07-19
- [@anthropic-ai/claude-code 2.1.215](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.215) - npm, 2026-07-19
- [CHANGELOG.md commit history](https://github.com/anthropics/claude-code/commits/main/CHANGELOG.md) - Anthropic / GitHub, 2026-07-19
