---
title: 'Sakana AI「Sakana Marlin」とは？——日本発のUltra Deep Researchは経営企画と金融をどう変えるのか'
description: 'Sakana AIが2026年4月2日、商用第1弾のAIリサーチアシスタント「Sakana Marlin」のβテストを開始した。8時間近い自律調査、AB-MCTS、AI Scientist由来のワークフロー、MUFGとCitiの文脈を踏まえ、日本企業にとっての意味を整理する。'
pubDate: '2026-04-06'
category: 'news'
tags: ['Sakana AI', 'Sakana Marlin', 'ディープリサーチ', 'AIエージェント', '金融AI', '経営戦略']
draft: false
---

Sakana AIが4月2日、商用プロダクト第1弾としてAIリサーチアシスタント[「Sakana Marlin」](https://sakana.ai/marlin-beta/)のクローズドβテストを始めた。発表の中でSakana AIは、Marlinを**「Virtual CSO」**と位置づけ、プロンプトを渡すだけでAIが**8時間近く**自律的に調査し、**構造化されたサマリースライドと数十ページの調査レポート**を返すと説明している。

このニュースが大きいのは、日本のAI企業がまた新しいチャットUIを出した、という話ではないからだ。僕はむしろ、**日本企業の重い意思決定業務そのものを取りにきた**発表だと思っている。OpenAIのdeep research以降、「AIが調べてまとめる」機能は珍しくなくなった。でもSakana Marlinは、一般ユーザーの便利機能ではなく、経営戦略、金融、シンクタンク、コンサルのような**高単価で説明責任が重い仕事**に最初から照準を合わせている。

## 何が発表されたのか

まず事実関係を整理する。

Sakana AIによると、Marlinは同社初の商用プロダクトで、4月2日からβテスター募集を開始した。対象は**金融機関、事業会社の経営戦略・事業企画部門、コンサルティングファーム、シンクタンク、調査会社**など、日常的に重い調査業務を抱える組織だ。β期間中の利用は無料とされている。

出力物もかなり明確だ。Marlinは、ただの回答文ではなく、**スライドと包括的なレポート**を出す。公式の例では、トランプ第2期政権の通商政策が日本企業へ与える影響を分析した**61ページのレポート**や、日本の金融業界における生成AIの影響を整理した**78ページのレポート**が紹介されている。しかもどちらも、日本企業や日本の金融機関にどう効くかまで踏み込んでいる。ここはかなり重要だ。英語圏の一般論を並べるだけの「AIレポート」とは狙いが違う。

さらにSakana AIは、既存のチャットサービスに搭載されたリサーチ機能と比較して、Marlinは**情報の深掘りで高い実用性**を得たという先行フィードバックがあったと説明している。ただし、ここはSakana AI自身の評価なので、ベンチマーク条件や第三者比較がまだ出ていない点は冷静に見ておきたい。

## 何がそんなに違うのか

OpenAIは2025年2月に[deep research](https://openai.com/index/introducing-deep-research/)を発表し、複雑な調査をインターネット上で多段に実行し、**人間なら何時間もかかる仕事を数十分でこなす**エージェント機能として打ち出した。GoogleもGeminiで[Deep Research](https://blog.google/products-and-platforms/products/gemini/new-gemini-app-features-march-2025/)を広げ、複数ページのレポートを一般ユーザーにも配り始めている。

つまり、「AIがWebを調べて長いレポートを書く」こと自体は、もう新カテゴリではない。

それでもMarlinに意味があるのは、Sakana AIが競争軸を**汎用チャット**ではなく**高負荷な意思決定支援**に置いたからだ。公式の言葉を借りれば、Marlinは数人のCSOチームが数週間かけるような戦略調査を担う設計だという。これはかなり野心的だし、同時に検索上も強い。「Sakana Marlinとは」「Sakana AI deep research」「日本企業向け deep research」といったクエリで、知りたいのはまさにこの違いだからだ。

## Marlinを支える技術

Sakana AIの説明では、Marlinの土台は大きく2つある。

1つは[AB-MCTS](https://sakana.ai/ab-mcts-jp/)だ。これはAdaptive Branching Monte Carlo Tree Searchの略で、Sakana AIが2025年に発表した推論時スケーリング手法である。単に「長く考える」のではなく、**どの仮説を深掘りするか、どこで別ルートを試すか、どのモデルを使うか**を探索的に配分する。Sakana AIはこの研究で、複数のフロンティアモデルを組み合わせるAB-MCTSが、ARC-AGI-2で各モデル単体を上回ったと説明している。

もう1つは[AI Scientist](https://www.nature.com/articles/s41586-026-10265-5)由来のワークフロー自動化だ。Nature掲載論文では、AI Scientistがアイデア生成、実験、分析、論文執筆、レビューまでをまたぐ研究サイクルを自律実行し、さらに**推論時により多くの計算資源を与えるほどアウトプット品質が上がる**傾向が示されている。Marlinはこの知見を、科学研究ではなくビジネス調査へ持ち込んだ。

ここが面白い。多くのリサーチAIは「検索して要約する」寄りだが、Marlinはそこから一段進んで、**仮説を立て、掘り、捨て、構造化して最終成果物まで閉じる**方向に寄せている。Sakana AIがわざわざ「回答」ではなく「スライドとレポート」を前面に出しているのは、その違いを意識しているからだろう。

## ここからは僕の見方だけど、日本市場との相性がかなりいい

日本企業でAI導入が止まりやすい理由は、モデル性能が足りないからではない。実際には、**どの業務に入れると投資対効果が見えやすいか**と、**説明責任をどう持つか**で止まることが多い。

その点、Marlinの狙いはかなり現実的だ。Sakana AIは2025年に[MUFGと包括的パートナーシップ](https://sakana.ai/mufg/)を結び、2026年3月には[融資業務を支援するAIエージェント](https://sakana.ai/mufg-ai-lending/)の実案件検証フェーズ入りも発表している。検証には約100名が参加し、全国展開を視野に入れているという。さらに2026年2月には、Sakana AIは[シティグループから戦略投資](https://sakana.ai/citi/)を受け、Citi側は同社を「日本市場を大きく革新するリーディングAI企業」と評価した。

要するに、Marlinは単なる研究デモではない。**金融のように厳しく、導入ハードルが高い業界で先に足場を作ってから、意思決定支援へ横展開しようとしている**。これは日本市場ではかなり強い順番だと思う。

## 日本の企業、開発者、プロダクトチームにどう効くか

経営企画や事業企画にとっては、まずリサーチの初速が変わる。市場調査、競争環境整理、規制シナリオ整理、投資判断の論点出しといった仕事は、本来かなり人手を食う。Marlinがそこを高品質に圧縮できるなら、会議前日に慌てて資料を継ぎ接ぎする仕事はかなり減るはずだ。

開発者やプロダクトチームにとっても無関係ではない。最近このサイトで書いた[Google、Gemini APIにFlexとPriorityの2つのservice tierを追加](/blog/google-gemini-api-flex-priority-2026/)の話ともつながるが、長時間動くエージェントが本当に業務へ入ると、価値を決めるのはUIの派手さよりも**バックグラウンド推論の質、コスト、監査可能性**になる。Marlinはそのうち「質」に全振りした例として見ると分かりやすい。

特に日本市場では、英語圏のAIツールをそのまま入れると、資料の前提や法制度、組織文化、稟議文脈のズレで詰まりやすい。Sakana AIが日本の金融機関や大企業向けの案件で知見を積んでいるなら、そのローカル性自体が競争力になる。

## まだ見極めるべき点

一方で、未確定な点も多い。

まず、正式な料金体系はまだ出ていない。今わかっているのはβ期間中無料ということだけだ。次に、精度評価の詳細も公開されていない。既存チャットサービスより深掘りできたという説明はあるが、**どのタスクで、どの比較対象に、どう勝ったのか**は今後の検証待ちだ。

さらに、実運用で重要な論点も残る。たとえば、ソースの信頼度評価、引用の透明性、途中経過の監査、社内データとの接続方法、機密文書を扱うときの権限制御などだ。金融や経営判断に使うなら、このあたりがプロダクト採用の決定打になる。

## まとめ

Sakana Marlinは、「日本でもdeep researchが出た」という程度のニュースではない。僕はむしろ、**日本発のAI企業が、最初から高難度の意思決定業務を取りにいく**動きとして見ている。

OpenAIやGoogleが一般化したリサーチAIの流れを受けつつ、Sakana AIはそこにAB-MCTSとAI Scientist由来の長期推論・自律ワークフローを載せ、さらにMUFGやCitiの文脈で金融と戦略へ接続してきた。もしここで品質と監査性が本当に立つなら、Marlinは便利機能ではなく、**日本企業の意思決定インフラ**として見られ始めるかもしれない。

## 出典

- [新しいBusiness Intelligenceへ：Ultra Deep Researchアシスタント「Sakana Marlin」βテスト開始](https://sakana.ai/marlin-beta/)
- [「集合知」と「試行錯誤」によるフロンティアAIの推論時スケーリング](https://sakana.ai/ab-mcts-jp/)
- [Towards end-to-end automation of AI research | Nature](https://www.nature.com/articles/s41586-026-10265-5)
- [MUFGとSakana AIの「AI融資エキスパート」、実案件での検証フェーズへ](https://sakana.ai/mufg-ai-lending/)
- [Announcing a Strategic Investment from Citi](https://sakana.ai/citi/)
- [Introducing deep research | OpenAI](https://openai.com/index/introducing-deep-research/)
- [Gemini app updates: Deep Research, connected apps, personalization](https://blog.google/products-and-platforms/products/gemini/new-gemini-app-features-march-2025/)
