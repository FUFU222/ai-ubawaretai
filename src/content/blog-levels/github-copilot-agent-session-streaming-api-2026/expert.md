---
article: 'github-copilot-agent-session-streaming-api-2026'
level: 'expert'
---

GitHub Copilot agent session streamingの公開プレビューは、Copilotのenterprise observabilityを集計metricsからsession telemetryへ広げる更新である。GitHub Enterprise CloudでEnterprise Managed Users（EMU）を使う企業は、cloud agent、Copilot CLI、VS Code、Visual Studio、JetBrainsやEclipseなどから集めたprompt、response、tool callを、streaming endpointまたはREST APIで取得できる。

この変更は、Copilotの採用率を測る話ではない。[Copilotチーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)が扱うのは、利用者、team、feature、modelなどの集計と配賦だ。usage recordsが扱うのは、特定sessionで何が送受信されたかという調査証跡である。目的、権限、保存期間を同じにすると、必要以上にsession本文へアクセスできる人が増える。

日本企業の導入設計では、observability pipelineだけでなく、従業員モニタリング、個人情報、顧客秘密、ソースコード、脆弱性情報の扱いまで含める必要がある。技術的に取得可能になったことと、組織として無制限に保存・検索してよいことは別問題だ。

## 事実: 対象clientとusage recordの構造

GitHub Changelogは、GHECのEMU customerが、enterprise-paid Copilot licenseで動くclient横断のagent session activityへアクセスできると説明する。対象には、github.comのcloud agent、GHE.com上のdata resident deployment、Copilot CLI、VS Code、Visual Studio、JetBrainsやEclipseなどのpartner IDEが含まれる。

REST API Docsのexample responseでは、recordに次の要素がある。

- `type`: requestまたはresponse
- `user_id`: 利用者のGitHub user ID
- `enterprise_id`: enterprise識別子
- `github_request_id`: requestとresponseの相関ID
- `endpoint`: 呼び出されたendpoint
- `body`: requestまたはresponse本文を表す文字列
- `@timestamp`: event時刻

exampleでは、request bodyにmessages、response bodyにchoicesとmessage contentが入る。実環境で常に同じschema、同じfield、同じ完全性が保証されると決めつけるべきではないが、少なくとも本文を含む高粒度recordを扱う前提が必要だ。

`github_request_id`は相関の中心になる。requestとresponseを一つのlogical exchangeとして扱い、片側だけ届いた場合や時間差がある場合を状態として持つ。tool callが別recordまたはbody内に現れる可能性を考え、固定的な二行一組ではなく、correlation IDごとのevent集合として保存するほうが変更に強い。

[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)と組み合わせると、統制の二層を作れる。configuration APIでMCP、tool、Actions approval、firewallの期待値を取得し、usage recordsで実activityを確認する。前者はcontrol plane、後者はactivity planeとして別tableに保持し、incident時にevent時点の設定snapshotを参照する設計が望ましい。

## 事実: REST APIの取得条件と検索

endpointは`GET /enterprises/{enterprise}/copilot/usage-records`で、公開プレビューとして提供される。GitHub Changelogは直近48時間のrecordをオンデマンド取得できると説明している。長期保管APIではない。

query parameterの`phrase`は、`type`、`user_id`、`created` qualifierをサポートする。`per_page`は最大25で、`after`と`before` cursorを使ってpaginationする。`order`は`asc`または`desc`で、defaultは`desc`だ。

初回backfillでは`order=asc`を使い、取得済みcursorをcheckpointとして保存する方法が考えられる。定期pollingはREST APIの主用途ではないため、長期的なcollectorにはstreamingを優先する。ただしpreview初期のschema確認、stream遅延の比較、直近incidentの限定検索にはREST APIが使いやすい。

API利用者はEMU enterprise ownerに限定される。OAuth app tokenまたはclassic personal access tokenでは`read:enterprise` scopeが必要だ。fine-grained tokenでは`Copilot usage records: read`または`Enterprise administration: read`のenterprise permissionが必要になる。後者は広い権限であるため、usage records取得だけなら専用のread permissionを選ぶべきだ。

