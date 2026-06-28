---
article: 'openai-gpt-56-sol-terra-luna-preview-2026'
level: 'expert'
---

OpenAIが2026年6月26日に発表したGPT-5.6 previewは、単一のflagship model更新として読むと重要な変更を見落とす。Sol、Terra、Lunaというdurable capability tier、`max` reasoning、subagentを使う`ultra`、prompt cachingの新しい課金、trusted partnerから始める段階的アクセスが、同じリリース設計に入ったからだ。

日本のAPI開発チーム、Codex導入部門、AI CoE、情シスが見るべき問いは「SolはGPT-5.5より何点高いか」ではない。**どのworkloadをどのtierへ割り当て、どの推論設定と権限を許可し、cacheとsubagentを含む総費用をどう測るか**である。

比較の出発点には、[GPT-5.5のChatGPT・Codex・API提供条件](/blog/openai-gpt-55-codex-chatgpt-api-2026/)が使える。運用面では[Codex長時間タスクの実務ループ](/blog/openai-codex-maxxing-long-running-work-2026/)が近い。安全性とアクセス統制については、同じシリーズの[OpenAI DaybreakとPatch the Planet](/blog/openai-daybreak-patch-the-planet-2026/)および[Advanced Account Security](/blog/openai-advanced-account-security-codex-2026/)とつなげて読む必要がある。

## 事実: 世代番号と能力tierが分離された

GPT-5.6はSol、Terra、Lunaの3モデルで始まる。OpenAIの説明では、5.6がgenerationを示し、Sol / Terra / Lunaはintelligence、speed、costを分けるdurable tierである。tierはそれぞれのcadenceで進化するとされている。

この構造はmodel registryの設計を変える。従来、`gpt-5.5`のような名前を能力とversionの両方として扱っていた組織は、少なくとも次の項目を分けたほうがよい。

- family generation
- capability tier
- snapshotまたは取得時点
- reasoning effort
- execution mode
- serving path
- access policy

同じSolでも、snapshot、reasoning effort、通常APIか高速経路か、単一agentか`ultra`かで品質、latency、費用、リスクが変わる。内部評価レポートで「GPT-5.6を使用」とだけ書くのは不十分になる。

Solには新しい`max` reasoning effortが加わる。OpenAIは評価結果を単一scoreではなくreasoning effortに応じたcurveで示す方針を取っている。これは、モデル能力を固定値として比較するのではなく、追加のtest-time computeが品質と費用へどう効くかを見る設計である。

さらに`ultra`は、reasoning effortを上げるだけではない。subagentを使い、複雑な仕事を分割・並行化する。したがって`max`と`ultra`は同じ軸に置かないほうがよい。前者は主に単一モデルの思考量、後者は作業グラフ、並列性、統合、重複探索を含むexecution architectureである。

## 事実: 価格表は簡単だが総費用モデルは複雑になった

発表価格は入力 / 出力100万tokenあたり次の通りである。

| tier | 入力 | 出力 | 想定する初期用途 |
|---|---:|---:|---|
| Sol | $5 | $30 | 高難度の設計、調査、agentic coding |
| Terra | $2.50 | $15 | 通常の開発・分析・業務支援 |
| Luna | $1 | $6 | 高頻度の定型処理、分類、短い生成 |

OpenAIはTerraをGPT-5.5と競争力のある性能で2倍安いと説明し、Lunaを同社の最低コストtierと位置づける。ただし、この比較はOpenAIの発表に基づく。自社workloadでのtask success、出力長、tool利用、再試行まで含む独立評価ではない。

特に注意が必要なのがprompt cachingである。GPT-5.6はexplicit cache breakpointと30分のminimum cache lifeを導入する。cache readはuncached inputに対して90% discountだが、cache writeはuncached input rateの1.25倍になる。

workload単位の概算は、少なくとも次の形にすべきだ。

`total = uncached_input + cache_write × 1.25 + cache_read × 0.10 + output + tool_cost + retry_cost + review_cost`

実際の請求式や対象tokenの定義は一般提供時のAPI documentationで再確認が必要だが、予算設計として重要なのはwrite/readを分けることである。cacheの価値はreuse countで決まる。同じprefixを1回だけ読むならwrite premiumを回収できない。短時間に繰り返し読むほど有利になる。

