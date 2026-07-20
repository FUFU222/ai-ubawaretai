---
title: 'ChatGPTデスクトップ統合、WorkとCodex導線の管理実務'
description: 'ChatGPTデスクトップ統合でWork、Codex、ChatGPT Classicが並ぶ。日本企業が端末配布、履歴分離、既存統制、利用者案内、ヘルプデスクFAQをどう整理すべきか実務目線で解説する。'
pubDate: '2026-07-21'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'ChatGPT Desktop', 'Codex', 'AIワークフロー', '企業導入', '管理者設定']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAI は 2026年7月16日の ChatGPT Enterprise / Edu release notes で、macOS と Windows の **ChatGPT desktop app experience updates** を案内した。新しいデスクトップアプリでは、Chat、Work、Codex の入口が整理され、ChatGPT と Codex を切り替え、ChatGPT 側では Chat と Work を選ぶ導線になる。OpenAI の移行 FAQ も更新され、Codex app 利用者、旧 ChatGPT desktop app 利用者、初回インストール利用者の移り方が分けて説明されている。

これは [ChatGPT agentからWorkへの移行](/blog/openai-chatgpt-agent-work-migration-2026/) や [Atlas終了とブラウザ作業の再配置](/blog/openai-atlas-retirement-browser-agent-migration-2026/) の続きとして読むべき更新である。違いは、今回の焦点が新機能の有無ではなく、日常的に利用者が開く desktop app の画面と説明責任にある点だ。[ChatGPTの統合検索とProject files](/blog/openai-chatgpt-unified-search-project-files-2026/) のように、ユーザー体験が便利になるほど、管理者は「どの履歴がどこにあり、どの統制が変わらないのか」を具体的に説明する必要が出てくる。

日本企業が見るべき焦点は、「新しいアプリを入れるか」だけではない。ChatGPT Classic が残る端末、Codex から更新される端末、Work がまだロールアウトされていないアカウント、Codex 履歴が ChatGPT 履歴と分かれる状態、そして既存の workspace controls や spend model が変わらない点を、利用者とヘルプデスクへ同じ言葉で伝えられるかである。

## 事実: Chat、Work、Codexが一つのdesktop appに並ぶ

OpenAI の release notes では、新しい ChatGPT desktop app が macOS と Windows で利用でき、Chat、Work、Codex を一つのアプリにまとめると説明されている。Chat は質問や会話、Work は調査・分析・文書や表計算などの完成物作成、Codex はソフトウェア開発やリポジトリ作業に向く。

移行 FAQ では、既存の Codex app 利用者は通常どおり更新すると新しい ChatGPT desktop app になり、Chat、Work、Codex を含む形になると案内されている。既存 Codex ユーザーの場合、更新後も Codex を開く導線や既存の Codex chats / projects は維持される。これは、開発者にとって「Codex が消える」のではなく、同じ desktop app の中で ChatGPT 側の業務面と並ぶ変更である。

旧 ChatGPT desktop app 利用者には、新しい app のダウンロード案内が出る。OpenAI は、旧アプリが ChatGPT Classic として併存する場合があると説明している。ChatGPT Classic は当面、既存の Enterprise capability や security patch などを受け続ける一方、新しい agent 系機能は新アプリ側に寄る可能性がある。

初回インストール利用者は、ChatGPT desktop app をダウンロードしてサインインする。つまり企業側では、同じ「ChatGPT desktop app」と呼ばれるものでも、端末の状態によって、Codex app から更新された新アプリ、旧 ChatGPT app と併存する新アプリ、初回導入の新アプリという三つの説明が必要になる。

## 事実: 履歴と同期範囲は単純に統合されない

今回の更新で誤解しやすいのは、アプリの入口がまとまったからといって、すべての履歴や作業面が一つに混ざるわけではない点である。

OpenAI の移行 FAQ では、Chat と Work の会話は Recents に一緒に表示され、sort、filter、pin ができる。既存の ChatGPT Projects も desktop app に表示され、Project context を使って Chat または Work を始められる。一方で、Codex は別 view として残り、Codex workflows と history は ChatGPT history とは分かれると説明されている。

Work についても、cloud Work chats は web、mobile、desktop で同期する。Web や mobile で始めた Work を desktop で続けたり、desktop で始めた cloud Work を他の surface で続けたりできる。ただし Codex は web や mobile で直接選ぶものではなく、対応する desktop Codex chats は mobile app の Remote tab からアクセスする形になる。

この違いは日本企業のヘルプデスクで重要になる。利用者から「昨日の Work がデスクトップにない」「Codex の履歴が ChatGPT の Recents に出ない」「Project は見えるが Work が使えない」と問い合わせが来たとき、単純に同期エラーと決めつけると原因を誤る。アカウントのロールアウト状況、利用 surface、cloud / local の違い、Codex view の分離を切り分ける必要がある。

## 事実: 既存の統制やspend modelは変わらない

