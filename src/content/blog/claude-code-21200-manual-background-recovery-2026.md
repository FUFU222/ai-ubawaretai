---
title: 'Claude Code 2.1.200、手動確認と常駐セッション復旧の実務'
description: 'Claude Code 2.1.200で変わったManual権限表示とAskUserQuestionの待機、background sessionの復旧修正を整理。日本企業が無人実行の停止・通知・再開・重複防止をどう設計するか解説する。'
pubDate: '2026-07-05'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'AIエージェント', '管理者設定', '開発者ツール', 'セキュリティ', '企業導入', '運用自動化']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic が公開した **Claude Code 2.1.200** は、目立つ新モデルではなく、対話待ちと background session の挙動を直す更新だ。しかし、日本企業が Claude Code を個人の対話ツールから常駐型の開発エージェントへ広げる段階では、重要度が高い。

今回の中心は3つある。`AskUserQuestion` が既定で勝手に先へ進まなくなったこと、従来の `default` permission mode が画面上では **Manual** と表示されるようになったこと、そして sleep/wake や stale lock、daemon の世代交代に関する復旧不具合がまとめて修正されたことだ。

これは「自動化を止めない」ためだけの更新ではない。人間の判断が必要な場所では正しく止まり、端末のスリープやプロセス障害からは重複実行せずに戻る、という運用要件を具体化する更新である。[Claude Code 2.1.161の監査ラベルとbackground agents](/blog/claude-code-otel-agents-mcp-security-2026/) で整理した可観測性に、今回の停止・再開の信頼性を重ねると、企業運用で確認すべき範囲が見えやすい。

## 事実: 質問ダイアログは既定で自動継続しなくなった

Claude Code 2.1.200 の公式 release notes は、`AskUserQuestion` ダイアログが既定では auto-continue しなくなり、必要な場合だけ `/config` から idle timeout を有効にできると説明している。

この変更の意味は明確だ。エージェントが「A案とB案のどちらを採用するか」「本番環境へ進めてよいか」「不明な要件をどう解釈するか」と質問したとき、無応答を暗黙の承認として扱わない。利用者が席を離れていても、質問は質問のまま残る。

ここで、質問待ちと tool permission を混同してはいけない。permission mode は、ファイル編集やコマンド実行などをどの頻度で承認するかを制御する。一方、`AskUserQuestion` は仕様や選択肢について人間の入力を求める対話だ。tool の実行権限を広くしても、業務上の意思決定まで自動承認してよいことにはならない。

公式の permission mode ドキュメントでは、`default` は読み取り以外の操作で確認を求める標準モードとして説明されている。2.1.200 では、このモードの表示名が CLI、`--help`、VS Code、JetBrains で **Manual** に統一された。設定値としては `--permission-mode manual` と `"defaultMode": "manual"` が従来の `default` と並んで受け付けられる。既存設定をただちに書き換える必要がある、という発表ではない。

したがって、日本企業が先に行うべきことは設定値の一括置換ではなく、社内手順書やスクリーンショット、問い合わせ文面にある「default mode」が、利用者の画面では「Manual」と見えることを確認する作業だ。[Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) で扱った managed settings と同様に、管理者の設定名、CLI の受け付ける値、利用者が見る表示を分けて管理した方がよい。

## 事実: background sessionの停止・再開経路が修正された

2.1.200 には background session と agent daemon に関する複数の修正が含まれる。

- 端末の sleep/wake 後や、停止状態の session を開き直したときに、turn の途中で黙って止まる問題
- stall から復旧した際、利用者が `Esc` で取り消した turn を再実行する問題
- crash 後に残った `daemon.lock` の PID が OS で再利用され、background agent が二度と起動しない問題
- 古い build を再インストールした後、その build が新しい daemon を引き継いでしまう問題
- roster の一時破損、旧 binary による新しい field の欠落、daemon restart 時の socket auth token 欠落
- rate limit 前にテキストを返せなかった subagent が、空の成功結果のように見える問題
- 同じ repository の git worktree で project-scoped plugin が正しく読み込まれない問題

個々には不具合修正だが、共通する論点は **復旧時の同一性** である。どの session が生きているか、どの turn が取り消されたか、どの daemon が新しいか、どの credential と roster を引き継ぐかを誤ると、単なる停止より危険な状態になる。

公式の agent view ドキュメントでは、background session は terminal を閉じても別の supervisor process によって動き続け、状態は disk に保存されると説明されている。2.1.200 以降では、machine sleep 中の session も保持され、wake 後に supervisor が再接続する。また、応答しなくなった session を開いた場合は process を再起動し、中断した response の続きから進める設計が示されている。

この仕組みを使うなら、正常系だけを見るテストでは足りない。スリープ、通信断、rate limit、daemon restart、旧版への rollback、worktree 併用といった「途中で切れる状況」を試験対象にする必要がある。

