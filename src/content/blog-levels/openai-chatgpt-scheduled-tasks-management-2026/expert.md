---
article: 'openai-chatgpt-scheduled-tasks-management-2026'
level: 'expert'
---

OpenAI の 2026年6月17日更新は、ChatGPT Scheduled tasks を「チャットから作れる便利なリマインダー」から、管理可能な proactive work の入口へ寄せるものだ。Scheduled page、柔軟な時間帯指定、監視タスク、通知改善、Pulse の終了方針が同時に示されたことで、ChatGPT は会話UIのまま、定期的な業務チェックを担う面へ進んでいる。

日本企業の実務で重要なのは、Scheduled tasks を自動化基盤として過大評価しないことだ。一方で、ただの個人リマインダーとして軽視もしないほうがよい。これは、ChatGPT が業務アプリ、検索、ファイル、agent、通知へ広がる流れの一部である。[ChatGPT求人検索と履歴書支援](/blog/openai-chatgpt-job-search-resume-2026/) では採用業務の入口、[ChatGPT for Excel](/blog/openai-chatgpt-for-excel-financial-data-2026/) では表計算作業、[OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) では検索経路を扱った。Scheduled tasks は、それらの作業を一定間隔で呼び出す運用面として現れる。

## 事実関係の整理

OpenAI の ChatGPT Release Notes は、Scheduled tasks によってユーザーが ChatGPT にリマインダー、定期作業、監視を依頼できると説明している。今回の変更では、サイドバーから見つけられる Scheduled page が追加され、アクティブなタスク、次回実行時刻、pause、resume、edit、delete を一か所で扱える。

また、実行時刻の指定が柔軟になった。特定の時刻だけではなく、morning、afternoon、evening のような広い時間帯を指定できる。実務上は、厳密な cron ではなく、人間の業務リズムに合わせた通知に近い。これにより、日次ブリーフィング、週次チェック、会議前準備、定例資料の確認のような用途に寄せやすくなる。

監視タスクも重要だ。OpenAI は、タスクが Web を検索したり、接続アプリの変化を確認したりし、意味のある更新がある場合だけ通知できると説明している。さらに、Pulse は proactive updates が Scheduled tasks へ移る流れの中で sunset される。これは、OpenAI が proactive な情報提供を個別機能から Scheduled tasks へ統合しようとしているシグナルである。

制約も明確にある。Scheduled tasks は Plus、Pro、Business、Enterprise に展開され、プランごとにアクティブタスク上限がある。ヘルプでは、Go は 3 件、Plus は 5 件、Business/Edu は 10 件、Pro/Enterprise は 15 件とされる。タスクは 1時間に1回を超えて実行できず、放置されたタスクは自動停止する場合がある。Voice chats と GPTs は対象外であり、Pro models もタスクではサポートされない。

## 自動化基盤ではなく、通知付き業務チェックと見る

設計上、Scheduled tasks は cron、ジョブキュー、RPA、監視SaaS、ワークフローエンジンの代替ではない。1時間に1回の上限、自動停止、プラン別の少ないタスク上限、UI起点の管理という性質を見ると、高頻度・高信頼・監査必須の処理には向かない。

しかし、低頻度で人間が確認する作業には向く。たとえば、公開採用ページの表現変更確認、競合製品の週次確認、重要ニュースの朝ブリーフィング、社内FAQの更新漏れチェック、会議前の論点整理、提案書作成前の資料リマインダーなどだ。これらは、通知が来たあとに人間が読む。失敗しても即座に顧客被害や法令違反へ直結しにくい。

この分類が重要である。日本企業では「AIで自動化できる」と聞くと、業務プロセス全体を置き換える話になりやすい。しかし Scheduled tasks の現実的な価値は、作業の完了ではなく、作業の起点を作ることにある。通知、要約、変化検出、確認促進を担当させ、人間の承認や業務システムへの反映は既存フローに残すほうが安定する。

## アプリ権限と監査の境界

Scheduled tasks が接続アプリを使える点は、便利さとリスクが同時にある。OpenAI のヘルプでは、タスクは Gmail のようなアプリを利用できる場合があり、Business/Enterprise では workspace 設定や管理者有効化に依存すると説明されている。管理対象ワークスペースでは、persistent permissions や app actions の制限により、タスク実行中に承認が必要になる場合もある。

ここで、管理者は「タスク機能を許可するか」だけでは足りない。どのアプリを、どのユーザーに、どの種類のタスクで使わせるかを分ける必要がある。カレンダーの空き確認と、Gmail の本文検索と、Drive のファイル参照と、外部SaaSへの書き込みはリスクが違う。Scheduled tasks は同じUIから始まっても、裏側で触るデータの性質が変わる。

[ChatGPT Library管理と外部アプリ承認](/blog/openai-chatgpt-library-admin-controls-2026/) で扱ったように、ChatGPT 内のファイル、外部アプリ、Sign in with ChatGPT、ワークスペース設定は別々の管理面である。Scheduled tasks はその上に「時間」と「通知」を重ねる。つまり、既存のアプリ承認が曖昧なままタスクだけ解放すると、定期的に外部データへ触る経路を増やしてしまう。

Compliance API も万能ではない。Scheduled Tasks のヘルプでは、Tasks は Compliance API に含まれると説明されている。一方で、ChatGPT agent のヘルプでは、agent task を含む conversation は Compliance API logs に現れるが、virtual computer usage、app requests、chain of thought のような個別アクションは出ないとされる。監査要件が強い業務では、「ログに出る」だけで十分かを確認しなければならない。

## ChatGPT agentとの実行責任を分ける

