---
title: 'Copilot code reviewスキルMCP一般提供、PR監査の新条件'
description: 'Copilot code reviewのAgent skillsとMCP一般提供を整理。日本企業がPRレビュー、MCP設定、read-only制約、監査ログをどう運用へ落とすべきか解説する。'
pubDate: '2026-07-30'
category: 'news'
tags: ['GitHub Copilot', 'コードレビュー', 'MCP', 'AIエージェント', '管理者設定', '開発者ツール', '日本企業']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月29日**、**Copilot code reviewのAgent skillsとMCPを一般提供**にした。対象はGitHub Copilot Pro、Pro+、Business、Enterpriseで、Copilot code reviewが関連するAgent skillsやMCP serverを使い、pull requestの差分だけでは足りない文脈を取り込んでレビューできるようになる。

この更新は、単なる「レビューAIが賢くなった」という話ではない。MCP server、Agent skills、repository settings、Copilot Secrets and variables、監査ログ、既存のcloud agent設定がPRレビューに接続されるという話だ。日本企業でCopilot code reviewを本番運用に入れているなら、[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/)と[Copilot code review、AGENTS.mdでPR規約を反映](/blog/github-copilot-code-review-agents-md-2026/)の続きとして読む必要がある。

さらに、今回のMCP適用はCopilot appやcloud agentの管理面ともつながる。[Copilot app独立policy、既定有効を管理する方法](/blog/github-copilot-app-policy-managed-settings-2026/)で扱ったmanaged settings、[Copilotセッション監査API、EMU企業の導入設計](/blog/github-copilot-agent-session-streaming-api-2026/)で扱ったsession recordと合わせて、PRレビューAIを開発基盤の一部として棚卸ししたい。

## 事実: Agent skillsとMCPがcode reviewでGAになった

GitHub Changelogによると、Copilot code reviewはGA後、PRに関連するAgent skillsとMCP serversを利用できる。GitHubは例として、repositoryに置いたAgent skillを使い、UI変更のPRでPlaywright MCPを呼び出して変更箇所のスクリーンショットを確認する流れを示している。

Agent skillsは、Copilot coding agentやCopilot code reviewに特定作業の手順、観点、制約を渡すための仕組みである。GitHub Docsでは、skillsはrepository内の`.github/skills`などで管理でき、フロントマター、説明、手順を含むMarkdownとして扱われる。レビュー用途では、「React画面変更ではアクセシビリティとスクリーンショットを確認する」「DB migrationではrollbackとbackfillを確認する」のように、作業種別ごとのレビュー手順を定義できる。

MCPは外部ツールや文脈をCopilotへ接続するための標準である。GitHub Docsは、repository settingsからMCP serversを設定し、JSON形式の構成、Secrets and variables、ツール承認の設定を扱えると説明している。今回のGAにより、Copilot code reviewはpull requestの変更だけでなく、許可されたMCP serverを通じて、関連する情報や確認ツールを使える場面が増える。

重要なのは、Copilot code reviewでのMCP tool callsが**read-only**に制限される点だ。PRレビュー中に外部ツールへ接続できるからといって、任意の変更や書き込みを任せられるわけではない。レビューAIは文脈を取りに行き、確認し、コメントする位置づけである。修正実行やPR作成を担うcloud agentとは、権限境界を分けて理解する必要がある。

## 事実: 既定MCPとcloud agent設定の継承に注意する

GitHubの発表では、GitHub MCP serverとPlaywright MCP serverが全リポジトリで既定有効になる。さらに、すでにCopilot coding agentでMCPを設定しているrepositoryでは、同じMCP serversがCopilot code reviewでも利用される。これは便利だが、運用上は見落としやすい。

たとえば、cloud agentのためにMCP serverを設定していたリポジトリでは、PRレビューAIもそのMCPを使えるようになる可能性がある。開発者は「作業agent用の設定」と思っていても、レビュー面にも広がる。GitHub DocsのMCP設定では、repository adminがMCP serverを有効化し、Copilotが使えるtoolsを制御できる。Copilot Secrets and variablesを使えば、MCP serverが必要とする認証情報も管理できる。

