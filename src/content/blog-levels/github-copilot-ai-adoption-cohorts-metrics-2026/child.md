---
article: 'github-copilot-ai-adoption-cohorts-metrics-2026'
level: 'child'
---

## 何が変わったのか

GitHubは2026年5月29日、GitHub Copilotのusage metrics APIに、AI adoption phaseという新しい見方を追加しました。これは、Copilotを使っている人を「どんな使い方をしているか」で分けるための指標です。

たとえば、コード補完やIDEのagent modeを中心に使っている人はCode firstに近い扱いになります。Copilot CLI、Copilot cloud agent、Copilot code reviewのようなagent機能を1種類使っている人はAgent firstです。複数のagent機能を使っていたり、GitHub Copilot appを使っていたりする人はMulti-agentに分類されます。

ポイントは、ただ1回試しただけではなく、過去28日間のうち少なくとも2日使ったかを見ることです。つまり、偶然触った人ではなく、少しでも習慣として使い始めた人を見ようとしているわけです。

## なぜ重要なのか

今までのAI導入では、「何人がCopilotを有効にしたか」「何人が使ったか」が見られがちでした。しかし、それだけでは十分ではありません。

同じCopilotユーザーでも、軽いコード補完だけ使う人と、issue対応をagentに任せたり、レビュー修正をCopilot code reviewから進めたりする人では、仕事の変わり方が違います。前者は入力補助に近く、後者は開発プロセスそのものにAIを入れている状態です。

[Copilot使用量レポートでAI Creditsを確認する話](/blog/github-copilot-ai-credits-usage-report-2026/)では、6月以降の費用管理が重要になると整理しました。今回のAI adoption phaseは、その費用がどんな使い方から出ているのかを理解する助けになります。

また、[チーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)と合わせると、どのチームがCode firstにとどまっているのか、どのチームがAgent firstやMulti-agentへ進んでいるのかを見られます。

## 日本企業での使い道

日本企業では、部門ごとの予算や教育計画と結びつけて見るのが現実的です。

たとえば、ある部署ではCopilotのactive userが多いのに、ほとんどがCode firstだとします。この場合、利用率は高いものの、agent活用はまだ進んでいません。Copilot CLIやcode reviewの研修を入れる価値があるかもしれません。

一方で、別の部署ではMulti-agentが増えているとします。その部署では、[Copilot cloud agentをAPIから起動する運用](/blog/github-copilot-cloud-agent-rest-api-2026/)や、[GitHub Copilot app](/blog/github-copilot-app-technical-preview-2026/)のような新しい作業面が広がっている可能性があります。この場合は、権限、リポジトリアクセス、承認フローを確認する必要があります。

つまり、AI adoption phaseは「誰が使っているか」ではなく、「どの段階の使い方に進んでいるか」を見るためのものです。

## 注意すること

この指標だけで、開発生産性が上がったとは言えません。Multi-agentの人数が増えても、レビュー品質やリードタイムが改善していなければ、運用がうまくいっているとは限らないからです。

また、phaseはGitHubが定義した分類です。会社ごとの開発文化や業務内容にそのまま合うとは限りません。まずは月次の変化を見て、社内の成果指標と照らし合わせるのがよいでしょう。

結論として、今回の更新は、Copilotの導入状況を一段深く見るためのものです。日本企業は、active user数だけでなく、Code first、Agent first、Multi-agentの比率を見ながら、教育、予算、agent権限の設計を進めるべきです。

## 出典

- [Copilot usage metrics API adds cohorts for AI adoption](https://github.blog/changelog/2026-05-29-copilot-usage-metrics-api-adds-cohorts-for-ai-adoption/) - GitHub Changelog, 2026-05-29
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics) - GitHub Docs
