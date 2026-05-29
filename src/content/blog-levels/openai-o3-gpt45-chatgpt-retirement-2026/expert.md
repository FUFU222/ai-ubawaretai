---
article: 'openai-o3-gpt45-chatgpt-retirement-2026'
level: 'expert'
---

OpenAI の 2026年5月28日付 ChatGPT Release Notes は、GPT-5.5 Instant の品質調整、Canvas の扱い変更、OpenAI o3 / GPT-4.5 の ChatGPT 退役予定を同じ流れで示した。個別に見ると小さなリリースノートだが、enterprise ChatGPT operations の観点では、モデルライフサイクル管理が明確に必要になってきた更新である。

今回のポイントは、新しい能力の追加ではなく、古い選択肢と古い作業面の整理だ。OpenAI は GPT-5.5 Instant と GPT-5.5 Thinking で Canvas を利用できなくし、writing blocks と code blocks へ寄せる。さらに、OpenAI o3 を 2026年8月26日、GPT-4.5 を 2026年6月27日に ChatGPT から退役させる予定を示した。OpenAI は、この変更が ChatGPT のみに適用され、API には変更がないとも説明している。

この更新は、[GPT-5.5 InstantでChatGPT標準運用はどう変わるか](/blog/openai-gpt-55-instant-chatgpt-default-2026/)の続きとして読むべきだ。5月5日の更新は、標準モデルが GPT-5.5 Instant へ移る話だった。5月28日の更新は、その標準化に合わせて、ChatGPT のモデル棚、編集体験、legacy access を整理する話である。さらに、[OpenAI新セキュリティ設定でChatGPTとCodex運用はどう変わるか](/blog/openai-advanced-account-security-codex-2026/)で扱ったアカウント保護や、[OpenAI Skills統制、ChatGPT企業導入の監査設計](/blog/openai-chatgpt-skills-governance-compliance-2026/)で扱った reusable workflow governance と同じ方向にある。

## 事実: ChatGPT側のモデル棚が整理される

OpenAI は 2026年5月28日の release notes で、GPT-5.5 Instant の応答品質を更新したと説明している。読みやすさ、自然さ、実務支援のペースを改善し、過度に長い回答や bullet-heavy な回答を減らす方向である。これは品質改善だが、企業側から見ると output contract の変更でもある。社内プロンプトや業務テンプレートが、特定の長さ、箇条書き、構成を暗黙に期待している場合、モデル更新だけで成果物の形が変わる。

Canvas の扱いはさらに運用影響が大きい。OpenAI は、この更新により GPT-5.5 Instant と GPT-5.5 Thinking で Canvas が利用できなくなると説明している。writing and coding functionality は chat responses の writing blocks と code blocks でサポートされる。有料ユーザーは legacy models が sunset されるまで限定的に Canvas を使えるが、これは恒久的な運用面ではない。

モデル退役については、OpenAI o3 が 2026年8月26日、GPT-4.5 が 2026年6月27日に ChatGPT から退役予定である。o3 は 90日、GPT-4.5 は 30日の sunset period を持つ。どちらも paid users が model settings からアクセスできるモデルとして扱われている。OpenAI は、今回の退役が ChatGPT only であり、API changes はないと明記している。

この明記は重要だ。ChatGPT Enterprise / Business の現場利用、個人利用、GPTs、Canvas を使った編集作業は影響を受ける。一方、API production workload は今回のリリースだけで強制移行されるわけではない。つまり、影響評価は「OpenAI 全体」ではなく「ChatGPT UI / workspace operations」として切るべきである。

## 既存運用で壊れやすい箇所

日本企業の ChatGPT 利用で壊れやすいのは、明示的なアプリケーションコードよりも、非公式な運用知である。API アプリケーションなら、モデル名は設定ファイルや環境変数に残る。テストも置きやすい。しかし ChatGPT の現場利用では、「この作業は o3 がよい」「長文は GPT-4.5 で」「Canvas に貼って直す」という知識が、研修資料、Slack、Notion、社内 wiki、担当者の口頭説明に散る。

ここが退役時に問題になる。モデル選択 UI から選べなくなったとき、現場は代替モデルを探す。代替が決まっていなければ、利用者ごとに違うモデルを使い、成果物の品質が揺れる。法務レビューや採用文面、営業提案、経営会議資料の下書きのように成果物が社外・上位者へ出る業務では、こうした揺れは無視しにくい。

