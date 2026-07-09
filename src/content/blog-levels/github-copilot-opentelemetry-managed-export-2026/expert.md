---
article: 'github-copilot-opentelemetry-managed-export-2026'
level: 'expert'
---

GitHub Copilotのenterprise-managed OpenTelemetry exportは、AIコーディングを「個人のIDE利用」から「企業の観測対象」に移す更新である。2026年7月8日のGitHub Changelogは、GitHub Copilotが送るOTel dataの送信先を組織が指定でき、設定はenterprise-managed settingsの`telemetry` blockで配信されると説明している。対象はVS CodeのCopilot Chat extensionと、Copilot CLIを支えるagent host processである。

この更新は、[GitHub Copilot MDM設定、端末統制を標準化](/blog/github-copilot-mdm-managed-settings-2026/)の続きとして読むべきだ。MDM記事で扱ったのは、Native MDM、server-managed、file-basedの3経路でCopilotのmanaged settingsを配る仕組みだった。今回のOpenTelemetry exportは、その設定経路を使って、agent runtimeの観測データを承認済みcollectorへ送る話である。

日本企業の導入論点は、単に「Copilotのログが取れる」では足りない。どのログが端末側で、どのログがGitHub側で、どのログがprovider側で、どのログがCI側なのかを分ける必要がある。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)はGitHub側のactivity recordに近い。一方、今回のOTel exportは、VS CodeとCLIの実行面、tool呼び出し、遅延、失敗、policy適用の確認に使うべきである。

## 事実整理: telemetry blockで管理できる項目

VS Code DocsのAI settingsでは、Copilot managed settingsがVS CodeとGitHub Copilot CLIへ同じ構成を適用する中央管理レイヤーとして説明されている。通常のVS Code enterprise policyとは別に、Copilot固有のdelivery channelとconfiguration shapeを持つ。ここに`telemetry.*`が追加され、OpenTelemetry export configurationへ対応する。

管理対象は少なくとも次の項目である。`telemetry.enabled`はCopilot OTel exportの有効化、`telemetry.endpoint`はOTLP collector endpoint、`telemetry.protocol`はOTLP transport、`telemetry.captureContent`はprompt、response、tool contentを含めるかどうか、`telemetry.lockCaptureContent`はその値をユーザーが変えられないようにする設定である。さらに、`telemetry.serviceName`、`telemetry.resourceAttributes`、`telemetry.headers`もある。

GitHub Changelogは、管理者がOTLP export endpoint、protocol、OTel service name、resource attributes、exporter headers、prompt・response・tool contentのcapture可否を制御できると説明している。これは、OpenTelemetryを単にdebug用に出すのではなく、企業の監査・運用基盤へ接続する前提の設計である。

解決順序も重要だ。VS Code Docsでは、resolved valueはpolicy、environment variable、user setting、defaultの順で決まるとされ、managed valueが常に勝つ。つまり、ユーザーが`OTEL_*`環境変数を設定していても、会社のpolicyがあればそちらが優先される。端末標準として監査方針を固定したい企業には、この挙動が中核になる。

## header secretの扱いは事故防止に効く

OpenTelemetry collectorへ送るには、collector側の認証headerが必要になることがある。GitHubの発表とVS Code Docsは、managed exporter headersがCopilot Chat extensionのOTLP exporterにだけ適用され、環境変数としてtool subprocessへ渡されないと説明している。これは細かいが重要な制約だ。

AI agentはtool subprocessを起動する。terminal command、package manager、test runner、MCP server、local scriptが同じsessionの中で動く。もしcollector認証tokenが環境変数として広く渡れば、agentが起動したsubprocessから読めてしまう可能性がある。監査用secretが、監査対象の実行環境へ漏れるのは避けなければならない。

一方で、この制約は運用上の注意も生む。managed headersはagent host processへは渡らないと説明されているため、Chat extensionとagent hostで完全に同じheader処理を期待して設計するとずれる可能性がある。導入時には、どのsurfaceからどのspanやlogが届くのか、collector側で必ず実測する必要がある。

