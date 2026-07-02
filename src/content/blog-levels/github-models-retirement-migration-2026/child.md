---
article: 'github-models-retirement-migration-2026'
level: 'child'
---

GitHubは2026年7月1日、**GitHub Modelsを7月30日に完全終了する**と発表しました。GitHub Modelsは、複数のAIモデルをplaygroundで試したり、APIから呼び出したり、BYOKで自分の鍵を使ったりできるサービスです。

終了するのは一部のモデルだけではありません。playground、model catalog、inference API、BYOK endpointが対象で、すでに使っている人も7月30日以降は利用できません。

## Copilotの終了ではない

最初に区別したいのは、GitHub ModelsとGitHub Copilotは別だということです。今回の発表は、Copilot ChatやCopilot CLIそのものが終わるという話ではありません。

GitHub Modelsを自社アプリのAPIとして使っている、playgroundでpromptを管理している、GitHub Actionsからinference APIを呼んでいる場合は移行が必要です。一方、Copilotでコード補完やagent作業をしているだけなら、今回の終了対象を直接使っているとは限りません。

[Copilot appのBYOK](/blog/github-copilot-app-byok-model-providers-2026/)にも「BYOK」という言葉がありますが、GitHub ModelsのBYOK endpointとは別の製品機能です。台帳には「BYOK利用」とだけ書かず、どのサービスのどのendpointかまで書く必要があります。

## 7月16日と23日に一時停止する

GitHubは、完全終了前の7月16日と23日に短時間のbrownoutを予定しています。brownout中は、GitHub Modelsへのrequestが一時的にエラーになります。

これは移行確認に使えます。たとえば、夜間のGitHub Actions、社内bot、古いデモ、個人の検証repositoryがまだGitHub Modelsを呼んでいれば、エラーログや利用者からの報告で見つけられるかもしれません。

ただし、brownoutを待ってから調べ始めるのは危険です。先にコード、secret、workflow、社内ドキュメントを検索し、brownoutでは「見落とした依存がないか」「代替先へ切り替わるか」を確認します。

## 何へ移すのか

GitHubは、モデルAPIを使いたいプロジェクトにはAzure AI Foundry、GitHub上でAI workflowを作りたい場合にはGitHub Copilotを案内しています。2つは役割が違います。

Copilotは、repository、Issue、Pull Request、IDE、CLIで開発作業を進める用途に向きます。[CopilotのVS Code・CLI連携](/blog/github-copilot-autopilot-vscode-2026/)のようなコード変更やレビューの流れです。

一方、自社のWebサービスや社内アプリからAIモデルをAPIで呼ぶ場合は、モデルAPIを提供する別の基盤が必要です。移行先では、endpoint、model名、認証方法、request形式、streaming、rate limit、料金が同じとは限りません。

## まず確認する5項目

1つ目は、どのrepositoryがGitHub Modelsを使っているかです。base URL、SDK、model名、token名を検索します。

2つ目は、GitHub Actionsや定期処理です。普段は見ない夜間jobや評価scriptにも依存が残ることがあります。

3つ目は、secretです。repository、organization、environment、開発者のローカル環境に古いtokenがないかを確認します。

4つ目は、playgroundの資産です。prompt、比較結果、評価基準がplaygroundにしかないなら、終了前に移します。

5つ目は、費用です。Copilotへ移すならseatやAI Credits、外部providerへ移すならAPI料金を確認します。[Copilot AI Creditsの予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)と同じく、利用量だけでなく上限到達時に何が止まるかも決めます。

## 4週間の進め方

最初の週に利用箇所とownerを一覧にします。次の週に、Copilotへ移す、別のAPI基盤へ移す、不要なので止める、の3つへ分けます。

7月16日のbrownoutまでに代替先を用意し、23日のbrownoutでは本番に近い切替を確認します。最後の週にGitHub Models用のsecret、古いworkflow、不要なpackageを削除します。

移行先を決めるときは、単に同じpromptが動くかだけでなく、品質、応答時間、token量、料金、ログ、データの保存場所を確認します。とくに顧客データや機密コードを扱う場合、未承認のproviderへ自動でfallbackしてはいけません。

## まとめ

GitHub Modelsは7月30日にサービス全体が終了します。既存利用者も対象で、7月16日と23日には短いbrownoutがあります。

大切なのは、CopilotとGitHub Modelsを混同しないことです。開発作業はCopilot、アプリからのモデル呼び出しは別のAPI基盤、不要なPoCは停止、と用途ごとに分けます。終了日前にsecretを削除し、古いendpointへ戻れない状態まで作れば移行完了です。

## 出典

- [GitHub Models is being fully retired on July 30, 2026](https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/) - GitHub Changelog, 2026-07-01
- [GitHub Models is no longer available to new customers](https://github.blog/changelog/2026-06-16-github-models-is-no-longer-available-to-new-customers/) - GitHub Changelog, 2026-06-16
- [GitHub Models documentation](https://docs.github.com/en/github-models) - GitHub Docs
