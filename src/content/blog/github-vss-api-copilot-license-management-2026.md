---
title: 'GitHub VSS管理API、Copilotライセンス照合の実務'
description: 'GitHub VSS管理APIを解説。日本企業がVisual Studio Subscription、SCIM、Copilot費用統制をどう照合し、ライセンス棚卸しを自動化すべきか整理する。'
pubDate: '2026-07-17'
category: 'news'
tags: ['GitHub Copilot', 'GitHub Enterprise Cloud', 'Visual Studio', '管理者設定', 'SaaSコスト管理', '企業導入', '開発者ツール']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年7月16日**、GitHub Enterprise Cloud管理者向けに、**Visual Studio Subscription(VSS)割り当てをREST APIで管理するエンドポイント**を追加した。対象は、VSS UPNとGitHubアカウントの対応を一覧化し、手動照合を追加・更新・削除する運用だ。

この更新は、Copilotの新モデルやエージェント機能のように目立つものではない。しかし日本企業では、Microsoft Enterprise Agreement、Visual Studio Subscription、GitHub Enterprise Cloud、GitHub Copilot Business/Enterpriseが同じ調達・ID管理の線上に乗りやすい。Copilotの費用や利用効果を見る前に、誰がどのGitHub Enterpriseライセンスを消費しているかを正しく照合できることが前提になる。

直近では、[Copilot部門予算UI](/blog/github-copilot-cost-center-budgets-ui-2026/)や[AI使用レポートの請求列変更](/blog/github-ai-usage-report-fields-2026/)を扱ってきた。今回のVSS管理APIは、それらの前段にある「IDとライセンスの棚卸し」を自動化する部品として見ると実務価値が分かりやすい。

## 事実: VSS照合をAPIで管理できる

GitHub Changelogによると、今回追加されたREST APIは3種類ある。1つ目はEnterprise内のVSS割り当てを取得し、それぞれがGitHubユーザーに照合済みかを確認するAPI。2つ目はVSS UPNをGitHub handleに対応付けるAPI。3つ目は誤った手動照合を削除し、再照合できるようにするAPIだ。

GitHubは、このAPIが特に役立つ場面として、VSS側のUPN形式がSCIM identityと一致せず、自動照合が効かない組織を挙げている。これまではUIで個別に直す必要があったが、今後はUPNとGitHub handleの対応表を用意し、bulk matchingをスクリプト化できる。

ここで扱うのは、Copilot seatそのものではなく、Visual Studio Subscription with GitHub Enterpriseのライセンス照合だ。ただし、GitHub Enterprise Cloudのメンバー、GitHub Copilotの対象者、AI Creditsやusage reportの説明対象は重なることが多い。したがって、VSS照合のずれは、Copilot費用統制や利用者棚卸しにも波及する。

## 事実: GitHub EnterpriseとVSSはUPN照合が前提

GitHub Docsは、Visual Studio subscriptions with GitHub Enterpriseを、MicrosoftのEnterprise Agreementで提供されるVisual StudioとGitHub Enterpriseの組み合わせとして説明している。利用者は、GitHub Enterprise部分を使うために、Enterprise配下のorganizationに参加する必要がある。

GitHub Enterprise Cloudでは、GitHub personal accountのverified emailがVisual Studio accountのUPNと一致すると、VSSライセンスが自動的に消費される。Enterprise Managed Usersの場合は、Visual Studio UPNがSCIM `userName` attribute、またはGitHub accountに紐づくlinked identityのemail addressと一致していることが重要になる。

一致しない場合、Enterprise ownerはGitHub上で手動照合できる。Docsは、利用規約上、1つのライセンスに対応するGitHub accountとVisual Studio accountは同一人物でなければならないと説明している。つまり、照合は単なる費用最適化ではなく、契約・監査・ID管理の問題でもある。

今回のAPIは、この手動照合をUIだけでなく機械的に管理できるようにした点が大きい。特に、日本企業でありがちな旧姓メール、グループ会社ドメイン、海外拠点ドメイン、委託先を含む混在運用では、UPNとGitHub handleの対応表を毎月棚卸しする価値がある。

## 分析: Copilot費用管理の前にID照合を固定する

ここからは分析だ。

GitHub Copilotの費用管理では、AI Credits、cost center、user-level budget、usage metricsに目が向きやすい。[Copilot使用指標の補正](/blog/github-copilot-usage-metrics-accuracy-2026/)でも整理したように、利用レポートは導入効果の説明に欠かせない。しかし、ライセンス照合がずれていると、どの部署がGitHub EnterpriseやCopilotの前提コストを持っているのかが曖昧になる。

たとえば、VSSに含まれるGitHub Enterpriseの権利を持っている利用者がGitHub側で正しく照合されていなければ、余分なEnterprise licenseとして扱われる可能性がある。反対に、退職者や異動者の照合が残っていれば、利用実態と契約上の権利がずれる。CopilotのAI Creditsだけを細かく見る前に、Enterprise licenseの土台を整えるべきだ。

