---
article: 'anthropic-claude-containment-agent-security-2026'
level: 'expert'
---

Anthropic Engineering の **Claude containment** 記事は、AI agent security の論点をかなり実装寄りに整理している。主題は、Claude が危険な行動をしないようモデル層で抑えることではない。claude.ai、Claude Code、Claude Cowork という異なる product surface に対して、どの environment boundary を置き、どの credential を見せず、どの egress を止め、どの external content を context に入れるかを設計する話である。

日本企業でこの論点が重要なのは、AI エージェントの導入が「チャットで文章を作る」段階から、repository、ticket、SaaS、browser、社内 API、file system、credential、CI runner へ触る段階へ進んでいるからだ。Anthropic の直近動向でも、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) は監査と DLP/SIEM 接続を広げ、[Claude Code権限修正](/blog/claude-code-2149-powershell-mcp-2026/) は PowerShell、worktree、MCP 管理設定を扱った。今回の containment 記事は、それらを支える実行境界の設計原則として読むべきである。

もう一つ重要なのは、モデル能力の向上が risk を単純に減らすわけではない点だ。Anthropic は、モデルが賢くなるほど明白なミスは減る一方、想定外の経路で目標達成する能力も上がると説明している。[Project Glasswing](/blog/anthropic-project-glasswing-mythos-vuln-triage-2026/) のような脆弱性トリアージ用途では、この能力が防御側の価値になる。しかし同じ能力は、権限境界が曖昧な環境では blast radius を広げる。

## 事実: containmentはモデル層ではなく環境層を先に置く

Anthropic は agent risk を、user misuse、model misbehavior、external attackers の 3 類型で整理している。ユーザーが悪意または不注意で危険な指示を出す場合、モデルが誰も頼んでいない harmful action を取る場合、外部コンテンツや runtime を通じて攻撃される場合である。

これに対する defense component は、environment、model、external content の 3 つだ。model layer には classifier、system prompt、probe、training modification がある。external content layer では、MCP、plugin、web search、connector から来る情報をどう扱うかが問題になる。しかし Anthropic が containment として最も重く見ているのは environment layer で、sandbox、VM、filesystem boundary、egress control が中心になる。

この整理は、企業導入ではかなり実務的だ。モデル層の防御は必要だが、確率的である。prompt injection classifier が高性能でも、miss rate はゼロにならない。permission prompt も、利用者が疲れれば判断品質が落ちる。したがって、credential がそもそも sandbox に入らない、workspace 外が mount されない、egress が default deny である、といった deterministic boundary が最後の防衛線になる。

Claude Code auto mode の位置づけもこの文脈で見るべきだ。自動承認は摩擦を下げるが、sandbox の代替ではない。Anthropic の記事では、モデルベースの承認判定が危険行動の多くを止める一方で、一定割合は通す前提で語られている。日本企業が auto approval を有効化するなら、先に devcontainer、network policy、workspace restriction、credential isolation を置く必要がある。

## claude.ai: 一時コンテナは低いblast radiusと低い自由度の交換

claude.ai の code execution は server-side の isolated infrastructure 上で動き、gVisor container と per-session filesystem に寄せている。ローカル端末で code が動かないため、user machine の file や credential へ直接触れない。これは blast radius を小さくする強い設計である。

ただし、自由度は低い。persistent workspace がなく、local filesystem への access もないため、本格的な開発や業務 automation には限界がある。日本企業で言えば、機密情報を含まない一時的な分析、サンプル code 実行、sandboxed な file generation には向くが、社内 repository や production data に密接した task には別設計が必要になる。

この pattern から学ぶべきことは、agent の useful capability と containment strength は交換関係にあるということだ。最小権限に寄せれば安全になるが、業務価値は落ちる。逆に業務価値を上げるために local file、MCP、browser、network を広げるほど、環境側の境界を強くしなければならない。

## Claude Code: human-in-the-loopだけでは前処理とユーザー経由攻撃を止めにくい

Claude Code は terminal に近い。repository を読み、command を提案し、test を動かし、file を編集する。その価値は local context への近さにある。しかし同時に、filesystem、shell、network、MCP、credential helper への距離も近い。

Anthropic の記事では、信頼 dialog の前に project-local configuration が読まれる問題が紹介されている。たとえば repository を開いた時点で `.claude/settings.json` の hook のような project-local input が処理されると、ユーザーが folder を信頼する前に攻撃面が生まれる。これは、local file だから安全という直感が間違っていることを示している。project-open、config-load、localhost listener は inbound request と同じように扱うべきだ。

もう一つの例は、ユーザー自身が攻撃文を貼り付ける phishing 型の prompt injection である。攻撃者から「この手順を実行して」と送られた prompt を、従業員が Claude Code に貼る。モデル層は user intent を尊重しやすいため、そこに credential exfiltration が含まれていても異常として検知しにくい。ここで効くのは、filesystem boundary と egress control である。

