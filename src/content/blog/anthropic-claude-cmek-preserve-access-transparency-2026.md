---
title: 'Claude Access Transparency、CMEK保全の実務'
description: 'Claude Access TransparencyとCMEK保存の更新を、監査ログ、保全理由、鍵管理、SIEM連携に分け、日本企業のPlatform導入判断と内部監査対応に落とし込む。'
pubDate: '2026-07-11'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIガバナンス', '監査ログ', '企業導入', 'セキュリティ']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は **2026年7月10日**、Claude API release notes で Access Transparency の CMEK content preservation に関する説明を拡張した。追加されたのは、`cmek_preserve` event の filter 例、event payload 例、`policy_violation_investigation` と `csae_report` という preservation reason code、そして preservation event が人間の reviewer だけでなく automated safety pipeline によって開始された場合にも書かれるという明確化である。

これは新しい派手なモデル機能ではない。しかし日本企業の Claude Platform 導入ではかなり重要だ。[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で扱った「AI利用を既存の監査基盤へ流す」流れが、今回は Anthropic 側の人間アクセスと、顧客管理鍵で守られた内容の保全記録まで踏み込んできたからだ。さらに [Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で見た実行境界の議論ともつながる。AI を業務基盤に入れるほど、誰が内容を見たのか、なぜ保持されたのか、鍵を止めたら何が失われるのかを説明できなければならない。

## 事実: 7月10日の更新で何が増えたか

Anthropic の API release notes は、2026年7月10日の更新として Access Transparency documentation の `cmek_preserve` event 説明を拡張したと記載している。具体的には、filter example、example event payload、2つの preservation reason code が追加された。reason code は policy violation investigation と CSAE report に対応する。

もう一つ重要なのは、preservation event の発生条件の明確化だ。Access Transparency docs は、人間による covered content の閲覧で `anthropic_access` activity が記録される一方、automated processing は通常の `anthropic_access` event を出さないと説明している。ただし CMEK content preservation では、automated safety pipeline が preservation を開始した場合にも `cmek_preserve` event が書かれる。つまり「人が見たログ」と「保全されたログ」は別物として読む必要がある。

この違いは監査報告で混同しやすい。`anthropic_access` は Anthropic 側の人間アクセスの可視化であり、`cmek_preserve` は顧客管理鍵で暗号化された content を、特定の safety / incident response 文脈で保全した記録である。日本企業が SIEM や監査台帳へ流すなら、同じ Access Transparency 関連イベントでも、アラートの重み、確認担当、保存期間、法務エスカレーションを分けたほうがよい。

## 事実: Access Transparencyの対象は限定される

Access Transparency docs は、eligible customer が request して有効化する機能として説明している。self-serve ではなく、契約条件や Anthropic account representative 経由で eligibility を確認する扱いだ。有効化されると、Anthropic employee が covered content を human view した場合、Compliance API Activity Feed に activity が残る。既存の Compliance API credential、audit、export、SIEM integration はそのまま使える。

対象範囲も明記されている。covered content は Claude Messages API または Claude Code sessions を通じて送られた prompt / response content で、Access Transparency の対象は ZDR がカバーする API や feature と揃う。一方で、claude.ai Enterprise seats、Claude for Work、Cowork、Claude in Chrome、Claude consumer products、Amazon Bedrock や Google Cloud など partner-operated platforms、Files API や Batch API など ZDR 対象外のものは Access Transparency の対象外として説明されている。

ここは日本企業では特に注意したい。NEC や大手 SI のように Claude Code、Claude Platform、Claude Enterprise、Bedrock、Google Cloud 経由の利用が混在すると、同じ「Claude利用」でも透明性ログの出る場所が分かれる。[Claude Platform on AWS](/blog/anthropic-claude-platform-aws-2026-04-22/) のような調達・実行経路も含め、どの契約面のどのログを誰が見るのかを先に表にしておく必要がある。

## 事実: CMEKは鍵を持つだけでは終わらない

CMEK docs は、customer-managed encryption key により、顧客が AWS KMS、Google Cloud KMS、Azure Key Vault に用意した key を使って Anthropic が一部の workspace data at rest を暗号化できると説明している。顧客は key の rotation、audit、revocation を管理し、Anthropic が key に対して行う operation は cloud provider 側の audit logs に残る。

ただし、CMEK は導入すれば全データがすぐ顧客鍵で守られるという機能ではない。Claude Platform では workspace 単位で Admin API により構成され、Claude Enterprise では organization 単位で構成される。CMEK は key 有効化後に書かれた data を保護し、過去の chats、files、sessions は顧客鍵で再暗号化されない。また現在は US regions のみで、multi-region keys や EU key residency はサポートされていないと説明されている。

日本企業がここを読み違えると、監査上の前提が崩れる。たとえば「CMEK を有効化したから既存の全会話も顧客鍵管理下に入った」と説明してしまうと、実態と合わない。金融、医療、公共、製造のようにデータ所在や鍵管理の説明責任が重い領域では、導入日以降のデータ、導入前データ、US region 前提、provider audit log、Compliance API log を分けて証跡設計するべきだ。

## 分析: 日本企業は監査ログを3層に分ける

今回の更新を実務に落とすなら、まずログを3層に分けると分かりやすい。1つ目は Claude Platform の通常活動ログで、workspace、API key、file、member、admin action などの運用イベントを扱う。2つ目は Access Transparency の human access record で、Anthropic personnel が covered content を閲覧したかを扱う。3つ目は CMEK / cloud provider 側の key operation log で、wrapping、unwrapping、revocation、key policy change を扱う。

この3層は保存場所も owner も違う。Compliance API から SIEM に入るもの、cloud provider audit log に残るもの、Anthropic account team との契約・eligibility に依存するものがある。監査ログという名前で一括管理すると、事故時に「どこを見ればよいか」が曖昧になる。日本企業では、情シス、セキュリティ、法務、内部監査、クラウド基盤チームの責任を分けた runbook が必要になる。

[Claude CodeのOpenTelemetry監査設計](/blog/claude-code-otel-agents-mcp-security-2026/) と合わせて考えると、AI 監査は model request の metadata だけでは足りない。AI に何を送ったか、誰が管理操作をしたか、Anthropic 側の人間アクセスがあったか、顧客鍵で守った content がなぜ保全されたか、cloud KMS で key がどう使われたかまで、別々の証跡を同じ incident timeline に並べられる必要がある。

## CMEK preservationは削除運用の例外として扱う

CMEK の価値は、顧客が鍵を止められることにある。これはデータ主権や暗号鍵管理の説明に効く。一方で、Access Transparency docs が `cmek_preserve` を明示したことで、鍵を顧客が持っていても safety review や incident response の文脈で content preservation が起きる場合があることを、導入前に説明しておく必要が出てきた。

これは「Anthropic が自由に見られる」という話ではない。Access Transparency docs は reason code と event record を通じて、human access と preservation を可視化する設計を示している。だが、削除、保全、証跡、法的対応、CSAE 報告、policy violation investigation が絡む場面では、通常のデータ削除 SLA だけでは説明が足りない。

日本企業では、個人情報保護、委託先管理、内部通報、セキュリティインシデント、未成年保護、顧客契約上の削除要求が同時に絡む可能性がある。`cmek_preserve` event が出た場合、誰が確認し、どの契約条項を参照し、顧客や監査部門へいつ報告するのかを決めておくべきだ。通常の DLP alert と同じ queue に入れるだけでは、法務判断が遅れやすい。

## 導入前に確認する5項目

1つ目は対象製品だ。Messages API、Claude Code sessions、Claude Enterprise apps、Bedrock、Google Cloud、Files API、Batch API を同じ表に並べ、Access Transparency と CMEK の対象かを確認する。対象外の利用経路があるなら、代替ログを別に用意する。

2つ目は key lifecycle だ。key 作成、rotation、disable、revocation、policy change、break-glass access を誰が承認するかを決める。CMEK は強い統制だが、鍵を誤って止めると不可逆なデータ損失につながる可能性がある。運用担当が少人数の場合、休日や障害時の承認線も必要だ。

3つ目は地域要件だ。CMEK が US regions 前提で、multi-region keys や EU key residency がないなら、日本企業のデータ所在地説明にどう影響するかを確認する。国内保存を要件にしている案件では、CMEK だけでは十分な回答にならない可能性がある。

4つ目は SIEM 連携だ。Compliance API Activity Feed と cloud provider audit log を同じ dashboard に寄せるだけでなく、event type ごとの severity を分ける。`anthropic_access`、`cmek_preserve`、admin config、KMS decrypt / unwrap は、それぞれ見るべき担当が違う。

5つ目は教育と説明文だ。利用者向けには「Anthropic が内容を見ることがある」だけでは粗すぎる。対象 API、対象外 product、human access reason、automated processing、CMEK preservation、cloud KMS logs を短い FAQ にし、顧客や社内監査に同じ言葉で説明できる状態にする。

## まとめ

Claude Access Transparency と CMEK preservation の更新は、AI ガバナンスの地味な部品に見える。しかし日本企業が Claude Platform を本番利用するなら、かなり実務的な意味を持つ。AI の利用ログだけでなく、Anthropic 側の人間アクセス、automated safety pipeline による preservation、顧客管理鍵の operation、対象外 product の境界を説明できるようになるからだ。

大事なのは、CMEK を「鍵を持てる機能」、Access Transparency を「透明性が上がる機能」で終わらせないことだ。どの content が対象か、どの event がどこに出るか、どの event が human access でどの event が preservation か、鍵を止めたときに何が起きるかを、導入前の runbook に落とす必要がある。日本企業の Claude 導入は、ここまで設計できて初めて監査に耐えやすくなる。

## 出典

- [API release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-07-10
- [Access Transparency](https://docs.anthropic.com/en/manage-claude/access-transparency) - Anthropic Docs
- [Customer-managed encryption keys](https://docs.anthropic.com/en/manage-claude/cmek) - Anthropic Docs
