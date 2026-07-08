---
title: 'Claude Code 2.1.204、常駐復旧をCI運用で点検'
description: 'Claude Code 2.1.204の常駐エージェント復旧修正を整理。日本企業がCI、Remote Control、worktree分離、監査ログで何を回帰検証すべきか解説する。'
pubDate: '2026-07-09'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'AIエージェント', '開発者ツール', '運用自動化', '監査ログ', '企業導入', 'セキュリティ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の npm package metadata では、`@anthropic-ai/claude-code` の最新 version が **2.1.204** になり、公開時刻は 2026年7月8日 00:04:57 UTC と確認できる。公式 changelog の 2.1.204 は1項目だけで、headless session の `SessionStart` hook 中に hook event が streaming されず、remote worker が hook の途中で idle reap され得る問題を修正した、という内容だ。

この1行だけなら小さな修正に見える。しかし直前の 2.1.203 には、background session、daemon token、worktree isolation、Remote Control、`ANTHROPIC_BASE_URL`、auto-upgrade、TaskStop/TaskOutput など、常駐型エージェント運用の失敗経路がまとまっている。[Claude Code 2.1.200の常駐セッション復旧](/blog/claude-code-21200-manual-background-recovery-2026/) で扱った「止まる、戻る、重複しない」という論点は、2.1.203/2.1.204 でさらに具体的になった。

この記事では、公開資料で確認できる事実と、日本企業が開発基盤や CI へ Claude Code を入れる場合の分析を分けて整理する。特に、単に最新版へ上げる話ではなく、復旧時に同じ job、同じ worktree、同じ権限、同じ送信先へ戻れているかを検証する視点で見る。

## 事実: 2.1.204はheadless hookとremote workerの修正

2.1.204 の公式 changelog は短い。修正対象は、headless session の `SessionStart` hook 中に hook event が streaming されない問題である。影響として、remote worker が hook の途中で idle reap される可能性が示されている。

ここから確実に言えることは、2.1.204 が新機能 release ではなく、無人実行や remote worker の lifecycle に関わる修正だという点だ。`SessionStart` hook は、セッション開始時に環境確認、方針注入、監査、初期化処理を走らせる場所になり得る。そこでイベントが外へ流れなければ、監視側は処理中なのか停止中なのか判断しにくい。

特に headless session は、利用者が対話画面を見ていない前提で動く。CI、定期実行、remote worker、社内 runner で使う場合、画面上の違和感ではなく、event stream、exit code、OTel、job status で生死を判定する。そのため「hook が走っているのに外から見えない」は、単なる表示バグではなく、誤停止や重複起動につながる。

この点は [Claude Code 2.1.201のsystem role変更](/blog/claude-code-21201-system-role-harness-reminders-2026/) と性質が違う。2.1.201 はモデルへ渡す会話構造の検証が中心だった。2.1.204 は、モデル以前の実行基盤、つまり session start から remote worker 維持までの制御面を確認する更新である。

## 事実: 2.1.203はbackground sessionの同一性を広く直した

2.1.203 の changelog はかなり長い。中心は、background session が「生きているように見えるが、実は操作不能」「別の場所で動く」「再実行される」「送信先が変わる」といった失敗を減らす修正群である。

たとえば、daemon の session token が古くなったとき、background session が attach、reply、stop に対して永久に応答しなくなる問題が修正されている。`claude agents` に戻ったとき、実行中の subagent を止めて prompt を最初から再実行してしまう問題も、作業を引き継ぐ方向へ直された。これは、長時間 task を「もう一度やり直す」のではなく「同じ作業として戻す」ための修正だ。

worktree 関連も重要だ。worktree isolation された subagent が親 checkout で shell command を実行する場合があり、さらに nested repository を含む multi-repo workspace で worktree 作成が拒否される問題も修正された。日本企業の monorepo、複数 repository、顧客別 checkout、検証用 worktree では、この種の取り違えが実害になりやすい。

Remote Control と環境変数にも修正がある。background agent が daemon から古い `PATH` を継承して Windows で tool を見失う問題、background/session view が shell から export された `ANTHROPIC_BASE_URL` を落として default endpoint へ送ろうとする問題、Remote Control mobile/web から送った file や image が caption なしで silently drop される問題が含まれている。これらは、単なる便利機能ではなく、企業の network routing、gateway、証跡、接続先管理に関わる。

## 分析: 復旧時の危険は「止まる」より「別物として動く」こと

ここからは分析である。

Claude Code を個人の terminal assistant として使うなら、失敗しても利用者が画面を見て直せることが多い。しかし CI、定期 job、Remote Control、background agents、dynamic workflows へ広げると、問題は「停止」だけではない。むしろ危険なのは、復旧時に別物として動くことだ。

