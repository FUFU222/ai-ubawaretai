---
article: 'anthropic-claude-fable-mythos-access-restored-2026'
level: 'expert'
---

Claude Fable 5のアクセス再開を本番復旧として扱うには、Anthropicの告知、契約上の利用権、クラウドのmodel lifecycle、実際の推論成功、安全分類器の拒否を別々の状態として管理する必要がある。Anthropicは2026年7月1日にFable 5とMythos 5のアクセス復旧を発表したが、全モデル、全利用者、全経路を一斉に元へ戻したわけではない。

Fable 5はClaude Platform、Claude.ai、Claude Code、Claude Coworkで世界向けに再開した。AWS、Google Cloud、Microsoft Foundryは順次再有効化するとされる。Mythos 5は、6月26日に承認された一部の米国組織で復旧し、より広いProject Glasswingパートナーへの展開は調整中だ。したがって日本企業の通常利用で復旧対象となるのは主にFable 5であり、Mythos 5を一般利用可能と扱うべきではない。

6月12日の停止時に作った代替運用は[Claude Fable停止と企業AI調達の再点検](/blog/anthropic-claude-fable-mythos-access-suspension-2026/)で整理した。今回必要なのは、その代替経路を残したままFable 5をcanaryで戻し、到達性、拒否、品質、費用を比較する工程である。モデルの仕様とガバナンスの前提は[Claude Fable 5、1M文脈時代の導入設計](/blog/anthropic-claude-fable-mythos5-governance-2026/)に接続する。

## 事実整理: 復旧状態はモデルごとに異なる

Anthropicの時系列では、Fable 5とMythos 5は6月9日に公開された。6月12日、米国政府による輸出規制が外国籍の利用者へ適用され、リアルタイムに国籍を確認できないことから全利用者のアクセスが停止された。6月30日に規制が解除され、Fable 5は7月1日から世界向けの主要な一次提供で再開した。

Fable 5とMythos 5は同じ基盤モデルを使うが、安全策と利用者が異なる。Fable 5は一般提供のための強い安全分類器を持つ。Mythos 5は分類器が少なく、強いサイバー能力を防御目的に使うProject Glasswingの限定パートナー向けである。復旧告知に両者が並んでも、entitlementと利用地域を同一視できない。

運用上は少なくとも次の状態を分ける必要がある。

- `announced`: ベンダーが再開を告知した
- `catalog_visible`: 利用するサービスのモデルカタログに表示された
- `entitled`: 契約、seat、credits、model accessの条件を満たした
- `reachable`: 対象ネットワークとリージョンからAPI呼び出しが成功した
- `usable`: 代表ジョブが許容品質、拒否率、レイテンシで完了した
- `production_enabled`: 監視とロールバックを持って本番トラフィックを流した

`announced` から `production_enabled` へ直接遷移させないことが復旧設計の中心になる。

## 事実整理: プラン別の7月7日境界

Pro、Max、Team、一部Enterpriseプランでは、Fable 5が7月7日まで週次利用上限の最大50%に含まれる。7月7日後はusage creditsで利用する。Enterpriseにはさらにseat差がある。

標準Enterprise seatにはFable 5のincluded allowanceがない。usage creditsが無効ならアクセスできない。premium Enterprise seatは7月7日まで各メンバーのseat usageから追加料金なしで使えるが、7月7日後はusage creditsが必要になる。creditsを有効にしなければ、その時点でアクセスできなくなる。

この境界は、評価環境で成功したジョブが7月8日に契約理由で失敗する可能性を意味する。復旧runbookには7月7日前後での再疎通を入れ、`insufficient_credits` やentitlementエラーを障害として誤検知しないようにする。コスト評価はFable 5だけで閉じず、[Claude Sonnet 5のAPI移行設計](/blog/anthropic-claude-sonnet-5-pricing-migration-2026/)と比較し、長時間自律作業にFable 5が必要かをジョブ単位で判断する。

## 事実整理: 新しい分類器とfallback挙動

