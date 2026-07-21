---
article: 'github-copilot-ai-credits-cycle-visibility-2026'
level: 'child'
---

GitHub Copilot は、使った分に応じて **AI Credits** という単位を消費します。GitHub は 2026年7月20日、Copilot Business と Copilot Enterprise の利用者が、個人予算を設定されていなくても、今月どれだけ AI Credits を使ったか見られるようにしました。

これは、会社の管理者だけでなく、使っている本人にも大事な変更です。[GitHub Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/) が始まってから、Copilot は「毎月の席代だけを見るツール」ではなくなりました。Chat、CLI、cloud agent など、使い方によって消費が変わります。

## 何が見えるようになったのか

GitHub の説明では、Copilot Business と Copilot Enterprise のユーザーは、自分の GitHub Copilot usage page で、今の billing cycle に使った AI Credits を見られます。

これまでは、個人に budget がある場合は、その budget に対してどれだけ使ったかを見られました。しかし、個人 budget がない人には、自分の使用量が分かりにくい状態がありました。今回の更新で、budget がなくても「今月ここまで使った」という数字を確認できます。

もし管理者が個人 budget を設定している場合は、使った量だけでなく、budget 全体に対してどれくらい使ったかを見る形になります。つまり、budget がある人とない人で、同じ画面の意味が少し違います。

## 予算がないなら止まらないのか

ここは注意が必要です。

個人 budget がない人に使用量が表示されても、それだけで自動的に止まるわけではありません。数字が見えることと、上限が設定されていることは別です。

会社は user-level budget、organization budget、cost center budget、enterprise budget などを使って、利用を制御できます。[AI credit pool](/blog/github-copilot-ai-credit-pool-cost-center-2026/) のように、部門ごとの含有枠を守る仕組みもあります。ただし、これらは個人画面の表示とは役割が違います。

かんたんに言うと、個人画面は「自分の使用量を見る場所」です。budget は「使いすぎたときに止める、または追加利用を管理するルール」です。この2つを分けて理解することが大切です。

## なぜ会社にとって大事なのか

会社で Copilot を使っていると、「自分は今月どれくらい使っているのか」「追加料金になるのか」「使いすぎなのか」という質問が出ます。これまでは、管理者に聞かないと分かりにくいことがありました。

今回の更新で、利用者本人がまず自分で確認できます。情シスや管理者は、同じ質問に何度も答える負担を減らせます。また、開発者も、長い Chat や agent 作業をした後に、使用量がどう変わるか見やすくなります。

ただし、AI Credits が多いから悪い、少ないから良い、とは言えません。大きな調査や障害対応では使用量が増えることがあります。逆に、軽いコード補完や短い質問中心なら少なくなります。

## どう使えばよいか

まず、社内FAQに確認場所を書きます。GitHub の個人設定から Copilot usage page を開き、今月の AI Credits 使用量を見る、という手順です。

次に、budget がある場合とない場合の違いを書きます。budget がない人は使用量を見るだけです。budget がある人は、budget に対してどれくらい使ったかを見ます。

最後に、困ったときの問い合わせ先を分けます。表示の見方は情シス、部門別の費用は管理者や FinOps、リポジトリごとの効果は [repo指標](/blog/github-copilot-repo-usage-metrics-ga-2026/) のような別のデータで見る、という分け方が分かりやすいです。

## まとめ

今回の更新は、Copilot 利用者が自分の AI Credits 使用量を見やすくするものです。特に、個人 budget がない Business / Enterprise ユーザーにも数字が見えるようになった点が重要です。

日本の会社では、この表示を「使いすぎを責めるため」ではなく、「本人が使い方を理解し、管理者への問い合わせを減らすため」に使うのがよいでしょう。Copilot の費用管理では、個人表示、budget、cost center、repo 指標を別々に使い分けることが大切です。

## 出典

- [Copilot users can now see AI credits used per billing cycle](https://github.blog/changelog/2026-07-20-copilot-users-can-now-see-ai-credits-used-per-billing-cycle/) - GitHub Changelog
- [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Usage-based billing for organizations and enterprises](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
