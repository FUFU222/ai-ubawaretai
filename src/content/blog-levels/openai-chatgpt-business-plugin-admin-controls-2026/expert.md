---
article: 'openai-chatgpt-business-plugin-admin-controls-2026'
level: 'expert'
---

OpenAIが2026年6月26日にChatGPT Businessへ追加したPlugins管理面は、Codex pluginの配布モデルを明確にした。Workspace adminとownerは`Workspace settings > Plugins`からstatus、installation policy、roles、category、catalogを横断して検索し、eligible roleごとに`Available`または`Installed`を設定できる。pluginが依存するappsも同じ管理導線から確認できる。

企業運用で重要なのは、pluginを一つの権限単位だと思わないことだ。pluginはskills、apps、app templatesをまとめるpackageであり、実際の能力はworkspace feature access、app access、action control、接続先権限に分散する。ここでは配布、実行権限、外部接続、更新、停止を一つのcontrol modelとして整理する。

## 事実: plugin packageの構造

OpenAI Help Centerはpluginを、特定workflowに必要なcapabilityをまとめたpackageと定義している。skillsは再利用可能なinstructions、prompts、workflow patternsを提供する。appsはrepository、data warehouse、CRM、document store、messaging toolなどへ接続し、data取得やactionを提供する。app templatesは、管理者が組織固有のcredential、callback、MCP serverなどを設定し、workspace向けappを作る起点になる。

一つのpluginには複数のskillsとappsが入り得る。required appがあるpluginは、そのappが対象memberのroleへ有効な場合だけ利用可能になる。skillsのみ、またはoptional appsだけを含むpluginは別の挙動をする。したがって、plugin catalog上の「利用可能」と、workflow全体が実行可能であることは一致しない。

既存の[OpenAI Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/)は、営業、データ分析、デザイン、金融調査などのworkflow packageが増えたことを示した。今回の管理面は、そのpackageをworkspaceの標準capabilityとして誰へ配るかを決めるcontrol planeである。

## 事実: installation policyとrole assignment

Workspaceではpluginsが既定でenabledとされる一方、adminは各pluginのinstallation policyをrole単位で設定できる。`Available`はmemberが任意にinstallできる状態、`Installed`はeligible roleへdefault installする状態だ。

この2値はallow/denyの完全なaccess controlではない。pluginが表示・導入されても、required appが未設定ならworkflowは動かない。appをdisableしても、plugin内のskillやworkflow guidanceが残り、以前installされたpluginがCodexの`@` mention候補に見え続ける場合がある。UI上の存在、skillの利用、app-backed actionの利用を分けて監査する必要がある。

role modelもplan差を持つ。OpenAIの説明では、Enterprise/Edu adminsとownersはapp accessをusers、groups、rolesへ割り当てられる。Businessで利用できる管理項目とEnterprise/Eduの細かなRBACを混同しないことが重要だ。社内手順にはplan、feature rollout、対象workspaceを明記し、他planの画面を前提にしない。

`Installed`はconfiguration driftを減らす。標準plugin、support窓口、required appsを揃え、全対象者が同じstarting pointを持てる。一方、blast radiusも最大になる。write actionを含むpluginを大きなroleへInstalledにする前に、app側のaction controlとsource system側のleast privilegeを確認する必要がある。

## 事実: 三層のauthorization model

第一層はplugin distributionである。workspaceでpluginがenabledか、roleにAvailableかInstalledか、利用者がinstall済みかを持つ。ここはcapability discoveryと標準配布のcontrolである。

第二層はapp authorizationである。workspace adminはappのenabled状態、role access、read/write action、action confirmation、sync、domain restriction、source boundaryを管理する。pluginにappが含まれても、既存app settingsがそのまま適用される。pluginはapp permissionを上書きしない。

第三層はsource-system authorizationである。利用者がChatGPT/Codexでappを使えても、接続先のfile、repository、record、workspace、channelへの本人権限を持たなければ、そのresourceへアクセスできない。OAuth scopeが広くてもapplication-level ACLが狭い場合、実際の可視範囲は両者の共通部分になるべきである。

