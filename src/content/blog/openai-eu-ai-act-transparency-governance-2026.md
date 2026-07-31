---
title: 'OpenAI EU AI Act対応、AI透明性義務の点検'
description: 'OpenAI EU AI Act対応を整理。日本企業がEU向けAI調達、生成コンテンツ表示、system card、provenance、サイバー用途の承認線をどう点検するか解説する。'
pubDate: '2026-07-31'
category: 'news'
tags: ['OpenAI', 'AIガバナンス', 'AI安全', 'プライバシー', 'セキュリティ', '企業導入']
series: 'openai-security-controls'
draft: false
---

OpenAI は **2026年7月31日**、欧州での responsible AI 対応を整理し、EU AI Act の次の実装フェーズに合わせて、安全、透明性、provenance、サイバー用途、顧客向け資料の位置づけを示した。これは欧州だけの政策発信ではない。日本企業が OpenAI のモデルや ChatGPT Enterprise、API、Codex を海外拠点やグローバル顧客向けサービスに組み込むなら、EU の透明性義務と一般目的AIモデルの説明責任は、調達質問と運用台帳に入ってくる。

今回の更新は、[OpenAI C2PA対応で画像AIの出所確認は実務化するか](/blog/openai-c2pa-synthid-provenance-2026/) で扱った来歴表示、[OpenAI Bio Bounty、GPT-5.6安全審査の実務](/blog/openai-bio-bounty-gpt56-safety-review-2026/) で扱った外部安全検証、[OpenAI GPT-Red、自動レッドチームで安全運用を再設計](/blog/openai-gpt-red-prompt-injection-robustness-2026/) で扱った継続評価を、EU AI Act の文脈で束ね直すものとして読める。製品機能の発表というより、OpenAI が顧客と規制当局へ見せる compliance package の棚卸しである。

## 事実: EU AI Actの実装フェーズが近づく

European Commission は、2026年8月2日から AI Office と加盟国当局が AI Act の実装、監督、執行を担うと説明している。同じ日から、透明性に関する新しいルールも適用され、対話型AIでは人間ではなくAIとやり取りしていることを知らせる必要があり、deepfake などのAI生成・編集コンテンツには表示や機械可読なマークが求められる。

また、GPAI、つまり general-purpose AI model については、透明性、著作権、安全・セキュリティに関する実務支援として General-Purpose AI Code of Practice が用意されている。Commission の説明では、この code は AI Act 義務への任意準拠ツールであり、OpenAI も signatory に含まれる。Code そのものは任意だが、モデル提供者や利用企業が「どの文書で何を確認するか」を揃えるための基準になりやすい。

OpenAI の7月31日記事は、この流れに合わせて、system cards、Red Teaming Network、Model Spec、Preparedness Framework、Frontier Governance Framework、Frontier Model Forum、第三者評価、Content Credentials、C2PA、SynthID、Trusted Access for Cyber を一つの responsible AI 対応として並べている。OpenAI Help Center の EU AI Act 記事も更新され、顧客や開発者は自分たちに適用される法的義務を評価する責任があると明記している。

## 事実: provenanceは単独の魔法ではない

OpenAI は、AI生成コンテンツの透明性について、Content Credentials と C2PA、SynthID watermarking、検証ツールを組み合わせる layered approach を示している。重要なのは、OpenAI 自身も「単一の来歴・検出手段は完全ではない」という前提で説明している点だ。metadata は編集や配信先で失われることがあり、ラベルがプラットフォームをまたいで維持されないこともある。

この点は日本企業のマーケティング、広報、採用、教育、CS、メディア運用に直結する。AI生成画像や音声、動画、商品説明、告知文を欧州向けに使う場合、OpenAI の provenance signal が付くかどうかだけでなく、自社CMS、広告配信、SNS、代理店制作、翻訳・編集工程を通ったあとに表示や機械可読情報が残るかを確認する必要がある。

つまり、OpenAI が提供する signal は出発点であり、最終責任のすべてではない。日本企業側では、AI生成物の作成者、利用目的、掲載先、編集履歴、表示文言、例外判断を残す台帳が必要になる。特に deepfake 的に見える音声・映像、顧客が人間の担当者と誤解しやすい chatbot、公共的な情報に関するテキストは、表示ルールを契約と制作ワークフローに入れるべきだ。

## 分析: 調達で見るべきものが変わる

日本企業が OpenAI や他の frontier model を調達するとき、これまでは主に価格、性能、データ保持、管理者設定、監査ログを見ていた。EU AI Act フェーズでは、そこにモデル文書、system card、training content summary、provenance tool、顧客向け reporting channel、禁止用途への利用制限が加わる。

