---
title: 'WalkMe Q2 AI、業務画面内ガバナンス実装の要点'
description: 'WalkMe Q2 2026のContextual AI AssistanceとAI Usage Dashboardを整理。日本企業が業務画面内AI、SAP移行、利用量管理をどう設計すべきかを解説する。'
pubDate: '2026-05-18'
category: 'news'
tags: ['WalkMe', 'SAP', '業務AI', 'AIガバナンス', '企業導入']
draft: false
---

WalkMe が **2026年5月18日提供開始** として整理した Q2 '26 Product Release は、AI チャットの機能追加として読むより、**業務画面の中に AI 支援、利用量管理、研修コンテンツ、管理コンソールをまとめる更新** として見るべきだ。公式ページは 5月17日に更新され、Contextual AI Assistance、WalkMe Learning Arc、Enterprise-grade operability and governance を大きな柱としている。

日本企業にとって重要なのは、WalkMe が AI を「別画面で質問するもの」ではなく、社員が普段使う Salesforce、SAP S/4HANA、SuccessFactors、ServiceNow などの画面上で動く支援として位置づけている点だ。これは以前取り上げた[SalesforceのSlack標準化で営業AI運用はどう変わるか](/blog/salesforce-slack-ai-work-platform-2026/)や[Microsoft 365 Copilot更新、AI業務設計の焦点](/blog/microsoft-365-copilot-cowork-agent-2026/)と同じく、AI の主戦場がモデル単体から「実際の仕事が流れる画面」へ移っていることを示している。

以下では、まず公式ソースで確認できる事実を整理し、その後で日本企業の情シス、DX推進、業務部門、研修部門がどう読むべきかを分けて考える。

## 事実: Q2 release は5月18日から段階提供される

WalkMe の Q2 '26 Product Release は、US と EU で **2026年5月18日** から提供される。データセンター別には、Canada が 5月25日、FedRAMP が 6月1日、SAP が 6月8日という順番だ。対象は WalkMe Digital Adoption と WalkMe Learning Arc で、既存実装は更新を publish するまで影響を受けないと説明されている。

更新の中核は3つある。1つ目は **Contextual AI Assistance**。Smart Highlights、AI Content in the Solutions Gallery、AI Usage Dashboard、画面文脈を読む AI Chat、Action Bar の一括展開が含まれる。2つ目は **Integrated Digital Learning**。Learning Arc で、コース全体、特定 lesson、個別 paragraph という粒度で AI authoring を使えるようになり、音声ナレーション、Learning Journeys、SAP Enable Now 移行、simulation 強化も入った。3つ目は **Enterprise-grade operability and governance**。Admin Center の Console 統合、Survey の分岐ロジックと SCIM IDP 連携、Desktop Guidance analytics、Mobile Guidance in Console、iOS/iPadOS Safari extension が並ぶ。

ここで大事なのは、AI 機能だけを切り出していないことだ。WalkMe は、AI が業務画面で何を見て、どのテンプレートから始め、どのくらい使われ、誰が管理し、どう研修コンテンツへつながるかを一つの release にまとめている。

## 事実: Smart Highlights は既存権限を前提に業務データを画面内へ出す

Smart Highlights は、社員が使っているアプリ内で、ServiceNow、SAP S/4HANA、SuccessFactors、Salesforce などの情報を直接表示する機能だ。公式説明では、追加 API 設定を必要とせず、既存のユーザー権限を尊重し、ユーザーがすでに閲覧を許可されている情報だけを出すとされている。

これは日本企業の実務にかなり近い。営業、CS、購買、経理、HR の現場では、情報の本体は基幹システムや SaaS にあるが、実際の作業はメール、社内ポータル、CRM、チケット画面、SAP GUI、ブラウザ上の周辺システムに分かれている。AI を入れても、毎回別画面で検索したり、文脈をコピーしたりするなら現場負担は残る。Smart Highlights の狙いは、画面上の人物、企業、チケット、アカウントのような entity を見つけ、必要なデータをその場で引くことだ。

この流れは、[AWSがAmazon Quickをデスクトップ化。日本企業は「常駐AIアシスタント」をどう試すべきか](/blog/amazon-quick-desktop-free-plus-2026/)で見た「ローカルや業務画面に近い AI」とも重なる。ただし WalkMe の場合、焦点は個人の常駐アシスタントよりも、企業システム横断のガイダンスと定着支援にある。

## 事実: AI Usage Dashboard は「使われたか」だけでなく「どこで消費したか」を見る

AI Usage Dashboard は、組織内の AI unit 消費を集中管理するための画面だ。公式ページでは、期間、システム、AI capability ごとに消費量を見られると説明されている。利用量は、Pinned AI、AI Knowledge Referencing、On-Demand AI、AI Knowledge Indexing、Joule Action Bar On Demand、Joule Action Bar Proactive などの capability に分かれる。

特に重要なのは、WalkMe が AI unit の計算概念まで出していることだ。たとえば Pinned AI は 100 interactions の block、AI Knowledge Indexing は 1,000 interactions の block として扱われる。On-Demand AI や AI Knowledge Referencing は 1 interaction 単位で計測される。公式ページは、現在の transaction rates は最終確定前で変更され得るとも注記している。

