---
article: 'github-copilot-agent-finder-ard-2026'
level: 'expert'
---

GitHub Copilot Agent finder は、Copilot の agent surface が増えた後に出てきた discovery layer と見るべきだ。2026年6月17日の GitHub Changelog では、Agent finder が MCP servers、skills、canvases、agents、tools を手で配線し続ける負荷を下げ、自然文の task から AI resource の候補を返す機能として説明されている。

この更新は [Copilot appキャンバス](/blog/github-copilot-app-canvases-agent-work-2026/) の続きとして読むと分かりやすい。Copilot app は agent session、canvas、cloud session、browser、terminal を束ねる作業面を広げた。一方、Agent finder は、その作業面で agent がどの capability に到達できるかを扱う。つまり、作業面の統制と capability discovery の統制が別々に必要になった。

さらに [Copilot VS Code管理plugin](/blog/github-copilot-vscode-managed-plugins-2026/) で扱った enterprise-managed plugins や、[GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) のような MCP security とも接続する。Agent finder は、agent が使う resource を「事前に全部配布する」状態から、「registry から検索して選ぶ」状態へ移す。この移行は便利だが、管理境界を曖昧にしやすい。

日本企業で見るべき論点は、ARD という標準名そのものではない。どの registry を検索させるか、resource publisher をどう証明するか、発見後の install や接続を誰が承認するか、agent session と resource usage をどう監査するかである。

## 事実: Agent finderの3つの制御点

GitHub の発表でまず見るべき制御点は、registry selection だ。Agent finder は registry に対して動く。GitHub の curated public catalog を使うことも、自社の private registry を使うこともできる。これは企業導入では決定的に重要だ。検索対象を public catalog に広げるのか、社内承認済み resource に閉じるのかで、risk model が変わる。

2つ目は managed settings との連動だ。GitHub は、Copilot を governance する同じ場所で、agent が発見・利用できる resource を定義できると説明している。Agent finder は enterprise が許可したものだけを surface するという前提で設計されている。これは、resource discovery を個人設定ではなく enterprise policy の下に置くという意味だ。

3つ目は no auto installation だ。Agent finder は task に合う resource を見つけるが、黙って接続したり install したりするものではない。ここは security review で重要になる。発見は検索行為であり、接続は権限付与行為だ。この2つを分けられるなら、企業は発見を広げつつ、実際の利用に review gate を置ける。

これら3点を合わせると、Agent finder は「agent が好きな tool を勝手に使う」機能ではない。むしろ、agent resource の探索面を registry と policy に寄せる機能だ。ただし、そのように運用するには、企業側が registry、policy、review process を実装しなければならない。

## 事実: ARDの設計はcatalogとregistryに分かれる

Agent finder が実装している Agentic Resource Discovery、ARD は、agentic resource を web 上で発見するための open specification だ。Google Developers Blog は、agent が拡大する ecosystem の中で、必要な capability の所在、選択、検証を標準的に扱う必要があると説明している。

ARD の基本部品は catalog と registry だ。catalog は provider が自分の domain 配下に置く capability の一覧であり、registry はその catalog を index して検索可能にする。Google の説明では、catalog は組織 domain と結びつくため、publisher identity と trust の土台になる。registry は agent からの discovery request に対して、候補 resource と検証に必要な metadata を返す。

Hugging Face の説明では、ARD は MCP、Skills、A2A の前段にある discovery layer だ。MCP は tool invocation の標準、Skills は instruction consumption の仕組み、A2A は agent-to-agent の接続に関係する。しかし、それらは利用者や agent が「どれを使うか」を先に知っている前提になりやすい。ARD は、agent が natural language intent から runtime に capability を探すための層として位置づく。

この設計には context management の意味もある。全部の tool description を LLM context に詰め込むと、context budget を圧迫し、選択精度も落ちる。registry search によって候補を絞るなら、agent は必要な resource だけを後から読む形にできる。

一方で、ARD repository は v0.9 draft として公開されている。仕様は open で evolving であり、feedback や proposal を受ける段階だ。したがって、企業は ARD を「すでに固定された業界標準」として扱うのではなく、今後の interoperability の方向として評価し、自社実装では version pinning、compatibility testing、fallback plan を持つべきだ。

## 企業リスク: discoveryは権限境界を広げる

Agent finder の導入リスクは、agent が resource を実行する瞬間だけにあるわけではない。発見できること自体が、組織の情報境界を変える。

