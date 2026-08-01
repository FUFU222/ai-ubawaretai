---
article: 'google-gemini-robotics-er2-physical-agents-2026'
level: 'child'
---

Google は2026年7月30日、Gemini APIで **Gemini Robotics ER 2** をpublic previewとして使えるようにしました。これは、チャットで文章を書くAIというより、ロボットや現場カメラが見ている状況を理解し、作業の進み具合や次の確認点を考えるためのモデルです。

大事なのは、すぐに工場のロボットを全部自動化できる、という話ではないことです。むしろ、現場でAIを使う前に「どの映像を見せるのか」「AIが間違えたら誰が止めるのか」「人の顔や作業情報をどう守るのか」を考えるきっかけになります。

## 何が新しいのか

ふつうの画像AIは、写真を見て「箱があります」「工具があります」と説明できます。Gemini Robotics ER 2 が狙っているのは、それより一歩進んだ理解です。たとえば、動画を見て作業がどの段階にあるか、ものをつかみ損ねた瞬間はどこか、人が近づいたので止まるべきか、といった時間の流れを含む判断です。

この点は、以前の [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) と比べると分かりやすいです。Managed Agents は、ソフトウェア上のエージェントを動かすための基盤でした。今回の ER 2 は、カメラ、ロボット、作業現場のような物理世界へ近づいた更新です。

## 日本企業ではどこに効くのか

日本では、製造、物流、設備点検、小売、インフラ保守のように、現場作業が多い産業がたくさんあります。そこでは、AIが文章を要約するだけでなく、現場で何が起きているかを理解する力が必要になります。

たとえば倉庫では、ピッキング作業が予定通り進んでいるかを映像から確認できます。工場では、点検手順のどこまで終わったかを記録できます。ロボットの検証環境では、失敗した動作の瞬間を見つけて、改善に使えます。

ただし、現場AIは便利さだけでは判断できません。[PFNのPLaMo-VL](/blog/pfn-plamo-vl-physical-ai-2026/) の記事でも触れたように、Physical AIではカメラ映像、現場の安全、説明できる判断が重要です。AIが何を見てそう言ったのか、人間が確認できる形にする必要があります。

## 先に決めるべきこと

最初に決めるべきなのは、AIに何を任せないかです。人の安全に関わる停止判断、製品の最終合否、医療や介護に近い判断を、いきなりAIだけに任せるのは危険です。

まずは、作業ログの整理、進捗の説明、失敗場面の切り出し、担当者への確認ポイント提示のように、人間を助ける用途から始めるのが現実的です。[Gemini Interactions API](/blog/google-gemini-interactions-api-ga-2026/) のような会話型の仕組みと組み合わせる場合も、AIの回答をそのままロボット操作へつなげるのではなく、人間の承認をはさむ設計にしたいところです。

また、映像データの扱いも重要です。工場や倉庫の映像には、人の顔、名札、機密設備、荷主情報が映ることがあります。撮影範囲を絞る、顔をぼかす、保存期間を短くする、誰が見られるかを決める、といった準備が必要です。

## どう試すとよいか

試すときは、きれいな成功例だけを使わないことが大切です。暗い場所、物が隠れる場面、似た部品が並ぶ場面、作業者が途中で戻る場面、日本語の指示があいまいな場面も入れて評価します。

そして、ER 2 はpublic previewです。古いER 1.6 previewは2026年8月31日に廃止予定とされているため、すでに試しているチームは移行も必要になります。[Gemini 3.5 Flashのstable運用](/blog/google-gemini-35-flash-api-stable-agents-2026/) と同じように、previewと本番利用は分けて考えるべきです。

## まとめ

Gemini Robotics ER 2 は、GoogleのGemini APIがロボットや現場AIへ近づいた大きな更新です。日本企業にとっては、製造や物流の現場でAIをどう使うかを考える材料になります。

ただし、重要なのはモデル名ではありません。映像をどう守るか、AIが間違えたとき誰が止めるか、どの作業なら人間の支援として使えるかを決めることです。そこまで設計して初めて、Physical AIのPoCは本番判断に近づきます。

## 出典

- [Release notes | Gemini API](https://ai.google.dev/gemini-api/docs/changelog) - Google AI for Developers
- [Introducing Gemini Robotics ER 2](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-robotics-er-2/) - Google DeepMind
- [Gemini Robotics ER | Gemini API](https://ai.google.dev/gemini-api/docs/robotics-overview) - Google AI for Developers
