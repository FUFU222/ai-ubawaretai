---
article: 'anthropic-claude-fable-mythos-access-suspension-2026'
level: 'expert'
---

Anthropic による Claude Fable 5 / Claude Mythos 5 のアクセス停止は、frontier model を本番業務に組み込む企業にとって、モデル可用性、規制対応、データ保持、代替モデル設計を同時に見直すべき事例である。2026年6月9日の発表では、Fable 5 は widely released model、Mythos 5 は Project Glasswing 参加者向けの限定モデルとして位置づけられた。しかし6月12日には、Anthropic が米国政府の directive に対応するため、両モデルへのアクセス停止を発表した。

前回の [Claude Fable 5 / Mythos 5導入設計](/blog/anthropic-claude-fable-mythos5-governance-2026/) では、1M token context window、128k max output tokens、adaptive thinking、30日 data retention、Project Glasswing 限定提供、複数クラウド経路を扱った。今回の更新は、その評価前提が数日で変わり得ることを示している。これは障害対応だけでなく、調達、契約、SRE、セキュリティ、法務の問題である。

また、[Project Glasswing拡大](/blog/anthropic-project-glasswing-expansion-critical-infra-2026/) で見たように、Mythos 系モデルは重要インフラやOSS保守者を含む防御側アクセス設計と深く結びつく。さらに [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) の文脈では、モデル能力が強くなるほど、実行境界、秘密情報、MCP、監査ログ、ネットワークアクセスを制御する必要が増える。今回の停止は、その制御対象に「モデルがそもそも利用可能か」を加えるべきだと示している。

## 事実: 6月9日から6月12日までに状態が変わった

Anthropic は 2026年6月9日、Claude Fable 5 と Claude Mythos 5 を発表した。Fable 5 は Anthropic の最上位の widely released model として、Claude API、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry で提供されるとされた。Mythos 5 は、Project Glasswing の承認済み参加者向けに限定提供されるモデルであり、Mythos Preview の後継として説明された。

同じ発表では、両モデルが 1M token context window、128k max output tokens、always-on adaptive thinking を備えること、価格が input 100万 token あたり10ドル、output 100万 token あたり50ドルであることも示された。Fable 5 は一般提供側、Mythos 5 は防御的サイバーセキュリティ向けの限定提供側という切り分けだった。

しかし、2026年6月12日、Anthropic は Fable 5 と Mythos 5 へのアクセス停止を発表した。声明は、米国政府の export control directive が、米国内外を問わず外国籍者へのアクセス停止を求めているため、コンプライアンス確保のため顧客向けアクセスを急きょ止める必要があると説明している。Claude Help Center の release notes も同日、両モデルのアクセス停止を記録している。

この変化は、通常のモデル deprecation とは違う。deprecation なら数週間から数カ月の移行期間が設定されることが多い。今回は、発表直後の高能力モデルについて、政策・安全保障・コンプライアンス上の理由でアクセス状態が短期間で変わった。企業のAI運用では、この種の変化を通常の incident category として扱う必要がある。

## 事実: GitHub CopilotはFable 5提供を停止した

GitHub は 2026年6月9日、Claude Fable 5 が GitHub Copilot で一般提供されると発表した。利用面では、Visual Studio Code、Visual Studio、Copilot CLI、GitHub Copilot cloud agent、Copilot app、github.com、GitHub Mobile、JetBrains、Xcode、Eclipse が挙げられていた。対象プランは Copilot Pro+、Max、Business、Enterprise で、Business / Enterprise 管理者は Fable 5 policy を有効化する必要があると説明された。

同記事は、Fable 5 が Anthropic の safety classifiers を運用するため data retention を必要とすることも説明していた。保持対象は prompts と outputs で、最大30日保持され、モデル学習には使われないという位置づけだった。ほかの Claude モデルは Zero Data Retention のまま利用できるとされた。

その後、GitHub は同記事に 2026年6月12日の editor's note を追記し、Anthropic の発表を受けて GitHub Copilot の全体で Fable 5 へのアクセスを停止したと説明した。Claude Opus 4.8、Sonnet 4.6、Haiku 4.5 など他の Claude モデルは影響を受けないとされた。

ここで重要なのは、企業が直接 Anthropic API を使っていなくても影響を受ける点である。Copilot のような開発基盤、IDE、CLI、agentic workflow、社内AI gateway は、外部モデルを組み合わせている。あるモデルの停止は、利用者から見ると「Copilot のモデル選択肢が消えた」「cloud agent の品質が変わった」「CLIで想定したモデルが選べない」という形で現れる。

