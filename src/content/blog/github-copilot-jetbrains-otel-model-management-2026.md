---
title: 'Copilot JetBrains監査設定、モデル管理の実務'
description: 'GitHub Copilot for JetBrainsの7月更新を整理。OpenTelemetry export、BYOK token上限、built-in model制御、MCP/custom agentsを日本企業のIDE統制と費用管理に落とし込む。'
pubDate: '2026-07-29'
category: 'news'
tags: ['GitHub Copilot', 'JetBrains', 'OpenTelemetry', '管理者設定', 'SaaSコスト管理', 'AIエージェント', '開発者ツール']
draft: false
series: 'github-copilot-2026'
---

GitHubは2026年7月27日、**GitHub Copilot for JetBrains IDEsにOpenTelemetry設定とモデル管理の改善**を追加したと発表した。今回の更新では、agent workflowsのOpenTelemetry export、BYOK/custom endpoints向けの`maxInputToken`と`maxOutputToken`、built-in Copilot modelsの有効・無効制御、Claude agent flowsでのMCP servers/custom agents利用、Copilot CLI sessionのforksや`/rubber-duck`、作業リスト表示がまとめて入っている。

これはJetBrains pluginの小さな使い勝手改善ではない。IntelliJ IDEA、PyCharm、WebStorm、Android Studioなどを標準IDEにしている日本の開発組織では、IDE内AIをどこまで監査し、どのモデルを許可し、どのagent拡張を配り、どれだけAI Creditsや外部provider費用を使わせるかという統制面に直結する。

既に[GitHub Copilot OTel管理、監査ログを標準化](/blog/github-copilot-opentelemetry-managed-export-2026/)ではVS CodeとCopilot CLIのOpenTelemetry exportを扱った。[Copilot JetBrains BYOK、社内モデル運用の分岐点](/blog/github-copilot-jetbrains-byok-sandbox-2026/)ではJetBrains版のBYOK custom endpointとlocal sandboxを扱った。今回の更新は、その2本をJetBrains pluginの実運用画面に近づけ、さらにMCP/custom agentsとCLI session改善まで同じ更新に載せた点が新しい。

## 事実: JetBrains版にOTel exportとモデル管理が追加

GitHub Changelogによると、JetBrains版Copilotではagent workflows向けのOpenTelemetry export settingsを設定できるようになった。設定場所はSettings > Tools > GitHub Copilot > Chatで、組織のobservability要件に合わせてplugin behaviorを揃えやすくするための更新として説明されている。

この点は、VS CodeとCLI向けのenterprise-managed OpenTelemetry exportとは対象面が違う。7月8日の更新は、VS Code Chat extensionとCopilot CLIのagent host processを企業側のOTLP collectorへ送る話だった。7月27日の更新は、JetBrains IDEのplugin内でagent workflowのtelemetry設定を扱いやすくする話である。日本企業では、VS Code標準チームとJetBrains標準チームが分かれていることがあるため、両方を同じ監査設計に載せる必要がある。

モデル管理も重要だ。GitHubは、BYOKとcustom endpoints向けにdefault token limitsを設定できるようになり、`maxInputToken`と`maxOutputToken`を調整できると説明している。さらに、model-management controlsからbuilt-in Copilot modelsをまとめてdisableまたはenableできる。これは、費用とモデルガバナンスをIDE側で揃えるための機能である。

BYOKやcustom endpointでは、GitHub-hosted modelだけを使う場合より責任境界が増える。自社gateway、OpenAI互換endpoint、クラウドprovider、ローカルmodelを使うと、Copilot画面では同じモデル選択に見えても、請求先、ログ、データ保持、障害時の一次担当が変わる。token上限をIDE側で調整できることは、単なる性能チューニングではなく、暴走した長文contextや不要な高額outputを抑える費用統制にもなる。

## 事実: MCP/custom agentsとCLI session改善も同時に入った

今回の更新では、Claude agent flowsでMCP serversとcustom agentsを直接使えるようになった。GitHubは、specialized tools、custom instructions、team-specific workflowsが必要なときに柔軟性が増すと説明している。これは[Copilot JetBrains版、Claude Agent統合の実務](/blog/github-copilot-jetbrains-claude-provider-2026/)で扱ったClaude agent provider previewの延長である。

ただし、MCP serversとcustom agentsは便利さだけで見ないほうがよい。MCP serverは外部tool、社内API、filesystem、issue tracker、document repositoryなどへ接続する入口になり得る。custom agentは、system prompt、tools、instructions、workflowを束ねる。JetBrains IDEの中でこれらを選べるようになるほど、誰が許可し、誰が更新し、どのrepositoryで使ってよいかを台帳化する必要がある。

Copilot CLI sessionの改善も入った。forksのサポート、`/rubber-duck` command、harness内の作業リスト表示が追加され、実装案を分解し、進捗を見ながら反復しやすくなる。これはCLI単体の更新に見えるが、JetBrains pluginからagent flowやCLI sessionを使う組織では、IDE、CLI、cloud agentの作業単位がつながるという意味を持つ。

