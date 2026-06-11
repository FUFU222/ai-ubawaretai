---
article: 'anthropic-claude-fable-mythos5-governance-2026'
level: 'child'
---

Anthropic は 2026年6月9日、**Claude Fable 5** と **Claude Mythos 5** を発表しました。Fable 5 は多くの開発者や企業が使える新しい最上位モデルです。Mythos 5 は、Project Glasswing というサイバー防御向けの取り組みに参加する、承認済みの組織向けモデルです。

ここで大事なのは、どちらも「とても賢いモデル」というだけではないことです。Fable 5 と Mythos 5 は、1M token の長い文脈、128k token の長い出力、always-on adaptive thinking を前提にしています。つまり、長い資料やコード、調査メモを読ませやすくなる一方で、費用、ログ、データ保持、安全ルールも考えなければなりません。

## Fable 5とMythos 5の違い

Fable 5 は一般提供されるモデルです。Claude API、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry などから使えると説明されています。企業が新しい高性能モデルを試すなら、まず見るのは Fable 5 になります。

Mythos 5 は違います。これは Project Glasswing の承認済み参加者向けに限定提供されます。Project Glasswing は、AIを使って重要なソフトウェアやインフラを守るための取り組みです。以前の [Project Glasswing拡大](/blog/anthropic-project-glasswing-expansion-critical-infra-2026/) でも見たように、強いサイバー能力は防御に役立つ一方、扱い方を間違えると危険にもなります。

そのため、Anthropic は一般向けの Fable 5 と、限定提供の Mythos 5 を分けています。日本企業が読む時も、「Mythos 5 が誰でも使えるようになった」と誤解しないことが大切です。

## 長い文脈は便利だが、無料ではない

1M token の文脈は、長い仕様書、契約書、コード、ログ、調査資料をまとめて扱う時に役立ちます。たとえば、開発チームが大きな設計書とコードを同時に見せてレビューしてもらう、セキュリティチームが長いログを読ませる、法務や事業部が複数の資料から論点を整理する、といった使い方が考えられます。

ただし、長く入れられるからといって、何でも入れてよいわけではありません。API release notes では、Fable 5 と Mythos 5 は新しい tokenizer を使うため、以前のモデルより同じ文章が多めの token として数えられる可能性があると説明されています。つまり、前と同じ資料量でも費用が増えるかもしれません。

## 安全とデータ保持も確認する

Fable 5 では、安全 classifier が働き、危険または許可されない内容では拒否が返ることがあります。また、Claude API で Fable 5 を使う場合、30日間の data retention が必要で、zero data retention では使えないと説明されています。

これは日本企業にとって重要です。顧客データ、個人情報、未公開コード、契約書、医療や金融の情報を入れてよいかは、モデル性能だけでは決められません。まず、どの種類のデータなら Fable 5 に入力してよいかを社内で決める必要があります。

## 日本企業が最初にやること

最初に、使う場面を絞ります。Fable 5 は強力ですが、すべての作業に使う必要はありません。長い文脈や深い推論が本当に必要な、設計レビュー、セキュリティ調査、複雑な文書分析、研究支援などから試すのが現実的です。

次に、費用を実測します。短い質問ではなく、自社の実際の資料やコードに近いサンプルで token 数、出力量、処理時間、レビューのしやすさを比べます。[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) と同じように、モデル名だけでなく、どの経路で使ったかも記録します。

最後に、安全ルールを決めます。どのデータを入れてよいか、ログは誰が見るか、拒否された時にどうするか、Mythos 5 のような限定モデルを一般モデルと混同しないかを確認します。

## まとめ

Claude Fable 5 は、長い文脈と強い推論を使える新しい選択肢です。Claude Mythos 5 は、Project Glasswing 向けの限定モデルです。日本企業が見るべきなのは、名前の新しさだけではありません。

大事なのは、どの業務で使うか、費用をどう測るか、データ保持を許容できるか、クラウド経路とログを説明できるかです。強いモデルを安全に使うには、導入前のルール作りが必要です。

## 出典

- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) - Anthropic, 2026-06-09
- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-06-09
- [Models overview](https://docs.anthropic.com/en/docs/about-claude/models) - Anthropic Docs
