---
article: 'claude-code-workflows-custom-roles-2026'
level: 'child'
---

Claude Code の dynamic workflows は、Claude Code に長い作業や複数の subagents を使う作業を任せやすくする機能です。Anthropic の Enterprise 向け説明では、2026年6月8日からこの機能が組織で既定有効になるとされています。

会社で Claude Code を使っている場合、これは「新機能が使えるようになる」だけではありません。誰に使わせるか、どの接続先を許すか、どこまでAIに作業させるかを決める必要があります。

## 何が変わるのか

今回のポイントは、Enterprise 管理者が dynamic workflows を制御できることです。

管理者は、組織全体で workflows を有効または無効にできます。また、custom roles を使って、特定のユーザーやグループだけに許可できます。さらに Claude Code の managed settings では、`disableWorkflows` という設定で workflows を無効化できます。

つまり、会社は「全員に使わせる」「一部のロールだけに使わせる」「特定の端末や環境では使わせない」という管理ができます。

## なぜ大事なのか

dynamic workflows は、短い質問に答える機能ではありません。長い調査、複数ファイルの修正、テストを含む確認、subagents を使った分担などに向いた仕組みです。

これは便利ですが、実行時間や費用が増えやすくなります。また、Claude Code が読めるファイルや使えるツールが多いほど、AIが触れる情報も増えます。

前に扱った [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) では、長時間タスクをAIに任せるときのコストやレビューが重要だと整理しました。今回の話は、その機能を会社でどう許可するかです。

## 役割ごとに許可する

日本企業では、最初から全員に workflows を開放するより、役割ごとに分けるほうが安全です。

まず、AI推進チームや開発生産性チームのような先行評価ロールに許可します。このチームは、ログ、費用、失敗例を確認しながら使い方を決めます。

次に、通常の開発者には、低リスクな調査やテスト失敗の確認などから許可します。認証、課金、個人情報、インフラの変更などは、人間の承認を必須にしたほうがよいです。

委託先や研修中メンバーには、`disableWorkflows` で無効にする選択もあります。禁止が目的ではなく、責任を説明できる範囲から始めることが目的です。

## connectorやMCPも一緒に見る

Claude の Enterprise 管理では、connector permissions も重要です。Google Drive、Slack、GitHub、社内ドキュメントなどに接続できる場合、AIが読む情報の範囲が広がります。

Claude Code では MCP server も関係します。MCP を使うと、社内APIやチケット管理、DBなどとつながることがあります。

そのため、workflows の許可だけを見ても足りません。どのロールが workflows を使えるか、どの connector を使えるか、どの MCP server が入っているかを同じ表で管理する必要があります。

[Claude Code監査ラベル追加](/blog/claude-code-otel-agents-mcp-security-2026/) で見たように、会社でAIエージェントを使うなら、ログや費用の見える化も大切です。使える機能と、あとから説明できるログはセットで考えます。

## チームが確認すること

まず、管理画面で dynamic workflows が組織全体で有効か無効かを確認します。

次に、custom roles を見直します。誰が workflows を使えるのか、古いロールに想定外の権限が入っていないかを確認します。

三つ目に、`disableWorkflows` を managed settings で配れるかを試します。標準端末、開発コンテナ、VDI、社内 wrapper のどこで効くかを確認します。

四つ目に、connector permissions と MCP server を一覧にします。[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) と同じく、Claude Code はクラウド経路や社内 gateway と組み合わさることがあります。接続先を見ずに機能だけ許可するのは危険です。

## まとめ

Claude Code dynamic workflows の既定有効化は、開発者には便利な変更です。しかし会社では、権限管理、費用、ログ、接続先、承認ルールを合わせて見る必要があります。

日本のチームは、まず一部のロールで試し、ログと費用を確認し、問題ない範囲を広げるのが現実的です。全員に配る前に、誰が何に使えるかを説明できる状態にしておきましょう。

## 出典

- [Manage custom roles on Enterprise plans](https://support.claude.com/en/articles/13930452-manage-custom-roles-on-enterprise-plans) - Anthropic Help Center
- [Claude Code settings](https://code.claude.com/docs/en/settings) - Claude Code Docs
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows) - Claude Code Docs
