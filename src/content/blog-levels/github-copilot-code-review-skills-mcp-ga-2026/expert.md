---
article: 'github-copilot-code-review-skills-mcp-ga-2026'
level: 'expert'
---

GitHubの**2026年7月29日**の発表は、Copilot code reviewを運用する企業にとって重要な境目である。Copilot code reviewでAgent skillsとMCPが一般提供になり、GitHub Copilot Pro、Pro+、Business、Enterpriseの利用者は、PRレビューAIにリポジトリ固有の手順と外部文脈を使わせられるようになった。

この更新は、過去のCopilot code review強化と連続している。[Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/)では、runner、content exclusion、custom instructionsの管理設定を扱った。[Copilot code review、AGENTS.mdでPR規約を反映](/blog/github-copilot-code-review-agents-md-2026/)では、repository rootの`AGENTS.md`をレビューAIが読むようになったことを整理した。今回のGAは、そのレビュー標準をAgent skillsに切り出し、MCPで外部文脈へ接続する段階である。

同時に、これはCopilot appやcloud agentの管理とも切り離せない。[Copilot app独立policy、既定有効を管理する方法](/blog/github-copilot-app-policy-managed-settings-2026/)で見たように、Copilotのagent surfaceはIDE、app、CLI、cloud agentへ広がっている。[Copilotセッション監査API、EMU企業の導入設計](/blog/github-copilot-agent-session-streaming-api-2026/)のような監査機能も、集計指標だけではなくsession単位の追跡へ進んでいる。Copilot code reviewも、この同じ流れの中で捉えるべきだ。

## Fact: Agent skills are now part of review behavior

GitHub Changelogは、Copilot code reviewのAgent skillsとMCPがGAになったと説明している。Agent skillsは、Copilot agentに特定の作業方法を教えるためのMarkdownベースの資産である。GitHub Docsでは、skillsがYAML frontmatter、説明、手順、必要な補助ファイルを含められること、repositoryやorganizationで管理できることが示されている。

Copilot code reviewで重要なのは、skillsが「レビューの標準動作」を形にできる点だ。たとえば、frontend review skillでは、UI変更のときにPlaywright MCPで対象画面を確認し、アクセシビリティ、レスポンシブ表示、フォームエラー表示を見るように指示できる。Security review skillでは、認証、認可、secret、ログ出力、個人情報の扱いを重大度付きで見るようにできる。Migration review skillでは、DB migration、rollback、backfill、lock時間、監視項目を確認させられる。

従来のcustom instructionsや`AGENTS.md`にもレビュー規約を書けるが、skillsは用途別に切り出せる。これは大規模な日本企業に向いている。全社共通のPR規約、プロダクト別の設計標準、委託先向けのレビュー観点、セキュリティ部門のチェック項目を1つの長いファイルに混ぜると保守しにくい。skillsとして分ければ、owner、適用条件、更新履歴を持ちやすい。

ただし、skillsは品質保証の魔法ではない。AIが使う手順書である以上、古い手順、曖昧な重大度、矛盾する例外、実行できない確認項目があると、レビューコメントも劣化する。導入後は、レビューAIの誤検知や見落としをモデル問題だけにせず、skill自体の改善タスクとして扱う必要がある。

## Fact: MCP extends context, but code review is read-only

MCPは、Copilotが外部ツールやデータ源へ接続するための標準である。GitHub Docsのrepository MCP設定では、MCP serverをJSONで定義し、Copilot Secrets and variablesを使い、ツール承認や利用範囲を管理する流れが説明されている。今回、Copilot code reviewは関連するMCP serverを使ってPRレビューに必要な文脈を確認できる。

GitHubは、GitHub MCP serverとPlaywright MCP serverが全リポジトリで既定有効になると発表した。GitHub MCPはissue、pull request、repository metadataなどGitHub内の文脈を扱う入口になり得る。Playwright MCPはbrowser操作や画面確認に向く。UI変更のPRでスクリーンショットを確認し、関連issueの意図と差分を突き合わせるようなレビューが現実的になる。

同時に、Copilot code reviewでのMCP tool callsはread-onlyである。これは重要な権限境界だ。レビューAIがMCPを使えるからといって、外部SaaSを書き換えたり、issueを更新したり、テスト環境へ破壊的操作をしたりする設計ではない。PRレビューは、文脈取得とコメント生成のためにMCPを使う。

しかし、read-onlyは監査不要を意味しない。読み取りだけでも、内部設計、顧客識別子、障害状況、セキュリティalert、未公開機能、社内URL、個人情報に触れる可能性がある。AIレビューがMCPから取得した情報をどの程度コメントへ反映するのか、session recordに残るのか、SIEMや監査基盤へ転送されるのか、閲覧権限は誰にあるのかを確認しなければならない。

