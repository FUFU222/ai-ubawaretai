---
article: 'github-vss-api-copilot-license-management-2026'
level: 'child'
---

GitHubは、Visual Studio Subscription(VSS)とGitHub Enterprise Cloudのライセンス照合をREST APIで管理できるようにしました。VSSとは、Visual Studioの契約にGitHub Enterpriseの利用権が含まれる組み合わせです。

これまでも、GitHub Enterpriseの画面からVSSとGitHubアカウントを手動で照合できました。今回の更新では、一覧取得、照合の追加・更新、誤った照合の削除をAPIで扱えるようになります。多人数の企業では、画面で1件ずつ直すより、対応表を作って確認しながら処理できます。

## 何が変わったのか

GitHub Changelogでは、3つのAPIが紹介されています。Enterprise内のVSS割り当て一覧を取得するAPI、VSS UPNをGitHub handleに対応付けるAPI、手動照合を削除するAPIです。

UPNは、Microsoft Entra IDなどで使うユーザー名に近いものです。GitHub Enterprise Cloudでは、GitHubアカウントのverified emailがVisual Studio側のUPNと一致すると、自動的にVSSライセンスが消費されます。Enterprise Managed Usersの場合は、SCIMの`userName`やlinked identityのemailとの一致も重要です。

つまり、今回のAPIは「誰にGitHub Enterpriseの権利を割り当てるか」を、より正確に管理するためのものです。

## なぜCopilot運用に関係するのか

このAPIは、直接にはGitHub Copilot seatを増減する機能ではありません。ただし、Copilotを使う多くの企業では、GitHub Enterprise Cloud、Visual Studio Subscription、Copilot Business/Enterprise、AI Creditsの管理が同じ情シスや開発基盤チームに集まります。

ライセンス照合がずれていると、Copilotの費用管理も説明しづらくなります。たとえば、ある人がVSSに含まれるGitHub Enterprise権利を持っているのにGitHub側で照合されていなければ、余分なライセンス消費に見えるかもしれません。逆に、退職者や異動者の照合が残っていれば、実際の利用者と契約上の権利がずれます。

CopilotのAI Creditsや利用レポートを見る前に、まずGitHub Enterpriseの利用者台帳を整える必要があります。

## 日本企業で起きやすい問題

日本企業では、メールアドレスやUPNが複数あります。社内ドメイン、グループ会社ドメイン、旧姓メール、海外拠点メール、個人GitHubアカウントのverified emailが一致しないことがあります。

また、Microsoft側の管理者、GitHub Enterprise owner、情シス、購買、経理が別組織に分かれていることも多いです。誰がVSSを割り当て、誰がGitHubに招待し、誰が照合結果を確認するのかが曖昧だと、月次の棚卸しで差分が増えます。

API化されたことで、こうした差分を毎月チェックしやすくなります。ただし、APIで一括更新できるからといって、何も確認せずに上書きするのは危険です。

## 最初にやること

まず、VSS側のUPN一覧とGitHub Enterprise member一覧を比べます。自動照合済み、手動照合済み、未照合、招待未承諾に分けます。

次に、UPNとGitHub handleの対応表を作ります。対応表には、照合理由、承認者、更新日、失効予定日を入れるとよいです。氏名や部署など、不要な個人情報を入れすぎないことも大切です。

最後に、APIで実行する前に差分レポートを作ります。追加される照合、変更される照合、削除される照合を、人間が確認してから反映します。

## まとめ

GitHubのVSS管理APIは、派手なAI機能ではありません。しかし、GitHub Enterprise CloudとCopilotを企業で安全に使うには、ライセンスとIDの照合が土台になります。

日本企業では、Visual Studio Subscription、GitHub Enterprise license、Copilot seat、AI Creditsを別々に見ず、月次の棚卸しでつなげて確認することが重要です。今回のAPIは、その作業を手作業から自動化へ移すための更新です。

## 出典

- [REST API endpoints for Visual Studio Subscription management](https://github.blog/changelog/2026-07-16-rest-api-endpoints-for-visual-studio-subscription-management/) - GitHub Changelog
- [Setting up Visual Studio subscriptions with GitHub Enterprise](https://docs.github.com/en/enterprise-cloud@latest/billing/how-tos/set-up-payment/set-up-vs-subscription) - GitHub Docs
- [About Visual Studio subscriptions with GitHub Enterprise](https://docs.github.com/en/enterprise-cloud@latest/billing/concepts/enterprise-billing/visual-studio-subs) - GitHub Docs
