---
article: 'anthropic-claude-fable-mythos-access-restored-2026'
level: 'child'
---

Anthropicは2026年7月1日、止めていたClaude Fable 5とClaude Mythos 5のアクセスを再開したと発表しました。ただし、誰でもすべての場所ですぐに使える、という意味ではありません。

Fable 5はClaude Platform、Claude.ai、Claude Code、Claude Coworkで世界向けに再開しました。AWS、Google Cloud、Microsoft Foundryは順次再開です。Mythos 5は、まず承認された一部の米国組織が対象で、日本の一般利用者へ広く提供されたわけではありません。

## なぜ一度止まっていたの？

Fable 5とMythos 5は6月9日に登場しました。その後、米国政府の輸出規制が適用され、Anthropicは6月12日に全利用者へのアクセスを停止しました。利用者の国籍をその場で確実に確認する方法がなかったためです。

6月30日に規制が解除され、翌日の7月1日にFable 5の提供が再開しました。停止中にAnthropicは安全分類器も更新しました。危険なサイバーセキュリティ要求を見つけて止める仕組みです。

停止時に起きたことは[Claude Fable停止と企業AI調達の再点検](/blog/anthropic-claude-fable-mythos-access-suspension-2026/)で確認できます。今回の大事な点は、再開したからといって、停止前の設定へ一気に戻さないことです。

## 7月7日までは何が違うの？

Pro、Max、Team、一部のEnterpriseでは、7月7日までFable 5を週次利用枠の最大50%まで使えます。その後はusage creditsが必要です。

Enterpriseはseatの種類で条件が違います。標準seatでは、usage creditsを有効にしないとFable 5を使えません。premium seatは7月7日まで追加料金なしの枠がありますが、その後はcreditsが必要です。

会社の管理者は、画面にモデル名が見えるかだけでなく、credits設定と利用者のseatを確認する必要があります。Fable 5を使う仕事と、[Claude Sonnet 5](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)など別のモデルへ残す仕事を分けると、費用を管理しやすくなります。

## AWSなどでは何を確認するの？

AWS、Google Cloud、Microsoft Foundryは、Anthropicの一次提供とは再開時点が違う可能性があります。自分の会社が使うクラウド、リージョン、アカウントで、実際にAPIを呼んで確かめます。

AWSのドキュメントでは、Fable 5はActiveと表示され、`anthropic.claude-fable-5` というmodel IDが掲載されています。しかし、ドキュメントに載っていることと、自社アカウントの本番環境から使えることは同じではありません。model access、ネットワーク制限、社内ルールも確認します。

## 「通信成功」だけでは足りない

Fable 5は新しい安全分類器を使います。正当なコーディングやデバッグでも、以前より拒否が増える可能性があります。

AWS経由では、HTTP 200という成功の数字が返っても、中身が `stop_reason: "refusal"` になっている場合があります。アプリがHTTPの数字だけを見ていると、拒否された回答を成功として扱ってしまいます。

確認するときは、次の項目を分けて記録します。

1. モデルへ接続できたか
2. 正しいmodel IDで答えたか
3. 安全分類器に拒否されたか
4. 別モデルへ切り替わったか
5. どれくらい時間とcreditsを使ったか

## 会社で安全に戻す順番

最初は機密情報を含まないテストで確認します。次に少人数の評価チームで、普段のコーディングや調査に近い仕事を試します。その後、停止中に使っていた代替モデルと、品質、時間、費用を比べます。

[Fable 5の導入設計](/blog/anthropic-claude-fable-mythos5-governance-2026/)で扱った長い文脈や自律作業が本当に必要な仕事だけを戻すのが実用的です。すべての仕事を最新モデルへ変える必要はありません。

再開はゴールではなく、復旧確認の開始です。日本企業は7月7日までの期間を、急いで使うためではなく、経路、権限、拒否、費用を小さく検証するために使うと安全です。

## 出典

- [Redeploying Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5) - Anthropic
- [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) - Anthropic
- [Claude Fable 5 - Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-fable-5.html) - AWS Documentation
