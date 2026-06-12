---
article: 'github-ai-usage-report-fields-2026'
level: 'expert'
draft: false
---

GitHub の 2026年6月11日 AI usage report update は、Copilot 管理者にとって地味だが実務上は重要な変更だ。GitHub は、AI usage reports が GitHub AI Credits usage を標準 report fields に反映するようになり、今後は AI credit quantity を `quantity`、ドル金額を `gross_amount` で見ると説明した。preview 期間に追加されていた `aic_quantity` と `aic_gross_amount` は、AI Credits が 2026年6月1日に native billing model になった後は、AI credit usage の signal として意味を持たない。

この変更は、5月の [Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/) と明確に分けて読む必要がある。5月時点の report は、6月1日の usage-based billing 移行前に、4月利用を AI Credits 相当で見積もるための材料だった。今回の更新は、移行後の本番 report で、どの列を source of truth にするかの話である。

日本企業では、この違いが月次締め、DWH 取り込み、部門配賦、予算アラート、経営向け dashboard にそのまま影響する。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で扱ったように、AI Credits は seat 管理だけではなく、Chat、Copilot CLI、cloud agent、Spaces、Spark、third-party coding agents、Agentic Workflows のような実行面を横断する。列の意味を誤ると、利用実績を誤って読み、予算統制の説明も崩れる。

## 事実: `aic_*`列はpreview補助であり本番の正ではない

GitHub Changelog の説明は短いが、実務上の含意ははっきりしている。GitHub は、AI Credits が6月1日に native billing model になる前、preview として `aic_quantity` と `aic_gross_amount` を追加していた。これらは、AI Credits 移行後の消費量と金額感を事前に見るための補助列だった。

しかし、6月1日以降は AI Credits 自体が標準の billing model になった。したがって、AI credit quantity は `quantity` に、金額は `gross_amount` に出る。GitHub は、6月1日以降の AI credit usage に対して旧 `aic_*` 列が meaningful ではなく、zeroed されるべきだったと説明している。bug により値が残っていたため、fix によって6月1日以降の AI credit usage では retroactively zeroed された。

重要なのは、GitHub が「before June 1 の reports は unchanged」と明記している点だ。つまり、過去の preview analysis は破壊されない。一方で、6月以降の本番利用を旧列で見ると誤る。これは schema change というより、metric semantics の切り替えである。

GitHub Docs の billing reports reference も、この方向を裏づける。AI usage report は `date`、`model`、`username` などの組み合わせで、`quantity`、`gross_amount`、`discount_amount`、`net_amount` を合計する。AI Credits だけを特別な例外列として扱うのではなく、標準の usage reporting と同じ列で扱う設計である。

## 事実: APIとUIの数字を同じ定義に寄せる必要がある

GitHub Docs の Billing usage REST API は、enterprise、organization、user の請求主体に応じて usage を返す。enterprise では billing AI credit usage report、premium request usage report、usage report、usage summary といった endpoint があり、管理者または billing manager 権限が必要になる。enhanced billing platform の制約や、過去24か月の data access といった条件もある。

ここで問題になるのは、UI でダウンロードした report、REST API で取得した usage summary、社内 DWH に取り込んだ CSV、月次の spreadsheet が同じ定義で揃っているかだ。AI Credits 移行直後は、preview 列を見ていた report と、標準列を見始めた report が混在しやすい。

たとえば、管理者向けの UI report は6月以降 `quantity` と `gross_amount` を正しく反映しているが、社内 ETL が `aic_quantity` だけを AI credit usage として抽出していると、DWH 側だけゼロに見える。逆に、DWH 側を急いで `quantity` へ変えたが、5月以前の dashboard も同じ式に差し替えると、preview 期間の数値説明が変わる可能性がある。

