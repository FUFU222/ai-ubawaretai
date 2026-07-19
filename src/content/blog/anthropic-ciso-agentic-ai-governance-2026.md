---
title: 'Claude CISOガイド、AIエージェント承認の実務'
description: 'Claude CISOガイドを起点に、AIエージェントの非信頼入力、実行権限、blast radius、SIEM観測性を整理し、日本企業の承認条件と初期展開の決め方を具体化する記事。'
pubDate: '2026-07-19'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIガバナンス', 'セキュリティ', '情シス', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年7月17日**、Deputy CISO の Jason Clinton 氏による「Zero risk isn't the job: a CISO's guide to agentic AI」を公開した。主張は明確だ。CISO の仕事は AI エージェントをゼロリスクにすることではなく、リスクを見える形にし、管理できる範囲へ閉じ込めることである。

日本企業にとって、この論点はかなり実務的だ。AI エージェントは、チャット回答だけでなく、メール、Slack、GitHub、MCP、社内文書、ログ、コード、ブラウザ操作へ触れ始めている。以前の [Claude containment と権限境界](/blog/anthropic-claude-containment-agent-security-2026/) では実行環境と sandbox の話を扱った。今回の CISO ガイドは、その前段で「どの条件なら承認するのか」をセキュリティ部門がどう判断するかを示している。

さらに [Claude Compliance API と監査基盤](/blog/anthropic-claude-compliance-api-integrations-2026/) で見たように、AI 利用は既存の DLP、SIEM、監査ログへ接続されつつある。だがログが取れるだけでは承認条件にはならない。何を読み、何を書けて、失敗時の被害範囲がどこまでで、どのログで見えるのかを、利用開始前に決める必要がある。

## 事実: CISOの仕事はゼロリスクではない

Anthropic の記事は、セキュリティ責任者が AI エージェント案件を拒否し続けると shadow adoption が起きると指摘している。現場が未承認のエージェントを勝手に接続すれば、テレメトリも off switch もない。一方で、条件なしに承認すれば、最初の重大事故が AI プログラム全体を止める。

このため、同記事は bounded risk という考え方を置く。すべてのリスクを消すのではなく、受け入れ可能な範囲を定義し、意図的に引き受けられるリスクだけを許可する。日本企業の言葉に置き換えるなら、AI エージェント承認は「可否判定」ではなく「利用条件の設定」に近い。

ここで重要なのは、モデル性能の高低だけを見ないことだ。モデルが強くなるほど、同じ tool list でも、以前は思いつかなかった行動を取れる可能性がある。Anthropic は、自社の incident response agent が、モデル更新後に別のエージェントへコード修正を依頼しようとした事例を紹介している。これは危険な暴走というより、能力向上が既存の境界内で新しい行動を生むという教訓である。

## 事実: 4つの質問でリスクを読む

Anthropic の CISO ガイドは、agentic use case を評価するための4問を示している。第一に、そのエージェントはどんな非信頼入力を読むのか。外部メール、公開 Web、第三者文書、公開リポジトリなど、攻撃者が書ける可能性のある内容はすべて非信頼入力になる。

第二に、どんな action を誰の権限で実行できるのか。read-only と read/write は別物だ。tool call、code execution、network egress はそれぞれ開く穴が違う。人間の credential を使うのか、agent 専用 service account を使うのかでも責任分界が変わる。

第三に、misalignment や攻撃が起きた場合の blast radius はどこまでか。1ファイルの露出なのか、組織全体の顧客情報なのか。小さな迷惑なのか、監督官庁や顧客説明が必要な incident なのか。範囲と重大度を掛け合わせて見る必要がある。

第四に、どんな observability があるのか。agent の action と人間の action を区別できるか。SIEM に入るか。数分で検知できるか、数週間後にログを探すことになるか。ここは [Project Glasswing と脆弱性対応](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) のような防御側の処理能力にもつながる。AI が速く動くなら、検知と停止も人間の週次会議では遅い。

## 事実: Claude Coworkの統制要件

記事後半では Claude Cowork を例に、企業が見るべき統制が整理されている。Identity は既存の IdP から発行・失効されるべきで、Claude Cowork は SAML / OIDC sign-in と SCIM provisioning を使う。Enterprise plan では custom role で capability を group 単位に絞れる。

