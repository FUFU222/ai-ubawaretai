---
title: 'GitHub Copilot AI Credits表示、個人予算なし確認'
description: 'GitHub Copilotの使用量表示更新を整理。個人予算なしでも当月AI Creditsを確認できるため、日本企業が社内FAQ、予算統制、問い合わせ削減へどう使うかを解説する。'
pubDate: '2026-07-21'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'AIガバナンス', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月20日**、Copilot Business と Copilot Enterprise の利用者が、個人予算を設定されていない場合でも、当月 billing cycle の **AI Credits 使用量**を見られるようになったと発表した。表示場所は GitHub の個人設定内にある GitHub Copilot usage page である。

今回の更新は小さく見えるが、日本企業の Copilot 運用では効く。6月の [GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/) 以降、Copilot は席数だけでなく、モデル、機能、トークン量、budget によって費用が変わる開発 AI 基盤になった。一方、個人予算を置いていない利用者には、これまで自分の当月使用量を把握しにくい隙間があった。

今回の主題は、管理者向けの cost center でも、repo 別の効果測定でもない。[GitHub Copilot AI credit pool](/blog/github-copilot-ai-credit-pool-cost-center-2026/) が部門の含有枠を守る機能だとすれば、今回の更新は利用者本人に「今月どれだけ使っているか」を返す機能である。情シス、FinOps、開発部門は、この違いを社内FAQに分けて書く必要がある。

## 事実: 予算なしでも当月使用量を見られる

GitHub Changelog によると、Copilot Business と Copilot Enterprise の利用者は、個人 budget が設定されていない場合でも、現在の billing cycle で使った AI Credits の総量を見られるようになった。以前は、usage page が budget に対する割合を中心に表示していたため、個人 budget がない利用者には、月内の token usage を文脈化する手段が弱かった。

今回の表示は、admin が budget を設定しているかどうかで意味が変わる。個人 budget がない場合は、当月に使った AI Credits の合計が表示される。budget がある場合は、設定された総量に対して、どれだけ使ったかが見える。つまり、同じ usage page でも、「観測のための使用量」と「上限に対する残量」の2つの読み方が混在する。

GitHub Docs は、Copilot の usage-based billing について、budget controls が user、organization、cost center、enterprise の各レベルで Copilot usage を serve、meter、block する仕組みだと説明している。さらに、AI Credits は 1 credit = 0.01 米ドルの換算で budget を消費する。個人画面の表示が増えたことで、利用者本人にもこの単位を意識させやすくなる。

ただし、今回の更新は「自動で節約される」機能ではない。個人 budget がない場合、表示されるのは使用量であって、hard stop ではない。利用者が数字を見られることと、会社として上限を設定していることは別である。日本企業では、社内説明でここを混同しないほうがよい。

## 事実: 含有枠、個人予算、追加利用は別物である

Copilot Business と Enterprise では、利用者ごとの含有 AI Credits が請求主体の単位で共有される。GitHub Docs は、組織や enterprise 向けの usage-based billing で、含有 credits、追加利用 budget、管理者による budget controls を分けて説明している。

ここで利用者が見る「当月使用量」は、会社の全体 budget と同じではない。たとえば、ある開発者が今月 2,000 credits を使っているとしても、その人に hard stop が設定されているとは限らない。逆に、user-level budget が設定されている場合は、budget 到達時にその利用者の AI Credits 消費機能が止まる。個人画面の数字だけで、会社全体の残高や部門別上限を判断することはできない。

[Copilot使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/) は、移行前後の利用実績やモデル別・surface別の傾向を見るための材料だった。今回の個人表示は、それよりも利用者に近い。月次レポートが管理者の説明材料だとすれば、usage page は本人が日々の使い方を振り返る入口になる。

cost center との関係も分ける必要がある。cost center の AI credit pool は、部門が自部門のライセンス由来の含有枠を超えて共有プールを使いすぎないようにする仕組みである。今回の個人表示は、部門枠の配賦を自動で説明するものではない。部門別原価管理には cost center、本人へのフィードバックには usage page、全社の傾向には report や metrics を使う、という役割分担が現実的だ。

## 分析: 日本企業では問い合わせ削減に効く

ここからは分析である。

日本企業で Copilot の従量課金を広げると、最初に増えやすいのは「自分は今月どれだけ使っているのか」「止まるのか」「追加課金になるのか」という問い合わせだ。管理者画面だけで数字を持っている状態では、利用者本人が状況を確認できず、Slack やチケットで情シスへ聞くことになる。

