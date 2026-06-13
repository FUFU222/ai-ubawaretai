---
article: 'github-copilot-code-review-org-controls-2026'
level: 'child'
---

GitHubは**2026年6月12日**、GitHub Copilot code reviewに企業向けの管理設定を追加した。主な変更は、組織単位のrunner設定、content exclusion対応、custom instructionsの文字数制限撤廃である。

簡単に言うと、CopilotにPRをレビューさせるときに、どの実行環境で動かすか、どのファイルを読ませないか、どんなレビュー規約を守らせるかを、より管理しやすくなった。

## 何が変わったのか

1つ目はrunner設定だ。Copilot code reviewはGitHub Actionsを使って動く。標準ではGitHub-hosted runnerで動くが、組織によってはself-hosted runnerやlarge runnerを使いたい場合がある。今回、組織管理者はrunner typeを組織単位で設定し、個別リポジトリが勝手に変えられないようロックできる。

2つ目はcontent exclusionだ。これは、Copilotに読ませたくないファイルやディレクトリを除外する設定である。たとえば、機密設定、顧客別ファイル、巨大な生成物、レビューに不要なファイルをAIの文脈から外せる。今回、Copilot code reviewもこの除外設定を尊重するようになった。

3つ目はcustom instructionsだ。これまでは、Copilot code reviewが`.github/copilot-instructions.md`や`*.instructions.md`を読むとき、4000文字までという制限があった。今回、その制限がなくなった。チームのレビュー規約、テスト方針、セキュリティ観点をより詳しく書ける。

## なぜ日本企業に関係するのか

PRレビューは、単なる開発者の便利機能ではない。日本企業では、レビューが品質保証、委託先管理、監査、リリース承認につながることが多い。AIがPRを見るなら、AIに何を見せるか、どんな基準でコメントさせるか、どの環境で動かすかを決める必要がある。

[Copilot code review一括修正、PR運用の設計論点](/blog/github-copilot-code-review-batch-fix-agent-2026/)で見たように、Copilot code reviewはコメントするだけでなく、cloud agentへの修正依頼にもつながる。だからこそ、レビューAIの設定は早めに整えるべきだ。

また、[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)のように、レビューAIには実行コストも関係する。runnerを変えると、性能、到達できる内部リソース、費用、監査の考え方も変わる。

## 最初に確認すること

まず、どのリポジトリでCopilot code reviewを使っているかを一覧にする。次に、それぞれのrunner設定を確認する。標準runnerでよいのか、large runnerが必要なのか、self-hosted runnerを使うべきなのかを分ける。

次に、content exclusionを確認する。除外しているファイルがあるなら、なぜ除外しているのかを記録する。除外するとAIレビューが安全になる一方で、必要な文脈を読めなくなる場合もある。その場合は、人間reviewerが補って確認する。

最後に、custom instructionsを見直す。長く書けるようになったからといって、社内規約をそのまま貼るだけでは分かりにくい。必ず守るルール、できれば守るルール、コメントしなくてよい差分を分けて書くとよい。

## まとめ

今回の更新は、Copilot code reviewを本格的に組織運用するための設定強化である。AIにレビューさせるなら、AIの実行環境、見せるファイル、守らせるルールを決める必要がある。

日本の開発チームは、便利機能として試すだけでなく、PRレビューの標準運用として管理できるかを確認したほうがよい。

## 出典

- [Copilot code review: New configurations and controls](https://github.blog/changelog/2026-06-12-copilot-code-review-new-configurations-and-controls/) - GitHub Changelog, 2026-06-12
- [Excluding content from GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot) - GitHub Docs
- [Configuring runners for GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-runners) - GitHub Docs
- [Using GitHub Copilot code review](https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review) - GitHub Docs
