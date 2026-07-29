---
title: 'Gemini Agent Platform、Runtime本番運用の統制'
description: 'Gemini Enterprise Agent PlatformでAgent RuntimeやAgent Identityが広く利用可能に。日本企業が長時間実行、最小権限、監査、台帳管理をどう設計すべきか整理する。'
pubDate: '2026-07-30'
category: 'news'
tags: ['Google Cloud', 'Gemini Enterprise', 'AIエージェント', 'AIガバナンス', '監査ログ', '企業導入', '開発基盤']
series: 'google-gemini-enterprise-agent-platform-2026'
draft: false
---

Google Cloudは**2026年7月30日**、Gemini Enterprise Agent Platformの主要機能を広く利用可能にしたと発表した。対象には、長時間エージェントを動かすAgent Runtime、会話や作業文脈を維持するAgent Memory Bank、エージェントごとの権限を管理するAgent Identity、横断制御のAgent Gateway、組織内のエージェントを集約するAgent Registry、評価と観測の機能が含まれる。

これは、新しいチャット機能が増えたという話ではない。Google Cloudが、エージェントを「作る」段階から、「数日動かし、権限を与え、監査し、改善し続ける」段階へ寄せている更新である。日本企業にとっては、PoCの便利さよりも、本番業務に接続したAIエージェントを誰の責任で運用するかが中心論点になる。

このサイトでは以前、[Gemini Enterpriseの運用監視](/blog/google-gemini-enterprise-core-assistant-observability-2026/)でTraceとMetricsを扱い、[Gemini Parallel検索](/blog/google-gemini-parallel-web-search-grounding-2026/)では外部Webを根拠層として使う論点を整理した。さらに[Gemini 3.6 Flashのデータレジデンシー](/blog/google-gemini-36-flash-us-data-residency-2026/)では地域統制を見た。今回のRuntimeとIdentityの更新は、そのシリーズの中でも「エージェントを本番で動かすための土台」に近い。

## 事実: RuntimeとMemory Bankは長時間実行を前提にする

Google Cloudの発表では、Agent Runtimeが複雑な長時間エージェントや推論タスクを自動化し、最大7日間にわたって継続実行できると説明されている。営業の見込み客対応、サプライチェーンのコンプライアンス監視、ITインシデント対応、オンボーディング手続きのように、数分で終わらない非同期ワークフローが例に挙げられている。

Agent Runtimeのドキュメントでは、開発者がインフラではなくエージェントのロジックへ集中できるよう、デプロイ、管理、スケールを担うマネージドRuntimeとして位置づけられている。VPC Service Controls、認証、IAM、関数呼び出し、Agent2Agent open protocol、ADKやLangGraphなどのフレームワーク対応も説明されている。つまり、単にコンテナを動かす場所ではなく、エージェントを運用対象として扱うための実行面である。

Memory Bankは、長時間作業で文脈を失わないための部品だ。Googleは、構造化schemaを定義し、ユーザーの好み、過去の判断、アカウント履歴のような会話文脈を維持する用途を示している。ここで重要なのは、記憶が便利さだけでなく、データ保持と説明責任の問題にもなる点である。

日本企業が長時間エージェントを使う場合、どの作業を7日間任せるのか、途中で人間がどこで承認するのか、失敗時にどこから再開するのか、どの文脈を記憶してよいのかを先に決める必要がある。社内規程、顧客契約、個人情報保護の観点では、記憶させる情報の範囲と削除手順が運用設計に入る。

## 事実: Agent Identityはサービスアカウント管理の延長ではない

今回の更新で特に重いのはAgent Identityである。Google Cloudは、Agent Identityをエージェント権限のための新しいIAM型として説明している。最小権限、エージェントRuntimeへのアクセス紐づけ、監査、ライフサイクル管理を目的にしている。

従来の業務自動化では、サービスアカウントや共有credentialで処理を動かすことが多かった。しかしAIエージェントは、人間の依頼を受け、途中で判断し、ツールを呼び、別のシステムへ作用する。ここで共有サービスアカウントを広く使うと、どのエージェントが何をしたのか、誰の依頼で動いたのか、どこまでの権限が必要だったのかが曖昧になる。

Agent Identityの狙いは、この曖昧さを減らすことにある。エージェントごとにIDを持たせ、権限を絞り、監査証跡を残す。これは[Google Agent評価基盤](/blog/google-agent-quality-flywheel-evaluation-2026/)で扱った品質評価とは別の軸だ。評価点が高いエージェントでも、権限が広すぎれば本番投入は危険である。逆に権限が適切でも、評価と監視がなければ継続改善は難しい。

日本企業では、まず「人間のID」「システムのサービスアカウント」「AIエージェントのID」を分けて台帳化する必要がある。エージェントのowner、利用部署、対象データ、使えるツール、実行環境、停止手順、監査ログの所在を一つの一覧で説明できなければ、内部監査や委託先管理で詰まる。

## GatewayとRegistryはagent sprawlへの対策になる

