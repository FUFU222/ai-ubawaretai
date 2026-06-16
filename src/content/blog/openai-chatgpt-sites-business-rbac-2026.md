---
title: 'ChatGPT Sites運用、Business既定オンの統制'
description: 'ChatGPT SitesはBusinessで既定オン、Enterprise/EduでRBAC管理の対象になった。日本企業が内製業務アプリ公開前に決めるべき権限、保存、秘密情報、費用を整理する。'
pubDate: '2026-06-16'
category: 'news'
tags: ['OpenAI', 'Codex', 'AIエージェント', '企業導入', '管理者設定', '開発者ツール']
draft: false
series: 'openai-codex-enterprise-2026'
---

OpenAI の公式 release notes と Codex Sites developer guide は、2026年6月16日時点で ChatGPT Sites の実務条件をかなり具体化している。Business workspace では Sites が既定オンで、Enterprise/Edu では workspace settings と RBAC による有効化が前提になる。これは単なる「Codex がWebサイトを作れる」機能ではない。社内向けの軽量な業務アプリを、Codex から作成、保存、公開、アクセス制御するための小さなデプロイ面である。

この更新は、既に扱った [OpenAI Codex役割別プラグイン](/blog/openai-codex-role-plugins-sites-workflows-2026/) の続きとして読むと分かりやすい。前回の主題は、Codex が role-specific plugins と Sites preview で業務AIへ広がる流れだった。今回の焦点は、その Sites を日本企業がどう有効化し、誰に公開し、どのデータを保存し、どこで止めるかである。[ChatGPT BusinessのCodex seat設計](/blog/openai-chatgpt-business-codex-seats-2026/) や [Codex spend controls](/blog/openai-codex-business-spend-controls-2026/) と同じく、機能より先に管理面を決める必要がある。

## 事実: Businessは既定オン、Enterprise/EduはRBACが入口

OpenAI の ChatGPT Business release notes では、ChatGPT Sites が Codex access を持つ Business workspace 向け preview として利用可能になり、Business では既定オンであると説明されている。管理者と owner は Workspace settings > Permissions & Roles から有効化やアクセスを管理でき、作成済みサイトは Workspace settings > Sites から無効化できる。

Enterprise/Edu release notes では、Sites は eligible Enterprise/Edu workspaces 向け preview として説明される。こちらは既定オフで、admins と owners が workspace settings と RBAC で有効化とアクセスを管理する。つまり同じ Sites でも、Business では現場が先に触りやすく、Enterprise/Edu では管理者がロール単位で開ける設計になっている。

この差は日本企業にとって重要だ。Business を使う小規模チームでは、気づかないうちに社内ツールの試作と公開が始まる可能性がある。Enterprise/Edu では、最初から役割、部署、利用者グループごとに許可範囲を設計できる。どちらの場合も、「Codex を使える人」と「Sites で公開できる人」を同じにしてよいかは別問題である。

## 事実: Sitesは保存版と本番公開を分ける

Codex Sites developer guide は、Sites を「Codex から hosted site を作成、保存、公開、検査する plugin」と位置付けている。対象は website、web app、game で、OpenAI がホストする。新規 project を Codex に作らせるだけでなく、既存 project が Sites に対応できるかを確認し、deploy する流れも想定されている。

実務上のポイントは、Sites publishing が二段階であることだ。まず保存版を作り、次にその version を deploy する。保存版はレビュー可能な候補であり、deploy は選んだ audience に production URL を見せる行為になる。ここを分けないと、AI が作った内部ツールがレビュー前に「本番URL」として共有される。

日本企業では、この二段階を社内ルールに落とす必要がある。たとえば、Codex にプロジェクト申請ダッシュボード、営業資料生成フォーム、FAQ管理ページ、研修進捗ビューを作らせることはできる。しかし保存版の確認、build 結果、ソース差分、データ保存先、公開範囲を確認しないまま workspace 全体へ広げると、便利な試作がそのまま管理外の業務システムになる。

## 事実: データ保存とアクセス範囲も設計対象になる

Sites は単なる静的ページ公開ではない。developer guide は、保存レコードや進捗、スコアのような structured data には D1、画像や文書、音声、動画などの upload には R2、検索可能な file metadata には D1 と R2 の組み合わせを使う考え方を示している。内部サイトで workspace user identity が必要な場合も、プロンプト時点でその要件を伝える前提だ。

