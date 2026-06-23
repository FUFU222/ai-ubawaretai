---
article: 'google-adk-a2a-cross-language-agents-2026'
level: 'expert'
---

Google の **Build Cross-Language Multi-Agent Team with Google's Agent Development Kit and A2A** は、ADK と A2A を使って heterogeneous な multi-agent system を組む実装記事である。記事の表面だけを見ると、Python orchestrator が Go agent を呼ぶサンプルに見える。しかし実務上の価値は、AI agent を言語、チーム、責任境界で分けるときの通信契約をどう扱うかにある。

この更新は、Google の agent 基盤シリーズの中でも重要な位置にある。[Google ADK for Android](/blog/google-adk-kotlin-android-agents-2026/) は、ADK がモバイルアプリ実装へ広がる話だった。[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) は、隔離 Linux 環境や Interactions API を含む agent 実行基盤の話だった。[Gemini Code Assist の Antigravity 移行](/blog/google-antigravity-code-assist-migration-2026/) は、開発者の操作面を agent platform へ寄せる話だった。今回の ADK + A2A は、それらの agent を複数チーム・複数言語で連携させる層として読める。

日本企業では、既存システムが Java、Go、Python、TypeScript、.NET などに分かれ、業務部門、開発基盤、委託先、グループ会社で所有者も分かれている。AI agent を導入するためにすべてを Python の LLM application に寄せるのは非現実的だ。A2A は、こうした混在環境で agent を分散させ、公開契約でつなぐ選択肢になる。

## 事実: RemoteA2aAgentで異言語agentを呼ぶ

Google Developers Blog の記事は、ADK と A2A を使って cross-language multi-agent team を構築する例を示している。Python 側では `RemoteA2aAgent` を使い、remote A2A-compliant agent をローカルの agent graph に組み込む。SDK は Agent Card handshake、parameter serialization、JSON-RPC network requests を扱い、実装者は remote agent を一つの collaborator として扱える。

例では、Go agent が A2A server として公開され、Python の extraction agent / orchestrator がその agent を呼ぶ。これは、すべての処理を Python に書き直すのではなく、Go の既存ロジックや性能特性を保ったまま、ADK の multi-agent pipeline に入れる設計である。

Google ADK docs では、ADK と A2A を組み合わせることで、異なる agent が安全かつ効率的に communication / collaboration できる multi-agent system を作れると説明している。quickstart は exposing と consuming に分かれ、Python、Go、Java の例が用意されている。これにより、agent を公開する側と利用する側の責務を分けて学べる。

A2A Protocol docs は、A2A の位置づけを明確にしている。A2A は ADK や LangGraph のような agent development kit ではない。MCP の置き換えでもない。A2A は agent-to-agent communication の層であり、MCP は agent-to-tool communication の層である。したがって、A2A を導入するかどうかは、システム境界を tool と見るか agent と見るかの設計判断に関わる。

## Agent CardはAPI契約として扱う

multi-agent system で最初に壊れやすいのは、自然言語出力ではなく契約である。どの agent がどの capability を公開するか。入力 schema は何か。戻り値は構造化されているか。error はどの形で返るか。timeout は誰が持つか。version はどう上げるか。これらを曖昧にしたまま LLM の柔軟性に期待すると、PoC では動いても本番運用で破綻する。

Agent Card は、その契約を置く中心になる。API Gateway や OpenAPI spec と同じく、agent が公開する能力を利用者に示す。ここに owner、version、認証方式、input / output、利用制限、SLA、deprecated field、ログ方針をどう含めるかが、企業導入では重要になる。

特に日本企業では、内製チームと委託先が混在する。ある vendor が作った agent を別 vendor の orchestrator が呼ぶ場合、口頭の仕様では足りない。Agent Card と契約テストをセットにし、breaking change を検出できるようにするべきだ。

この点は [Google Jules のプロアクティブ評価](/blog/google-jules-proactive-coding-agent-eval-2026/) ともつながる。agent の出力が判断や洞察を含む場合、単に「呼べた」だけでは足りない。どの agent がどの evidence に基づいて何を返したかを、契約とログで追える必要がある。

## A2AとMCPをどう分けるか

A2A と MCP の使い分けは、PoC 段階で必ず決めたい。MCP は、agent が tool や resource を呼ぶための標準化された接点として使われる。たとえば、GitHub issue を読む、Google Drive の文書を検索する、社内 DB から特定レコードを取得する、といった処理は tool として設計しやすい。

A2A は、相手が独自の推論、判断、複数 step の処理、状態、権限、責任を持つ場合に意味が出る。たとえば、法務レビュー agent、請求審査 agent、在庫調整 agent、SRE incident triage agent のように、内部で複数 tool を使い、人間への確認や domain-specific policy を持つなら、単なる tool より agent として公開するほうが自然である。

ただし、何でも agent にすればよいわけではない。単純な CRUD や deterministic な計算まで A2A agent にすると、呼び出し構造が重くなる。運用責任も分散する。A2A は複雑な境界を明示するための道具であり、単純な処理を複雑に包むためのものではない。