Canvas も同様だ。Canvas は、長文やコードを別ペインで編集するというメンタルモデルを作っていた。writing blocks と code blocks へ移ると、同じ「編集」でも操作説明、スクリーンショット、レビュー手順が変わる。社内研修が Canvas 前提なら、ユーザーは「どこを開けばよいか」で止まる。これはモデル性能の問題ではなく、enablement の問題である。

GPTs と Skills も影響を受ける。GPTs が内部でどのモデルを使うか、利用者向け説明が古いモデル名を前提にしていないか、Canvas を使う手順を含んでいないかを確認する必要がある。Skills については、OpenAI が admin Skills page、permissions、upload scanning、compliance logs を追加したばかりであり、今後は AI workflow 自体を棚卸し対象として扱う必要がある。

## モデル名ではなく用途で管理する

実務上の解は、モデル名に依存した社内手順を減らすことだ。もちろん、検証や高度な用途ではモデル名は必要である。しかし利用者向けの手順書では、まず用途で分類したほうが長持ちする。

たとえば、日常的な文章整理、要約、翻訳、軽い調査は Instant に寄せる。論点整理、難しい比較、規程や契約に近いレビューは Thinking に寄せる。最終判断前の高精度チェックや複雑な多段推論は Pro に寄せる。ここで重要なのは、具体的なモデル名ではなく「どのリスクの作業か」を基準にすることだ。

この分類を作っておくと、o3 や GPT-4.5 のようなモデルが退役しても、社内手順は壊れにくい。新しいモデル名が入っても、「この用途は Thinking 相当で再評価する」という形で更新できる。モデル名を手順の中心に置くのではなく、評価軸の中に置く。

API チームには別の管理が必要だ。今回 API changes はないため、API 本番の移行は不要である。ただし ChatGPT と API の両方を使うチームでは、ユーザーが ChatGPT で試した結果を API 実装に持ち込むことがある。ChatGPT 側の model behavior が変わると、プロンプト評価の基準がずれる可能性がある。検証データセット、固定モデル、`chat-latest` の利用方針を分けておくべきだ。

## Canvas移行はUI変更ではなく作業証跡の変更

Canvas から writing / code blocks への移行は、単なる UI の見た目変更ではない。作業証跡の残り方、レビューの仕方、再利用の仕方が変わる。

Canvas 前提の運用では、1つのまとまった編集対象を開き、そこへ修正を重ねるイメージが強い。writing blocks / code blocks 前提では、会話の中に生成物がブロックとして現れ、必要に応じてコピー、編集、再生成、差し替えを行う。プロンプト、出力、修正指示が同じ会話文脈に残るため、レビューしやすい面もある。一方、長い文章や複数ファイルの編集では、どれが最新版かを見失いやすい。

日本企業で見るべきなのは、成果物の最終管理場所だ。ChatGPT 内で生成した文書をそのまま最終成果物にするのか、Google Docs、Word、社内 wiki、GitHub、Notion へ移すのか。Canvas がなくなるなら、ChatGPT 内の編集面に依存せず、最終成果物は正式な文書管理先へ移す流れを明確にしたほうがよい。

コードについても同じだ。code blocks は短いサンプルや差分説明には向くが、本格的な変更は Codex、IDE、GitHub PR、CI の管理下に置くべきである。これは [OpenAI Codex Goalモード、長時間開発運用の新基準](/blog/openai-codex-goal-appshots-browser-2026/) で扱った、長時間作業と検証の話につながる。ChatGPT の code block は発想や説明の場、Codex やリポジトリは実装と検証の場、と分けたほうが監査しやすい。

## 退役期限ごとの対応

GPT-4.5 の退役予定日は 2026年6月27日であり、猶予は短い。GPT-4.5 を使っている部署があるなら、6月上旬には棚卸しを始めるべきだ。確認項目は、利用業務、代替候補、出力比較、資料修正、利用者周知である。特に「高品質な文章作成」や「企画の壁打ち」で GPT-4.5 を指定している場合、GPT-5.5 Instant、Thinking、Pro のどれで代替するかを決める。

OpenAI o3 の退役予定日は 2026年8月26日で、猶予は長い。こちらは複雑な推論、数理、コード、分析、戦略検討で使われている可能性がある。単純な置換ではなく、重要業務をいくつか選び、出力品質、推論過程の説明、引用や根拠の扱い、再現性を比較するのがよい。o3 を「困ったら使う最後のモデル」としていた組織ほど、代替基準を明文化したい。

