---
title: 'GoogleのAI音楽モデル「Lyria 3 Pro」が登場。3分間のフル楽曲をテキストから生成'
description: 'Google DeepMindが音楽生成AI「Lyria 3 Pro」を発表。最大3分間のフル楽曲を生成可能で、Gemini API経由で開発者にも開放。SunoやUdioとの競争が本格化する。'
pubDate: '2026-03-27'
category: 'news'
tags: ['Google', 'AI音楽', 'Lyria', 'Gemini']
draft: true
---

GoogleがAI音楽生成で一気に勝負に出た。3月25日、Google DeepMindは「Lyria 3 Pro」を発表した。テキストプロンプトから最大3分間のフル楽曲を生成できるモデルだ。

先月リリースされたLyria 3は30秒が上限だった。そこから一気に3分へ。しかもイントロ、ヴァース、コーラス、ブリッジといった楽曲構造を理解した上で生成してくれる。これはデモ用の小ネタではなく、実用レベルの音楽制作ツールとして使ってくれと言っているようなものだ。

## 6つのプラットフォームに一斉展開

今回の発表で印象的なのは、そのロールアウトの規模感だろう。Lyria 3 Proは以下の6つのプラットフォームで利用可能になる。Geminiアプリ（有料プランのみ）、Google Vids、ProducerAI、Vertex AI（パブリックプレビュー）、Gemini API、AI Studio。

特に開発者にとって大きいのは、Gemini APIとVertex AIへの対応だ。これにより、自分のアプリやサービスにAI音楽生成機能を組み込めるようになる。動画編集ツール、ゲーム、広告制作、ポッドキャストのBGM——用途はかなり広い。

ただし、現時点ではGeminiアプリの無料ユーザーはLyria 3 Proを使えない。有料サブスクライバー限定だ。Googleとしてはこの機能を収益化のフックにしたいのだろう。

## 48kHzステレオと楽曲構造の理解

技術的なスペックも見ておこう。出力は48kHzのステレオオーディオ。テキストプロンプトだけでなく、画像を入力として楽曲を生成することもできる。風景写真を渡してBGMを作る、といった使い方が想定されている。

楽曲の構造理解が強化されたのも大きなポイントだ。前モデルのLyria 3は基本的に「音の塊」を生成していたが、Proではプロンプトで「ここからサビ」「ここはブリッジ」と指定できる。ボーカルスタイルやアコースティックの質感も調整可能とのこと。

音楽制作に詳しい人ならわかると思うが、曲の構造を制御できるかどうかは、生成された音楽が「使い物になるか」の分水嶺になる。ループ素材ではなくフル楽曲として成立するには、展開が必要だからだ。

## Suno・Udoとの戦いが本格化

AI音楽生成の市場は、これまでSunoとUdioが二強として君臨してきた。特にSunoはv5のリリースで音質とボーカルのリアリティを大幅に引き上げ、ベンチマークでもトップの座を維持している。

ただし、両社にはアキレス腱がある。2025年に大手レコードレーベルから著作権訴訟を起こされ、和解にこぎつけたものの、学習データの正当性については依然としてグレーな部分が残る。

対するGoogleのアプローチは対照的だ。Lyria 3 Proの学習データは「パートナー企業のデータとYouTube・Googleからの許容されるデータ」を使用したと明言している。さらに、生成されたすべての楽曲にSynthIDという電子透かしを埋め込み、AI生成コンテンツであることを識別可能にしている。

法的リスクの低さとエンタープライズ向けのAPI提供。この2点は、SunoやUdioにはない明確な差別化ポイントだ。企業がプロダクションで使うなら、Googleのほうが安心感がある。

## ProducerAI買収の意味

もう一つ見逃せないのが、Googleが先月買収したProducerAIの存在だ。ProducerAIはAIを活用した音楽制作ツールで、買収によりLyria 3 Proのエコシステムに組み込まれた。

これはGoogleが単なるモデル提供にとどまらず、音楽制作のワークフロー全体をカバーしようとしていることを示唆している。APIで基盤技術を提供し、ProducerAIで制作環境を提供し、Google Vidsで映像との統合を実現する。縦方向の統合戦略だ。

音楽業界にとっては脅威でもあり、チャンスでもある。BGM制作やジングル制作の現場では、AIの導入が加速するだろう。一方で、プロのミュージシャンにとっては「AIと共存する」ための新しいツールセットが増えたとも言える。

## 日本のクリエイターへの影響

Gemini APIを通じてグローバルに提供されるため、日本の開発者やクリエイターも恩恵を受けられる。動画クリエイターがサムネイル用のBGMを数秒で生成したり、インディーゲーム開発者がステージごとの楽曲を量産したり。使い道は山ほどありそうだ。

ただ、API経由の料金体系はまだ明確になっていない。Vertex AIでのエンタープライズ利用についても、具体的なプライシングは発表されていない。ここは続報を待つ必要がある。

AI音楽生成は、Suno・Udioのスタートアップ勢とGoogle・OpenAIの大手勢がぶつかる激戦区になりつつある。Googleがプラットフォームの力と法的クリーンさを武器にどこまでシェアを取れるか。今後の動きに注目だ。

## 出典
- [Google公式ブログ: Lyria 3 Pro](https://blog.google/innovation-and-ai/technology/ai/lyria-3-pro/)
- [Google DeepMind: Lyria 3](https://deepmind.google/models/lyria/)
- [TechCrunch: Google launches Lyria 3 Pro music generation model](https://techcrunch.com/2026/03/25/google-launches-lyria-3-pro-music-generation-model/)
- [Dataconomy: Google Launches Lyria 3 Pro With Longer Generation Limits](https://dataconomy.com/2026/03/26/google-launches-lyria-3-pro-with-longer-generation-limits/)