この三層に第四層としてruntime confirmationを加えると、実務モデルが完成する。write actionを許可しても、送信、更新、削除などのsensitive actionで利用者確認を要求できる。許可と確認は代替関係ではない。許可は「実行可能な集合」、確認は「その都度人間が決定するgate」である。

[ChatGPTアプリ権限の設計](/blog/openai-chatgpt-app-permissions-enterprise-2026/)で扱ったように、外部SaaS接続ではreadとwrite、searchとaction、workspace許可とprovider OAuthを分ける必要がある。Plugins管理面が加わったことで、その前段にdistribution controlが増えたと理解するとよい。

## app templateとcustom MCPの審査

App templateはready-to-use appではない。管理者が組織固有設定を入力し、draft appを作り、確認してpublishし、accessを割り当てる。templateがあるから安全性や互換性が自動的に保証されるわけではない。

Custom MCP appを含む場合、少なくともMCP serverの運営主体、hosting、authentication model、exposed tools、parameter、read/write behavior、rate limit、logging、data retention、plugin dependencyをinventoryへ入れる。tool descriptionだけで安全性を判断せず、実際のserver implementationと接続先API permissionをreviewする。

OAuth credentialやservice accountを共有する設計では、source-system側で個人ACLが保たれない可能性がある。per-user OAuthなら本人権限を引き継ぎやすいが、共通service credentialならplugin利用者全員がservice accountの範囲を使える設計になり得る。認証方式をappごとに記録し、shared identityの場合はbroker側で追加authorizationを行う。

Templateから作ったappは、draft、published、disabled、retiredのlifecycleを持たせる。owner、credential rotation日、callback URL、MCP endpoint、利用plugin、対象role、最終review日をCMDBまたはSaaS inventoryに登録する。pluginを消した後にorphan appやcredentialが残らないよう、逆参照を持つことが重要である。

## 分析: control matrixを作る

ここからは分析である。pluginごとに次のcontrol matrixを作ると、配布判断を再現可能にできる。

| 項目 | 例 |
| --- | --- |
| Business owner | 営業企画 |
| Technical owner | AI基盤チーム |
| Installation policy | Sales roleへAvailable |
| Required apps | CRM、document store |
| Optional apps | messaging |
| Source identity | per-user OAuth |
| Data class | 社内、顧客機密 |
| Actions | read、draft作成、送信なし |
| Confirmation | create/updateで必須 |
| Sync scope | 承認済みworkspaceのみ |
| Review cadence | 四半期 |
| Kill switch | plugin disable、app disable、OAuth revoke |

`Installed`のapproval criteriaには、全対象者が定常的に使うこと、business ownerとtechnical ownerがいること、required appsがproduction approvedであること、source-system ACLが確認済みであること、supportとincident responseが定義済みであることを含める。これを満たさないものはAvailableまたはdisabledに置く。

Roleの粒度が粗い場合は、plugin側だけで解決しようとしない。app accessをgroupで絞る、source system ACLを使う、別workspaceへ分ける、workflow自体をread-only版とwrite版へ分ける、といった方法を組み合わせる。distribution convenienceのためにdata boundaryを広げるべきではない。

## 分析: 安全なrollout sequence

Phase 1ではinventory onlyとする。workspaceに見えるplugin、package source、skills、required/optional apps、templates、statusを収集する。既定enabledのものもapprovedとは見なさず、ownerを割り当てる。

Phase 2ではread-only pilotを行う。対象role全体ではなく、5〜20人程度の業務代表へAvailableで配る。provider accountはtest dataまたは低機密dataから接続し、write actionを閉じる。expected prompt、expected source、expected outputを決め、permission denialも正常系としてテストする。

Phase 3では限定writeを開く。作成、更新、送信、削除を別actionとして評価し、必要なものだけ許可する。confirmation promptの内容が利用者に対象resourceと変更内容を理解させるか確認する。監査ログでactor、plugin、app、action、resource、resultを追えるかを見る。

Phase 4でInstalledを検討する。pilotの成功率、permission error、support ticket、再作業、業務時間、security exceptionを評価する。利用率だけをcriteriaにしない。高利用でも誤送信や過剰権限があれば標準化しない。

