---
article: 'claude-code-auto-mode-bedrock-vertex-foundry-2026'
level: 'expert'
---

Claude Code `2.1.158` の Auto mode 拡張は、changelog 上は短い。しかし、企業導入の観点ではかなり重い。Auto mode が Amazon Bedrock、Google Vertex AI、Microsoft Foundry 上の Opus 4.7 / Opus 4.8 に対応したことで、Claude Code のモデル選択は、個人の端末設定からクラウド統制、LLM gateway、費用配賦、監査ログの設計へ近づいた。

この更新は、[Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) の続きとして読むと分かりやすい。Opus 4.8 と dynamic workflows は「より大きな仕事をClaude Codeに任せられる」方向の更新だった。今回の Auto mode 対応拡大は、その大きな仕事を、どのモデル・どのクラウド経路・どの予算枠で走らせるかという制御面の更新である。

## 事実整理: 2.1.158の変更点

Anthropic が公開している Claude Code changelog では、`2.1.158` に「Auto mode is now available on Bedrock, Vertex, and Foundry for Opus 4.7 and Opus 4.8」とある。利用者は `CLAUDE_CODE_ENABLE_AUTO_MODE=1` を設定して opt-in する。

この事実から確認できることは三つある。

第一に、対象モデルは Opus 4.7 と Opus 4.8 である。つまり、軽量モデルだけの自動選択ではなく、Claude Code の長時間タスクや高難度コーディングで使われる上位モデル系列が対象になる。

第二に、対象経路は Anthropic 直結に限定されない。Bedrock、Vertex、Foundry はそれぞれ AWS、Google Cloud、Microsoft 系の企業利用経路と結びつく。ここではクラウドアカウント、IAM、プロジェクト、リージョン、監査ログ、請求の責任分界が関係する。

第三に、現時点では opt-in である。これは実務上かなり重要だ。全利用者へ無条件に広がる変更ではなく、企業側が有効化のタイミング、対象チーム、対象作業を決められる余地がある。

## Auto modeは需要分散と標準化の機能である

Auto mode を「モデル選択を自動にする便利機能」とだけ見ると浅い。エージェント型開発支援では、モデル選択は需要分散、費用、レイテンシ、成功率、レビュー負荷に直結する。

Claude Code に任せる作業は、単純な質問だけではない。リポジトリ調査、複数ファイルの修正、テスト実行、失敗時の再試行、PR準備、MCP経由の外部情報取得まで含み得る。この種の作業では、モデルを強くすれば常に良いわけではない。強いモデルは成功率を上げる可能性があるが、より大きな仕事を任せる誘因にもなり、総利用量が増えることがある。

Auto mode は、この複雑さを利用者の手元から少し引き受ける。軽い作業では過剰なモデル利用を避け、難しい作業では適切な上位モデルへ寄せる。少なくとも方向性としては、個人の毎回選択から、実行面のモデルルーティングへ寄せる機能だと見たほうがよい。

ただし、企業では「自動選択されたから説明できない」は通らない。モデル選択の自動化は、説明責任の消滅ではなく、説明責任の場所が管理者、gateway、ログ、ポリシーへ移ることを意味する。

## Bedrock経由ではAWS側の設計と混ぜて考える

Amazon Bedrock 経由で Claude Code を使う場合、Claude Code は AWS の認証、リージョン、モデルアクセス、inference profile などと関係する。Anthropic の Bedrock 関連ドキュメントでは、`CLAUDE_CODE_USE_BEDROCK=1`、`AWS_REGION`、`ANTHROPIC_MODEL`、`ANTHROPIC_SMALL_FAST_MODEL` などを使う構成が説明されている。

ここに Auto mode が入ると、モデル指定の考え方が少し変わる。従来は、企業が許可したモデル ID を明示し、それを Claude Code に使わせる形にしやすかった。Auto mode では、許可された範囲の中で選択が動く。したがって、AWS アカウント側でどのモデルアクセスを許すか、どの inference profile を使うか、リージョンをどう固定するかがより重要になる。

