---
article: 'anthropic-ciso-agentic-ai-governance-2026'
level: 'expert'
---

Anthropic Deputy CISO の Jason Clinton 氏が公開した **CISO's guide to agentic AI** は、agentic AI の導入審査を security review の現実に引き戻す記事である。重要なのは、AI エージェントの能力紹介ではない。CISO が「ゼロリスク」を待つのではなく、agentic risk を legible and bounded にし、事業が管理外の経路へ逃げないようにするための判断フレームである。

日本企業でこの論点が急ぐ理由は明確だ。Claude Code、Claude Cowork、GitHub Copilot、Codex、Gemini Agent Platform のような agentic system は、チャットの外へ出て、repository、SaaS、Slack、メール、ブラウザ、MCP、ローカルファイル、CI、production log に触り始めている。従来の生成AI利用規程が「機密情報を入れない」「出力を確認する」程度で止まっているなら、agentic AI の権限面を管理できない。

このサイトでは、[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で sandbox、filesystem boundary、egress control を見た。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) では Claude Enterprise/Platform の監査ログを DLP、SIEM、Purview へ流す話を扱った。[Claude CoworkとM365書き込み権限](/blog/anthropic-claude-cowork-web-mobile-m365-write-2026/) では、write-capable connector が業務AIの責任分界を変える点を整理した。今回の記事は、それらの統制部品を CISO の承認プロセスに組み込む位置づけで読むべきだ。

## 事実: 評価軸は非信頼入力、行動、blast radius、観測性

Anthropic は、agentic use case が review process に来たとき、4 つの質問で評価すると説明している。第一に、どの untrusted content を ingest するか。外部メール、open web、third-party documents、public repositories など、攻撃者が書く可能性のある入力は prompt injection の経路になる。もし非信頼入力が何もなければ、agent-specific risk はかなり下がる。

第二に、何を、誰の behalf で実行できるか。read-only、read/write、tool calls、code execution、network egress は別々に扱う必要がある。特に「誰の権限か」は auditability に直結する。人間の credential を使う personal agent、用途を固定した service account agent、delegate identity を持つ agent では、説明責任と停止方法が違う。

第三に、misalignment 時の blast radius である。AI が意図から外れたとき、1つのドキュメントが漏れるだけなのか、production database へ届くのか。組織の中で誰が被害を受け、どの規制・契約・顧客説明が発生するのか。ここを先に数えずに agent を許可すると、インシデント時に「なぜそこまで届いたのか」を説明できない。

第四に、observability である。agent action と user action を区別できるか。SIEM に入るか。異常が数分で見えるのか、長期間分からないのか。Anthropic は insider risk の文脈を引き、従来の insider incident response が日単位である一方、agent execution speed ではそれでは遅すぎると整理している。

この4問は、技術選定ではなく承認プロセスの言語である。日本企業の AI 審査票に入れるなら、「利用目的」よりも先に、非信頼入力、許可操作、identity、blast radius、ログ送信先、緊急停止方法を書く欄が必要になる。

## 事実: agent identity spectrumは責任分界の問題である

Anthropic は agentic identity を spectrum として説明している。一方の端は system service account である。incident-response agent、ticket triage agent、自律 code reviewer のように、単一目的で最小権限を持つ identity だ。人間に紐づかず、用途が狭いため、権限設計とログレビューをしやすい。

もう一方の端は human credential である。従業員が Claude Cowork のような personal agent を使い、本人の権限で操作する場合、責任は通常の業務操作と同じく本人に近い。これは分かりやすい一方、agent が多くの SaaS やローカル環境へ広がるほど、本人がすべての tool action を理解できるとは限らない。

危険なのは中間である。agent が人間から delegated identity を受け取り、その人が見ていない場所で長時間動き、複数システムをまたぐと accountability が曖昧になる。日本企業では、委託先、派遣社員、共有アカウント、異動・兼務、親会社/子会社の権限が混ざるため、この曖昧さはさらに大きくなる。

したがって、agent identity は「SSO でログインできるか」だけでは足りない。agent 用の account owner、利用目的、scope、token lifetime、revoke 手順、退職・異動時の処理、ログ上の表示名、権限レビュー周期を決める必要がある。ISO 27001 や内部統制で人間アカウントの棚卸しをしている企業は、その棚卸し対象に agent identity を入れるべきだ。

