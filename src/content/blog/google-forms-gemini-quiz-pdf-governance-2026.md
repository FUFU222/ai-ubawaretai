---
title: 'Google Forms Geminiクイズ、PDF研修の管理実務'
description: 'Google FormsのGeminiクイズ作成を整理。日本企業や学校がPDF教材、Drive参照、回答キー、Smart features設定をどう管理し、研修テストを安全に作るか解説する。'
pubDate: '2026-08-04'
category: 'news'
tags: ['Google Workspace', 'Google', 'Gemini', 'Google Forms', '管理者設定', 'AIガバナンス', '企業導入', '教育']
series: 'google-workspace-ai-governance-2026'
draft: false
---

Google Workspace Updates は **2026年7月30日**、Google Forms の Gemini で **クイズをすばやく作成できる** 更新を発表した。ユーザーは Forms の Help me create にクイズの目的を入力し、必要に応じて Google Drive 上の Docs、Slides、PDF などを参照元にできる。Gemini はその内容をもとにフォームだけでなくクイズ設定、正答、点数まで含む初稿を生成する。

これは、Google Forms に小さな生成ボタンが増えたというだけの話ではない。日本企業では、入社研修、セキュリティ教育、営業資料の理解確認、製品トレーニング、代理店教育、学校の小テストなど、確認テストの作成が地味に重い。PDF教材やDrive資料から問題を起こせるなら、研修担当者の負荷は下がる。一方で、誤った正答、古い教材、機密資料の参照、回答データの扱いがそのまま運用リスクになる。

同じシリーズの [Google Slides Gemini資料生成](/blog/google-slides-gemini-editable-decks-governance-2026/) は提案書や研修資料の初稿作成を扱った。今回の Forms 更新は、その後段にある「理解を測る」工程へ Gemini が入るものだ。[Google Docs Geminiコメント処理](/blog/google-docs-gemini-comments-visuals-governance-2026/) が文書レビューの管理線を示し、[Google Meet画面添付](/blog/google-meet-visual-screenshots-notes-governance-2026/) が会議記録の共有統制を問うたのと同じく、Forms でも Drive 文脈を使う生成AIとして設計すべきである。

## 事実: PDFやDrive資料からクイズ初稿を作れる

Google の発表では、Forms の Help me create がクイズ生成に対応した。利用者は作りたいクイズを具体的に説明するプロンプトを書き、必要なら Drive ファイルを参照できる。対象例として Docs、Slides、PDF が挙げられている。生成されたクイズはプレビュー後に挿入でき、挿入後も人間が内容を調整できる。

ヘルプページでは、Gemini がフォームまたはクイズを生成し、クイズの場合は正答と点数も設定すると説明されている。問題形式は選択式だけではなく、チェックボックス、グリッド、短文、長文などを混ぜられる。これは実務上かなり大きい。従来は研修資料から担当者が設問を抜き出し、選択肢を作り、正答設定を手で入れる必要があった。Gemini が初稿を作れば、担当者はゼロから作るのではなく、レビューと修正に時間を寄せられる。

ロールアウトは Rapid Release ドメインで 2026年7月24日から段階展開、Scheduled Release ドメインでは 2026年8月5日から段階展開とされている。対象は Business Standard / Plus、Enterprise Standard / Plus、Education Plus、Google AI Pro for Education、Teaching and Learning、Google AI Pro / Ultra などである。日本企業で Scheduled Release を使っている組織は、8月上旬から利用者の画面に出始める前提で、管理者設定と利用ルールを確認したい。

## 分析: 研修作成は速くなるが、正答責任は残る

この更新の価値は、研修担当者や教育現場の「設問作成の初速」を上げる点にある。セキュリティ研修なら、社内規程PDFから10問の理解確認を作る。営業研修なら、新製品のSlidesから顧客説明の確認問題を作る。学校なら、授業資料から小テストを作る。どれも人間が一から書くと時間がかかるが、生成AIの初稿なら短時間でたたき台を得られる。

ただし、クイズは資料要約よりも誤りの影響が見えにくい。要約なら読んだ人が違和感に気づきやすいが、クイズでは「正答として設定されたもの」がそのまま評価に使われる。特にコンプライアンス研修、人事評価、資格更新、顧客向け認定、学校成績に関わる場合、誤った問題や曖昧な選択肢は重大になる。Gemini が正答と点数を入れるからこそ、人間の最終確認は省けない。

