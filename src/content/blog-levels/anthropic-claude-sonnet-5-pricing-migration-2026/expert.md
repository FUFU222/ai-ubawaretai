---
article: 'anthropic-claude-sonnet-5-pricing-migration-2026'
level: 'expert'
---

Claude Sonnet 5の移行判断では、モデル性能、API単価、トークナイザー、effort、実行経路を分離して測る必要がある。Anthropicは2026年6月30日にSonnet 5を公開し、Claudeの全プラン、Claude Code、Claude Platformで提供を始めた。API IDは `claude-sonnet-5`。2026年8月31日までは入力2ドル・出力10ドル、以後は入力3ドル・出力15ドルで、いずれも100万トークン当たりの価格である。

導入価格だけを見るとSonnet 4.6から切り替えやすい。しかし、AnthropicはSonnet 5で新しいトークナイザーを採用し、同一入力が内容によって約1.0〜1.35倍のトークンになる可能性を明記している。さらに、Sonnet 5は `high` effortが既定であり、effortは最終テキストだけでなくツール呼び出しや関数引数を含む出力全体へ効く。単価表だけで移行前後の費用を比較すると、実ジョブのコスト構造を外す。

技術責任者が作るべきものは、モデル比較表ではなく移行計測設計である。[Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/)で整理した長時間エージェントの運用論点を踏まえ、入力トークン、出力トークン、ツール回数、wall-clock時間、完了率、レビュー修正量を同じ単位で測る必要がある。

## 事実整理: モデル仕様と提供経路

Claude Platformのモデル概要では、Sonnet 5のコンテキストウィンドウは1Mトークン、同期Messages APIの最大出力は128kトークンとされている。adaptive thinkingとeffortに対応し、APIとClaude Codeでは `high` effortが既定である。モデルIDは日付なしだが、Claude 4.6世代以降の日付なしIDはevergreen aliasではなく、固定されたsnapshotとして扱われる。

この仕様は運用上重要だ。日付なしIDを「常に最新のSonnetへ自動更新されるalias」と誤認すると、変更管理が崩れる。モデル更新時は別IDへの明示的な移行イベントとして扱い、評価結果、承認、rollback条件を残すべきである。

提供経路は複数ある。Claude API、Claude Platform on AWS、Amazon Bedrock、Google Cloud、Microsoft Foundryが案内されているが、モデルIDとendpointは同一ではない。Claude Platform on AWSはClaude API形式のモデルIDを使い、BedrockはBedrock用IDを使う。クラウド側ではglobal、multi-region、regional endpointの違いもあり、データ経路や可用性要件と結びつく。

したがって、移行対象はアプリケーションの `model` 引数だけではない。少なくとも次を棚卸しする。

- アプリケーションコード、環境変数、Secrets、IaCのモデルID
- 社内LLM gatewayのaliasとprovider routing
- Claude Codeのユーザー設定、project設定、組織既定、role既定
- fallback model、障害時routing、バッチ処理、評価ジョブ
- Bedrock、Google Cloud、Foundryのregion、endpoint、quota
- コスト集計、監査ログ、データ保持、ZDR契約の適用範囲

[Claude Code 2.1.196の組織既定モデル](/blog/claude-code-2196-org-default-mcp-security-2026/)が示した通り、開発者向けAIのモデル選択は中央管理へ寄っている。Sonnet 5を既定にする場合、UI表示だけでなく、実際のroutingと請求ログが組織方針に一致するかを確認しなければならない。

## 事実整理: 導入価格とトークナイザー変更

Sonnet 5の導入価格は2026年8月31日まで入力2ドル、出力10ドルで、標準価格は入力3ドル、出力15ドルである。Anthropicは導入価格について、Sonnet 4.6からの移行を概ねコスト中立にする意図を説明している。その根拠になるのがトークナイザー変更だ。

