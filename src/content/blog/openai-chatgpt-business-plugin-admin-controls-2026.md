---
title: 'ChatGPT Businessプラグイン管理、役割別配布の実務'
description: 'ChatGPT BusinessのPlugins管理画面を解説。日本企業がCodexプラグインを役割別に配布し、apps、外部データ、書き込み操作を三層で統制する導入・更新・停止手順を整理する。'
pubDate: '2026-06-28'
category: 'news'
tags: ['OpenAI', 'ChatGPT Business', 'Codex', '管理者設定', '企業導入', 'AIガバナンス', 'セキュリティ']
series: 'openai-codex-enterprise-2026'
draft: false
---

OpenAIは2026年6月26日、ChatGPT Businessのworkspace adminとownerが、`Workspace settings > Plugins`からCodexプラグインを管理できるようにした。新しい画面では、status、installation policy、roles、category、catalogでプラグインを検索・絞り込みできる。各プラグインをメンバーが任意に導入できる`Available`にするか、対象ロールへ既定導入する`Installed`にするかも設定できる。

これはプラグインの新機能紹介ではなく、全社配布の管理面が具体化した更新である。[OpenAI Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/)では、営業、データ分析、プロダクトデザインなど職種別の作業パッケージが登場した流れを扱った。今回の焦点は、管理者がそのパッケージを誰へ配り、必要なappsをどう許可し、問題時にどこで止めるかである。

## 事実: Plugins管理画面でできること

OpenAIのChatGPT Business Release Notesによると、管理者とownerはPlugins画面から、プラグインの発見とgovernanceを一つの面で扱える。検索とfilterに加え、メンバーがインストール可能か、workspaceへ既定インストールするかを設定し、プラグインが利用するappsを確認できる。

Help Centerの「Plugins in Codex」は、プラグインを特定のworkflowに必要なcapabilityをまとめたpackageと説明している。含まれ得るものは、再利用可能なinstructionsやworkflow patternを持つskills、外部システムのデータやactionへ接続するapps、管理者が組織固有の設定を入れてappを作るためのapp templatesである。1つのプラグインが複数のskillsとappsを含む場合もある。

Workspaceではplugins自体が既定で有効だが、管理者はeligible roleごとにinstallation policyを選べる。`Available`は利用者が自分でインストールできる状態、`Installed`はそのroleへ既定導入する状態である。つまり「workspaceでpluginsを使えるか」と「どのpluginを誰の初期状態へ入れるか」は別の設定になる。

管理者はpluginの詳細で、含まれるskills、required apps、optional apps、app templatesを確認する。required appが無効なら、そのroleの利用者はpluginを十分に使えない。app templateが含まれる場合は、templateがそのまま接続するのではなく、管理者が組織固有の設定を入力し、draft appを確認してpublishし、accessを割り当てる必要がある。

## 事実: pluginを配ってもデータ権限は増えない

重要なのは、plugin、ChatGPT/Codex上のapp、接続先サービスの権限が別々に存在することだ。OpenAIは、plugin自体が新しいデータアクセスを付与するわけではないと明記している。利用者はworkspaceでappの利用を許され、かつ接続先のrepository、CRM record、document、channelなどに元からアクセスできる場合にだけ、app-backed capabilityを使える。

たとえば営業向けpluginを`Installed`にしても、そのpluginが参照するCRM appが営業roleへ許可されていなければ、CRMデータは使えない。逆にappを許可しても、接続先SaaSで本人に顧客レコードの権限がなければ、そのレコードへ到達できない。少なくとも次の三層を分けて設計する必要がある。

1. plugin層: 誰が発見・導入でき、どのroleへ既定配布するか
2. app層: 誰がappを使え、read/writeのどのactionを許すか
3. source system層: 接続先で本人がどのデータや操作権限を持つか

この構造は、[ChatGPTアプリ権限の設計](/blog/openai-chatgpt-app-permissions-enterprise-2026/)と地続きである。pluginの配布だけ見ても、実際のデータ境界や書き込み能力は分からない。管理者はplugin詳細からappsへ降り、action control、confirmation、sync範囲、domain restriction、接続先のOAuth権限まで確認する必要がある。

## 事実: AvailableとInstalledの使い分け

`Installed`は標準化に向く。たとえば全営業担当が同じ調査手順、CRM参照、商談準備skillを使うなら、roleへ既定導入すれば初期設定のばらつきを減らせる。一方、導入対象が限定的、利用目的が固まっていない、required appが高リスクなら、`Available`で選択導入にしたほうが安全である。

ただし`Available`は承認済みという意味に見えやすい。利用者が自由に選べるなら、管理者はそのpluginが含むapps、terms、privacy policy、data residency、write actionを事前に確認しておく必要がある。カタログに表示されることと、自社の特定業務へ利用してよいことは同じではない。

