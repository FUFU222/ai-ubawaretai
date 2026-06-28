---
article: 'openai-chatgpt-business-plugin-admin-controls-2026'
level: 'child'
---

OpenAIは2026年6月26日、ChatGPT Businessの管理者が、Workspace settingsのPlugins画面からCodexプラグインを管理できるようにした。管理者はプラグインを検索し、どの役割の人が自分で入れられるか、どの役割へ最初から入れておくかを決められる。

## プラグインには何が入っているのか

Codexのプラグインは、1つの追加ボタンだけではない。仕事の進め方を教えるskills、外部サービスへ接続するapps、会社ごとの設定でappを作るapp templatesなどをまとめたpackageである。

たとえば営業向けプラグインなら、商談準備の手順を持つskill、CRMから顧客情報を読むapp、社内専用の接続設定を作るtemplateが含まれる可能性がある。管理者は名前だけでなく、中に何が入っているかを確認する必要がある。

## AvailableとInstalledの違い

管理画面では、対象のroleごとにinstallation policyを設定する。

- `Available`: メンバーが必要なら自分でインストールできる
- `Installed`: そのroleのメンバーへ既定でインストールされる

全員が日常的に使う標準プラグインはInstalledに向く。一部の人だけが試すものや、専門業務だけで使うものはAvailableに向く。まだ安全性や必要性を確認していないものは、無理にどちらかへ入れず無効にする。

Installedにすれば、利用者ごとの初期設定の違いを減らせる。しかし、不要なプラグインまで全員へ配ると、画面が複雑になり、どれを業務で使ってよいか分かりにくくなる。最初は少数に絞るほうがよい。

## 権限は三つの場所で確認する

プラグインを配っても、新しいデータ権限が自動で付くわけではない。権限は三つに分かれる。

一つ目はpluginの権限で、誰が見つけ、インストールできるか。二つ目はappの権限で、誰が外部サービスへ接続し、読むだけか、書き込みもできるか。三つ目は接続先の権限で、CRM、repository、文書、channelなどで本人がどの情報を使えるかである。

営業向けpluginをInstalledにしても、CRM appが許可されていなければ顧客情報は読めない。CRM appが許可されていても、本人がCRM側で特定顧客にアクセスできなければ、その情報は使えない。管理者はpluginの設定だけでなく、appと接続先も確認する。

## 安全な導入手順

最初に、pluginが含むskills、required apps、optional apps、app templatesを確認する。required appが必要なら、管理者が設定を終えてからtest userに試してもらう。

次に、少人数のpilot groupへ配る。最初はデータを読むだけのactionから始め、作成、更新、送信のようなwrite actionは必要な場合だけ開く。顧客情報や機密文書を扱うappでは、legal、security、privacy、data residencyの確認も行う。

テストでは、簡単で低リスクなpromptを使う。正しいデータだけを読めるか、権限のないデータが見えないか、書き込み前に確認が出るかを見る。問題がなければ対象roleを少しずつ広げる。

## 更新と停止も忘れない

Marketplaceから入れたpluginは更新されることがある。更新時に新しいappやactionが増えれば、リスクも変わる。管理者は更新前後の違いを確認し、書き込みactionが追加された場合はもう一度承認する。

問題が起きたときは、pluginをdisableするだけでは足りない場合がある。pluginにskillsが残って画面に見え続けたり、接続先のtokenや同期設定が別に残ったりするためだ。plugin、app、接続先、token、syncの順に止める手順を準備する。

## まとめ

ChatGPT BusinessのPlugins管理画面では、管理者がCodexプラグインをrole別にAvailableまたはInstalledへ設定できる。これにより、個人が好きなものを入れる運用から、会社が必要なworkflowを標準配布する運用へ進める。

ただし、pluginの配布とデータ権限は同じではない。plugin、app、接続先の三層を確認し、少人数、read-only、低リスクなテストから始めることが重要である。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654) - OpenAI Help Center, 2026-06-26
- [Plugins in Codex](https://help.openai.com/en/articles/20001256-plugins-in-codex) - OpenAI Help Center
- [Build plugins – Codex](https://developers.openai.com/codex/plugins/build) - OpenAI Developers
