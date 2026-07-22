---
title: 'Claude Agent Memory移行、SDKと監査の点検線'
description: 'Claude Managed AgentsのMemoryヘッダー変更を整理。日本企業がSDK更新、明示beta header、ページング再取得、監査ログをどう点検すべきか実務目線で解説する。'
pubDate: '2026-07-23'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIエージェント', 'API', '監査ログ', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Platform release notes は、Claude Managed Agents の memory store まわりで **`agent-memory-2026-07-22`** beta header を追加し、2026年7月22日に旧 `managed-agents-2026-04-01` header でも memory list の挙動が同じになると説明している。対象は `GET /v1/memory_stores/{memory_store_id}/memories` の一覧取得で、SDK も新しい header を送るよう更新されている。

これはモデル性能のニュースではないが、Claude Managed Agents を業務エージェント基盤として試している日本企業には実装影響がある。[Claude Reflect とメモリ管理](/blog/anthropic-claude-reflect-memory-usage-dashboard-2026/) は利用者本人の長期文脈を扱う話だった。今回の更新は、API 側の memory store をどう列挙し、どう監査し、どう移行するかという開発・運用の話である。

同じ Anthropic 管理面では、[Claude Enterprise 管理API](/blog/anthropic-claude-enterprise-user-management-api-2026/) がユーザーと権限の棚卸しを扱い、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) がログ連携を扱った。Memory store は、その間にある「エージェントが覚え、次回のセッションへ持ち越す情報」の管理面だ。AI エージェントが継続作業をするほど、ここは単なる便利機能ではなく監査対象になる。

## 事実: 7月22日にmemory listの挙動が変わる

Anthropic の release notes では、`agent-memory-2026-07-22` beta header によって memory listing の挙動が変わると整理されている。結果は安定したサーバー定義順で返り、従来の `order_by` と `order` は無視される。`depth` は `0`、`1`、または省略だけが有効になり、それ以外は `400` になる。`path_prefix` は `/` で終わる必要があり、単純な部分文字列ではなく path segment 単位で一致する。

加えて、header なしで発行された page cursor は、新 header の list 挙動では使えない。移行時には途中ページから再開せず、最初のページから取り直す必要がある。これは地味だが、同期バッチや監査ジョブでは重要である。毎日差分だけを読む実装、ページカーソルを保存している実装、ディレクトリ別に memory を棚卸しする実装は、移行時に再取得計画を入れなければならない。

Anthropic は memory store endpoint では `agent-memory-2026-07-22` が `managed-agents-2026-04-01` を置き換えるとも説明している。両方を同時に送ると `400` になる。つまり、安全策として beta header を全部まとめて送るような実装は、memory store では逆に壊れる可能性がある。

## 事実: SDK更新だけで済まない場合がある

release notes によると、Python、TypeScript、Go、Java、Ruby、PHP、C#、CLI の各 SDK は、memory store call で `agent-memory-2026-07-22` を送るよう更新された。SDK を素直に使い、betas を明示していないコードなら、依存バージョンを上げることが主な対応になる。

問題は、企業の実装では SDK の標準挙動だけに任せていないことが多い点だ。共通 API client で `anthropic-beta` を固定している、proxy で header を足している、IaC や社内 SDK wrapper で beta 名を環境変数化している、テスト用 curl が古い header を直接送っている、といった構成は珍しくない。

この場合、移行の焦点は「SDK を上げたか」ではなく、「memory store request だけ beta header の扱いを分けられるか」になる。Managed Agents の session endpoint は引き続き `managed-agents-2026-04-01` を使う。一方、memory store endpoint では `agent-memory-2026-07-22` を使う。エージェント基盤を横断する薄い wrapper があるほど、endpoint ごとの header 分岐をテストする必要がある。

## 分析: 日本企業ではmemoryを監査対象として扱う

ここからは分析だ。

Claude Managed Agents の memory store は、セッションをまたいで agent が使う情報を保存する仕組みである。Anthropic の memory documentation は、memory store を workspace scope の text document collection と説明し、session に attach すると sandbox 内の directory として mount されると案内している。agent は通常の file tool で読み書きし、変更は memory version として残る。

この設計は、業務エージェントにとって強力である。プロジェクト規約、過去の失敗、顧客別の注意点、レビュー観点、ドキュメント形式、担当者の好みを次回セッションへ持ち越せる。しかし、同じ理由で、memory は情報分類、保存期間、アクセス権、削除、監査の対象になる。

[Anthropic AIネイティブSDLC](/blog/anthropic-ai-native-sdlc-security-2026/) で見たように、AI が開発工程へ深く入るほど、指示、生成、レビュー、承認、監視のログを分ける必要がある。Memory store は、その中でも「AI が次回も前提として読む情報」である。誤った前提、古い運用判断、機密情報、プロンプトインジェクションで書き込まれた悪意ある内容が残れば、次のセッションの出力を汚染する。

したがって、日本企業が見るべきポイントは、新しい header 名だけではない。memory store を誰が作れるか、どの agent に attach するか、read-only と read-write をどう分けるか、version history をどう点検するか、削除や redaction をどの手順に入れるかである。

## 移行チェックリスト

第一に、SDK と CLI のバージョンを棚卸しする。release notes に出ている最小バージョン以上へ上げられるか、社内 wrapper が SDK の beta namespace をそのまま通しているかを確認する。複数言語で agent tooling を作っている組織では、TypeScript だけ更新して Python バッチが残るような差が起きやすい。

第二に、明示 beta header を検索する。`managed-agents-2026-04-01` をソースコード、CI 設定、API gateway、proxy、curl script、runbook、secret store、Terraform 変数、社内 SDK に対して検索する。memory store request で古い header を直接送る実装があれば、`agent-memory-2026-07-22` へ置き換える。ただし session endpoint まで一括置換しない。

第三に、一覧取得のテストを作り直す。`path_prefix` は `/notes/` のように slash で終える。`/notes` や部分一致を期待する実装は修正する。`depth` は `0`、`1`、省略だけを許す。`order_by` や `order` に依存して差分同期していたなら、安定順の全件取得と自前の並べ替えに寄せる。

第四に、page cursor を捨てる移行日を決める。header 移行前に保存した cursor は再利用できないため、7月22日以降の初回実行では最初のページから取り直す。バッチが大量 memory store を読む場合は、実行時間、rate limit、再実行時の冪等性を先に確認する。

第五に、memory version の監査を運用に入れる。Anthropic の documentation は、memory mutation ごとに immutable version が作られ、過去版の確認や redaction ができると説明している。これは便利な履歴である一方、秘密や個人情報が入った場合には履歴にも残る。保存してよい情報、保存してはいけない情報、漏えい時の redaction 手順を決める必要がある。

## まとめ

`agent-memory-2026-07-22` は小さな beta header 変更に見える。しかし、Claude Managed Agents を本番に近づける企業では、memory list の挙動、SDK 更新、明示 header、page cursor、path_prefix、depth、version history のすべてが運用に関わる。

日本企業は、この更新を単なる API 互換性対応ではなく、エージェントの長期記憶を監査可能にする契機として扱うべきだ。AI がセッションをまたいで働くほど、何を覚え、誰が読め、いつ消し、どの履歴で説明できるかが導入品質を左右する。

## 出典

- [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) - Anthropic Docs, 2026-07-02
- [Using agent memory](https://platform.claude.com/docs/en/managed-agents/memory) - Anthropic Docs
- [Beta headers](https://platform.claude.com/docs/en/api/beta-headers) - Anthropic Docs