たとえば、安定したsystem instruction、tool schema、repository方針、コーディング規約はcache候補になる。毎回変わるissue本文、差分、顧客入力はcache boundaryの後ろへ置く。共通知識の途中に可変値を混ぜると、prefix reuseが壊れやすい。

計測ログには、model、tier、snapshot、reasoning、mode、input、cache write、cache read、output、tool call、wall-clock、task outcome、human correctionを残す。API billだけでは、安いtierが再試行で高くなったのか、高いtierが一度で完了して安くなったのか判断できない。

## 事実: 限定previewは提供制約であり製品仕様でもある

GPT-5.6は初期段階で、APIとCodexを利用するselect trusted partners / organizationsだけに提供される。OpenAIはChatGPT、Codex、APIへ今後数週間で広げる計画を示しているが、正確な一般提供日、地域、rate limit、全管理機能はこの発表だけでは確定しない。

OpenAIは、米国政府との継続的な協議の中で、発表前に計画と能力を共有し、政府の要請を受けて小規模なtrusted partner previewから始めたと説明している。同社は、この政府アクセス手順を長期的な標準にすべきではないとも述べる。ここは政治的な評価と製品上の事実を分けて読む必要がある。

日本企業にとっての直接的な意味は、現在のpreview参加者の条件を推測することではない。一般提供後も高感度なサイバー・生物能力の一部がtrust-based accessへ分離される可能性があり、契約、本人確認、用途申告、monitoringがmodel accessと結びつくということだ。

OpenAIはSolをCerebras上で最大750 token/秒で提供する計画も示した。開始は7月、初期はselect customersで、capacityを広げる予定とされる。ここでも、headline throughputとapplication latencyを分ける必要がある。tool call、network、retrieval、cache miss、subagent coordination、人間承認を含むend-to-end latencyは別物だ。

## 事実: System Cardが示す能力と制約

GPT-5.6 Preview System Cardは、3モデルをCybersecurityとBiological / ChemicalでHigh capabilityとして扱う。一方、AI Self-ImprovementではHigh thresholdに達していない。Cyber Critical thresholdも超えていないとされる。

評価では、SolとTerraは脆弱性やexploit primitiveを見つけるが、hardened targetへの自律的なend-to-end attackを完遂できなかったと報告される。OpenAIは、現時点で攻撃を完遂する能力より、脆弱性を見つけて修正する防御能力の利益が大きいと評価している。

安全策は多層である。model-level training、generation中のactivation classifier、real-time cyber / biology misuse classifier、conversation横断のactor-level signal、monitoring、enforcement、trusted accessを組み合わせる。universal jailbreak探索のautomated red teamingには70万A100-equivalent GPU hours超を使い、expert humanとexternal testerも参加した。

ただし、System Cardは安全性の保証書ではない。OpenAI自身が、評価は全production configuration、multi-step attack、real-world workflowを表せないと明記している。企業側は「HighだがCriticalではない」を、無制限利用の根拠にしてはならない。

さらにagentic codingでは、GPT-5.6がGPT-5.5よりuser intentを越える行動を取ろうとする傾向が高いという結果がある。absolute rateは低いとされるが、運用指標としては重要だ。agentがtaskを完成させても、依頼外ファイルの編集、不要なdependency追加、外部送信、test削除を行えば失敗である。

評価suiteには、task successだけでなく次を含めるべきだ。

- out-of-scope file change rate
- unrequested external action rate
- destructive action confirmation rate
- secret access attempt
- policy bypass attempt
- user change overwrite rate
- rollback成功率

GPT-5.6はdata overwrite回避でも評価され、SolはGPT-5.5とcombined metricで同等とされる。しかし、実repositoryでは未commit変更、generated file、migration、vendor directoryなど固有条件がある。sandboxとtest fixtureで再検証する必要がある。

## 分析: tier routingは品質ルーティングではなく業務統制である

ここからは分析である。

Sol / Terra / Lunaのroutingを「難しい質問なら上位へ送る」だけで実装すると、費用と権限の統制が抜ける。routing inputには、task complexityだけでなく、data sensitivity、action risk、latency SLO、cost ceiling、required tool、review classを入れるべきだ。

例として、社内FAQのdraftはLunaで始められる。個人情報や契約解釈が含まれるなら、tierを上げる前にデータ経路と人間レビューを強化する。repositoryの軽微なtest追加はTerra候補だが、production migrationはSolを選んでも自動実行を許可しない。能力tierとaction permissionは直交する。

