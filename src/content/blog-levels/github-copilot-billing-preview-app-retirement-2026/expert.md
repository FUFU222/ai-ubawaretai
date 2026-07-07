---
article: 'github-copilot-billing-preview-app-retirement-2026'
level: 'expert'
---

GitHubの2026年7月7日Changelogは、Copilot Billing Preview appを2026年8月3日にretireすると告知した。表面上は短い廃止告知だが、企業運用ではかなり実務的な意味がある。Copilotの費用管理が、移行期の補助appから、GitHub本体のbilling settings、AI usage page、budget controls、usage reports、billing APIへ寄せられるからだ。

このサイトではすでに、6月1日からの[GitHub Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)、[cost center別のAI credit pool管理](/blog/github-copilot-ai-credit-pool-cost-center-2026/)、[GitHub AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/)を扱ってきた。今回の廃止は、その流れの続きにある。AI Credits移行を一時的に観測する段階から、標準の請求統制へ移る段階になったということだ。

さらに、[Copilot usage metrics補正](/blog/github-copilot-usage-metrics-accuracy-2026/)で見たように、GitHubは利用量、採用状況、請求、予算をそれぞれ別のデータ面で整えている。ここを混同すると、月次レポートで「使用者数は増えたのに請求が合わない」「usage metricsとbilling reportの粒度が違う」という説明困難が起きる。

## 事実: Preview appの役割はusage-based billing移行期の補助だった

GitHub Changelogは、Copilot Billing Preview appが2026年8月3日にretireされると説明している。このappは、Copilotがusage-based billingへ移行する過程で、利用者がCopilot spendを理解できるように作られたものだった。

GitHubが今回示した廃止理由は明確だ。GitHubのbilling settingsが拡張され、preview appのunderlying reportsでは表示できないuser-level budgets、cost centers、usage pools allocationなどを扱えるようになった。したがって、preview appを残すと、管理者は不完全な絵を見続けることになる。GitHubはそれを避けるため、built-in experienceへ移す。

代替先も具体的に示されている。AI usage pageではAI credit dataをgroup、filter、exportできる。budgetではspendをcapできる。organizationやenterpriseではuser-level budgetsで個人単位の支出を制御・追跡できる。raw usage dataはusage reportsとbilling APIから取得できる。つまり、Preview appで見ていた「請求を理解する」仕事は、画面、予算、report、APIに分解される。

## 事実: Billing側のsource of truthとMetrics側のsource of truthは違う

GitHub Docsでは、organizationとenterpriseのCopilot課金について、Copilot Businessは月19ドルで1,900 AI credits、Copilot Enterpriseは月39ドルで3,900 AI creditsを含むと説明している。AI Creditsはusage-based billingの単位で、各licenseが共有enterprise poolへcreditsを持ち込み、pool超過分は1 AI creditあたり0.01ドルで課金される。

一方、Copilot usage metricsは別の目的のデータだ。Docsは、usage metricsをadoption、engagement、activity、code generation、pull request lifecycle trendsを見るための仕組みと説明している。API、dashboard、code generation dashboard、NDJSON exportがあり、enterprise、organization、user levelで利用傾向を分析できる。

重要なのは、Docsがusage metricsにlicense and seat management dataは含まれないと明記している点だ。licenseやseat assignmentを見るにはCopilot user management APIを使う必要がある。請求、seat、usage metrics、billing APIをひとつの数字として扱うと誤る。Billing Preview app廃止後は、このデータ境界を運用資料に明記すべきだ。

## 実装論点: Preview app利用者を権限単位で棚卸しする

最初にやるべきことは、GitHub Appのinstall有無を確認することではなく、誰がPreview appの出力を使っているかを確認することだ。企業では、appを見ている人と、その出力を受け取っている人が違う場合がある。たとえば、GitHub管理者がCSVを落とし、情シスが部門別に加工し、経理が月末に支払先別の説明へ使う、という流れだ。

この流れを分解すると、移行先が決まる。管理者が日次で異常値を見るだけならAI usage pageで足りる可能性がある。月次締めでエクスポートが必要なら、AI usage pageのexportとusage reportsを比較する。BIや原価管理へ連携しているなら、billing APIへ寄せるほうが再現性が高い。

権限設計も見直す。Preview app時代の閲覧権限がそのままbilling settingsに適用できるとは限らない。Billing manager、enterprise owner、organization owner、custom roleのどれに見せるのかを決める必要がある。特に日本企業では、請求情報が人件費や委託費の配賦に近い扱いを受けることがある。開発基盤担当者全員に詳細な支出を見せるのではなく、必要な人に必要な粒度を渡すほうがよい。

## 運用論点: cost centerとuser-level budgetを先に設計する

