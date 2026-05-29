---
article: 'openai-o3-gpt45-chatgpt-retirement-2026'
level: 'child'
---

OpenAI は 2026年5月28日、ChatGPT のリリースノートで、GPT-5.5 Instant の更新と、OpenAI o3 / GPT-4.5 の退役予定を発表しました。これは新しいモデルの発表というより、ChatGPT の中で使えるモデルを整理していく話です。

大事なのは期限です。GPT-4.5 は 2026年6月27日に ChatGPT から退役予定です。OpenAI o3 は 2026年8月26日に退役予定です。OpenAI は、この変更は ChatGPT だけの話で、API には変更がないと説明しています。

## 何が変わるのか

今回の更新では、GPT-5.5 Instant の返答がより読みやすく、自然で、実務タスクに合うように調整されました。OpenAI は、長すぎる回答や箇条書きが多すぎる回答を減らす方向だと説明しています。

もう1つの変更は Canvas です。GPT-5.5 Instant と GPT-5.5 Thinking では Canvas が使えなくなります。文章作成やコード作成は、今後はチャット内の writing blocks や code blocks で扱う方向です。有料ユーザーは、古いモデルが残っている間だけ legacy models 経由で Canvas を使える場合があります。

さらに、o3 と GPT-4.5 は ChatGPT から段階的に退役します。これらのモデルを仕事で指定していた人は、別のモデルで同じ作業ができるか確認する必要があります。

## なぜ会社で注意が必要なのか

会社では、ChatGPT の使い方が資料や手順書に残っていることがあります。たとえば「GPT-4.5で下書きする」「o3で最終確認する」「Canvasで編集する」といった説明です。

もしそのままにしておくと、モデルが消えたあとに社員が迷います。特に GPT-4.5 は退役予定日まで約30日しかありません。研修資料、社内 FAQ、プロンプト集を早めに見直したほうがよいです。

ただし、API を使っている開発チームは慌てすぎる必要はありません。OpenAI は今回の変更が ChatGPT のみで、API には変更がないと説明しています。ChatGPT の画面利用と API 利用を分けて考えることが大切です。

## 確認するもの

まず、社内資料で `o3`、`GPT-4.5`、`Canvas` という言葉を検索します。見つかったら、その手順を今後どのモデルや機能に置き換えるか決めます。

次に、よく使うプロンプトをいくつか選び、GPT-5.5 Instant、Thinking、Pro で出力を比べます。正しさだけでなく、文章の長さや見出しの作り方も確認します。

最後に、社内で共有している GPTs や Skills を確認します。古いモデルや Canvas を前提にしたものがあれば、説明文や使い方を直します。

## まとめ

今回の OpenAI 更新は、ChatGPT を使う会社にとってモデル棚卸しの合図です。GPT-4.5 は 2026年6月27日、o3 は 2026年8月26日に退役予定です。

日本企業が見るべき点は、どのモデルが強いかだけではありません。社内の手順書、プロンプト集、GPTs、研修資料が古いモデル名や Canvas に依存していないかを確認することです。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-05-28
- [GPT-5.5 Instant: smarter, clearer, and more personalized](https://openai.com/index/gpt-5-5-instant/) - OpenAI, 2026-05-05
- [What is the ChatGPT model selector?](https://help.openai.com/en/articles/7864572) - OpenAI Help Center
