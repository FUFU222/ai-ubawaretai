---
article: 'openai-gpt-56-bedrock-ga-aws-governance-2026'
level: 'child'
---

AWS は 2026年7月13日、OpenAI の **GPT-5.6 Sol、Terra、Luna** を Amazon Bedrock で一般提供したと発表しました。

これは「新しいモデルが増えた」という話だけではありません。AWS をすでに使っている会社が、OpenAI モデルを **AWS の権限、請求、ログ、リージョン管理の中で使いやすくなる** という話です。

## 何が使えるようになったの？

Amazon Bedrock で使えるようになったのは、GPT-5.6 の3つのモデルです。

- **Sol**: 複雑な推論、コーディング、サイバーセキュリティ調査、長いエージェント作業向け
- **Terra**: 日常的な本番業務や開発支援向け
- **Luna**: 分類、要約、ルーティングなど、高頻度で軽い処理向け

OpenAI はすでに GPT-5.6 を API で一般提供しています。今回のポイントは、その GPT-5.6 を Bedrock 経由でも使えるようになったことです。

## Bedrock経由だと何が違うの？

OpenAI API に直接つなぐ場合、APIキー、請求、ログ、通信経路を OpenAI 側の導線として考える必要があります。

Bedrock 経由では、周辺の管理は AWS 側に寄ります。AWS の発表では、IAM、VPC、CloudTrail、data perimeter policies、in-Region inference などが強調されています。つまり、社内の AWS 管理ルールに合わせて OpenAI モデルを扱いやすくなります。

日本企業ではここが重要です。生成AIの導入では、モデルの賢さより先に、監査ログはどこに残るのか、個人情報を入れてよいのか、請求はどの部門に付くのか、ネットワークは閉じられるのか、という確認で止まりやすいからです。

## でも完全に同じではない

注意点もあります。

OpenAI の Bedrock ガイドでは、Bedrock は OpenAI の Responses API と互換性を持つ一方で、すべての機能が同じではないと説明されています。WebSocket connections は使えず、hosted tools や remote MCP server support も Bedrock では使えません。

また、GPT-5.4、GPT-5.5、GPT-5.6 の context window は Bedrock 上では 272,000 tokens と説明されています。OpenAI API 直結の仕様と同じ前提で長文処理を作っている場合は、移行前に確認が必要です。

## 費用で見るポイント

AWS は、Bedrock 上の GPT-5.6 pricing は OpenAI の first-party rates と一致し、利用が既存の AWS commitments にカウントされると説明しています。

これは大きな利点です。新しい SaaS 契約を増やすより、既存の AWS 支出として説明しやすくなる会社があるからです。

一方で、実際の費用はモデル単価だけでは決まりません。GPT-5.6 on Bedrock では prompt caching が使え、再利用できる入力は90%割引になると説明されています。長い system prompt や tool definitions を何度も使うエージェントでは効きますが、毎回 prompt が変わる設計では効果が小さくなります。

## 日本企業は何を確認すべき？

まず、Bedrock 経由にする価値がある業務を選ぶことです。たとえば、社内コード解析、監査ログ要約、ドキュメント検索、問い合わせ分類など、AWS の権限とログで管理したい処理が候補になります。

次に、Sol、Terra、Luna の使い分けを決めます。重い調査は Sol、日常業務は Terra、軽い大量処理は Luna という仮ルールを作り、実際の成功率、再試行、token、費用を測ります。

最後に、リージョンとデータ保持を確認します。AWS の発表では、Sol は US East の2リージョン、Terra と Luna は US East と US West の一部リージョンから始まります。日本国内処理が必須の業務では、そのまま本番利用できない可能性があります。

## まとめ

GPT-5.6 の Bedrock 一般提供は、OpenAI モデルを AWS の統制面で扱う選択肢を増やしました。

ただし、OpenAI API 直結と完全に同じではありません。日本企業は、Bedrock 経由で得られる監査・請求・権限管理の利点と、機能差、リージョン、データ保持の制約を分けて確認する必要があります。

## 出典

- [OpenAI GPT-5.6 Sol, Terra, and Luna are now generally available on Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/openai-gpt-5-6-sol-terra-and-luna-are-now-generally-available-on-amazon-bedrock/) - AWS Machine Learning Blog
- [OpenAI models in Amazon Bedrock](https://developers.openai.com/api/docs/guides/amazon-bedrock) - OpenAI Developers
- [Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI API Docs
- [OpenAI GPT-5.6 models now generally available on Amazon Bedrock](https://www.aboutamazon.com/news/aws/bedrock-openai-models) - About Amazon
