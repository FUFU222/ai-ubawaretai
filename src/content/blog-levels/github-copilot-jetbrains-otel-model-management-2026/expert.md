---
article: 'github-copilot-jetbrains-otel-model-management-2026'
level: 'expert'
---

GitHubが2026年7月27日に発表したGitHub Copilot for JetBrains IDEsの更新は、JetBrains pluginの体験改善に見えるが、企業導入ではかなり広い意味を持つ。OpenTelemetry export settings、BYOK/custom endpoints向けの`maxInputToken`と`maxOutputToken`、built-in Copilot modelsの有効・無効制御、Claude agent flowsでのMCP servers/custom agents、Copilot CLI sessionのforks、`/rubber-duck`、作業リスト表示、AI credits消費表示が同時に入ったからだ。

この組み合わせは、JetBrains IDEを標準環境にしている日本企業にとって、AI codingを「便利なplugin」から「IDE内の統制対象」に変える。IntelliJ IDEA、PyCharm、WebStorm、Android Studioなどは、端末標準、社内proxy、証明書、formatter、静的解析、ライセンス、JDK、SDK、CIと一緒に管理されることが多い。そこへAI agent workflow、MCP、custom agents、BYOK endpoint、OpenTelemetryが入るなら、通常のIDE管理と同じ厳しさで扱う必要がある。

今回の読み方は、既存の3つの記事と接続すると分かりやすい。[GitHub Copilot OTel管理、監査ログを標準化](/blog/github-copilot-opentelemetry-managed-export-2026/)はVS CodeとCopilot CLIのOpenTelemetry exportを扱った。[Copilot JetBrains BYOK、社内モデル運用の分岐点](/blog/github-copilot-jetbrains-byok-sandbox-2026/)はJetBrains版のBYOK custom endpoint、plugin、local sandboxを扱った。[Copilot JetBrains版、Claude Agent統合の実務](/blog/github-copilot-jetbrains-claude-provider-2026/)はClaude agent providerと権限境界を扱った。7月27日の更新は、この3領域をJetBrains pluginの実務画面に近づけたものだ。

## 公式情報で確認できる新しい管理面

GitHub Changelogで確認できる第一の更新は、OpenTelemetry export for agent workflowsである。JetBrains pluginのSettings > Tools > GitHub Copilot > Chatから設定でき、agent workflowのobservabilityを組織要件に合わせやすくする。これは、AI agentの作業を通常のアプリケーション運用に近い形で観測するための入口である。

第二の更新は、model behaviorの制御である。BYOKとcustom endpoints向けにdefault token limitsを設定でき、`maxInputToken`と`maxOutputToken`を扱える。さらにmodel-management controlsでbuilt-in Copilot modelsをdisableまたはenableできる。これは、モデル選択を利用者任せにしないための更新であり、費用、データ分類、作業種別、サポート境界を管理者が決める余地を広げる。

第三の更新は、Claude agent flowsでMCP serversとcustom agentsを直接使えるようになった点である。GitHubは、specialized tools、custom instructions、team-specific workflowsが必要なときに柔軟性が増すと説明している。これは便利だが、MCP serverやcustom agentは実行権限の束である。接続先、tool、prompt、credential、repository accessを明確にしなければ、便利なagent workflowが監査不能な自動化になり得る。

第四の更新は、Copilot CLI sessionの改善である。forks、`/rubber-duck`、harness内の作業リスト表示が入り、作業分岐、設計相談、進捗管理がしやすくなる。JetBrains IDEからCLI sessionやagent workflowを使うチームでは、IDE内の会話、CLIの実行、agentの作業項目、PR差分がつながる。つまり、IDEとCLIを別物として監査するだけでは足りなくなる。

第五の更新は、enterprise usersへのAI credits消費表示である。organizationがuser-level budgetを設定していない場合でも、消費creditsを表示する。利用者本人に消費が見えることは、費用管理の最低限のフィードバックになる。管理者だけが月末に請求を見る運用では、現場のモデル選択やcontext量は変わりにくい。