## 事実: Claude Coworkの統制は7要件として読める

記事中の Claude Cowork 例は、agent vendor に確認すべき要求事項として使える。

第一に、identity は既存 IdP から来るべきである。Claude Cowork では SAML/OIDC と SCIM を使い、Enterprise plan では custom roles によって group 単位で capability を絞れると説明されている。日本企業では、Okta、Entra ID、Google Workspace、社内 IdP のいずれを使うかにかかわらず、agent だけ別 ID 管理にしないことが重要だ。

第二に、connector allowlist が data boundary になる。admin が connector を org-wide に有効化し、user が個別に自分の account を authorize する二段構えが示されている。ここでの判断は「便利な connector を入れる」ではなく、「この agent がどのデータ境界へ届くか」を決める行為である。

第三に、per-tool、per-action approval である。connector 全体を許可するだけでは荒い。読み取り、検索、下書き、送信、削除、権限変更、外部共有を分け、production database deletion のような最悪モードが怖いなら delete verb を agent world から消すべきだと記事は説明している。

第四に、sandboxed execution である。Claude Cowork の remote sessions では agent loop が隔離された一時 sandbox で動き、connector authorization token は sandbox に入らない。credential が盗まれる価値を持たない環境で agent を動かすという考え方は、[Project Glasswing初報](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) のような強力なAI防御能力を扱う場面でも重要になる。

第五に、egress allowlisting である。agent の実行環境から出る通信は、sandbox が変更・迂回できない proxy を通し、管理者が選んだ宛先だけにする。prompt injection を完全に防げない前提では、データを外へ出す経路を狭めることが最も効く。

第六に、telemetry は SIEM へ OpenTelemetry で流れるべきである。Claude Cowork では OTLP endpoint を Organization settings に設定し、tool name、MCP server、parameters、success/failure、duration、user identity、session context を stream できると説明されている。一方で、Claude Cowork activity は現時点で Compliance API や formal audit logs に入らず、prompt content は Cowork の OTel output に既定で含まれるとも書かれている。これは日本企業の個人情報保護、労務、内部監査で必ずレビュー対象になる。

第七に、org-wide off switch である。active sessions を含め、connector を全ユーザーで止められること、RBAC で特定 group だけ止められること、connector の write operation だけを止められることが重要になる。agentic AI の incident response plan は、製品停止、group revoke、connector/action disable の三層を事前に持つべきだ。

## 分析: 日本企業の承認票はAI名ではなく能力で作る

ここからは分析だ。

日本企業の AI 利用申請は、しばしば製品名中心になる。「Claude を使いたい」「Copilot を入れたい」「Gemini を試したい」という申請である。しかし agentic AI では、同じ製品でも capability surface が大きく変わる。チャットだけの Claude、Claude Code、Claude Cowork、M365 connector 付き、browser use 付き、MCP 付きでは、同じ Anthropic 製品でも審査結果は変わる。

承認票は製品名ではなく能力で作るべきだ。入力欄には、外部メール、Web、顧客ファイル、社内 wiki、ソースコード、production log、個人情報、機密契約を読むかを分ける。操作欄には、read、create draft、send、edit existing、delete、permission change、code execution、network egress を分ける。identity 欄には、human credential、service account、agent identity、delegated token、token lifetime を書く。

そのうえで、blast radius を定量化する。影響対象が1ユーザー、1部門、全社、顧客、規制対象データ、production system のどれか。復旧手段が undo、human review、restore from backup、customer notification、regulator notification のどれか。CISO が承認すべきなのは「AIを使うこと」ではなく、この risk envelope である。

この設計にすると、事業部門も進めやすい。たとえば、営業メール agent は外部 Web と CRM を読むが、外部送信は不可、draft 作成だけ、顧客リストの export 不可、DLP 検知あり、30人で pilot という形なら承認しやすい。逆に、顧客データを読み、外部送信でき、ログが別 dashboard にしかなく、緊急停止が vendor ticket 依存なら、止める理由を具体的に説明できる。

## GRCを遅い関門から運用データへ変える

