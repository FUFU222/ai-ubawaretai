---
article: 'github-copilot-cloud-agent-rest-api-2026'
level: 'child'
---

GitHubが**2026年5月13日**に、Copilot cloud agentをREST APIから起動できるAgent tasks APIを公開プレビューにした。対象はCopilot BusinessとCopilot Enterpriseのユーザーで、社内ツールやスクリプトからcloud agentタスクを開始し、進捗も確認できる。

簡単に言うと、これまでは人がGitHub上でCopilotに「このIssueをやって」と頼む形が中心だった。今回のAPI化で、社内開発者ポータルや自動化スクリプトがCopilot cloud agentに仕事を渡せるようになる。たとえば、複数リポジトリの小さなリファクタ、リリース準備、標準テンプレートの適用などを、ボタンや定期ジョブから起動できる。

## 何ができるようになったのか

GitHubの発表では、Agent tasks APIによってcloud agentタスクをプログラムから開始できる。Docsでは、`POST /agents/repos/{owner}/{repo}/tasks`へ`prompt`を渡す方法が説明されている。任意でbase branch、利用モデル、pull requestを作るかどうかも指定できる。

タスクは開始するだけではなく、一覧取得や状態確認もできる。つまり社内ツール側に「実行中」「完了」「失敗」「ユーザー待ち」といった状態を戻せる。ここまで揃うと、Copilot cloud agentは単なるチャット機能ではなく、開発作業を受け付けるジョブ実行先として扱いやすくなる。

重要なのは、APIが公開プレビューであることだ。仕様は変わる可能性があるため、最初から基幹業務に組み込むより、限定されたチームとリポジトリで試すのが現実的だ。

## 認証で注意すること

一番見落としやすいのは認証だ。GitHub Docsでは、Agent tasks APIはuser-to-server tokenをサポートすると説明されている。個人アクセストークン、OAuth app token、GitHub App user-to-server tokenは使えるが、GitHub App installation access tokenのようなserver-to-server tokenはサポートされない。

これは、社内ポータルを作るときに重要になる。単に「システムのbotが代表して起動する」設計ではなく、どのユーザーの権限でCopilot cloud agentを動かすのかを決めなければならない。起動した人、対象リポジトリ、Copilotプラン、組織ポリシーが結びつくため、監査面では説明しやすい。一方で、実装は少し慎重になる。

## 日本のチームで使いやすい場面

最初に向いているのは、影響範囲が狭く、テストで確認しやすい作業だ。たとえば、古い設定ファイルの更新、READMEやリリースノートの下書き、単純なAPI名変更、テスト追加、社内テンプレートの適用などが候補になる。

逆に、仕様が曖昧な新機能や、権限変更、セキュリティ設定、本番影響の大きい移行を最初から任せるのは危ない。APIで起動できるようになるほど、失敗したタスクも大量に作れてしまう。便利さより先に、タスクテンプレート、レビュー担当、PR作成条件、予算上限を決めたほうがよい。

2026年5月14日には、Copilot cloud agentがauto model selectionにも対応した。Autoを使うと、GitHub側が利用可能なモデルから選び、通常のmodel multiplierから10%割引される。自動化で多数のタスクを起動する場合、まずAutoで試し、難しいタスクだけ明示モデルを使う設計が考えられる。

## まず決めるべきこと

導入前に、少なくとも次を決めておきたい。

- 誰のGitHub権限でagentタスクを起動するか
- どのリポジトリとブランチを対象にするか
- どのタスクは自動でPRを作ってよいか
- 失敗、timeout、waiting_for_userを誰が見るか
- AI Creditsやpremium requestをどう見積もるか

GitHub Copilot cloud agent APIは、AIエージェントを社内自動化へ入れる入口になる。ただし、入口ができたからといって、運用設計なしに広げるべきではない。日本の開発組織では、起動権限、レビュー、ログ、費用をセットで設計したチームほど、この更新を安全に使いやすい。

## 出典

- [Start Copilot cloud agent tasks via the REST API](https://github.blog/changelog/2026-05-13-start-copilot-cloud-agent-tasks-via-the-rest-api/) - GitHub Changelog, 2026-05-13
- [Using Copilot cloud agent via the API](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-via-the-api) - GitHub Docs
- [REST API endpoints for agent tasks](https://docs.github.com/en/rest/agent-tasks/agent-tasks?apiVersion=2026-03-10) - GitHub Docs
- [Copilot cloud agent supports auto model selection](https://github.blog/changelog/2026-05-14-copilot-cloud-agent-supports-auto-model-selection/) - GitHub Changelog, 2026-05-14
