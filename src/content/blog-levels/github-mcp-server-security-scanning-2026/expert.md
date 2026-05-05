---
article: 'github-mcp-server-security-scanning-2026'
level: 'expert'
---

GitHub MCP Server の secret scanning 一般提供と dependency scanning 公開プレビューは、GitHub Copilot の周辺機能というより、AI エージェント開発におけるセキュリティ境界の移動として見るべき更新だ。境界は、PR 作成後の CI や GitHub Advanced Security dashboard だけにあるのではなく、エージェントが tool call を行い、branch 上で変更を作り、commit する前の作業面へ移り始めている。

この点は、以前の [GitHub DependabotのAIエージェント修復](/blog/github-dependabot-ai-agent-remediation-2026/) と合わせると分かりやすい。Dependabot alerts から AI エージェントに修復 PR を作らせる流れは、脆弱性検知後の修復工程を短くするものだった。今回の MCP Server 更新は、もう少し前段にある。エージェントや開発者が依存関係を追加する前後で、既知脆弱性と秘密情報を確認する導線だ。

同じ GitHub / Copilot の流れとして、[GitHub Copilot SDK](/blog/github-copilot-sdk-public-preview-2026/) はエージェント実行基盤を外部アプリへ広げる話だったし、[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/) は AI レビューが通常の開発コスト管理に入る話だった。今回の MCP security scanning は、その実行基盤とコスト管理の間に「どの tool を使わせ、どの検査を事前に挟むか」という統制面を置く。

## 事実: secret scanningはpush protectionの拡張として動く

GitHub Changelog は、GitHub MCP Server における secret scanning が 2026年5月5日に一般提供になったと説明している。公開プレビューは 2026年3月からで、対象は GitHub Secret Protection が有効なリポジトリだ。GitHub Copilot CLI や Visual Studio Code のような MCP 対応クライアントから、commit 前または pull request 前に、現在の変更に露出した秘密情報がないかを確認できる。

重要なのは、単に「scan できる」ことではない。一般提供にあたり、MCP Server の secret scanning tools は既存の push protection customization を尊重する。これは運用上かなり大きい。組織がすでに push protection のカスタムパターン、バイパス、例外管理を整えているなら、AI エージェント向けに別のルール体系を持ち込まなくてよい。

GitHub Docs の push protection と GitHub MCP Server の説明も、この見方を補強している。GitHub MCP Server とのやり取りでは、AI 生成レスポンスに含まれる secrets と、issue 作成などユーザー代理の action に含まれる secrets がブロック対象になる。公開リポジトリでは標準で効き、GitHub Advanced Security 対象の private repository でも効く。これは、漏えい経路を「git push」だけでなく、「AI が生成した出力」「AI が実行する代理操作」まで拡張して見ているということだ。

従来の secret scanning は、開発者が push したあとに止める、あるいは alert を出す印象が強かった。MCP Server 経由では、開発者や agent が変更を作った直後に「今の差分を見て」と頼める。もちろん検査品質は GitHub の検出ロジックと対象 secret pattern に依存するが、作業手順としてはかなり前に寄る。

## 事実: dependency scanningはdependabot toolsetに乗った

dependency scanning の公開プレビューは、GitHub MCP Server の `dependabot` toolset として提供される。公式 Changelog によれば、Dependabot alerts が有効なリポジトリで、AI コーディングエージェントが依存関係の脆弱性確認を実行できる。GitHub Advisory Database に依存情報を送り、影響 package、severity、推奨 fixed version を構造化して返す。

より深い post-commit の確認では、Dependabot CLI をローカルで実行し、変更前後の dependency graph を比較できるとされている。この設計は興味深い。軽い事前確認は Advisory Database への照会で行い、より確実な graph 差分は CLI に寄せる。AI エージェントは判断主体というより、適切な security tool を呼ぶ操作面になる。

Copilot CLI では、GitHub MCP Server があらかじめ入っている。`copilot --add-github-mcp-toolset dependabot` で `dependabot` toolset を session に追加する導線が示されている。VS Code では GitHub MCP Server の headers に `"X-MCP-Toolsets": "dependabot"` を指定するか、Copilot Chat の toolset selector から選ぶ。つまり、実務では MCP Server そのものより、toolset の有効化ポリシーが重要になる。

