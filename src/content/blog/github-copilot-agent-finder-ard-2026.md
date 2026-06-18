---
title: 'GitHub Agent Finder、ARDで社内ツール発見へ'
description: 'GitHub Agent FinderとARD仕様を整理。日本企業がCopilotに社内MCP、スキル、agentを発見させる前に、registryと権限をどう管理すべきか解説する。'
pubDate: '2026-06-18'
category: 'news'
tags: ['GitHub Copilot', 'MCP', 'AIエージェント', '開発者ツール', 'エンタープライズAI', '管理者設定']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月17日**、GitHub Copilot 向けの **Agent finder** を提供開始した。利用者が自然文でタスクを説明すると、Agent finder は指定された registry から MCP server、skills、canvases、agents、tools などの AI resource を検索し、Copilot が必要に応じて読み込める候補を返す。

これは単なる「便利な検索窓」ではない。GitHub は Agent finder が open な **Agentic Resource Discovery、ARD** 仕様を実装していると説明している。ARD は、AI agent が使える能力を `ai-catalog.json` や registry 経由で発見し、publisher や trust metadata を確認してから接続するための仕様だ。日本の開発組織では、以前の [Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/) や [GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) と同じく、配布・発見・権限を一体で見る必要がある。

今回の焦点は、agent に多くの道具を最初から持たせることではない。必要なときに正しい道具を見つける仕組みを、企業がどの範囲で許し、どう監査するかである。[Copilot appキャンバス](/blog/github-copilot-app-canvases-agent-work-2026/) が agent の作業面を見える化する更新だったのに対し、Agent finder は agent がどの能力へ到達できるかを整理する更新だ。

## 事実: Agent finderはregistryから能力を探す

GitHub Changelog によると、Agent finder は「どの MCP server、skill、canvas、agent、tool を agent に持たせるか」を人間が手で配線し続ける問題を減らすための機能だ。利用者がタスクを自然文で説明すると、Agent finder が AI resource の index を検索し、ranked matches を返す。Copilot はその結果を必要に応じて読み込む。

重要なのは、検索対象の registry を選べる点だ。GitHub は、GitHub の curated public catalog を使うことも、自社の private registry を指すこともできると説明している。つまり、企業は「社外の公開 resource を広く探す」運用だけでなく、「社内 registry に登録された承認済み resource だけを探す」運用も設計できる。

GitHub はさらに、Agent finder が managed settings と連動すると説明している。Copilot を管理する同じ場所で、agent が発見・利用できる resource の範囲を決められる。Agent finder は enterprise が許可したものだけを出す、という建て付けだ。

もう一つの安全弁は、auto installation ではない点だ。GitHub は、Agent finder が適切な tool を見つけても、黙って接続や導入を済ませるものではないと説明している。これは日本企業にとって大きい。発見と接続を分けられるなら、法務、情シス、AppSec、開発基盤の承認プロセスを残せるからだ。

## 事実: ARDは発見の標準レイヤー

ARD については、Google Developers Blog が「web 上の tools、skills、agents を見つけ、検証するための open specification」として説明している。Google の説明では、agent ecosystem が大きくなると、agent は「必要な能力がどこにあるか」「どれを使うべきか」「安全に接続できるか」を判断する必要がある。しかし、組織や platform をまたいでその答えを出す標準が不足していた。

ARD はその不足を埋めるため、catalog と registry という2つの部品を置く。catalog は、組織が自社 domain 配下に公開する capability の一覧だ。registry は、その catalog を crawl、index し、agent からの discovery request に対して候補と検証用 metadata を返す検索エンジンのような役割を持つ。

Hugging Face の説明では、ARD は MCP、Skills、A2A の前に置かれる discovery layer だ。MCP は tool を呼ぶ標準、Skills は instruction を渡す仕組み、A2A は agent 同士をつなぐ仕組みだが、いずれも「何を使うか」を人間が先に知っている前提になりやすい。ARD は、agent が runtime に能力を探せるようにする。

ただし、ARD は完成済みの固定仕様として見るべきではない。公開 repository では v0.9 draft とされ、仕様は進化中だ。日本企業がいま採用するなら、標準化の方向性として評価しつつ、production の統制は自社 registry、allowlist、承認フロー、ログで固める必要がある。

## 分析: 社内registryは統制資産になる

ここからは分析だ。

Agent finder の価値は、AI agent が「必要な能力を探せる」ことにある。しかし企業導入で本当に難しいのは、探せる範囲をどう絞るかだ。公開 catalog から便利な skill や MCP server を見つけられることと、社内の本番 repository や顧客情報を扱う agent に使わせてよいことは別である。

日本企業では、まず private registry を前提に考えるのが現実的だ。社内で承認した MCP server、社内運用の skill、開発基盤チームが管理する agent、特定 SaaS への接続 connector を登録する。開発者は自然文で探せるが、検索対象は企業が管理した catalog に閉じる。公開 catalog は PoC や個人検証で使い、業務 repository では段階的に許可する。

