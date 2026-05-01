---
article: 'salesforce-slack-ai-work-platform-2026'
level: 'child'
---

Salesforce が 2026年4月29日に出した今回の発表は、Slack を「ただのチャット」から **営業や CS の仕事を動かす AI の実行面** に近づけた、というのが一番大きいポイントです。

## 何が変わったの？

Salesforce の公式ブログでは、**新しい Salesforce 環境を作ると free-tier の Slack workspace も自動で作られ、CRM データに接続された状態で始まる** と説明されています。しかも、追加費用なし、セットアップ不要という打ち出しです。

さらに Slack 側では、**Slackbot Skills** が入りました。これは、会議準備、案件レビュー、週報、インシデント整理のような繰り返し作業を、再利用できる AI ワークフローとして保存してチーム共有できる仕組みです。

## 便利機能の追加だけではない

Slack blog を見ると、Slackbot はもう要約だけを返す存在ではありません。

- 定期タスクを回す `Scheduled Automations`
- DM 送信や channel 作成を行う `Slack Actions`
- Google Workspace や Microsoft 365 に対する `Email / Calendar actions`
- Workflow Builder に AI 応答を入れる `Generate AI Response step`

まで整理されています。

つまり、**顧客情報を見る場所と、その場で次の仕事を回す場所を近づけた** ということです。

この流れは、以前書いた[AWSがAmazon Quickをデスクトップ化。日本企業は「常駐AIアシスタント」をどう試すべきか](/blog/amazon-quick-desktop-free-plus-2026/)とも似ています。あちらはデスクトップ常駐型でしたが、今回は Slack というチームの会話面に寄せてきた違いがあります。

## 日本企業は何を先に見るべき？

ここからは考え方です。

大事なのは、「Slackbot が賢いか」だけで判断しないことです。Slack Help を見ると、AI 機能は **プランごとにかなり差** があります。要約系は有料プラン全体で使えても、workflow automation や高度な Salesforce 機能は Business+ や Enterprise+ 側に寄っています。

しかも管理者は、AI 機能ごとに使える人を制御できます。なので日本企業なら、いきなり全社導入ではなく、

1. 営業か CS の 1 チームで試す  
2. 会議準備、案件要約、週報作成のような反復作業を選ぶ  
3. Salesforce と Slack をどこまでつなぐか決める

の順で進める方が現実的です。

## まとめ

今回の発表は、「Slack で Salesforce を見やすくした」だけではありません。**Slack を、顧客データと AI が同時に動く仕事の面へ変え始めた** のが本質です。

以前取り上げた[Microsoft「Agent 365」とは？ 5月1日GA前に日本企業が確認すべき統制ポイント](/blog/microsoft-agent-365-enterprise-governance-2026-04-28/)のように、これからの競争は AI の性能だけでなく、**企業の実務をどこで回すか** になっていきそうです。

## 出典

- [Slack is the AI Work Platform for Every Salesforce Customer, Ready on Day One](https://www.salesforce.com/blog/connect-slack-to-salesforce/)
- [Slack Feature Drop: A Downpour of “Done”](https://slack.com/blog/news/slack-feature-drop-april2026)
- [Updates to feature availability and pricing for Slack subscriptions](https://slack.com/help/articles/39264531104275-Updates-to-feature-availability-and-pricing-for-Slack-plans)