同じ文字列でもモデル世代が変わるとトークン数は一致しない。Sonnet 5では入力内容によってSonnet 4.6比で約1.0〜1.35倍になる可能性がある。日本語、コード、JSON、ログ、表、混在言語で倍率は異なり得るため、英語の短いプロンプトだけで補正係数を作るべきではない。

実務では、過去7〜14日分の代表トラフィックを、機密情報を保護した上で再tokenizeする。最低でも用途別にp50、p90、p99の入力トークン倍率を出す。出力はモデル挙動で変わるため、tokenizeだけでなくshadow実行が必要だ。ジョブ単位の原価は概念的に次で表せる。

`job_cost = input_tokens × input_rate + output_tokens × output_rate + tool_execution_cost + retry_cost`

ここに人間レビューの時間原価を加えると、事業判断に使える総費用になる。AI APIの請求だけを最小化しても、レビューや再実行が増えれば成功1件当たり費用は上がる。逆に出力トークンが増えても、一度でテストを通し、レビュー指摘を減らせるなら、総費用は下がる可能性がある。

標準価格への移行を考えると、導入価格期間の請求額をそのまま予算化してはいけない。8月中の利用実績を入力1.5倍、出力1.5倍の単価で再計算し、9月以降のrun rateを出す。月次だけでなく、成功ジョブ1件、PR 1件、解決チケット1件など、業務単位の原価も残す。

## 事実整理: effortは予算上限ではなく挙動制御

Claude Platform Docsはeffortを、応答にどれだけトークンを使おうとするかを制御するbehavioral signalと説明している。Sonnet 5では `low`、`medium`、`high`、`xhigh`、`max` を利用できる。`high` が既定で、明示しなくても `high` と同じ挙動になる。

effortが作用する範囲は、通常のテキスト、説明、tool call、function argument、thinkingを含む。低いeffortではツール呼び出しが少なくなる可能性がある。これは、コーディングエージェントで単なる回答の詳しさ以上の差になる。リポジトリ探索、テスト実行、エラー調査、再検証が減れば速く安くなるが、必要な確認を飛ばして完了率が下がる可能性もある。

公式ドキュメントでは、Sonnet 5の `medium` はSonnet 4.6の `high` に近いコスト削減側の比較対象として案内される。`xhigh` は30分を超える長時間のコーディング・エージェント作業、`max` はトークン制約より最大能力を優先する用途向けだ。ただし、effortは厳格なtoken capではない。難しい入力では `low` でも一定の推論を行う。

このため、比較実験では次の軸を固定・分離する。

1. Sonnet 4.6 `high` 対 Sonnet 5 `medium`
2. Sonnet 4.6 `high` 対 Sonnet 5 `high`
3. Sonnet 5 `medium` 対 `high` 対 `xhigh`
4. 難しい一部タスクでSonnet 5 `xhigh` 対 Opus 4.8 `high` / `xhigh`

第一比較はコスト効率、第二比較はモデル世代差、第三比較はSonnet 5内部のoperating point、第四比較はモデル間routingを判断する材料になる。一つの平均スコアにまとめず、用途別にPareto frontierを見るべきだ。

厳格な予算統制は別レイヤーで実装する。`max_tokens`、task budget、wall-clock timeout、最大tool call、最大再試行、同時実行数、利用者・部署単位のquota、異常時circuit breakerを組み合わせる。effortだけを「低予算モード」として扱うのは不十分である。

## 事実整理: 安全性評価の読み方

Anthropicの発表とSystem Cardは、Sonnet 5がSonnet 4.6より複数の安全性評価で改善したと報告している。悪意ある要求への拒否、prompt injectionへの抵抗、hallucination、sycophancy、automated behavioral auditが対象に含まれる。一方、Opus 4.8やMythos Previewより望ましくない挙動が多い評価もあり、すべての軸で上位モデルを超えたわけではない。

サイバー能力では、Sonnet 5はOpusやMythos系より低いとされ、危険なサイバー利用を検知・遮断する防御機構が既定で有効になる。高度なサイバー作業にはOpus 4.8が推奨されている。この差は、モデルroutingを能力だけでなく、allowlistや契約上のアクセス条件と一緒に設計すべきことを示す。

