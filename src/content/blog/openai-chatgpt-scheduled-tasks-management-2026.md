---
title: 'ChatGPTタスク刷新、定期業務AIの運用設計を再点検'
description: 'ChatGPTタスク刷新を整理。日本企業が定期実行、監視通知、アプリ権限、Business/Enterprise上限をどう管理し、業務AIの運用ルールと停止条件へ落とすか解説する。'
pubDate: '2026-06-18'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'AIワークフロー', '企業導入', '管理者設定']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAI は 2026年6月17日の ChatGPT Release Notes で、**Scheduled tasks in ChatGPT** の管理体験を刷新した。新しい Scheduled page、柔軟な時間帯指定、監視タスク、通知改善が中心で、あわせて Pulse は proactive update の役割を scheduled tasks に移す流れで終了へ向かう。

これは単なるリマインダー機能の改善ではない。ChatGPT が、利用者の入力を待つチャットから、定期的に確認し、変化があれば知らせる業務面へ近づいた更新である。以前の [ChatGPT求人検索と履歴書支援](/blog/openai-chatgpt-job-search-resume-2026/) が採用業務の入口を扱い、[ChatGPT for Excel](/blog/openai-chatgpt-for-excel-financial-data-2026/) が表計算の現場を扱ったとすれば、今回は「定期業務をどうAIへ預けるか」が論点になる。

## 事実: Scheduled pageと監視タスクが前面に出た

OpenAI のリリースノートでは、Scheduled tasks によって ChatGPT にリマインダー、定期作業、監視を依頼できると説明されている。今回の更新では、サイドバーから見つけられる Scheduled page が追加され、利用者はアクティブなタスク、次回実行時刻、停止、再開、編集、削除を一か所で扱える。

時間指定も少し実務寄りになった。特定時刻だけでなく、朝、午後、夕方のような広い時間帯を指定できる。毎日9時ちょうどに必ず実行する業務だけでなく、「毎朝のブリーフィング」「夕方の変更確認」「週次の振り返り」のような、人間の仕事に近い粒度で指定しやすくなった。

もう一つ重要なのが監視タスクだ。OpenAI の説明では、ChatGPT が Web や接続済みアプリの変化を確認し、意味のある更新がある場合だけ通知できる。ここは日本企業にとって慎重に読むべき部分である。便利な一方で、何を見に行くのか、どのアプリ権限を使うのか、どの通知を業務判断に使ってよいのかを決めないと、AIからの通知が新しいシャドー業務フローになる。

## 事実: 上限と制約はまだ運用設計に効く

Scheduled tasks は Plus、Pro、Business、Enterprise にロールアウトされる。OpenAI のヘルプでは、タスクは Web とモバイルから作成・管理できる一方、Scheduled tab は現時点で ChatGPT desktop app や Codex app にはないと説明されている。Windows やデスクトップ中心の業務チームでは、この入口の違いを利用者に説明する必要がある。

上限も明確だ。Go はアクティブタスク 3 件、Plus は 5 件、Business と Edu は 10 件、Pro と Enterprise は 15 件とされる。さらに、タスクは 1時間に1回を超えて実行できず、長く放置されたタスクは自動停止することがある。つまり、これは高頻度ジョブ基盤ではない。数分ごとの監視、即時トリガー、外部システムのイベント駆動処理を任せる用途には向かない。

モデル面では、ChatGPT のタスクは Pro models を除く ChatGPT モデルでサポートされ、プランの利用制限も適用される。Voice chats と GPTs はタスクではサポートされない。Business や Enterprise では、アプリ利用可否や権限は workspace 設定と管理者の有効化に依存する。管理対象ワークスペースでは、タスクがアプリを使う前に承認を求められたり、一部アクションができなかったりする。

## 分析: 日本企業では小さな定期チェックから始める

ここからは分析だ。

日本企業が今回の更新を見てすぐに考えたいのは、AIに業務を丸ごと任せることではない。最初に向くのは、低リスクな定期チェックである。たとえば、社内FAQの更新確認、公開ページの変更チェック、競合ニュースの週次要約、採用ページの表現確認、会議前の準備リマインダー、営業資料の更新漏れ確認などだ。

