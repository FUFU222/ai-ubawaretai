---
article: 'claude-code-2149-powershell-mcp-2026'
level: 'expert'
---

Claude Code `2.1.149` は、AI コーディングエージェントを企業の開発基盤として扱うチームほど確認すべき更新だ。`2.1.150` は 2026年5月23日の内部インフラ改善で、公式 changelog 上は利用者向け変更がない。だが、2026年5月22日の `2.1.149` には、PowerShell の permission bypass 修正、git worktree sandbox の write allowlist 修正、MCP server ごとの usage breakdown、Enterprise managed setting の追加がまとまっている。

これらは一見ばらばらに見える。しかし、共通する論点は明確だ。Claude Code が「モデルにコードを書かせる CLI」から、shell、filesystem、worktree、remote session、plugin、skills、MCP、enterprise policy を含む実行環境へ広がるほど、境界管理が重要になる。今回の更新は、その境界を補強するものとして読むべきである。

この流れは、Anthropic の直近の企業向け更新ともつながる。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) は Claude 利用の監査・DLP・SIEM 接続を広げた。[Stainless買収とMCP基盤](/blog/anthropic-stainless-sdk-mcp-platform-2026/) は、SDK と MCP server tooling を Claude Platform の接続面へ取り込む動きだった。今回の Claude Code 更新は、そうした接続・監査の前提になるローカル実行と permission analysis の話である。

## 事実: 2.1.149で修正された権限境界

公式 changelog で特に重要なのは、PowerShell と worktree に関する修正だ。

