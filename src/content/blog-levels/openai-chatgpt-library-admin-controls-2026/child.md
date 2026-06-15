---
article: 'openai-chatgpt-library-admin-controls-2026'
level: 'child'
---

OpenAI は、ChatGPT Enterprise、Edu、Healthcare 向けに **Library** を広げています。Library は、ChatGPT にアップロードしたファイルや、ChatGPT で作ったファイルを後から探して使いやすくする場所です。

大事なのは、「便利な保存場所が増えた」だけではないことです。会社で ChatGPT を使う場合、ファイルがどこに残るのか、ChatGPT がそのファイルを自動で見に行くのか、あとで監査や削除ができるのかを決める必要があります。

## Libraryは何をする機能か

Library は、ChatGPT の中で使ったファイルを見つけ直すための仕組みです。たとえば、資料、表、画像、ChatGPT が作ったファイルなどを、別の会話で使いたいときに探しやすくなります。

ただし、会社で使うときは注意が必要です。ファイルはワークスペースの保持ポリシーに従います。つまり、個人がなんとなく保存しているだけではなく、会社のルールで管理される対象になります。

以前の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) は、Google Drive や Outlook などの接続アプリを使うときに、どこで確認を入れるかという話でした。今回の Library は、ChatGPT の中に残るファイルをどう扱うかという話です。

## 自動参照はオンオフできる

OpenAI の説明では、ワークスペース owner は ChatGPT が Library のファイルを自動で参照するかどうかを管理できます。自動参照がオンなら、ChatGPT は回答するときに Library 内の関連ファイルを使う可能性があります。オフにしても、Library 自体は残り、ユーザーは自分でファイルを探して添付できます。

これは日本企業ではかなり重要です。営業資料や製品仕様書なら、自動参照で作業が速くなるかもしれません。一方で、人事、医療、法務、金融、顧客別の秘密資料では、勝手に参照されると説明が難しくなることがあります。Healthcare ワークスペースでは、自動参照が最初からオフになっている点も、そのリスクを示しています。

## 削除と監査も確認する

Library には Compliance API の論点もあります。OpenAI は、Library ファイルを export したり delete したりするための専用 endpoint があると説明しています。これは、会社が「誰が何を保存したか」「退職者のファイルをどう扱うか」「削除依頼が来たらどうするか」を考えるときに関係します。

また、チャットを削除したらファイルも全部消える、と考えないほうがよいです。OpenAI の保持ポリシー説明では、チャットとファイルは別に扱われます。会社の手順でも、会話、Library ファイル、Project や GPT に入れたファイルを分けて見る必要があります。

[ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) では、どの端末にログインが残っているかを確認する話を扱いました。Library では、どのファイルが残っているかを確認する視点が必要になります。

## 外部アプリ承認も同時に見る

同じ更新では、Global Admin Console で Sign in with ChatGPT の外部アプリ利用を管理できることも示されています。管理者は、組織で Sign in with ChatGPT を使えるかどうかを決めたり、承認済みアプリだけを許可したり、個別アプリを無効化したりできます。

これは、会社のログイン管理と関係します。Google や Microsoft のアカウントだけを管理していても、ChatGPT アカウントで別の外部アプリに入れるなら、そこも確認しなければなりません。外部アプリを増やす前に、承認リスト、無効化手順、退職時の扱いを決めておくべきです。

## まず決めること

日本企業が最初に決めることは、次の3つです。まず、Library の自動参照をどの部署で許すか。次に、保存してよいファイルと消すべきファイルをどう説明するか。最後に、Sign in with ChatGPT を使える外部アプリを誰が承認するかです。

Library は、ChatGPT を仕事で使いやすくする機能です。しかし、仕事で使いやすいということは、重要なファイルも残りやすいということです。[OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) と同じように、社内文脈を使える機能ほど、参照範囲と削除手順を先に決める必要があります。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [File storage and Library in ChatGPT](https://help.openai.com/en/articles/20001052-file-storage-and-library-in-chatgpt) - OpenAI Help Center
- [Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console) - OpenAI Help Center
