---
article: 'github-copilot-impact-dashboard-adoption-2026'
level: 'expert'
---

GitHub の **2026年7月22日**の更新は、Copilot usage metrics を「利用状況の可視化」から「導入深度と pull request output を結びつける管理画面」へ一段進めるものだ。新しい **Copilot metrics impact dashboard** は、enterprise administrators と organization owners が、AI adoption phase、cohort distribution、adoption multiplier、PR throughput、merge velocity、recommendations を同じ文脈で読むための dashboard である。

この dashboard は単独の新指標ではない。[Copilot導入cohort、AI活用度を部門別に測る](/blog/github-copilot-ai-adoption-cohorts-metrics-2026/)で扱った `ai_adoption_phase` を、管理者が画面上で解釈しやすくする presentation layer と見るべきだ。さらに [GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)で追加された repository-level PR activity と合わせると、Copilot 導入評価は user / team / organization だけでなく repository まで下りる。

日本企業で重要なのは、この dashboard を「AI導入効果の証明画面」と誤読しないことだ。正しい使い方は、導入成熟度、部門別 enablement、repository readiness、AI Credits 予算、review policy を接続する operational control surface として扱うことである。

## Fact: dashboardの構成要素

GitHub Changelog によると、impact dashboard は engaged users を AI adoption phase ごとに grouped し、それぞれの cohort に対して pull request output と利用深度の指標を表示する。cohort は Phase 1、Phase 2、Phase 3、Passive segment に分かれる。

Phase 1 は Code-first として、主にコード補完や基本的な IDE 利用に近い段階である。Phase 2 は Agent-first として、cloud agent、Copilot CLI、code review など agent surface を使い始める段階である。Phase 3 は Multi-agent または Copilot app を含む、複数の agentic surface へ利用が広がった段階である。Passive は licensed だが engaged cohort には入らない利用者を示す。

各 card には、average pull requests merged per user per month、median pull request merge velocity、users in the phase、share of overall users per phase、average lines of code per day per user が示される。これにより、管理者は単なる active user count ではなく、どの段階の利用者がどれくらい PR flow に現れているかを見られる。

adoption multiplier は、dashboard の中で特に強い数字に見える。GitHub は、Passive cohort と engaged Copilot users の throughput / speed を比較する bottom-line-up-front の指標として説明している。これは月次レビューでは使いやすいが、因果関係の証明ではない。高い multiplier は、深い Copilot 利用と高い PR output が同時に観測されている可能性を示すだけで、Copilot が単独原因であるとは言えない。

dashboard には6か月 trend もある。cohort mix の変化と pull request throughput の変化を見ることで、enablement 施策、model rollout、cloud agent 有効化、code review policy 変更、AI Credits budget の変更などが時間差でどのように利用段階へ出たかを追える。

## Fact: 権限、policy、rolling window

GitHub Docs の impact dashboard ページは、利用者を enterprise owners、organization administrators、billing managers、または `View Enterprise Copilot Metrics` permission を持つ enterprise custom role と説明している。アクセス前提として、Copilot usage metrics policy を有効にする必要がある。したがって、この dashboard は個々の開発者向けの productivity view ではなく、管理者向けの governance / enablement view である。

cohort assignment は Copilot usage metrics API の `ai_adoption_phase` classification と同じで、直近28日間の Copilot product usage に基づく。Interpreting metrics の Docs は、古い利用日が rolling window から外れることで phase が変わることは expected behavior だと説明している。日本企業の月次報告では、この点を注記しないと、phase の上下を「急に使わなくなった」「急に成熟した」と誤解しやすい。

Data available in Copilot usage metrics の reference では、impact dashboard metrics として engagement trends、adoption cohort distribution、adoption multiplier、recommendations が列挙されている。recommendations は、現在の cohort distribution に基づき、cloud agent の構成、Copilot code review の有効化、onboarding nudge などの suggested action を出す位置づけである。

