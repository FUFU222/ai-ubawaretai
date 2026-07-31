---
article: 'openai-eu-ai-act-transparency-governance-2026'
level: 'child'
---

OpenAI は、2026年7月31日に、EU AI Act に向けた responsible AI の取り組みを整理しました。EU AI Act は、AIを安全で信頼できる形で使うための欧州のルールです。2026年8月2日からは、AI Office と各国当局による監督や、新しい透明性ルールがさらに重要になります。

これは欧州だけの話ではありません。日本企業でも、EU向けのSaaS、EC、広告、カスタマーサポート、採用、教育、セキュリティサービスでAIを使うなら、影響を受ける可能性があります。

## 何が発表されたのか

OpenAI は、EU AI Act の実装フェーズに合わせて、AIの安全性、透明性、コンテンツの来歴、サイバー用途の扱いをまとめました。具体的には、system cards、Preparedness Framework、Frontier Governance Framework、C2PA、SynthID、Trusted Access for Cyber などが出てきます。

むずかしく聞こえますが、要するに「このモデルはどのように安全確認されているのか」「AI生成コンテンツだとどう分かるのか」「危険な用途をどう管理するのか」を説明する材料です。

## 透明性ルールとは何か

EUでは、ユーザーがAIと会話している場合、それが人間ではなくAIだと分かるようにする必要があります。また、AIが作った画像、動画、音声、deepfake などには、AIで作られたことを示す表示や機械で読めるマークが求められます。

OpenAI は、Content Credentials、C2PA、SynthID などを組み合わせると説明しています。ただし、これだけで全部が解決するわけではありません。画像や動画を編集したり、SNSや広告配信システムに載せたりすると、metadata が失われることがあります。

## 日本企業が気をつけること

まず、EUの人や企業に届くAI利用を一覧にします。チャットボット、AI音声応答、AI生成画像、商品説明、採用文書、教育資料、セキュリティ診断などです。どこでAIを使っているか分からなければ、表示や説明もできません。

次に、AI生成物の表示ルールを決めます。誰が作ったのか、AIを使ったのか、どこに掲載するのか、あとから編集した場合にどう扱うのかを記録します。これは、以前の [OpenAI C2PA対応](/blog/openai-c2pa-synthid-provenance-2026/) の話ともつながります。

最後に、調達時の質問を増やします。system card はあるか。安全評価は公開されているか。AI生成物の来歴を確認するAPIはあるか。事故や苦情の報告先はあるか。こうした質問を、OpenAI だけでなく他のAIベンダーにも聞ける形にしておくと安心です。

## サイバー用途は別に管理する

OpenAI は、サイバー防御にAIを使う取り組みも説明しています。AIは、脆弱性の発見や防御の強化に役立ちます。一方で、悪用されると攻撃の自動化にもつながります。

そのため、会社では「AIに脆弱性を要約させること」と「攻撃手順を作らせること」を分ける必要があります。SOC、CSIRT、製品セキュリティ、委託先がAIを使う場合は、ログ、承認、検証環境、顧客データの扱いを決めておくべきです。

## まとめ

OpenAI の EU AI Act 対応は、単なる欧州向けニュースではありません。日本企業にとっても、AIを買うとき、使うとき、顧客へ説明するときのチェック項目が増えるという意味があります。

まずやることは、EU向けのAI利用を棚卸しすることです。次に、AI生成コンテンツの表示ルールを決めます。そして、モデル文書、安全評価、来歴確認、禁止用途、サイバー用途を調達質問票に入れます。AIの性能だけでなく、説明できる運用にすることが大切です。

## 出典

- [Advancing responsible AI across Europe](https://openai.com/index/advancing-responsible-ai-across-europe/) - OpenAI, 2026年7月31日
- [EU AI Act: OpenAI Resources and Customer Guidance](https://help.openai.com/en/articles/12141645-eu-ai-act) - OpenAI Help Center
- [Commission starts enforcing AI Act rules and new transparency requirements on 2 August](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) - European Commission, 2026年7月31日
