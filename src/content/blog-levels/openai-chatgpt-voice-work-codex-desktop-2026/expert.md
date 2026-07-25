---
article: 'openai-chatgpt-voice-work-codex-desktop-2026'
level: 'expert'
---

OpenAI が 2026年7月23日に ChatGPT Business release notes へ追加した **ChatGPT Voice in Work and Codex** は、音声 UI の改善として読むと軽く見える。しかし実務上は、ChatGPT desktop app に集約されつつある Work と Codex の agent operations を、音声で steer する入口が増えた更新である。

この違いは重要だ。Voice in Chat は、GPT-Live を使った自然な相談・発想・確認のための体験である。一方、Voice in Work and Codex は、タスク開始、優先順位変更、中断、リダイレクト、進捗確認、複数 agent の調整、Project context の再利用、supported connected tools との連携を前提にしている。つまり入力手段ではなく、agent 管理の surface である。

OpenAI はすでに [ChatGPTデスクトップ統合](/blog/openai-chatgpt-desktop-work-codex-classic-2026/) で、Chat、Work、Codex を一つの desktop app へ並べた。さらに [OpenAI Codexの長時間作業](/blog/openai-codex-maxxing-long-running-work-2026/) で扱ったように、Codex は durable threads、voice input、steering、memory、computer and browser use、remote control、thread automations、goals へ広がっている。今回の Voice は、この作業面を人間が細かく steer する摩擦を下げる。

## 事実: 提供surfaceはChatとWork/Codexで違う

OpenAI の Business release notes は、Business workspace に 2 つの Voice 体験を示している。Voice in Chat は Desktop Chat と、対応する web、iOS、Android で提供される。用途は質問、ブレインストーミング、アイデア探索だ。ChatGPT Voice のヘルプでは、Live は音声で話しながらテキスト表示も追える体験で、web search や memory、対応 widget、text/image を組み合わせられる場合があると説明されている。

Voice in Work and Codex は違う。対象は macOS と Windows の ChatGPT desktop app であり、paired iOS remote access はあるが、standalone では web や mobile に出ない。これは単なる rollout 制約ではなく、Work/Codex がローカルファイル、desktop apps、browser、repositories、remote host、approval prompts、active projects と結びつくためだと考えるのが自然である。

この差は管理者向け説明で必ず分けるべきだ。利用者が「iPhone では Voice が使えるのに Work を音声で動かせない」「web では Voice があるのに Codex の進捗を聞けない」と感じる可能性がある。これは障害ではなく、提供 surface の違いである。ヘルプデスクは、plan、workspace settings、desktop app version、OS、paired iOS remote access、region を切り分ける必要がある。

また、Enterprise、Edu、Healthcare では early access 条件も絡む。ChatGPT Voice のヘルプでは、Live の early access 期間中、Advanced voice capabilities と Early Model Access の両方を workspace owner が有効化する必要があると説明されている。Work/Codex の Voice でも、Enterprise workspace では同じ組み合わせが必要とされる。Business と Enterprise で同じ案内を流すと、現場の問い合わせが増える。

## 事実: Voice creditsとagent creditsは合算してはいけない

費用設計では、Voice の分単位 credits と delegated task の credits を分けて見る必要がある。Business release notes は、Business workspace で Voice in Chat の含有枠と追加 5 credits/分を示し、Voice in Work and Codex は約 6 credits/分を使うと説明している。同時に、Work や Codex に委任された tasks は existing shared usage pool から standard rates で消費される。

Rate Card でも、Core ChatGPT Features の Voice は 5 credits/分とされている。一方、Workspace Agents、ChatGPT for Excel/Sheets、PowerPoint は token-based pricing で、入力 tokens、cached input tokens、出力 tokens の組み合わせによって credits が変わる。[ChatGPT業務AI課金](/blog/openai-chatgpt-workspace-agent-excel-pricing-2026/) で整理したように、Workspace Agent run には固定 credit 単価がない。つまり Voice で開始した業務 agent の費用は、会話時間だけでは説明できない。

たとえば、利用者が 8 分間 Voice で Work とやり取りし、その後 Work が複数ファイルを読み、調査し、PowerPoint の下書きを作るとする。この場合、Voice minutes、Work run の input/output token、cached input の効き方、PowerPoint task の扱い、接続アプリ検索、やり直し回数が費用に効く。月次で「Voice が高い」と見るだけでは原因を誤る。

