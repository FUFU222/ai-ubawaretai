---
article: 'anthropic-ciso-agentic-ai-governance-2026'
level: 'expert'
---

Anthropic の CISO ガイドは、AI エージェント導入を security review の待ち行列へ押し込む文書ではない。むしろ、セキュリティ部門が business enablement と risk acceptance を同じ言葉で扱うための実務フレームである。Deputy CISO の Jason Clinton 氏は、CISO の仕事を zero risk の達成ではなく、agentic risk を legible and bounded にすることだと整理している。

この整理は、日本企業の AI 推進にかなり合う。現場は AI エージェントを早く使いたい。経営は生産性や人手不足対策を求める。セキュリティ、法務、内部監査は説明責任と事故対応を気にする。この間で「まだ危ないから禁止」と「便利だから全社解禁」の二択にすると、どちらも失敗しやすい。

既存記事の [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) は、sandbox、egress、credential、MCP、local file boundary の設計を扱った。今回の CISO ガイドは、その前に置くべき承認ロジックを扱う。さらに [Claude Compliance API](/blog/anthropic-claude-compliance-api-integrations-2026/) の監査ログ連携や、[Claude Cowork の M365 write tools](/blog/anthropic-claude-cowork-web-mobile-m365-write-2026/) の操作権限拡大と合わせると、Claude は「使うツール」から「統制対象の業務実行主体」へ移っている。

## 事実: 内部リスクはデータ漏えいとprompt injectionから始まる

Anthropic の記事は、外部リスクと内部リスクを分けている。外部リスクとは、AI によって脆弱性発見から exploit までの時間が縮むことだ。これは companion piece の AI-accelerated offense で扱われており、既知脆弱性の patch gap、finding volume、SAST / AI-assisted review、SLSA、memory-safe language などが整理されている。

今回の CISO ガイドの主題は内部リスクである。多くの組織で最もあり得る threat vector は、不十分に管理された personal agent が複数システムを接続し、データ漏えいを起こすことだと説明されている。もう一つは prompt injection だ。攻撃者が agent の読む content に指示を隠し、agent が利用者ではなく攻撃者の意図へ従う。

ここで重要なのは、prompt injection を単なる model robustness 問題に閉じないことだ。モデルは改善され、attack success rate は下がるかもしれない。しかしゼロではない。したがって、企業側は model layer の改善を待つだけでなく、untrusted content、action surface、identity、egress、observability を自社の control plane で扱う必要がある。

## 事実: 評価の4問は承認条件に変換できる

Anthropic は agentic use case を4問で評価している。第一に、どの untrusted content を ingest するか。外部メール、open web、third-party documents、public repositories など、攻撃者が書ける可能性のあるものはすべて該当する。ここで「何もない」なら agent-specific risk は低く、速く進められると述べている。

第二に、どの action を誰の behalf で取れるか。Read-only、read/write、tool calls、code execution、network egress はそれぞれ違う risk aperture を持つ。日本企業のレビューでは、この項目を verbs に分解すべきだ。search、read、draft、create、update、delete、send、execute、deploy、permission change、external upload は同じ承認にしないほうがよい。

第三に、misaligned な場合の blast radius である。Anthropic は scope と severity の掛け算として扱う。1ファイルだけなのか、whole org なのか。anomaly で済むのか、data exposure なのか、true incident なのか。これは従来の risk assessment と似ているが、agent speed を考えると containment time も加えたい。人間の insider incident は発見まで数十日かかることがあるが、agent では数分単位の検知が必要になる。

第四に、observability である。agent action と user action を区別できるか。SIEM に入るか。ここは単なるログ有無では足りない。operation id、session id、user id、agent id、tool name、input class、target system、parameters、result、duration、approval event、rollback event が相関できなければ、事故時に説明できない。

## Identity spectrumを日本企業の権限設計に落とす

