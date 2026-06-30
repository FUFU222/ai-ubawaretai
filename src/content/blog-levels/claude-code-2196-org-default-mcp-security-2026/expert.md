---
article: 'claude-code-2196-org-default-mcp-security-2026'
level: 'expert'
---

Claude Code 2.1.196 は、表面的には changelog の1項目にすぎない。しかし企業導入の観点では、model governance と tool governance が同じタイミングで前に出た更新として読むべきだ。organization default models は、標準モデルを admin console 側で決めるための機能である。MCP self-approval hardening は、repository にコミットされた設定によって `.mcp.json` server が一覧確認時に動く経路を塞ぐ修正である。

この2つは別々の話に見えるが、実務ではつながっている。AI コーディングのリスクは、モデルそのものだけで決まらない。どのモデルを、どの経路で、どの repository に対して、どの tool と組み合わせ、どの権限で動かしたかで決まる。日本企業が Claude Code を標準開発基盤へ入れるなら、今回の更新は `2.1.196 に上げればよい` では終わらない。

[Claude Code Auto mode のクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) では、Bedrock、Vertex、Foundry での Auto mode がモデル選択とクラウド統制を結びつけることを整理した。今回の organization default models は、その前段にある標準化の話である。どのモデルを標準にし、どこから例外扱いにするかを明確にできなければ、Auto mode や gateway の評価も曖昧になる。

## 事実: organization default modelsは標準の起点を作る

Anthropic の Claude Code changelog では、2.1.196 の最初の項目として organization default models が挙げられている。管理者が org console で設定し、ユーザーが自分でモデルを選んでいない場合は `/model` に `Org default` または `Role default` として表示される。

この変更で重要なのは、モデル制限そのものではなく、未選択状態の意味を組織が定義できることだ。従来の運用では、開発者がいつ、なぜ、そのモデルを選んだのかが個人判断に寄りやすい。2.1.196 の機能は、少なくとも default の出発点を管理画面側へ移す。これは、費用配賦、レビュー基準、監査説明、教育資料のすべてに効く。

たとえば、日本企業の大きな開発組織では、標準モデルを1つに固定するだけでは足りない。新卒や委託先、一般開発者、セキュリティチーム、AI 推進チームで求める能力と許容リスクは違う。`Role default` という表示は、ロールごとに既定モデルを分ける運用を想定していると読める。実際にどこまで細かく分けるかは組織設計の問題だが、少なくとも `全員が各自で選ぶ` からは一歩進む。

モデル標準化は、コストだけの話ではない。高性能モデルを常に使うと費用が増える。一方、軽量モデルを標準にしすぎると、難しい変更で品質が落ちる。セキュリティレビュー、マイグレーション、障害調査、認証まわりの修正では、モデル能力不足が逆にリスクになる。だから必要なのは、安いモデルへの一律誘導ではなく、作業分類に応じた default と escalation の設計である。

## 事実: MCP self-approval hardeningは信頼境界の修正

同じ 2.1.196 で、MCP についても重要な修正が入った。changelog は、`claude mcp list` / `get` が、repo committed settings によって自己承認された `.mcp.json` server を spawn しなくなったと説明している。untrusted workspace では pending approval と表示される。

この修正は、コマンドの名前だけを見ると小さく見える。`list` や `get` は読み取りのように感じるからだ。しかし MCP server の場合、一覧や詳細確認のために server capability を調べる過程で process や remote connection が動く可能性がある。もし repository 側の設定がそれを自己承認できるなら、外部から持ち込まれた設定が実行経路になる。

[Claude Code 2.1.149/2.1.150 の権限修正](/blog/claude-code-2149-powershell-mcp-2026/) で扱ったように、Claude Code のリスクは `AI が何を書くか` だけではない。PowerShell、MCP、permissions、plugin、background agents、hooks のような周辺機能が、実際の実行面を作る。今回の MCP 修正は、その周辺機能の一部を `確認操作だから安全` と扱わない方向へ寄せたものだ。

これは正しい方向だ。日本企業では、開発者が社内 repository だけを開くわけではない。OSS、顧客から渡された zip、委託先の成果物、検証用 template、生成 AI が作った sample project を開く。そこに `.mcp.json` や `.claude/settings.json` が入っている場合、ローカルの Claude Code がどの時点で何を起動するかは、明確な信頼境界の問題になる。

## managed settingsは強いが、配信経路を間違えると弱くなる

