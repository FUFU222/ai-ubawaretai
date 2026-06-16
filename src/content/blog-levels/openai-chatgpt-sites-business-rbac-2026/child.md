---
article: 'openai-chatgpt-sites-business-rbac-2026'
level: 'child'
---

ChatGPT Sites は、Codex に頼んで社内向けのWebサイトや小さな業務アプリを作り、OpenAI 側の hosting に公開できる機能です。2026年6月16日時点の公式資料では、ChatGPT Business では Sites が既定オン、Enterprise/Edu では管理者が RBAC で有効化する前提になっています。

大事なのは、これは「AIがホームページを作ってくれる」だけの話ではないことです。プロジェクト申請フォーム、簡易ダッシュボード、社内FAQ、進捗管理ページのようなものを、Codex が作って hosted URL として出せるようになります。つまり、社内に小さな業務アプリが増えやすくなります。

## 何ができるのか

Sites では、Codex に `@Sites` と伝えて、作りたい内部アプリの目的、使う人、保存したいデータを説明します。たとえば、申請一覧を保存したいなら永続データが必要です。画像や書類を upload したいなら file storage が必要です。workspace user identity を使いたい場合も、最初から要件に入れる必要があります。

Codex は作ったものをすぐ公開するだけでなく、まず deploy 可能な version として保存できます。その後、確認してから本番 URL に deploy します。この「保存」と「公開」を分けることが重要です。AIが作ったものを、レビュー前に全社へ見せないためです。

## BusinessとEnterpriseで違う点

Business workspace では Sites が既定オンです。小さなチームでは便利ですが、管理者が気づかないうちに現場で社内アプリが増える可能性があります。まず Workspace settings > Permissions & Roles と Workspace settings > Sites を確認し、誰が使えて、どの site が存在するかを見てください。

Enterprise/Edu では、Sites は既定オフで、管理者や owner が RBAC で有効化します。こちらは最初に「作れる人」「公開できる人」「workspace 全体へ広げられる人」を分けやすい構造です。

## 先に決めること

最初に決めるのは公開範囲です。Sites には owner/admin だけ、workspace 全体、特定ユーザーや group というアクセス範囲があります。新しい site は、内容とデータを確認するまで owner/admin だけにしておくのが安全です。

次に、保存してよいデータを決めます。顧客名、個人情報、契約金額、未公開の価格表などは、便利だからといって最初から入れるべきではありません。必要になったら、削除方法、アクセス権、監査、バックアップまで業務システムと同じように考えます。

最後に、秘密情報を source に入れないことです。API key や token は hosted environment values で扱い、repository や `.openai/hosting.json` に置かないようにします。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [Sites - Codex](https://developers.openai.com/codex/sites) - OpenAI Developers
