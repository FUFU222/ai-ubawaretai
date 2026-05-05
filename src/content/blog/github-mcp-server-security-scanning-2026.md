---
title: 'GitHub MCP Serverで秘密情報と依存関係を事前検査'
description: 'GitHub MCP Serverのsecret scanning一般提供とdependency scanning公開プレビューを整理。日本の開発チームがAIエージェントに作業を任せる前に、秘密情報、依存関係、MCP権限をどう点検すべきかを解説する。'
pubDate: '2026-05-06'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'MCP', 'サプライチェーンセキュリティ', 'セキュリティ', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHub が **2026年5月5日** に、GitHub MCP Server 経由の **secret scanning** を一般提供し、同じ MCP Server 経由の **dependency scanning** を公開プレビューとして出した。どちらも派手なモデル更新ではないが、GitHub Copilot CLI や Visual Studio Code の Copilot Chat で AI エージェントに作業を任せる前に、秘密情報や脆弱な依存関係を確認するための重要な更新だ。

この動きは、以前取り上げた [GitHub DependabotのAIエージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) と同じ方向にある。GitHub は「検知してから人が読む」だけではなく、開発者がコミットやプルリクエストを作る前の作業面にセキュリティ機能を近づけている。さらに [GitHub Copilot SDKの公開](/blog/github-copilot-sdk-public-preview-2026/) や [Copilot code reviewの課金変更](/blog/github-copilot-code-review-actions-minutes-2026/) と合わせると、Copilot は補完ツールから、権限、課金、監査、セキュリティを含む開発基盤へ寄っている。

以下では、まず公式情報で確認できる事実を整理し、そのうえで日本の開発チーム、AppSec、情シスがどう扱うべきかを分けて考える。

## 事実: secret scanningはMCP Server経由で一般提供になった

GitHub Changelog によると、GitHub MCP Server の secret scanning は **2026年3月から公開プレビュー**で提供されており、5月5日に一般提供へ進んだ。対象は GitHub Secret Protection が有効なリポジトリだ。MCP 対応の AI コーディングエージェントや IDE、たとえば GitHub Copilot CLI や Visual Studio Code から、コミット前またはプルリクエスト前に現在の変更をスキャンできる。

今回の一般提供で重要なのは、MCP Server 内の secret scanning tools が、既存の push protection customization を尊重するようになった点だ。つまり、リポジトリや組織で設定済みの検出ルール、バイパス挙動、運用方針と、エージェント経由の検査を揃えられる。AI エージェント専用の別ルールを増やすより、既存の GitHub Advanced Security 運用に乗せやすい。

GitHub Docs でも、GitHub MCP Server とのやり取りでは、AI 生成レスポンス内の秘密情報や、issue 作成などの代理操作に含まれる秘密情報を push protection がブロックすると説明されている。公開リポジトリでは標準で保護され、GitHub Advanced Security 対象の private repository でも保護が効く。これは「AI がコードを書いたあとに検査する」だけでなく、「AI が返す内容そのものに秘密情報が混ざる」経路を GitHub が意識していることを示す。

使い始めの導線も現実的だ。Copilot CLI では Advanced Security plugin を `/plugin install advanced-security@copilot-plugins` で入れ、VS Code では advanced-security agent plugin を入れて `/secret-scanning` から始める。開発者は「現在の変更に露出した秘密情報がないか見てほしい」と頼む形で検査を呼べる。

## 事実: dependency scanningはDependabot toolsetとして公開プレビュー

同じ 5月5日に、GitHub MCP Server の dependency scanning も公開プレビューになった。こちらは Dependabot alerts が有効なリポジトリ向けで、GitHub MCP Server の `dependabot` toolset として提供される。

公式説明では、AI コーディングエージェントが依存関係の脆弱性確認を求められると、toolset が GitHub Advisory Database を参照し、影響を受ける package、severity、推奨される修正バージョンを構造化して返す。より深い post-commit の確認では、Dependabot CLI をローカルで動かし、変更前後の dependency graph を比較することもできるとされている。

ここで注目すべきなのは、Dependabot の役割が単なる通知から、エージェントが作業中に呼び出すセキュリティ確認へ広がっている点だ。従来の Dependabot alerts は、すでに入っている依存関係の問題をリポジトリ側で検出する面が強かった。MCP Server 経由の dependency scanning は、開発者が branch 上で新しい package や version を追加した段階で、「このまま commit してよいか」を聞ける。

Copilot CLI では GitHub MCP Server があらかじめ入っており、`copilot --add-github-mcp-toolset dependabot` で session に `dependabot` toolset を追加する導線が案内されている。VS Code では GitHub MCP Server headers に `"X-MCP-Toolsets": "dependabot"` を加えるか、Copilot Chat の toolset selector で Dependabot を選ぶ。つまり、運用上の焦点は「機能があるか」よりも、「誰にどの toolset を開けるか」に移る。

## 分析: AIエージェントの作業前チェックが標準化し始めた

ここからは分析だ。

