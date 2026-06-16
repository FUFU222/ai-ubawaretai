---
title: 'Claude Code権限ルール、subagent管理を再点検'
description: 'Claude Code 2.1.178の権限ルールとsubagent制御を整理。日本企業がMCP、nested skills、委託開発、monorepo運用で見直すべき最小権限設計を解説する。'
pubDate: '2026-06-16'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'MCP', 'AIエージェント', '管理者設定', '開発者ツール', 'セキュリティ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Code は、2026年6月15日に公開された `2.1.178` で、企業利用に効く権限まわりの更新を入れた。中心は、`Tool(param:value)` 形式でツールの入力パラメータまで見て permission rule を書けるようになったこと、subagent 起動前に auto mode の classifier が評価するようになったこと、subagent の `disallowedTools` で MCP server-level specs が無視されていた不具合を直したことだ。

これは派手な新モデル発表ではない。しかし日本の開発組織にとっては重要である。Claude Code を個人の便利ツールとして使う段階なら、許可ルールは大まかでも回る。だが、社内標準の開発エージェント、委託先を含む開発基盤、monorepo、MCP 連携、subagent 分担へ広げるなら、どの agent が、どの tool を、どの引数で呼べるかが統制の中心になる。

既存の [Claude Code権限修正](/blog/claude-code-2149-powershell-mcp-2026/) では、PowerShell や worktree の境界が論点だった。[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) では、AI エージェントを使うならモデル層だけでなく実行環境と権限境界を先に決めるべきだと整理した。今回の 2.1.178 は、その実務を Claude Code の設定粒度へ落とす更新として読むべきだ。

