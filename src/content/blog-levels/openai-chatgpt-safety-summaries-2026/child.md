---
article: 'openai-chatgpt-safety-summaries-2026'
level: 'child'
---

OpenAIが、ChatGPTの安全機能を新しく説明しました。ポイントは、ChatGPTが **1つの質問だけを見るのではなく、前後の会話の流れも見て、危ないサインに気づきやすくする** ことです。

この仕組みは **safety summaries** と呼ばれています。日本語にすると「安全のための短い要約」のような意味です。

## 何が変わったの？

たとえば、ある人がChatGPTに何日も悩みを話していたとします。そのあとで、別の会話で一見ふつうの質問をしたとしても、前の流れと合わせると危ない意味を持つことがあります。

OpenAIは、そういうときにChatGPTが見落としにくくなるように、前の会話にあった安全上大事な情報を短くまとめる仕組みを作りました。これは、ユーザーの好きなものを覚えるための記憶ではありません。自傷や他害のような、とても危険な場面でだけ役立つように作られた安全の仕組みです。

ChatGPTは、その文脈をもとに、危ない情報を出さない、落ち着く方向へ会話する、専門の支援や信頼できる人につなげる、といった対応をしやすくなります。

## Trusted Contactとは？

OpenAIは少し前に **Trusted Contact** という機能も発表しました。これは、大人のユーザーが信頼できる人を1人登録しておき、本当に深刻な自傷の心配があるとき、その人に通知できるようにする任意の機能です。

ただし、OpenAIは通知の前に人間のレビューを入れると説明しています。また、通知には会話の全文や細かい内容を入れないとも説明しています。つまり、ただ自動で全部送る仕組みではありません。

safety summariesは、ChatGPTが会話の危険な流れに気づくための仕組みです。Trusted Contactは、必要なときに現実の人へつなぐための仕組みです。この2つは役割が違います。

## 会社で使うときに大事なこと

会社でChatGPTのようなAIチャットを使うとき、気にすることは情報漏えいだけではありません。相談窓口、学校、採用、人事、カスタマーサポートなどでは、使う人が強い悩みや危険な気持ちを書いてしまうことがあります。

そのとき、AIだけに任せるのはよくありません。会社側は、次のことを決めておく必要があります。

- どんな会話を危険な会話として扱うか
- いつ人間の担当者へ渡すか
- どの相談窓口を案内するか
- 会話ログを誰が見られるか
- 利用者にどこまで説明するか

以前の[OpenAIのアカウント保護の記事](/blog/openai-advanced-account-security-codex-2026/)では、誰がChatGPTを使えるかを守る話をしました。[Offline検索の記事](/blog/openai-offline-web-search-chatgpt-workspaces-2026/)では、ChatGPTが外のWebをどう調べるかを管理する話でした。今回の話は、会話そのものの安全をどう管理するかです。

## まとめ

OpenAIのsafety summariesは、ChatGPTが危ない会話の流れを見落としにくくするための仕組みです。ふつうの記憶機能ではなく、自傷や他害のような重大な場面にしぼって使われます。

日本の会社がAIチャットを使うなら、「AIが安全にしてくれるから大丈夫」では足りません。人間につなぐ手順、ログの扱い、利用者への説明をセットで決めることが大切です。

## 出典

- [Helping ChatGPT better recognize context in sensitive conversations](https://openai.com/index/chatgpt-recognize-context-in-sensitive-conversations/)
- [Introducing Trusted Contact in ChatGPT](https://openai.com/index/introducing-trusted-contact-in-chatgpt/)
- [GPT-5.5 Instant System Card](https://openai.com/index/gpt-5-5-instant-system-card/)
