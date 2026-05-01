---
title: 'SalesforceのSlack標準化で営業AI運用はどう変わるか'
description: 'Salesforceが2026年4月29日、Slackを新規顧客へ初日から無償接続する方針を発表。Slackbot自動化、AI機能のプラン差分、日本企業の営業・CS運用への影響を整理する。'
pubDate: '2026-05-01'
category: 'news'
tags: ['Salesforce', 'Slack', '業務AI', 'エンタープライズAI', 'AIワークフロー']
draft: false
---

Salesforce が **2026年4月29日** に出した「Slack is the AI Work Platform for Every Salesforce Customer, Ready on Day One」は、単なるバンドル販売の話ではない。重要なのは、**Salesforce の顧客データ、AI 機能、日々の会話の場を Slack 側へ最初からまとめる設計** を明確にしたことだ。

一次ソースによれば、今後は **新しい Salesforce 環境を作ると free-tier の Slack workspace も自動で作られ、CRM データに接続された状態で始まる**。さらに Slack 側では、Slackbot Skills、Scheduled Automations、Slack Actions、Calendar / Email actions、Workflow Builder の AI 応答など、単なる要約を超えた業務実行機能が 4 月末時点で一気に整理された。

日本企業にとって大きいのは、これが「AI チャットを入れるか」ではなく、**営業・CS・マーケ・社内連携の仕事をどの画面で動かすか** の話になっている点だ。以下では、まず一次ソースで確認できる事実を整理し、その後で日本の営業組織、RevOps、情シスがどう読むべきかを分けて考える。

## 事実: Salesforce は Slack を「新規顧客の初期状態」に近づけた

Salesforce の公式ブログでは、**新しい Salesforce instance が作られると free-tier の Slack workspace も作られ、CRM データと自動接続される** と説明している。しかも「追加費用なし」「セットアップや IT プロジェクト不要」という表現まで付いている。Pricing and availability の箇所では、**2026年5月15日から新規 Salesforce 顧客向けに free Slack workspace を自動作成する** と、より具体的なスケジュールも示されている。

ここで大事なのは、Slack が単なる通知先ではなく、**Salesforce の導入直後から業務の実行面に入る前提** へ変わったことだ。従来の多くの企業導入では、CRM は Salesforce、会話は Slack、AI は別サービス、承認フローはまた別ツール、というように作業導線が分かれやすかった。今回の発表は、その分断を最初から減らしにきている。

この流れは、以前取り上げた[Microsoft「Agent 365」とは？ 5月1日GA前に日本企業が確認すべき統制ポイント](/blog/microsoft-agent-365-enterprise-governance-2026-04-28/)とも通じる。各社が競っているのはモデル精度だけではなく、**企業の仕事が実際に流れる面をどこが押さえるか** になっている。

## 事実: 4月29日の Slack 側更新で Slackbot は「答える AI」から「動く AI」へ寄った

同日の Slack Feature Drop は、Slackbot をかなり別物にした。Slack は **Slackbot Skills** を導入し、繰り返し使う業務を再利用可能なワークフローとして保存・共有できるようにしたと説明している。例として挙げられているのは、**meeting prep、pipeline reviews、goal setting、incident management、weekly update、project kickoff** などで、単なるプロンプト保存ではなく、業務単位のテンプレート化に近い。

さらに Slack blog では、Slackbot が **Slack、Salesforce、接続済みアプリ、calendar の文脈** をまとめて使えることを強調している。Daily Priorities では Slack 活動、calendar、Salesforce data を見て優先順位を出し、Meeting Prep ではカレンダーと Slack 上の関連会話やファイルを拾い、Incident Management では incident channel の履歴から after-action review を作る。これは「質問に答える AI」ではなく、**作業の前準備や後処理まで肩代わりする AI** へ寄せているということだ。

加えて、Slackbot は **scheduled automations** と **Slack actions** も扱う。前者は recurring task を定期実行でき、後者は DM 送信、channel 作成、招待、workflow 起動などを Slack 内で実行する。メールやカレンダーの操作も広がり、Slack blog では **Google Workspace と Microsoft 365 向けに、Slackbot がメール下書きや予定作成を直接処理する** と案内している。

以前取り上げた[AWSがAmazon Quickをデスクトップ化。日本企業は「常駐AIアシスタント」をどう試すべきか](/blog/amazon-quick-desktop-free-plus-2026/)は、ローカルファイルや通知を軸に仕事面へ AI を入れる話だった。今回の Slack / Salesforce は、その企業向けコラボレーション版と見ると分かりやすい。

## 事実: Workflow Builder とプラン設計で、AI の提供範囲はかなり細かく分かれる

Slack の 4 月更新で見落としにくいのが、**Workflow Builder の Generate AI Response step** だ。Slack blog では、workflow の中に AI 応答をネイティブに組み込み、channels、canvases、lists を知識ソースにして、thread 要約、翻訳、返信下書きなどを行えると説明している。提供時期は **2026年4月21日から30日にかけて** で、対象は **Business+ v2 と Enterprise+** だ。

一方で、すべての AI 機能が全プランで同じように使えるわけではない。Slack Help の pricing 更新では、**conversation and thread summaries と huddle notes は有料プラン全体**、より高度な機能である **search、recaps、translations、file summaries、workflow automation** は **Business+ と Enterprise+**、**enterprise search** は **Enterprise+** と整理されている。