また、agent hostは起動時にtelemetry configurationを計算する。managed telemetry valueを変えた後に、既存のagent hostへ即時反映されるとは限らない。VS Code reloadが必要になる点も、MDM配布やincident時の切り戻しrunbookに入れておくべきだ。

## metadata-firstの監査設計

ここからは実務設計である。

AIエージェント監査で最初に避けたいのは、全文保存を標準にしてしまうことだ。prompt、response、tool contentには、社内コード、顧客名、設計中の機能、障害情報、セキュリティ調査、個人情報、委託先情報が混ざる可能性がある。便利だから保存する、ではリスク説明にならない。

初期設計はmetadata-firstにする。`service.name`、team、repository、repository classification、environment、device class、managed channel、client surface、client version、GitHub account type、model、tool name、status、duration、error class、retry count、trace idを先にそろえる。本文を保存しなくても、どの部門で、どのrepositoryで、どのtoolが、どれだけ失敗したかは追える。

この設計は、[Copilot使用指標補正、7月レポート比較の注意点](/blog/github-copilot-usage-metrics-accuracy-2026/)で扱ったusage metricsと補完関係にある。usage metricsは集計済みの利用傾向やAI Creditsの分析に向く。OpenTelemetryは、session単位、tool単位、latency単位の原因調査に向く。月次の経営報告とincident responseのデータを混同しない方がよい。

本文保存が必要になる場面もある。たとえば、高リスクrepositoryでのagent実行、重大incidentの再現調査、セキュリティ検証teamのcontrolled environment、委託先作業の証跡、規制業務の監査対応などである。ただし、この場合も全社常時onではなく、対象repository、対象team、保存期間、masking、閲覧者、エクスポート禁止、削除手順を決めるべきだ。

## collectorとSIEMの接続で見るべき指標

OpenTelemetry collectorへ流した後、どこへ渡すかが実務上の本番である。Datadog、New Relic、Grafana、Elastic、Splunk、Sentinel、Chronicle、社内SIEM、data lakeなど選択肢は多い。重要なのは、AI agentだけ別の孤立したdashboardにしないことだ。

見るべき初期指標は、session count、error rate、tool failure rate、latency percentile、agent host restart、client version分布、captureContent状態、unknown repository、unmanaged channel、collector export errorである。これらは、AIの賢さではなく、運用品質を示す。

特に日本企業では、委託先、子会社、海外拠点、VDI、開発用Mac、Windows端末、Linux workstationが混ざる。Managed settingsのchannelもNative MDM、server-managed、file-basedに分かれる。resource attributesにmanaged channelを入れておかないと、同じ設定を配ったつもりでも、実際にはどの経路で効いているかを追えない。

さらに、GitHub側のpolicyや費用データと突き合わせる必要がある。CopilotのAI Credits、usage metrics、GitHub audit log、organization policy、agent session record、MDM配布ログ、EDR alert、proxy logが別々に存在する。OpenTelemetryはその一部であって、単独の真実ではない。

## SDKと内製agentにも同じ考え方を広げる

[Copilot SDKの公開プレビュー](/blog/github-copilot-sdk-public-preview-2026/)では、W3C trace contextやOpenTelemetry連携が実務上の見どころだった。内製agentや社内toolからCopilot SDKを使う場合、VS CodeやCLIだけでなく、アプリケーション側のtraceとも接続できる。

これは、CopilotをSaaSとして見るか、社内開発基盤として見るかの分岐点である。SaaSとして見るだけなら、管理画面の利用者数、AI Credits、policyを確認すればよい。開発基盤として見るなら、IDE、CLI、SDK、CI、MCP、gateway、SIEMを同じtrace設計に寄せる必要がある。

たとえば、社内のbug fix agentがCopilot SDKを使い、GitHub issueを読み、repositoryを変更し、CIを走らせ、PRを作るとする。このとき、user-facing session、SDK request、tool execution、CI job、GitHub eventをtrace idでつなげられれば、遅延や失敗の原因がかなり見えやすい。逆に、各面が別ログなら、AIが遅いのか、checkoutが遅いのか、テストが flaky なのか、provider rate limitなのかを切り分けにくい。