ChatGPT agent は、Web サイト操作、ファイル、アプリ、フォーム、表計算などを使い、より複雑なオンライン作業を進める機能である。OpenAI は、agent の一意な実行は月次メッセージ上限に数えられ、scheduled tasks の一部として agent requests が使われる場合も上限に含まれると説明している。

これは設計上かなり重要だ。Scheduled tasks は「いつ起動するか」「繰り返すか」「通知するか」の層であり、agent は「何を実行するか」の層である。たとえば「毎週、競合サイトを確認して変更点をまとめる」程度なら検索と要約に近い。しかし「毎朝メールを読んで返信草案を作り、必要なら送信して」となると、agent、メールアプリ、アカウント権限、承認、誤送信リスクが絡む。

OpenAI の agent ヘルプは、prompt injection、敏感情報、ログイン、スクリーンショット、アプリ権限、workspace controls をかなり具体的に説明している。したがって、Scheduled tasks で agent を使う可能性があるなら、導入判断は ChatGPT の通知機能ではなく、agent mode の導入判断に近い。タスクの名前が同じでも、実行能力が変わるとリスクは別物になる。

## Codex automationsとの境界

Scheduled Tasks ヘルプは、ChatGPT scheduled tasks と Codex automations の違いも示している。Scheduled tasks は ChatGPT の proactive work で、reminders、recurring tasks、daily briefings、monitoring が中心である。Codex automations は Codex で走る focused workflows であり、開発作業、リポジトリ、検証、PR などに近い。

日本の開発組織では、この境界を明示しておかないと混乱する。たとえば、定期的な依存関係確認、失敗テストの調査、リリースノートの下書き、脆弱性対応の初期分析は、ChatGPT scheduled tasks と Codex automations のどちらでも一部実現できそうに見える。しかし、実際にはアクセスするデータ、実行環境、成果物、レビュー責任が違う。

開発リポジトリに触る作業は Codex 側の権限、workspace、credits、実行ログ、PR レビューに寄せるべきである。ChatGPT scheduled tasks は、開発者やPMへの通知、変更の要約、調査テーマのリマインダーのような周辺作業に留めるほうが分かりやすい。実装や検証を走らせるなら、Codex automations として扱い、対象リポジトリ、実行権限、CI、レビュー担当者を明示する。

## 日本企業向けの導入パターン

第一段階は、個人または小チームの低リスク通知である。毎朝の業界ニュース、週次の公開情報確認、会議前のアジェンダ確認、社内ドキュメント更新のリマインダーなどを対象にする。接続アプリは使わないか、カレンダー程度に絞る。

第二段階は、管理対象ワークスペース内の業務チェックである。Business/Enterprise の管理者設定を前提に、Gmail、Drive、Calendar、その他アプリを使うタスクを限定的に許可する。ここでは、タスク名、目的、参照アプリ、通知先、owner、停止条件を台帳化したい。

第三段階は、agent を含む定期作業である。これは高リスク領域として扱う。サイト操作、フォーム入力、メール処理、ファイル編集、スプレッドシート操作が入る場合、プロンプトインジェクション、誤操作、外部送信、個人情報、スクリーンショット保持を確認する。利用者が「定期タスク」と呼んでいても、実態は agentic workflow である。

第四段階は、Codex automations との連携である。開発作業は ChatGPT ではなく Codex へ寄せ、ChatGPT scheduled tasks は人間への通知や週次サマリに使う。たとえば、Codex automation の結果を人間が確認する日次リマインダー、リリース前チェックの通知、重要PRのレビュー促進などである。

## 運用チェックリスト

まず、分類を作る。リマインダー、情報収集、変化監視、アプリ参照、アプリ操作、agent 実行、Codex automation 起動を分ける。分類ごとに許可されるデータ、対象ユーザー、承認要否を決める。

次に、タスク棚卸しを定例化する。Scheduled page は個人にとって便利だが、企業にとってはタスクが各利用者に分散する。異動、退職、プロジェクト終了、アプリ権限変更のタイミングで、誰がタスクを停止するのかを決める。

三つ目に、通知の信頼度を定義する。ChatGPT の通知は確認のきっかけであり、法定期限、障害監視、セキュリティアラート、契約更新の唯一の根拠にはしない。必要なら既存の監視SaaS、チケット、カレンダー、ワークフローシステムを主系統に置き、ChatGPT は補助系統にする。

四つ目に、アプリ権限を最小化する。使うタスクがないアプリを有効にしない。特定部署だけに許可する。高リスクアプリは、persistent permissions を制限し、毎回承認を要求する設計も検討する。

五つ目に、Lockdown Mode や workspace controls と併用する。[ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) で整理した通り、外部接続や prompt injection リスクは、機能が便利になるほど重要になる。タスク、アプリ、agent、検索、ファイルを別々の設定として見直すべきだ。

## まとめ

ChatGPT Scheduled tasks の刷新は、ChatGPT を定期的に仕事へ関与させるための管理面を強化する更新である。Scheduled page、柔軟な時間帯指定、監視タスク、Pulse 終了、プラン別上限、アプリ権限、agent との連携を合わせて見ると、OpenAI は proactive work を ChatGPT の標準体験へ統合している。

日本企業は、これを業務自動化の完成形としてではなく、通知付き業務チェックの入口として扱うべきだ。低リスクな定期確認から始め、接続アプリ、agent、Codex automations が絡む場合は別の運用分類に上げる。Scheduled tasks は便利だが、権限、監査、停止、通知の信頼度を決めて初めて、企業利用に耐える。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Scheduled Tasks in ChatGPT](https://help.openai.com/en/articles/10291617-tasks-in-chatgpt) - OpenAI Help Center
- [ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) - OpenAI Help Center
