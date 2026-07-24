---
article: 'github-mcp-server-stateless-spec-2026'
level: 'expert'
---

GitHub MCP Server の `2026-07-28` MCP specification 対応は、agent tool integration の運用設計をかなり変える更新である。GitHub Changelog は、MCP protocol が stateless core に移り、GitHub MCP Server が正式リリース前に最新仕様を support したと説明している。表面上は GitHub MCP Server の changelog だが、実務上の主語は GitHub だけではない。MCP server を社内に置く企業、Copilot から外部 tool を呼ぶ開発組織、MCP gateway を管理する platform team、AI agent の監査ログを読む AppSec / IT 部門が対象になる。

この話は、[GitHub Agent FinderとARD](/blog/github-copilot-agent-finder-ard-2026/) の続きとして読むと分かりやすい。Agent finder は、agent が必要な MCP server、skill、agent、tool を registry から探す方向を示した。今回の MCP 仕様対応は、その発見後に実際の request がどう流れ、どこで routing、認証、監査、検証を行うかの話である。[GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱った secret scanning や dependency scanning のような防御 tool も、同じ MCP execution plane に乗る。

## 事実: 2026-07-28仕様はstateless coreを中心にする

MCP Blog の release candidate 記事は、`2026-07-28` 仕様を、launch 以来最大の改訂だと位置づけている。中心は stateless protocol core、extensions framework、Tasks、MCP Apps、authorization hardening、formal deprecation policy である。特に production deployment への影響として、remote MCP server が sticky sessions、shared session store、gateway の deep packet inspection に依存しにくくなると説明されている。

従来の Streamable HTTP では、client が `initialize` request を送り、server が `Mcp-Session-Id` を返す。後続の request はその session id を持ち、client は session を発行した server instance へ事実上結びつきやすい。水平スケールさせるには sticky routing や shared session store が必要になる。

`2026-07-28` ではこの前提が変わる。`initialize` / `initialized` handshake は削除され、protocol version、client info、client capabilities は request ごとの `_meta` に入る。`Mcp-Session-Id` と protocol-level session も削除され、request は self-contained になる。必要なら `server/discover` で capabilities を取得する。draft specification でも key details として、JSON-RPC 2.0、stateless self-contained requests、per-request capability negotiation が示されている。

ただし、application が state を持てなくなるわけではない。MCP Blog は、tool が `basket_id` や `browser_id` のような explicit handle を返し、model が後続 call でその handle を通常の argument として渡す設計を示している。これは session state を transport metadata の中に隠すのではなく、model と監査ログが見える data flow に出す設計である。

## 事実: GitHub MCP Serverはsessionとpayload inspectionを減らした

GitHub Changelog は、GitHub MCP Server 側の変更を3つ挙げている。第一に Redis sessions の削除である。`initialize` での database write と、各 call での database read がなくなり、利用者に影響を出さずに処理が軽くなると説明されている。

第二に deep packet inspection の回避である。GitHub は logging や secret scanning のために一部の request 情報を読む必要があるが、新仕様では HTTP header に必要な値があるため、SDK が処理する前に request payload を深く検査する必要が減る。MCP Blog 側も、Streamable HTTP transport に `Mcp-Method` と `Mcp-Name` header が求められ、load balancer、gateway、rate limiter が body inspection なしで operation を扱えると説明している。

第三に elicitation 実装の更新である。GitHub MCP Server の stdio MCP server は login のために URL elicitation を使う。新 protocol version では各 step が別 HTTP request になるため、公式 Go SDK の wrapper を使い、新旧 client の両方で動くようにしたとされる。

GitHub は conformance tests も強調している。MCP に official conformance tests が加わり、AI assisted development の検証がしやすくなる。これは、agent が MCP server 実装を修正するときに「仕様書を読んだつもり」ではなく、conformance suite を実行して確認できるという意味で重要である。

## 分析: stateless化はMCPを企業ネットワークへ載せやすくする

ここからは分析だ。

日本企業で MCP server を本番化するとき、最初の壁は protocol そのものより運用面である。どの network segment に置くか、VPN や ZTNA を通すか、API gateway を挟むか、SaaS 連携と社内 system 連携を分けるか、監査ログを SIEM へ流すか、端末上の local MCP を許すか。これらは model の性能とは別の問題だ。

stateless core は、この運用問題に効く。protocol-level session がなくなれば、MCP server は通常の HTTP service に近づく。load balancer の sticky routing を前提にしなくてもよく、instance replacement、autoscaling、blue-green deployment、regional failover を組みやすい。session store を持たない構成なら、障害時に調べる moving parts も減る。

header の明確化も大きい。`Mcp-Method` と `Mcp-Name` で operation を見られるなら、gateway は「tools/call のうち、この tool name は high risk」「resources/read は read-only だが個人情報を返す」「prompts/list は cache 可能」のように policy を置きやすい。payload を全部読まなくても、routing、rate limit、observability の初期判断ができる。

これは [Copilot cloud agent設定監査API](/blog/github-copilot-cloud-agent-config-audit-api-2026/) で扱った repository ごとの MCP / tool 設定棚卸しと接続する。設定監査は「何が許可されているか」を見る。一方、MCP gateway log は「実際に何が呼ばれたか」を見る。両方を組み合わせて初めて、agent 運用の説明責任が成り立つ。

## 分析: sessionを消しても権限リスクは消えない

注意すべきなのは、stateless 化を安全策と誤解しないことだ。protocol-level session がなくなると scaling と routing は楽になるが、agent が tool を実行するリスクは残る。むしろ request が self-contained になるなら、各 request の metadata、identity、authorization、tool arguments、resource handle を正確に扱う必要が増える。

たとえば、旧実装で server session に user、repository、tenant、selected project を隠していた場合、新仕様ではそれを tool argument や explicit handle に出すことになる。これは監査上は良いが、handle の有効期限、scope、漏えい時の影響を設計しなければならない。`browser_id` のような handle が他 user や他 repository で再利用できるなら危険である。

また、MCP tool description と tool result は prompt injection の入力面にもなる。GitHub MCP Server が secret scanning などの防御 tool を提供していても、すべての MCP server が同じ品質とは限らない。社内で作った MCP server、vendor が提供する remote MCP、開発者が個人で入れた local MCP では、認証、ログ、schema、rate limit、error handling、tool safety がばらつく。

draft specification は security and trust & safety の section で、user consent、data privacy、tool safety を key principles としている。特に tool は arbitrary code execution と同じ慎重さで扱うべきで、host は tool invocation 前に user consent を得るべきだと整理されている。これは protocol が強制する安全境界ではなく、implementor が組み込むべき設計原則である。

## 実務: 社内MCP serverをどう棚卸しするか

最初の作業は inventory である。GitHub MCP Server、Slack / Jira / Google Drive / Datadog などの SaaS MCP、社内 API 用 MCP、local filesystem MCP、database MCP、browser automation MCP、security scanner MCP を分ける。各 server について、owner、source repository、deploy location、transport、auth method、allowed clients、read tools、write tools、data classification、log destination、retention を記録する。

次に、client surface を分ける。Copilot CLI、VS Code、JetBrains、Visual Studio、Eclipse、Xcode、GitHub Copilot app、社内 agent runner では、MCP client の更新タイミングも許可設定も違う。GitHub Docs は MCP が主要な Copilot surfaces で利用でき、GitHub MCP server や GitHub MCP Registry も説明している。だからこそ、同じ server でも「どの surface から使えるか」を別列で見る必要がある。

3つ目は risk tiering である。`read_repository`、`search_code`、`list_issues` のような read tool、`create_issue`、`update_label`、`open_pr`、`merge_pr`、`trigger_workflow` のような write tool、`read_secret_scanning_alerts`、`run_dependency_scan` のような security tool、`query_customer_db`、`update_billing` のような high-risk business tool を分ける。Copilot の便利さを理由に、全部を同じ allowlist に入れてはいけない。

4つ目は stateless migration check である。server が protocol-level session に依存していないか、`initialize` に副作用を持たせていないか、session id と user state を結びつけていないかを調べる。必要な state は explicit handle にし、handle は user、tenant、repository、tool scope、有効期限へ bound する。handle を log に残す場合は、値そのものではなく hash や redacted form を使う。

5つ目は gateway logging である。最低限、timestamp、user identity、client surface、repository、MCP server id、protocol version、Mcp-Method、Mcp-Name、tool risk tier、result status、duration、request id、traceparent を残す。body や tool result を保存する場合は、個人情報、secret、顧客情報、source code の扱いを別に決める。ログが便利だからと全文保存すると、監査基盤自体が機密データの集積地になる。

## 実務: conformance testsをagent開発に組み込む

MCP conformance tests は、社内 MCP server を運用するチームにとって重要な土台になる。AI agent が実装を修正する時代では、レビュー担当者がすべての protocol detail を手で確認するのは難しい。conformance suite を CI に入れておけば、agent が変更した server が最低限の protocol expectation を満たすかを機械的に確認できる。

実装チームは、spec、conformance tests、SDK version、server implementation を同じ repository または同じ CI pipeline で扱うとよい。Copilot に修正を任せる場合も、「この conformance test を通してから PR を出す」という task にできる。これは [Copilot Issue自動化の承認線](/blog/github-copilot-issue-agent-automation-controls-2026/) で扱った confidence や approvals より下の技術検証であり、人間承認の前に落とせる不具合を減らす。

conformance tests だけで security が保証されるわけではない。仕様適合と権限設計は別である。したがって、CI では conformance、schema validation、auth integration test、negative permission test、secret redaction test、rate limit test を分ける。MCP server が write tool を持つなら、dry run mode や sandbox target での integration test も必要になる。

## 実務: 日本企業向けの移行順序

最初の2週間は、使っている MCP server と client surface の一覧を作る。GitHub MCP Server だけでなく、開発者が個人で追加した local MCP、PoC のために入れた remote MCP、社内 wiki に残っている古い設定も見る。特に委託先や子会社が同じ GitHub Enterprise を使う場合、社外メンバーがどの MCP server を使えるかを確認する。

次の2週間で、high-risk tool を絞る。read-only から始め、write tool は repository を限定する。security scanner のような defensive MCP は展開しやすいが、それでも scan result や secret candidate をどこに返すかを確認する。顧客情報、課金、HR、法務、医療、金融データに触る MCP は、Copilot の標準利用とは別の審査に回す。

その後、gateway と log を整える。`Mcp-Method` と `Mcp-Name` を見て routing と log を分けられるか、body を見ずに rate limit できるか、OpenTelemetry 互換の trace を downstream service までつなげるかを検証する。MCP Blog は W3C Trace Context propagation も仕様に記載されたと説明している。これを使えば、host application から MCP server、その先の API まで single span tree として追える可能性がある。

最後に、conformance と regression test を入れる。MCP SDK や spec が更新されたら、社内 MCP server の CI を回す。Copilot や他 agent に修正を任せる場合も、合格条件を conformance tests、permission tests、build、lint に分けて明示する。agent に「MCP 対応を直して」とだけ頼むより、通すべき検証を用意した方が品質は安定する。

## まとめ

GitHub MCP Server の次期 MCP 仕様対応は、Copilot と外部 tool の接続を production-ready に近づけるための更新である。`2026-07-28` 仕様は、protocol-level session を外し、request を self-contained にし、gateway が header で operation を扱いやすくし、extensions、authorization hardening、conformance tests を整える。

日本企業が今やるべきことは、すべての MCP server を急いで書き換えることではない。MCP inventory を作り、session 依存を探し、read / write / high-risk tool を分け、gateway log を設計し、conformance tests を CI に入れることである。Copilot を agent 基盤として使うほど、MCP は単なる接続規格ではなく、権限、監査、費用、セキュリティの境界になる。

## 出典

- [GitHub MCP Server supports the next MCP specification](https://github.blog/changelog/2026-07-23-github-mcp-server-supports-the-next-mcp-specification/) - GitHub Changelog, 2026-07-23
- [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) - Model Context Protocol Blog, 2026-05-21
- [Model Context Protocol draft specification](https://modelcontextprotocol.io/specification/draft) - Model Context Protocol
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp) - GitHub Docs
