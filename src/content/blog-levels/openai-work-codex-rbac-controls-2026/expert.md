---
article: 'openai-work-codex-rbac-controls-2026'
level: 'expert'
---

OpenAIの2026年7月30日のChatGPT Enterprise / Edu更新は、Work and Codexを「使えるようにする」段階から、「どのroleに、どの実行面を、どのstarting defaultで渡すか」へ管理粒度を進めるものだ。新しいモデル発表ではないが、Enterprise workspaceで業務AIと開発AIを同時に展開している企業には影響が大きい。

この更新は、直近の流れの中で読む必要がある。[ChatGPTデスクトップ統合](/blog/openai-chatgpt-desktop-work-codex-classic-2026/)では、Chat、Work、Codexが一つのdesktop appに並び始めた。[ChatGPT VoiceのWork/Codex拡大](/blog/openai-chatgpt-voice-work-codex-desktop-2026/)では、音声で複数agent作業を開始・中断・調整する入口が出た。[ChatGPT agentからWorkへの移行](/blog/openai-chatgpt-agent-work-migration-2026/)では、長い業務作業がChatGPT Workへ再編される流れを扱った。今回の更新は、その利用面に対して、管理者がlocal、cloud、speed、roleを分けるためのものだ。

日本企業にとっての要点は、ChatGPTという単一ブランドの中で、実際には別々のリスクが並び始めていることだ。Chatは会話、Work Cloudはクラウドで続く業務作業、Work Localはdesktop appでローカルファイルやアプリに近い作業、Codexはrepository、terminal、developer toolsへ届く作業である。これらを同じ「ChatGPT利用許可」として扱うと、監査も費用も説明できなくなる。

## 事実: Work LocalとWork Cloudが別制御になった

OpenAIのrelease notesは、Enterprise and Edu workspacesでWork and Codexのadmin controlsを追加し、Work LocalとWork Cloudを独立管理できると説明している。

Workspace settingsのHelp Centerでは、Permissions & rolesからdefault workspace roleとcustom rolesに対してWork LocalとWork Cloud accessを分けられる。Work Cloudは、対応surfaceをまたいでcloud tasksを開始・閲覧するための設定である。Work Local without Work Cloudでは、desktop appでlocal workはできるがcloud tasksは開始できない。

ChatGPT Work and CodexのHelp Centerは、提供面の差も説明している。Work on web and mobileはcloudで動く。desktop appのWorkは、planとworkspaceで許される場合、local filesやdesktop appsを扱える。Cloud Work chatsはweb、mobile、desktopで同期するが、local chatsはそのコンピュータに残る。Codexはdesktop app内の別viewで、local folders、repositories、terminals、developer toolsを扱い、webやmobileで選択できるexperienceではない。

ここから分かるのは、Work LocalとWork Cloudは単なる利用チャネルの違いではないということだ。データの場所、作業継続、端末権限、同期、監査、問い合わせ先が変わる。Work Cloudを開くことは、cloud taskを始め、別surfaceから見ることを許す。Work Localを開くことは、desktop appで端末上の作業を進める入口を許す。この2つを同じroleに常に同時付与する必要はない。

## 事実: Fast Mode defaultsとcustom-role overridesがModelsページへ入った

Modelsページの更新も重要だ。Workspace owners and adminsは、Work and Codexのstarting model、reasoning level、speed、Fast Mode availability、new-chat behaviorを設定できる。Fast Modeは既定で有効で、role-specific controlsが使える場合は、選択したroleに対してworkspace defaultをoverrideできる。

ただし、OpenAIは明確に、これらの設定はstarting experienceを決めるものであり、利用者roleで利用できないmodelやfeatureへのアクセスを付与するものではないと説明している。available models controls、role-based access、enforced workspace requirementsは引き続き適用される。複数の選択肢が許可されている場合、membersはstarting defaultから切り替えられる。

この設計は、管理者が誤解しやすい。Fast Mode defaultを下げても、モデルアクセスを取り消したことにはならない。Fast Mode defaultを上げても、roleにないモデルを使えるようにはならない。モデル可用性、role access、Fast Mode availability、starting default、usage limitsは別々の制御点であり、重ねて評価しなければならない。

