---
title: 'Claude containment、AI権限境界の実務'
description: 'Claude containmentの設計思想を、Claude CodeやCoworkの権限分離、MCP、監査ログに分け、日本企業がAIエージェント運用で点検すべき実行境界を整理する。'
pubDate: '2026-05-27'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'AIエージェント', 'セキュリティ', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic Engineering は **2026年5月25日**、Claude を claude.ai、Claude Code、Claude Cowork でどう封じ込めているかを説明する技術記事を公開した。中心にある言葉は **Claude containment** だ。モデルの振る舞いを注意深く監督するだけでなく、AI エージェントが実際に触れる filesystem、network、credential、tool、MCP、browser、workspace をどこで止めるかという実行境界の話である。

これは日本企業にとって重要だ。直近では [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) が監査ログと DLP/SIEM 接続を広げ、[Claude Code権限修正](/blog/claude-code-2149-powershell-mcp-2026/) では PowerShell や worktree の境界修正が論点になった。今回の記事は、それらを個別機能ではなく、AI エージェント全体の containment 設計として読む材料になる。

さらに、[Project GlasswingとMythos脆弱性トリアージ](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) で示されたように、モデル能力が上がるほど、開発・セキュリティ業務での効用もリスクも大きくなる。Claude containment は「AI を使うか使わないか」ではなく、「使うなら被害範囲をどう固定するか」という実務課題への回答として見るべきだ。

## 事実: Anthropicは3つの防御面を分けている

Anthropic の記事は、AI エージェントのリスクを、利用者の誤用、モデルの予期しない行動、外部攻撃者からの攻撃に分けている。そのうえで、防御面を大きく 3 つに整理している。

1つ目は、エージェントが動く環境だ。プロセス sandbox、VM、filesystem boundary、egress control によって、AI が到達できる範囲を物理的・技術的に狭める。たとえば credential が sandbox に入らなければ、モデルがどう振る舞ってもその credential は外へ出せない。

2つ目は、モデルそのものだ。system prompt、classifier、probe、training modification などで危険な行動を減らす。ただし Anthropic は、モデル層は確率的な防御なので、単独では完全な境界にならないと説明している。Claude Code auto mode のような仕組みも、許可疲れを減らす補助であって、sandbox の代替ではない。

3つ目は、エージェントが読む外部コンテンツだ。MCP server、third-party plugin、web search、connector から入る内容は、通常の supply chain risk だけでなく prompt injection の入力面にもなる。Anthropic は、信頼済み connector でも、その connector が読む README やドキュメントが汚染されれば、モデルの context は攻撃面になると説明している。

ここで大事なのは、containment が「AI を信用しない」という話ではないことだ。むしろ、AI を重要業務で使うために、モデルの賢さとは別に deterministic な境界を作る話である。

## 事実: claude.ai、Claude Code、Coworkで境界が違う

claude.ai の code execution は、サーバー側の gVisor container と一時 filesystem に寄せた設計だ。ユーザーのローカル端末ではコードが動かず、session ごとの ephemeral な環境になる。できることは限定されるが、端末や社内ファイルへの到達範囲は小さい。

Claude Code は逆に、ユーザーの端末上で shell、filesystem、network に近い場所で動く。開発エージェントとしてはその近さが価値だが、同時に危険も増える。Anthropic は、信頼 prompt の前に project-local config を読み込む問題や、利用者自身が攻撃文を貼り付ける phishing 型の prompt injection 例を挙げ、human-in-the-loop だけでは守り切れない場面を説明している。

Claude Cowork は、knowledge worker 向けの desktop agent として、当初 full VM mode を採った。ユーザーが選んだ workspace と `.claude` folder を mount し、それ以外の host filesystem や keychain credential は guest から見えないようにする設計だ。後に agent loop や local MCP server の配置は実用性のために調整されたが、code execution の isolation と network/file policy は維持される。

この違いは、日本企業の導入判断に直結する。開発者向け Claude Code と、非エンジニア向け Cowork では、利用者が bash や PowerShell の意味を判断できる前提が違う。承認ダイアログを読める人にだけ頼る設計と、管理者が絶対境界を先に置く設計は分けなければならない。

## 分析: 日本企業は「承認」より先に境界を決めるべき

ここからは分析だ。

日本企業が AI エージェントを広げるとき、最初に詰まりやすいのは「ユーザーが注意して使う」前提である。開発者は command の意味を読めるかもしれないが、営業、法務、経理、総務、コンサル、カスタマーサポートではそうはいかない。まして MCP や browser automation、file upload、API token、社内 SaaS connector が絡むと、個々の承認クリックで安全性を担保するのは難しい。

Anthropic の記事で示された通り、permission prompt は有効だが疲労する。承認が多すぎると、利用者は個別判断を省略し始める。日本企業の運用でも、毎回の承認で守るより、先に「この agent はこの workspace しか読めない」「この network しか出られない」「この MCP は read-only」「この credential は sandbox に入れない」と決めたほうがよい。

特に Claude Code は、[PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) のように大規模導入が進むほど、個人端末の便利ツールではなく企業の開発基盤になる。そうなると、開発者の善意や注意力ではなく、MDM、endpoint policy、devcontainer、proxy、permission settings、OpenTelemetry、SIEM へ落とし込む必要がある。

