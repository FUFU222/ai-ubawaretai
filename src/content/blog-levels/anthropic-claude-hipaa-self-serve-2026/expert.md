---
article: 'anthropic-claude-hipaa-self-serve-2026'
level: 'expert'
---

Anthropic の 2026年7月14日の HIPAA self-serve configuration は、医療向けの単純な compliance checkbox ではない。Claude Enterprise と Claude API を、PHI processing の契約・機能制限・組織設計へ明示的に載せる更新である。日本企業が読むべき論点は、HIPAA そのものの国内適用ではなく、患者情報を扱う AI workload を一般用途から分離できるかにある。

Release notes は、Claude organization の HIPAA configuration を self-serve にしたと説明している。対象は Claude Enterprise と Claude Platform API の両方で、eligible admin が BAA を review し、implementation guide を download し、HIPAA configuration を single flow で enable できる。これは、法務・営業窓口だけに依存していた導入工程の一部を、organization admin の運用 flow に近づける変更である。

ただし、この更新は「Claude がすべて HIPAA-ready になった」という意味ではない。むしろ逆で、Claude の中にある eligible features、non-eligible features、consumer products、Claude Code、partner-operated platforms、third-party integrations、beta features を分けて読まないと事故る。日本の医療 AI 事業者、製薬企業、保険会社、病院グループ、BPO、SIer は、ここを procurement checklist と architecture review に落とす必要がある。

この流れは [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) の audit plane、[Claude Access TransparencyとCMEK保全](/blog/anthropic-claude-cmek-preserve-access-transparency-2026/) の vendor transparency、[Claude Enterprise管理API](/blog/anthropic-claude-enterprise-user-management-api-2026/) の identity lifecycle と一体で考えるべきである。HIPAA-ready organization を作っても、誰が入れるか、どの feature を使ったか、どの log を取るかが崩れていれば、医療情報を扱う AI 基盤としては弱い。

## 事実: API HIPAA readinessの境界

Claude Platform Docs の API and data retention page は、Claude API における HIPAA readiness を、signed BAA と HIPAA-enabled organization のもとで supported API features を使い PHI を処理する arrangement として説明している。eligible organizations は Claude Console から BAA を review / execute し、HIPAA readiness を有効化できる。standard BAA で self-serve できる場合と、custom BAA が必要で sales に進む場合がある。

重要なのは、HIPAA readiness が organization level で enforce されることだ。API documentation は、有効化後は configuration が permanent で、administrator が disable できないと説明している。一般用途と PHI 用途を同じ organization に置くと、feature restriction、model / tool selection、development workflow、logging、billing、incident response が衝突する。architectural default は、PHI 用 organization と general-purpose organization の分離である。

Feature eligibility table も設計上の制約になる。Messages API、1M context、adaptive thinking、citations、data residency、effort、extended thinking、fine-grained tool streaming などは HIPAA eligible とされる一方、Advisor tool、Agent Skills、Batch processing、cache diagnostics、Claude Managed Agents、Code execution、computer use、context editing / management、Files API、MCP connector などは No とされる項目がある。つまり、医療 AI を agentic workflow として作る場合、便利な tool surface の多くが PHI path では使えない可能性がある。

API は non-eligible feature を含む request を 400 error で止めると説明されている。これは良い安全弁だが、application architecture としては例外処理が必要である。feature flag、model gateway、request validator、observability、user-facing error message を用意しないと、本番で「医療情報を含む request だけ突然失敗する」状態になる。HIPAA-ready mode は契約だけでなく runtime behavior も変える。

## 事実: Enterprise HIPAA-ready plansの境界

Enterprise 向け Help Center は、HIPAA-ready Enterprise plans が Enterprise plans only の機能であり、self-serve と sales-assisted の Enterprise plan が対象だと説明している。PHI を Claude で処理する organizations のための offering で、BAA、functionality、safeguards を含み、organization の HIPAA compliance requirements を支える設計だとされる。

ここでも、対象範囲は製品面ごとに確認する必要がある。Claude Enterprise は従業員が利用する SaaS interface であり、projects、files、organization settings、connector permissions、roles などの運用が絡む。医療情報を扱う Enterprise project を作る場合、誰が project を作れるか、誰が file を upload できるか、どの connector を有効化できるか、retention policy がどうなるかを事前に決める。

Claude Code は別扱いである。Team / Enterprise plan の Claude Code 記事は、HIPAA-ready Enterprise plan で Claude Code access が seat に含まれていても、Claude Code は HIPAA-ready offering の covered service ではないと説明している。これは日本の開発組織では特に重要だ。医療系 SaaS の開発者が、production log、patient-like fixture、support ticket、chart extract、claim document を Claude Code に渡すと、Enterprise seat の有無だけでは説明できない。

Claude for Healthcare の発表は、Claude が prior authorization、claims appeals、care coordination、clinical trial protocol、regulatory submissions などの医療・ライフサイエンス tasks に価値を出す方向を示していた。だが、そこでも HIPAA-ready products を通じた利用が前提になる。healthcare connector や Agent Skill の話と、PHI handling の契約・機能 eligibility は分けて読む必要がある。

## 日本企業の設計原則

第一の原則は、data class by organization である。PHI、患者情報、健康情報、研究参加者情報、保険請求情報、介護記録を扱う organization と、一般業務・検証・開発学習用の organization は分ける。organization level の permanent enablement は、後から簡単に戻せない。もし同じ organization に混ぜるなら、その理由、制限、例外処理、監査範囲を文書化する必要がある。

