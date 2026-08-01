---
article: 'openai-codex-gpt54-retirement-terra-luna-2026'
level: 'child'
---

OpenAI は 2026年7月31日、Codex で使えるモデルについて大事なお知らせを出しました。**GPT-5.4 と GPT-5.4 mini が、2026年8月31日に Codex から退役**します。

ここで大事なのは、「すべての GPT-5.4 が止まる」わけではないことです。対象は、ChatGPT アカウントでサインインして Codex を使っている場合です。OpenAI API で GPT-5.4 を使う場合や、自分の API key で Codex を使う場合は、今回の告知では直接の対象外です。

## 何に置き換えるのか

OpenAI は、GPT-5.4 を使っている人は **GPT-5.6 Terra** へ、GPT-5.4 mini を使っている人は **GPT-5.6 Luna** へ移るよう案内しています。

GPT-5.4 は、少し前まで Codex の中心的なモデルとして使われていました。GPT-5.4 mini は、軽い作業や長く使いたい作業に向くモデルとして説明されていました。今回の退役で、Codex の普段使いは GPT-5.6 世代へ移っていくことになります。

ただし、モデル名を変えるだけで終わりではありません。会社で Codex を使っている場合、設定ファイル、IDE、社内マニュアル、研修資料、チームのテンプレートに古いモデル名が残っていることがあります。そこを直さないと、8月31日以降に「手順どおりにしたのに動かない」という問題が起きます。

## APIは同じ話ではない

今回の告知では、OpenAI API と、自分の API key で認証した Codex session は影響を受けないとされています。つまり、開発チームはまず「どの使い方が ChatGPT サインインで、どの使い方が API key 経由なのか」を分けて確認する必要があります。

会社の中では、ChatGPT、Codex、OpenAI API がまとめて「OpenAI」と呼ばれがちです。でも、モデルの退役や料金の扱いは同じではありません。今回必要なのは、API の緊急改修ではなく、ChatGPT 認証で使う Codex の設定確認です。

## 会社で確認する場所

まず、Codex CLI の設定を見ます。`gpt-5.4` や `gpt-5.4-mini` を指定している人がいれば、GPT-5.6 Terra や GPT-5.6 Luna へ変える準備が必要です。

次に、IDE 拡張や Codex Cloud のモデル選択を見ます。個人が画面で選んでいるだけなら周知で済むかもしれませんが、管理者が標準設定を配っている場合は、設定の配布元を直す必要があります。

さらに、custom agent や scheduled task も確認します。定期的に動く作業が古いモデルを指定していると、退役後に自動処理が止まる可能性があります。毎日使う小さな自動化ほど、早めに見ておくほうが安全です。

## まとめ

今回の Codex GPT-5.4 退役は、派手な新機能ではありません。でも、会社で Codex を使っているなら実務上は重要です。

8月31日までに、ChatGPT サインインで使う Codex のモデル指定を確認し、GPT-5.6 Terra と GPT-5.6 Luna への移行を試しておく。API key 経由とは影響範囲が違うので、混同しない。これだけでも、月末の混乱をかなり減らせます。

## 出典

- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card) - OpenAI Help Center
- [ChatGPT & Codex changelog](https://learn.chatgpt.com/docs/changelog) - ChatGPT Learn
