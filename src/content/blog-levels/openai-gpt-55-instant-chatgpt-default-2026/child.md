---
article: 'openai-gpt-55-instant-chatgpt-default-2026'
level: 'child'
---

OpenAIが2026年5月5日に **GPT-5.5 Instant** を発表した。これは、ChatGPTで最初に使われる標準モデルをGPT-5.3 Instantから置き換える更新だ。つまり、一部の有料ユーザーだけが選ぶ特別なモデルではなく、ふだんChatGPTを開いたときの基本体験が変わる。

今回の話は、以前の [GPT-5.5全体の発表](/blog/openai-gpt-55-codex-chatgpt-api-2026/) とは少し見る角度が違う。前回はCodex、Thinking、API価格が中心だった。今回は、日常的なChatGPTの答え方、メモリの使い方、APIでの `chat-latest` という名前がポイントになる。

## 何がよくなったの？

OpenAIは、GPT-5.5 InstantはGPT-5.3 Instantよりも事実に強くなったと説明している。高リスクな質問では、幻覚的な主張が52.5%減ったとされている。ここでいう幻覚とは、AIがそれっぽいけれど間違ったことを言ってしまう現象のことだ。

また、答えが短く、分かりやすく、会話として自然になったとも説明されている。たとえば、仕事でちょっとした文章を直したい、画像を見て説明してほしい、数学や科学の質問をしたい、Web検索を使うべきか判断してほしい、という場面で改善があるとされている。

ただし、これはOpenAIの説明であり、すべての仕事で必ず正しくなるという意味ではない。医療、法律、金融、セキュリティのような大事な判断では、これまで通り人間の確認が必要だ。

## memory sourcesって何？

今回のもう1つの大きな変更が **memory sources** だ。ChatGPTがあなたに合わせた回答をしたとき、どの保存メモリや過去チャットが使われたのかを見られるようにする機能である。

これは便利だ。たとえば、ChatGPTが「あなたは東京で働いている前提」で答えたとき、その情報がどこから来たのかを確認しやすくなる。もし古い情報なら削除したり、保存メモリを修正したりできる。

一方で、会社で使う場合は注意が必要だ。個人のGmail、過去チャット、ファイルが回答に影響するなら、どのアカウントで何を接続してよいかを決めなければならない。これは [Offline web searchの話](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) と同じで、便利な機能ほど管理ルールが必要になる。

## APIでは何が変わる？

OpenAIは、GPT-5.5 InstantをAPIでは `chat-latest` として提供すると説明している。これは「ChatGPTで使われている最新のInstantモデル」を指す名前だ。開発者にとっては、最新のチャット体験をアプリで試しやすくなる。

ただし、本番サービスで使うときは注意したい。`chat-latest` は最新モデルを指すので、将来また中身が変わる可能性がある。社内のテスト環境なら便利だが、カスタマーサポートや重要な業務アプリでは、モデル変更で答え方が変わって困ることもある。固定モデルと比べながら使うほうが安全だ。

## 日本の会社は何を見るべき？

日本企業がまずやるべきことは、難しいAI戦略を作ることではない。よく使うプロンプトをいくつか選び、GPT-5.5 Instantで答えがどう変わるかを見ることだ。文章が短くなるのか、表現が自然になるのか、事実確認がしやすくなるのかを確認する。

次に、メモリと接続データのルールを決める。仕事用アカウントでGmailを接続してよいのか、過去チャットを使ってよいのか、退職や異動のときにどうするのか。ここを曖昧にすると、あとで困りやすい。

最後に、ChatGPTを使う人とAPIを使う開発者で、同じニュースでも見る場所が違うことを理解したい。利用者にとっては答え方とメモリの変化が重要で、開発者にとっては `chat-latest` の安定性とコストが重要になる。

GPT-5.5 Instantは、ChatGPTが少し賢くなっただけの話ではない。標準のAIが、より多くの文脈を使い、より自然に仕事へ入り込む更新だ。だからこそ、[OpenAIのアカウント保護設定](/blog/openai-advanced-account-security-codex-2026/) と合わせて、使い方のルールも見直したい。

## 出典

- [GPT-5.5 Instant: smarter, clearer, and more personalized](https://openai.com/index/gpt-5-5-instant/) - OpenAI, 2026-05-05
- [GPT-5.5 Instant System Card](https://deploymentsafety.openai.com/gpt-5-5-instant/evaluations-with-challenging-prompts) - OpenAI Deployment Safety Hub, 2026-05-05
- [chat-latest Model](https://developers.openai.com/api/docs/models/chat-latest) - OpenAI API Docs
- [Introducing OpenAI's newest chat model in Microsoft Foundry](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-openais-newest-chat-model-in-microsoft-foundry/4516848) - Microsoft, 2026-05-05
