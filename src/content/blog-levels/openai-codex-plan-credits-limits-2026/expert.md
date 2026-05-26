---
article: 'openai-codex-plan-credits-limits-2026'
level: 'expert'
---

OpenAI Help CenterのCodex関連更新は、プロダクト発表としては地味です。しかし、Codexを開発組織に入れる責任者にとっては、かなり重要です。Codexの価値が「どれだけ賢くコードを書けるか」だけでなく、「どのChatGPTプランに含まれ、どのseatで使い、どのcredit poolを消費し、どのrate limitsに当たり、誰がoverageや追加購入を管理するか」へ移っているからです。

このシリーズでは、[OpenAI Codex GoalモードとAppshots](/blog/openai-codex-goal-appshots-browser-2026/)で作業体験の拡張を、[Codex rate limits障害](/blog/openai-codex-rate-limit-incident-resilience-2026/)で可用性と制限の運用を、[Codex Gartner評価](/blog/openai-codex-gartner-enterprise-coding-agents-2026/)で企業調達カテゴリ化を扱ってきました。今回のHelp Center更新は、その足元にある契約、利用枠、credit governanceを確認する材料です。

## 事実: Codex accessはChatGPT plan identityに載る

OpenAIの「Using Codex with your ChatGPT plan」は、CodexがChatGPT Plus、Pro、Business、Enterprise/Eduに含まれると説明しています。さらに、期間限定でChatGPT FreeとGoにもCodexが含まれ、その他のプランでは2倍のrate limitsが適用されるとしています。利用者はChatGPTアカウントでサインインし、Codex app、CLI、IDE extension、Codex webへ接続します。

この設計は、導入責任者には二つの意味を持ちます。

第一に、Codexの利用者管理はChatGPT workspace identityと切り離せません。個人のPlus/Proで試す、Free/Goで期間限定に触る、Business/Enterpriseワークスペースで正式に使う。これらは見た目には同じCodexでも、契約、data controls、admin controls、credit管理が異なります。

第二に、Codexは複数surfaceを持つ開発基盤です。app、CLI、IDE extension、webは、同じ利用者が違う場所で同じ仕事に触る入口です。従来のSaaS導入のように「ブラウザの利用だけ許可する」といった単純な整理では足りません。ローカル開発環境、IDE、ターミナル、クラウド実行、workspace appsの統制を合わせて見る必要があります。

## 事実: workspace app controlsとdata controlsがCodexにも関係する

OpenAIは、BusinessとEnterprise/Edu workspacesでは、pluginsのアクセスがworkspace app controlsに従うと説明しています。管理者やownersはWorkspace settingsのAppsから該当appを無効化でき、Manage actionsでpluginの操作範囲も制御できます。

これは、Codexがただコードを生成するだけなら小さな話に見えます。しかしCodexは、Memories、Automations、in-app browser、Computer Use、connected servicesなど、作業文脈を広げる機能を持ちます。OpenAIは、ChatGPTで接続したGoogle Driveのようなconnected servicesがCodexでも利用できる場合があると説明しています。便利ですが、企業では接続境界の棚卸しが必要です。

data controlsも重要です。OpenAIは、Business、Enterprise、Eduでは通常、製品のinput/outputをモデル改善に使わないと説明しています。一方、ProやPlusでは、ユーザーがtrainingをoffにしない限り、会話がモデル改善に使われる可能性があると説明されています。さらに、Computer Useのscreenshotsもdata controlsの文脈に入る。

ここから導ける実務判断は明確です。業務コード、顧客情報、障害ログ、未公開仕様をCodexへ入れるなら、個人アカウントや期間限定Free/Goの便利さだけで判断しない。Business/Enterprise workspaceへ寄せ、data controls、connected services、plugin actions、workspace roleを確認するべきです。

## 事実: rate cardはmessage averageからtoken typeへ移った

Codex rate cardは、Codexのcredit ratesをinput tokens、cached input tokens、output tokensに分けています。モデルごとにcredits per million tokensが異なり、GPT-5.5、GPT-5.4、GPT-5.4-Mini、GPT-5.3-Codex、GPT-5.2などで消費が変わります。Fast modeは対応モデルで追加rateがかかり、Code reviewはGPT-5.3-Codexを使うと説明されています。

