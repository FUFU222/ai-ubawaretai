---
article: 'github-copilot-team-metrics-api-2026'
level: 'child'
---

## 何が変わったのか

GitHubは2026年5月14日、GitHub Copilotのusage metrics APIに、チーム別の利用状況を作るためのuser-teams reportを追加しました。

これは、最初から完成した「チーム別ダッシュボード」が出たという意味ではありません。Copilotを使っているユーザーが、その日にどのチームへ所属していたかを取得できるようになり、別に取得できるユーザー別の利用レポートと組み合わせられるようになった、という更新です。

たとえば、ある会社にfrontendチームとbackendチームがあり、同じ開発者が両方に入っているとします。user-teams reportには、その開発者がどちらのチームにも所属していることが出ます。そこへユーザー別のCopilot利用量をつなぐと、チームごとの利用状況を作れます。

[Copilot使用量レポートでAI Creditsを見積もる話](/blog/github-copilot-ai-credits-usage-report-2026/)は、主に「6月以降にいくらかかりそうか」を見る更新でした。今回のteam-level metricsは、それを「どのチームが使っているのか」まで分解するための材料です。

## なぜ日本企業に関係するのか

日本企業では、SaaSやクラウド費用を部門別に配賦することがよくあります。GitHub Copilotも、AI Creditsへ移ると、単に「何席あるか」だけでは費用を説明しにくくなります。

同じ10人のチームでも、軽いコード補完だけ使うチームと、[Copilot cloud agentをREST APIで起動するような自動化](/blog/github-copilot-cloud-agent-rest-api-2026/)を多く使うチームでは、消費の形が違います。さらに、[GitHub Copilot app](/blog/github-copilot-app-technical-preview-2026/)のように、agent作業をデスクトップから扱う入口も増えています。

そのため、管理者は「会社全体でCopilotをどれだけ使ったか」だけでなく、「どのチームが、どの機能を、どのくらい使ったか」を見たくなります。今回のAPIは、そのためのデータを取り出しやすくするものです。

## 使うときの注意点

注意点は3つあります。

1つ目は、REST APIだけの提供であることです。今回の更新では、GitHubの画面にチーム別ダッシュボードが増えたわけではありません。管理者がAPIでデータを取り、社内のBIやスプレッドシート、DWHに取り込む必要があります。

2つ目は、小さなチームが出ないことです。GitHub Docsでは、Copilot seatを持つユーザーが5人未満のチームはuser-teams reportから除外されると説明されています。小さなPoCチームや兼務チームが多い会社では、チーム別レポートだけで判断すると利用が抜ける可能性があります。

3つ目は、複数チーム所属の人です。1人が複数チームに入っている場合、その人の利用は複数のチームに反映されます。これはチーム別に見るには便利ですが、チームの数字を全部足して会社全体の数字にする用途には向きません。

## まず何をすべきか

最初から複雑な生産性分析を作る必要はありません。まずは、team、day、active users、利用したfeature、model、IDE、languageを並べる簡単な集計で十分です。

そのうえで、社内の部門コードや原価センターとつなぎます。これにより、Copilotの費用や利用増加を、どの部門の開発活動として説明するのかが見えます。[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)も含めて考えると、AI Creditsだけでなく周辺コストも部門別に見たほうがよいでしょう。

結論として、今回のteam-level metrics APIは派手な機能ではありません。しかし、Copilotを本格導入する会社にとっては、予算管理と導入効果の説明に必要な土台になります。

## 出典

- [Team-level Copilot usage metrics now available via API](https://github.blog/changelog/2026-05-14-team-level-copilot-usage-metrics-now-available-via-api/) — GitHub Changelog, 2026-05-14
- [Team-level Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/team-level-metrics) — GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) — GitHub Docs
