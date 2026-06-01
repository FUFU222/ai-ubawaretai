---
article: 'openai-codex-windows-profiles-usage-2026'
level: 'child'
---

OpenAI は 2026年5月29日、Codex の Windows Computer Use、Windows ホストの remote control、Profiles と usage statistics を発表した。これにより、Codex は Windows アプリを見て、クリックし、入力しながら、テストやデバッグを支援できるようになった。

大事なのは、スマートフォンや Mac が Windows の代わりになるわけではないことだ。作業の実体は Windows ホスト側に残る。プロジェクトファイル、shell、app server、ローカル文脈は Windows マシンが持ち、iOS や Android の ChatGPT、または Mac 上の Codex は進捗確認や追加指示の入口になる。

## 何が変わったのか

今回の更新で、Codex の Computer Use は macOS だけでなく Windows でも使えるようになった。Computer Use は、コマンドラインやファイル差分だけでは確認しにくい作業に向く。たとえば、Windows アプリの画面操作、ブラウザ上の不具合再現、設定画面の確認、複数アプリをまたぐワークフローなどだ。

ただし、Windows では Codex が active desktop を使う。人間が同じ Windows セッションを普通に使いながら、Codex だけが背後で作業する運用ではない。Codex が pointer を動かし、文字を入力し、前景のアプリを操作する。

そのため、Windows で長い作業を任せるなら、端末を unlock し、ネットワークに接続したままにする必要がある。OpenAI は、主作業端末を奪われたくない場合に Windows 仮想マシン上で Codex を使う考え方にも触れている。

## 日本企業で効く理由

日本企業では、開発端末や業務端末が Windows 中心の組織が多い。Mac で先行検証していた AIコーディングエージェントを、Windows の業務アプリ、社内Webアプリ、QA環境、検証用ブラウザへ広げられる意味は大きい。

たとえば、社内管理画面の表示崩れ、Windows アプリの入力エラー、ブラウザでしか再現しない不具合を、Codex に再現させて修正候補を作らせる使い方が考えられる。これは、単なるコード生成ではなく、画面を見ながら作業する開発支援に近い。

一方で、便利さだけで全社展開すべきではない。Computer Use は画面上の情報を扱う。顧客情報、社内チャット、認証画面、決済画面、本番管理画面が開いていれば、それも Codex の文脈に入る可能性がある。

## 最初に決めること

まず、Codex に渡す Windows 環境を絞る。普段使いの業務端末ではなく、検証用VM、専用PC、ダミーデータの環境から始めるのがよい。Windows では前景操作が前提なので、作業中に人間が同じ画面を使い続ける設計は避けたい。

次に、対象アプリを限定する。ローカル開発URL、検証用アプリ、テストデータの管理画面だけにする。メール、チャット、社内ファイル、認証設定、ネットワーク設定、支払い関連の画面は対象外にする。

さらに、remote control を許可する端末を決める。スマートフォンから Windows ホストの作業へ指示を出せるなら、SSO、MFA、passkey、MDM、紛失時の失効手順も必要になる。承認が便利になるほど、承認端末の管理も重要になる。

## Profilesとusage statistics

今回の更新には、Codex Profiles と usage statistics も含まれる。利用者は lifetime tokens、peak tokens、longest task、token activity などを確認できる。これは費用管理だけでなく、自分の使い方を振り返る材料になる。

企業側は、この数値を個人の評価に直結させるより、チームの運用改善に使うべきだ。どの作業で消費が大きいのか、どのタスクが長くなるのか、Windows GUI 操作はレビュー時間を減らしているのかを見る。そうすれば、Codex を使うべき作業と、人間が直接やるべき作業を分けやすくなる。

## まとめ

Codex の Windows Computer Use 対応は、Windows が多い日本企業にとって使い道がある。ただし、普段使い端末をそのまま渡すのは危ない。検証用Windows環境、対象アプリ、承認端末、利用統計の扱いを決めてから、小さく始めるのが現実的である。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-05-29
- [Computer Use](https://developers.openai.com/codex/app/computer-use) - OpenAI Developers
- [Remote connections](https://developers.openai.com/codex/remote-connections) - OpenAI Developers
- [Settings](https://developers.openai.com/codex/app/settings) - OpenAI Developers