この点は、[Claude Platform on AWSとBedrockの使い分け](/blog/anthropic-claude-platform-aws-2026-04-22/) で整理した論点と混同しないほうがよい。Claude Platform on AWS は Anthropic ネイティブ体験を AWS 認証・請求・監査の枠に寄せる話であり、Bedrock は AWS managed の複数モデル基盤である。Claude Code の Bedrock 経由 Auto mode は後者の設計に近い。データ境界、監査ログ、モデルアクセスを AWS 側でどう見るかが中心になる。

日本企業が Bedrock 経由で Claude Code Auto mode を試すなら、まず専用 AWS アカウントまたは専用プロジェクトに分けるのが現実的だ。開発者の普段の AWS 権限と、AIエージェント実行用の権限を混ぜると、どの操作が人間のものか、どの操作が Claude Code 経由かを後で分けにくい。

## VertexとFoundryではマルチクラウド標準の問題になる

Google Vertex AI や Microsoft Foundry 経由で使う場合も、構造は似ている。違うのは、多くの企業では AWS、Google Cloud、Microsoft の利用部門が分かれていることだ。AI 推進部門は同じ「Claude Code」として見ていても、情シスやセキュリティ部門はクラウドごとに別の統制体系として見る。

このため、Auto mode の有効化はクラウド横断の標準化問題になる。AWSでは許可、GCPでは未許可、Microsoft環境では特定部署のみ許可、といった差が出る可能性がある。差があること自体は悪くない。問題は、開発者向けガイドが「Claude Code Auto modeを使ってよい」とだけ書き、どのクラウド経路で許可されているのかを示さないことだ。

社内標準にするなら、少なくとも次の情報を表にする必要がある。対象クラウド、対象アカウントまたはプロジェクト、許可モデル、リージョン、ログ保存先、請求先、利用可能チーム、禁止データ、レビュー必須作業、停止手順である。

この表がないと、Auto mode は現場の便利設定として広がる。便利設定として広がったあとに、請求やログやデータ境界を説明しようとすると、かなり苦しくなる。

## LLM gatewayはAuto modeの説明責任を引き受ける

Anthropic の LLM gateway ドキュメントは、gateway の価値として centralized authentication、usage tracking、cost controls、audit logging、model routing を挙げている。この列挙は、Auto mode とほぼ同じ論点を企業側から見たものだ。

Auto mode を使うなら、LLM gateway は単なるプロキシではなく、説明責任の中核になり得る。どのリクエストがどのモデルへ流れたか、どのチームがどれだけ使ったか、どの作業で上位モデルが選ばれたか、予算上限に近づいたときにどう止めたかを記録できるからだ。

ただし、gateway があれば自動的に安全になるわけではない。モデルルーティングのルール、ログの粒度、ユーザー識別、プロジェクト識別、秘匿情報の扱い、保存期間、エラー時の fallback を設計しなければならない。Auto mode と gateway routing が二重に効く構成では、どちらがモデル選択を最終決定したのかも明確にする必要がある。

実務上は、Claude Code から gateway に渡すメタデータをそろえたい。ユーザー、チーム、リポジトリ、作業分類、リスク分類、チケットID、承認ID、実行モードをログに残せると、後の監査と費用配賦がかなり楽になる。

## 権限と隔離はモデル選択より先に決める

Auto mode の議論ではモデルに目が行きやすい。しかし、Claude Code の企業導入では、モデル選択より先に権限と隔離を決めるべきだ。

[Claude Code 2.1.149の権限修正](/blog/claude-code-2149-powershell-mcp-2026/) で見たように、AIコーディングツールの安全性は、モデルの賢さだけではなく、PowerShell、worktree、sandbox allowlist、MCP、管理設定、usage breakdown のような実装細部に依存する。Auto mode が正しくモデルを選んでも、書き込み可能な場所が広すぎたり、実行可能コマンドが雑だったりすれば、運用リスクは下がらない。