記事では agent identity を spectrum として扱っている。一方の端は system service account である。単一目的、least privilege、人間 identity から切り離された account で、incident response agent、ticket triage agent、自動 code reviewer などが例になる。もう一方の端は human credential だ。Claude Cowork のように、キーボードの前にいる人間が責任を持ち、その人の認可したシステムで agent が動く。

問題は中間だ。agent が人間の delegated identity を持ち、人間が見ていないシステムで動くと、accountability が曖昧になる。日本企業では、この中間が最も起きやすい。なぜなら、SaaS 権限は多くの場合「人間が画面で操作する」前提で広めに設計されており、AI agent 専用の scoped identity がまだ用意されていないからだ。

したがって、最初の設計判断は「ユーザー権限をそのまま使うか、agent 専用 identity を作るか」である。個人の下書き支援や検索なら human credential でもよい場合がある。だが、定期実行、複数日作業、複数システム横断、他人への通知、チケット更新、レポート作成、デプロイ準備のような agent には、専用 identity、scoped token、期限付き credential、break-glass 手順を検討すべきだ。

この点は [Project Glasswing](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) の防御利用にもつながる。AI が脆弱性候補を大量に見つけるとき、その agent がどの repository、どの issue tracker、どの CI、どの secrets へ触れるかを identity 単位で制御しなければ、検知能力がそのまま新しい insider risk になる。

## Claude Cowork要件をvendor checklistにする

Anthropic は Claude Cowork を例に、汎用 agent environment が満たすべき control を挙げている。これは Claude 専用の読み物ではなく、vendor checklist として使える。

まず IdP 連携である。agent identity は既存の IdP で発行・失効され、既存 group を policy unit にするべきだ。Claude Cowork は SAML / OIDC sign-in と SCIM provisioning を使い、Enterprise plan では custom role で group ごとに capability を絞れる。

次に connector allowlist である。MCP や connector の有効化は、単なるアプリ連携ではなく data boundary の決定だ。管理者が org-wide で connector を許可し、利用者が個別に account を認可する二段階でも、管理者側の決定は「どのデータに到達できる agent を許可するか」を意味する。

Per-tool、per-action approval も欠かせない。connector 単位で許可すると粗すぎる。Gmail や Microsoft 365 なら read、draft、send、delete、permission change を分ける。GitHub なら issue read、PR comment、branch push、workflow dispatch、secret access を分ける。データベースなら select、insert、update、delete、DDL を分ける。怖い failure mode が「production database が消える」なら、delete verb を tool list から消すのが最も確実だ。

Sandboxed execution は credential 保護のためにある。agent loop の環境に盗まれて困る credential を持たせない。Claude Cowork の remote sessions では isolated temporary sandbox 上で agent loop が動き、connector authorization tokens は reverse proxy が注入するため sandbox に入らないと説明されている。この発想は、自社 agent 基盤でも重要だ。secret を environment variable として agent runtime に丸ごと渡す設計は避けたい。

Egress allowlisting は prompt injection 対策として強い。agent が読んだ content に汚染されても、外へ送る経路がなければ被害を抑えられる。ただし domain allowlist だけでは足りない。許可済み SaaS への upload、server-side fetch、webhook、API token scope、組織外 account への送信可否まで見る必要がある。

Telemetry は dashboard ではなく stream として考えるべきだ。Claude Cowork では OTLP endpoint を設定し、tool invocation、MCP server、parameters、success/failure、duration、user identity、session context を stream できると説明されている。日本企業の SOC では、これを SIEM、SOAR、DLP、UEBA、case management へどう流すかが論点になる。

最後に off switch である。組織全体、group、connector、write operation のどの粒度で止められるかを、事故前に確認する必要がある。重大事故時に「vendor support へ問い合わせ中」では遅い。AI agent の speed を考えると、停止ボタンは調達チェック項目である。

## 日本企業の承認表はrisk registerと接続する