OpenAIは、2026年4月2日にCodex pricingをper-messageではなくAPI token usageに合わせたと説明しています。この変更は、Plus、Pro、Business、新規Enterpriseへ適用され、その後4月23日に既存Enterprise、Edu、Health、Gov、ChatGPT for Teachersにも広がったとされています。一部Enterprise顧客はlegacy rate cardを続ける場合があるため、自社契約がどちらかを確認する必要があります。

この変更は、FinOpsの観点で大きい。message単位の平均消費は、予算説明には分かりやすい一方、実際のワークロード差を隠します。token typeごとのcredit消費では、長い入力、長い出力、キャッシュ効率、モデル選択が費用に直結します。たとえば、大きなmonorepoの調査、長い設計説明、複数ファイルの修正、テスト失敗後の再試行、PRレビューは、すべて同じ「1回のCodex利用」ではありません。

OpenAIは、平均的なCodex費用を開発者1人あたり月100〜200ドル程度と説明しながら、モデル、同時インスタンス数、automations、fast modeによって大きく変わるとしています。日本企業で予算を作るなら、このレンジをそのまま席数に掛けるだけでは足りません。ワークロード別の消費サンプルを取るべきです。

## 事実: credit poolとoverageは業務停止条件になる

Flexible pricingの説明では、creditsはDeep Research、Thinking models、Image Gen、Advanced Voice、Codexのようなadvanced featuresに使われます。BusinessやEnterpriseでは、標準ChatGPT seatとCodex-only seatの関係に加え、shared credit pool、追加購入、overagesを設計する必要があります。

特にEnterprise/Eduでは、shared credit poolが枯渇するとadvanced featuresがpauseされ、Workspace Ownersがoveragesを有効にするか、OpenAI Account team経由で追加creditsを購入しなければ再開できないと説明されています。これは単なる請求の話ではありません。リリース前、障害対応中、セキュリティ修正中にcredit poolが枯渇すれば、Codexを前提にした作業が止まる可能性があります。

Codex rate cardは、Codex settingsのUsage panelでusage limitsやremaining creditを確認できると説明しています。プランやroleによってはcredits購入やauto-reloadを管理できる。できない場合はworkspace owner/adminへ依頼する必要がある。この「誰が見えるか」「誰が買えるか」「誰が止めるか」が、AI開発基盤の運用責任になります。

## 分析: Codex導入はseat管理からworkload managementへ移る

ここからは分析です。

従来の開発者向けSaaSは、席数、月額、SSO、権限で管理できる部分が大きかった。Codexのようなagentic toolでは、それだけでは足りません。開発者が同じseatを持っていても、README修正、UI検証、レガシーコード調査、セキュリティ修正、PRレビュー、automationsでは、消費するcreditsもrate limitへの近さも違います。

したがって、管理単位は「誰に席を配るか」から「どのworkloadにどれだけ使わせるか」へ移るべきです。これは[Codexのチーム向け従量課金](/blog/openai-codex-pay-as-you-go-teams-2026/)で見た導入摩擦の低下と表裏一体です。小さく始めやすくなるほど、使い道が散らばりやすい。散らばった使い道を観測しなければ、費用対効果も制限リスクも分かりません。

日本企業では、部門別予算と横断開発基盤の責任分界が難しい。あるプロダクト部門がCodexで大きなリファクタリングを回し、別部門のリリース支援が同じcredit poolに影響されるような構図は避けたい。全社ワークスペースで使うなら、部署、プロジェクト、利用目的、criticalityを分けて見る仕組みが必要です。

## 分析: 期間限定Free/Go提供は社内シャドー利用を増やす可能性がある

FreeやGoに期間限定でCodexが含まれることは、開発者体験としてはよい入口です。学生、個人開発者、小さなチームがCodexを触りやすくなる。日本のスタートアップや副業開発者にも意味があります。

ただし、企業ではシャドー利用の入口にもなります。業務PCで個人アカウントのCodexを使い、社内コードやエラーログを貼り、あとから正式導入の議論が追いつく。この流れはChatGPT本体でも起きました。Codexでは、コード、依存関係、環境変数、スクリーンショット、Computer Useの操作文脈まで関わるため、影響はさらに大きい。