Agent Gatewayは、エージェント間や外部ツールとのやり取りを中央で制御する部品として説明されている。IAM conditionsや自然言語ルールによるアクセス制御、Model Armorによるprompt injection、tool poisoning、data leakageへの保護が発表文では示されている。

Agent Registryは、組織内に作られたAIエージェント、サーバー、接続を集めるためのライブラリである。Googleは、チームが既存エージェントを見つけて再利用でき、管理者がagent sprawlを監視できるものとして説明している。これは地味だが、企業導入では重要だ。

AIエージェントは、現場が作りやすくなるほど増える。営業部門、開発部門、情シス、法務、経理、子会社、外部委託先が、それぞれ似たようなエージェントを作る可能性がある。Registryがなければ、どのエージェントが本番相当で、どれがPoCで、どれが古いcredentialを持ち、どれが誰にも管理されていないのか分からなくなる。

日本企業では、GatewayとRegistryを「後で整理する管理画面」として扱わないほうがよい。最初の導入時点で、登録されていないエージェントは本番データへ接続しない、Registryにownerと更新期限がないエージェントは停止候補にする、Gatewayを通らない外部ツール呼び出しは高リスク扱いにする、といったルールを決めたい。

## 評価と観測は公開後の回帰を拾う

Google Cloudは、Agent EvaluationとAgent Observabilityも今回の更新で強調している。Evaluationでは、本番中の性能低下や行動のずれを見つけるオンライン評価、事前定義metric、custom Python、LLM-as-a-judge、Google DeepMindと共同開発したadaptive rubricが説明されている。Observabilityでは、reasoning、tool利用、実行性能のtraceやdashboardが主題になる。

ここで大切なのは、評価と観測を同じものとして扱わないことだ。Observabilityは、エージェントが何をしたかを見る。Evaluationは、それが良かったかを判定する。たとえば、Agent Runtimeが正常に7日間動き、ログも残っていても、間違った取引先を調べ続けていれば品質は悪い。反対に、回答品質が高くても、実行コストや再試行が膨らんでいれば運用上は失敗である。

本番導入では、最初から全指標をそろえる必要はない。ただし、最低限のゲートは必要だ。重大な個人情報漏えい、承認なしの書き込み、禁止ツールの実行、根拠のない業務データ更新はゼロ許容にする。平均点や成功率は改善指標として使い、重大事故は公開停止の条件として分ける。

## 日本企業の導入台帳

最初に作るべき台帳は、エージェント単位のowner台帳である。名前、用途、部署、責任者、利用者範囲、接続データ、利用ツール、実行環境、Agent Identity、Gateway経路、Registry登録、評価セット、監視先、停止手順を載せる。これはセキュリティ部門だけでなく、開発基盤、業務部門、法務、内部監査が共有する台帳にする。

次に、権限台帳を作る。エージェントがCloud Storage、BigQuery、GitHub、SaaS、社内API、メール、チケット管理、CRMへアクセスするなら、読み取り、作成、更新、削除、承認の権限を分ける。人間ユーザーの権限をそのままエージェントへ委譲すると広すぎる場合がある。

3つ目は、記憶とログの台帳である。Memory Bankに残す情報、Runtime traceに残る情報、GatewayやRegistryの監査ログ、評価データセットへ回すsample、SIEMやBigQueryへ転送するログを分ける。保存期間と削除手順を別々に決めないと、便利な記憶と不要な個人情報蓄積が混ざる。

4つ目は、費用台帳である。Agent Runtimeの実行時間、モデル呼び出し、tool呼び出し、検索、評価、観測、再試行、長時間runの失敗を分けて見る。AIエージェントは一問一答よりもコストの発生点が多いため、プロジェクト別・部署別の上限とアラートを初期から置くべきだ。

## まとめ

Gemini Enterprise Agent Platformの今回の更新は、Google CloudがAIエージェントを本番運用の対象として整えようとしていることを示す。Agent Runtimeは長時間実行を、Memory Bankは文脈維持を、Agent Identityは最小権限を、GatewayとRegistryは横断統制を、EvaluationとObservabilityは継続改善を担う。

日本企業にとっての焦点は、どの機能を試すかではない。AIエージェントに数日間の業務を任せ、社内外のシステムへアクセスさせるなら、ID、権限、記憶、ログ、評価、費用、停止手順を一体で設計しなければならない。特にAgent IdentityとRegistryは、PoCから本番へ移る前に台帳化しておきたい。

このseriesは、Google Cloudのエージェント基盤が「作成」「接地」「地域統制」「評価」「実行統制」へ広がる流れを追っている。今回の記事はpillar候補に近いが、既存のseriesTitle記事が基礎を担っているため、pillar指定は人間判断に回すのがよい。

## 出典

- [What's new in Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/whats-new-in-gemini-enterprise-agent-platform) - Google Cloud Blog, 2026-07-30
- [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime) - Google Cloud Documentation, last updated 2026-07-29
- [Use Agent Identity with Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity) - Google Cloud Documentation
- [Agents overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents) - Google Cloud Documentation
