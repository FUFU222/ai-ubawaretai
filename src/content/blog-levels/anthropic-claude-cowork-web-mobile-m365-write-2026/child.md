---
article: 'anthropic-claude-cowork-web-mobile-m365-write-2026'
level: 'child'
---

Anthropic は 2026年7月7日、Claude Cowork を web と mobile でも使えるようにし、Microsoft 365 connector に write tools を追加しました。これは「スマホでもClaudeが使いやすくなった」というだけの話ではありません。AIがメール、予定、ファイルに関わる業務を手伝う範囲が広がったということです。

## 何が変わったのか

Claude Cowork は、Claude に作業を任せるための機能です。これまでは desktop の印象が強い機能でしたが、今回の更新で web と mobile からも使えるようになりました。Anthropic は、まず Max plan から数週間かけて展開し、他のプランにも広げると説明しています。

大事なのは remote session です。Cowork の作業は Anthropic 側のサーバーで動き、セッションやファイルは Claude アカウントに保存されます。そのため、パソコンを閉じても作業が続いたり、scheduled tasks が端末なしで動いたりします。

一方で、ローカルファイルやブラウザ操作など、利用者の端末に触れる機能は Claude Desktop app が必要になる場合があります。web や mobile から見えるからといって、会社の端末やファイルへ無制限にアクセスするわけではありません。

## Microsoft 365でできることが増えた

もう1つの大きな更新は、Microsoft 365 connector の write tools です。これまでの connector は、SharePoint、OneDrive、Outlook、Teams などを検索・分析する用途が中心でした。今回の更新では、管理者が許可すれば、Claude がメールの下書きや送信、予定の作成・更新、OneDrive や SharePoint のファイル作成・更新をできるようになります。

ただし、使うには準備が必要です。Microsoft Entra の管理者が permission set に同意し、Claude 側でも write tools を有効にする必要があります。既存の connector 利用企業では、write tools は最初から開いているのではなく、組織側が有効化します。

Teams は引き続き read-only です。Claude が Teams に投稿したり、Teams の設定を変えたりする機能はありません。また、メールには AI が送ったことを示す header が付きますが、ファイルやカレンダーの変更には同じ印が付くとは限りません。

## なぜ日本企業に重要なのか

日本企業の多くは Microsoft 365 を日常業務の中心にしています。Outlook、Teams、SharePoint、OneDrive、予定表は、単なるツールではなく、会社の仕事そのものに近い存在です。そこに AI が書き込みできるようになると、便利さもリスクも大きくなります。

たとえば、会議調整、メール下書き、社内資料の作成は便利です。しかし、顧客メールをAIが送る、正式な契約書ファイルをAIが更新する、重要会議の予定をAIが変更するとなると、誰が承認したのかを決める必要があります。

つまり、今回の更新は「AIを入れるかどうか」ではなく、「AIにどの操作まで許すか」の問題です。検索だけ許すのか、下書きまで許すのか、送信やファイル更新まで許すのかを分ける必要があります。

## 最初に決めること

まず、read-only と write を分けます。情報を探すAIと、データを変更するAIは同じ扱いにしないほうがよいです。最初は検索と要約だけにし、次にメール下書きやテストフォルダでのファイル作成など、低リスクな操作から試すのが現実的です。

次に、誰に write tools を許すかを決めます。全社員にいきなり開放する必要はありません。人事、法務、営業、開発、経理では扱う情報も事故の影響も違います。部門や役割ごとに許可する操作を分けるべきです。

最後に、ログと承認を確認します。AI が作ったメール、予定、ファイルをあとから追えるか。誰が依頼し、誰が承認し、どの情報を使ったのかを説明できるか。ここが曖昧なまま本番利用を広げると、便利になった分だけ事故時の説明が難しくなります。

Claude Cowork の web/mobile 展開と Microsoft 365 write tools は、AIエージェントが非エンジニアの仕事にも入りやすくなったことを示しています。日本企業は、便利さだけでなく、権限、承認、ログを先に決めてから使うべきです。

## 出典

- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Anthropic, 2026-07-07
- [Use Claude Cowork on web, desktop, and mobile](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile) - Anthropic, 2026-07-07
- [Set up the Microsoft 365 connector](https://support.claude.com/en/articles/12542951-set-up-the-microsoft-365-connector) - Anthropic, 2026-07-07
