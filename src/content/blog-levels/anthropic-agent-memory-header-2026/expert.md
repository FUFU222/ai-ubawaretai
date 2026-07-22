---
article: 'anthropic-agent-memory-header-2026'
level: 'expert'
---

Anthropic の **`agent-memory-2026-07-22`** beta header は、Claude Managed Agents を試験導入している開発組織にとって、単なる header 名の変更ではない。対象は memory store endpoint、とくに `GET /v1/memory_stores/{memory_store_id}/memories` の一覧取得である。2026年7月22日には、旧 `managed-agents-2026-04-01` header でも同じ list behavior になるため、実装、同期バッチ、監査ジョブ、社内 SDK wrapper を点検する必要がある。

この論点は、個人向けメモリ機能とは分けて読むべきだ。[Claude Reflect とメモリ管理](/blog/anthropic-claude-reflect-memory-usage-dashboard-2026/) では、利用者本人が Claude の使い方を振り返る memory 前提の体験を扱った。今回の agent memory は、Claude Managed Agents がセッションをまたいで読む業務文脈である。つまり、ユーザー体験ではなくエージェント実行基盤の状態管理に近い。

管理面では、[Claude Enterprise 管理API](/blog/anthropic-claude-enterprise-user-management-api-2026/) が誰に使わせるかを扱い、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) が何が起きたかの証跡連携を扱う。Memory store はその中間にある。誰かの agent が何を覚え、次回の作業で何を前提として読むかを決めるため、導入が進むほど内部統制の対象になる。

## 事実: list behaviorは4つの点で変わる

Anthropic の release notes が示す変更は、主に4つある。

第一に、memory list の結果は安定したサーバー定義順で返る。従来の `order_by` と `order` は無視される。つまり、更新日時や path のような順序を API 側に期待している実装は、取得後に自前で並べ替える必要がある。

第二に、`depth` の許容値が絞られる。`0`、`1`、または省略だけが有効で、それ以外は `400` になる。従来の実装やテストデータで `2` 以上を使っていた場合、移行後に失敗する。とくに directory tree を段階的に読む internal tool は確認が必要である。

第三に、`path_prefix` は `/` で終わる必要がある。さらに、substring matching ではなく path segment matching になる。たとえば `/notes/` は `/notes/action.md` を対象にできるが、`/notes-archive/action.md` まで拾うような挙動は期待しないほうがよい。これは安全側の変更だが、既存の棚卸し script が広めに拾っていた場合は差分が出る。

第四に、page cursor の互換性である。header なし、または旧挙動で発行された cursor は、新 header の list behavior では使えない。移行時は最初のページから取り直す必要がある。監査バッチや nightly sync が cursor を保存している場合、移行日の一回だけ全件再取得する runbook を用意すべきだ。

## 事実: memory storeだけheaderの扱いが違う

重要なのは、`agent-memory-2026-07-22` が Managed Agents 全体の header を置き換えるわけではない点である。Anthropic の memory documentation は、Managed Agents API request では原則 `managed-agents-2026-04-01` beta header が必要だが、memory store endpoint では `agent-memory-2026-07-22` を使うと説明している。

さらに、memory store request に両方の beta header を送ると `400` になる。これは企業の共通 client で事故が起きやすい。たとえば、すべての Anthropic beta request に `managed-agents-2026-04-01` を自動付与し、個別機能で追加 header を足す実装だと、memory store だけ二重指定になる可能性がある。

SDK はこの分岐を吸収する方向へ更新されている。release notes では、Python、TypeScript、Go、Java、Ruby、PHP、C#、CLI の各 SDK が memory store call で新 header を送るとされる。したがって、公式 SDK を素直に使うならバージョン更新が第一対応になる。

しかし、企業では SDK の外側に共通処理がある。API gateway、egress proxy、observability middleware、社内 SDK wrapper、CLI wrapper、テスト用 shell script、IaC の環境変数が header を上書きしていないかを見なければならない。Anthropic SDK の更新だけを確認しても、実際の outbound request で古い header が残る場合がある。

## 分析: memoryはpromptではなく状態である

ここからは分析である。

Claude Managed Agents の memory store は、単なる prompt template ではない。Anthropic の documentation では、memory store は workspace scope の text document collection とされ、session に attach すると sandbox 内の directory として mount される。agent は file tool で読み書きし、store 内の個別 memory は path を持つ。変更は immutable memory version として残る。

この構造は、AI エージェントの実務利用に向いている。たとえば、プロジェクトの coding convention、過去の incident の教訓、顧客ごとの禁止事項、レビュー観点、ドキュメント形式、担当チームの意思決定を保存し、次回の作業で agent に読ませられる。長時間・継続型のエージェントほど、この persistent state が効く。

同時に、memory は汚染される可能性がある。untrusted input を処理する agent が read-write memory store を持つ場合、prompt injection によって悪意ある指示や誤った前提が store に書かれ、後続 session がそれを信頼する恐れがある。Anthropic の documentation も、reference material や共有 lookup では read-only を使う選択肢を示している。