API versionはDocsの掲載時点で`2026-03-10`が最新として示されている。clientは`Accept: application/vnd.github+json`と`X-GitHub-Api-Version`を明示し、preview中のversion更新を監視する。unknown fieldを許容しつつ、必須とみなすfieldの欠落をdead-letter queueへ送る設計が安全だ。

## 事実: streamingのdeliveryとhealth model

streamingは、GitHubのaudit log settingsからevent collectorまたはSIEMへ接続する。ChangelogはMicrosoft PurviewをCopilot agent session eventの対応先として挙げる。GitHub Docsのaudit log streamingでは、S3、Azure Blob Storage、Azure Event Hubs、Datadog、Google Cloud Storage、Splunkなども設定先として案内されている。

GitHub Docsは、streamed audit logを圧縮JSON fileとして送り、delivery semanticを**at least once**と説明している。networkまたはsystem issueにより重複eventが生じ得る。したがって、collectorはexactly onceを前提にしてはいけない。

deduplication keyは、利用できるfieldに応じて設計する。第一候補はGitHubが付与する一意event IDだが、usage record schemaで常に提供されるかはpreview環境で確認が必要だ。提供されない場合は、`github_request_id`、`type`、`@timestamp`、body hashを組み合わせたcomposite keyを作る。ただし同時刻の再送と正当な複数eventを混同しないよう、raw eventはimmutable storageへ残し、analytics layerでdedupeする。

各streamには24時間ごとのhealth checkがある。設定不備があればenterprise ownerへemailが送られ、6日以内に直さなければeventがdropされ得る。運用では、owner個人mailだけに依存せず、shared mailboxまたはon-call systemへ転送する。health failureを検知したら、stream修復、48時間以内のREST API補完、欠損範囲の記録を一つのrunbookにする。

streaming先のcredentialも管理対象になる。S3ではaccess keyまたはOIDC、AzureではSASやEvent Hubs connection string、Datadogではclient tokenまたはAPI keyを使う。長期secretを避けられる接続ではOIDCを優先し、previewやdata residencyの制約で使えない場合はrotation intervalを短くする。

## 分析: raw、normalized、searchableを分離する

ここからは分析だ。

推奨するdata flowは三層である。

1. raw zone: GitHubから受信した圧縮JSONを改変せず暗号化保存
2. normalized zone: schema version、correlation、dedupe、分類を適用
3. searchable zone: 検索に必要なmetadataとマスキング済み本文だけindex

raw zoneはincident evidenceと再処理に使う。アクセスできるのはpipeline identityと限定されたforensic担当だけにする。object lockやimmutabilityを使う場合も、個人情報の削除要求や社内retention policyと矛盾しない期間を設定する。

normalized zoneでは、requestとresponseを`github_request_id`で結び、client、user、repository、endpoint、tool、event timeを共通schemaへ写す。preview中はfield追加に耐えるため、source payloadを`extras`として保持する。parse errorは捨てず、schema versionとerror reasonを付けて隔離する。

searchable zoneには、原則として全文を無加工で入れない。SIEMのindexは閲覧者が多く、dashboard、alert、export、support accessを通じて情報が広がりやすい。user ID、client、event type、tool名、timestamp、risk label、body hashなどを主にし、本文はcredential、個人情報、顧客識別子をマスキングする。

全文が必要な調査では、search resultからraw objectへの短時間accessを申請する。incident ID、承認者、目的、期限を条件にtemporary roleを発行し、閲覧auditを残す。これにより、通常監視とforensicsを同じ権限で運用する問題を避けられる。

## 分析: 検知ruleは「悪いprompt探し」から始めない

session本文を取得すると、最初から自然言語で危険度を判定したくなる。しかし、曖昧なprompt分類は誤検知、文脈欠落、従業員監視への懸念を招きやすい。

初期ruleは高確度のtechnical indicatorへ限定する。

- secret形式や社内credential patternの入力
- 許可されていないexternal domainへのtool call
- repository policyで禁止したtoolまたはMCPの利用
- 短時間に異常に多いrequest、response、tool call
- stream health failureとAPI recordの差分
- data residency方針と異なる保存先への転送

credential patternが見つかった場合、alertを閉じるだけでは不十分だ。credential rotation、source documentの修正、利用者への通知、類似sessionの検索までplaybook化する。bodyを削除しても、すでにmodel providerやdownstream toolへ送られた可能性は別に評価する。

