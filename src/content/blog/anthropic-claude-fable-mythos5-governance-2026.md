---
title: 'Claude Fable 5、1M文脈時代の企業導入設計'
description: 'Claude Fable 5は1M文脈と128k出力を備えるAnthropicの新モデル。日本企業が評価、クラウド調達、30日保持、Mythos 5限定提供をどう確認すべきか整理する。'
pubDate: '2026-06-11'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIエージェント', 'AIガバナンス', '企業導入', 'サイバーセキュリティ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年6月9日**、新モデル **Claude Fable 5** と **Claude Mythos 5** を発表した。Fable 5 は一般提供される最上位モデル、Mythos 5 は Project Glasswing の承認済み参加者向けに限定提供されるモデルという位置づけである。どちらも 1M token context window、128k max output tokens、always-on adaptive thinking を前提にしている。

日本企業にとって、この発表は単なるベンチマーク競争ではない。すでに [Project Glasswing拡大](/blog/anthropic-project-glasswing-expansion-critical-infra-2026/) では、Claude Mythos Preview 級のサイバー能力を防御側へ限定提供する設計を見た。今回の更新では、その流れが Fable 5 の一般提供と Mythos 5 の限定提供へ進み、モデル選定、クラウド調達、ログ、データ保持、安全審査を同時に考える必要が出てきた。

同じ Anthropic 系でも、[Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) や [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) は、長時間タスクや提供経路の話だった。Fable 5 / Mythos 5 は、その延長にある。より強いモデルを使えることより、どの業務で、どの経路から、どの証跡を残して使うかが重要になる。

## 事実: Fable 5は一般提供、Mythos 5は限定提供

Anthropic のモデル一覧では、Claude Fable 5 は `claude-fable-5` として、Claude API、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry で 2026年6月9日から一般提供される。一方、Claude Mythos 5 は `claude-mythos-5` として Project Glasswing の承認済み顧客向けに限定提供される。一般の開発者がセルフサービスで Mythos 5 を選べるわけではない。

この切り分けは重要だ。Fable 5 は「最も能力が高い一般提供モデル」として、開発、研究、分析、業務自動化に使える。一方、Mythos 5 は Mythos Preview の後継として、防御的サイバーセキュリティの文脈で扱われる。つまり、Anthropic は強い能力を一律公開するのではなく、一般提供モデルとアクセス制御されたモデルを分けている。

価格は、公開情報では Fable 5 / Mythos 5 ともに input 100万 token あたり10ドル、output 100万 token あたり50ドルとされる。これは安価な汎用モデルではない。日本企業が本番利用を考えるなら、単価だけでなく、長い context、長い出力、adaptive thinking による消費量のばらつきまで見積もる必要がある。

## 事実: 1M文脈と128k出力は評価方法を変える

Fable 5 / Mythos 5 は、1M token の context window と 128k token の最大出力を持つ。これは、長い仕様書、監査ログ、契約、設計資料、コードベース、調査メモをまとめて扱える可能性を広げる。一方で、長文を入れられることは、正しく使えることと同じではない。

API release notes では、Fable 5 と Mythos 5 が Claude Opus 4.7 で導入された tokenizer を使い、Opus 4.7 より前のモデルに比べると同じテキストがおおむね 30% 多く token 化される可能性があると説明されている。これは費用と latency の両方に効く。以前のモデルで「この文書量なら大丈夫」と見積もったプロンプトでも、新モデルでは token count を取り直すべきだ。

また、Fable 5 / Mythos 5 では adaptive thinking が唯一の thinking mode になる。`thinking: {"type": "disabled"}` は使えず、手動の extended thinking budget や assistant prefill もサポートされない。開発チームは、思考予算を固定して再現性を作るのではなく、effort、max tokens、タスク分割、ログ、評価セットで挙動を管理する必要がある。

## 事実: 安全策とデータ保持は導入条件になる

Fable 5 は安全 classifier を request 中と response generation 中に走らせ、拒否時には Messages API が `stop_reason: "refusal"` を返す。拒否カテゴリには既存の cyber / bio に加えて、モデル出力の複製や逆解析を制限する `reasoning_extraction` も加わった。これは、能力が上がるほど安全境界も製品仕様として前面に出ることを示している。

もう一つ大きいのはデータ保持だ。API release notes は、Claude Fable 5 が Claude API で 30日間の data retention を必要とし、zero data retention では使えないと説明している。日本企業では、個人情報、顧客コード、機密契約、医療・金融・公共領域のデータを扱う場合、この条件は調達判断そのものに関わる。

ここは [Claude containmentとエージェント安全境界](/blog/anthropic-claude-containment-agent-security-2026/) の延長で見るべきだ。強いモデルほど、秘密情報を入れてよいか、ログはどこへ残るか、拒否や fallback をどう扱うか、クラウド経由でどの地域に処理が流れるかを先に決める必要がある。

