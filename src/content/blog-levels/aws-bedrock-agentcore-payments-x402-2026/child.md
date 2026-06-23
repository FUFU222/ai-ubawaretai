---
article: 'aws-bedrock-agentcore-payments-x402-2026'
level: 'child'
---

AWS は 2026年6月22日に、Amazon Bedrock AgentCore Payments を使った AI エージェント課金の例を公式ブログで紹介しました。テーマは「pay-per-intelligence」です。これは、AI エージェントが外部サービスやデータを使い、その処理に応じて支払いと請求を扱う考え方です。

少し前にこのサイトで扱った Amazon Bedrock AgentCore は、AI エージェントを作って動かすための基盤でした。今回の話は、そのエージェントが **お金を使う** 場面に進んだものです。

## 何が新しいの？

これまでの AI サービスでは、ユーザーが月額料金を払い、裏側の API 利用料やクラウド費用はサービス提供者がまとめて管理することが多くありました。

AgentCore Payments の考え方では、AI エージェントがタスクの途中で外部 API、専門データ、業務ツールなどを使い、その利用に必要な支払いを扱えるようになります。たとえば、調査エージェントが有料データを買う、営業エージェントが外部の企業情報を取得する、業務エージェントが有料ツールを呼び出す、といったイメージです。

ただし、これは「AI に自由にお金を使わせる」という意味ではありません。むしろ大事なのは、どこまで支払いを許すか、いくらで止めるか、誰の承認が必要かを設計することです。

## なぜ日本企業に関係があるの？

日本企業では、支払いには社内ルールがあります。購買申請、稟議、請求書、予算管理、監査、個人情報の扱いなどが関わります。AI エージェントが外部サービスに支払うなら、開発チームだけでなく、経理、法務、情シスも早い段階で関わる必要があります。

特に注意したいのは、AI エージェントは何度も試行錯誤することです。人間なら「この API は高そうだからやめよう」と判断できますが、AI が自動で処理を進める場合、上限を決めておかないと費用が増えすぎる可能性があります。

だから、1回のタスクでいくらまで、1ユーザーで月いくらまで、部署全体でいくらまで、どの外部サービスだけ使ってよいかを決める必要があります。

## 開発チームが見るポイント

まず、支払いの単位を決めます。AI の費用は token 数だけでは説明しにくいことがあります。検索1回、外部ツール1回、成果物1件、調査レポート1本など、ユーザーに分かる単位にする方がよい場合があります。

次に、ログを残します。誰が依頼し、どの AI エージェントが、どの外部サービスに、いくら支払い、何の成果物に使ったのかを後で確認できるようにします。

さらに、失敗時の扱いも決めます。外部サービスへの支払いは成功したが、AI の答えが役に立たなかった場合、その費用を誰が負担するのかを決めておかないと、顧客向けサービスでは問題になります。

## まとめ

Bedrock AgentCore Payments は、AI エージェントを「便利な自動化ツール」から「支払いを伴う業務実行者」へ近づける更新です。

日本企業が見るべきなのは、技術の珍しさだけではありません。支払い上限、承認、監査ログ、返金、ユーザー説明を先に決めることです。ここを整えれば、AI エージェントを社内業務だけでなく、顧客向けの有料サービスにも使いやすくなります。

## 出典

- [Building pay-per-intelligence for AI agents: How Ampersend uses Amazon Bedrock AgentCore Payments](https://aws.amazon.com/blogs/machine-learning/building-pay-per-intelligence-for-ai-agents-how-ampersend-uses-amazon-bedrock-agentcore-payments/) - AWS Machine Learning Blog, 2026-06-22
- [Amazon Bedrock AgentCore Payments](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments.html) - AWS Documentation
- [What is Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) - AWS Documentation
