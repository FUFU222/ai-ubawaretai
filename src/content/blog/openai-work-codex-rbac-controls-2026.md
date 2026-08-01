---
title: 'ChatGPT Work/Codex管理、RBAC分離の実務'
description: 'ChatGPT Work/Codex管理更新を整理。日本企業がWork Local、Work Cloud、Fast Mode既定値、RBAC分離をどう設計し、業務AIとCodexを安全に広げるか解説する。'
pubDate: '2026-08-02'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'Codex', '管理者設定', '企業導入', 'AIガバナンス']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAIは**2026年7月30日**、ChatGPT Enterprise / Eduのrelease notesで、**Work and Codex向けの管理者制御を追加**したと発表した。管理者はWork LocalとWork Cloudを独立して扱い、ModelsページからFast Mode defaultsとcustom-role overridesを設定できる。Roles and Permissionsページも再設計され、WorkとCodexを広げるときの権限整理がしやすくなった。

これは、派手な新agent発表ではない。しかし日本企業にとってはかなり実務的である。[ChatGPTデスクトップ統合](/blog/openai-chatgpt-desktop-work-codex-classic-2026/)で見たように、OpenAIはChat、Work、Codexを一つのdesktop appへ寄せている。[ChatGPT VoiceのWork/Codex拡大](/blog/openai-chatgpt-voice-work-codex-desktop-2026/)では、音声で長い作業を開始・中断・調整する導線も出てきた。今回の更新は、その利用面を企業管理へ落とすための設定強化である。

日本企業の焦点は、WorkやCodexをオンにするかどうかではない。ローカル端末上の作業、クラウドで同期する作業、Fast Modeを使う作業、ロール別の例外、費用の見え方を分けて設計できるかである。これを分けないまま全社展開すると、利用者は便利になる一方で、情シス、セキュリティ、購買、ヘルプデスクの説明が追いつかなくなる。

## 事実: Work LocalとWork Cloudを分けて管理する

OpenAIのrelease notesは、EnterpriseとEdu workspacesでWork and Codexの新しいadmin controlsを追加したと説明している。管理者は、Work LocalとWork Cloudを独立して管理できるようになった。

Help CenterのWorkspace settings記事では、Permissions & rolesから、default workspace roleとcustom rolesに対してWork LocalとWork Cloudのアクセスを分けられると説明されている。Work Cloudを有効にすると、対応するweb、mobile、desktop surfaceをまたいでcloud tasksを開始・閲覧できる。Work Localだけを有効にし、Work Cloudを無効にすると、desktop appでlocal workはできるがcloud tasksは開始できない。

ChatGPT Work and Codexの説明でも、この分離は明確だ。Work on web and mobileはcloudで動く。desktop appのWorkは、planとworkspaceで許される場合にlocal filesやdesktop appsを扱える。cloud Work chatsはweb、mobile、desktopで同期する一方、local chatsはそのコンピュータ上に残る。Codexはdesktop app内の別viewで、local folders、repositories、terminals、developer toolsと結びつく。

つまり、Work LocalとWork Cloudは単なる表示名ではない。データの置き場所、作業の継続面、端末権限、監査対象、問い合わせ導線が違う。日本企業では、社内端末でのローカルファイル作業は許すが、クラウドtask同期は段階導入にする、といった設計が現実的になる。

## 事実: Fast Mode defaultsは権限付与ではない

もう一つの更新は、ModelsページでWork and Codexのstarting model、reasoning level、speed、Fast Mode availability、new-chat behaviorを設定できる点である。OpenAIは、Fast Modeは既定で有効で、role-specific controlsがある場合は管理者がselected rolesに対してworkspace defaultをoverrideできると説明している。

ここで重要なのは、starting defaultが権限そのものではない点だ。Help Centerは、これらの設定はstarting experienceを定義するが、利用者のroleで利用不可なmodelやfeatureへのアクセスを付与するものではないと説明している。利用可能モデル、role-based access、enforced workspace requirementsは引き続き効く。複数の選択肢が許されている場合、利用者はstarting defaultから切り替えられる。

これは管理者にとって大事な線引きである。Fast Mode defaultを設定しても、未許可モデルを使えるようにするわけではない。逆に、あるroleにモデルアクセスがあり、Fast Modeも使えるなら、starting defaultによって最初の消費傾向が変わる。費用や品質を管理したいなら、model availability、role access、Fast Mode default、usage limitsを同じ表で見なければならない。

Codex rate cardでも、Fast Modeはsupported modelsで高いrateでcreditsを消費すると説明されている。さらにCodex、ChatGPT Work、ChatGPT for Excel、Workspace Agentsは、利用可能なplanでは同じagentic usage and credit poolから消費する。したがって、Fast Mode defaultは単なる速度設定ではなく、共有creditsの消費ペースを変える可能性がある。

## 事実: RBAC更新は既存role behaviorを変えない