Codex rate cardは、Fast Modeがsupported modelsで高いrateのcreditsを消費すると説明している。また、Codex、ChatGPT Work、ChatGPT for Excel、Workspace Agentsは、利用可能なplanでは同じagentic usage and credit poolから消費する。つまりFast Mode defaultは、体験だけでなく、共有poolの消費速度に影響し得る設定である。[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/)で扱ったように、agentic featuresは席数ではなく実行量の管理へ寄っている。

## 事実: RBAC刷新は画面変更であり既存挙動は維持される

OpenAIのrelease notesは、redesigned Roles and Permissions pageについて、既存のWork and Fast Mode permissionsはcarry overし、browser and network accessはseparateのまま、RBAC updateはadmin interfaceだけを変え、existing role behaviorは変わらないと説明している。

これは変更管理上の重要な事実である。画面が変わると、利用者や管理者は「権限が変わった」と誤認しやすい。今回の更新は、既存role behaviorを自動変更するものではない。したがって、急に利用者のWorkやFast Modeが消える前提で騒ぐ必要はない。

一方で、画面刷新は棚卸しの好機である。従来、Work、Codex、browser use、network access、model availability、Fast Mode、Apps、MCP、usage limitsが複数の管理面に分かれて見えにくかった場合、Roles and Permissionsの見直しによって、roleごとの過剰付与や不足が見つかる可能性がある。

日本企業では、特にcustom rolesが増えやすい。情シス管理者、AI推進チーム、開発者、営業企画、法務、人事、委託先、外部監査、教育利用者が別roleになる。既存挙動が維持されるからこそ、古い例外roleが残っていないか、退職者や異動者がgroupに残っていないか、委託先にcloud taskやFast Modeが不要に開いていないかを確認したい。

## 分析: 実行面を分けない企業ほど事故が起きる

ここからは分析である。

Work Local、Work Cloud、Codex Local、browser/network access、Fast Modeを分ける意味は、実行面が違うからである。会話AIの利用許可なら、社内情報を入力してよいか、回答をどう扱うかが主な論点だった。WorkとCodexでは、AIが作業を進め、ファイルを読み、成果物を作り、コードを変更し、terminalやdeveloper toolsへ届く可能性がある。

Work Localは、端末上のファイル、desktop apps、OS permissions、MDM、EDR、ローカル保存、画面共有、マイクやaccessibility権限と関係する。顧客資料や社内未公開資料が端末にある場合、Work Localを誰に許すかはDLPや端末統制と合わせる必要がある。

Work Cloudは、cloud task、web/mobile/desktop間の同期、scheduled tasks、progress review、mobileからの継続、workspace retention、usage poolと関係する。利用者が退勤後や移動中に進捗確認できるのは便利だが、作業状態が複数surfaceに見えるため、通知、停止、共有範囲、保管期間を整理する必要がある。

Codex Localは、repositories、terminals、developer tools、tests、commands、PR review、remote accessと結びつく。Work Localよりも開発環境への作用が強い。Codexの権限は、ソースコード、秘密情報、CI、package manager、cloud credentials、branch protectionと切り離せない。

Fast Modeは、体験速度と費用の間にある。上位モデルやfast settingを標準にすると、利用者は待ち時間を気にせず大きな作業を投げやすくなる。これは生産性に効く一方、shared agentic credit poolの消費を早める可能性がある。速度設定はUX改善ではなく、費用と利用行動を変えるガバナンス設定として見るべきだ。

## 実務: role matrixを作る

導入実務では、role matrixを作るのが最も早い。行にrole、列に機能を置く。列は少なくとも、Chat、Work Local、Work Cloud、Codex Local、Voice in Work/Codex、browser use、network access、Apps/MCP、Fast Mode availability、starting default、usage limit、analytics visibilityにする。

標準社員roleでは、Chatと必要最小限のWork Cloudから始める。業務部門でクラウドtaskが有効なら、Work Cloudを開くが、local file accessは部署単位で確認する。人事、法務、経理、顧客個別資料を扱う部門では、Work Localを即時全開にしないほうがよい。

開発者roleでは、Codex LocalとWork Localを分ける。開発者だからWork Localも必要とは限らない。Codexはrepositoryやterminal向け、Workは調査や資料作成向けである。開発者にWork Cloudを開くなら、設計調査や技術文書の生成には便利だが、顧客情報や未公開ロードマップを含むProject contextの扱いを明示する。

