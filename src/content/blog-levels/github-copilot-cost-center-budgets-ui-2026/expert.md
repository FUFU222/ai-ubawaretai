---
article: 'github-copilot-cost-center-budgets-ui-2026'
level: 'expert'
---

GitHubの2026年7月7日Changelogは、GitHub Enterprise CloudのBilling UIで**cost center user-level budget**を作成できるようになったと告知した。短い更新だが、CopilotのAI Credits統制ではかなり重要な変更である。6月30日時点ではREST APIからの作成が中心だったcost center単位の個人上限が、billing管理者の通常画面へ入ったからだ。

この更新は単独で見るより、直近の流れとして読むほうがよい。まず、6月1日に[GitHub Copilot AI Credits課金と予算管理](/blog/github-copilot-ai-credits-billing-budgets-2026/)が全プランで本格化した。次に、6月30日に[Copilot部門別予算のcost center user-level budget](/blog/github-copilot-cost-center-user-budget-2026/)がAPI中心で出た。さらに、7月7日に[Copilot Billing Preview app廃止](/blog/github-copilot-billing-preview-app-retirement-2026/)が告知され、同日に今回のUI対応が出た。

つまり、GitHubはCopilotの費用管理を、移行期のpreview app、個別API、暫定レポートから、Billing settings、AI usage page、budget controls、usage reports、billing APIへ寄せている。日本企業の管理者が見るべき論点は、UIで作れるようになったという利便性ではなく、Copilotの予算統制を誰の業務として定義し直すかである。

## 事実: UIでcost center user-level budgetを作成できる

GitHub Changelogは、Enterprise adminsがcost centerとbudgetを管理するBilling UIで、cost center user-level budgetを作成できるようになったと説明している。この機能はGitHub Enterprise Cloud向けで、enterprise teamまたは個別ユーザーをcost centerに追加し、そのcost centerに1人あたりのbudgetを設定する。

GitHubの説明では、membershipが変わってもbudget coverageは同期される。したがって、チームへ参加した人はcost center user-level budgetの対象に入り、外れた人は対象外へ動く。個別budgetを大量に作る方式に比べると、入社、異動、退職、プロジェクト参加に伴う設定負荷を下げられる。

GitHub Docsは、budget controlsをuser、organization、cost center、enterprise levelsで扱うと整理している。Copilot licenseに含まれるAI Creditsはenterprise内でpoolされ、budget controlsは、そのpoolから個人がどう引き出すか、poolが空になった後の追加支出をどうcapするかを制御する。

user-level budgetは、1人のユーザーがbilling cycle中に消費できるAI Credits量をcapする。Docs上の重要な点は、user-level budgetがshared pool phaseとmetered phaseの両方で効き、常にhard stopになることだ。allow overageのような継続オプションはない。0ドル設定は即時ブロックとして働く。

## 優先順位: individual、cost center、universal

user-level budgetには3種類ある。universal user-level budgetはenterprise内のCopilot licensed user全体に適用する標準上限である。cost center user-level budgetは、特定cost centerに属する全員へ同じ1人上限を適用する。individual user-level budgetは、特定ユーザーだけに設定する。

優先順位は、individual、cost center、universalの順だ。最もspecificなbudgetが勝つ。したがって、universalを全社標準、cost centerを部門別標準、individualを期限付き例外として扱う設計が自然になる。

この優先順位は便利だが、運用では事故の原因にもなる。過去に個別で高額budgetを与えたユーザーは、cost centerへ入れても部門標準へ戻らない。反対に、低額の個別budgetが残っていると、cost centerでは十分な上限を置いたつもりでも、そのユーザーだけが先に止まる。UI移行時には、個別budgetの棚卸しが必須になる。

また、universal user-level budgetのユーザー一覧は、budget作成後または新しいbilling cycle開始後に、そのユーザーがAI Creditsを消費したタイミングでbudget recordが作られる。つまり、UI上に全licensed userが最初から並ぶとは限らない。全ライセンス対象者を確認するには、AI usageやLicensing pagesも併用する必要がある。

## cost center budget、included usage controlとの違い

今回のUI対応を正しく使うには、cost center user-level budget、通常のcost center budget、included usage controlを分けて理解する必要がある。

