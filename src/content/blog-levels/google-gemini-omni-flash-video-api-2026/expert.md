---
article: 'google-gemini-omni-flash-video-api-2026'
level: 'expert'
---

Gemini Omni Flashの公開プレビューは、動画生成モデルの追加というより、**動画をマルチモーダルなAPIワークフローへ組み込むための実装面が現れた**更新として見るべきだ。テキストから動画を作るだけでなく、画像、既存動画、音声を参照し、自然言語で編集を重ね、音声付き動画とテキスト応答を返せる。

企業利用で難しいのは、生成品質そのものより、非決定的な動画生成を費用、権利、ブランド、監査、公開承認の工程へどう収めるかである。APIが1秒0.10ドルと分かりやすくても、再試行、派生案、入力トークン、人間の修正、保存、配信まで含めた総費用は別途設計しなければならない。

Gemini APIの状態管理や長時間処理は[Interactions APIの一般提供](/blog/google-gemini-interactions-api-ga-2026/)で整理した。エージェント実行基盤は[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/)で扱った。Gemini Omni Flashはそれらの上で無条件に使えるtoolではなく、独自の対応入力、出力上限、quota、非対応機能を持つ動画モデルである。アーキテクチャでは別のbounded contextとして扱う必要がある。

## 事実: モデル面は広いが、API面は意図的に狭い

公式モデル文書のモデルIDは `gemini-omni-flash-preview`。最大入力131,072トークン、最大出力57,920トークンで、テキスト、画像、動画を入力に取り、動画とテキストを出力できる。公式ブログは音声も参照入力として挙げ、生成動画には音声をネイティブに含められるとしている。

サポートされる主な能力は、テキストからの動画生成、参照素材からの動画生成、動画編集、音声生成、thinking、Count Tokens、C2PA Content Credentialsである。一方、function calling、system instructions、Live API、Google Search grounding、code execution、各種tuning、context caching、batch inferenceはサポートされない。

この非対応一覧は実装上重要だ。たとえば、注文データをfunction callingで取得し、そのまま動画を生成して公開する単一モデル構成は取れない。業務データ取得、承認、生成ジョブ投入、生成物検査、公開は、オーケストレーター側の責任になる。

入出力の技術制約も強い。

- 動画は1プロンプト最大3本、各動画は音声の有無を問わず最大10秒
- 画像は1プロンプト最大10枚
- 出力は720p、16:9または9:16
- 画像入力はPNG、JPEG、WebP、HEIC、HEIF
- 動画入力はMP4、WebM、QuickTimeなど複数形式
- text fileのAPI・Cloud Storage importは1ファイル50MBまで
- model availabilityはglobal

公開プレビューで最初から「動画制作基盤」として抽象化すると、これらの制約が業務要件へ漏れ出す。ドメイン側では `duration <= 10`、対応比率、入力本数、形式を明示的にvalidateし、APIエラーで初めて制約を知る構造にしないほうがよい。

## 事実: 秒単価だけでなく、生成試行をコスト単位にする

公式価格は、入力が100万トークンあたり1.50ドル、テキスト出力とreasoningが100万トークンあたり9ドル、720p音声付き動画出力が1秒0.10ドルである。価格表は入力換算も示しており、画像1枚は2,040トークン、音声1秒は32トークン、動画入力1秒は5,792トークン、動画出力1秒も5,792トークンとして計算される。

この価格構造では、コストの主要因は動画の秒数と試行回数になる。入力トークンも無視はできないが、短い参照素材のPoCでは動画出力が支配的になりやすい。

アプリ側では、次の単位を別々に計測したい。

- `generation_request_count`: APIへ送った回数
- `requested_duration_seconds`: 要求した動画秒数
- `delivered_duration_seconds`: 実際に返った動画秒数
- `accepted_output_count`: 人間または評価器が採用した本数
- `regeneration_count`: 同じcreative taskで再生成した回数
- `human_edit_minutes`: 出力後の人間の修正時間
- `publish_count`: 実際に公開した本数

採用率を `accepted_output_count / generation_request_count` で出すと、モデル品質とプロンプト改善を費用へ接続できる。完成動画1本あたりの実効費用は、API請求額をpublish countで割るだけでは不十分だ。制作担当者、審査担当者、再編集、ストレージ、配信の費用もcreative taskへ寄せるべきである。

概算用には次のようなbudget guardが使える。

```text
estimated_video_cost_usd =
  requested_duration_seconds * output_count * 0.10

reject when:
  task_spend + estimated_video_cost_usd > task_budget
```

非同期ジョブをキューへ入れる前に見積もり、task budgetを超えるリクエストを拒否する。レスポンス後には実際の秒数と課金データで補正する。UIには「生成」ではなく「8秒を4案生成、動画出力見積もり3.20ドル」のように表示したほうが、利用者の行動を変えやすい。

