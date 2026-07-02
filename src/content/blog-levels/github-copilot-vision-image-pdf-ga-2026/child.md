---
article: 'github-copilot-vision-image-pdf-ga-2026'
level: 'child'
---

GitHubは2026年7月1日、画像やPDFを読み取れる**GitHub Copilot vision**を一般提供しました。VS Code、github.com、Copilot CLIで使えます。Copilot Free、Pro、Pro+、Business、Enterpriseの全プランが対象です。

便利なのは、画面のscreenshot、UIのmock、flowchart、設計PDFを、codeと一緒にCopilotへ見せられることです。ただし、会社で使う場合は「画像なら貼ってよい」と考えてはいけません。画像やPDFにも、個人情報、secret、顧客名、社内URL、未公開機能が含まれるからです。

## 何が変わったのか

対応する画像はJPEG、PNG、GIF、WebPです。文書はPDFに対応します。

VS Codeでは、Copilot Chatへ画像を貼り付けたり、drag and dropしたりできます。ask、plan、agent modeで利用できます。github.comではWebのCopilot Chatへ画像やPDFを添付できます。Copilot CLIでは、terminalから画像fileのpathを指定できます。

BusinessとEnterpriseでは、以前はEditor Preview Featuresという設定が必要でした。一般提供後は追加のpolicy変更が不要になり、visionは既定で利用できます。またGitHubは、BusinessとEnterpriseで添付された画像やPDFを、サービス提供のため約24時間保持すると説明しています。

この24時間は「何を送ってもよい時間」ではありません。短い保存でも、会社の秘密や顧客情報を外部serviceへ送れるかは別に確認します。

## 使いやすい3つの仕事

一つ目は、**UI mockからcomponent案を作ること**です。画像だけを渡すのではなく、使うdesign system、mobile対応、keyboard操作などの条件も文章で伝えます。画像に写っていないloading、error、empty stateも指定します。

二つ目は、**error画面の調査**です。screenshotと一緒に、発生時刻、environment、該当commit、関連logを渡します。Copilotには「画像で確認できる事実」「推測」「追加で必要な情報」を分けて答えさせます。

三つ目は、**設計PDFをtaskへ分けること**です。長いPDFを全部任せるのではなく、対象pageと質問を絞ります。重要な数値や条件は、必ず元のPDFと照らし合わせます。

どの仕事でも、Copilotの回答は正しいとは限りません。GitHub Docsも、利用者が出力を確認してtestする必要があると説明しています。

## 添付する前に確認すること

会社で試す前に、次を決めます。

- 公開情報、社内情報、機密情報、入力禁止情報の違い
- 個人名、顧客名、secret、内部URLを消す方法
- UI mock、障害調査など、最初に許可する用途
- Copilotの読み取りと生成codeを確認する担当者
- 誤って機密fileを送ったときの連絡先

screenshotでは、画面の本体だけでなく、通知、browser tab、address bar、background windowも確認します。PDFは必要なpageだけを使い、commentやmetadataが残っていないかも確認します。

画像やPDFは、文字で書くpromptと同じ入力データです。黒塗りする場合も、元の文字を選択できる状態や、図形を上に置いただけの状態では不十分なことがあります。安全な別fileへ書き出してから使います。

## まず小さく試す

最初は、公開済みの画面や架空のUI mockなど、失敗しても問題が小さいtaskを選びます。2〜4週間ほど試し、作業時間、読み間違い、修正回数、人のreview時間を記録します。

利用回数だけでは効果を測れません。画像を使ったことで要件確認が速くなったか、生成codeの手戻りが減ったか、逆に誤読の確認作業が増えたかを見ます。

VS Codeのagent modeでいきなりfileを変更させるより、最初はaskやplanで画像の読み取り結果を文章にし、人が確認してから実装へ進めると安全です。CLIで自動化する場合は、読み込めるdirectoryとfile形式を限定します。

## まとめ

GitHub Copilot visionは、画像とPDFをcodeの文脈へつなげる機能です。全プラン、VS Code、github.com、CLIへ広がり、Business / Enterpriseでも既定で使えるようになりました。

便利さと同時に、画像やPDFを入力データとして管理する必要があります。添付前のredaction、利用目的の限定、人による確認、誤添付時の連絡手順を決めてから、小さなtaskで試すのがよいでしょう。

## 出典

- [Copilot vision is generally available](https://github.blog/changelog/2026-07-01-copilot-vision-is-generally-available/) - GitHub Changelog, 2026-07-01
- [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide) - GitHub Docs, accessed 2026-07-02
- [Responsible use of GitHub Copilot Chat in GitHub](https://docs.github.com/en/copilot/responsible-use/chat-in-github) - GitHub Docs, accessed 2026-07-02