これは日本企業の委託開発、社内サポート、security response でも起きうる。Slack、Teams、メール、issue comment に貼られた「調査手順」を AI に投げる運用は自然に発生する。したがって、Claude Code を許可する端末では、home directory、cloud credential、SSH key、browser profile、password manager export、社内 VPN config が agent から見えないようにする必要がある。

## Claude Cowork: knowledge worker向けにはVM境界が合理的

Claude Cowork の設計は、non-technical user を前提にしている。開発者なら command の意味を読めるかもしれないが、knowledge worker に bash や shell expansion の判断を求めるのは現実的ではない。そのため、Anthropic は VM boundary による sealed environment を重視した。

VM design では、ユーザーが選んだ workspace と `.claude` folder だけを mount し、host keychain やその他の filesystem を guest から見せない。credential は host 側に残し、guest には session-scoped token を渡す。これは agent identity の一つの具体例でもある。agent が user credential を丸ごと持つのではなく、revocable で scoped-down な token を持つ。

一方で、VM は万能ではない。Anthropic は、agent loop を VM 内に置くと VM 起動失敗時に製品全体が使えなくなるため、実用性とのバランスで host-mode に調整したと説明している。また local MCP server を VM 外へ移したことで、MCP は user/admin がインストールする local software として扱う方向に寄せている。ここでも重要なのは、どこで code execution が起き、どこで policy enforcement が起きるかを明示することだ。

日本企業で Cowork 型の agent を導入するなら、VDI、DaaS、MDM、EDR、CASB、proxy、file share、OneDrive/SharePoint、Google Drive、local folder mount の関係を先に設計する必要がある。業務ユーザーに承認判断を任せるより、管理者が mount allowlist、read-only mode、delete 禁止、network policy を決めるほうが現実的である。

## egress allowlistはdomain listではなくcapability grantである

Anthropic の記事で最も企業実装に効くのは、egress allowlist の解釈だ。Claude Cowork では Anthropic API への通信が必要だが、攻撃者の API key を含む file が workspace に置かれた場合、許可済み domain を通じて file upload が成立しうる。destination は正しい。だが、operation と credential の組み合わせとしては data exfiltration である。

この問題は、日本企業の network allowlist 設計にそのまま当てはまる。`api.anthropic.com`、`api.openai.com`、`github.com`、`slack.com`、`googleapis.com`、`microsoft.com` を許可しても、それだけでは安全ではない。どの account、どの token、どの API method、どの upload endpoint、どの server-side fetch option が使えるかを見なければならない。

AI agent の egress は、通常の user browser traffic より検知が難しい。agent は tool call を組み合わせ、許可された API を正しい形式で呼ぶ。ログには「成功した認証済み API call」として残るだけかもしれない。だからこそ、domain allowlist は通信先の許可ではなく、能力の許可として設計する必要がある。

実務では、egress proxy に加えて、request provenance、session token binding、header filtering、upload size policy、DLP inspection、workspace path tagging を組み合わせることになる。Anthropic が Cowork で defensive proxy を追加したように、API 側だけでは agent 由来か通常 client 由来かを区別できない場合がある。境界の内側で provenance を持つ component が必要になる。

## external contentはtrusted connectorでもuntrusted dataとして扱う

MCP や connector の安全性は、software supply chain と prompt injection の二層で考える必要がある。コードに脆弱性がないこと、署名や version pinning があることは重要だ。しかし、それだけでは tool output に含まれる悪意ある instruction を防げない。

GitHub connector が安全でも、repository の README が prompt injection を含むかもしれない。Jira connector が安全でも、ticket comment に agent への隠れた指示が混ざるかもしれない。Google Drive connector が安全でも、顧客から受け取った PDF に instruction が埋め込まれるかもしれない。AI agent にとって external content は、単なる data ではなく context である。

このため、MCP の enterprise approval は、connector name だけで判断しないほうがよい。local MCP か remote MCP か、version を pin できるか、tool result を inspect できるか、read-only か write 可能か、production data に触るか、output を別 tool に渡せるかを評価する必要がある。

[PwCとAnthropicのClaude Code/Cowork展開](/blog/pwc-anthropic-claude-code-cowork-2026/) のような大規模利用では、MCP や connector は個人の生産性向上ではなく、業務基盤そのものになる。CoE や security team は、approved connector catalog だけでなく、untrusted data handling の policy を持つべきだ。

## isolationは可視性を下げることがある

強い isolation は安全性を上げるが、監視を難しくする。Anthropic は Cowork の VM isolation について、host-based EDR から guest 内部が見えにくくなる問題を説明している。これは日本企業の compliance posture でも重要だ。EDR が見ている前提で端末統制を組んでいる会社ほど、VM や container の中で AI agent が何をしたかを別経路で取る必要がある。