禁止tool検知は設定snapshotと突き合わせる。[cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)で取得したallowlistをevent timeごとにversion管理し、usage recordのtool callが当時許可されていたか確認する。現在の設定だけを見ると、incident後にpolicyが変わった場合に誤判定する。

自然言語分類を追加するなら、人事評価ではなくdata loss preventionやsecurity incidentの限定目的にし、false positive率、appeal手順、human reviewを持つ。日本語promptと英語promptで検知品質が異なるため、両方のvalidation setを用意する。

## 分析: metrics、records、billingを別data productとして扱う

Copilot管理では、usage metrics、usage records、billing/AI Creditsを一つの巨大tableにまとめたくなる。しかし、更新頻度、保持期間、閲覧者、目的が違う。

usage metricsは採用率、team比較、機能利用、効果測定に使う。usage recordsはsecurity investigation、policy violation、品質事故の調査に使う。billing recordは予算配賦とcost controlに使う。[AI Credits使用量レポート](/blog/github-copilot-ai-credits-usage-report-2026/)の閲覧者が、prompt本文まで自動的に見られる設計は避ける。

三つを結ぶ共通keyは、user、enterprise、time window、client、可能ならsessionまたはrequest IDだ。通常dashboardでは集計値だけを表示し、異常値からincident caseを作成した後にusage recordsへdrill downする。billing高騰だけを理由に本文を常時読むのではなく、異常なtool call量や再試行があるかをmetadataで確認してから詳細調査へ進む。

この分離により、FinOpsは費用を管理でき、securityはincidentを調査でき、developer productivity担当は採用を分析できる。各部門が必要以上のdataへ触れずに協業できる。

## 日本企業向けの法務・労務・privacy設計

技術実装前に、利用目的を文書化する。例として、機密情報漏えいの調査、禁止toolの検知、AI出力が関係した品質事故の原因分析、法令・契約に基づく監査がある。目的外利用を防ぐため、通常の人事評価、個人の生産性順位、発言傾向の分析には使わないなどの除外も書く。

次に、従業員へのnoticeを更新する。業務用Copilot sessionが取得される対象client、取得dataの例、保存期間、閲覧できるrole、問い合わせ先を示す。CLIやpartner IDEも対象であることを明記し、VS Codeだけの説明で終わらせない。

個人情報と顧客dataの分類も必要だ。`user_id`は個人に結び付く。prompt本文には顧客名、ticket、source code comment、test dataが含まれ得る。既存のaudit log規程を流用する場合も、本文を含む点が想定されているか見直す。

[CopilotのデータレジデンシーとFedRAMP対応](/blog/github-copilot-data-residency-fedramp-2026/)で整理した推論処理の地域と、usage recordの転送・保存地域は分けて評価する。GHE.comでdata residentな推論を使っていても、streamを別地域のSIEMへ送れば、監査dataは別の境界へ移る。subprocessor、cross-border transfer、backup regionも確認する。

保存期間はdata category別に設定する。たとえばraw本文30日、masked metadata90日、重大incident evidenceはcase retentionに従う、というように分ける。期間は例にすぎず、各社の業法、契約、労務、security policyに合わせる。削除jobが実際にraw、normalized、search index、backupへ効くかテストする。

## 実務: API collectorの最小設計

REST API collectorは、まず検証用に使う。専用GitHub Appまたはfine-grained tokenを使い、`Copilot usage records: read`だけを付与する。classic PATを個人PCのcronで動かす構成は、owner退職、scope過大、rotation漏れが起きやすい。

取得処理は次の流れにする。

1. `created` qualifierで対象時間を狭め、`order=asc`で開始
2. `per_page=25`で取得し、Link headerのcursorを保存
3. raw responseを暗号化storageへwrite
4. `github_request_id`と`type`で相関
5. bodyをclassifyし、secretと個人情報をmask
6. metadataをsearch indexへ投入
7. 件数、遅延、parse error、片側eventをmetrics化

48時間制約があるため、collector停止を長く放置できない。検証中でも少なくとも24時間ごとに取得し、失敗時alertを出す。ただし、productionの継続取得はstreamingへ移し、API collectorはbackfillと調査補助に留める。