Anthropic の記事で興味深いのは、GRC 自体も agent を使っていると述べている点である。security questionnaire response、vendor questionnaire、subprocessor change notification の確認を agent で支援している。ここでの示唆は、GRC が AI 導入の障害物になるのではなく、AI を使って review throughput を上げる必要があるということだ。

日本企業でも、AI 利用申請を四半期のリスク登録簿だけで処理するのは遅い。agentic AI の capability は月単位、場合によっては週単位で増える。製品側が connector action control や OTel stream を追加する一方、社内審査票が半年前のままなら、現場は非公式に試し始める。

実務的には、AI 利用申請と security review を structured data 化するべきだ。4 問の回答、許可操作、ログ送信先、pilot group、review date、incident owner、off switch を台帳化し、更新差分を追う。可能なら、AI agent 自身にベンダー更新、connector 追加、subprocessor 変更、OTel schema 変更を読み取らせ、人間の risk owner へ再評価を促す。

これは人間の承認を置き換える話ではない。Anthropic も、deliberately accepting risk は権限を持つ人間が行う行為だと説明している。AI は、申請の抜け漏れ、過去案件との差分、vendor docs の更新、ログの異常、pilot の拡大条件を見つける補助に使うべきである。

## 日本企業が次に作るべきチェックリスト

最初に作るべきなのは、agentic AI の trust boundary 定義である。社内で何を untrusted content とみなすかを明文化する。外部メール、Web、顧客提出ファイル、公開リポジトリ、取引先 Slack/Teams、社外共有 Drive、社内 wiki のコメント欄、support ticket は、会社によって扱いが違う。ここを決めると、以後の審査が速くなる。

次に、agent capability catalog を作る。社内で使われる AI ツールについて、read targets、write actions、code execution、browser/computer use、MCP、connector、network egress、local file access、credential exposure、telemetry path を一覧化する。製品名ではなく capability を見るための台帳である。

三つ目は、observability baseline である。pilot でも本番でも、agent action が SIEM、DLP、CASB、proxy、IdP、EDR のどこに残るかを確認する。Claude Cowork のように OTel が native monitoring path で、Compliance API とは別扱いの面もある。ログの有無だけでなく、prompt content が含まれるか、個人情報や労務監視上の扱い、保存期間、閲覧権限も決める。

四つ目は、stop plan である。全社 off switch、group revoke、connector disable、write action disable、token revoke、sandbox kill、network egress block、pilot freeze を並べる。インシデント時に「ベンダーに問い合わせる」だけでは遅い。agent speed に合わせるなら、管理者が数分で止められる層を持つ必要がある。

最後に、半年後の能力増加を前提にする。Anthropic の incident response agent の例では、モデルを更新しただけで、agent が自発的に別 agent へ code fix を依頼するような行動が出たと説明されている。今はできないと思っていたことが、モデル更新で突然できるようになる。だから、prompt や手順で縛るより、identity、least privilege、monitoring、off switch で縛るべきだ。

## まとめ

Anthropic の CISO ガイドは、agentic AI governance の良い出発点である。日本企業が採用すべき中心は、ゼロリスク判断ではなく、bounded risk 判断だ。非信頼入力を確認し、行動能力を絞り、blast radius を小さくし、SIEM/OTel で観測し、小さな group から広げる。

この方針なら、AI 推進とセキュリティは対立しにくい。事業部門は「どの条件なら使えるか」を得られ、CISO は「どこまでなら受け入れられるか」を説明できる。逆に、この条件を持たずに全社展開すれば、最初の serious agent incident が AI program 全体を止める可能性がある。

2026年の agentic AI 導入で差が出るのは、どのモデルを選ぶかだけではない。agent を人間と同じように、identity、least privilege、monitoring、incident response の対象として扱えるかである。日本企業は、AI 利用規程の次に、agentic AI 承認票と停止手順を作る段階へ進むべきだ。

## 出典

- [Zero risk isn't the job: a CISO's guide to agentic AI](https://claude.com/blog/ciso-guide-to-agentic-ai) - Anthropic, 2026-07-17
- [Preparing your security program for AI-accelerated offense](https://claude.com/blog/preparing-your-security-program-for-ai-accelerated-offense) - Anthropic, 2026-04-10
- [Security - Claude Code Docs](https://code.claude.com/docs/en/security) - Anthropic Docs
