---
article: 'anthropic-claude-platform-aws-2026-04-22'
level: 'child'
---

AmazonとAnthropicの協業拡大で注目されているのは巨額投資やTrainiumの大規模契約だが、日本の実務で効くのは `Claude Platform on AWS` の方だ。AWS公式は、AnthropicのネイティブなClaude PlatformをAWSアカウントから使えるようにすると説明している。しかもIAM、CloudTrail、統合請求をそのまま使える。

ここで大事なのは、「Amazon BedrockでClaudeを使う」のと「Claude Platform on AWSでAnthropic本家の体験を使う」のは同じではないことだ。AWSはFAQで両者の違いをかなり明確に書いている。

## 何が違うのか

Claude Platform on AWSは、Anthropicが運用するファーストパーティーのClaude Platformを、AWSの認証や請求に乗せて使う仕組みだ。AWS公式ページでは、追加の資格情報や別契約なしで、既存のAWS access controls と monitoring を使えると説明している。

一方のAmazon Bedrockは、AWSインフラ内でClaudeを含む複数モデルを使うための統合サービスだ。Guardrails、Knowledge Bases、regional data residency、PrivateLink のようなAWS管理機能もこちら側にある。

## いちばん重要な差

一番大きいのはデータ境界だ。

AWSは、Claude Platform on AWSでは customer data が **Anthropic outside the AWS boundary** で処理されると明記している。逆にClaude on Bedrockでは、データはAWSインフラ内で処理され、Anthropicや第三者に共有されないと書いている。

つまり、

- Anthropic本家の体験を優先するなら Claude Platform on AWS
- AWS内での処理と統制を優先するなら Bedrock

という整理になる。

## 日本企業にとって何がうれしいのか

日本企業では、モデル性能より前に、認証、監査、請求、調達の話で止まることが多い。Claude Platform on AWSは、そこをかなり減らせる可能性がある。既存のAWSアカウント、IAM、CloudTrail、AWS請求のまま進められるからだ。

AWS managed policy の `AnthropicFullAccess` もすでに公開されており、Claude Platform on AWS向けの権限面が整えられ始めている。これは、AWSがこの接続面を正式な企業導入ルートとして扱っているシグナルと見てよい。

## それでもBedrockが有力な会社

ただし、Bedrockが不要になるわけではない。むしろ日本では、厳しいデータ所在要件や複数モデル比較が必要な企業ほどBedrockの方が通しやすい。AWS自身も、厳格なregional data residencyが必要ならBedrockが向くと明言している。

## まとめ

今回のニュースの本質は、Claudeの性能ではなく、**Claudeを会社の中へどう入れるかの入口が増えた**ことにある。AWSアカウントでAnthropic本家へ入れるのは魅力的だが、データはBedrockと同じ条件ではない。日本企業はここを見分けたうえで選ぶ必要がある。

## 出典

- [Amazon and Anthropic expand strategic collaboration](https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai) - Amazon
- [Claude Platform on AWS (Coming Soon)](https://aws.amazon.com/claude-platform/) - AWS
- [Anthropic and Amazon expand collaboration for up to 5 gigawatts of new compute](https://www.anthropic.com/news/anthropic-amazon-compute) - Anthropic
- [AnthropicFullAccess - AWS Managed Policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AnthropicFullAccess.html) - AWS Documentation