なお、公式モデル文書のconsumption options表はfixed quotaをSupportedとし、Provisioned Throughput、batch inference、Pay-as-you-goをNot supportedと記載している一方、同ページのregion表にはStandard pay-as-you-goのglobal記載がある。公式価格表にも単価は掲載されている。文書間の表示だけで契約条件を断定せず、対象プロジェクトのquota、請求SKU、利用可能リージョンを実測してから本番予算を確定すべきである。

## 設計: 生成、評価、承認、公開を分離する

推奨構成は、Omni APIを「メディアを返す副作用のある生成サービス」として隔離することだ。

```text
Creative request
  -> policy check
  -> asset rights check
  -> budget reservation
  -> Omni generation job
  -> automated media checks
  -> human review
  -> publish/export
```

`policy check` では用途、公開先、商品カテゴリ、禁止表現、人物利用を判定する。`asset rights check` では参照素材のライセンスと利用範囲を確認する。`budget reservation` では秒数と案数に応じた上限を確保する。生成後の `automated media checks` では、長さ、解像度、音声有無、ファイル破損、black frame、ブランド色、禁止語、ロゴ位置など、決定的に判定できる項目を処理する。

人間レビューは、事実性、人物の不自然さ、商品形状、文化的表現、法令・業界規制、ナレーション、最終的なブランド適合を扱う。自動評価器に同じモデルを使って自分の出力を採点させるだけでは不十分だ。[Google Agent Quality Flywheelの評価設計](/blog/google-agent-quality-flywheel-evaluation-2026/)で扱ったように、生成側と評価側を分け、同じ固定セットで変更前後を比較するほうが回帰を見つけやすい。

公開操作は生成エージェントから分離する。Omni Flashはfunction calling非対応だが、周囲のエージェントやアプリは公開APIを呼べる。だからこそ、生成成功を公開許可と解釈しないstate machineが必要だ。

```text
draft -> generated -> checked -> approved -> published
                  \-> rejected
                  \-> needs_revision
```

`approved` への遷移だけは、人間の主体、時刻、チェックリスト版、成果物hashを記録する。再生成したら承認を引き継がず、`generated` へ戻す。

## 設計: 参照素材と生成物のprovenanceを保持する

C2PA Content CredentialsとSynthIDは、生成コンテンツの透明性を支える。しかし企業の監査証跡としては、モデルが付けた情報だけでは足りない。入力から公開までのprovenance graphを自社側でも持つ必要がある。

最低限のレコード例は次の通りだ。

```json
{
  "creativeTaskId": "campaign-2026-summer-042",
  "model": "gemini-omni-flash-preview",
  "requestedAt": "2026-07-03T09:00:00+09:00",
  "inputAssetIds": ["asset-183", "asset-211"],
  "promptVersion": "v4",
  "requestedSeconds": 8,
  "aspectRatio": "9:16",
  "outputObject": "gs://approved-media/.../raw.mp4",
  "outputSha256": "...",
  "rightsReviewId": "rights-778",
  "contentReviewId": "review-944",
  "c2paVerifiedAtIngest": true
}
```

入力素材そのものを監査DBへ複製する必要はない。immutableなasset ID、保管場所、hash、利用期限、契約上の範囲を参照できればよい。素材の利用期限が切れたとき、派生した生成物を検索できる構造が重要である。

生成直後の原本と公開用transcodeは分けて保存する。C2PAメタデータは変換や配信工程で失われる可能性があるため、ingest時点で検証結果を記録し、原本hashを保持する。公開先での表示要件がある場合は、コンテンツ上のAI利用表示も別レイヤーで追加する。

SynthIDやC2PAが存在しても、入力権利の証明にはならない。第三者の写真を参照に使った事実、人物の同意、音声の契約、ロゴの利用条件は、自社のasset registryと承認記録で管理する。

## 評価: 日本語・商品・人物・時間的一貫性を固定セット化する

動画モデルの評価を「良い感じか」で終えると、モデル更新やプロンプト変更による回帰を検知できない。日本向けには、少なくとも次のケースを固定評価セットへ入れたい。

1. **日本語表示**: 商品名、価格、日付、短い注意書き
2. **縦型広告**: 9:16で主要被写体がsafe areaへ収まるか
3. **商品保持**: ロゴ、形状、色、部品数が時間軸で変わらないか
4. **人物保持**: 顔、指、衣服、アクセサリがframe間で崩れないか
5. **音声同期**: 日本語音声と口・字幕・動作の同期
6. **編集指示**: 指定した部分だけ変わり、他の要素が保たれるか
7. **文化的文脈**: 季節、店舗、礼法、制服などの不自然さ
8. **禁止表現**: 医療、金融、採用、子ども向け広告の条件

