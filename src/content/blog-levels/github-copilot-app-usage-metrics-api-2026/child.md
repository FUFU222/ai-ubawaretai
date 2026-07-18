---
article: 'github-copilot-app-usage-metrics-api-2026'
level: 'child'
---

GitHub Copilot app の利用状況が、Copilot usage metrics API で見られるようになりました。GitHub は2026年7月17日、enterprise と organization の 1-day / 28-day report に、Copilot app の active users や session、request、prompt、token usage を追加したと発表しました。

簡単に言うと、管理者が「Copilot app がどれくらい使われているか」を、他の Copilot 指標と分けて見られるようになったということです。IDE補完やcode reviewの数字に混ざらず、Copilot app という使い方だけを確認しやすくなりました。

## 何が増えたのか

追加された主な項目は2つです。1つ目は `daily_active_copilot_app_users` です。これは、ある日に Copilot app を使った人数を表します。

2つ目は `totals_by_copilot_app` です。ここには、session数、request数、prompt数、token usage が入ります。token usage には、入力token、出力token、requestあたりの平均tokenなどが含まれます。

Copilot app の利用がない場合、この2つの値は `null` になります。つまり、既存の集計に急に大きな値が混ざるのではなく、appの活動があるときだけ専用の項目として見える形です。

## なぜ大事なのか

Copilot の利用は、昔のように「補完を使っているか」だけでは説明できなくなっています。Chat、code review、coding agent、Copilot app など、使う場所が増えているからです。

たとえば、あるチームが Copilot app をよく使っているとしても、それがすぐにPR作成数の増加として見えるとは限りません。調査、相談、設計の整理に使っているだけかもしれません。一方で、repo別のPR指標は伸びているのに Copilot app 指標が伸びない場合は、別の入口からAI支援が使われている可能性があります。

そのため、[GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)のようなコードベース単位の指標と、今回のapp指標は分けて見る必要があります。

## 日本企業では何を見るべきか

最初に見るべきなのは、使っている人数です。`daily_active_copilot_app_users` を見れば、どの部門やチームで Copilot app が広がっているかを確認できます。

次に見るべきなのは、使い方の深さです。session数やrequest数が多いチームは、業務の中でCopilot appを継続的に使っている可能性があります。人数は多いのにsessionが少ない場合は、試しただけで定着していないかもしれません。

最後に見るべきなのは、token usage です。これは費用そのものではありませんが、AI Credits の消費に近い説明材料になります。[GitHub Copilot AI Credits課金、6月運用の初期設計](/blog/github-copilot-ai-credits-billing-budgets-2026/)でも扱ったように、AI利用の費用は席数だけでは見えません。

## 注意すること

token usage が多いからといって、必ず成果が大きいとは言えません。複雑な仕事を任せているのかもしれませんし、プロンプトが長すぎるだけかもしれません。

また、active user が少ないから悪いとも限りません。まず一部のチームで試している段階なら、少ないほうが自然です。大事なのは、人数、session、token usage、PR指標、費用を分けて見ることです。

特に日本企業では、開発部門、情シス、購買、経理で見たい数字が違います。開発部門はPRやレビューを見たい。情シスは利用者と管理設定を見たい。経理や購買は費用を見たい。今回のapp指標は、その会話を分けやすくする材料になります。

## まとめ

GitHub Copilot app が usage metrics API に入ったことで、管理者は Copilot app の利用人数、session、request、prompt、token usage を見られるようになりました。

この数字は成果そのものではありません。まずは、Copilot app がどのチームで使われ、どれくらい深く使われ、どれくらいAI実行量を生んでいるかを見るための入口として使うのが安全です。

## 出典

- [GitHub Copilot app now available in the usage metrics API](https://github.blog/changelog/2026-07-17-github-copilot-app-now-available-in-the-usage-metrics-api/) - GitHub Changelog, 2026-07-17
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