## OpenTelemetryは全文保存ではなく説明責任の設計

JetBrains版のOpenTelemetry設定を入れるとき、最初からpromptやresponseの全文保存を目指すべきではない。コード、顧客名、障害ログ、issue本文、内部URL、credential片、個人情報が混ざる可能性がある。日本企業では、個人情報保護、顧客契約、委託先管理、社内情報区分を先に確認する必要がある。

最初に見るべきなのはmetadataである。team、repository、IDE type、plugin version、managed channel、agent workflow type、model、tool name、status、duration、error class、retry、token量、captureContent状態を追えるだけでも、運用価値は高い。どのチームで失敗が多いか、どのplugin versionで問題が起きるか、どのtoolが遅いか、どのrepository分類で高コスト作業が多いかを見られる。

また、OpenTelemetryの送信先は既存のobservability基盤に寄せるべきだ。Datadog、New Relic、Grafana、Elastic、Splunk、OpenTelemetry Collector、社内SIEMのどれを使うかは企業ごとに違う。しかし、AI専用の別ログ基盤を作ると、アプリ障害、CI失敗、GitHub audit log、端末MDM、費用管理と突き合わせにくくなる。

本文保存を検証する場合は、低機密な検証repositoryに限る。prompt、response、tool resultにどんな情報が入るかを確認し、DLP、masking、保持期間、閲覧権限、incident時の開示ルールを決める。`captureContent`を標準onにするのは、その後でよい。監査ログは多ければよいわけではなく、後から説明できる形で安全に保存できるかが重要である。

## モデル管理は費用と品質の両方を見る

JetBrains pluginでbuilt-in modelsの有効・無効制御とtoken上限を扱えることは、企業のモデル運用に効く。Copilotのモデル棚は増え続けている。OpenAI、Anthropic、Google、xAI、Microsoft系のモデルが、plan、client、policy、billingに応じて現れる。利用者がその場の印象で高性能モデルを選び続けると、費用と品質の説明が難しくなる。

`maxInputToken`は、どれだけ大きなcontextをモデルへ渡すかに関わる。長いrepository調査やmigration planningでは大きなcontextが役に立つ。一方、日常補完や短い質問では不要なcontextが費用と遅延を増やす。`maxOutputToken`も同じで、長い実装計画や設計レビューには必要だが、短い回答で十分な作業には過剰である。

BYOK/custom endpointでは、さらに責任境界が増える。GitHub-hosted modelならCopilotのAI CreditsやGitHub側のmodel policyを中心に見る。BYOKやcustom endpointなら、自社gateway、OpenAI互換API、外部provider、ローカルmodel、クラウド請求、ログ保持、障害時サポートが絡む。開発者には同じmodel pickerに見えても、管理者は請求の正本とログの正本を分けておく必要がある。

モデル管理の基本は、作業カテゴリ別に推奨を決めることだ。日常補完、短い質問、PR説明文は低コスト日常枠。複数ファイル調査、CI失敗分析、移行計画、セキュリティ調査は長文・agentic枠。検証repositoryだけBYOK/custom endpointを許す枠。こうした役割ベースにすれば、モデル名が変わっても運用を更新しやすい。

## MCP/custom agentsはIDE pluginではなく権限配布である

MCP serversとcustom agentsをClaude agent flowsで直接使えることは、JetBrains IDEのAI体験を大きく広げる。社内API、issue tracker、document repository、test runner、deployment tool、設計書検索、コード生成補助をagentから呼びやすくなる。チーム固有のworkflowをIDE内に持ち込めるのは大きな利点である。

