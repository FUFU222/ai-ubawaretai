---
article: 'openai-codex-260609-reset-developer-mode-2026'
level: 'child'
---

OpenAI は 2026年6月11日、Codex app 26.609 の更新を公開しました。大きなポイントは、Codex の利用枠を回復しやすくする rate-limit reset banking と、ブラウザの問題を深く調べる Developer mode です。

Codex は、コードを書いたり、調べたり、ブラウザで画面を見ながら修正したりするAIエージェントです。今回の更新は、モデルが新しくなったという話ではありません。Codexを仕事で使うときに、どれだけ使えるか、どこまでブラウザを調べさせるか、どんな権限を許すかに関係します。

## reset bankingとは何か

reset banking は、Codex の rate limit に当たったときに使える reset を貯めておく仕組みです。OpenAI の説明では、対象の Plus と Pro ユーザーには、開始時に無料の reset が1つ付与されます。

さらに、対象ユーザーは Codex app から友人を招待できます。招待された人が最初の Codex message を送ると、招待した人と招待された人の両方が banked reset を受け取ります。この reset は、付与されてから30日間使えると説明されています。

ただし、これは「Codexを無制限に使える」という意味ではありません。あくまで、利用枠に当たったときの回復手段です。[Codex利用枠更新](/blog/openai-codex-plan-credits-limits-2026/)で見たように、Codexの使える量はプランや作業内容で変わります。大きなコードを読ませたり、長い修正をさせたりすると、消費は増えます。

## Businessでは別のcreditとして見る

個人向けの Plus / Pro では reset が中心です。一方、Business workspace では、同僚を招待して shared workspace credits を得る別の紹介プログラムがあります。つまり、個人の reset と会社の credit は分けて考える必要があります。

会社でCodexを使うなら、「個人のPlusでresetがあるから業務コードも進める」と考えるのは危険です。仕事のコードや顧客データを扱うなら、会社が管理するBusinessやEnterpriseのワークスペースを使うべきです。

この考え方は、[Codex制限障害](/blog/openai-codex-rate-limit-incident-resilience-2026/)の話ともつながります。Codexが使えなくなったとき、原因がrate limitなのか、credit不足なのか、サービス側の問題なのかで対応が変わるからです。

## Developer modeとは何か

Developer mode は、Codex がブラウザをもっと詳しく調べるための機能です。OpenAI は、Chrome や Codex in-app browser で、Codex が Chrome DevTools Protocol を使えるようになると説明しています。

これにより、Codex は画面を見るだけでなく、console error、network traffic、DOM、CSS、JavaScript の動きなどを調べられます。たとえば、ボタンが押せない理由がCSSなのか、APIエラーなのか、JavaScriptの例外なのかを調べやすくなります。

フロントエンド開発では便利です。[Codex Goalモードとブラウザ注釈](/blog/openai-codex-goal-appshots-browser-2026/)で見たように、Codexは画面を見ながら修正する方向へ進んでいます。Developer mode は、その調査力を強くする機能です。

## 注意すべきこと

Developer mode は、便利な一方で注意が必要です。ブラウザの内部情報には、ログイン中の画面、APIの返答、社内データ、顧客情報が含まれることがあります。OpenAI も、full CDP access を使う前に明示的な承認が必要だと説明しています。

日本の会社で使うなら、まず使ってよい画面を決めましょう。ローカル開発サーバーや検証環境では使いやすいです。本番環境や顧客データが見える管理画面では、すぐに許可しないほうが安全です。

また、`/init` コマンドにも注目です。これは AGENTS.md というプロジェクト指示ファイルのひな形を作る機能です。Codexにテスト方法、禁止操作、コードスタイルを伝える入口になります。

## まとめ

OpenAI Codex 26.609 は、使える量を少し柔軟にし、ブラウザの調査を深くし、プロジェクト指示を作りやすくする更新です。

日本の開発チームが見るべきなのは、機能を全部オンにすることではありません。個人利用と業務利用を分けること、Developer mode を使ってよい画面を決めること、AGENTS.md でチームのルールをCodexに伝えることです。

## 出典

- [ChatGPT Release Notes - June 11, 2026 Codex updates](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Codex changelog - Codex app 26.609](https://developers.openai.com/codex/changelog) - OpenAI Developers
- [Codex pricing - Invite friends and coworkers](https://developers.openai.com/codex/pricing) - OpenAI Developers
- [In-app browser - Developer mode](https://developers.openai.com/codex/app/browser) - OpenAI Developers
