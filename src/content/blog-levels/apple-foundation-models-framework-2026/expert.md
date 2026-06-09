---
article: 'apple-foundation-models-framework-2026'
level: 'expert'
---

Apple の **第3世代 Apple Foundation Models** と **Foundation Models framework** は、Apple Intelligenceを開発者が直接使うための技術面を一段引き上げる更新だ。重要なのは、モデル発表そのものより、Appleがオンデバイスモデル、Private Cloud Compute、Swift API、Language Model protocol、App Intents、Evaluations frameworkを一つの開発体験としてつなげようとしている点にある。

すでに [Google ADK for Android](/blog/google-adk-kotlin-android-agents-2026/) では、モバイルアプリ内にエージェント的な処理を入れる論点が出ていた。[Android Gemini Intelligence](/blog/google-android-gemini-intelligence-2026/) では、AIがアプリ機能を呼び出すために、AppFunctionsやUI automationのような入口が重要になると整理した。Appleの今回の更新は、同じ変化をAppleプラットフォームの言葉で進めるものだ。

日本のiOS/macOS開発チームが読むべき論点は、モデル性能の優劣だけではない。端末内処理をどこまで使えるか、Private Cloud Computeへ何を渡すか、Siri AIやSpotlightからアプリ機能をどう呼ばせるか、生成AI機能をどう評価し、どこで人間確認を入れるか。この4点が実装とプロダクト判断の中心になる。

## 事実: Apple Foundation Modelsは端末とPCCをまたぐモデル群

Apple Machine Learning Research は 2026年6月8日付で、第3世代 Apple Foundation Models を公開した。発表では、Apple Intelligenceの次世代体験を支えるモデル群として、オンデバイスモデルからPrivate Cloud Compute上のサーバーモデルまでを含む構成が示されている。

Appleは、このモデル群が新しいSiriや、日常的なアプリ体験を賢くする機能を支えると説明している。オンデバイス側では AFM 3 Core と AFM 3 Core Advanced が紹介され、Core Advanced はマルチモーダル能力を持つ、より強力な端末向けモデルとして位置づけられている。

この構造は、開発者にとって2つの意味を持つ。第一に、AppleはAI処理をすべてクラウドへ寄せていない。端末内で動くモデルを中核に置き、より重い処理や高品質な生成にはPrivate Cloud Computeを組み合わせる方向だ。第二に、アプリ開発者は「どの処理を端末で閉じるか」「どの処理をPCCへ出すか」「外部モデルを使うか」をユースケース単位で考える必要がある。

日本企業の観点では、ここが重要だ。個人情報保護、金融・医療・教育の説明責任、社内規程、データレジデンシー、端末管理を考えると、外部クラウドLLMへ一律送信する設計は通りにくいことがある。オンデバイス処理の選択肢が増えるほど、AI機能の設計は「モデル選定」ではなく「データ経路設計」に近づく。

## 事実: Foundation Models frameworkがアプリ内AIの入口になる

Apple Developer Documentation では、Foundation Models framework が Apple Intelligence の中核にあるオンデバイスモデルへアクセスするための枠組みとして説明されている。テキスト生成、要約、エンティティ抽出、文章理解、文章の修正、ゲーム内対話、構造化出力、ツール呼び出しなどが対象になる。

DeveloperのApple Intelligenceページでは、Foundation Models framework はネイティブSwift APIとして説明されている。Apple Foundation ModelsにオンデバイスまたはPrivate Cloud Computeでアクセスでき、さらにLanguage Model protocolに準拠するプロバイダーであれば、Apple以外のモデルも扱えるとされている。

この設計で特に見るべきなのは、guided generation、tool calling、Dynamic Profiles、Evaluations frameworkだ。

guided generationは、モデルに自由文を出させてからJSON風に整えるのではなく、アプリが求める型へ出力を寄せるための仕組みだ。Swiftのデータ構造に近い形でAI出力を扱えるなら、予約候補、診断ではない健康メモ、店舗報告、学習カード、ゲーム内イベント、写真タグ、FAQ回答などで実装事故を減らしやすい。

tool callingは、モデルがアプリ側のコードを呼び出す仕組みだ。ここで重要なのは、AIが何でも自由に操作するのではなく、開発者が定義した道具だけを使う点にある。ローカル検索、カレンダー参照、社内ナレッジ検索、在庫確認、計算、フォーマット変換のような処理を、権限と入力条件を絞って公開できる。

