---
title: 'Copilot Billing Preview廃止、8月3日までの移行点検'
description: 'GitHub Copilot Billing Preview app廃止を整理。日本企業が8月3日までにAI Credits、cost center、usage report、billing APIへどう移行すべきか解説する。'
pubDate: '2026-07-07'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'AIガバナンス', '日本企業']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月7日**、GitHub Copilotの**Copilot Billing Preview appを2026年8月3日に廃止する**と発表した。このappは、Copilotがusage-based billingへ移る過程で、支出を確認するために用意された暫定的なGitHub Appだった。GitHubは今回、標準のbilling settings側でより多くの情報を見られるようになったため、preview appを残すより組み込み体験へ移すと説明している。

今回のポイントは「古いappが消える」だけではない。GitHubは代替として、billing settings内のAI usage page、budget設定、user-level budgets、usage reports、billing APIを挙げている。つまり、Copilot費用管理の主戦場は、外付けpreview appから、GitHub本体の請求・予算・レポート基盤へ移る。

日本企業では、6月から始まった[GitHub Copilot AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)や、[cost center別のAI credit pool管理](/blog/github-copilot-ai-credit-pool-cost-center-2026/)を前提に、8月3日までに運用導線を確認しておくべきだ。さらに、月次レポートや監査証跡を作っている組織は、[GitHub AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/)や[Copilot usage metrics補正](/blog/github-copilot-usage-metrics-accuracy-2026/)と混同しない形で、請求データと利用データの役割を分ける必要がある。

## 事実: Preview appは8月3日に廃止される

GitHub Changelogによると、Copilot Billing Preview appは2026年8月3日にretireされる。GitHubは、このappをCopilotがusage-based billingへ移行する時期の支出把握のために作ったと説明している。その後、GitHubのbilling settingsが拡張され、user-level budgets、cost centers、usage pool allocationなど、preview appの元になっていたreportsでは見られない情報まで扱えるようになった。

ここで重要なのは、廃止理由が「使わないでほしい」ではなく「より完全な情報を標準画面で見てほしい」だという点だ。Preview appのまま運用を続けると、支出の一部しか見えない可能性がある。GitHubは不完全な見え方を残すより、組み込みbilling experienceへ寄せる判断をした。

代替導線として、GitHubはAI usage pageでAI credit dataをgroup、filter、exportできること、budgetで支出をcapできること、organizationやenterpriseではuser-level budgetsで個人単位の支出を追跡・制御できること、usage reportsとbilling APIからraw usage dataを取得できることを挙げている。

## 事実: Copilot課金は席数とAI Creditsの二層になっている

GitHub Docsでは、organization向けCopilot Businessは1ユーザー月19ドル、Copilot Enterpriseは1ユーザー月39ドルと説明されている。あわせて、Businessは1ユーザーあたり月1,900 AI credits、Enterpriseは月3,900 AI creditsを含む。Copilot利用はusage-based billingのもとでAI creditsとして測られ、ライセンスごとのcreditsは共有enterprise poolへ入る。プールを超えた利用は1 AI creditあたり0.01ドルで課金される。

一方で、code completionsとnext edit suggestionsはpaid planではAI credits課金の対象外として扱われる。これは現場説明で重要だ。IDE補完を多く使うチームと、Copilot Chat、CLI、cloud agent、code review、third-party coding agentsを広く使うチームでは、同じ席数でもAI Credits消費が違う。Preview app廃止後の管理では、席数の月額とAI Creditsの従量消費を分けて見る必要がある。

また、Docsはbudget controlsをuser、cost center、enterprise levelで設定できると説明している。日本企業の情シスやFinOpsにとっては、ここが実務の中心になる。部門ごとに予算責任を持つ会社では、共有プールだけでは説明が難しい。cost center、user-level budget、usage reportを組み合わせ、誰の利用をどの予算へ帰属させるかを先に決める必要がある。

## 考察: 8月3日までに見るべきなのは画面移行ではなく運用移行

