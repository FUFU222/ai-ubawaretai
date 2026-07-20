---
title: 'OpenAI Admin keys、Codex分析履歴の統制実務'
description: 'OpenAI Admin keysとCodex分析履歴の更新を整理。日本企業がGlobal Admin Consoleで管理API、Usage limits、費用監査をどう分けて運用すべきか解説する。'
pubDate: '2026-07-20'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'Codex', '管理者設定', '監査ログ', 'SaaSコスト管理', '企業導入']
series: 'openai-security-controls'
draft: false
---

OpenAI は **2026年7月16日** の ChatGPT Enterprise / Edu release notes で、Global Admin Console に **workspace-scoped Admin keys** と、最大120日分の credit / Codex analytics history を追加したと案内した。Admin keys は、ChatGPT と Codex の管理 API、group management、Spend Controls API、cost reporting、analytics などに使うための鍵であり、model inference には使えない。

これは地味な管理画面更新に見えるが、日本企業の ChatGPT / Codex 運用ではかなり重要だ。これまで [ChatGPT Usage limits](/blog/openai-chatgpt-usage-limits-enterprise-2026/) で月次 credit 上限を、[ChatGPT Library管理](/blog/openai-chatgpt-library-admin-controls-2026/) でファイルと外部アプリ承認を、[ChatGPTアプリ権限](/blog/openai-chatgpt-app-permissions-enterprise-2026/) で接続 SaaS の操作承認を扱ってきた。今回の更新は、その管理面を API key と analytics の実務へ寄せるものだ。

特に Codex は、個人の開発支援から、チームの software development work を任せる業務基盤へ近づいている。利用が増えるほど、「誰が高額に使ったか」だけでなく、「どの key がどの管理 API を叩けるか」「Codex の利用履歴を誰が見られるか」「Usage limits と Spend Controls の責任者が同じか」を説明する必要がある。

## 事実: Admin keysは推論キーではなく管理キー

OpenAI の release notes では、管理者が Global Admin Console の Credentials > Admin keys から workspace-scoped Admin keys を作成・管理できるようになったと説明されている。対象は supported ChatGPT and Codex administration APIs で、group management、Spend Controls API、cost reporting、analytics などに使える。

Global Admin Console の説明では、Credentials section は eligible admins が supported administration APIs 用の Admin keys を作成・管理する場所である。ChatGPT と Codex workspaces では、compliance log access、analytics and cost reporting、service accounts、Spend Controls API を通じた usage-limit automation、workspace group management をサポートし得る。作成時には expiration と permissions を設定し、status、last-used date、expiration、creator、permissions を確認でき、既存 key の edit / revoke もできる。

ここで最も重要なのは、Admin keys が **model inference へのアクセスを付与しない** と明記されている点だ。つまり、これは API Platform の推論用 key ではない。ChatGPT / Codex workspace を管理するための SaaS 運用キーであり、権限、監査、請求、利用上限、グループ操作に関わる。

日本企業では、ここを分けて説明する必要がある。開発者がアプリから OpenAI API を呼ぶ key と、情シスや開発基盤が ChatGPT / Codex workspace を管理する Admin key は、リスクが違う。前者は入力・出力データやモデル費用が主な論点になる。後者は、誰の利用制限を変えるか、どの analytics を見られるか、どの service account を動かすか、どの compliance log を取得できるかが論点になる。

## 事実: Codexとcreditの分析履歴は最大120日

今回のもう一つの更新は、Global Admin Console の analytics history である。OpenAI は、Global Admin Console が最大120日分の credit と Codex analytics history を含むようになったと説明している。Usage limits tab と Spend Controls は今回の Global Admin Console launch には含まれず、Usage limits は引き続き ChatGPT の Workspace settings で管理する。

Global Admin Console の Analytics では、adoption と usage を一箇所で確認できる。credit consumption、ChatGPT analytics、Codex analytics、leaderboards、active users、message activity などが対象になる。履歴期間は、ChatGPT & Codex credit analytics が最大120日、Codex usage analytics も最大120日、ChatGPT usage analytics は過去12カ月とされている。

さらに Codex section では、active users、credits used、tokens used、message runs、lines of code generated、plugin calls、skills used、code review activity などを確認できると説明されている。これは [Codex支出管理](/blog/openai-codex-business-spend-controls-2026/) で見た credits / spend controls の話を、実績確認の側から補強する更新である。

ただし、すべてが Global Admin Console に移ったわけではない。OpenAI は、Usage limits は ChatGPT の Workspace settings に残ると明記している。つまり、上限設定、Spend Controls、analytics、billing export、Workspace settings の詳細分析は、まだ複数画面にまたがる。管理者は「どの画面が正か」を運用表に残す必要がある。

## 分析: 日本企業はキーを用途で分けるべき

ここからは分析だ。

