---
article: 'openai-atlas-retirement-browser-agent-migration-2026'
level: 'child'
---

OpenAI は、AI ブラウザの Atlas を 2026年8月9日に止める予定だと案内しました。Atlas で行っていたブラウザを使う AI 作業は、これから ChatGPT、Codex、新しい ChatGPT desktop app、Chrome extension や sidebar のような形へ移っていきます。

これは「ブラウザアプリが一つ減る」というだけではありません。会社で Atlas を試していた人がいるなら、8月9日までにブックマーク、開いているタブ、閲覧履歴、Cookie、社内マニュアルを確認する必要があります。

## 何が変わるのか

Atlas は 2026年8月9日に停止予定です。OpenAI の説明では、その後は Atlas を開いたり、Atlas でページを見たり、Atlas 上でブラウザ型の AI 作業を続けたりできなくなる可能性があります。

一方で、OpenAI はブラウザを使う AI 作業そのものをやめるわけではありません。新しい ChatGPT desktop app では、Chat、Work、Codex がまとまり、ブラウザを使った作業も ChatGPT 側へ寄っていきます。Chrome を使う人には、ChatGPT Chrome extension や sidebar も移行先になります。

つまり、会社としては「Atlas を使い続けるか」ではなく、「どの環境で AI にブラウザ作業をさせるか」を決める段階に入ります。

## 保存しておくべきもの

OpenAI の FAQ では、Atlas のブックマークは自動では移らないとされています。必要なブックマークは、8月9日までに HTML ファイルとして書き出し、Chrome など別のブラウザへ入れる必要があります。

開いているタブも自動では移らない可能性があります。大事なページはブックマークするか、URL をメモに残します。閲覧履歴も自動では移らないため、あとで見たいページがあるなら早めに保存します。

Cookie や session file は特に注意が必要です。Cookie にはログイン状態やアクセス権に近い情報が含まれることがあります。会社のヘルプデスクにそのまま送ったり、チケットに添付したりするのは危険です。基本は、移行先のブラウザや ChatGPT desktop app で本人が再ログインする運用にしたほうが安全です。

## 会社で確認すること

まず、Atlas を使っている人がいるかを確認します。正式導入していなくても、開発者や企画担当が個人で試していることがあります。MDM や端末管理で分かる範囲を見て、必要なら利用者に短い確認を送ります。

次に、Atlas で何にログインしていたかを確認します。社内ポータル、CRM、採用管理、経費精算、クラウド管理画面などにログインしていたなら、単にアプリを消すだけではなく、Cookie や保存データの扱いも考える必要があります。

最後に、社内の説明を更新します。生成AI利用ガイド、ブラウザ標準、ChatGPT の使い方、Codex の使い方に Atlas が残っていたら直します。利用者には「Atlas は 8月9日に止まる」「ブックマークと大事な URL は自分で保存する」「Cookie は人に送らない」「ChatGPT の会話履歴とは別」という4点を伝えると分かりやすいです。

## どう移行するか

ふつうの Web 閲覧は、会社標準の Chrome や Edge に戻します。ChatGPT と一緒にページを見ながら作業したい場合は、会社が許可した ChatGPT Chrome extension や sidebar を使います。

長い調査、資料作成、開発検証のように AI に作業を任せる場合は、新しい ChatGPT desktop app や Codex の管理された環境に寄せます。ただし、ローカルファイル、社内 SaaS、開発環境へ触れる可能性があるので、誰に許可するかを先に決めることが大切です。

## まとめ

Atlas 終了で大事なのは、代わりのアプリを急いで入れることではありません。まず、使っていた人、保存されていたデータ、ログインしていたサービス、社内手順を確認することです。

8月9日までに、ブックマーク、開いているタブ、必要な履歴を保存します。Cookie や session file は機密情報として扱います。そのうえで、ChatGPT desktop app、Codex、Chrome extension をどの範囲で使わせるかを決めるのが現実的です。

## 出典

- [ChatGPT - Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center
- [Evolving Atlas into ChatGPT for browser-based agentic work](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work) - OpenAI Help Center
- [ChatGPT MacOS app release notes](https://help.openai.com/en/articles/9703738-chatgpt-macos-app-release-notes) - OpenAI Help Center