OpenAI Help Center は、EU AI Act に関する顧客支援として、model documentation のリクエスト、GPAI Code の Copyright Chapter に関する complaint、security incident の報告先を示している。これは、営業資料ではなく運用手続きとして重要だ。AI CoE や法務が見るべきなのは「OpenAI はEU対応をしているらしい」という抽象論ではなく、自社が必要な文書をどこから取り、どの部署が評価し、顧客や監査人へどう説明するかである。

サイバー用途も同じである。OpenAI は Trusted Access for Cyber と EU Cyber Action Plan への対応を挙げ、合法的な defender へ高度モデルを安全に届ける方向を説明している。一方で、European Commission の Action Plan は、AI が脆弱性検出や重要インフラ防御に役立つ一方、攻撃の自動化にも使われ得ると整理している。SOC、CSIRT、脆弱性診断、MDR、製品セキュリティに AI を入れる企業は、モデル性能だけでなく、利用者資格、ログ、検証環境、顧客データ、脆弱性情報の扱いを定める必要がある。

## 日本企業が今点検する5項目

第一に、EU向けサービスのAI接点を棚卸しする。chatbot、音声応答、AI生成商品説明、画像・動画、FAQ、採用、与信、教育、医療、カスタマーサポート、セキュリティ診断など、EU居住者やEU法人に触れるAI利用を一覧にする。EU法人を持たない日本企業でも、SaaS、EC、ゲーム、観光、B2B製品が欧州顧客へ届くなら無関係ではない。

第二に、生成コンテンツの表示ルールを制作工程へ入れる。OpenAI の C2PA や SynthID を確認するだけでなく、社内テンプレート、代理店契約、CMS入稿、SNS投稿、翻訳、再編集後の表示を決める。表示が必要なもの、任意表示で足りるもの、人間編集が入ってもAI由来を残すものを分類する。

第三に、モデル調達の質問票を更新する。system card、Frontier Governance Framework、Preparedness Framework、GPAI Code signatory status、training content summary、provenance API、incident reporting、顧客向け model documentation の取得方法を聞く。これは OpenAI だけでなく、[Anthropic RSP 3.3はバイオリスク閾値をどう変えたか](/blog/anthropic-rsp-33-biorisk-threshold-governance-2026/) のように、他社の responsible scaling policy と比較する軸にもなる。

第四に、禁止用途と高リスク用途を日本語の社内規程へ落とす。EU AI Act では、操作・欺瞞、脆弱性の悪用、social scoring、職場や教育での emotion recognition、特定の biometric categorisation などが問題になる。日本企業の社内利用規程でも、採用、人事評価、教育、顧客スコアリング、監視、心理状態推定、本人確認、警備、医療助言を別枠にするべきだ。

第五に、サイバー用途の承認線を分ける。AI に脆弱性の要約や検出補助をさせることと、攻撃手順、exploit 開発、外部ネットワークへの実行、顧客環境への操作をさせることは違う。OpenAI の Trusted Access for Cyber や EU Action Plan が示すように、防御目的の高度利用には正当な利用者、閉じた環境、監査、インシデント対応の線が必要になる。

## 今回の結論

OpenAI の EU AI Act 対応整理は、欧州政策へのコメントにとどまらない。日本企業にとっては、生成AIを「便利なSaaS」として買う段階から、モデル文書、来歴表示、安全評価、禁止用途、サイバー利用、顧客説明をセットで管理する段階へ移る合図である。

特に 2026年8月2日以降は、EUの透明性ルールとAI Officeの執行フェーズが近づく。日本企業が今やるべきことは、法律論を社内で抱え込むことではなく、AI利用台帳、生成コンテンツ表示、調達質問票、モデル更新時の再審査、サイバー用途の承認線を具体化することだ。

OpenAI の system card や provenance tool は、企業側の説明責任を助ける材料になる。しかし、それだけで自社の compliance は完成しない。AI がどこで顧客と接し、どこでコンテンツを作り、どこで高リスク判断に近づくかを把握して初めて、EU AI Act 対応は実務になる。

## 出典

- [Advancing responsible AI across Europe](https://openai.com/index/advancing-responsible-ai-across-europe/) - OpenAI, 2026年7月31日
- [EU AI Act: OpenAI Resources and Customer Guidance](https://help.openai.com/en/articles/12141645-eu-ai-act) - OpenAI Help Center, 2026年7月31日確認
- [The General-Purpose AI Code of Practice](https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai) - European Commission, 2026年7月31日確認
- [AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) - European Commission, 2026年7月31日確認
- [Commission starts enforcing AI Act rules and new transparency requirements on 2 August](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) - European Commission, 2026年7月31日
- [EU Action Plan on Cybersecurity and Artificial Intelligence](https://digital-strategy.ec.europa.eu/en/library/eu-action-plan-cybersecurity-and-artificial-intelligence) - European Commission, 2026年7月7日