各ケースは、プロンプト、入力素材、期待条件、重大失敗、許容差をversion管理する。動画の総合点だけでなく、constraintごとのpass/failを残す。たとえば商品ロゴが変わる失敗は、映像の美しさが高くても公開不可である。

モデルのリリース文書には2026年6月30日リリース、2027年6月30日退役予定が示されている。preview IDの挙動変更や後継モデル移行を前提に、model IDを設定化し、同一評価セットを複数モデルで実行できるようにする。[Gemini 3.5 Flash APIのstable運用](/blog/google-gemini-35-flash-api-stable-agents-2026/)と同じく、previewを暗黙に本番標準へしないことが重要だ。

## セキュリティ: 生成APIの権限を制作素材全体へ広げない

参照素材をCloud Storageから渡す構成では、生成サービスのservice accountに素材バケット全体の閲覧権限を与えたくなる。しかし、案件ごとに機密度と契約条件が違う。入力用の一時領域へ承認済み素材だけをコピーし、生成サービスにはそのprefixまたは専用bucketだけを見せるほうが安全である。

未公開商品、出演者素材、顧客提供映像、社内限定映像を同じ保存先へ置かない。ログへprompt全文やsigned URLを無条件に残さない。案件ID、asset ID、policy decision、モデルID、費用はログ化しつつ、機密データは別のアクセス制御へ置く。

ユーザー入力をそのまま生成プロンプトにするプロダクトでは、禁止用途と権利侵害を事前・事後の両方で検査する。入力検査だけでは、生成モデルが意図しない人物、ロゴ、文言を出す可能性を止められない。出力検査だけでは、権利のない素材をすでに外部処理へ送ってしまう。両方が必要だ。

日本企業の社内PoCでも、production dataを使う必要はない。最初は自社で権利を保有する架空商品、許諾済み出演者、合成音声、公開済み素材で評価し、機能と運用が安定してから実データ範囲を広げる。

## 運用判断: 本番化のgateを数値で定義する

PoC終了条件は「動画が作れた」ではなく、既存工程と比較できる数値にする。たとえば次のgateを置ける。

- 固定評価セットの重大失敗率が5%未満
- 1採用動画あたりの生成費が予算内
- 人間の修正時間が既存工程より30%以上短い
- 権利確認と承認記録が全件で追跡可能
- C2PA検証と原本hash保存が全件成功
- quota不足・API失敗時に二重課金や重複公開が起きない
- preview model停止時に手動工程へ戻せる

API呼び出しにはidempotencyに相当する自社job keyを持たせ、timeout後に無条件で再生成しない。provider側で処理が継続している可能性があるため、ジョブ状態を確認できない場合も、同じcreative taskへ新しいgeneration attempt IDを採番し、重複費用を可視化する。

また、利用部門へ秒単価だけを見せない。「8秒×4案」「過去の採用率」「見積もり費用」「案件残予算」を生成前に示す。月次では部門、案件、用途、利用者ごとの生成秒数と採用率を確認し、低採用率の用途は停止またはprompt改善へ戻す。

## 結論: 動画モデルではなく、制約付き生成サービスとして導入する

Gemini Omni Flashは、テキスト、画像、動画、音声を参照し、音声付き動画の生成と会話型編集を1つのモデルで扱う。1秒0.10ドルという明確な価格、C2PAとSynthID、global availabilityは、APIを使った短尺制作機能を試す材料になる。

一方で、最大10秒、720p、2つのアスペクト比、function callingやbatch inference非対応、preview IDという制約がある。長尺制作基盤や無人公開agentとして設計する段階ではない。

実装では、入力素材の権利確認、秒数と案数のbudget reservation、生成ジョブ、決定的な自動検査、人間承認、公開を分離する。評価では日本語、商品形状、人物、音声同期、時間的一貫性を固定セット化する。監査ではC2PAだけに依存せず、asset ID、prompt version、model ID、hash、承認をつなぐ。

この境界を先に作れば、後継モデルへ差し替えるときも制作業務全体を作り直さずに済む。日本企業が今評価すべきなのは、Omni Flashの最良デモではなく、再生成を含む総費用と、公開可能な品質へ到達するまでの工程である。

## 出典

- [Bringing speed and strong cost performance to the market with Gemini Omni Flash and Nano Banana 2 Lite](https://cloud.google.com/blog/products/ai-machine-learning/nano-banana-2-lite-and-gemini-omni-flash-available) - Google Cloud
- [Gemini Omni Flash Preview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/omni-flash-preview) - Google Cloud Documentation
- [Agent Platform Pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) - Google Cloud
- [Gemini Omni](https://deepmind.google/models/gemini-omni/) - Google DeepMind
