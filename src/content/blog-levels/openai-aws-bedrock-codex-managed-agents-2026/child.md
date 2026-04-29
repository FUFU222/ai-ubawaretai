---
article: 'openai-aws-bedrock-codex-managed-agents-2026'
level: 'child'
---

OpenAIとAWSが2026年4月28日に発表したのは、**OpenAIのモデルやCodexをAmazon Bedrock経由で使えるようにする**動きです。さらに、OpenAI poweredな Managed Agents も Bedrock に載せると案内されました。いまは limited preview ですが、日本の企業にとってはかなり重要です。

なぜかというと、企業で生成AIを入れるときは「AIが賢いか」より先に、**既存のAWS運用の中で安全に扱えるか**が問題になるからです。

## 何が発表されたの？

一次ソースで確認できるのは3点です。

1つ目は、**OpenAI models on Amazon Bedrock**です。OpenAIの最新モデルを、AWSのBedrock経由で使えるようにするものです。

2つ目は、**Codex on Amazon Bedrock**です。OpenAIによると、Codex CLI、デスクトップアプリ、VS Code拡張からBedrock providerを設定できるようになります。AWS側は、認証にAWS credentialsを使い、推論はBedrockで処理すると説明しています。

3つ目は、**Amazon Bedrock Managed Agents, powered by OpenAI**です。AWSの説明では、各エージェントが固有のidentityを持ち、行動ログを残し、推論はAmazon Bedrock上で実行されます。

## 何が実務上うれしいの？

いちばん大きいのは、OpenAIを使う入口がAWS寄りになることです。

AWS What's New では、OpenAI models on Bedrock が IAM、PrivateLink、guardrails、encryption、CloudTrail logging を継承すると説明されています。つまり、今までAWS中心で管理していた企業は、OpenAI系の機能も**既存の統制に近い形で評価しやすくなる**可能性があります。

Codexについても、OpenAIとAWSの両方が、AWS側の認証や請求、運用の中で扱えることを前面に出しています。AWSは usage を既存の cloud commitments に充当できるとも案内しています。

これは日本企業にとって重要です。新しいAIツールを別契約・別監査で入れるより、既存のAWS予算や運用の延長として扱えた方が、社内調整が進めやすいからです。

## 何に気をつければいいの？

ここで過度に期待しすぎないことも大事です。現時点では limited preview で、料金、リージョン、SLA、一般提供時期などの細部はまだ見えていません。

そのため、実務では次の順で考えるのがよさそうです。

- まず使いたいのがモデル利用なのか、Codex導入なのか、Managed Agentsなのかを分ける
- 次にIAM、CloudTrail、ネットワーク境界、予算配賦をどう扱うか確認する
- 最後にpreview条件や責任分界を見て、本番導入の可否を判断する

## まとめ

今回の発表は、「OpenAIがAWSに来た」という話で終わりません。日本企業にとっての本質は、**OpenAI系の機能を既存AWS統制の中で扱える可能性が出てきた**ことです。

ただし、まだ preview 段階です。だから今は全面導入を急ぐより、どの用途から試すか、どの統制項目を確認するかを整理する段階だと見るのが実務的です。

## 出典

- [OpenAI models, Codex, and Managed Agents come to AWS](https://openai.com/index/openai-on-aws/) - OpenAI
- [Amazon Bedrock now offers OpenAI models, Codex, and Managed Agents (Limited Preview)](https://aws.amazon.com/about-aws/whats-new/2026/04/bedrock-openai-models-codex-managed-agents/) - AWS What's New
- [Top announcements of the What’s Next with AWS, 2026](https://aws.amazon.com/blogs/aws/top-announcements-of-the-whats-next-with-aws-2026/) - AWS News Blog