[Anthropic AIネイティブSDLC](/blog/anthropic-ai-native-sdlc-security-2026/) で整理したとおり、AI が plan、code、review、monitor に入ると、速度よりも境界設計が重要になる。Memory はその境界の一つである。コード生成前の instruction、実行環境の権限、CI の gate、監査ログと同じように、memory store も制御点として扱うべきだ。

## 実装チームの移行手順

実装チームは、まず依存バージョンを固定している場所を確認する。公式 SDK の指定が lockfile、Docker image、serverless layer、internal package template、CI cache に分散している場合、アプリ本体だけ更新しても worker や batch が古いまま残る。

次に、`managed-agents-2026-04-01` の文字列検索を行う。対象は application code だけではない。GitHub Actions、Terraform、Kubernetes secret、API gateway policy、社内 proxy、curl examples、runbook、Postman collection、sandbox smoke test も含める。検索結果を session endpoint と memory store endpoint に分け、memory store だけ `agent-memory-2026-07-22` へ修正する。

3つ目は、list API の契約テストである。少なくとも、`path_prefix="/"` の全件取得、`path_prefix="/notes/"` の segment matching、`depth=1` の immediate child、無効な `depth=2` が `400` になること、`order_by` に依存しないことをテストする。既存テストが list order に依存して snapshot を取っているなら、取得後の正規化を入れる。

4つ目は、cursor migration である。保存済み cursor は移行後に捨てる。同期テーブルや job state に cursor を持つ場合、schema migration で null に戻すか、feature flag で初回全件取得を走らせる。全件取得が重いなら、memory store ごとに batch を分け、失敗時に同じ store を再取得できるよう冪等性を入れる。

5つ目は、observability である。移行後しばらくは `400` rate、memory list latency、page count、retrieved memory count、empty result の急増、redaction API の利用、write error を dashboard に出す。header 変更の失敗は、エージェントの回答品質低下として現れる前に、API error と同期差分で捕まえるほうがよい。

## 管理者とセキュリティの点検項目

管理者側の焦点は、memory store の lifecycle である。誰が store を作れるか、どの workspace に属するか、どの agent に attach されるか、read-only と read-write をどう分けるか、archive と delete を誰が承認するかを決める必要がある。

とくに read-write store は慎重に扱うべきだ。プロジェクト固有の作業状態なら read-write が必要な場面はある。しかし、全社標準、セキュリティ規約、法務テンプレート、顧客対応ポリシーのような reference material は read-only store にし、更新は人間のレビューを通すほうが安全である。

Memory version の扱いも重要である。Anthropic の documentation は、memory の mutation ごとに version が作られ、過去版を確認できると説明している。これは監査に役立つが、秘密や個人情報が入ると履歴側にも残る。redaction 手順、保存期間、export 方針、インシデント時の連絡先を決めておくべきだ。

また、memory store を通常の監査ログと混同しない。Memory は agent が次回読む作業文脈であり、すべての操作証跡を保存する SIEM ではない。利用ログは Compliance API や既存の監査基盤へ、ユーザーと権限は Admin API や IdP へ、長期作業文脈は memory store へ、と役割を分ける必要がある。

## 日本企業での導入パターン

最初の導入では、共有 reference store とプロジェクト store を分けるのが現実的である。共有 reference store には社内 coding guideline、禁止事項、レビュー観点、文書形式を置き、read-only で attach する。プロジェクト store には未完了タスク、決定ログ、既知の制約、次回引き継ぎを置き、限定された agent だけ read-write にする。

次に、store の命名規則を決める。部署名、プロジェクト名、データ分類、環境、owner、保存期間を含める。`demo-memory` のような名前が本番に残ると、後から誰の何の文脈か分からない。日本企業では異動や組織変更が多いため、owner と lifecycle を metadata で追えるようにしたほうがよい。

3つ目に、保存禁止情報を明確にする。アクセストークン、顧客秘密、個人情報、人事評価、未公開決算、法務未承認の判断、医療・金融・労務相談、脆弱性 exploit 手順の詳細は、memory に残すべきではない。必要なら専用システムの参照リンクや ticket ID だけを残す。

4つ目に、memory review を定例化する。月次で store の一覧、recent versions、redaction の有無、read-write store の増加、archive されていない古い store を確認する。AI エージェントの品質改善会議では、プロンプトだけでなく memory の中身も見るべきだ。古い決定が残っていれば、次回の agent 出力も古くなる。

## まとめ

`agent-memory-2026-07-22` への移行は、Claude Managed Agents の memory store を本番運用に近づけるチームにとって、API 互換性、SDK 更新、同期再取得、監査設計をまとめて確認するタイミングである。header 名だけを置き換えると、session endpoint との分岐、二重 beta header、cursor 非互換、list order 依存を見落としやすい。

日本企業が見るべき本質は、エージェントの memory を「便利な長期文脈」ではなく「監査可能な業務状態」として扱えるかである。何を覚え、誰が書き、誰が読み、いつ消し、どの履歴で説明するか。Claude Managed Agents の価値は、そこまで設計して初めて本番業務に近づく。

## 出典

- [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) - Anthropic Docs, 2026-07-02
- [Using agent memory](https://platform.claude.com/docs/en/managed-agents/memory) - Anthropic Docs
- [Beta headers](https://platform.claude.com/docs/en/api/beta-headers) - Anthropic Docs