PowerShell では、`cd..`、`cd\`、`cd~`、ドライブ切替のような built-in `cd` functions により作業ディレクトリが変わっても、Claude Code の permission analysis がその変化を検知できない場合があった。その結果、後続 command が workspace 外を読める可能性があったと説明されている。これは単なる UI バグではなく、実行コンテキストの追跡漏れである。

同じリリースでは、PowerShell prefix / wildcard allow rules に関する修正も入っている。たとえば `PowerShell(dotnet.exe build *)` のような rule が、native executable や script の事前承認に効かない問題が修正された。PowerShell permission parser が stale な `PWD`、`OLDPWD`、`DIRSTACK` の variable tracking を信頼する問題も修正されている。

git worktree では、sandbox write allowlist が shared `.git` directory だけでなく main repository root 全体へ広がる問題が修正対象になった。worktree は AI エージェントの隔離に使いやすいが、実体としては `.git` directory、hooks、config、refs、object database などを共有する。allowlist が広すぎると、エージェント用 worktree のつもりが、親 repository 側へ書けてしまうリスクが出る。

これらの修正は、AI coding agent の安全性を考えるうえでかなり象徴的だ。モデルが悪意を持つかどうかではなく、実行 layer が現在地、許可範囲、filesystem 境界、shell semantics を正しく理解しているかが問われている。

## Windows混在環境では優先度が高い

日本企業では、開発者端末が Windows、macOS、Linux に分かれ、CI も GitHub Actions、Azure DevOps、Jenkins、社内 runner が混在することが珍しくない。PowerShell は、Windows 開発だけでなく、.NET、Azure、Active Directory、社内配布 script、端末管理、運用自動化にも残りやすい。

この環境で Claude Code を導入すると、Bash 前提の安全評価だけでは足りない。PowerShell の built-in、alias、drive provider、execution policy、native executable と script の呼び分け、profile、environment variable、working directory stack を考慮する必要がある。AI エージェントに `PowerShell(*)` のような広い許可を与えているなら、特に注意が必要だ。

問題は、開発者が意図的に危ない command を書くかどうかではない。AI が提案した command が、permission analyzer では安全に見え、実行時には別の directory を参照する可能性があることだ。workspace 外に sibling project、credential cache、社内資料、顧客別 repository、downloaded artifact がある場合、読み取り範囲のずれは情報漏えいに直結する。

したがって、日本企業での優先順は明確だ。まず Windows 端末と Windows runner の Claude Code version を棚卸しする。次に、PowerShell command の allow rule を確認する。最後に、workspace 外読み取りを再現できないことを簡単な検証で確認する。全社に一斉周知する前に、実行経路の多いチームから始めるほうが現実的である。

## worktree isolationは安全策だが万能ではない

AI エージェント運用では、git worktree は便利な隔離手段になる。main checkout を汚さず、feature branch ごとに作業 directory を分け、background agent や remote session に専用の作業場所を渡せる。だが、worktree は container ではない。filesystem の隔離、process の隔離、network の隔離、secret の隔離を自動的に提供するわけではない。

今回の修正は、その前提を再確認させる。write allowlist が main repository root へ広がっていたなら、エージェントが想定外の path へ書ける可能性がある。hooks や config が誤って書き換わると、次の git 操作や CI に影響する。shared `.git` directory に対するアクセスは、便利さと危険が同居する。

日本の開発組織が worktree isolation を使うなら、最低限、次の点を確認したい。エージェント用 worktree が main checkout へ相対 path で戻れないこと。hooks と config が write deny になっていること。AI が生成した build artifact が親 checkout に落ちないこと。credential helper や git config の読み取り範囲が必要最小限であること。cleanup が `rm -rf` ではなく git worktree の正規操作に寄っていること。

[Claude Security公開ベータ](/blog/anthropic-claude-security-public-beta-2026/) はリポジトリ全体の脆弱性スキャンや findings 管理に寄った機能だった。一方、worktree sandbox は、そのような security workflow を実行する足場そのものだ。足場が広すぎる権限を持つと、どれだけ良い review agent を使っても運用上のリスクは残る。

## usage breakdownは費用管理だけではない

`/usage` のカテゴリ別 breakdown は、表面上は費用・上限管理の改善に見える。だが、企業運用では統制上の意味もある。

Claude Code の usage は、単純な prompt と response だけではない。skills が context を増やし、subagents が別作業を行い、plugins が追加機能を読み込み、MCP server が外部データや tool call を発生させる。チーム運用では、どの拡張が usage limit を消費しているのかを見ないと、費用も利用実態も分からない。

費用の観点では、重い MCP server や subagent workflow が予算を押し上げる可能性がある。たとえば、リポジトリ全体を読む MCP、社内ドキュメント検索、複数 agent による review、長時間 background session は、個人の試用では目立たなくても部門単位では効いてくる。usage breakdown は、どの拡張を標準化し、どれを制限し、どれを教育対象にするかの判断材料になる。

統制の観点では、意図しない connector 利用を見つける signal にもなる。ある team で特定 MCP server の消費が急に増えたなら、社内データへの接続が広がったのかもしれない。ある plugin が想定以上に使われているなら、レビューや承認なしに事実上の標準になっているかもしれない。usage は請求だけでなく、利用実態の監査入口になる。

## allowAllClaudeAiMcpsの設計論点

`allowAllClaudeAiMcps` は Enterprise managed setting として追加された。名前から分かる通り、claude.ai cloud MCP connectors を広く扱う方向の設定である。これをどう使うかは、企業の MCP 方針に直結する。

MCP の難しさは、機能が外部化されることにある。AI エージェントは、単に回答するだけならモデルとプロンプトを見ればよい。しかし MCP を通じて GitHub、Jira、Slack、Google Drive、DWH、社内 API、ローカル filesystem、監査ツールに触れるなら、リスクは接続先の権限へ広がる。MCP server は小さな便利機能ではなく、AI に権限を渡す境界である。

`managed-mcp.json` は、企業が明示的に管理する MCP の置き場になる。一方、claude.ai 側の cloud MCP connectors は、SaaS 側の認証や組織設定と結びつく。両者を一緒に許可する場合、会社は「どちらも承認済み」と見なすのか、「cloud connector は別審査」とするのかを決めなければならない。

日本企業では、ここに情報システム、セキュリティ、法務、各業務部門の責任分界が出る。GitHub MCP は開発組織の管轄か。Slack MCP は情シスか。Google Drive や Microsoft 365 の connector は文書管理規程に触れるか。顧客情報を持つ CRM の connector は営業部門だけで決めてよいのか。MCP の便利さは、承認経路の設計なしではスケールしない。

この点は [PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) のような大規模展開で特に重要になる。数万人規模に AI エージェントを配るなら、MCP は個人の dotfile ではなく、企業の標準機能になる。標準機能になるなら、承認、教育、監査、停止、更新、費用配賦を持つ必要がある。

## 導入チーム向けの点検手順

実務では、次の順で点検するとよい。

第一に、version inventory を作る。Claude Code を使う端末、CI、remote runner、VDI、container image、devcontainer、社内 base image を棚卸しし、`2.1.149` 以降かを確認する。auto-update に任せている環境と、固定 version の環境を分ける。固定 version は、なぜ固定しているのか、いつ更新するのかを明確にする。

第二に、PowerShell path を列挙する。Windows developer、Windows CI、PowerShell hooks、社内 wrapper、`pwsh` と Windows PowerShell 5.1 の違い、Git Bash との混在、execution policy、profile script を確認する。広い allow rule がある場合は、作業ディレクトリ変更と workspace 外読み取りの検証を入れる。

第三に、permission rules を最小化する。`PowerShell(*)` や `Bash(*)` のような広い rule は、便利だがレビューが難しい。`dotnet build`、`npm test`、`git status` のように command を絞れるものは絞る。wildcard rule は、引数に path や shell metacharacter を含められるかを確認する。

第四に、worktree boundary を検証する。AI 用 worktree から main checkout、shared `.git`、hooks、config、parent directory へ書けないことを確かめる。cleanup、branch 作成、rebase、push、artifact 出力、test cache、package manager cache が想定 path に収まるかを見る。

第五に、MCP inventory を作る。`managed-mcp.json`、cloud MCP connectors、user-level MCP、plugin bundled MCP、local MCP server を分ける。接続先、認証方式、読み取り・書き込み範囲、ログ、owner、停止手順、費用影響を表にする。社内標準に入れる MCP は、最低限の security review と更新手順を持たせる。

第六に、usage breakdown を運用会議に入れる。月次または隔週で、team ごとの usage、重い MCP、subagent、plugin、失敗が多い workflow を見る。費用上限だけでなく、不要な connector、過剰な agent fan-out、古い plugin、標準外 tool の広がりを検出する。

## ガバナンス上の落とし穴

一つ目の落とし穴は、Claude Code の更新を個人任せにすることだ。個人端末では最新でも、CI image、VDI、社内配布 script、委託先環境が古いことはあり得る。AI コーディングツールは、端末だけでなく automation にも入り始めているため、version drift を前提に管理するべきだ。

二つ目は、MCP を developer convenience とだけ見ることだ。MCP は API token、OAuth、file access、SaaS permissions を背負う。社内 API への read-only MCP でも、顧客情報や営業秘密へ触れるなら高リスクである。write tool を持つ MCP は、さらに承認と監査が必要になる。

三つ目は、Compliance API などの監査機能と、ローカル Claude Code 実行の境界を混同することだ。企業向け監査統合があっても、ローカル shell がどの command を実行し、どの file を読んだかをすべて同じ粒度で見られるとは限らない。Claude Enterprise、Claude Platform、Claude Code、MCP、CI、OS audit log を分けて考える必要がある。

四つ目は、Windows を例外扱いすることだ。AI 開発の情報発信は macOS/Linux 前提になりがちだが、企業 IT では Windows が普通に残る。PowerShell の挙動は Bash と違い、権限解析の難しさも違う。Windows runner を使うチームほど、今回の修正を実運用のチェック項目に入れたい。

## まとめ

Claude Code `2.1.149` は、派手なモデル更新ではない。しかし、AI コーディングエージェントを組織で使ううえでは重要な release である。PowerShell の作業ディレクトリ追跡、PowerShell allow rule、permission analysis、git worktree sandbox、MCP 管理設定、usage breakdown は、すべて実行環境の信頼境界に関わる。

日本企業が取るべき姿勢は、単に「最新版へ上げる」では足りない。Windows 混在環境、CI、worktree、社内 MCP、cloud MCP connectors、plugin、usage、監査ログを一つの運用設計として見る必要がある。Claude Code が個人の補助ツールから企業の開発基盤へ進むほど、AI の賢さよりも、どの権限でどの tool を実行できるかが導入可否を決める。

今回の更新は、その点検にちょうどよい区切りになる。まず Windows と PowerShell を通る経路、worktree isolation、MCP inventory、usage breakdown を確認する。そこまでできて初めて、Claude Code を安全にチーム標準へ寄せられる。

## 出典

- [Claude Code Changelog](https://code.claude.com/docs/en/changelog) - Claude Code Docs, 2026-05-23 / 2026-05-22
- [anthropics/claude-code CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) - GitHub
- [@anthropic-ai/claude-code 2.1.149 package metadata](https://security.snyk.io/package/npm/%40anthropic-ai%2Fclaude-code/2.1.149) - Snyk, 2026-05-22
- [Major Updates in Claude Code v2.1.149 to v2.1.150](https://dev.classmethod.jp/en/articles/20260524-claude-code-updates-v2-1-150/) - DevelopersIO, 2026-05-24
