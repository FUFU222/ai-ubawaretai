---
title: 'Copilot使用量レポート、6月のAI Credits予算確認'
description: 'GitHub Copilot使用量レポートが公開。6月1日のAI Credits移行前に、日本企業が5月中に予算、モデル利用、管理者設定、追加利用ポリシーをどう確認すべきか整理する。'
pubDate: '2026-05-13'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', '開発者ツール', '日本企業', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHubが**2026年5月12日**、Copilotのusage-based billing移行に備えるための**April usage report**を公開した。これは、2026年6月1日に始まるGitHub AI Credits課金を前に、4月のCopilot利用が新しい課金単位ではどの程度の金額感になるかを見積もるためのレポートだ。

この更新は、単なる管理画面の追加ではない。日本企業にとっては、Copilotを「開発者向けの席課金ツール」から「モデル、利用面、部署、予算を見て運用する従量制のAI基盤」へ移す準備作業になる。以前扱った[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)はレビュー実行コストの話だったが、今回はCopilot全体のAI Credits見積もりをどう読むかが中心だ。

特に、[Copilot CLIの企業管理プラグイン](/blog/github-copilot-cli-enterprise-plugins-2026/)や[GPT-5.5の一般提供](/blog/github-copilot-gpt-55-general-availability-2026/)のように、Copilotの利用面がIDE補完を超えて広がっている組織ほど影響は大きい。使える機能が増えるほど、どの面で、どのモデルを、誰が、どれだけ使っているかを先に見ないと、6月の請求を読みにくくなる。

## 事実: April usage reportでAI Credits移行を事前確認できる

GitHub Changelogによると、2026年5月12日から、4月分のGitHub Copilot利用レポートをダウンロードできるようになった。対象はCopilot Business / Enterpriseの管理者と、Copilot Pro / Pro+の個人利用者だ。目的は、6月1日に始まるAI Creditsベースの課金に備え、4月の利用実績を新しい単位へ置き換えて見ることにある。

GitHubはこのレポートを、請求書ではなく**方向感をつかむためのシグナル**として説明している。つまり、4月の利用から「どのユーザー、どのモデル、どのsurfaceが消費を押し上げそうか」を見るための材料であり、最終請求額をそのまま確定するものではない。

この位置づけは重要だ。日本企業では、SaaSの費用予測が年度予算や部門配賦と結びつきやすい。レポートを「正確な請求予定額」として扱うと、後で差異が出たときに説明が難しくなる。逆に、早い段階で上位利用者、重いモデル、agentic workflowの比率を見る用途に絞れば、6月の移行前にかなり実務的な準備ができる。

## 事実: AI Creditsはモデルとトークン量で決まる

GitHub Docsでは、Copilotのusage-based billingについて、GitHub AI Creditsを課金単位として説明している。Copilot BusinessとCopilot Enterpriseでは、ユーザーごとに含まれるAI Creditsがあり、それが請求主体の単位でプールされる。Copilot Businessは通常1ユーザーあたり月1,900 credits、Copilot Enterpriseは月3,900 creditsだ。

さらに既存顧客向けには、2026年6月1日から9月1日までの移行期間に、より大きなプロモーション枠が用意される。Businessは月3,000 credits、Enterpriseは月7,000 creditsという扱いだ。これは移行直後のショックを和らげる設計と読めるが、恒久的な上限ではない。

消費の考え方も、これまでのpremium requestより細かくなる。入力トークン、出力トークン、キャッシュされたトークンがモデルごとの価格で計算され、1 AI Credit = 0.01米ドルとして扱われる。軽いチャットなら小さく済む一方、長いcoding agent sessionや高性能モデルを使った複数ファイル作業は大きくなりやすい。

ここで見落としやすいのは、**コード補完とnext edit suggestionsはAI Credits課金対象外として残る**点だ。つまり、全てのCopilot利用が同じ重みで課金されるわけではない。Chat、Copilot CLI、cloud agent、Spaces、Spark、third-party coding agentsのようなAIモデル利用面が主な確認対象になる。

## 事実: レポートには注意点がある

GitHub Changelogは、今回のApril reportについていくつかの注意点も示している。4月1日から24日までの0x model利用はレポートに含まれず、有料プラン全体では大きな比率ではないと説明されている。また、4月24日から30日のデータにはbackfill gapにより重複行が出る可能性がある。

さらに、Copilot code reviewの一部エントリではAI Credit見積もりが欠ける場合がある。具体的には、organizationへ直接課金される自動レビューや、Copilot licenseを持たないユーザー起点のレビューが、データ問題により0 AI Creditsとして見えることがある。

このため、レポートを読むときは、合計値だけを見るのは危ない。特に日本企業でprivate repositoryの自動レビューを広く有効化している場合は、[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)と合わせて、AI Credits側の見積もり欠損がないかを別途確認したほうがよい。