AI推進roleでは、Fast ModeやWork Cloudを広めに開ける。ただし、pilot期間、費用上限、出力レビュー、利用ログ確認をセットにする。AI推進チームは例外ではなく、検証責任を持つroleであるべきだ。

委託先roleでは、Work Cloud、Work Local、Codex Localを個別に評価する。客先常駐や受託開発では、発注元が許可したrepositoryだけにCodexを使わせる、Work Cloudは使わせない、Fast Modeはdefaultにしない、といった条件があり得る。契約、アカウント、workspace role、repository権限を同じ表に置く必要がある。

## 30日移行手順

最初の週は現状把握に使う。Workspace settingsのPermissions & roles、Models、Apps、Usage limits、Groups、Identity & accessを確認し、default roleとcustom rolesの現在値を記録する。画面刷新後に「以前どうだったか」が分からなくなると、問い合わせや監査で困る。

2週目は、Work LocalとWork Cloudの方針を決める。すべてのeligible userにWork Cloudを開くのか、部門別にするのか、localだけ許すroleを作るのかを決める。ここでは、便利さではなくデータ分類と作業継続の必要性から判断する。

3週目は、Fast Mode defaultsを実験する。少数roleで、標準速度、Fast Mode、reasoning level、starting modelを変え、完了時間、credits、出力品質、レビュー差し戻し、利用者満足度を見る。Fast Modeを標準にするかどうかは、体感速度だけでなく、月次費用と成果物品質で決める。

4週目は、FAQと監査ログを整える。利用者向けには、Work LocalとWork Cloudの違い、Codexがweb/mobileに出ない理由、local chatsとcloud chatsの違い、Fast Modeが見えない場合の確認、access requestの方法を書く。管理者向けには、role変更時の承認者、変更理由、期限、rollback手順、月次レビュー項目を残す。

## 失敗しやすいパターン

一つ目は、WorkとCodexを「ChatGPTの中の機能」として一括許可することだ。WorkとCodexは、扱うデータ、実行権限、保存場所、費用が違う。一括許可は導入初期には楽だが、後で問い合わせと監査説明が重くなる。

二つ目は、Fast Modeを全員の既定にしてから費用を見ることだ。速度が上がると利用量も増える。fast settingが有効なroleほど、どの作業に使うべきか、どのusage poolから引かれるか、月次の超過時に誰が判断するかを決める必要がある。

三つ目は、browser and network accessを忘れることだ。OpenAIは今回の更新で、browser and network accessは引き続きseparateだと説明している。Work LocalやCodex Localを許しても、外部webやnetworkへのアクセスをどう扱うかは別に決めなければならない。逆に、Work Cloudを開いても、接続アプリやMCPのactionが勝手に許されるわけではない。

四つ目は、既存role behaviorが変わらないことを理由に棚卸ししないことだ。UI刷新は、古い例外や不要な権限を見つける機会である。既存挙動を維持することと、既存設計が正しいことは別問題である。

## 結論

OpenAIのWork and Codex admin controls更新は、Enterprise/Edu workspaceで業務AIと開発AIを本格運用するための管理粒度を上げるものだ。Work LocalとWork Cloudを分離し、ModelsページでFast Mode defaultsやcustom-role overridesを扱い、Roles and Permissionsを見やすくした。既存role behaviorは変わらないが、管理者が見直すべき制御点は増えた。

日本企業は、この更新をrole matrixの作成契機にしたい。Work Local、Work Cloud、Codex Local、browser/network access、Fast Mode、usage limitsをroleごとに整理し、部署、委託先、開発者、AI推進者で分ける。ChatGPTが業務成果物と開発作業の両方へ広がるほど、管理者設定は「機能オンオフ」から「実行面と役割の設計」へ移る。

最初の導入判断はシンプルでよい。全社に一括で開けるのではなく、Work Cloud、Work Local、Codex Local、Fast Modeを別々に小さく試す。月次でcredits、完了タスク、レビュー差し戻し、問い合わせ、アクセス申請を見直す。Work and Codexの価値は、使える人数ではなく、安全に委譲できた作業量で測るべきである。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-30
- [Managing workspace settings in ChatGPT Enterprise](https://help.openai.com/en/articles/8411955-managing-workspace-settings-in-chatgpt-enterprise) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
