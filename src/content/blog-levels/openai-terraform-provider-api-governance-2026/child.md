---
article: 'openai-terraform-provider-api-governance-2026'
level: 'child'
---

OpenAI が公式の **Terraform provider** を公開しました。これは、OpenAI API Platform の project、user、group、role、service account、rate limit、spend alert などを、Terraform のコードで管理できるようにするものです。

かんたんに言うと、OpenAI の管理画面で手作業していた設定の一部を、GitHub などでレビューできる設定ファイルに移せるようになります。

## Terraform providerとは何か

Terraform は、クラウドや SaaS の設定をコードで管理する道具です。AWS の VPC、IAM、database などを Terraform で作る会社は多くあります。同じように、OpenAI の project や権限も Terraform で管理できるようになりました。

OpenAI の guide では、公式 provider は Administration API を使って OpenAI organization のリソースを管理すると説明されています。たとえば、新しい project を作る、service account を作る、project の rate limit を管理する、monthly spend alert を作る、といったことが対象です。

ここで大事なのは、通常の API key ではなく **Admin API key** を使うことです。生成 AI に質問するための key と、OpenAI 組織の管理設定を変える key は別物です。Admin API key は強い権限を持つため、リポジトリへ書いたり、チャットに貼ったりしてはいけません。

## 何がうれしいのか

一番の利点は、変更をレビューできることです。

管理画面だけで設定を変えると、あとから「誰がこの project を作ったのか」「なぜこの role を付けたのか」「spend alert の通知先をいつ変えたのか」が分かりにくくなります。Terraform なら、設定変更を pull request にして、差分を見てから apply できます。

これは日本企業ではかなり重要です。AI の利用が PoC だけでなく、本番 API、社内業務、開発支援、Codex、ChatGPT Work へ広がると、設定変更も監査対象になります。費用、権限、モデル利用、データ保持、通知先を「誰かが画面で変えた」状態のままにすると、問題が起きたときに説明しにくくなります。

## spend alertとhard limitは違う

OpenAI の Terraform guide では、monthly spend alert を作る例があります。これは、月次利用額が閾値に達したら email で知らせる設定です。

ただし、spend alert は API request を止めません。通知するだけです。API を止める hard spend limit とは違います。[OpenAI API支出上限](/blog/openai-api-hard-spend-limits-2026/) で扱った hard limit は、上限に達したときに request を `429` で失敗させる強い設定です。

つまり、spend alert は「そろそろ危ない」と知らせる仕組み、hard limit は「ここで止める」仕組みです。Terraform で alert を作れるようになっても、停止条件や復旧手順は別に設計する必要があります。

## 既存環境はimportから始める

すでに OpenAI を使っている会社は、いきなり Terraform で作り直してはいけません。既存 project や service account を壊す可能性があるからです。

OpenAI の import guide では、まず現在の設定に合う Terraform configuration を書き、import block で既存 resource を Terraform state に取り込み、最後に no-op plan を確認する流れが示されています。no-op plan とは、Terraform が「変更なし」と判断する状態です。

この状態を作ってから、初めて設定変更を Terraform で進めるのが安全です。最初は低リスクの project で試し、本番 project は手順が固まってから移すべきです。

## 日本企業が最初にやること

まず、OpenAI の project 台帳を作ります。project 名、owner、用途、本番か PoC か、service account、role、rate limit、spend alert、通知先を書き出します。

次に、Admin API key の保管場所を決めます。個人 PC ではなく、secrets manager や CI の安全な secret に置くべきです。

その後、Terraform plan を pull request でレビューする運用を作ります。project 作成は軽いレビュー、service account や role 変更は強めのレビュー、model permission や data retention はセキュリティ確認付き、というように変更の重さで承認を分けるとよいです。

OpenAI Terraform provider は、AI を安全に使うための完成品ではありません。しかし、OpenAI の管理設定をコード化し、レビューし、差分を残すための大事な部品です。AI 基盤が大きくなるほど、管理画面だけで運用するより、Terraform のような仕組みに寄せたほうが説明しやすくなります。

## 出典

- [OpenAI API Changelog](https://developers.openai.com/api/docs/changelog)
- [Terraform provider](https://developers.openai.com/api/docs/guides/terraform)
- [Rate limits and spend with Terraform](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend)
- [Import and reconcile OpenAI resources](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile)