ここで必要なのは、隔離と可視性の tradeoff を隠さないことだ。VM に入れれば安全、container に入れれば安全、という単純な話ではない。どの event を host 側で見られるか、guest 側からどの telemetry を export するか、network proxy が何を記録するか、MCP call と file access をどう correlation するかを設計する必要がある。

Anthropic Docs の Claude Code security でも、permission settings、devcontainer、OpenTelemetry metrics、MCP permission のような運用部品が示されている。日本企業では、これを SIEM、DLP、CASB、MDM、GitHub audit log、endpoint log と接続し、AI agent の行動を通常の SaaS 利用や endpoint 操作と同じ incident response に載せるべきだ。

## agent identityはユーザー権限のコピーで済ませない

Anthropic の記事は、agent identity を今後の論点として挙げている。AI agent は user の extension として動くのか、それとも agent 自身の principal identity を持つのか。これは、日本企業の認証・認可設計でも避けられない。

user 権限をそのまま継承すると、既存 IAM に乗せやすい。一方で、agent が自律的に長時間動く、scheduled task を持つ、sub-agent を呼ぶ、external tool をまたぐ場合、user session と同じ扱いでは監査しにくい。逆に agent 専用 identity を作ると、scope、approval、lifecycle、revocation、owner、監査ログの設計が必要になる。

Claude Cowork の scoped token design は一つの方向性だ。host keychain に user credential を残し、VM には session-scoped token を渡す。token は user credential より狭く、独立して revoke できる。日本企業でも、AI agent に production credential を直接渡すのではなく、task-specific token、短寿命 token、read-only token、approval-bound token を使う設計が現実的になる。

NCSC-NZ などが共同公開した agentic AI guidance も、agentic AI は自律的な実行、権限委譲、攻撃面の拡大、説明責任の課題を持つと整理している。これは海外政府機関の一般論にとどまらない。日本の金融、製造、医療、公共、通信でも、AI agent がどの ID でどの action をしたかを説明できなければ、本番導入は止まりやすい。

## 日本企業向けの導入チェックリスト

第一に、agent runtime inventory を作る。claude.ai、Claude Code、Cowork、browser automation、CI runner、local MCP、remote MCP、plugin、社内 agent framework を一覧化し、code execution の場所、filesystem access、network egress、credential visibility を記録する。

第二に、workspace policy を定義する。home directory 全体を見せない。顧客別 folder を混ぜない。download folder と desktop を default mount にしない。read-only、read-write、delete 禁止を分ける。symlink resolution は path validation の前に行う。これらは Claude Cowork の設計から直接学べる。

第三に、egress を capability として設計する。domain allowlist だけでなく、API method、account binding、token provenance、upload/download、server-side fetch、proxy inspection、DLP を分ける。許可 domain 経由の exfiltration を threat scenario に入れる。

第四に、MCP approval を二段階にする。connector software の承認と、connector が読む data の trust level を分ける。remote MCP は挙動が変わりうるため、production data の前に sandbox account と fake data で試す。write tool は read-only tool より明確に厳しく扱う。

第五に、monitoring を containment design に含める。VM や container が EDR から見えないなら、OpenTelemetry、proxy log、agent session log、MCP call log、file access summary を別途回収する。監査ログは取るだけでなく、誰が見るか、どの alert を止めるか、どの incident response に載せるかを決める。

第六に、permission prompt の設計を user role ごとに変える。開発者には一部の command approval を任せられるかもしれないが、knowledge worker には bash 判断を求めない。非エンジニア向け agent ほど、管理者が絶対境界を置くべきだ。

## まとめ

Claude containment の要点は、AI agent を信用するかどうかではない。AI agent が有用になるほど、filesystem、network、credential、tool、external content へ近づく。そのとき、被害範囲を deterministic に制限する environment boundary が必要になる、という話である。

日本企業は、Claude Code や Cowork、MCP を導入するとき、model safety や prompt policy だけでなく、実行場所、mount path、egress、agent identity、MCP trust、telemetry を同じ設計図で扱うべきだ。特に、許可済み domain 経由の exfiltration、信頼前 config load、ユーザー経由 prompt injection、remote MCP の挙動変化、VM による EDR 可視性低下は、PoC 段階から scenario に入れたい。

AI エージェントの導入判断は、今後ますます「どのモデルが賢いか」から「どの境界で安全に働かせられるか」へ移る。Claude containment は、その議論を始めるための実装寄りの基準線として使える。

## 出典

- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) - Anthropic Engineering, 2026-05-25
- [Security](https://docs.anthropic.com/en/docs/claude-code/security) - Anthropic Docs
- [Development containers](https://docs.anthropic.com/en/docs/claude-code/devcontainer) - Anthropic Docs
- [Careful Adoption of Agentic AI Services](https://www.ncsc.govt.nz/protect-your-organisation/careful-adoption-of-agentic-ai-services/) - NCSC-NZ, 2026-05-01
