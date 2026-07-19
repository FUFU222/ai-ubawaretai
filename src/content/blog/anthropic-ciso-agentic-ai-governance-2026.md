---
title: 'Claude CISOガイド、agentic AI承認の実務'
description: 'Claude CISOガイドをもとに、agentic AI承認を非信頼入力、実行権限、blast radius、SIEM観測性で判断し、日本企業の小規模展開、監査設計、停止条件へ落とす。'
pubDate: '2026-07-19'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIエージェント', 'AIガバナンス', '監査ログ', '企業導入', 'セキュリティ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年7月17日**、Deputy CISO の Jason Clinton 氏による **agentic AI 向け CISO ガイド**を公開した。主張は分かりやすい。CISO の仕事は、AI エージェントのリスクをゼロにすることではない。リスクを見える形にし、被害範囲を固定し、事業が勝手に迂回しない条件で許可することだ。

これは日本企業にとって実務的な記事である。生成 AI の導入審査では「使ってよいか、使ってはいけないか」の二択になりやすい。しかし、部門がすでに個人契約や未承認ツールで agentic AI を試しているなら、全面禁止は shadow adoption を増やすだけになる。必要なのは、どの入力を読むのか、どの操作をできるのか、失敗時の blast radius はどこまでか、SIEM で追えるのかを見て、限定展開する判断基準である。