## 事実: Fable 5固有の保持条件とAPI挙動も残る

Anthropic Docs の Claude Platform release notes は、Fable 5 / Mythos 5 について複数の実装上の注意を示している。両モデルは 1M context と 128k max output tokens をサポートし、adaptive thinking が唯一の thinking mode になる。`thinking: {"type": "disabled"}` は使えず、manual extended thinking budget や assistant prefill もサポートされない。

Fable 5 は request 中と response generation 中に safety classifiers を走らせ、拒否時には Messages API が `stop_reason: "refusal"` を返す。`stop_details.category` には、既存の cyber / bio に加え、reasoning_extraction が入る。これは、モデル出力の複製や逆解析に関する制限に触れる場合のカテゴリとして説明されている。

保持条件も明確に違う。Fable 5 は Claude API で30日 data retention を必要とし、Zero Data Retention では利用できない。移行ガイドでも、ZDR arrangement を持つ組織は Fable 5 への移行前に eligibility を確認する必要があると説明されている。Bedrock、Vertex AI、Microsoft Foundry では、それぞれのプラットフォームが data retention を支配する。

今回 Fable 5 が停止されたとしても、これらの条件は再開時や後継モデル評価時に消えるわけではない。むしろ、企業は「高能力モデルは、通常モデルと同じ保持条件やAPI制御ではない場合がある」と前提化すべきである。

## 分析: モデル可用性をSREと調達の共通管理対象にする

ここからは分析だ。

多くの企業はAIモデルを評価する時、精度、速度、価格、context window、tool use、セキュリティ認証を見る。しかし、本番業務に入れるなら可用性も同じ重さで扱う必要がある。ここでいう可用性は、単にAPIがHTTP 200を返すかではない。モデルが対象国、対象ユーザー、対象プラン、対象クラウド、対象契約で使えるかまで含む。

AIモデルの停止は、クラウドリージョン障害、SaaS障害、認証基盤障害、外部API変更に近い。ただし、原因はインフラ故障だけではなく、規制、輸出管理、契約変更、安全分類器、データ保持、モデルライフサイクルでも起きる。したがって、SREだけでは完結せず、調達、法務、セキュリティ、AI governance が同じ incident table を見る必要がある。

実務では、AIモデルごとに RTO / RPO に相当する考え方を置くとよい。たとえば、コードレビュー支援なら24時間停止しても人手で代替できるかもしれない。一方、顧客対応の一次分類、SOCの脆弱性triage、障害時のrunbook生成に使っている場合、数時間の停止でも業務影響が出る。AIの利用用途を business criticality で分類し、critical path にあるモデルには代替ルートを用意する。

ここで [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) のような長時間タスクの評価が効いてくる。高能力モデルほど、複雑な移行、長文分析、エージェント作業を任せたくなる。しかし、そのモデルにしか完了できない業務を増やすと、停止時の影響が大きくなる。評価時には「最高性能」だけでなく「代替モデルで許容品質を出せるか」も測るべきである。

## 分析: 代替モデルは性能ではなく運用条件で比較する

Fable 5 が使えない時、代替として Claude Opus 4.8、Sonnet 4.6、他社モデル、社内標準モデルを選ぶことになる。しかし代替モデル表で性能だけを見ると、切り替え後に監査・契約・コストで詰まる。

比較表には、少なくとも model ID、provider、endpoint、region、context window、max output、tool use、thinking / effort control、data retention、ZDR可否、logging、training use、fallback policy、refusal handling、pricing、rate limit、available surfaces を入れるべきだ。GitHub Copilot 経由なら、IDE、CLI、cloud agent、web、mobile で同じモデルが選べるかも確認する。

特に日本企業では、データ保持とリージョンが重要になる。顧客コードや個人情報を扱う開発支援では、30日保持を許容できるか。金融、医療、公共、製造の秘密情報では、ZDRや閉域接続が必要か。Bedrock、Vertex AI、Foundry、Anthropic直契約で処理地域やログがどう違うか。こうした条件を一度承認しておかないと、障害時に現場判断で別モデルへ切り替え、後から説明できなくなる。

また、拒否挙動も比較対象に入れるべきである。Fable 5 は `stop_reason: "refusal"` とカテゴリを返す設計を持つ。代替モデルが同じカテゴリを返すとは限らない。セキュリティレビュー、脆弱性調査、法務文書、医療文書では、拒否された時に user へどう説明するか、fallback を許すか、監査ログに何を残すかが重要になる。

