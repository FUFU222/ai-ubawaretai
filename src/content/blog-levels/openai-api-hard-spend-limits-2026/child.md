---
article: 'openai-api-hard-spend-limits-2026'
level: 'child'
---

OpenAI API に、月ごとの支出上限を設定して API を止める機能が入りました。名前は hard spend limit です。会社全体、または project ごとに月次 cap を決められます。

大事なのは、これは通知だけではないことです。上限に達すると、影響を受ける API request は `429` error で失敗します。つまり「使いすぎを知らせる機能」ではなく、「使いすぎたら止める機能」です。

## alertとhard limitの違い

Spend alert は、支出が一定額に近づいたことを知らせます。通知は来ますが、API はそのまま動きます。

Hard spend limit は、上限に達したあと API を失敗させます。エラーは `429` で、`insufficient_quota` という code が返ります。

この違いはとても重要です。PoC や実験なら、月に決めた金額で止めるのは分かりやすいです。止まったら、担当者が追加予算を申請すればよいからです。

しかし、本番サービスで同じことをすると危険です。月末に上限へ達しただけで、問い合わせ対応、社内ツール、顧客向け機能が止まるかもしれません。

## projectごとに分ける理由

OpenAI API には organization と project の単位があります。organization の上限は会社全体に効きます。project の上限は、その project の API 利用だけに効きます。

そのため、実験、本番、社内ツール、batch、評価環境を同じ project に入れない方が安全です。実験が使いすぎたせいで本番が止まる、という状態を避けるためです。

たとえば、開発者が新しいエージェントを試す project には低い hard limit を置けます。一方、顧客向けの本番 project には hard limit を強くかけるより、早めの spend alert と人間の確認を置く方がよい場合があります。

## 429が出たときに見ること

API が `429` を返しても、理由は一つではありません。短時間に呼びすぎた rate limit の場合もあります。月次予算の hard spend limit に達した場合もあります。prepaid credits がなくなった場合もあります。

だから、アプリケーションで `429` を見たら、ただ再試行するだけでは足りません。`insufficient_quota` かどうかを見て、OpenAI の current usage、organization limit、project limit、残 credit を確認します。

Hard spend limit が原因なら、待っても直りません。上限を上げる、削除する、月次リセットを待つ、低優先の処理を止める、などの判断が必要です。

## 日本企業で決めること

最初に、どの API key がどの project に属するかを整理します。古い key が残っていると、どの費用がどこに入るのか分からなくなります。

次に、project ごとに止めてよいかを決めます。実験は止めてよい。本番は止めにくい。夜間 batch は翌日に再実行できるかもしれない。このように分けます。

さらに、spend alert の通知先を決めます。費用担当だけでなく、開発責任者や運用担当にも届くようにします。通知を見ても誰も判断しないなら、alert は役に立ちません。

最後に、上限を上げる権限を決めます。誰でも上げられると予算管理になりません。しかし、誰も上げられないと本番復旧が遅れます。緊急時のルールを先に決めておく必要があります。

## まとめ

OpenAI API の hard spend limit は、使いすぎを防ぐ便利な機能です。しかし同時に、API を止める機能でもあります。

日本企業では、金額だけでなく、何が止まるのか、誰が通知を見るのか、誰が再開を承認するのかを決めるべきです。API の費用管理は、これから本番運用と一体になります。

## 出典

- [OpenAI API Changelog](https://developers.openai.com/api/docs/changelog) - OpenAI API Docs, 2026-07-22
- [Spend limits](https://developers.openai.com/api/docs/guides/spend-limits) - OpenAI API Docs
