---
title: 'GitHub Copilot AI Credits課金開始、予算管理の実務'
description: 'GitHub Copilot AI Credits課金が2026年6月1日に全プランで開始。日本企業が共有プール、user-level budgets、Actions minutesをどう見直すべきか整理する。'
pubDate: '2026-06-02'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'GitHub Actions', 'AIエージェント', '日本企業']
draft: false
series: 'github-copilot-2026'
---

GitHubが**2026年6月1日**、GitHub Copilotのusage-based billingを全プランで有効化した。これにより、Copilot Chat、Copilot CLI、cloud agent、Spaces、Spark、third-party coding agentsなど、AIモデルを使うCopilot機能は**GitHub AI Credits**を基準に管理される。あわせて、Copilot code reviewはAI Creditsだけでなく、private repositoryではGitHub Actions minutesも見る必要がある。

この更新は、単なる料金体系の細部変更ではない。日本企業にとっては、Copilotを「ライセンスを配る開発者ツール」から「ユーザー別・部門別・モデル別に予算を管理するAI実行基盤」へ移す節目になる。5月時点では[Copilot使用量レポートで6月のAI Credits予算を確認する方法](/blog/github-copilot-ai-credits-usage-report-2026/)を扱ったが、今回は移行が実際に始まった後の管理論点が中心だ。

特に、[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)や[Copilot usage metrics APIのAI adoption cohorts](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)を使っている組織では、6月以降の運用は「便利だから広げる」だけでは足りない。誰が多く使うのか、どの機能が高くなりやすいのか、予算を超えたとき止めるのか払い続けるのかを、管理者が先に決める必要がある。

## 事実: 6月1日からAI Credits課金が全プランで有効化

GitHub Changelogによると、2026年6月1日から、全Copilotプランでusage-based billingが有効化された。GitHubは、各プランに月次の含有AI Creditsを設定し、含有量を超えた場合は追加利用予算を設定することで継続利用できると説明している。

GitHub Docsでは、AI CreditsをCopilot利用の課金単位として説明している。Copilotのやり取りでは、入力トークン、出力トークン、キャッシュされたトークンが発生し、モデルごとの価格に基づいてAI Creditsへ換算される。1 AI Creditは0.01米ドルとして扱われる。

ここで重要なのは、すべてのCopilot利用が同じように課金されるわけではないことだ。Docsでは、Copilot Chat、Copilot CLI、Copilot cloud agent、Copilot Spaces、Spark、third-party coding agentsなど、AIモデルを呼び出す機能がAI Creditsを消費すると説明されている。一方で、code completionsとnext edit suggestionsは、paid planではAI Creditsの対象外として残る。

この区別は実務的に大きい。IDE補完中心のチームと、CLIやcloud agentで大きな作業を回すチームでは、同じ人数でも消費の形が違う。GitHub Copilotを「1席あたりいくら」とだけ見ていた管理者は、6月以降、利用面ごとの消費を分けて見る必要がある。

## 事実: 組織向けは共有プールとuser-level budgetsが鍵になる

Copilot BusinessとCopilot Enterpriseでは、ユーザーごとの含有AI Creditsが請求主体の単位で共有プールになる。Docsでは、標準枠としてBusinessは1ユーザーあたり月1,900 credits、Enterpriseは月3,900 creditsと説明している。既存顧客には、2026年6月1日から9月1日まで、Business月3,000 credits、Enterprise月7,000 creditsの移行期間向けプロモーション枠も示されている。

共有プールは、実務上は便利でもあり、危険でもある。たとえば、少数のプラットフォームエンジニアが長いagent sessionを回しても、組織全体のプールが残っていれば作業は続く。これは重要な開発を止めにくいという意味では合理的だ。一方で、部門別予算を持つ会社では「誰の利用がどの部門に配賦されるのか」が曖昧になりやすい。

このため、GitHubが同時に強調しているuser-level budgetsの一般提供は重要だ。user-level budgetは、個々のユーザーが1請求サイクルで消費できるAI Creditsを制限する。共有プールが残っていても、ユーザー自身のbudgetを使い切ると、そのユーザーのAI Credits消費機能は止まる。Docsでは、user-level budgetは常にhard stopとして働くと説明されている。

日本企業では、この制御を「節約機能」とだけ見ると失敗しやすい。むしろ、共通プールを守りながら、重い利用が必要な人には明示的に高い上限を与え、軽い利用者には標準上限を置くための運用設計と見るべきだ。特定のリードエンジニアやSRE、AI推進チームだけ上限を高くし、全社員には小さめの標準値を置く、といった分け方が現実的になる。

## 事実: code reviewはAI CreditsとActions minutesの二重確認になる

今回の6月1日更新では、Copilot code reviewも重要な論点になっている。GitHub Changelogは、Copilot code reviewがAI Creditsに加えてGitHub Actions minutesも消費すると説明している。これは以前から予告されていた変更で、private repositoryでGitHub-hosted runnerを使う組織に影響が大きい。