Claude Code の server-managed settings ドキュメントは、管理者が claude.ai の管理画面から Claude Code 設定を配る仕組みを説明している。Claude for Teams / Enterprise、Owner 権限、対応バージョン、`api.anthropic.com` へのネットワーク到達性が要件になる。設定には permissions の deny、bypass permissions mode の無効化、`allowManagedPermissionRulesOnly`、hooks、auto mode の環境情報などを含められる。

ここで重要なのは、settings hierarchy で managed settings が最上位 tier に置かれることだ。通常のユーザー設定、プロジェクト設定、コマンドライン引数では上書きできない。したがって、セキュリティ境界を作るなら、単なる社内ドキュメントではなく managed settings に落とすべきである。

ただし、server-managed settings には限界もある。ドキュメントは、server-managed settings が第三者モデルプロバイダー利用時には使えないと説明している。Amazon Bedrock、Google Vertex AI、Microsoft Foundry、Claude Platform on AWS、custom API endpoints、third-party LLM gateways では対象外になる。Bedrock、Vertex、Foundry の場合は、self-hosted Claude apps gateway が相当する remote managed-settings delivery を提供する。

これは実務上かなり大きい。[Claude Platform on AWS と Bedrock の使い分け](/blog/anthropic-claude-platform-aws-2026-04-22/) で見た通り、Claude をどの入口で使うかによって、データ境界、認証、請求、ログが変わる。Claude Code でも同じで、Anthropic 直結なら claude.ai の server-managed settings、クラウド provider 経由なら gateway、端末管理が強い会社なら endpoint-managed settings、という選択が必要になる。

## managed MCPは名前ではなくURLとcommandで縛る

MCP の管理は、model governance よりさらに事故りやすい。モデルはプロバイダーや model ID で比較しやすいが、MCP は server の実装、transport、認証、接続先、権限、ローカル command、環境変数が絡む。managed MCP のドキュメントは、初期状態では誰でも任意の MCP server に接続できると説明し、管理者向けにいくつかの制御パターンを示している。

最も強いのは、`managed-mcp.json` で固定 server set を配る方式だ。この場合、ユーザーはそれ以外の MCP server を追加、変更、利用できない。全面無効化したいなら、空の server map を配ればよい。もう少し柔らかい運用では、`allowedMcpServers` と `deniedMcpServers` を使う。hard allowlist にするには、`allowedMcpServers` と `allowManagedMcpServersOnly: true` を一緒に managed settings source へ置く。

特に見落としやすいのは、`serverName` がセキュリティ制御として弱いことだ。ドキュメントは、serverName はユーザーが `claude mcp add` や config file で付ける label であり、任意の server に `github` と名付けられると警告している。remote server は `serverUrl`、stdio server は `serverCommand` で縛る必要がある。日本企業の運用台帳も、この粒度で作らなければ意味が薄い。

MCP には per-user credential の扱いもある。`managed-mcp.json` は machine 上のユーザーが読めるため、API key や secret を `env` に入れるべきではない。環境変数展開、OAuth、per-user headers、headersHelper のような方式で、ユーザー本人として認証させる必要がある。ここを間違えると、MCP server の承認以前に credential 管理で破綻する。

## gatewayはモデル選択と設定配信を同じ面で扱う

Claude apps gateway のドキュメントは、Amazon Bedrock、Google Cloud、Microsoft Foundry、Anthropic API などの上流に対して、Claude Code client と model provider の間に self-hosted service を置く構成を説明している。開発者は API key や cloud credential を持たず、企業 IdP で sign in する。gateway は upstream credential、model access、managed settings、usage telemetry を扱う。

この構成では、IdP group を model allowlist と managed settings policy に map できる。つまり、`組織既定モデル`、`利用できるモデル`、`MCP と permission の設定`、`telemetry` を同じ入口で制御しやすい。これは日本企業の現実に合う。多くの会社では、AWS 部門、Google Cloud 部門、Azure 部門、情シス、セキュリティ、開発基盤チームが別々に存在する。gateway は、その分散を隠す魔法ではないが、少なくとも開発者が個別 cloud credential を持つより統制しやすい。

一方で、gateway は運用対象でもある。PostgreSQL、OIDC、private network address、HTTPS、upstream credential、telemetry destination、モデル catalog、spend limits を管理する必要がある。ドキュメントは、gateway server と開発者 machine の双方に Claude Code v2.1.195 以降が必要だと説明している。2.1.196 の organization default models と MCP hardening を gateway 前提で使うなら、client version 管理も合わせて行う必要がある。

