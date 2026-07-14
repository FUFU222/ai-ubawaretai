---
article: 'github-code-quality-license-estimate-2026'
level: 'child'
---

GitHub は 2026年7月13日、GitHub Code Quality の費用を見積もるための表示を Billing and licensing 画面に追加した。Code Quality は 2026年7月20日に一般提供になり、その日から課金対象になる。つまり今回の更新は、「本番課金が始まる前に、どのくらいの費用になりそうかを確認しておこう」という管理者向けの機能である。

Code Quality は、コードの品質や問題を GitHub 上で見つけやすくする機能だ。ただし、無料 preview の間に便利だからと広げたままにしていると、一般提供後に思ったより費用が増える可能性がある。日本の会社でも、GitHub を全社で使っている場合は、開発チームだけでなく情シスや管理部門も確認したほうがよい。

## 見積もりに含まれるもの

GitHub の発表によると、見積もり画面では Code Quality の consumed licenses と estimated monthly payment を確認できる。これは、Code Quality を使っている repository に関わった active committer をもとにしたライセンス費用の見積もりである。

ただし、ここで見える金額がすべてではない。GitHub は、見積もりには GitHub Actions minutes や、AI を使う機能の usage-based charges は含まれないと説明している。また、標準価格をもとにした見積もりなので、会社ごとの割引も反映されない。

つまり、画面に出た金額は「最低限ここは見てください」という入口に近い。最終的な予算を考えるなら、Actions の利用量や AI Credits の使い方も別に見る必要がある。

## なぜ7月20日が重要なのか

GitHub Docs では、Code Quality は 2026年7月20日に public preview から general availability に移ると説明されている。preview 中は Code Quality 自体の利用に対して課金されないが、scan に使う GitHub Actions minutes は消費する。一般提供後は、active committer、Actions minutes、AI Credits のように複数の費用が関係する。

active committer は、Code Quality が有効な repository に commit した人を数える考え方だ。Docs では、過去90日以内に push された commit が基準になると説明されている。社員だけでなく、外部協力者や一時的に参加した人がどう扱われるかも確認したほうがよい。

GitHub Enterprise Server では Code Quality を使えない点も重要だ。GitHub Enterprise Cloud や GitHub Team を使っている会社が主な対象になる。オンプレミスの GitHub Enterprise Server を中心に運用している会社では、同じ前提で考えるとずれる。

## 何を確認すればよいか

まず、Billing and licensing 画面で Code Quality の見積もりを見る。次に、どの repository で Code Quality が有効になっているかを確認する。検証用、古い、ほとんど使っていない repository まで有効になっていないかを見るだけでも、無駄な費用を避けやすい。

次に、GitHub Actions minutes の消費を確認する。Code Quality の scan は Actions workflow として動くため、コードの量や scan の回数が多い repository では、ライセンス費用とは別に Actions 側の負担が出る。

最後に、AI Credits と Copilot Autofix の扱いを決める。Copilot Autofix は、code scanning alert に対して修正案を作る機能である。便利だが、AI の提案をそのまま本番へ入れてよいわけではない。誰が確認するか、どの repository で使うか、費用をどの部門にひもづけるかを決める必要がある。

## 日本のチームでの考え方

日本企業では、開発チーム、情シス、セキュリティ、経理や FinOps の担当が分かれていることが多い。Code Quality のような機能は、品質を上げるための開発ツールであると同時に、請求や監査にも関わる。だから、開発チームだけで決めるより、管理者も含めて有効化範囲を決めたほうがよい。

特に、重要なシステム、顧客データを扱うサービス、外部公開 API、AI agent がよく変更を作る repository では、Code Quality を使う意味が大きい。一方で、サンプルや休眠 repository まで同じ設定にする必要はないかもしれない。

今回の見積もり公開は、課金前に一度立ち止まるための合図である。7月20日を過ぎてから慌てるより、いま repository、active committer、Actions minutes、AI Credits を棚卸ししておくほうが安全だ。

## 出典

- [GitHub Code Quality license estimate in public preview](https://github.blog/changelog/2026-07-13-github-code-quality-license-estimate-in-public-preview/) - GitHub Changelog, 2026-07-13
- [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality) - GitHub Docs
- [About GitHub Code Quality](https://docs.github.com/en/code-security/concepts/about-code-quality) - GitHub Docs