今回の発表をUI変更として扱うと、対応は「Preview appを消して、billing settingsを見る」で終わってしまう。しかし、企業運用ではそれでは足りない。Preview appに依存していた定例レポート、経理向けCSV、部署別の費用配賦、月末の異常値確認、管理者のアクセス権限を棚卸しする必要がある。

特に日本企業では、Copilot費用が開発部門のSaaS費なのか、全社DX予算なのか、プロジェクト原価なのかで説明先が変わる。6月以降、Copilotは単なる席数課金ではなく、AI Creditsの消費と予算上限を含む運用になった。8月3日のpreview app廃止は、その移行が「試験的な確認」から「標準の請求統制」へ移る期限として読むほうがよい。

実務では、まず現在のPreview app利用者を特定する。次に、その利用者が何を見ていたかを分類する。全体支出、個人別消費、cost center別消費、raw usage data、月次エクスポート、予算超過アラートのどれを使っていたのかで、移行先が違う。すべてをAI usage pageへ寄せるのではなく、ダッシュボードを見る人、CSVを扱う人、APIからBIへ流す人を分けるべきだ。

## 8月3日までの移行チェックリスト

第一に、GitHub AppとしてのCopilot Billing Preview appをどのorganizationやenterpriseにinstallしているか確認する。廃止日に慌てて権限を探すのではなく、今のうちに管理者、billing manager、FinOps担当、経理担当の利用実態を洗い出す。

第二に、AI usage pageで必要なgroup、filter、exportが足りるか確認する。月次の経理処理に必要な粒度が画面exportだけで足りるなら、運用は軽い。一方、部署別、プロジェクト別、委託先別に配賦するなら、usage reportsやbilling APIからraw dataを取得し、社内の原価管理表へ接続する設計が必要になる。

第三に、user-level budgetとcost centerの責任者を決める。user-level budgetは個人の使いすぎを止める仕組みとして有効だが、全員に同じ上限を置くと、cloud agentやcode reviewを本格利用するチームが先に詰まる。逆に上限を緩くしすぎると、共有プールを一部チームが消費し、月末に説明できない。利用目的別に上限を分けるのが現実的だ。

第四に、usage metricsとbilling dataを混同しない。Copilot usage metricsは採用状況、IDE/CLI利用、PR lifecycle、acceptance rateなどを見るためのデータであり、licenseやseat managementのsource of truthではない。請求と配賦にはbilling側のusage reportsやAPIを使い、導入効果の評価にはusage metricsを使う。この線引きを文書化しておくと、月次会議で数字が食い違ったときに説明しやすい。

## 日本企業への実務影響

日本の大きな組織では、AIツールの導入可否だけでなく、予算統制と監査証跡が導入継続の条件になりやすい。Copilotを全社へ広げるほど、開発者体験より先に「誰がどの費用を承認したのか」「どの部門が使ったのか」「予算超過時に止まるのか」が問われる。Preview app廃止は、その問いをGitHub標準のbilling governanceへ移すきっかけになる。

また、8月3日は日本企業の四半期運用では中途半端なタイミングだ。7月中に移行検証を終え、8月請求から新しいレポート形式で説明できるようにしておくとよい。特に、委託先や子会社を含むenterpriseでは、seat assignment、organization membership、cost center、usage reportの粒度がずれる可能性がある。廃止日直前ではなく、1回は月次締めのリハーサルを行うべきだ。

結論として、Copilot Billing Preview app廃止は小さなchangelogに見えるが、Copilotの費用管理を正式なbilling settings、AI usage page、budget controls、usage reports、billing APIへ移す節目だ。日本企業は8月3日までに、画面の置き換えではなく、請求データの取得、部門配賦、上限設定、監査説明の流れを確認しておきたい。

## 出典

- [Copilot Billing Preview app will be retired on August 3](https://github.blog/changelog/2026-07-07-copilot-billing-preview-app-will-be-retired-on-august-3/) - GitHub Changelog
- [About billing for GitHub Copilot in organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) - GitHub Docs
