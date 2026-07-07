---
article: 'github-copilot-billing-preview-app-retirement-2026'
level: 'child'
---

GitHubは、Copilotの**Billing Preview appを2026年8月3日に廃止する**と発表しました。このappは、Copilotが使った量に応じた課金へ移る途中で、支出を見やすくするために用意されていたものです。

廃止といっても、Copilotの請求情報が見られなくなるわけではありません。GitHubは、これからはGitHubのbilling settingsにあるAI usage page、budget、usage reports、billing APIを使うように案内しています。

## 何が変わるのか

これまでPreview appでCopilotの支出を見ていた会社は、8月3日までに標準のbilling settingsへ移る必要があります。GitHubは、標準画面のほうがuser-level budgets、cost centers、usage poolの割り当てなど、より詳しい情報を扱えるようになったと説明しています。

つまり、古いappが消えるというより、Copilotの費用管理が正式な場所へ移ると考えると分かりやすいです。画面で見る人はAI usage pageへ、CSVや社内BIで見る人はusage reportsやbilling APIへ移すことになります。

## なぜ日本企業では大事なのか

Copilotは、単に「1人いくら」のツールではなくなっています。Copilot Chat、CLI、cloud agentなどを多く使うと、GitHub AI Creditsの消費を見る必要があります。BusinessやEnterpriseでは、会社全体の共有プール、ユーザーごとのbudget、cost centerごとの管理も関係します。

日本企業では、開発部門、情シス、経理、購買が同じ数字を別の目的で見ます。開発部門は便利さや定着率を見たい。経理は月次請求を見たい。情シスは予算超過や管理者権限を見たい。Preview appの廃止をきっかけに、どの数字を誰が見るのか決め直す必要があります。

## 8月3日までに確認すること

まず、会社のどこでCopilot Billing Preview appを使っているか確認します。GitHub Appとして入れているorganization、見ている管理者、月次レポートに使っているCSVがあれば洗い出します。

次に、GitHubのbilling settingsで同じ情報を見られるか確認します。AI usage pageでgroup、filter、exportができるか、user-level budgetで個人ごとの上限を設定できるか、cost centerで部門別に見られるかを試します。

最後に、請求データと利用データを分けて考えます。usage reportsやbilling APIは費用説明に使います。一方、Copilot usage metricsは、Copilotがどれくらい使われているか、開発フローに効いているかを見るためのものです。目的が違うので、同じ数字として扱わないほうが安全です。

## まとめ

Copilot Billing Preview appの廃止は、Copilotの費用管理が試験的なappから標準機能へ移るサインです。8月3日までに、誰が、どの画面やAPIで、どの単位の費用を見るのかを決めておけば、月次締めや部門配賦で慌てにくくなります。

## 出典

- [Copilot Billing Preview app will be retired on August 3](https://github.blog/changelog/2026-07-07-copilot-billing-preview-app-will-be-retired-on-august-3/) - GitHub Changelog
- [About billing for GitHub Copilot in organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises) - GitHub Docs
- [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) - GitHub Docs
