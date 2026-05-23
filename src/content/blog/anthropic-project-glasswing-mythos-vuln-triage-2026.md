---
title: 'Project Glasswing初報、AI脆弱性対応の現実'
description: 'Project Glasswing初報をもとに、Claude Mythos Previewが大量の脆弱性を見つけた後の検証、開示、修正待ちリスクを日本企業のAppSec運用向けに整理する。'
pubDate: '2026-05-23'
category: 'news'
tags: ['Anthropic', 'Claude', 'サイバーセキュリティ', '脆弱性修正', 'AIガバナンス', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年5月22日**、Project Glasswing の初期アップデートを公開した。焦点は Claude Mythos Preview がどれだけ高度な脆弱性を見つけられるかだけではない。約50のパートナーとともに、世界の重要ソフトウェアをスキャンした結果、**高・重要度の脆弱性が1万件超見つかった**という事実と、その後に検証、開示、修正、適用が追いつかないという現実が前面に出てきた。

日本企業にとって、このニュースは「Anthropic の新しいサイバー向けモデルがすごい」という話で終わらない。自社が使う OSS、クラウド、ブラウザ、OS、ネットワーク機器、業務 SaaS のどこかで、AI による脆弱性発見が急増する。すると、開発者、AppSec、CSIRT、情シス、調達、法務は、見つかった問題をどう優先し、誰が直し、いつ利用者へ展開するのかを再設計する必要がある。

Anthropic はすでに [Claude Security公開ベータ](/blog/anthropic-claude-security-public-beta-2026/) で企業向けのコードスキャン機能を出している。さらに [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) では、AI利用の監査ログを既存のセキュリティ基盤へ流す方向を示した。Project Glasswing はその先にある、AIが見つけた大量の脆弱性を社会全体でどう処理するかという問題だ。

## 事実: Project Glasswingの初期成果

Project Glasswing は、Anthropic が 2026年4月に発表した取り組みだ。AWS、Apple、Broadcom、Cisco、CrowdStrike、Google、JPMorganChase、Linux Foundation、Microsoft、NVIDIA、Palo Alto Networks などのパートナーが参加し、Claude Mythos Preview を防御目的で使って重要ソフトウェアを点検する。

今回の初期アップデートでは、Project Glasswing のパートナーが Claude Mythos Preview を使い、合計で1万件超の高・重要度脆弱性を見つけたと説明された。Cloudflare では重要経路のシステムで2,000件のバグが見つかり、そのうち400件が高・重要度だったとされる。Mozilla は Firefox 150 の検証で271件の脆弱性を見つけて修正したとも紹介されている。

OSS への影響も大きい。Anthropic は Mythos Preview で1,000件超のオープンソースプロジェクトをスキャンし、23,019件の脆弱性候補を見つけ、そのうち6,202件を高・重要度と推定した。独立したセキュリティ調査会社などが確認した1,752件の高・重要度候補では、90.6%が真陽性、62.4%が高・重要度として確認されたという。

ここで重要なのは、Anthropic が未修正の詳細を広く公開していないことだ。協調的脆弱性開示の考え方に従い、利用者が更新する時間を確保するため、公開できる情報は集計値と例示に抑えられている。これは、AI セキュリティ記事としては地味に見えるかもしれないが、実務では正しい抑制だ。発見能力が上がるほど、情報公開の順序を誤ると攻撃者にも同じ武器を渡す。

## 事実: ボトルネックは発見から修正へ移った

Anthropic の説明で最も重要なのは、進捗を制約しているものが「脆弱性を見つける速度」ではなくなったという点だ。現在の制約は、発見された大量の候補を人間が検証し、重大度を評価し、保守者へ報告し、パッチを設計し、利用者へ展開する部分に移っている。

Anthropic の CVD ダッシュボードは、この現実を数字で示している。2026年5月22日時点で、Anthropic は281のOSSプロジェクトに対して1,596件の脆弱性を開示し、そのうち97件がパッチ済み、88件が CVE または GitHub Security Advisory を付与されたと説明している。つまり、AI が候補を見つける速度と、エコシステムが修正を吸収する速度の間に大きな差がある。

この差は日本企業にもそのまま来る。日本の開発組織では、SAST や依存関係スキャンのアラートだけでも未処理 backlog が積み上がりやすい。そこへ AI がロジックバグ、メモリ安全性、認証・認可、暗号実装、プロトコル処理の問題を大量に提示するようになると、単にスキャナーを増やすだけでは回らない。

[GoogleとNICT・デジタル庁がAIサイバー防御を始動](/blog/google-nict-digital-agency-ai-cybersecurity-japan-2026/) で扱ったように、日本でもAIを使った脆弱性検知やSLSA導入は公共・重要インフラのテーマになっている。Project Glasswing が示したのは、その次の課題だ。AIで検知できるようになった後、誰が検証し、どのパッチを急ぎ、どの利用者にどう届けるのかまで決めなければ、防御力は上がらない。

## 分析: 日本企業のAppSec運用で変えるべきこと

ここからは分析だ。

日本企業が最初に見直すべきなのは、脆弱性対応の intake である。AI が見つけた findings は、従来の静的解析アラートより説明が豊かになる可能性がある一方、確率的な推論も含む。だから、受け取った時点で「本当に再現するか」「自社環境で悪用可能か」「公開面にあるか」「補償統制があるか」を評価する入口が必要になる。

2つ目は、修正優先度の決め方だ。CVSS だけでは足りない。顧客データに近いか、インターネット公開か、認証前に到達できるか、攻撃コードが作りやすいか、依存先の保守者がどれだけ早く動けるか、自社に代替策があるかを一緒に見る必要がある。AI が脆弱性を見つけるだけでなく exploitability まで示すようになるほど、優先度の判断は重くなる。

3つ目は、パッチ適用の cadance だ。Anthropic は、開発者はパッチサイクルを短くし、利用者が更新しやすい仕組みを整えるべきだと述べている。日本企業でも、月次リリースや四半期リリースしかないプロダクトで、高・重要度の修正をどう例外的に出すかを決めておきたい。SaaS なら feature flag、段階 rollout、緊急リリース手順、監視強化を含めるべきだ。

4つ目は、AI を使った修正提案の扱いだ。[OpenAIのGPT-5.4-Cyber](/blog/openai-gpt-54-cyber-trusted-access-2026/) のように、防御向けモデルの能力が上がる流れは他社にも広がっている。修正案を AI が出せるようになるほど、コード owner とセキュリティ担当のレビュー責任を明確にしなければならない。AI が作った修正 PR を、そのまま merge する運用は避けるべきだ。

## 分析: OSS利用企業は「待つ側」の設計も必要

Project Glasswing の厳しさは、OSS 保守者側だけの問題ではない。日本企業の多くは OSS の利用者であり、自社が使う依存パッケージ、コンテナイメージ、OS、ライブラリ、クラウド基盤の修正を待つ立場でもある。AI が大量の脆弱性を見つけた場合、保守者はすぐに全てを直せない。利用企業は、パッチが出るまでの待ち方を設計する必要がある。

まず SBOM と依存関係管理が前提になる。どのプロダクトがどのライブラリを使い、どのバージョンが本番に出ているか分からなければ、CVE や GHSA が出ても影響範囲を判断できない。AI 時代の脆弱性対応では、発見の速度よりも、自社の利用実態をすぐ引けることが重要になる。

次に、補償統制を用意する。パッチがまだないとき、WAF ルール、設定変更、機能停止、ネットワーク分離、認証強化、ログ監視、レート制限でリスクを下げられるかを決める。Anthropic が挙げた NIST や英国 NCSC の基礎的な統制は新しい話ではないが、AI が悪用可能性の高い脆弱性を短時間で見つけるなら、基礎統制の価値はむしろ上がる。

最後に、情報公開と顧客説明を準備する。高・重要度の脆弱性が自社製品や利用OSSに関係したとき、顧客に何を伝えるのか、未修正の詳細をどこまで伏せるのか、委託先や監査法人へどう説明するのかを決めておく。これは [KPMG Claude導入](/blog/anthropic-kpmg-claude-digital-gateway-2026/) のような専門サービスで特に重要だ。顧客データや規制業務を扱う企業は、AI 利用だけでなく AI によって発見されたリスクの説明責任も問われる。

## まとめ

Project Glasswing の初期アップデートは、AI セキュリティの節目だ。Claude Mythos Preview は、重要ソフトウェアや OSS から大量の高・重要度脆弱性を見つけた。一方で、見つかった問題を人間が検証し、開示し、修正し、利用者へ届ける部分が新しいボトルネックになっている。

日本企業が今やるべきことは、AI 脆弱性発見ツールを急いで増やすことだけではない。findings の入口、再現確認、重大度判断、パッチ例外、SBOM、補償統制、顧客説明までを一つの運用として見直すことだ。AI が脆弱性を見つける速度は今後も上がる。だからこそ、防御側の勝負は「発見」から「処理能力」へ移っている。

## 出典

- [Project Glasswing: An initial update](https://www.anthropic.com/research/glasswing-initial-update?xs=1) - Anthropic, 2026-05-22
- [Anthropic's coordinated vulnerability disclosure dashboard](https://red.anthropic.com/2026/cvd/) - Anthropic Frontier Red Team, 2026-05-22
- [Project Glasswing: Securing critical software for the AI era](https://www.anthropic.com/glasswing) - Anthropic, 2026-04-07
- [Assessing Claude Mythos Preview's cybersecurity capabilities](https://red.anthropic.com/2026/mythos-preview/) - Anthropic Frontier Red Team, 2026-04-07
