---
article: 'github-copilot-ai-credit-pool-cost-center-2026'
level: 'expert'
---

GitHub Copilotのcost center別AI credit poolは、AI費用管理の制御点を1つ前へ移す更新である。従来のcost center budgetは、enterpriseの共有AI Creditsを使い切り、metered usageへ移った後の追加課金を制御した。新しいincluded usage controlは、共有プールが残っている間に、各cost centerが自部門のライセンスでfundされた分を超えて消費することを防ぐ。

この差はFinOps上かなり大きい。追加課金だけを管理しても、共有プール内での部門間移転は見えにくい。ある部門のagentic workloadが他部門の含有枠を吸収しても、enterprise全体では追加請求が発生していないため、従来型の予算アラートでは問題にならない。だが、事業部別P/L、子会社別負担、原価センター別の公平性では、含有枠の移転そのものが管理対象になる。

既存の[GitHub Copilot AI Credits課金と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)が全体の請求構造を扱い、[cost center user-level budget](/blog/github-copilot-cost-center-user-budget-2026/)が個人別hard stopを部門標準へ展開したのに対し、今回の変更はpool phaseの部門境界を追加する。3つは似て見えるが、評価順序、scope、停止条件が異なる。

## 事実: included usage controlの制御対象

GitHub Changelogは、Copilot BusinessとCopilot Enterpriseの各ライセンスに含まれる月次AI Creditsがenterpriseでpoolされる前提を示している。通常、enterpriseは共有プールを先に消費し、その後にpaid usageが有効なら1 AI Creditあたり0.01米ドルのmetered usageへ移る。

included usage controlは、cost centerに属するライセンスがfundする含有AI Creditsの合計を、そのcost centerのpool limitとして扱う。管理者が固定値を入力するのではなく、GitHubが割り当て済みライセンスから自動計算し、ライセンスの追加・削除に応じて調整する。

この設計には2つの意味がある。第一に、ライセンス費用の負担とpool entitlementを対応させやすい。第二に、任意の予算額ではないため、「今月はこの部門だけ含有枠を2倍にする」といった運用には向かない。部門間で意図的に枠を移したい場合は、ライセンス割り当てやcost center構成、paid overage方針を含めて別途設計する必要がある。

上限へ達した後は、blockまたはpaid overageへの継続を選択できる。paid overageを選ぶ場合でも、enterpriseまたはorganizationでAI credit paid usage policyが許可されていることが前提になる。さらに、追加課金段階ではcost center budget、organization budget、enterprise budgetと、それぞれのhard-stop設定が評価される。

公開時点ではREST APIで利用でき、cost center設定UIは後日提供予定とされる。API先行は大規模運用には適しているが、schema、認可、idempotency、変更履歴、rollbackを管理者側で設計する必要がある。UIがないことを理由に手作業のcurlだけで本番変更を続けるのは危険である。

## 事実: budget evaluationをレイヤーで捉える

GitHub Docsの予算評価を、今回のincluded usage controlを含めて概念的に整理すると、少なくとも次のレイヤーがある。

最初は**user-level budget**である。universal、cost center、individualの順ではなく、適用時は最もspecificなものが勝つ。individualがあればindividual、なければcost center user-level、さらにそれもなければuniversalが適用される。user-level budgetはpool phaseとmetered phaseの両方で有効で、常にhard stopになる。

次が**cost center included usage control**である。共有プールにAI Creditsが残っていても、cost center自身のfunded amountへ達したかを判定する。ここが今回追加された境界だ。上限後にblockするならその部門のAI credit consuming featuresを止め、overageへ移すならmetered側へ送る。

その後が**shared poolまたはmetered usage**である。通常のenterprise共有プールが利用可能なら含有分として処理され、枯渇すればpaid usage policyに従ってmetered usageへ移る。included usage controlを有効にしたcost centerは、enterprise全体のpoolが残っていても自部門上限を境に追加利用扱いへ移る可能性がある。

最後が**cost center、organization、enterpriseのspending control**である。これらはmetered chargesを制御する。Docsでは「Stop usage when budget limit is reached」はデフォルトでoffと説明されており、明示的に有効にしなければ設定額を超えて課金が続く。user-level budgetのhard stopとは挙動が違う。