対応策は、禁止だけではありません。むしろ、早めに公式の使い方を用意することです。個人アカウントで業務コードを扱わない、Business/Enterprise workspaceで利用する、sensitive repositoryでは最初に権限とdata controlsを確認する、connected servicesは必要最小限にする、PoC用リポジトリを用意する。こうした現実的な導線がないと、現場は便利な方へ流れます。

## 分析: rate limits障害後の次の論点は予算停止である

[Codex rate limits障害](/blog/openai-codex-rate-limit-incident-resilience-2026/)では、クレジット残高とrate limitsは別物だと整理しました。今回のHelp Center更新を合わせて読むと、もう一つの停止条件が見えます。credit poolの枯渇です。

rate limitは短時間の処理量やサービス側制御に関係します。一方、credit pool枯渇は予算・購入・overage設定に関係します。どちらも開発者から見ると「Codexが使えない」ですが、復旧手順は違う。rate limitなら待つ、タスクを小さくする、モデルやタイミングを変える。credit pool枯渇なら、owner/adminが追加購入やoverageを判断する、低優先タスクを止める、部署別消費を見直す。

この違いを社内手順に入れるべきです。Codexが止まったとき、まずStatusを見るのか、Usage panelを見るのか、workspace ownerへ聞くのか、タスクを分割するのか。現場が毎回Slackで「動かない」と叫ぶ状態では、AI導入の運用成熟度が足りません。

## 日本企業向けの実装手順

第一に、Codex利用面を棚卸しします。app、CLI、IDE extension、web、cloud、Computer Use、in-app browser、plugins、connected servicesを並べ、業務利用を許可するものと検証中のものを分けます。

第二に、アカウント境界を決めます。個人Plus/Pro、Free/Go、Business、Enterpriseのどれで業務コードを扱ってよいかを明文化する。正式導入前のPoCでも、顧客データや本番障害ログを扱うなら管理ワークスペースを使うべきです。

第三に、credit policyを作ります。月次上限、auto-reload可否、overage承認者、緊急時の追加購入条件、部署別の利用レビューを決めます。開発者には、remaining creditとusage limitsの見方を共有します。

第四に、workload tiersを作ります。P0/P1障害、セキュリティ修正、リリースブロッカーは優先利用。低優先のリファクタリング、ドキュメント草案、学習用途は混雑時やcredit逼迫時に後回し。こうしたtieringは、費用管理だけでなく障害時の判断にも効きます。

第五に、token効率をレビューします。巨大な入力を丸投げしない、タスクを小さく分ける、不要な出力を抑える、キャッシュが効く作業単位を作る、fast modeを常用しない。これは費用削減であると同時に、rate limits耐性の改善でもあります。

第六に、connected servicesとscreenshotsのルールを作ります。Google Driveなどの接続、Appshots、Computer Use screenshotsは、開発文脈を豊かにする一方で、機密情報を含みやすい。テストデータ、マスキング、専用ワークスペース、権限レビューを組み合わせるべきです。

第七に、月次で費用対効果を見ます。開発者1人あたりの平均だけでなく、PRレビュー、テスト作成、障害調査、UI修正、レガシー調査などworkload別に見る。Codexの価値は、単純な利用時間ではなく、レビュー待ち短縮、テスト不足解消、属人化低減、リードタイム短縮で測る方がよい。

## まとめ

OpenAI Help CenterのCodex更新は、CodexがChatGPT plan、workspace identity、credit pool、rate card、data controls、plugin controlsの中で運用される製品になったことを示しています。これは開発者には少し面倒に見えるかもしれません。しかし、企業導入にとっては必要な成熟です。

日本の開発組織が今やるべきことは、Codexを全社に配るかどうかを急ぐことではありません。まず、どのアカウント境界で使うか、どのworkloadに使うか、creditとrate limitsを誰が見るか、overageを誰が承認するか、connected servicesとdata controlsをどう扱うかを決めることです。

Codexは、個人の生産性ツールから開発基盤へ移っています。開発基盤として使うなら、モデル性能だけでなく、費用、制限、権限、データ、停止時手順まで設計する必要があります。今回の更新は、その設計を始めるためのよいタイミングです。

## 出典

- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) - OpenAI Help Center, 2026年5月25日更新
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center, 2026年5月25日更新
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center, 2026年5月25日更新
- [What is ChatGPT Enterprise?](https://help.openai.com/en/articles/8265053-what-is-chatgpt-team) - OpenAI Help Center, 2026年5月25日更新
