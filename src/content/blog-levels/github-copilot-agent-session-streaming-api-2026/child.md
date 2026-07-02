---
article: 'github-copilot-agent-session-streaming-api-2026'
level: 'child'
---

GitHubは2026年7月2日、会社がGitHub Copilotとの会話やtool利用を確認できる**agent session streaming**を公開プレビューにしました。対象企業は、Copilotへ送ったprompt、返ってきたresponse、AI agentが呼び出したtoolなどを、REST APIまたは監査ログのストリーミングで取得できます。

対象はgithub.com上のcloud agentだけではありません。Copilot CLI、Visual Studio Code、Visual Studio、JetBrainsやEclipseなどの対応IDEも含まれます。会社の開発者が複数の画面からCopilotを使っていても、session activityを横断的に調べやすくなります。

ただし、すべてのGitHub企業契約ですぐ使えるわけではありません。公開時点では、GitHub Enterprise CloudでEnterprise Managed Users（EMU）を使う企業が対象です。

## 利用人数の集計と会話記録は違う

これまでも会社は、Copilotを何人が使ったか、どの機能が利用されたかをmetricsで確認できました。[Copilotチーム別metrics API](/blog/github-copilot-team-metrics-api-2026/)は、teamごとの利用傾向を調べるための仕組みです。

今回のusage recordsは、もっと細かい記録です。たとえば、誰がどんなrequestを送り、どんなresponseを受け取ったかをsession単位で追えます。問題が起きたときに、利用者の記憶だけに頼らず、記録から原因を調べられます。

一方で、記録が細かいほど扱いは難しくなります。promptにはソースコード、顧客名、障害の内容、社内URLなどが入ることがあります。監査のために集めたログが、新しい重要情報になるということです。

## REST APIとストリーミングの違い

REST APIは、直近48時間のsession dataを必要なときに取得する方法です。endpointは`GET /enterprises/{enterprise}/copilot/usage-records`です。requestかresponseか、ユーザー、作成時刻などで絞り込めます。

これは、昨日の問題を調べる、接続テストをする、特定ユーザーの事象を確認するといった短期調査に向きます。48時間より前の記録が必要なら、APIだけでは足りません。

ストリーミングは、GitHubからSIEMやstorageへ記録を継続的に送る方法です。Microsoft Purviewのほか、GitHubのaudit log streamingではS3、Azure、Datadog、Google Cloud Storage、Splunkなどの接続先が案内されています。長期間の調査や自動alertにはこちらが向きます。

二つを組み合わせると、普段はstreamで保存し、直近の欠損確認や簡単な調査にはREST APIを使えます。

## 誰でも本文を見られる状態にしない

usage recordsには、promptやresponseの本文が含まれる可能性があります。そのため、利用人数の集計レポートと同じ権限にしてはいけません。

おすすめは、通常の担当者には日時、ユーザー、client、event typeなどのmetadataだけを見せ、本文はセキュリティ事故の調査時だけ限定担当者が見られる形です。本文へアクセスするときは、incident ticketと承認者を記録します。

保存期間も決めます。すべてを無期限に残すのではなく、本文は短く、metadataは少し長くする方法があります。重大incidentに関係する記録だけ、別のcaseへ移して必要な期間保存します。

日本企業では、従業員への説明も必要です。会社が業務用Copilotのsessionを取得すること、目的、閲覧者、保存期間を利用ガイドや情報セキュリティ規程へ書きます。監査できることと、いつでも自由に会話を読むことは同じではありません。

## 最初は小さく試す

最初に、対象がEMU enterpriseであることと、必要なpermissionを確認します。次に、少数の検証ユーザーと非機密repositoryでREST APIを試します。どの情報が`body`に入り、requestとresponseをどう結び付けられるかを見ます。

その後、streaming先を1つ設定します。GitHubのaudit log streamingは、同じeventを複数回送る場合があります。受信側は同じeventを二重に数えない仕組みを持つ必要があります。

[cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/)も合わせて使うと、「どのtoolやMCPが許可されていたか」と「実際にどんなsessionが起きたか」を分けて確認できます。

最後に、模擬incidentを行います。ダミーの秘密情報を検証promptへ入れ、検知、検索、閲覧承認、削除までを練習します。本物の事故が起きる前に、誰が何をするかを確認するためです。

## まとめ

GitHub Copilot agent session streamingは、Copilotのprompt、response、tool callを会社が監査するための機能です。REST APIは直近48時間の調査、streamingは継続保存やSIEM連携に向きます。

監査できる範囲が広がる一方で、記録にはコードや個人情報が含まれる可能性があります。会社は有効化前に、取得目的、閲覧者、保存期間、マスキング、従業員への説明を決める必要があります。まず小規模な検証で実際のdataを確認し、必要な範囲だけ段階的に広げるのが安全です。

## 出典

- [Copilot agent session streaming is now in public preview](https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/) - GitHub Changelog, 2026-07-02
- [Get Copilot usage records for an enterprise](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10#get-copilot-usage-records-for-an-enterprise) - GitHub Docs
- [Streaming the audit log for your enterprise](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise) - GitHub Docs
