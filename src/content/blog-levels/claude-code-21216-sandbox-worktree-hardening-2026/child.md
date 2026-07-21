---
article: 'claude-code-21216-sandbox-worktree-hardening-2026'
level: 'child'
---

Claude Code 2.1.216 は、見た目には細かな修正が多い更新です。ただし、企業で使う場合はかなり大事です。中心は、Claude Code がどの作業場所で動き、どのファイルに触り、長い作業を途中から再開できるかです。

直前の更新では、[Claude Code 2.1.215の権限修正](/blog/claude-code-21215-permission-otel-heartbeat-2026/) が permission check や OpenTelemetry を扱いました。今回の 2.1.216 は、そこからさらに sandbox、worktree、symlink、background agent の境界を固める更新として読むと分かりやすいです。

## 何が変わったのか

公式 changelog では、`sandbox.filesystem.disabled` という設定が追加されました。これは filesystem isolation を無効にしながら、network egress control は残すための設定です。つまり、ファイルシステム側の隔離だけを外したいケースを扱えるようになりました。

ただし、これは「安全設定を楽に外せる」という意味ではありません。企業利用では、sandbox を外すと Claude Code が触れるファイル範囲が広がります。社内の別 project、秘密情報、委託先に見せるべきでない checkout が近くにある環境では、影響が大きくなります。

もう一つ重要なのが worktree-isolated subagents の修正です。Git の `-C`、`--git-dir`、`GIT_DIR`、`GIT_WORK_TREE` などを通じて、隔離された worktree ではなく shared checkout 側へ Git 操作が向く問題が修正されました。AI agent を複数並べるチームでは、どの checkout に差分が出るかが信頼性に直結します。

## なぜ日本企業に関係するのか

日本企業では、社内標準端末、VDI、委託先の開発環境、Windows、macOS、Linux、社内 proxy、MCP、monorepo が混ざりやすいです。この環境で AI コーディングエージェントを使うと、単に「コードを書けるか」よりも、「どの権限で、どの場所に、何を書いたか」を説明できることが重要になります。

たとえば、Claude Code に改修を任せたつもりでも、worktree の境界がずれて main checkout に差分が出ると、レビューが難しくなります。`.claude` が symlink になっていて project 外へ workflow や scheduled task が書き込まれると、repository ごとの設定境界も崩れます。

この点は [Claude Code 2.1.208の端末統制](/blog/claude-code-21208-wrapper-accessibility-reliability-2026/) と同じ流れです。Claude Code は、ただの対話 CLI ではなく、background session や agent view を持つ開発基盤に近づいています。基盤として使うなら、端末、作業場所、設定ファイル、ログをまとめて見なければなりません。

## 更新時に見るポイント

最初に見るべきなのは、社内で使う Claude Code の最低バージョンです。2.1.216 は 2026年7月20日 UTC に npm へ公開されています。すぐ全員に配るより、Claude Code をよく使う開発者、MCP を使うチーム、委託先と同じ repository を扱うチームで先に試すのが現実的です。

次に、filesystem isolation を無効にする条件を決めます。標準では有効にし、例外は理由、対象 repository、期限、承認者を残します。network egress control が残るとしても、ファイル側の境界を外す意味は別に評価するべきです。

さらに、worktree と symlink を確認します。`git -C` や `GIT_WORK_TREE` を使う script がある repository、`.claude` を symlink している project template、古い検証用 checkout を棚卸しします。Claude Code が作った差分が、期待した worktree にだけ出るかを小さく試すことが大事です。

## まとめ

Claude Code 2.1.216 は、派手な新機能の更新ではありません。しかし、sandbox、worktree、symlink、background agent、長時間セッションの修正は、企業で安全に使うための土台です。

日本企業は、この更新を「最新版が出た」で流さないほうがよいです。特に委託先開発、monorepo、複数 agent、長時間作業を使うチームでは、[Claude Code 2.1.196のMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) と合わせて、どの境界を組織で守るのかを確認するべきです。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic / GitHub, accessed 2026-07-21
- [@anthropic-ai/claude-code 2.1.216](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.216) - npm, 2026-07-20
- [What's new - Claude Code Docs](https://code.claude.com/docs/en/whats-new) - Anthropic, accessed 2026-07-21
