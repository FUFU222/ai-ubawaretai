---
title: 'Google Meet画面添付、AI議事録の共有統制実務'
description: 'Google MeetのAI議事録にvisual screenshotsが加わる。日本企業が提示資料の自動添付、録画条件、共有範囲、OU別設定をどう確認すべきか、管理者目線で整理する。'
pubDate: '2026-08-03'
category: 'news'
tags: ['Google Workspace', 'Google', 'Gemini', 'Google Meet', '管理者設定', 'AIガバナンス', '企業導入', '監査ログ']
series: 'google-workspace-ai-governance-2026'
draft: false
---

Google Workspace Updates は **2026年7月27日**、Google Meet の **Take notes for me** に visual screenshots を追加し、一般提供前から管理者が設定を事前構成できるようにすると発表した。対象は、会議中に提示されたスライド、図表、チャートのような視覚情報で、生成される会議メモの Google Doc に埋め込まれる。

これは、以前扱った [Google MeetのAI議事録既定オン](/blog/google-meet-take-notes-admin-default-2026/) の続きとして見るべき更新だ。7月16日の更新は「どの会議でAI議事録を始めるか」が中心だった。今回の visual screenshots は「会議中に見せた資料を、どこまで議事録に残すか」が中心になる。

日本企業では、会議資料に顧客名、価格表、障害状況、未公開ロードマップ、採用候補者情報、社内組織図、財務数値が載ることが多い。音声の要約だけなら問題にならなかった会議でも、画面が自動添付されると情報管理の意味が変わる。Google Workspace を全社基盤として使う組織は、便利な会議メモ機能としてではなく、Drive、Calendar、Vault、共有設定まで含む Workspace AI ガバナンスとして扱う必要がある。

## 事実: 提示資料がAI議事録に入る

今回の発表で確認できる事実は、Google Meet の Take notes for me が会議中の視覚情報を扱うようになることだ。Google は、会議の発話だけではスライド、図表、財務チャート、アーキテクチャ図の文脈が抜けるため、visual screenshots によって会議メモの理解を補うと説明している。

エンドユーザー機能の一般提供は Q3 2026 の段階的ロールアウト予定で、Google は詳細をあらためて Workspace Updates に出すとしている。一方、管理者設定は発表時点で利用可能とされている。つまり、利用者が画面添付を使い始める前に、管理者側で許可方針を決められる。

管理者は、提示コンテンツのスクリーンショットを常に許可するか、会議録画が有効な場合だけ許可するかを選べる。ドメイン全体、組織部門、グループ単位で構成できるため、全社一律ではなく、部門や利用目的ごとの段階展開が可能だ。

Google は、発表の中でプライバシー制御も説明している。提示者には、Gemini が会議メモ改善のためにスクリーンショットを含める可能性があることが通知される。会議中は、提示者やエンドユーザーが Meet の notes panel から visual screenshot capture を管理または無効化できる。取得された visual screenshots は Google Workspace の enterprise-grade data protections の対象とされている。

対象エディションは Business Standard / Plus、Enterprise Standard / Plus、Google AI Pro for Education だ。Workspace を契約していても全プランで同じように使えるわけではないため、まずライセンスとOUの対象範囲を照合する必要がある。

## 事実: Meet notesの保存と共有は別に効く

visual screenshots は独立した画像保存機能ではなく、Take notes for me の会議メモに組み込まれる。Google Meet Help は、Take notes for me が日本語を含む複数言語に対応し、会議メモを Google Docs に整理してチームへ共有できると説明している。会議後には主催者が recap へのリンクを受け取り、Calendar event からもノートへアクセスできる。

ここで重要なのは、スクリーンショット許可だけを決めても統制は終わらないことだ。生成されたノートは主催者の Google Drive 内の Google Meet フォルダに保存され、会議ごとのサブフォルダへ入る。共有設定によっては、招待者、社内招待者、host と co-host のみに分けられる。Calendar event に添付されることと、実際に文書へアクセスできることも別の問題として扱われる。

管理者向けヘルプでは、AI notes Docs は Meet retention policies に従うと案内されている。つまり、visual screenshots を許可するなら、Vault、Drive retention、共有ドライブ運用、外部共有、退職者アカウント処理も関係する。[Gemini appデータ地域対応](/blog/google-gemini-app-data-regions-workspace-2026/) で扱ったように、生成AIの統制では「機能をオンにするか」だけでなく、保存、処理、保持、共有の線を合わせる必要がある。

また、Google Meet Help は、Take notes for me が一度に1言語を前提とし、複数言語が同時に話される会議には現在対応していないと説明している。日本語会議では使いやすくても、日英混在の経営会議や海外拠点との技術レビューでは、ノート品質とスクリーンショット文脈の両方を確認したほうがよい。

