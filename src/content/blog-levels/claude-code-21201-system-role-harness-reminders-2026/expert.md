---
article: 'claude-code-21201-system-role-harness-reminders-2026'
level: 'expert'
---

Claude Code 2.1.201は、Sonnet 5 sessionのharness reminderにmid-conversation `system` roleを使わなくする変更である。release noteは一文だけで、原因、変更後のrequest schema、対象provider、reminder contentは開示していない。

専門的な評価で重要なのは、この空白を推測で埋めないことだ。公開仕様から確認できるのは、mid-conversation system messageの優先順位、配置制約、model/provider availabilityと、Claude Codeが観測できるrequest metadataである。これらを使い、旧版と新版の差を自社環境で測る。

前提となるSonnet 5のmodel identifier、effort、tokenizer、価格移行は[Claude Sonnet 5の料金とAPI移行](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)で整理した。今回の検証ではmodel条件を固定し、client-side harnessだけを比較対象にする。

## 公開仕様から作れる最小の仮説

Anthropicのmid-conversation system message docsでは、top-level `system` fieldと `messages` 配列中の `{"role":"system"}` が区別されている。

top-level `system`は会話全体へ適用する安定したinstructionで、prompt prefixの先頭近くに置かれる。会話途中でこれを書き換えると、byte-identicalであることを前提にしたprompt cacheがその地点からmissしやすい。mid-conversation system messageは、既存履歴を変更せず、新しいoperator-level instructionを末尾側へ追加するための仕組みだ。

公式docsが示す主な用途は、途中から追加するpolicy、deadline、tool availability、token budget、利用者の追加入力、mode switchなどである。普通の `user` messageより強いoperator-level instructionとして扱われ、競合時にはsystem instructionが優先される。

一方、利用条件は狭い。2026年7月5日時点ではClaude Opus 4.8のみが対象で、Claude API、Claude Platform on AWS、Microsoft Foundryで利用できる。Amazon BedrockとGoogle Cloudは対象外だ。message placementにも制約があり、`tool_use` と対応する `tool_result` の間には挿入できない。

2.1.201は、Sonnet 5 sessionではこのroleをharness reminderに使わなくした。この組み合わせから、「clientがmodel/provider capabilityに合わせてmessage構造を変えた」という仮説は立てられる。しかし、release noteはcompatibility bug、400 error、cache、securityを理由として挙げていない。したがって、これらは検証項目にはできても、変更理由として記事や社内告知へ断定的に書くべきではない。

## harness reminderを監査対象にする際の境界

release note中のharness reminderは、Claude Code runtimeがagent loopを維持するために挿入する内部contextと解釈できる。ただし、Anthropicはそのcontent schemaを公開契約として定義していない。監査実装が特定文言や挿入位置へ依存すると、patch releaseで壊れる。

監査対象は次の3層へ分ける。

1. **公開された入力**: 利用者prompt、設定したsystem prompt、tool policy
2. **公開された結果**: tool call、tool result、status、request ID、token、stop reason
3. **内部harness context**: runtimeがmodelへ渡す補助instruction

企業が強い保証を置くべきなのは1と2である。3はdebug時に観測できる場合があっても、固定schemaとして扱わない。禁止操作の制御は、内部reminderの文言ではなく、permission rules、hooks、MCP policy、sandbox、provider側の権限で実施する。

[Claude Code 2.1.196のmanaged settingsとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/)の設計を使えば、model既定値と実行権限を組織側で固定できる。harness内部表現に依存せず、外側の制御点で保証を作る方がversion changeに強い。

## 検証matrixを先に固定する

最小のmatrixは、client version、model、providerの3軸で作る。

| 軸 | baseline | candidate |
|---|---|---|
| Claude Code | 2.1.200 | 2.1.201 |
| Model | Sonnet 5固定 | Sonnet 5固定 |
| Provider | 本番で使う経路ごと | 同じ経路 |
| Settings | 同一revision | 同一revision |
| Repository | 同一fixture | clean stateへ戻す |

providerはAnthropic直接、Claude Platform on AWS、Bedrock、Google Cloud、Foundryを一つの列にまとめない。本番で使っていないproviderまで試す必要はないが、実利用経路はすべて含める。

test taskは最低3種類用意する。

- **短い対話**: toolを使わない2〜3 turn
- **tool loop**: read、edit、testを含む10回以上のtool interaction
- **state change**: permission待ち、追加入力、compaction、利用可能toolの変化を含む長時間session

