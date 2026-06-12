---
article: 'github-ai-usage-report-fields-2026'
level: 'child'
draft: false
---

GitHub は 2026年6月11日、AI usage report の見方を更新しました。6月1日から GitHub AI Credits が正式な課金モデルになったため、AI credits の量は `quantity`、金額は `gross_amount` を見る形になります。以前の preview 用の `aic_quantity` と `aic_gross_amount` は、6月1日以降の AI credit usage では使うべき列ではなくなりました。

これは少し細かい変更に見えます。しかし、会社で Copilot の利用量を月次で集計している場合は大事です。[Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/) では、6月前の見積もりとして usage report を読む話でした。今回は、6月以降の本番データをどの列で読むかの話です。

## 何が変わったのか

GitHub の説明では、AI usage report は今後、AI Credits の利用を標準の report fields に反映します。つまり、AI credit quantity は `quantity`、ドル金額は `gross_amount` です。`aic_quantity` と `aic_gross_amount` は、AI Credits が正式な課金モデルになる前の preview 用の列でした。

6月1日以降、本来それらの `aic_*` 列は AI credit usage では意味を持たないため、ゼロになるべきでした。しかし bug により値が残っていたため、GitHub は6月1日以降の AI credit usage について、その値をさかのぼってゼロにしました。6月より前の report は変更されていないため、過去分析はそのまま使えます。

## 会社の集計で困るポイント

困るのは、5月以前と6月以降を同じ列で見てしまうことです。5月以前の見積もりで `aic_quantity` を使っていた BI や spreadsheet が、そのまま6月分にも使われると、6月以降の利用がゼロに見える可能性があります。

反対に、6月以降に合わせてすべてを `quantity` に変えると、5月以前の preview 分の説明がずれる場合があります。月次のグラフでは、5月以前は preview estimate、6月以降は actual usage と分けて表示したほうが安全です。

これは [GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) とつながります。AI Credits は、Chat、Copilot CLI、cloud agent、Spaces、Spark、third-party coding agents などの利用で消費されます。会社で追加利用を許すか、上限で止めるかを決めるには、正しい列で消費量を見なければなりません。

## 日本企業で確認すること

まず、社内の取り込み処理を確認します。AI usage report を DWH、BI、spreadsheet に入れているなら、6月以降の集計が `quantity` と `gross_amount` を見ているか確認してください。旧 `aic_*` 列だけを見ている場合は修正が必要です。

次に、部門別の配賦を確認します。GitHub の billing reports では、cost center、organization、repository、SKU などの軸で利用を見られます。日本企業では、開発部門、情シス、事業部門で予算が分かれることが多いため、どの部門にどの利用を割り当てるかを先に決める必要があります。

最後に、アラートも見直します。[GitHub Agentic Workflows、Actions認証の実務](/blog/github-agentic-workflows-actions-token-2026/) のように、AI を Actions や agent workflow で使う場面が増えると、個人の使いすぎだけでなく、組織課金の増加も見なければなりません。

## まとめ

GitHub AI usage report の更新は、6月1日以降の AI Credits 実績を `quantity` と `gross_amount` で読むための変更です。旧 `aic_quantity` と `aic_gross_amount` は、6月以降の本番課金では中心にしないほうがよいです。

日本のチームは、5月以前の見積もりと6月以降の実績を分けて扱い、BI、月次締め、部門配賦、予算アラートを確認すべきです。列の意味を間違えると、Copilot の利用量や費用を正しく説明できなくなります。

## 出典

- [AI usage report updates](https://github.blog/changelog/2026-06-11-ai-usage-report-updates/) - GitHub Changelog, 2026-06-11
- [Billing reports reference](https://docs.github.com/en/billing/reference/billing-reports) - GitHub Docs
- [Usage-based billing for organizations and enterprises](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