このサイトでは、すでに [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で実行境界、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で監査ログ連携、[Project Glasswing初報](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) でAIが脆弱性対応を加速する現実を整理した。今回の CISO ガイドは、それらを「新しいエージェント案件をどう承認するか」という管理プロセスにまとめる材料として読むべきだ。

## 事実: Anthropicは4つの質問でagentic AIを評価する

Anthropic の記事は、agentic AI の内部リスクを評価する入口として 4 つの質問を示している。

1つ目は、エージェントがどの非信頼コンテンツを読むかである。外部メール、Web、第三者文書、公開リポジトリ、顧客から来たファイルなど、攻撃者が書いたり改変したりできるものは非信頼入力になる。ここを読まないなら、agent-specific risk は低く、早く進めやすい。

2つ目は、何を、誰の権限で実行できるかである。read-only と read/write は別物だ。tool call、code execution、network egress はそれぞれ行動面を広げる。さらに、その操作が本人の資格情報で行われるのか、service account で行われるのか、agent 専用の scoped identity なのかを分ける必要がある。

3つ目は、意図から外れた場合の blast radius である。1ファイルの漏えいで済むのか、組織全体の顧客データへ届くのか。軽い誤操作なのか、インシデント扱いなのか。AI エージェントの承認では、モデル精度だけでなく、失敗時にどこまで壊れるかを先に数える。

4つ目は、観測性である。agent action と user action を区別できるか。ログは SIEM に入るか。異常を数分で見られるのか、数週間後にしか分からないのか。Anthropic は、agent speed の世界では従来の insider risk response より速い検知と封じ込めが必要だと説明している。

## 事実: Claude Coworkの統制要件はかなり具体的

記事では Claude Cowork を例に、企業が agent environment に求めるべき統制を具体化している。ID は既存 IdP から発行し、SAML/OIDC と SCIM で利用者とグループを管理する。connector allowlist で agent が届くデータ境界を決める。さらに connector 単位だけでなく、action 単位で read、draft、send、delete のような verbs を制御する。

実行環境も重要だ。Claude Cowork の remote session では、agent loop は Anthropic 管理の隔離された一時 sandbox で動き、connector token は sandbox に入らない。connector call は reverse proxy 経由で実行されるため、sandbox から盗める credential を減らす設計になる。これは [Claude CoworkとM365書き込み権限](/blog/anthropic-claude-cowork-web-mobile-m365-write-2026/) で見た「書けるAI」の統制論点ともつながる。

egress allowlist も中心的な統制として扱われている。agent が prompt injection を受けても、外向き通信が管理者の選んだ宛先だけに制限されていれば、攻撃者が自由な場所へデータを送る経路は狭まる。ただし、allowlist は単なるドメイン表ではない。どのアカウントへ、どの credential で、どの operation ができるかまで見ないと、許可済み API 経由の漏えいを見落とす。

観測性では、Claude Cowork が OpenTelemetry 経由で tool invocation、MCP server、parameters、成否、duration、user identity、session context を送れると説明されている。Anthropic は、Cowork activity が Compliance API や formal audit logs に現時点では入らず、OTel stream が native monitoring path だとも明記している。この差は日本企業の監査レビューで重要になる。

## 分析: 日本企業は「承認条件」を先に書くべき

ここからは分析だ。

日本企業の AI 導入審査では、禁止リストと利用ガイドラインだけが先行しやすい。しかし agentic AI では、それだけでは足りない。AI がメールを読み、Slack に投稿し、Google Doc を下書きし、GitHub の PR を作り、社内 wiki や CRM を横断するなら、「何をしてよいか」を操作単位で決めなければならない。

まず、社内の agentic use case を 4 問で棚卸しするべきだ。営業メール作成なら外部 Web を読むか、CRM を読むか、送信までできるか、下書き止まりか。開発エージェントなら repository、issue、CI、secret、production log へ届くか。経理や法務なら、契約書、顧客名、支払情報、個人情報を読むか。用途名だけではなく、入力、操作、権限、ログで表にする。

次に、最小 agency を決める。Anthropic の表現を日本企業向けに言い換えるなら、「便利なAIに全部任せる」のではなく、「業務を完了する最小の行動能力だけを渡す」ことである。メールは draft まで、外部送信は人間確認。ドキュメントは新規作成まで、既存契約の上書きは不可。GitHub は PR 作成まで、merge は不可。こうした条件なら、CISO と事業部門が同じ言葉でリスクを話せる。

さらに、admin-paced rollout を標準にしたい。最初から全社展開するのではなく、少人数で有効化し、OTel、SIEM、DLP、proxy log、helpdesk 問い合わせを見てから対象を広げる。これは遅い承認ではない。むしろ、禁止による shadow adoption を避け、公式ルートで早く学ぶための設計である。

## CISOとAI推進が同じ表を見る

このガイドの価値は、CISO だけの話で終わらない点にある。AI 推進、情シス、法務、内部監査、事業責任者が同じ表で判断できる。特に日本企業では、AI 推進チームが導入を急ぎ、セキュリティ部門が止める構図になりやすい。4 問フレームは、その対立を「どの条件なら進められるか」に変える。

たとえば、ある部門が「社内問い合わせ agent を入れたい」と言ったとする。従来なら、情報漏えいが怖い、回答品質が不安、ログが取れない、という抽象論で止まりやすい。4 問に落とすと、読むのは社内 FAQ と公開ドキュメントだけか、従業員の個人情報も読むのか。回答は draft だけか、チケットを自動更新するのか。誤回答時の影響は問い合わせ 1 件か、全社員への通知か。ログは SIEM に入るか。判断が具体化する。

また、agent identity の設計も避けられない。人間の credential をそのまま継承する personal agent は説明責任が分かりやすい一方、ユーザーが見ていない場所で長く動くと責任が曖昧になる。逆に service account agent は用途を絞りやすいが、権限棚卸しと所有者管理が必要になる。日本企業では、退職者、異動者、委託先、共同利用アカウントが混ざりやすいため、agent 専用 identity をどう発行し、誰が revoke するかを先に決めたい。

## まとめ

Anthropic の CISO ガイドは、agentic AI を止めるための記事ではない。ゼロリスクを待つのではなく、非信頼入力、行動権限、blast radius、観測性をそろえ、受け入れられる範囲で小さく許可するための記事である。

日本企業が今やるべきことは、最新モデルの比較より先に、社内 agentic AI 承認表を作ることだ。各ユースケースについて、読むデータ、できる操作、使う identity、失敗時の範囲、SIEM/DLP/OTel 連携、緊急停止方法を書く。そこまで決めれば、AI 推進とセキュリティは「使うか禁止か」ではなく「どの条件で進めるか」を話せる。

AI エージェントは、今後さらに賢くなり、複数 tool をまたぎ、長時間の作業を担う。だからこそ、モデルの現在の限界に合わせて統制を作るのではなく、半年後に能力が上がっても壊れない境界を置く必要がある。承認は一度の押印ではなく、小さく許可し、観測し、広げる運用へ変えるべきだ。

## 出典

- [Zero risk isn't the job: a CISO's guide to agentic AI](https://claude.com/blog/ciso-guide-to-agentic-ai) - Anthropic, 2026-07-17
- [Preparing your security program for AI-accelerated offense](https://claude.com/blog/preparing-your-security-program-for-ai-accelerated-offense) - Anthropic, 2026-04-10
- [Security - Claude Code Docs](https://code.claude.com/docs/en/security) - Anthropic Docs