短い対話は一般的なregressionを検出するcontrolである。今回の変更を直接刺激する可能性が高いのはtool loopとstate changeだ。harness reminderの挿入条件は非公開なので、単一taskで「発生しなかった」と結論づけない。

## OTelで本文を取らずに比較する

Claude Code monitoringは、`claude_code.interaction` の下に `claude_code.llm_request`、hook、tool spanを構成する。`llm_request`にはmodel、duration、time to first token、input/output token、cache read/create token、request ID、client request ID、attempt、success、status code、error、stop reasonがある。

最初の検証では、次のKPIをversion/providerごとに集計する。

- session完了率
- 1 sessionあたりのLLM request数
- retry attempt数
- HTTP 4xx/5xx率
- input tokenとcache read token
- tool call成功率
- permission待ち時間
- end-to-end duration

system roleの構造変更がprovider validationへ影響するなら、400 class errorやretryに差が出る可能性がある。prompt cacheへの影響があれば、cache read/create tokenに差が出る可能性がある。ただし、いずれも「差が出るはず」とは限らない。変更前から問題が表面化していなかったproviderやsession pathもあり得る。

request IDとclient request IDを保持すると、provider側supportへ問い合わせる際に役立つ。本文を記録しなくても、version、model、provider、時刻、request ID、status codeをそろえれば、相当範囲の切り分けができる。

## raw API bodyの取得設計

message roleを直接比較するには、`OTEL_LOG_RAW_API_BODIES` を使える。値 `1` はtruncated bodyをeventへ含め、`file:<dir>` はuntruncated bodyをlocal fileへ書く。どちらもfull conversation historyを含む可能性があり、通常のtelemetryより高い機密度を持つ。

取得前に、次のcontrolを必須にする。

- synthetic repositoryと架空データだけを使う
- 個人accountではなく検証用organization/accountを使う
- 出力directoryを暗号化volumeへ置く
- collectorへの送信先を検証環境に限定する
- retentionを24〜72時間など短く固定する
- 取得担当者と解析担当者を限定する
- 検証後にfileとcollector側copyを削除する

raw bodyのdiffでは、本文そのものよりevent sequenceを見る。各requestについて、role列、tool_use/tool_resultの対応、system messageの位置、cache breakpoint、error responseを抽出する。秘密情報を別のanalysis toolへ再投入しない。

なお、Claudeのextended-thinking contentはraw body loggingでもredactされると公式docsにある。したがって、raw bodyが内部推論を完全に再現するという期待は誤りだ。

## schema diffで確認する項目

旧版と新版のrequestを正規化し、timestamp、request ID、tokenのようなrunごとの値を除外する。そのうえで以下を比較する。

### role sequence

`user`、`assistant`、`system` の並びを抽出する。2.1.201のreleaseどおりなら、Sonnet 5 sessionのharness reminderに対応するmid-conversation `system`は使われないはずだ。ただし、利用者が明示したtop-level system promptや、別機能によるsystem contentまで一律に消えるとは限らない。

### tool pairing

assistantの `tool_use` とuserの `tool_result` が正しく対応し、その間に不正なmessageが入っていないかを見る。mid-conversation system docsは、この間への挿入を禁止している。

### operator instructionの結果

roleそのものが変わっても、利用者の追加入力、権限状態、tool availabilityなどがmodelへ正しく反映されているかを操作結果で確認する。内部reminder文の一致ではなく、期待するbehaviorをassertする。

### cache boundary

前turnまでのprefixが同一なのにcache readが減っていないかを見る。差があればrequest bodyのどの位置から変わったかを確認する。ただし、tokenizer、model、cache TTL、minimum cacheable lengthも条件に影響するため、client version以外を固定する。

## behavior testを契約にする

内部messageのsnapshot testだけでは、implementation detailを固定してしまう。企業側の受入試験はbehavior中心にする。

たとえば、以下のassertionを使う。

- read-only taskでwrite toolを呼ばない
- permissionを拒否した後に同じ破壊的commandを再実行しない
- toolが利用不可になった後に代替手順を提示する
- user follow-upを現在のtaskへ取り込み、別taskへ逸脱しない
- compaction後も受入条件と禁止事項を保持する
- provider errorを成功として扱わない

直前の[Claude Code 2.1.200の常駐session復旧](/blog/claude-code-21200-manual-background-recovery-2026/)で扱ったsleep/wake、stall、cancelled turnの試験も再利用できる。2.1.201では、復旧後のsessionがSonnet 5へどのcontextを再送し、禁止事項を維持するかを追加で見る。

