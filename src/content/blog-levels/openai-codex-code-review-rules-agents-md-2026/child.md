---
article: 'openai-codex-code-review-rules-agents-md-2026'
level: 'child'
---

OpenAI は 2026年7月20日、Codex Code Review が `AGENTS.md` に書いたレビュー用ルールを使えるようになったと発表しました。これは、AIに「このリポジトリでは何を気にしてレビューしてほしいか」を伝える仕組みです。

たとえば、あるAPI名を変えると古いクライアントが壊れる、顧客データをログへ出してはいけない、特定の課金処理は必ず後方互換を残す、というようなルールがあります。人間のレビュー担当者なら覚えているかもしれません。しかし新しいメンバーやAI agentは、その背景を知りません。そこで `AGENTS.md` に短いルールとして書いておくと、Codex Code Review がPRを見るときに参考にできます。

## AGENTS.mdに何を書くのか

OpenAIの説明では、`AGENTS.md` に `## Code Review Rules` という見出しを作り、その下にレビューで見てほしい条件を書きます。全体に効くルールはリポジトリのルートに置き、特定サービスだけに効くルールはそのサービスに近い場所の `AGENTS.md` に置きます。

大事なのは、長い社内規程をそのまま貼らないことです。「セキュリティに注意」では広すぎます。AIがレビューコメントにしやすいのは、「この種類のイベント名は外部連携に使われているので、変更するなら古い名前も残す」のような具体的なルールです。

## CIとは役割が違う

この機能は、lintやformatの代わりではありません。formatやテストで確認できることはCIに任せたほうがよいです。Codex Code Review rules が向いているのは、テストだけでは分かりにくいチーム固有の注意点です。

たとえば、互換性、個人情報、課金、認可、監査ログ、外部APIとの約束は、コードだけを見ても判断が難しいことがあります。こうした観点は [OpenAI Codex Security](/blog/openai-codex-security-workflow-2026/) で扱った脆弱性対応と同じく、AIの提案を人間が確認する前提で使うべきです。

## 日本の開発チームで気をつけたいこと

日本企業では、委託先や複数部署が同じリポジトリにPRを出すことがあります。その場合、レビュー規約が人の記憶だけにあると、AIレビュー以前に人間レビューもぶれます。`AGENTS.md` に短く書くことで、PR作成者、AIレビュー、人間レビューが同じ入口を見られます。

ただし、秘密情報は書いてはいけません。顧客名、内部URL、credential、未公開の障害情報を `AGENTS.md` に入れるのは危険です。書くべきなのは、秘密そのものではなく「顧客識別子をログに出さない」「この領域はsecurity reviewer必須」のような行動ルールです。

また、[Copilot code reviewのAGENTS.md対応](/blog/github-copilot-code-review-agents-md-2026/) と似た話もあります。GitHub Copilot、OpenAI Codex、既存の `.github/copilot-instructions.md` が同時にある場合、どこに何を書くかを決めないと、AIへの指示が重複します。

## 小さく始める

最初は2つか3つのルールで十分です。過去のPRを見て、人間レビューで何度も説明している指摘を選びます。次に、そのルールが本当に効くPR、安全な例外のPR、無関係なPRで試します。AIが必要なときだけ指摘できるかを見るためです。

[Codex Record & Replay](/blog/openai-codex-record-replay-skills-2026/) のように、Codexは作業手順を再利用する方向へ進んでいます。今回のCode Review rulesも、レビューの暗黙知を再利用する仕組みとして見ると分かりやすいです。ただし、AIがレビューしたから安全になるわけではありません。最後はテスト、branch protection、人間の承認が必要です。

## まとめ

Codex Code Review の `AGENTS.md` rules は、AIレビューにチーム固有の観点を渡すための仕組みです。便利ですが、何でも書く場所ではありません。日本の開発チームは、重要で非自明なルールだけを短く書き、ownerを決め、CIと人間レビューの役割を残したまま導入するのがよいです。

## 出典

- [Custom Code Review rules for Codex](https://developers.openai.com/blog/custom-code-review-rules-for-codex) - OpenAI Developers
- [Codex code review in GitHub](https://learn.chatgpt.com/docs/third-party/github) - OpenAI Learn
- [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) - OpenAI Learn
