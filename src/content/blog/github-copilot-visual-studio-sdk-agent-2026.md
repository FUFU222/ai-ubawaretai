---
title: 'Copilot Visual Studio新Agent、.NET統制を再設計'
description: 'Copilot Visual Studio新Agentを整理。日本の.NET/Azure開発組織がSDK共通化、built-in skills、組織指示、選択コードレビューをどう標準IDE運用へ落とすか解説する。'
pubDate: '2026-07-31'
category: 'news'
tags: ['GitHub Copilot', 'Visual Studio', '.NET', 'AIエージェント', '管理者設定', '開発者ツール', '日本企業']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月30日**、GitHub Copilot in Visual StudioのJuly updateを公開した。中心は、Copilot Chat内の**Agent (Preview)**、.NET/Azureチームが作ったbuilt-in skills、選択範囲コードレビュー、organization-level custom instructionsである。Microsoft側のVisual Studio Blogでは、同じ更新を2026年7月28日に「GitHub Copilot SDKで動く新Agent」として詳しく説明している。

これは、以前の[Visual Studioからcloud agentを直接起動する更新](/blog/github-copilot-visual-studio-cloud-agent-2026/)や、[Visual StudioのMCP trustと使用量管理](/blog/github-copilot-visual-studio-mcp-usage-cpp-2026/)の続きとして読むと分かりやすい。4月はIDEから非同期のcloud agentへ作業を渡す入口、6月はMCPや使用量通知を含む統制面が焦点だった。今回は、Visual Studio内のAgent体験をCopilot SDKへ寄せ、.NET/Azureの専門知識と組織共通指示をIDE内に持ち込む更新だ。

日本の.NET/Azure開発組織では、Visual Studioは単なる個人ツールではない。標準端末、社内テンプレート、業務アプリの保守、委託先との開発ルール、Azure運用、C++資産が絡む。そのため今回のCopilot Visual Studio更新は「新しいAI機能」ではなく、標準IDEに入るAIエージェントをどう統制するかという問題として扱うべきだ。

## 事実: Copilot SDKベースの新AgentがPreviewになった

GitHub Changelogは、Visual StudioのCopilot Chatに新しい**Agent (Preview)**が追加されたと説明している。このAgentは、GitHub Copilot CLIを支えるものと同じGitHub Copilot SDKを基盤にしており、agent pickerから選択できる。GitHubは、少ない往復でタスクを進め、応答を短くスキャンしやすくしたと位置づけている。

MicrosoftのVisual Studio Blogも同じ点を補足している。ユーザーがCLI、GitHub app、VS Code、Visual Studioの間で作業を移しやすくするため、Copilotのsurface間で体験をそろえる狙いがある。つまり、Visual Studioだけの独立機能ではなく、Copilot全体の実行基盤をSDKでそろえる方向だ。

ここは以前の[Copilot CLI遠隔操作GA](/blog/github-copilot-cli-remote-control-ga-2026/)ともつながる。CLIとVisual StudioのAgentが同じSDKへ寄るなら、チームは「CLI用の作業」「IDE用の作業」を完全に分けるのではなく、どのタスクをどのsurfaceで始め、どこでレビューするかを設計する必要がある。Visual Studioを標準IDEにする組織では、CLIで始めた作業をVisual Studioでレビュー・継続する流れも現実的になる。

## 事実: .NET/Azure built-in skillsは既定オフで入る

今回の更新では、Visual Studioに.NETチームとAzureチームが作ったbuilt-in skillsも入った。Microsoftは、該当する.NETまたはAzure workloadがインストールされている場合、tool pickerのBuilt-inカテゴリに表示されると説明している。各skillは説明やパスを確認でき、既定ではオフで、必要なものだけを有効にする設計だ。

この「既定オフ」は重要だ。.NET/Azureの専門家が作ったskillであっても、すべてのリポジトリに無条件で合うわけではない。社内の古い.NET Framework、独自のAzure landing zone、閉域接続、監査要件、命名規則、IaC標準がある場合、一般的な助言がそのまま正解になるとは限らない。

日本企業の実務では、built-in skillsを「Microsoftが用意した公式っぽい便利機能」として全員に有効化するより、代表リポジトリで出力を確認し、社内標準に合うskillだけを許可するほうがよい。特にAzure運用では、権限、リージョン、ログ、コストセンター、タグ設計が企業ごとに違う。skillは専門知識の入口であって、社内設計基準の代替ではない。

## 事実: 選択コードレビューと組織指示がVisual Studioへ寄る

GitHub Changelogは、Visual Studioのeditorでコードを選択し、右クリックからCopilot Actions、Review Selectionを選べるようになったとも説明している。選択したコードに対してinline commentを受け取り、sparkle iconから提案適用や生成を進められる。これはGitHub Copilot code reviewに支えられている。

この更新は、[Copilot code reviewスキルMCP一般提供](/blog/github-copilot-code-review-skills-mcp-ga-2026/)で扱った流れのIDE側の入口と見られる。PR全体のレビューだけでなく、実装途中の小さな範囲をVisual Studio内で確認できる。レビューをPR末尾へ寄せすぎると手戻りが大きいチームでは、選択範囲レビューを「実装中の第二意見」として使える。

