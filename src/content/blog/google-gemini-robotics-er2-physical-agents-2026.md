---
title: 'Gemini Robotics ER 2、現場AI導入の検証軸'
description: 'Gemini Robotics ER 2のpublic previewを整理。日本の製造、物流、ロボットSIが現場AIを試す前に見るべき安全、映像データ、低遅延、評価設計を解説する。'
pubDate: '2026-08-01'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', 'フィジカルAI', '開発者ツール', '企業導入', 'AIガバナンス']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google は **2026年7月30日**、Gemini API のリリースノートで **Gemini Robotics ER 2** の public preview を示した。DeepMind 側の発表では、ER 2 はロボットの「embodied reasoning」を支援する視覚言語行動モデルとして説明され、AI Studio と Gemini API から使える開発者向け入口が用意される。

この更新は、単なる新しいマルチモーダルモデルではない。Google の Gemini API が、テキスト、画像、動画、エージェント実行基盤に続き、物理世界で動くロボットや現場デバイスの判断支援へ踏み込んだことを意味する。既存の [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) や [Gemini Interactions API GA](/blog/google-gemini-interactions-api-ga-2026/) がソフトウェア上の agent 実行面を広げたのに対し、今回の ER 2 はカメラ映像、タスク進捗、ロボット操作、現場安全を同じ設計表へ載せる話になる。

日本企業にとって重要なのは、「ロボットが賢くなった」という抽象論ではない。製造、物流、設備保全、小売バックヤード、建設、介護、インフラ点検のような現場で、AI が何を見て、どの行動候補を出し、どの瞬間に止まり、どのログを残すかを検証できるかだ。ここを曖昧にしたまま導入すると、PoC は映えても本番判断に進みにくい。

## 事実: ER 2はGemini APIに入ったロボット向け推論モデル

Google AI for Developers のリリースノートでは、Gemini Robotics ER 2 が **2026年7月30日** に public preview として追加されたことが確認できる。ロボティクス向けドキュメントでは、ER 系モデルは Gemini のマルチモーダル能力を、ロボットが置かれた環境やタスク文脈の理解へ使うモデルとして整理されている。

DeepMind の発表では、ER 2 は Gemini 3.5 Flash を基盤にしたモデルとして位置づけられる。入力はテキスト、画像、動画を扱い、ロボットがカメラで見ている状況、過去の操作、タスク指示をもとに、次に何をすべきかを推論する用途が想定される。モデルカードでも、ER 2 はロボティクス向けの vision-language model であり、低遅延な対話や制御ループに近い使い方を念頭に置いた評価が示されている。

Google は、ER 2 の焦点として temporal understanding、つまり時間の流れを含む理解を強調している。静止画の物体認識だけなら、多くの VLM でもできる。ロボットで難しいのは、作業が今どの段階にあり、前の動作が成功したか、どの瞬間に介入すべきかを判断することだ。発表では、動画内の行動進捗を分類する評価や、特定イベントが起きた瞬間を探す評価が紹介されている。

もう一つの事実は、ER 1.6 からの移行だ。リリースノートでは、古い Gemini Robotics ER 1.6 preview が **2026年8月31日** に廃止される予定も示されている。すでに preview を触っていたチームは、単に新モデルを試すだけでなく、モデル ID、評価セット、ログ形式、失敗ケースを ER 2 前提で見直す必要がある。

## 分析: Physical AIはAPI選定だけでは決まらない

ここからは分析だ。ER 2 の意味は、Gemini API のモデル棚にロボット向けモデルが増えたことよりも、Physical AI の検証対象が変わることにある。

従来の生成AI導入では、比較対象は回答品質、料金、速度、コンテキスト長、社内データ接続が中心だった。ところがロボティクスでは、評価軸が一気に増える。カメラ映像の遅延、照明差、遮蔽、作業者との距離、緊急停止、ロボットAPIの制約、ネットワーク断、現場責任者の承認、作業記録、個人情報がすべて関係する。

この点は、国内文脈で扱った [PFNのPLaMo-VLとPhysical AI](/blog/pfn-plamo-vl-physical-ai-2026/) ともつながる。PFN の論点は、ロボット、ドローン、監視カメラ、自動車のような現場側デバイスで使える視覚言語モデルだった。Google の ER 2 はクラウド API と DeepMind のロボティクス研究から来るため、強みも制約も違う。日本企業は「国産か海外か」だけでなく、どの現場データをどこへ出せるか、どの推論を端末側に残すか、どの判断をクラウドに渡すかで比較する必要がある。