Canvas については、モデル退役よりも教育資料の修正が先である。研修資料、利用ガイド、スクリーンショット、FAQ、動画教材を検索し、Canvas 依存箇所を writing blocks / code blocks または外部文書管理ツールへ置き換える。期限付き legacy access に頼ると、研修後に UI が変わって混乱する。

API については、今回の退役告知をもって即時変更しない。ただし、社内から「o3 がなくなるなら API も止まるのか」という質問が出る可能性は高い。OpenAI の説明では API 変更なし、という一次情報を添えて周知する。API 側のモデルライフサイクルは、別途 OpenAI Platform の model docs、deprecation notice、pricing を見て管理する。

## 日本企業向けの実装手順

第一段階は、検索である。社内 wiki、Notion、Google Drive、Slack、GitHub、研修資料から `o3`、`GPT-4.5`、`Canvas`、`legacy model` を検索する。検索結果は、業務影響あり、教育資料のみ、古い雑談、技術メモのように分類する。

第二段階は、影響度の採点である。外部提出物、法務・金融・医療・人事、顧客対応、コード変更、社内意思決定に近いものを高リスクにする。単なる個人メモや任意の壁打ちは低リスクでよい。全件を同じ熱量で直すと進まない。

第三段階は、代替モデルの評価である。高リスク業務ごとに、既存プロンプトを GPT-5.5 Instant、Thinking、Pro で実行し、正確性、抜け漏れ、長さ、構造、表現リスクを比較する。必要なら prompt 側を修正する。モデル移行はモデルだけでなく、プロンプトも同時に変わることが多い。

第四段階は、owner と期限の付与である。GPTs、Skills、プロンプト集、研修資料には owner、最終確認日、次回確認期限を付ける。これは大げさなプロセスではなく、AI 利用が業務標準に近づいたための最低限の台帳である。

第五段階は、周知である。ChatGPT 利用者には「GPT-4.5 は 6月27日、o3 は 8月26日退役予定」「API 変更ではない」「Canvas 前提の手順は更新する」と短く伝える。開発者には「API は別管理」「`chat-latest` と固定モデルは評価方針を分ける」と伝える。

## ベンダー評価としての意味

今回の更新は、OpenAI のモデルライフサイクル運用を評価する材料にもなる。OpenAI は 30日、90日という sunset period を示し、ChatGPT only / no API changes の境界を明示した。これは利用者にとって重要な情報開示である。一方で、ChatGPT の UI 機能とモデル機能が密接に変わるため、企業側の追従負荷は小さくない。

AI ベンダー評価では、単に最強モデルがあるかではなく、退役告知の明確さ、移行期間、API と UI の差分説明、管理者向けログ、モデル指定の安定性、教育資料の更新しやすさを見るべきだ。ChatGPT は現場利用が広いぶん、モデル退役の影響が SaaS の UI 変更に近い形で現れる。

日本企業では、これを契約・調達だけの問題にしないほうがよい。情シス、AI 推進、法務、開発、人材育成が同じ棚卸し表を見るべきだ。モデル名、用途、部門、owner、リスク、代替、検証日を持てば、次の退役やモデル更新でも慌てにくくなる。

## まとめ

OpenAI の 2026年5月28日更新は、GPT-5.5 Instant の出力調整、Canvas 非対応、OpenAI o3 / GPT-4.5 の ChatGPT 退役予定を示した。API 変更ではないが、ChatGPT を業務で使う日本企業には十分な影響がある。

重要なのは、モデル名そのものではなく、モデル名や Canvas に依存した社内運用を見つけることだ。GPT-4.5 は 2026年6月27日、o3 は 2026年8月26日という期限がある。社内資料、GPTs、Skills、研修、プロンプト集を検索し、影響の大きいものから代替モデルと手順を決める。ChatGPT のモデル整理は今後も続く。今のうちに、モデルライフサイクルを軽量に管理する習慣を作っておきたい。

## 出典

- [ChatGPT Release Notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) - OpenAI Help Center, 2026-05-28
- [GPT-5.5 Instant: smarter, clearer, and more personalized](https://openai.com/index/gpt-5-5-instant/) - OpenAI, 2026-05-05
- [GPT-5.3 and GPT-5.5 in ChatGPT](https://help.openai.com/en/articles/11909943-gpt-52-in-chatgpt) - OpenAI Help Center
- [What is the ChatGPT model selector?](https://help.openai.com/en/articles/7864572) - OpenAI Help Center
