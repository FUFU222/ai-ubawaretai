---
article: 'github-copilot-code-review-agents-md-2026'
level: 'child'
---

GitHub は **2026年6月18日**、Copilot code review が repository root の `AGENTS.md` を読めるようになったと発表した。これにより、リポジトリごとのルールやレビュー観点を、Copilot の PR レビューにも反映しやすくなる。

あわせて、draft pull request で Copilot にレビューを依頼しやすくなり、PR timeline の Copilot review event も見やすくなる。見た目は小さな更新だが、チームで Copilot code review を使う場合は重要である。

## 何が変わったのか

一番大きい変更は、Copilot code review が root の `AGENTS.md` を使うようになったことだ。`AGENTS.md` は、AI agent にリポジトリの作業ルールを伝えるための Markdown ファイルである。たとえば、テストコマンド、コードスタイル、禁止操作、レビューで重視する点を書ける。

これまでも Copilot には `.github/copilot-instructions.md` や `.github/instructions/**/*.instructions.md` のような custom instructions があった。今回の更新で、Copilot code review は `AGENTS.md` も参照するようになった。つまり、AI に渡す指示ファイルが増えた分、どのファイルに何を書くかを整理する必要がある。

もう一つの変更は draft PR まわりだ。GitHub は、draft pull request でも reviewer picker から Copilot へ review request しやすくした。人間 reviewer に出す前に、Copilot で一次チェックをする流れが作りやすくなる。

## なぜ大事なのか

PR レビューは、チームの品質管理そのものだ。日本企業では、レビューがリリース承認、委託先管理、セキュリティ確認につながることも多い。AI にレビューさせるなら、AI がどの規約を読むかを決めなければならない。

[Copilot code review組織統制](/blog/github-copilot-code-review-org-controls-2026/) では、runner や content exclusion、custom instructions の管理が重要だと整理した。今回の `AGENTS.md` 対応は、その「レビューAIに何を守らせるか」の部分をさらに repository に寄せる更新である。

また、[Copilot code review一括修正](/blog/github-copilot-code-review-batch-fix-agent-2026/) のように、Copilot のレビューコメントは cloud agent による修正にもつながる。レビュー指示が曖昧だと、AI のコメントだけでなく、その後の修正依頼もぶれやすい。

## どう運用すべきか

まず、既存の指示ファイルを棚卸しする。`AGENTS.md`、`.github/copilot-instructions.md`、`.github/instructions/`、README、社内レビュー規約がばらばらにあるなら、重複や矛盾を減らす。

次に、`AGENTS.md` には全体方針を書く。たとえば、必須テスト、禁止コマンド、セキュリティ変更時の注意、レビューで重視する重大度などである。細かい領域別ルールは path-specific instructions に分けたほうが分かりやすい。

最後に、秘密情報を書かない。AI に伝えたいのは「何を確認すべきか」であり、credential、顧客名、内部URL、未公開案件そのものではない。`AGENTS.md` は repository の一部としてレビューされるべきファイルである。

## まとめ

Copilot code review の `AGENTS.md` 対応は、AI レビューをチームの開発規約へ近づける更新だ。便利になる一方で、指示ファイルの管理が雑だと、AI のレビュー品質も雑になる。

日本の開発チームは、まず `AGENTS.md` を作ることより、既存のレビュー規約を整理し、AI に渡すルールを短く明確にすることから始めるのがよい。

## 出典

- [Copilot code review: AGENTS.md support and UI improvements](https://github.blog/changelog/2026-06-18-copilot-code-review-agents-md-support-and-ui-improvements/) - GitHub Changelog, 2026-06-18
- [Using GitHub Copilot code review](https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review) - GitHub Docs
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) - GitHub Docs
