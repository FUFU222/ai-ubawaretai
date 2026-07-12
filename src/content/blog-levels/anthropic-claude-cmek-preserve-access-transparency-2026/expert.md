---
article: 'anthropic-claude-cmek-preserve-access-transparency-2026'
level: 'expert'
---

Anthropic の 2026年7月10日 API release notes は、Claude Platform の Access Transparency documentation における CMEK content preservation の説明拡張である。headline としては小さい。しかし企業の AI governance / privacy engineering / security operations では、この更新は Claude Platform の retained data、human access、automated safety pipeline、customer-managed encryption key、Compliance API Activity Feed、cloud KMS audit log を同じ証跡設計に載せるための重要な材料になる。

先に範囲を切る。今回の話は「Claude 全体の透明性ログ」ではない。Access Transparency docs が対象にしている covered content は、Claude Messages API または Claude Code sessions を通じて送られる prompt / response content であり、ZDR がカバーする API / feature と整合する。一方、claude.ai Enterprise seats、Claude for Work、Cowork、Claude in Chrome、consumer plans、partner-operated platforms、ZDR 対象外 product は対象外として列挙されている。この境界を曖昧にしたまま SIEM 連携だけを語ると、監査で破綻する。

この更新は、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) の延長にある。Compliance API で organization activity を取れるだけでは、Anthropic personnel の covered content access や CMEK content preservation の説明は足りない。[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) が execution boundary の話だったとすれば、今回は retention / access / key boundary の話である。さらに [Claude CodeのOpenTelemetry監査設計](/blog/claude-code-otel-agents-mcp-security-2026/) で扱った local agent telemetry と合わせると、enterprise AI の証跡は product event、provider access event、customer KMS event の3系統で設計する必要がある。

## 事実: release notesが追加したのはcmek_preserveの説明である

2026年7月10日の API release notes は、Access Transparency documentation における `cmek_preserve` event の説明拡張を記録している。追加内容は、filter example、example event payload、2つの preservation reason code である。reason code は `policy_violation_investigation` と `csae_report` だ。あわせて、preservation event は human reviewer が開始した場合だけでなく automated safety pipeline が開始した場合にも書かれると明確化された。

この記述を過大に読んではいけない。新しい API endpoint が増えたというより、既存の Access Transparency / Compliance API Activity Feed に流れる event semantics が読みやすくなった、という性質が強い。だが security operations では event semantics の明確化は大きい。`anthropic_access` と `cmek_preserve` を同じ severity で扱うか、別 queue に分けるか、legal / privacy escalation をどこで挟むかが変わるからだ。

`anthropic_access` は、Anthropic employee による covered content の manual view を記録する。Access Transparency docs は、human access が published reason code の下でのみ発生し、covered content へ到達できる internal tooling が view event を emit する設計を説明している。一方で automated processing、つまり model serving、safety classifiers、abuse-detection pipelines は通常の `anthropic_access` event を生成しない。例外として、automated processing が preservation を開始する場合に `cmek_preserve` が書かれる。

したがって監査クエリでは、human access と preservation を別概念として扱うべきだ。前者は「誰が内容を閲覧したか」の説明に近く、後者は「なぜ削除・鍵失効の通常線から外れて保全されたか」の説明に近い。この差を incident response tabletop で先に確認しておくと、実インシデント時の混乱を減らせる。

## 事実: Access Transparencyは対象外が多い

Access Transparency は eligible customers on request の機能であり、self-serve ではない。organization level で有効化され、per-workspace enrollment は現時点で利用できないと説明されている。event は既存の Compliance API Activity Feed に出るため、既存の Compliance Access Key、export、SIEM integration の延長で扱える。

対象範囲は、Claude Messages API と Claude Code sessions の covered content である。これは API / code agent platform を使う企業には意味がある。一方で、Claude Enterprise の seat や Claude Apps 側の活動は、Access Transparency docs の対象外として明示されている。partner-operated platforms も対象外で、Amazon Bedrock や Google Cloud の透明性 controls を参照する扱いだ。

日本企業では、この対象外リストが実務上の主論点になる。たとえば社内開発チームは Claude Code を使い、プロダクトは Claude Messages API を使い、基幹系の一部は Bedrock で Claude を呼び、バックオフィスは Claude Enterprise を使う、という構成は十分にあり得る。この場合、`anthropic_access` event の有無は利用者体験の違いではなく、契約面、実行面、data retention 面の違いとして説明する必要がある。