この registry は、単なる一覧表ではない。誰が resource を登録できるか、publisher は誰か、どの domain で証明するか、どの version を固定するか、どの権限を要求するか、どの repository で利用できるかを持つ統制資産になる。ARD が trust metadata を重視しているのは、この「見つけた後に信頼できるか」を扱うためだ。

逆に、registry を作らずに Agent finder だけを広げると、現場は便利になるが説明責任が弱くなる。開発者は「Copilot が見つけたから使った」と言い、管理者は「どの resource がなぜ候補に出たか」を追えない。これは [Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) で扱った cloud agent の棚卸しと同じ問題だ。agent が使えるものは、一覧化し、所有者を持ち、監査できなければならない。

## 日本企業での導入手順

第一に、対象 task を絞る。最初から全社の agent discovery を開くのではなく、開発基盤、SRE、QA、自動レビュー、ドキュメント整備のように、使う resource が比較的明確な領域から始める。たとえば「CI 失敗調査」「依存関係更新」「release note 下書き」「軽微な UI test 補助」なら、必要な MCP server や skill を定義しやすい。

第二に、private registry の owner を決める。Platform Engineering が resource 登録を管理し、AppSec が security-sensitive な tool を review し、情シスが SaaS connector と権限を確認する形が現実的だ。resource ごとに owner、説明、利用可能 repository、必要権限、データ分類、更新頻度、廃止条件を持たせる。

第三に、managed settings で検索範囲を固定する。GitHub は Agent finder が enterprise の許可範囲だけを surface すると説明している。日本企業では、部門、organization、repository、委託先、海外拠点で許可範囲を変えたくなる。最初は広く開けるより、狭い registry と明確な allowlist で始める方がよい。

第四に、発見と導入を分ける。Agent finder が候補を返しても、実際に MCP server を接続する、skill を repository に入れる、agent profile を共有する段階では review を挟む。特に、issue tracker、observability、cloud console、customer support、billing、HR、security scanner に触る resource は、読み取りだけでも情報漏えいリスクがある。

第五に、ログを残す。誰が何を検索し、どの resource が候補に出て、どれを導入し、どの agent session で使われたかを見る必要がある。Agent finder の発見ログだけでなく、MCP server 側の access log、GitHub audit log、SIEM 連携、PR や issue の作業履歴を合わせて追うべきだ。

## 既存Copilot運用とのつなぎ方

Agent finder は単独で使う機能ではなく、Copilot の既存運用に接続する。

まず、managed plugins と組み合わせる。VS Code や CLI に企業標準 plugin を配布している組織では、Agent finder が見つける resource と、既に配布している plugin が衝突しないようにする必要がある。標準で入れるもの、検索で見つけるもの、申請後に追加するものを分ける。

次に、MCP security とつなげる。MCP server は agent に外部 tool を渡す強力な境界だ。secret scanning や dependency scanning のように安全性を高める MCP もあれば、社内 system を読む MCP もある。Agent finder で MCP server を探せるようにするなら、server の権限、transport、認証、入力データ、出力データ、監査ログを先に確認する。

さらに、Copilot app や cloud agent とつなげる。Copilot app で canvas や session が増え、cloud agent が repository 上で作業するほど、agent が使う resource の数は増える。Agent finder はその探索を楽にするが、作業面の可視化や設定監査 API と一緒に運用しないと、どの agent が何を使ったかが分からなくなる。

最後に、費用と運用品質を見る。Agent finder 自体は resource を探す仕組みだが、発見しやすくなると agent session、MCP call、外部 SaaS API、CI 実行、レビュー作業は増えやすい。導入後は「見つけた resource 数」ではなく、PR 品質、修正時間、手戻り、security incident、不要 tool の削減、承認待ち時間を見た方がよい。

## まとめ

GitHub Copilot Agent finder は、Copilot が必要な MCP server、skill、canvas、agent、tool を registry から探せるようにする更新だ。ARD 仕様に沿うことで、公開 catalog や private registry をまたいだ discovery model を目指している。

日本企業にとっての意味は、agent に便利な道具を増やすことではない。どの registry を検索させるか、どの resource を enterprise policy で許すか、発見後に誰が導入を承認するか、MCP や skill の利用をどう監査するかを決めることだ。Agent finder は、agent tool 管理を「手作業の設定ファイル」から「検索可能な統制資産」へ移す入口になる。

ただし ARD は draft であり、エコシステムも立ち上がり段階だ。今すぐ全社展開するより、private registry、allowlist、owner、ログ、廃止手順を揃えた小さな pilot から始めるのがよい。Copilot を agent 実行基盤として広げる組織ほど、発見できる能力そのものを governance の対象にすべきだ。

## 出典

- [Agent finder for GitHub Copilot now available](https://github.blog/changelog/2026-06-17-agent-finder-for-github-copilot-now-available/) - GitHub Changelog, 2026-06-17
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) - Google Developers Blog, 2026-06-17
- [Agentic Resource Discovery: Let agents search for tools, skills, and other agents](https://huggingface.co/blog/agentic-resource-discovery-launch) - Hugging Face, 2026-06-17
- [Agentic Resource Discovery specification](https://github.com/ards-project/ard-spec) - ards-project
- [Agent Finder - AI resources](https://github.com/agentfinder) - GitHub