cost center user-level budgetは、cost centerに属する各人の総AI Credits消費をcapする。これはshared pool phaseでもmetered phaseでも効く。ユーザーが上限に達すれば、cost center全体に余裕があっても、そのユーザーのAI credit-consuming featureは止まる。

通常のcost center budgetは、cost center全体のmetered chargesをcapする。shared poolが残っている間に、どれだけpoolを使うかは直接制限しない。shared poolを使い切った後、追加課金に入った段階で、cost centerの合計支出を制御する。さらに、budget limit到達時に利用を止めるかどうかは設定に依存する。

included usage controlは、cost centerが含有AI Creditsの共有poolからどれだけ引き出せるかを、そのcost centerに割り当てられたlicense由来のcredit量に合わせて制御する。これは[Copilot AI credit poolの部門配賦](/blog/github-copilot-ai-credit-pool-cost-center-2026/)で扱った論点で、共有pool中の不公平な引き出しを抑える意味を持つ。

この3つは代替ではない。個人の上限はcost center user-level budget、部門の追加課金はcost center budget、含有creditの部門別消費はincluded usage controlで見る。日本企業では、経理説明のためにこの3つを同じ「予算」と呼びがちだが、システム上は発火タイミングと止める対象が違う。月次レポートには別列で出すべきだ。

## UI対応の設計インパクト

REST APIしかない機能は、自然に開発基盤チームの管轄になりやすい。設定値はJSONやスクリプトで管理され、GitHub tokenの権限、CI実行、レビュー、ロールバックが論点になる。一方、Billing UIに入った機能は、billing managerやenterprise ownerが画面から変更できる。これは導入速度を上げるが、変更統制の責任も変える。

日本企業では、GitHubの管理権限と社内の予算承認権限が一致しないことが多い。GitHub上のenterprise ownerは技術部門にいるが、AI Creditsの部門配賦は経理や購買が説明する。Billing UIで手軽にbudgetを変えられるようになると、社内承認を通さずに上限が変更されるリスクがある。

したがって、UI変更にも最低限の変更管理をかけるべきだ。変更前後の上限、対象cost center、対象team、承認者、変更理由、開始日、失効日を残す。UIで操作した場合も、スクリーンショットだけでなく、変更チケットや監査ログで追えるようにする。

一方で、UIを使わないという判断も極端だ。GitHub Docsのcost controlチュートリアルは、UIを最初の少数cost center、たまの更新、視覚確認に向くものとして説明し、REST APIを多数更新、財務システム連携、組織構造の自動反映に向くものとして説明している。実務では、UIを検証・例外管理・月次確認に使い、APIを定期同期と大規模保守に使うのが妥当だ。

## 日本企業向けの参照アーキテクチャ

第一層はuniversal user-level budgetである。全Copilot licensed userに標準上限を置き、共有poolを一部ユーザーが急速に消費しないようにする。ここは低すぎると導入効果が出ないため、補完中心、軽いChat、短い調査に必要な範囲を見て決める。

第二層はcost center user-level budgetである。agentic workflowが重い部門、たとえば開発基盤、SRE、AI推進、移行プロジェクト、セキュリティレビュー担当に、標準より高い1人上限を置く。逆に、検証だけの部門や非開発部門には低めの上限を置く。ここでは人事部門ではなく、AI Credits消費の重さで分けるほうが説明しやすい場合がある。

第三層はindividual user-level budgetである。これは恒久設定ではなく、期限付き例外として扱う。リリース前の短期移行、障害対応、PoC、モデル比較など、明確な目的があるときだけ増枠し、失効日を設ける。個別例外が増えるとcost center標準が意味を失う。

第四層は通常のcost center budgetである。shared poolが空になった後の追加課金を部門ごとにcapする。日本企業では、ここが経理上の部門予算と最も接続しやすい。ただし、shared pool中の利用はこのbudgetで止まらないため、cost center user-level budgetやincluded usage controlと組み合わせる必要がある。

第五層はAI usage page、usage reports、billing APIによる観測である。Billing UIでbudgetを作るだけでは、上限が妥当かどうかは分からない。どのsurface、どのmodel、どの部門、どのユーザーが消費しているかを月次で見て、上限を上げるべきか、教育すべきか、使い方を変えるべきかを判断する。