## MCPと外部コンテンツは「読むだけ」でも危険になる

日本企業では MCP を「社内データへつなぐ便利な標準」として評価しがちだ。GitHub、Jira、Confluence、Slack、Google Drive、SharePoint、CRM、DWH へ接続できれば、AI エージェントは一気に業務に近づく。しかし Anthropic の記事が強調するように、tool output はそのままモデルの context に入り、prompt injection の経路になる。

ここでの盲点は、connector のコードを監査しても、connector が読むデータまでは常に監査できないことだ。GitHub connector が安全でも、repository の README、issue、pull request comment、generated artifact に攻撃文が混ざれば、agent はそれを業務文脈として読む。外部 SaaS だけでなく、社内 wiki やチケットにも同じ問題がある。

したがって、MCP は「許可するかしないか」だけでは足りない。read-only か write 可能か、production data に触れるか、個人情報や顧客情報を返すか、tool result を検査する proxy があるか、agent が結果を別 tool に渡せるかを分けて考える必要がある。外部コンテンツを読む agent ほど、内部向け system prompt よりも実行境界と権限分離が重要になる。

## egress allowlistは宛先ではなく能力として見る

Anthropic の記事で特に実務的なのは、egress allowlist の失敗例だ。Claude Cowork では、製品として Anthropic API へ通信できなければ動かない。しかし、攻撃者の API key を含む悪意ある file が workspace に置かれると、許可済みの `api.anthropic.com` 経由で file upload される可能性があった。宛先は正しくても、能力としては外部送信が成立する。

これは日本企業の proxy 設計でもそのまま問題になる。`github.com`、`slack.com`、`googleapis.com`、`api.anthropic.com`、`api.openai.com` を許可するだけでは、「どの account へ、どの credential で、どの operation ができるか」は制御できない。AI エージェントでは、domain allowlist を通信先リストではなく capability grant として扱うべきだ。

実務的には、送信先 domain、利用 credential、upload/download operation、server-side fetch、workspace 外 file 参照、token scope をまとめて見る必要がある。DLP や CASB がある企業でも、AI agent の egress は通常の browser upload と違う経路を通ることがある。ここを見落とすと、ログ上は「許可された API call」にしか見えない。

## まず点検すべきこと

最初に、AI エージェントごとの実行場所を表にする。claude.ai の一時 container、Claude Code の local shell、Cowork の VM、社内 runner、browser automation、MCP server、plugin runtime を分ける。どこで code が動き、どこに file があり、どの credential が見えるかを書き出す。

次に、workspace と mount path を決める。顧客別 directory、社内規程、credential cache、download folder、desktop、home directory を雑に mount しない。Claude Cowork のように read-only、read-write、delete 禁止といった mount mode を分ける発想は、日本企業の共有端末や部門別運用でも参考になる。

3つ目は、MCP と connector の棚卸しだ。社内承認済み MCP、個人が追加した MCP、remote MCP、local MCP、browser extension、plugin を分ける。特に remote MCP は、install 時点で安全でも後から挙動が変わる可能性がある。fake data や sandbox account で先に試す運用が必要だ。

4つ目は、監査と可視性だ。VM や container で強く隔離すると、EDR が中を見られない場合がある。Anthropic も、Cowork の VM isolation が endpoint detection の可視性を下げる課題を説明している。日本企業では、隔離を強めるほど、OpenTelemetry、proxy logs、session logs、DLP events をどこで回収するかを同時に決めたい。

最後に、agent identity を決める。AI がユーザーの権限をそのまま継承するのか、agent 専用の scoped token を持つのか、session ごとに revoke できるのか。NCSC-NZ などが共同公開した agentic AI guidance も、agentic AI は自律的な行動と権限委譲によって通常の生成 AI と違うリスクを持つと整理している。日本企業でも、ユーザー ID と agent ID を混ぜたまま本番化しないほうがよい。

## まとめ

Claude containment は、Anthropic 固有の実装紹介にとどまらない。AI エージェントが業務システム、開発環境、SaaS、browser、MCP、ローカルファイルへ触れる時代に、被害範囲をどこで止めるかという設計原則である。

日本企業は、Claude Code や Cowork を導入するとき、まず「誰が承認するか」ではなく「何に到達できるか」を決めるべきだ。モデル層の安全策、permission prompt、監査ログは重要だが、credential を sandbox に入れない、workspace 外を mount しない、egress を capability として制御する、MCP を read/write で分ける、といった deterministic な境界が先に来る。

便利な AI エージェントほど、権限を持ち、長く動き、外部データを読み、複数 tool を組み合わせる。だからこそ、Claude containment の論点は、開発者だけでなく、情シス、セキュリティ、法務、内部監査、事業部門が同じ表で確認すべき実務課題になっている。

## 出典

- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) - Anthropic Engineering, 2026-05-25
- [Security](https://docs.anthropic.com/en/docs/claude-code/security) - Anthropic Docs
- [Development containers](https://docs.anthropic.com/en/docs/claude-code/devcontainer) - Anthropic Docs
- [Careful Adoption of Agentic AI Services](https://www.ncsc.govt.nz/protect-your-organisation/careful-adoption-of-agentic-ai-services/) - NCSC-NZ, 2026-05-01
