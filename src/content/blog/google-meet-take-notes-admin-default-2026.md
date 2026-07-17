---
title: 'Google Meet AI議事録、3人会議既定オンの管理'
description: 'Google MeetのAI議事録「Take notes for me」設定変更を解説。日本企業が3人以上会議の既定オン、同意、共有範囲、9月21日までの管理者確認をどう進めるか整理する。'
pubDate: '2026-07-17'
category: 'news'
tags: ['Google Workspace', 'Google', 'Gemini', '管理者設定', 'AIガバナンス', '企業導入', '監査ログ']
series: 'google-workspace-ai-governance-2026'
draft: false
---

Google Workspace Updates は **2026年7月16日**、Google Meet の AI 議事録機能 **Take notes for me** に、管理者と利用者向けの新しい事前設定を追加すると発表した。これまで管理者は自動ノート取得を全会議で有効または無効にする形だったが、今後は **3人以上の会議だけ自動ノート取得を有効にする** 第三の選択肢を持てる。

Business Standard と Business Plus では、この新設定が既定でオンになる予定だ。一方、Enterprise Standard、Enterprise Plus、Frontline Plus、Google AI Pro for Education add-on では既定オフになる。Google は、どのプランでもエンドユーザー体験への影響は **2026年9月21日より前にはない** と説明している。つまり日本企業の Workspace 管理者には、夏のうちに管理者設定を確認し、必要なら既定値を変える猶予がある。

これは小さなMeet設定に見えるが、実務上はかなり重要だ。AI議事録は会議メモを自動化する一方で、発言、意思決定、顧客名、個人情報、採用・人事・法務・障害対応の話を Google Docs と Drive に残す機能でもある。[Workspace Studio制御](/blog/google-workspace-studio-admin-controls-2026/) で扱った業務自動化と同じく、便利さより先に「どの会議で、誰が、どこまで、誰に共有するか」を決める必要がある。

## 事実: 3人以上の会議だけ自動化できる

今回の更新で追加されるのは、AIノート取得を「すべての会議」ではなく「3人以上の会議」に限定して事前設定する選択肢である。Google は、ユーザーが最も価値のある会議でノート取得を忘れないようにするための変更だと説明している。

管理者設定は Rapid Release と Scheduled Release の両方でロールアウトが始まり、2026年8月3日までの完了が見込まれている。エンドユーザー側にも「3人以上のゲストがいる自分主催の会議で有効にする」設定が入るが、こちらは2026年9月21日より前には開始されない。

対象プランも明示されている。Business Standard と Business Plus では既定オン、Enterprise Standard、Enterprise Plus、Frontline Plus、Google AI Pro for Education add-on では既定オフである。Google は、Business系の管理者が設定を変えたい場合、9月21日より前に Admin console で変更するよう案内している。

Gemini Alpha program に参加して過去にこの設定を試した組織は、すでにオンになっている可能性がある。該当する管理者は、今回の正式ロールアウト前に現在値を確認すべきだ。

## 事実: 日本語会議にも関係する

Google Meet Help によると、Take notes for me は対象の Workspace edition または Google AI plan が必要で、日本語を含む複数言語で利用できる。ただし、同時に複数言語が話される会議には現在対応しておらず、一度に1言語が前提になる。

機能としては、会議メモを Google Docs に整理し、チームに共有できる。遅れて参加した人向けには Summary so far があり、主催者は会議後に recap へのリンクをメールで受け取れる。生成されたノート文書は主催者の Drive に保存され、Calendar event にも添付される。

共有設定も重要だ。ノートは全招待者、組織内の招待者、host と co-host のみに分けて共有できる。外部参加者やグループメールを含む会議では、この共有範囲を誤ると、意図しない人に議事録への導線が見える可能性がある。会議メモ自体は retention policy に従うため、Vault や Drive の保持設定とも切り離せない。

## 分析: 既定オンは生産性より統制の話になる

ここからは分析だ。

3人以上の会議は、実務では「議事録が必要になりやすい会議」とかなり重なる。営業定例、採用面談、プロジェクト進捗、障害振り返り、顧客定例、経営会議、法務相談、開発レビューなどだ。だからこそ、既定オンは便利である一方、会議種別ごとの情報感度を一気に表面化させる。

日本企業では、会議メモはしばしば曖昧な扱いになっている。録画や正式議事録はルールがあるが、AIが自動生成したメモは「補助資料」として軽く見られやすい。しかし実際には、発言、担当者、意思決定、次アクション、顧客課題、未公開施策が含まれる。AI議事録を全社で広げるなら、録画、文字起こし、議事録、要約、タスク化を同じ情報管理の枠で見る必要がある。

[Gemini appデータ地域対応](/blog/google-gemini-app-data-regions-workspace-2026/) で見たように、Workspace AI の導入はモデル性能だけではなく、データの所在、共有、管理者設定、監査の問題になる。Take notes for me も同じだ。会議内容がどこに保存され、誰がアクセスでき、どの保持期間に従い、外部参加者へどう見えるかを確認して初めて、本番展開の判断になる。

## 管理者が今見るべき設定

第一に、Business Standard / Plus の組織は既定オンを許容するかを決める。Google の初期値に任せるのではなく、自社の会議文化、情報分類、外部参加者の多さ、管理者の監査体制を踏まえて判断する。

第二に、Enterprise 系の組織は既定オフだから安全と考えない。利用者側の設定は9月21日以降に入る予定であり、管理者が明示的に許可すれば利用は広がる。部門ごとに pilot するのか、全社で段階展開するのかを決める必要がある。

第三に、同意表示と会議内通知を確認する。Help は、管理者が参加者に明示的な同意を求める設定を選べると説明している。日本の労務、人事、採用、顧客折衝、委託先会議では、AI議事録を開始する前の同意と、停止できる権限を明確にしておくべきだ。

第四に、共有範囲を標準化する。会議メモを全招待者へ送るのか、社内招待者だけにするのか、host と co-host に限定するのかでリスクは変わる。外部顧客や候補者が入る会議では、既定値を広くしすぎないほうがよい。

## まとめ

Google Meet の Take notes for me 設定変更は、3人以上の会議でAI議事録を使いやすくする更新である。同時に、AIが会議情報を自動的にDocs化し、DriveとCalendarに残す運用をどう統制するかという管理者向けの課題でもある。

日本企業は、2026年9月21日までを猶予期間として使い、Business系の既定オンをそのまま受け入れるか、Enterprise系でどの部門から有効化するかを決めたい。[Workspace Intelligence管理](/blog/google-workspace-intelligence-admin-controls-2026/) や [Gmail Gemini更新](/blog/google-gmail-gemini-custom-refine-2026/) と同じく、Workspace AI は「便利な個別機能」ではなく、情報共有と監査の設計として扱う段階に入っている。

## 出典

- [Google Workspace Updates](https://workspaceupdates.googleblog.com/) - Google Workspace Updates, 2026-07-16
- [Take notes for me in Google Meet](https://support.google.com/meet/answer/14754931) - Google Meet Help
