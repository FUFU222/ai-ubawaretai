---
article: 'google-adk-kotlin-android-agents-2026'
level: 'child'
---

Google が **ADK for Kotlin / ADK for Android 0.1.0** を公開しました。これは、Android アプリの中に AI エージェントの仕組みを入れやすくするための開発者向けツールです。

今まで AI エージェントというと、クラウド上で長い作業をするものとして語られがちでした。しかし、今回の更新では Android アプリの中で、ユーザーの操作や端末の文脈に近い場所から AI を使う流れが見えてきます。

## 何ができるようになるのか

ADK は Agent Development Kit の略です。AI エージェントを作るときに必要になる、モデル、ツール、状態、会話の流れなどを扱いやすくするための部品だと考えると分かりやすいです。

今回の Kotlin / Android 向け対応によって、Android 開発者は Kotlin から Gemini API を使ったエージェント体験を作りやすくなります。たとえば、写真を撮って説明文を作る、作業メモから報告書を下書きする、ユーザーの操作に合わせて次の確認項目を出す、といった使い方が考えられます。

このサイトでは以前、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) をクラウド上のエージェント実行基盤として紹介しました。今回の ADK for Android は、それとは少し違い、ユーザーが触るアプリ側に AI エージェントを近づける話です。

## なぜAndroidで重要なのか

Android アプリは、ユーザーの生活や仕事の現場にかなり近い場所で使われます。スマホ、タブレット、業務用端末、店舗端末、工場や物流の端末などです。

そのため、Android で AI を使うときは、ただ賢い答えを返せばよいわけではありません。カメラを使うのか、位置情報を使うのか、通信が切れたらどうするのか、撮影した写真に個人情報が写っていないか、といったことを考える必要があります。

[Google AI Studio の Android 試作](/blog/google-ai-studio-android-workspace-2026/) は、アイデアを Android プロジェクトへ近づける話でした。ADK for Android は、その先で実際のアプリに AI エージェントの動きを入れるための材料になります。

## 日本の現場で使えそうな例

1つ目は、業務用アプリです。店舗スタッフが商品棚を撮影して報告する、介護や医療の現場で記録を補助する、工場で点検結果をまとめる、といった用途では、端末上の文脈を AI が理解できると便利です。

2つ目は、教育や学習アプリです。ユーザーの回答に合わせて次の問題を出したり、分からないところを会話で確認したりできます。ただし、子どもが使う場合は、説明や安全設計が特に大切です。

3つ目は、営業やサポートです。訪問前のメモ整理、問い合わせ内容の要約、次に聞くべき質問の提示などは、スマホで使えると実務に入りやすいです。

## 注意すべきこと

まず、端末内のデータを何でも AI に送ってよいわけではありません。写真、音声、位置情報、顧客情報、業務メモには機密情報が含まれることがあります。

次に、AI 機能が失敗したときの設計が必要です。通信が不安定な現場では、モデル呼び出しが失敗することがあります。その場合でも、入力を失わず、通常業務を続けられるようにする必要があります。

また、費用も考える必要があります。すべての処理を高優先でクラウドに投げると、コストが膨らむかもしれません。[Gemini API の Flex / Priority](/blog/google-gemini-api-flex-priority-2026/) のように、即時性が必要な処理と待てる処理を分ける考え方が重要になります。

## まとめ

ADK for Kotlin / ADK for Android 0.1.0 は、Android アプリに AI エージェントを組み込む入口になる更新です。

ただし、まだ 0.1.0 なので、いきなり重要業務へ全面導入するより、小さな PoC から始めるのが現実的です。日本の Android チームは、端末内データ、権限、通信断、レビュー、費用を確認しながら、業務アプリや学習アプリなどの限定用途で試すのがよいでしょう。

## 出典

- [ADK for Kotlin and Android: Building AI agents in Android apps](https://developers.googleblog.com/adk-kotlin-android-building-ai-agents/) - Google Developers Blog
- [Build ADK agents for Android](https://developer.android.com/ai/adk) - Android Developers
- [Agent Development Kit documentation](https://adk.dev/) - Google
- [Google ADK for Kotlin GitHub repository](https://github.com/google/adk-kotlin) - Google