今回の更新を単体で見ると、secret scanning と dependency scanning が MCP Server に載っただけに見える。しかし実務上の意味はもう少し大きい。AI コーディングエージェントがコードを変更し、issue を読み、PR を作り、時には依存関係まで触るなら、レビュー後の検査だけでは遅い。GitHub はセキュリティ確認を、エージェントが作業している最中の tool call として扱い始めている。

これは [Cursor Security Review](/blog/cursor-security-review-beta-2026/) が MCP 経由で SAST、SCA、secrets scanner をつなぐ方向と近い。違いは、Cursor がエディタ側のセキュリティエージェントとして見せているのに対し、GitHub は Secret Protection、Dependabot、Advisory Database、Copilot CLI、VS Code Copilot Chat を自社の開発基盤上で接続していることだ。日本企業にとっては、すでに GitHub Advanced Security を使っているなら、既存ルールを AI エージェント導線へ延ばしやすい。

また、MCP の toolset 構成は、AI エージェント時代の権限設計そのものだ。GitHub Docs は、GitHub MCP Server で使う機能群を toolsets として有効化、無効化できると説明している。さらに、必要な toolset だけを有効にすることは、性能だけでなくセキュリティにも効く。余計な tools が減れば、エージェントが間違った tool を選ぶリスクも、コンテキストを圧迫する負荷も下がる。

## 日本企業で効くのはAPIキーとOSS依存の手前確認

日本の開発組織でまず効きそうなのは、API キーや cloud credential の漏えい対策だ。AI エージェントに修正を頼むと、環境変数、`.env`、サンプル設定、CI 設定、デバッグログを触ることがある。人間なら「これは貼ってはいけない」と気づく場面でも、エージェントが文脈上の便利さを優先してしまう可能性は残る。MCP Server 経由の secret scanning を commit 前に呼べるなら、少なくとも最後の手前で止めやすくなる。

次に効くのは、OSS 依存の追加判断だ。日本の SaaS、金融、製造、公共系 SI では、依存関係の脆弱性が見つかったあとに対応が遅れるより、そもそも危険な version を branch に入れないほうが安い。dependency scanning が Advisory Database と推奨修正 version を返すなら、レビュー担当は「この package を入れるべきか」「別 version にするべきか」を早く判断できる。

一方で、これは完全自動承認の根拠にはならない。secret scanning は漏えいしやすい既知パターンに強いが、業務上の秘密情報や社内識別子をすべて理解するわけではない。dependency scanning も既知脆弱性には効くが、ライセンス、保守状況、package の信頼性、transitive dependency の設計判断までは別途見る必要がある。

## 導入するならMCP allowlistから決める

導入時に最初に決めるべきなのは、どのリポジトリでどの MCP toolset を開けるかだ。GitHub MCP Server には標準 toolsets があり、追加で `code_security`、`secret_protection`、`dependabot` のようなセキュリティ系 toolset を使う。便利だから全部開けるのではなく、まずは対象リポジトリと役割を絞るほうがよい。

現実的には、次の順番が扱いやすい。

1つ目は、外部公開サービスや OSS 利用が多いリポジトリで secret scanning と dependency scanning を試すこと。2つ目は、Copilot CLI と VS Code Copilot Chat のどちらを標準導線にするか決めること。3つ目は、GitHub Advanced Security の既存 push protection customization とエージェント経由の挙動が合っているかを確認すること。4つ目は、バイパスの承認者とログの見方を決めることだ。

特に大企業では、エージェントが使える toolset を個人裁量にしないほうがよい。MCP は便利な接続規格だが、裏を返せば AI が呼べる外部能力の一覧でもある。誰が、どの agent surface から、どの repository に対して、どの GitHub capability を呼べるかを棚卸しする必要がある。

## まとめ

GitHub MCP Server の secret scanning 一般提供と dependency scanning 公開プレビューは、AI 開発支援の競争軸が「賢く書く」から「安全に作業へ入る」へ移っていることを示す更新だ。

日本の開発チームは、これを新しい便利機能としてだけ見るべきではない。Copilot CLI、VS Code Copilot Chat、GitHub MCP Server、Secret Protection、Dependabot alerts、Advisory Database がつながることで、AI エージェントが変更を作る前後にセキュリティ確認を挟めるようになる。重要なのは、最初から広く開放することではなく、既存の GitHub Advanced Security 運用と MCP toolset 権限を合わせることだ。

AI エージェントに任せる範囲が広がるほど、作業前チェックの価値は上がる。今回の GitHub 更新は、そのチェックポイントを GitHub の開発体験の中に置き始めたという意味で、かなり実務的なニュースだ。

## 出典

- [Secret scanning with GitHub MCP Server is now generally available](https://github.blog/changelog/2026-05-05-secret-scanning-with-github-mcp-server-is-now-generally-available/) - GitHub Changelog, 2026-05-05
- [Dependency scanning with GitHub MCP Server is in public preview](https://github.blog/changelog/2026-05-05-dependency-scanning-with-github-mcp-server-is-in-public-preview/) - GitHub Changelog, 2026-05-05
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs
- [Working with push protection and the GitHub MCP server](https://docs.github.com/en/code-security/concepts/secret-security/working-with-push-protection-and-the-github-mcp-server) - GitHub Docs