一方で、請求、契約、採用評価、顧客対応、障害対応、法務判断のように、通知がそのまま業務判断へつながる領域では慎重に扱うべきだ。ChatGPT の通知は、確認のきっかけにはなる。しかし、通知が来なかったことを「問題がない」と読む設計は危ない。Web や接続アプリの取得範囲、権限、検索結果の鮮度、タスク停止の可能性があるからである。

この観点は [OpenAIのOffline検索でChatGPT企業利用はどう変わるか](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) ともつながる。検索や監視は、外部情報をどの経路で取り、どの鮮度で、どの出典として扱うかが重要になる。Scheduled tasks は便利なUIだが、監査証跡や取得保証を置き換えるものではない。

## ChatGPT agentやCodex automationsと混同しない

OpenAI の Scheduled Tasks ヘルプは、ChatGPT scheduled tasks と Codex automations の違いも説明している。前者は ChatGPT の機能で、リマインダー、定期タスク、日次ブリーフィング、監視のような proactive work が中心だ。後者は Codex で走る focused workflows であり、開発作業やリポジトリ文脈に寄った自動化として見るべきである。

ChatGPT agent との関係も分けたい。ChatGPT agent は Web サイト操作、ファイル、アプリ、フォーム、表計算などを使い、複雑なオンライン作業を進める機能である。OpenAI は、agent invocation が scheduled tasks の一部として使われる場合も利用上限に数えると説明している。つまり、Scheduled tasks は入口や繰り返し条件であり、agent は実行能力である。

この区別を曖昧にすると、社内説明が崩れる。たとえば「毎朝メールを見て重要なものを処理して」と頼む場合、それは単なるリマインダーではなく、メールアプリ権限、agent 実行、データ閲覧、場合によっては送信や変更アクションに近づく。そうした利用は、[ChatGPT Library管理と外部アプリ承認](/blog/openai-chatgpt-library-admin-controls-2026/) で扱ったように、ワークスペース内のファイル、外部アプリ、アカウント権限をまとめて見る必要がある。

## 導入前のチェックリスト

第一に、タスク種別を分ける。リマインダー、情報収集、変更監視、アプリ連携、agent実行を同じ「タスク」と呼ばない。低リスクな通知から始め、外部アプリや顧客情報に触るものは別審査にする。

第二に、アクティブタスクの棚卸し担当を決める。Scheduled page は利用者ごとの管理をしやすくするが、企業では「誰がどの定期タスクを持っているか」も問題になる。退職、異動、プロジェクト終了時に、不要なタスクを停止する運用が必要だ。

第三に、アプリ権限を最小化する。Gmail、Google Drive、Calendar、業務SaaSをタスクに使う場合、必要なアプリだけを有効にする。Business/Enterprise では管理者設定が効くため、個人任せにせず、タスクで使ってよいアプリを明文化したい。

第四に、通知を業務判断の根拠にしすぎない。タスクは 1時間に1回までで、放置により停止する場合がある。監視タスクは「変化があれば知らせる」補助であり、障害監視や法定期限管理の主系統にはしない。

第五に、セキュリティ設定と併用する。外部サイト、ファイル、アプリを使うタスクが増えるほど、プロンプトインジェクションや外部送信のリスクは上がる。[ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) で整理したように、Lockdown Mode、アプリ承認、RBAC、タスク運用は別々に確認するべきだ。

## まとめ

ChatGPT Scheduled tasks の刷新は、ChatGPT を「必要なときに開く道具」から「一定の間隔で仕事を見に行く道具」へ近づける更新である。Scheduled page、時間帯指定、監視タスク、通知改善、Pulse終了の流れを見ると、OpenAI は proactive work を ChatGPT の標準体験に寄せている。

ただし、日本企業が見るべき本質は自動化の派手さではない。どのタスクを許し、どのアプリ権限を使い、誰が止め、通知をどこまで信頼するかである。最初は、低リスクな定期チェックとブリーフィングから始める。顧客情報、採用評価、契約、障害対応のような高リスク領域では、ChatGPT agent、アプリ権限、監査、停止条件をセットで設計する。Scheduled tasks は業務AIの入口になるが、運用ルールなしに広げるべき入口ではない。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Scheduled Tasks in ChatGPT](https://help.openai.com/en/articles/10291617-tasks-in-chatgpt) - OpenAI Help Center
- [ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) - OpenAI Help Center