しかし、MCP/custom agentsは単なる補助設定ではない。接続先、認証、tool引数、読み取り範囲、書き込み範囲、外部通信、ログ、更新者が絡む。特に、MCP serverが社内データにアクセスする場合、どのteamが使えるのか、委託先アカウントに出すのか、本番データに触れるのか、tool resultをOpenTelemetryに出すのかを決める必要がある。

custom agentも同様だ。agentが持つinstructionsやtoolsは、開発プロセスそのものに影響する。テストを必ず追加するagent、security reviewを優先するagent、migration planを作るagent、PR説明を書くagentでは、レビュー責任が違う。誰がagentを作り、誰が更新し、どのrepositoryで使えるかを明文化しなければならない。

JetBrains標準環境では、plugin配布とagent配布を分けて考えるべきだ。GitHub Copilot pluginを入れたからといって、すべてのMCP serversやcustom agentsを許可する必要はない。逆に、MCP/custom agentsを使わせるなら、plugin version、設定、OpenTelemetry、model policy、BYOK endpoint、sandbox、PR reviewを同じpilotで見るほうがよい。

## 30日pilotの現実的な進め方

最初の1週間は、対象を絞る。IntelliJ IDEAの特定version、GitHub Copilot pluginの特定version、会社支給端末、開発基盤チーム、低機密repositoryから始める。PyCharm、WebStorm、Android Studio、委託先端末、顧客環境は次段階にする。初期pilotで対象を広げすぎると、問題がIDE差なのか設定差なのか判断できない。

2週目は、OpenTelemetry schemaを決める。collector endpoint、protocol、service name、resource attributes、captureContent方針、team/repository分類、plugin version、IDE種別を決める。GitHub audit log、Copilot usage metrics、AI Credits、MDM配布状態と突き合わせるためのキーも揃える。

3週目は、モデルとtoken上限を決める。built-in Copilot modelsを全開放しない。標準モデル、高性能モデル、BYOK/custom endpoint、検証用モデルを分ける。`maxInputToken`と`maxOutputToken`は、日常作業、agentic作業、移行作業で別にする。高い上限を必要とする作業は、対象repositoryと利用者を限定する。

4週目は、MCP/custom agentsとCLI sessionを評価する。許可するMCP server、custom agent、Claude agent flow、forks、`/rubber-duck`、作業リストの使いどころを決める。評価指標は、作業完了率、レビュー差し戻し、意図しないtool call、CI成功率、AI Credits消費、ログ追跡性、問い合わせ件数で見る。

pilot後の判断は、全社展開だけではない。JetBrains標準チームだけ継続、BYOKは一部だけ許可、MCPは検証repositoryのみ、OpenTelemetryはmetadataだけ全社、content captureはincident時だけ、という分け方がある。AI機能は便利さが見えやすいが、統制は段階的に広げるほうが失敗しにくい。

## まとめ

GitHub Copilot for JetBrainsの7月27日更新は、OpenTelemetry export、model management、BYOK/custom endpointのtoken上限、built-in model制御、MCP/custom agents、Copilot CLI session改善、AI Credits表示をまとめて進めた。事実としてはJetBrains pluginの管理面が強化された更新である。

日本企業にとっての意味は、JetBrains IDEの中でAI codingを標準運用へ載せる準備が進んだことだ。今後は、モデルの賢さだけでなく、監査ログ、token上限、BYOK責任境界、MCP/custom agentの権限、CLI sessionの作業単位、AI Creditsの説明を同じ台帳で管理する必要がある。CopilotをIDE内AI基盤として扱うなら、今回の更新は設定・監査・費用の設計を更新するタイミングである。

## 出典

- [GitHub Copilot for JetBrains adds improved OpenTelemetry configuration and model management](https://github.blog/changelog/2026-07-27-github-copilot-for-jetbrains-adds-improvved-opentelemetry-configuration-and-model-management/) - GitHub Changelog, 2026-07-27
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs, accessed 2026-07-29
- [Bring your own key for GitHub Copilot](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key) - GitHub Docs, accessed 2026-07-29
