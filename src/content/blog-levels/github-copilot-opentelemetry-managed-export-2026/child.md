---
article: 'github-copilot-opentelemetry-managed-export-2026'
level: 'child'
---

GitHub Copilotで、会社がOpenTelemetryの送信先を管理できるようになりました。対象はVS CodeのCopilot Chat extensionと、Copilot CLIを動かすagent host processです。つまり、AIエージェントがどのように動いたかを、会社が決めたcollectorへ送れるようになったということです。

前回の[GitHub Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)では、Copilot設定をMDMや設定ファイルで配る話をしました。今回はその中でも、監査ログや運用監視に関係するOpenTelemetryに絞った更新です。

## 何ができるようになったのか

管理者は、OpenTelemetryの送信先endpoint、protocol、service name、resource attributes、headersを設定できます。protocolはOTLP HTTPまたはOTLP gRPCです。さらに、prompt、response、tool contentのような本文に近い情報を含めるかどうかも設定できます。

これは、開発者が自分で`OTEL_*`環境変数を入れる方式とは違います。会社がmanaged settingsとして配れば、開発者ごとの設定違いを減らせます。

VS Codeのドキュメントでは、policy、environment variable、user setting、defaultの順で設定が解決されると説明されています。会社がpolicyとして配った値があれば、それが優先されます。ユーザーがローカルで違う設定をしても、標準端末では会社の設定が勝つということです。

## なぜ大事なのか

AIエージェントは、普通のコード補完よりも広い範囲で動きます。ファイルを読み、terminalを使い、browserやMCP toolを呼び、長いsessionで作業することがあります。問題が起きたときに、画面の記憶だけで説明するのは難しくなります。

OpenTelemetryを使うと、どのsessionで失敗したか、どのtoolが遅かったか、どのrepositoryで利用が増えたか、どのclient versionで問題が多いかを追いやすくなります。[Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/)のようなGitHub側の記録と合わせると、端末側とサーバー側の両方から確認できます。

ただし、ログを増やせば安全になるわけではありません。promptやresponseをそのまま保存すると、社内コード、顧客情報、未公開仕様、個人情報が入る可能性があります。最初は本文を保存せず、session ID、repository、team、model、tool、status、durationのようなメタデータ中心で始める方が安全です。

## 日本企業での使い方

まず、誰がcollectorを運用するかを決めます。開発基盤チーム、SRE、情シス、セキュリティ運用のどこが持つのかを曖昧にしないことが大切です。AIエージェントのログは、開発速度だけでなく、セキュリティ、費用、監査にも関係します。

次に、ログに入れる共通項目を決めます。team、repository、environment、device class、managed channel、client versionなどです。これがないと、ログは集まっても、どの部門で何が起きたかを後から集計できません。

3つ目に、本文保存のルールを決めます。標準では保存しない、検証用repositoryだけ保存する、incident時だけ一時的に有効にする、などの段階が現実的です。[Copilot使用指標補正](/blog/github-copilot-usage-metrics-accuracy-2026/)で見た利用レポートと違い、OpenTelemetryはより細かい運用ログです。扱いは慎重に分ける必要があります。

## まとめ

GitHub CopilotのOpenTelemetry管理は、AIエージェントを会社の開発基盤として扱うための更新です。VS CodeとCopilot CLIのtelemetryを、会社が承認したcollectorへ流せます。

日本企業は、まずmetadata-firstで始めるのがよいでしょう。本文保存は便利ですが、リスクもあります。送信先、保存範囲、閲覧権限、保持期間を決めてから使うべきです。

## 出典

- [Enterprise-managed OpenTelemetry export for VS Code and CLI](https://github.blog/changelog/2026-07-08-enterprise-managed-opentelemetry-export-for-vs-code-and-cli/) - GitHub Changelog, 2026-07-08
- [Manage AI settings in enterprise environments](https://code.visualstudio.com/docs/enterprise/ai-settings) - Visual Studio Code Docs, accessed 2026-07-09
- [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/) - GitHub Changelog, 2026-07-08
