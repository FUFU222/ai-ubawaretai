---
title: 'ChatGPT Voice拡大、WorkとCodexの音声運用設計'
description: 'ChatGPT VoiceがWorkとCodexに広がった。日本企業がデスクトップ運用、credits、音声データ保持、管理者設定をどう確認し、agent業務へ安全に入れるかを整理する。'
pubDate: '2026-07-25'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'AIワークフロー', '音声AI', '企業導入', '管理者設定']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAI は **2026年7月23日** の ChatGPT Business Release Notes で、**ChatGPT Voice を Work と Codex のデスクトップ体験へ広げた**と発表した。Voice in Chat は自然な会話や相談のための音声体験で、Voice in Work and Codex はタスク開始、進捗確認、agent への質問、複数 agent の調整に使う体験として分けられている。

これは単なる音声入力の追加ではない。[ChatGPTデスクトップ統合](/blog/openai-chatgpt-desktop-work-codex-classic-2026/)で見たように、OpenAI は Chat、Work、Codex を一つの desktop app に並べ、利用者が作業面を切り替える方向へ寄せている。そこへ Voice が入ることで、日本企業は「話してプロンプトを入れる」だけでなく、「音声で長い Work/Codex の作業を steer する」運用を考える必要が出てきた。

さらに、[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/)で整理した credits 管理とも直結する。Voice in Chat は Business で一定時間の含有枠があり、追加利用は分単位で課金される。Voice in Work and Codex も分単位で credits を消費し、音声で委任した実作業は既存の shared usage pool から標準 rate で消費される。つまり、音声化は UX 改善であると同時に、利用量を増やしやすい費用面の変更でもある。

## 事実: Voice in ChatとWork/Codexは別体験である

OpenAI の release notes は、Business workspace に 2 種類の Voice 体験を示している。Voice in Chat は GPT-Live を使う自然なリアルタイム会話で、Desktop Chat のほか、対応する web、iOS、Android 体験で使える。質問、ブレインストーミング、アイデア探索のための入口だ。

一方、Voice in Work and Codex は、Work や Codex の agent 作業を音声で始めたり、優先順位を変えたり、進捗を尋ねたり、複数 agent を一つの会話で調整したりするためのものだ。提供面も違う。macOS と Windows の ChatGPT desktop app が中心で、iOS は paired remote access として補助的に使える。standalone の Voice in Work and Codex は web や mobile では提供されない。

ここで日本企業が誤解しやすいのは、Voice が全 surface で同じように使えるわけではない点だ。営業や企画部門が mobile の Voice で相談する体験と、開発者が desktop の Codex で作業中 agent に割り込む体験は、運用リスクも問い合わせ先も違う。管理者は、対象アプリ、OS、workspace 設定、mobile remote access の有無を分けて案内する必要がある。

ChatGPT Voice のヘルプでは、Live は音声で会話しながらテキスト表示も追える体験として説明されている。音声中にテキストや画像を同じチャットへ加えられる場合もある。ただし、Live は launch 時点で video、screen sharing、connected apps、plugins を最初から全部扱うわけではない。Work/Codex 側の Voice も、利用できる tools と permissions は Work または Codex の権限に依存する。

## 事実: creditsと音声データ保持は別々に確認する

料金面では、Business workspace に Voice in Chat の一定時間枠があり、追加利用は 5 credits/分と案内されている。Rate Card でも Core ChatGPT Features の Voice は 5 credits/分と整理されている。Voice in Work and Codex は、Business と Enterprise の flexible pricing で、おおむね 6 credits/分を使うと説明されている。

ただし、これは「音声で動かした作業の総額」ではない。Voice の会話時間に対する credits と、Work や Codex が実行するタスクの credits は別に考える必要がある。OpenAI は、Work や Codex に委任された tasks は既存の shared usage pool から standard rates で消費されると説明している。つまり、利用者が 10 分話したあとに Work が長い調査や資料作成を走らせれば、音声分と agent 作業分の両方を見る必要がある。

データ保持も重要だ。ChatGPT Voice のヘルプでは、Live と Advanced Voice の audio clips、Advanced Voice の video clips は、チャット履歴に表示される transcript と一緒に保存され、30 日保持されると説明されている。Standard では、音声は文字起こし後に削除される扱いが示されている。Business、Enterprise、Edu workspace では、利用者が Voice 会話の audio/video clips をモデル改善のために共有することはできないとも説明されている。

日本企業では、この差を利用者向け FAQ に落としたほうがよい。「音声は即時に消える」とも、「すべて永続保存される」とも言い切れない。Voice の種類、workspace plan、履歴削除、トレーニング利用可否、チャットの保持ポリシーを合わせて説明する必要がある。特に会議室、客先常駐、コールセンター、開発現場で使う場合、音声として口に出してよい情報の基準を決めておきたい。

## 事実: Enterprise/EduではEarly Model Accessも関係する

Business では今回の release notes に直接新機能として出ているが、Enterprise、Edu、Healthcare では設定条件も見る必要がある。ChatGPT Voice のヘルプでは、Live の early access 期間中、workspace owner が Advanced voice capabilities と Early Model Access の両方を有効化する必要があると説明されている。Work/Codex の Voice でも、Enterprise workspace では同じく Advanced voice capabilities と Early Model Access が必要とされる。

