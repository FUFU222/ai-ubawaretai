---
article: 'openai-c2pa-synthid-provenance-2026'
level: 'child'
---

OpenAIが、AIで作った画像の「出どころ」を確認しやすくする新しい取り組みを発表しました。ポイントは、C2PAという標準、Google DeepMindのSynthIDという透かし、そして画像を調べる公開検証ツールです。

これは「AI画像を100%見破る魔法の道具」ではありません。むしろ、会社でAI画像を使うときに、あとから説明できるようにするための仕組みです。

## C2PAとは何か

C2PAは、画像や動画などのコンテンツに、作成元や編集履歴の情報を付けるための標準です。たとえば「この画像はどのサービスで作られたのか」「誰が署名した情報なのか」を、metadataとして持たせます。

OpenAIは、OpenAIで生成された画像のprovenance情報を、他のプラットフォームでも読みやすく、受け渡ししやすくする方向へ進めました。これは、AI画像がOpenAIの画面の中だけで完結せず、SNS、CMS、広告、社内資料へ移っていくことを考えた対応です。

ただし、metadataは消えることがあります。画像をダウンロードし直したり、別の形式に変換したり、SNSで圧縮されたりすると、情報が落ちる場合があります。

## SynthIDとは何か

そこでOpenAIは、Google DeepMindのSynthIDも使います。SynthIDは、人間には見えない透かしをAI生成コンテンツに埋め込む技術です。Google DeepMindは、画像、音声、テキスト、動画などに対して、AI生成かどうかを確認しやすくする仕組みとして説明しています。

OpenAIは今回、ChatGPT、Codex、OpenAI APIで生成された画像にSynthIDを組み込むとしています。C2PAが「詳しい説明の札」だとすれば、SynthIDは「画像そのものに残る見えない印」に近いです。

ただし、これも万能ではありません。OpenAIは、検出できなかった場合でも「OpenAIで作られていない」と断定しないと説明しています。

## なぜ会社に関係するのか

会社で生成AIを使うと、きれいな画像を作れるだけでは足りません。広告、採用ページ、EC商品画像、プレスリリース、社内資料で使ったときに、「これはAI生成ですか」「どのツールで作りましたか」「編集されていますか」と聞かれる可能性があります。

このとき、担当者の記憶だけに頼ると危険です。生成元の画像、編集後の画像、公開版の画像、検証結果を残しておく必要があります。

これは、[OpenAI安全要約の記事](/blog/openai-chatgpt-safety-summaries-2026/)で扱った会話安全や、[OpenAI Privacy Filterの記事](/blog/openai-privacy-filter-pii-redaction-2026/)で扱った個人情報保護と同じく、AIを安心して使うための管理の話です。

## 何を確認すればよいか

まず、どのツールで画像を作ったかを記録します。ChatGPTなのか、Codexなのか、APIなのかを残します。

次に、社内で画像を加工したあともC2PAの情報やSynthIDの信号が残るかを試します。CMSにアップロードしたとき、サムネイルを作ったとき、SNSへ投稿したときに消えるかもしれません。

最後に、検証できない画像をどう扱うかを決めます。信号が見つからないから安全、とは言えません。元画像を保管して、人間が確認できる手順を残すことが大切です。

## まとめ

OpenAIのC2PA対応とSynthID採用は、AI画像を「作る」段階から、「説明できる状態で使う」段階へ進める更新です。日本の会社では、画像生成AIを使う前に、保存、加工、公開、検証の流れを決めておくことが重要になります。

## 出典

- [Advancing content provenance for a safer, more transparent AI ecosystem](https://openai.com/index/advancing-content-provenance/) - OpenAI, 2026-05-19
- [C2PA Specifications](https://spec.c2pa.org/specifications/specifications/2.2/index.html) - C2PA
- [SynthID](https://deepmind.google/models/synthid/) - Google DeepMind
