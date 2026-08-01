---
article: 'github-copilot-enterprise-teams-model-access-2026'
level: 'child'
---

GitHub Copilotで、会社の管理者が「特定のenterprise teamだけに追加モデルを使わせる」公開プレビューを始めました。発表日は2026年7月31日で、GitHubは2026年8月3日から段階的に有効にすると説明しています。

これは、全員に同じAIモデルを開ける話ではありません。たとえば、社内の開発チーム全体には標準モデルだけを使わせ、障害調査チームやセキュリティチームだけに高性能モデルを許す、という設定に近い考え方です。

## 何が変わるのか

これまでのCopilot管理では、enterprise全体やorganization全体でモデルを許可する考え方が中心でした。今回の更新では、enterprise teamを対象に追加モデルの利用権限を渡せます。

たとえば、同じorganizationの中に、通常開発チーム、SREチーム、セキュリティチーム、委託先チームがあるとします。全員に高性能モデルを開くと費用やデータ管理が難しくなります。でも、全員に閉じると、本当に必要なチームも使えません。team単位の設定は、その間を作るための機能です。

ただし、これは公開プレビューです。管理画面の見え方や対象範囲が変わる可能性があります。最初から全社運用にせず、少数のteamで試すのが安全です。

## 日本企業で大事な点

日本企業では、同じGitHub organizationの中に、社員と委託先、複数部署、海外拠点が混ざることがあります。このとき、AIモデルの権限を全員同じにすると説明が難しくなります。

重要なのは、モデル名から決めないことです。まず「誰が、どんな仕事で、なぜ追加モデルを必要とするのか」を決めます。大きな障害調査、複雑なコードレビュー、大規模移行、セキュリティ修正などは候補になります。短い質問や簡単な補完なら、標準モデルで十分かもしれません。

また、teamのメンバー管理も大事です。退職者、異動者、委託契約が終わった人がteamに残っていると、意図しないモデル権限が残ります。AIモデルの設定だけでなく、GitHub teamの棚卸しも一緒に行う必要があります。

## どう始めるべきか

最初は、追加モデルを使う理由が明確な1から2チームだけで試すのが現実的です。たとえば、SRE、セキュリティ、生成AI推進、開発基盤チームなどです。

次に、使ってよい作業を短く決めます。「障害調査」「設計レビュー」「大規模変更の調査」など、用途を絞ります。何でも上位モデルを使ってよいとすると、費用が増えやすく、効果も測りにくくなります。

最後に、月次で見直します。AI Creditsの増え方、レビュー品質、問い合わせ、使えない人がいないか、想定外のteamに権限がないかを確認します。問題があれば、team権限を戻せるようにしておきます。

## 出典

- [Enterprise teams model policy targeting in public preview](https://github.blog/changelog/2026-07-31-enterprise-teams-model-policy-targeting-in-public-preview/) - GitHub Changelog, 2026-07-31
- [Managing availability of models in your enterprise](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-availability-of-default-models) - GitHub Docs