これは管理者にとってかなり実務的な論点だ。Voice を許可したつもりでも Live が出ない、Advanced Voice は使えるが Live が見えない、Work/Codex の Voice だけ使えない、といった問い合わせが起こりうる。原因はユーザー端末だけではなく、workspace 設定、plan、地域、rollout、app version、Early Model Access の組み合わせになる。

また、Work/Codex の Voice は desktop app に寄っているため、端末管理ともつながる。マイク権限、デスクトップアプリの配布、Classic と新 desktop app の併存、iOS remote access の pairing、MDM の microphone policy、客先環境での利用可否を確認する必要がある。[OpenAI Codexの長時間作業](/blog/openai-codex-maxxing-long-running-work-2026/)で扱ったように、Codex は remote control、browser use、thread automations、goal などと結びついている。そこへ音声操作が入ると、利便性と統制の境界をあらためて引く必要がある。

## 分析: 音声は入力補助ではなくagent orchestration面になる

ここからは分析である。

従来の音声入力は、キーボードの代替として見られがちだった。長いプロンプトを口頭で入れる、移動中に相談する、手がふさがっているときに質問する、という使い方である。しかし Work/Codex の Voice は、それより一段重い。OpenAI は、タスクを start、prioritize、interrupt、redirect し、active conversations と projects をまたいで複数 agent を coordinate できると説明している。

これは作業の管理面である。複数の Work thread や Codex thread が動いているとき、利用者は「この調査を先に進めて」「その PR は待って」「A の結果を B の資料へ反映して」「詰まっているなら理由だけ報告して」といった steering をする。テキストでもできるが、音声は割り込みや状況確認の摩擦を下げる。便利なぶん、未整理の指示も増えやすい。

日本企業では、ここを「自然に話せるから生産性が上がる」とだけ捉えないほうがよい。agent に渡す作業範囲、承認が必要な操作、外部アプリへの action、ファイル参照、顧客データ、コード変更、PR 作成、公開操作は、音声かテキストかに関係なく管理が必要である。音声は操作を速くするが、責任を軽くするものではない。

特に Work は、資料、表計算、Sites、接続アプリ、スケジュール実行へ広がる。[ChatGPT横断検索とProjects文書再利用](/blog/openai-chatgpt-unified-search-project-files-2026/)で見たように、Projects や過去チャット、ファイルが作業文脈として再利用される。Voice で既存 Project を呼び出して Work を進める場合、どの Project の文脈を使ったのか、共有範囲は正しいのか、古い資料を参照していないかを確認したい。

## 実務: 日本企業の導入前チェック

第一に、Voice in Chat と Voice in Work/Codex を別々に許可・案内する。一般相談の Voice と agent 操作の Voice では、対象ユーザー、利用場所、費用、監査観点が違う。社内 FAQ では、利用可能な surface、desktop app の必要条件、iOS remote access の扱い、web/mobile でできないことを明記する。

第二に、音声で扱ってよい情報を決める。公開情報、社内一般情報、顧客名、個人情報、未公開財務情報、障害対応中の詳細、脆弱性情報、ソースコードの秘密情報を同じ扱いにしない。特にオープンスペースや客先では、プロンプト内容そのものを周囲に聞かれるリスクがある。音声 clip の保持だけでなく、発話環境も運用ルールに含める。

第三に、credits を分けて測る。Voice の分単位 credits、Work/Codex のタスク credits、Agent runs、Codex usage、ChatGPT for Excel/PowerPoint の token-based credits を同じ月次レポートで混ぜると原因が見えない。導入初期は、Voice minutes、Voice in Work/Codex minutes、delegated task credits、完了タスク数、レビュー差し戻し数を分けて見るべきだ。

第四に、権限と承認線を確認する。Voice で agent に指示しても、重要な action は従来どおり approval を求めるべきである。外部送信、カレンダー変更、Slack 投稿、ファイル作成、Git 操作、PR 作成、Sites 公開、顧客向け資料生成は、音声で始めても human review を残す。これは [OpenAI Presenceの企業agent統制](/blog/openai-presence-enterprise-agent-governance-2026/) と同じく、会話 UI より業務上の action boundary が重要になる話である。

第五に、ヘルプデスクの切り分けを用意する。Voice が出ない場合は、plan、workspace settings、Advanced voice capabilities、Early Model Access、app version、OS、region、マイク権限、paired iOS remote access を順に確認する。音声が認識されない場合は、デバイス、ブラウザ、マイク権限、周囲の音、言語設定を分ける。費用問い合わせでは、Voice minutes と delegated task の credits を分けて説明する。

## まとめ

ChatGPT Voice の Work/Codex 拡大は、ChatGPT Business の desktop app を、会話、業務 agent、開発 agent の操作面としてさらに強くする更新である。日本企業にとっての焦点は、音声入力そのものではない。誰が、どの端末で、どの agent 作業を、何分、どの credits pool で、どの承認線の中で動かすかである。

Voice は agent 作業の steering を速くする。だからこそ、導入前に surface、料金、音声保持、workspace 設定、発話してよい情報、承認が必要な action を整理したい。Work/Codex を本格的に使う組織ほど、Voice を便利機能ではなく運用設計の対象として扱うべきだ。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center, 2026-07-23
- [ChatGPT Voice](https://help.openai.com/en/articles/20001274) - OpenAI Help Center, updated 2026-07-24
- [ChatGPT Rate Card (Business, Enterprise/Edu)](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu) - OpenAI Help Center