ここで注意すべきなのは、dashboard data と billing data の境界だ。[Copilot使用量レポート、6月のAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/)で扱った AI Credits は、モデル、surface、token、billing configuration の問題である。impact dashboard は費用の再現には向かない。逆に、billing report だけでは adoption depth や PR flow は説明しきれない。両者は join する対象であって、代替関係ではない。

## Analysis: cohortは成熟度だが、組織評価ではない

日本企業で最も起きやすい誤用は、Phase 3 を「優秀なチーム」、Passive を「悪いチーム」と読むことだ。これは危険である。Phase は Copilot surface の利用深度であり、事業価値、品質、リスク管理、チーム成熟度を直接示すものではない。

たとえば、規制対象の金融システム、顧客データを扱う SaaS、基幹系の legacy repository では、cloud agent や multi-agent surface を広げる前に、test harness、CODEOWNERS、branch protection、secret handling、content exclusion、MCP allowlist、runner isolation を整える必要がある。Phase 1 に留まることが、短期的には正しい判断である場合もある。

一方で、社内 tool、developer portal、documentation repository、test fixture の整備、dependency update のような領域では、Phase 2 や Phase 3 へ進めやすい。ここで Passive や Phase 1 が多いなら、権限、教育、標準 prompt、task template、review policy が足りていない可能性がある。

したがって、cohort は maturity label ではなく、enablement queue を作るための segmentation として使うべきである。Passive には onboarding、Phase 1 には agent surface の小さな試行、Phase 2 には二つ目の agent surface と governance、Phase 3 には budget / audit / quality review を割り当てる。この読み方なら、数字が現場を追い詰めるのではなく、支援の順番を決める材料になる。

## Analysis: adoption multiplierの扱い方

adoption multiplier は経営報告に載せやすい。Passive と engaged cohort の PR throughput や speed を比べるため、Copilot 導入の説明に使いたくなる。しかし、これは observational metric であり、A/B test ではない。

高い multiplier が出る背景には複数の可能性がある。第一に、もともと生産性の高い team が Copilot を深く採用している。第二に、PR サイズや branch strategy が cohort 間で違う。第三に、GitHub 外の review process があるため、GitHub 上の merge velocity だけでは実態を捉えきれていない。第四に、repository の性質が違う。小さな internal tool と厳格な production system を同じ PR 指標で比べると歪む。

そのため、adoption multiplier は結論ではなく hypothesis generator として扱う。multiplier が高い organization では、どの repository、どの team、どの PR type が差を作っているかを見る。multiplier が低い organization では、Copilot 利用が浅いのか、PR flow が別の bottleneck に詰まっているのかを確認する。

[GitHub Copilotレビュー指標、PR待ち時間で導入効果を測る](/blog/github-copilot-review-cycles-adoption-phase-2026/)で整理した review cycle / time to first review と組み合わせると、より実務に近い。PR が速く merge されていても、review cycle が増え、post-merge defect が増えているなら良い改善とは言えない。逆に merge velocity は大きく変わらなくても、reviewer の待ち時間や手戻りが減っているなら価値はある。

## 実務設計: 月次ダッシュボードの最小構成

日本企業で impact dashboard を operationalize するなら、最初から大きな BI 基盤を作らなくてよい。まずは GitHub の画面で全体傾向を読み、必要に応じて API / export を使って DWH へ落とす。最小構成は、以下の5つで足りる。

第一に、cohort distribution by scope である。enterprise 全体、主要 organization、主要 cost center、主要 engineering group ごとに Passive、Phase 1、Phase 2、Phase 3 の比率を並べる。ここでは前月差と3か月 trend を見る。28-day rolling window の影響があるため、単月の揺れより trend を重視する。

第二に、PR output by cohort である。PR merged per user per month、median merge velocity、pull request throughput を cohort 別に置く。ただし、PR size、repository type、release cadence を同じ表に入れないと、数字の比較は粗くなる。

第三に、repository overlay である。[GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/)の repository-level report と接続し、PR activity がどの repository に出ているかを見る。repository master には owner、CODEOWNERS、system criticality、data classification、cost center、CI stability、Copilot code review policy、cloud agent permission を持たせる。

