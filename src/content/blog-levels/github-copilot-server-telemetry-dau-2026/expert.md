---
article: 'github-copilot-server-telemetry-dau-2026'
level: 'expert'
draft: false
---

GitHub の 2026年6月15日 Copilot usage metrics update は、Copilot 管理者が見る active-user 指標の母集団を変える。GitHub は、Copilot usage metrics reports に server-side telemetry を加え、client telemetry だけでは捕捉できなかった active users を enterprise single-day report と 28-day report に含めると発表した。これにより daily active user coverage は上がる。

この更新は、機能追加というより metric contract の変更である。Copilot が突然多く使われるようになったのではなく、これまで欠落していた active, billed users が report に現れる可能性が高まる。[GitHub AI使用レポート、6月締めの請求列変更対応](/blog/github-ai-usage-report-fields-2026/) が AI Credits の `quantity` と `gross_amount` の読み替えを扱ったのに対し、今回は adoption metric の source と completeness の話だ。

日本企業では、Copilot 導入の説明が「seat を配ったか」から「誰が継続利用しているか」「部門別に定着しているか」「請求や activity log と整合しているか」へ移っている。[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/) のような cohort 設計をしている企業ほど、6月15日前後の DAU 上昇を施策効果として即断しない運用が必要になる。

## 事実: client telemetry依存の欠落をserver-side signalで埋める

GitHub Changelog の説明では、Copilot usage reports は歴史的に IDE や other clients から送られる client-side telemetry を基に構成されてきた。client telemetry は rich source であり、IDE、feature、model、code activity などの詳細を持つ。しかし、ネットワーク条件、proxy 構成、client settings、その他の要因により、その telemetry が GitHub に届かないことがある。

この場合、実際には Copilot を使っている active, billed user が usage report に現れない。企業側から見ると、billing や activity log では存在感があるのに usage metrics では inactive に見える、というズレになる。GitHub は今回、server-side telemetry で active と確認でき、client telemetry では捕捉できていなかった users を enterprise single-day and 28-day reports に含めるようにした。

GitHub の例では、以前の enterprise single-day report が 1,000 DAU を示していた場合、server-side telemetry で確認された 50 users が加わり、1,050 になることがある。ここで既存 users の top-level totals や breakdown が変わるわけではない。追加されるのは、これまで欠落していた active users である。

GitHub Docs の Copilot usage metrics は、usage metrics dashboard、Copilot usage metrics APIs、code generation dashboard、NDJSON export などを含む。REST API は enterprise、organization、user-level の report を扱い、28-day reports や single-day reports を取得できる。したがって、今回の変更は GitHub UI の見た目だけでなく、NDJSON export や API を取り込む DWH、BI、社内ポータルにも波及する。

## 事実: completenessは上がるがattributionは遅れる

今回の更新で最も誤解されやすいのは、active user の completeness と detailed attribution を分ける必要がある点だ。GitHub は、server-side telemetry 由来で新たに surfaced された users は fully identified され、active user totals に含まれると説明している。一方で、server-side telemetry は client telemetry が持つ rich per-interaction detail をまだ持っていない。

具体的には、IDE、feature、model、lines-of-code activity などの内訳は、server-side telemetry 由来 users について空欄になり得る。結果として、top-level の DAU や 28-day active users は増えるが、`totals_by_ide` や `totals_by_feature` のような breakdown は同じ比率では増えない。管理者から見ると、unattributed activity が増えたように見える。

これは欠陥ではなく、段階的な instrumentation の状態として扱うべきだ。GitHub は、今回を server-side signals を Copilot metrics に取り込む broader effort の first step と位置づけ、今後の release で per-feature や per-surface の詳細 attribution を補完していく方針を示している。

したがって、6月15日以降の BI では、active user totals、feature-attributed users、IDE-attributed users、unattributed users を分けて扱うのがよい。ひとつの「利用者数」だけで管理すると、計測の改善と利用行動の変化が混ざる。

## 分析: KPIの連続性が一度切れる

ここからは分析だ。

今回の変更により、DAU や 28-day active user は、6月15日前後で完全には連続しない指標になる。6月14日までの active user は client telemetry 中心の捕捉であり、6月15日以降は server-side telemetry で補完された捕捉になる。数字が上がっても、それは product adoption の自然増、キャンペーン効果、モデル改善効果、教育施策の成果とは限らない。

日本企業でありがちな失敗は、導入推進施策の報告タイミングと metric definition change が重なることだ。たとえば、6月上旬に Copilot 研修を実施し、6月下旬の DAU が伸びた場合、研修効果として説明したくなる。しかし今回の update の影響を除外しないと、研修で増えた users と計測補正で増えた users を分けられない。

この問題を避けるには、6月15日以降を新 baseline とするか、計測補正前後を分けた cohort を作る。過去との比較が必要なら、「pre-server-side-telemetry baseline」と「post-server-side-telemetry baseline」を別系列にする。単純な前週比や前月比で評価すると、AI 推進活動の実績報告が過大評価される可能性がある。

一方で、この変更は管理者にとって悪いニュースではない。むしろ、billing や activity log と usage metrics のズレが減り、missing users の説明がしやすくなる。GitHub 自身も、reports が activity log や billing に近づくことで support escalation を減らせると説明している。日本企業の情シスにとっては、「請求対象なのに使っていないように見える」問い合わせへの対応が少し楽になる。

## 分析: seat、DAU、AI Creditsを同じ軸に置かない

Copilot 管理では、seat、DAU、feature usage、AI Credits、cost center、organization-billed usage が同時に語られるようになった。しかし、これらは同じ種類の指標ではない。

