---
title: 'Claude Code workflows、権限管理の実務対応'
description: 'Claude Code workflowsがEnterpriseで既定有効化。日本企業がcustom roles、disableWorkflows、connector permissionsをどう棚卸しし、開発権限と費用を統制するか整理する。'
pubDate: '2026-06-08'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'AIエージェント', '企業導入', 'ガバナンス']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Enterprise 向け管理機能で、**Claude Code dynamic workflows を誰に許可するか**が新しい運用論点になった。Help Center の custom roles 記事では、2026年6月8日から dynamic workflows が組織で既定有効になり、管理者は organization toggle、custom roles、managed settings を使って制御できると整理されている。

これは新モデル発表ほど派手ではない。しかし日本企業が Claude Code を部門単位で配るなら、かなり重要だ。以前の [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) では、長時間タスクや複数段階の開発作業を Claude Code に任せる価値とリスクを扱った。今回の主題はその次である。**その能力を、誰に、どの範囲で、どの設定で許すか**だ。

同じ流れは [Claude Code監査ラベル追加](/blog/claude-code-otel-agents-mcp-security-2026/) ともつながる。AIエージェントを本番運用へ寄せるほど、ログ、権限、費用、接続先、停止条件の説明が必要になる。dynamic workflows の既定有効化は、開発者体験の改善であると同時に、管理者の棚卸しイベントとして見るべきだ。

## 事実: 6月8日からdynamic workflowsが組織デフォルトになる

まず事実を分ける。

Anthropic の Enterprise custom roles 記事は、dynamic workflows を「long-running tasks」と「multiple subagents」を使う Claude Code の機能として説明している。2026年6月8日以降、この機能は組織で既定有効になる。管理者が何もしなければ、対象ユーザーは dynamic workflows を使える前提に移る。

ただし、すべてを無条件に開放するだけではない。記事では、組織全体の enable/disable、custom roles による許可、Claude Code managed settings の `disableWorkflows` による制御が示されている。つまり、管理者は「全社で有効か」「このロールでは有効か」「端末やプロジェクト設定で無効化するか」を組み合わせて扱うことになる。

Claude Code settings docs でも、`disableWorkflows` は managed settings で配布できる項目として確認できる。Enterprise では user settings だけに任せず、組織が配る設定で Claude Code の動作を制御できる。これは、日本企業でよくある「情シスが標準設定を配り、開発部門が例外申請する」運用に近い。