もう一つの重要点は、organization-level custom instructionsだ。GitHub organization ownersは、組織全体に共通するCopilot応答の好みを設定できる。Visual Studio Blogは、これはpolicy enforcementではなくpreference設定だと明記している。対象リポジトリがGitHub organizationに属する場合、自動的に参照され、ユーザーは参照リストから内容を読める。必要ならVisual Studio側の設定で無効化できる。

これは便利だが、統制として過信してはいけない。organization-level custom instructionsは、社内の命名規則、テスト方針、説明文の粒度、コードスタイルを広く伝えるには向く。しかし、セキュリティポリシーや法務上の禁止事項を強制する仕組みではない。強制したい内容は、branch protection、CODEOWNERS、CI、secret scanning、MCP allowlist、Copilot enterprise policyと組み合わせる必要がある。

## 分析: Visual Studioは.NET現場のAI実行面になりつつある

ここからは分析だ。

今回の更新で見えるのは、Visual Studio上のCopilotが「補完とチャット」から「SDK共通Agent、専門skill、局所レビュー、組織共通指示」へ広がっていることだ。Visual Studioを標準IDEにする日本企業では、これは開発者個人の生産性施策ではなく、開発基盤の運用設計になる。

Visual Studio現場には、VS Code中心のWeb開発とは違う制約がある。Windows端末、社内証明書、プロキシ、Active Directory、Visual Studio Build Tools、古いC++ toolset、.NET Framework、Azure subscription、顧客別の開発環境が絡む。AI Agentが作業を進めるなら、どの文脈を読ませるか、どのskillを許すか、どのコードをレビュー対象にするか、どの組織指示を優先するかを整理しないと、個人ごとに出力がぶれる。

特に重要なのは、Copilot SDK共通化によってsurface間の境界が薄くなる点だ。CLI、GitHub app、VS Code、Visual Studioで似たAgent体験になれば、利用者は最も手元に近いsurfaceから作業を始める。管理者側は、Visual Studioだけを管理すればよい、CLIだけを禁止すればよい、という発想では追いつかない。共通の作業分類、権限、費用、レビュー手順が必要になる。

## 実務: 90日で確認する導入順序

最初の30日は、対象チームを絞ってAgent (Preview)の作業範囲を決める。機能追加、バグ修正、リファクタ、テスト補修、Azure設定確認のように、日常作業を分類する。Visual Studio内のAgent、CLI、cloud agentを同じタスクで比較し、どのsurfaceが実務に合うかを見る。ここで重要なのは、成功率だけでなく、人間がレビューする時間、再実行の回数、PR差分の説明しやすさを記録することだ。

次の30日は、built-in skillsとorganization-level custom instructionsを設計する。.NET/Azure skillsは、代表リポジトリで出力を確認し、社内標準に合うものだけを利用ガイドへ載せる。organization-level custom instructionsには、命名規則、テストの期待、例外処理、ログ方針、ドキュメントの書き方など、好みとして配れる内容を書く。セキュリティ上の強制事項はここへ閉じ込めず、CIやレビュー規則へ置く。

最後の30日は、選択コードレビューをPR運用に組み込む。Review Selectionは、PR提出前の局所確認として使いやすい。ただし、Copilotの指摘をそのまま正解にせず、通常のレビュー基準に乗せる。特に金融、製造、医療、公共系の業務アプリでは、例外処理、ログ、個人情報、性能、権限境界の確認を人間レビューに残す。

あわせて、[Copilot既定モデル有効化](/blog/github-copilot-default-model-enablement-policy-2026/)で整理したモデルポリシーも確認したい。Agentやcode reviewの体験は、利用できるモデル、プラン、管理者ポリシー、AI Creditsの設計に左右される。Visual Studioの新Agentを試すなら、同時にどのモデルを許可し、どのチームに予算を持たせるかを見直すほうがよい。

## まとめ

Copilot Visual Studioの2026年7月更新は、GitHub Copilot SDKベースの新Agent、.NET/Azure built-in skills、選択コードレビュー、organization-level custom instructionsをまとめてVisual Studioへ入れた。これは、.NET/Azure開発組織にとって標準IDEのAI化が一段進んだという意味を持つ。

日本企業が見るべき点は、新Agentをすぐ全社展開することではない。Copilotのsurface間で作業が移る前提に立ち、Visual Studio、CLI、cloud agent、code review、組織指示を同じ運用表で管理することだ。まず代表チームで作業分類、skill許可、組織指示、レビュー基準を確認し、使える範囲を広げていくのが現実的である。

## 出典

- [GitHub Copilot in Visual Studio - July update](https://github.blog/changelog/2026-07-30-github-copilot-in-visual-studio-july-update/) - GitHub Changelog, 2026-07-30
- [Visual Studio July Update - Meet the New Agent, Powered by the GitHub Copilot SDK](https://devblogs.microsoft.com/visualstudio/visual-studio-july-update-meet-the-new-agent-powered-by-copilot-sdk/) - Visual Studio Blog, 2026-07-28
- [Plans for GitHub Copilot](https://docs.github.com/copilot/get-started/plans) - GitHub Docs
- [Visual Studio 2026 release notes](https://learn.microsoft.com/visualstudio/releases/2026/release-notes) - Microsoft Learn