## 分析: Mythos級モデルの制限は日本の重要インフラにも示唆がある

Mythos 5 は、Project Glasswing の承認済み参加者向けに限定提供されるモデルとして発表された。今回の停止は、Mythos級モデルが政策・安全保障・アクセス制御と強く結びつくことを改めて示している。日本企業が直接 Mythos 5 を使えるかどうかに関係なく、重要インフラやOSS防御にAIを使う流れには影響がある。

Project Glasswing は、防御側へ高いサイバー能力を持つモデルを限定提供し、重要ソフトウェアやインフラの脆弱性を発見・修正する方向を示してきた。日本でも、AIを使った脆弱性検知、SBOM、委託先ソフトウェア管理、重要インフラのサプライチェーン防御は関心が高い。だが、強いサイバー能力を持つモデルは、誰にどの条件で渡すかが製品仕様の一部になる。

企業のCSIRT、PSIRT、AppSec、調達部門は、AIセキュリティモデルを「性能のよいスキャナ」としてだけ見ないほうがよい。アクセス承認、利用者資格、ログ、開示フロー、修正SLA、委託先との責任分界、規制変更時の停止対応まで含めて運用設計する必要がある。今回の停止は、そのアクセス設計が外部要因で変わる可能性を示した。

## 実務チェックリスト

第一に、モデル利用面の棚卸しをする。Claude API、Claude Platform on AWS、Amazon Bedrock、Vertex AI、Microsoft Foundry、GitHub Copilot、IDE、CLI、cloud agent、社内AI gateway、SaaSに組み込まれたClaude利用を洗い出す。利用者が直接モデル名を意識していない経路も対象にする。

第二に、Fable 5 / Mythos 5 の利用有無を確認する。評価環境、本番、PoC、社内デモ、セキュリティ検証、開発者個人の設定まで見る。停止中モデルを前提にした評価結果は、代替モデルで再現しない限り、調達判断に使わない。

第三に、代替モデル表を更新する。Opus 4.8、Sonnet 4.6、Haiku 4.5、他社モデル、社内モデルについて、性能、コスト、context、data retention、ZDR、region、refusal、tool use、利用可能surfaceを比較する。単に「同じClaudeだから大丈夫」としない。

第四に、データ分類とモデル承認を結びつける。顧客コード、個人情報、営業秘密、医療・金融・公共データ、研究情報、公開情報を分け、それぞれで許容されるモデルと提供経路を定義する。30日保持を許容できないデータは、Fable 5再開後も別モデルまたは別経路に残す。

第五に、fallback を事前に設計する。アプリ側で別モデルへ自動切替するのか、ユーザーが選び直すのか、管理者が一括変更するのかを決める。自動切替する場合、品質差、コスト差、拒否差、監査ログ、ユーザー通知を明示する。

第六に、AI incident runbook を作る。モデル停止、rate limit、価格変更、データ保持条件変更、利用規約変更、リージョン停止、特定国・特定ユーザー制限を別カテゴリとして定義する。各カテゴリに、検知方法、一次連絡先、代替手段、利用者向けメッセージ、経営報告の要否を置く。

第七に、評価セットを代替モデルで定期実行する。重要業務について、月次または四半期で代表タスクを複数モデルに流し、品質とコストを比較する。これにより、突然のモデル停止時にも、どのモデルへ逃がすべきかを過去データで判断できる。

## まとめ

Claude Fable 5 / Mythos 5 のアクセス停止は、最新モデルの採用判断に「可用性と規制変更」を組み込む必要があることを示した。GitHub Copilot への波及により、直接APIを使わない企業でも、開発基盤やSaaS経由で影響を受けることが分かった。

日本企業が取るべき対応は、AI導入を止めることではない。モデルを外部依存として台帳化し、代替モデル、保持条件、ZDR、region、拒否挙動、fallback、利用者説明を準備することである。Fable 5 が再開されたとしても、今回の事例は frontier model を本番運用するためのチェックリストを更新する理由になる。

## 出典

- [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) - Anthropic, 2026-06-12
- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) - Claude Help Center, 2026-06-12
- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) - Anthropic, 2026-06-09
- [Claude Fable 5 is generally available for GitHub Copilot](https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/) - GitHub Changelog, 2026-06-09
- [Claude Platform release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs
- [Migration guide](https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4) - Anthropic Docs