第二の原則は、feature allowlist である。PHI path では、API gateway で eligible feature のみ許可する。tool use、MCP connector、code execution、managed agents、batch、files などを default deny にし、利用したい場合は BAA と feature eligibility table を見て個別承認する。client application 側で「この画面は患者情報を含む可能性がある」と分かるなら、request builder が PHI-safe profile を選ぶ設計にする。

第三の原則は、identity / role separation である。医療情報を扱う Enterprise user、一般社員、developer、external contractor、auditor、administrator を role と group で分ける。ここは [Claude Enterprise管理API](/blog/anthropic-claude-enterprise-user-management-api-2026/) の user inventory と合わせ、HR master、IdP、委託先台帳、role assignment を突き合わせる。PHI handling group は「便利だから広げる」対象ではなく、業務資格と承認理由を持つ entitlement として扱う。

第四の原則は、audit by layer である。request logs、application logs、Claude Compliance API、admin activity、BAA acceptance record、feature rejection errors、cloud provider logs、DLP alerts を別々に持ち、incident timeline で結合できるようにする。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で整理したように、DLP / SIEM / Purview へ流せることは出発点であって、誰が調査し、どの条件で停止し、誰へ報告するかまでが統制である。

## PHI pathで避けるべき混在

避けるべき混在の一つ目は、development support と PHI processing の混在である。Claude Code、IDE extension、terminal agent、repository analysis は開発生産性には有用だが、HIPAA-ready offering の covered service ではない。医療系プロダクトの repository に PHI が混ざらない設計、production log の redaction、support ticket の masking、test fixture の synthetic data 化が前提になる。

二つ目は、agentic tools と PHI request の混在である。Managed Agents、MCP connector、code execution、files、batch は、それぞれ storage、external tool processing、container retention、asynchronous processing の問題を持つ。API eligibility で No とされる feature は、単に「現時点で便利ではない」のではなく、PHI lifecycle を説明しにくいから除外されていると読むべきだ。

三つ目は、consumer / team usage と regulated workload の混在である。Claude Free、Pro、Max、Team の通常利用、個人の mobile app、browser extension、personal health data connector と、医療機関や事業者が PHI を処理する Enterprise / API environment は分ける。個人が自分の健康情報を接続する体験と、事業者が患者情報を処理する責任は別物である。

四つ目は、write-capable connector との混在である。[Claude CoworkとM365書き込み権限](/blog/anthropic-claude-cowork-web-mobile-m365-write-2026/) で見たように、AI が Outlook、Calendar、SharePoint、OneDrive を操作する場合、誤送信、ファイル更新、予定変更、agent-initiated action の auditability が問題になる。医療情報を含む文書や患者連絡に近い workflow では、read-only と write action を分け、write は人間承認を必須にするのが妥当である。

## 実装チェックリスト

API 実装では、まず organization mapping を作る。`general`, `dev`, `phi-prod`, `phi-staging` のように environment と data class を分け、API key、workspace、rate limit、logging destination、retention arrangement を台帳化する。PHI 用 organization では、eligible model / feature list を gateway に hard-code するのではなく、configuration と release note review process で更新できるようにする。

次に、request classification を実装する。入力が PHI を含む可能性がある画面、endpoint、tenant、customer contract、user role を判定し、PHI-safe profile を選ぶ。user が「これは PHI ではない」と手動指定する設計は補助にとどめる。患者名、医療記録番号、保険者番号、検査結果、診療文脈、薬剤名、予約情報が入る workflow は、最初から PHI path として扱うほうが安全だ。

第三に、non-eligible feature error を product behavior にする。API が 400 を返した場合、単なる internal error にせず、「この医療情報 workflow では code execution / batch / file upload は使えない」と分かるメッセージにする。運用側には、どの feature が拒否されたか、どの tenant / user / endpoint で発生したかを alert する。これは policy violation の早期検知にもなる。

第四に、admin action の証跡を残す。BAA を誰が review / execute したか、implementation guide を誰が download したか、HIPAA readiness をいつ enable したか、organization をなぜ分けたかを、契約台帳と change management に残す。self-serve 化は便利だが、法務承認なしに管理者が本番契約状態を変える運用は避けるべきである。

第五に、periodic review を設定する。Anthropic の feature eligibility、covered models、data retention、Claude Code coverage、beta feature coverage は変わり得る。医療 AI では、初回承認で終わらせず、月次または四半期で release notes、docs、BAA、implementation guide、internal exception list を見直す必要がある。

## まとめ

Claude HIPAA self-serve configuration は、医療・ヘルスケア領域で Claude を使う導入摩擦を下げる。一方で、管理者が容易に有効化できるからこそ、organization level の不可逆性、対象外 feature、Claude Code の非対象性、external tools、beta features を先に整理しなければならない。

日本企業にとっての実務結論は明確である。PHI や患者情報を扱う Claude 環境は、一般用途、開発者支援、agentic tools、write-capable connectors から分離する。BAA と HIPAA-ready 設定は出発点であり、identity、feature allowlist、request classification、logging、incident response が揃って初めて、医療 AI の本番基盤として説明できる。

## 出典

- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Claude Help Center, 2026-07-14
- [HIPAA-ready Enterprise plans](https://support.claude.com/en/articles/13296973-hipaa-ready-enterprise-plans) - Claude Help Center
- [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) - Claude Platform Docs
- [Use Claude Code with your Team or Enterprise plan](https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan) - Claude Help Center
- [Advancing Claude in healthcare and the life sciences](https://www.anthropic.com/news/healthcare-life-sciences) - Anthropic, 2026-01-11
