---
article: 'github-copilot-usage-metrics-accuracy-2026'
level: 'expert'
---

2026年7月2日のGitHub Copilot usage metrics更新は、分析基盤から見るとschema追加ではなく、観測関数の変更である。CLIのsuggested LoCが0固定ではなくなり、server-side-only userのIDE dimensionが補完され、欠落していたAI Credits attributionが修正された。列名が同じでも、変更前後で値が表す母集団とcoverageが異なる。

したがって、既存の時系列へ新データをappendするだけでは不十分だ。2026年7月2日をchange pointとして管理し、metric definition version、client version、data freshness、report scopeを保存する必要がある。そうしなければ、計測改善をadoption、productivity、cost varianceと誤認する。

今回の補正は、[Copilot導入cohortのAI adoption phase](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)と[チーム別metrics APIのdaily join](/blog/github-copilot-team-metrics-api-2026/)にも波及する。さらに、usage metricsのAI Creditsは請求値ではないため、[AI Credits使用量レポートの費用見積もり](/blog/github-copilot-ai-credits-usage-report-2026/)とは別のfact tableとして管理すべきである。

## 事実: 3つの変更は異なる品質問題を直した

CLI LoCの変更は**coverage**の改善である。Copilot CLI activityが `loc_suggested_to_add_sum` と `loc_suggested_to_delete_sum` へ入るようになった。以前はCLIに対して常に0だったため、0は「提案がなかった」ではなく「未計測」を含んでいた。今回の更新後は、その意味が変わる。

version境界は2段階ある。CLI 1.0.57以降でsuggested LoCが報告され、1.0.64以降でsuggested editとaccepted editの重複排除が適用される。GitHubは1.0.57から1.0.64未満のcode generation activityがわずかに過少集計される可能性を明記している。したがって、`last_known_cli_version` をdimensionとして保持せずにLoCを比較すると、チーム間のclient mixがmeasurement biasになる。

IDE識別は**dimensional completeness**の改善である。server-side telemetryだけで認識されていた利用者にもIDEとplugin versionがsurfacedされ、`totals_by_ide` がより多くの利用者を反映する。利用者総数が同じでも、IDE bucketのsumや各IDEのshareが変わり得る。

AI Creditsは**attribution completeness**の改善である。organizationと関連付かなかった消費が落ちる問題と、server-side-only userをbilling dataへmatchできない問題が修正された。既報値は変更されず、見落とされていた利用が追加されるため、影響は非対称である。全行を一定係数でbackfillできる種類の修正ではない。

この3つを「metrics精度改善」という1フラグだけで処理すると、原因分析が粗くなる。coverage、dimension、attributionを別のdata quality eventとして記録し、それぞれの影響列へ紐づけるべきだ。

## 事実: report surfaceごとにaggregation contractが違う

GitHub Docsによると、dashboard、API、NDJSON exportは同じ基礎telemetryを利用するが、aggregationとpresentationが異なる。dashboardは28日rolling window、APIとNDJSONはdaily recordである。scopeもenterprise、organization、per-userでshapeが異なる。

per-user reportには `user_id`、`user_login`、`ai_credits_used`、`used_*`、`ai_adoption_phase` がある。aggregated enterpriseまたはorganization reportにはactive-user count、`pull_requests`、`totals_by_ai_adoption_phase` がある一方、user identifierや `used_*` はない。28-day aggregated reportは `day_totals` にdaily recordを持つwrapperである。

team-level totalは事前集計されていない。daily user-teams reportとdaily per-user usage reportを、user、day、entity scopeでjoinして構築する。5 seat未満のteamはuser-teams reportから除外され、複数team所属者は複数行になる。team rowのsumをorganization totalとして扱えば二重計上になる。

IDE telemetryは非同期処理され、通常は丸3 UTC日以内に確定する。直近の日次値はright censoringされた状態と考えるべきだ。NDJSON exportも取得時点のdata snapshotなので、早期exportと確定後exportで値が異なり得る。

CLI metricsはIDE telemetryから独立している。`daily_active_cli_users` と `totals_by_cli` は、IDE-based active user countや `totals_by_ide`、`totals_by_feature` へ寄与しない。一方、今回の変更でCLIのsuggested LoCがtop-levelまたはactivity集計へ反映されるため、「surface別利用者」と「surfaceをまたいだactivity total」の分母を混同しない設計が必要になる。

## データモデル: immutable rawとversioned semantic layerを分ける

推奨構成は、raw、normalized、semantic、reportの4層である。

**Raw層**にはAPI responseまたはNDJSONを変更せず保存する。最低限、report type、enterprise ID、organization ID、report_start_day、report_end_day、day、created_at、取得時刻、source URLまたはendpoint、payload checksumを付ける。同じ対象日を再取得した場合もoverwriteせず、snapshotとして残す。

