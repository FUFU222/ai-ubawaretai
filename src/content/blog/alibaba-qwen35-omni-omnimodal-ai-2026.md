---
title: 'Alibaba Qwen3.5-Omni発表——テキスト・音声・映像を1パスで処理する「全方位AI」は何を変えるか'
description: 'AlibabaのQwenチームがオムニモーダルモデルQwen3.5-Omniを公開。113言語の音声認識、10時間超の音声処理、映像からのコード生成まで。Gemini 3.1 Proを複数ベンチマークで上回る性能の中身を解説。'
pubDate: '2026-04-01'
category: 'news'
tags: ['Qwen', 'マルチモーダル', 'Alibaba', '音声AI', 'オープンソース']
---

AlibabaのQwenチームが、また面白いものを出してきた。3月30日にリリースされた**Qwen3.5-Omni**は、テキスト・画像・音声・映像をすべて単一のモデル推論で処理する「オムニモーダル」なAIモデルだ。

何がすごいかというと、これまでのマルチモーダルモデルの多くは内部的に別々のパイプラインを組み合わせていた。音声認識→テキスト変換→言語モデル処理→音声合成、みたいな「カスケード方式」だ。Qwen3.5-Omniはそうじゃない。すべてのモダリティを1つのパイプラインでネイティブに処理する。この違いが、速度と精度の両方に効いてくる。

## 何が起きたか

