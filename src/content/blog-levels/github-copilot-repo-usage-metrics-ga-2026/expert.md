---
article: 'github-copilot-repo-usage-metrics-ga-2026'
level: 'expert'
---

GitHub の **2026年7月17日**の更新は、Copilot usage metrics の data model を organization / user / team から repository へ拡張するものだ。新しい repository-level report は、Copilot coding agent と Copilot code review の pull request activity を1日単位、リポジトリ単位で返す。これにより、AI coding agent の導入評価は「誰が使ったか」だけでなく、「どのコードベースで PR flow に現れたか」まで下りる。

この更新は、既存の Copilot metrics 系記事と連続している。[Copilot使用指標補正、7月レポート比較の注意点](/blog/github-copilot-usage-metrics-accuracy-2026/)では、CLI提案行数、IDE識別、AI Credits帰属の補正を扱った。[GitHub Copilotレビュー指標、PR待ち時間で導入効果を測る](/blog/github-copilot-review-cycles-adoption-phase-2026/)では、AI adoption phase と review cycle / time to first review の接続を見た。[GitHub Copilot AI credit pool、部門配賦の実務](/blog/github-copilot-ai-credit-pool-cost-center-2026/)では、利用と費用責任の境界を整理した。

repository-level metrics は、その3つを repository master に接続するための missing dimension である。日本企業の大規模 GitHub Enterprise では、organization や team だけでは実務を説明しきれない。重要なのは、顧客向け mainline、共通基盤、legacy保守、internal tool、mobile app、IaC repository のどこで agentic PR activity が発生し、どこで review burden が増減しているかである。

## Fact: repos-1-day reportがGAになった

GitHub Changelog は、Copilot usage metrics REST API が repository-level activity を report するようになったと説明している。追加された endpoint は enterprise と organization の2種類で、いずれも `repos-1-day` という1日単位の report である。

enterprise scope では `GET /enterprises/{enterprise}/copilot/metrics/reports/repos-1-day?day=YYYY-MM-DD` を使う。organization scope では `GET /orgs/{org}/copilot/metrics/reports/repos-1-day?day=YYYY-MM-DD` を使う。GitHub Docs の REST API reference では、これらの endpoint が download links と report day を返し、実データは generated daily の report file として取得する構造になっている。

report の意味は限定的に読むべきだ。Docs は organization repository report について、指定日の repository-level pull request activity を含み、Copilot Coding Agent と Copilot Code Review の breakdown を提供し、activity があった repository だけを含むと説明している。したがって、全 repository inventory、全 Copilot usage、全 AI Credits attribution を返す endpoint ではない。

Changelog が挙げる activity は、Copilot coding agent が作成・mergeした pull request と、Copilot code review がreviewした pull request である。code review 側は suggestion counts を comment type 別に分ける。ここで comment type は、security や bug risk のようなレビュー指摘分類を扱う可能性があるが、最終的な重大度や人間が受け入れた修正の妥当性をそのまま示すものではない。

アクセス権は、データガバナンス上の論点になる。Changelog は enterprise owners、billing managers、organization owners、`View Copilot Metrics` permission を持つ custom role を挙げる。REST API reference では、enterprise 側は `Enterprise Copilot metrics` read、organization 側は `Organization Copilot metrics` read の fine-grained permission が示されている。日本企業では、情シス、開発統括、FinOps、セキュリティ、各事業部のどこまで repo別 AI activity を見せるかを設計する必要がある。

## Fact: metrics universeの中で何を補うのか

Copilot usage metrics は、GitHub Docs の説明では、Copilot の adoption と usage を可視化し、engagement、activity、code generation、pull request lifecycle trends を扱う。API、dashboard、code generation dashboard、NDJSON export という複数の出力があり、それぞれ粒度と用途が違う。

aggregated 1-day / 28-day report は、enterprise または organization の全体傾向を見る。user report は、ユーザーごとの詳細活動を見る。user-teams report は、team-level metrics を作るために user report と join する。data reference には、daily active users、CLI usage、totals_by_ide、totals_by_feature、totals_by_model_feature、pull_requests などが並ぶ。

今回の repository report は、既存の user / team / organization 粒度では足りなかった「どの repository の PR activity か」を補う。つまり、Copilot導入の観測モデルに repository dimension が追加されたと見るべきである。これは開発組織ではかなり重要だ。なぜなら、実際の改善施策は多くの場合、user単位ではなく repository単位で行われるからだ。

たとえば、coding agent の成功率を上げるには、issue template、test command、README、architecture docs、setup steps、branch protection、CI stability、dependency access を repository ごとに整える必要がある。Copilot code review の品質を上げるには、[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/)で扱ったように、runner、content exclusion、custom instructions、review responsibility を repository または organization 単位で管理する必要がある。

