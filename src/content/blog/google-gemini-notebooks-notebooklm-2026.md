---
title: 'Google Geminiに「notebooks」追加。NotebookLM同期でAI調査と執筆はどう変わるのか'
description: 'Googleが2026年4月8日、Geminiアプリにnotebooksを投入。NotebookLMと同期する個人知識ベース、ファイル追加、カスタム指示、Web検索連携、まずはAI Ultra/Pro/Plus向けという発表の意味を、日本の開発者とプロダクトチーム向けに整理する。'
pubDate: '2026-04-10'
category: 'news'
tags: ['Google', 'Gemini', 'NotebookLM', 'notebooks', '知識管理', 'AIワークフロー', 'Google Workspace']
draft: false
---

Googleが2026年4月8日に公開した「Try notebooks in Gemini to easily keep track of projects」は、一見するとGeminiアプリの小さな整理機能に見える。でも実際には、**Geminiを単発チャットから“継続的に仕事を進める場所”へ変える発表**だ。

今回Googleは、Geminiアプリに **notebooks** を追加した。notebooksは、チャット、ファイル、カスタム指示を一つの単位で束ねる個人向けの知識ベースで、しかも **NotebookLMと同期** する。つまり、Gemini側で資料を集めて話しながら進め、NotebookLM側でVideo OverviewsやInfographicsを使い、またGeminiに戻って原稿や企画書へ落とす流れが、同じコンテキストのまま回せるようになる。

これは日本の開発者やプロダクトチームにもかなり重要だと思う。なぜなら、生成AIの使い勝手を決める勝負が、もう「1回の回答が賢いか」だけではなく、**複数日の調査や執筆をどれだけ失われずに持ち運べるか** に移っているからだ。

## Geminiのnotebooksとは何か

Googleの説明では、notebooksは「Google製品をまたいで共有される personal knowledge base」で、まずはGeminiから始まる。Geminiアプリのサイドパネルで「New notebook」を作り、過去チャットを移し、カスタム指示を与え、文書やPDFのような関連ファイルを追加できる。

ここで大事なのは、notebooksが単なるフォルダ分けではない点だ。Googleは、手元で選んだソースをnotebookに整理すると、Geminiがそれらを **自分のツール群とWeb検索** と一緒に使って返答すると説明している。つまり、

- 会話の履歴
- 添付した資料
- そのnotebook専用の指示
- Gemini側の検索やツール

を一つの作業空間として扱うわけだ。

これまでのAIチャットは、どうしても「このスレッドに何を入れたか」を人間が覚えておく必要があった。notebooksはそこを、「この案件に必要な文脈はここにある」という形へ明示化する。ここがかなり大きい。

## NotebookLM同期で何が変わるのか

今回の本丸は、notebooksそのものより **NotebookLM同期** にある。

Googleは、sourceをGeminiかNotebookLMのどちらかに追加すると、もう片方にも自動で現れると説明している。つまり、Geminiで始めた作業をNotebookLMの別アプリ体験へそのまま持ち込める。NotebookLM側ではVideo OverviewsやInfographicsのような専用機能が使えるので、資料理解の深掘りをNotebookLMで行い、その結果をGeminiで文章化したり、会議メモや提案書の下書きへ落としたりしやすくなる。

これはかなり戦略的だ。Googleは2025年12月のGemini Dropで、すでに **NotebookLMをGeminiのsourceとして追加できる** 状態を作っていた。今回のnotebooksは、その一段先にある。NotebookLMを「参照できる外部ソース」として置くだけではなく、**GeminiとNotebookLMが同じ作業単位を共有する構造** に変えたからだ。

以前このサイトで取り上げた[Geminiの会話履歴・メモリインポート機能](/blog/google-gemini-import-chatgpt-claude-history-2026/)は、他社サービスからGeminiへ文脈を引き込む動きだった。今回のnotebooksは、その次の手として、Geminiの中で生まれた仕事の文脈をGoogle製品内で逃がさない設計に見える。

## なぜ今この機能が大きいのか

今回の発表が大きい理由は、Googleが「AIチャット」と「AIリサーチ」を別物として扱わなくなったことだ。

Geminiは会話と生成に強い。一方のNotebookLMは、集めた資料に対して理解や再構成をかける体験が強い。これまでは両者が近づいていても、ユーザー体験としてはまだ行き来のコストがあった。notebooks同期は、そのコストをかなり下げる。

言い換えると、GoogleはAIプロダクトの中心を「モデル」から「作業空間」へ少しずつ動かしている。最近の[Gemini 3.1 Proの日本語数学・コーディング強化](/blog/google-gemini-31-pro-deep-think-japanese-math-coding-2026/)も、単にモデルが賢くなった話ではなく、Geminiアプリ、NotebookLM、Gemini CLI、API、Vertex AIへ同じ系統を広げる流れとして出てきた。今回のnotebooksは、その配布戦略をユーザー体験側からつなぐピースだと言える。