日本企業では、研修コンテンツが古いまま残ることも多い。年度ごとの規程改定、製品価格の変更、個人情報保護法や業界ガイドラインの改定、社内承認フローの変更があっても、PDF教材だけが古い版のまま Drive に残ることがある。Gemini が古いPDFを参照してクイズを作れば、見た目は新しいテストでも中身は古い判断基準になる。参照元の版管理を先に整えないと、生成の速さが誤配布の速さになる。

## 管理者が先に見るべき設定

Workspace Updates は、Gemini のサイドパネルを使うには Smart features and personalization が必要だと案内している。Google の管理者ヘルプでは、Google Workspace の smart features をオンにすると、Workspace 内のコンテンツとアクティビティを使って横断的な機能を提供できると説明している。日本、EEA、スイス、英国では既定値が他地域と異なる点にも注意が必要である。

管理者は、Forms の画面だけを見ても十分ではない。Drive の共有、教材フォルダの権限、PDFの版管理、DLP、回答データの保存先、教育部門や人事部門のオーナー権限を合わせて見る必要がある。たとえば、全社員が見られる研修PDFだけを参照させる運用と、人事評価資料や顧客別提案書まで参照できる運用では、リスクがまったく違う。

また、[Google Meet AI議事録の既定オン](/blog/google-meet-take-notes-admin-default-2026/) と同じく、プランごとの既定値や利用者体験の変化を管理者が先に把握しておきたい。Gemini 機能は便利なため、利用者は「使えるなら使ってよい」と受け取りやすい。管理者側が、どの研修に使えるのか、どの資料は参照禁止なのか、生成後に誰が承認するのかを示さないと、現場ごとの判断にばらける。

## 日本企業での初期導入手順

最初の30日は、全社展開ではなく、低リスクな研修から始めるのが現実的だ。候補は、公開済み製品FAQ、社内ツールの基本操作、一般的なセキュリティ啓発、オンボーディングの確認テストなどである。顧客固有情報、人事評価、法務判断、医療・金融助言、資格認定に直結する内容は、少なくとも初期検証から外すべきだ。

次に、参照元ファイルを固定する。Gemini に「このDriveフォルダの最新教材だけを使う」と人間が運用で決めても、実際の権限が広いと別資料を参照できてしまう。研修ごとに教材フォルダを分け、最新版だけを置き、古いPDFはアーカイブへ移す。設問生成後は、出題範囲、正答、点数、説明文、公開範囲を人間が確認する。

最後に、回答データの扱いを決める。Forms のクイズは作成だけで終わらない。誰が回答するか、回答結果を誰が見るか、スプレッドシートへ出すか、保存期間をどうするか、未受講者へ督促するかまで運用が続く。生成AIで作成が速くなるほど、配布と集計も増えやすい。回答データに個人の成績や理解度が含まれるなら、アクセス権と保存期間を明文化すべきである。

## まとめ

Google Forms の Gemini クイズ生成は、教育や研修の小さな面倒をかなり減らす更新である。PDFやDrive資料をもとに問題、正答、点数まで初稿化できるなら、研修担当者は作成作業からレビュー作業へ移れる。

一方で、日本企業が見るべき焦点は「簡単にクイズを作れる」ことだけではない。参照元の版管理、Smart features の設定、Drive 権限、正答レビュー、回答データの保存がそろって初めて、安全な研修運用になる。Forms は軽いツールに見えるが、評価や教育に使われると業務記録になる。Google Workspace の Gemini を使うなら、Docs、Slides、Meet と同じく、Forms も Workspace AI ガバナンスの対象に入れるべきだ。

## 出典

- [Use Gemini in Google Forms to quickly create a new quiz](https://workspaceupdates.googleblog.com/2026/07/use-gemini-in-google-forms-to-quickly-create-a-new-quiz.html) - Google Workspace Updates, 2026-07-30
- [Create a form with Gemini in Google Forms](https://support.google.com/docs/answer/16346789) - Google Docs Editors Help
- [Manage Google Workspace smart features for your users](https://support.google.com/a/answer/10095404) - Google Workspace Help
