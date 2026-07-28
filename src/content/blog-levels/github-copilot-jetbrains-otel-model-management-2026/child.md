---
article: 'github-copilot-jetbrains-otel-model-management-2026'
level: 'child'
---

GitHubは2026年7月27日、GitHub Copilot for JetBrains IDEsにOpenTelemetry設定とモデル管理の改善を追加した。JetBrains IDEを使う開発者は、agent workflowのOpenTelemetry export、BYOK/custom endpointのtoken上限、built-in modelの有効・無効、Claude agent flowsでのMCP servers/custom agentsを扱いやすくなる。

これは、IntelliJ IDEAやPyCharmを使う人向けの小さなUI改善ではない。会社でJetBrains IDEを標準にしている場合、AIのログ、モデル、費用、agent拡張をどう管理するかに関わる。

## 何が追加されたのか

1つ目はOpenTelemetry exportの設定だ。agent workflowの動きを組織のobservability要件に合わせて出力しやすくなる。以前の[GitHub Copilot OTel管理、監査ログを標準化](/blog/github-copilot-opentelemetry-managed-export-2026/)ではVS CodeとCLIが中心だったが、今回はJetBrains plugin側の実務に近い。

2つ目はモデル管理だ。BYOKやcustom endpoint向けに、`maxInputToken`と`maxOutputToken`の既定値を設定できる。さらにbuilt-in Copilot modelsをまとめて有効・無効にできる。これは、好きなモデルを自由に選ぶためだけではなく、費用とモデルガバナンスを揃えるための機能である。

## MCPやcustom agentsも入った

今回の更新では、Claude agent flowsでMCP serversとcustom agentsを直接使えるようになった。これは[Copilot JetBrains版、Claude Agent統合の実務](/blog/github-copilot-jetbrains-claude-provider-2026/)の延長として読める。

MCP serverは、社内ツールや外部サービスにつながる入口になり得る。custom agentは、特定チームの作業手順や指示をまとめる仕組みになる。便利だが、誰が許可し、どのrepositoryで使ってよいかを決めなければならない。

## 費用管理で見るポイント

GitHubは、user-level budgetが設定されていないenterprise usersにも、消費したAI credits数を表示すると説明している。利用者が消費を見られることは、費用管理の第一歩になる。

これは[Copilot JetBrains BYOK、社内モデル運用の分岐点](/blog/github-copilot-jetbrains-byok-sandbox-2026/)ともつながる。BYOKやcustom endpointを使うと、GitHub Copilotの費用だけでなく、外部providerや社内gatewayの費用も見る必要がある。token上限を決めないと、長いcontextや大きなoutputで費用が膨らみやすい。

## どう導入するべきか

最初は対象を絞るのがよい。IntelliJ IDEAだけ、開発基盤チームだけ、検証repositoryだけ、という形で始める。全社のJetBrains pluginを一気に更新してから設定を考えると、問い合わせが増える。

次に、OpenTelemetryの送信先を決める。どのcollectorやSIEMへ送るか、本文を保存するか、metadataだけにするかを決める。本文にはコードや顧客情報が混ざる可能性があるため、最初はmetadata中心が現実的だ。

最後に、モデルとagentの台帳を作る。使えるbuilt-in models、BYOK endpoint、MCP servers、custom agents、CLI session機能を並べ、誰が使えるか、どの作業に使うか、費用をどこで見るかを書く。

## まとめ

GitHub Copilot for JetBrainsの今回の更新は、監査、モデル管理、MCP/custom agents、CLI session改善をまとめたものだ。日本の開発チームでは、JetBrains IDEをAI開発基盤として扱うなら、ログ、モデル、費用、agent権限を同じ設定台帳で管理したい。

## 出典

- [GitHub Copilot for JetBrains adds improved OpenTelemetry configuration and model management](https://github.blog/changelog/2026-07-27-github-copilot-for-jetbrains-adds-improvved-opentelemetry-configuration-and-model-management/) - GitHub Changelog, 2026-07-27
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs, accessed 2026-07-29
- [Bring your own key for GitHub Copilot](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key) - GitHub Docs, accessed 2026-07-29