今回の更新は、その一次問い合わせを減らせる。個人 budget がなくても使用量が見えるため、利用者は、長い Chat、Copilot CLI、cloud agent、code review などの使い方が月内の AI Credits にどう反映されるかを自分で見られる。特に、重い agentic workflow を試しているチームでは、数字が見えないまま利用を続けるより、本人が早めに増加傾向に気づけるほうがよい。

一方で、数字を見せるだけでは運用にならない。利用者が 1,000 credits を多いと見るのか少ないと見るのかは、会社のプラン、含有枠、標準的な使い方、担当業務によって変わる。情シスは「何 credit を超えたら悪い」という単純なメッセージではなく、用途別の目安を用意したほうがよい。

たとえば、IDE 補完中心の開発者、Copilot Chat を設計相談に使う開発者、Copilot CLI や cloud agent で大きな修正を回す開発者では、自然な使用量が違う。[repository-level usage metrics](/blog/github-copilot-repo-usage-metrics-ga-2026/) と組み合わせれば、個人の消費だけでなく、どのコードベースで agent や review が実際に使われているかも説明しやすくなる。

## 実務: 社内FAQに入れるべき項目

最初に入れるべき項目は、確認場所である。GitHub の個人 settings から Copilot usage page を開き、当月 billing cycle の AI Credits 使用量を見る、という導線を短く書く。管理画面のスクリーンショットだけでなく、利用者本人の画面を前提にした説明が必要だ。

次に、表示の意味を2パターンで書く。個人 budget がない人は当月使用量を見る。個人 budget がある人は、budget に対する使用量を見る。この違いを明示しないと、「数字が見えるなら上限もあるはず」「budget がないなら無料のまま」といった誤解が起きる。

3つ目に、止まる条件を分ける。user-level budget は hard stop になり得る。cost center budget や enterprise budget は、追加利用や部門単位の制御と関係する。cost center の AI credit pool は含有枠の取り合いを抑えるための制御であり、個人の画面表示とは目的が違う。社内FAQでは、これらを一つの「予算」と呼ばないほうがよい。

4つ目に、問い合わせ先を整理する。個人画面の表示が明らかにおかしい、budget に達していないのに機能が止まる、モデルや surface の使い方が分からない、部門予算との対応を知りたい、という問い合わせは担当が違う。情シス、GitHub管理者、FinOps、部門責任者のどこが答えるかを分けておく。

5つ目に、月次レビューへつなげる。個人画面は日々の確認、管理者レポートは月次の傾向、repo metrics は開発効果の確認、cost center は部門配賦に使う。これらを同じ表に無理にまとめず、役割ごとに分けるほうが運用しやすい。

## 注意点: 個人表示だけで成果は測れない

今回の更新は、利用者の透明性を上げるものだが、Copilot の成果測定を置き換えるものではない。AI Credits が多い人が必ず高い成果を出しているわけではないし、少ない人が使えていないとも限らない。障害対応、大規模移行、設計調査では消費が高くなりやすく、軽い補完や短い相談では低くなりやすい。

また、個人表示は部門の公平性を直接保証しない。部門別に含有枠を守りたい場合は、cost center の AI credit pool や budget controls を使う必要がある。重要なのは、本人に見える数字、管理者が見る予算、経理が見る配賦、開発責任者が見る成果を混ぜないことだ。

日本企業での使いどころは、まず透明性と会話の土台である。利用者が当月使用量を見られるようになると、管理者は「使いすぎかどうか」を一方的に通知するだけでなく、「どの作業で増えたのか」「高いモデルや長い agent session をどこで使うべきか」を本人と話しやすくなる。

## まとめ

GitHub Copilot の AI Credits 表示更新は、個人 budget がない Business / Enterprise 利用者にも、当月 billing cycle の使用量を返す小さな改善である。しかし、Copilot が usage-based billing に移った後の日本企業にとっては、社内問い合わせ、セルフチェック、予算説明をかなり進めやすくする更新でもある。

管理者は、この表示を budget control と混同せず、本人向けの透明性として使うべきだ。個人画面では使用量を見せ、user-level budget で停止条件を作り、cost center で部門配賦を管理し、repo metrics で開発効果を確認する。AI Credits の運用は、数字を隠すより、誰がどの数字を何のために見るかを分ける段階に入っている。

## 出典

- [Copilot users can now see AI credits used per billing cycle](https://github.blog/changelog/2026-07-20-copilot-users-can-now-see-ai-credits-used-per-billing-cycle/) - GitHub Changelog, 2026-07-20
- [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Usage-based billing for organizations and enterprises](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