企業側で重要なのは、System Cardの結果を自社システムの保証へ拡張しないことだ。RAG、MCP、Web、shell、ファイル編集、メール送信、チケット更新を接続したシステムでは、モデル単体評価にない攻撃面が生まれる。外部コンテンツ中の命令、tool resultの汚染、権限昇格、秘密情報の流出、誤った不可逆操作を独自に評価する必要がある。

具体的には、次の失敗注入テストを移行ゲートに含める。

- Webページや文書に隠したprompt injectionを無視できるか
- 参照データ中の命令とシステム指示を区別できるか
- allowlist外のツール、domain、pathへの操作を拒否するか
- 秘密情報を出力や外部送信へ含めないか
- 書き込み前承認を迂回しないか
- tool errorや部分失敗を成功として報告しないか

安全性改善は評価開始の理由にはなるが、承認省略の理由にはならない。

## 分析: 移行ベンチマークは実タスクと失敗コストで設計する

ここからは分析である。

Sonnet 5の公式ベンチマークは候補選定に有用だが、企業のGo/No-Goを直接決めない。日本企業では、日本語の要求仕様、曖昧なチケット、社内独自の命名、古いコード、複数クラウド、承認フローが性能を左右する。評価セットは公開ベンチマークの再現ではなく、直近の実務から作るべきだ。

用途ごとに20〜50件の代表タスクを選び、難易度とリスクを付与する。コーディングなら、単一関数修正、複数ファイル変更、障害原因調査、依存更新、テスト追加、セキュリティ境界変更を分ける。業務エージェントなら、検索のみ、下書き作成、社内更新、外部送信、金銭・契約に関わる操作を分ける。

評価指標は次のようにする。

- task completion rate: 人間の追加指示なしで受入条件を満たした割合
- verified correctness: テスト、構造化検証、二重確認で正しいと判断できた割合
- intervention count: 人間が修正指示、承認、rollbackを行った回数
- unnecessary change: 不要ファイル変更、不要な外部操作、過剰出力
- token and latency: 入出力トークン、tool call、再試行、経過時間
- review burden: レビュー時間、指摘数、重大指摘の有無
- risk event: 権限外操作、情報漏えい、prompt injection追従、誤送信

成功率だけでなく、失敗時の損失を重み付けする。要約の誤りと、本番設定の誤変更を同じ1失敗として平均してはいけない。高リスク用途では少数の重大失敗があれば自動化範囲を下げ、人間承認を維持する。

## 分析: モデルroutingは用途固定から始める

Sonnet 5の登場で、SonnetとOpusを動的に選ぶ構成が魅力的に見える。しかし初期移行では、用途ごとにモデルとeffortを固定したほうが原因分析しやすい。動的routingを同時に入れると、モデル差、effort差、router差、prompt差が混ざる。

初期ルールの例は次の通りである。

- 大量分類・抽出: Sonnet 5 `low`、構造化検証必須
- 一般的な業務下書き: Sonnet 5 `medium`、外部送信は人間承認
- 通常のコード変更: Sonnet 5 `high`、テストとdiff review必須
- 長時間の調査・複雑な変更: Sonnet 5 `xhigh`、時間・tool call上限付き
- 高精度が必要な難タスク: Opus 4.8へ明示的に昇格
- 高リスクのサイバー作業: 契約・allowlist・専用環境を確認し、人間承認必須

この固定routingで2〜4週間のデータを集めた後、同じタスクを別モデルへ流す条件を設計する。昇格条件には、タスク分類、失敗回数、検証エラー、コンテキスト量、リスク等級を使う。モデル自身の自己申告だけで上位モデルや高effortへ上げると、費用上限が不安定になる。

[Claude Opus 4.6 fast mode削除](/blog/anthropic-claude-opus-46-fast-mode-removal-2026/)で見たように、モデルや速度指定が無言で別挙動へ落ちる場合がある。routingではrequest側の意図だけでなく、response metadata、usage、実モデル、実速度を監査ログへ残すことが重要だ。

