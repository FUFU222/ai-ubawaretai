---
title: 'ChatGPT Skills既定オン、Enterprise管理者の期限前点検'
description: 'ChatGPT SkillsのEnterprise既定オン予定を整理。日本企業が7月23日前にopt-out、権限、アップロード、監査ログをどう点検し、部門展開を安全に始めるべきか解説する。'
pubDate: '2026-07-21'
category: 'news'
tags: ['OpenAI', 'ChatGPT', '管理者設定', '監査ログ', '企業導入', 'セキュリティ']
series: 'openai-security-controls'
draft: false
---

OpenAI Help Center は、ChatGPT Enterprise の Skills について、**2026年7月23日から、opt out していない Enterprise workspace で既定オンにする予定**を示している。Skills は、ChatGPT に特定業務を一貫して進めさせるための再利用可能なワークフローで、instructions、examples、supporting resources、code を含められる。

これは新しいモデル発表ではない。しかし日本企業にとっては、かなり実務的な変更だ。5月の [OpenAI Skills統制](/blog/openai-chatgpt-skills-governance-compliance-2026/) では、admin Skills page、権限、アップロード検査、Compliance Logs 対応を扱った。今回の焦点は、その管理面を確認しないまま、Enterprise workspace で Skills が使われ始める可能性が出てきたことにある。

Skills は便利なプロンプト集ではない。業務手順、判断基準、テンプレート、補助ファイル、場合によってはコードを ChatGPT に渡す部品である。日本企業が見るべきなのは「作れるようになった」ではなく、誰が作り、誰が公開し、誰が他メンバーへ入れ、どの会話で使われたかを説明できるかである。

## 事実: 7月23日から何が変わるのか

OpenAI の Skills in ChatGPT 記事は、Enterprise / Edu の admin controls を説明している。現時点で Skills は ChatGPT Enterprise と Edu では既定オフだが、管理者は対象 role に対していつでも有効化できる。さらに、OpenAI は 2026年7月23日から、opt out していない Enterprise workspaces で Skills を既定オンにする予定だと説明している。

同じ記事では、管理者が設定できる権限も示されている。利用と作成を許す `Enable skills`、端末から skill file をアップロードできる `Enable skill uploading`、workspace 内で共有できる `Share skills`、workspace library へ公開できる `Publish skills to workspace`、他メンバーへ install して自動利用させられる `Enable skills installing` である。

重要なのは、これらの権限が同じリスクではない点だ。個人が自分用の Skill を使うことと、workspace 全体へ公開すること、さらに他メンバーへ install することは影響範囲が違う。既定オン化の前に、少なくとも upload、publish、install の3つは分けて確認する必要がある。

## 事実: admin Skills page と監査ログ

OpenAI は admin Skills page も説明している。管理者は workspace 内の Skills について、owner、access、users、直近30日の invocations、作成日、更新日などを見られる。検索、フィルタ、sort に加え、access 変更、owner 変更、download、delete もできる。

また、Skills は Compliance Logs Platform に対応する。管理者は skill event と、会話イベント内の skill references を確認できる。5月記事で扱った `skill_id` の監査線は、今回の既定オン化ではさらに重要になる。なぜなら、利用者が増えた後に「どの Skill がどの業務で使われたか」を後追いする必要が出るからだ。

この点は、[OpenAI Admin keysとCodex分析履歴](/blog/openai-global-admin-keys-codex-analytics-2026/) の論点ともつながる。AI 利用は、便利さだけでなく credits、tokens、plugin calls、skills used、code review activity のような運用データで説明する段階に入っている。Skills も例外ではなく、作成数や利用回数だけではなく、業務 owner と監査先を決めるべき対象である。

## 分析: 既定オン化で起きる shadow workflow

ここからは分析だ。

日本企業で怖いのは、利用者が悪意を持って Skill を作ることだけではない。もっと現実的なのは、便利な個人 Skill が部署内で共有され、いつの間にか業務標準のように使われることだ。営業メールの文面、法務レビュー観点、採用評価の下書き、障害報告の形式、コードレビュー基準などは、最初は個人の工夫として始まりやすい。