実務上は「どれかの予算が残っているか」ではなく、**最も先に尽きる制御が何か**を見る。cost centerのincluded poolが残っていてもindividual ULBで止まる。individual ULBに余裕があってもincluded poolをblock設定で使い切れば止まる。overageへ進めてもcost center budgetがhard stopならそこで止まる。enterprise budgetを増やしても、個人ULBに達したユーザーは復旧しない。

## 分析: shared poolの効率と配賦公平性はトレードオフ

ここからは分析だ。

enterprise全体でpoolする最大の利点は統計的多重化である。全利用者が同時に最大量を使うわけではないため、未使用分をheavy userへ回すと、購入済みライセンスの含有価値を無駄なく使える。厳密なcost center capを置くほど、この融通は弱くなる。

一方、部門別採算では、融通が無条件だとfree-rider問題が起きる。大量のcloud agent、Copilot CLI、third-party coding agentを運用する部門が、IDE補完中心の部門の未使用分を恒常的に消費する場合、重い部門が追加投資を判断する信号が弱くなる。軽い部門は費用を負担しているのに、必要な月に枠が残っていない。

したがって、全cost centerで一律にblockするのが正解ではない。業務criticalityと費用責任でグループを分けるべきだ。たとえば、独立採算の子会社や外販プロダクト部門はblock寄り、全社共通の開発基盤や短期の移行プログラムはoverage許可寄りにする。研究部門は専用cost center budgetとenterprise budget exclusionを検討できるが、独立したspending authorityと監査責任が必要になる。

また、含有枠はsunk costだから使い切るほど得だ、という単純な目標設定は危険である。AI Credits消費量をKPIにすると、不要に長いsession、過剰な再試行、高価なモデルの常用を促す。逆に消費量の低さだけを評価すると、効果的なagent活用を抑制する。pool utilizationは、成果、リードタイム、レビュー品質、障害率、開発者体験と組み合わせて見るべき補助指標である。

## 日本企業の組織構造で起きる4つのずれ

第一は、**人事組織とGitHub organizationのずれ**だ。GitHub organizationは法務主体や製品境界で分かれている場合もあれば、歴史的理由で複数事業が混在している場合もある。organizationをそのままcost centerへ割り当てる前に、実際のライセンス負担と利用者所属を確認する必要がある。

第二は、**兼務と横断チーム**である。GitHub Docsではresourceは1つのcost centerにしか割り当てられない。複数事業へ50%ずつ貢献するエンジニアでも、リアルタイムのAI Creditsを単純に二重所属で按分できない。主所属へ寄せる、共通cost centerへ置く、usage exportを後段でプロジェクト配賦するなど、会計ルールを選ぶ。

第三は、**enterprise teamの保守品質**である。teamをcost centerへ割り当てれば、参加・離脱に自動追随できる。これは異動の多い組織に有効だが、IdP、SCIM、人事マスタ、GitHub team membershipの同期が正しいことが前提になる。退職者や異動者が古いteamに残れば、pool entitlementと利用配賦も古い組織図へ引きずられる。

第四は、**委託先と子会社**である。アカウントは同じenterpriseにいても、費用契約や成果物の帰属が異なる。委託先の利用を発注部門へ配賦するのか、共通調達へ寄せるのか、子会社のoverageを親会社が負担するのかを明文化する。block設定は技術的な停止を起こすため、契約上のSLAや納期にも影響し得る。

## 実装: API先行機能を安全に運用する

API設定は、個人端末から都度実行するより、configuration as codeへ寄せたほうがよい。最低限、desired stateとしてcost center identifier、included usage controlの有効・無効、上限到達時のblock/overage方針、関連budget、owner、変更理由を管理する。

実行パイプラインには、read current state、diff、approval、apply、read-after-write verification、監査ログ保存を入れる。APIのrequest bodyだけでなく、response、HTTP status、actor、run ID、対象enterprise、対象cost center、実行時刻を保存する。失敗時に部分適用が起きても再実行できるよう、操作のidempotencyも確認する。

認証tokenは、billing管理に必要な最小権限へ絞る。長期PATを共有せず、可能ならGitHub Appや短期credential、承認付きCIを使う。設定リポジトリは本番コードと同等にbranch protection、review、CODEOWNERSを適用し、FinOpsまたは経理だけでなくCopilot管理者と開発基盤責任者のレビューを通す。

UI提供後も、数十から数百のcost centerを管理するenterpriseではコード管理を継続する価値がある。UIは例外調査と緊急変更に便利だが、標準値の一括展開、差分監査、再現性はAPI運用のほうが強い。UI変更を検知するため、定期的にactual stateを取得してdriftを報告する。