## 分析: 録画と同じ会議分類で扱う

日本企業がまず決めるべきなのは、visual screenshots を録画と同じ扱いに寄せるか、AI議事録の一部として広く許可するかだ。Google の管理者設定には、常に許可する選択肢と、録画が有効な場合だけ許可する選択肢がある。この二択は実務上かなり大きい。

常に許可すれば、議事録の情報量は増える。営業提案、設計レビュー、障害対応、研修、社内説明会では、発言だけでなくスライドや図表が残ることで、会議後の確認が楽になる。特に、[Google Slides Gemini資料生成](/blog/google-slides-gemini-editable-decks-governance-2026/) のように Workspace 内で資料生成も進むと、会議、議事録、資料作成が同じ情報基盤の中でつながる。

一方で、画面情報は音声より機密を含みやすい。会議中に一瞬だけ見せた価格表、未公開のプロダクトロードマップ、障害ダッシュボード、顧客一覧、契約書の該当ページ、応募者の評価表が、意図せず議事録へ残る可能性がある。録画が有効な場合だけ許可する運用なら、すでに録画として残す覚悟がある会議に限定しやすい。

ここは「どちらが正しいか」ではない。会議分類に合わせるべきだ。全社会議、研修、営業定例、開発レビュー、採用、人事、法務、経営、セキュリティ、障害対応、顧客会議で、スクリーンショットを許可する条件を分ける。録画許可と同じ線にするか、AI議事録の共有設定と同じ線にするかを、部門単位で決める。

## 日本企業が先に確認すること

第一に、OUとグループ単位で対象者を分ける。管理者向けヘルプは、Visual content in notes を組織部門や設定グループに適用できると説明している。全社員に同じ値を配る前に、営業、CS、開発、経営企画、採用、人事、法務、教育の会議特性を見る。

第二に、共有設定を同じ日に確認する。visual screenshots を録画時だけに制限しても、AI notes の共有が全招待者に広いままだと、保存先と閲覧者の問題は残る。逆に、host と co-host のみに絞るなら、会議後の情報共有フローを別途用意する必要がある。

第三に、会議資料の作り方を見直す。画面添付を許可する会議では、提示資料に不要な個人情報や顧客名を出さない。障害対応では本番ログや秘密情報を直接見せず、共有用ビューやマスク済みダッシュボードを使う。これは、会議AIの問題というより、画面共有そのものの運用設計だ。

第四に、利用者向けの説明を短く出す。提示者には通知が出るとしても、現場が意味を理解していなければ止める判断はできない。「AI議事録がオンの会議では、提示資料の一部がノートに入ることがある」「止めたい場合はnotes panelで操作する」「機密会議では録画と同じ扱いで判断する」程度の説明を、管理者通知や会議テンプレートに入れるとよい。

第五に、Workspace AIの他機能と分けずに管理する。[Workspace Studio制御](/blog/google-workspace-studio-admin-controls-2026/) で扱ったように、Google Workspace のAI機能は、文書作成、会議、資料、業務自動化へ広がっている。Meetだけの設定変更で終わらせず、Drive共有、Gemini設定、Vault保持、監査ログ、研修資料をまとめて見るべきだ。

## まとめ

Google Meet の visual screenshots は、AI議事録を実務に近づける更新である。発話だけでは残らなかった資料文脈が、Google Docs の会議メモに入るようになれば、会議後の引き継ぎや意思決定の再確認は楽になる。

ただし、日本企業にとっての本題は、便利さではなく情報の残り方だ。会議で画面共有されたものは、口頭発言よりも構造化され、再利用されやすく、外部共有や二次資料化にも進みやすい。管理者は一般提供を待つのではなく、いまのうちに OU、グループ、録画条件、共有範囲、保持ポリシー、利用者説明を揃えるべきだ。

## 出典

- [Visual screenshots in Google Meet meeting notes will soon be generally available, pre-configure admin settings in advance](https://workspaceupdates.googleblog.com/2026/07/visual-screenshots-in-google-meet-meeting-notes-will-soon-be-generally-available-pre-configure-admin-settings-in-advance.html) - Google Workspace Updates, 2026-07-27
- [Let Google Meet AI take notes for my users](https://knowledge.workspace.google.com/admin/meet/let-google-meet-ai-take-notes-for-my-users) - Google Workspace Admin Help, last updated 2026-07-27 UTC
- ["Take notes for me" in Google Meet](https://support.google.com/meet/answer/14754931) - Google Meet Help