[Claude Platform on AWS](/blog/anthropic-claude-platform-aws-2026-04-22/) で見たように、Claude の導入経路は Anthropic 直契約だけではない。AWS や Google Cloud の control plane に寄せた導入では、provider 側の access transparency / audit log / KMS log へ責任が分かれる。CISO や内部監査に提示する資料では、「Claude」と書くのではなく、「Claude Messages API direct」「Claude Code session direct」「Bedrock Claude」「Vertex / Google Cloud Claude」「claude.ai Enterprise」のように control plane 単位で列を分けるべきだ。

## 事実: CMEKはworkspace / organizationの暗号化運用である

CMEK docs は、顧客が AWS KMS、Google Cloud KMS、Azure Key Vault に key を provision し、Anthropic がその key を使って certain workspace data at rest を暗号化する仕組みとして説明している。顧客は key の rotation、audit、revocation を管理し、Anthropic が key に対して行う operation は cloud provider audit logs に記録される。CMEK は opt-in で、eligible organizations は account team 経由で activation する。

構成単位も重要だ。Claude Platform では CMEK は workspace scope で、Admin API により設定される。Claude Enterprise では organization scope で、claude.ai の organization settings から設定される。いずれも key enablement 後に書かれた data を保護する。既存の chats、files、sessions は Anthropic-managed keys のままで、顧客鍵に再暗号化されない。

地域制約も監査上重要だ。CMEK は現時点で US regions のみ利用可能で、encryption operations も US regions で処理される。multi-region keys と EU key residency は未対応と説明されている。日本企業がデータ所在地や越境移転の説明を求められる場合、CMEK を「顧客鍵管理」として評価することはできても、「国内または EU resident encryption」として説明することはできない可能性が高い。

また、CMEK は operational risk を持つ。docs は enabling CMEK が permanent で irreversible data loss を起こし得ると警告している。security team はしばしば key revocation を強い統制として評価するが、AI platform では revocation が business continuity incident になることもある。鍵の所有者、break-glass、rollback 不可の説明、support escalation、customer notification を設計しないまま production workspace に入れるべきではない。

## 分析: 証跡設計は4つのledgerに分ける

ここからは分析である。Claude Platform を日本企業の本番基盤に入れるなら、証跡は4つの ledger に分けるのが現実的だ。

1つ目は product activity ledger である。member / workspace / API key / file / admin configuration / model request metadata / compliance activity など、Claude Platform 内の活動を記録する。これは Compliance API と管理画面、場合によっては SIEM connector が中心になる。

2つ目は provider access ledger である。Anthropic personnel が covered content を human view した場合の `anthropic_access` を扱う。これは通常の user activity とは違い、provider-side access transparency として監査する。support access、safety review、incident response の reason code と合わせて見るべきだ。

3つ目は preservation ledger である。`cmek_preserve` はここに入る。これは human view と同義ではなく、content が policy violation investigation や CSAE report などの reason により保全された記録として扱う。automated safety pipeline による開始もあり得るため、人間閲覧イベントと誤って結合してはいけない。

4つ目は key operation ledger である。CMEK の wrapping / unwrapping / key validation / key policy change / rotation / disable / revoke は cloud provider 側の audit log に現れる。Anthropic の Compliance API だけを見ても、KMS の実運用は見えない。cloud security team と AI platform team の両方が owner になる。

この4 ledger を incident timeline で合成できるかが実務の勝負になる。たとえば特定の Claude Code session で顧客コードを含む prompt が送られ、後に safety pipeline が content preservation を開始し、Anthropic personnel が support reason で view し、同時期に cloud KMS key policy が変更されたとする。この時、4つの ledger が同じ request / workspace / time window / reason code でつながらなければ、監査報告は手作業の推測になる。

## SIEMではevent typeごとにseverityを分ける

実装上は、Access Transparency event を SIEM に入れるだけでは足りない。`anthropic_access`、`cmek_preserve`、CMEK admin configuration、KMS decrypt / unwrap、KMS key disable、workspace membership change は、それぞれ response owner が違う。

`anthropic_access` は privacy / vendor management / security operations の triage に回す。確認すべき点は reason code、workspace、covered content の種類、対象 customer / project、契約上の通知義務である。support access のように正常なものもあるため、event 発生だけで critical alert にするより、sensitive workspace や incident window と相関させるほうがよい。

`cmek_preserve` は legal / trust and safety / privacy に近い。policy violation investigation や CSAE report は、通常の技術運用だけで完結させるべきではない。日本企業では、委託先管理、個人情報保護、青少年保護、顧客契約、内部規程が絡む。event を DLP queue に流すだけでは、法務判断が遅れる。

