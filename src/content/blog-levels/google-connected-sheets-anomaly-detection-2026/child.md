---
article: 'google-connected-sheets-anomaly-detection-2026'
level: 'child'
---

Google Sheets の Connected Sheets で、BigQuery の時系列データに対する **異常検知** が使えるようになりました。発表日は **2026年5月27日** です。

かんたんに言うと、売上、問い合わせ数、在庫、エラー件数のような数字を見て、「いつもと違う動き」を Sheets 上で見つけやすくする機能です。

## 何ができるのか

Connected Sheets は、Google Sheets から BigQuery のデータを分析できる仕組みです。今回の更新では、その中で異常検知を実行できるようになりました。

Google の説明では、BigQuery ML と TimesFM が使われます。TimesFM は時系列データを扱うための Google のモデルです。利用者は、毎回自分でモデルを作ったり、複雑な SQL を書いたりしなくても、Sheets の画面から異常検知を設定できます。

結果には、異常かどうかを示す列や、通常と見なされる範囲の上限と下限が出ます。見た目はスプレッドシートなので、担当者は並べ替えたり、フィルタしたりしながら確認できます。

## 何に役立つのか

たとえば、EC サイトなら日ごとの売上や返品率を見られます。急に返品率が上がったら、商品の不具合、配送トラブル、キャンペーンの影響などを確認するきっかけになります。

SaaS なら、ログイン数、エラー率、利用回数、解約に近い動きの指標を見られます。問い合わせ窓口なら、特定カテゴリの問い合わせが急に増えたことに気づきやすくなります。

ポイントは、データ分析専門の人だけでなく、現場の担当者も使いやすいことです。もちろん BigQuery の権限は必要ですが、操作する画面は Google Sheets です。いつも見ている表の延長で、変な動きに気づける可能性があります。

## 気をつけること

まず、これは魔法の正解判定ではありません。異常と出ても、本当に問題とは限りません。セール、祝日、広告出稿、システム変更など、理由が分かっている変化もあります。

逆に、重要な問題が必ず見つかるとも限りません。しきい値の設定や、データの粒度によって結果は変わります。

また、Connected Sheets は BigQuery とつながっています。Google のヘルプでは、BigQuery データへアクセスすると Cloud Audit Logs に記録されること、BigQuery の権限や課金が関係することが説明されています。Sheets で見えていても、裏側では会社のデータ基盤を使っているという理解が必要です。

## 日本企業ではどう使うべきか

最初は、対象を絞って試すのがよいです。たとえば、売上の日次推移、問い合わせ件数、在庫数、障害件数など、異常の意味を説明しやすいデータから始めるべきです。

そして、異常が出たときに誰が確認するかを決めます。担当者が元データを見るのか、データチームに相談するのか、現場マネージャーに共有するのか。ここを決めずに使うと、赤く表示された結果だけが一人歩きします。

## まとめ

Connected Sheets の異常検知は、Google Sheets に AI を使った時系列分析を近づける更新です。BigQuery ML と TimesFM によって、専門的なモデル作成をしなくても、現場がデータの変化に気づきやすくなります。

ただし、結果は判断の材料であって、最終判断ではありません。BigQuery の権限、費用、監査ログ、誤検知への対応を決めたうえで、現場の早期発見ツールとして使うのが現実的です。

## 出典

- [Easily identify data irregularities with anomaly detection in Connected Sheets](https://workspaceupdates.googleblog.com/2026/05/easily-identify-data-irregularities-with-anomaly-detection-in-Connected-Sheets.html) - Google Workspace Updates, 2026-05-27
- [Use BigQuery ML in Connected Sheets](https://support.google.com/docs/answer/16923039?hl=en) - Google Docs Editors Help
- [BigQuery release notes](https://docs.cloud.google.com/bigquery/docs/release-notes) - Google Cloud Documentation
