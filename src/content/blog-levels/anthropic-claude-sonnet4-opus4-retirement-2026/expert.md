---
article: 'anthropic-claude-sonnet4-opus4-retirement-2026'
level: 'expert'
---

Claude Sonnet 4 と Claude Opus 4 の retirement は、モデル表の小さな更新に見える。しかし日本企業の運用では、API 依存、社内LLMゲートウェイ、Claude Code、クラウド経由、評価基盤、委託先 PoC を横断する変更として扱うべきだ。Anthropic の model deprecations ドキュメントでは、両モデルの direct Anthropic API retirement date が 2026年6月15日と整理されている。つまり、この記事を書いている時点では、すでに期限後である。

[Claude Opus 4.1廃止、8月5日移行の実務手順](/blog/anthropic-claude-opus-41-retirement-2026/) と混同してはいけない。Opus 4.1 は 8月5日に向けた移行計画の話だった。今回の Sonnet 4 / Opus 4 は、6月15日を過ぎた後の残存確認である。さらに [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) で扱ったように、Anthropic の上位モデルと Claude Code の実行設計はすでに次の段階へ移っている。

企業導入では、モデルの退役は「動かなくなる可能性がある API 名」だけの問題ではない。[Claude Code Auto mode、クラウド経由運用の要点](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、モデル選択は認証、クラウド契約、ログ、費用配賦、管理者ポリシーと結びつく。古いモデルIDが一か所でも残れば、期限後の障害、説明不能な品質差、監査証跡の欠落につながる。

## 事実整理: 6月15日は計画日ではなく到達済みの期限

Anthropic の model deprecations ページは、Claude Sonnet 4 と Claude Opus 4 について、direct Anthropic API の retirement date を 2026年6月15日としている。表は direct API と、AWS Bedrock や Google Vertex AI などのクラウド経由を分ける構成になっている。ここから分かるのは、確認すべき単位がモデル名だけではなく、提供経路でもあるということだ。

Anthropic の models overview では、現行モデルの系統、用途、コンテキスト、価格、ツール利用などを見比べられる。Sonnet 4 / Opus 4 の退役は、Claude 全体から離れる話ではない。旧モデルの固定指定を、現行の Sonnet、Opus、Haiku 系モデルへ用途別に移す話である。Migrating to Claude 4 のドキュメントも、モデル間の挙動差を踏まえた移行確認の必要性を示す。

重要なのは、6月15日を過ぎた後に「まだ動いているように見える」ケースをどう扱うかだ。クラウド経由、キャッシュ、プロキシ、社内 alias、低頻度ジョブの組み合わせによって、表面上は問題が見えないことがある。しかし、retirement 日を過ぎたモデル指定は、いつ失敗してもおかしくない運用負債として扱うべきである。

## 事実整理: Sonnet 4とOpus 4では影響面が違う

Sonnet 4 は、日常的な開発支援、要約、分類、社内検索、問い合わせ下書き、軽めのコード補助で使われていた可能性が高い。影響は広く浅い。多くのチームが少しずつ使っているため、中央チームが把握していない Shadow AI 的な利用が残りやすい。

Opus 4 は、長い文脈、複雑なコード調査、セキュリティ分析、エージェント実行、役員向け資料生成のような高価値タスクに使われていた可能性がある。影響は狭く深い。利用量は少なくても、止まったときの業務影響が大きい。

この違いは、代替モデルの選び方にも出る。Sonnet 4 の用途は、Sonnet 4.6 系や他の現行中位モデルへ移して、コストと品質のバランスを確認する。Opus 4 の用途は、Opus 4.8 などの上位モデルへ移し、長時間実行、ツール呼び出し、レビュー負荷、失敗時の停止条件を評価する。単純に「全部 Opus 4.8」へ寄せると、コストや権限が膨らむ。逆に「全部 Sonnet 系」へ寄せると、高難度タスクの品質が落ちる可能性がある。

## 分析: モデルIDはコードより外側に残る

ここからは分析だ。

Sonnet 4 / Opus 4 retirement で最も危ないのは、GitHub のコード検索だけで対応完了とすることだ。モデル指定は、コードより外側に残ることが多い。環境変数、Secrets、Kubernetes ConfigMap、Helm values、Terraform variables、GitHub Actions secrets、社内管理画面、Notebook、prompt registry、eval runner、SaaS connector、デモ環境、社内研修資料、委託先のサンプルに散る。

さらに、企業はモデルIDを抽象化する。`claude-default`、`claude-standard`、`opus-prod`、`sonnet-fast` のような alias は、利用者には便利だが、退役対応ではリスクになる。alias の実体が Sonnet 4 や Opus 4 のままなら、利用者は古いモデルを呼んでいることに気づけない。社内LLMゲートウェイでは、alias の解決先、変更履歴、承認者、影響チーム、切替日時を監査できる必要がある。

また、Claude Code のような開発者向けツールでは、ローカル設定と組織設定が混ざる。[Claude CodeのfallbackModel権限制御](/blog/claude-code-fallback-model-permission-hardening-2026/) で扱ったように、fallbackModel や管理設定は、通常時ではなく例外時に効く。退役済みモデルが fallback に残っていると、主モデル障害時に初めて問題が出る。これは障害対応中に別の障害を起こす設計であり、優先して潰すべきだ。

## 点検手順: ログ、設定、評価、通知を分ける

第一に、実利用ログを見る。直近 30 日、可能なら 90 日で、Sonnet 4 / Opus 4 相当のモデルIDが呼ばれていないかを確認する。部署、プロジェクト、API key、クラウドアカウント、リージョン、利用量、エラー率を合わせて見る。ログで見つかったものは、今動いている影響範囲である。

第二に、静的検索を行う。リポジトリ、IaC、CI、Secrets 管理、社内SDK、Notebook、Runbook、Notion / Confluence、研修資料、サンプルコードを対象にする。正式IDだけでなく、`Sonnet 4`、`Opus 4`、`claude-sonnet`、`claude-opus`、社内 alias、旧称も検索する。静的検索で見つかったものは、低頻度や非常時に動く影響範囲である。

第三に、評価基盤を更新する。golden dataset、prompt eval、batch replay、品質比較表が Sonnet 4 / Opus 4 を基準にしていると、移行後の評価が成立しない。旧モデルを比較対象として残したい場合も、retirement 後に再実行できない前提で、過去ログの固定値として保存するほうがよい。

第四に、利用者通知を行う。AI推進部門だけでなく、開発チーム、情シス、クラウド管理者、法務、セキュリティ、委託先に分けて伝える。通知文では、退役済みモデル名、対象経路、確認期限、代替候補、問い合わせ先、切り戻し方針を明確にする。単なるニュース共有では、現場の設定変更に落ちない。

## クラウド経由: Bedrock / Vertex / Foundry は別表で見る

Anthropic 直結の API では、model deprecations の direct API retirement date を起点にすればよい。しかし、AWS Bedrock、Google Vertex AI、Microsoft Foundry、社内プロキシを使う場合は、別の確認表が必要になる。

Bedrock では、利用リージョン、model access、inference profile、IAM、CloudTrail、VPC 境界、請求タグを確認する。Vertex AI では、プロジェクト、リージョン、モデル名、IAM、監査ログ、データ境界を確認する。Foundry や社内ゲートウェイでは、モデル alias、ルーティング、監査ログ、利用上限、承認フローを見る。

この確認は、単に「代替モデルが使えるか」では足りない。代替モデルが使えても、社内承認済みモデル一覧に入っていない、リージョンが違う、ログ項目が変わる、費用配賦タグが付かない、既存のプロンプト評価を通っていない、ということがある。日本企業ではクラウド統制や委託先管理が強く効くため、モデル移行は技術変更とガバナンス変更の両方になる。

## 移行評価: 性能、コスト、権限を同時に見る

Sonnet 4 から Sonnet 4.6 系へ移す場合、見るべきなのは平均品質だけではない。回答の長さ、引用の正確さ、拒否の出方、ツール呼び出しの頻度、JSON 出力の安定性、レイテンシ、単価、キャッシュ効果を見る。日常処理では、少しの文体差でもレビュー工数に効く。

Opus 4 から Opus 4.8 へ移す場合は、長時間実行の総コストと権限境界が重要になる。Opus 4.8 は長い調査やコーディングエージェントに向くが、強いモデルほど、書き込み権限、外部アクセス、秘密情報、テスト実行、PR 作成の境界を明確にする必要がある。モデルだけを上げると、能力と権限のバランスが崩れる。

価格ページは、単価確認の出発点であって結論ではない。実コストは、入力長、出力長、キャッシュ、再試行、ツール呼び出し、エージェントの実行時間で決まる。移行評価では、代表タスクを replay し、1件あたりの費用、失敗率、レビュー時間、人間の手戻りを合わせて見るべきだ。

## 切り戻し: 古いモデルに戻す設計を捨てる

retirement 後の移行で、最も危険な切り戻しは「問題があれば Sonnet 4 / Opus 4 に戻す」ことだ。期限後には、その戻し先が動かない可能性がある。切り戻し先は、現行モデル、プロンプト調整、機能フラグ、人間承認、キュー保留、処理停止の組み合わせにする必要がある。

たとえば、顧客向け文案生成で Sonnet 4.6 への移行後に文体が変わった場合、古い Sonnet 4 へ戻すのではなく、テンプレートを調整し、一定期間は人間承認を増やす。コードエージェントで Opus 4.8 への移行後に不要差分が増えた場合、旧 Opus 4 へ戻すのではなく、書き込み権限を提案モードに下げ、テスト対象を限定し、レビュー gate を追加する。

この考え方は、今後の Claude モデルにも再利用できる。モデルライフサイクルは継続的に動くため、退役のたびに個別対応するのではなく、モデルID棚卸し、代替評価、クラウド経路確認、切り戻し設計、利用者通知を標準プロセス化したほうがよい。

## まとめ

Claude Sonnet 4 と Claude Opus 4 の retirement は、すでに到達済みの期限である。日本企業が今やるべきことは、古いモデルIDと alias が残っていないかを、ログ、コード、設定、評価基盤、クラウド契約、委託先まで含めて確認することだ。

代替先は用途別に分ける。日常処理は現行 Sonnet 系、長時間・高難度タスクは Opus 4.8 などを候補にし、性能、コスト、権限、監査を同時に評価する。Bedrock / Vertex / Foundry 経由では、Anthropic 直結とは別に、リージョン、ログ、データ境界、承認済みモデル一覧を確認する。

モデル退役を単なる API 名の置換で済ませると、次の退役でも同じ問題が起きる。今回の Sonnet 4 / Opus 4 対応を、Claude モデルライフサイクル管理の標準手順へ変えるべきだ。

## 出典

- [Model deprecations](https://docs.anthropic.com/en/docs/about-claude/model-deprecations) - Anthropic Docs
- [Claude models overview](https://docs.anthropic.com/en/docs/about-claude/models/overview) - Anthropic Docs
- [Migrating to Claude 4](https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4) - Anthropic Docs
- [Anthropic pricing](https://www.anthropic.com/pricing#anthropic-api) - Anthropic