[Qwenチームの公式GitHub](https://github.com/QwenLM/Qwen3-Omni)とAPIdog による[詳細レビュー](https://apidog.com/blog/qwen-3-5-omni/)によると、Qwen3.5-Omniの主要スペックは以下の通り。

コンテキストウィンドウは256,000トークン。これは音声に換算すると10時間以上、映像だと720pで約400秒分に相当する。音声認識は113の言語・方言に対応し、前世代のQwen3-Omniの19言語から大幅に拡張された。音声生成は36言語をカバーする。

モデルのバリエーションはPlus・Flash・Lightの3種類。Plusが最高品質でGemini 3.1 Proを上回る性能を示し、Flashは速度と品質のバランス型、Lightはモバイルやエッジデバイス向けの軽量版という位置づけだ。

[StableLearn](https://stable-learn.com/en/qwen35-omni-release/)の報告では、Qwen3.5-Omni-Plusは215のデータセット・ベンチマークでSOTA（State-of-the-Art）を達成。内訳は、映像理解3件、音声理解5件、音声認識（ASR）8件、音声翻訳156件、多言語ASR 43件となっている。

## 背景・文脈

タイミングとしてはかなり興味深い。2026年3月はAIモデルの大型リリースが集中した月だった。OpenAIはGPT-5.4を3月5日にリリースし、GoogleはGemini 3.1 Ultraを投入した。その月末にAlibabaがQwen3.5-Omniを持ってきたわけだ。

中国のAI勢は2025年のDeepSeekの衝撃以来、存在感を増し続けている。QwenシリーズはHugging Faceでのダウンロード数でも上位常連で、オープンソースAIのエコシステムで重要な位置を占めるようになった。今回のQwen3.5-Omniは、特に音声・映像処理の領域でGoogleやOpenAIの商用モデルと直接比較される品質に達したという点で、大きな意味がある。

ここからは僕の見方だけど、Alibabaがオムニモーダルで攻めてきたのは、単なるベンチマーク競争以上の意図があると思う。音声対話やリアルタイム映像処理は、次世代のAIアプリケーション（リアルタイム通訳、AIアシスタント、映像解析など）の基盤技術になる。ここをオープンウェイトで押さえにいくことで、エコシステムの標準を取りたいのだろう。

## 技術的なポイント

Qwen3.5-Omniの根幹にあるのが「Thinker-Talker」アーキテクチャだ。名前の通り、「考える」部分と「話す」部分を分離した設計になっている。

Thinkerがマルチモーダルな入力を受け取り、推論処理を行う。Talkerがその出力をリアルタイムの音声に変換する。音声生成にはマルチコードブック方式を採用しており、レイテンシを最小限に抑えている。[Decrypt](https://decrypt.co/362742/alibaba-qwen-omni-major-upgrade-review)によると、音声エンコーダ（Audio Transformer）は1億時間以上の音声・映像データで事前学習されている。

さらにHybrid-Attention Mixture of Experts（MoE）を全モダリティに適用している。これにより、巨大なコンテキストウィンドウを扱いつつ、カスケード方式にありがちなレイテンシのペナルティを回避している。Plus版の推論には少なくとも40GBのVRAMが必要とのこと。

個人的に一番面白いと思ったのが「Audio-Visual Vibe Coding」という機能だ。画面録画の映像をモデルに渡して、「これと同じUIを作って」と言えばコードを生成してくれる。テキストのプロンプトすら要らない。映像を見て、音声を聞いて、そこからコードを書く。文字通り「見て覚える」タイプのコーディング支援だ。

もう1つ注目したいのが「セマンティック割り込み」機能。音声対話中にユーザーが割り込もうとしているのか、単なる相槌や環境ノイズなのかを判別する。地味だけど、音声AIの実用性を大きく左右する部分だ。

## 実務への影響・使いどころ

ここからは考察になるけど、開発者にとってQwen3.5-Omniが実際に何を変えるかを考えてみたい。

まず、音声アプリケーションの開発コストが下がる可能性がある。113言語対応の音声認識と36言語の音声生成が1つのモデルで完結するのは、多言語対応のアプリを作る際にかなり魅力的だ。従来は音声認識にWhisper、テキスト処理にGPT、音声合成にElevenLabsやTTSモデル、みたいにパーツを組み合わせる必要があった。それが1つのAPIコールで済む。

日本語は音声認識の113言語に含まれているし、音声生成の36言語にも入っている。日本語の音声アプリケーション開発にも十分使えそうだ。

Audio-Visual Vibe Codingは、まだ実験的な機能ではあるだろうけど、方向性として面白い。デザインレビューの自動化や、バグ報告を映像ベースで行ってAIが直接修正する、みたいなワークフローが見えてくる。もちろん精度がどこまで実用に耐えるかは試してみないとわからない。

一方で、懸念もある。オープンウェイトとはいえ、Plus版は40GB以上のVRAMを要求する。個人開発者が手元で動かすにはハードルが高い。実質的にはクラウドAPIかLight版での利用になるだろう。

## まとめ

Qwen3.5-Omniは、「マルチモーダル」から「オムニモーダル」への転換点を象徴するモデルだと思う。テキスト・画像・音声・映像を1つのパイプラインでネイティブに扱えることで、従来のカスケード方式では実現しにくかったリアルタイム性と精度の両立を実現しようとしている。中国発のAIモデルが音声・映像処理の最前線でGoogleのフラッグシップモデルと互角以上に戦えるという事実は、2026年のAI開発者にとって注目に値する。

## 出典

- [Qwen3-Omni GitHub リポジトリ](https://github.com/QwenLM/Qwen3-Omni) — Alibaba Qwen Team
- [Qwen3.5-Omni Is Here: Alibaba's Omnimodal AI Beats Gemini on Audio](https://apidog.com/blog/qwen-3-5-omni/) — Apidog, 2026-03-30
- [Qwen3.5-Omni: 10-Hour Audio, 4M Frame Video, SOTA in 215 Benchmarks](https://stable-learn.com/en/qwen35-omni-release/) — StableLearn, 2026-03-30
- [Qwen 3.5 Omni: Alibaba's AI Model Can Now Hear, Watch, and Clone Your Voice](https://decrypt.co/362742/alibaba-qwen-omni-major-upgrade-review) — Decrypt, 2026-03-30
- [Alibaba Qwen Team Releases Qwen3.5 Omni](https://www.marktechpost.com/2026/03/30/alibaba-qwen-team-releases-qwen3-5-omni-a-native-multimodal-model-for-text-audio-video-and-realtime-interaction/) — MarkTechPost, 2026-03-31