KMS key operation は cloud security / platform operations に近い。key disable や revoke は、データ保護上は強い操作だが、Claude workspace の業務継続性を壊す。単独承認ではなく、security incident commander、service owner、legal owner の multi-party approval を求める設計が望ましい。

## 日本企業向けのcontrol mapping

日本企業が導入前に作るべき mapping は、ISO / SOC2 / ISMAP 風の control list ではなく、実際の evidence source を含む表である。まず data category を定義する。公開情報、社内資料、顧客資料、個人情報、要配慮情報、ソースコード、認証情報、インシデント資料を分ける。Messages API / Claude Code に送ってよいものと、送ってはいけないものを決める。Access Transparency が対象だからといって、すべての data category を許可してよいわけではない。

次に product surface を分ける。Claude Messages API、Claude Code direct、Claude Enterprise、Claude for Work、Cowork、Chrome、Bedrock、Google Cloud、Files API、Batch API を列にする。それぞれ ZDR、Access Transparency、CMEK、Compliance API、cloud KMS log、provider transparency control が使えるかを埋める。空欄がある product surface は、本番データを入れる前に代替 control を決める。

3つ目は retention / preservation policy である。通常の retention、ZDR、customer deletion、legal hold、safety preservation、CSAE report、policy violation investigation を同じ policy 文書に置く。`cmek_preserve` event が出た場合、削除要求や key revocation request とどう整合するかを決めておく。

4つ目は vendor access procedure である。Anthropic personnel の human access event を受け取ったとき、support ticket、contract term、workspace owner、security incident、customer impact を照合する。必要なら account representative に問い合わせる。日本企業では vendor access review を quarterly にまとめるだけでなく、high sensitivity workspace では near-real-time review にしたほうがよい。

5つ目は key management runbook である。key rotation cadence、cloud provider audit log retention、KMS key policy drift detection、Anthropic public IP allowlist、break-glass、revocation approval、post-revocation recovery impossibility を明文化する。CMEK は cloud security の持ち物に見えるが、AI platform owner と application owner なしには運用できない。

## 導入順序

最初から全 workspace に CMEK と Access Transparency を広げる必要はない。むしろ、対象 workspace を1つ選び、evidence flow を検証するのがよい。Claude Code session で non-sensitive test prompt を送り、Compliance API Activity Feed、Access Transparency event の mock / sample handling、KMS audit log、SIEM correlation、alert routing を確認する。

次に、sensitive data を扱う前に negative test を行う。対象外 product surface、たとえば Bedrock 経由や Files API などで同じ透明性 event が出ると誤解していないかを確認する。監査で危険なのは、ログがないことそのものより、ログがあると思い込んでいることだ。

その後、workspace classification を入れる。high sensitivity workspace では Access Transparency event を privacy team に即時通知し、medium sensitivity では日次 review、low sensitivity では週次 review にする。CMEK key operation も、key disable / revoke だけは critical、unwrap operation は aggregate monitoring というように分ける。

最後に user-facing policy を更新する。開発者や業務部門には「Claude は監査されます」とだけ言っても意味がない。どの product surface が対象か、Anthropic の human access がどの条件で記録されるか、automated safety processing と human view は違うこと、CMEK は有効化後の data が対象であることを短く説明する。これは利用者の納得だけでなく、顧客への説明にも効く。

## まとめ

2026年7月10日の Anthropic 更新は、Claude Platform の governance surface を一段具体化した。`cmek_preserve` の filter、payload、reason code、automated safety pipeline 起点の preservation event 明確化により、Access Transparency は単なる provider access log ではなく、CMEK と safety preservation を含む証跡設計の部品になった。

日本企業が見るべき論点は、機能の有無ではない。対象 product surface、human access と preservation の違い、ZDR との整合、CMEK の有効化後データ限定、US region 前提、cloud KMS audit log、SIEM severity、legal escalation を一枚の運用設計に落とせるかである。Claude を開発基盤や業務基盤へ入れるほど、この地味な制御面が導入可否を左右する。

## 出典

- [API release notes](https://docs.anthropic.com/en/release-notes/api) - Anthropic Docs, 2026-07-10
- [Access Transparency](https://docs.anthropic.com/en/manage-claude/access-transparency) - Anthropic Docs
- [Customer-managed encryption keys](https://docs.anthropic.com/en/manage-claude/cmek) - Anthropic Docs