Dynamic Profilesは、連続セッション内でモデル、ツール、指示を切り替える設計を示している。これは業務アプリで効く。たとえば、同じセッションでも「入力内容の要約」「規程チェック」「送信前の丁寧語変換」「管理者向けログ要約」では、使う指示や許すツールが違う。プロファイルを分けることで、1つの万能プロンプトへ詰め込む設計を避けられる。

Evaluations frameworkは、生成AI機能を製品品質へ載せるうえで重要だ。AI出力は通常のユニットテストだけでは評価しにくい。入力の言い換え、日本語の敬語、画像品質、端末状態、モデル更新、ツール失敗、安全フィルタ、地域・言語差を含めた評価が必要になる。Appleが評価を開発者導線に入れている点は、実務上かなり大きい。

## App IntentsとSiri AIは別の入口ではなく同じ設計問題

Apple Intelligenceページでは、App Intents framework がSiri AIやApple Intelligenceへアプリのコンテンツと操作を接続する仕組みとして説明されている。Entity schemasはアプリのコンテンツをSpotlightのsemantic indexへ寄与させ、intent schemasは自然言語からアプリの行動を実行できるようにする。View Annotations APIは、画面上の内容を会話の参照対象にできる方向を示している。

これは、Foundation Models frameworkとは別物に見えるが、実務では同じ設計問題になる。アプリ内でAIに使わせるツール、Siri AIに公開するintent、Spotlightへ出すentity、画面上の参照可能な要素は、すべて「アプリのどの情報と行動を、どの条件でAIに渡すか」という設計に属する。

たとえば、家計簿アプリなら「先月の支出を要約する」は読み取り中心でAIに向く。一方、「今月の予算を変更する」「家族に共有する」「外部サービスへ送信する」は確認が必要だ。学習アプリなら「苦手分野を要約する」はよいが、「評価を確定する」「保護者へ通知する」は別の承認設計が必要になる。

この構造は [Google Gemini for Home API](/blog/google-gemini-home-service-provider-api-2026/) とも比較できる。Google Homeの文脈では、AIが家庭内デバイスやサービス事業者の機能に近づく。Appleの文脈では、AIがiPhoneやMac上のアプリ、Siri、Spotlight、Shortcutsへ近づく。どちらも、AIが「画面の外」からアプリ機能を呼ぶ時代の話だ。

## 日本の開発チームで優先すべきユースケース

最初に優先すべきは、読み取りと下書きだ。ユーザーのメモを要約する、写真から説明文を作る、入力フォームの下書きを作る、文章を丁寧に言い換える、学習履歴から復習項目を出す、社内規程の候補を提示する。これらは誤りがあっても人間が確認しやすく、AI導入のリスクを限定しやすい。

次に、端末内の文脈が価値になる用途だ。写真整理、日記、ヘルスケア記録、語学学習、旅行、店舗巡回、フィールドサービス、営業メモなどでは、ユーザーが手元に持つ端末内データを使えることが価値になる。外部APIへ送らずに処理できる範囲が増えれば、導入判断はしやすくなる。

3つ目は、SiriやShortcutsから自然言語で呼ばれる機能だ。ユーザーがアプリを開かずに「次の予定に合わせて準備メモを作って」「この写真を案件フォルダ向けに分類して」「前回と同じ条件で予約候補を出して」と頼む場面を想定する。ここではApp Intentsの設計と、AI出力の人間確認がセットになる。

一方で、最初から避けたいのは、金銭、医療判断、法的判断、予約確定、個人情報共有、削除、外部送信をAIが自動で完了する設計だ。これらは便利に見えても、誤操作時の被害が大きい。まずは下書きと確認に留め、操作の確定はユーザーに残すべきだ。

## 実装前チェックリスト

第一に、可用性を確認する。対象端末がApple Intelligenceに対応しているか、ユーザーが有効化しているか、モデルが利用可能か、地域・言語制限があるかをアプリ側で扱う必要がある。AIが使えない場合の通常導線を残さないと、機能の信頼性が落ちる。

