---
title: 'GitHub AI使用レポート、6月締めの請求列変更対応'
description: 'GitHub AI使用レポートの列変更を整理。日本企業が6月1日以降のAI Credits実績をquantity、gross_amount、旧aic列でどう読み替えるか実務向けに解説する。'
pubDate: '2026-06-12'
category: 'news'
tags: ['GitHub Copilot', 'SaaSコスト管理', '従量課金', '管理者設定', 'GitHub Enterprise Cloud', '開発者ツール', 'AIエージェント']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月11日**、AI usage report の列の扱いを更新した。6月1日に GitHub AI Credits が native billing model になった後は、AI credit quantity は `quantity`、金額は `gross_amount` を見る。プレビュー期間に追加されていた `aic_quantity` と `aic_gross_amount` は、6月1日以降の AI credit usage では意味を持たなくなり、GitHub は同日以降の値を retroactively に zeroed したと説明している。

これは小さな CSV 修正に見えるが、日本企業の月次締めでは重要だ。5月時点の [Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/) は、AI Credits 移行前の見積もりをどう読むかが焦点だった。今回の更新は、移行後の本番レポートでどの列を正として使うかの話である。

特に、[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理した共有プール、user-level budget、cost center、追加利用ポリシーを運用し始めた組織では、BI や経理連携で旧 `aic_*` 列を参照し続けると、6月分の実績を誤って読む可能性がある。これは請求そのものよりも、社内配賦、予算アラート、利用傾向分析に効く更新だ。

## 事実: 6月1日以降は標準列がAI Creditsの基準になる

GitHub Changelog によると、AI usage report は GitHub AI Credits usage を標準の report fields に反映するようになった。今後 AI credit usage を見る場合、AI credit quantity は `quantity`、ドル金額は `gross_amount` を使う。GitHub は、この2つが preview 期間に `aic_quantity` と `aic_gross_amount` が提供していた signal と同じになると説明している。

この変更の背景は、6月1日の billing model 変更だ。GitHub は、AI credits が native billing model になった後、preview 用の `aic_quantity` と `aic_gross_amount` は AI credit usage に対して意味を持たなくなったと説明している。本来はゼロになるべきだったが、bug により値が残っていたため、修正で6月1日以降の AI credit usage について retroactively zeroed された。

GitHub Docs の billing reports reference でも、AI usage report は `date`、`model`、`username` といった軸で `quantity`、`gross_amount`、`discount_amount`、`net_amount` を集計する説明になっている。つまり、6月以降の標準化された読み方は、AI credits だけを特別な補助列で見るのではなく、他の metered usage と同じ列体系で扱う方向である。

実務上は、まず自社の取り込み処理を確認する必要がある。DWH、Spreadsheet、Looker Studio、Power BI、社内 FinOps dashboard で `aic_quantity` や `aic_gross_amount` を参照している場合、6月分からは `quantity` と `gross_amount` を primary にする。旧列は、5月以前の移行準備データを読むための互換情報として分けるほうが安全だ。

## 事実: 6月前後のデータを一本の式でつなげない

ここで注意したいのは、GitHub が「6月1日以降」の AI credit usage について旧 `aic_*` 列を zeroed した点だ。GitHub は、6月1日より前の reports は unchanged で、historical analysis は従来通り動くと説明している。つまり、5月以前の見積もり用データと、6月以降の本番課金データでは、正として見る列が異なる。

日本企業の月次運用では、ここで事故が起きやすい。たとえば、5月の April usage report を参考にした予算表と、6月の AI usage report を同じ SQL でつなぎ、`aic_quantity` を合算していると、6月以降がゼロに見える。逆に、5月以前も `quantity` だけで読むように変えると、preview 期間の比較ロジックが崩れる可能性がある。

したがって、月次締めでは期間で読み替えるべきだ。5月以前の preview analysis は、その時点の説明どおりに `aic_*` 列を使った見積もりとして保存する。6月1日以降の実績管理は、`quantity`、`gross_amount`、`discount_amount`、`net_amount` を標準列として扱う。過去月を上書きして同じ指標名にしてしまうと、あとから監査や予算説明が難しくなる。

この点は、[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/) のような利用定着指標とも関係する。利用段階の cohort、モデル別消費、ユーザー別消費を同じ dashboard で見る場合、指標名が同じでも期間によって列の意味が違うと、AI adoption と cost の相関を誤って説明してしまう。

## 分析: これは請求額よりも配賦ロジックの問題である

ここからは分析だ。

今回の更新で最も重要なのは、GitHub が AI Credits を他の usage-based billing と同じ report structure に寄せている点だ。AI Credits は Copilot の特別な単位だが、社内の費用管理では、最終的に product、sku、quantity、gross amount、discount、net amount、cost center、organization、repository といった会計・FinOps の列に落ちる。

これは、開発者には地味に見える。しかし、企業運用ではかなり大きい。Copilot が単なる seat SaaS だった段階では、利用量レポートは導入効果やヘビーユーザー確認の材料だった。AI Credits 移行後は、usage report が部門配賦、予算消化、追加利用承認、モデル利用方針の根拠になる。

日本企業では、開発部門、情シス、経理、購買、事業部門が別々の粒度で数字を見ることが多い。開発部門は「どの機能が生産性に効いたか」を見たい。経理は「どの部門にいくら配賦するか」を見たい。情シスは「誰が上限を超えそうか」を見たい。旧列と新列が混ざると、この3者が同じ report を見ているつもりでも、別の数字を見てしまう。

そのため、今回の変更は「CSV の列名が変わった」ではなく、6月以降の AI Credits を会計・管理指標へ載せるための正規化と読むべきだ。`quantity` と `gross_amount` を正にすることで、Copilot だけを例外扱いせず、他の GitHub usage と同じ report pipeline に乗せやすくなる。

## 実務: BIと締め処理で直すべき4点

最初に直すべきは、取り込み schema だ。AI usage report の ingest job が `aic_quantity` と `aic_gross_amount` を必須列として扱っているなら、6月以降はそれを primary metric にしない。旧列は nullable な legacy field として残し、標準列の `quantity` と `gross_amount` を AI Credits の primary metric にする。

2つ目は、月次比較の view だ。5月以前の preview estimate と6月以降の actual usage を同じグラフに出すなら、凡例や注記で「5月以前は preview estimate、6月以降は native billing actual」と分ける。単純な前年比や前月比にすると、列定義変更による差を利用増減と誤認しやすい。

3つ目は、cost center の照合だ。GitHub Docs では usage report や usage summary API が cost center、organization、repository、SKU といった軸で利用を返す。日本企業で部門配賦をするなら、GitHub 側の cost center と社内会計コードを先に対応づける。`gross_amount` を見ているのか、割引後の `net_amount` を見ているのかも、予算表の列名に明記したほうがよい。

4つ目は、運用アラートだ。追加利用を許可している組織では、`quantity` と `gross_amount` を使って AI Credits の消費ペースを監視する。追加利用を許可していない場合でも、月末に Chat、Copilot CLI、cloud agent、Agentic Workflows が止まると業務影響が出る。最近の [GitHub Agentic Workflows、Actions認証の実務](/blog/github-agentic-workflows-actions-token-2026/) のように、組織課金へ寄る agentic workflow が増えるほど、個人別 budget だけでは足りない。

## まとめ

GitHub の AI usage report 更新は、6月1日以降の AI Credits 実績を `quantity` と `gross_amount` で読むようにする変更だ。preview 用に追加されていた `aic_quantity` と `aic_gross_amount` は、6月以降の AI credit usage では意味を持たず、GitHub は bug fix により同日以降の値をゼロ化した。

日本企業が確認すべきことは、請求額そのものよりもデータ pipeline である。5月以前の見積もりと6月以降の実績を分け、BI、月次締め、cost center 配賦、予算アラートで正しい列を参照する。Copilot の AI Credits 運用は、導入判断から月次管理へ移った。ここで列の意味を揃えておかないと、せっかくの利用量レポートが、予算会議で信頼されない数字になってしまう。

## 出典

- [AI usage report updates](https://github.blog/changelog/2026-06-11-ai-usage-report-updates/) - GitHub Changelog, 2026-06-11
- [Billing reports reference](https://docs.github.com/en/billing/reference/billing-reports) - GitHub Docs
- [Usage-based billing for organizations and enterprises](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
- [Billing usage REST API](https://docs.github.com/en/rest/billing/usage) - GitHub Docs
