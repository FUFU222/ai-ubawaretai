---
article: 'openai-global-admin-keys-codex-analytics-2026'
level: 'child'
---

OpenAI は 2026年7月16日、ChatGPT Enterprise / Edu 向けに、Global Admin Console の管理機能を更新した。大きなポイントは2つある。1つ目は、管理者が **Admin keys** を作れるようになったこと。2つ目は、Codex や credit の利用状況を最大120日分見られるようになったことだ。

これは新しいAIモデルの発表ではない。でも、会社で ChatGPT や Codex を使うならかなり大事である。なぜなら、AIを使う人が増えるほど、「誰がどれくらい使っているか」「どの部署で費用が増えているか」「管理用のAPIキーを誰が持っているか」を見なければならないからだ。

## Admin keysとは何か

Admin keys は、ChatGPT や Codex の管理APIに使うための鍵である。たとえば、グループ管理、Spend Controls API、費用レポート、分析、compliance log などに関わる。

ここで間違えてはいけないのは、Admin keys はモデルを呼び出すためのAPIキーではないことだ。OpenAIの説明では、Admin keys は model inference へのアクセスを付与しない。つまり、アプリからAIへ質問を送るためのキーではなく、会社の ChatGPT / Codex workspace を管理するためのキーである。

そのため、普通の開発用APIキーとは別に扱う必要がある。推論用のキーが漏れると、モデル利用や入力データが問題になる。Admin key が漏れると、利用状況、費用、グループ、監査ログなどの管理面が問題になる。危険の種類が違う。

## Codex分析履歴で何が見えるか

Global Admin Console では、Codex と credit の analytics history が最大120日分見られる。Codex の利用状況、credits used、tokens used、message runs、lines of code generated、plugin calls、skills used、code review activity などが対象になる。

これは、開発チームにとっても管理部門にとっても意味がある。開発チームは、Codex がどれくらい使われているかを見られる。管理部門は、費用がどこで増えているかを見られる。情シスやセキュリティは、管理キーや利用履歴の棚卸しをしやすくなる。

ただし、Usage limits は引き続き ChatGPT の Workspace settings に残る。Global Admin Console だけを見れば全部管理できるわけではない。[ChatGPT Usage limits](/blog/openai-chatgpt-usage-limits-enterprise-2026/) で扱った月次上限と、今回の analytics は、別画面をまたいで確認する必要がある。

## 日本企業が気をつけること

まず、Admin key を1つだけ作って何でも使う運用は避けたほうがよい。読み取り用、費用レポート用、グループ管理用、Spend Controls 用のように分けるべきだ。

次に、キーには期限を付ける。OpenAI の説明では、Admin keys は expiration や permissions を設定でき、last-used date や creator も確認できる。使われていないキーは消す。誰が作ったかわからないキーを残さない。これは普通のSaaS管理と同じである。

また、Codex の利用量だけで成果を判断しないほうがよい。lines of code generated が多いことは、必ずしも良い成果とは限らない。レビューが通ったか、手戻りが減ったか、障害対応が早くなったか、費用に見合う効果があるかを見る必要がある。

## まとめ

今回の OpenAI 更新は、ChatGPT と Codex を会社で管理しやすくするための更新である。Admin keys によって管理APIを使いやすくなり、Codex analytics によって利用状況と費用を見やすくなる。

日本企業では、便利だからすぐ自動化するのではなく、まずキーの種類、権限、保管場所、期限、失効手順を決めるべきだ。そのうえで、Codex の利用履歴を [Codex支出管理](/blog/openai-codex-business-spend-controls-2026/) や [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) と合わせて見ると、AI利用を業務基盤として管理しやすくなる。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-16
- [Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