OpenAI は今回の navigation update について、既存の workspace access permissions、security settings、governance controls、spend model を変更しないと説明している。これは安心材料だが、管理者の仕事が不要になるという意味ではない。

むしろ、UI が変わると利用者は「新しい機能が解禁された」「Classic と新アプリで権限が違う」「Codex が ChatGPT に吸収された」と受け取りやすい。管理者は、既存の workspace settings、apps / plugins、usage limits、Global Admin Console、Codex settings のどれが正の管理面なのかを、利用者向け FAQ に落とす必要がある。

特に Work と Codex は、触れるデータと作業の種類が違う。Work は調査、資料化、表計算、Sites のような業務成果物へ寄る。Codex はローカルファイル、repositories、terminals、developer tools と結びつく。アプリが一つになっても、利用ポリシーまで一つにまとめると雑になる。

[ChatGPT求人検索と履歴書支援](/blog/openai-chatgpt-job-search-resume-2026/) のような一般業務寄りの Work 利用と、Codex の開発作業は、同じ「ChatGPT」ブランドでも監査観点が違う。日本企業では、生成AI利用規程の中で、Chat、Work、Codex、Classic、browser / desktop 権限を分けて書いたほうが運用しやすい。

## 分析: 問題は導入手順より説明のずれで起きる

ここからは分析である。

今回の更新は、技術的には desktop app の導線整理に見える。しかし日本企業で事故が起きやすいのは、インストール手順そのものより、説明のずれである。

たとえば、開発者には「Codex app を更新すると ChatGPT app になる」と見える。営業や企画部門には「ChatGPT app に Work が出る」と見える。ヘルプデスクには「ChatGPT と ChatGPT Classic が両方ある」と見える。管理者には「既存の統制は変わらない」と見える。この四者が別々の言葉で話すと、問い合わせも承認も混乱する。

特に Windows と macOS の managed device では、ソフトウェア配布台帳が重要になる。旧 ChatGPT desktop app、ChatGPT Classic、新 ChatGPT desktop app、Codex app のどれが端末に存在するかを、MDM や EDR の inventory で確認できる状態にしておきたい。利用者の自己申告だけでは、Classic に残っているのか、新アプリへ移ったのか、Codex から更新されたのかが分からない。

もう一つの論点は、ロールアウト差である。FAQ は ChatGPT Work が eligible accounts に順次展開されると説明している。つまり同じ会社の同じ手順でも、ある利用者には Work が見え、別の利用者にはまだ見えないことがある。これは不具合ではなく rollout の可能性があるため、ヘルプデスクは「plan、workspace、role、region、app version、account eligibility」を見る流れにしたほうがよい。

## 実務: 端末配布、FAQ、権限棚卸しを分ける

日本企業での実務は三つに分けると進めやすい。

第一に、端末配布である。MDM やソフトウェア配布ツールで、新しい ChatGPT desktop app の対象者、旧 ChatGPT Classic の扱い、Codex app からの更新対象を決める。開発者にだけ Codex を使わせたいのか、Work を全社に広げるのか、Chat だけを許す部門があるのかを、アプリ名ではなく role と workspace policy で整理する。

第二に、FAQ と問い合わせ導線である。最低限、「ChatGPT と ChatGPT Classic が両方ある理由」「Codex はどこから開くか」「Work が見えないときに確認する項目」「Chat / Work / Codex の履歴がどこに出るか」「Project context はどこで使えるか」を書く。UI が変わる時期は、管理者向け手順より利用者向け短文 FAQ のほうが効果が出やすい。

第三に、権限棚卸しである。今回の更新自体は既存の統制を変えないが、アプリがまとまることで、利用者が Work や Codex を試す機会は増える。Workspace permissions、apps / plugins、Computer Use、browser use、Sites、Codex access、usage limits、Admin keys の担当を見直し、誰がどの面を承認するかを明確にする。

とくに、ChatGPT Classic を残す場合は期限を決めたい。Classic が支援されるからといって、社内ドキュメントをいつまでも二重化すると問い合わせが増える。新しい agent 機能を使う pilot group、Classic に残す例外、移行完了の判断基準を分けておくと、移行が長引いても管理しやすい。

## まとめ

ChatGPT desktop app の更新は、Chat、Work、Codex を一つの利用面へ寄せる変更である。同時に、ChatGPT Classic の併存、Codex view と history の分離、Work の段階的ロールアウト、既存統制は変わらないという条件も残る。

日本企業が今やるべきことは、新アプリを全員へ配ることだけではない。端末 inventory、利用者 FAQ、Work / Codex の役割分離、Classic の扱い、履歴と同期範囲の説明、既存 workspace controls の再確認を同じ移行計画に入れることだ。デスクトップの入口が便利になるほど、管理者は「何が統合され、何が分離されたままか」を丁寧に説明する必要がある。

## 出典

- [Moving to the new ChatGPT desktop app](https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center, 2026-07-16
- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) - OpenAI Help Center
