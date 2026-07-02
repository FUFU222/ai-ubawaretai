---
title: 'GitHub Models完全終了、7月30日までの移行設計'
description: 'GitHub Modelsは2026年7月30日に完全終了し、API、BYOK、playgroundも停止する。日本企業の開発チームがbrownout前に利用箇所を棚卸しし、CopilotやAzure AI Foundryへ移す判断軸と実務手順を整理する。'
pubDate: '2026-07-02'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'AI モデル', 'BYOK', '開発者ツール', '企業導入', 'AIガバナンス']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月1日**、**GitHub Modelsを7月30日に完全終了する**と発表した。終了対象は一部のモデルだけではない。playground、model catalog、inference API、BYOK endpointを含むサービス全体で、既存の利用者も対象になる。

対応期間は約4週間しかない。さらにGitHubは、終了前の**7月16日と23日**に短時間のbrownoutを予定している。brownout中はGitHub Modelsへのリクエストが一時的にエラーになる。日本の開発チームにとって、これは単なる廃止予告ではなく、アプリ、検証環境、GitHub Actions、社内デモ、秘密情報、請求先を期限までに棚卸しする移行案件である。

GitHubは代替先として、モデルAPIが必要なプロジェクトにはAzure AI Foundry、GitHub上でAI workflowを作る用途にはGitHub Copilotを案内している。ただし、両者は同じ機能の移転先ではない。[Copilot appのBYOKとモデル調達](/blog/github-copilot-app-byok-model-providers-2026/)で扱ったように、Copilotは開発作業面として外部モデルも選べる。一方、独自アプリから汎用の推論APIを呼ぶ用途では、API契約、SDK、認証、モデル名、レート制限を別途移す必要がある。

## 事実: 7月30日に何が止まるのか

GitHub Changelogによると、7月30日以降はGitHub Modelsのplayground、model catalog、inference API、BYOK endpointが利用できなくなり、関連UIも削除される。対象はfreeやpaidの区別ではなく、現在アクティブに使っている既存顧客を含む全利用者だ。

この点は、6月16日の最初の発表から変わっている。6月16日時点では、新規のorganizationとenterpriseがGitHub Modelsを使い始められなくなった一方、既存顧客はplayground、API、modelsを従来どおり利用できた。7月1日の発表で、その猶予の終了日が7月30日と確定した。

影響範囲は、本番APIだけではない。GitHub ModelsのDocsは、model catalogでモデルを探す、playgroundでpromptを試す、promptをrepositoryへ保存する、複数モデルを評価する、organization単位で利用を管理するといった一連の機能を案内している。したがって、API endpointを差し替えるだけでは、評価手順、prompt資産、チーム権限、実験の再現方法が残らない可能性がある。

まず「GitHub Modelsを直接使っているか」を確認する必要がある。Copilot Chatでモデルを選んでいるだけなら、今回のGitHub Models終了と同一ではない。反対に、GitHub Modelsのtoken、endpoint、SDK、playground、prompt file、evaluation workflowを利用しているなら移行対象だ。サービス名が似ているため、Copilot内の個別モデル退役とGitHub Models自体の終了を分けて説明しなければならない。

## 事実: 2回のbrownoutは移行テストに使える

GitHubは7月16日と23日に短時間のbrownoutを実施するとしている。brownout中、GitHub Models requestは一時的にエラーを返し、その後サービスは復旧する。正確な停止時間や長さは発表本文では示されていないため、特定時刻を前提にした試験計画は組めない。

それでも、brownoutは依存箇所を発見する機会になる。開発環境だけを見て「使っていない」と判断しても、夜間のGitHub Actions、定期バッチ、社内bot、デモ環境、評価script、個人の検証repositoryがGitHub Modelsを呼んでいるかもしれない。brownout時のエラーをログ、alert、利用者報告から集めれば、静的な検索で漏れた経路を見つけられる。

ただし、brownoutまで何もしないのは遅い。先にendpoint、token名、package、workflow、secretを検索し、代替経路を用意する。そのうえでbrownoutを「fallbackへ切り替わるか」「利用者へ明確なエラーを返せるか」「監視が検知するか」の確認日に使うべきだ。

本番終了日は7月30日なので、7月23日のbrownout後に初めて代替を検討すると余裕がない。日本企業では承認、契約、クラウドsubscription作成、ネットワーク審査、個人情報・機密情報の確認に時間がかかる。少なくとも7月16日までに移行先を決め、23日までに本番相当の切替試験を終える日程が現実的である。

## 分析: CopilotとAzure AI Foundryは代替範囲が違う

ここからは分析だ。

GitHubの案内は、代替先を用途で分けている。GitHub上でAI-powered workflowを構築したい場合はCopilot、アプリケーションからAI modelへアクセスしたい場合はAzure AI Foundryである。この区別を無視して、「GitHub ModelsをCopilotへ移す」と一括で決めると設計を誤る。

Copilotが向くのは、repository、Issue、Pull Request、IDE、CLIを中心に、人間やagentが開発作業を進める用途だ。[Copilot、VS Code、CLI、worktreeをつなぐ運用](/blog/github-copilot-autopilot-vscode-2026/)のように、コードを読み、変更し、レビューへつなぐ作業面として使う。社内botや自社製品の推論backendをCopilotへそのまま置き換える話ではない。

Azure AI Foundryのようなモデルプラットフォームが向くのは、自社アプリからAPIを呼び、モデル、deployment、認証、quota、監視を管理する用途である。ただしGitHubの発表は、既存のGitHub Models APIに対する自動移行や完全互換を保証していない。移行時にはSDK、base URL、model identifier、request/response schema、streaming、tool calling、error code、rate limitを実測で確認する必要がある。

