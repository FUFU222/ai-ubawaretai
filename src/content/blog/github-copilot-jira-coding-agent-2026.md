---
title: 'GitHub CopilotがJiraと連携。チケットを渡すだけでPRが生成される時代に'
description: 'GitHub Copilot coding agentがJira連携のパブリックプレビューを開始。Jiraチケットをアサインするだけで自律的にコードを書き、ドラフトPRを作成する。Confluence参照やモデル選択にも対応。'
pubDate: '2026-03-27'
category: 'news'
tags: ['GitHub Copilot', 'Jira', 'AI エージェント', '開発ツール']
---

GitHub Copilot coding agentがJiraと直接つながった。3月5日にパブリックプレビューとして公開され、3月25日には早くも機能強化のアップデートが入っている。やっていることはシンプルで、Jiraのチケットを Copilot にアサインすると、自律的にコードを書いてドラフトPRを作ってくれる。

「AIがコードを書く」という話はもう珍しくないけど、プロジェクト管理ツールとの統合がここまで進むと、開発ワークフロー自体が変わりそうだ。

## Jiraチケットからドラフトプルリクエストまで一気通貫

仕組みはこうだ。Jiraの課題をGitHub Copilotにアサインする、もしくはコメントで `@GitHub Copilot` とメンションする。するとCopilotがチケットの説明文やコメントを読み込み、文脈を理解した上で実装に取りかかる。

作業が終わるとドラフトPRが自動で作成される。PRのタイトルとブランチ名にはJiraのチケット番号が自動的に含まれ、PR本文にはJiraチケットへのリンクとエージェントに渡されたコンテキストが表示される。作業中の進捗はJira側のエージェントパネルにポストされるので、何をやっているかはJiraから追える。

もしCopilotが情報不足だと判断した場合は、Jira上で質問を返してくる。つまり、完全に放置するわけではなく、必要に応じて人間とやり取りしながら進める設計になっている。

## Confluenceのドキュメントも読めるようになった

3月25日のアップデートで一番インパクトがあるのは、Confluence連携だろう。Atlassian MCP（Model Context Protocol）サーバーをPersonal Access Token（PAT）で設定すると、CopilotがConfluenceのページにアクセスできるようになる。

これが何を意味するかというと、設計書や仕様書、API仕様といったドキュメントをCopilotが参照しながらコードを書けるということだ。Jiraのチケットだけだと「何を作るか」の情報は得られても「どう作るか」の文脈が不足しがちだった。Confluenceとの連携で、その問題がかなり軽減されるはずだ。

MCP経由での接続というのもポイントで、Anthropicが提唱してオープンスタンダードとなったModel Context Protocolが、こういったエンタープライズツール連携の基盤として使われ始めている。MCPは2026年3月時点で月間9,700万ダウンロードを超えており、エージェントのツール統合における事実上の標準になりつつある。

## 使うモデルをJiraから選べる

もう一つの注目アップデートが、AIモデルの選択機能だ。Jiraのコメントで `@GitHub Copilot` にメンションする際に、使いたいモデルを指定できる。

公式ブログの説明が分かりやすい。「ユニットテストの追加みたいな単純なタスクには速いモデルを。厄介なリファクタリングには高性能モデルを」。タスクの複雑さに応じてモデルを使い分けられるのは、コストと品質のバランスを取る上で実用的な機能だと思う。

現時点ではCopilot ProとPro+ユーザー向けに提供されており、BusinessとEnterprise向けは近日対応予定とのこと。

## セキュリティスキャンとセルフレビューも標準装備

Copilot coding agentは、PRを作る前に自分でコードレビューを実行する。Copilot code reviewの仕組みを使って、自分の変更を評価してから人間にレビューを回す。さらに、コードスキャン、シークレットスキャン、依存関係の脆弱性チェックが自動的に走る。コードスキャンは無料で提供されている。

自律的に動くエージェントだからこそ、セキュリティのガードレールがビルトインされているのは重要だ。「AIが書いたコードをそのままマージしたら脆弱性が入ってた」みたいな事態を防ぐ設計思想が見える。

## 開発ワークフローの境界線が溶け始めている

今回のJira連携は、単なる「便利な新機能」以上の意味があると感じる。これまでプロジェクト管理とコード実装は明確に分離された工程だった。PMがチケットを書き、開発者がそれを読んで実装し、PRを出す。その境界がCopilot coding agentによって曖昧になりつつある。

もちろん、現時点ですべてのタスクを丸投げできるわけではない。パブリックプレビューの段階だし、バグ修正やドキュメント更新のような定型的なタスクが主なユースケースだろう。ただ、方向性としては「チケットを書けばコードが出てくる」という世界に確実に近づいている。

利用にはJira Cloud（Rovo有効化済み）とGitHub Copilot coding agentの有効化が必要。Atlassian Marketplaceから「GitHub Copilot for Jira」アプリをインストールすることで使い始められる。

---

**出典:**

- [GitHub Copilot for Jira — Public preview enhancements](https://github.blog/changelog/2026-03-25-github-copilot-for-jira-public-preview-enhancements/)
- [GitHub Copilot coding agent for Jira is now in public preview](https://github.blog/changelog/2026-03-05-github-copilot-coding-agent-for-jira-is-now-in-public-preview/)
- [What's new with GitHub Copilot coding agent](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/)
