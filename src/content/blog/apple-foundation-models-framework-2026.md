---
title: 'Apple Foundation Models、アプリ内AI設計の要点'
description: 'Apple Foundation ModelsとFoundation Models frameworkを整理。日本のiOS/macOS開発チームがオンデバイスAI、PCC、評価、安全設計をどう読むべきか解説する。'
pubDate: '2026-06-09'
category: 'news'
tags: ['Apple', 'AI モデル', '開発者ツール', 'プライバシー', 'エッジAI']
draft: false
---

Apple が **2026年6月8日** に公開した第3世代 **Apple Foundation Models** と、開発者向けの **Foundation Models framework** は、Apple Intelligence を「OSの中のAI」から「アプリ開発者が設計に組み込むAI」へ広げる更新だ。単なるSiriの強化ではなく、iOS、iPadOS、macOS、watchOS、visionOS上のアプリが、オンデバイスモデル、Private Cloud Compute、App Intents、評価フレームワークを前提に機能を作る段階へ入ったと読める。

このサイトでは、[Google ADK for Android](/blog/google-adk-kotlin-android-agents-2026/) でモバイルアプリ内エージェントの実装論点を扱い、[Android Gemini Intelligence](/blog/google-android-gemini-intelligence-2026/) ではAIからアプリ機能が呼び出される時代の準備を整理した。Appleの今回の更新は、同じ「アプリがAIに接続される」流れを、Appleプラットフォームのプライバシー、Swift、App Intents、Siri AIの文脈で再定義するものだ。

日本の開発チームにとって重要なのは、「AppleもLLMを出した」という表面的な話ではない。顧客データをクラウドへ送らずに処理したいアプリ、端末内の画像や文章を使う業務アプリ、App Store向けの個人向けアプリ、SiriやSpotlightから呼び出されるアプリで、AI機能の設計境界が変わることだ。

## 事実: 第3世代Apple Foundation Modelsが出た

Apple Machine Learning Research の発表によると、第3世代 Apple Foundation Models は、Apple Intelligence の次世代体験を支えるモデル群として位置づけられている。Appleはこのモデル群を、オンデバイスモデルから Private Cloud Compute 上で動くサーバーモデルまで含むファミリーとして説明している。

発表で特に目立つのは、モデルが単一ではない点だ。Appleは、オンデバイス向けの **AFM 3 Core** と、より強力な **AFM 3 Core Advanced** を示している。Core Advanced はマルチモーダル能力を持ち、表現力のある音声や高精度な音声入力のような体験に関わると説明されている。Appleは同時に、モデルがApple Intelligenceの新しいSiriや、日常アプリを賢くする機能を支えると述べている。

一方で、開発者が直接触る入口は Developer Documentation 側にある。Foundation Models framework は、Apple Intelligence を支えるオンデバイスモデルへアクセスし、テキスト生成、要約、エンティティ抽出、文章理解、修正、ゲーム内対話、構造化出力、ツール呼び出しなどをアプリ内で扱うための枠組みだ。

ここでの事実は、AppleがAI機能を単なるシステム機能として閉じず、開発者がアプリ固有の体験へ組み込めるAPIとして提示したことだ。これは [Google Gemini for Home API](/blog/google-gemini-home-service-provider-api-2026/) が生活デバイスやサービス事業者へGeminiの入口を開いた流れとも似ているが、Appleの場合は端末、OS、App Store、Siri、Spotlightとの結びつきが強い。

## 事実: Foundation Models frameworkはSwift APIになる

Apple Developer の説明では、Foundation Models framework はネイティブ Swift API として示されている。アプリはApple Foundation Modelsへ、オンデバイスまたはPrivate Cloud Computeでアクセスできる。さらに、Language Model protocolに準拠するプロバイダーであれば、Apple以外のモデルも扱えるという設計が説明されている。

開発者向けの機能として重要なのは、まず guided generation だ。`@Generable` のような仕組みで、モデル出力をSwiftのデータ構造に合わせて生成させる。これは、自由文をあとからパースするより実装上の事故を減らしやすい。予約候補、商品比較、学習カード、レポート要約、ゲーム内イベントのように、アプリ側が期待する型へAI出力を寄せられる。

次に tool calling がある。モデルがアプリ側のコードを呼び出し、ローカルまたはオンラインの情報を取得したり、アプリ固有の処理を実行したりできる。これは、AIを「文章を返す部品」から「アプリ機能を使う部品」へ変える。たとえば、カレンダー、在庫、学習履歴、ローカル検索、顧客メモ、社内ナレッジなどを、アプリが定義した安全な範囲で参照させる設計が考えられる。

さらに、Appleはマルチモーダルプロンプト、Vision framework tools、Dynamic Profiles、Evaluations frameworkも説明している。画像とテキストを合わせて推論し、OCRやバーコードリーダーのような端末内ツールを使い、連続セッションの中でモデルやツールや指示を切り替え、AI機能が動的条件で正しく振る舞うかを評価する、という方向だ。

## 分析: 日本のiOS/macOS開発で何が変わるか

ここからは分析だ。

日本のiOS/macOSアプリ開発では、これまで生成AI機能を入れる場合、OpenAI、Anthropic、Google、AzureなどのクラウドAPIを呼ぶ構成が中心だった。これは強力だが、個人情報、通信、コスト、レイテンシ、オフライン、未成年利用、App Storeレビュー、社内規程の論点が重くなる。

