---
title: 'GitHub Copilot CLI企業管理、プラグイン標準配布の実務'
description: 'GitHub Copilot CLIの企業向けプラグイン管理公開プレビューを整理。日本の開発組織がMCP、hooks、社内エージェントをどう標準配布し統制すべきかを実務向けに解説する。'
pubDate: '2026-05-07'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'Copilot CLI', 'AIエージェント', '開発者ツール', 'エンタープライズAI']
draft: false
series: 'github-copilot-2026'
---

GitHub が **2026年5月6日** に、GitHub Copilot CLI の **enterprise-managed plugins** を公開プレビューとして出した。これは「CLI に拡張機能が増えた」という小さな話ではない。企業管理者が、Copilot CLI 利用者に対して、承認済みの plugin marketplace と自動インストール対象 plugin を標準配布できるようになったという話だ。

日本の開発組織にとって重要なのは、AI エージェントの設定が個人の端末ごとの工夫から、企業標準として配れる段階に入ったことだ。すでにこのサイトでは [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) を扱ったが、今回の更新はその前段にある。どの MCP 設定、hooks、社内 plugin を Copilot CLI に入れてよいのかを、企業側が配布面から決められるようになる。

さらに [GitHub Copilot SDKがパブリックプレビュー公開](/blog/github-copilot-sdk-public-preview-2026/) や [GitHub CopilotのVisual Studio更新でcloud agent直起動へ](/blog/github-copilot-visual-studio-cloud-agent-2026/) と合わせると、GitHub は Copilot を単なる IDE 補助ではなく、CLI、SDK、cloud agent、MCP、管理者設定を含む開発基盤へ寄せている。今回の記事では、公式情報で確認できる事実と、日本企業が導入前に決めるべき論点を分けて整理する。

## 事実: 企業管理者がCopilot CLI pluginを標準配布できる

GitHub Changelog によると、enterprise administrator は Copilot CLI ユーザー向けに plugin を構成し、企業全体へ配布できる。GitHub は、これにより baseline standards を企業内で共有し、すべてのユーザーの Copilot CLI client で利用可能にできると説明している。

ここでいう plugin は、単なる小さな補助コマンドに限らない。GitHub の説明では、plugin は複数の extensibility type を支え、custom agents や skills の共有、hooks、MCP configuration の常時有効化に使える。つまり、企業が標準化したい「AI エージェントの振る舞い」を CLI に配る導線だ。

今回の公開プレビューで中心になるのは、`.github-private/.github/copilot/settings.json` だ。GitHub Copilot CLI は、Copilot Business または Copilot Enterprise の enterprise account に紐づくユーザーが認証したとき、この設定を自動で取得して適用する。管理者は plugin marketplace を定義し、認証時に自動インストールする plugin も指定できる。

これは日本企業ではかなり実務的だ。AI エージェントの利用が増えると、各開発者が自分で MCP server や hooks を入れ始める。最初は早いが、次第に「誰がどの plugin を使っているか」「社内規程に合わない tool call がないか」「レビュー時に再現できるか」が問題になる。企業管理 plugin は、そのばらつきを抑えるための配布面になる。

## settings.jsonで何を指定するのか

GitHub Docs では、企業の `.github-private` リポジトリ内に `.github/copilot/settings.json` を置く手順が説明されている。対象者は enterprise owners で、機能は公開プレビューのため変更される可能性がある。

設定ファイルの主要なプロパティは 2 つだ。

1つ目は `extraKnownMarketplaces`。これは Copilot CLI ユーザーに追加で見せる plugin marketplace を定義する。各 marketplace は名前を持ち、source として GitHub repository を `OWNER/REPO` 形式で指定する。

2つ目は `enabledPlugins`。これは企業ユーザーに自動インストールする plugin を定義する。キーは `PLUGIN-NAME@MARKETPLACE-NAME` 形式で、値を `true` にする。設定が default branch に commit されると、企業ユーザーは次回 Copilot CLI で認証したときに、指定された marketplace と plugin を見る。

この構造は、企業内の「AI 開発ツール配布」にかなり近い。従来なら、README、Slack 告知、端末セットアップ手順、オンボーディング資料でばらばらに配っていた設定を、Copilot CLI の認証導線へ寄せられる。特に社内標準の MCP server、レビュー前 hooks、セキュリティ確認 plugin、プロジェクト固有 agent をまとめて配る用途と相性がよい。

## MCPとhooksを標準化できる意味

今回の更新で一番大きいのは、MCP configuration と hooks を企業標準として常時有効にできる点だ。

MCP は AI エージェントが外部能力を呼ぶための接続面だ。便利な反面、許可範囲を曖昧にすると、リポジトリ、issue、secret scanning、依存関係情報、社内ツールなどへ広く触れる経路にもなる。先に取り上げた [GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) のように、MCP はセキュリティ確認にも使えるが、開け方を間違えると統制対象そのものになる。