## 分析: 無人実行の品質は「止まらない」だけでは測れない

ここからは公式発表を踏まえた分析である。

企業の自動化では、稼働時間を上げることが重視される。しかし AI エージェントでは、止まらないことだけを成功条件にすると危険だ。曖昧な要求や本番変更の確認を待たずに進めば、可用性は高く見えても、変更の正当性は失われる。

Claude Code 2.1.200 は、少なくとも次の3状態を分けて扱う必要性を示している。

1. **Needs input**: 人間の選択や説明が必要で、勝手に再開してはいけない
2. **Recoverable stall**: sleep/wake や process 障害から、同じ turn を安全に再開すべき
3. **Failed**: rate limit や設定破損などにより、成功として扱わず再実行判断へ送るべき

この3つを一つの「停止」にまとめると、監視と再実行が壊れる。Needs input を自動 retry すれば承認を迂回し、recoverable stall を新規 job として起動すれば同じ変更を二重に実行し、失敗を空の結果として受け取れば後続工程が誤って進む。

特に日本企業では、夜間バッチ、社内 proxy、VDI、端末スリープ、持ち出し PC、委託開発環境など、session が中断される要因が多い。Claude Code の常駐運用を始めるなら、「何分止まったら再実行するか」より先に、「誰の入力待ちか」「同じ session を再開するのか」「新しい session を起こすのか」を定義すべきだ。

[Claude Code 2.1.178のsubagent権限管理](/blog/claude-code-2178-subagent-permissions-2026/) で見たように、親 agent と subagent では許可範囲が異なり得る。今回の rate limit 時の失敗伝播も含め、親が子の空結果を成功と解釈しないことは、multi-agent 運用の基本的な品質条件になる。

## 日本企業が更新時に確認する5項目

### 1. 表示名と設定値を分けて棚卸しする

社内標準が `default` を使っているなら、既存設定の継続性を確認しつつ、利用者向け資料では Manual 表示に合わせる。CLI、VS Code、JetBrains で画面差がないかも確認する。構成管理で `"defaultMode": "default"` を一斉に `"manual"` へ変えること自体には、現時点で大きな実益はない。

### 2. 質問待ちのSLAを決める

`AskUserQuestion` が止まったとき、誰へ、どの経路で、何分後に通知するかを決める。質問が残っていることを失敗とみなすのか、保留中として別の状態にするのかも必要だ。idle timeout を有効にする場合は、timeout 後に何が起きるかを実環境で確認し、承認が必要な質問には使わない。

### 3. sleep/wakeとstall recoveryを試験する

検証用 repository で長めの turn を動かし、端末 sleep、network 切断、agent view の終了と再起動を行う。復旧後に同じ shell command や commit、外部 API 呼び出しが二重に走らないことを確認する。取り消した turn が再実行されないことも試す。

### 4. daemonとversion rollbackの手順を作る

自動更新後に不具合が起きて旧版へ戻す場合、どの binary が supervisor を担っているかを確認する。version を戻しただけで、旧 build に新しい session state を無条件で引き継がせない。`daemon.lock` を手作業で削除する前に、process、PID、session state の関係を記録する。

### 5. 成功・失敗・入力待ちを別々に記録する

監査ログやジョブ管理では、`completed`、`failed`、`needs_input`、`stopped` を別の状態にする。出力が空なら成功と判定する実装は避ける。既存の [Claudeサービス障害とrate limitの切り分け](/blog/anthropic-claude-status-errors-reliability-2026/) も参照し、利用上限、サービス障害、local daemon 障害を同じ retry policy に載せない方がよい。

## まとめ

Claude Code 2.1.200 は、Manual という表示名への統一、`AskUserQuestion` の安全な待機、background session の復旧修正をまとめた運用寄りの release である。新機能の数より、承認待ちを勝手に越えないことと、障害後に同じ作業を重複させないことが重要だ。

日本企業が更新する際は、権限設定だけでなく、入力待ちの通知、sleep/wake 試験、daemon の世代管理、失敗状態の伝播を確認したい。常駐 AI エージェントの品質は、止まらないことではなく、**止まるべき場所で止まり、再開すべき場所から一度だけ戻れること**で測るべきである。

## 出典

- [Claude Code v2.1.200 release（Anthropic公式GitHub）](https://github.com/anthropics/claude-code/releases/tag/v2.1.200)
- [Choose a permission mode（Claude Code Docs）](https://code.claude.com/docs/en/permission-modes)
- [Manage multiple agents with agent view（Claude Code Docs）](https://code.claude.com/docs/en/agent-view)
- [Create custom subagents（Claude Code Docs）](https://code.claude.com/docs/en/sub-agents)