OpenAIは、今回のRoles and Permissions page刷新について、既存のWork and Fast Mode permissionsは引き継がれ、browser and network accessは引き続き別管理であり、RBAC updateはadmin interfaceだけを変えると説明している。既存role behaviorは変わらない。

この一文は、導入時の社内説明で重要だ。管理画面が変わると、現場は「権限が勝手に変わったのではないか」と不安になる。管理者も、画面刷新をきっかけに既存roleの棚卸しを始めるべきだが、更新そのものが既存権限を自動で変更するわけではない。

一方で、画面が整理されたことで、これまで曖昧だった権限差が見えやすくなる。Work Local、Work Cloud、Codex Local、browser use、network access、Fast Mode、model availability、apps、MCP、usage limitsが別々の制御点として見えてくる。日本企業では、ここを「既存挙動は変わらないから何もしない」ではなく、「既存roleが妥当か見直す機会」と読むべきだ。

## 分析: local executionとcloud executionを同じ許可にしない

ここからは分析である。

Work LocalとWork Cloudの分離は、企業内AI運用の現実に合っている。ローカル作業は、利用者の端末、ローカルファイル、desktop app権限、OSのscreen recordingやaccessibility権限、MDM、EDRと結びつく。クラウド作業は、web、mobile、desktop間の同期、scheduled tasks、cloud task history、共有usage pool、workspace retention、モバイルからの継続と結びつく。

この2つはリスクが違う。ローカル作業は、端末内の未共有ファイルや顧客資料に触れやすい。クラウド作業は、端末を閉じても作業が続き、別surfaceから見えるため、便利な一方で作業履歴と通知の管理が必要になる。どちらが安全かを単純に決めるのではなく、業務ごとに向き不向きを分けるべきだ。

たとえば、開発者がローカルrepositoryを使ってCodexやWorkに小さな調査をさせる場合、Work LocalやCodex Localが向く。営業企画が複数日かけて市場調査を行い、webやmobileから進捗を見たい場合はWork Cloudが向く。経理や人事の機微情報、顧客個別資料、客先常駐端末では、クラウド同期やlocal file accessを別々に絞る必要がある。

この整理は、[ChatGPT agentからWorkへの移行](/blog/openai-chatgpt-agent-work-migration-2026/)の論点ともつながる。Workは長い業務作業へ広がるため、チャットの利用許可だけでは足りない。どの作業をlocalで許し、どの作業をcloudで許し、どの作業は人間の手元に残すかを決める段階に入っている。

## 実務: 日本企業の30日棚卸し

最初の1週間は、roleとgroupを棚卸しする。default workspace role、custom roles、SCIM group、部署、委託先、開発者、業務部門、管理者、ヘルプデスクを並べ、現在どのroleがChat、Work、Codex、Apps、browser/network access、usage limitsを持つか確認する。今回の更新で既存挙動は変わらないが、古いrole設計がそのまま残っている可能性がある。

2週目は、Work LocalとWork Cloudを分ける。全員にWork Cloudを開くのではなく、ローカルだけ許すrole、cloud taskを許すrole、Workを使わせないroleを作る。開発者、企画、法務、人事、営業、委託先で、扱うデータと必要な継続面は違う。業務AIを広げるほど、ここを一律にしないほうがよい。

3週目は、Fast Mode defaultsを決める。Fast Modeを全員のstarting defaultにするか、特定roleだけにするか、費用が読めるまで標準速度に寄せるかを選ぶ。[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/)で整理したように、Workや関連agentic featuresはcredits管理と切り離せない。Fast Modeは体験を改善するが、shared poolの消費速度も変える。

4週目は、ヘルプデスクと監査の切り分けを作る。「Workは見えるがcloud taskを開始できない」「desktopではlocal fileを扱えるがmobileでは見えない」「Fast Mode defaultがroleで違う」「Codexはwebに出ない」「browser/network accessが別設定で止まっている」といった問い合わせを想定する。利用者には短いFAQ、管理者にはrole別の設定表を渡したい。

## まとめ

OpenAIの2026年7月30日の更新は、ChatGPT Work and Codexを大規模に使うための管理面を一段整えたものだ。Work LocalとWork Cloudを分け、Fast Mode defaultsとcustom-role overridesをModelsページで扱い、Roles and Permissionsを見やすくした。既存role behaviorは変わらないが、管理者が見直すべき制御点は増えている。

日本企業は、この更新を「Work/Codexをオンにする機能」としてではなく、local execution、cloud execution、速度、credits、role、browser/network accessを分ける機会として扱うべきだ。業務AIと開発AIが同じChatGPT workspaceに並ぶほど、設定の主語は「機能」ではなく「役割と作業環境」になる。

この更新は`openai-chatgpt-work-products-2026` seriesの重要な管理編である。既存のseriesTitle記事が総まとめを担っているためpillarは付けないが、WorkとCodexを全社展開する企業では、今後の運用基準として参照されやすい。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-30
- [Managing workspace settings in ChatGPT Enterprise](https://help.openai.com/en/articles/8411955-managing-workspace-settings-in-chatgpt-enterprise) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
