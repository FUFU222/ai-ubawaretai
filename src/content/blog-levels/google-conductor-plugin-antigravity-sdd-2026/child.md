---
article: 'google-conductor-plugin-antigravity-sdd-2026'
level: 'child'
---

Google は **2026年7月16日**、Conductor を Conductor Plugin に進化させ、Antigravity CLI でも使えるようにしたと発表しました。Conductor は、AI にいきなりコードを書かせるのではなく、先に仕様と計画を作ってから実装へ進めるための仕組みです。

大事なのは、仕様や計画をチャットの中だけに置かないことです。`spec.md` や `plan.md` のような Markdown ファイルとしてリポジトリに残すことで、あとから人間が確認しやすくなります。

## 何が変わったのか

Conductor は、もともと Gemini CLI の extension として使われていました。今回、Google はそれを plugin にしました。plugin になると、skills、rules、MCP servers、hooks などをまとめて扱いやすくなります。

また、Antigravity CLI でも使えるようになりました。つまり、特定のツールだけに閉じた仕組みではなく、複数の AI コーディング環境で同じ考え方を使いやすくなったということです。

Google の説明では、Conductor は会話しながら context、spec、plan を作ったり更新したりできます。ただし、成果物は消えません。`spec.md` や `plan.md` は残るので、AI が何を前提にして作業したかを追いやすくなります。

## なぜ仕様と計画が大事なのか

AI は、あいまいな指示でもコードを書けます。しかし、仕事の開発では「動いたからよい」とは言えません。何を作るのか、なぜ作るのか、どこまで作るのか、誰が確認したのかが大事です。

チャットだけで作業すると、前に決めたことが次の会話に残らないことがあります。別の担当者が見ると、AI がどんな仕様で作業したのか分からないこともあります。

Conductor は、この問題を減らします。仕様と計画をファイルとして残すことで、レビュー担当者が確認できます。AI に任せる作業でも、人間が見直すための手がかりが残ります。

## 日本のチームで見るポイント

日本の開発チームでは、委託先、社内レビュー、セキュリティ、品質保証が関わることが多いです。そのため、AI が作ったコードだけでなく、AI に渡した仕様や計画も確認できることが大切です。

まず、`spec.md` を誰が承認するか決めます。次に、`plan.md` を誰が変更できるか決めます。さらに、MCP や hooks にどこまで権限を持たせるかも決めます。

Conductor は便利ですが、ルールを決めなければ安全にはなりません。AI が読むファイルが増えるだけではなく、そのファイルを誰が管理するかまで決める必要があります。

## 気をつけること

仕様駆動開発は、文書をたくさん作ることではありません。悪い仕様を作れば、AI はその悪い仕様に沿って実装してしまいます。大きすぎる計画を作れば、レビューもしづらくなります。

小さな単位で spec と plan を作り、PR と対応させるのが現実的です。調査、設計、テスト追加、実装、ドキュメント更新を分けると、人間も AI も作業しやすくなります。

また、Antigravity から別のツールへ作業を移せるとしても、権限やログの扱いはツールごとに違います。仕様と計画は持ち運べても、会社の承認ルールまで自動で持ち運ばれるわけではありません。

## まとめ

Conductor Plugin の Antigravity 対応は、AI コーディングをチャット任せにせず、仕様と計画をリポジトリに残して進めるための更新です。日本の開発チームでは、AI に何を頼んだか、どの計画に沿って作業したか、誰が確認したかを追いやすくする意味があります。

導入するときは、plugin の管理、`spec.md` と `plan.md` の所有者、MCP や hooks の権限、レビューのルールを先に決めることが大切です。

## 出典

- [Evolving Spec-Driven Development: Conductor Now Supports Antigravity](https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/) - Google Developers Blog, 2026-07-16
- [gemini-cli-extensions/conductor](https://github.com/gemini-cli-extensions/conductor) - GitHub
- [Getting started with Spec Driven Development in Antigravity](https://codelabs.developers.google.com/codelabs/getting-started-with-spec-driven-development-in-antigravity) - Google Codelabs
