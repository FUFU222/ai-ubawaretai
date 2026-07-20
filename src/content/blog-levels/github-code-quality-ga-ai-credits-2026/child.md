---
article: 'github-code-quality-ga-ai-credits-2026'
level: 'child'
---

GitHub は 2026年7月20日、GitHub Code Quality を一般提供にした。対象は GitHub Enterprise Cloud と GitHub Team で、GitHub Enterprise Server では launch 時点で使えない。Code Quality は、CodeQL の解析と AI を使った検出を組み合わせ、pull request の中で品質や保守性の問題を見つける機能である。修正案として Copilot Autofix も出せる。

大事なのは、これが単なる新機能公開ではなく、課金開始でもあることだ。GitHub は、一般提供後に active committer、GitHub Actions minutes、GitHub AI Credits の三つが費用に関係すると説明している。preview の間に広く有効化していた会社は、そのままにしてよいかを確認したほうがよい。

## 何ができるようになったのか

Code Quality は、pull request と default branch の両方でコード品質の問題を見つける。pull request では、`github-code-quality[bot]` がコメントを出す。可能な場合は、Copilot Autofix が修正案も提示する。人間のレビューを置き換えるというより、レビュー前に問題を見つけやすくする機能である。

GA では、組織単位の有効化、組織レベルの dashboard、test coverage の pull request 表示、ruleset を使った quality gate、repository enablement や findings を扱う API も重要になった。つまり、個別 repository の便利機能ではなく、会社全体の品質管理に近づいた。

## 費用は三つに分けて見る

一つ目は active committer のライセンス費用である。Code Quality が有効な repository に、過去90日以内に push された commit がある人が数えられる。社員だけでなく、外部協力者や一時的な参加者がどう扱われるかも見たほうがよい。

二つ目は GitHub Actions minutes である。Code Quality の CodeQL analysis は GitHub Actions workflow として動く。大きな repository や pull request が多い repository では、ライセンスより先に Actions の消費が問題になることがある。

三つ目は GitHub AI Credits である。AI-assisted detection や Copilot Autofix のように AI model を使う作業は、usage-based billing の対象になる。Copilot Chat の利用量だけを見ていると、Code Quality 側の AI 利用を見落とす可能性がある。

## 日本の会社で最初に見ること

まず、Code Quality が有効な repository を一覧にする。重要なサービス、外部公開 API、個人情報を扱う repository、AI agent がよく変更を作る repository は優先度が高い。一方、研修用、PoC、休眠、archive 予定の repository まで同じ設定で残す必要はないかもしれない。

次に、誰が findings を見るかを決める。AI が見つけた問題でも、必ず正しいとは限らない。逆に、AI が問題なしと判断しても安全が保証されるわけではない。AI findings、CodeQL findings、coverage gate、Autofix の提案を、誰が確認し、何日以内に直すかを決める必要がある。

最後に、費用の持ち方を決める。開発チーム、情シス、セキュリティ、FinOps が別々に見ていると、品質向上のための費用なのか、AI 利用の費用なのか、CI の費用なのかが混ざる。license、Actions minutes、AI Credits を分けて月次で見るほうが説明しやすい。

## 今回の意味

GitHub Code Quality GA は、AI がコードを書く時代に、品質管理も GitHub 上で自動化・標準化していく動きである。ただし、自動化が増えるほど、費用、権限、承認責任も増える。

日本企業にとっては、まず全社一律でオンにするかオフにするかではなく、repository の重要度で分けることが現実的である。重要 repository から始め、coverage、ruleset、Autofix、AI Credits を同じ運用表で管理すれば、品質改善と費用管理を両立しやすくなる。

## 出典

- [GitHub Code Quality is now generally available](https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/) - GitHub Changelog, 2026-07-20
- [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) - GitHub Docs
- [About GitHub Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality) - GitHub Docs
