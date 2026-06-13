---
article: 'openai-codex-business-spend-controls-2026'
level: 'child'
---

OpenAI の ChatGPT Business で、Codex を使うときの credits と spend controls の説明が整理されました。少し難しく聞こえますが、要するに「会社で Codex を使うとき、誰がどれだけ使い、どこまで自動で追加購入するか」を決める話です。

Codex はコードを書いたり、調べたり、レビューしたりする AI エージェントです。便利ですが、Business で使う場合は credits を消費します。credits が足りないと、Codex のような使用量ベースの機能が使えなくなることがあります。

## Codex seat と標準 seat がある

ChatGPT Business には、標準の ChatGPT seat と、使用量ベースの Codex seat があります。会社は標準 seat だけを使うことも、Codex seat だけを使うことも、両方を混ぜることもできます。

ここで大事なのは、Codex seat を追加したら、それだけで終わりではないことです。Codex seat は credits を使います。つまり、席を配るだけでなく、credits をどれだけ用意するかも決めなければなりません。

以前の [Codex従量課金の記事](/blog/openai-codex-pay-as-you-go-teams-2026/) でも、Codex は小さく始めやすくなったと整理しました。今回の更新は、そのあとに必要になる支出管理の話です。

## credits は追加できる

OpenAI の説明では、Billing を管理できる権限を持つ人が、Workspace settings の Billing から credits を追加できます。Business で購入した credits は12カ月有効です。

もし workspace に credits が足りなければ、Codex のような機能が止まるかもしれません。これは、残高不足でサービスが使えなくなるのに近い状態です。だから、会社で Codex を使うなら、誰が credits を買えるのかを先に決めておく必要があります。

## auto top-up は便利だが上限が必要

automatic reload、つまり自動補充を設定すると、credits の残高が少なくなったときに自動で追加できます。minimum balance を下回ったら、target balance まで戻すように補充する仕組みです。

これは、リリース前や障害対応中に Codex が急に止まるのを防ぐために便利です。ただし、monthly recharge limit を決めないと、自動補充の金額が大きくなりすぎる可能性があります。

日本の会社では、ここが特に大切です。便利だから全部自動にするのではなく、「月にいくらまでなら自動でよいか」「それ以上は誰が承認するか」を決めておくべきです。

## spend controls は使いすぎを防ぐ

OpenAI は、seat type ごと、または user ごとに monthly credit usage limits を設定できると説明しています。たとえば、Codex seat の人には高めの上限を置き、標準 ChatGPT seat の人には低めの上限を置くことができます。

特定の user にだけ別の上限を置くこともできます。その場合、user ごとの設定が seat type の設定より優先されます。

これは、全員を同じように制限するためだけの機能ではありません。重要な開発者やリリース担当には十分な枠を与え、試用中の人には低めの枠を置く、といった使い分けができます。

## 支出管理とプライバシー管理は別

注意したいのは、spend controls は支出管理のための道具だという点です。OpenAI も、spend controls は privacy や chat visibility のルールを置き換えるものではないと説明しています。

つまり、月額上限を設定しても、業務コードや顧客情報の扱いが自動で安全になるわけではありません。誰が何を入力してよいか、どのアプリと接続してよいか、業務コードは会社の workspace で扱うのか、といったルールは別に必要です。

[Codex利用枠とcredit整理](/blog/openai-codex-plan-credits-limits-2026/) でも見たように、会社で使うなら個人利用と業務利用を分けることが大切です。

## まとめ

今回の更新は、Codex の新しい派手な機能ではありません。でも、会社で使うにはとても大事です。

日本の開発チームがまず決めるべきことは、次の4つです。誰が credits を買えるのか。自動補充はいくらまで許すのか。Codex seat と標準 seat の上限をどう分けるのか。支出管理とデータ管理をどう別々に扱うのか。

Codex を本当に仕事で使うなら、AIが賢いかだけでなく、止まらず、使いすぎず、安全に管理できるかを見る必要があります。

## 出典

- [Managing credits and spend controls in ChatGPT Business](https://help.openai.com/en/articles/20001155-managing-credits-and-spend-controls-in-chatgpt-business) - OpenAI Help Center
- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) - OpenAI Help Center
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center
