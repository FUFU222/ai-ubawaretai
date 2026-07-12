---
article: 'github-copilot-budget-user-states-api-2026'
level: 'child'
---

GitHub Copilot の AI Credits には、使いすぎを防ぐための budget がある。今回 GitHub が追加したのは、その budget の中で「誰がどれくらい使っているか」を REST API からまとめて見る機能だ。

これまでも管理者は budget を設定できた。ただし、設定したあとに、どの利用者が上限に近いのか、誰だけ例外設定になっているのかを継続して見るには手間がかかった。新しい user states API を使うと、multi-user budget に含まれる利用者ごとの状態を一覧できる。

日本企業で Copilot を全社導入すると、この違いは大きい。補完だけで使う人もいれば、Chat、CLI、cloud agent、コードレビューで多くの AI Credits を使う人もいる。全員を同じように見ると、重要な仕事をしている人が急に止まったり、逆に例外上限が残り続けたりする。

## 何が見えるようになるのか

新しい API では、multi-user budget に入っているユーザーの消費状況を取得できる。現在どれだけ使ったか、上限はいくらか、上限に対して何%くらいまで来ているか、個別の override があるかを確認できる。

たとえば、消費率が80%を超えた人だけを取り出せる。90%を超えた人だけを毎朝通知することもできる。上限に達してから慌てるのではなく、止まる前に本人やチームリードへ知らせられる。

これは、[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/) で始まった費用管理を、より日々の運用に近づける更新だ。[cost center別ユーザー予算](/blog/github-copilot-cost-center-user-budget-2026/) を置いた会社ほど、誰がその上限に近いかを見続ける必要がある。

## なぜ日本企業で重要なのか

日本企業では、部門別予算やプロジェクト別原価が重視されやすい。Copilot の費用も、単に「全社でいくら」ではなく、どの部署がどれだけ使ったか、誰が例外的に多く使ったかを説明する場面が出てくる。

ただし、AI Credits が多いこと自体は悪いとは限らない。大きな移行作業、障害調査、セキュリティ修正では、Copilot を重く使うことに意味がある。大事なのは、使いすぎを責めることではなく、上限に近い人を早めに見つけ、止めるのか、増枠するのか、作業方法を変えるのかを決めることだ。

[AI credit pool](/blog/github-copilot-ai-credit-pool-cost-center-2026/) のように部門の含有枠を守る機能と、今回の user states API は役割が違う。pool は部門全体の枠を見る。user states API は、その中の利用者ごとの状態を見る。両方を合わせると、部門と個人の両方で状況を把握しやすくなる。

## どう使い始めるか

最初は難しいダッシュボードを作る必要はない。まず、対象 budget の ID、対象部門、通知先、80%と90%のしきい値、例外上限の期限を表にする。次に、API で user states を取得し、しきい値を超えた人だけを通知する。

そのうえで、月次の usage report と見比べる。user states API は「今どれくらい上限に近いか」を見るものだ。usage report は「なぜ消費が増えたのか」を分析するものだ。両方を混ぜず、役割を分けると運用しやすい。

今回の更新は、派手な新機能ではない。しかし Copilot を業務基盤として使う会社には効く。budget を設定して終わりではなく、上限に近づいた人を早めに見つけ、必要な会話を始められるからだ。

## 出典

- [Per-user states for multi-user budgets in the REST API](https://github.blog/changelog/2026-07-10-per-user-states-for-multi-user-budgets-in-the-rest-api/) - GitHub Changelog, 2026-07-10
- [Budgets - GitHub Enterprise Cloud REST API](https://docs.github.com/en/enterprise-cloud@latest/rest/billing/budgets?apiVersion=2026-03-10) - GitHub Docs
- [Per-user budgets for cost centers in the billing UI](https://github.blog/changelog/2026-07-07-per-user-budgets-for-cost-centers-in-the-billing-ui/) - GitHub Changelog, 2026-07-07
