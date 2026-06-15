---
article: 'openai-google-app-oauth-scopes-2026'
level: 'child'
---

ChatGPT と Google の連携で、2026年6月15日から大事な変更があります。OpenAI は、ChatGPT で Google Drive files、BigQuery、Google Meet まわりの新しい actions を追加すると説明しています。

これは「ChatGPT がもっと便利になる」という話でもありますが、会社で使うときは注意が必要です。Google Workspace 側で必要な OAuth scope を許可していないと、ChatGPT 側で機能を有効にしても、ユーザーが接続エラーや管理者承認エラーを見ることがあります。

## 何が変わるのか

ChatGPT は Google アプリとつながると、Gmail、Calendar、Drive などの情報を参照したり、設定によっては作成や更新のような action を使ったりできます。今回の更新では、Google Drive files、BigQuery、Google Meet 関連の action が増えます。

たとえば、Drive は文書や表、スライドに関係します。BigQuery は会社の分析データに関係します。Meet は会議の記録や transcript に関係します。どれも便利ですが、会社の大事な情報が入っている場所でもあります。

以前の [ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) では、ChatGPT がアプリを使う前にいつ確認を出すかを整理しました。今回の話は、それより前にある Google 側の許可です。ChatGPT で使う action と、Google Workspace で許可する scope を合わせないと、うまく動きません。

## 2つの管理画面を合わせる

ここで大事なのは、管理者が1人だけで決められないことです。

ChatGPT 側の管理者は、どの Google app actions を workspace で有効にするかを見ます。Google Workspace 管理者は、ChatGPT/OpenAI app にどの Google OAuth scope を許可するかを見ます。

この2つがずれていると、ユーザーから見ると分かりにくいエラーになります。ChatGPT では使えるように見えるのに、Google 側で scope が止まっている。あるいは、Google 側では広く許可しているのに、ChatGPT 側で不要な action まで有効になっている。どちらも避けたい状態です。

## Drive、BigQuery、Meet は同じではない

Drive は、社内文書や顧客資料に関係します。読み取りだけなら資料検索や要約に使いやすいですが、ファイルの作成、更新、移動、共有変更まで許すと、情報管理の責任が大きくなります。

BigQuery は、売上、顧客行動、ログ、広告、分析データなどに関係しやすいです。読み取りだけでも慎重に扱うべき場合があります。書き込みやデータ投入に関係する scope は、さらに注意が必要です。

Meet は、会議記録に関係します。会議には、人事、営業、法務、障害対応、採用などの話が入ることがあります。ChatGPT が transcript や録画に触れるなら、会議の種類ごとにルールを決めたほうがよいです。

## 会社で最初に確認すること

まず、ChatGPT で有効にしている Google actions を一覧にします。次に、Google Workspace の管理画面で、ChatGPT/OpenAI app がどの scope を要求し、どれが許可されているかを見ます。

そのうえで、使う action だけを許可します。使わない action は ChatGPT 側で無効にします。Google 側で許可したくない scope があるなら、その scope を必要とする ChatGPT action も無効にします。

[ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) で見たように、接続アプリの情報は Memory や personalization とも関係します。便利にするほど、ChatGPT がどの文脈を使うのかを説明できるようにしておく必要があります。

## まとめ

今回の Google app actions 追加は、ChatGPT を仕事の中心に近づける更新です。ただし、会社で使うなら、ChatGPT 側の action 設定と Google Workspace 側の OAuth scope 承認をセットで確認する必要があります。

日本企業では、Drive、BigQuery、Meet を同じ「Google連携」としてまとめず、データの種類ごとに許可範囲を変えるのが安全です。便利さより先に、どの管理者が何を承認するのかを決めることが大切です。

## 出典

- [Google App for ChatGPT - Data Controls FAQ](https://help.openai.com/en/articles/10408842-google-app-for-chatgpt-data-controls-faq) - OpenAI Help Center
- [Control which apps access Google Workspace data](https://knowledge.workspace.google.com/admin/apps/control-which-apps-access-google-workspace-data) - Google Workspace Help
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775) - OpenAI Help Center