BYOKも分けて考えたい。GitHub ModelsのBYOK endpointは7月30日の終了対象である。一方、Copilot appで外部providerを使うBYOKは別の製品面だ。名称が同じでも、鍵の保存場所、対応provider、用途、課金、管理者policyが違う。「BYOKを使っている」という台帳だけでは移行要否を判定できないため、サービス名とendpointを併記する必要がある。

## 実務: 最初に作る依存関係台帳

最初の棚卸しでは、repository検索だけに頼らず、少なくとも6つの観点を見る。

1. **コード**: GitHub Modelsのbase URL、SDK、model名、認証header、retry処理を検索する。
2. **CI/CD**: GitHub Actions、scheduled workflow、deployment script、evaluation jobを確認する。
3. **secret**: repository、organization、environment、ローカル開発環境にあるtokenやkeyを確認する。
4. **資産**: playgroundでしか管理していないprompt、比較結果、評価基準、model選定メモを退避する。
5. **運用**: owner、利用者、障害連絡先、SLO、fallbackの有無を記録する。
6. **費用**: 現在の利用量と、代替providerでのtoken単価、固定費、予算上限を比較する。

台帳は「repository名、用途、owner、現endpoint、現model、データ分類、月間利用量、移行先、切替日、rollback方法」の列を持たせるとよい。個人検証や停止済みPoCも削除対象として載せる。使っていないsecretを残すと、後から誰かが古いendpointを再利用し、7月30日に原因不明の障害を起こす。

Copilotへ寄せる場合も費用は自動的に同じにならない。[GitHub Copilot AI Creditsの課金と予算](/blog/github-copilot-ai-credits-billing-budgets-2026/)で整理したように、agenticな利用では共有プール、追加課金、user-level budgetを見る必要がある。モデルAPIからCopilot workflowへ設計を変えるなら、API token費用だけでなく、開発者seat、AI Credits、外部BYOK providerの請求を合わせて比較する。

## 実務: 4週間で終える移行手順

第1週は発見と分類に使う。全repository、organization secrets、Actions、社内ドキュメントを検索し、GitHub Modelsの利用を「開発支援」「自社アプリ組み込み」「評価・実験」「停止可能」に分ける。owner不明の利用は、削除ではなく一時隔離してアクセスログやcommit履歴から責任者を探す。

第2週は移行先を決める。開発作業ならCopilot、汎用APIならAzure AI Foundryなどのprovider、短期PoCなら終了を選ぶ。providerを変える場合は、同じprompt setと評価dataで品質、latency、token量、tool call、拒否率を比較する。モデル名が似ていても出力の癖やtokenizerは変わるため、単純な疎通だけでは不十分だ。

7月16日のbrownoutまでに、fallbackまたは明示的な停止表示を用意する。fallbackを実装する場合、silent fallbackで品質が変わる設計は避けたい。どのproviderへ切り替わったかをログに残し、ユーザーへ結果の性質が変わる可能性を示す。機密データを、承認されていない代替providerへ自動送信してはならない。

第3週は本番相当の切替と監査に使う。7月23日のbrownoutで旧endpointへの依存が残っていないかを確認し、error log、secret access、network logを照合する。新providerの請求、rate limit、監視、データ保持、アクセス権も確認する。

最終週は旧経路を削除する。GitHub Models用secretを失効し、workflowとrunbookを更新し、不要なpackageや設定を消す。7月30日直前まで旧経路を残すと、緊急時に戻してしまうため、移行確認後は明示的に閉じる。終了日には監視担当を置き、未知の依存がエラー化していないかを見る。

## 日本企業が追加で確認すべき点

日本企業では、推論先の変更がデータ取り扱い審査に影響する。GitHub ModelsからAzure AI Foundryや別providerへ移すと、契約主体、利用region、ログ保存、データ保持、subprocessor、private networkの条件が変わる可能性がある。技術的に動くことと、社内で承認済みであることを分けて確認する必要がある。

委託開発では、発注側と受託側のどちらがGitHub Modelsを契約・利用しているかを明確にする。受託側の個人tokenで試作していた場合、そのまま発注側のAzure subscriptionへ移すことはできない。コード、prompt、評価data、秘密情報の所有者と、移行作業の費用負担を合意する。

もう一つは、終了を機会にPoCを減らすことだ。すべての実験を別providerへ移す必要はない。利用者がいない、評価基準がない、ownerがいない、費用対効果を説明できないものは停止する。期限付きの廃止対応では、移行と同時に廃棄判断を入れたほうが管理対象を減らせる。

## まとめ

GitHub Modelsは2026年7月30日に完全終了する。playground、model catalog、inference API、BYOK endpointが全利用者向けに停止し、7月16日と23日には事前brownoutが行われる。

日本の開発チームが今やるべきことは、代替モデルを一つ選ぶことではない。GitHub Modelsの利用を、開発支援、自社アプリAPI、評価資産、不要なPoCに分け、用途ごとにCopilot、Azure AI FoundryなどのAPI基盤、停止を選ぶことである。brownoutを依存発見と切替試験に使い、7月30日より前に旧secretとendpointを閉じるところまでを移行完了としたい。

## 出典

- [GitHub Models is being fully retired on July 30, 2026](https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/) - GitHub Changelog, 2026-07-01
- [GitHub Models is no longer available to new customers](https://github.blog/changelog/2026-06-16-github-models-is-no-longer-available-to-new-customers/) - GitHub Changelog, 2026-06-16
- [GitHub Models documentation](https://docs.github.com/en/github-models) - GitHub Docs