seat は利用権の配布であり、DAU は active user capture であり、feature usage は行動内訳であり、AI Credits は消費・課金の単位である。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で扱ったように、Copilot は seat SaaS から usage-based billing を含む運用へ寄っている。今回の DAU 補正は adoption の見え方を変えるが、AI Credits の消費量を直接説明するものではない。

たとえば、server-side telemetry により active user が 5% 増えたように見えても、AI Credits 消費が 5% 増えるとは限らない。反対に、DAU は横ばいでも、cloud agent や Agentic Workflows の重い session が増えれば費用は増える可能性がある。ここを分けないと、経営向け説明で「利用者が増えていないのに費用が増えた」「利用者が増えたのに効果が見えない」という混乱が起きる。

また、[GitHub Copilot Code Review、組織単位の設定管理へ](/blog/github-copilot-code-review-org-controls-2026/) のような機能別 governance を進める場合、feature breakdown の欠落は意思決定に影響する。Code Review の active users、CLI users、IDE completion users、cloud agent users を比較したい場合、server-side telemetry 由来の active users が feature attribution を持たないことを注記する必要がある。

## 実務: metric contractを更新する

第一に、社内の metric contract を更新する。`copilot_daily_active_users`、`copilot_28d_active_users`、`copilot_feature_active_users` の定義に、2026年6月15日以降は server-side telemetry 由来 users が含まれることを明記する。BI の semantic layer、dbt docs、dashboard tooltip、月次報告テンプレートに同じ文言を入れる。

第二に、6月15日に annotation を入れる。日次推移グラフ、週次サマリー、月次 executive dashboard のすべてに定義変更の marker を置く。特に日本企業では、経営会議向け資料でグラフだけが切り出されることが多い。注記が dashboard 内だけにあると、資料化されたときに意味が消える。

第三に、unattributed ratio を測る。DAU に対して IDE、feature、model などの attribution がある users の比率を計算し、6月15日以降にどう変わるかを見る。active user totals が増えたのに feature-attributed users が横ばいなら、未分類 users が増えているだけかもしれない。これは導入支援の不足ではなく、telemetry source の違いとして説明できる。

第四に、billing reconciliation を分ける。billing users、licensed seats、activity log users、usage metrics active users を同じ表に並べる。ただし、AI Credits の `quantity` や `gross_amount` とは別レイヤーにする。請求照合では「誰が active と見えるか」と「どれだけ消費したか」を同時に見るが、同じ measure にはしない。

第五に、部門別 KPI の期間比較を作り直す。部門 A の DAU が6月15日以降に増え、部門 B は横ばいだった場合、部門 A の利用施策が良かったとは限らない。部門 A のネットワーク proxy や client settings が以前 client telemetry を落としやすかっただけかもしれない。部署別の比較では、補正前後の差分を一度 baseline adjustment として扱うべきだ。

第六に、support playbook を更新する。管理者から「DAU が急に増えた」「内訳と合わない」「請求対象と usage report が近づいたが完全一致しない」と問い合わせが来る可能性がある。回答には、server-side telemetry は active user totals を補完するが、per-interaction detail はまだ限定的であること、今後 detailed attribution が段階的に追加されることを含める。

## 実務: 日本企業向けの報告文例

月次報告では、次のような文言を入れるとよい。

「2026年6月15日以降、GitHub Copilot usage metrics は client telemetry に加えて server-side telemetry で確認された active users を含むため、DAU および 28日 active user の捕捉範囲が広がった。これにより上位の active user totals は増加する可能性がある一方、IDE 別・機能別・モデル別の詳細内訳には未分類が残る場合がある。6月15日前後の増減は、施策効果ではなく計測定義変更を含むものとして扱う。」

この説明は少し長いが、社内の誤読を避けるには必要だ。AI ツールの導入指標は、利用率、費用、業務効果、セキュリティ、ガバナンスが混ざりやすい。数字の定義が変わったときに明示しないと、翌月以降の議論がすべて「なぜ先月と違うのか」から始まってしまう。

加えて、開発組織向けには別の説明も必要だ。現場には「監視が増えた」と受け取られないよう、これは詳細な個別行動監視を増やす話ではなく、enterprise report の active-user 欠落を減らす話だと説明する。GitHub が今回明記している通り、server-side telemetry 由来 users には detailed per-interaction attribution がまだ限定的である。

## まとめ

GitHub Copilot usage metrics の 2026年6月15日更新は、server-side telemetry を加えることで active users の捕捉漏れを減らし、enterprise single-day report と 28-day report の DAU coverage を高めるものだ。これにより top-level active user totals は増える可能性があるが、IDE、feature、model、lines-of-code activity の詳細内訳は同じ速度では埋まらない。

日本企業にとっては、Copilot 導入 KPI の baseline を引き直すタイミングである。6月15日前後の DAU 変動を施策効果として扱わず、metric definition change として注記する。top-level active users、feature-attributed users、AI Credits consumption、billing users、activity log users を別々の層として管理する。

Copilot の管理は、もう seat 数だけでは説明できない。usage metrics の捕捉精度、feature attribution、AI Credits、部門別定着率、請求照合を一体で扱う必要がある。今回の更新は、数字を増やすためではなく、数字の欠落を減らすための変更だ。その前提を dashboard と月次報告に反映できるかが、実務上の分かれ目になる。

## 出典

- [Copilot usage metrics now include more of your active users](https://github.blog/changelog/2026-06-15-copilot-usage-metrics-now-include-more-of-your-active-users/) - GitHub Changelog, 2026-06-15
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
