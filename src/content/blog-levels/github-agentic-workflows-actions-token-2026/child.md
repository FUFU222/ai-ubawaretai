---
article: 'github-agentic-workflows-actions-token-2026'
level: 'child'
draft: false
---

GitHub Agentic Workflows は、GitHub Actions の中で AI agent に作業を任せるための新しい仕組みです。GitHub は 2026年6月11日に public preview として公開しました。たとえば、issue の分類、CI 失敗の原因調査、ドキュメント更新の下書きなどを、Actions の workflow として動かせます。

大事なのは、自然言語の Markdown で workflow を書き、それを Actions YAML に compile する点です。つまり、AI への指示文だけでなく、trigger、permission、runner、制約も GitHub Actions の運用に近い形で扱います。既存の runner group や policy を使えるため、企業では「別の AI 実行基盤を増やす」より説明しやすくなります。

## PATが不要になった意味

同じ日に、GitHub は Agentic Workflows が GitHub Actions の `GITHUB_TOKEN` で Copilot inference を使えるようになったと発表しました。これまでは、Copilot を使うために personal access token を作り、repository secret として保存する運用が必要になりがちでした。

新しい方法では、workflow の permissions に `copilot-requests: write` を追加します。これにより、長く残る個人トークンを置かずに、Actions の token で AI の推論を呼び出せます。組織 owned repository では、使った AI Credits が組織へ課金されます。

これは安全面では良い変更です。退職者の token、期限切れ token、誰が作ったかわからない secret を減らせるからです。一方で、費用は個人ではなく組織に寄ります。個人の user-level budget で自然に止まらない場合があるため、cost center や workflow ごとの token cap を確認する必要があります。

## 既存のCopilot機能との違い

この機能は、[Copilot自動実行、cloud agent運用設計](/blog/github-copilot-cloud-agent-automations-2026/) と似ていますが、同じではありません。cloud agent automations は、agent task をスケジュールや event で起動する機能です。Agentic Workflows は、agentic な処理そのものを repository の workflow として管理します。

また、[Copilot Agent tasks API、Pro運用の実務](/blog/github-copilot-agent-tasks-api-pro-2026/) で扱った API 起動とも違います。API は外部ツールから agent に仕事を頼む入口です。Agentic Workflows は GitHub Actions の中で、Markdown から作られた workflow を実行する入口です。

日本の開発チームでは、この違いをはっきり分けると導入しやすくなります。個人や小チームの試行なら API や automation が便利です。会社標準の CI/CD に組み込むなら、Agentic Workflows のように Actions の権限や runner と一緒に管理できる形が向いています。

## 最初に確認すること

最初に決めるべきことは、どの repository で試すかです。いきなり本番システムや認証まわりに入れるのは危険です。まずは、ドキュメント更新、issue label の候補作成、CI 失敗ログの要約、release note の下書きなど、失敗しても人間が捨てられる作業が向いています。

次に、permissions を最小にします。読むだけでよい workflow に write 権限を渡さないことが大切です。`copilot-requests: write` は AI 推論用の権限であり、issue や pull request に書き込む権限とは別です。AI が何を読めて、何を書けるのかを workflow ごとに分けてください。

費用も見ます。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理したように、Copilot の agentic 機能は AI Credits の管理対象です。Agentic Workflows は組織課金になりやすいため、誰の予算で動くのか、何回まで実行するのか、失敗時に再実行してよいのかを決めておく必要があります。

## まとめ

GitHub Agentic Workflows は、AI agent を GitHub Actions の中で動かすための仕組みです。Markdown で書いた workflow を Actions YAML に compile し、既存の runner や policy を使えます。さらに `GITHUB_TOKEN` と `copilot-requests: write` により、長期 PAT を減らせます。

ただし、便利だからすぐ広げる機能ではありません。日本のチームでは、対象 repository、権限、runner、費用、レビュー担当を決めてから、小さく始めるのが現実的です。最初は read-only や comment-only の workflow から試し、効果とリスクを見てから自動修正や PR 作成へ進めるべきです。

## 出典

- [GitHub Agentic Workflows is now in public preview](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/) - GitHub Changelog, 2026-06-11
- [Agentic workflows no longer need a personal access token](https://github.blog/changelog/2026-06-11-agentic-workflows-no-longer-need-a-personal-access-token/) - GitHub Changelog, 2026-06-11
- [Authentication | GitHub Agentic Workflows](https://github.github.com/gh-aw/reference/auth/) - GitHub Docs