## 分析: 日本企業はベンチマークより評価再現性を見るべき

ここからは分析だ。

Fable 5 の発表は、コーディング、知識労働、視覚、科学研究、長時間のエージェント作業での強さを前面に出している。これは魅力的だが、日本企業が最初に見るべきなのは「どのベンチマークで勝ったか」ではない。自社の業務で、同じ入力、同じ評価基準、同じコスト条件で、何が改善するかである。

たとえば、コードレビュー、設計レビュー、セキュリティ調査、RFP回答、法務文書の論点抽出、製薬・素材研究の公開情報整理では、成功条件が違う。長い context が効く業務もあれば、短い問い合わせを大量に処理するほうが重要な業務もある。Fable 5 は最上位モデルとして評価すべきだが、全タスクを置き換える前提にすると費用と統制が崩れやすい。

実務的には、まず10から30件程度の代表タスクを作り、Opus 4.8、Sonnet 4.6、既存の社内標準モデルと比較する。評価項目は正確性だけでなく、根拠提示、拒否の扱い、出力の長さ、tool call の回数、token 消費、レビュー修正量、セキュリティ上の扱いやすさを含める。1M context を使うなら、長文投入時の引用ずれや古い情報の混入も見るべきだ。

## 分析: クラウド経路ごとに調達と監査を分ける

Fable 5 は Claude API だけでなく、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry でも提供される。これは日本企業には便利である。既存のクラウド契約、請求、IAM、ログ、ネットワーク、データ所在要件に合わせて選べる可能性があるからだ。

ただし、提供経路が増えるほど、同じ `Claude Fable 5` でも運用条件は同じとは限らない。Bedrock のグローバル/リージョナル endpoint、Vertex AI の endpoint、Foundry の context window、Anthropic 直接契約の data retention、クラウド側のログ保持はそれぞれ確認が必要になる。購買部門が「同じモデル名だから同じ」と扱うと、監査で説明できなくなる。

特に日本企業では、国内リージョン要件、委託先管理、個人情報保護、金融・医療・公共の業界ガイドライン、社内のクラウド利用基準が絡む。Fable 5 を選ぶ時は、モデル性能表だけでなく、契約経路、処理地域、保持期間、監査ログ、拒否ログ、fallback の請求単価を同じ判断表に置くべきだ。

## 導入前に確認すること

第一に、対象業務を絞る。Fable 5 は高能力だが高単価で、adaptive thinking により消費も変動する。まずは長い文脈と高い推論が効く、設計レビュー、セキュリティ調査、複雑な業務文書分析、研究支援のような領域に限定する。

第二に、token count を取り直す。Opus 4.7 より前のモデルから移る場合、同じ文章でも token 数が増える可能性がある。プロンプト、RAG chunk、ログ添付、コード添付、出力フォーマットごとに実測し、単価表ではなく代表タスクの総額で見る。

第三に、data retention と zero data retention の可否を確認する。Fable 5 を Claude API で使う場合、30日保持の条件がある。社外秘や顧客データを扱う業務では、入力できるデータ種別を事前に分ける必要がある。

第四に、Mythos 5 を一般モデルと混同しない。Mythos 5 は Project Glasswing の限定提供モデルであり、一般の開発者向け選択肢ではない。防御的セキュリティ用途で検討する場合も、参加条件、ログ、開示フロー、findings 処理を確認する。

第五に、評価結果をモデルIDと提供経路に紐付ける。同じ名前でも、クラウド経路、endpoint、保持条件、fallback、モデル lifecycle が違えば、監査上は別の構成である。評価表にはモデルID、provider、region、date、token count、拒否挙動を残す。

## まとめ

Claude Fable 5 / Claude Mythos 5 の発表は、Anthropic のモデル能力が次の段階へ進んだことを示している。しかし日本企業が受け取るべきメッセージは、単純に「最新モデルへ置き換える」ではない。

見るべき焦点は、1M context と 128k output をどの業務で使うか、adaptive thinking をどう評価するか、30日保持を許容できるデータは何か、Bedrock / Vertex / Foundry / Claude API のどの経路で監査できるかである。Fable 5 は強力な選択肢だが、導入価値はモデル名ではなく、評価再現性、調達条件、ログ設計、安全境界を揃えられるかで決まる。

## 出典

- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) - Anthropic, 2026-06-09
- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-06-09
- [Models overview](https://docs.anthropic.com/en/docs/about-claude/models) - Anthropic Docs
- [Migrating from Claude Mythos Preview to Claude Mythos 5](https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4) - Anthropic Docs
- [Claude Fable](https://www.anthropic.com/claude/fable) - Anthropic