第二に、データ経路を設計する。端末内で閉じるデータ、Private Cloud Computeへ渡すデータ、外部モデルプロバイダーへ渡すデータを分ける。Appleのフレームワークがプライバシーを前面に出していても、開発者が外部モデルや自社APIを組み合わせるなら、説明と同意と監査は必要になる。

第三に、ツール境界を切る。モデルに渡すToolは、読み取り専用、下書き作成、ローカル計算、検索、外部送信、削除のようにリスク別に分ける。外部送信や削除に近いToolは、モデルから直接実行させず、ユーザー確認画面を挟む設計にする。

第四に、出力の型を固定する。guided generationを使える場面では、自由文より型付きデータを優先する。社内アプリなら、報告書本文、危険度、確認項目、根拠、未確認事項を分ける。消費者向けアプリなら、表示用の短い要約、詳しい説明、注意書き、次のアクションを分ける。

第五に、評価を継続する。Evaluations frameworkや独自の評価データを使い、日本語、方言、敬語、専門用語、画像品質、拒否すべき入力、子ども向け表現、アクセシビリティを確認する。モデル更新で挙動が変わる可能性があるため、リリース前だけでなく継続評価が必要だ。

第六に、ログとフィードバックを決める。どのプロンプト、どの入力、どの出力、どのツール呼び出し、どのユーザー修正を保存するのかを決める。個人向けアプリでは保存しすぎがリスクになる。企業向けアプリでは保存しなさすぎると監査できない。用途ごとにバランスが違う。

## OpenAIやGoogleとの使い分け

Apple Foundation Models frameworkは、OpenAIやGoogleのクラウドAIを置き換える万能基盤ではない。むしろ、端末内文脈とOS統合に強い入口として見るべきだ。

クラウド側で長時間の作業や開発タスクを走らせるなら、[OpenAI Codexのモバイル遠隔運用](/blog/openai-codex-mobile-remote-access-2026/) のような設計が別にある。大量文書、社内検索、長い推論、複数システム連携、管理者統制は、クラウドAI基盤や自社バックエンドへ寄せたほうがよい場面が多い。

一方、端末上の短い支援、画像とテキストの即時理解、ユーザーが見ている画面への補助、オフラインに近い体験、App IntentsやSiriから自然に呼ばれる操作は、Appleのフレームワークを優先的に評価する価値がある。特に、iOSアプリが顧客接点の中心である日本企業では、この差は大きい。

実務では、Apple、Google、OpenAIを排他的に選ぶより、層で分けるのが現実的だ。端末内の軽い処理はApple Foundation Models。Android側はGemini / ADK。長時間処理や社内基盤はOpenAI、Anthropic、Google Cloud、Azureなど。重要なのは、ユーザーには一貫した体験を出しつつ、内部ではデータ感度と処理特性に応じてAI基盤を分けることだ。

## まとめ

Apple Foundation Models frameworkは、AppleプラットフォームのAI開発を、クラウドAPI呼び出し中心から、端末・OS・アプリ機能をまたぐ設計へ移す更新だ。第3世代Apple Foundation Models、オンデバイス処理、Private Cloud Compute、Swift API、tool calling、guided generation、App Intents、Evaluations frameworkが組み合わさることで、iOS/macOSアプリのAI機能はより深くプロダクト設計へ入り込む。

日本の開発チームは、まず読み取り、要約、下書き、分類、画像理解のような低リスク用途から始めるべきだ。そのうえで、Siri AIやSpotlightから呼ばれる機能、App Intentsの公開範囲、AIが使うTool、PCCや外部モデルへのデータ経路を設計する。

オンデバイスAIは、クラウド送信を減らせる強い選択肢だ。しかし、AIが扱うデータと操作の責任が消えるわけではない。Appleの今回の更新を実務に落とすなら、モデル性能より先に、データ境界、承認境界、評価境界を決めることが重要になる。

## 出典

- [Introducing the Third Generation of Apple's Foundation Models](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) - Apple Machine Learning Research, 2026-06-08
- [Foundation Models framework](https://developer.apple.com/documentation/foundationmodels/) - Apple Developer Documentation
- [Apple Intelligence](https://developer.apple.com/apple-intelligence/) - Apple Developer
- [What's new in Apple Intelligence](https://developer.apple.com/apple-intelligence/whats-new/) - Apple Developer