[ChatGPT SitesのBusiness RBAC](/blog/openai-chatgpt-sites-business-rbac-2026/)と同じく、作成能力と公開能力を分ける考え方が有効だ。pluginで下書きを作ることは許しても、外部送信やsystem of recordの更新は別gateにできる。workflow単位でhuman approval pointを設ける。

## 更新管理とsupply chain

Marketplace由来pluginはRefreshで元sourceの最新版を取り込める。ここを無条件の自動更新として運用すると、skills、apps、actions、MCP endpointの変化を見落とす。更新はsoftware dependencyと同様に、source、versionまたは取得commit、change summary、reviewer、rollout waveを記録する。

差分reviewでは、追加・削除されたskills、required appの変更、optionalからrequiredへの変更、新しいwrite action、domain、OAuth scope、MCP tool、data retentionを確認する。documentation差分だけでなく、可能ならpackage manifestやMCP tool schemaをmachine-readableに保存する。

[Codexプラグインのプラットフォーム構造](/blog/openai-codex-plugins-platform-strategy-2026/)が示すように、pluginはskillsとMCP設定とappsを一つにまとめ得る。これは標準化には強いが、package sourceが侵害された場合の影響も複数面へ広がる。高リスクpluginにはstaging workspaceまたはpilot roleを用意し、本番roleへ一度にRefreshしない。

## disableとincident response

Incident時のkill chainは次の順で設計する。

1. 対象pluginを新規install不可にし、必要ならdisableする
2. 依存appをdisableし、write actionを先に閉じる
3. source-system OAuth token、service credential、API keyをrevokeする
4. sync jobとindexed dataの状態を確認する
5. custom MCP serverのnetwork accessまたはdeploymentを止める
6. audit logから対象利用者、action、resource、期間を特定する
7. UIに残るskillsや`@` mention候補について利用者へ周知する

Pluginをdisableしてもskills部分が見える場合があるため、「画面から消えたか」を停止完了条件にしない。app-backed actionが失敗すること、tokenが失効したこと、server logに新規requestがないことを確認する。

また、source system側で発行済みartifactを扱う。pluginが送信したmessage、作成したrecord、更新したfileはappを止めても戻らない。action logから影響resourceを特定し、rollbackまたはowner reviewを行う。plugin lifecycleとbusiness data remediationを分けてrunbookへ書く。

## 監査指標と四半期review

運用指標はinstall数だけでは不十分である。role別のAvailable/Installed数、active user、成功action、permission denial、confirmation cancel、write action、support ticket、incident、orphan app、未owner plugin、review期限超過を追う。

Permission denialは単なる失敗ではない。source-system ACLが働いた証拠でもある。一方、同じworkflowで大量に発生するならrole assignmentまたは業務手順が不適切かもしれない。denial率をゼロにするために権限を広げず、原因別に分類する。

四半期reviewでは、business needが残るか、Installedが妥当か、required appsに変更がないか、write actionが増えていないか、source termsとdata residencyが変わっていないか、credential rotationが完了しているかを確認する。使われていないInstalled pluginはAvailableへ戻し、owner不在ならdisableする。

## まとめ

ChatGPT BusinessのPlugins管理面は、Codex pluginをrole別に発見、任意導入、既定配布するcontrol planeである。管理者は`Available`と`Installed`を使い分け、packageに含まれるskills、apps、app templatesを確認できる。

しかし、実際のauthorizationはplugin distribution、app permission、source-system ACL、runtime confirmationへ分かれる。安全な企業運用には、package inventory、read-only pilot、限定write、差分review、複数段階のkill switchが必要だ。日本企業では、職種名だけで一括配布せず、業務、データ分類、action、ownerが揃ったpluginから標準化するのが現実的である。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654) - OpenAI Help Center, 2026-06-26
- [Plugins in Codex](https://help.openai.com/en/articles/20001256-plugins-in-codex) - OpenAI Help Center
- [Build plugins – Codex](https://developers.openai.com/codex/plugins/build) - OpenAI Developers