今回のenterprise-managed OTel exportは、VS CodeとCLIから始まるが、設計思想はSDKや内製agentにも波及する。日本企業でAI基盤チームを作るなら、Copilot標準端末のOTel設計と、内製agentのOTel設計を別物にしない方がよい。

## 導入チェックリスト

最初に、送信先collectorを決める。検証用、本番用、incident用を分けるか、同じcollectorでresource attributeにより分けるかを決める。collectorが落ちたときにCopilot利用を止めるのか、best effortで続けるのかも決める。

次に、captureContentの原則を決める。標準はoff、検証環境だけon、incident時だけ期限付きon、という段階設計が現実的である。`telemetry.lockCaptureContent`を使うなら、ユーザーが変更できない理由を利用者向けに説明する。

三つ目に、resource attributesを標準化する。team、department、repository classification、environment、device ownership、managed settings channel、client surface、client versionを最低限そろえる。個人名やメールアドレスをattributeに入れる場合は、保持期間と閲覧権限を明確にする。

四つ目に、policy diagnosticsを運用に入れる。VS Code Docsは、Developer: Policy Diagnosticsで適用値とactive channelを確認できると説明している。問い合わせ時に、利用者へ「設定画面を見てください」ではなく、diagnostics出力で確認する手順を用意する。

五つ目に、既存のCopilotガバナンスと接続する。モデル既定、permission bypass禁止、plugin allowlist、strict marketplace、network filtering、MCP access、code review policy、usage metrics、AI Creditsを同じ運用台帳に置く。OpenTelemetryだけ先行すると、ログはあるが制御と費用が別管理になる。

## 失敗しやすい運用

失敗パターンの一つ目は、全社でcontent captureをonにすることだ。監査目的でも、本文ログは強いデータである。保存対象、保持期間、閲覧者、削除請求、委託先契約、越境移転、顧客契約との整合を確認せずに有効化すると、ログ基盤そのものがリスクになる。

二つ目は、collectorをセキュリティ部門だけで持つことだ。AI agentのログは、開発生産性、テスト失敗、CLI不具合、model latency、費用異常にも関係する。セキュリティ部門だけが見える場所に置くと、開発基盤チームが改善に使えない。

三つ目は、GitHub側のusage metricsとOTel traceを同じ意味に扱うことだ。usage metricsは集計済みで、scope、確定タイミング、請求との差分を理解して読む必要がある。OTel traceは個別sessionの運用観測である。月次KPIとincident調査を同じ表に押し込むと、判断を誤る。

四つ目は、MDM配布だけで反映確認を終えることだ。MDMが配布成功を示しても、VS Code version、Copilot extension、agent hostの起動タイミング、server-managed設定とのprecedence、file ownershipで実効値が変わる。collector側の受信、policy diagnostics、実際のsession traceを3点で確認したい。

## まとめ

GitHub Copilotのenterprise-managed OpenTelemetry exportは、AIエージェントを通常の開発基盤と同じ監視・監査の言語へ寄せる更新である。管理者は、VS CodeとCopilot CLIのOTel送信先、protocol、service name、resource attributes、headers、content captureをmanaged settingsで制御できる。

日本企業が最初にやるべきことは、全文ログの保存ではない。metadata-firstで、team、repository、environment、tool、status、duration、client version、managed channelをそろえることだ。その上で、必要な場面だけcontent captureを限定的に有効化する。

Copilotの導入が広がるほど、運用の中心は「誰が使っているか」から「どの権限で、どの作業を、どのログと費用で説明できるか」へ移る。OpenTelemetry exportは、その説明責任を既存のobservabilityとSIEMへ接続するための部品として扱うべきである。

## 出典

- [Enterprise-managed OpenTelemetry export for VS Code and CLI](https://github.blog/changelog/2026-07-08-enterprise-managed-opentelemetry-export-for-vs-code-and-cli/) - GitHub Changelog, 2026-07-08
- [Manage AI settings in enterprise environments](https://code.visualstudio.com/docs/enterprise/ai-settings) - Visual Studio Code Docs, accessed 2026-07-09
- [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/) - GitHub Changelog, 2026-07-08
- [OpenTelemetry instrumentation for Copilot SDK](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-sdk/observability/opentelemetry) - GitHub Docs, accessed 2026-07-09
