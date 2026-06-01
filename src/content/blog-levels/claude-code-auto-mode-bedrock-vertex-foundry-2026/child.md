---
article: 'claude-code-auto-mode-bedrock-vertex-foundry-2026'
level: 'child'
---

Claude Code の **Auto mode** が、Amazon Bedrock、Google Vertex AI、Microsoft Foundry 上の Opus 4.7 / Opus 4.8 でも使えるようになりました。設定は `CLAUDE_CODE_ENABLE_AUTO_MODE=1` です。

むずかしく聞こえますが、ポイントは「Claude Code が、使うモデルを自動で選びやすくなる範囲が広がった」ということです。しかも、それが Anthropic 直結だけでなく、会社が使っているクラウド経由にも広がった点が大事です。

## Auto modeとは何か

Auto mode は、利用者が毎回モデルを細かく選ばなくても、Claude Code 側で作業に合うモデルを選びやすくする仕組みです。

たとえば、軽い調査やログ要約なら速い選択肢で十分かもしれません。複雑なコード修正や長い調査なら、より強いモデルが必要かもしれません。Auto mode は、こうした判断を毎回人間が手で選ぶ負担を減らします。

ただし、会社で使う場合は「自動で選べるから便利」で終わりません。どのモデルが使われるのか、どのクラウドを通るのか、費用がどこに出るのか、ログにどう残るのかを確認する必要があります。

## BedrockやVertexで使える意味

Amazon Bedrock や Google Vertex AI は、多くの会社がすでに使っているクラウド基盤です。そこで Claude Code を使えると、認証、請求、ログ、ネットワーク設定を会社の既存ルールに近づけやすくなります。

一方で、クラウド経由にしたから全部安心、というわけではありません。使うモデル、リージョン、権限、ログの残り方は会社ごとに違います。Auto mode が入ると、モデル選択も自動になるため、あとから説明できるようにしておく必要があります。

この点は、以前の [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) ともつながります。AIに長い作業を任せられるほど、どこまで任せるかを先に決めることが大切になります。

## 会社ではどう使えばよいか

まず、Auto mode を使ってよい作業を分けるとよいです。

軽い調査、コードの読み解き、ログの要約、テスト失敗の原因候補出しなら、Auto mode を試しやすいでしょう。結果は人間が読んで判断できるからです。

一方で、認証、課金、個人情報、顧客データ、セキュリティ修正のような作業では注意が必要です。このような作業では、使うモデルやクラウド経路を固定し、人間の確認を必ず入れるほうが安全です。

[Claude Codeの権限修正](/blog/claude-code-2149-powershell-mcp-2026/) でも見たように、AIコーディングツールではモデルだけでなく、実行できるコマンド、読めるファイル、書ける場所も重要です。

## まとめ

Claude Code Auto mode の Bedrock / Vertex / Foundry 対応は、開発者にとってはモデル選択が楽になる更新です。会社にとっては、クラウド経由で AI コーディングをどう標準運用するかを考えるきっかけです。

日本のチームは、まず低リスクな作業で試し、ログ、費用、レビューの流れを確認するとよいです。そのうえで、どの作業は Auto mode、どの作業はモデル固定にするかを決めると、便利さと管理のバランスを取りやすくなります。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-01
- [Set up Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup) - Anthropic Docs
- [Bedrock、Vertex、およびプロキシ](https://docs.anthropic.com/ja/docs/claude-code/bedrock-vertex-proxies) - Anthropic Docs
