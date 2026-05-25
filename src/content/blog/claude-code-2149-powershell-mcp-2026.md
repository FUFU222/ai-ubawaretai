---
title: 'Claude Code権限修正、Windows運用の点検軸'
description: 'Claude Code 2.1.149の権限修正を起点に、PowerShell、worktree、MCP管理設定を日本の開発組織がどう点検し、Windows混在CIや社内MCP展開を安全に更新すべきか整理する。'
pubDate: '2026-05-25'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'MCP', 'セキュリティ', '管理者設定', '開発者ツール']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Code changelog では、**2026年5月23日** の `2.1.150` は内部インフラ改善で、利用者向け変更はない。一方、その前日の **2026年5月22日** に出た `2.1.149` は、日本の開発組織が見落としにくい更新を含んでいる。PowerShell の権限境界、git worktree の sandbox allowlist、MCP サーバごとの usage breakdown、Enterprise 管理設定が同じリリースに入ったためだ。

これは単なる CLI の細かな修正ではない。Claude Code を開発者個人の端末だけでなく、Windows runner、社内標準端末、CI、remote session、社内 MCP、企業管理設定の中で使うチームほど関係する。Anthropic はすでに [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) や [Stainless買収とMCP基盤](/blog/anthropic-stainless-sdk-mcp-platform-2026/) で企業向けの接続・監査面を強めている。今回の Claude Code 更新は、その足元にある「ローカル実行と権限解析」を整える話として読むべきだ。

## 事実: 2.1.149が実務上の更新本体

公式 changelog で確認できる範囲では、`2.1.150` は利用者向け変更を伴わない。したがって今回の実務上の主役は `2.1.149` である。

`2.1.149` では、まず `/usage` が usage limit の内訳をカテゴリ別に表示するようになった。skills、subagents、plugins、MCP server ごとの消費を見られる方向で、Claude Code を単独ツールではなく拡張可能な開発環境として使うチームにとっては費用管理の粒度が上がる。

次に、Enterprise 向けに `allowAllClaudeAiMcps` managed setting が追加された。これは claude.ai 側の cloud MCP connectors を、`managed-mcp.json` で管理する MCP と並べて扱うための設定だ。企業が MCP を標準化するほど、「誰がどの connector を使えるか」「社内で許可した MCP とクラウド側 connector の境界をどう扱うか」が論点になる。

さらに、PowerShell と sandbox 周辺の修正が目立つ。公式 changelog では、PowerShell の `cd` 系 built-in function によって作業ディレクトリ変更が検知されず、その後の command が workspace 外を読める可能性があった問題が修正されたと説明されている。git worktree の sandbox write allowlist が main repository root 全体へ広がっていた問題も修正対象になった。

## 事実: Windowsとworktreeの境界が修正された

今回の PowerShell 修正は、日本企業では軽く見ないほうがよい。国内の開発現場では、macOS や Linux だけでなく Windows 端末、Windows Server、GitHub Actions の Windows runner、Azure DevOps、社内プロキシ下の PowerShell 実行が残る。AI コーディングツールの安全性を macOS/Linux 前提で評価すると、Windows の shell 挙動を取りこぼす。

