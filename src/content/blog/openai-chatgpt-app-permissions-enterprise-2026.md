---
title: 'ChatGPTアプリ権限、接続SaaS承認をどう設計するか'
description: 'ChatGPTアプリ権限の新設を整理。日本企業がGoogle DriveやOutlookなど接続アプリの読取、変更、重要操作をどう承認し、RBAC、Action control、監査ログとつなぐかを情シス向けに解説する。'
pubDate: '2026-06-09'
category: 'news'
tags: ['OpenAI', 'ChatGPT', '管理者設定', '監査ログ', '企業導入', 'セキュリティ']
series: 'openai-security-controls'
draft: false
---

OpenAI は ChatGPT Enterprise / Edu の 2026年6月8日 release notes で、**App permissions for connected apps** を追加した。これは、ChatGPT が接続アプリを使うときに、いつ利用者へ確認を求めるかを管理者が設定できるようにする更新である。

今回の変更は、新しいモデルや派手なUIではない。しかし日本企業にとっては重要だ。ChatGPT が Google Drive、Outlook、Slack、SharePoint、MCPベースの社内アプリへつながるほど、問題は「どのアプリを使えるか」だけでは足りなくなる。読み取りは自動でよいのか。書き込みは毎回承認させるのか。削除、送信、共有、決済のような重要操作はどこで止めるのか。この承認線を、ChatGPT 側の管理面で明示できるようになる。

この更新は、以前の [ChatGPTロックダウン全開放](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) と対になる。Lockdown Mode は外部接続を絞るための設定だった。今回の App permissions は、接続アプリを使う前提で「いつ確認するか」を制御する。さらに [ChatGPTセッション管理](/blog/openai-chatgpt-active-sessions-codex-2026/) や [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) と合わせると、OpenAI が企業向け ChatGPT を「便利なチャット」から、権限、承認、監査を持つ業務基盤へ寄せている流れが見える。

## 事実: App permissions で何が変わったか

OpenAI の release notes によると、Workspace admins は App permissions を使い、ChatGPT が connected apps を使う前にメンバーへ確認を求める条件を設定できる。管理者は workspace-wide default を設定でき、アプリごとに別の permission を選ぶこともできる。

選択肢として示されているのは、Always ask、Any changes、Important actions などである。OpenAI は Important actions を既定とし、ChatGPT がアプリから情報を読むことは自動で許しつつ、ChatGPT の外側へ意味のある影響を与える操作、機密情報を露出しうる操作、取り消しが難しい操作では確認を求めると説明している。

Apps in ChatGPT の Help Center 記事は、この設定をさらに具体化している。App permissions は、接続済みアプリに対して ChatGPT がいつ確認すべきかを決めるもので、アプリを接続する機能そのものではない。つまり、App permissions を変更しても、アプリが新しいデータへアクセスできるようになるわけではない。アクセス範囲は、アプリ自体、接続時に許可した権限、workspace controls によって決まる。

ここは実務上かなり重要だ。App permissions は「何にアクセスできるか」ではなく、「アクセスや操作を実行する前に誰へ確認するか」の設定である。日本企業の管理者は、これを RBAC や Action control と混同しないほうがよい。

## 事実: RBAC、Action control、App permissions の役割は違う

OpenAI の Admin Controls, Security, and Compliance in apps 記事では、3つの管理線が分けて説明されている。

まず RBAC は、誰がそのアプリを使えるかを管理する。Enterprise / Edu では、アプリをカスタムロールへ割り当てられる。ユーザーが「Disabled by admin」と表示される場合、そのアプリは workspace または role 設定により利用できない。

次に Action control は、アプリが何をできるかを管理する。管理者は、すべての action を許す、read actions だけ許す、custom set を選ぶ、といった形で、アプリの実行可能な操作を絞れる。新しい action が追加されたときの扱いも、Enable all new actions、Only enable new read actions、Disable new actions のように選べる。

そして App permissions は、許可された action を ChatGPT が使う際、いつメンバーへ承認を求めるかを管理する。たとえば、RBAC で営業部門だけに CRM アプリを許可し、Action control で読み取りと下書き作成だけを許し、App permissions で送信や共有に近い操作は確認させる、という組み合わせになる。

この分担は、[OpenAIのOffline検索](/blog/openai-offline-web-search-chatgpt-workspaces-2026/) で見た検索境界とも似ている。外部情報や社内データを使うAI機能では、使える人、使えるデータ、実行できる操作、承認のタイミングを分けて設計しないと、便利さと統制が混ざってしまう。

## 分析: 日本企業では「読む」と「変える」を分ける

ここからは分析だ。

日本企業が今回の更新で最初に決めるべきことは、接続アプリを「読ませる」ことと「変えさせる」ことを分ける基準である。ChatGPT が Google Drive の資料を探して要約する、SharePoint の社内文書を参照する、Slack の過去スレッドを確認する、という読み取り用途は、生産性を上げやすい。一方で、メール送信、予定作成、ファイル移動、共有権限変更、CRM更新、チケットのステータス変更は、会社の外側や他者の業務へ直接影響する。