これは、AI ガバナンスを「利用可否」だけでなく **利用量、予算、ROI、課金準備** の問題として扱う姿勢だ。生成 AI 導入では、最初は無料枠や promotional period で試しても、本番展開時にどの部署がどれだけ使い、どの機能が価値を出しているのかが問題になる。AI Usage Dashboard は、その判断材料を WalkMe 内に持たせる更新と言える。

## 事実: Proactive AI は AI Center、Action Bar、Memory、Dashboard をつなぐ

WalkMe の Proactive AI getting started ページでは、AI 支援を有効にするための流れがもう少し運用寄りに説明されている。AI Center で社内ドキュメントや Web ページなどの knowledge sources を処理し、Action Bar で reading、writing、summarize、translate、tone adjustment などの AI skills を出し、AI Launchers や AI Conditions で業務画面の状況に応じて表示する。Memory はユーザーの過去行動や個人設定をもとに提案を調整する位置づけだ。

この構造を見ると、WalkMe は「AI Chat を一つ置く」のではなく、**知識ソース、画面文脈、行動提案、記憶、利用状況の可視化** をセットで運用させようとしている。以前取り上げた[Google「Workspace Intelligence」発表。日本企業は“文脈共有AI”をどこまで許可すべきか](/blog/google-workspace-intelligence-admin-controls-2026/)では、社内文脈を AI にどこまで渡すかが論点だった。WalkMe の場合は、その文脈がメールやドライブだけでなく、業務アプリ上の動作とガイダンスに寄っている。

## 分析: 日本企業は「業務AIの現場定着レイヤー」として見るべき

ここからは分析だ。

WalkMe Q2 '26 の更新は、OpenAI、Microsoft、Google、Salesforce のような大規模 AI プラットフォームの発表とは少し違う。新しい基盤モデルや汎用 AI エージェントを前面に出すのではなく、既存業務アプリの上に、AI 支援と定着支援を重ねる発想が強い。

日本企業では、SAP、Salesforce、ServiceNow、SuccessFactors、独自ポータル、Excel 運用が複雑に混ざりやすい。AI チャットを導入しても、現場で本当に詰まるのは「どの画面で、どの項目を見て、次に何をするか」だ。WalkMe はもともと digital adoption の文脈を持つため、今回の AI 更新も、社員が仕事をしている画面に直接入る形になっている。

その意味で、評価軸は「回答が賢いか」だけでは足りない。見るべきなのは、既存権限をどこまで尊重できるか、AI unit をどの単位で追えるか、Action Bar をどのシステムに出すか、Learning Arc の研修コンテンツとどうつなぐか、SAP Enable Now からの移行をどう扱うかだ。

## 確認すべきこと

日本企業がまず確認すべき点は5つある。

1つ目は、対象システムの棚卸しだ。Smart Highlights や Action Bar を出すなら、Salesforce、SAP S/4HANA、SuccessFactors、ServiceNow、社内 Web アプリのうち、どこが最初の対象かを絞る必要がある。いきなり全社横断にすると、効果測定も権限管理も曖昧になる。

2つ目は、既存権限との整合だ。WalkMe は既存権限を尊重すると説明しているが、実際の運用では role、group、IDP、SCIM、データセンター、監査ログの確認が必要になる。特に日本企業では、基幹系と SaaS の権限設計が別々に管理されていることが多い。

3つ目は、AI unit の予算管理だ。AI Usage Dashboard があるなら、PoC の時点から capability ごとの消費を見ておくべきだ。よく使われる機能が本当に業務時間を短縮しているのか、単に物珍しさで使われているのかを分けて見る必要がある。

4つ目は、研修と業務定着の接続だ。Learning Arc の AI authoring、Learning Journeys、simulation 強化は、単なる LMS 機能ではない。新システム導入や SAP Enable Now 移行で、社員がどこでつまずくかを WalkMe 側で観測し、研修と画面内ガイダンスへ戻す循環を作れるかが焦点になる。

5つ目は、利用開始地域とデータセンターだ。US/EU と SAP/FedRAMP/Canada では rollout 日が違う。日本企業が SAP 系の利用やグローバル拠点展開を考えるなら、6月以降の提供タイミングと契約上のデータ所在を確認する必要がある。

## まとめ

WalkMe Q2 '26 Product Release は、AI を別画面のチャットから、社員が実際に使う業務画面、研修、利用量管理、管理コンソールへ埋め込む更新だ。Smart Highlights、AI Chat、AI Usage Dashboard、Learning Arc、Console 統合を合わせて見ると、焦点は **AI を導入すること** ではなく、**AI が現場で安全に使われ続ける状態をどう作るか** にある。

日本企業は、WalkMe を大手 AI モデルの代替としてではなく、SAP や Salesforce など既存業務アプリの上に置く **現場定着とガバナンスのレイヤー** として評価するのが現実的だ。最初の検証では、対象部署を絞り、AI unit、権限、画面内支援、研修効果を同時に測るべきだろう。

## 出典

- [Q2 '26 Product Release](https://support.walkme.com/knowledge-base/q2-26-product-release/) - WalkMe Help Center, 2026-05-17
- [AI Usage Dashboard](https://support.walkme.com/knowledge-base/ai-usage-dashboard/) - WalkMe Help Center, 2026-05-17
- [Proactive AI: Getting Started](https://support.walkme.com/knowledge-base/walkme-ai-guide/) - WalkMe Help Center, 2026-05-17