したがって、6月移行期の正しい設計は、単一の列名を全期間に当てることではない。期間ごとの metric definition を明示し、reporting layer で `ai_credits_quantity_actual`、`ai_credits_gross_amount_actual`、`ai_credits_quantity_preview` のように意味の違う指標を分けるほうが堅い。経理や購買に出す数字は actual に限定し、5月以前の preview は予測・移行準備用として注記する。

## 分析: native billing化はFinOpsの入口である

ここからは分析だ。

GitHub が AI Credits を標準 report fields に寄せたことは、Copilot を GitHub の usage-based billing の一部として扱う流れを強める。開発者視点では、AI Credits は Copilot のための単位に見える。しかし、企業の FinOps 視点では、AI Credits は product、sku、quantity、gross amount、discount、net amount、cost center、repository、organization といった粒度へ変換される必要がある。

これは、AI 開発ツールの運用が「ライセンス配布」から「実行予算管理」へ移ったことを意味する。seat 数はまだ重要だが、それだけでは Chat、CLI、cloud agent、code review、Agentic Workflows の実行量を説明できない。高性能モデルを使った長い agent session と、軽い補完中心の利用を同じ seat cost で説明するのは、6月以降ますます難しくなる。

この文脈では、[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/) のような adoption 指標と、AI Credits の actual usage を結びつける価値が上がる。Agent first や Multi-agent の cohort が増えているチームでは、消費も増えやすい。逆に、消費は増えているが adoption phase が進んでいないなら、試行錯誤や不適切なモデル選択が多い可能性がある。

ただし、この結合は列定義が正しいことが前提だ。6月以降の actual を `aic_quantity` で見てしまうと、agent adoption が増えているのに cost が増えていないように見える。これは導入効果分析を誤らせる。AI 活用度と費用を並べるなら、まず usage report の列定義を固定する必要がある。

## 分析: 日本企業では監査説明の粒度が問題になる

日本企業では、AI ツール費用の説明先が複数ある。開発部門には生産性と利用面の説明が必要になる。情シスには権限、ログ、セキュリティ、停止条件の説明が必要になる。経理や購買には、請求額、部門配賦、割引、追加利用の説明が必要になる。経営には、AI 投資がどの業務改善につながったかの説明が必要になる。

AI usage report の列定義が揺れていると、それぞれの説明が食い違う。開発部門は `quantity` を見ているが、経理は旧 `aic_gross_amount` を参照している。情シスは user-level budget の消費を見ているが、Agentic Workflows のような organization-billed usage が別扱いになっている。こうした状態では、AI Credits の運用会議が数字合わせで終わってしまう。

その意味で、今回の GitHub update は、監査説明に使う指標を揃える機会でもある。6月1日以降の本番実績は `quantity`、`gross_amount`、`discount_amount`、`net_amount` を正とし、preview 期間は別指標として保存する。月次 report には、対象期間、report source、列定義、割引前後の扱い、cost center mapping を明記する。ここまでやって初めて、AI Credits を開発組織の通常のコスト管理に載せられる。

## 実務: migration checklist

第一に、ETL と schema を棚卸しする。AI usage report を取り込む job、API client、spreadsheet import、BI semantic layer、dbt model、Looker Explore、Power BI dataset を確認し、旧 `aic_quantity` と `aic_gross_amount` を primary metric として使っていないかを探す。見つかった場合、6月1日以降の actual usage は `quantity` と `gross_amount` へ切り替える。

第二に、期間分岐を明示する。2026年6月1日より前の preview analysis と、6月1日以降の native billing actual を同じ measure 名にしない。どうしても連続グラフにする場合は、5月以前を点線、6月以降を実線にする、または tooltip に metric source を表示する。数字がつながって見えることと、意味が同じであることは違う。

第三に、gross と net を分ける。GitHub Docs の billing report fields には `gross_amount`、`discount_amount`、`net_amount` がある。経理の配賦では net を使うのか、部門の利用責任を見るために gross を使うのかを決める必要がある。割引や含有枠がある場合、net だけを見ると重い利用が見えにくくなる。利用行動の分析は gross、請求配賦は net、という分け方が現実的だ。