Admin keys の追加で便利になるのは、管理作業を API で自動化しやすくなることだ。たとえば、グループの同期、月次 usage report の取得、Codex 利用量の部署別集計、Spend Controls API を使った上限調整、compliance log の定期 export などを、手作業ではなく運用ジョブに寄せられる。

一方で、便利だからといって一つの Admin key に広い権限を持たせると危ない。推論 key ではなくても、workspace の管理情報を読めたり、利用制限を変えたり、グループ管理に関わったりする key は十分に高リスクである。CI/CD の secret に置く、担当者のローカルに保存する、複数用途のスクリプトで使い回す、といった運用は避けたい。

日本企業では、少なくとも用途別に key を分けるのが現実的だ。読み取り analytics 用、cost reporting 用、group management 用、Spend Controls automation 用、compliance log export 用を分ける。さらに、それぞれに owner、保管場所、rotation 周期、expiration、実行元 IP や実行環境、失効手順を持たせる。

特に Codex 利用量を見る key は、開発部門と情シスの両方が関わる。開発部門は生産性と利用状況を見たい。情シスや FinOps は費用と上限を見たい。セキュリティは compliance log と access を見たい。この三者が同じ全権 key を使うのではなく、目的別に読み取り範囲を分けたほうが監査で説明しやすい。

## 実務: Usage limitsとの責任分担を決める

今回の release notes は、Spend Controls と Usage limits が Global Admin Console へ完全統合されたとは言っていない。Usage limits は引き続き ChatGPT の Workspace settings に残る。ここを読み違えると、管理者の作業手順が混乱する。

実務では、次のように分けるとよい。Global Admin Console は、tenant、SSO、domain、external access、credentials、analytics、billing overview を見る入口にする。Workspace settings は、Usage limits、workspace-specific permissions、connected apps、plugins、Projects や Skills の細かな設定を見る入口にする。API automation は、Admin keys の権限に従い、どの操作を自動化するかを限定する。

たとえば月次レビューでは、Global Admin Console から Codex と ChatGPT の credit analytics を取得し、Workspace settings の Usage limits 設定と突き合わせる。上限超過や増枠申請が多い部署があれば、単に cap を上げるのではなく、対象業務、Codex の使い方、Work の利用、接続アプリ、承認フローを確認する。

また、Admin key の last-used date は月次で確認したい。使われていない key は失効候補である。逆に想定外の時間帯や想定外のジョブから使われている key は、漏えいやジョブ設定ミスの兆候になり得る。Status、expiration、creator、permissions を一覧化し、key 自体も SaaS アカウントと同じように棚卸しする。

## 日本企業での導入順序

最初の一週間でやるべきことは、現状の管理者ロールと Global Admin Console access を確認することだ。Global admin、workspace owner/admin、analytics viewer、member の違いを整理し、誰が Credentials と Analytics を見られるかを台帳化する。OpenAI の Global Admin Console では、global admin と workspace admin / owner は別の概念であるため、既存の ChatGPT 管理者がそのまま全体管理者とは限らない。

次に、Admin keys をすぐ大量発行しない。まず読み取り専用に近い analytics / cost reporting 用 key から始め、月次 report の自動取得を試す。その後、group management や Spend Controls automation のような変更系 API を段階的に検討する。変更系 key は、break-glass 手順、承認者、rollback 手順を用意してから発行するべきだ。

第三に、Codex analytics を開発 KPI と費用 KPI の両方へ接続する。lines of code generated や message runs だけを成果として扱うと、量だけが増える。code review activity、plugin calls、skills used、credit consumption、実際の PR cycle、障害対応時間、レビュー修正率と合わせて見る必要がある。

第四に、ユーザーへ説明する。Admin keys と analytics が増えると、管理者が利用状況をより見やすくなる。これは監視強化だけではなく、予算配分や必要なチームへの枠確保にも使う。利用者には、どの粒度の analytics を管理者が見るか、個人評価ではなく運用改善に使うこと、機密コードや顧客情報の扱いは別のポリシーで管理することを説明したい。

## まとめ

OpenAI の 2026年7月16日更新は、ChatGPT Enterprise / Edu の管理を一段 API 化するものだ。Global Admin Console で workspace-scoped Admin keys を作成でき、Codex と credit analytics を最大120日見られるようになったことで、ChatGPT / Codex はより明確に SaaS 運用と FinOps の対象になる。

日本企業が見るべき焦点は、「管理キーが作れるようになった」ことだけではない。推論 key と Admin key を分け、読み取りと変更を分け、Usage limits と Spend Controls と analytics の担当を分けられるかである。Codex や Work の利用が増えるほど、管理者は便利な画面を見るだけでなく、API key、分析履歴、月次レビュー、失効手順を同じ運用表へ載せる必要がある。

## 出典

- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-16
- [Global Admin Console](https://help.openai.com/en/articles/12289294-global-admin-console) - OpenAI Help Center
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
