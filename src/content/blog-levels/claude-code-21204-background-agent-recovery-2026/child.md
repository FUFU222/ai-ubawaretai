---
article: 'claude-code-21204-background-agent-recovery-2026'
level: 'child'
---

Claude Code 2.1.204 は、見た目には小さな修正版です。公式 changelog では、headless session の `SessionStart` hook で event が流れず、remote worker が途中で止められる可能性がある問題を直した、と説明されています。

ただし、直前の 2.1.203 も合わせて見ると、話はもう少し大きくなります。background session が返事できなくなる、`claude agents` に戻ったときに作業を最初からやり直す、worktree が混ざる、Remote Control から送った file が消える、環境変数が落ちて別 endpoint に向かう、といった問題がまとめて修正されています。

つまり今回のポイントは、新しい便利機能ではありません。AI に長い作業を任せたとき、止まったあとに同じ作業として戻れるか、違う場所で動いていないか、ちゃんと止められるかを確認する更新です。

## background sessionとは何か

Claude Code では、作業を background session として走らせることがあります。公式の agent view docs では、`claude agents` から実行中、入力待ち、完了した session をまとめて見られると説明されています。terminal を閉じても session は続き、あとから開いて返信できます。

これは便利ですが、企業で使うと確認点が増えます。たとえば AI にリファクタリングを頼み、席を離れたあとに戻ってきたとします。そのとき、同じ session が続いているなら問題ありません。しかし、途中で止まった作業をもう一度最初から実行していたら、同じ変更が二重に入るかもしれません。

以前の [Claude Code 2.1.200の記事](/blog/claude-code-21200-manual-background-recovery-2026/) では、手動確認と常駐 session の復旧を扱いました。2.1.203/2.1.204 は、その続きとして「戻ったあとに同じ作業であること」をより細かく確認する更新です。

## なぜworktreeが大事なのか

worktree は、同じ repository で別の作業場所を作る仕組みです。AI agent に複数の修正を並行して任せるとき、作業場所を分けるために使われます。

2.1.203 では、worktree-isolated subagent が親 checkout で shell command を実行してしまう問題が修正されています。これは、子 agent に別の作業場所を与えたつもりなのに、実際には親の場所で command が走る可能性があった、という意味です。

小さな個人 project なら気づきやすいかもしれません。しかし会社の repository では、branch、顧客別設定、生成物、環境変数が複雑です。間違った場所で command が走ると、関係ない差分が出たり、検証結果を読み間違えたりします。

このため、更新後は破壊的な操作をする前に、`pwd` や `git rev-parse --show-toplevel` のような読み取り command で、agent が本当に正しい場所を見ているか確認するとよいです。

## Remote Controlでは入力が届くかを見る

Remote Control は、web や mobile から local machine 上の Claude Code session を操作する機能です。公式 docs は、code はクラウドではなく自分の machine 上で動き、web/mobile はその窓になると説明しています。

2.1.203 では、Remote Control から送った command が `Unknown command` になる問題や、caption のない file/image が silently drop される問題が修正されています。これは、外出先から承認するだけでなく、添付や command が本当に届くかを確認すべきだということです。

特に企業では、MDM、proxy、管理者設定、権限 mode が関わります。[Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) で扱ったように、個人の手元だけでなく、組織側の設定も影響します。

## まず確認すること

最初に見るのは、最新版番号だけではありません。次の5つを実際に試すと、問題を見つけやすくなります。

1つ目は、headless session の開始時 hook が監視に出るかです。hook が動いているのに外から止まって見えると、remote worker が誤って落とされる可能性があります。

2つ目は、background session を開く、返信する、止める操作です。どれかが効かない session は、無人実行では危険です。

3つ目は、worktree の場所です。読み取り command で、agent が意図した作業場所にいるか確認します。

4つ目は、`ANTHROPIC_BASE_URL` や `PATH` などの環境変数です。社内 gateway を使っている場合、background session でも同じ経路を通る必要があります。

5つ目は、OpenTelemetry や gateway log です。本文を全部保存しなくても、request ID、status、model、tool 実行、retry は見られます。[Claude Codeの監査ログ設計](/blog/claude-code-otel-agents-mcp-security-2026/) と合わせて、後から説明できる形にしておくと安全です。

## まとめ

Claude Code 2.1.204 は、小さな修正版に見えて、企業運用では重要です。AI agent を長く動かすほど、問題は「止まること」だけではなくなります。止まったあとに同じ作業へ戻るか、別の場所で動いていないか、止めたいときに止まるかが大事です。

日本の開発チームは、最新版へ更新しただけで終わらせず、background session、worktree、Remote Control、hook、監査ログをまとめて回帰テストに入れるとよいでしょう。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)
- [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view)
- [Continue local sessions from any device with Remote Control](https://code.claude.com/docs/en/remote-control)