日本企業では、この継承が大きい。社内チケット、デザイン、テスト結果、browser検証、API仕様、SaaS監視、脆弱性管理などにMCPをつないでいる場合、PRレビューAIがどの文脈へアクセスできるかを説明できなければならない。read-onlyでも、情報取得の範囲は監査対象になる。

また、Playwright MCPが既定有効という点は、フロントエンドチームに直接効く。UI変更のレビューで、スクリーンショットやページ状態を確認しやすくなる一方、テスト対象URL、認証、seed data、feature flag、個人情報を含む画面をどう扱うかを決める必要がある。便利な自動確認を入れる前に、検証環境とデータ区分を整理したい。

## 分析: PRレビューの質は「差分」から「周辺文脈」へ広がる

ここからは分析だ。

これまでのAIレビューは、主にdiff、repository内のinstructions、周辺ファイル、既存の設定を基にコメントするものだった。もちろん、それだけでも有用だ。しかし実務のPRレビューでは、差分だけでは判断できないことが多い。UI変更なら実際の見た目、API変更なら利用側の契約、インフラ変更なら環境差、DB変更ならmigration結果、セキュリティ変更なら過去のincident文脈が関係する。

Agent skillsとMCPがcode reviewへ入ると、レビューAIに「どの作業では何を確認するか」と「確認に必要な外部文脈へどう到達するか」を渡せる。これはレビュー品質を上げる可能性がある。たとえば、frontend skillがPlaywright MCPで画面を確認し、accessibility観点をコメントする。Security skillがGitHub MCPで関連issueやCodeQL alertを確認する。Platform skillがinfra差分とrunbookの整合を確認する。

ただし、MCPを増やせばレビューが良くなるわけではない。外部文脈が増えるほど、誤った文脈、古い文脈、権限が広すぎる文脈、レビューに不要な機密情報も入りやすくなる。AIレビューが「見られるもの」は、組織が許可した情報資産である。PRレビューAIに外部ツールを使わせるなら、どのserverを誰が管理し、どのtoolsを許可し、どのsecretを使い、どのログを残すかを決める必要がある。

また、レビューAIが外部文脈を使ったコメントを出すと、人間reviewerはその根拠を確認したくなる。MCP tool callの内容や取得元が追えないと、AIのコメントが正しいのか、誤った外部情報に引っ張られたのかを判断しにくい。したがって、MCPの導入はレビュー精度だけでなく、説明可能性の設計でもある。

## 実務: まず4つの台帳をそろえる

最初にそろえるべき台帳は、**Copilot code review有効リポジトリ一覧**である。どのorganization、repository、teamでCopilot code reviewを使っているか、required reviewに近い扱いなのか、任意の補助レビューなのか、人間reviewerの責任分界はどうなっているかを並べる。AIレビューが増えるほど、利用面の把握なしにMCPだけを設定しても運用できない。

2つ目は、**Agent skills一覧**である。`.github/skills`にあるskills、owner、対象領域、更新日、レビュー観点、使うMCP、必要なsecret、適用条件をまとめる。skillsは便利だが、古い手順が残るとAIレビューのコメント品質が落ちる。社内レビュー標準や設計標準をskills化するなら、通常のドキュメントと同じようにownerと更新責任を置くべきだ。

3つ目は、**MCP server一覧**である。GitHub MCP、Playwright MCP、社内MCP、SaaS連携MCPを分け、read-onlyで何が取得できるか、どのsecretを使うか、外部送信先はどこか、ログはどこに残るかを記録する。cloud agent用に設定済みのMCPがcode reviewにも適用されるなら、特に明示しておく。

4つ目は、**監査と費用の一覧**である。Copilot code reviewの実行回数、AI Credits、Actions minutes、session記録、MCP tool callの記録、SIEMやPurviewへの転送有無を同じ表に置く。レビューAIのコメント数だけを見ても、実行基盤と外部文脈のリスクは分からない。

