---
title: "Google Veo 3.1 Liteが登場——AI動画生成は「コスト半減」で開発者の手に届くか"
description: "GoogleがVeo 3.1 Liteを公開。Veo 3.1 Fastの半額以下で同等速度のAPI動画生成を実現。Sora撤退後の市場でGoogleが仕掛ける価格戦略と、開発者にとっての実用性を考察する。"
pubDate: "2026-04-02"
category: "news"
tags: ["Google", "Veo", "AI動画生成", "Gemini API"]
draft: false
---

GoogleがAI動画生成の価格破壊を仕掛けてきた。

3月31日、Googleは新しい動画生成モデル「Veo 3.1 Lite」を[公式ブログ](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-lite/)で発表した。Gemini APIとGoogle AI Studio経由で、有料プレビューとして利用可能になっている。

タイミングが絶妙だ。OpenAIがSoraを終了してからわずか数日後のローンチ。偶然じゃないだろう。

## 何が起きたか

Veo 3.1 Liteは、Googleの動画生成モデルラインナップの中で「最もコスト効率が高い」モデルとして位置づけられている。[9to5Google](https://9to5google.com/2026/03/31/veo-3-1-lite/)の報道によると、主なスペックは以下の通りだ。

720pで1秒あたり0.05ドル、1080pで0.08ドル。中間モデルのVeo 3.1 Fastと比較すると、720pで半額以下の水準になる。それでいて生成速度はVeo 3.1 Fastと同等。[Decrypt](https://decrypt.co/363077/google-veo-3-1-lite-cuts-api-costs-half-openai-sora)のテストでは、8秒の動画を60秒以内で生成できたと報告されている。

対応フォーマットはテキスト→動画と画像→動画の2種類。解像度は720pと1080p、アスペクト比は16:9（横）と9:16（縦）、動画の長さは4秒・6秒・8秒から選べる。ただし4K出力には対応していない。4Kが必要なら上位モデルのVeo 3.1 Fastか、フルスペックのVeo 3.1を使う必要がある。

さらに4月7日からはVeo 3.1 Fastの価格も引き下げられる。[The Decoder](https://the-decoder.com/googles-veo-3-1-lite-cuts-video-generation-costs-by-more-than-half/)がまとめた新旧の価格を見ると、Googleが動画生成APIの価格を全面的に下げにきていることがわかる。

Veo 3.1（フルモデル）の720pが0.40ドル/秒だったのに対し、Liteは0.05ドル/秒。87.5%のコスト削減だ。この数字のインパクトは大きい。

## 背景・文脈

このローンチを語る上で避けて通れないのが、OpenAI Soraの撤退だ。

Soraは1日あたり1,500万ドルのコストがかかっていたと[Decrypt](https://decrypt.co/363077/google-veo-3-1-lite-cuts-api-costs-half-openai-sora)が報じている。Disneyとの10億ドル規模の提携話も白紙になった。「最先端の品質を消費者に直接提供する」というアプローチが、経済的に成り立たなかった。

Googleはここで真逆の戦略を取っている。消費者向けアプリではなく、API経由で開発者に提供する。品質を少し落としてでもコストを下げ、「大量生成」のユースケースに最適化する。これはかなり賢いアプローチだと思う。

一方で、中国勢の動きも見逃せない。KuaishouのKling AI、TencentのHunyuan Video、そしてAlibabaのSeedance 2.0といった競合が、積極的な価格戦略でシェアを広げている。Googleがここで価格を下げてきたのは、こうした競合への対抗でもあるだろう。

## 技術的なポイント

[Googleの開発者ドキュメント](https://ai.google.dev/gemini-api/docs/models/veo-3.1-lite-generate-preview)を見ると、いくつか興味深い点がある。

まず、モデルIDは `veo-3.1-lite-generate-preview` で、テキスト入力の上限は1,024トークン。Veo 3.1のフルモデルと同じVeo 3.1基盤を使っていて、Googleは「state-of-the-art Veo 3.1 foundation」をベースにしていると説明している。

ここからは僕の見方だけど、「同じ基盤で品質を調整してコストを下げる」というアプローチは、LLMの世界でGemini FlashやGemini Flash Liteがやっていることと同じ構造だ。Googleは「フルモデル→高速版→軽量版」というティアード戦略を、テキストだけでなく動画生成にも横展開している。

Decryptの記事で注目したいのは、「Veo 3.1 LiteとVeo 3.1 Fastの品質差は、Veo 3.1 FastとフルVeo 3.1の差ほど大きくない」という指摘だ。つまり、多くのユースケースでLiteの品質は「十分に使える」レベルにあるということになる。

もう一つ重要なのは、Veo 3.1 Liteが音声付き動画の生成に対応している点だ。開発者ドキュメントの出力仕様に「Video with audio」と明記されている。テキストから動画と音声を同時に生成できるのは、プロトタイピングの速度を大きく上げる要素になる。

## 実務への影響・使いどころ

ここからは考察になるけど、720pで1秒あたり0.05ドルという価格は、実務的にかなりインパクトがある。

たとえば8秒の720p動画を1本生成するコストは0.40ドル、約60円。1日100本生成しても6,000円程度。SNSのショート動画や、ECサイトの商品紹介動画を大量に回すような使い方が、現実的なコスト感になってくる。

YouTube ShortsやGeminiアプリ、Google Vids、Flowといった既存のGoogle製品にはすでにVeo技術が統合されている。今回のAPI公開は、そこから一歩踏み出して「サードパーティの開発者に動画生成インフラを開放する」という動きだ。

自分がもし動画を多用するプロダクトを作っているなら、まず検討するのは「人間が作るべき動画」と「AIで量産できる動画」の仕分けだろう。広告のA/Bテスト用バリエーション、アプリ内のチュートリアル動画、ローカライズ用の多言語版——こういった「パターンが決まっているが量が必要」な領域で、Veo 3.1 Liteは威力を発揮するんじゃないかと思う。

ただし注意点もある。4K非対応、動画は最長8秒、そしてまだプレビュー段階だ。本番プロダクションに組み込むには、品質の安定性やレート制限を実際に検証する必要がある。

## まとめ

Soraが「高品質・高コスト」で倒れた市場に、Googleは「実用十分な品質・低コスト」で切り込んできた。API中心の提供形態も含めて、これは開発者にとってかなり面白い選択肢になりそうだ。4月7日のVeo 3.1 Fast値下げと合わせて、AI動画生成の価格水準そのものが変わる可能性がある。

## 出典

- [Build with Veo 3.1 Lite, our most cost-effective video generation model](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-lite/) — Google Blog, 2026-03-31
- [Google commits to video generation, announces Veo 3.1 Lite](https://9to5google.com/2026/03/31/veo-3-1-lite/) — 9to5Google, 2026-03-31
- [Google's Veo 3.1 Lite Cuts API Costs in Half as OpenAI's Sora Exits the Market](https://decrypt.co/363077/google-veo-3-1-lite-cuts-api-costs-half-openai-sora) — Decrypt, 2026-03-31
- [Google's Veo 3.1 Lite cuts video generation costs by more than half](https://the-decoder.com/googles-veo-3-1-lite-cuts-video-generation-costs-by-more-than-half/) — The Decoder, 2026-03-31
- [Veo 3.1 Lite Preview Documentation](https://ai.google.dev/gemini-api/docs/models/veo-3.1-lite-generate-preview) — Google AI for Developers, 2026-03
