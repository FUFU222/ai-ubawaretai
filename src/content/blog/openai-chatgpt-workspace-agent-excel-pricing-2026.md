---
title: 'ChatGPT業務AI課金開始、ExcelとAgent費用管理'
description: 'ChatGPT業務AI課金の新rate cardを整理。日本企業がWorkspace Agents、Excel/Sheets、PowerPointのcredits消費と部門別予算をどう管理するか解説する。'
pubDate: '2026-07-07'
category: 'news'
tags: ['OpenAI', 'ChatGPT', 'AIワークフロー', '企業導入', '管理者設定', '従量課金']
series: 'openai-chatgpt-work-products-2026'
draft: false
---

OpenAI は 2026年7月6日、ChatGPT Business の Release Notes で、Workspace Agent runs と ChatGPT for Excel/Sheets tasks の課金を token-based pricing に移したと発表した。翌7日に確認できる ChatGPT Rate Card でも、Business と Enterprise/Edu 向けの rate が更新され、入力 tokens、cached input tokens、出力 tokens ごとに credits を計算する形が示されている。

これは単なる料金表の更新ではない。ChatGPT が、会話、検索、表計算、資料作成、業務エージェントへ広がるほど、企業は「何人に席を配るか」だけでは費用を読めなくなる。特に日本企業では、Excel、PowerPoint、Google Sheets、Slack、Drive、SharePoint のような日常業務面に AI が入るほど、部門別の利用量、承認、予算消化、停止条件をまとめて見なければならない。

この流れは、以前整理した [ChatGPTタスク刷新](/blog/openai-chatgpt-scheduled-tasks-management-2026/) や [ChatGPT for Excel](/blog/openai-chatgpt-for-excel-financial-data-2026/) とつながる。前者は定期実行や監視の入口、後者は表計算の作業面だった。今回の焦点は、その業務AIが無料プレビューや固定的な利用枠から、credits を消費する変動費へ移ったことだ。

## 事実: AgentとExcel/Sheets課金が始まった

OpenAI の ChatGPT Business Release Notes は、Workspace Agent runs と ChatGPT for Excel/Sheets tasks が token-based pricing を使うようになったと説明している。Business plan では、ChatGPT Workspace Agents、ChatGPT for Excel、ChatGPT for PowerPoint の利用が general Codex agentic usage pool に含まれ、必要に応じて flexible pricing で上限を伸ばす形になる。

Enterprise/Edu 側でも、Workspace agents は Business、Enterprise、Edu に一般提供され、エージェント作成者が app ごとの action safeguard を設定でき、管理者が admin console で activity と usage を確認できるとされている。無料期間は 2026年7月6日まで延長され、その日から credit-based pricing が始まるという位置づけだった。

Rate Card では、ChatGPT for Excel/Sheets、ChatGPT for PowerPoint、ChatGPT Workspace Agents が個別の節で整理されている。Excel/Sheets と Workspace Agents はすでに課金対象で、PowerPoint は Business と Enterprise では 2026年8月6日まで無料、その後は Excel/Sheets と同じ token-based pricing に入る。

ここで大事なのは、これらが「1回実行で何 credits」と固定されていない点だ。OpenAI は、入力 tokens、cached input tokens、出力 tokens の組み合わせで消費 credits が決まり、タスクの複雑さ、入力の大きさ、cached input の量、出力の長さで最終値が変わると説明している。つまり、同じ Workspace Agent でも、短いSlack通知を作るのと、複数ファイルを読み込んで長い提案書を作るのでは費用が違う。

## 事実: 典型値はあるが、見積もりは揺れる

Rate Card は GPT-5.5 を使う Excel/Sheets task の典型的な消費を 5 から 20 credits、PowerPoint task を 10 から 50 credits、GPT-5.5 の Workspace Agent run を 5 から 25 credits としている。Workspace Agent では GPT-5.4 も表に載っており、モデル選択によって credits rate が変わる。

これは導入判断に使える目安だが、固定単価ではない。たとえば、同じ「月次報告を作る」作業でも、参照する spreadsheet の大きさ、添付ファイル数、接続アプリの検索量、生成する文章やスライドの長さで消費は変わる。cached input が効く設計なら同じ文脈を繰り返す作業で費用を抑えられる可能性があるが、毎回新しい大きなファイルを読む作業では入力 tokens が増えやすい。

ここは [ChatGPT Enterprise利用上限](/blog/openai-chatgpt-usage-limits-enterprise-2026/) で扱った usage limits と同じ問題である。企業AIの管理は、席数、プラン、上限、credits、rate card、admin console の数字を組み合わせて読む必要がある。請求書だけを月末に見ても、どの部門のどの業務が増えたのかは分かりにくい。