日本企業では、ここが導入判断の中心になる。PR作成者が見られる情報、reviewerが見られる情報、MCP serverが読める情報、Copilotが処理する情報が一致しない場合がある。たとえば、社内チケットMCPが全顧客の障害情報を読めるのに、PRは特定プロダクトの委託先も参加するリポジトリで開かれている、という状態は避けたい。read-onlyであっても、最小権限と情報区分は必要である。

## Fact: existing cloud agent MCP settings may now affect code review

今回のGAで見落としやすいのは、すでにCopilot coding agent向けにMCPを設定しているrepositoryでは、そのMCP serversがCopilot code reviewでも使われる点である。これは移行を楽にする一方、設定の意図が変わる。

Cloud agent用のMCP設定は、作業agentがissueを解釈し、branchを作り、テストや周辺情報を確認するために入れられたかもしれない。そこでは、人間がagent taskを明示的に起動する前提だった可能性がある。一方、Copilot code reviewはPRレビューの流れで動く。レビュー依頼、automatic review、draft PR、branch protection周辺の運用と接続されると、MCP利用の頻度や対象者が変わる。

このため、GitHub管理者はMCPを「agent用」と「review用」に分けて棚卸しする必要がある。利用するserverは同じでも、利用目的、ログ、secret、説明責任が違う。UI確認のためのPlaywright MCPはreview用に向く。社内データ分析MCPや顧客サポートMCPは、PRレビューで使わせる前に、何を読めるかを絞るべきだ。

また、Copilot Secrets and variablesの扱いも確認したい。MCP serverがsecretを必要とする場合、そのsecretは誰が登録し、どのrepositoryで使われ、ローテーションされ、漏えい時にどう止めるのかを決める必要がある。AIレビュー用途だからといって、通常のCI/CD secretより軽く扱うべきではない。

## Analysis: review governance moves from settings to software assets

ここからは分析だ。

今回の更新で、レビューガバナンスはGitHub settingsだけではなく、repository内のsoftware assetsへ移る。`AGENTS.md`、custom instructions、Agent skills、MCP configuration、Secrets and variables、runner configurationが組み合わさって、Copilot code reviewの実際の振る舞いを作る。

これは良い面がある。設定画面に閉じた運用より、MarkdownやJSONで管理されるレビュー標準はPull Requestで変更できる。CODEOWNERSで承認者を置ける。変更履歴を追える。大企業では、レビュー規約の変更自体を監査しやすくなる。

一方で、運用設計が弱いと、repositoryごとにばらばらなAIレビューが生まれる。あるリポジトリではPlaywright MCPが使われ、別のリポジトリでは使われない。あるチームは古いsecurity skillを使い続け、別のチームは`AGENTS.md`とskillに矛盾するルールを書いている。結果として、同じ企業内でもCopilot code reviewの信頼性が揺れる。

日本企業では、委託先、子会社、海外拠点、規制対象システム、SaaSプロダクトが同じGitHub Enterpriseに混在しやすい。全社一律のAIレビュー標準だけでは足りないが、完全に現場任せにもできない。現実的には、enterprise共通の禁止事項、organization別の標準skill、repository別の補足instructionsに分けるのがよい。

## Implementation: build a review control matrix

導入時は、review control matrixを作るとよい。行にrepository、列にCopilot code review設定、runner、content exclusion、AGENTS.md、custom instructions、Agent skills、MCP servers、Secrets and variables、session logging、ownerを置く。

この表でまず見るのは、AIレビューが本番に近いリポジトリで動いているかどうかだ。顧客データ、決済、認可、医療、金融、公共、個人情報、輸出管理、ライセンス制約があるリポジトリでは、MCPを最小にし、人間レビューの必須条件を明確にする。社内ツールや非機密UIなら、Playwright MCPやGitHub MCPを早めに試してもよい。

次に、skillsのownerを置く。Security skillはセキュリティチーム、frontend skillはフロントエンド基盤チーム、migration skillはSREまたはDBA、billing skillはプロダクト基盤、というように分ける。ownerがないskillは、半年後には古くなる。AIレビューの品質を保つには、skills自体のレビューサイクルが必要だ。

3つ目に、MCP serverの権限を棚卸しする。read-onlyであることだけで許可せず、取得できるデータの分類、接続先、認証方式、監査ログ、rate limit、障害時のfallbackを確認する。社内MCPを使うなら、PRレビュー用のnarrow endpointを用意するほうが安全である。全社検索MCPをそのまま接続するより、repository、team、projectに限定したread-only APIを用意したい。

4つ目に、session loggingと従業員説明を確認する。Copilot code reviewがMCPを呼び、promptやresponseやtool callが記録される場合、監査基盤上で誰が閲覧できるかを決める。AIレビューのログは、開発者の作業内容、コード断片、社内文脈を含み得る。集計metricsと本文相当のsession recordは、閲覧権限を分けるべきだ。