第四に、enablement recommendation backlog である。GitHub の dashboard が出す recommended next steps をそのまま採用するのではなく、社内のリスク分類に合わせて backlog 化する。たとえば「cloud agent を構成する」という recommendation が出ても、機密 repository では先に runner isolation と firewall を決める必要がある。

第五に、budget overlay である。[GitHub Copilot部門予算UI、情シスが月次統制へ移す実務](/blog/github-copilot-cost-center-budgets-ui-2026/)で扱った cost center budget と cohort を重ねる。Phase 2 / Phase 3 が増えると、agent session、model selection、long-context task によって AI Credits 消費が増える可能性がある。費用だけを抑えるのではなく、どの深い利用が PR flow や review load に効いているかを説明する。

## 実務設計: 90日導入レビュー

90日で impact dashboard を使い始めるなら、段階を分ける。

最初の30日は baseline を作る。現在の cohort distribution、PR output、repo別 activity、AI Credits 消費、主要 repository の readiness を記録する。ここでは改善施策を急がず、数字の欠落、権限不足、telemetry の偏り、organization 構造と cost center の不一致を洗い出す。

次の30日は targeted enablement を行う。Passive が多い部署には IDE setup と onboarding を集中する。Phase 1 で止まる部署には、Copilot code review や CLI の安全な使い方を1つに絞って試す。Phase 2 の部署には、cloud agent と code review の組み合わせ、または Copilot app の session visibility を試す。ただし、対象 repository は readiness が高いものに限定する。

最後の30日は governance review に移る。Phase 2 / Phase 3 が増えたところで、budget、audit log、MCP、runner、secret、content exclusion、review policy を再確認する。ここで問題が出た場合、利用を戻すのではなく、対象 repository の guardrails を増やす。Copilot 導入は一度の解禁ではなく、利用段階に応じて統制を厚くする運用にしたほうがよい。

## 注意点: データ欠落と別ツール利用

Copilot usage metrics は GitHub が観測できる Copilot 利用を表す。会社の実際の AI coding 活用全体ではない。開発者が別の AI coding tool を使っている場合、GitHub 外の review workflow がある場合、社内 proxy や端末設定で telemetry が欠ける場合、dashboard は全体像の一部になる。

また、GitHub Docs の usage metrics interpret guide は、feature adoption、model adoption、language usage、cohort review の読み方を分けている。これは重要である。モデル adoption が進んでいること、agent adoption が増えていること、language usage が変わっていること、PR throughput が上がっていることは、それぞれ別の現象である。1つの数字に統合し過ぎると、対策が曖昧になる。

日本企業では、dashboard の数字を DORA metrics、incident、defect、security finding、reviewer load、developer survey と合わせて読むべきである。特に regulated industry では、PR merge velocity だけを上げる施策は危うい。速さ、品質、統制、費用の4つを同時に見る必要がある。

## まとめ

Copilot impact dashboard は、GitHub Copilot の管理者にとって重要な更新である。active user count の次に見るべきものとして、AI adoption cohort、adoption multiplier、PR throughput、merge velocity、recommendations を提供し、導入深度と PR flow を結びつける。

ただし、日本企業での価値は、dashboard をそのまま報告資料に貼ることではない。cohort を enablement segmentation として使い、repository-level metrics と結び、AI Credits と cost center へ接続し、必要な guardrails を backlog 化することにある。

Copilot 導入は、ライセンスを配って終わる段階から、どの部門がどの agent surface を安全に使い、どの repository の PR flow に効いているかを継続的に見る段階へ移っている。impact dashboard は、その運用を始めるための管理画面である。

## 出典

- [New Copilot usage metrics impact dashboard](https://github.blog/changelog/2026-07-22-new-copilot-usage-metrics-impact-dashboard/) - GitHub Changelog, 2026-07-22
- [Viewing the Copilot impact dashboard](https://docs.github.com/en/copilot/how-tos/administer-copilot/view-impact-dashboard) - GitHub Docs
- [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) - GitHub Docs
- [Interpreting usage and adoption metrics for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/interpret-copilot-metrics) - GitHub Docs
