---
article: 'aws-bedrock-agentcore-multitenant-saas-2026'
level: 'child'
---

AWS は 2026年6月23日に、Amazon Bedrock AgentCore を使って「複数のお客さんに同じ AI 基盤を使ってもらう」ための設計例を公開しました。専門用語では、これをマルチテナント設計と呼びます。

たとえば、ある SaaS 会社が AI アシスタントを作り、A社、B社、C社に提供するとします。裏側のサーバーや AI エージェントは共通でも、それぞれの会社のデータ、会話履歴、料金、利用上限は混ざってはいけません。今回の AWS 記事は、この「共有しながら分ける」方法を AgentCore でどう作るかを示しています。

## 何が問題になるの？

AI エージェントは、普通のチャットより多くのものに触ります。過去の会話を覚える Memory、文書を探す Knowledge Base、外部 API を呼ぶ Gateway、実行ログ、利用料金などが関係します。

もし A社の質問に答えるときに、B社の文書や会話が混ざったら大問題です。逆に、すべての会社に専用サーバーを用意すると、コストと運用が重くなります。そこで AWS の例では、共有インフラを使いつつ、tenant_id や tier を使ってデータや機能を分ける方法を示しています。

## tier、tenant、userを分けて考える

AWS の例では、Basic と Premium のような料金プランを tier として扱います。その中に clinic や hospital のような tenant があり、さらにその中に user がいます。

これは日本の SaaS でもよくある形です。たとえば、Basic プランでは軽いモデルだけ使える、Enterprise プランでは高性能モデルや追加ツールが使える、という分け方です。同じ会社の中でも、管理者と一般ユーザーでは使える機能が違うかもしれません。

大事なのは、AI エージェントに「今の利用者はどの会社の誰で、どのプランなのか」を最後まで持たせることです。ログイン時だけ分かっていても、文書検索や外部ツール呼び出しの時にその情報が消えると、分離が弱くなります。

## コストもテナントごとに見る

AI 機能は、使われるほど費用が増えます。モデルの token、外部 API、検索、ツール実行などが積み上がるからです。

AWS の例では、Bedrock Projects や CloudWatch の構造化ログを使い、tier や tenant ごとに利用量を追う考え方が出ています。これは SaaS 会社にとって重要です。どのお客さんがどれくらい AI を使っているか分からないと、価格を決めにくくなります。

月額料金だけで提供しているつもりでも、一部のお客さんが大量に使うと赤字になるかもしれません。だから、利用上限、プラン差、追加課金、管理画面での見える化を早めに考える必要があります。

## 日本企業が見るべきポイント

日本企業がこの話を読むときは、「AWS の新機能がすごい」で終わらせないほうがよいです。見るべきなのは、自社の AI 機能で次の説明ができるかです。

まず、他社データと混ざらないこと。次に、どのプランでどの機能が使えるか。さらに、誰がどの AI エージェントを使い、どのデータを見て、どれくらい費用が発生したかを後で確認できることです。

これらが説明できれば、AI 機能を安心して顧客向けに出しやすくなります。反対に、ここが弱いと、PoC では動いても本番導入で止まりやすくなります。

## まとめ

AgentCore のマルチテナント設計は、AI エージェントを SaaS として提供するための土台です。共有インフラでコストを抑えながら、データ、権限、料金、ログをテナントごとに分ける必要があります。

日本の SaaS 企業や業務 AI チームは、モデルの性能だけでなく、テナント分離、プラン別機能、監査ログ、コスト配賦をセットで設計することが大切です。

## 出典

- [Shared infrastructure, isolated tenants: Pool model multi-tenancy with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/machine-learning/shared-infrastructure-isolated-tenants-pool-model-multi-tenancy-with-amazon-bedrock-agentcore/) - AWS Machine Learning Blog, 2026-06-23
- [What is Amazon Bedrock AgentCore?](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) - AWS Documentation
- [Explore SaaS Tenant Isolation Strategies in New SaaS Whitepaper](https://aws.amazon.com/blogs/apn/explore-saas-tenant-isolation-strategies-in-new-saas-whitepaper/) - AWS APN Blog