## 注意点: read-onlyでも情報ガバナンスは必要

MCP tool callsがread-onlyに制限されることは、導入の安心材料になる。PRレビュー中に外部システムへ書き込んだり、issueを勝手に変更したり、テスト環境を壊したりするリスクは抑えられる。

しかし、read-onlyは「低リスク」ではあっても「無リスク」ではない。read-onlyでも、顧客名、障害情報、脆弱性の詳細、未公開ロードマップ、社内URL、個人情報、設計上の弱点を取得できる可能性がある。AIレビューの文脈に入った情報は、コメント生成、session記録、監査ログ、SIEM転送先の権限設計と結びつく。

特に日本企業では、委託先やグループ会社が同じrepositoryへ参加しているケースがある。MCP serverが内部情報へ広く読める場合、PR作成者やreviewerの範囲とMCPが読める範囲がずれるかもしれない。Copilot code reviewに使わせるMCPは、リポジトリ参加者全員が間接的に利用する可能性があるものとして扱ったほうがよい。

実務上は、最初から全社MCPをつなぐのではなく、GitHub MCPとPlaywright MCPの既定状態を確認し、非機密リポジトリでAgent skillを1つだけ試すのが現実的だ。そこでtool callの見え方、コメント品質、誤検知、ログ、secretの扱いを確認してから、社内MCPへ広げる。

## 30日で始める導入手順

最初の1週間は、既存のCopilot code review設定を棚卸しする。review有効repository、runner設定、content exclusion、custom instructions、AGENTS.md、既存Agent skills、MCP serverを一覧化する。cloud agent用MCPがあるリポジトリでは、code reviewでも使われる前提で確認する。

2週目は、1つのリポジトリでAgent skillを作る。対象は、UI変更、API contract、DB migration、security reviewなど、レビュー観点が明確な領域に絞る。skillには、確認すべき条件、コメントすべき重大度、コメントしない条件、使うMCPを短く書く。社内規程をそのまま貼るのではなく、Copilot code reviewがPR上で行動しやすい形式に直す。

3週目は、MCPを最小構成で試す。Playwright MCPで画面確認をするなら、検証URL、認証、seed data、個人情報を含まないfixtureを整える。GitHub MCPを使うなら、関連issueやCodeQL alertを読む目的に限定する。社内MCPは、read-onlyであっても最初は非機密データに限定したほうがよい。

4週目は、レビュー結果を人間reviewerと比較する。AIが拾った重要指摘、人間が再指摘した点、AIが外部文脈を誤読した点、tool callが不要だった点を分類する。採用率だけでなく、誤検知、見落とし、説明可能性、費用、ログ閲覧権限を見て、次に広げるrepositoryを決める。

## まとめ

Copilot code reviewのAgent skillsとMCP一般提供は、AIレビューを差分コメントから、リポジトリ固有の手順と外部文脈を使うレビュー基盤へ進める更新である。GitHub MCPとPlaywright MCPが既定有効になり、既存のcloud agent用MCP設定がcode reviewにも適用される点は、運用上の重要な変更だ。

日本企業は、便利なレビュー自動化としてだけ見ないほうがよい。Agent skillsはレビュー標準、MCPは情報取得経路、Copilot Secrets and variablesは認証情報、session recordは監査証跡になる。まずは有効repository、skills、MCP、監査ログを台帳化し、read-onlyの範囲を説明できる状態で段階導入するべきである。

## 出典

- [Copilot code review: Agent skills and MCP now generally available](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/) - GitHub Changelog, 2026-07-29
- [Configure MCP servers for your repository](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers) - GitHub Docs
- [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) - GitHub Docs
- [Shape Copilot code review around your team](https://github.blog/changelog/2026-06-02-shape-copilot-code-review-around-your-team/) - GitHub Changelog, 2026-06-02