## Operational pattern: start with a narrow skill and one MCP

最初の実装は、狭いskillと1つのMCPから始めるのがよい。たとえば、frontend repositoryで「UI diff review skill」を作り、Playwright MCPだけを使う。skillには、対象ファイル、確認URL、画面サイズ、アクセシビリティ観点、コメントすべき重大度、コメントしない軽微な差分を書く。検証環境は個人情報を含まないseed dataにし、認証は専用の低権限アカウントを使う。

次に、結果を人間reviewerと比べる。Copilotが見つけた実害のある指摘、人間しか見つけられなかった指摘、MCPが不要だった指摘、誤った外部文脈に基づく指摘を分類する。採用率だけを見ると、些細なstyle指摘が多いだけでも高く見える。重大度、再発防止、レビュー時間、誤検知の削減を同時に見る。

Security領域では、GitHub MCPを使ってCodeQL alertや関連issueを読むskillを試せる。ただし、security skillは過信しない。AIレビューが「問題なし」と見えるコメントを出しても、人間のrequired review、CodeQL、secret scanning、dependency review、手動脅威分析を置き換えない。Copilot code reviewは追加の早期検知線であり、承認責任ではない。

Platform領域では、migrationやinfra変更にMCPを使わせたくなる。しかし、社内監視、クラウド管理、ticketingを直接MCPに接続する前に、read-only APIを切り出すほうがよい。PRレビューAIが必要とするのは、すべての運用情報ではなく、そのPRの妥当性確認に必要な限定情報である。

## Pitfalls: avoid three common failures

1つ目の失敗は、MCPを多くつなぎすぎることだ。最初から社内検索、ticket、BI、monitoring、browser、design、securityを全部つなぐと、レビューAIのコメントがどの情報に依存したのか分かりにくくなる。最初は1skill、1MCP、1repositoryに絞り、ログと品質を確認する。

2つ目の失敗は、skillsをドキュメント置き場にしてしまうことだ。人間向けの長い規程を貼るだけでは、AIレビューは行動しにくい。skillsには、入力条件、確認手順、コメント条件、重大度、例外、使うMCPを明確に書く。古い情報を消すことも品質管理である。

3つ目の失敗は、read-onlyを理由に法務・セキュリティ・労務説明を後回しにすることだ。PRレビューAIのログには、開発者の作業内容や社内文脈が含まれる可能性がある。導入前に、取得目的、閲覧権限、保存期間、incident時の利用、従業員への説明を決めるべきである。

## 30-day rollout plan

Day 1から7は、棚卸しに使う。Copilot code review有効repository、cloud agent MCP設定、Agent skills、AGENTS.md、custom instructions、runner、content exclusion、session logging、ownerを一覧化する。既存のMCPがcode reviewにも適用されるrepositoryを赤字にする。

Day 8から14は、pilot skillを作る。対象は非機密repositoryのUI変更やドキュメント変更など、失敗時の影響が小さく、レビュー観点が明確な領域にする。skillは短く書き、重大度とコメント条件を明確にする。必要なMCPは1つに絞る。

Day 15から21は、実PRで比較する。Copilot code reviewのコメント、人間reviewerのコメント、MCP tool call、誤検知、見落とし、費用、ログ閲覧権限を確認する。AIが外部文脈を使ったコメントは、根拠が追えるかを必ず見る。

Day 22から30は、展開判断をする。pilot継続、対象repository追加、MCP権限縮小、skill修正、監査ログ整備、人間レビュー条件の更新を決める。全社展開は、少なくともskill owner、MCP owner、session log ownerが決まってからにする。

## まとめ

Copilot code reviewのAgent skillsとMCP GAは、PRレビューAIを差分コメントから運用可能なレビュー基盤へ進める更新である。Agent skillsはレビュー標準をsoftware asset化し、MCPは外部文脈をread-onlyで取得する経路になる。既存cloud agent用MCPがcode reviewにも適用される点は、便利さと同時に棚卸し対象でもある。

日本企業は、今回の更新を「MCPが使えるようになった」とだけ捉えないほうがよい。見るべきものは、skillsのowner、MCPの最小権限、Secrets and variables、session logging、人間reviewerとの責任分界である。1つのskill、1つのMCP、1つの非機密repositoryから始め、コメント品質と監査可能性を見てから広げるのが現実的だ。

## 出典

- [Copilot code review: Agent skills and MCP now generally available](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/) - GitHub Changelog, 2026-07-29
- [Configure MCP servers for your repository](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers) - GitHub Docs
- [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) - GitHub Docs
- [Shape Copilot code review around your team](https://github.blog/changelog/2026-06-02-shape-copilot-code-review-around-your-team/) - GitHub Changelog, 2026-06-02
