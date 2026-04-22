---
article: 'aws-bedrock-agentcore-harness-cli-2026-04-22'
level: 'child'
---

AWSは2026年4月22日に、Amazon Bedrock AgentCoreへ新しい始め方を追加しました。中心は `managed harness` と `AgentCore CLI` です。どちらも「AIエージェントを試したいが、最初の準備が重い」という悩みを減らすためのものです。

日本の開発チームにとって大事なのは、今回の発表を「新機能が増えた」で終わらせないことです。4月22日時点では、**東京リージョンですぐ使えるもの**と、**まだ東京では使えないもの**が分かれています。そこを整理すると、PoC の始め方を間違えにくくなります。

## 何が追加されたの？

AWSの公式発表では、managed harness はモデル、system prompt、tools を指定するだけで agent を動かせる preview 機能です。通常なら必要な orchestration code や実行ループの一部を AWS 側が持ってくれるので、まずアイデアを試しやすくなります。

一方の AgentCore CLI は、プロジェクト作成、ローカル検証、デプロイ、ログ確認までをターミナル中心で進めるための道具です。`agentcore create` や `agentcore deploy` で進める想定になっており、コードを書きながら AgentCore を使いたい人向けです。

つまり、

- managed harness は「まずすぐ動かす入口」
- CLI は「コードと運用に寄せる入口」

という理解で見ると分かりやすいです。

## 日本から何をすぐ試せるの？

ここが一番重要です。

AWSの4月22日付け What’s New とブログでは、managed harness preview の提供リージョンは `Oregon`、`N. Virginia`、`Frankfurt`、`Sydney` の4か所だけと説明されています。**東京リージョンは入っていません。**

でも、AWSの AgentCore リージョン表を見ると、`AgentCore Runtime`、`Memory`、`Gateway`、`Identity`、`Built-in Tools`、`Observability` などは `Asia Pacific (Tokyo)` に対応しています。さらに What’s New では、CLI は AgentCore が利用できる14リージョンで使えると書かれています。

要するに、4月22日時点では次の整理になります。

- managed harness: 日本から使えるが、preview は Sydney など対象リージョン前提
- CLI と主要機能: 東京リージョンでも検証しやすい

この差は、社内説明でかなり効きます。たとえば「軽い試作だけなら Sydney でよい」「本番を見据えるなら最初から Tokyo の Runtime / Gateway を軸にしたい」といった判断がしやすくなります。

## 気をつけるべき点は？

一つ目は権限です。

AWS ドキュメントでは、AgentCore CLI が作る IAM policy は development and testing 向けで、production 向けではないと明記されています。role 作成や policy 付与など、比較的広い権限が必要になるため、**PoC 用の権限と本番用の権限を分ける**ことが大事です。

二つ目は料金の見方です。

What’s New では harness、CLI、skills に追加料金はないとされています。ただし、AgentCore Pricing ページを見ると、Runtime や Browser Tool などは従量課金です。つまり「入口の機能に追加料金がない」のであって、**使った実行リソースまで無料という意味ではありません。**

三つ目は、managed harness と CLI を同じものだと思わないことです。managed harness は価値検証を速くする機能で、CLI は構成管理やデプロイを含めて育てていく道具です。どちらから入るかで、進め方が変わります。

## 日本チームはどう動くとよい？

実務では、次の順で考えると動きやすいです。

まず、データを使わない純粋な発想検証なら managed harness を検討する。リージョン条件だけ確認すれば、かなり速く試せます。

次に、社内システム接続や監査を見据えるなら、最初から東京リージョン前提で CLI と Runtime / Gateway を使う。こちらの方が、本番に近い説明がしやすいです。

最後に、権限と料金の話を PoC 前に押さえる。ここを後回しにすると、「触れたけれど社内展開できない」状態になりやすいです。

## まとめ

今回の AWS 発表は、Amazon Bedrock AgentCore を始めるハードルを下げる意味ではかなり良い更新です。ただし日本向けには、**managed harness は東京未対応、CLI と主要 primitives は東京対応、CLI 権限は広め、料金は従量課金が残る**、という見方が必要です。

この4点を押さえておけば、PoC を速く回すべきか、本番前提で丁寧に組むべきかを判断しやすくなります。

## 出典

- [Amazon Bedrock AgentCore adds new features to help developers build agents faster](https://aws.amazon.com/about-aws/whats-new/2026/04/agentcore-new-features-to-build-agents-faster/) - AWS What's New
- [Get to your first working agent in minutes: Announcing new features in Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/get-to-your-first-working-agent-in-minutes-announcing-new-features-in-amazon-bedrock-agentcore/) - AWS Machine Learning Blog
- [Supported AWS Regions - Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html) - AWS Documentation
- [IAM Permissions for AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-permissions.html) - AWS Documentation
- [Amazon Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing//) - AWS Pricing