**Normalized層**ではreport shapeを分解する。per-user usage、aggregated usage、user-team membership、CLI activity、IDE breakdown、billing usageを別tableにする。nested arrayを展開するときは、親recordのscope、day、user ID、取得snapshot IDを失わないようにする。

**Semantic層**ではmetric definitionをversion管理する。例として `metric_definition_version = 'pre-2026-07-02'` と `'2026-07-02-accuracy-update'` を用意する。CLI suggested LoC、IDE coverage、AI Credits attributionの各列に個別のquality flagを持たせてもよい。

**Report層**では、用途ごとにviewを分ける。adoption viewはactive userとsurface利用、engineering viewはgeneration、acceptance、LoC、PR outcome、FinOps viewはusage metricsとbillingを扱う。1つのwide tableへ詰め込むと、同じ `ai_credits_used` を請求額として誤用しやすくなる。

推奨する管理列は次の通りだ。

| 列 | 用途 |
|---|---|
| `source_snapshot_at` | いつ取得した値か |
| `data_day` | activityの対象日 |
| `is_finalized` | 3 UTC日経過後か |
| `metric_definition_version` | 計測仕様の境界 |
| `cli_version_band` | `<1.0.57`、`1.0.57-1.0.63`、`>=1.0.64` |
| `report_scope` | enterprise、organization、user |
| `report_shape` | 1-day、28-day、user-teams |
| `source_surface` | IDE、CLI、server-side |
| `billing_reconciled` | billing dataとの照合状態 |

## 再基準化: 変更前後を無理に連結しない

理想的には、同一activityを新旧ロジックで再計算したoverlap periodを使い、系列の段差を推定する。しかしGitHubの公開情報だけでは、過去期間を旧ロジックと新ロジックの両方で再生成できる保証はない。特にAI Credits attributionは欠落していた個別利用を追加する修正であり、単純な倍率補正は危険だ。

現実的な方法は、**break-in-series**として扱うことだ。2026年7月2日以前の系列をlegacy baseline、変更後かつclient versionとfreshnessが安定した期間をnew baselineにする。経営資料では1本の線で結ばず、区切り線と注記を入れる。

new baselineの開始日は、少なくとも次の条件で決める。

1. 対象日の3 UTC日後に再取得している
2. CLI 1.0.64以降の比率が社内標準として十分高い
3. enterpriseと主要organizationでserver-side-only userの増分が安定した
4. billing reportとのAI Credits差異を説明できる
5. report pipelineが新しいdefinition versionを保存している

たとえば7月2日から7月8日をtransition windowとし、7月9日以降の4週間をnew baselineにする。期間はorganizationのclient rollout状況に応じて変える。重要なのは、calendar monthの都合で自動的に7月1日をbaseline開始日にしないことだ。

前年比較が必要なら、legacyとnew definitionの差を脚注に置き、absolute levelよりdirectionやoutcomeを中心に説明する。定量補正を行う場合も、CLI、IDE、AI Creditsを別々に推定し、推定値であることとconfidence intervalを示すべきである。

## AI Credits: consumption analysisとinvoice reconciliationを分離する

per-user reportの `ai_credits_used` は、reporting period中のユーザー消費量である。GitHub Docsは、このfieldがfeature、model、surface別に分解されず、invoice total用ではなくconsumption analysis用だと明記している。

この制約から、usage metricsだけで「どのmodelが何円使ったか」を再構築してはいけない。FinOps pipelineでは、次の3つを分ける。

- usage metrics: 誰がどの期間にどれだけAI Creditsを消費したかという利用傾向
- billing report: 課金対象、単価、含有枠、overage、cost centerなど請求説明
- entitlement/configuration: license、AI credit pool、budget、paid usage policy

照合keyはday、userまたはactor、enterprise、organization、cost centerを基本にするが、集計時刻とattribution timingが違うため、完全一致を強制しない。日次差異は一時的な可能性があるので、確定window後に月次でreconcileする。

差異tableには、usage metric total、billing total、absolute difference、percentage difference、unmatched user count、unattributed count、snapshot time、known data quality eventを保存する。7月2日前後の差異縮小は、コスト削減ではなくattribution改善である可能性がある。

[cost center別AI credit poolの部門配賦](/blog/github-copilot-ai-credit-pool-cost-center-2026/)を導入している場合も、usage metricsだけでpool残量やpaid overageを判断しない。configurationとbillingを正とし、usage metricsは利用パターンの説明に使う。

## CLI LoC: acceptanceとoutcomeを同一視しない

