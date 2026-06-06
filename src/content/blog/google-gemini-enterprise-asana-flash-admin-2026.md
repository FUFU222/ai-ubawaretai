---
title: 'Gemini Enterprise Asana連携とFlash既定化'
description: 'Gemini EnterpriseのAsana連携PreviewとGemini 3.5 Flash既定有効化を、日本企業の業務データ接続、操作権限、モデル管理、監査設計の観点で整理する。'
pubDate: '2026-06-06'
category: 'news'
tags: ['Google Cloud', 'Gemini Enterprise', 'Asana', 'AIエージェント', '管理者設定', '日本企業']
series: 'google-gemini-enterprise-agent-platform-2026'
draft: false
---

Google Cloud の Gemini Enterprise リリースノートに、2026年6月5日付で **Asana data store の Public Preview** と **Gemini 3.5 Flash の管理者トグル廃止** が並んで掲載された。前者は Gemini Enterprise から Asana のプロジェクト、ワークスペース、チーム、タスクを自然言語で検索・参照し、さらにプロジェクトやタスク作成などのアクションも実行できる更新だ。後者は、2026年6月9日から Gemini 3.5 Flash が Gemini Enterprise app の全ユーザーで既定有効になり、管理者が無効化できなくなる変更である。

このサイトでは、[Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) を Google Cloud の企業向けエージェント統制基盤として整理し、[Gemini運用監視、Core Assistantの実務価値](/blog/google-gemini-enterprise-core-assistant-observability-2026/) では Core Assistant、Trace、Metrics が運用面を補う動きとして読んだ。今回の Asana 連携と Flash 既定化は、その次に来る「業務アプリへ実際に触るエージェント」と「管理者がモデル選択をどこまで制御できるか」の話である。

日本企業にとって重要なのは、Asana 連携が単なる検索コネクタではない点だ。Google の Asana connector ドキュメントでは、タスク作成、タスク更新、タスク削除、プロジェクト作成、ステータス更新といった操作が示されている。つまり Gemini Enterprise は、情報を探す入口から、業務データを変更する入口へ近づいている。同じ日に Flash の管理トグル廃止も告知されたことで、導入企業は「どのデータへ接続するか」と「どのモデルをどの範囲で使わせるか」を分けて設計し直す必要がある。

## 事実: Asana data store は Preview として追加された

Google Cloud の 2026年6月5日付リリースノートでは、Gemini Enterprise の Asana data store が Public Preview になったと案内されている。説明では、Asana アカウントを接続すると、Gemini Enterprise app から自然言語でプロジェクト、ワークスペース、チーム、タスクを検索・参照できる。さらに、プロジェクトやタスクを作成するようなアクションも直接実行できるとされている。

Asana connector のドキュメントを見ると、実行できるアクションは読み取りに限られない。新規プロジェクト作成、プロジェクトやポートフォリオへのステータス更新、1件または複数タスクの作成、複数タスクの更新、タスク削除が含まれる。特にタスク作成については、視覚的なプレビューや確認を挟まずに即時作成できる旨が説明されている。

この点は、導入判断で重い。エージェントが Asana の情報を検索するだけなら、主な論点は検索対象、権限、根拠表示、データ鮮度だ。しかし作成・更新・削除が入ると、誤操作、重複タスク、担当者変更、期限変更、ステータス更新の責任が出る。生成AIの回答品質だけでなく、業務システム側の変更権限をどう扱うかが中心になる。

また、Asana data store には制限もある。Google は、1つのアプリや既存アプリに data store を追加するとき、単一の connector type に属するアクションだけを紐付けることを推奨している。既存の Asana data store に対して VPC Service Controls perimeter を後から強制することはサポートされず、必要なら data store を削除して作り直す必要がある。対応ロケーションは `global`、`us`、`eu` だ。

## 事実: Gemini 3.5 Flash は無効化できなくなる

同じ 2026年6月5日付リリースノートには、Gemini 3.5 Flash の管理者制御に関する更新もある。Google は、2026年6月9日から Gemini 3.5 Flash の feature management toggle が使えなくなり、Gemini Enterprise app の全ユーザーで既定有効になり、無効化できないと案内している。この変更は Global、US、EU の multi-region に適用される。

この変更には経緯がある。Gemini Enterprise リリースノートでは、2026年5月19日に Gemini 3.5 Flash の GA が案内され、その時点で Gemini 2.5 Flash は model selector から削除され、管理者は Gemini 3.5 Flash を無効化できないと説明されていた。さらに 2026年5月26日には、管理者が Gemini 3.5 Flash の表示をオン・オフする feature management toggle を使えるが、その toggle は 6月8日以降に使えなくなると告知されていた。6月5日の更新では、その効力発生日が 1日延び、6月9日になったと整理されている。

つまり、これは突然の仕様変更というより、段階的な移行の最終案内に近い。ただし、日本企業の管理者にとっては小さくない。モデルをどの部署に見せるか、どのモデルを標準にするか、社内の利用ガイドでどのモデルを推奨するかは、セキュリティ、費用、応答品質、教育資料に関係する。Flash が既定有効になり無効化できないなら、管理者は「止める」ではなく「使われる前提で監視し、説明し、制限する」方向へ寄せる必要がある。

