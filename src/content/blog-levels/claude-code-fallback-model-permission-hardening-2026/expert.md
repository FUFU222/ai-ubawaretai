---
article: 'claude-code-fallback-model-permission-hardening-2026'
level: 'expert'
---

Claude Code `2.1.166` の `fallbackModel` は、表面上は小さな可用性改善に見える。主モデルが overloaded または unavailable の時に、最大3つの fallback model を順番に試せる。`--fallback-model` が interactive sessions にも効く。ここだけ読むと、長い作業が止まりにくくなる便利機能である。

しかし、企業導入ではもう少し慎重に読むべきだ。fallback は、AIエージェントの実行継続性を上げる一方で、モデル選択、費用、リージョン、監査、レビュー責任を複雑にする。[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、Claude Code はすでに Anthropic API だけでなく、Bedrock、Vertex、Foundry、Claude Platform on AWS、社内 LLM gateway と結びつき始めている。そこへ fallback が入ると、「どのモデルで動いたか」は単なる内部事情ではなく、運用上の説明事項になる。

この更新は [Claude Code監査ラベル追加](/blog/claude-code-otel-agents-mcp-security-2026/) ともつながる。OTEL、MCP secret redaction、background agents の安定化は、Claude Code を組織で観測するための部品だった。今回の fallbackModel は、観測すべきイベントを一つ増やす。さらに [Claude Code workflowsの権限管理](/blog/claude-code-workflows-custom-roles-2026/) で扱った dynamic workflows と組み合わせると、長時間・多agent・多モデルの運用設計が必要になる。

## 事実: fallbackModelは失敗時の継続経路を明示する

Claude Code changelog の `2.1.166` は、`fallbackModel` setting を追加したと説明している。主モデルが overloaded または unavailable の場合、最大3つの fallback models を順に試す。さらに、`--fallback-model` が interactive sessions にも適用されるようになった。

ここで重要なのは、fallback が「常時ルーティング」ではなく、主モデルが使えない時の継続経路である点だ。通常時のモデル選択は、model setting、`/model`、`--model`、`ANTHROPIC_MODEL`、managed settings、provider-specific model ID などの既存ルールで決まる。fallback は、その主経路が失敗した場合の追加設計である。

Claude Code model configuration docs は、model aliases、availableModels、model pinning、modelOverrides、Bedrock / Vertex / Foundry / Claude Platform on AWS での provider-specific ID を説明している。企業管理者は、モデルを選ぶだけでなく、aliases がどの実モデルに解決されるか、第三者プロバイダーでどの ID に mapping されるかを管理する必要がある。

したがって、fallbackModel は「何か別のモデルへ落ちても動けばよい」ではない。承認済みモデル群の中で、どの順番で、どの作業に、どの条件で継続するかを定義するものだ。ここを曖昧にすると、障害時に便利なはずの fallback が、監査不能な自動切り替えになる。

## 事実: モデル設定は可用性と再現性のトレードオフになる

Claude Code の model configuration では、モデル alias が provider ごとに異なる実モデルへ解決されることが示されている。たとえば Anthropic API、Claude Platform on AWS、Bedrock、Vertex、Foundry では、同じ `opus` や `sonnet` でも利用可能なバージョンや既定が違う場合がある。さらに、model pinning や modelOverrides を使えば、企業は provider-specific ID へ明示的に割り当てられる。

これは、企業にとって再現性を確保する手段である。同じプロンプト、同じリポジトリ、同じ tool set で評価したいなら、モデルを固定したほうが説明しやすい。セキュリティレビュー、規制業務、委託先管理、開発標準化では、モデルが勝手に変わること自体がレビュー対象になる。

一方で、固定されたモデルが一時的に使えない場合、開発者の作業は止まる。AIエージェントに長い作業を任せるほど、この停止は痛い。CI失敗修正、テスト再試行、移行調査、ドキュメント生成、issue triage のような作業では、主モデルの一時不調だけでセッション全体が止まると、AI導入の価値が下がる。

fallbackModel は、この可用性を補う。ただし、再現性を少し崩す。だから設定時には、fallback が発生したことを transcript、ログ、レビューコメント、PR説明のどこかで追えるようにしたい。完全に自動で見えない形にすると、後から「なぜこの判断になったか」を説明しにくい。

[Claude Opus 4.1廃止](/blog/anthropic-claude-opus-41-retirement-2026/) のようなモデルライフサイクル対応とも区別が必要だ。fallback は retirement 対応ではない。廃止予定モデルを fallback に残すと、障害時だけ古いモデルへ戻る危険な設計になる。fallback list は、承認済みかつ現行のモデルだけで組むべきだ。

## 事実: deny rule globは承認モードをまたぐ境界になる

`2.1.166` では、deny rule の tool-name 位置に glob pattern support が追加された。全ツールを deny するような表現が可能になり、allow rules では非MCPの glob を拒否し、unknown tool names in deny rules には startup warning が出る。

Claude Agent SDK permissions docs は、permissions の評価順を示している。hooks、deny rules、permission mode、allow rules、canUseTool callback の順で、deny rules は permission mode より前に評価される。特に重要なのは、deny rules が `bypassPermissions` でもブロックとして残る点だ。

Claude Code permissions docs も、permissions と sandboxing を分けて説明している。permissions は tool、file、domain のアクセスを制御する。sandboxing は Bash command と child process を OS レベルで制限する。両方を使うことで、Claude Code が危険な tool request を出さないようにしつつ、仮に Bash 側へ進んでも OS 境界で止める形にできる。

企業では、allow rules だけで安全にしようとすると失敗しやすい。allow は便利な道を作る設定だが、禁止領域を守る設定ではない。特に acceptEdits、auto mode、bypassPermissions、workflows、background agents を組み合わせる場合、最後に残るのは deny と sandbox である。

deny rule glob は、強い設定である。使い方を誤ると開発者体験を壊す。しかし、部門配布の標準設定では価値がある。たとえば、最初に広く deny し、特定の MCP tool、読み取り系 tool、限定された file path だけを許す構成を作れる。PoC段階では緩く、規制業務や委託先環境では厳しく、と段階を分けられる。

## 事実: cross-session messagingは承認権限を運ばない

`2.1.166` のもう一つの重要な変更は、cross-session messaging の硬化である。changelog では、別の Claude session から `SendMessage` 経由で relayed されたメッセージが user authority を持たないこと、受信側が relayed permission requests を拒否すること、auto mode がそれを block することが示されている。

これは、複数セッションを使う AIエージェント運用では重要な境界だ。Claude Code は background agents、agent teams、workflows、remote sessions の方向へ進んでいる。複数のセッションがあると、あるセッションの調査結果を別のセッションへ渡したい場面は自然に出てくる。

しかし、情報共有と承認移譲は違う。別セッションからのメッセージが permission request として通ると、誰が実行を許可したのかが曖昧になる。人間の承認、元セッションの出力、別エージェントの提案、relay されたメッセージが混ざると、監査上はかなり扱いにくい。

今回の hardening は、この混同を避ける方向である。別セッションは情報を渡せても、実行許可を運ぶ主体ではない。日本企業で運用するなら、この考え方をそのままルール化したほうがよい。別エージェントからの提案は参考情報であり、permission は受信側セッションを見ている人間、または明示された承認フローが出す。

## 分析: 日本企業では三つの運用モードに分ける

ここからは分析だ。

fallbackModel と権限硬化を同時に見ると、Claude Code の企業運用は三つのモードに分けると整理しやすい。

第一は、低リスクの継続優先モードである。ドキュメント更新、テストログ要約、影響範囲調査、既存コードの読み取り、依存関係の整理、軽微な lint 修正などは、主モデルが使えない時に fallback で続けてもよい候補になる。ここでは可用性が価値を持つ。

第二は、レビュー強化モードである。通常の機能実装、リファクタ、テスト追加、開発環境設定の変更などは、fallback を許してもよいが、fallback 発生後の差分を人間が確認する。PRテンプレートやレビューコメントに、fallback が起きたことを残す運用が向く。

第三は、停止優先モードである。認証、認可、決済、個人情報、暗号鍵、production config、DB migration、セキュリティポリシー、本番障害対応は、主モデルが使えないなら止める。代替モデルで継続するより、明示的に人間へ戻した方がよい。

この分類は、モデル性能への信頼とは別の話だ。強いモデルでも、作業分類によって求める説明責任は変わる。AIエージェントの実務導入では、モデルが賢いかどうかより、どの作業をどの承認境界で進めるかが重要になる。

## 実務: 設定レビューのチェックリスト

まず、`fallbackModel` の候補を承認済みモデルだけに限定する。廃止予定、評価未実施、リージョン要件未確認、費用倍率未確認のモデルを入れない。Bedrock、Vertex、Foundry、Claude Platform on AWS、Anthropic API をまたぐなら、provider ごとに model ID とログ仕様を表にする。

次に、`availableModels`、`model`、provider-specific environment variables、`modelOverrides` と fallback の関係を見る。通常時は固定しているのに、fallback だけ別経路へ流れる設定になっていないかを確認する。特に社内 LLM gateway を使う場合、gateway 側の routing policy と Claude Code 側の fallback が二重に働かないようにする。

三つ目は、fallback 発生時の可視化である。開発者が気づかないうちにモデルが切り替わる運用は避けたい。少なくとも、重要タスクでは session transcript、PR説明、監査ログ、またはチームの作業記録に fallback 発生を残す。

四つ目は、deny rule の標準セットを作ることだ。`.env`、秘密鍵、credential store、production config、顧客データ、契約書、支払い設定、本番DB migration、監査ログ、社内チャット履歴など、触らせない場所を先に棚卸しする。deny rule glob は、最初に禁止範囲を大きく取り、必要な例外を狭く許す設計に向く。

五つ目は、sandbox と deny を分けてテストすることだ。permissions で拒否されるべき操作、sandbox で止まるべき Bash command、MCP tool 側で拒否されるべき操作を分ける。全部を一つの設定に押し込むと、事故時にどの層が効かなかったのか分からない。

六つ目は、cross-session messaging のルール化である。別セッションからのメッセージは、参考情報か、作業指示か、承認要求かを分ける。Claude Code 側は relayed permission requests を拒否する方向へ硬化したが、チームの運用文書にも「別エージェントの提案は承認ではない」と書いておくべきだ。

七つ目は、段階的な rollout である。全社に一気に fallback を入れるより、開発基盤チーム、低リスク repository、読み取り中心の作業から始める。fallback 発生頻度、レビュー差分、コスト、作業停止時間、誤承認の有無を見る。数字が取れてから、実装作業や workflows へ広げる。

## まとめ

Claude Code `2.1.166` は、fallbackModel によって AIエージェントの継続性を高めつつ、deny rule glob と cross-session messaging hardening によって権限境界を強めた更新である。これは単なる安定化ではない。Claude Code が長時間、多セッション、多モデルの企業運用へ近づいていることを示す変更だ。

日本企業では、fallback を「止まらないための便利機能」としてだけ導入すると危ない。どの作業で継続するか、どのモデルへ切り替わるか、どの操作を deny で止めるか、別セッションからの指示をどう扱うかを先に決める必要がある。

可用性と統制は対立するものではない。良い設計では、低リスク作業は止めずに進め、高リスク作業は明確に止め、どちらも後から説明できる。fallbackModel と権限硬化は、その設計を Claude Code 側で実装しやすくするための部品として見るべきだ。

## 出典

- [Claude Code changelog](https://code.claude.com/docs/en/changelog) - Anthropic, 2026-06-06
- [Model configuration](https://code.claude.com/docs/en/model-config) - Claude Code Docs
- [Configure permissions](https://code.claude.com/docs/en/permissions) - Claude Code Docs
- [Configure permissions](https://code.claude.com/docs/en/agent-sdk/permissions) - Claude Agent SDK Docs