この意味で repo report は、「AIがどれだけ使われたか」の report というより、「どの repository を改善対象にすべきか」を探す discovery dataset である。DWHに入れるなら、user-centric marts とは別に repository-centric mart を作る価値がある。

## Analysis: repository別KPIの読み間違い

ここからは分析だ。

まず、repo別 activity count を productivity proxy として直接使うのは危険である。Copilot coding agent が作成したPRが多い repository は、agent-friendly な小粒タスクが多いだけかもしれない。merge数が多い repository は、PRサイズが小さい、reviewer が多い、CIが速い、release pressure が高い、という別要因で説明できる可能性がある。

Copilot code review の review count や suggestion count も同じだ。comment type 別の suggestion が多い repository を、品質が悪い repository と即断してはいけない。大きな PR が多い、custom instructions が細かい、security-sensitive な path が多い、AI review の対象範囲が広い、content exclusion が少ない、といった要因でコメント数は増える。

逆に、repo report に出ない repository を「AI未導入」と判断するのも誤りである。IDE completion、Chat、Copilot CLI の調査利用、docs生成、設計相談は PR activity に現れない場合がある。今回の report が扱うのは、Copilot coding agent と Copilot code review の PR activity である。PR surface に出ない Copilot 活用は、別の metrics や audit logs と合わせて見る必要がある。

したがって、repository-level metrics の最初の用途は ranking ではなく segmentation である。PR activity が高い repository、AI review は多いが coding agent PR が少ない repository、coding agent PR は多いが merge率が低い repository、AI activity は低いが人間レビュー滞留が大きい repository を分ける。この分類ごとに、取るべき施策は変わる。

## Data model: repo masterがないと使えない

大規模組織で repository-level metrics を使うには、repository master が必要になる。GitHub APIから取得できる repository ID、name、visibility、owner organization だけでは足りない。実務で必要なのは、責任者、CODEOWNERS、service owner、system criticality、data classification、cost center、事業部、委託先有無、production impact、language/runtime、CI baseline、Copilot policy state である。

この master と `repos-1-day` report を join して初めて、「金融系の高機密 repository ではAI reviewだけ許可」「共通基盤ではcoding agent PRをpilot」「legacy保守ではrepo overviewとinstructions整備から始める」といった判断ができる。

特に cost center との join は注意がいる。GitHub の cost center は organization、repository、user、enterprise team などで割り当てられるが、経理上の費用負担と実際のコード所有が一致しないことがある。共通基盤 repository の activity を1つの部門へ丸めると、他部門が受けている便益が見えない。逆に顧客別 repository を全社共通費に入れると、個別案件のAI利用コストが見えなくなる。

repo master には、少なくとも次の列を置きたい。`repository_id`、`repository_name`、`owner_org`、`service_owner`、`code_owner_group`、`cost_center`、`business_unit`、`data_classification`、`production_tier`、`outsourcing_flag`、`copilot_code_review_enabled`、`copilot_agent_allowed`、`content_exclusion_profile`、`default_runner_profile`、`primary_language`、`ci_required_checks` である。

## Metrics design: 何と一緒に見るべきか

repository-level Copilot metrics は、単独では弱い。最低でも PR lifecycle、quality、cost、governance を横に置く必要がある。

PR lifecycle では、created PR、merged PR、merge rate、time to first review、review cycle、time to merge、open PR age、draft ratio、PR size を見る。Copilot coding agent が作った PR の merge rate が低い repository は、agent に渡す issue の粒度、test command、dependency access、review policy が合っていない可能性がある。

Quality では、revert、post-merge defect、incident、security finding、QA rejection、review comment severity を見る。Copilot code review の suggestion count が増えても、post-merge defect が減っていなければ、レビューコメントが本質的な品質改善に効いていない可能性がある。逆に suggestion count が少なくても、重要 repository の defect が減っているなら、AIより別の統制が効いているかもしれない。

Cost では、AI Credits、included pool、overage、cost center budget、user-level budget を見る。repo report から請求額を作らないほうがよいが、費用説明の補助にはなる。たとえば、ある cost center の AI Credits が増えた月に、どの repository で coding agent PR や code review activity が増えたかを見ると、予算説明が具体化する。

Governance では、Copilot code review の有効化、runner type、firewall、content exclusion、custom instructions、CODEOWNERS、branch protection、required checks を見る。AI activity が高い repository ほど、governance baseline が低いとリスクになる。特に日本企業では、委託先やグループ会社が関わる repository で、AI review の可視性と責任分界を明確にする必要がある。

## 実務設計: 4つのdashboardに分ける