hooks も同じだ。pre-tool use や post-tool use のような制御を plugin として配れれば、AI がコマンドを実行する前に警告したり、特定の操作後にログや検査を走らせたりできる。これは「エージェントを禁止する」より現実的だ。開発者が使う CLI の流れに、企業の最低限のガードレールを差し込める。

GitHub は同日の別 Changelog で、VS Code 側の Copilot 更新もまとめている。そこでは、agent が open terminal に read/write できること、browser tab を文脈として共有できること、Copilot Business / Enterprise で BYOK が広がること、管理者が agent の到達可能 domain を group policy で制御できることが説明されている。つまり、GitHub はエージェントの能力を広げる一方で、企業管理の面も同時に増やしている。

## 日本企業で効く導入シナリオ

日本企業でまず効くのは、オンボーディングだと思う。新しい開発者が Copilot CLI を使い始めるとき、社内標準 plugin、承認済み MCP server、基本 hooks、セキュリティ確認手順を毎回手作業で入れるのは弱い。settings.json で自動インストールできれば、最初から同じ基準で始められる。

2つ目は、複数プロジェクトをまたぐ agent 標準化だ。大企業や SI では、同じ会社内でもチームごとに開発ルールが違う。すべてを 1 つに統一する必要はないが、最低限の禁止事項、ログ方針、秘密情報検査、依存関係確認は企業標準としてそろえたい。Copilot CLI plugin を配布面にすれば、プロジェクト固有設定と企業標準を分けやすい。

3つ目は、監査と説明責任だ。AI エージェント導入では、モデル性能よりも「どの設定で動いたか」を後から説明できるかが問題になりやすい。個人が手元で入れた plugin に依存すると、再現性が落ちる。企業管理 plugin なら、少なくとも配布した marketplace と enabled plugin の一覧は `.github-private` 側で管理できる。

4つ目は、コスト統制との接続だ。[GitHub CopilotでGPT-5.5一般提供開始](/blog/github-copilot-gpt-55-general-availability-2026/) で見たように、Copilot は高性能モデルや agentic workflow の広がりとともに、premium request の管理が重要になっている。plugin 配布そのものは課金設定ではないが、どの agent surface で何を許すかをそろえることは、無駄な試行や高コストな再実行を減らす土台になる。

## 導入前に決めるべきガードレール

導入前に最初に決めるべきなのは、誰が `.github-private` の設定を変更できるかだ。ここは enterprise owner だけの作業に見えても、実際には開発基盤、セキュリティ、法務、各事業部の合意が必要になる。plugin は AI エージェントの能力を増やすため、単なるツール配布より影響が大きい。

次に、marketplace の管理方針を決めるべきだ。社内 repository だけを許すのか、信頼済み外部 marketplace も使うのか。plugin の更新レビューを誰が行うのか。特に MCP server を含む plugin は、どの権限でどのデータへ触るかを確認する必要がある。

3つ目は、自動インストール対象の最小化だ。便利そうな plugin を最初から広く入れると、開発者の CLI 体験が重くなり、問題発生時の切り分けも難しくなる。まずはセキュリティ確認、社内標準 agent、基本 hooks のような最低限から始めるほうがよい。

4つ目は、プレビュー機能であることの扱いだ。GitHub Docs は、この機能が public preview であり変更される可能性があると明記している。日本企業の本番標準にするなら、まずは一部の enterprise / organization / pilot team で試し、設定変更時の反映タイミング、既存 custom agents との関係、失敗時の戻し方を確認するべきだ。

## まとめ

GitHub Copilot CLI の enterprise-managed plugins は、Copilot CLI の便利機能追加ではなく、AI エージェント運用を企業標準へ寄せるための公開プレビューだ。`.github-private/.github/copilot/settings.json` で marketplace と enabled plugin を定義し、Copilot Business / Enterprise のユーザーへ標準配布できる。

日本の開発組織にとっての焦点は、AI エージェントを誰でも自由に拡張できる状態から、承認済み plugin、MCP 設定、hooks、社内 agent を管理された形で配る状態へ移れるかだ。Copilot CLI、MCP Server、SDK、Visual Studio / VS Code の agent 体験が広がるほど、企業側の配布と統制は重要になる。

まずやるべきことは大きくない。社内で標準化したい plugin を 3 つ以内に絞り、`.github-private` の管理責任者を決め、pilot team で次回認証時の反映を確認する。そのうえで、MCP と hooks の許可範囲を文書化する。今回の更新は、AI エージェントを禁止するか全面開放するかではなく、実務に耐える配布基盤を作るための材料として見るのがよい。

## 出典

- [Enterprise-managed plugins in GitHub Copilot CLI are now in public preview](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/) - GitHub Changelog, 2026-05-06
- [Configuring enterprise plugin standards for Copilot CLI](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards) - GitHub Docs
- [GitHub Copilot in Visual Studio Code, April releases](https://github.blog/changelog/2026-05-06-github-copilot-in-visual-studio-code-april-releases/) - GitHub Changelog, 2026-05-06
