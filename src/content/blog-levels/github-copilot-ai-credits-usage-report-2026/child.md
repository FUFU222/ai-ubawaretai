---
article: 'github-copilot-ai-credits-usage-report-2026'
level: 'child'
---

GitHubが**2026年5月12日**、Copilotの6月1日からの新しい課金に備えるため、4月分の**usage report**を公開しました。これは、4月に使ったCopilotが、GitHub AI Creditsという新しい単位ではどれくらいの金額感になるかを見るためのレポートです。

ポイントは、Copilotが「何人に配ったか」だけでなく、「どの機能を、どのモデルで、どれくらい使ったか」で費用が変わる段階に入ることです。

## 何が変わるのか

GitHub Copilotは、**2026年6月1日**からusage-based billingへ移ります。GitHub Docsでは、AI CreditsがCopilot利用の課金単位になると説明されています。1 AI Creditは0.01米ドルとして扱われ、モデルとトークン量によって消費が変わります。

ただし、すべての機能が同じように課金されるわけではありません。Docsでは、Copilot Chat、Copilot CLI、Copilot cloud agent、Copilot Spaces、Spark、third-party coding agentsなどがAI Creditsを消費すると説明されています。一方、コード補完とnext edit suggestionsは、paid planでは引き続きAI Creditsの対象外です。

## April usage reportで見ること

今回のレポートでは、4月のCopilot利用をもとに、6月以降のAI Credits換算を確認できます。GitHubは、上位利用者、モデル、利用面を把握し、6月1日前に予算を調整するための材料として使うことを想定しています。

ただし、これは請求書そのものではありません。GitHub Changelogでは、0x modelの一部期間が含まれないこと、4月24日から30日に重複行が出る可能性があること、Copilot code reviewの一部でAI Credit見積もりが欠ける場合があることも説明されています。

つまり、合計額だけを見て判断するのではなく、「どこで使われているか」を見ることが大事です。

## 日本企業で大事な理由

日本企業では、開発ツールの予算が開発部門、情シス、購買、プラットフォームチームに分かれていることがあります。席課金なら「何人分か」で話しやすいですが、AI Creditsになると使い方で費用が変わります。

たとえば、Copilot CLIやcloud agentをたくさん使うチームと、IDEの軽い補完中心のチームでは、同じ人数でも消費が変わります。さらに、Copilot code reviewを広く自動実行している場合は、AI CreditsだけでなくGitHub Actions側の消費も見なければなりません。

この流れは、以前の[Copilot code review課金変更](/blog/github-copilot-code-review-actions-minutes-2026/)ともつながります。Copilotは便利な補助機能から、予算と運用ルールが必要な開発基盤に変わっています。

## 5月中にやること

まず、April usage reportをダウンロードし、誰が、どのモデルを、どの機能で多く使っているかを確認します。次に、6月1日から9月1日までの移行枠と、その後の通常枠の両方で見積もります。

そのうえで、追加利用を許可するかを決めます。追加利用を許可すれば、枠を超えても使えますが費用が増えます。許可しなければ、枠を使い切った時点で利用が止まる場合があります。

最後に、モデルの使い分けを決めます。重要な設計や大きな実装では高性能モデルを使い、日常的な質問では軽いモデルを使う、といったルールがあるだけで予算は読みやすくなります。

## まとめ

GitHub Copilotのusage report公開は、6月1日のAI Credits移行に備えるための重要な準備です。日本のチームは、合計額だけでなく、利用者、モデル、機能、部門ごとの使われ方を見て、予算と停止条件を先に決める必要があります。

## 出典

- [April reports are now available to prepare for usage-based billing](https://github.blog/changelog/2026-05-12-april-reports-are-now-available-to-prepare-for-usage-based-billing/) — GitHub Changelog
- [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) — GitHub Docs
- [Preparing your organization for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/manage-and-track-spending/prepare-for-usage-based-billing) — GitHub Docs