また、enterprise users向けには、organizationがuser-level budgetを設定していない場合でも、消費したAI credits数を表示するようになったと説明されている。これは費用管理の小さな改善だが、日本企業では大きい。現場がAI Creditsを意識せずに高機能モデルや長いagent sessionを使い続けると、月次の費用説明が後追いになる。利用者に消費が見えるだけでも、無駄な長文contextや不要な高出力を避ける行動につながる。

## 分析: IDE標準化では監査・モデル・拡張を分けない

ここからは分析である。

日本企業のJetBrains利用は、個人の好みというより標準IDEとして配られることが多い。Java/Kotlin、Spring、Android、業務システム、金融・製造系の保守開発では、IDE plugin、JDK、formatter、静的解析、プロキシ、証明書、ライセンス、社内repository accessがセットで管理される。その標準IDEにAI agent機能が入るなら、監査、モデル、拡張、費用も同じ標準管理の対象にするべきだ。

OpenTelemetryは監査の入口である。どのユーザーが、どのIDEで、どのagent workflowを動かし、どこで失敗し、どのtoolが遅く、どの設定が効いているかを見られるようにする。本文やtool outputを全部保存するかどうかは別問題だ。最初はmetadata-firstで始め、必要なrepositoryだけcontent captureを検証するほうが安全である。

モデル管理は費用と品質の入口である。built-in Copilot modelsを全部開けるのか、一部だけにするのか、BYOK/custom endpointを許すのか、token上限をどこに置くのかを決める。これは開発者の好みではなく、作業種別、費用、データ分類、障害時のサポート体制で決めるべきだ。

MCP/custom agentsは実行権限の入口である。agentが読み書きできる情報、呼べるAPI、実行できるcommand、使えるtoolを増やす。モデルがどれだけ安全でも、MCP serverやcustom agentが広すぎる権限を持てば、情報漏えい、誤変更、監査不能な自動化が起きる。逆に、モデルを限定しても、承認フローとtool allowlistが整っていなければ統制は弱い。

つまり今回のJetBrains更新は、「OpenTelemetryが増えた」「モデル設定が増えた」「MCPが使えるようになった」と別々に扱うべきではない。IDE標準化の観点では、監査ログ、モデル許可、BYOK endpoint、token上限、MCP allowlist、custom agent配布、AI Credits表示を同じ台帳に並べる必要がある。

## 実務: 30日で確認する設定項目

最初の1週間は、対象IDEとplugin versionを固定する。IntelliJ IDEAだけで始めるのか、PyCharmやWebStormも含めるのか、Android Studioを対象外にするのかを決める。JetBrains pluginの更新タイミング、配布経路、社内proxy、設定同期、利用者へのリリースノートを確認する。

2週目は、OpenTelemetryの送信先と粒度を決める。既存のOTLP collector、Datadog、New Relic、Grafana、Elastic、Splunk、社内SIEMのどこへ送るかを決める。resource attributesには、team、repository classification、IDE type、plugin version、managed channel、captureContent状態を入れたい。本文保存は標準offで始め、検証repositoryだけonにするのが現実的だ。

3週目は、モデルとtoken上限を決める。built-in Copilot modelsを全許可するのか、標準モデルと高性能モデルを分けるのか、BYOK/custom endpointを誰に許すのかを整理する。`maxInputToken`と`maxOutputToken`は、長いcontextを必要とするagent作業と、日常補完・短い質問で分ける。高い上限を全員に配ると、費用とレビュー負荷が見えにくくなる。

4週目は、MCP/custom agentsとCLI sessionを小さく試す。検証用repositoryで、許可するMCP server、custom agent、Claude agent flow、CLI fork、`/rubber-duck`、作業リストの使い方を確認する。見るべき指標は、作業完了率、レビュー差し戻し、tool callの範囲、AI Credits消費、問い合わせ件数、失敗時のログ追跡である。

最後に、FAQを短く出す。利用者に必要なのは、どのモデルを選べるかの長い一覧ではない。どの作業でJetBrains版Copilotを使うか、どの作業では使わないか、モデルが見えないときの確認先、消費AI Creditsの見方、MCP/custom agentの申請方法、ログに何が残るかである。

## まとめ

GitHub Copilot for JetBrainsの7月27日更新は、OpenTelemetry export、BYOK/custom endpointのtoken上限、built-in model制御、MCP/custom agents、Copilot CLI session改善をまとめて入れた。事実としては、JetBrains pluginで監査、モデル、agent拡張、費用の表示が一段進んだ。

日本企業にとっての論点は、JetBrains IDEで新しいAI機能を使えることではない。標準IDEの中で、どのログを取り、どのモデルを許可し、どのtoken上限を置き、どのMCP/custom agentを使わせ、どの費用を誰が見るかである。CopilotをIDE内AI基盤として扱うなら、今回の更新は設定台帳を更新する合図である。

## 出典

- [GitHub Copilot for JetBrains adds improved OpenTelemetry configuration and model management](https://github.blog/changelog/2026-07-27-github-copilot-for-jetbrains-adds-improvved-opentelemetry-configuration-and-model-management/) - GitHub Changelog, 2026-07-27
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs, accessed 2026-07-29
- [Bring your own key for GitHub Copilot](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key) - GitHub Docs, accessed 2026-07-29
