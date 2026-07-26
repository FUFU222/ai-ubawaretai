---
article: 'anthropic-claude-opus-5-api-migration-2026'
level: 'child'
---

Claude Opus 5 は、Anthropic の新しい上位モデルです。名前だけを見ると「もっと賢い Claude が出た」という話に見えますが、開発チームにとって大事なのは、使い方の前提が少し変わることです。

## 何が変わったのか

公式ドキュメントでは、API で使うモデルIDは `claude-opus-5` です。大きなコード修正、長い調査、複雑な業務タスク、AI エージェントのように何段階も考える仕事向けに説明されています。1M token の長い文脈と、128k token までの出力も案内されています。

もう一つ大きいのは、thinking が最初からオンになることです。thinking は、Claude が答えを出す前にどれくらい考えるかに関係します。Opus 4.8 では明示しないと thinking なしで動く場面がありましたが、Opus 5 では同じリクエストでも考え方が変わります。

## 料金は単価だけで見ない

標準の Opus 5 は、入力100万トークンあたり5ドル、出力100万トークンあたり25ドルの価格帯です。Fast mode はもっと速く動かすための research preview ですが、入力100万トークンあたり10ドル、出力100万トークンあたり50ドルです。速いから安いのではなく、速さに追加料金を払うイメージです。

そのため、会社で使うときは「1回の料金」ではなく「1つの仕事を終えるまでの料金」を見ます。AI が長く考える、ツールを何度も呼ぶ、失敗してやり直す、長いファイルを読む、といった要素で合計は変わります。

## どこで使えるかを分ける

Opus 5 は Anthropic の API だけでなく、Claude のアプリ、Claude Code、クラウド経由、ほかの AI gateway 経由で使われる可能性があります。ただし、どこでも同じ設定が使えるとは限りません。

たとえば Fast mode は、公式ドキュメントでは現時点で Claude API のみと説明されています。Amazon Bedrock、Google Cloud、Microsoft Foundry では利用できないとされています。つまり、API で試して速かったからといって、会社の本番クラウドでも同じ動きになるとは限りません。

## まず試すべきこと

日本の開発チームなら、いきなり全部を Opus 5 に変えないほうが安全です。まず、難しいコード修正、長い調査、仕様があいまいなバグ対応など、Opus 5 の力が出そうな仕事を選びます。そこから Sonnet 5、Opus 4.8、Opus 5 を同じ条件で比べます。

比べるときは、答えが良いかだけでなく、時間、トークン量、やり直し回数、人間レビューの手間も見ます。料金を抑えたいなら、全部を最上位モデルにするのではなく、難しい仕事だけ Opus 5 に回す設計が現実的です。

## 気をつける点

社内で AI を使う場合、ログも大事です。どのモデルを使ったか、Fast mode だったか、thinking の設定は何か、途中で別モデルに切り替わったか、どんなツールを使ったかを残しておくと、あとで費用や品質を説明しやすくなります。

Claude Opus 5 は便利な新モデルですが、会社での導入は「強いモデルを解禁する」だけでは終わりません。どの仕事に使うか、いくらまで許すか、失敗したらどう戻すか、人間がどこで確認するかを決めてから広げるのがよい進め方です。

## 出典

- [Claude Opus 5](https://www.anthropic.com/news/claude-opus-5) - Anthropic, 2026-07-24
- [What's new in Claude Opus 5](https://docs.anthropic.com/en/docs/about-claude/models/whats-new-opus-5) - Anthropic Docs
- [Pricing](https://docs.anthropic.com/en/docs/about-claude/pricing) - Anthropic Docs
