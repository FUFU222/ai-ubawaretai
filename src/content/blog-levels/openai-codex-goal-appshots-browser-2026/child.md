---
article: 'openai-codex-goal-appshots-browser-2026'
level: 'child'
---

OpenAIが2026年5月21日に、Codexの新しい使い方をいくつか公開しました。

大事なのは、Codexが「コードを書いてくれるチャット」から、「長い作業を続けながら、人間と一緒に確認して進める道具」に近づいていることです。

## 何が変わったの？

今回の更新には、Goal mode、Appshots、ブラウザの注釈、locked computer useなどがあります。

Goal modeは、Codexに「ゴール」を渡して作業させる機能です。たとえば「この画面の表示崩れを直し、テストを通し、変更内容を説明する」というように、何が終わった状態なのかを最初に書けます。

Appshotsは、Macで開いているアプリ画面をCodexに見せる機能です。文章で説明しにくいエラー画面、設定画面、デザイン画面などを、そのまま作業のヒントにできます。

ブラウザの注釈は、Webアプリの画面に直接コメントして、どこを直してほしいかCodexに伝える機能です。「このボタンがはみ出している」「この余白が広すぎる」といった指示を、画面上で伝えやすくなります。

locked computer useは、Macがロックされた後でも、条件を満たしたCodexのComputer Use作業を続けられる仕組みです。ただし、何でも自由に遠隔操作できる機能ではありません。OpenAIは、信頼された短い作業に限るものとして説明しています。

## なぜ開発チームに関係あるの？

AIにコードを書かせるとき、難しいのは最初の一歩だけではありません。途中でエラーが出る、テストが落ちる、画面がまだ崩れている、どこまで直してよいか迷う。こうした場面で、人間の確認や判断が必要になります。

Goal modeがあると、Codexは作業の目的を忘れにくくなります。Appshotsやブラウザ注釈があると、人間は画面の状態を文章だけで説明しなくてよくなります。

つまり、Codexに任せられる作業が少し長くなります。小さなコード生成だけでなく、調査、修正、確認、説明までを一つの流れにしやすくなるのです。

## でも注意も必要

便利になるほど、Codexに見せる情報も増えます。Appshotsで画面を共有すると、画面に出ている顧客情報や社内情報も一緒に渡してしまうかもしれません。

ブラウザで確認する場合も、本番の管理画面やログイン済み画面をそのまま使ってよいとは限りません。OpenAIのin-app browserは、ローカル開発サーバーやログイン不要のページに向いています。認証が必要な画面では、別の方法や人間の確認が必要です。

locked computer useも同じです。Macがロックされたあとも作業できるのは便利ですが、会社の端末管理、画面録画の権限、操作できるアプリの範囲を決めずに使うのは危険です。

## まず何から試すべき？

最初は、リスクの小さい作業から試すのがよいです。

たとえば、開発中の画面の表示崩れを直す、テストを追加する、READMEを更新する、古いコードを少し整理する、といった作業です。ゴールがはっきりしていて、最後に確認しやすいものが向いています。

逆に、顧客データを扱う画面、決済や認証に関わる変更、本番環境の操作は、いきなり任せるべきではありません。

今回のCodex更新は、「AIが勝手に全部やる」という話ではありません。人間がゴールを決め、画面で指示し、最後に確認する。その流れを少し楽にする更新です。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Appshots](https://developers.openai.com/codex/appshots) - OpenAI Developers
- [Prompting: Goal mode](https://developers.openai.com/codex/prompting) - OpenAI Developers
- [In-app browser](https://developers.openai.com/codex/app/browser) - OpenAI Developers
- [Computer Use](https://developers.openai.com/codex/app/computer-use) - OpenAI Developers