たとえば、同じ prompt が最初から再実行されると、同じ migration、同じ issue comment、同じ branch 操作が二重に走る可能性がある。worktree が親 checkout に戻ると、本来 isolated な変更が別 branch や main checkout に混ざる。`ANTHROPIC_BASE_URL` が落ちると、社内 gateway を通るはずの request が想定外の endpoint へ向かう。daemon token が stale になると、利用者は stop したつもりでも session を止められない。

[Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) で整理したように、企業運用では client version、model、MCP、gateway、managed settings を分けて管理する必要がある。2.1.203/2.1.204 は、そこに `session identity` と `execution location` を加えるべきことを示している。

公式の agent view docs は、`claude agents` が background session の一覧、入力待ち、実行中、完了をまとめて扱う画面だと説明している。各 background session は terminal に接続していなくても走り続け、あとから開いて返信できる。この設計を業務で使うなら、「一覧に見える」だけでは足りない。操作可能か、止められるか、再開後に同じ作業として扱われるか、別 worktree へ逸れていないかまで検証すべきだ。

## 日本企業が確認する5項目

### 1. headless sessionの開始hookを監視する

2.1.204 の直接の修正対象は `SessionStart` hook の event streaming である。CI や runner で Claude Code を起動している組織は、session 開始時の hook が長めに動くケースを用意し、監視側で進行中として見えるか確認したい。

ここで見るべき指標は、hook の標準出力だけではない。job status、remote worker の生存判定、idle timeout、OTel event、終了時の reason を合わせて見る。hook が実行中なのに worker が idle と判定されるなら、実作業に入る前に job が落ちる。

### 2. background sessionをattach、reply、stopで試す

2.1.203 では、daemon token の stale 化で background session が attach、reply、stop に応答しなくなる問題が修正されている。これは必ず手元の運用環境で確認した方がよい。長時間 job を開始し、端末を閉じる、agent view を開き直す、別 UI から reply する、stop する、という一連の操作を試験に入れる。

期待結果は単純だ。session は同じ ID と作業内容で戻り、必要な入力を受け取り、止めたら止まる。止められない session は、コストだけでなく repository 変更や外部 API 呼び出しのリスクになる。

### 3. worktree isolationを破壊的操作なしで検証する

worktree-isolated subagent が親 checkout で shell command を実行する問題は、日本の開発基盤でも見逃せない。検証では、各 worktree に異なる marker file や branch 名を置き、subagent に読み取り専用 command を実行させる。`pwd`、`git rev-parse --show-toplevel`、対象 file の存在確認などで、実際にどこを見ているかを残す。

破壊的な command で試す必要はない。むしろ、最初は read-only の証跡で十分だ。問題があれば、migration や format の前に検出できる。

### 4. gatewayと環境変数の継承を確認する

2.1.203 は、background/session view が shell-exported `ANTHROPIC_BASE_URL` を落とす問題も修正している。Bedrock、Vertex、Foundry、社内 gateway、proxy を使う組織では、interactive session と background session で送信先が一致するか確認する必要がある。

ここでは request body を保存しなくても、gateway access log、request ID、model provider、認証方式、HTTP status、OTel span attribute でかなり確認できる。[Claude CodeのOpenTelemetry監査設計](/blog/claude-code-otel-agents-mcp-security-2026/) と同じく、本文ログより metadata から始める方が安全だ。

### 5. Remote Controlの入力欠落を回帰試験に入れる

Remote Control docs は、web/mobile UI が local machine 上の session を操作する窓であり、code は自分の machine 上で動くと説明している。2.1.203 では、Remote Control mobile/web から送った command が `Unknown command` になる問題、caption なしの image/file が silently drop される問題、permission mode 表示が誤る問題が修正されている。

日本企業で Remote Control を使うなら、外出先から承認する体験だけを見てはいけない。file 添付、image 添付、slash command、permission mode 表示、管理者が無効化した場合の挙動を、実際の MDM や社内 proxy 条件で試すべきだ。

## まとめ

Claude Code 2.1.204 は、表面上は headless `SessionStart` hook の streaming 修正である。しかし 2.1.203 と合わせて見ると、常駐エージェント運用に必要な復旧、停止、接続先、worktree、Remote Control の同一性をまとめて点検する release と読める。

日本企業にとって重要なのは、最新版にしたかどうかではない。background session が同じ job として戻るか、stop が効くか、worktree が混ざらないか、gateway を外れないか、hook の進行が監視に出るかである。Claude Code を CI や社内 runner へ広げるなら、この release を契機に、常駐エージェントの回帰試験を明文化しておきたい。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-07-09
- [@anthropic-ai/claude-code npm package](https://www.npmjs.com/package/@anthropic-ai/claude-code) - npm, accessed 2026-07-09
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view) - Claude Code Docs, accessed 2026-07-09
- [Observability with OpenTelemetry](https://code.claude.com/docs/en/agent-sdk/observability) - Claude Code Docs, accessed 2026-07-09
- [Continue local sessions from any device with Remote Control](https://code.claude.com/docs/en/remote-control) - Claude Code Docs, accessed 2026-07-09