1つ目は、**AI activity by repository** dashboard である。repositoryごとの CCA created PR、CCA merged PR、CCR reviewed PR、suggestions by comment type を日次・週次で見る。これは情シスや開発統括が、どこで Copilot PR activity が起きているかを把握するための入口になる。

2つ目は、**repository readiness** dashboard である。repo master の governance baseline を並べ、AI activity と突き合わせる。AI activity が高いのに CODEOWNERS がない、required checks が弱い、content exclusion が未整理、runner profile が標準化されていない repository を検出する。これは監査というより、enablement backlog を作るための dashboard である。

3つ目は、**PR flow impact** dashboard である。AI activity と time to first review、review cycle、time to merge、PR size、merge rate を並べる。AI activity が増えた repository で、PR flow が改善しているか、または review burden が増えているかを見る。ただし、因果推論として扱うなら、リリース規模、チーム人数、PRサイズ、繁忙期、障害対応を control する必要がある。

4つ目は、**FinOps bridge** dashboard である。cost center 別 AI Credits と repository activity を接続する。ここでは repo report を請求額の source of truth にしない。billing report を金額の正とし、repo report は「どのコードベースで活動があったか」の説明に使う。経営会議や事業部レビューで、AI費用の増加を抽象的な利用量ではなく、具体的な repository activity と結びつけるための補助資料になる。

## Governance: アクセス権と評価利用を分ける

repo別 Copilot activity は、見せる範囲を考える必要がある。開発統括にとっては有用だが、個別チームの評価に直結させると行動が歪む。AI activity を増やすために agent に向かない task まで投げる、suggestion count を減らすために custom instructions を弱める、review対象から難しい repository を外す、といった逆インセンティブが生まれ得る。

そのため、最初の運用では dashboard の目的を明記したほうがよい。目的は「repository enablement と governance gap の発見」であり、「個人・チームの人事評価」ではない。月次資料にも、repo activity は成果の直接指標ではなく、改善対象を探すための operational signal だと注記する。

アクセス権も段階化する。enterprise全体の repo activity は開発統括、情シス、FinOps、セキュリティに限定する。各事業部には自部門 repository の集計を出す。委託先には、必要な repository の改善指標だけを共有し、全社横断の比較表は出さない。これは技術的な権限だけでなく、組織運用上の信頼設計でもある。

## 日本企業の導入手順

第一段階は、repository master の最小版を作ることだ。全 repository を完璧に分類しようとすると止まるため、まず Copilot code review を有効にしている repository、coding agent の利用を許可している repository、主要 product repository から始める。

第二段階は、`repos-1-day` report を30日分蓄積することだ。1日だけでは release timing や PRサイズの影響が大きい。少なくとも4週間程度の移動平均を作り、曜日、月末、リリース週の揺れを見る。

第三段階は、PR lifecycle と join することだ。GitHub GraphQL API や既存DWHから、repository別の PR created、merged、time to review、review cycle、PR size、revert を取得する。Copilot activity が多い repository と、PR bottleneck が大きい repository の交差を探す。

第四段階は、governance baseline と突き合わせることだ。AI activity が多い repository で、CODEOWNERS、required checks、custom instructions、content exclusion、runner policy が弱い場合は、先に統制を整える。反対に governance は整っているが AI activity がない repository は、agentに向く taskの設計や開発者教育が不足している可能性がある。

第五段階は、月次レポートへ反映することだ。経営向けには、全社のAI費用、active users、主要 repository のPR flow変化、enablement backlogを短く出す。現場向けには、repositoryごとの具体的な改善アクションを出す。人事評価に使わないこと、請求額の正は billing report であること、repo report はPR activityに限ることを明記する。

## まとめ

GitHub Copilot の repository-level usage metrics GA は、Copilot管理を repository-centric に進めるための重要な更新である。Copilot coding agent と Copilot code review の PR activity を repository 別に見られることで、どのコードベースで agentic development が実務に入っているか、どこで review automation が効いているか、どこに readiness gap があるかを観測できる。

ただし、この report は万能ではない。IDE補完やChatの全利用、AI Creditsの請求額、品質成果を直接示すものではない。repo別 activity は、repository master、PR lifecycle、quality、cost center、governance baseline と join して初めて意思決定に使える。

日本企業では、まず repository master と30日分の `repos-1-day` report をそろえ、AI activity が高い repository と governance gap が大きい repository を特定するのが現実的だ。Copilotの効果を「使った人数」だけで語る段階から、「どのコードベースで、どのPR運用が、どの責任境界のもとで変わったか」へ進められるかが、今回の更新の実務価値である。

## 出典

- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
- [REST API endpoints for Copilot usage metrics](https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-usage-metrics?apiVersion=2026-03-10) - GitHub Docs
- [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