## 既存Preview app廃止との接続

同じ7月7日に、GitHubはCopilot Billing Preview appを2026年8月3日にretireすると告知した。Preview appは、usage-based billingへの移行期にCopilot spendを理解するための補助だったが、GitHubはbilling settingsのほうがuser-level budgets、cost centers、usage pool allocationなどを含むより完全な情報を扱えると説明している。

これは今回のUI対応と同じ方向を向いている。外付けのpreview appで費用を眺め、APIでbudgetを作り、別のreportでusageを見る運用から、標準billing experienceへ統合する流れだ。8月3日までにPreview app利用者を移行するだけでは不十分で、budget設定権限、cost center設計、月次レポート、例外増枠手順を同じ計画で整える必要がある。

特に日本企業では、月末締めと請求確定のタイミングが重要だ。8月3日の廃止日は月初であり、7月分の締め作業と8月運用開始が重なりやすい。7月中にBilling UIで少なくとも1回、cost center user-level budgetの作成、AI usage pageのexport、usage reportsまたはbilling APIの取得、既存レポートとの突き合わせを済ませるべきだ。

## 実装・運用チェックリスト

まず、現在のcost center設計を確認する。GitHub organization、enterprise team、人事部門、プロジェクト原価のどれをcost centerに対応させているかを明確にする。複数の軸が混ざっている場合、Copilot AI Creditsだけは別のcost center設計にするのか、全GitHub費用で同じcost centerを使うのかを決める。

次に、enterprise team membershipのsource of truthを確認する。IdPやSCIMから同期しているなら、異動反映までの遅延と失敗時のリカバリを見る。手動でteamを保守しているなら、月次で誰が差分を確認するかを決める。teamが古ければ、budget coverageも古い組織図へ追随する。

三つ目に、個別budgetの一覧を出す。individual user-level budgetはcost center設定より優先されるため、UI移行前に棚卸しする。特に、PoC時代に作った高額budget、退職者や異動者に残ったbudget、緊急対応で一時的に下げたbudgetがないかを見る。

四つ目に、budget到達時の業務影響を整理する。user-level budgetはhard stopであり、上限に達するとそのユーザーのAI Credits消費機能は止まる。重要リリース、障害対応、セキュリティ調査中に止まった場合、誰が増枠を承認し、どの範囲で一時的に上げるかを決める。

五つ目に、UI変更とAPI同期の衝突を設計する。APIで毎晩cost centerを同期している組織では、UIで手動変更した例外が次回同期で上書きされる可能性がある。逆に、UI変更をそのまま残すと、IaC的な再現性が失われる。例外をどこに記録し、どちらをsource of truthにするかを決める。

六つ目に、レポートの出典を分ける。請求説明はBilling UI、AI usage page、usage reports、billing APIを使う。導入効果はCopilot usage metricsを使う。両者を同じ「利用量」としてまとめると、費用が増えた理由と価値が増えた理由を切り分けにくくなる。

## まとめ

cost center user-level budgetのBilling UI対応は、GitHub Copilotの予算統制をAPI実装から月次運用へ近づける更新だ。Enterprise管理者は、cost centerにteamや個別ユーザーを追加し、現在と将来のメンバーへ1人あたりのAI Credits上限を適用できる。

ただし、UIで作れるようになったことは、統制が軽くなったことを意味しない。むしろ、技術管理者だけでなく、billing manager、情シス、FinOps、経理が同じ設定を扱う段階に入った。日本企業は、Preview app廃止対応と同じ計画で、cost center設計、個別budget例外、API同期、月次レポート、増枠承認を整えるべきである。

## 出典

- [Per-user budgets for cost centers in the billing UI](https://github.blog/changelog/2026-07-07-per-user-budgets-for-cost-centers-in-the-billing-ui/) - GitHub Changelog, 2026-07-07
- [Budgets for usage-based billing](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/budgets-for-usage-based-billing) - GitHub Docs
- [Control GitHub costs at scale](https://docs.github.com/en/enterprise-cloud@latest/billing/tutorials/control-costs-at-scale) - GitHub Docs