つまり、6月以降のCopilot code reviewは、AIモデル利用コストだけでなく、実行基盤側のコストも確認する必要がある。標準のGitHub-hosted runnerを使うなら運用は軽いが、review回数が増えるほどActions minutesが増える。self-hosted runnerならActions minutesは抑えやすいが、runnerの保守、セキュリティ、スケール設計は自社側の責任になる。

GitHubは、組織管理者がCopilot code review用のdefault Actions runnerを設定できるようになったとも説明している。これは、各repositoryで個別設定するのではなく、組織単位でレビュー実行環境をそろえるための機能だ。日本企業で全社的にCopilot code reviewを展開するなら、AI Creditsのbudgetだけでなく、runner方針も同じ運用会議で決める必要がある。

ここは、[Copilot Maxと個人AI Creditsの予算設計](/blog/github-copilot-max-flex-individual-plans-2026/)とは異なる企業向けの論点だ。個人利用では自分の月額と追加予算が中心になるが、Business / Enterpriseでは、共有プール、user-level budget、cost center、enterprise spending limit、Actions minutesが重なってくる。

## 分析: 日本企業では「席課金SaaS」から「AI実行予算」へ責任が移る

ここからは分析だ。

GitHub CopilotのAI Credits課金開始で、日本企業が最初に直面するのは、単純な値上げ・値下げではない。より大きいのは、Copilotの費用責任が「ライセンス管理」から「利用予算管理」へ移ることだ。

席課金中心のSaaSでは、費用管理は比較的単純だった。何人にライセンスを配るか、どのプランを契約するか、年契約か月契約かを決めれば、月次費用は読みやすい。AI Creditsでは、同じseat数でも使い方で消費が変わる。長いChat、複数ファイルを対象にしたCLI作業、cloud agentの再試行、code reviewの自動実行は、軽い補完とは別の費用構造になる。

この変化は、日本の組織構造と相性が難しい。開発部門は生産性向上を重視し、情シスは統制とセキュリティを見て、購買や経理は予算上限と配賦を見ている。AI Creditsはこの3者の境界をまたぐ。開発部門だけで上限を緩めると予算が読みにくい。情シスだけで止めると、重要な開発が止まりかねない。購買だけで月額を見ると、agentic workflowの価値を評価できない。

したがって、6月以降の運用では、CopilotをSaaS契約としてではなく、社内のAI実行予算として扱うほうが現実的だ。誰がどの目的で高コストなモデルやagentic機能を使うのか、どの部署がその効果を受け取るのか、予算超過時に止めるのか承認制で継続するのかを、先に合意しておく必要がある。

## 実務: 管理者が今週確認すべき5項目

最初に確認すべきは、共有プールの前提だ。Business / Enterpriseの標準枠と移行期間のプロモーション枠を分けて、9月1日以降にも運用が成り立つかを見る。移行期間の大きな枠に収まっているだけなら、秋以降に同じ使い方を続けられない可能性がある。

2つ目は、user-level budgetの初期値だ。全員に高い上限を置くと、共有プールの意味が薄れる。逆に全員に低い上限を置くと、Copilot導入の効果が出にくい。標準利用者、重いagentic workflowを担う利用者、検証中の利用者を分け、少なくとも3段階の上限を考えると運用しやすい。

3つ目は、追加利用ポリシーだ。含有AI Creditsを使い切った後に追加利用を許可するのか、止めるのかを決める。Docsでは、追加利用が許可されていなければ、次の請求サイクルまで利用がブロックされると説明されている。現場が月末に突然止まると困るなら、承認付きの追加利用枠を設けるほうがよい。

4つ目は、Copilot code reviewのrunner方針だ。private repositoryで自動レビューを広げるなら、GitHub-hosted runner、larger runner、self-hosted runnerのどれを使うかを決める。AI Creditsのbudgetだけを設定しても、Actions minutes側の増加を見落とすと、別の請求で驚くことになる。

5つ目は、利用メトリクスの読み方だ。5月のusage reportは準備用だったが、6月以降は実績として、どのユーザー、どのsurface、どのモデル、どのrepositoryで消費が増えているかを見る必要がある。単純な利用抑制ではなく、生産性の高い使い方へ予算を寄せるための観測にするべきだ。

## まとめ

GitHub CopilotのAI Credits課金開始は、2026年6月1日を境に、Copilotを明確に従量制のAI開発基盤として扱う変更だ。Chat、CLI、cloud agent、Spaces、Spark、third-party coding agentsはAI Creditsの対象になり、code reviewではActions minutesも見る必要がある。

日本企業にとって重要なのは、月額料金の比較だけではない。共有プール、user-level budgets、追加利用ポリシー、runner方針、部門別配賦を合わせて設計しなければ、便利な機能ほど予算上の説明が難しくなる。6月以降のCopilot運用は、導入可否よりも、どの利用に予算を割くかを決める段階に入った。

## 出典

- [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) - GitHub Changelog, 2026-06-01
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
- [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals) - GitHub Docs
