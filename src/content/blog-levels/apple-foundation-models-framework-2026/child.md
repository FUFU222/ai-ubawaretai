---
article: 'apple-foundation-models-framework-2026'
level: 'child'
---

Apple が **Apple Foundation Models** と **Foundation Models framework** を発表しました。これは、Apple Intelligenceを支えるAIモデルを、iPhone、iPad、Macなどのアプリ開発で使いやすくするための仕組みです。

ポイントは、AIをただチャット画面で使うだけではなく、アプリの中で要約、文章作成、分類、画像理解、ツール呼び出しのような機能として使えるようになることです。

## 何が新しいのか

Appleは2026年6月8日に、第3世代のApple Foundation Modelsを紹介しました。これはApple Intelligenceの新しいSiriや、アプリを賢くする機能を支えるモデル群です。

開発者向けには、Foundation Models frameworkが用意されます。Apple Developerの説明では、Swiftから使えるAPIとして、AppleのオンデバイスモデルやPrivate Cloud Compute上のモデルにアクセスできます。

たとえば、文章を要約する、入力内容から必要な情報を取り出す、アプリが期待する形のデータを生成する、アプリ側のコードをAIから呼び出す、といった使い方が考えられます。

## なぜアプリ開発で重要なのか

これまでアプリにAIを入れるには、外部のクラウドAI APIを呼ぶことが多くありました。しかし、ユーザーの文章、写真、健康情報、学習記録、業務メモなどを外部へ送る設計には慎重さが必要です。

AppleのFoundation Modelsは、端末内で使えるAIを前面に出しています。つまり、軽い要約や分類、文章理解のような処理を、クラウドへ送らずにアプリ内で扱える可能性があります。

この点は、以前紹介した [Google ADK for Android](/blog/google-adk-kotlin-android-agents-2026/) と比べると分かりやすいです。GoogleはAndroidアプリの中にGemini系のエージェント機能を入れる方向を示しました。Appleは、Apple IntelligenceとSwift APIを使って、iOSやmacOSアプリの中にAI機能を入れる方向を示しています。

## 気をつけるべきこと

オンデバイスAIだからといって、何も考えなくてよいわけではありません。アプリがどのデータをAIに渡すのか、生成された文章を保存するのか、外部へ送るのか、ユーザーが確認するのかを決める必要があります。

たとえば、AIが作った報告文をそのまま送信する場合、間違いが含まれるかもしれません。予約、決済、個人情報共有、削除のような操作は、AIだけで完了させず、人間の確認を入れるべきです。

また、Apple Intelligenceが使えない端末もあります。ユーザーが設定で無効にしている場合や、モデルがまだ準備できていない場合もあります。そのときにアプリが止まらないよう、代わりの画面や通常の操作手順を残すことが大切です。

## 日本の開発チームで試しやすい用途

試しやすいのは、文章の要約、入力補助、タグ付け、下書き、画像からの情報整理などです。たとえば、日記アプリ、学習アプリ、店舗向け報告アプリ、写真整理アプリ、社内メモアプリでは使いやすいでしょう。

一方で、医療、金融、保険、学校、自治体のような領域では注意が必要です。AIの出力を誰が確認するのか、誤りがあった場合にどう直すのか、どのログを残すのかを先に決める必要があります。

[Android Gemini Intelligence](/blog/google-android-gemini-intelligence-2026/) で扱ったように、これからはAIがアプリの機能を呼び出す場面が増えます。AppleでもApp IntentsやSiri AIとつながるため、アプリ側は「AIに何を任せてよいか」を整理する必要があります。

## まとめ

Apple Foundation Models frameworkは、AppleプラットフォームのアプリにAI機能を入れるための大きな入口です。特に、端末内で動くAI、Swift API、構造化された生成、ツール呼び出し、App Intentsとの連携が重要です。

まずは、小さな機能から試すのが現実的です。要約、分類、下書きのように、失敗しても人間が確認しやすい用途から始めるとよいでしょう。大事なのは、便利さだけでなく、データ、確認、失敗時の動きまで含めて設計することです。

## 出典

- [Introducing the Third Generation of Apple's Foundation Models](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) - Apple Machine Learning Research
- [Foundation Models framework](https://developer.apple.com/documentation/foundationmodels/) - Apple Developer Documentation
- [Apple Intelligence](https://developer.apple.com/apple-intelligence/) - Apple Developer
- [What's new in Apple Intelligence](https://developer.apple.com/apple-intelligence/whats-new/) - Apple Developer
