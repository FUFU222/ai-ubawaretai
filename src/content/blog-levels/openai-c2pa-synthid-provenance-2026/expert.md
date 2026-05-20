---
article: 'openai-c2pa-synthid-provenance-2026'
level: 'expert'
---

OpenAIのC2PA適合、SynthID採用、公開検証ツールのプレビューは、画像生成AIの「真正性」をめぐる実装論点をかなり現実的なところへ引き戻す更新だ。これはAI検出器の発表ではない。むしろ、生成、編集、保存、配信、検証の間でどの信頼情報が残り、どこで失われるのかを企業が検証しなければならない、という話である。

同じ `openai-security-controls` の中では、[OpenAI安全要約](/blog/openai-chatgpt-safety-summaries-2026/)が会話の安全文脈を、[OpenAI Privacy Filter](/blog/openai-privacy-filter-pii-redaction-2026/)が入力前の個人情報保護を、[OpenAIのTanStack npm供給網攻撃対応](/blog/openai-tanstack-npm-supply-chain-2026/)が供給網と署名証明書の信頼を扱っていた。今回のprovenance更新は、その対象を生成コンテンツへ広げるものだ。

日本企業にとっての実務価値は、AI画像を使えるかどうかではなく、**公開後に説明できるかどうか** にある。広告、採用、自治体広報、金融機関のキャンペーン、ECの商品訴求、IR資料では、画像の由来を曖昧なままにできない。生成AIを使うなら、制作速度と同じくらい、出所確認、改変履歴、掲載判断の証跡が必要になる。

## 事実: OpenAIの3層構成

OpenAIは2026年5月19日の発表で、content provenanceに対するmulti-layered approachを示した。具体的には、C2PA conformance、Google DeepMind SynthID for images、public verification tool preview の3つである。

C2PAについて、OpenAIは、自社がC2PA conforming generator productになったと説明している。C2PAは、コンテンツのsource and historyを証明するための業界標準で、metadataとcryptographic signaturesを使い、メディアに付随する情報を信頼できる形で運ぶことを狙う。OpenAIは以前からDALL·E 3、ImageGen、SoraにContent Credentialsを付与してきたが、今回のconformanceは、プラットフォーム側がOpenAIのprovenance情報を読み、保存し、次の流通先へ渡しやすくする意味を持つ。

SynthIDについて、OpenAIは、ChatGPT、Codex、OpenAI APIで生成された画像から導入するとしている。Google DeepMindのSynthIDは、AI生成コンテンツへ人間には見えないwatermarkを埋め込み、後から検出しやすくする技術である。Googleの説明では、画像、音声、テキスト、動画にわたってwatermarkingとidentificationを扱う。OpenAIは、C2PA metadataがアップロード、ダウンロード、形式変換、リサイズ、スクリーンショットで失われる可能性を認めたうえで、watermarkを補完層として採用する。

検証ツールについて、OpenAIは、画像をアップロードして、ChatGPT、OpenAI API、Codexで生成されたかどうかをprovenance signalsで確認できるようにすると説明している。対象信号にはContent CredentialsとSynthIDが含まれる。ただしローンチ時点ではOpenAI生成コンテンツに限定され、信号が検出されない場合でもOpenAI生成ではないと断定しない。これは重要な制約である。

## 分析: metadataとwatermarkは役割が違う

metadataとwatermarkを同じ「AI判定の印」と見ると設計を誤る。C2PA metadataは、誰が署名したか、どのような作成・編集情報が付いているかを比較的豊かに表現できる。監査、報道、プラットフォーム判断、社内審査ではこの詳細情報が有用だ。一方で、metadataはファイル処理に弱い。画像をコピーし、再保存し、圧縮し、スクリーンショット化すれば、付随情報が失われる可能性がある。

SynthIDのようなwatermarkは、画像データ自体へ検出可能な信号を埋め込む。Google DeepMindは、画像や動画のwatermarkについて、crop、filter、frame rate change、lossy compressionのような変更に耐えるよう設計していると説明している。これはmetadataの弱点を補う。ただしwatermarkは、C2PA metadataほど詳細な説明を持たない。検出できたとしても、誰が社内で承認したのか、どの利用目的だったのか、権利処理を済ませたのかは別の証跡が必要になる。

したがって、企業が必要とするのは二択ではない。C2PAで詳細なcontextを持ち、SynthIDでmetadata消失時の信号を残し、社内の制作管理システムで承認・利用目的・元ファイルを保存する。この3つをつなぐことが重要だ。

## 日本企業のリスクは「最終配信版」で起きる

日本企業でprovenanceが壊れやすいのは、生成直後ではなく最終配信版である。担当者がChatGPTで画像を作る。デザイナーがトリミングする。CMSが複数サイズを生成する。CDNが圧縮する。SNSが再エンコードする。広告配信システムが別フォーマットへ変換する。この最後の画像こそ、消費者や取引先が見る画像だ。