また、[OpenAI Codex座席設計](/blog/openai-chatgpt-business-codex-seats-2026/) のように Codex seat と workspace credits を分ける話とも重なる。今回の ChatGPT 業務AI課金は Codex だけの話ではないが、agentic usage pool や flexible pricing という考え方は共通している。開発部門だけでなく、経営企画、営業、採用、人事、法務、財務が同じ credits pool を使うなら、費用配賦を先に設計する必要がある。

## 分析: 日本企業では部門別の変動費として扱う

ここからは分析だ。

日本企業が最初に避けたいのは、Workspace Agents や Excel/Sheets を「ChatGPT Businessに含まれる便利機能」とだけ説明して全社展開することだ。含有利用枠があっても、実際の業務量が増えれば flexible pricing や追加 credits の判断が必要になる。現場にとっては小さな1タスクでも、経理や管理者から見ると変動費である。

特に Excel/Sheets は広がりやすい。日本企業では、予算、売上集計、勤怠、在庫、見積、採用管理、営業管理、経営会議資料の下書きまで、表計算が多く残っている。ChatGPT が spreadsheet-native に入り、説明、整理、更新、分析を支援するなら、利用は自然に増える。だからこそ、重要な spreadsheet と軽い作業用 spreadsheet を同じ扱いにしないほうがよい。

Workspace Agents も同じだ。エージェントは、接続アプリを使い、スケジュール実行し、Slack や共有ディレクトリで使われる可能性がある。便利な反面、1人の作業ではなく、チームの業務フローとして繰り返し実行される。毎日走るエージェント、週次で資料を作るエージェント、営業準備を複数人で使うエージェントは、個人のチャットより費用が積み上がりやすい。

PowerPoint の猶予も見落とせない。2026年8月6日までは無料でも、その後は Excel/Sheets と同じ token-based pricing に入る。資料作成は日本企業で需要が強い。営業提案、役員会、稟議、採用説明、研修、IR、社内報告に使われるため、無料期間に利用が定着すると、課金開始後に突然 credits 消費が増える可能性がある。

## 導入前に決めるべきこと

第一に、対象業務を分類する。Excel/Sheets は、軽い整形、社内集計、財務モデル、顧客データを含む分析でリスクが違う。Workspace Agents は、通知、調査、資料作成、アプリ操作、外部送信でリスクが違う。PowerPoint は、社内資料、顧客提案、IR、法務提出でレビュー責任が違う。機能名ではなく、業務単位で分類する。

第二に、credits の owner を決める。ChatGPT 管理者だけでなく、経理、情シス、業務部門 owner が見られる形にする。特に shared pool では、ある部門のエージェントが使いすぎると、別部門の advanced feature に影響する可能性がある。月次では遅いので、導入初期は週次で usage を見るほうがよい。

第三に、無料期間と課金開始日を台帳に入れる。PowerPoint は 2026年8月6日まで猶予がある。無料の間に、どの部署が何に使い、典型的な task あたりどの程度 credits を消費しそうかを測る。猶予期間は無制限に試す期間ではなく、課金後の業務継続判断に必要な実測期間として扱う。

第四に、アプリ権限を費用管理と結びつける。Workspace Agents が Google Drive、Slack、SharePoint、Calendar などを使う場合、権限を広げるほど入力 tokens と実行範囲も広がりやすい。セキュリティのためだけでなく、費用予測のためにも、読み取り対象、書き込み action、スケジュール実行数を絞る。

第五に、利用者へ「AI作業にも原価がある」と伝える。従来のチャットは、利用者から見ると無料に近く感じられた。しかし token-based pricing では、長いファイルを何度も読み込ませる、同じ資料を何度も作り直す、不要なエージェントを毎日走らせる、といった行動がコストになる。禁止よりも、費用が増える操作を具体的に説明するほうが運用しやすい。

## まとめ

今回の更新で、ChatGPT の業務AIは「使えるか」から「どう測り、どう支払い、どう止めるか」へ進んだ。Workspace Agents と Excel/Sheets は token-based pricing に入り、PowerPoint も 2026年8月6日後に同じ方向へ進む。典型的な credits 消費の目安は示されたが、実際の費用は作業の大きさと出力量で変わる。

日本企業が今やるべきことは、ChatGPT の新機能を一括で広げることではない。Excel/Sheets、Workspace Agents、PowerPoint を業務別に分類し、credits owner、部門別予算、無料期間の実測、アプリ権限、停止条件を先に決めることだ。そうすれば、ChatGPT を便利な個人ツールではなく、管理された業務AI基盤として広げやすくなる。

## 出典

- [ChatGPT Business - Release Notes](https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes) - OpenAI Help Center, 2026-07-06
- [ChatGPT Enterprise & Edu - Release Notes](https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes) - OpenAI Help Center
- [ChatGPT Rate Card (Business, Enterprise/Edu)](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu) - OpenAI Help Center, 2026-07-07確認
