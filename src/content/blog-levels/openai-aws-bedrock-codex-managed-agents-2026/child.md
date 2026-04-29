---
article: 'openai-aws-bedrock-codex-managed-agents-2026'
level: 'child'
---

OpenAIとAWSが2026年4月28日に、**OpenAI models on Amazon Bedrock**、**Codex on Amazon Bedrock**、**Amazon Bedrock Managed Agents, powered by OpenAI** をまとめて発表しました。全部 **limited preview** ですが、日本企業にとってはかなり大きい変化です。

ポイントは、「OpenAIを使えるようになった」だけではありません。**AWSのいつもの権限、ログ、請求、ネットワーク統制の中でOpenAIを扱いやすくなる** ことが重要です。

## 何が出たの？

今回出たのは3つです。

- OpenAI models on Bedrock
- Codex on Bedrock
- Bedrock Managed Agents, powered by OpenAI

AWS News Blogによると、モデル側は **GPT-5.5** と **GPT-5.4** を含む最新OpenAIモデルが対象です。Codexは **CLI**、**デスクトップアプリ**、**VS Code拡張** からBedrock経由で使えるようになります。Managed Agentsは、OpenAIモデルを使ったエージェントをAWS上で本番運用しやすくするための新しい導線です。

## 何が変わるの？

AWSの一次情報では、OpenAI models on Bedrock は **IAM**、**AWS PrivateLink**、**guardrails**、**暗号化**、**CloudTrail logging** を前提に使えると説明されています。つまり、OpenAIを別の外部SaaSとして雑に追加するより、既存AWS運用に乗せやすい。

Codexも同じで、AWS credentials で認証し、Bedrock経由で推論します。OpenAI公式は、**security, billing, high availability** を AWS の属性として受けられると説明しています。さらに、対象顧客は **AWS cloud commitments** に利用を充てられると明記されています。

## 日本企業にはなぜ効くの？

日本企業で生成AI導入が止まりやすいのは、性能よりも **調達、監査、ネットワーク、請求の説明** が重いからです。

今回の発表は、その障害を下げます。なぜなら、

- 既存のAWSアカウント運用に寄せられる
- CloudTrailなど既存監査の話に落とし込みやすい
- クラウド予算やコミットの文脈で説明しやすい
- 他のBedrockモデルと同じ面で比較しやすい

からです。

特に「OpenAIを使いたいが、直接契約は社内が通しにくい」という会社には相性がよさそうです。

## まだ注意すべき点は？

現時点では3つとも **limited preview** です。一次ソースだけでは、料金、提供リージョン、一般提供時期、Managed Agentsの細かな責任分界までは見えません。

なので、今の段階で大事なのは「全社標準に決めること」より、**どの業務を小さく試すかを決めること** です。OpenAIモデルだけ欲しいのか、Codexを開発現場に入れたいのか、業務エージェントまで見たいのかで、検証の進め方は変わります。

## まとめ

今回のOpenAIとAWSの発表は、OpenAIの性能ニュースというより、**企業導入の入口がAWS側へ広がった** というニュースです。日本企業にとっては、「OpenAIを使うか」より「AWS統制の中でOpenAIを扱えるか」を判断しやすくなった点が本質だと思います。

## 出典

- [OpenAI models, Codex, and Managed Agents come to AWS](https://openai.com/index/openai-on-aws/) - OpenAI
- [Amazon Bedrock now offers OpenAI models, Codex, and Managed Agents (Limited Preview)](https://aws.amazon.com/about-aws/whats-new/2026/04/bedrock-openai-models-codex-managed-agents/) - AWS
- [AWS and OpenAI announce expanded partnership to bring frontier intelligence to the infrastructure you already trust](https://www.aboutamazon.com/news/aws/bedrock-openai-models) - About Amazon
- [Top announcements of the What’s Next with AWS, 2026](https://aws.amazon.com/blogs/aws/top-announcements-of-the-whats-next-with-aws-2026/) - AWS News Blog
