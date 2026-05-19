---
article: 'anthropic-stainless-sdk-mcp-platform-2026'
level: 'child'
---

Anthropic は **2026年5月18日** に、Stainless という開発者ツール企業を買収しました。Stainless は、API から SDK や CLI、MCP server を作るための会社です。

少し地味に見えるニュースですが、開発者には重要です。AI エージェントが本当に仕事で使えるかどうかは、AI がどれだけ賢いかだけでは決まりません。外部サービスの API に安全につながり、正しい権限でデータを読み、必要な操作だけを実行できるかが大事です。

Anthropic はすでに Claude を法務、金融、中小企業向け業務、開発支援へ広げています。今回の買収は、その裏側にある「つなぎ方」を強くする動きです。

## Stainlessは何をしていた会社か

Stainless は、API 仕様から SDK を作る会社です。SDK とは、開発者が API を呼び出しやすくするためのライブラリです。たとえば Python や TypeScript から Claude API を使うとき、毎回 HTTP リクエストを手で書くのではなく、公式 SDK を使うことが多いはずです。

Anthropic の発表では、Stainless は Anthropic の公式 SDK 生成を初期から支えてきたとされています。TypeScript、Python、Go、Java、Kotlin など、複数の言語向けに SDK を作る技術を持っていました。

さらに重要なのは、Stainless が SDK だけでなく MCP server tooling も扱っていたことです。MCP server は、AI エージェントが外部ツールやデータにアクセスするための接続口です。つまり Stainless は、人間の開発者向けの SDK と、AI エージェント向けの接続の両方に関係していたわけです。

## 既存のStainless利用者には移行が必要

Stainless 側の発表では、今後は Claude Platform と、エージェントが API に接続する部分へ集中すると説明されています。そのため、SDK generator を含む hosted Stainless products は終了に向かいます。

発表日から、新しいサインアップ、新しいプロジェクト、新しい SDK 作成は使えなくなるとされています。ただし、すでに生成した SDK は顧客が所有し、変更や拡張もできると説明されています。

これは、Stainless を使って自社 API の SDK を配っていた会社にとっては大事な話です。SDK は一度顧客に使われると、簡単には変えられません。パッケージ名、型、エラーの出方、バージョン番号、サンプルコードが変わると、顧客のアプリや CI が壊れることがあります。

## なぜMCPとSDKがつながるのか

これまで SDK は主に人間の開発者のためのものでした。一方、MCP は AI エージェントのためのものとして語られることが多いです。

でも、実際には両方とも API に接続するための仕組みです。人間が SDK で API を呼ぶ場合も、AI エージェントが MCP server 経由で API を使う場合も、認証、権限、エラー処理、レート制限、ログが必要です。

ここを別々に作ると危険です。SDK では読み取りだけを想定しているのに、MCP server では更新や削除までできてしまうかもしれません。逆に、MCP server が弱すぎると、AI エージェントは実務で使えません。

だから、API を持つ会社は、SDK と MCP を別々の追加機能としてではなく、同じ開発者体験の一部として考える必要があります。

## 日本の開発チームは何を見るべきか

日本の SaaS 企業や社内プラットフォームチームは、まず自社 API の仕様を点検するとよいです。仕様書が古い、実装と合っていない、エラー形式がバラバラ、権限スコープが大きすぎる状態では、SDK 生成も MCP 対応も安定しません。

次に、SDK の保守方法を決める必要があります。外部サービスで SDK を生成している場合、そのサービスが変わったときに自分たちで保守できるか。生成差分をレビューできるか。顧客に破壊的変更を出さない仕組みがあるか。このあたりは今のうちに確認したほうが安全です。

最後に、MCP server の権限を考えることです。AI エージェントがどのデータを読めるのか、どの操作を実行できるのか、失敗したとき誰が確認するのかを決めておく必要があります。

今回の買収は、AI のモデル性能だけでなく、API や SDK や MCP の設計が競争力になることを示しています。開発者にとって使いやすく、AI エージェントにとっても安全につながれる API を持つ会社が、これから有利になりそうです。

## 出典

- [Anthropic acquires Stainless](https://www.anthropic.com/news/anthropic-acquires-stainless?s=09) - Anthropic, 2026-05-18
- [Stainless is joining Anthropic](https://www.stainless.com/blog/stainless-is-joining-anthropic/) - Stainless, 2026-05-18
- [Anthropic、SDKおよびMCPツール企業のStainlessを買収](https://www.itmedia.co.jp/news/articles/2605/19/news059.html) - ITmedia NEWS, 2026-05-19