停止の契機になった報告は、Fable 5の安全策を回避してソフトウェア脆弱性を特定し、1件では悪用方法を示すコードを出せたというものだった。Anthropicは検証後、その手法がFable 5だけの固有能力を露出させたものではなく、より弱い複数モデルも同様の脆弱性特定や実証を行えたと説明した。

それでもAnthropicは、報告された挙動を対象に新しい安全分類器を訓練した。公式説明では、特定の回避手法を99%以上遮断する。Fable 5への要求が止められた場合、利用者へ通知し、要求をOpus 4.8へ送る。一方で、通常のコーディングやデバッグでも無害な要求を止めるfalse positiveが増えると明記している。

このfallbackはアプリケーションの観測対象にすべきだ。最終的に回答が返れば成功、とだけ記録すると、Fable 5を評価したつもりでOpus 4.8の結果を測る可能性がある。応答メタデータで実モデルを確認できる経路では保存し、確認できないUI経路では利用者の表示や管理ログを検証する。

## AWS経路: HTTP 200を成功条件にしない

AWSのFable 5 model cardは、model lifecycleをActiveとし、`anthropic.claude-fable-5` を `bedrock-runtime` と `bedrock-mantle` で利用する方法を掲載している。コンテキストは1Mトークン、最大出力は128K、adaptive thinkingは常時有効でeffortを設定できる。

重要なのはContent Restrictionsの仕様だ。Fable 5にはサイバーセキュリティと生物学のdual-use内容を止めるblocking classifierがある。分類器が要求を止めてもAPIは標準HTTP 200を返し、`stop_reason: "refusal"` と制限カテゴリを示す `stop_details` を含む。prompt段階の拒否は課金されず、生成途中の拒否は遮断前に生成したtokenが課金対象になる。

既存実装が次のような判定をしている場合、修正が必要になる。

```text
if response.status == 200:
    mark_success()
```

最低限、結果判定を次の分類へ広げる。

```text
transport_success
model_completed
model_refused_before_inference
model_refused_mid_stream
fallback_completed
entitlement_failed
model_unavailable
```

本文やtoken usageを保存できない制約がある場合も、分類結果、model ID、request ID、所要時間、利用リージョンは監査用メタデータとして残せる。拒否率だけでなく、どのジョブ分類で拒否が集中したかを見る。

## 経路別の復旧マトリクス

復旧担当は1つの「Fable 5復旧済み」フラグではなく、経路ごとのマトリクスを作る。

| 経路 | entitlement | model ID / 選択 | 実疎通 | 拒否観測 | 本番許可 |
|---|---|---|---|---|---|
| Claude Platform API | credits / org policy | API指定 | canary | response metadata | 段階展開 |
| Claude Code | plan / org default | model picker / managed setting | sandbox repo | UI・利用ログ | 限定team |
| AWS Bedrock | model access / IAM / SCP | `anthropic.claude-fable-5` | 対象region | `stop_reason` | traffic split |
| Google Cloud | project / region / IAM | provider側ID | 対象project | provider log | traffic split |
| Microsoft Foundry | subscription / deployment | deployment設定 | 対象resource | provider log | traffic split |

AWS、Google Cloud、Microsoft Foundryは、Anthropicが「できるだけ早く再有効化」と述べた経路である。7月1日の一次提供再開を、特定クラウドのSLAとして扱わない。プロバイダーのカタログ、サービス状態、対象アカウントのAPIを順に確認する。

また、AWSのmodel cardがActiveでも、自社のリージョン内推論が使えるとは限らない。In-Region、Geo Cross-Region、Global Cross-Regionでは、データ境界と可用性の前提が異なる。日本の個人情報、金融、製造機密を扱う組織は、復旧を理由に推論経路をGlobalへ緩めてはならない。

## canary評価の設計

復旧canaryは、単純な「Hello」を返す疎通と、業務に近いジョブを分ける。

第1段階では、model ID、認証、endpoint、リージョン、creditsを確認する。非機密の短い入力で応答し、実モデルとrequest IDを保存する。

