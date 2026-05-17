---
article: 'github-copilot-memory-user-preferences-2026'
level: 'child'
---

GitHub Copilot Memoryに、Copilot ProとPro+ユーザー向けの**user-level preferences**が加わりました。簡単に言うと、Copilotが「この人はどんな書き方や進め方を好むのか」を覚え、別のリポジトリや別のCopilot機能でも使えるようにする仕組みです。

これまでのCopilot Memoryは、主にリポジトリの知識を覚えるものでした。たとえば「このプロジェクトではテストをこのコマンドで実行する」「PRではこのテンプレートを使う」といった、チームやコードベースに関係する情報です。今回の更新では、それに加えて、ユーザー本人の好みも扱えるようになりました。

## 何が変わったのか

GitHubの発表では、Copilot Memoryがユーザーの明示した好みや推測された好みを保存できるようになったと説明されています。例としては、commit messageのスタイル、pull requestの構成、説明文のトーンなどです。

たとえば、いつも「PR本文は背景、変更点、テスト結果の順にして」と頼んでいる人なら、その好みを毎回書かなくてもCopilotが反映しやすくなります。英語より日本語で説明してほしい、短い箇条書きがよい、commit messageはConventional Commitsにしたい、といった好みも対象になり得ます。

ただし、すべてのCopilot機能で同じように使われるわけではありません。GitHub Docsでは、Copilot MemoryはCopilot cloud agent、Copilot code review、Copilot CLIで使われると説明されていますが、Copilot code reviewではuser-level preferencesではなくrepository-level factsだけを使うとされています。

## 個人の記憶とリポジトリの記憶は違う

ここで大事なのは、2種類の記憶を分けて考えることです。

1つ目は、repository-level factsです。これは特定のリポジトリに関する知識です。チームのコーディング規約、テスト方法、設計判断、設定ファイルの関係などが含まれます。リポジトリの所有者は、保存されたfactを確認し、間違っていれば削除できます。

2つ目は、user-level preferencesです。これはユーザー本人の好みです。他のメンバーに共有されるリポジトリ知識ではなく、その人の後続のCopilot利用に使われます。ユーザー本人が確認し、不要なら削除できます。

この違いを理解しないと、企業では混乱が起きます。会社として守るべきルールは、個人の好みに任せるべきではありません。たとえば、セキュリティレビューの手順、テスト必須の条件、リリース前チェックは、custom instructionsやリポジトリのドキュメントに置くべきです。一方、説明文の長さやPR本文の書き方の好みは、user-level preferencesに向いています。

## 企業利用で注意すること

個人契約のCopilot Pro/Pro+では、Copilot Memoryは既定で有効です。ユーザーは個人のCopilot settingsから無効化や再有効化ができます。

一方、企業や組織で管理しているCopilotでは、既定でオフです。enterpriseまたはorganizationの管理者が有効化する必要があります。複数のorganizationからCopilot subscriptionを受けているユーザーでは、最も制限の強い設定が適用されます。つまり、関係する組織のどこかで無効になっていれば、Memoryが使われない場合があります。

また、保存されたfactやpreferenceは使われなければ28日後に自動削除されると説明されています。便利だからといって無期限に正しいとは考えず、間違った記憶があれば削除する運用が必要です。

## 日本のチームはどう始めるべきか

最初は、全社展開ではなく小さなチームで試すのが現実的です。たとえば開発基盤チームやPlatform Engineeringチームで有効化し、Copilot CLIやcloud agentで、プロンプトの繰り返しが減るかを確認します。

同時に、次の3点を決めておくと安全です。

- 会社共通ルールはどこに書くか
- 個人の好みとして許す範囲はどこまでか
- 間違ったMemoryを誰がどう削除するか

Copilot Memoryは、開発者が毎回同じ説明をしなくて済む便利な機能です。ただし、AIエージェントがIssue、PR、CLI、デスクトップアプリへ広がっている今は、個人の好みが成果物に影響する場面も増えます。便利さだけでなく、管理と確認の手順をセットで導入するのが大切です。

## 出典

- [Copilot Memory supports user preferences for Pro, Pro+ users](https://github.blog/changelog/2026-05-15-copilot-memory-supports-user-preferences-for-pro-pro-users/) - GitHub Changelog, 2026-05-15
- [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/agents/copilot-memory) - GitHub Docs
- [Managing and curating Copilot Memory](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory) - GitHub Docs