日本企業では、AI 利用申請とリスク台帳が分離しがちだ。AI 推進チームは利用ケースを集め、セキュリティ部門は別のチェックリストを持ち、法務は契約条項を確認し、内部監査は後から証跡を求める。この構造では、agent の能力が変わる速度に追いつかない。

実務上は、CISO ガイドの4問を risk register の入力にするべきだ。ユースケースごとに、untrusted input、action verbs、identity model、blast radius、observability、control owner、residual risk、risk acceptor、review date を記録する。ISO 27001 や SOC 2 の既存 control と対応付け、AI 特有の差分を ISO 42001 や社内 AI 原則へ接続する。

承認フローでは、最初から全社共通の正解を作らないほうがよい。低リスク agent は fast lane にする。非信頼入力なし、read-only、専用 service account、1部署限定、SIEM stream あり、off switch ありなら、短いレビューで進める。一方、外部入力あり、write action あり、人間 credential で delegation、組織横断データ、ログ不十分なら、追加設計を求める。

## モデル更新時の再審査が必要になる

従来の SaaS 審査では、機能追加や権限追加が再審査条件だった。AI agent では、それに model intelligence の更新を加える必要がある。同じ prompt、同じ tool、同じ identity でも、モデルが強くなると、これまで発生しなかった行動が発生し得る。

Anthropic の incident response agent 事例はこの点を示している。agent はログ読み取り、Slack channel 作成、Google Doc draft という限定 surface で動いていたが、モデル更新後に、根本原因を見つけた後で別 agent へ修正を依頼しようとした。最終的には human review があり、境界は機能した。しかし、能力向上だけで行動パターンが変わることは、運用設計上の再審査条件になる。

日本企業は、モデル名、モデル世代、reasoning mode、tool use mode、agent harness、connector version、prompt template、policy version を台帳化したほうがよい。変更があったら、4問を再回答する。特に write action、外部入力、組織横断データ、長時間実行がある agent は、モデル更新を単なる性能改善として扱わない。

## 初期90日の導入手順

最初の30日は inventory に使う。現場が使いたい agentic use case を10から20件集め、4問で分類する。すぐ進める low-risk、条件付きで進める medium-risk、設計不足で止める high-risk に分ける。ここでは禁止判断よりも、承認される条件を明示することが重要だ。

次の30日は pilot を行う。対象は、非信頼入力が少ない、read-only または draft-only、対象部署が限定される、SIEM / OTel / audit log が取れるものにする。例として、社内規程 QA、security questionnaire draft、vendor notification triage、incident postmortem draft、repository read-only onboarding などがある。

最後の30日は expansion gate を作る。pilot のログから、誤操作、不要 tool call、利用者の承認疲れ、DLP hit、未承認 connector、外部送信未遂、review correction を見る。問題がなければ対象 group を増やす。問題があれば、model を変える前に、tool list、identity、egress、approval、prompt content retention を見直す。

## まとめ

Anthropic の CISO ガイドは、AI エージェント導入におけるセキュリティ部門の役割を、禁止係から bounded risk の設計者へ移す文書である。非信頼入力、action、blast radius、observability の4問は、そのまま日本企業の承認表にできる。

日本企業が取るべき方針は、ゼロリスクを待つことでも、全社一斉に agent を解禁することでもない。小さく許可し、identity と action を絞り、SIEM で見て、off switch を持ち、モデルや connector が変わったら再審査する。これにより、AI エージェントの速度を止めずに、事故時の説明責任と停止能力を確保できる。

## 出典

- [Zero risk isn't the job: a CISO's guide to agentic AI](https://claude.com/blog/ciso-guide-to-agentic-ai) - Claude by Anthropic, 2026-07-17
- [Preparing your security program for AI-accelerated offense](https://claude.com/blog/preparing-your-security-program-for-ai-accelerated-offense) - Claude by Anthropic, 2026-04-10
- [Security - Claude Code Docs](https://code.claude.com/docs/en/security) - Claude Code Docs, accessed 2026-07-19
