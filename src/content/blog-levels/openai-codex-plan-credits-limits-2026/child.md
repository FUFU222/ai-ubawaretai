---
article: 'openai-codex-plan-credits-limits-2026'
level: 'child'
---

OpenAIのHelp Centerで、CodexをChatGPTのどのプランで使えるのか、どのようにクレジットを使うのかが整理されました。これは新しいモデルの発表ではありません。でも、会社やチームでCodexを使う人には大事な更新です。

Codexは、コードを書いたり、直したり、レビューしたりするAIエージェントです。ChatGPTのアカウントで使えるため、個人のPlusやProだけでなく、BusinessやEnterpriseのワークスペースとも関係します。

## Codexはプランごとに使える量が違う

OpenAIの説明では、CodexはChatGPT Plus、Pro、Business、Enterprise/Eduなどで使えます。さらに期間限定で、ChatGPT FreeとGoにも含まれます。他のプランでは、期間限定でrate limitsが2倍になるとも説明されています。

ここで大事なのは、「使える」と「どれだけ使える」は同じではないことです。Codexを少し試すだけならFreeやGoでも入口になるかもしれません。しかし、仕事のコードを扱うなら、会社が管理するBusinessやEnterpriseのワークスペースで使う方が安全です。

[Codexのチーム向け従量課金](/blog/openai-codex-pay-as-you-go-teams-2026/)でも見たように、OpenAIはCodexをチーム導入しやすくしています。だからこそ、誰がどのプランで使うかを決める必要があります。

## クレジットはトークンで消費される

OpenAIのCodex rate cardでは、Codexの利用はトークンに応じたクレジット消費として説明されています。トークンとは、AIが読む文字や出す文字を細かく分けた単位です。

入力が長いほど、AIが読む量は増えます。出力が長いほど、AIが書く量も増えます。大きなコードベースを読ませたり、長い修正案を書かせたり、難しいモデルを使ったりすると、多くのクレジットを使います。

これは「1回質問したら同じ料金」という見方とは違います。小さな質問と、大きなリファクタリングの相談では、同じ1回でも消費が変わります。

## お金と制限は別に考える

クレジットが残っていても、短い時間にたくさん使うとrate limitsに当たることがあります。[Codex rate limits障害](/blog/openai-codex-rate-limit-incident-resilience-2026/)の記事で見たように、AI開発ツールは使えるときだけでなく、制限に当たったときの手順も大切です。

たとえば、リリース前に多くの人が同時にCodexへ大きな作業を頼むと、チーム全体で制限に近づくかもしれません。そのとき、何を先に進めるか、何を後回しにするかを決めておく必要があります。

## 会社で決めること

会社でCodexを使うなら、まず管理者を決めます。誰がワークスペース設定を見るのか、誰が追加クレジットを買えるのか、誰がpluginやconnected servicesを許可するのかを決めます。

次に、使う作業を決めます。テスト作成、コードレビュー、既存コード調査、UI修正のように、効果を測りやすい作業から始めるとよいです。いきなり大きな基幹システムの変更を丸ごと任せるのは危険です。

最後に、個人利用と業務利用を分けます。PlusやProでは、設定によって会話がモデル改善に使われる場合があります。BusinessやEnterpriseでは通常、業務データはモデル改善に使われないとOpenAIは説明しています。仕事のコードを扱うなら、この違いを理解しておくべきです。

## まとめ

今回の更新は、Codexをもっと便利に使うための料金と利用枠の整理です。FreeやGoで試しやすくなる一方、会社で使うならクレジット、rate limits、管理者権限、データ設定を見なければなりません。

日本の開発チームにとって大切なのは、Codexを「個人の便利ツール」として終わらせないことです。誰が使い、何に使い、いくらまで使い、止まったときにどう戻るのかを決める。それが、AIを開発の仕事に入れる第一歩になります。

## 出典

- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) - OpenAI Help Center
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
- [Flexible pricing for the Enterprise, Edu, and Business plans](https://help.openai.com/en/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans) - OpenAI Help Center
