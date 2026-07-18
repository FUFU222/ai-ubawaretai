---
article: 'github-copilot-code-review-firewall-setup-2026'
level: 'child'
---

GitHub は **2026年7月17日**、Copilot code review の設定を強化しました。今回の更新で、Copilot code review は pull request の branch にある custom instructions を読みやすくなり、`REVIEW.md`、`GEMINI.md`、`CLAUDE.md` も参照できるようになりました。さらに、専用の `.github/workflows/copilot-code-review.yml` で setup steps を書けるようになり、code review は既定で firewall の背後で動くようになります。

これは「AIレビューのコメントが少し賢くなる」という話だけではありません。どのルールでレビューさせるか、どの runner で動かすか、外部ネットワークへ出してよいかを、開発チームが管理しやすくする更新です。

## 何が変わったのか

大きな変更は4つあります。

1つ目は、custom instructions を pull request の head branch から読めることです。これにより、レビュー規約の変更を main branch に入れる前に、その PR 上で試しやすくなります。たとえば、新しい `AGENTS.md` や `copilot-instructions.md` を追加して、Copilot code review がどう反応するかを確認できます。

2つ目は、読むファイルが増えたことです。Copilot code review は `REVIEW.md`、`GEMINI.md`、`CLAUDE.md` も読むようになりました。すでに人間向けレビュー規約や、他のAIツール向けの指示ファイルを持っている repository では、その資産を使いやすくなります。

3つ目は、専用の setup file です。`.github/workflows/copilot-code-review.yml` を置くと、Copilot code review の実行時に必要な準備を定義できます。ファイルがない場合は、既存の `copilot-setup-steps.yml` があれば fallback として使われます。

4つ目は firewall です。GitHub は Copilot code review が既定で firewall の背後で動くと説明しています。ただし、self-hosted runner は現在この firewall を support しないため、自社 runner を使う場合は別に注意が必要です。

## なぜ大事なのか

Copilot code review は、pull request にコメントや suggested changes を出すAIレビュー機能です。しかし、AIが何を見て、どの規約を守り、どの環境で動くかが曖昧だと、企業では広げにくくなります。

以前の [Copilot code review組織統制](/blog/github-copilot-code-review-org-controls-2026/) では、runner や content exclusion などの管理設定を扱いました。今回の更新は、その続きとして、実際の review 環境を repository ごとに調整しやすくします。

また、[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/) で見たように、private repository のレビューでは費用も関係します。setup steps を重くしたり、レビュー回数を増やしたりすれば、AI Credits や Actions minutes の確認も必要になります。

## 日本のチームが確認すること

まず、Copilot code review を有効にしている repository を一覧にします。そのうえで、runner type、firewall 設定、self-hosted runner の有無、`copilot-code-review.yml` の有無、instructions file の場所を確認します。

次に、instructions file を誰が変更できるかを決めます。`AGENTS.md`、`REVIEW.md`、`GEMINI.md`、`CLAUDE.md` は、レビューAIの見方を変える可能性があります。特に、委託先や複数チームが同じ repository を触る場合は、CODEOWNERS で承認者を決めておくと安全です。

最後に、self-hosted runner の扱いを見ます。GitHub-hosted runner なら firewall 既定化の効果を受けやすい一方、self-hosted runner では自社側のネットワーク制御が重要になります。「Copilot code review は firewall で守られる」と一括りにせず、runner ごとに確認する必要があります。

## まとめ

今回の Copilot code review 更新は、AIレビューを企業のPR運用に入れるための設定強化です。custom instructions を試しやすくなり、レビュー用 setup file を持てるようになり、firewall と runner 設定も分けて考えられるようになりました。

ただし、AIレビューが強くなっても、最終的な承認は人間の reviewer と repository owner の仕事です。日本の開発チームは、レビュー規約、runner、firewall、費用、承認者を同じ台帳で管理すると実務に落とし込みやすくなります。

## 出典

- [Copilot code review: Customization and configurability improvements](https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/) - GitHub Changelog, 2026-07-17
- [Using GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) - GitHub Docs
- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
