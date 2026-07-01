---
article: 'github-copilot-cost-center-user-budget-2026'
level: 'child'
---

GitHubは2026年6月30日、GitHub Copilotで使うAI Creditsに、**cost centerごとの1人上限**を設定できるようにしました。会社の管理者は、たとえば開発基盤チームは1人250米ドル、一般利用者は1人40米ドルというように、使い方が違うグループへ別々の上限を付けられます。

これまでも全社員へ共通の上限を付けたり、1人ずつ個別の上限を付けたりできました。今回、その中間に「部門やチームの標準上限」が加わりました。大きな会社が数千人分を手作業で設定しなくてよくなる点が重要です。

## メンバーが変わると予算も追随する

cost centerには、ユーザーを直接追加する方法と、enterprise teamを追加する方法があります。enterprise teamを使うと、そのteamへ新しく入った人にも同じ上限が適用され、外れた人は対象外になります。

たとえば4月の人事異動で、Aさんが一般開発teamからplatform teamへ移ったとします。GitHub上のenterprise teamも正しく変更されれば、Aさんへ適用されるcost center予算も新しいteamへ追随します。予算担当者が毎回Aさんの設定を探して変更する必要はありません。

ただし、GitHub上のteam情報が古ければ、予算も古い所属のままです。会社は、人事システムやIdPからteamを同期するのか、team ownerが手で更新するのかを決めておく必要があります。

## 似た名前の2つの予算

今回のcost center user-level budgetと、以前からあるcost center budgetは別のものです。

user-level budgetは、1人が1か月に使えるAI Creditsの総量を止めます。会社の共有プールが残っている間も、追加課金が始まった後も有効です。1人上限に達すると、必ず利用が止まります。

通常のcost center budgetは、共有プールを使い切った後に、その部門が追加で払う金額の合計を管理します。共有プールからの利用量は止めません。また、設定によっては予算額へ達しても課金が続きます。

そのため、2つはどちらか一方を選ぶものではありません。各人の使いすぎをcost center user-level budgetで抑え、部門全体の追加課金を通常のcost center budgetで抑える、という組み合わせができます。全体の仕組みは[Copilot AI Credits課金と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)も参考になります。

## どの上限が優先されるか

1人に複数の上限が当てはまるときは、より具体的な設定が優先されます。順番は、個人の上限、cost centerの上限、全社共通の上限です。

たとえば全社40米ドル、開発基盤team250米ドル、特定の検証担当者400米ドルなら、その担当者には400米ドルが適用されます。金額を全部足して690米ドルにするわけではありません。

この仕組みは便利ですが、個人の例外を増やしすぎると管理が難しくなります。なぜ増額したのか、いつ標準へ戻すのかを記録しないと、異動後も古い例外が残ります。期間限定の増額には終了日を決めるのが安全です。

## 日本企業が最初に確認すること

まず、どのenterprise teamをどのcost centerへ入れるかを一覧にします。人事部門名をそのまま使うより、Copilotの使い方が近い人をまとめたほうが、必要な上限を考えやすい場合があります。コード補完と短いChatだけの人と、CLIやcloud agentで長い作業をする人では消費量が違うからです。

次に、過去の利用実績を確認します。[AI Credits使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)を使い、誰がどの機能で多く使ったかを見ます。利用を一律に減らすのではなく、成果が出ているチームには十分な枠を渡すことが大切です。

最後に、上限へ達したときの連絡先を決めます。user-level budgetは必ず止まるため、障害対応や重要なリリース中でも利用できなくなることがあります。一時増額を誰が承認し、いつ戻すかまで手順にしておきます。

2026年6月30日時点では、この予算の作成はREST APIからだけ使えます。管理画面で簡単に作れるようになるまでは、APIの実行内容、実行者、変更前後の値を記録しておく必要があります。

## まとめ

GitHub Copilotのcost center user-level budgetは、部門やteamごとに1人あたりのAI Credits上限をまとめて設定する機能です。enterprise teamを使えば、人の出入りに合わせて予算対象も変わります。

重要なのは、通常のcost center budgetとの違いと、個人、cost center、全社の優先順位です。まず少数のteamで試し、メンバー同期、上限到達、例外の解除まで確認してから全社へ広げるのが現実的です。

## 出典

- [Per-user AI credit budgets available for cost centers](https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/) - GitHub Changelog, 2026-06-30
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Controlling and tracking costs at scale](https://docs.github.com/en/enterprise-cloud@latest/billing/tutorials/control-costs-at-scale) - GitHub Docs