だが、Skill は instructions と supporting resources を含められる。古い規程、未承認テンプレート、外部由来のファイル、過去の顧客情報を前提にした文面が混ざると、出力の品質だけでなく説明責任にも影響する。これは shadow IT というより、shadow workflow である。システムではなく、仕事の進め方が管理外で標準化される。

既定オン化は、このリスクを増やす。管理者が明示的に有効化した pilot なら、利用部署、owner、ログ、問い合わせ先を決めやすい。しかし既定オンで現場に出ると、最初に普及が進み、後から棚卸しする形になりやすい。だからこそ、7月23日前に opt out するか、限定的に許すか、全社開放するかを明確にする必要がある。

## 日本企業の72時間チェック

最初にやるべきことは、workspace 単位で opt out 判断をすることだ。全社統制が未整備なら、期限前に opt out して、pilot 部署だけを明示的に有効化するほうが説明しやすい。逆に、すでに [ChatGPTロックダウンモード](/blog/openai-chatgpt-lockdown-mode-all-users-2026/) や Apps 権限、Compliance Logs の取り込みを設計済みなら、全社開放ではなく role 別開放から始める判断もあり得る。

次に、upload 権限を絞る。OpenAI は uploaded skills をスキャンすると説明しているが、同時に、そのスキャンは組織自身のレビュー、ポリシー、判断の代替ではないとも説明している。外部から受け取った Skill、取引先が作った Skill、個人がダウンロードした Skill をそのまま workspace に持ち込める状態は避けたい。

三つ目は、publish と install を分けることだ。workspace library へ公開する権限は、組織の業務部品を配布する権限に近い。他メンバーへ install する権限は、利用者本人の環境を変える権限に近い。最初は、作成と利用は広め、upload、publish、install は管理者または承認済み owner に限定する構成が現実的である。

四つ目は、既存 Skill の棚卸しだ。admin Skills page で owner、access、users、invocations、created、updated を確認し、退職者や異動者が owner のままの Skill、利用者が多いのに業務 owner がいない Skill、更新日が古い Skill を洗い出す。利用回数の多い Skill は、便利だから残すのではなく、標準化するか廃止するかを判断する。

## Codex、メモリ、Pluginsとは別に見る

Skills は ChatGPT だけの話に見えるが、OpenAI は Skills が Codex と API でもサポートされると説明している。一方で、ChatGPT の workspace-managed Skills と、Codex で使う Skills や plugins は別管理になる場合がある。ChatGPT Enterprise の既定オン化を確認しても、Codex のローカル Skills、Record & Replay、plugin 経由の Skills まで自動的に統制できるとは考えないほうがよい。

この分離は、[ChatGPTメモリ刷新](/blog/openai-chatgpt-dreaming-memory-controls-2026/) とも似ている。メモリは個人化の文脈、Skills は業務手順の部品、Plugins は Skills と apps を束ねる配布単位、Lockdown Mode は外部送信を抑える設定である。どれも「ChatGPT の便利機能」だが、管理対象は違う。

実務では、Skills 台帳を独立して持つとよい。Skill name、owner、対象業務、利用部署、access、upload 元、supporting resources、コード有無、更新日、次回レビュー日、関連規程、Compliance Logs の確認先を記録する。これを Apps 台帳、Plugins 台帳、メモリ利用ガイド、Lockdown Mode の利用基準と接続する。

## まとめ

ChatGPT Skills の Enterprise 既定オン予定は、派手な発表ではない。しかし、日本企業が ChatGPT を業務基盤として扱うなら、期限付きで確認すべき変更である。Skills は、個人の作業を速くするだけでなく、会社の仕事の型を ChatGPT に渡す仕組みになる。

日本企業が今見るべきなのは、Skills を使うかどうかだけではない。7月23日前に opt out 判断をし、upload、publish、install 権限を分け、既存 Skill を棚卸しし、`skill_id` を含む監査ログをどこで見るかを決めることだ。既定オン化を放置すると、便利な業務手順が管理外で広がる。管理線を引いたうえで使えば、Skills は部門ごとの作業品質をそろえる実用的な部品になる。

## 出典

- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) - OpenAI Help Center
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [Using skills](https://openai.com/academy/skills/) - OpenAI Academy