AIツールの競争は、もう「会話が自然か」「ベンチマークが高いか」だけでは勝ち切れない。実際の仕事では、

- 調査を何日も続けられるか
- 関連資料を一か所に固定できるか
- 要約、図解、原稿化を行き来できるか
- 文脈を毎回貼り直さずに済むか

のほうが効く。Googleはそこにかなり正面から手を入れてきた。

## 料金、提供範囲、制約はどうなっているか

Googleによると、notebooks in Geminiはまず **Google AI Ultra、Pro、PlusのWebユーザー向けに今週から順次提供** される。その後数週間で、モバイル、ヨーロッパのより多くの国、そして無料ユーザーへ広げる予定だという。

ただし注意点もはっきりしている。Googleは脚注で、**18歳未満のアカウント、Workspaceアカウント、Educationアカウントでは利用できない** と明記している。

この制約は、日本市場でかなり重要だ。日本の生成AI導入は、個人課金の先進ユーザーが試した後に、会社のGoogle Workspaceや学校アカウントへ広げる流れになりやすい。でも今回の段階では、その橋がまだ完成していない。つまり、

- 個人や少人数チームは試しやすい
- 会社の公式アカウントではまだ標準化しにくい

という状態だ。

しかもGoogleがリンクしているNotebookLM Helpでは、planによってnotebookごとのsource上限が変わる。標準アクセスで50、Plusで100、Proで300、Ultraで600という設計だ。要するにnotebooksは「あると便利」ではなく、**どのプランでどの規模の知識ベースを回せるか** まで含めた製品なのだ。

## 日本の開発者・プロダクトチームには何がうれしいのか

日本でこの機能が効きそうなのは、コードを書く現場だけではない。むしろ、開発と非開発のあいだにある仕事に強い。

たとえば、

- プロダクトマネージャーが顧客インタビュー、競合資料、要件メモを1つのnotebookに集める
- エンジニアが設計資料、既存仕様、関連PDFをまとめて整理する
- マーケ担当が市場調査、広告原稿、競合比較を継続的に育てる
- 事業企画が法令メモや業界資料をnotebook化し、NotebookLMで理解を深めてGeminiで企画書にする

といった流れがかなり組みやすくなる。

特に日本の組織では、「AIチャットは便利だが、案件ごとの文脈が散らばって管理しにくい」という不満が出やすい。notebooksはそこに直接効く。会話だけではなく、資料と指示をまとめて持てるからだ。

一方で、大企業の本格導入という意味ではまだ途中段階でもある。Workspaceアカウントが対象外なので、情報管理、監査、社内共有、権限設計まで含めた企業標準ツールとしては、もう一歩必要になる。ここはGoogleが後からどう広げるかを見たい。

## いま見るべきポイント

ここから先は僕の見方だけど、今回のnotebooks投入で見るべきポイントは3つある。

1つ目は、GoogleがGeminiを「回答生成アプリ」ではなく「仕事の拠点」に変えようとしていること。

2つ目は、NotebookLMを別ブランドの実験ツールとして残すのではなく、Geminiの中核ワークフローへ接続し始めたこと。

3つ目は、個人向け・準個人向けの有料導線から先に広げ、Workspace/Educationの厳しいガバナンス領域は後ろに置いていること。

この順番はかなり現実的だ。まずは速度を優先して体験を磨き、その後に企業向けの統制や共有モデルを整える。日本企業の導入担当者にとっては少しもどかしいが、Googleのプロダクト展開としては筋が通っている。

## まとめ

Googleの2026年4月8日の発表は、Geminiに整理機能が増えたという話ではない。**GeminiとNotebookLMの間に、案件単位の共有知識ベースを作った** ことが本質だ。

今回のnotebooksによって、Googleは

- チャット
- 添付資料
- カスタム指示
- NotebookLMのリサーチ機能
- Geminiの文章化と検索

を一つの流れへ寄せ始めた。

日本の開発者やプロダクトチームにとっては、AIを毎回の会話で使う段階から、**継続プロジェクトの作業空間として使う段階** へ進めるきっかけになる。一方で、Workspace/Educationがまだ対象外という制約も大きい。今は「個人や小チームで触り、企業導入の形を先回りして考える」フェーズだろう。

## 出典

- [Try notebooks in Gemini to easily keep track of projects](https://blog.google/innovation-and-ai/products/gemini-app/notebooks-gemini-notebooklm/) - Google, 2026-04-08
- [Gemini Drops: New updates to the Gemini app, December 2025](https://blog.google/products-and-platforms/products/gemini/gemini-drop-december-2025/) - Google, 2025-12
- [Upgrade NotebookLM](https://support.google.com/notebooklm/answer/16213268) - NotebookLM Help, accessed 2026-04-10