[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、Claude Code はすでに Bedrock、Vertex、Foundry、社内 gateway など複数経路の運用論点を持つ。dynamic workflows の権限制御は、その上に乗る機能制御のレイヤーである。

## 事実: custom rolesは機能と接続先を分けて管理する

custom roles 記事で重要なのは、dynamic workflows だけが独立して語られているわけではない点だ。Enterprise 管理者はロールを作り、ユーザーやグループに割り当て、connector permissions や feature access を制御できる。Claude Code workflows の許可は、このロール設計の一部として扱われる。

日本企業では、ここを見落としやすい。Claude Code workflows を許可するかどうかだけを議論しても、接続先が自由なら意味が薄い。GitHub、Google Drive、Slack、社内ドキュメント、チケット管理、MCP server などに触れる権限が重なると、AIエージェントが扱う情報範囲は急に広がる。

Help Center では、organization-level toggle と custom role の関係も説明されている。組織全体で workflows を無効にすれば、個別ロールで許可しても使えない。逆に組織全体で有効にした場合、ロールや managed settings で利用者を絞る設計になる。つまり、最初に決めるべきなのは「全社の基本方針」であり、その後に「例外ロール」と「端末設定」を詰める順序だ。

この構造は、Claude Code を個人ツールではなく企業の開発基盤として扱うサインでもある。[AnthropicとNECの戦略協業](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/) で見たように、日本市場では Claude Code を人材育成、業種別ソリューション、開発プロセスに組み込む動きがある。そうなるほど、機能許可と接続先許可を同じ棚で管理する必要がある。

## 事実: workflowsは長時間・多agent・高コスト化しやすい

Claude Code workflows docs は、dynamic workflows を複数の subagents を使って作業を分解し、長時間のタスクを進める仕組みとして説明している。開発現場で見ると、これは調査、設計、実装、検証、再試行を一つの流れに近づける。

便利な反面、運用面では三つのリスクが増える。

第一に、実行時間である。短い補完や単発の質問と違い、workflows は複数段階で進む。途中でファイル探索、テスト、修正、再確認が入れば、利用時間とトークン消費は伸びる。

第二に、権限範囲である。subagents が増えるほど、同時に読むファイル、呼ぶ tool、触れる外部サービスが増える可能性がある。ローカルの repo だけならまだよいが、MCP や connector permissions と組み合わさると、業務データへ届く経路も増える。

第三に、責任分界である。AIがどこまで判断し、人間がどこで承認するのかを決めないまま workflows を使うと、差分レビュー、テスト失敗、秘密情報、費用超過の責任が曖昧になる。

## 分析: 日本企業は全社オンではなく役割別許可から始める

ここからは分析だ。

dynamic workflows の既定有効化を受けて、日本企業がやるべきことは、すぐ全開放することではない。まず、利用者を三つに分けるのが現実的だ。

第一は、先行評価ロールである。AI推進チーム、Platform Engineering、SRE、開発生産性チームのように、Claude Code の挙動を検証し、ログや費用を読めるチームを対象にする。このロールでは workflows を有効にし、対象 repo、実行可能コマンド、connector permissions、MCP server を明示する。

第二は、標準開発者ロールである。通常の開発者には、低リスクな調査、テスト失敗の初期分析、ドキュメント整理、限定された repo 内の修正だけを許可する。workflows を許すとしても、長時間実行や高リスク領域への変更は承認制にしたほうがよい。

第三は、制限ロールである。委託先、研修中メンバー、個人情報や決済領域に触るチーム、規制業務の担当者などには、`disableWorkflows` を配布し、通常の Claude Code 利用だけに絞る選択肢がある。

この設計では、dynamic workflows を禁止することが目的ではない。むしろ、使える場面を明確にして、監査とレビューを説明できる状態で広げることが目的だ。

## 分析: connector permissionsとMCPを同じ台帳で見る

もう一つ重要なのは、Claude の connector permissions と Claude Code の MCP/managed settings を別々に管理しないことだ。

Enterprise 管理では、ユーザーがどの connector を使えるかをロールで制御できる。一方、Claude Code 側では settings や MCP によって、ローカルツール、外部サービス、開発環境への接続が決まる。現場では、この二つが同時に効く。

たとえば、ある開発者ロールに dynamic workflows を許可し、GitHub connector も許可し、Claude Code には社内チケット MCP と repo 操作用の MCP を入れるとする。この場合、AIエージェントはコード、issue、チケット、ドキュメントをまたいで動ける可能性がある。価値は高いが、監査範囲も広い。

したがって、日本企業では少なくとも、ロール名、許可する workflows、許可する connector、許可する MCP server、対象 repo、ログ保存先、費用配賦先を一つの台帳に置くべきだ。部門ごとに Excel や Wiki で管理してもよいが、申請、承認、棚卸しの単位は揃えたい。

## 日本チーム向けチェックリスト

今回の変更で確認すべきことは五つある。

第一に、2026年6月8日以降の組織デフォルトを確認する。管理コンソール上で workflows が organization-level で有効か、無効かを明示する。

第二に、custom roles を棚卸しする。誰が workflows を使えるか、既存ロールに暗黙の許可が入っていないかを確認する。

第三に、`disableWorkflows` を managed settings で配れるかを検証する。標準端末、VDI、開発コンテナ、社内 CLI wrapper のどこで効かせるかも決める。

第四に、connector permissions と MCP server を同じ表に載せる。AIがアクセスできる情報源を、Claude.ai 側と Claude Code 側に分けずに見る。

第五に、利用ログと費用を見る軸を決める。team、repo、risk_class、cost_center のような少数の軸で始め、長時間 workflows の費用を後から説明できるようにする。

## まとめ

Claude Code dynamic workflows の 2026年6月8日デフォルト有効化は、単なる便利機能の配布ではない。Claude Code を企業の開発基盤として扱うなら、custom roles、organization toggle、managed settings、connector permissions、MCP、費用配賦をまとめて見直すタイミングである。

日本企業が注目すべきなのは、「workflows を使うかどうか」だけではない。誰に許可するか、どの接続先と組み合わせるか、どこで止めるか、どのログで説明するかだ。Claude Code が強くなるほど、管理者の仕事はモデル選定から権限設計へ移っていく。

## 出典

- [Manage custom roles on Enterprise plans](https://support.claude.com/en/articles/13930452-manage-custom-roles-on-enterprise-plans) - Anthropic Help Center
- [Claude Code settings](https://code.claude.com/docs/en/settings) - Claude Code Docs
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows) - Claude Code Docs