## proxyと互換layerの注意点

社内API gatewayやLLM proxyがMessages API payloadをinspectionする場合、許可roleをhard-codeしていることがある。旧版でmid-conversation `system`を特例許可していたなら、2.1.201でそのtrafficが減る可能性はある。ただし、ruleをすぐ削除してはいけない。他model、他client、application独自のmid-conversation system messageが引き続き利用する場合がある。

ruleは「Claude Code 2.1.201ではsystem roleが存在しない」というversion依存の否定条件ではなく、model/provider capabilityに基づいて設計する。unsupported combinationをrejectし、supported combinationではplacement constraintとcontent sourceを検証する。

特にuntrusted contentをsystem messageへ昇格させない。公式docsは、tool output、retrieved document、web contentをsystem roleへ直接置かないよう明記している。proxyで自動変換するときも、`tool_result` をsystemへ変換しない。

## logging pipelineのmigration

既存のSIEM parserがraw bodyから `messages[].role=="system"` を抽出し、「policy change」eventとしている場合、2.1.201でevent数が減る可能性がある。これをpolicy enforcementの減少と誤判定しない。

system-level policyの監査sourceは、managed settings revision、permission mode change、tool decision、hook execution、MCP connectionへ分解する。Claude Code OTelにはそれぞれのeventが用意されている。内部harness reminderをpolicy auditの唯一のsourceにしない。

また、OTel属性 `gen_ai.system=anthropic` はprovider識別子である。Messages APIのmessage roleとはnamespaceも意味も異なる。dashboardやalertのfield名を `provider_system`、`message_role` のように明示的に分けると誤読を防げる。

## rolloutとrollback

rolloutは開発者の5〜10%または検証用device groupから始める。最低1営業日、可能なら通常業務の代表taskを20〜30 session観測する。重大な400 error、tool loop中断、禁止操作、監査欠落がなければ段階を広げる。

rollback条件はversion配布前に定義する。

- Sonnet 5 session完了率がbaselineを有意に下回る
- 特定providerで4xxが継続する
- permission拒否を越えてtoolを再実行する
- 監査に必要なrequest IDやtool decisionが欠落する
- tokenまたはlatencyが許容幅を超えて増える

rollback時はclient versionだけを戻し、model/provider/settingsまで同時に変えない。複数条件を変えると原因が分からなくなる。2.1.200へ戻す場合は、同versionで修正されたbackground sessionの挙動を維持できる一方、2.1.201のmessage変更は失われることを記録する。

## 判断基準

今回のrelease情報だけでは、全社緊急配布を要求するsecurity advisoryとは評価できない。CVE、攻撃経路、data exposure、破壊的挙動は公表されていないからだ。

ただし、Sonnet 5を長いagent loopで使い、複数providerを利用し、request schemaをproxyやSIEMで扱う組織にとっては、早期検証の優先度が高い。patchの小ささと運用影響の小ささは同義ではない。message roleはvalidation、priority、cache、監査の交点にある。

最終的な更新判断は、次の条件を満たすかで行う。

1. 利用中providerすべてでsessionが完了する
2. behavior contractを満たす
3. error/retryがbaseline以内である
4. cache/token/latencyが許容幅内である
5. 監査pipelineが必要なeventを継続して取り込める

公開されていないharness reminder文面の一致は、受入条件に含めない。

## まとめ

Claude Code 2.1.201は、Sonnet 5 sessionのharness reminderにmid-conversation `system` roleを使わなくする。mid-conversation system messageはoperator-level priorityとcache上の利点を持つ一方、model、provider、placementに制約がある。

専門チームは、client versionだけを変えたmatrixで、OTel metadata、必要に応じた限定的raw body、behavior contractを比較する。内部message schemaを恒久契約として扱わず、permission、hook、tool decision、request IDなど公開された境界で監査を構成するべきだ。

この方法なら、変更理由を推測で断定せず、実環境で観測したcompatibility、費用、品質、統制の差だけを根拠にrolloutできる。

## 出典

- [Claude Code v2.1.201 release（Anthropic公式GitHub）](https://github.com/anthropics/claude-code/releases/tag/v2.1.201)
- [Mid-conversation system messages（Claude Platform Docs）](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages)
- [Messages API reference（Claude Platform Docs）](https://platform.claude.com/docs/en/api/messages)
- [Monitoring（Claude Code Docs）](https://code.claude.com/docs/en/monitoring-usage)
- [Data usage（Claude Code Docs）](https://code.claude.com/docs/en/data-usage)
