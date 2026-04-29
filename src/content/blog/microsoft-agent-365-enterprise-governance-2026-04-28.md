---
title: 'Microsoft「Agent 365」とは？ 5月1日GA前に日本企業が確認すべき統制ポイント'
description: 'Microsoftが2026年4月28日にMicrosoft IQとAgent 365を改めて訴求。5月1日の一般提供、価格、ライセンス、統制機能を一次ソースで整理し、日本企業が社内AIエージェント導入で何を確認すべきかを解説する。'
pubDate: '2026-04-29'
category: 'news'
tags: ['Microsoft', 'Agent 365', 'Microsoft IQ', 'AIガバナンス', 'Copilot', 'エンタープライズAI']
draft: false
---

Microsoftが2026年4月28日に公開した[「Unlocking human ambition to drive business growth with AI」](https://blogs.microsoft.com/blog/2026/04/28/unlocking-human-ambition-to-drive-business-growth-with-ai/)は、新しいモデル発表ではない。主題は、**AIエージェントを企業内でどう増やし、どう制御するか**だ。Microsoftはこの文脈で、組織固有の文脈を扱う「Microsoft IQ」と、エージェントの可視化・統制・セキュリティを担う「Agent 365」をセットで再提示した。

日本企業にとって重要なのは、これが単なるCopilotの宣伝ではなく、PoC後に起きがちな「エージェント乱立」の管理問題へ商品として答えを出しにきている点だ。しかも2026年5月1日には、Microsoft自身が3月9日の公式発表で予告したとおり、Agent 365の一般提供が始まる予定になっている。4月29日時点で参照できるMicrosoft Learnの[Agent 365 overview](https://learn.microsoft.com/en-us/microsoft-agent-365/overview)でも、GA日は2026年5月1日、一般提供後はユーザー単位ライセンスになると明記されている。

この記事では、4月28日の発信を起点に、**何が事実として確認できるのか**と、**日本企業は何を先に確認すべきか**を分けて整理する。

## 4月28日時点で何が再確認されたのか

まず事実から見る。

4月28日のMicrosoft公式ブログでは、企業向けAIの基盤を「Intelligence + Trust」と表現し、その実体としてMicrosoft IQとAgent 365を位置づけた。ブログの説明では、Microsoft IQは企業データに文脈を与え、チャット、成果物生成、エージェント開発にまたがって、より正確で信頼できる体験をもたらす役割を持つ。一方のAgent 365は、Microsoft製だけでなくサードパーティー環境で作ったエージェントも含め、可視化、ガバナンス、セキュリティを提供するとされている。

ここで注目すべきなのは、「どのモデルを使うか」よりも「組織の中でどう運用を管理するか」が前面に出ていることだ。4月28日の記事では、BMW Groupの大規模Copilot導入、Accentureの74万人超への展開、Air Indiaの顧客対応AI、Cemexの経営可視化エージェント、KPMGのFabric統合など、導入事例を大量に並べている。つまりMicrosoftは、エージェント活用を個別実験ではなく、企業全体の実務基盤として語っている。

この見方は、3月9日の[「Introducing the First Frontier Suite built on Intelligence + Trust」](https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/)とも整合する。そこではAgent 365を「AI agents の control-plane」と位置づけ、2026年5月1日に一般提供、価格は1ユーザーあたり15ドルと発表していた。さらにMicrosoft 365 E7を1ユーザーあたり99ドルで提供し、E5、Entra Suite、Copilot、Agent 365を束ねる構成にすると説明している。

つまり4月28日の発信は、3月の価格・GA発表を受けて、「実際に大企業でどう使われ始めているか」を事例で補強する続報と見てよさそうだ。

## Agent 365で何が管理できるのか

次に、Agent 365の中身を一次ソースで確認する。

Microsoft Learnの[Overview of Microsoft Agent 365](https://learn.microsoft.com/en-us/microsoft-agent-365/overview)では、Agent 365の役割を `Observe` `Govern` `Secure` の3つで整理している。Observeでは、Microsoft 365 admin center内の中央レジストリで、エージェント採用状況、活動、健全性を一元表示すると説明されている。Governでは、Microsoft Entra、Microsoft Purview、管理センターを通じて、ライフサイクル管理、アクセス制御、コンプライアンスを統合するとしている。Secureでは、Entraによるアクセス管理、Purviewによる情報保護とDLP、Defenderによる脅威検知を組み合わせ、エージェントの不正アクセスや情報漏えいを抑える構図が示されている。

この整理はかなり重要だ。多くの企業では、AIエージェント導入の議論が「何が作れるか」に寄りがちだが、本番導入で先に問題になるのはむしろ次のような点だからだ。

1つ目は、誰がどのエージェントを使っているか見えないこと。  
2つ目は、エージェントにどの権限を委任したか追えないこと。  
3つ目は、社内データに触るエージェントをセキュリティ部門が監査できないこと。

Agent 365は、この3点に対してMicrosoft 365、Entra、Purview、Defenderの既存管理面をそのまま延長して対応しようとしている。日本企業にとってはここが実務上の本丸だ。新しいAIツール単体を追加するより、すでに導入済みのMicrosoft管理基盤へ寄せられるなら、情シスや監査部門に説明しやすい。

一方で、4月29日時点のLearn文書にはまだ「Frontier preview program」に関する説明も残っている。これは過渡期のドキュメント状態と見られるが、少なくともMicrosoft自身は同じ文書内で「一般提供は2026年5月1日」「一般提供ではユーザー単位ライセンス」「OBOで動くエージェントはそのユーザーのAgent 365またはE7ライセンスでカバー」と明記している。したがって、今の時点で読むべきなのは、**機能とライセンスの最終像は見えてきたが、運用手順や販売チャネル情報はまだ更新途上**という点だ。

## 価格、販売、ライセンスで押さえるべきこと

価格面では、3月9日のMicrosoftブログにある「Agent 365は15ドル/ユーザー」「Microsoft 365 E7は99ドル/ユーザー」が基準線になる。さらにMicrosoft LearnのAgent 365 overviewでは、GA後のライセンスは「エージェントごと」ではなく「ユーザーごと」で、対象ユーザーの代理で動くエージェントはそのユーザーのライセンスでカバーされると説明されている。

これは日本企業にとって地味に大きい。エージェント数単位課金だとPoCと本番でコスト計算が急変しやすいが、ユーザー単位なら予算化しやすい。特に、部門ごとに複数エージェントを走らせるケースでは、**エージェント数より誰の業務代理として動くか**で設計を整理しやすくなる。

販売チャネル面では、Partner Centerの[April 2026 announcements](https://learn.microsoft.com/en-us/partner-center/announcements/2026-april)に、2026年5月1日からMicrosoft 365 E7がCSPで月次、年次、3年契約で取引可能になるとある。ここで重要なのは、MicrosoftがAgent 365を単体機能だけでなく、Copilot、Entra、Defender、Purviewまで含めたパッケージ提案へ寄せていることだ。日本の大企業や中堅企業では、AIエージェント導入は個別部署のSaaS購入より、既存Microsoft契約の拡張として扱われるほうが通しやすい。E7の設計は、その現場事情にかなり合っている。

ただし、4月28日の記事自体は価格や日本リージョン対応、国内サポート体制、監査ログの保持期間まで細かく示していない。よって現時点で言えるのは、**価格と販売の骨格は見えているが、個別導入条件は契約・サポート確認が必要**ということだ。

## ここから考察: 日本企業は何を先に確認すべきか

ここからは分析だ。

日本企業でAIエージェント導入が止まりやすいのは、モデル性能ではなく責任分界だからだ。誰が作ったエージェントか、どのデータへアクセスするか、誤動作時に誰が止めるか、業務部門が増やしたエージェントを情シスがどう把握するか。このあたりが曖昧だと、PoCは通っても本番化で失速する。

その意味でAgent 365の価値は、「新しい賢いエージェント」ではなく、**エージェントを企業内資産として管理するための共通管理面**にある。Microsoft製かサードパーティーかをまたいで観測・統制できるという4月28日の説明がそのまま使えるなら、今後の論点は次の3つに絞られる。

第1に、Microsoft 365中心で運用を統一したい企業にはかなり相性がよいこと。Entra、Purview、Defenderをすでに使っている組織なら、エージェントだけ別管理にしなくて済む可能性がある。

第2に、Copilot導入済み企業ほどAgent 365を別物としてではなく、「AIの本番運用レイヤー」として評価したほうがよいこと。Copilot利用者が増えるほど、部門固有エージェントや業務自動化が増え、可視化と権限統制の必要性が急に上がる。

第3に、費用対効果の見方を変える必要があること。15ドル/ユーザーという価格だけを見ると安く感じるが、実際の判断はPurview、Defender、E7化、社内ポリシー整備、ログ監査、教育まで含めた総コストで見るべきだ。

特に日本では、生成AIの本番導入が「使ってよいか」から「どう管理して増やすか」へ移りつつある。4月28日のMicrosoft発信は、この局面をかなり意識したものだと読める。

## まとめ

2026年4月28日のMicrosoftブログは、新機能単体の発表ではなく、Microsoft IQとAgent 365を通じて、企業AIを「知能」と「統制」の両輪で運用する構図を改めて前面に出したものだった。3月9日の発表とMicrosoft Learnを合わせると、Agent 365は2026年5月1日に一般提供、価格は15ドル/ユーザー、Microsoft 365 E7は99ドル/ユーザーという基準線が見えている。

日本企業にとっての論点は、Agent 365がすごいかどうかより、**社内で増え続けるAIエージェントをどこまで可視化し、誰の権限で動かし、既存のM365/Entra/Purview/Defender運用へどう載せるか**にある。PoCの次へ進む局面にいる組織ほど、今のうちにここを確認しておく価値が大きい。

## 出典

- [Unlocking human ambition to drive business growth with AI](https://blogs.microsoft.com/blog/2026/04/28/unlocking-human-ambition-to-drive-business-growth-with-ai/) - Microsoft
- [Introducing the First Frontier Suite built on Intelligence + Trust](https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/) - Microsoft
- [Overview of Microsoft Agent 365](https://learn.microsoft.com/en-us/microsoft-agent-365/overview) - Microsoft Learn
- [April 2026 announcements - Partner Center announcements](https://learn.microsoft.com/en-us/partner-center/announcements/2026-april) - Microsoft Learn