OpenAI の Important actions の例には、メールやメッセージ送信、予約や予定の取り消し、購入や返金、ファイルのアップロードや移動、共有権限やセキュリティ設定の変更、機密情報の共有が含まれる。これは日本企業の承認設計でも、そのまま高リスク操作の候補になる。

たとえば、営業担当が ChatGPT に「この商談メモからお礼メールを作って」と頼む場面と、「この内容で顧客へ送って」と頼む場面は違う。前者は下書きであり、後者は外部コミュニケーションである。法務担当が契約書の論点を要約させる場面と、共有ドライブ上のファイル権限を変える場面も違う。App permissions は、この差をプロダクト設定として扱うための道具になる。

日本企業では、まず workspace default を Important actions に置き、部門やアプリごとに Any changes へ厳しくするのが現実的だろう。高リスク部署、個人情報を扱う部署、外部顧客へ直接連絡する部署、金融・医療・公共のような説明責任が重い部署では、読み取り以外の変更を広めに承認対象にしたほうがよい。

## 分析: Google Drive 統合は特に確認が必要

今回の Help Center 記事では、Google Drive まわりの説明も重要だ。OpenAI は、Google Docs、Sheets、Slides actions が Google Drive actions として統合され、ChatGPT app directory では独立した Docs、Sheets、Slides アプリではなく Google Drive アプリへ寄ると説明している。Enterprise / Edu では、これらの新しい unified Google Drive actions は、管理者が有効化するまで既定オフである。

この変更は、App permissions と組み合わせて見るべきだ。Google Drive は、読み取りだけなら社内検索や資料要約に効く。一方で、Docs や Sheets の作成、更新、ファイル移動、名前変更、共有変更まで含むと、情報管理の責任が一段重くなる。Google Workspace 管理者の scope authorization も絡むため、ChatGPT 側の設定だけで完結しない。

特に日本企業では、部門共有ドライブ、プロジェクト別フォルダ、取引先別フォルダ、個人ドライブが混在していることが多い。ChatGPT に Drive を接続するときは、同期対象、共有ドライブの範囲、除外するファイル種別、Quick setup か Admin-controlled access かを先に決める必要がある。App permissions はその後に、読み取り、変更、重要操作の承認をどう出すかを決めるレイヤーである。

ここを曖昧にすると、現場から見ると「Google Drive をつないだのに何ができるのか分からない」、管理者から見ると「どの操作が人間承認されるのか分からない」という状態になる。App permissions の導入は、Drive 統合の棚卸しをするよいタイミングでもある。

## 実務: 管理者が今決めるべき5点

一つ目は、workspace default をどこに置くかである。迷うなら Important actions を出発点にする。読み取りを止めすぎると接続アプリの価値が落ちるが、重要操作を無確認で通すのは危険である。

二つ目は、アプリごとの例外である。Google Drive、Outlook、Slack、SharePoint、CRM、チケット管理、独自MCPアプリは同じリスクではない。メール送信や外部共有を持つアプリは Any changes に寄せる。読み取り専用の社内ナレッジアプリは Important actions でもよい。Never ask は、少なくとも初期導入では避けるべきだ。

三つ目は、Action control との整合である。App permissions は、許可済み action の承認タイミングを決めるだけで、危険な action 自体を消す設定ではない。不要な書き込み action は Action control 側で無効化する。そのうえで、残した action に対して App permissions を設定する。

四つ目は、承認カードを見た利用者の教育である。OpenAI は、操作前に app と proposed action の情報を含む approval card を表示すると説明している。ユーザーが内容を読まずに許可すれば、承認フローは形だけになる。社内教育では、アプリ名、操作対象、共有先、変更内容を見てから許可することを明文化したい。

五つ目は、監査ログの確認である。Apps in ChatGPT の説明では、app calls は OpenAI Compliance Logs platform の一部として記録される。日本企業で本番利用するなら、誰がどのアプリを使い、どの操作が承認され、どこでブロックされたかを月次で確認する。これは [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) で見た `skill_id` 監査と同じく、便利機能を業務標準へ入れるときの前提になる。

## まとめ

ChatGPT の App permissions は、接続アプリを安全に広げるための地味だが重要な更新である。日本企業が見るべきポイントは、ChatGPT がアプリを使えるようになったことではない。読み取り、変更、重要操作を分け、RBAC、Action control、App permissions、Compliance Logs を組み合わせて説明できるかである。

接続アプリの価値は、社内文脈を ChatGPT に渡し、作業を会話の中で進められる点にある。しかし、その価値は外部送信、誤操作、過剰共有、権限逸脱と隣り合わせでもある。今回の更新は、ChatGPT を業務SaaSの操作面へ入れるなら、承認線を先に設計せよという合図として読むべきだ。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477) - OpenAI Help Center, 2026-06-08
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775) - OpenAI Help Center
- [Admin Controls, Security, and Compliance in apps](https://help.openai.com/en/articles/11509118) - OpenAI Help Center