アクセス範囲も明示されている。owner と admins だけ、workspace 全体、特定ユーザーや workspace groups という three modes を Sites に適用できる。新規 site は、内容、データの扱い、想定 audience をレビューするまで owner と workspace admins に限定しておくのが自然だ。

秘密情報の扱いも分けるべきだ。Sites の hosted environment values と secrets は Sites panel から管理し、`.openai/hosting.json` には secret values を置かない。ローカル開発用の `.env` と `.env.example` を揃えつつ、実値は hosted environment 側で扱う。これは日本の開発チームが普段の CI/CD で守っている作法と同じで、AI が作った小規模アプリだから緩めてよい話ではない。

## 分析: 日本企業では「小口業務アプリ公開面」として統制する

ここからは分析だ。

ChatGPT Sites の本質は、非エンジニアでも社内向けの小さな web app を作りやすくすることではなく、Codex が作った成果物を hosted deployment として業務に乗せられる点にある。これは開発生産性の話であると同時に、情シス、セキュリティ、法務、業務部門の責任分界の話でもある。

特に Business workspace では既定オンという前提が重い。小規模な日本企業や部門単位の契約では、現場の管理者が Sites の意味を理解しないまま使い始める可能性がある。最初は便利な社内フォームでも、顧客名、案件金額、個人情報、未公開の製品計画、契約条件を扱えば、すぐに情報管理の対象になる。

Enterprise/Edu では RBAC を入口にできるため、最初から「誰が作れるか」「誰が deploy できるか」「誰が workspace 全体に広げられるか」を分けるべきだ。これは [ChatGPT Google連携のOAuth承認](/blog/openai-google-app-oauth-scopes-2026/) と同じ構図である。便利な接続や公開面ほど、利用者の意思だけでなく、管理者側の承認、scope、RBAC、監査の線が必要になる。

もう一つの論点は費用だ。Sites そのものの詳細な課金だけでなく、Codex で作成、反復、修正、検証する過程は plan credits や workspace usage の管理対象になる。Business で現場が大量に internal tool を試作すると、開発チーム以外の利用が Codex 消費を押し上げる。したがって Sites の enablement は、[Codex spend controls](/blog/openai-codex-business-spend-controls-2026/) と一緒に見るべきである。

## 導入前に決めるチェックリスト

第一に、Sites を使える role と deploy できる role を分ける。作成は広めに許しても、workspace 全体への公開は owner、管理者、業務責任者の承認を条件にする。Business では既定オンを前提に、最初の週で利用実態を確認する。

第二に、保存版レビューを必須にする。Codex に「deployして」と頼む前に、保存版、build result、source changes、database migrations、runtime secrets、公開 audience を確認する。軽量アプリでも、公開URLは本番扱いにする。

第三に、扱ってよいデータを決める。最初は個人情報、契約情報、決済情報、顧客別価格、未公開人事情報を Sites へ入れない。必要になった場合は、D1/R2相当の保存、削除、バックアップ、アクセス権、監査ログの扱いを業務システムと同じ粒度で見る。

第四に、秘密情報を source に置かない。API key、Webhook token、OAuth secret、社内URLは Sites panel の hosted environment values で扱い、`.openai/hosting.json` や repository に含めない。

第五に、廃止手順を先に決める。作った人が退職した、部署がなくなった、データ分類が変わった、外部共有してはいけない内容が入った、という時に Workspace settings > Sites から誰が止めるかを明確にする。

## まとめ

ChatGPT Sites は、Codex が作った内部向けアプリを hosted URL として扱えるようにする更新である。Business では既定オン、Enterprise/Edu では RBAC 有効化という違いがあり、導入設計は plan ごとに変わる。保存版と本番 deploy の分離、workspace/admin/custom のアクセス範囲、D1/R2相当の保存、secrets 管理まで含めて見れば、これは小さな社内開発基盤である。

日本企業が最初にやるべきことは、Sites を全面禁止することでも、無条件に開放することでもない。作成、レビュー、公開、保存、停止の責任を分け、Codex の利用枠と一緒に管理することだ。社内ツールを作る速度が上がるほど、公開前の確認と公開後の停止線が導入品質を決める。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [Sites - Codex](https://developers.openai.com/codex/sites) - OpenAI Developers