また、[JR東海とPFNのAIエッジデータセンター構想](/blog/jr-central-pfn-ai-edge-datacenter-2026/) で見たように、Physical AI は計算場所の設計と切り離せない。ER 2 を API で試すことは有効だが、工場や倉庫の本番では、通信遅延、閉域網、映像保存、海外送信、停止時の代替手順が先に問題になる。クラウド推論だけで成立するユースケースと、エッジ推論やローカル制御を併用すべきユースケースを分けたい。

## 事実: 低遅延ストリーミングと安全評価が主題になる

Google のロボティクス向けドキュメントでは、streaming を使った構成も説明されている。ロボットのカメラ映像や状態を逐次送って応答を得る場合、バッチで画像を投げる設計とは違い、遅延と安定性が重要になる。特に遠隔操作支援、作業進捗確認、動作の中断判断では、数秒遅れの回答では使いにくい。

ER 2 の発表では、タスク進捗理解や moment finding の評価が示されている。これは、単に「箱が見える」「部品が見える」という認識ではなく、「いま箱を閉じる直前か」「対象物をつかみ損ねた瞬間か」「人が近づいたので止めるべきか」に近い問題だ。日本の現場導入では、この時間軸の評価が特に重要になる。

安全面も同じだ。モデルカードとドキュメントは、ロボットの安全、個人データ、顔や人物を含む映像、利用者への通知や同意といった注意点を扱っている。ここは広告的な機能紹介より重い。工場のカメラ映像には従業員、外部委託先、来訪者、掲示物、設備情報が映り込む。物流倉庫では作業導線や荷主情報が含まれる。介護や医療周辺では要配慮情報に近い場面もあり得る。

したがって、ER 2 の PoC は、モデルの正答率だけでなく、映像の取り扱い設計から始めるべきだ。撮影範囲を限定する。人の顔をぼかす。保存期間を決める。学習利用の有無を確認する。失敗時にロボットが停止する条件を明文化する。現場担当者が AI の判断を上書きできる導線を作る。これらがないと、技術検証の結果を本番審査へ持ち込めない。

## 日本チームがまず試すべき用途

最初の用途は、人の安全や製品品質を AI が直接決める場面ではなく、人間の確認を速くする場面がよい。たとえば、設備点検の映像から「点検手順のどこまで終わったか」を推定する。倉庫ピッキングで、作業者が次に見るべき棚や箱を説明する。ロボットアームのデモ環境で、つかみ損ねや置き間違いの瞬間をログ化する。小売バックヤードで、補充作業の進捗を要約する。

こうした用途なら、ER 2 の temporal understanding と映像理解を試しつつ、最終判断は人間に残せる。AI が直接ロボットを動かす前に、まず「現場を説明する」「進捗を分類する」「失敗した瞬間を探す」役割で評価するほうが、社内合意を得やすい。

開発チームは、[Gemini 3.5 FlashのAPI stable運用](/blog/google-gemini-35-flash-api-stable-agents-2026/) と同じく、preview を本番標準へ直行させないことが重要だ。評価セットには、成功例だけでなく、照明が暗い、手が隠れる、作業者が途中で戻る、似た部品が並ぶ、日本語指示が曖昧、ネットワークが途切れる、といった失敗しやすいケースを入れる。

## まとめ

Gemini Robotics ER 2 の public preview は、Google の Gemini API がロボティクスと Physical AI に踏み込む重要な更新だ。特に、動画の時間軸理解、作業進捗、低遅延ストリーミング、安全評価が前面に出ている点は、日本の製造、物流、設備保全、現場DXにとって実務的な意味がある。

ただし、導入判断はモデル性能だけではできない。日本企業は、映像データの扱い、現場安全、エッジとクラウドの役割分担、既存ロボットAPI、停止条件、人間レビュー、評価セットを先に設計する必要がある。ER 2 は、ロボットを自律化する魔法の部品ではなく、現場AIを検証するための強い選択肢として扱うのが現実的だ。

## 出典

- [Release notes | Gemini API](https://ai.google.dev/gemini-api/docs/changelog) - Google AI for Developers
- [Introducing Gemini Robotics ER 2](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-robotics-er-2/) - Google DeepMind
- [Gemini Robotics ER | Gemini API](https://ai.google.dev/gemini-api/docs/robotics-overview) - Google AI for Developers
- [Robotics with streaming | Gemini API](https://ai.google.dev/gemini-api/docs/robotics-streaming) - Google AI for Developers
- [Gemini Robotics ER 2 - Model Card](https://deepmind.google/models/model-cards/gemini-robotics-er-2/) - Google DeepMind
