---
article: 'openai-codex-business-spend-controls-2026'
level: 'child'
---

OpenAIのChatGPT Businessには、Codexなどで使うcreditsを管理するためのspend controlsが用意されている。これは、AIコーディングを会社で使うときに「使いすぎをどう防ぐか」を決めるための仕組みだ。

## creditsは共有の予算枠

CodexをBusinessワークスペースで使うと、利用量に応じてcreditsを消費する。これは個人の財布というより、会社やチームの共有予算に近い。

たとえば、ある開発者が大きなコードベースを何度も調べたり、長い修正をCodexに依頼したりすると、チーム全体のcreditsが減る。だから管理者は、残高だけでなく、誰がどのくらい使っているかを見る必要がある。

## auto top-upは便利だが注意が必要

auto top-upは、creditsが少なくなったときに自動で追加購入する仕組みだ。作業中にCodexが止まりにくくなるので、リリース前や障害対応では役に立つ。

一方で、いつの間にか費用が増える可能性もある。日本の会社では月次予算や承認フローがあるため、auto top-upを常に有効にする前に、上限額、通知先、承認者を決めておくべきだ。

## seatとspend controlsは別に考える

Codexを使う人にseatを渡すことと、その人がどこまでcreditsを使えるかは別の問題だ。全員に同じ上限を付けると、よく使う人には足りず、あまり使わない人には余る。

最初は、PoC担当の開発者には少し高めの上限を設定し、通常利用者には低めの上限を設定するのが現実的だ。利用状況を見ながら、あとで調整すればよい。

## 日本のチームが最初に決めること

まず、誰がcreditsの残高と利用状況を見るのかを決める。開発リーダーだけでなく、情シスや購買担当も関わると、あとで費用説明がしやすい。

次に、auto top-upを使うかどうかを決める。使うなら、月にいくらまで自動追加してよいかを決める。

最後に、Codexをどの作業に使うかを決める。コードレビュー、テスト作成、既存コード調査、UI修正など、作業ごとにcredits消費は変わる。最初の1か月は、何に使ったかを簡単に記録するとよい。

ここで大事なのは、支出管理を「使わせないための制限」にしないことだ。上限を決めるのは、必要な場面で安心して使うためでもある。残りcreditsが見え、追加購入のルールが決まっていれば、開発者も管理者も判断しやすくなる。

小さく始め、数字を見て広げるのが安全だ。これが基本になる。

## 出典

- [Managing credits and spend controls in ChatGPT Business](https://help.openai.com/en/articles/20001155-managing-credits-and-spend-controls-in-chatgpt-business) - OpenAI Help Center
- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) - OpenAI Help Center
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center
