---
article: 'github-copilot-cost-center-budgets-ui-2026'
level: 'child'
---

GitHubは、GitHub Copilotの費用管理で使う**cost center user-level budget**を、Billing UIから作成できるようにしました。これは、部門やチームごとに「1人あたり、今月いくら分のAI Creditsまで使えるか」を決めるための機能です。

以前は、この設定をREST APIで作る必要がありました。APIは大規模な自動化には便利ですが、最初に試す管理者や、月次で確認する情シス・FinOps担当には少し重い方法です。今回UIに入ったことで、少数の部門から始めたり、設定内容を画面で確認したりしやすくなります。

## 何ができるようになったのか

Enterprise管理者は、GitHubのBilling UIでcost centerを管理し、そのcost centerにenterprise teamや個別ユーザーを追加できます。さらに、そのcost centerに1人あたりのbudgetを設定できます。

たとえば、開発基盤チームはagentやCLIを多く使うので高めの上限、通常の開発チームは標準の上限、検証だけのチームは低めの上限にする、といった分け方ができます。

大事なのは、team membershipが変わったときにbudgetの対象も追随しやすいことです。人が異動したり、新しい人がチームへ入ったりするたびに、全員分の個別budgetを手作業で作る必要はありません。

## なぜAI Creditsでは重要なのか

Copilotは、単に「1人あたり月額いくら」のツールではありません。Copilot Chat、Copilot CLI、cloud agent、code reviewなどを使うと、GitHub AI Creditsの消費を管理する必要があります。

全員に同じ上限を置くと、よく使うチームがすぐ止まることがあります。逆に、全員を高い上限にすると、少数の利用者が会社全体の共有poolを多く使ってしまうかもしれません。

cost center user-level budgetは、その間を作る機能です。全社の標準上限だけでなく、部門やチーム単位で1人あたりの上限を変えられます。

## cost center budgetとの違い

名前が似ていますが、cost center user-level budgetとcost center budgetは違います。

cost center user-level budgetは、cost centerに属する**各ユーザー**の上限です。共有poolから使っている段階でも、追加課金に入った後でも効きます。ユーザーが上限に達すると、その人のAI Credits消費は止まります。

cost center budgetは、cost center全体の追加課金を管理するものです。共有poolを使い切った後の支出を抑える役割です。

つまり、個人ごとの使いすぎはuser-level budgetで見ます。部門全体の追加課金はcost center budgetで見ます。この2つは同じcost centerに併用できます。

## 日本企業で確認すること

まず、cost centerを何に合わせるか決めます。人事部門、GitHub organization、開発プロダクト、プロジェクト原価のどれに合わせるかで、管理のしやすさが変わります。

次に、team membershipを誰が更新するか決めます。UIでbudgetを作っても、GitHub上のteamが古ければ、異動した人に古い予算が残ります。

最後に、個別budgetの例外を確認します。GitHub Docsでは、individual user-level budgetがcost centerの設定より優先されます。過去に特定ユーザーへ例外を作っていると、cost centerへ入れても標準上限にならないことがあります。

## まとめ

今回の更新で、GitHub Copilotの部門別予算はAPIだけでなくBilling UIでも扱いやすくなりました。日本企業では、8月3日のCopilot Billing Preview app廃止対応と合わせて、誰がBilling UIを見て、誰が上限を変更し、月次レポートにどう反映するかを決めておくと安全です。

## 出典

- [Per-user budgets for cost centers in the billing UI](https://github.blog/changelog/2026-07-07-per-user-budgets-for-cost-centers-in-the-billing-ui/) - GitHub Changelog
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Control GitHub costs at scale](https://docs.github.com/en/enterprise-cloud@latest/billing/tutorials/control-costs-at-scale) - GitHub Docs