さらに同じ Help 記事では、**owners と admins が AI 機能ごとに利用可否を制御できる** と明記されている。Enterprise では「特定の人やグループだけ」「特定の人やグループを除く全員」まで指定できる。Slack は同ページで、**顧客データを generative AI の学習に使わない** とも説明している。つまり今回の話は、便利機能の追加だけではなく、**どこまで広げるかを管理者が選びながら展開する前提** が最初から入っている。

## 事実: Salesforce 連携の価値は閲覧だけではなく、Slack 側からの実行へ広がっている

Pricing and availability の箇所では、**Slackbot Salesforce actions は 5 月中旬から順次提供** とされ、Slackbot access と connected Salesforce org があれば、対象プラン上で使えるとしている。さらに Slack Help の pricing 更新では、Free / Pro を含むすべてのプランで **Salesforce record の検索・閲覧・編集や record previews** を使え、追加の **workflow automations、Salesforce list views、Sales Home** には Business+ / Enterprise+ が必要だと整理されている。

この差は実務上かなり大きい。単に Slack からレコードを見られるだけなら、チャットの補助としては便利でも、仕事の主導面までは変わらない。ところが今回の流れでは、**Slackbot が Salesforce 文脈を前提に daily priorities や account research を出し、将来的には record の作成・更新まで Slack 側で進める** 方向が明示されている。

## 考察: 日本企業にとっての本質は「CRM を開く回数を減らす」ことではない

ここからは考察だ。

今回の発表を「Slack から Salesforce が便利に見られる」とだけ捉えると浅い。本質は、**営業・CS・マネージャー・RevOps が日中もっとも長くいる画面で、顧客文脈と AI 実行をまとめる** ことにある。

日本企業では、顧客データは CRM にあるが、実際の仕事は会議、社内相談、承認、次アクションの整理、引き継ぎ、週報、案件レビューの連続だ。そのため、CRM 自体の入力項目を増やすより、**案件の状況を関係者が同じ場で見て、次にやることを AI が整える** ほうが現場の体感価値は大きいことが多い。

Slackbot Skills の例を見ると、その狙いはかなり明確だ。account research、deal summaries、case escalation snapshots、campaign briefs など、**営業・サービス・マーケ・法務の定番作業** が最初から想定されている。しかもこれらは再利用可能な skill として共有される。日本企業で言えば、支店や部門ごとの属人的な運用を減らし、**優秀な担当者のやり方を AI ワークフローとして横展開する** 方向に使いやすい。

以前取り上げた[NECとAnthropicの提携が示す、日本企業のAI人材育成と業務変革の現実](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/)でも、導入の勝負はモデル比較より **組織の実務へどう埋め込むか** に移っていると書いた。Slack / Salesforce の今回の動きは、その営業・顧客接点版だと言える。

## 考察: 先に確認すべきなのは AI の賢さより権限とプラン境界

もう一つ重要なのは、導入判断でまず見るべき順番だ。多くの現場では「便利そうか」「Slackbot がどれだけ仕事できるか」に目が向きやすいが、実務ではその前に **どのプランで何が使えるか、誰に開放するか** を詰めないと運用がぶれやすい。

Slack の Help を見る限り、要約機能、workflow automation、enterprise search、Salesforce automations では提供範囲がはっきり分かれている。しかも管理者は AI 機能ごとに有効化対象を切り分けられる。これはメリットでもあり、設計を雑にすると「一部のチームだけできることが違う」「トライアルと本番で期待値がずれる」という問題も起こる。

日本企業では、まず **営業本部や CS の 1 チームで Business+ / Enterprise+ 相当の実験範囲を区切り、どの Slackbot Skill を共通化するかを決める** のが現実的だろう。全社一斉展開より、案件レビュー、会議準備、更新漏れ検知、週報作成といった明確な反復業務から始める方が失敗しにくい。

## まとめ

Salesforce と Slack の 2026年4月29日更新は、CRM 連携の小改良ではない。**新規顧客に free Slack workspace を初日からつなぎ、Slackbot と workflow を使って顧客業務そのものを Slack 側へ寄せる** という設計転換だ。

Slackbot Skills、scheduled automations、email / calendar actions、Workflow Builder の AI step、プラン別の AI 開放、管理者による feature access を合わせて見ると、Salesforce は Slack を「会話の場」から **営業・CS・社内調整を実行する AI work platform** へ育てにきている。

日本企業が今見るべきなのは、全部入りで夢を見ることではない。まずは、**Slack 上に残っている顧客対応の反復作業を 2〜3 個選び、どこまで Salesforce 文脈と AI で短縮できるか** を測ることだ。その結果が出れば、CRM の使い方そのものより、仕事の流し方を変える議論へ進みやすくなる。

## 出典

- [Slack is the AI Work Platform for Every Salesforce Customer, Ready on Day One](https://www.salesforce.com/blog/connect-slack-to-salesforce/) - Salesforce, 2026-04-29
- [Slack Feature Drop: A Downpour of “Done”](https://slack.com/blog/news/slack-feature-drop-april2026) - Slack, 2026-04-29
- [Updates to feature availability and pricing for Slack subscriptions](https://slack.com/help/articles/39264531104275-Updates-to-feature-availability-and-pricing-for-Slack-plans) - Slack Help
