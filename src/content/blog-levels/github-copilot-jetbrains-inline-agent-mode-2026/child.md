---
article: 'github-copilot-jetbrains-inline-agent-mode-2026'
level: 'child'
---

GitHubが2026年4月24日に、JetBrains IDEs向けの GitHub Copilot を更新しました。今回のポイントは、**inline agent mode** と **global auto-approve** です。

難しく見えますが、まず inline agent mode は「**エディタのその場で、Copilot に少し大きめの作業を頼みやすくなった**」くらいに考えると分かりやすいです。チャット専用の場所へ移らず、今見ているコードの流れで AI に相談できます。

## inline agent modeって何？

GitHub Docs では、agent mode を使うと Copilot が **どのファイルを触るかを考え、必要ならコード変更やターミナルコマンドを提案しながら、タスク完了まで進める** と説明しています。

つまり普通の「質問に答える AI」より一歩先で、**作業の手順まで持つ AI** です。今回の更新では、それを JetBrains の inline chat から呼び出せるようになりました。

## 何が便利になるの？

便利になる点は主に2つです。

1つ目は、**コードを見ながらその場で頼める** ことです。JetBrains は Java や Kotlin の開発で使われることが多く、エディタから離れずに補助してもらえるのは相性がいいです。

2つ目は、**複数箇所にまたがる修正を追いやすくなる** ことです。GitHubは Next Edit Suggestions も強化して、次の編集候補を inlay preview や gutter 表示で見やすくしました。

## でも何が危ないの？

注意点は `global auto-approve` です。これは、Copilot が出す **ファイル編集、ターミナルコマンド、外部ツール呼び出し** などを広く自動承認する設定です。

GitHub自身も、「リスクを理解して受け入れる場合にだけ有効にしてほしい」と案内しています。つまり、最初から誰でもオンにしてよい設定ではありません。

特に日本の会社では、IDE 上で AI にどこまで任せるかは、便利さだけでなく **権限管理と監査** の話になります。勝手にコマンドを通す運用は、チームによってはかなり危険です。

## 会社では誰が決めるの？

Copilot Business や Enterprise では、管理者が **feature policy** やモデル設定を通じて、機能を使えるかどうかを決められます。今回の preview 機能も、管理者設定が必要になる場合があります。

そのため、現場の開発者が「プラグインを更新したから使える」ではなく、**会社側の許可が1段入る** ことがあります。

## どう試すのがよい？

現実的には、次の順番が安全です。

- まずは一部チームだけで preview を許可する
- auto-approve は切ったまま始める
- テスト追加や軽いリファクタリングのような小さめの用途から試す
- どの操作まで自動承認してよいか、ルールを先に決める

## まとめ

今回の GitHub Copilot for JetBrains 更新は、「JetBrains でも AI が便利になった」というだけではありません。**エディタの中でエージェント的に動く AI を、どこまで信用してよいか** を考える更新です。

日本の開発チームでは、まず便利さより、**自動承認をどこまで許すか** を決めてから試すのがよいでしょう。

## 出典

- [Inline agent mode in preview and more in GitHub Copilot for JetBrains IDEs](https://github.blog/changelog/2026-04-24-inline-agent-mode-in-preview-and-more-in-github-copilot-for-jetbrains-ides/)
- [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide?tool=jetbrains)
- [GitHub Copilot policies to control availability of features and models](https://docs.github.com/en/copilot/concepts/policies)