第2段階では、停止前にFable 5で成功していた代表ジョブを固定データで再実行する。長文設計レビュー、複数ファイルのコード変更、調査と出典整理、ツールを伴う作業など、Fable 5を選ぶ理由がある仕事を使う。出力の正確さだけでなく、完了率、tool call回数、wall-clock時間、token、レビュー修正量を測る。

第3段階では、安全分類器に近い正当業務を別枠で評価する。例として、CVEの影響範囲分析、社内サービスの脆弱性再現、侵害ログの調査、依存関係の修正、セキュアコーディングレビューがある。攻撃手順を広く生成するテストではなく、自社が許可した防御ユースケースでfalse positiveを測る。

第4段階では、停止中の代替モデルとA/B比較する。Opus 4.8やSonnet 5で十分なら、Fable 5へ戻す必要はない。Fable 5が長時間の完遂率やレビュー工数で明確に勝つジョブだけを復旧対象にする。

## ロールバック条件

復旧は、戻す条件より止める条件を先に決める。例えば次のしきい値を置ける。

- 5分窓のmodel unavailableが基準値を超える
- `refusal` が評価時の上限を超える
- fallback先を含むp95レイテンシがSLOを超える
- 1ジョブ当たりcreditsが予算上限を超える
- 実モデルを監査ログで確認できない
- クラウドの推論経路が承認済みリージョンから外れる
- 7月7日後のcredits設定が未承認

ロールバック先は、停止期間に使ったモデルを一定期間残す。Fable 5への100%切替と同時に代替設定を削除すると、次の提供変更で同じ復旧作業を繰り返すことになる。model aliasの変更、feature flag、gateway routingのどこで切り替えるかを1か所に集約する。

## 監視とインシデント分類

Fable 5の復旧後は、ベンダー障害と安全ポリシーを同じアラートにまとめない。

1. **transport**: DNS、TLS、timeout、5xx
2. **availability**: model not found、region unavailable
3. **entitlement**: plan、seat、credits、model access、IAM
4. **safety**: `refusal`、restriction category、fallback
5. **quality**: 未完了、誤ったtool call、レビュー差し戻し
6. **budget**: token、credits、想定外のmid-stream課金

分類ごとに担当も異なる。transportとavailabilityはプラットフォーム運用、entitlementとbudgetは管理者・FinOps、安全拒否はセキュリティとアプリ担当、qualityはユースケース所有者が見る。1つの「Claude失敗率」では改善先を決められない。

## 日本企業の実行順序

初日に行うのは、利用経路、停止時の代替モデル、契約条件、所有者の棚卸しである。Claude.aiの個人利用だけで復旧を判断せず、APIとクラウドの本番経路を列挙する。

次に、7月7日までに非本番canaryを実行する。premium Enterprise seatの短期枠を使う場合でも、代表ジョブを少数に絞る。usage creditsを有効にする決裁が必要なら、品質差と予算見積もりを同じ資料にする。

その後、限定チームまたは1〜5%のジョブで本番相当のtrafficを流す。拒否、fallback、レイテンシ、creditsを日次で確認し、ロールバック条件を満たさないことを確認して割合を上げる。

7月7日後に再び疎通し、credits条件の変化を確認する。ここでアクセスが落ちても、ベンダー再停止とは限らない。seatとcreditsのentitlementを先に見る。

最後に、停止から復旧までをサプライヤー可用性の実績として記録する。新しい高性能モデルを評価する際は、ベンチマークだけでなく、突然の停止、クラウド間の復旧差、契約条件の変更、fallbackの観測可能性も選定基準に含める。

Fable 5の復旧は、単にmodel pickerへ項目が戻った出来事ではない。モデル供給、政策、安全分類器、クラウド、creditsが同時に変わる環境で、AI基盤をどう安全に復旧するかを試すケースである。日本企業は7月7日を全社切替の締切ではなく、canaryと予算判断を終える最初のチェックポイントとして扱うべきだ。

## 出典

- [Redeploying Claude Fable 5](https://www.anthropic.com/news/redeploying-fable-5) - Anthropic, 2026-06-30 / 2026-07-01 update
- [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access) - Anthropic, 2026-06-12
- [Claude Fable 5 - Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-fable-5.html) - AWS Documentation
