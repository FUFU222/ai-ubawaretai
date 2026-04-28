---
article: 'github-copilot-code-review-actions-minutes-2026'
level: 'child'
---

GitHubが**2026年4月27日**に、GitHub Copilot code reviewの課金変更を発表しました。**2026年6月1日**から、private repositoryで動くCopilot code reviewは、Copilot側のAI利用だけでなく**GitHub Actions minutesも消費**するようになります。

## まず何が変わるの？

GitHub Changelogによると、6月1日以降のCopilot code reviewは次の2本立てです。

- Copilot利用はAI Creditsベースのusage-based billingへ移行
- private repositoryでGitHub-hosted runner上のreviewがActions minutesを消費

一方で、**public repositoryは変更なし**です。影響が大きいのは、社内開発や顧客向け開発をprivate repositoryで回しているチームです。

## どのチームが特に影響を受ける？

影響が大きいのは、次のような運用をしている組織です。

- 全PRでCopilot code reviewを自動実行している
- pushごとに再レビューしている
- draft PRにもレビューを走らせている
- Copilotライセンスがない人のPRにもレビューを広げている

GitHub Docsでは、非ライセンス利用者のPRにもCopilot code reviewを広げられると案内されています。便利ですが、6月以降はその分だけ利用量とminutesも増えます。

## self-hosted runnerなら解決する？

料金Docsでは、**self-hosted runnerはActions minutesを消費しない**と説明されています。なので、minutesだけ見れば節約余地はあります。

ただし、それで無料になるわけではありません。self-hosted runnerへ寄せるなら、実行基盤の保守、権限管理、監査対応、障害復旧を自前で持つ必要があります。日本企業では、コストだけでなく社内規程との整合も見なければいけません。

## 日本のチームは何を見直すべき？

まずは4点だけで十分です。

- private repositoryでCopilot code reviewをどこまで自動化しているか棚卸しする
- GitHub Actions usageをcode review起点で見える化する
- GitHub-hosted / self-hosted / larger runnerの方針を決める
- AI CreditsとActions超過分を誰が予算管理するか決める

今回の変更は、Copilot code reviewが使えなくなる話ではありません。**AIレビューを広げるほど、予算とrunner設計まで含めて運用しなければならなくなる**という話です。

## 出典

- [GitHub Copilot code review will start consuming GitHub Actions minutes on June 1, 2026](https://github.blog/changelog/2026-04-27-github-copilot-code-review-will-start-consuming-github-actions-minutes-on-june-1-2026/)
- [About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [GitHub Copilot plans](https://github.com/features/copilot/plans)
