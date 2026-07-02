---
title: 'GitHub Copilotセッション監査API、EMU企業の導入設計'
description: 'GitHub Copilotのセッション監査APIとストリーミング公開プレビューを解説。日本企業がプロンプトや応答、tool callを安全に記録し、SIEM連携、保存期間、アクセス権限を設計する要点を整理する。'
pubDate: '2026-07-03'
category: 'news'
tags: ['GitHub Copilot', '監査ログ', 'AIガバナンス', '情シス', 'セキュリティ', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月2日**、GitHub Copilotのagent session dataを企業が取得できる**Copilot agent session streaming**を公開プレビューとして発表した。対象企業は、cloud agent、Copilot CLI、Visual Studio Code、Visual Studio、JetBrainsやEclipseなどの対応IDEをまたいで、prompt、response、tool callを含むsession activityを監査できる。取得方法は、継続的なストリーミングと、直近48時間を取得するREST APIの2つだ。

これまでのCopilot管理では、利用人数、採用率、機能別の利用量などを集計して見る方法が中心だった。[Copilotチーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)も、組織やteam単位の利用傾向と予算判断には有効だ。しかし、インシデント時に「どのpromptが送られ、どのresponseが返り、どのtoolが呼ばれたか」を追う用途とは粒度が違う。今回の更新は、Copilotを利用状況の集計対象から、session単位で調査できる企業システムへ近づける。

日本企業には二つの意味がある。第一に、AI coding agentの監査可能性が上がる。第二に、会話本文やコード断片を含み得る高機微データを新たに保有する責任が生まれる。監査ログを増やせば安全になるとは限らない。取得対象、保存期間、閲覧者、マスキング、従業員への説明を同時に設計する必要がある。

## 事実: Copilotの主要クライアントを横断してsessionを記録

GitHub Changelogによると、対象はGitHub Enterprise Cloudのうち**Enterprise Managed Users（EMU）**を利用する企業だ。通常の個人アカウントをenterpriseへ参加させる構成すべてに、そのまま提供されるわけではない。GitHub Enterprise Cloud with data residencyのcloud agentも対象に含まれる。

記録対象となるclientは広い。github.com上で動くcloud agent、Copilot CLI、VS Code、Visual Studio、JetBrainsやEclipseなどのpartner IDEが挙げられている。つまり、IDEだけを監査してCLIやcloud agentを見落とす状態を減らし、企業が費用を負担するCopilot licenseの利用を横断的に確認できる。

GitHubは可視化できる例としてprompt、response、tool callを示している。REST APIのresponse例には、`type`、`user_id`、`enterprise_id`、`github_request_id`、`endpoint`、`body`、`@timestamp`が含まれる。requestとresponseは`github_request_id`を使って対応付けられる設計だ。

ここで重要なのは、usage recordが集計metricsより詳細なことである。[cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)は、repositoryごとのMCP server、enabled tools、Actions承認、firewall設定を確認する。一方、今回のusage recordsは、設定だけでなく実際のsession activityを確認する。設定監査と実行記録を組み合わせることで、「許可されていたか」と「実際に何が起きたか」を分けて調査できる。

## 事実: ストリーミングとREST APIは用途が異なる

ストリーミングを使う場合、企業はGitHubのaudit log settingsからevent collectorまたはSIEMへの接続を設定する。GitHubはsession dataを設定先へ継続的に送る。Microsoft PurviewもCopilot agent session eventsの対応先として公開プレビューに含まれる。GitHub Docsでは、S3、Azure Blob Storage、Azure Event Hubs、Datadog、Google Cloud Storage、Splunkなどのaudit log streaming先も案内されている。

REST APIは`GET /enterprises/{enterprise}/copilot/usage-records`を使う。GitHub Changelogは、直近48時間のsession dataをオンデマンド取得できると説明している。検索には`type`、`user_id`、`created`のqualifierを使え、1ページは最大25件、cursorで前後へ移動する。新しい順または古い順も指定できる。

二つは競合する機能ではない。ストリーミングは継続保管、検知、SIEM相関に向く。REST APIは直近の事象確認、接続テスト、限定調査、stream側の欠損確認に向く。48時間を超えて調査する可能性がある企業は、REST APIだけに依存せず、必要な期間だけ自社側へ保管する設計が必要になる。

有効化にも注意がいる。Changelogでは、AI ControlsのCopilot画面で「Copilot Usage Records Streaming」と「Copilot Usage Records API」の両方を`Enable everywhere`にする手順が示されている。取得経路を作っただけではなく、enterprise policy側も有効でなければ利用できない。

## 事実: 権限とpreview制約を先に確認する

REST API endpointは公開プレビューで、仕様変更の可能性がある。利用できるのはGHECまたはGHEC with Data ResidencyのEMU enterprise ownerだ。classic personal access tokenとOAuth app tokenでは`read:enterprise` scopeが必要になる。fine-grained tokenでは、enterprise permissionの`Copilot usage records: read`または`Enterprise administration: read`が必要だ。

レスポンス本文にはpromptやresponseが入る可能性がある。権限を単なる「metrics閲覧」と同じ感覚で広く配るべきではない。集計レポートを見られる人と、session本文を見られる人は分ける必要がある。GitHub上の取得権限だけでなく、転送先のbucket、SIEM、Purview、Datadogなどの閲覧権限も同じ基準で制限しなければならない。

audit log streamingのGitHub Docsは、deliveryが**at-least-once**であり、networkやsystemの状況によりeventが重複する場合があると説明している。したがって、受信件数をそのままsession件数として集計すると二重計上し得る。`github_request_id`、event type、timestampなどを使い、受信側で冪等に処理する設計が必要だ。

また、streamには24時間ごとのhealth checkがあり、設定不備があるとenterprise ownerへ通知される。誤設定を6日以内に修正しない場合はeventがdropされ得るとDocsは説明する。接続時に一度だけ成功を確認して終わりではなく、health notificationの受信者と復旧担当を決める必要がある。

## 分析: 監査可能性と情報集中リスクが同時に増える

ここからは分析だ。

今回の機能は、AI agentの説明責任を改善する。たとえば、意図しない外部tool call、禁止データのprompt投入、異常に長いsession、危険なcommand提案が問題になったとき、管理者は利用者への聞き取りだけでなく記録を基に調査できる。repository設定については[Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)を確認し、session recordで実行を追えば、policyとactivityを突き合わせられる。

一方、session record自体が新しい情報資産になる。promptには未公開コード、顧客名、障害内容、脆弱性、認証方式、社内URLが含まれる可能性がある。responseにも入力内容の引用や推論途中の技術情報が残り得る。tool callには、どのrepository、file、serviceへアクセスしたかが表れるかもしれない。

このため、「全部保存すれば監査に強い」という判断は危険だ。保存量が増えるほど、内部不正、誤権限、SIEM側の侵害、目的外利用の影響も増える。監査目的に必要な期間を決め、長期保存が必要なeventと短期で削除する本文を分けるほうがよい。可能なら、session metadataと本文を別のaccess tierへ置く。

日本では、従業員モニタリングとしての説明も重要になる。企業が業務端末上のAI会話を取得できること、目的、閲覧できる部門、保存期間、インシデント調査時の利用方法を就業規則、情報セキュリティ規程、Copilot利用ガイドへ反映する必要がある。法的判断は各社の法務・労務へ委ねるべきだが、技術部門が「ログだから既存規程の範囲」と決めつけるべきではない。

## 日本企業が先に決める5つの運用ルール

第一に、**取得目的**を限定する。セキュリティ調査、コンプライアンス確認、品質事故の原因分析、禁止tool利用の検知など、使う目的を列挙する。人事評価や開発者の常時監視へ無制限に転用しない境界も書く。

第二に、**閲覧権限**を分ける。集計metricsはFinOpsやCopilot program ownerが見られても、prompt本文はCSIRTや限定された監査担当だけにする方法がある。通常運用ではmetadataのみを表示し、承認されたincident ticketがある場合だけ本文へアクセスする二段階構成が現実的だ。

第三に、**保存期間**を決める。REST APIの直近48時間は、短期調査の基準になる。stream側では、本文を30日、metadataを90日、重大incidentに関連するrecordだけcase managementへ移して規程期間保存する、といった分離が考えられる。期間は業法、契約、社内規程に合わせる。

第四に、**マスキングと検知**を設計する。token、password、個人情報、顧客識別子を受信後に検出し、閲覧用indexではマスキングする。原本が必要なら暗号化した隔離領域へ置き、通常検索から外す。秘密情報が見つかった場合は、ログ削除だけでなくcredential rotationと入力元の修正へつなげる。

第五に、**通知と復旧**を決める。stream health checkの通知先、欠損時にREST APIで補完できる範囲、重複eventの排除、schema変更の検知、preview終了時の移行担当をrunbookへ入れる。公開プレビューではfield追加や意味変更を前提に、strict schemaで全処理を停止させないほうがよい。

## 30日で始める限定導入

最初の1週間は、AI Controlsのpolicyと対象enterpriseを確認する。EMUが前提であること、data residency構成、enterprise owner、tokenまたはGitHub Appのpermissionを整理する。同時に、[CopilotのデータレジデンシーとFedRAMP対応](/blog/github-copilot-data-residency-fedramp-2026/)で扱った推論地域と、session logの転送・保存地域を別々に確認する。推論が指定地域でも、転送先を別地域に置けば社内のdata residency方針とずれる可能性がある。

2週目は、少数の検証ユーザーと非機密repositoryに限定してAPIを有効化する。requestとresponseの対応、tool callの見え方、48時間の取得範囲、pagination、filterを確認する。実データを見てから、どのfieldをSIEMへindexし、どのbodyを隔離するか決める。

3週目は、streaming先を1つ設定する。受信eventに一意性を持たせ、重複を排除し、欠損と遅延を観測する。想定外の秘密情報を検出したときのalertを作る。ただし、最初から全promptへ大量の検知ruleを当てると誤検知が増えるため、credential形式、社内機密ラベル、禁止domainなど高確度の条件から始める。

4週目は、incident drillを行う。検証ユーザーが意図的に禁止済みのダミーtokenをpromptへ入れ、tool callを発生させ、CSIRTがeventを検索し、requestとresponseを関連付け、credential rotation相当の模擬対応まで進める。最後に、誰が本文を閲覧したか、削除期限が設定されたか、従業員向け説明が十分かをレビューする。

## まとめ

GitHub Copilot agent session streamingの公開プレビューにより、EMUを使うGitHub Enterprise Cloud企業は、cloud agent、CLI、主要IDEをまたぐprompt、response、tool callを監査できるようになった。継続転送にはstreaming、直近48時間の調査にはREST APIを使える。

実務上の価値は、集計metricsでは見えなかったsession単位の調査が可能になることだ。ただし、session本文は監査ログであると同時に、コード、個人情報、顧客情報を含み得る高機微データでもある。取得を有効化する前に、目的、権限、保存期間、マスキング、従業員説明を決めなければならない。

日本企業は、まず少数ユーザーと非機密repositoryでAPIの実データを確認し、metadataと本文を分離したうえでSIEMへ接続するのがよい。監査範囲を広げることと、ログ自体のリスクを抑えることを同じ導入計画で扱う必要がある。

## 出典

- [Copilot agent session streaming is now in public preview](https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/) - GitHub Changelog, 2026-07-02
- [Get Copilot usage records for an enterprise](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10#get-copilot-usage-records-for-an-enterprise) - GitHub Docs
- [Streaming the audit log for your enterprise](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) - GitHub Docs