bodyはJSON stringとして入る可能性がある。外側のrecordをparseした後、内側bodyを再parseする必要があるが、常に有効JSONとは限らない前提にする。parser errorでpipeline全体を止めず、raw body hashとerror reasonを保存する。

clock skewにも注意する。collector受信時刻ではなく`@timestamp`をevent timeとして使い、ingest timeを別fieldに持つ。遅延分布を測り、alert windowへwatermarkを設ける。再送eventはingest timeが変わってもevent keyで重複排除する。

## 実務: streaming pipelineの検証項目

streamingを有効にする前に、AI Controlsで`Copilot Usage Records Streaming`と`Copilot Usage Records API`を`Enable everywhere`にする。policy変更自体もchange ticketと承認を残す。

接続先は最初から複数にしない。primary endpointを1つ選び、100件程度の検証sessionでevent completeness、latency、duplicate rate、schema variation、body sizeを測る。GitHub Docsは複数endpointのpreview対応を案内するが、初期から二重配信すると差分の原因がGitHub側か受信側か分かりにくい。

検証すべきfailure modeは次のとおりだ。

- endpoint credential失効
- storage permission不足
- event重複
- requestのみ、responseのみの到着
- 大きなbodyのtruncateまたはparse failure
- unknown clientまたはunknown event type
- health check failure
- 48時間を超えるstream outage
- schema field追加
- user削除後のidentity解決

48時間以内のoutageならREST APIで補完できる可能性がある。補完jobは、outage開始・終了時刻を`created` qualifierへ入れ、既存eventとdedupeする。48時間を超えた場合は完全補完を保証せず、欠損期間をincident recordとして残す。

health check mailはshared operations channelへ転送する。6日という修復猶予があっても、REST API補完範囲は48時間なので、実運用の対応目標は24時間以内が妥当だ。

## 30日pilotの合格基準

pilotは機能が動いたかではなく、統制が成立したかで評価する。

技術面では、対象clientからeventが届くこと、requestとresponseを相関できること、duplicateを排除できること、stream outageを検知できること、REST APIで直近範囲を補完できることを確認する。

security面では、secret検知がrotation playbookへつながること、通常運用者がraw本文を見られないこと、temporary accessが監査されること、retention jobが期限切れdataを削除することを確認する。

組織面では、情シス、CSIRT、法務、労務、開発部門が取得目的と閲覧手順へ合意し、利用者向けnoticeが公開され、問い合わせと異議申立ての窓口があることを確認する。

運用面では、preview schema変更のowner、GitHub health notificationの受信者、token rotation担当、SIEM cost owner、incident commanderを決める。担当が決まらない項目は、全社展開前のblockerとして扱う。

pilotの対象は、非機密repository、少数team、複数clientにする。機密度を下げるだけでなく、CLI、IDE、cloud agentのevent差を確認できる構成が必要だ。成功後も一度に全社展開せず、data categoryとbusiness unitごとに段階的に広げる。

## まとめ

Copilot agent session streamingとusage records APIは、EMU企業へsession-level observabilityを提供する。REST APIは直近48時間のon-demand調査、streamingは継続的なSIEM・storage連携に向く。対象clientはcloud agent、CLI、主要IDEまで広い。

技術的な要点は、公開プレビューのschema変化、最大25件のAPI pagination、at-least-once delivery、24時間health check、request/response correlation、48時間の補完限界である。collectorはraw保存、normalization、search indexを分け、deduplicationとmaskingを前提にする必要がある。

ガバナンス上の要点は、session本文が監査証跡であると同時に高機微dataでもあることだ。集計metricsの閲覧権限を流用せず、本文へのtemporary access、短いretention、従業員notice、目的外利用の禁止を設計する。

日本企業は、設定とactivityを結ぶ監査基盤として評価しつつ、ログ集中による新しいリスクを同時に抑えるべきだ。30日pilotでは接続成功だけでなく、権限、削除、補完、incident drill、組織合意までを合格条件にする必要がある。

## 出典

- [Copilot agent session streaming is now in public preview](https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/) - GitHub Changelog, 2026-07-02
- [Get Copilot usage records for an enterprise](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10#get-copilot-usage-records-for-an-enterprise) - GitHub Docs
- [Streaming the audit log for your enterprise](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) - GitHub Docs