実務では少なくとも 4 つを分けるべきだ。Voice in Chat minutes、Voice in Work/Codex minutes、delegated Work/Codex task credits、タスク完了後の人間レビュー負荷である。agent を音声で操作できると指示回数は増えやすい。指示回数が増えると、タスクのやり直しや branching も増える。費用管理では、音声利用時間だけでなく、agent 作業の再計画回数や中断回数も見たい。

## 事実: 音声データ保持は「消える/残る」の二択ではない

ChatGPT Voice のヘルプは、データ保持についてかなり具体的に説明している。Live と Advanced Voice の audio clips、Advanced Voice の video clips は、チャット履歴に表示される transcript と一緒に保存され、30 日保持される。チャットを削除すると関連 clip も 30 日以内に削除されるが、安全・法務などの理由で保持される場合がある。Standard では、文字起こし後に音声が削除されると説明されている。

また、Business、Enterprise、Edu workspace では、利用者が Voice 会話の audio/video clips をモデル改善のために共有することはできない。一方、transcript やその他ファイルについては plan と settings に依存する説明になっている。したがって、企業 FAQ では「音声は学習に使われない」だけを強調すると不十分である。clip retention、transcript retention、chat deletion、workspace data controls、audit/compliance policy を分けるべきだ。

日本企業では、個人情報保護、労務、顧客契約、委託先ルール、録音禁止区域が絡む。Voice が便利になるほど、発話内容は会議の独り言、顧客名、障害名、社員名、コード名、財務数値へ寄りやすい。音声 clip の保持だけでなく、そもそも共有スペースで発話してよいかを定義する必要がある。

ここは [ChatGPT横断検索とProjects文書再利用](/blog/openai-chatgpt-unified-search-project-files-2026/) とも接続する。Work/Codex の Voice は、existing project context や supported connected tools を使って作業を再開できる。つまり、発話そのものだけでなく、どの Project、どのファイル、どの connected app を文脈にしたかが重要になる。検索性と再利用性が高まるほど、古い Project や過剰共有された Project を音声で呼び出すリスクも増える。

## 分析: Voiceはagent supervisorのUIになりうる

ここからは分析である。

Work と Codex が長時間作業を担うほど、人間の仕事は「最初の prompt を書く」から「途中で方向を修正する」へ移る。agent は調査、実装、検証、文書化、ファイル作成、外部アプリ操作を続ける。人間は、進捗を聞き、優先順位を変え、前提の間違いを直し、承認線を越えないよう止める。この supervisor 的な役割では、音声はかなり相性がよい。

理由は、割り込みが自然だからだ。テキスト入力では、利用者は今動いている thread を開き、状況を読み、指示を書く必要がある。音声なら「その方針は違う。先にA案のリスクを出して」「PR作成は待って、テスト結果だけ説明して」「B社向け資料にはこの数字を使わないで」と短く割り込める。これは agent の生産性を上げる可能性がある。

しかし、同じ理由で危険でもある。短い口頭指示は曖昧になりやすい。agent は文脈から補完する。補完がうまくいけば速いが、誤れば大きな作業分岐になる。とくに Codex では、曖昧な音声指示が複数ファイル変更、テスト実行、Git 操作、PR draft に進む可能性がある。Work では、資料作成、顧客向け文面、Slack 投稿、カレンダー変更、Sites 作成へ進む可能性がある。

したがって、Voice 導入時は、音声で許す操作と許さない操作を定義したほうがよい。進捗確認、要約依頼、優先順位変更、調査範囲の指定は比較的許しやすい。一方、外部送信、公開、削除、支払い、権限変更、顧客資料の送付、PR merge、production 操作は、音声で始めても明示的な確認を挟むべきである。

## 分析: 日本語運用では「会話の自然さ」より記録の曖昧さが問題になる

日本語の業務現場では、遠回しな表現、前提の省略、役職や部署名の略称、顧客名の伏せ字、会議中の雑音が多い。Voice が自然に聞き取れるほど、利用者は丁寧な構造化 prompt を省きやすくなる。だが、agent に仕事を任せる場面では、その省略が後から効く。

たとえば「さっきの資料、営業向けにして」と話した場合、どの Project のどの資料か、営業部門向けなのか顧客営業向けなのか、社内共有版か外部提出版か、数値を残すのか消すのかが曖昧である。テキストなら利用者が見直してから送ることが多いが、音声では確認せずに続けてしまう可能性がある。