さらに [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、モデル選択や実行経路が動的になるほど、企業側の説明責任は重くなる。今回の permission rule と subagent 修正は、便利さを止めるためではなく、便利さを組織で使える形に狭めるための部品である。

## 事実: Tool(param:value)で許可ルールが細かくなった

Claude Code 2.1.178 の changelog では、permission rule に `Tool(param:value)` 構文が追加された。これは tool name だけでなく、tool input parameter に一致するかを見て rule を適用する仕組みで、`*` wildcard も使える。公式の例では、`Agent(model:opus)` のように Opus subagent をブロックする書き方が示されている。

これまでの企業運用では、「Agent tool を許可するか」「Bash を許可するか」「MCP を許可するか」のように、tool 単位で考えがちだった。しかし実務上のリスクは tool name だけでは決まらない。Agent tool でも、軽い調査用 subagent と、高価なモデルを使う subagent、本番リポジトリを変更する subagent ではリスクが違う。Bash でも、`npm test` と `curl`、`rm`、credential を読む command は同じ扱いにできない。

`Tool(param:value)` は、この差を permission policy に近づける更新である。日本企業で考えるなら、AI エージェントの設定を「全社共通で一律許可」から、作業種別、モデル、接続先、対象パス、MCP server、subagent role ごとに切り分ける方向へ進めやすくなる。

ただし、粒度が細かくなるほど運用は難しくなる。個々の開発者が毎回 rule を書くのではなく、基盤チームが標準テンプレートを作り、部門やリポジトリごとに差分だけを許可するほうがよい。許可の自由度が増えたときほど、標準化が必要になる。

## 事実: subagent起動前の評価が強化された

2.1.178 では auto mode も改善され、subagent を起動する前に classifier が評価するようになった。changelog では、blocked action を review なしで subagent が要求できる隙間を閉じたと説明されている。

これは小さな修正に見えるが、AI エージェントの実務では大きい。主 agent が禁止されている作業を直接できなくても、subagent に分担させた瞬間に別の評価経路へ抜けるなら、最小権限は崩れる。開発組織が subagent を使う理由は、調査、テスト、レビュー、実装、ドキュメント化を並列化したいからだ。しかし並列化は、権限の複製でもある。

特に日本企業の委託開発や大規模プロジェクトでは、subagent の役割を明確に分ける必要がある。調査 agent は読み取り中心、テスト agent は限定 command、実装 agent は対象 directory 限定、レビュー agent は変更不可、というように役割ごとに tool permission を分ける。今回の更新は、そうした役割分担が単なる運用文書ではなく、Claude Code の制御面に反映される方向を示している。

同じ文脈で、subagent の `disallowedTools` に関する修正も重要だ。MCP server-level specs、たとえば `mcp__server` や `mcp__server__*`、`mcp__*` が subagent の `disallowedTools` で黙って無視される問題が修正された。MCP は社内データや SaaS 操作へ直結しやすいため、「main agent では禁止したつもりだが subagent では効いていなかった」という状態は企業運用では許容しにくい。

## nested .claudeはmonorepo運用に効く

今回の 2.1.178 では、nested `.claude/skills` directory の扱いも変わった。作業対象ファイルの近くにある nested skills が読み込まれ、名前が衝突する場合は `<dir>:<name>` のように directory-qualified name で両方を利用できる。また、agent、workflow、output-style は working directory に最も近い `.claude/` のものが優先され、project-scope workflow の保存先も近い既存 `.claude/workflows/` になる。

これは monorepo や複数プロダクトを持つ企業には実務的だ。フロントエンド、バックエンド、データ基盤、モバイル、社内ツール、顧客別カスタマイズが同じ repository にある場合、全体で1つの Claude Code 設定を共有すると雑になりやすい。近い `.claude` が優先されるなら、領域ごとに異なる workflow、skills、output-style を置ける。

一方で、便利さは governance の課題にもなる。nested `.claude` を誰が変更できるのか、pull request で誰が見るのか、委託先が置いた skill を本社チームが信頼してよいのか、顧客別 directory にだけ存在する workflow が本番作業へ影響しないかを確認する必要がある。Claude Code の設定も、コードと同じように review 対象にすべきだ。

ここは [PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) と同じ問題でもある。大規模展開では、ツールを配るだけではなく、教育、CoE、標準設定、レビュー責任をセットで作る必要がある。nested `.claude` は現場ごとの最適化に向くが、放置すれば部門ごとの独自ルールが増える。

## 分析: 日本企業は権限テンプレートを先に作るべき

ここからは分析だ。

今回の更新で、日本企業がすぐにやるべきことは「全員に最新化を促す」だけではない。もちろん最新化は必要だが、より重要なのは Claude Code の権限テンプレートを作ることだ。

第一に、作業タイプを分ける。調査、テスト実行、軽微な修正、依存更新、ドキュメント生成、PRレビュー、セキュリティ修正、顧客データ調査を同じ権限にしない。調査や要約は read-only に寄せ、テスト実行は command allowlist を絞り、実装は対象 directory を限定し、セキュリティや個人情報を含む作業では人間レビューを必須にする。

第二に、subagent の役割を分ける。subagent は便利だが、役割が曖昧だと権限が拡散する。テスト専用 subagent、ドキュメント専用 subagent、レビュー専用 subagent、調査専用 subagent のように役割名と許可 tool を固定する。`Tool(param:value)` は、この役割ごとの制御を細かく書くために使う。

第三に、MCP を role ごとに分ける。GitHub、Jira、Slack、Google Drive、DWH、監査ログ、顧客管理システムへつなぐ MCP は、便利さと同時に情報境界を持つ。すべての subagent に同じ MCP を見せるのではなく、読むだけ、書ける、production data を見られる、個人情報を含む、外部送信がある、という軸で分ける。

第四に、nested `.claude` を code owner の対象にする。monorepo でチーム別設定を置くなら、その設定変更を誰が承認するかを決める。Claude Code の workflow や skill は、実行手順や出力方針に影響するため、単なる開発補助ファイルではない。社内標準から外れる設定が入ったら、通常のコード変更と同じようにレビューしたい。

## まず今週確認すること

実務的には、最初の確認は4つで足りる。

1つ目は、Claude Code の利用者が 2.1.178 以降へ更新できているかを確認すること。特に subagent、MCP、remote control、nested `.claude` を使うチームを優先する。npm metadata では `2.1.178` が 2026年6月15日に公開されているため、週内の標準版として固定しやすい。

2つ目は、現在の permission rule を棚卸しすること。tool 単位で広く許可している箇所があれば、`Tool(param:value)` で絞れるかを確認する。特に Agent、Bash、Read、Edit、Write、MCP server、browser 系 tool は優先して見る。

3つ目は、subagent と MCP の組み合わせを確認すること。subagent の `disallowedTools` が意図どおり効く前提で、どの MCP をどの役割へ見せるかを再設計する。顧客データ、監査ログ、社内チケット、本番操作に触る MCP は、read-only でも慎重に扱う。

4つ目は、nested `.claude` の所有者を決めること。monorepo 内でチーム別 skills や workflows を許すなら、標準命名、レビュー担当、禁止設定、棚卸し頻度を決める。便利なローカル最適化を認めるほど、設定の見える化が必要になる。

## まとめ

Claude Code 2.1.178 は、AI コーディングエージェントを企業で使うための権限粒度を一段細かくした更新である。`Tool(param:value)`、subagent 起動前評価、MCP server-level specs の `disallowedTools` 修正、nested `.claude/skills` の優先順位は、どれも現場の便利さと統制の境界に関わる。

日本企業が見るべきポイントは、Claude Code を禁止するか自由化するかではない。どの作業を、どの agent に、どの tool と引数で許すかを決めることだ。委託開発、monorepo、MCP、複数クラウド、部門別 workflow が絡むほど、この粒度は重要になる。

今後 Claude Code を社内標準にするなら、モデル選定や生成品質だけでなく、permission rule、subagent role、MCP allowlist、nested `.claude` の所有者、更新バージョンを同じ設計図に入れるべきである。2.1.178 は、その設計を始めるよい区切りになる。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-16
- [@anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code) - npm package metadata
- [Claude Code settings](https://docs.anthropic.com/en/docs/claude-code/settings) - Anthropic Docs
- [Claude Code security](https://docs.anthropic.com/en/docs/claude-code/security) - Anthropic Docs
