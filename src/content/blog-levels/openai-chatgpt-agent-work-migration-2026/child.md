---
article: 'openai-chatgpt-agent-work-migration-2026'
level: 'child'
---

OpenAI の ChatGPT agent ページが更新され、ChatGPT agent は現在利用できないため、長い複数ステップの作業や完成物作成には ChatGPT Work を使う、という案内になりました。つまり、以前の agent のように「AI に仕事を進めてもらう」使い方は、Work という入口へ整理されていると考えると分かりやすいです。

会社で使う場合、この変更は名前の変更だけではありません。ChatGPT には Chat、Work、Codex という役割があります。Chat は質問や短い相談、Work は調査や資料作成、Codex はコードやリポジトリ作業です。どれをどの業務に使うかを決めないと、権限、費用、保存場所が分かりにくくなります。

## 何が変わったのか

OpenAI は、ChatGPT Work を「長い作業を進め、文書、表計算、プレゼン、レポート、Sites などを作るための agent」と説明しています。一方で Codex は、コードを書いたり、テストを走らせたり、リポジトリで作業したりするための mode です。

たとえば、市場調査をして社内レポートを作るなら Work が向いています。バグを直してテストを走らせるなら Codex が向いています。ちょっとした質問や文章の言い換えなら Chat で十分です。

[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) で見たように、Work のような長い作業は credits や費用管理にも関係します。[ChatGPTタスク刷新](/blog/openai-chatgpt-scheduled-tasks-management-2026/) のような定期実行ともつながります。だから、便利そうだから全部 Work に任せる、という決め方は危険です。

## 会社では何を確認するべきか

まず、これまで ChatGPT agent として使っていた作業を確認します。誰が使っていたか、どんなファイルを読ませていたか、どのアプリとつないでいたか、毎日や毎週の自動実行があったかを見ます。

次に、その作業を分類します。短い質問なら Chat に戻します。調査や資料作成なら Work に移します。コードやテストなら Codex に移します。外部サイトへのログインやファイル操作がある場合は、管理者の確認が必要です。

また、デスクトップ版と web/mobile 版の違いも大切です。OpenAI は、desktop の Work は許可があればローカルファイルや desktop apps を扱えると説明しています。つまり、会社の端末上のファイルに関係する使い方は、普通の web チャットよりも慎重に扱う必要があります。

## 注意したいポイント

一つ目は、アプリ権限です。メール、Drive、Calendar、Box、Slack などをつなぐと、AI が読める情報が増えます。必要なアプリだけを有効にし、必要な人だけに許可するのが安全です。

二つ目は、保存場所です。Chat、Work、Codex では、会話や作業の見え方が違うことがあります。特に desktop の Work や Codex は、ローカルファイルや端末と関係します。退職や端末交換のときに、作業履歴がどこに残るかを確認しておきましょう。

三つ目は、費用です。Work は長い作業や資料作成に使われるため、短いチャットより credits を使いやすい可能性があります。誰がどの仕事で使うかを決め、部署ごとに利用量を見ることが大切です。

## まとめ

ChatGPT agent の廃止は、「AI に作業を任せる機能が終わった」という意味ではありません。OpenAI は、一般的な会話を Chat、業務成果物を Work、開発作業を Codex に分けています。

日本企業は、旧 agent の使い方を棚卸しし、Work に移すもの、Codex に分けるもの、止めるものを決める必要があります。特に、アプリ権限、ローカルファイル、定期実行、credits 管理は先に確認しておくべきです。

## 出典

- [ChatGPT agent](https://help.openai.com/en/articles/11752874-chatgpt-agent) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
- [Moving to the new ChatGPT desktop app](https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app) - OpenAI Help Center
