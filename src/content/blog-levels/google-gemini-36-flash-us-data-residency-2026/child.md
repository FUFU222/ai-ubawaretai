---
article: 'google-gemini-36-flash-us-data-residency-2026'
level: 'child'
---

Google Cloud は、Gemini Enterprise で **Gemini 3.6 Flash を US multi-region で使えるようにした** と案内しました。対象は allowlist に入ったプロジェクトで、米国の `us` multi-region では、保存時の data residency と機械学習処理の条件に対応します。

これは「新しいモデルが増えた」というだけの話ではありません。会社で AI を使うときは、どのモデルを使うかだけでなく、データがどこで保存され、どこで処理されるかが重要になります。

## 何が変わったのか

Gemini 3.6 Flash は、2026年7月21日に `global` region で使えるようになったと案内されていました。その後、2026年7月24日に、allowlist 対象プロジェクトなら US multi-region でも使えるという更新が出ました。

ここで大切なのは、global で使えることと、特定の地域で data residency や ML processing の条件を満たすことは違うという点です。モデル名が同じでも、使う region によって管理上の意味が変わります。

以前このサイトで扱った [Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) は、Google Cloud の企業向けエージェント基盤の話でした。今回の更新は、その中でモデルと地域統制をどう結びつけるかという話です。

## 日本リージョンとは同じではない

Google Cloud は、2026年7月6日に Japan region `asia-northeast1` の Gemini Enterprise app 対応も案内しています。ただし、そこで地域内の保存と処理に対応すると説明されていたのは、主に Gemini 3.5 Flash です。

Data residency のドキュメントでは、Gemini 3.6 Flash は US multi-region なら allowlist 付きで地域要件に対応しますが、日本などの in-country regions では global region のみという扱いになっています。

つまり、日本企業が「日本リージョン対応済みだから、Gemini 3.6 Flash も日本国内処理で使える」と考えるのは危険です。国内処理を重視する業務では、使うモデルと地域を必ず確認する必要があります。

## なぜ管理者に関係するのか

Gemini 3.6 Flash を Gemini Enterprise app のユーザーに見せるには、管理者が feature toggle を有効にする必要があります。モデルが提供されたからといって、すべての社員が自動的に同じ条件で使えるわけではありません。

これは [Core Assistant と Observability](/blog/google-gemini-enterprise-core-assistant-observability-2026/) の話ともつながります。社員が AI を使う入口が広がるほど、管理者はどのモデルが使われ、どの地域で処理され、どの部門で失敗が多いかを見られるようにしておく必要があります。

## 日本企業で確認すること

まず、Gemini Enterprise のアプリごとに、どの region で動いているかを確認します。次に、その app でどのモデルを表示しているか、Gemini 3.6 Flash の toggle を有効にしているかを確認します。

次に、データの種類ごとに判断を分けます。公開情報の調査や米国拠点の業務なら US multi-region の利用価値があります。一方で、日本国内の個人情報、顧客秘密、金融・医療・公共系データでは、日本リージョンや契約上の説明が重要になります。

最後に、利用者向けの説明を作ります。「速い新モデルを使える」だけでは足りません。どの業務で使ってよいか、どのデータでは避けるべきか、地域要件がある場合は誰に確認するかを短く示すべきです。

## まとめ

Gemini 3.6 Flash の US multi-region 対応は、Gemini Enterprise のモデル選択と地域統制を考えるうえで重要な更新です。ただし、日本リージョンで同じ条件になるという意味ではありません。

日本企業は、モデル名、region、data residency、ML processing、管理者トグルを分けて確認する必要があります。最新モデルを使うことと、データ所在地の要件を守ることは、同じ判断ではないからです。

## 出典

- [Gemini Enterprise release notes](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes#July_24_2026) - Google Cloud Documentation, 2026-07-24
- [Data residency for Gemini Enterprise Standard and Plus Editions and Gemini Notebook Enterprise](https://docs.cloud.google.com/gemini/enterprise/docs/locations) - Google Cloud Documentation
- [Manage web app features](https://docs.cloud.google.com/gemini/enterprise/docs/manage-web-app-features) - Google Cloud Documentation