もし元画像ではC2PA metadataが見えるが、公開版では見えないなら、企業は公開版だけを検証しても説明できない。逆に公開版でSynthIDが残っていても、metadataが消えていれば、どの社内ワークフローを通ったかは別途ログで補う必要がある。

この問題は音声や動画にも広がる。以前の[Gemini 3.1 Flash TTS記事](/blog/google-gemini-31-flash-tts-2026/)では、音声生成でSynthIDが導入される意味を扱った。音声、画像、動画が同じキャンペーンで混ざると、媒体ごとのprovenance確認が必要になる。広報やマーケティングは、生成AIツール単位ではなく、コンテンツ種別ごとの確認基準を持つべきだ。

## 開発チームの実装チェックリスト

APIで画像生成を組み込む開発チームは、少なくとも次の観点をテストすべきだ。

1つ目は保存形式である。生成直後のファイルをどの形式で保存するか。サムネイルやWebP変換でC2PA情報が失われるか。オリジナル、加工版、配信版を別々に保存するか。

2つ目は変換処理である。画像最適化ライブラリ、CDN、CMS、SNS連携、メール配信システムがmetadataをどう扱うか。これを仕様書で読んだだけで済ませず、実際のファイルで検証する必要がある。

3つ目は検証ログである。公開前チェックでOpenAIの検証ツールを使うなら、検証日時、対象ファイルhash、検出された信号、判定文言を残す。検証結果のスクリーンショットだけでは、監査証跡として弱い場合がある。

4つ目は失敗時の扱いである。OpenAIは、検出されなかった場合にOpenAI生成ではないと断定しないとしている。企業側も、信号なしを「非AI」や「安全」の証明にしてはいけない。元ファイルがない、metadataがない、watermarkもない画像は、別のレビューや再生成を求める基準にしたほうがよい。

5つ目はマルチベンダー対応である。今回のOpenAIツールはローンチ時点でOpenAI生成物に限定される。実務では、ChatGPT、Gemini、Adobe、Canva、Midjourney、社内モデルが混在する。C2PAは共通基盤になりうるが、各社のwatermarkや検証ツールは同じではない。調達や利用規程では、どのツールがどのprovenance情報を出せるかを比較項目に入れるべきだ。

## 法務・広報が決めるべき境界

法務と広報にとって、今回の更新は「AI生成ラベルを付けるか」の単純な問題ではない。表示義務、景品表示、著作権、肖像権、広告審査、顧客説明、危機対応が重なる。

たとえば採用サイトの人物画像にAI生成を使う場合、C2PAやSynthIDでOpenAI生成と分かっても、その画像が候補者に誤解を与えないかは別問題だ。金融商品の説明画像なら、AI生成であることより、投資判断を誤らせる表現がないかのほうが重要になる。自治体広報なら、住民が実在の場所や人物だと誤認しないかを確認する必要がある。

そのため、provenanceは最終判断ではなく入力情報である。検証ツールの結果を、掲載可否、注記、社内承認、問い合わせ対応のワークフローへつなげる必要がある。

## 供給網管理として読む

今回の話は、ソフトウェア供給網管理ともよく似ている。npm packageのprovenanceやcode signing certificateは、成果物の由来を追うための材料だ。しかし、[OpenAIのTanStack対応記事](/blog/openai-tanstack-npm-supply-chain-2026/)で見たように、provenanceが付いているだけでは安全とは限らない。どのworkflowが発行したか、権限境界がどうなっているか、cacheが汚染されていないかを見る必要がある。

画像でも同じだ。C2PAやSynthIDがあるから安心、ではない。誰が生成したのか。どのプロンプトや素材を使ったのか。どの編集が入ったのか。どの用途で承認されたのか。どの配信版が最終版なのか。信頼は、技術信号と運用証跡を組み合わせて初めて成立する。

## まとめ

OpenAIのcontent provenance更新は、画像生成AIを企業利用するための信頼レイヤーを前進させた。C2PAは詳細なmetadataと署名の文脈を提供し、SynthIDはmetadataが落ちる場面に備えるwatermark層になる。公開検証ツールは、利用者や企業がそれらの信号を確認する入口になる。

ただし、これを万能なAI検出として扱うべきではない。日本企業が本当に整えるべきなのは、生成元、編集履歴、配信変換、検証ログ、承認判断をつなぐ運用である。AI画像の利用は、制作の問題から、証跡と説明責任の問題へ移っている。

## 出典

- [Advancing content provenance for a safer, more transparent AI ecosystem](https://openai.com/index/advancing-content-provenance/) - OpenAI, 2026-05-19
- [C2PA Specifications](https://spec.c2pa.org/specifications/specifications/2.2/index.html) - C2PA
- [SynthID](https://deepmind.google/models/synthid/) - Google DeepMind