## 実装計画: 8月末までの移行ゲート

### Gate 1: Inventory

7月前半までに、Sonnet系モデルを参照するすべての経路を一覧化する。コード検索だけでなく、環境変数、Secrets manager、Terraform、Helm、CI、Notebook、評価基盤、SaaS連携、Claude Code設定、gateway alias、fallbackを含める。[Sonnet 4・Opus 4退役時の棚卸し](/blog/anthropic-claude-sonnet4-opus4-retirement-2026/)と同じ資産台帳を再利用できる。

各行にowner、用途、データ分類、provider、region、model ID、effort、月間件数、現行単価、SLO、rollback先を付ける。owner不在の利用経路は移行対象ではなく、停止・統合候補として扱う。

### Gate 2: Shadow evaluation

7月後半に代表タスクをshadow実行する。Sonnet 4.6とSonnet 5へ同じ入力を送り、外部書き込みは無効化する。ツールを使う場合はread-only sandboxかrecorded fixtureを用意する。prompt、tool schema、max tokensを固定し、effortだけを比較軸にする実験と、モデルだけを比較軸にする実験を分ける。

結果にはrequest ID、model、effort、provider、region、input/output token、tool calls、latency、stop reason、validation resultを残す。失敗サンプルは自動要約せず、人間が原因を分類する。モデル能力、prompt不備、tool不備、権限不足、評価器不備を分けなければ、改善策を誤る。

### Gate 3: Limited rollout

8月前半に低リスク用途の5〜10%から切り替える。canary cohortを固定し、Sonnet 4.6側のcontrolを残す。コーディングではrepository、言語、タスク種別を揃え、レビュー品質を比較する。業務用途では送信・更新を人間承認のままにする。

監視では、1ジョブ単価だけでなく、成功ジョブ単価、p95 latency、再試行率、tool error率、レビュー差し戻し率を見る。導入価格の実績を標準価格へ換算したforecastを毎日または週次で出す。

### Gate 4: Production approval

8月後半に、用途ごとに継続、条件付き継続、見送りを判断する。承認記録には、モデルID、effort、provider、region、fallback、予算上限、SLO、データ保持、監査、human-in-the-loop条件を記載する。

rollback先も検証済みでなければならない。旧モデルへ戻すだけでは、将来の退役で再び止まる。現行モデルの代替、機能縮退、queue保留、人手処理を組み合わせる。9月1日以降の標準価格で予算アラートを再設定し、最初の請求期間をFinOpsとサービスownerが共同確認する。

## まとめ

Claude Sonnet 5は、1Mコンテキスト、128k出力、複数のeffort段階、Claude Codeと主要クラウド経路への提供により、Sonnet価格帯のエージェント運用を広げるモデルである。導入価格は8月31日までだが、新トークナイザーとeffortの影響により、表示単価だけでは移行後の原価を読めない。

技術的に必要なのは、モデルIDの差し替えではなく、inventory、shadow evaluation、limited rollout、production approvalの4ゲートである。実タスクを使い、トークン、ツール回数、完了率、レビュー負荷、安全性イベントを測る。9月の標準価格へ換算し、用途ごとのmodel・effort routingを決める。

Sonnet 5を全社既定にする価値があるかは、公式ベンチマークではなく、自社の成功ジョブ単価と失敗コストで決まる。8月末までの導入価格を評価猶予として使い、価格切替前に運用条件まで確定するのが現実的な移行線である。

## 出典

- [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5) - Anthropic, 2026-06-30
- [Claude Sonnet 5 System Card](https://www-cdn.anthropic.com/d9bb04416ffe1352af84721476c1fa9994c07fde/Claude%20Sonnet%205%20System%20Card.pdf) - Anthropic, 2026-06-30
- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) - Claude Platform Docs
- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) - Claude Platform Docs