たとえば、private registry に「本番障害調査用の observability MCP」「請求 API を読む support skill」「人事データを要約する internal agent」「顧客問い合わせを起票する tool」が並んでいるとする。たとえ auto installation されなくても、開発者や agent がその存在、説明、tag、代表 query、権限情報を見られるなら、それ自体が情報資産になる。

そのため、catalog metadata の公開範囲を設計する必要がある。resource name、description、example query、compliance attestation、owner、endpoint、scope はどこまで見せるのか。社内全員に見せてよいのか、部署別に分けるのか、委託先に見せるのか。resource 本体の権限だけでなく、metadata の閲覧権限も考える必要がある。

また、resource discovery は social engineering の入口にもなり得る。似た名前の MCP server、偽の publisher、古い catalog、内部 tool を装った public resource が候補に出ると、agent や人間が誤って選ぶ可能性がある。ARD が publisher identity や trust metadata を重視するのはこのためだが、企業側でも allowlist と publisher verification を必須にすべきだ。

日本企業では、取引先名、顧客名、障害対応手順、セキュリティ運用、社内システム名が catalog metadata に出ることがある。便利な検索性と情報開示は同じ設計面にある。private registry を作るなら、resource 本文だけでなく metadata の機密区分を決めるべきだ。

## registry設計: public catalogよりprivate catalogを先に作る

実務では、public catalog を探索する前に private registry を設計した方がよい。理由は単純で、企業が説明できる resource だけを agent に見せる方が、最初の governance として強いからだ。

private registry には、少なくとも6つの情報を持たせたい。1つ目は owner。resource の責任者、運用チーム、問い合わせ先を明確にする。2つ目は capability。何ができるのか、read-only なのか write できるのか、人間承認が必要なのかを説明する。3つ目は data classification。扱うデータが公開情報、社内限定、個人情報、顧客機密、security-sensitive のどれかを示す。

4つ目は allowed surfaces。Copilot app、VS Code agent mode、Copilot CLI、cloud agent、code review、custom agent のどこで使ってよいかを分ける。5つ目は allowed repositories または organizations。全社利用可なのか、特定 repository のみか、managed user や委託先には出さないのかを決める。6つ目は lifecycle。version、last reviewed date、deprecation date、incident contact、rollback path を持つ。

この registry は YAML や JSON の一覧でも始められるが、最終的には監査可能な管理台帳になる。GitHub の Agent finder は registry を指せるが、registry の中身を誰が審査するかは企業側の仕事だ。Platform Engineering が registry operation を持ち、AppSec が high-risk resource を review し、情シスが SaaS connector と data handling を確認する役割分担が必要になる。

## MCPとの接続: 呼び出し権限をresource単位で見る

Agent finder は MCP server を見つける可能性がある。MCP は agent に外部 tool を使わせるための強い接続点なので、resource discovery と MCP governance は切り離せない。

MCP server の審査では、まず transport と authentication を見る。stdio、HTTP、remote endpoint、OAuth、PAT、GitHub App token、cloud role、service account のどれを使うのか。次に、tool schema と実行範囲を見る。read-only か、ticket 作成や deployment 変更のような write action を持つか。さらに、prompt injection や tool poisoning に対して、server がどの入力を信頼するかを確認する。

Agent finder によって MCP server が discoverable になると、設定ファイルに直接 URL を書くより見つけやすくなる。これは利点だが、利用者が server の性質を誤解しやすくもなる。たとえば「ログ検索 MCP」と書かれていても、実際には本番ログ、PII、API token、customer support transcript を読める可能性がある。

[GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱ったように、agent に security tool を渡すことは有益だ。しかし、すべての MCP が安全なわけではない。Agent finder の registry では、MCP server ごとに最小権限、test environment、audit log、rate limit、data retention、disable switch を明示するべきだ。

## managed settingsと監査APIを一つの棚卸しに入れる

GitHub は Agent finder が managed settings と連動すると説明している。これは、企業が Copilot governance の中で discovery scope を管理できるという意味だ。ただし、設定しただけでは十分ではない。定期的に「実際にどの repository、どの team、どの user に何が見えるか」を棚卸しする必要がある。

ここで [Copilot設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) の発想がそのまま効く。cloud agent の MCP server、enabled tools、Actions approval、firewall configuration を API で見るように、Agent finder の registry scope、allowed resources、managed settings、実際の resource usage も監査対象に入れるべきだ。

理想的には、月次で次の表を出す。registry 名、登録 resource 数、high-risk resource 数、owner 未設定 resource 数、最終 review から90日以上経過した resource 数、実際に使われた resource 数、未使用だが許可済みの resource 数、incident や policy violation の有無。この表がないと、resource discovery は増えても管理成熟度は上がらない。

さらに、resource usage と PR outcome をつなげる。Agent finder で見つけた resource が、どの agent session、どの issue、どの PR、どの CI run、どの merge に関係したかを追えると、効果測定ができる。逆に、resource discovery だけが増え、PR 品質や手戻りが改善しないなら、registry の品質か agent の使い方を見直す必要がある。

## 既存配布方式との役割分担

Agent finder が出ると、すべてを registry 検索に寄せたくなる。しかし、企業運用では3つの配布方式を分けた方がよい。

1つ目は baseline distribution だ。全開発者が常に使う標準 plugin、社内 coding rule、security guidance、approved MCP は、enterprise-managed plugins や標準設定として配る。これは検索ではなく、既定値として揃えるべきものだ。

2つ目は approved discovery だ。全員に常時配るほどではないが、必要な task では使ってよい resource を private registry に置く。Agent finder はここに向く。たとえば、特定 cloud、特定 framework、特定 observability stack、特定 release process 用の skill や MCP が該当する。

3つ目は request-based access だ。production data、customer support、billing、HR、security incident、legal review に関わる resource は、見つけられても利用には申請を挟む。Agent finder の候補には出してもよいが、接続には break-glass や approval workflow を必要にする。

この3分類をしないと、Agent finder は「何でも探せる便利機能」になってしまう。企業が本当に必要なのは、agent に全部を見せることではなく、task に応じて必要十分な capability に到達させることだ。

## 日本企業向けの導入パターン

最初の pilot は、開発基盤チームが owner になり、private registry を1つ作る構成がよい。登録する resource は、read-only の docs search、CI log search、dependency update helper、release note skill、test failure triage skill くらいに絞る。個人情報や本番 credential に触れる resource は入れない。

次に、repository scope を限定する。全社 repository ではなく、internal tooling、sandbox、非本番 service、OSS mirror、docs repository から始める。agent surface も VS Code または Copilot app の人間監視下に絞り、cloud agent や automation への展開は後にする。

その後、high-risk resource の審査 template を作る。MCP server なら endpoint、auth、tool list、read/write 権限、data classification、log retention、rate limit、disable procedure を記入させる。skill なら instruction 内容、期待する入力、禁止行為、参照 source、maintainer、更新頻度を記入させる。custom agent なら allowed repository、model policy、tool policy、review condition を持たせる。

最後に、四半期ごとに registry hygiene を行う。使われていない resource を消す、owner 不在の resource を止める、古い version を廃止する、事故があった resource を quarantine する、public catalog 由来の resource を private registry に採用するか判断する。agent resource は作って終わりではなく、SaaS account や API key と同じく棚卸しが必要だ。

## まとめ

GitHub Copilot Agent finder は、Copilot が task に応じて AI resource を探すための discovery layer だ。ARD 仕様を実装し、registry selection、managed settings、no auto installation という制御点を持つ。これにより、agent にすべての tool を常時持たせるのではなく、必要な capability を検索して選ぶ運用が可能になる。

日本企業での本質は、発見性を上げることではなく、発見可能な能力を統制することだ。private registry、resource owner、data classification、allowed surfaces、approval gate、usage log、review cadence を揃えなければ、Agent finder は便利さの裏で shadow tool の入口になる。

ARD は v0.9 draft であり、エコシステムはこれから変わる。だからこそ、今は public catalog を広く開くより、狭い private registry で pilot し、managed settings と監査を合わせて設計するのがよい。Copilot が agent 実行基盤へ近づくほど、agent が見つけられる capability そのものが governance 対象になる。

## 出典

- [Agent finder for GitHub Copilot now available](https://github.blog/changelog/2026-06-17-agent-finder-for-github-copilot-now-available/) - GitHub Changelog, 2026-06-17
- [Announcing the Agentic Resource Discovery specification](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/) - Google Developers Blog, 2026-06-17
- [Agentic Resource Discovery: Let agents search for tools, skills, and other agents](https://huggingface.co/blog/agentic-resource-discovery-launch) - Hugging Face, 2026-06-17
- [Agentic Resource Discovery specification](https://github.com/ards-project/ard-spec) - ards-project
- [Agent Finder - AI resources](https://github.com/agentfinder) - GitHub