## 可観測性: entitlement、consumption、outcomeを分ける

運用ダッシュボードでは、少なくとも3種類のデータを分ける。

**Entitlement**は、ライセンス数、cost center assignment、計算されたincluded pool、user-level budget、metered budget、paid usage policyである。これは「どこまで使えるはずか」を示す設定データだ。

**Consumption**は、実際のAI Credits使用量、surface、モデル、ユーザー、cost center、追加課金、上限到達イベントである。[AI Credits usage report](/blog/github-copilot-ai-credits-usage-report-2026/)や[AI usage reportの項目設計](/blog/github-ai-usage-report-fields-2026/)を使い、期間とscopeを揃えて照合する。公開後にreportの集計精度が更新されることもあるため、月次比較ではschema versionや計測変更も注記する。

**Outcome**は、PR lead time、review turnaround、defect、revert、deployment frequency、移行完了数、開発者アンケートなどである。GitHubのusage dataだけでは成果を証明できない。AI Creditsを使ったかどうかと、その利用が組織目的へ効いたかは別の問いだ。

この3層を1つの巨大tableへ押し込むと、権限と保持期間が曖昧になる。Billing dataは経理・FinOps、user-level usageはCopilot管理者、成果dataは開発組織が扱う場合がある。個人評価への転用を防ぐため、利用目的、閲覧者、保存期間、集計粒度を定義する。

## 障害対応: 「Copilotが止まった」を分解する

利用者から見れば、どのbudgetで止まっても「Copilotが使えない」に見える。一次対応runbookでは、次の順に切り分ける。

1. GitHub Statusなどサービス障害の有無
2. user-level budgetの残量と適用scope
3. cost center included poolの残量とblock/overage設定
4. AI credit paid usage policy
5. cost center budgetとhard-stop設定
6. organizationまたはenterprise budget
7. ライセンス割り当て、cost center membership、請求サイクル

復旧方法も原因で異なる。個人ULBならindividualまたはcost center標準の増額、included pool blockならoverage方針の変更または次cycle待ち、metered budgetなら予算増額かhard stop解除、membership誤りならassignment修正になる。むやみにenterprise budgetだけを上げても直らない。

緊急増枠には有効期限を置く。障害対応のためblockを外した場合、incident終了後に自動で元へ戻す。変更チケットにincident ID、承認者、最大追加額、期限、対象cost centerを残す。恒久的な例外へ変えるなら、月次レビューで正式に再設計する。

## 導入判断の基準

cost center別AI credit poolを優先すべきなのは、事業部や子会社がライセンス費用を分担し、共有枠の部門間移転を説明する必要があるenterpriseである。複数部門の利用量に大きな差があり、heavy agent workloadが増えている場合も効果が高い。

一方、小規模で単一予算の組織や、全社最適で未使用枠を自由に融通したい組織では、厳格なblockが利用効率を下げる可能性がある。まずusage reportで偏りを観測し、必要なcost centerだけincluded usage controlを使う段階導入が現実的だ。

設定の成功条件は「全cost centerが枠内に収まること」ではない。必要な業務が予算内で継続し、部門間の負担を説明でき、例外が監査可能で、利用枠の変更が成果改善へ結びつくことである。機械的な公平性より、合意された費用責任と業務継続性の両立を目標にする。

## まとめ

GitHub Copilotのincluded usage controlは、enterprise共有プールの効率だけでなく、cost centerごとのentitlementを守るための制御である。自動計算されるライセンス由来枠、上限後のblock/overage選択、metered budgetとの接続により、CopilotのFinOpsは席数管理から多層のruntime policyへ進んだ。

日本企業では、人事組織、GitHub organization、費用負担、兼務、子会社、委託先が一致しない。cost center assignmentを先に整え、user-level budget、included pool、metered budgetの評価順序をrunbookへ落とし、entitlement・consumption・outcomeを分けて観測する必要がある。

最初の導入では、2つか3つのcost centerを選び、通常利用とheavy agent workloadの両方を試す。上限到達、overage移行、block、復旧、請求配賦を1請求サイクル通して検証した後に広げるのが安全である。

## 出典

- [Cost centers now support AI credit pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/) - GitHub Changelog, 2026-07-02
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Using cost centers to allocate costs to business units](https://docs.github.com/en/enterprise-cloud@latest/billing/how-tos/products/use-cost-centers) - GitHub Docs