特に `cd..`、`cd\`、`cd~`、ドライブ切替のような PowerShell 特有の作業ディレクトリ操作は、Bash の `cd` と同じ感覚では扱えない。Claude Code のようなツールは、モデルが command を提案し、権限解析がその command を評価し、実行環境が実際の filesystem へ触る。この三つの認識がずれると、ユーザーは workspace 内で動いているつもりでも、実行は別の場所を見ている可能性がある。

git worktree の修正も同じ方向だ。AI エージェントを安全に使うには、作業対象の repository と、共有される `.git` directory、hooks、config、親 repository の境界を正確に分ける必要がある。今回の修正では、worktree の sandbox write allowlist が広すぎた点が直された。これは [Claude Security公開ベータ](/blog/anthropic-claude-security-public-beta-2026/) で扱った AppSec 機能とは別の、実行基盤そのものの信頼境界である。

ここで重要なのは、Anthropic が問題を修正したことだけではない。AI コーディングエージェントの安全性は、モデルの拒否やプロンプトだけでは完結しない。shell parser、permission analyzer、working directory tracking、worktree isolation、allowlist、denylist、hooks、CI runner のすべてが関係する。日本企業が Claude Code を標準化するなら、この層をレビュー対象に入れる必要がある。

## 分析: 更新確認はWindows混在環境から始める

ここからは分析だ。

日本の開発組織が最初に確認すべきなのは、Claude Code の利用者全員が最新化されているかではない。まず Windows と PowerShell を通る導線を洗い出すべきだ。個人端末、VDI、社内標準 PC、Windows runner、PowerShell scripts、`.ps1` hooks、社内 CLI wrapper、Git Bash と PowerShell の混在を確認する。

理由は、今回の修正が「Windows で壊れる便利機能」ではなく「権限境界の見落とし」に近いからだ。AI エージェントに command 実行を許している場合、作業ディレクトリの検知漏れは読み取り範囲や書き込み範囲のズレにつながる。特に社内 monorepo、顧客別 directory、秘密情報を含む sibling directory、build artifact、credential cache が同じ端末にある場合、workspace 外読み取りは軽い問題ではない。

次に、worktree を使う運用を確認したい。AI エージェント用に worktree を切っている、background session を worktree へ隔離している、main checkout と automation checkout を同じ repository root で扱っている、hooks や config を共有している場合、write allowlist の範囲が重要になる。worktree は便利だが、`.git` の共有構造を理解せずに「別 directory だから安全」と見ると危ない。

この論点は [PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) のような大規模導入でも避けられない。利用者数が増えると、端末構成、shell、権限、MCP、plugin、社内 wrapper の差分も増える。企業導入で必要なのは、全員に「注意して使って」と言うことではなく、標準バージョン、実行モード、許可 command、MCP、ログ、更新手順を管理することだ。

## MCPとusage breakdownは統制面の変化

`/usage` の内訳表示と `allowAllClaudeAiMcps` は、セキュリティ修正とは違うが、同じくらい実務的だ。

Claude Code の利用が進むと、コストは単純な「1人あたり月額」では見えにくくなる。skills、subagents、plugins、MCP server が増えるほど、どの拡張が usage limit を消費しているのかを把握したくなる。個人開発では気にならなくても、チームや部門単位では、社内標準 plugin、重い MCP server、頻繁に起動する subagent が予算や上限に効いてくる。

MCP 管理設定も同じだ。MCP は AI エージェントに外部データや操作能力を与える接続面である。社内 GitHub、Jira、Confluence、Slack、CRM、DWH、監査ログ、ローカルファイルへつなぐほど便利になるが、権限と監査の面は難しくなる。`managed-mcp.json` で明示した MCP と、claude.ai 側の cloud MCP connectors をどう一緒に扱うかは、企業の管理ポリシーに関わる。

したがって、今回の更新は「MCP が増えて便利」では終わらない。日本企業では、MCP を許可制にするのか、部署別に分けるのか、社外 SaaS connector を使ってよいのか、ログをどこへ残すのか、費用を誰が見るのかを決める必要がある。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) と合わせると、Anthropic の企業向けストーリーは、利用促進だけでなく、接続先、ログ、費用、権限を管理する方向へ進んでいる。

## 日本企業が今週確認すること

実務的には、確認事項は大きく 5 つある。

第一に、Claude Code のバージョンを棚卸しする。特に Windows 端末、PowerShell を使う CI、社内 runner、VDI、委託先端末を優先する。`2.1.149` 以降へ更新するだけでなく、更新が失敗した端末や固定バージョン運用の端末を見つける。

第二に、PowerShell 実行の許可ルールを見直す。prefix rule、wildcard rule、native executable、script 実行、working directory 変更、ドライブ切替を含む command をどう扱うかを確認する。AI エージェントに広い PowerShell 実行を許すなら、workspace 外読み取りと credential 参照をテストに入れる。

第三に、worktree isolation を点検する。AI エージェント用 worktree が main repository root、shared `.git`、hooks、config、親 checkout へ書けないかを確認する。特に automation、background sessions、remote sessions を使う場合、write allowlist と denylist を実際の directory 構造で検証する。

第四に、MCP の許可範囲を整理する。`managed-mcp.json`、cloud MCP connectors、個人が追加した MCP、plugin 経由の MCP を分ける。社内承認済み MCP と個人実験 MCP を混ぜない。顧客データ、ソースコード、チケット、監査ログへ触る MCP は、利用者、権限、ログ、停止手順を決める。

第五に、usage breakdown を費用管理に使う。重い MCP server、subagent、plugin がどこで消費を増やしているかを見て、チーム標準の使い方を調整する。費用管理は単なる節約ではない。意図しない connector や agent workflow が広がっていないかを見る、統制の早期信号にもなる。

## まとめ

Claude Code `2.1.149` は、見た目の派手な新機能よりも、企業導入で重要な足回りを直した更新だ。PowerShell の作業ディレクトリ追跡、worktree sandbox、permission analysis、MCP 管理設定、usage breakdown は、AI コーディングエージェントを安全に広げるための実務部品である。

日本企業は、今回の更新を「最新バージョンが出た」で済ませないほうがよい。Windows 混在環境、CI、worktree、社内 MCP、Enterprise managed settings、費用管理をまとめて点検する機会にすべきだ。Claude Code が個人の開発補助から組織の開発基盤へ進むほど、モデルの賢さより先に、どの shell で、どの directory に、どの権限で、どの connector を呼ぶのかが問われる。

## 出典

- [Claude Code Changelog](https://code.claude.com/docs/en/changelog) - Claude Code Docs, 2026-05-23 / 2026-05-22
- [anthropics/claude-code CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) - GitHub
- [@anthropic-ai/claude-code 2.1.149 package metadata](https://security.snyk.io/package/npm/%40anthropic-ai%2Fclaude-code/2.1.149) - Snyk, 2026-05-22
- [Major Updates in Claude Code v2.1.149 to v2.1.150](https://dev.classmethod.jp/en/articles/20260524-claude-code-updates-v2-1-150/) - DevelopersIO, 2026-05-24
