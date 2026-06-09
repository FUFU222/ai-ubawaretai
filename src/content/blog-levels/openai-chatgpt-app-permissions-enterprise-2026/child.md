---
article: 'openai-chatgpt-app-permissions-enterprise-2026'
level: 'child'
---

OpenAI は 2026年6月8日、ChatGPT Enterprise / Edu 向けに **App permissions** を追加しました。これは、ChatGPT が Google Drive、Outlook、Slack、SharePoint などの接続アプリを使うとき、いつ人間に確認を求めるかを管理できる設定です。

大事なのは、これは「アプリをつなげる設定」ではないということです。アプリに誰がアクセスできるかは RBAC、アプリが何をできるかは Action control、ChatGPT がいつ確認を出すかは App permissions、というように役割が分かれています。

## 何ができるようになったのか

OpenAI の説明では、管理者は workspace 全体の default permission を設定できます。さらに、アプリごとに別の設定もできます。

選択肢には、Always ask、Any changes、Important actions などがあります。Important actions は既定の考え方で、ChatGPT がアプリから情報を読むことは自動で行いながら、外部に大きな影響が出る操作では確認を求めます。

たとえば、メールを送る、予定をキャンセルする、ファイルを移動する、共有権限を変える、購入や返金に関わる、機密情報をアプリへ渡す、といった操作は重要操作になりやすいです。

## なぜ会社で重要なのか

ChatGPT が社内アプリへつながると、便利になります。Google Drive の資料を探す、Slack の会話を要約する、Outlook の予定を確認する、といったことが会話の中でできるからです。

でも、読むだけと、変えることは違います。資料を読むだけなら大きな問題になりにくい場面でも、メールを送ったり、ファイルの共有設定を変えたりすると、相手や会社に影響が出ます。

以前の [ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) は、外部接続を抑える話でした。今回の App permissions は、外部アプリを使う前提で、どこで人間が確認するかを決める話です。

## どう設定すればよいか

最初は Important actions を基本にするのが分かりやすいです。読み取りまで毎回止めると、接続アプリの便利さがかなり下がります。一方で、重要な変更を確認なしに通すのは危険です。

高リスクなアプリでは、Any changes を選ぶことも考えられます。たとえば、顧客へメールを送れるアプリ、外部共有を変えられるアプリ、CRMやチケットを更新できるアプリでは、変更操作を広めに確認対象にしたほうが安全です。

また、不要な操作は App permissions ではなく Action control で無効にします。App permissions は、残した操作をいつ確認するかを決める設定です。危険な操作そのものを消したい場合は、Action control を見直します。

## Google Drive は特に注意する

OpenAI の Help Center では、Google Docs、Sheets、Slides の action が Google Drive action として統合されることも説明されています。Enterprise / Edu では、これらの新しい action は管理者が有効化するまで既定オフです。

Google Drive は日本企業で利用が多いので、最初の確認対象にするべきです。どの共有ドライブを同期するのか、どのフォルダを対象外にするのか、誰が書き込みできるのか、ファイル移動や共有変更を許すのかを決める必要があります。

[ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) や [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) と同じく、便利な機能ほど、あとから確認できる形にしておくことが大切です。

## まとめ

ChatGPT の App permissions は、接続アプリを広げるための安全装置です。日本企業では、誰がアプリを使えるか、アプリが何をできるか、ChatGPT がいつ承認を求めるかを分けて考える必要があります。

まずは Important actions を基本にし、重要な変更ができるアプリでは厳しめにする。Google Drive や Outlook のような業務アプリでは、読み取り、変更、共有、送信を別々に確認する。これが、ChatGPT を社内SaaSとつなぐときの最初の設計になります。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477) - OpenAI Help Center, 2026-06-08
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775) - OpenAI Help Center
- [Admin Controls, Security, and Compliance in apps](https://help.openai.com/en/articles/11509118) - OpenAI Help Center