ChatGPT Voice のヘルプでは、Voice transcripts は会話と完全に一致しない場合があると説明されている。これは監査上も重要だ。音声で何を言ったか、transcript に何が残ったか、agent がどう解釈したかは同一ではない可能性がある。日本企業が重要業務に使うなら、最終 action 前の確認画面、作業ログ、承認コメント、成果物レビューを残す必要がある。

[OpenAI Presenceの企業agent統制](/blog/openai-presence-enterprise-agent-governance-2026/) でも、音声とチャットの agent は、どのデータに触れ、どの操作をし、どこで人間へ引き継ぐかが本質だった。Work/Codex の Voice も同じである。自然な会話 UI が前面に出るほど、裏側では action boundary と evidence boundary を明確にする必要がある。

## 導入設計: 30日で見るべきチェック項目

最初の 1 週間は、対象 user と surface を絞る。Business では desktop app の Work/Codex 利用者、Enterprise では Advanced voice capabilities と Early Model Access の状態を確認する。Windows、macOS、iOS remote access、microphone permission、MDM/EDR の inventory を見て、そもそも対象端末で使えるかを確認する。

2 週目は、用途を限定する。許可するのは、進捗確認、要約、軽い steering、調査範囲の変更、Codex のテスト結果説明などに絞る。外部送信、ファイル公開、顧客資料送付、Git push、PR merge、権限変更は、音声単独では進めない。Work/Codex 側に既に approval がある場合も、社内ルールとしてどの action が重要操作かを明示する。

3 週目は、費用を分解して見る。Voice in Chat minutes、Voice in Work/Codex minutes、Work/Codex delegated task credits、Agent runs、Codex turns、レビュー差し戻し、完了タスク数を並べる。これにより、Voice が単に会話時間を増やしているのか、agent 作業の完了率を上げているのか、やり直しを増やしているのかが見える。

4 週目は、利用者の失敗例を集める。音声認識の誤り、曖昧な指示、間違った Project context、不要な作業分岐、credits の想定超過、周囲に聞かれたくない内容の発話、ヘルプデスク問い合わせを分類する。成功例だけで rollout 判断をすると、実運用で詰まる。

## 管理者FAQに入れるべき短い答え

利用者向けには、長いポリシーより短い FAQ が効く。たとえば、Voice in Chat と Voice in Work/Codex の違い、web/mobile でできないこと、Business と Enterprise の設定差、5 credits/分と 6 credits/分の違い、agent 作業は別途 credits を使うこと、音声 clip の 30 日保持、Business/Enterprise/Edu では clip をモデル改善に共有できないことを明記する。

開発者向けには、Codex 作業中の Voice で許す指示例を示すとよい。「進捗を説明して」「このテスト失敗を先に調べて」「PR はまだ作らないで」「差分を小さくして」「セキュリティ影響だけ先にまとめて」は許しやすい。一方、「そのまま push して」「本番へ反映して」「顧客に送って」「この秘密情報を使って」は追加確認が必要、という線を作る。

業務部門向けには、Work の Voice で扱う Project とファイルの基準を示す。顧客別資料、個人情報、未公開財務情報、契約書、採用評価、障害情報を voice session で扱う場合は、Project の共有範囲と最終成果物レビューを必須にする。便利な agent 作業ほど、成果物の用途を明示するべきである。

## まとめ

ChatGPT Voice の Work/Codex 対応は、ChatGPT Business の desktop app を agent supervisor の作業面へ近づける更新である。Voice は、相談の摩擦を下げるだけでなく、Work と Codex の長時間作業を途中で steer するための UI になる。

日本企業が見るべき論点は、音声認識の精度だけではない。提供 surface、workspace settings、Early Model Access、Voice credits、delegated task credits、音声 clip の保持、Project context、承認線、発話環境を一緒に設計する必要がある。Work/Codex をすでに使っている組織ほど、Voice を個人の便利機能ではなく、agent operations の統制対象として扱いたい。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center, 2026-07-23
- [ChatGPT Voice](https://help.openai.com/en/articles/20001274) - OpenAI Help Center, updated 2026-07-24
- [ChatGPT Rate Card (Business, Enterprise/Edu)](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu) - OpenAI Help Center