Connector allowlist も重要だ。管理者が組織全体で connector を有効化し、利用者が個別に account を認可する二段構えになる。つまり connector を有効にすることは、そのエージェントが到達できるデータ境界を決めることでもある。外部情報を読む agent に email 作成を許すなら、送信まで自動化しないなど、action ごとの制限が必要になる。

Claude Cowork では per-tool、per-action の制御、sandboxed execution、egress allowlist、OpenTelemetry による SIEM 連携、org-wide off switch も要件として挙げられている。特に OpenTelemetry では tool invocation、MCP server、parameters、成否、duration、user identity、session context を流せると説明されている。ただし prompt content が SIEM に入る場合、保持期間や個人情報レビューの設計が先に必要になる。

## 分析: 日本企業は承認条件を表にするべきだ

ここからは分析だ。

日本企業が AI エージェントを承認するとき、最初から大きな AI ガバナンス規程を作ろうとすると時間がかかる。現実的には、CISO ガイドの4問をそのまま社内レビュー表にするほうが早い。

列は、ユースケース、対象部署、入力データ、非信頼入力の有無、利用 identity、read/write action、削除や外部送信の有無、blast radius、SIEM / DLP / audit log、停止方法、初期対象人数、再評価条件でよい。これなら情シス、セキュリティ、法務、AI 推進、業務部門が同じ表を見られる。

特に日本企業では、AI 利用の承認が「ツール名」単位になりがちだ。Claude を許可する、ChatGPT を許可する、Copilot を許可する、という粒度では粗い。実務で必要なのは、Claude Cowork の M365 connector は read-only だけ許可する、GitHub connector は特定 group だけ許可する、外部 Web を読んだ結果から顧客メールを自動送信しない、という action 単位の条件である。

[Claude Cowork の M365 書き込み権限](/blog/anthropic-claude-cowork-web-mobile-m365-write-2026/) で整理したように、検索 AI と操作 AI は分けるべきだ。検索や要約は低リスクでも、メール送信、予定変更、ファイル更新、権限変更は別の承認線に置く必要がある。

## まず小さく許可し、広げる条件を決める

Anthropic は admin-paced rollout を基本姿勢としている。小さな group へ有効化し、telemetry を見て、それから拡大する考え方だ。日本企業でも、最初の判断は「全社展開するか」ではなく、「どの低リスク use case なら条件付きで始められるか」に置くべきだ。

たとえば、社内規程だけを読む FAQ agent、公開情報と社内テンプレートから下書きを作る agent、incident channel を作成して postmortem draft を作る agent は、条件を切りやすい。逆に、顧客データ、外部メール、契約書、production database、支払い、アカウント権限を同時に触る agent は、初期対象にしないほうがよい。

承認後も、再評価条件が必要になる。モデルが変わった、connector が増えた、write action を追加した、対象人数を増やした、外部入力を読むようになった、ログ項目が変わった。このどれかが起きたら、初回承認を使い回さず、4問を再回答する。

## まとめ

Claude CISO ガイドの価値は、AI エージェントを止めるための文書ではなく、条件付きで進めるための文書である点にある。ゼロリスクを待てば現場は非公式に進む。条件なしに許可すれば事故が起きる。だから、非信頼入力、実行権限、blast radius、観測性を先に表にし、管理できる範囲だけを承認する。

日本企業は、AI エージェント導入を「ツール利用申請」から「操作権限の設計」へ移すべきだ。まず小さなユースケースを選び、read/write、identity、connector、SIEM、off switch を確認し、ログを見ながら広げる。CISO、情シス、AI 推進、業務部門が同じレビュー表を持てるかどうかが、今後の AI エージェント展開の速度と安全性を決める。

## 出典

- [Zero risk isn't the job: a CISO's guide to agentic AI](https://claude.com/blog/ciso-guide-to-agentic-ai) - Claude by Anthropic, 2026-07-17
- [Preparing your security program for AI-accelerated offense](https://claude.com/blog/preparing-your-security-program-for-ai-accelerated-offense) - Claude by Anthropic, 2026-04-10
- [Security - Claude Code Docs](https://code.claude.com/docs/en/security) - Claude Code Docs, accessed 2026-07-19