さらに、[Claudeのコンテインメント設計](/blog/anthropic-claude-containment-agent-security-2026/) の論点もそのまま効く。エージェントが長時間動き、複数のファイルを読み、コマンドを実行し、MCPを呼ぶなら、作業空間、ネットワーク、シークレット、外部サービス、ログを分ける必要がある。

したがって、Auto mode を有効化する前に決めるべき順番はこうなる。まず、Claude Code が触れるリポジトリとディレクトリを限定する。次に、実行可能コマンドとネットワーク可否を決める。その後、MCP と plugin を許可制にする。最後に、作業分類ごとのモデル選択ルールを決める。モデル選択は重要だが、作業境界の上に乗るものとして扱うほうが安全である。

## 日本企業向けの導入手順

現実的な導入は、いきなり全社展開ではなく、三段階がよい。

第一段階は、低リスクタスクでの評価である。代表的なリポジトリを一つ選び、ログ要約、テスト失敗の原因候補出し、ドキュメント更新、軽微なリファクタリング案の作成などを Auto mode で試す。この段階では本番ブランチへ直接書かせず、隔離された worktree または検証用ブランチを使う。

評価指標は、成功率だけでは足りない。実行時間、許可要求回数、不要な変更ファイル数、人間レビューでの修正数、再試行回数、費用、ログの追跡可能性を見る。Auto mode によってモデル選択の手間が減っても、人間レビューが増えるなら運用としては成功していない。

第二段階は、作業分類ごとの標準化である。低リスク探索は Auto mode、通常の修正は Auto mode か明示モデル固定、セキュリティ・個人情報・課金・認証は明示モデル固定か人間承認必須、といった分類を作る。これを README ではなく、社内CLI、テンプレート、設定ファイル、承認フローに落とす。

第三段階は、クラウド経路別の統制である。Bedrock、Vertex、Foundry、Anthropic直結、LLM gateway のどれを許すかを決める。経路ごとにログ、費用、リージョン、利用可能モデル、禁止データを表にする。ここまでできて初めて、Auto mode を社内標準として扱いやすくなる。

## Pillar候補としての意味

今回の記事テーマは、単発の機能追加ではあるが、`anthropic-japan-2026` series の中では柱候補になり得る。Anthropic の日本市場展開、Claude Platform on AWS、Opus 4.8、Claude Code、Claude Security、MCP、コンテインメント設計をつなぐ実務テーマが、まさに「企業がClaudeをどう統制して使うか」だからだ。

ただし、pillar は自動で付けるべきではない。この記事自体は Auto mode の更新を扱うものであり、series全体の代表記事にするかは人間が判断する必要がある。現時点では、[AnthropicのSeries HとClaude基盤投資](/blog/anthropic-series-h-compute-enterprise-japan-2026/) や Claude Platform on AWS の記事と並べて、どの記事を series の入口にするかを見たほうがよい。

## まとめ

Claude Code Auto mode の Bedrock / Vertex / Foundry 対応は、開発者体験の小さな改善に見える。しかし企業導入では、モデル選択を自動化する範囲がクラウド経由へ広がるという意味を持つ。

日本企業が注目すべきなのは、Auto mode を使うかどうかだけではない。どの作業で使うか、どのクラウド経路で使うか、どのモデルを候補に入れるか、どのログで説明するか、どの予算で止めるか、どの権限境界で実行するかである。

Claude Code が個人のAIコーディングツールから企業の開発基盤へ近づくほど、モデル選択は個人設定ではなく運用設計になる。Auto mode はその象徴的な機能だ。便利な自動選択として広げるのではなく、クラウド経由のClaude Code標準運用を作る材料として扱うべきである。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic, accessed 2026-06-01
- [Set up Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup) - Anthropic Docs
- [Bedrock、Vertex、およびプロキシ](https://docs.anthropic.com/ja/docs/claude-code/bedrock-vertex-proxies) - Anthropic Docs
- [LLM gateway configuration](https://docs.anthropic.com/en/docs/claude-code/llm-gateway) - Anthropic Docs
