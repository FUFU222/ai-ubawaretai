---
article: 'github-copilot-ai-credits-billing-budgets-2026'
level: 'child'
---

GitHub Copilotの課金が、**2026年6月1日**からGitHub AI Creditsを中心に変わりました。これまでは「何人がCopilotを使うか」を見れば費用を考えやすかったのですが、これからは「どの機能を、どのモデルで、どれくらい使ったか」も大事になります。

日本企業では、開発チーム、情シス、購買、経理がそれぞれ違う観点でCopilotを見ます。だからこそ、今回の変更は料金表を読むだけでは足りません。予算、利用上限、Copilot code reviewの実行環境まで一緒に整理する必要があります。

## 何が変わったのか

GitHubの発表では、全Copilotプランでusage-based billingが有効になりました。Copilot Chat、Copilot CLI、Copilot cloud agent、Spaces、Spark、third-party coding agentsなど、AIモデルを使う機能はGitHub AI Creditsを消費します。

AI Creditsは、入力トークン、出力トークン、キャッシュされたトークン、そして使ったモデルによって決まります。つまり、短い質問と、複数ファイルをまたぐ長いagent作業では、同じ1回の利用でも消費が変わります。

一方で、コード補完とnext edit suggestionsは、paid planではAI Creditsを消費しないとGitHub Docsは説明しています。ここは安心材料ですが、ChatやCLI、cloud agentを多く使うチームでは、補完だけの時代より費用の見方が細かくなります。

## 会社向けでは共有プールを見る

Copilot BusinessとCopilot Enterpriseでは、ユーザーごとのAI Creditsが会社や組織の単位でプールされます。誰かが多く使っても、全体のプールが残っていれば使い続けられます。

これは便利ですが、部門別の予算管理では注意が必要です。たとえば、あるチームだけがcloud agentをたくさん使うと、会社全体のプールを大きく消費するかもしれません。その利用が重要な成果につながっているなら問題ありませんが、予算責任が曖昧なままだと、あとで説明しにくくなります。

そこで重要になるのがuser-level budgetです。これは、ユーザーごとに使えるAI Creditsの上限を決める仕組みです。上限に達すると、そのユーザーのAI Creditsを使う機能は止まります。全員同じ上限にするのではなく、重い作業を担当する人と、軽く使う人で分けると運用しやすくなります。

## code reviewはActions minutesも見る

Copilot code reviewでは、AI CreditsだけでなくGitHub Actions minutesも関係します。特にprivate repositoryでGitHub-hosted runnerを使う場合、レビューが増えるほどActions側の消費も増えます。

以前の[Copilot code reviewの課金変更](/blog/github-copilot-code-review-actions-minutes-2026/)でも扱ったように、自動レビューを全PRに広げると便利ですが、回数が増えればコストも増えます。6月以降は、AIの利用量とrunnerの実行量を両方見ることが大事です。

組織管理者は、Copilot code reviewで使うdefault runnerも考える必要があります。GitHub-hosted runnerは簡単ですが、回数が多いとminutesが増えます。self-hosted runnerはActions minutesを抑えやすい一方で、運用とセキュリティの責任が増えます。

## 日本企業で先に決めること

まず、9月1日までの移行枠だけでなく、その後の通常枠でも足りるかを見ます。移行期間だけ余裕がある場合、秋以降に同じ使い方を続けると上限に近づくかもしれません。

次に、追加利用を許可するかを決めます。上限を超えても使い続けるなら費用が増えます。許可しないなら、次の請求サイクルまで利用が止まることがあります。どちらが正しいかは会社によりますが、月末に急に止まる前に決めておく必要があります。

最後に、使い方を分けて観察します。[Copilot usage metrics APIのAI adoption cohorts](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)のような指標を使えば、誰がどのように使っているかを見やすくなります。単に節約するのではなく、効果が高い使い方に予算を寄せることが大事です。

## まとめ

GitHub CopilotのAI Credits課金開始は、Copilotを月額の開発補助ツールではなく、利用量を管理するAI基盤として扱う変更です。日本企業では、共有プール、user-level budget、追加利用、code reviewのrunner方針をまとめて確認する必要があります。

まずは、誰が何に使っているかを見えるようにし、重い利用者には明示的な上限を与え、軽い利用者には標準上限を置くところから始めるのが現実的です。

## 出典

- [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) - GitHub Changelog, 2026-06-01
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
- [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
