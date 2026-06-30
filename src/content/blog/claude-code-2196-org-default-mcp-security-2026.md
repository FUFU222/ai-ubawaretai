---
title: 'Claude Code 2.1.196、組織既定モデルとMCP安全化'
description: 'Claude Code 2.1.196の組織既定モデルとMCP安全化を整理。日本企業がモデル選択、承認経路、監査ログ、gateway配信を開発基盤へどう落とすかを実務目線でも見る。'
pubDate: '2026-06-30'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'MCP', 'AIエージェント', '管理者設定', '開発者ツール', 'セキュリティ', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Claude Code の changelog に **2.1.196** が入り、企業利用では見逃しにくい更新が2つ並んだ。1つ目は、管理者が組織側で default model を設定でき、利用者が自分でモデルを選んでいないときに `/model` で `Org default` または `Role default` と表示されるようになったこと。2つ目は、`claude mcp list` と `claude mcp get` が、リポジトリにコミットされた `.claude/settings.json` によって自己承認された `.mcp.json` server を起動しないようにするセキュリティ修正である。

これは小さな CLI 更新に見えるが、日本企業の開発基盤ではかなり実務的だ。[Claude Code Auto mode のクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、Claude Code は個人ツールから、Bedrock、Vertex、Foundry、gateway を含む企業向け開発基盤へ寄っている。その流れでは、モデル選択と MCP 承認を開発者の手元だけに置くのではなく、組織の方針として説明できる必要がある。

## 事実: 2.1.196で何が変わったか

Anthropic の Claude Code changelog では、2.1.196 の更新として、organization default models のサポートが追加されたと説明されている。管理者が org console で設定し、利用者が自分でモデルを選択していない場合は `/model` に組織既定またはロール既定として表示される。つまり、個々の開発者が最初に触るモデルを、組織側で標準化しやすくなった。

同じ changelog には、MCP 周りのセキュリティ修正もある。`claude mcp list` や `claude mcp get` が、リポジトリに置かれた `.claude/settings.json` によって自己承認された `.mcp.json` server を起動しなくなった。信頼されていない workspace では pending approval として扱われる。これは、MCP サーバーの一覧確認や詳細確認のためのコマンドが、結果的に未承認のサーバーを動かしてしまう経路を塞ぐ修正と読める。

他にも、セッション名の可読性、クリック可能な添付ファイル、background job の復旧、PowerShell の `git diff` / `git grep` 判定、rate-limit telemetry、MCP OAuth の scope 要求など、多くの修正が含まれる。ただし日本企業の導入判断としては、今回の中心は **モデルの既定化** と **MCP 起動経路の安全化** に置いた方がよい。どちらも、個人の便利さではなく、組織としての標準化と事故防止に直結するからだ。

## 事実: managed settingsとmanaged MCPの位置づけ

Claude Code の server-managed settings ドキュメントでは、Claude for Teams / Enterprise の管理者が claude.ai の管理画面から Claude Code 設定を配信できると説明されている。設定はユーザーが組織 OAuth login または直接構成された API key で認証したときに取得される。MDM を持たない組織や、管理外端末を含む利用に向けた仕組みだ。

一方で、endpoint-managed settings は MDM、Windows registry、managed settings file などで端末へ直接配る方式で、OS レベルでユーザー変更から守れる分、より強い保証を持つ。ドキュメントは、両者が settings hierarchy の最上位 tier にあり、通常のユーザー設定やプロジェクト設定では上書きできないと説明している。ここは日本企業の情シスにとって重要だ。Claude Code の運用ルールを README や口頭説明だけに置くのではなく、設定として効かせられる。

MCP については、managed MCP のドキュメントがさらに直接的だ。初期状態では、Claude Code を使う人は任意の MCP server に接続できる。Anthropic は Directory 掲載前にレビューはするが、全 MCP server をセキュリティ監査・管理するわけではない。そのため管理者は、`managed-mcp.json` による固定セット、`allowedMcpServers` / `deniedMcpServers` による allowlist / denylist、あるいは MCP の全面無効化を選べる。

この流れは、[Claude Code 2.1.149/2.1.150 の権限修正](/blog/claude-code-2149-powershell-mcp-2026/) とつながっている。Claude Code は MCP、PowerShell、hooks、permissions、background agents のような周辺機構が実務価値を作る一方、その周辺機構がリスクにもなる。今回の 2.1.196 は、そのリスク面に対して、一覧確認コマンドでも未信頼 server を安易に動かさないという地味だが必要な修正を入れた。

## 分析: モデル選択を個人任せにしない

ここからは分析だ。

日本の開発組織が Claude Code を広げるとき、最初に揺れやすいのは「どのモデルを使うか」だ。開発者は速いモデルを選びたい。難しい設計やレビューでは高性能モデルを使いたい。管理者はコストとリスクを抑えたい。セキュリティ担当は、どの経路でどのモデルへ送られるかを説明したい。この4つは自然に衝突する。

organization default models は、この衝突を完全に解消するものではない。ただし、議論の出発点を変える。個々の利用者が毎回自由に選ぶのではなく、組織が標準モデルを決め、必要な人だけが明示的に変更する運用へ寄せられる。これは費用配賦にも効く。標準作業では既定モデル、例外作業では承認済みの高性能モデル、規制対象 repository では固定モデル、という分類を作りやすくなる。

この点は [Claude Code の監査ラベルと OpenTelemetry](/blog/claude-code-otel-agents-mcp-security-2026/) で見た監査設計とも重なる。AI コーディングの本番運用では、モデル名、利用者、作業対象、tool 呼び出し、費用、失敗理由を後から説明できる必要がある。既定モデルが曖昧なままだと、ログを見ても「なぜこのモデルが選ばれたか」を説明しにくい。組織既定が見えるだけでも、問い合わせ、監査、費用レビューの起点が揃う。

## 分析: MCPは便利さより承認経路が先

MCP は Claude Code の価値を大きく広げる。GitHub、Sentry、社内検索、チケット管理、設計書、データ基盤、セキュリティスキャナにつながれば、Claude Code は単なるコード生成ではなく、開発プロセス全体の作業者に近づく。しかし、接続先が増えるほど、権限とデータ境界は複雑になる。

今回の MCP 修正は、特に repository 信頼モデルの問題を思い出させる。開発者が外部 repository を clone したとき、その repository に `.mcp.json` や `.claude/settings.json` が含まれている場合、そこに書かれた設定をどこまで信用するかは慎重に扱う必要がある。設定ファイルは便利だが、コミットされた設定を理由にローカルで server が起動するなら、それは実行経路でもある。

日本企業では、ここを「開発者が気をつける」で済ませない方がよい。社内 repository だけでなく、OSS、顧客提供コード、委託先コード、検証用サンプル、生成された project template を開く場面がある。MCP server はファイル、ネットワーク、認証情報、外部 SaaS に触る可能性があるため、一覧表示のような操作でも起動の扱いを厳しくするのは妥当だ。

managed MCP のドキュメントが示すように、強い統制を求めるなら `managed-mcp.json` で固定セットを配り、ユーザーが追加できない形にする選択肢がある。柔らかく始めるなら allowlist / denylist でもよい。ただし、`serverName` はユーザーが付けるラベルなのでセキュリティ制御としては弱く、remote server なら URL、stdio server なら command で縛る必要がある。このような細部を知らないまま MCP を広げると、後から棚卸しが難しくなる。

## 日本企業が今確認すること

1つ目は、Claude Code の標準モデルを誰が決めるかだ。開発基盤チーム、AI 推進チーム、セキュリティ、経理のどこが責任を持つのかを曖昧にしない。標準モデルの変更は、開発者体験だけでなくコスト、監査、SLA、データ経路に影響する。

2つ目は、managed settings の配信経路だ。claude.ai の server-managed settings を使うのか、MDM や managed settings file で endpoint-managed settings を配るのか、Bedrock / Vertex / Foundry などの third-party provider 利用では Claude apps gateway の managed settings delivery を使うのかを分ける必要がある。ドキュメント上、server-managed settings は第三者モデルプロバイダー経由では使えず、gateway が相当機能を担うと説明されている。

3つ目は、MCP の承認台帳だ。どの MCP server を許可し、誰が owner で、どの認証方式を使い、どのデータへアクセスし、どのログで監査するのかを一覧にする。これは [Claude Compliance API 統合](/blog/anthropic-claude-compliance-api-integrations-2026/) のような監査基盤とも接続すべき話だ。AI の出力だけではなく、AI が何へ接続したかを追える必要がある。

4つ目は、外部 repository を開くときのルールだ。未信頼 workspace では MCP や hooks をどう扱うか、`claude mcp list` / `get` で pending approval が出た場合に誰が判断するか、例外承認をどこへ記録するかを決める。今回の修正は製品側の安全化だが、組織側の承認プロセスを不要にするものではない。

## まとめ

Claude Code 2.1.196 は、派手な新モデル発表ではない。しかし、organization default models と MCP self-approval 経路の安全化は、Claude Code を日本企業の標準開発基盤に近づけるうえで重要な更新だ。

組織既定モデルは、モデル選択を個人の好みから管理可能な標準へ寄せる。MCP 修正は、便利な接続機構を未信頼 repository の設定から不用意に起動しない方向へ寄せる。どちらも「AI コーディングを使えるか」ではなく、「AI コーディングを組織として説明できるか」の話である。

日本企業は今回の更新を、Claude Code のバージョンアップ情報として流さない方がよい。標準モデル、managed settings、MCP allowlist、gateway、監査ログを同じ運用設計の中で見直すきっかけにしたい。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-30
- [Configure server-managed settings](https://code.claude.com/docs/en/server-managed-settings) - Claude Code Docs, accessed 2026-06-30
- [Control MCP server access for your organization](https://code.claude.com/docs/en/managed-mcp) - Claude Code Docs, accessed 2026-06-30
- [Claude apps gateway for Amazon Bedrock, Google Cloud, and Microsoft Foundry](https://code.claude.com/docs/en/claude-apps-gateway) - Claude Code Docs, accessed 2026-06-30
