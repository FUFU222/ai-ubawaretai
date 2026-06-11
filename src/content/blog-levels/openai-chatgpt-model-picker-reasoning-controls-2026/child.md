---
article: 'openai-chatgpt-model-picker-reasoning-controls-2026'
level: 'child'
---

OpenAI は 2026年6月10日、ChatGPT のモデル選択画面をわかりやすくする更新を出しました。これまでの Thinking Standard、Thinking Extended、Thinking Heavy のような名前は、Medium、High、Extra High という表現へ変わります。Pro プラン向けには Pro Standard と Pro Extended も残ります。

この変更は、画面の名前が変わっただけではありません。ChatGPT を会社で使う人にとっては、「どのモデルを選ぶか」よりも「どれくらい深く考えさせるか」を決める画面になってきた、という意味があります。

## 何が変わるのか

新しい選択肢は、ざっくり言えば次のように考えると理解しやすいです。

Instant は、速く返してほしい日常的な質問向けです。文章の下書き、短い要約、言い換え、軽い調査などで使いやすい選択です。

Medium は、少し複雑な相談や比較に向いています。複数の案を比べる、判断理由を整理する、資料の論点をまとめる、といった場面で使います。

High は、より深く考えてほしいときの選択です。原因分析、重要な企画判断、契約や規程の論点整理、複雑なコード変更の方針確認などで検討できます。

Extra High、Pro Standard、Pro Extended は、さらに重い作業や長時間の検討向けです。ただし、Pro では使えない機能もあるため、「一番強そうだから常に選ぶ」と考えないほうがよいです。

## Auto切替とは何か

OpenAI の説明では、Instant を選んだ場合でも、必要に応じてより深い推論へ自動的に切り替わることがあります。この Auto 的な動きは便利です。利用者が毎回悩まなくても、ChatGPT が難しそうな質問では深く考える方向へ寄せられるからです。

一方で、会社で使う場合は注意も必要です。利用者は Instant を選んだつもりでも、実際には重い推論が走ることがあります。費用や利用上限を管理している会社では、この点を管理者と利用者の両方が理解しておく必要があります。

## 会社の使い方はどう変えるべきか

社内ルールでは、細かいモデル名を暗記させるより、作業の種類で説明するほうがよいです。

たとえば、日常的な下書きは Instant、比較や整理は Medium、重要な判断は High、長い検討や専門レビューは Pro という分け方です。こうしておけば、今後また UI の名前が変わっても、社内の考え方は崩れません。

また、古い研修資料に Thinking Standard や Thinking Extended と書いてある場合は、早めに直したほうがよいです。利用者が画面で同じ名前を見つけられず、間違った設定で使う原因になります。

## 管理者が見るポイント

Enterprise や Edu の管理者は、Model Picker、Auto routing、RBAC、legacy models、flexible pricing の設定を確認したいところです。特に、誰が Pro や Thinking 系のモデルを使えるのか、Auto がどのモデルへ切り替わるのか、部署ごとの利用上限と矛盾していないかを見る必要があります。

モデル選択は、個人の好みではなくなっています。会社のデータ、接続アプリ、利用上限、監査、教育資料とつながる管理項目です。

## まずやること

最初に、社内の ChatGPT 手順書を検索します。古いモデル名、古いスクリーンショット、特定モデルだけを前提にした説明があれば、Instant、Medium、High、Pro という用途別の説明へ直します。

次に、よく使うプロンプトをいくつか選び、Instant、Medium、High で出力を比べます。どれが正しいかだけでなく、長さ、根拠、読みやすさ、確認質問の出方を見ます。

最後に、重要業務では「どの選択肢を使うか」だけでなく、「人間がどこで確認するか」も決めます。深い推論を使っても、最終判断を AI に任せる理由にはなりません。

今回の更新は、ChatGPT をより使いやすくするものです。同時に、会社で使うなら、モデル名ではなく作業リスクで使い分ける考え方へ移る合図でもあります。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [GPT-5.5 in ChatGPT](https://help.openai.com/en/articles/11909943) - OpenAI Help Center
- [ChatGPT Enterprise and Edu - Models & Limits](https://help.openai.com/en/articles/11165333-chatgpt-enterprise-and-edu-models-limits) - OpenAI Help Center
