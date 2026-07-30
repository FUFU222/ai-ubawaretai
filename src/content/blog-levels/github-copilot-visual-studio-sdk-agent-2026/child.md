---
article: 'github-copilot-visual-studio-sdk-agent-2026'
level: 'child'
---

GitHub CopilotのVisual Studio向けJuly updateでは、Visual StudioのCopilot Chatに新しい**Agent (Preview)**が入りました。これは、GitHub Copilot CLIを動かしているものと同じGitHub Copilot SDKを使うAgentです。つまり、Visual Studioだけの別機能ではなく、CLIやGitHub app、VS Codeなどと近い考え方で動くAgent体験に寄せる更新です。

この更新で大事なのは、「Visual StudioでもAIが使いやすくなった」だけではありません。Visual Studioを標準IDEにしている.NETやAzureの開発チームでは、AI Agentをどこまで仕事に入れるか、どのルールを守らせるか、誰がレビューするかを決める必要があります。

## 新Agentは何を変えるのか

新しいAgent (Preview)は、Copilot Chatのagent pickerから選びます。GitHubとMicrosoftの説明では、少ないやり取りで作業を進め、返答も短く読みやすくする狙いがあります。たとえば、バグ修正、機能追加、リファクタ、テスト補修のような日常作業を頼む場面が想定されます。

これまでVisual Studio、VS Code、CLIでCopilotの使い心地が違うと、開発者は「どこで始めるべきか」を毎回考える必要がありました。SDKがそろってくると、CLIで始めた作業をVisual Studioで確認したり、Visual Studioで相談してGitHub上の作業につなげたりしやすくなります。

ただし、Previewなので、いきなり本番リポジトリ全体へ広げるのは急ぎすぎです。まずは小さなタスクで、どのくらい正しい差分を出すか、人間のレビュー時間が減るか、やり直しが多くないかを見ます。

## .NETとAzureのbuilt-in skillsとは

Visual Studioには、.NETチームとAzureチームが作ったbuilt-in skillsも入りました。該当する.NETやAzureのworkloadが入っていると、tool pickerのBuilt-inカテゴリに表示されます。

skillは、Copilotに「この領域ではこう考えてほしい」と渡す専門知識のようなものです。たとえば.NETアプリ、Azure構成、クラウド運用に関する助言を受けやすくなります。とはいえ、すべての会社に同じ答えが合うわけではありません。

日本企業では、Azureのリージョン、社内ネットワーク、ログ保管、命名規則、コスト管理が会社ごとに違います。そのためbuilt-in skillsは既定オフで確認し、チームの標準に合うものだけを有効にするのがよいです。

## 選択コードレビューと組織共通指示

今回の更新では、Visual Studioのeditorでコードを選び、右クリックからReview Selectionを実行できるようになりました。これは、PRを出す前に一部分だけCopilotへ見てもらう使い方に向いています。

たとえば、例外処理、SQL、認証まわり、古いコードの修正など、「ここだけ少し不安」という範囲を確認できます。ただし、Copilotのコメントは最終判断ではありません。通常の人間レビューやテストは必要です。

もう一つ、organization-level custom instructionsも入りました。GitHub organization ownersは、組織全体で共通するCopilotへの指示を設定できます。たとえば、テストを書く方針、説明の粒度、命名規則、コメントの書き方などです。

ここで注意したいのは、custom instructionsは強制ポリシーではないことです。セキュリティ上禁止したいこと、必ず通したい検査、秘密情報の扱いは、CI、レビュー、権限設定、管理者ポリシーで守る必要があります。

## 日本の開発チームが最初にすること

まず、Visual Studioの標準バージョンとCopilotの対象プランを確認します。全員の端末で同じ機能が見えるとは限りません。次に、小さな.NETリポジトリでAgent (Preview)を試します。バグ修正、テスト追加、軽いリファクタなど、失敗しても戻しやすい作業が向いています。

次に、built-in skillsを確認します。全部オンにするのではなく、社内標準に合うかを見ます。Azure関連の助言が、会社のリージョン方針や権限設計に合っているかは特に大事です。

最後に、organization-level custom instructionsを短く作ります。長い社内規程を貼るより、「テストを書く」「例外を握りつぶさない」「変更理由をPRで説明する」のように、日常作業で効く内容に絞ると使いやすくなります。

## まとめ

GitHub Copilot in Visual StudioのJuly updateは、Visual StudioをAI Agentの作業場所として一段強くしました。新Agent、.NET/Azure skills、選択コードレビュー、組織共通指示が入ったことで、個人の便利機能ではなくチーム運用の問題になっています。

日本の.NET/Azure開発チームは、まず小さく試し、使うskill、組織指示、レビュー手順を決めるべきです。AIに任せる範囲と、人間が確認する範囲を分けることが、この更新を安全に使う第一歩です。

## 出典

- [GitHub Copilot in Visual Studio - July update](https://github.blog/changelog/2026-07-30-github-copilot-in-visual-studio-july-update/) - GitHub Changelog, 2026-07-30
- [Visual Studio July Update - Meet the New Agent, Powered by the GitHub Copilot SDK](https://devblogs.microsoft.com/visualstudio/visual-studio-july-update-meet-the-new-agent-powered-by-copilot-sdk/) - Visual Studio Blog, 2026-07-28
- [Plans for GitHub Copilot](https://docs.github.com/copilot/get-started/plans) - GitHub Docs