Apple Foundation Models framework は、この前提を少し変える。軽い文章理解、要約、分類、抽出、ローカル文脈の補助を端末内で扱えるなら、すべてを外部APIへ送る必要はない。特に、日記、ヘルスケア、教育、家計、写真、社内メモ、現場記録のように、ユーザーがクラウド送信に敏感な領域では意味がある。

ただし、オンデバイスだから何でも安全という話ではない。アプリが端末内データをどう集め、何をモデルへ渡し、どの出力を保存し、どの操作を自動化するかは開発者の責任になる。AIがローカルで動いても、生成された文章が外部送信される、誤った要約が業務記録になる、ユーザーが意図しない行動をSiri経由で実行する、といったリスクは残る。

また、日本市場ではiOSアプリの比率が高い領域がある。金融、ポイント、EC、交通、教育、ヘルスケア、店舗アプリ、自治体サービスでは、ユーザーの端末内文脈と業務データを結びつけるAI機能が出やすい。一方で、法務、医療、金融、未成年向けでは、説明責任と人間確認の導線を省けない。

## App IntentsとSiri AIへの備え

Foundation Modelsだけを見ると、開発者がアプリ内でモデルを呼ぶ話に見える。しかしApple Developerの説明では、Apple IntelligenceはApp Intents、Siri AI、Spotlight、View Annotations、Shortcutsとも結びつく。

App Intentsは、アプリのコンテンツや操作をApple IntelligenceやSiri AIへ接続する入口になる。Entity schemasはアプリのコンテンツをSpotlightのsemantic indexへ寄与させ、intent schemasは自然言語からアプリ操作を可能にする。View Annotations APIは、画面上の内容をユーザーが会話で参照しやすくする方向を示している。

これは、AndroidのAppFunctionsに近い構造的な意味を持つ。すでに [Android Gemini Intelligence](/blog/google-android-gemini-intelligence-2026/) で整理したように、AIがアプリを呼び出す時代には、UIだけでなく「AIに安全に公開できる機能単位」が必要になる。Apple側でも同じく、アプリ機能をSiriやSpotlightにどう見せるか、どの操作に承認を挟むか、どのデータを文脈として使わせるかが競争力になる。

日本のアプリチームは、まず主要タスクを棚卸ししたほうがよい。検索、要約、下書き、候補提示、分類はAIに任せやすい。送信、決済、予約確定、個人情報共有、削除、契約に近い操作は、人間確認を強く設計すべきだ。AppleのAI機能が広がるほど、この線引きはUI設計ではなくプロダクト設計の問題になる。

## 導入前に見るべき実務論点

最初に確認すべきは、対象OSとモデル可用性だ。Foundation Models frameworkはApple Intelligenceを前提にするため、端末が対応しているか、ユーザーがApple Intelligenceを有効にしているか、モデルが準備済みかを確認する必要がある。モデルが使えない場合の代替UIを用意しないと、AI機能がアプリの必須導線を壊す。

次に、データ境界を決める。端末内で処理するのか、Private Cloud Computeへ出すのか、外部モデルプロバイダーへ渡すのかで、ユーザー説明、同意、ログ、規約、社内審査は変わる。AppleがPrivacyを強調していても、アプリ側が外部APIを組み合わせるなら、その責任は開発者側に戻る。

3つ目は評価だ。AppleはEvaluations frameworkを示している。これは重要で、生成AI機能は通常のユニットテストだけでは品質を測りにくい。入力の揺れ、言語、画像、ユーザー属性、禁止すべき出力、ツール呼び出しの失敗、モデル更新による変化を継続的に見る必要がある。

4つ目はコストと配布だ。Appleは、一定条件を満たすApp Store Small Business Program参加アプリについて、Private Cloud Compute上の次世代Apple Foundation ModelsをクラウドAPIコストなしで使えると説明している。ただし、すべての企業や全ユースケースに無条件で当てはまるわけではない。日本の事業会社は、自社アプリが条件に合うか、商用制限や地域・言語制限がないかを確認する必要がある。

## まとめ

Apple Foundation Models と Foundation Models framework は、Apple Intelligenceを開発者がアプリ機能へ組み込むための重要な入口だ。オンデバイスAI、Private Cloud Compute、Swift API、guided generation、tool calling、App Intents、Evaluations frameworkがまとまって出てきたことで、AppleプラットフォームのAI開発は、単なるチャット連携からアプリ設計そのものへ近づいた。

日本のiOS/macOS開発チームは、すぐに全機能をAI化する必要はない。まず、端末内で処理したい文章理解、要約、分類、下書き、画像理解の小さなユースケースから始めるべきだ。そのうえで、Siri AIやApp Intentsから呼び出される機能について、承認、ログ、フォールバック、評価を設計する。

重要なのは、AppleのAIを「安全そうなOS機能」として丸投げしないことだ。モデルが端末内にあっても、アプリが扱うデータと操作の責任は残る。クラウドLLM時代のAPI設計に加えて、端末内AI時代のプロダクト責任を持てるチームが、次のAppleプラットフォームで強くなる。

## 出典

- [Introducing the Third Generation of Apple's Foundation Models](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) - Apple Machine Learning Research, 2026-06-08
- [Foundation Models framework](https://developer.apple.com/documentation/foundationmodels/) - Apple Developer Documentation
- [Apple Intelligence](https://developer.apple.com/apple-intelligence/) - Apple Developer
- [What's new in Apple Intelligence](https://developer.apple.com/apple-intelligence/whats-new/) - Apple Developer