## 日本企業向けの実装順序

実装順序は、モデルから始めるより、作業分類から始めた方がよい。

第一に、Claude Code に任せる作業を低リスク、中リスク、高リスクに分ける。低リスクは読解、要約、テスト失敗の仮説出し、ドキュメント草案。中リスクは小さな修正、テスト追加、依存更新、リファクタリング。高リスクは認証、権限、課金、個人情報、顧客データ、インフラ、セキュリティ修正である。

第二に、作業分類ごとの default model と escalation を決める。低リスクは組織既定モデル、高リスクは固定モデルまたは明示承認モデル、セキュリティ修正はログ取得とレビュー必須、というようにする。ここで [Claude Code の監査ラベルと OpenTelemetry](/blog/claude-code-otel-agents-mcp-security-2026/) の考え方が効く。ログにモデル、利用者、作業分類、repository、tool 呼び出しを残せなければ、後から説明できない。

第三に、MCP server を棚卸しする。候補 server ごとに、transport、URL または command、owner、認証方式、接続先データ、利用 repository、ログ、停止手順を記録する。`serverName` だけの allowlist は避ける。stdio server は command と引数を完全一致で管理する。remote server は URL pattern を明示する。外部 SaaS の MCP は、利用規約とデータ処理条件も確認する。

第四に、設定配信経路を決める。Anthropic 直結なら server-managed settings、端末管理があるなら endpoint-managed settings、Bedrock / Vertex / Foundry 経由なら Claude apps gateway を検討する。ここで `forceRemoteSettingsRefresh` のような fail-closed 設定を使うかも判断する。規制産業や高リスク repository では、設定取得に失敗したときに fail-open で動くかどうかが重大な差になる。

第五に、例外承認とインシデント対応を決める。開発者が未承認 MCP を使いたい場合、誰がレビューし、どの期間だけ許可し、どのログを残すのか。モデル変更で費用が急増した場合、誰が止めるのか。MCP server が credential を誤って扱った場合、どの secret を rotate するのか。ここまで決めないと、MCP と model governance は実運用にならない。

## 監査と教育を別物にしない

[Claude Compliance API 統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で見たように、AI 利用が本番業務に入るほど、会話、ファイル、管理操作、API key、workspace、設定変更の証跡が重要になる。Claude Code では、これに repository、shell command、MCP tool、plugin、background agent、model route が加わる。つまり、通常の SaaS 監査より開発者環境寄りの監査が必要になる。

教育も同じくらい重要だ。開発者に「危ない MCP を使わないでください」と言うだけでは足りない。どの MCP が承認済みか、なぜその server だけなのか、未信頼 workspace で pending approval が出たら何をするか、標準モデルから変えるときはどの理由を書くか、ログに何が残るかを説明する必要がある。

特に日本企業では、委託先やグループ会社を含む開発体制が多い。組織内の正社員だけが Claude Code を使う前提で設計すると、実際の repository と権限構造に合わない。role default、managed settings、managed MCP、gateway、telemetry は、雇用形態や契約範囲ごとの境界にも合わせて設計すべきだ。

## まとめ

Claude Code 2.1.196 の organization default models は、モデル選択を個人の初期判断から組織標準へ寄せる。MCP self-approval hardening は、repository にコミットされた設定が確認操作を通じて server 起動へ進む経路を抑える。どちらも、AI コーディングを企業の統制対象として扱うための更新である。

日本企業がやるべきことは、単に最新版へ上げることではない。作業分類、既定モデル、例外モデル、MCP allowlist、managed settings の配信経路、gateway の有無、監査ログ、教育を1つの運用設計としてまとめることだ。

Claude Code は、モデル性能だけで評価する段階を越えつつある。これからの差は、どの会社が `賢いAI` を使うかではなく、どの会社が `説明できるAI開発基盤` として使えるかに出る。2.1.196 は、その方向を示す小さいが実務的な更新だ。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-30
- [Configure server-managed settings](https://code.claude.com/docs/en/server-managed-settings) - Claude Code Docs, accessed 2026-06-30
- [Control MCP server access for your organization](https://code.claude.com/docs/en/managed-mcp) - Claude Code Docs, accessed 2026-06-30
- [Claude apps gateway for Amazon Bedrock, Google Cloud, and Microsoft Foundry](https://code.claude.com/docs/en/claude-apps-gateway) - Claude Code Docs, accessed 2026-06-30