実務では、次の基準が使いやすい。戻り値が deterministic で、権限も単純なら MCP tool。相手が独自に計画し、複数 tool を使い、利用者ごとの方針や状態を持つなら A2A agent。人間承認やチーム責任境界が入るなら A2A agent として契約を明示する。

## 権限と監査ログの設計

A2A を使うと、orchestrator agent が remote agent を呼び、その remote agent がさらに tool や別 agent を呼ぶ可能性がある。ここで権限設計を雑にすると、呼び出し元が想定していないデータにアクセスしたり、監査ログが途中で切れたりする。

まず、identity propagation を決める必要がある。remote agent は end user の権限で動くのか、orchestrator service account の権限で動くのか、自分自身の service identity で動くのか。日本企業では、部門別アクセス、委託先アクセス、個人情報、機密プロジェクトが絡むため、この設計を曖昧にできない。

次に、authorization scope を分ける。orchestrator が remote agent を呼べることと、remote agent が顧客データを読めることは別である。A2A endpoint へのアクセス、agent capability ごとの許可、agent 内部 tool への許可、出力の二次利用許可を分けて設計する。

ログも階層化する。最低限、caller、callee、Agent Card version、request id、input summary、output summary、error、latency、retry、user approval、downstream tool call をひも付ける。LLM の全文入力をそのまま保存すると機密リスクがあるため、保存する raw payload と要約ログを分ける。事故時には再現性が必要だが、通常時には最小化も必要である。

## テスト戦略

multi-agent のテストでは、単体 prompt 評価だけでは足りない。まず契約テストが必要だ。Agent Card に書かれた input / output schema と実装が一致するか、必須 field が欠けたときに正しい error を返すか、旧 version の request を受けられるかを確認する。

次に、cross-language serialization test を行う。Python、Go、Java では型、null、timestamp、enum、binary、large payload、streaming の扱いがずれることがある。JSON-RPC を使っていても、LLM application では曖昧な自然言語 field が混ざる。境界値と失敗パターンを用意しておくべきだ。

3つ目は、権限テストだ。許可されていない agent を呼べないか、許可された agent でも capability 単位で制限できるか、remote agent が禁止 tool を呼ばないかを検証する。テスト用 tenant、委託先 role、読み取り専用 user、管理者 user で同じ workflow を流す。

4つ目は、observability test だ。異常終了、timeout、partial result、retry、downstream error のときに、trace がつながるかを見る。multi-agent system は「失敗した」だけでは調査できない。どの agent が、どの契約 version で、どの input を受け、どこで止まったかを追えることが本番条件になる。

## 日本企業での現実的な始め方

最初の PoC は、2 agent 構成に絞るべきだ。Python orchestrator と、Go または Java の domain agent を 1 つだけ用意する。たとえば、請求ルール確認、在庫例外判定、CI 結果分類、文書分類のように、入力と出力が比較的明確な業務を選ぶ。

次に、業務データをいきなり入れず、合成データと過去の公開可能データで契約を固める。Agent Card、schema、error、timeout、retry、ログを確認し、LLM の判断品質とは別に通信契約の安定性を見る。

その後、限定された実データで評価する。この段階では、人間承認を必ず挟む。remote agent の回答を自動反映せず、orchestrator が evidence とともに提示し、人間が採否を決める。採否、修正、却下理由をログに残すことで、次の評価セットを作れる。

最後に、運用所有者を決める。A2A agent は API と同じく owner が必要だ。仕様変更、障害対応、監査問い合わせ、権限申請、モデル変更、コスト管理を誰が見るかを決める。owner 不明の agent が増えると、multi-agent system はすぐにブラックボックス化する。

## まとめ

Google の ADK + A2A cross-language 記事は、agent を単体機能から分散システムへ進める実務的なシグナルである。Python、Go、Java のような混在環境で agent を分けられることは、日本企業にとって大きい。一方で、A2A は magic connector ではない。通信できることと、安全に運用できることは別である。

導入するなら、Agent Card を API 契約として扱い、A2A と MCP の境界を決め、identity、authorization、trace、契約テストを先に設計するべきだ。Google の agent 基盤は、モデル、実行環境、操作面、評価、agent 間通信へ広がっている。次の論点は、agent を何個作るかではなく、どの責任境界で分け、どの契約でつなぎ、どのログで説明するかである。

## 出典

- [Build Cross-Language Multi-Agent Team with Google's Agent Development Kit and A2A](https://developers.googleblog.com/build-cross-language-multi-agent-team-with-google-agent-development-kit-and-a2a/) - Google Developers Blog, 2026-06-23
- [ADK with Agent2Agent (A2A) Protocol](https://google.github.io/adk-docs/a2a/) - Google ADK Documentation
- [A2A Protocol](https://a2a-protocol.org/latest/) - Agent2Agent Protocol Documentation
