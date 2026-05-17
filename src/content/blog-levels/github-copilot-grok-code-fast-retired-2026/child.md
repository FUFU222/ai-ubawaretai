---
article: 'github-copilot-grok-code-fast-retired-2026'
level: 'child'
---

GitHub Copilotで使えていた **Grok Code Fast 1** が、**2026年5月15日** に廃止されました。GitHubの公式Changelogでは、Copilot Chat、inline edits、ask mode、agent mode、code completions など、Copilotの体験全体から外れたと説明されています。

代わりに使う候補として案内されているのは、**GPT-5 mini** と **Claude Haiku 4.5** です。つまり、今までGrok Code Fast 1を選んでいた人や、社内の手順書にその名前を書いていたチームは、使い方を見直す必要があります。

## 何が起きたの？

Grok Code Fast 1は、コーディング向けの速いモデルとして使われていました。GitHub Copilotの中でも、チャットやコード補完、agent modeなどで使われていたため、普段の開発作業に影響します。

今回のポイントは、**もう廃止済み** ということです。これから廃止される予定ではなく、2026年5月15日時点でCopilot上の選択肢から外れています。GitHub Docsのsupported modelsでも、Grok Code Fast 1はretirement historyに入り、退役日が2026-05-15と示されています。

## xAI APIとは少し違う

Grok Code Fast 1はxAIのモデルでもあります。xAIのドキュメントでは、`grok-code-fast-1` を含む古いモデルが2026年5月15日に退役し、APIでは `grok-4.3` へリダイレクトされる説明があります。

ただし、GitHub Copilotで同じことが起きるとは考えないほうがよいです。GitHub Copilotでは、GitHubが使えるモデルを管理しています。GitHubが今回案内した代替は、GPT-5 mini と Claude Haiku 4.5 です。xAI APIを直接使う開発と、会社のGitHub Copilotを使う開発は、分けて確認しましょう。

## チームで確認すること

まず、社内ドキュメントや手順書にGrok Code Fast 1という名前が残っていないか確認します。VS Codeの使い方、Copilot Chatの推奨設定、agent modeの説明、研修資料などに書かれているかもしれません。

次に、会社でCopilot BusinessやEnterpriseを使っている場合は、管理者設定を確認します。GitHubは、管理者がmodel policyで代替モデルへのアクセスを有効にする必要がある場合があると説明しています。ユーザーが代替モデルを知っていても、管理者が許可していなければ選べないことがあります。

## 代替モデルはどう選ぶ？

軽い質問や短い修正なら、GPT-5 miniを最初に試すのが分かりやすいです。速さやコストを重視する用途に向きます。

説明文の作成、レビューコメント、少し長めの相談では、Claude Haiku 4.5も比較するとよいです。日本語の説明や文章のまとまり方が、チームの使い方に合うかを見る価値があります。

大切なのは、どちらが絶対によいかを急いで決めることではありません。普段のタスクで同じ指示を試し、速さ、出力の安定性、コスト感、社内ルールへの合わせやすさを比べることです。

## まとめ

Grok Code Fast 1の廃止は、モデル名が1つ消えただけではありません。GitHub Copilotを会社で使うなら、モデルの入れ替わりに合わせて、社内ガイド、管理者設定、代替モデルの選び方を更新する必要があります。

特に6月からAI Creditsの管理が重要になるチームでは、速くて軽いモデルをどれにするかを先に決めておくと、現場の混乱を減らせます。

## 出典

- [Grok Code Fast 1 deprecated](https://github.blog/changelog/2026-05-15-grok-code-fast-1-deprecated/) - GitHub Changelog
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Grok Model Retirement on May 15, 2026](https://docs.x.ai/developers/migration/may-15-retirement) - xAI Docs