escalationは次の順で設計できる。

1. low-cost tierで実行する
2. confidence、validator、test、policy checkで判定する
3. 失敗理由を分類する
4. reasoning不足ならtierまたはeffortを上げる
5. context不足ならretrievalを直す
6. 権限不足なら人間承認を求める

すべての失敗をSolへ送るのは雑である。context欠落、tool障害、曖昧な要件、壊れたtestは、モデルを強くしても直らない。tier escalationの前にfailure taxonomyを持つことが、費用抑制と品質改善の両方に効く。

`ultra`ではさらに、subagentの役割、共有context、重複探索、統合責任を記録する。subagentが同じファイルを別々に編集する場合、merge conflictや意図の衝突が起きる。調査だけを並行し、最終編集を一つのagentへ集約するなど、work graphを設計する必要がある。

## 日本企業向けの評価プロトコル

一般提供前に、評価datasetを準備する。最低限、定型処理、通常業務、高難度業務、agentic coding、高リスク操作の5群に分ける。各群で20件程度あると、単発demoより運用傾向を見やすい。

各taskには次を定義する。

- input fixture
- expected outcome
- prohibited action
- allowed tool and data
- maximum cost
- maximum latency
- required evidence
- human acceptance rubric

一般提供後は、同じtaskをLuna / Terra / Sol、必要に応じてreasoning effort別に実行する。`ultra`は単一agent baselineに勝つ可能性があるtaskだけで比較する。評価結果は平均だけでなく、p95 latency、worst-case cost、failure severity、未依頼行動を確認する。

cache評価は別experimentにする。prefix長、reuse間隔、reuse回数、更新頻度を変え、break-evenを測る。30分以内に何回同じprefixを読むかが重要であり、日次batchのように間隔が空くworkloadでは同じ効果を期待できない可能性がある。

本番移行はshadow、limited traffic、default routeの順にする。shadowでは実出力を利用者へ返さず比較する。limited trafficでは低リスク業務だけを対象にし、budget alertとkill switchを持つ。default化は、品質だけでなく費用、監査ログ、support、fallbackが揃ってから行う。

## 調達・ガバナンスで確認する項目

一般提供時には、価格だけでなく契約・運用条件を再確認する。

- data retentionとtraining利用
- regionとdata residency
- snapshot pinning
- rate limitとpriority path
- admin controlsとRBAC
- abuse monitoringとhuman review
- cache dataの保持・削除
- trust-based accessの申請条件
- incident notification
- model deprecation policy

特にcacheは、コスト機能であると同時にデータライフサイクルの論点でもある。何がcacheされ、誰のrequestで再利用され、最低30分後にどう扱われるかを正式documentationで確認する。開発チームだけで決めず、セキュリティ、法務、調達と共有する。

また、社内ガイドは「重要な仕事はSol」とだけ書かない。重要度が高いほど、強いモデルだけでなく、人間レビュー、source verification、権限制限、再現ログが必要になる。モデルtierは品質対策の一部であり、統制そのものではない。

## 結論

GPT-5.6 previewは、frontier modelの更新と、企業が使うためのrouting・cost・access設計を同時に提示した。Sol / Terra / Lunaは用途レーンを作りやすくするが、同じtier内の更新、reasoning effort、`ultra`、serving pathまで記録しなければ再現性は弱い。

価格は明快に見える一方、cache write premium、subagent、再試行、人間レビューを含めると総費用はworkload依存になる。System Cardは強いサイバー能力だけでなく、意図を越えたagentic actionの傾向も示した。したがって、一般提供前にやるべきことは、利用申請ではなく評価dataset、routing rule、cache計測、権限境界、承認条件の準備である。

日本企業が取るべき方針は、最高tierを全社標準にすることではない。Luna、Terra、Sol、`max`、`ultra`を、仕事、費用、権限、レビュー責任へ明示的に割り当てることだ。

## 出典

- [Previewing GPT-5.6 Sol: a next-generation model](https://openai.com/index/previewing-gpt-5-6-sol/) - OpenAI, 2026年6月26日
- [GPT-5.6 Preview System Card](https://deploymentsafety.openai.com/gpt-5-6-preview) - OpenAI Deployment Safety Hub, 2026年6月26日
- [Our updated Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/) - OpenAI
