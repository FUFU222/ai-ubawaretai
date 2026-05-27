---
article: 'github-copilot-memory-repo-cli-controls-2026'
level: 'child'
---

GitHub Copilot Memoryに、管理しやすくするための新しい機能が入りました。簡単に言うと、Copilotが「このリポジトリではこう進める」「この人はこういう書き方を好む」といった情報を覚えるときに、どこで使われる記憶なのかを見やすくし、リポジトリ単位で止めたり、Copilot CLIから状態を切り替えたりしやすくする更新です。

前に扱った[Copilot Memoryの個人設定](/blog/github-copilot-memory-user-preferences-2026/)は、「ユーザー本人の好みを覚える」話でした。今回はそれに加えて、リポジトリ管理者やCLI利用者がどう管理するかが大事になります。

## 何が変わったのか

GitHubの発表では、4つの変更が説明されています。

1つ目は、削除の案内です。Copilotに「それを忘れて」と頼んだとき、どこで削除すればよいかを案内するようになります。会話で言えば全部消える、というより、保存された場所に合わせて削除しに行く仕組みだと考えると分かりやすいです。

2つ目は、リポジトリ単位のoff switchです。リポジトリ管理者は、そのリポジトリでCopilot Memoryを無効にできます。無効にすると、repository-level factsは保存も参照もされません。ただし、すでにあるfactsが自動で消えるわけではなく、user-level preferencesにも影響しないとされています。

3つ目は、Copilot CLIの`/memory`コマンドです。`/memory on`、`/memory off`、`/memory show`で、Memoryを有効にする、無効にする、状態を確認することができます。

4つ目は、保存時のスコープ表示です。Copilotが何かをMemoryとして保存しようとするとき、それが自分だけのpreferenceなのか、リポジトリのfactなのかを示すようになります。

## 2種類の記憶を分ける

Copilot Memoryには、大きく2種類があります。

1つはrepository-level factsです。これはリポジトリについての知識です。たとえば、テストコマンド、設計上の決まり、コーディング規約、プロジェクト固有のルールなどです。同じリポジトリで作業する人に影響する可能性があります。

もう1つはuser-level preferencesです。これはユーザー本人の好みです。PR本文は短めがよい、日本語で説明してほしい、commit messageの形式をそろえたい、といったものです。

この2つを混ぜると危険です。会社やチームとして必ず守るルールは、個人の好みに任せるべきではありません。セキュリティレビュー、リリース手順、テスト必須条件などは、リポジトリのドキュメントやレビュー設定に置くべきです。

## 日本のチームで大事なこと

日本企業でCopilotを使うときは、誰が何を消せるのかを決めておく必要があります。repository-level factsは、リポジトリ管理者が確認して削除できます。user-level preferencesは、基本的に本人が確認して削除します。

また、[Copilot Spaces API](/blog/github-copilot-spaces-api-ga-context-2026/)のようにチームの共有文脈を管理する機能もあります。チーム全体で共有したい情報はSpacesへ、リポジトリの慣習はrepository factsへ、個人の好みはuser preferencesへ、と分けると整理しやすくなります。

さらに、[Copilot CLI遠隔操作](/blog/github-copilot-cli-remote-control-ga-2026/)のように、CLIの作業が長時間続いたり、別デバイスから承認したりする場面も増えています。そのときにMemoryが有効なのか、無効なのかを`/memory show`で確認できるのは重要です。

## まず決めること

最初に決めるべきなのは、全社で有効にするかどうかではありません。どのリポジトリではMemoryを使ってよく、どのリポジトリでは止めるのかです。

社内ツールや共通ライブラリのように、同じ慣習を何度も使うリポジトリではMemoryが役立ちやすいです。一方で、顧客固有のコード、機密性の高い処理、短いPoC、委託先が頻繁に出入りするリポジトリでは、off switchを使うほうが説明しやすい場合があります。

次に、削除手順を短く書いておきます。間違ったfactが保存されたら誰に言うのか。自分のpreferenceがおかしいときはどこで消すのか。CLIでMemoryを一時的に切るにはどうするのか。ここまで分かれば、現場は安心して使いやすくなります。

## まとめ

今回のGitHub Copilot Memory更新は、便利な記憶を増やすだけの話ではありません。リポジトリ単位で止められる、CLIで状態を見られる、保存時にスコープが分かる、削除場所へ案内されるという、管理のための更新です。

日本の開発チームは、Memoryを「Copilotが勝手に覚える機能」と見ないほうがよいです。何を覚えさせるか、どこでは止めるか、誰が消すかを決めれば、Copilotをより安全に使いやすくできます。

## 出典

- [Copilot Memory has more controls for deletion, scope, and the Copilot CLI](https://github.blog/changelog/2026-05-26-copilot-memory-has-more-controls-for-deletion-scope-and-the-copilot-cli/) - GitHub Changelog, 2026-05-26
- [Managing and curating Copilot Memory](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory) - GitHub Docs
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) - GitHub Docs
