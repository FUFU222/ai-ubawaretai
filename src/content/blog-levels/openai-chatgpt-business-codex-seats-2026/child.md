---
article: 'openai-chatgpt-business-codex-seats-2026'
level: 'child'
---

OpenAIのHelp Centerで、ChatGPT BusinessやEnterpriseでCodexを使うときの座席と料金の考え方が整理されています。むずかしく見えますが、ポイントは「ChatGPTも使う席」と「Codexだけを使う席」を分けられるようになったことです。

これは、日本の会社がCodexを導入するときに大事です。全員に同じ席を配るのではなく、仕事に合わせて席を分けられるからです。

## Codexだけの席がある

ChatGPT BusinessやEnterpriseには、標準ChatGPT seatとCodex seatがあります。標準ChatGPT seatは、ChatGPTもCodexも使える席です。Codex seatは、Codexだけを使う席です。

Codex seatは、固定の月額料金がある席ではありません。使うにはworkspace creditsが必要です。つまり、席を用意するだけで終わりではなく、実際にCodexを動かすためのクレジットも必要になります。

以前の[OpenAI Codex利用枠更新](/blog/openai-codex-plan-credits-limits-2026/)では、Codexがプランごとにどう使えるかを見ました。今回は、その中でも会社向けに「誰にどの席を渡すか」を考える話です。

## クレジットを使って動く

Codexを使うと、入力や出力に応じてcreditsを消費します。たとえば、短い質問より、大きなコードベースを読ませる作業のほうが多く使います。長い修正案を出してもらう場合も、出力が増えるので消費が増えます。

Businessでは、ユーザーごとの利用枠を超えたときにworkspace creditsがあれば続けて使えます。EnterpriseやEduでは、契約単位の共有credit poolから消費されます。

ここで大事なのは、クレジットがなくなると作業が止まる可能性があることです。[Codex rate limit障害](/blog/openai-codex-rate-limit-incident-resilience-2026/)の記事でも見たように、AI開発ツールは便利なだけでなく、止まったときの運用も考える必要があります。

## 会社では役割で分ける

会社で使うなら、全員を同じ席にしないほうがよい場合があります。ChatGPTも広く使う人には標準ChatGPT seatが向きます。コード修正やレビュー補助に集中する開発者には、Codex-only seatが向くかもしれません。

たとえば、プロダクトマネージャーや開発リードは、仕様整理や調査にもChatGPTを使うので標準席がよいでしょう。一方、リポジトリ作業だけをする人は、Codex seatから始めてもよいかもしれません。

[OpenAI Codex Gartner評価](/blog/openai-codex-gartner-enterprise-coding-agents-2026/)で見たように、CodexのようなAI coding agentは企業の調達対象になっています。調達対象になるなら、誰に配るか、いくらまで使うか、誰が管理するかを決める必要があります。

## 管理者が決めること

会社はまず、誰がcreditsを管理するかを決める必要があります。開発者が自由に追加購入できるのか、情シスや管理者が承認するのかで、運用は大きく変わります。

次に、使う目的を決めます。テスト作成、コードレビュー、古いコードの調査、小さな修正など、効果を測りやすい作業から始めると安全です。いきなり大きな基幹システムの変更を任せるより、まずは作業ごとの消費量を見るほうがよいです。

最後に、ChatGPT workspaceとAPI Platform accessを混同しないことも大切です。OpenAIの説明では、ChatGPT Enterprise workspaceのメンバーであることは、API Platform organizationのメンバーであることを意味しません。

## まとめ

今回の更新は、Codexを会社で使うときの現実的な設計図です。標準ChatGPT seat、Codex-only seat、workspace credits、token-based rate cardを分けて考える必要があります。

日本の開発チームは、まず小さく始めて、どの作業がどれだけcreditsを使うかを見るべきです。そのうえで、標準席とCodex席を役割ごとに分ける。これが、Codexを個人の便利ツールではなく、会社の開発基盤として使うための第一歩です。

## 出典

- [What is ChatGPT Enterprise?](https://help.openai.com/en/articles/8265053-what-is-chatgpt-team) - OpenAI Help Center
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
- [Managing billing and seats in ChatGPT Business](https://help.openai.com/en/articles/8792536-manage-billing-on-the-chatgpt-team-subscription-plan) - OpenAI Help Center
