---
title: "Perplexity AIに集団訴訟——ユーザーの会話データがMetaとGoogleに流れていた疑惑の深層"
description: "Perplexity AIがユーザーの会話データをMetaやGoogleと共有していたとして集団訴訟を提起された。AI検索の信頼性とプライバシーの根幹を揺るがす事件の技術的背景と今後の影響を考察する。"
pubDate: "2026-04-02"
category: "news"
tags: ["Perplexity", "プライバシー", "AI検索"]
draft: false
---

## 何が起きたか

2026年4月1日、米ユタ州の男性がPerplexity AI Inc.に対してカリフォルニア州北部地区連邦地方裁判所（サンフランシスコ）に集団訴訟を提起した。事件番号は Doe v. Perplexity AI Inc., 3:26-cv-02803。[Bloomberg](https://www.bloomberg.com/news/articles/2026-04-01/perplexity-ai-machine-accused-of-sharing-data-with-meta-google)が最初に報じ、その後複数のメディアが追随している。

訴状の核心はシンプルだ。Perplexityのホームページにログインした瞬間、ユーザーのデバイスにトラッカーがダウンロードされ、MetaとGoogleに対してAI検索エンジンとの会話内容へのフルアクセスが提供されている——というもの。[The Decoder](https://the-decoder.com/perplexity-ai-sued-over-alleged-data-sharing-with-meta-and-google/)によると、原告はPerplexityに対して税務情報などの機密性の高い金融データを共有していたと主張している。

さらに衝撃的なのは、Perplexityの「Incognito」モードを有効にしていても、この追跡が機能していたという訴えだ。訴状では、収集されたデータがMetaとGoogleによって「広告ターゲティングや第三者へのデータ再販」に利用されていると指摘している。

これに対してPerplexityのスポークスパーソンであるJesse Dwyer氏は「当社はユーザーデータをMetaやGoogleと共有していない」と否定した上で、「この内容に該当する訴訟の送達を受けておらず、その存在や主張を確認できない」と[The Decoder](https://the-decoder.com/perplexity-ai-sued-over-alleged-data-sharing-with-meta-and-google/)に対してコメントしている。Meta側は広告ポリシーにおいてセンシティブなデータの提出を禁止していると述べ、Googleは即座のコメントを控えた。

## 背景・文脈

この訴訟は、Perplexityが直面する法的問題の「3本目の矢」とも言える。

まず2025年10月、Redditが著作権保護を回避してユーザー生成コンテンツをスクレイピングしたとしてPerplexityを提訴した。次に2025年11月、AmazonがPerplexityのAIショッピングエージェント「Comet」がパスワード保護されたAmazonのウェブサイトに無断アクセスしていたとして訴訟を起こし、2026年3月10日に[連邦地裁が仮差止命令](https://www.cnbc.com/2026/03/10/amazon-wins-court-order-to-block-perplexitys-ai-shopping-agent.html)を発行している。News Corp.傘下のDow Jones、Encyclopaedia Britannica、Merriam-Websterも同様に訴訟を起こしている。

そしてこのタイミングが絶妙なのは、Perplexityがまさに2026年3月18日にCometブラウザをiOSでローンチし、App Storeで総合3位まで急上昇したばかりだったことだ。Cometの収益モデルは、ブラウジングデータを使った広告ターゲティングと月額サブスクリプションのハイブリッドだ。皮肉なことに、Comet自体にはサードパーティの広告やトラッカーをブロックする機能が搭載されている。他社のトラッカーはブロックしつつ、自社プラットフォームでは密かにユーザーデータを第三者に流していた——もしこの訴えが事実なら、これはかなり矛盾した構造だ。

## 技術的なポイント

ここからは僕の見方も交えつつ、技術的な側面を掘り下げてみる。

訴状で「undetectable（検知不能な）トラッキングソフトウェア」と表現されているものの正体は、おそらくMeta PixelとGoogle Analyticsのトラッキングスクリプトだろう。これら自体はウェブサイトでは極めて一般的な技術であり、多くのサービスが広告効果の測定やユーザー行動分析のために埋め込んでいる。

ただし、AI検索エンジンの場合は話が根本的に違う。通常のウェブサイトでトラッカーが取得するのはページの閲覧履歴やクリックパターンだ。しかしAI検索エンジンの場合、ユーザーが入力する検索クエリには個人的な質問、健康上の悩み、金融情報、法的な相談など、極めてセンシティブな情報が含まれる可能性がある。原告が主張するように、税務情報をPerplexityに入力していたとすれば、そのデータがトラッキングスクリプト経由でMeta/Googleに渡ることの重大性は明白だ。

もう一つ注目すべきは「Incognitoモード」の問題だ。ブラウザのシークレットモードとは異なり、Perplexityの「Incognito」はPerplexity独自の機能名であり、検索履歴をPerplexityのアカウントに保存しないことを意味する。しかし、もしページ自体にMeta PixelやGoogleのスクリプトが埋め込まれていれば、ページの読み込み時点でトラッカーは作動する。つまり、Perplexity側で履歴を保存しなくても、第三者のスクリプトがユーザーの行動を別途記録している可能性がある。この構造的な問題は、Perplexityに限らずAIサービス全般に当てはまる。

## 実務への影響・使いどころ

ここからは僕の考察になるが、この訴訟はAI検索サービスの選び方を根本から問い直すきっかけになるかもしれない。

PerplexityはGoogle検索の代替として「広告に汚染されていない、クリーンな検索体験」を売りにしてきた。しかし、もし裏でMetaとGoogleにデータを流していたとすれば、ユーザーがPerplexityに移行した意味そのものが失われる。「Googleを避けたくてPerplexityを使っていたのに、結局Googleにデータが渡っていた」——これはなかなか笑えない話だ。

開発者やテック系のユーザーとしては、いくつかの対策が考えられる。ブラウザ拡張機能（uBlock Originなど）でサードパーティスクリプトをブロックするのが最も即効性がある。また、ネットワークレベルでMeta PixelやGoogle Analyticsのドメインをブロックするアプローチも有効だろう。

より広い視点で見ると、AI検索サービスが「広告モデルか、サブスクリプションモデルか」という二者択一を迫られている現状が浮かび上がる。Perplexityは2026年2月に一度広告戦略を取りやめてサブスクリプション重視に切り替えたと[報じられている](https://digiday.com/media/how-perplexity-new-revenue-model-works-according-to-its-head-of-publisher-partnerships/)が、3月のCometローンチで再びブラウジングデータを使った広告ターゲティングに舵を切った。この揺れ自体が、AI検索サービスの収益化の難しさを物語っているのではないかと思う。

## まとめ

Perplexityにとって、この集団訴訟はAmazon訴訟、Reddit訴訟に続く法的リスクの積み重ねだ。事件番号 3:26-cv-02803 の行方は、AI検索サービスにおけるプライバシーの基準を左右する可能性がある。訴状の主張がどこまで立証されるかは今後の裁判次第だが、少なくとも「AI検索＝プライバシー安全」という素朴な信頼には、立ち止まって検証する価値がありそうだ。

## 出典

- [Perplexity AI Machine Accused of Sharing Data With Meta, Google](https://www.bloomberg.com/news/articles/2026-04-01/perplexity-ai-machine-accused-of-sharing-data-with-meta-google) — Bloomberg, 2026-04-01
- [Perplexity AI sued over alleged data sharing with Meta and Google](https://the-decoder.com/perplexity-ai-sued-over-alleged-data-sharing-with-meta-and-google/) — The Decoder, 2026-04-01
- [Perplexity AI Sued Over 'Undetectable' Tracking Technology](https://www.analyticsinsight.net/news/perplexity-ai-sued-over-undetectable-tracking-technology) — Analytics Insight, 2026-04-01
- [Amazon wins court order to block Perplexity's AI shopping agent](https://www.cnbc.com/2026/03/10/amazon-wins-court-order-to-block-perplexitys-ai-shopping-agent.html) — CNBC, 2026-03-10
- [Utah man files class action lawsuit against Perplexity](https://seekingalpha.com/news/4571476-utah-man-files-class-action-lawsuit-against-perplexity-for-sharing-search-data-with-google-meta) — Seeking Alpha, 2026-04-01