## 分析: 日本企業では予算責任の分断が先に問題になる

ここからは分析だ。

今回のusage report公開で、日本企業が最初に見るべきなのは「Copilotが高くなるか安くなるか」だけではない。より大きいのは、**誰が利用を増やし、誰が予算を持ち、誰が超過を止めるのか**という責任分界だ。

従来の席課金では、Copilotの費用は比較的説明しやすかった。何人にライセンスを配るか、BusinessかEnterpriseか、年間契約か月額かを決めれば、予算は読みやすい。一方、AI Credits移行後は、同じ人数でも使い方によって消費が変わる。軽い補完中心のチームと、Copilot CLIやcloud agentで大きなタスクを回すチームでは、同じseat数でも費用の形が違う。

ここで、開発部門、プラットフォームチーム、情シス、購買の間に認識差が出やすい。開発部門は生産性を見て利用を広げたい。情シスや購買は予算超過と統制を気にする。プラットフォームチームは、実行環境やポリシー、GitHub Actions側の消費も見なければならない。この分断を放置すると、6月以降に「便利だから広げたが、誰も予算を見ていなかった」という状態になりやすい。

## 分析: 高コスト化しやすい面を分けて見るべき

usage reportで見るべき軸は、単なるユーザー別ランキングだけでは足りない。日本企業の管理者は、少なくとも次の4つを分けて見るべきだ。

1つ目は、モデル別の消費だ。高性能モデルは難しいタスクに効くが、すべての相談を高価なモデルに寄せる必要はない。[GPT-5.2とGPT-5.2-Codexの廃止](/blog/github-copilot-gpt-52-codex-retirement-2026/)のようにモデル移行が続く局面では、代替モデルの品質だけでなくcredits消費も見たい。

2つ目は、surface別の消費だ。IDE内のChat、Copilot CLI、cloud agent、code review、Spacesのどれが伸びているかで、打ち手は変わる。CLIが伸びているなら社内標準プラグインやhooksの管理、code reviewが伸びているなら自動レビュー対象、cloud agentが伸びているならリポジトリ権限とrunner設計が論点になる。

3つ目は、ユーザー別の偏りだ。AI Creditsは組織単位でプールされるため、少数のheavy userが全体を押し上げることがある。それ自体は悪いことではない。重要なのは、その利用が業務成果に結びついているか、意図しない試行錯誤で消費しているかを分けることだ。

4つ目は、部門別・cost center別の見方だ。GitHub Docsでは予算をenterprise、organization、cost center、userの各レベルで設定できると説明している。日本企業で部門配賦が必要なら、最初からcost centerの設計とGitHub上の組織構造を合わせておかないと、後で按分が難しくなる。

## 実務: 5月中にやるべき確認

今回の更新を受けて、5月中にやるべきことは明確だ。

まず、April usage reportをダウンロードし、上位ユーザー、上位モデル、上位surfaceを確認する。合計額だけではなく、重い利用がどこで起きているかを見る。次に、6月1日以降の標準credits枠と、9月1日までのプロモーション枠の両方で見積もる。移行期間だけ収まるのか、通常枠に戻っても収まるのかは分けて判断する必要がある。

そのうえで、追加利用を許可するかどうかを決める。GitHub Docsでは、組織のプールを超えた場合、追加利用を許可していれば課金が継続し、許可していなければ次の請求サイクルまで利用が止まると説明している。どちらが正しいかは会社による。重要なのは、止めるか払うかを6月の請求後に決めるのではなく、移行前に決めることだ。

最後に、モデル運用方針を決める。高性能モデルは重要な設計レビューや大きな実装には使う価値がある。一方で、日常的な質問や軽い修正まで常に高価なモデルへ寄せると、AI Creditsは読みづらくなる。使い分けのルールを作るだけでも、6月以降の運用はかなり安定する。

## まとめ

GitHub CopilotのApril usage report公開は、6月1日のAI Credits移行に向けた実務上の節目だ。これは単なる請求プレビューではなく、Copilotをどの開発面で、どのモデルで、どの予算責任のもとに広げるかを決めるための材料になる。

日本企業にとって重要なのは、レポートの合計値に一喜一憂することではない。上位消費の理由、モデル選択、agentic workflowの広がり、code reviewやCLIの運用方針を分けて確認し、6月1日前に予算と停止条件を決めることだ。Copilotは便利な補助ツールから、明確にコスト管理が必要な開発基盤へ移っている。

## 出典

- [April reports are now available to prepare for usage-based billing](https://github.blog/changelog/2026-05-12-april-reports-are-now-available-to-prepare-for-usage-based-billing/) — GitHub Changelog, 2026-05-12
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) — GitHub Docs
- [Preparing your organization for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/manage-and-track-spending/prepare-for-usage-based-billing) — GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/copilot/reference/copilot-billing/models-and-pricing) — GitHub Docs