GitHubは、標準billing settingsがcost centersやusage pool allocationを扱えるようになったことを、Preview app廃止の理由として挙げている。これは単なる表示項目ではない。共有AI Credits poolの運用では、どのチームが何を消費したかを後から説明できなければ、全社展開が止まりやすい。

user-level budgetは個人単位の制御として有効だが、安易に全員同額へすると歪む。cloud agent、Copilot CLI、code review、third-party coding agentsを使う開発基盤チームは消費が大きくなりやすい。一方、補完中心のチームはAI Credits消費が小さい。重い利用を担当する人へ低い上限を置くと、業務上必要な検証が止まる。逆に上限なしにすると、共有poolを消費して部署間の説明が難しくなる。

cost centerは、部門別配賦の軸として使える。ただし、現実の組織は人事組織、GitHub organization、製品チーム、プロジェクト原価が一致しない。GitHub側のcost centerをどの管理単位へ合わせるかは、Copilot管理者だけで決めないほうがよい。経理、購買、開発責任者、情シスを入れ、請求月と社内締めのタイミングまで合わせる必要がある。

## レポート設計: usage metricsは導入効果、billing reportは費用説明に使う

Preview app廃止後の混乱でありがちなのは、usage metricsを費用説明に使おうとすることだ。Copilot usage metricsは、DAU、engagement、acceptance rate、lines of code、pull request lifecycleなどを見るための仕組みである。導入効果や教育施策の評価には向いている。

一方、月次請求や部門配賦では、billing settings、AI usage page、usage reports、billing APIが中心になる。どちらも「Copilotの利用データ」ではあるが、目的が違う。usage metricsは、ユーザーがCopilotをどれだけ使い、どの機能が価値を出しているかを見る。billing dataは、誰の利用がどの費用になったかを見る。

したがって、月次レポートは二段に分けるべきだ。第一段は請求統制で、AI Credits消費、budget超過、cost center、user-level budget、追加利用費を見る。第二段は導入効果で、DAU、feature adoption、PR throughput、review adoption、acceptance rateを見る。この二つを同じ表に混ぜると、費用が増えた理由と価値が増えた理由を切り分けにくい。

## 8月3日までの推奨手順

第一に、Preview appのinstall先と利用者を棚卸しする。enterprise、organization、管理者、閲覧者、CSV利用者、API連携の有無を記録する。GitHub Appの削除だけを先にやると、誰が何を見ていたか分からなくなる。

第二に、AI usage pageで同等以上の確認ができるか検証する。group、filter、exportの粒度を確認し、既存の月次レポートと突き合わせる。差分が出る場合は、preview appの数字を正とするのではなく、標準billing settingsで見える項目が増えた結果なのかを確認する。

第三に、usage reportsとbilling APIの取得経路を作る。手作業CSVで足りる組織でも、少なくとも1回はraw usage dataを取得し、社内の費用配賦表へ入るか検証したほうがよい。API連携では、tokenの保管、権限、実行主体、ログ、失敗時の再実行を決める。個人PATを長期運用の中心に置くのは避けたい。

第四に、budget controlsを本番ルールとして定義する。user、cost center、enterprise levelのどこで上限を持つかを決め、上限到達時に止めるのか、承認後に増枠するのかを文書化する。AI Creditsは便利な予算単位だが、運用ルールがなければ単なる請求後確認になる。

第五に、8月請求でリハーサルを行う。廃止日は8月3日なので、日本企業の月次締めでは8月分の途中から新導線だけになる。7月中に一度、標準billing settingsとreportsを使って月次説明資料を作っておくと、廃止後の初回締めで詰まりにくい。

## 日本企業での判断軸

今回の変更は、Copilotを大規模に使っていない企業には小さく見える。しかし、Copilot BusinessやEnterpriseを複数部門へ展開している企業では、管理の前提が変わる。Preview appのような移行期ツールではなく、GitHub標準のbilling governanceに乗せる必要がある。

判断軸は三つある。まず、費用の見える化を誰が担うか。次に、予算上限をどの単位で置くか。最後に、導入効果のKPIと請求KPIをどう分けるか。この三つが決まれば、Preview app廃止は大きな障害にならない。逆にここが曖昧なまま8月3日を迎えると、数字は見えるのに説明できない状態になりやすい。

結論として、Copilot Billing Preview app廃止は、Copilot費用管理の正式化である。日本企業は、AI usage page、budget controls、usage reports、billing APIを使い分け、cost centerとuser-level budgetを社内の予算責任へ結びつけるべきだ。Copilotを開発者向けSaaSとしてではなく、AI実行基盤として管理するなら、この移行は避けて通れない。

## 出典

- [Copilot Billing Preview app will be retired on August 3](https://github.blog/changelog/2026-07-07-copilot-billing-preview-app-will-be-retired-on-august-3/) - GitHub Changelog
- [About billing for GitHub Copilot in organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) - GitHub Docs
