---
article: 'claude-code-21219-opus5-strict-subagents-2026'
level: 'child'
---

Claude Code 2.1.219 は、Claude Code を会社で使っている開発チームにとって大事な更新です。中心は、Opus 5 が既定の Opus model になったこと、ネットワーク通信をより厳しく止める `sandbox.network.strictAllowlist` が入ったこと、subagent を深く動かせるようになったことです。

これは単なるモデル更新ではありません。以前の [Claude Code 2.1.216のworktree隔離](/blog/claude-code-21216-sandbox-worktree-hardening-2026/) では、AI がどの作業場所でファイルを編集するかが焦点でした。今回は、どのモデルで、どこへ通信でき、何個の agent が並んで動けるかが焦点になります。

## 何が変わったのか

公式 changelog では、Claude Opus 5 `claude-opus-5` が追加され、Claude Code の既定 Opus model になったと説明されています。1M context と fast mode の価格も示されています。つまり、長いコード調査や難しいレビューで使うモデルの前提が変わります。

同時に、`sandbox.network.strictAllowlist` という設定が追加されました。これは、sandboxed command が許可リストにない host へ通信しようとしたとき、確認を出さずに拒否する設定です。AI agent に外部通信をさせる範囲を、より明確に絞れます。

さらに、subagent は既定で深さ 3 まで nested subagent を作れるようになりました。dynamic workflows も medium size guideline が既定になり、15 agents 未満を目安にする説明が入りました。便利ですが、agent が増えるほど費用とレビューの負担も増えます。

## なぜ日本企業に関係するのか

日本企業では、Claude Code を個人の便利ツールではなく、社内標準の開発補助として使い始めるケースが増えています。その場合、重要なのは「賢いモデルか」だけではありません。どの repository に触ったか、どの SaaS や MCP server に通信したか、誰の判断で agent を増やしたかを説明できる必要があります。

[Claude Opus 5 APIの移行差分](/blog/anthropic-claude-opus-5-api-migration-2026/) で見たように、Opus 5 は API 利用でも価格、fast mode、thinking、fallback を分けて考える必要があります。Claude Code の中で既定モデルになるなら、さらにファイル編集、Bash、MCP、subagent の費用も合わせて考えます。

また、[Claude Code workflowsの権限管理](/blog/claude-code-workflows-custom-roles-2026/) と同じく、workflow は便利な一方で管理対象です。subagent が深く動けるようになると、仕事を分担しやすくなりますが、どの agent が何をしたかを後から追うのは難しくなります。

## 更新前に見るポイント

まず、Opus 5 をどの作業で使うかを決めます。すべての作業を高性能モデルに寄せると、費用が読みにくくなります。通常の修正、難しい設計調査、セキュリティレビュー、緊急障害対応で使い分けるのが現実的です。

次に、`strictAllowlist` を試します。社内 artifact repository、GitHub、必要な package registry、MCP gateway だけを許可し、それ以外の通信は止める形を検証します。外部サイトを自由に見に行く調査用 session と、本番コードを直す session を同じ設定にしないことが大切です。

さらに、subagent の深さを絞ります。最初は `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1` で止め、workflow をきちんと設計できたチームだけ深くする方が安全です。agent が増えるほど、出力を読む人間の責任も増えます。

## まとめ

Claude Code 2.1.219 は、Opus 5 の追加だけではなく、企業の開発基盤としての使い方を変える更新です。モデル、費用、ネットワーク通信、MCP、subagent、workflow をまとめて見直す必要があります。

日本企業は、最新版にする前に、標準モデル、fast mode、allowlist、subagent 深度、MCP エラー監視を小さなチームで試すのがよいでしょう。[Claude containmentの権限境界](/blog/anthropic-claude-containment-agent-security-2026/) と同じく、AI agent はモデルだけでなく実行環境の境界で管理するべきです。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic / GitHub, accessed 2026-08-02
- [Claude Code settings](https://docs.anthropic.com/en/docs/claude-code/settings) - Anthropic Docs, accessed 2026-08-02
- [Create custom subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents) - Anthropic Docs, accessed 2026-08-02
- [Manage costs effectively](https://docs.anthropic.com/en/docs/claude-code/costs) - Anthropic Docs, accessed 2026-08-02