ここで [Cursor Security Review](/blog/cursor-security-review-beta-2026/) との違いも見えてくる。Cursor は PR review と vulnerability scanner を Cursor 側のセキュリティエージェントとして束ね、MCP で外部 SAST / SCA / secrets scanner を差し込む方向だった。GitHub は逆に、GitHub 側の security primitives を MCP Server から呼び出せるようにしている。どちらも、AI エージェントの判断を単独で信用するのではなく、既存の security system を tool として呼ぶ方向だ。

## 分析: MCP toolsetはAI時代の最小権限設計になる

GitHub Docs は、GitHub MCP Server の toolsets を有効化、無効化できると説明している。標準で有効な toolsets に加えて、`actions`、`code_security`、`secret_protection` のような個別 toolset を選べる。必要なものだけを有効にすると、AI assistant の性能とセキュリティの両方に効く、とも説明されている。

これは単なる UX 設定ではない。AI エージェントにとって toolset は能力そのものだ。issue を読む、PR を作る、code scanning を呼ぶ、secret scanning を実行する、Dependabot の情報を見る。これらはすべて、従来なら開発者や CI が明示的に実行していた操作だ。エージェントが自然言語でそれを呼べるなら、組織は toolset を権限境界として扱う必要がある。

日本企業でこの論点は重い。多くの組織では、GitHub の repository 権限、branch protection、CODEOWNERS、GitHub Advanced Security、Dependabot alerts はそれぞれ別の担当が見ている。そこへ MCP Server が入ると、開発者体験としては一体化するが、管理責任も一体化する。誰が `dependabot` toolset を使えるのか。誰が secret scanning 結果を見られるのか。private repository でどの agent surface から呼べるのか。これを曖昧にしたまま広げると、便利さだけが先行する。

逆に言えば、toolset を絞れることは強みでもある。すべての MCP tools を開けずに、最初は `secret_protection` と `dependabot` だけを限定チームに開く。外部公開サービスだけに適用する。AI エージェントの自動修正は許可せず、scan 結果の説明までに留める。こうした段階的な設計がしやすい。

## 分析: 「修正するAI」より「止めるAI」の価値が上がる

AI コーディング導入の議論では、どれだけ速く実装できるかが注目されやすい。しかし企業利用では、速く作る機能より、危ない変更を止める機能のほうが導入を前に進めることがある。API key の漏えい、脆弱な package の追加、許可されていない remote MCP server の利用、過剰な repository 権限。こうした事故が1回でも起きると、AI エージェント導入そのものが止まるからだ。

今回の secret scanning と dependency scanning は、エージェントに「もっと大きく任せる」ための前提整備に近い。特に日本の金融、製造、公共、医療のように、変更管理と監査を重視する組織では、AI が作った差分を人間が全部読むだけでは運用が回らない。人間レビューの前に、機械的に止められるものを止める必要がある。

もちろん、今回の機能だけで十分ではない。secret scanning は provider token や custom pattern には強いが、すべての社内秘密を理解するわけではない。dependency scanning は既知脆弱性に強いが、maintainer trust、license compatibility、package の typosquatting、business criticality までは別の判断が必要だ。つまり、AI エージェントに任せる安全網は、secret scanning、dependency scanning、code scanning、license policy、package allowlist、human review の組み合わせになる。

それでも、GitHub がこの検査を MCP Server の tool として出した意味は大きい。AI エージェントが作業したあとに、人間が別画面で security dashboard を見るのではなく、同じ agent workflow の中で security tool を呼べる。これは作業者の心理的コストを下げる。

## 日本企業の実装パターン

日本企業が導入するなら、まず3つのパターンに分けるとよい。

1つ目は、個人開発者向けの軽い guardrail だ。Copilot CLI や VS Code Copilot Chat を使う開発者に、commit 前に secret scanning と dependency scanning を呼ぶ prompt を標準化する。たとえば「この branch の現在の変更について、露出した secrets と追加依存の既知脆弱性を確認して」といった社内 prompt を用意する。これは教育コストが低い。