Help Centerは、最初の展開をpilot groupへ限定し、可能ならread-onlyから始めることを勧めている。必要な場合だけwrite/modify actionを開き、sensitive actionにconfirmationを要求する。syncを使うappでは、folder、drive、repository、space、channelなどの対象を承認済み範囲へ絞る。これは機能を止めるためではなく、失敗時の影響範囲を管理するための順序である。

## 分析: 日本企業では「職種別」より「業務とデータ別」に配る

ここからは公式仕様を踏まえた分析である。

role単位のInstalledは便利だが、日本企業で「営業なら全員同じplugin」とすると範囲が広すぎることがある。同じ営業でも、新規開拓、既存顧客、公共、金融、海外、代理店で扱うデータと許されるactionが違う。組織図上の職種だけでなく、業務、データ分類、接続先、操作の組み合わせで配布単位を決めるべきだ。

最初にplugin inventoryを作る。plugin名、owner、対象業務、skills、required/optional apps、app template、read action、write action、sync、source system、data class、対象role、installation policy、更新元、最終review日を記録する。pluginの一覧だけでなく、app依存関係まで1行で追える形にする。

次に、`Installed`の条件を明文化する。全対象者が日常的に使う、業務ownerがいる、required appsが承認済み、read/write境界が定義済み、support窓口がある、停止手順を試した、という条件を満たすものだけに限定する。PoCや一部の専門職向けは`Available`、未審査は無効という三段階にすると説明しやすい。

[ChatGPT SitesのBusiness RBAC](/blog/openai-chatgpt-sites-business-rbac-2026/)で見たように、生成物をworkspaceへ公開する機能では、作る人、見る人、止める人を分ける必要がある。Pluginsでも、導入を決める管理者、appを管理するSaaS owner、業務上の利用を承認するdepartment owner、security reviewを行う担当を分けたほうがよい。

## 分析: 導入・更新・停止を一つの運用にする

導入時は、管理者がManage pluginで構成要素を確認し、required appとoptional appを分ける。app templateがあればdraftの認証設定、callback、MCP server、公開actionを確認する。test userを1人または少人数に限定し、低リスクなread-only promptから試す。想定外のdata sourceやactionが見えないかを確認してからroleを広げる。

更新時は、marketplace由来pluginのRefreshを自動的なroutineにしない。skills、app依存、actionが変われば、同じplugin名でもリスクは変わる。更新前後のversionまたは取得日時、含まれるapps、追加actionを差分化し、write actionが増えた場合は再承認する。少なくとも高リスクpluginは四半期ごとにaccess、action control、sync、support issue、analytics、complianceを見直す。

停止時は、pluginをdisableするだけで完了と考えない。OpenAIのFAQでは、appを無効にしてもskillsやworkflow guidanceが残り、pluginがCodexの`@` mentionに見え続ける場合がある。また、source system側のOAuth tokenや同期済みデータ、custom MCP serverのcredentialは別途扱う必要がある。plugin、app、source connection、token、sync、利用者への周知を停止checklistに含めるべきだ。

[Codexプラグインのプラットフォーム構造](/blog/openai-codex-plugins-platform-strategy-2026/)が示した通り、pluginは単一のプロンプトではなく、skills、MCP設定、appsをまとめる配布単位になり得る。だからこそincident responseでは、plugin名から依存appと接続先を逆引きできるinventoryが必要になる。

## 管理者向けの初期チェックリスト

最初の1週間で、workspaceに見えるpluginsを一覧化し、各pluginのstatusとinstallation policyを取得する。既定で利用可能なpluginも「誰かが明示的に承認した」とは限らないため、required appsとwrite actionを確認する。

次の2週間で、対象roleを3群に分ける。全社標準にする`Installed`、利用者が選べる`Available`、未審査または不要な無効対象である。標準化するpluginは1職種1〜3個程度から始め、利用目的と問い合わせ先を社内ポータルへ記載する。

その後30日間、利用数だけでなく、setup failure、permission error、想定外action、support問い合わせ、業務時間短縮、成果物の再修正を記録する。利用されないpluginを既定導入のまま残さず、必要なpluginでもapp設定が原因で失敗しているなら権限や手順を修正する。

## まとめ

ChatGPT BusinessのPlugins管理画面は、Codex pluginを個人の追加機能から、workspaceで配布・統制する業務パッケージへ変える更新である。管理者はstatusやcatalogを検索し、roleごとに`Available`または`Installed`を設定し、pluginが依存するappsを確認できる。

ただし、pluginを配っただけでは安全な業務利用にならない。plugin、app、source systemの三層で権限を確認し、read-onlyのpilotから始め、更新時の差分審査と停止時のtoken・sync処理まで決める必要がある。日本企業の最初の対応は、全pluginの一括配布ではなく、業務ownerとdata ownerが決まった少数のpluginを役割別に標準化することである。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654) - OpenAI Help Center, 2026-06-26
- [Plugins in Codex](https://help.openai.com/en/articles/20001256-plugins-in-codex) - OpenAI Help Center
- [Build plugins – Codex](https://developers.openai.com/codex/plugins/build) - OpenAI Developers
