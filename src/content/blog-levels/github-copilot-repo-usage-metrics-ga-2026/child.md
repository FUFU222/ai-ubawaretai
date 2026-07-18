---
article: 'github-copilot-repo-usage-metrics-ga-2026'
level: 'child'
---

GitHub は **2026年7月17日**、GitHub Copilot の使用状況を見る API に、リポジトリ別のレポートを追加しました。これにより、Copilot coding agent がどのリポジトリで pull request を作ったか、Copilot code review がどのリポジトリの pull request をレビューしたかを、1日単位で見られるようになります。

これまでは、Copilot を何人が使ったか、どのチームが使っているか、どの機能が使われたかを見る指標が中心でした。今回の更新では、視点が「人」から「コードベース」に広がります。

## 何が見えるようになったのか

新しい report は、enterprise または organization の中で、指定した日に Copilot の PR activity があった repository を返します。対象になるのは、主に2つです。

1つ目は、Copilot coding agent が作成した PR と merge された PR です。2つ目は、Copilot code review がレビューした PR です。code review については、suggestion count が comment type 別に分かれます。

つまり、このレポートは「このリポジトリで Copilot が何かしら使われたか」を全部見るものではありません。IDE の補完や Chat の利用をすべてリポジトリ別に出すものではなく、PR の流れに関係する activity を見るためのものです。

## なぜ大事なのか

開発チームでは、Copilot の導入効果を人数だけで判断しがちです。しかし、active user が多くても、重要な repository の PR が速くなっているとは限りません。逆に、利用者数は少なくても、ある repository では agent が地味な修正 PR をよく作っているかもしれません。

repo別の指標があると、「どのコードベースで AI が効いているか」を見やすくなります。たとえば、保守用の repository、社内ツール、顧客向けサービス、共通基盤では、PR の流れが違います。AI が得意な repository と、準備が足りない repository を分けて考えられます。

[Copilot使用指標補正](/blog/github-copilot-usage-metrics-accuracy-2026/)で見たように、usage metrics は数字の読み方が大切です。今回の repo 指標も同じで、数字が多いから良い、少ないから悪いとはすぐに言えません。

## 日本の開発組織で見るポイント

日本企業では、repository と部門が1対1で対応していないことがよくあります。共通基盤は複数部門が使い、顧客別 repository は委託先が関わり、古いシステムは少人数で保守していることもあります。

そのため、repo別指標を見る前に、repository 台帳を作ると役に立ちます。repository名、担当チーム、CODEOWNERS、cost center、機密度、Copilot code review の有効化状況を整理します。そのうえで、Copilot PR activity と merge lead time、review cycle、revert などを並べます。

[Copilotレビュー指標](/blog/github-copilot-review-cycles-adoption-phase-2026/)と合わせると、AI がレビュー待ち時間に効いているかを見やすくなります。[AI credit pool](/blog/github-copilot-ai-credit-pool-cost-center-2026/)とも合わせれば、どの部門や repository で費用と効果を説明すべきかも見えてきます。

## 注意すること

repo別の Copilot activity を、そのままチーム評価に使うのは危険です。PR が少ない repository でも重要なものはあります。規制やセキュリティの都合で、AI agent をあまり使わないほうがよい repository もあります。

また、Copilot code review のコメントが多い repository は、AI がよく働いているだけでなく、PR が大きすぎる、指示ファイルが合っていない、人間レビューの前準備が足りない、という可能性もあります。数字は原因を教えてくれるのではなく、詳しく見る場所を教えてくれるものです。

## まとめ

GitHub Copilot の repository-level usage metrics は、AI活用をコードベース単位で見るための更新です。Copilot coding agent と Copilot code review の PR activity を repository 別に見られるため、どの repository で AI が使われているか、どこに整備が必要かを探しやすくなります。

ただし、これは成果指標でも請求レポートでもありません。repository 台帳、PR品質、費用、レビュー運用と合わせて読むことが大切です。

## 出典

- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
