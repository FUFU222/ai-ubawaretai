---
article: 'claude-code-21215-permission-otel-heartbeat-2026'
level: 'child'
---

Claude Code `2.1.215` と `2.1.214` は、見た目には細かな更新に見える。しかし、企業で AI コーディングツールを使う人にとっては、かなり大事な内容を含んでいる。特に関係するのは、権限チェック、Windows/PowerShell、監査ログ、長時間実行の見え方だ。

今回のポイントは、Claude Code が「何を勝手に実行してよいか」をより慎重に扱う方向へ進んでいることだ。`2.1.215` では、Claude が `/verify` や `/code-review` skills を自分で走らせなくなった。使いたい時は、人間が明示的に `/verify` や `/code-review` を呼ぶ。レビューや検証は時間も費用もかかるので、会社で使うならこのほうが管理しやすい。

## 何が変わったのか

大きな実務影響は `2.1.214` にある。公式 changelog では、`dir/**` のような許可ルールが想定より広く効いてしまう問題、Windows PowerShell 5.1 の権限チェック回避、Bash の redirect や長い command の判定、zsh の構文、`help` や `man` command の安全判定が修正された。

これは難しく聞こえるが、要するに「AI が出した command を安全かどうか判断する部分」が直されたということだ。AI コーディングツールでは、モデルが command を提案し、ツール側が安全かどうかを見て、最後に shell が実行する。この3つの理解がずれると、思ったより広いファイルを読んだり、意図しない場所へ書いたりする可能性がある。

以前の [Claude Code権限修正、Windows運用の点検軸](/blog/claude-code-2149-powershell-mcp-2026/) でも、PowerShell と worktree の境界が問題になった。今回の更新も、同じ系統の安全性改善として見たほうがよい。

## Windowsを後回しにしない

日本の会社では、macOS と Linux だけでなく、Windows 端末や PowerShell を使う現場が多い。今回の `2.1.214` では、PowerShell tool commands が標準入力待ちで止まる問題、Python scripts が文字コードで落ちる問題、`>` や `>>` が UTF-16LE ファイルを書いてしまう問題なども修正されている。

これは、Windows 利用者だけの細かな不便ではない。AI にテストや調査を任せた時、文字化けや timeout があると、結果の判断を間違える。たとえば、テストが本当に落ちたのか、PowerShell の扱いで失敗しただけなのかを分けられないと、レビューや修正が混乱する。

そのため、Claude Code を社内で使うなら、Windows 端末、PowerShell 5.1、PowerShell 7、社内 proxy、CI runner を別々に確認したい。[Claude containment、AI権限境界の実務](/blog/anthropic-claude-containment-agent-security-2026/) で整理した通り、AI エージェントはモデルだけでなく実行環境ごと管理する必要がある。

## 監査ログと長時間処理も改善された

今回の更新では、OpenTelemetry log events に `message.uuid`、`client_request_id`、`tool_source` が追加された。これは、どのメッセージや tool 実行がどのログに対応するかを追いやすくするための材料だ。

企業で Claude Code を使う場合、「AI を使った」だけでは説明にならない。どのリポジトリで、どの tool が、どの依頼に対して、どんな結果を返したのかをあとから見られる必要がある。[Claude Code監査ラベル追加、AIエージェント運用の要点](/blog/claude-code-otel-agents-mcp-security-2026/) と合わせて見ると、Claude Code は個人用 CLI から、監査できる開発基盤へ寄っている。

長時間 tool calls に heartbeat が追加された点も大事だ。これまでは、長い処理が黙っていると、止まったのか、まだ動いているのかが分かりにくかった。heartbeat があれば、待つべきか、中断すべきかを判断しやすくなる。

## 会社で確認すること

まず、使っている Claude Code のバージョンを確認する。npm metadata では `2.1.215` が 2026年7月19日 UTC に公開されている。古いバージョンを固定している端末や CI がないかを見る。

次に、permission rules を見直す。`dir/**` を使っている場合、本当にそのディレクトリだけを許可したいのか、どの階層でも同じ名前の `dir/` を許可したいのかを確認する。後者なら `**/dir/**` のように明示する。

三つ目に、Windows と PowerShell の動作を確認する。AI が出した command が、Windows でも同じ意味で動くとは限らない。文字コード、redirect、標準入力待ち、proxy は特に確認したい。

四つ目に、ログを出しすぎない。OpenTelemetry の属性が増えると便利だが、prompt content や社内情報を監視基盤へ残しすぎるリスクもある。監査に必要な情報と、残してはいけない情報を分ける。

## まとめ

Claude Code `2.1.215` と `2.1.214` は、大きな新機能というより、会社で安全に使うための足場を整える更新だ。権限チェック、Windows 対応、監査ログ、長時間処理の見え方は、AI コーディングエージェントを本番開発で使う時に欠かせない。

## 出典

- [Claude Code CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) - Anthropic / GitHub, 2026-07-19
- [@anthropic-ai/claude-code 2.1.215](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.215) - npm, 2026-07-19
- [CHANGELOG.md commit history](https://github.com/anthropics/claude-code/commits/main/CHANGELOG.md) - Anthropic / GitHub, 2026-07-19
