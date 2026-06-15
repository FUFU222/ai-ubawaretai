---
article: 'anthropic-claude-sonnet4-opus4-retirement-2026'
level: 'child'
---

Anthropic のドキュメントでは、Claude Sonnet 4 と Claude Opus 4 が、direct Anthropic API で 2026年6月15日に retirement したと整理されています。retirement は、古いモデルを前提にした呼び出しが使えなくなる期限だと考えると分かりやすいです。

これは「Claude が全部使えなくなる」という意味ではありません。新しい Claude モデルはあります。ただし、会社のアプリや開発ツールがまだ Sonnet 4 や Opus 4 を直接指定している場合、その設定を見直す必要があります。

## 何を確認すればいいの？

まず、会社の中で Sonnet 4 や Opus 4 を呼んでいる場所を探します。アプリのコードだけでなく、環境変数、CI、クラウド設定、Notebook、社内のAIゲートウェイ、古い手順書も対象です。

モデル名は、正式な名前で書かれているとは限りません。社内で `standard-claude` や `opus-high` のような別名にしている場合もあります。その別名の中身が古いモデルを指していないかも確認します。

## Opus 4.1の話とは何が違うの？

以前の Opus 4.1 は、2026年8月5日に向けた移行予定の話でした。今回の Sonnet 4 と Opus 4 は、2026年6月15日の期限をすでに迎えています。つまり、対応の優先度はより高いです。

もし本番処理がまだ古いモデルを呼んでいると、ジョブが失敗したり、社内ツールが止まったりする可能性があります。特に、毎日使う小さな処理よりも、月次バッチや非常時だけ動くスクリプトのほうが見落とされやすいです。

## 代わりに何を使うの？

用途によって代替先は変わります。要約や分類のような日常処理では、現行の Sonnet 系モデルが候補になります。長いコード調査や複雑なエージェント作業では、Opus 4.8 のような上位モデルを試す必要があります。

ただし、モデル名を置き換えるだけでは十分ではありません。出力の長さ、説明の仕方、コードの直し方、コスト、失敗したときの動きが変わることがあります。重要な仕事では、小さなテストをしてから本番へ入れます。

## クラウド経由にも注意

Claude を Anthropic から直接使っている会社もあれば、AWS Bedrock や Google Vertex AI などを通して使っている会社もあります。経路が違うと、使えるモデル、終了日、ログ、データの扱いが違う場合があります。

そのため、開発チームだけでなく、クラウド管理者や情シスも一緒に確認したほうが安全です。「Anthropic API では確認した」だけでは、会社全体の確認として足りないことがあります。

## まとめ

Claude Sonnet 4 と Claude Opus 4 の退役は、古いモデル指定を片づけるための作業です。まず使っている場所を探し、次に現行モデルで小さく試し、最後にクラウド経由や社内ゲートウェイの設定も確認します。

古いモデルへ戻す切り戻しは、退役後には使えない可能性があります。問題が出たときは、現行モデルへの切り替え、プロンプト調整、人間レビューで戻せるようにしておくことが大切です。

## 出典

- [Model deprecations](https://docs.anthropic.com/en/docs/about-claude/model-deprecations) - Anthropic Docs
- [Claude models overview](https://docs.anthropic.com/en/docs/about-claude/models/overview) - Anthropic Docs
- [Migrating to Claude 4](https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4) - Anthropic Docs
