---
article: 'openai-gpt56-price-fast-mode-2026'
level: 'child'
---

OpenAI は 2026年7月30日、**GPT-5.6 Luna と GPT-5.6 Terra の価格を下げる** と発表しました。Luna は 80%安くなり、Terra は 20%安くなります。

同時に、GPT-5.6 Sol には **Fast mode** が追加されました。これは、標準処理より高い料金で、より速く Sol を使うための API モードです。

## 何が変わったの？

今回の変更は、大きく3つあります。

1つ目は、Luna の値下げです。OpenAI は、Luna を最速で低価格な GPT-5.6 モデルとして説明しています。API では、100万入力tokenあたり 0.20ドル、100万出力tokenあたり 1.20ドルになりました。

2つ目は、Terra の値下げです。Terra は、日常業務向けのバランス型モデルです。API では、100万入力tokenあたり 2ドル、100万出力tokenあたり 12ドルになりました。

3つ目は、Sol の Fast mode です。Sol は GPT-5.6 の上位モデルです。Fast mode では、標準処理の最大 2.5倍の速さで使える一方、料金は標準処理の2倍になります。

## APIだけの話ではない

この変更は、OpenAI API だけの話ではありません。

OpenAI は、Luna と Terra の低価格化が **Codex** と **ChatGPT Work** の有料プランでの利用量にも反映されると説明しています。つまり、同じ subscription の中で、Terra や Luna を使ったときの credit 消費が軽くなる方向です。

会社で Codex や ChatGPT Work を使っている場合、これは重要です。安くなったモデルをうまく使えば、分類、要約、ログ整理、テスト生成、軽いコード修正のような作業を広げやすくなります。

## どのモデルを使えばいいの？

単純に「安いから Luna だけ使う」と考えるのは危険です。

Luna は、短い分類、要約、ログ整理、簡単なチェックのように、大量に回す作業に向いています。失敗しても人間がすぐ確認できる作業なら、費用面の利点が出やすいです。

Terra は、もう少し考える必要がある日常業務に向いています。通常の文章作成、軽めの調査、コード修正、社内ドキュメント整理などで候補になります。

Sol は、複雑な設計、重大な障害調査、難しいコードベースの理解、経営や顧客に影響する判断に残すべきです。Fast mode は、Sol を使う必要があり、しかも待ち時間を短くする価値があるときに使います。

## 日本企業が気をつけること

日本企業では、AI の費用を「月額いくら」だけで見がちです。しかし、実際には1件の仕事が終わるまでの費用で見る必要があります。

安いモデルを何度も使って失敗するより、少し高いモデルで一度で終わるほうが安い場合があります。また、AI の出力を人間が直す時間もコストです。

そのため、会社では作業ごとにモデルを決めるとよいです。たとえば、問い合わせ分類は Luna、通常の資料作成は Terra、重要な設計レビューは Sol、緊急時だけ Fast mode というように分けます。

## まとめ

GPT-5.6 の価格改定で、Luna と Terra は使いやすくなりました。ただし、安くなったからといって、すべての作業を低価格モデルに寄せるべきではありません。

大事なのは、作業ごとに「成功するまでの費用」を測ることです。日本の開発チームや事業部門は、Luna、Terra、Sol、Fast mode の役割を分けて、Codex、ChatGPT Work、API の使い方を見直すべきです。

## 出典

- [Advancing the price-performance frontier with GPT-5.6](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/) - OpenAI
- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI
- [Business Pricing](https://openai.com/api/pricing/) - OpenAI
- [OpenAI cuts GPT-5.6 prices](https://www.axios.com/2026/07/30/openai-cuts-prices-gpt-terra-luna5) - Axios