2つ目は、チーム運用向けの pre-review check だ。PR を開く前に、AI エージェントが scan 結果を summary として残す。ここで重要なのは、自動マージではなく、レビュー担当が見る材料にすることだ。CODEOWNERS や branch protection と組み合わせれば、AI はレビューの代替ではなく、レビューの前処理になる。

3つ目は、AppSec チーム向けの triage 補助だ。Dependabot alerts、secret scanning alerts、MCP 経由の事前スキャン結果を合わせて、どの repository で同じ問題が繰り返されているかを見る。これは GitHub の security overview や Dependabot metrics と組み合わせる領域になる。MCP Server は作業面の入口だが、改善活動は dashboard 側で測る必要がある。

この3つを混ぜると失敗しやすい。個人開発者向けには軽い prompt と toolset。チーム運用には PR 前チェック。AppSec にはメトリクスと例外管理。対象者ごとに役割を分けるべきだ。

## 導入前に確認すべきリスク

まず、MCP Server の利用ポリシーを確認する必要がある。GitHub Docs は、organization や enterprise が Copilot Business / Enterprise 利用者向けに MCP policy を設定できると説明している。個人プランの MCP access は同じポリシーで統制されないため、会社支給アカウントと個人利用が混ざる組織では、利用ルールを別途明文化しないと抜け道が残る。

次に、toolset の最小化だ。GitHub MCP Server は toolsets を絞れる。`all` を使えば便利だが、最初の導入でやるべきではない。security scanning のためなら、必要な toolset だけを開く。remote MCP server と local MCP server の違い、headers、environment variables、command-line flags の管理者責任も整理する。

さらに、バイパス処理が必要だ。GitHub Docs は push protection block の解消として、request から secret を取り除くか、条件によって bypass する選択肢を挙げている。日本企業では、bypass を開発者の自己判断にすると後で説明しにくい。少なくとも高リスク repository では、bypass 理由、承認者、期限、rotation の有無を記録すべきだ。

最後に、検査結果の過信を避ける必要がある。AI エージェントが「脆弱性はありません」と言っても、それは今回の tool call と対象データの範囲での結果にすぎない。lockfile が更新されていない、private registry の情報が見えない、monorepo の一部だけを見ている、生成された dependency graph が不完全である、といったケースはありうる。レビュー担当は、結果が何を見て、何を見ていないかを確認する必要がある。

## まとめ

GitHub MCP Server の security scanning 更新は、AI エージェント時代の開発統制をかなり具体的にしている。secret scanning は、AI 生成レスポンスや代理操作を含む secrets 漏えい経路を意識している。dependency scanning は、Dependabot と Advisory Database を、commit 前の agent workflow に近づけている。

日本企業が注目すべきなのは、機能名そのものではない。MCP toolset を最小権限で開き、GitHub Advanced Security の既存運用と合わせ、AI エージェントの作業前後に検査を挟む設計だ。AI が速く書けるほど、止める仕組み、説明する仕組み、権限を絞る仕組みが必要になる。

今回の更新は、その現実的な足場になりうる。Copilot や MCP をすでに試している日本の開発チームは、次の PoC を「実装速度」ではなく、「秘密情報と依存関係をどれだけ早く、自然な作業面で止められるか」に置くとよい。

## 出典

- [Secret scanning with GitHub MCP Server is now generally available](https://github.blog/changelog/2026-05-05-secret-scanning-with-github-mcp-server-is-now-generally-available/) - GitHub Changelog, 2026-05-05
- [Dependency scanning with GitHub MCP Server is in public preview](https://github.blog/changelog/2026-05-05-dependency-scanning-with-github-mcp-server-is-in-public-preview/) - GitHub Changelog, 2026-05-05
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/configure-toolsets) - GitHub Docs
- [Working with push protection and the GitHub MCP server](https://docs.github.com/en/code-security/concepts/secret-security/working-with-push-protection-and-the-github-mcp-server) - GitHub Docs