これは[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)以降の月次運用ともつながる。AI Creditsは利用量の管理だが、VSS照合は「誰がGitHub Enterpriseを使う権利を持っているか」の管理である。前者は変動費、後者は契約・ID台帳に近い。両方を同じ月次会議で見てもよいが、出典と責任者は分ける必要がある。

## 日本企業が確認すべき運用設計

第一に、UPN、GitHub verified email、SCIM属性の対応を明文化する。Microsoft Entra IDのUPNを社員番号付きや国内ドメインで運用し、GitHub側では別メールをverified emailにしている組織では、自動照合が外れやすい。Enterprise Managed Usersを使う場合は、SCIM `userName` とlinked identityのemailがどの値から来るのかをIdP設定として確認する。

第二に、手動照合を「例外」として扱う。APIでbulk matchingできるようになると、CSVを流し込めばよいように見える。しかし手動照合は、自動照合できなかった理由を抱えた例外である。なぜUPNが一致しなかったのか、旧ドメインなのか、個人アカウント移行中なのか、委託先なのかを残さないと、次回の棚卸しで同じ問題を繰り返す。

第三に、削除APIを退職・異動のリカバリ手順に組み込む。誤った手動matchを削除できることは、単なる片付けではない。間違ったGitHub handleにVSSを結びつけた場合、正しい人に権利が渡らず、ライセンス消費も説明しづらくなる。削除、再照合、利用者通知、月次レポート反映までを1つの手順にするべきだ。

第四に、Copilotのcost centerやbudget設計と接続する。VSS照合はGitHub Enterprise licenseの話だが、実際の管理者はCopilotの費用統制も同時に見ることが多い。GitHub Enterpriseのライセンス台帳、Copilot seat台帳、AI Credits usage report、cost center budgetを同じ部署コードで突き合わせられるようにしておくと、月次説明が楽になる。

第五に、API tokenと権限を絞る。VSS照合APIはEnterprise管理に関わるため、スクリプトを個人端末で動かすより、GitHub Actionsや社内CIで実行し、入力CSV、dry run結果、差分、承認、実行ログを残すほうがよい。特に削除操作は、誤照合を直す力がある一方で、正しい照合を壊す力もある。

## 30日以内の導入チェック

最初の1週間は、現在のVSS照合状況を棚卸しする。GitHubのLicensing画面、Visual Studio Subscription管理ポータル、IdP/SCIMの属性、GitHub Enterprise member一覧を突き合わせる。自動照合、手動照合、未照合、招待未承諾を分け、どの状態が多いかを見る。

2週目は、UPNとGitHub handleの対応表を作る。これは恒久的な名簿ではなく、照合に必要な最小データに絞る。社員番号、氏名、部署などの過剰な個人情報を入れるより、VSS UPN、GitHub handle、照合根拠、承認者、失効予定日を残すほうが安全だ。

3週目は、APIのdry run相当を作る。GETで一覧を取得し、対応表と比較し、追加・更新・削除候補をレポートする。実際のPUT/DELETEを走らせる前に、GitHub管理者、Microsoft 365/Entra ID管理者、情シス、必要なら購買・経理で確認する。

4週目は、月次運用に入れる。VSS照合差分、GitHub Enterprise license消費、Copilot seat、AI Credits usageを同じ締め日に見る。ここで重要なのは、すべてを1つの数値にまとめないことだ。契約権利、seat、AI Credits消費、利用効果は別の指標として出す。

## まとめ

GitHubのVSS管理APIは、GitHub Copilotの新機能ではない。しかし、Copilotを含むGitHub Enterprise Cloud運用では、かなり実務的な更新だ。Visual Studio SubscriptionのUPNとGitHub accountの照合をAPI化できることで、UI手作業に寄っていたライセンス棚卸しを、月次のID・契約統制へ組み込める。

日本企業は、CopilotのAI Creditsや利用指標を見る前に、VSS、GitHub Enterprise license、Copilot seat、cost centerを同じ管理線で説明できるようにするべきだ。今回のAPIは、その土台を自動化するための小さいが重要な部品である。

## 出典

- [REST API endpoints for Visual Studio Subscription management](https://github.blog/changelog/2026-07-16-rest-api-endpoints-for-visual-studio-subscription-management/) - GitHub Changelog, 2026-07-16
- [Setting up Visual Studio subscriptions with GitHub Enterprise](https://docs.github.com/en/enterprise-cloud@latest/billing/how-tos/set-up-payment/set-up-vs-subscription) - GitHub Docs
- [About Visual Studio subscriptions with GitHub Enterprise](https://docs.github.com/en/enterprise-cloud@latest/billing/concepts/enterprise-billing/visual-studio-subs) - GitHub Docs
- [REST API endpoints for enterprise administration](https://docs.github.com/en/enterprise-cloud@latest/rest/enterprise-admin) - GitHub Docs
