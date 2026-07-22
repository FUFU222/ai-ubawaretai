---
article: 'anthropic-agent-memory-header-2026'
level: 'child'
---

Anthropic は Claude Managed Agents の memory store API で、`agent-memory-2026-07-22` という beta header を使うようにしました。これは、Claude のエージェントがセッションをまたいで情報を覚えるための memory store に関係する変更です。

難しく見えますが、要点はシンプルです。Claude の agent memory を使っている開発チームは、SDK を更新し、memory の一覧取得方法を確認し、古い page cursor を使い回さないようにする必要があります。

## 何が変わるのか

対象は、memory store の中にある memory を一覧する API です。Anthropic の説明では、一覧の順番はサーバー側で安定した順番になり、`order_by` や `order` の指定は使われなくなります。

また、`depth` には `0`、`1`、または省略だけが使えます。それ以外の値を送るとエラーになります。`path_prefix` は `/notes/` のように最後を `/` で終える必要があります。部分一致ではなく、path の区切りごとに一致します。

もう1つ大事なのは page cursor です。古い header なしで取った cursor は、新しい header の挙動では使えません。移行するときは、途中ページから再開せず、最初から一覧を取り直す必要があります。

## SDKを上げれば終わりではない

Python、TypeScript、Go、Java、Ruby、PHP、C#、CLI の SDK は、新しい header を送るよう更新されています。普通に SDK を使っているだけなら、まず SDK のバージョンを上げることが大切です。

ただし、会社のシステムでは、API header を自分たちで明示していることがあります。共通の API client、proxy、CI script、runbook、curl のサンプル、社内 SDK wrapper などに古い `managed-agents-2026-04-01` が残っているかもしれません。

注意点は、全部を新しい header に置き換えればよいわけではないことです。Managed Agents の session API では、引き続き `managed-agents-2026-04-01` を使います。Memory store の request では `agent-memory-2026-07-22` を使います。API の種類によって分ける必要があります。

## なぜ日本企業に関係するのか

Claude Managed Agents の memory store は、エージェントが次のセッションでも使う情報を保存する場所です。たとえば、プロジェクトのルール、過去の失敗、よく使う資料形式、レビュー観点などを覚えさせられます。

これは便利ですが、会社では注意が必要です。memory に顧客情報、秘密情報、人事情報、古い判断、間違ったルールが入ると、次のエージェント作業にも影響します。AI が覚える情報は、ただのメモではなく、仕事の前提になります。

だから、memory store は監査の対象として扱うべきです。誰が作れるのか、誰の agent が読めるのか、書き込みできるのか、過去の version をどう確認するのか、不要な情報をどう消すのかを決める必要があります。

## 最初に確認すること

まず、使っている SDK と CLI のバージョンを確認します。次に、コードや設定ファイルの中で `managed-agents-2026-04-01` を検索します。memory store に対して古い header を明示している場所があれば修正します。

次に、memory list のテストを見直します。`path_prefix` の最後に `/` があるか、`depth` に変な値を入れていないか、`order_by` や `order` に頼っていないかを確認します。

最後に、移行後の初回だけ page cursor を捨て、最初のページから取り直します。大量の memory がある場合は、時間がかかる可能性があるため、バッチの再実行や途中失敗にも備えます。

## 覚えておきたいこと

今回の変更は、見た目は小さな API header 変更です。しかし、AI エージェントが長期的に情報を覚える仕組みに関わります。

日本企業が Claude Managed Agents を使うなら、SDK 更新だけでなく、memory に何を残してよいか、誰が読めるか、履歴をどう確認するかまで決めるべきです。AI が便利に覚えるほど、会社として説明できる管理が必要になります。

## 出典

- [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) - Anthropic Docs
- [Using agent memory](https://platform.claude.com/docs/en/managed-agents/memory) - Anthropic Docs
- [Beta headers](https://platform.claude.com/docs/en/api/beta-headers) - Anthropic Docs