これは [Gemini API管理エージェント、移行期の実装負債を減らす](/blog/google-gemini-api-managed-agents-2026/) で扱った開発者向けの managed execution とも違う。API 側では、アプリケーション設計者がモデルや実行基盤を選ぶ。一方、Gemini Enterprise app 側では、社内ユーザーが業務画面からモデルを使う。管理者がモデル露出を直接絞れない場合、利用ポリシー、データ接続、監査ログ、教育で統制する比重が増える。

## 分析: 業務AIは検索から操作へ進んでいる

ここからは分析だ。

今回の Asana 連携は、Gemini Enterprise が「社内情報を探すAI」から「業務ツールを操作するAI」へ進む流れを示している。検索だけなら、間違った答えを返しても人間が判断して修正できる場面が多い。だが、タスクを作る、更新する、削除する、ステータスを投稿するとなると、AIの出力は直接業務データに反映される。これは UX の便利さだけではなく、変更管理の問題である。

日本企業では、Asana のようなプロジェクト管理ツールが部門単位で導入され、情シスや経営企画が全社標準として完全に握っていないケースもある。Gemini Enterprise から Asana を操作できるようになると、AI 基盤側の管理者と Asana 側の管理者が別々であることが問題になりやすい。AI 側では許可したつもりでも、Asana 側の権限、プロジェクト構造、命名規則、通知ルールが追いついていなければ、現場に混乱が出る。

さらに、Asana は業務の未完了状態を可視化するツールだ。そこに AI がタスクを作成する場合、「誰の依頼か」「どの根拠で作ったか」「既存タスクと重複していないか」「担当者と期限は妥当か」を後から追える必要がある。AI が作ったタスクだと分かるラベル、作成元、プロンプトや会話への参照、削除・差し戻しの運用がないと、便利な自動化がタスクノイズに変わる。

この点は、[Workspace Studio の管理者制御](/blog/google-workspace-studio-admin-controls-2026/) で見た流れともつながる。Google は Workspace や Gemini Enterprise の中で、現場が AI を使って業務を進める入口を増やしている。一方で、管理者制御は製品ごとに粒度が異なる。Asana 連携のような外部SaaS操作では、Google 側の設定だけではなく、接続先 SaaS の権限と監査を同時に確認しなければならない。

## 日本企業が先に見るべき設計項目

第一に、Asana の接続範囲を限定すべきだ。全社の Asana ワークスペースや全プロジェクトを一気に Gemini Enterprise へつなぐのではなく、用途が明確な部門やプロジェクトから始めるほうがよい。Preview の段階では、作成・更新・削除を許す範囲と検索だけを許す範囲を分けて検証したい。

第二に、AI による書き込みの責任線を決める必要がある。Gemini Enterprise から作られたタスクは、誰の操作として記録されるのか。人間のユーザー権限に従うのか。監査ログで AI 経由と分かるのか。誤って削除されたタスクを復元できるのか。これらは、Asana 側の設定やログ、Google 側の観測機能と合わせて確認する必要がある。

第三に、Gemini 3.5 Flash の既定有効化を前提に、モデル利用ガイドを更新する必要がある。管理者が無効化できないなら、ユーザーに「どの用途では Flash を使ってよいか」「機密性の高い作業では何を避けるか」「回答品質に疑問があるときはどうエスカレーションするか」を明示するべきだ。

第四に、Core Assistant や Metrics の観点とつなげることだ。[Gemini運用監視、Core Assistantの実務価値](/blog/google-gemini-enterprise-core-assistant-observability-2026/) で整理したように、Gemini Enterprise の運用では Trace や Metrics が重要になる。Asana 連携を入れるなら、利用回数、失敗率、権限エラー、タスク作成数、削除操作、ユーザーからの差し戻し件数を観測対象に加えたい。

第五に、Preview 機能の扱いを契約・監査の観点で確認することだ。Asana connector の federated search と actions は Public Preview として案内されている。Pre-GA の条件、サポート範囲、障害時の責任、社内の本番利用可否を確認しないまま、重要なプロジェクト管理に組み込むのは避けるべきだ。

## まとめ

Gemini Enterprise の Asana data store Preview と Gemini 3.5 Flash の既定有効化は、別々の小さな更新ではない。前者は Gemini Enterprise が業務SaaSを検索・操作する範囲を広げ、後者は管理者がモデル露出を細かく止める余地を減らす。どちらも、企業が AI エージェントを業務システムとして扱ううえで、統制設計を先に求める更新である。

日本企業は、Asana 連携を「便利なタスク作成」としてだけ見ないほうがよい。検索対象、書き込み権限、削除操作、監査ログ、Preview 条件、モデル利用ガイドをまとめて確認する必要がある。特に、AI が業務データを直接変更する場面では、成功例よりも失敗時の復旧手順が重要になる。

Google の Gemini Enterprise Agent Platform は、エージェント基盤、社員向け入口、観測機能、外部SaaS操作を少しずつ積み増している。今回の更新は、その流れが実際の業務管理ツールへ届き始めたことを示す。導入企業にとっての問いは、Asana 連携を使うかどうかではなく、AI が仕事を作り、変え、消す時代に、どの範囲まで任せられるかである。

## 出典

- [Gemini Enterprise release notes](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes) - Google Cloud Documentation, accessed 2026-06-06
- [Connect Asana overview](https://docs.cloud.google.com/gemini/enterprise/docs/connectors/asana) - Google Cloud Documentation, accessed 2026-06-06
- [Google Cloud release notes](https://docs.cloud.google.com/release-notes) - Google Cloud Documentation, accessed 2026-06-06
