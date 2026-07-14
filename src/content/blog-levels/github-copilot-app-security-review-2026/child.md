---
article: 'github-copilot-app-security-review-2026'
level: 'child'
---

GitHubは、GitHub Copilot appで`/security-review`を使えるようにしました。これは、作業中のコード変更に対して、AIがセキュリティ上の問題を探してくれる機能です。2026年7月14日時点では公開プレビューとして提供されています。

簡単に言うと、PRを出す前に「この差分に危ない書き方はないか」をCopilot appの中で確認できます。すでに[Copilot CLI security review](/blog/github-copilot-cli-security-review-2026/)として使われていた考え方が、[GitHub Copilot app](/blog/github-copilot-app-technical-preview-2026/)の作業画面にも入ってきたと見ると分かりやすいです。

## 何をしてくれるのか

`/security-review`は、いま作っているコード変更を見て、脆弱性の可能性を指摘します。GitHubは、injection、XSS、危ないデータ処理、path traversal、弱い暗号設定などを例として挙げています。

結果は、単に「危ないかも」と言うだけではありません。重大度や確信度を付け、修正のヒントも返します。開発者はその場で直し、もう一度確認できます。

## 何が便利なのか

セキュリティの問題は、見つかるのが遅いほど直すのが大変です。PRを出したあと、さらにリリース直前に見つかると、設計や実装を大きく戻すことがあります。

この機能を使うと、PRを出す前の早い段階で、よくある危ない実装を見つけやすくなります。人間のレビュー担当者は、細かい入力チェックの漏れだけでなく、権限や設計のような大きな論点に集中しやすくなります。

## 置き換えではない

ただし、`/security-review`だけで安全になるわけではありません。[CodeQLのような静的解析](/blog/github-codeql-ai-prompt-injection-2026/)や、Dependabot、secret scanning、人間レビューは引き続き必要です。

AIレビューは、開発者が早めに問題に気づくための補助です。会社のルールとしてmergeしてよいかどうかは、CI、CodeQL、secret scanning、branch protection、人間の承認で判断するべきです。

## 日本企業での使い方

最初は、全社で必須にするより、小さなチームで試すのが安全です。たとえば、ログイン、管理画面、顧客データ、決済、外部APIを扱うリポジトリから始めます。

PRテンプレートには、「`/security-review`を実行したか」「重大な指摘を直したか」「直さない場合の理由を書いたか」を入れるとよいです。ただし、最初から義務化すると、形だけのチェックになりやすいので注意が必要です。

見るべき数字は、実行回数だけではありません。AIの指摘で本当に直した件数、誤検知の多さ、人間レビューやCodeQLで後から見つかった問題、PRレビューの待ち時間も一緒に見ます。

## まとめ

GitHub Copilot appの`/security-review`は、PR前にAIでセキュリティ確認をするための便利な入口です。日本企業は、これを最終承認の代わりではなく、開発者の自己点検として使うのが現実的です。

CodeQL、Dependabot、secret scanning、人間レビューと組み合わせ、どの段階で何を見るかを決めることで、手戻りを減らしながら安全性を上げやすくなります。

## 出典

- [Security reviews now available in the GitHub Copilot app](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) - GitHub Changelog
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) - GitHub Docs
- [Requesting a code review with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review) - GitHub Docs
