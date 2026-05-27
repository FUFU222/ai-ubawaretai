---
article: 'github-copilot-targeted-model-rules-2026'
level: 'child'
---

GitHub Copilotに **model rules** という管理機能が公開プレビューで入りました。これは、会社のGitHub管理者が「このorganizationではこのAIモデルを使ってよい」「別のorganizationでは使わせない」と決められるようにするものです。

organizationは、GitHubの中でチームや事業部ごとに分かれている大きな箱だと考えるとわかりやすいです。大きな会社では、社内サービスの開発、顧客向けサービス、研究開発、委託先との共同開発を別々のorganizationで管理することがあります。

## 何が便利なのか

これまでは、会社全体で同じモデル設定にすると、少し困ることがありました。

たとえば、研究開発チームは新しい高性能モデルを試したいかもしれません。でも、顧客データを扱うチームや委託先が入るチームでは、使えるモデルを絞りたいかもしれません。全員に同じ設定を配ると、自由すぎるか、厳しすぎるかのどちらかになりがちです。

model rulesを使うと、組織ごとにモデルの使い方を変えられます。これは[Copilot Webモデル削減](/blog/github-copilot-web-models-limited-2026/)のようにモデル一覧が変わる時代には大事です。モデルが増えたり減ったりしても、会社側がどの組織に何を使わせるかを決めやすくなります。

## お金の管理にも関係する

AIモデルは、どれを使っても同じ値段とは限りません。強いモデルほど多くのAI Creditsを使うことがあります。このサイトでも[CopilotのAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/)を扱いました。

もし全員が高いモデルを自由に使うと、会社の予算管理が難しくなります。でも、全部禁止すると、難しいバグ調査や設計レビューで困るかもしれません。

そこで、普段の作業は標準モデルや[Copilot Auto選択](/blog/github-copilot-auto-model-selection-vscode-2026/)を使い、特別に難しい作業をするorganizationだけ高性能モデルを使えるようにする、という考え方ができます。

## 会社で使うときの注意

model rulesは便利ですが、設定を細かくしすぎると大変です。たくさんのorganizationにバラバラのルールを作ると、誰がどのモデルを使えるのか管理者でもわかりにくくなります。

最初は、3つくらいに分けるのがよいです。ふつうの開発チーム、新しいモデルを試すチーム、厳しく制限するチームです。そのあと、必要に応じて少しずつ増やします。

また、これは公開プレビューです。正式版になるまでに画面やできることが変わる可能性があります。だから、会社のルールを全部これだけに頼るのではなく、GitHubの権限管理、社内のAI利用ルール、予算確認と一緒に使うべきです。

## まとめ

GitHub Copilotのmodel rulesは、会社の中でAIモデルを組織ごとに管理するための機能です。子ども向けに言えば、「道具箱の中のどの道具を、どの班が使ってよいかを先生が決められる」ようなものです。

日本の会社では、部署、子会社、委託先、規制のある仕事で使い方が違います。model rulesを使えば、全員に同じ設定を配るより、仕事の内容に合わせたCopilot運用を作りやすくなります。

## 出典

- [Target Copilot models to organizations with model rules](https://github.blog/changelog/2026-05-26-target-copilot-models-to-organizations-with-model-rules/) - GitHub Changelog, 2026-05-26
- [Managing availability of default models](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
- [Managing default models](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-default-models) - GitHub Docs
