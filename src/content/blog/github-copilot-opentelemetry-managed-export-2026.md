---
title: 'GitHub Copilot OTel管理、監査ログを標準化'
description: 'GitHub CopilotのOpenTelemetry管理を解説。日本企業がVS CodeとCopilot CLIの監査ログ、SIEM連携、本文保存の可否をどう設計すべきか整理する。'
pubDate: '2026-07-09'
category: 'news'
tags: ['GitHub Copilot', 'Copilot CLI', 'VS Code', 'OpenTelemetry', '管理者設定', 'AIガバナンス', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月8日**、GitHub CopilotのOpenTelemetry exportをenterprise-managed settingsで制御できるようにしたと発表した。対象はVS CodeのCopilot Chat extensionと、Copilot CLIを支えるagent host processである。管理者はOTLP endpoint、transport protocol、service name、resource attributes、exporter headers、prompt・response・tool contentを含めるかどうかを設定できる。

これは単なるログ出力オプションではない。前回の[GitHub Copilot MDM設定、端末統制を標準化](/blog/github-copilot-mdm-managed-settings-2026/)では、MDM、server-managed、file-basedの3経路でCopilot設定を配る話を扱った。今回の焦点は、その中の`telemetry.*`を使って、AIエージェントの観測データを会社が承認したcollectorへ流せるようになった点にある。

日本企業では、Copilot導入が「利用者数を増やす」段階から、AI agentがどの端末で、どのモデルを使い、どのtoolを呼び、どれだけ費用を使い、どの失敗で止まったかを後から説明する段階へ移っている。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のようなサーバー側記録と、端末側のOpenTelemetry exportを組み合わせることで、AIコーディングを通常の開発基盤に近い監査対象として扱いやすくなる。

## 事実: CopilotのOTel送信先を企業側が固定できる

GitHub Changelogによると、今回の更新では、Copilotが送るOpenTelemetryデータの送信先を組織が指定できる。開発者ごとに`OTEL_*`環境変数を設定させるのではなく、enterprise-managed settingsの`telemetry` blockとして配る構成だ。送信先はOTLP collectorで、protocolは`otlp-http`または`otlp-grpc`を選べる。

VS Codeの公式ドキュメントも、Copilot managed settingsを、VS CodeとGitHub Copilot CLIの両方に同じ構成を適用する中央管理レイヤーと説明している。`telemetry.enabled`、`telemetry.endpoint`、`telemetry.protocol`、`telemetry.captureContent`、`telemetry.lockCaptureContent`、`telemetry.serviceName`、`telemetry.resourceAttributes`、`telemetry.headers`が用意され、各項目はVS Code側のpolicyと`chat.agentHost.otel.*`設定に対応する。

ここで重要なのは、Copilot Chat extensionだけでなくagent host processにも関係する点だ。Copilot CLIやVS Code内のagent sessionは、単なる補完よりも長く、複数toolを呼び、terminal、browser、MCP、repository contextに触れる。したがって、従来のIDE利用ログよりも、実行単位、tool単位、session単位で追跡したい場面が増える。

今回の更新は、[GitHub Copilot使用指標補正、7月レポート比較の注意点](/blog/github-copilot-usage-metrics-accuracy-2026/)で扱ったusage metricsとは役割が違う。usage metricsは利用傾向や費用の集計に向く。一方、OpenTelemetry exportは、個別sessionの遅延、失敗、tool呼び出し、運用上の異常を調べるための観測データとして使うべきものだ。

## 事実: 管理値はユーザー設定より強い

VS Code Docsでは、OpenTelemetry関連の解決順序として、policy、environment variable、user setting、defaultの順が示されている。つまり、managed valueがあれば、それが常に勝つ。開発者がローカルで別のendpointやcapture設定を入れていても、会社が配った設定を上書きできない。

この性質は、日本企業の監査設計ではかなり重要だ。AI agentのログが個人設定に依存していると、事故調査時に「この端末だけcollectorへ送っていなかった」「この利用者だけ本文保存を有効にしていた」「退職者の環境変数が残っていた」といったばらつきが起こりやすい。managed settingsで送信先とcapture方針を固定できれば、少なくとも標準端末では同じ説明ができる。

一方で、すべてを強制すればよいわけではない。`telemetry.captureContent`は、prompt、response、tool contentを含めるかどうかに関係する。コード、issue、顧客情報、認証情報、設計文書が混ざる可能性があるため、まずはmetadata-firstで始めるのが現実的だ。本文やtool resultを保存する場合は、DLP、保持期間、閲覧権限、委託先との契約、個人情報保護法対応を先に決める必要がある。

GitHubの発表では、managed exporter headersはCopilot Chat extensionのOTLP exporterだけに適用され、環境変数としてtool subprocessへ渡されないと説明されている。認証tokenのようなheader値を、agentが起動するshell commandや外部toolへ漏らさないための設計だ。監査を強める設定そのものが新しいsecret漏えい経路にならないようにしている点は評価できる。

## 分析: AI監査は全文保存から始めない

ここからは分析だ。

AIエージェントの監査というと、会話全文、生成コード、tool resultを全部保存したくなる。しかし日本企業で最初から全文保存に寄せると、かえって導入が止まりやすい。ログに個人情報、未公開仕様、顧客コード、脆弱性情報、credential片が入る可能性があるからだ。

最初に見るべきなのは、本文ではなく実行メタデータである。たとえば、service name、team、repository、environment、client version、session id、model、tool name、status、duration、retry、error class、endpoint、policy channelをresource attributesやspan attributesで追えるようにする。これだけでも、障害調査、費用異常、未承認端末、古いclient、特定toolの失敗率はかなり見える。

この考え方は、[Copilot SDKの公開プレビュー](/blog/github-copilot-sdk-public-preview-2026/)で触れたOpenTelemetry対応とも同じ方向にある。AI agentを特別扱いし続けるのではなく、既存のobservability基盤へ載せる。Datadog、New Relic、Grafana、Elastic、Splunk、OpenTelemetry Collector、社内SIEMのどれを使うかは企業ごとに違うが、観測の言語を通常のアプリ運用に寄せる価値は大きい。

特にCopilotは、VS Code、CLI、GitHub Mobile、cloud agent、SDK、third-party agentsへ利用面が広がっている。全部を同じログで完全に追うことはできない。だからこそ、まずは「端末上のVS CodeとCLIについて、会社標準のcollectorへ送る」範囲を明確にするべきだ。端末側、GitHub側、CI側、provider側を混ぜず、どのログが何を説明するのかを分ける。

## 日本企業が先に決める4点

第一に、collectorの責任者を決める。開発基盤チームが持つのか、SREが持つのか、情シスが持つのか、セキュリティ運用が持つのかを曖昧にしない。AI agentのログは、開発効率、セキュリティ、費用、コンプライアンスにまたがるため、単一チームだけでは判断しにくい。

第二に、resource attributeの標準を決める。`service.name`だけでは足りない。最低でも、department、team、repository classification、environment、device class、managed channel、client surfaceをそろえたい。これがないと、ログは集まっても「どの部門のどの種類の作業か」を後から集計できない。

第三に、content captureの初期値を決める。標準はoff、検証用repositoryだけon、セキュリティteamだけon、incident時だけ一時的にon、というように段階を分ける。`telemetry.lockCaptureContent`でユーザー変更を止めるなら、その理由と例外申請も同時に用意する。

第四に、既存のGitHub側ログと突き合わせる。GitHub audit log、Copilot usage metrics、AI Credits、agent session API、端末MDMの配布結果、SIEM alertを同じ月次レビューで見る。OpenTelemetryだけを増やしても、請求やpolicy適用状況と結び付かなければ、実務判断に使いにくい。

## 30日以内の導入手順

最初の1週間は、対象surfaceを絞る。VS Code 1.128以降、Copilot Chat extension、Copilot CLI、会社支給端末、開発基盤チームのrepositoryだけでよい。いきなり全社端末へ配るより、collector endpoint、protocol、header、reloadの挙動、policy diagnosticsでの確認方法を試す。

2週目は、metadata schemaを決める。team、repo、environment、device、managed channel、client version、captureContentの状態をどう入れるかを決める。既存のOpenTelemetry naming conventionや社内tag規約があるなら、それに合わせる。AIだけ別の命名にすると、後でSIEMやdashboardが分裂する。

3週目は、本文保存を検証する。検証用repositoryで`captureContent`を一時的に有効にし、prompt、response、tool contentに何が入るかを見る。credentialや個人情報が混ざるなら、本文保存を標準化しない。必要な場合だけ、DLP、masking、保持期間、閲覧権限を追加する。

4週目は、runbookを作る。collector障害時にCopilotを止めるのか、best effortで続けるのか。誤ったendpointをMDMで配った場合にどう戻すのか。incident時にどのtrace id、session id、GitHub user、repository、AI Credits記録を突き合わせるのか。ここまで書いて、初めて監査ログが運用になる。

## まとめ

GitHub Copilotのenterprise-managed OpenTelemetry exportは、Copilotを企業の開発基盤として扱うための観測機能である。管理者は、VS CodeとCopilot CLIのtelemetry送信先、protocol、service name、resource attributes、headers、content captureをmanaged settingsで固定できる。

日本企業にとっての論点は、ログを増やすことではない。AI agentの活動を、既存のSIEM、observability、MDM、GitHub audit、費用管理とつなげ、事故調査と月次レビューで説明できる形にすることだ。まずはmetadata-firstで始め、本文保存は必要性、リスク、保持期間、閲覧権限を決めてから限定的に扱うべきである。

MDM配布、server-managed settings、file-based設定のどれを正とするかを決め、OpenTelemetryをその標準設定に組み込む。Copilotの便利さが増えるほど、勝負はモデル比較ではなく、権限、ログ、費用、例外運用を同じ設計図で管理できるかに移っていく。

## 出典

- [Enterprise-managed OpenTelemetry export for VS Code and CLI](https://github.blog/changelog/2026-07-08-enterprise-managed-opentelemetry-export-for-vs-code-and-cli/) - GitHub Changelog, 2026-07-08
- [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/) - GitHub Changelog, 2026-07-08
- [Manage AI settings in enterprise environments](https://code.visualstudio.com/docs/enterprise/ai-settings) - Visual Studio Code Docs, accessed 2026-07-09
- [GitHub Copilot in Visual Studio Code, June 2026 releases](https://github.blog/changelog/2026-07-08-github-copilot-in-visual-studio-code-june-2026-releases/) - GitHub Changelog, 2026-07-08