第四に、cost center と GitHub organization の mapping を固定する。GitHub の usage report は cost center や organization、repository の軸を持つが、社内会計コードと一致するとは限らない。日本企業では、子会社、事業部、共通基盤、受託開発、研究開発で費用負担が分かれる。AI Credits は共有プールにもなるため、repository owner と budget owner が違う場合のルールを先に決める。

第五に、agentic workflow を別枠で見る。[GitHub Agentic Workflows、Actions認証の実務](/blog/github-agentic-workflows-actions-token-2026/) で扱ったように、Actions の `GITHUB_TOKEN` と `copilot-requests: write` を使う workflow では、AI Credits が組織課金へ寄りやすい。これは個人の heavy user とは違う費用の増え方をする。workflow run count、token usage cap、Actions minutes、AI Credits を同じ run id で追えるようにする。

第六に、budget alert を actual basis に直す。もし alert が旧 `aic_gross_amount` を見ているなら、6月以降は反応しない可能性がある。`gross_amount` または `net_amount` のどちらで alert を出すかを決め、user-level budget、cost center budget、enterprise budget と整合させる。特に追加利用を許可している組織では、月末の急増を検知できる必要がある。

## 実務: 月次締めで使う説明文を用意する

6月分の締めでは、数字だけでなく説明文も必要になる。たとえば、次のような注記を社内 report に入れるとよい。

「2026年6月1日以降、GitHub AI Credits は native billing model になったため、AI usage の数量は `quantity`、金額は `gross_amount` / `net_amount` を参照する。5月以前の preview 用 `aic_quantity` / `aic_gross_amount` は、移行準備用の見積もり指標として扱い、6月以降の本番利用実績とは分けて表示する。」

この注記は、経理向けには少し技術的に見えるかもしれない。しかし、6月の数字が5月と単純比較できない理由を説明するには必要だ。特に、5月の preview report をもとに予算申請を行い、6月から actual billing を見始めた会社では、指標の定義変更を明示しなければ、予算超過や過少利用の判断がぶれる。

また、管理者向けには「どの列を使うか」だけでなく、「どの用途で使うか」を分けるべきだ。開発利用の傾向分析には quantity と model、費用予測には gross_amount、実請求・配賦には net_amount、割引確認には discount_amount を使う。ひとつの金額列だけで全目的を満たそうとすると、AI Credits の運用は粗くなる。

## まとめ

GitHub AI usage report の6月11日更新は、AI Credits 本番運用の列定義を明確にする変更だ。6月1日以降の AI credit usage は `quantity` と `gross_amount` を見る。旧 `aic_quantity` と `aic_gross_amount` は preview 期間の補助列であり、6月以降の actual usage の source of truth ではない。

日本企業にとっての論点は、GitHub の請求額そのものより、社内データ pipeline と説明責任である。5月以前の preview estimate、6月以降の native billing actual、gross と net、cost center、user-level budget、agentic workflow usage を分けて扱う必要がある。

Copilot の AI Credits 運用は、もう導入準備ではなく月次管理の段階に入った。列定義を曖昧にしたまま BI や予算アラートを回すと、利用量、費用、導入効果の説明がずれる。最初に直すべきなのは、新しい dashboard ではなく、`quantity`、`gross_amount`、`net_amount` を正しく読むための metric contract である。

## 出典

- [AI usage report updates](https://github.blog/changelog/2026-06-11-ai-usage-report-updates/) - GitHub Changelog, 2026-06-11
- [Billing reports reference](https://docs.github.com/en/billing/reference/billing-reports) - GitHub Docs
- [Usage-based billing for organizations and enterprises](https://docs.github.com/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises) - GitHub Docs
- [Billing usage REST API](https://docs.github.com/en/rest/billing/usage) - GitHub Docs
