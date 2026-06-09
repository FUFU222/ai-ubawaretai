---
article: 'github-third-party-agent-security-validation-2026'
level: 'child'
---

GitHub が、AI が書いたコードを安全に確認するための仕組みを広げました。対象は **third-party coding agents** です。これは、GitHub Copilot 以外の AI コーディングエージェントも含む考え方です。

たとえば、ある人が外部の AI ツールに「このバグを直して」と頼みます。AI はコードを書き、GitHub に pull request を出します。するとチームは、そのコードを見て、入れてよいか判断しなければなりません。今回の GitHub の更新は、その判断の前に、セキュリティ検査を通しやすくするものです。

## 何を検査するのか

ポイントは、AI が書いたコードにも、いつもの安全確認をかけることです。

1つ目は CodeQL です。これはコードの中に危ない書き方がないか調べる仕組みです。たとえば、入力をそのまま使ってしまう、秘密の情報に近いものを危ない場所で扱う、といった問題を見つける助けになります。

2つ目は依存関係の確認です。AI が新しいライブラリを追加したとき、そのライブラリに知られている弱点がないかを見る必要があります。GitHub Advisory Database や Dependabot のような仕組みは、この確認に役立ちます。

3つ目は secret scanning です。これは API キーや token のような秘密情報が、うっかりコードに入っていないかを見る検査です。AI が設定ファイルや README を直すときにも、こうした確認は大切です。

## なぜ大事なのか

AI がコードを書けるようになると、速く直せる場面が増えます。しかし、速いことと安全なことは同じではありません。

人間が書いたコードでもレビューは必要です。AI が書いたコードなら、なおさら「何を確認したか」をはっきりさせる必要があります。AI はテストを通すために、思っていた仕様と違う直し方をすることがあります。古いサンプルをまねて、危ないライブラリを入れることもあります。便利そうだからといって、確認なしに入れるのは危険です。

今回の GitHub の更新は、AI が書いたコードを全部信じるためのものではありません。反対に、信じる前に確認するためのものです。

## チームで決めること

チームでまず決めるべきことは、AI が作った pull request に必ず通す検査です。

たとえば、重要なサービスでは CodeQL を必須にする。新しいライブラリが入ったら依存関係の検査を見る。設定ファイルを触ったら secret scanning の結果を見る。こうしたルールを、先に決めておきます。

次に、誰が最後に確認するかを決めます。検査が全部通っても、人間のレビューは必要です。セキュリティ検査は、よくある危険を見つけるのが得意です。しかし、その変更が本当にサービスの目的に合っているか、ユーザーに悪い影響がないかは、人間が見なければなりません。

## 日本の会社での使い方

日本の会社では、社内チームだけでなく、開発会社や協力会社が同じ GitHub リポジトリを触ることがあります。それぞれが違う AI ツールを使うかもしれません。

このとき、「どの AI ツールなら使ってよいか」だけで管理しようとすると大変です。ツールはすぐ増えます。そこで、GitHub に入ってくる pull request の段階で、同じ検査を通す考え方が役に立ちます。

たとえば、[GitHub MCP Serverで秘密情報と依存関係を事前検査](/blog/github-mcp-server-security-scanning-2026/) のような作業中の検査と、今回の pull request 側の検査を組み合わせます。さらに [GitHub Copilot設定監査API、agent統制の要点](/blog/github-copilot-cloud-agent-config-audit-api-2026/) のように、設定をあとから見直せるようにしておくと、運用しやすくなります。

## 覚えておくこと

今回の GitHub の security validation は、AI コードを自動で合格にする魔法ではありません。AI が作ったコードを、チームが安全に受け入れるためのチェックポイントです。

大事なのは、検査を通ったら終わりにしないことです。検査を通ったうえで、人間が目的、仕様、権限、データの扱いを確認する。この順番を作ると、AI を使う速さと、安全に開発するためのルールを両立しやすくなります。

## 出典

- [Security validation for third-party coding agents](https://github.blog/changelog/2026-06-09-security-validation-for-third-party-coding-agents/) - GitHub Changelog, 2026-06-09
- [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents) - GitHub Docs
- [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations) - GitHub Docs