`loc_suggested_to_add_sum` はCopilotが追加を提案した行数で、成果物へ実際に入った行数ではない。`loc_added_sum` はeditorへ追加された行を表すが、最終的にmergeされたか、後で削除されたか、品質が良かったかまでは示さない。

CLI 1.0.64以降の重複排除はcount accuracyを改善するが、suggested LoCをproductivityへ変換するものではない。生成行数が多いほど成果が大きいという評価は、冗長な生成や再試行を促す。

専門チーム向けのscorecardでは、次の順で見るとよい。

1. Exposure: licensed user、active user、CLI active user
2. Activity: session、request、prompt、generation
3. Interaction: suggestion、acceptance、added/deleted LoC
4. Delivery: PR作成、merge、lead time、review turnaround
5. Quality: defect、revert、security finding、test failure
6. Experience: developer survey、認知負荷、待ち時間
7. Cost: AI Credits、overage、Actionsやrunner cost

usage metricsは1から3を主に扱う。4以降を同じ因果として結び付けるには、team、repository、work type、期間のcontrolが必要だ。単純な前後比較だけでは、リリース規模、人員、季節性、障害対応などの交絡を除けない。

## 監視: data quality SLOを設ける

今回のような補正を早く検知するには、product KPIとは別にdata quality SLOを持つ。

**Freshness**は、対象日から最終snapshotまでの遅延を見る。直近3 UTC日は暫定、4日目以降も変化が続けばalertにする。

**Completeness**は、active userに対するIDE identified率、CLI version identified率、`ai_credits_used = 0.0` の利用者比率、unknown dimension率を見る。7月2日の補正後にIDE identified率とAI Credits non-zero率が段差的に上がるのは期待される。

**Consistency**は、daily APIを28日windowへ集計した値とdashboard傾向、enterprise totalとorganization rollup、usage metricsとbillingの差異を見る。ただし、それぞれaggregation contractが違うため、厳密一致ではなく許容帯を定義する。

**Uniqueness**は、CLI editの重複やuser-team joinによる二重計上を監視する。CLI client version別のgeneration-to-acceptance ratioが急変した場合、1.0.64の重複排除またはclient mixの変化を疑う。

**Lineage**は、各経営指標がどのendpoint、snapshot、transformation、metric definitionを使ったか追跡できる状態にする。資料の数字からraw NDJSONまで戻れなければ、計測変更時に再評価できない。

## 移行runbook

第一段階では、2026年7月2日のdata quality eventをcatalogへ登録する。影響列、対象version、既知のbias、source link、ownerを記録する。

第二段階では、CLI 1.0.64以降を標準化する。MDM、developer environment manager、社内setup scriptなどで更新し、`last_known_cli_version` のdistributionを毎日確認する。1.0.57未満、1.0.57から1.0.63、1.0.64以降を分ける。

第三段階では、raw snapshotを再取得する。少なくとも変更前7日、transition期間、変更後の確定済み日を保存する。ただし、再取得データが過去値を新ロジックでbackfillしたかは推測せず、snapshot差分を確認する。

第四段階では、semantic layerへdefinition versionを追加し、legacy dashboardにbreak markerを出す。月次資料、KPI glossary、BI tooltip、analyst noteを同時に更新する。

第五段階では、billing reconciliationを行う。差異が残る場合は、scope、snapshot timing、server-side-only user、organization attribution、含有枠とoverageを順に確認する。

第六段階では、new baselineを承認する。開発基盤、FinOps、Copilot管理者、データ分析責任者が、対象期間、client coverage、freshness、差異許容帯を確認する。人事評価や部門ランキングへ使う場合は、プライバシーと目的外利用も別途審査する。

## まとめ

GitHub Copilot usage metricsの2026年7月補正は、CLI LoC coverage、IDE dimension completeness、AI Credits attribution completenessを改善した。一方、既存時系列にはdefinition breakが入り、同じ列名でも変更前後の比較可能性が下がる。

分析基盤では、raw snapshotをimmutableに保存し、metric definition version、CLI version band、freshness、scopeをsemantic layerへ持たせる。2026年7月2日以前と以後を無理に連結せず、transition windowの後にnew baselineを設定する。

usage metricsはconsumptionとadoption、billing reportはinvoice、delivery・quality dataはoutcomeを扱う。この境界を維持すれば、7月の増加を生産性向上や予算超過と早合点せず、「実利用」「coverage」「attribution」を分けて説明できる。

## 出典

- [Improved accuracy and coverage in Copilot usage metrics reports](https://github.blog/changelog/2026-07-02-improved-accuracy-and-coverage-in-copilot-usage-metrics-reports/) - GitHub Changelog, 2026-07-02
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [Reconciling Copilot usage metrics across dashboards, APIs, and reports](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/reconciling-usage-metrics) - GitHub Docs
