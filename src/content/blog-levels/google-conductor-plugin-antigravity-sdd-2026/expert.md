---
article: 'google-conductor-plugin-antigravity-sdd-2026'
level: 'expert'
---

Google の Conductor Plugin 更新は、AI コーディングエージェントの運用設計を考えるうえで地味に重要だ。モデル性能、IDE 統合、CLI 操作、リモート実行環境のニュースに比べると派手ではない。しかし、企業導入で最後に問題になるのは「AI がコードを書けるか」より、「AI がどの仕様と計画に基づいて書いたかを、チームが継続的に管理できるか」である。

Google Developers Blog は 2026年7月16日、Conductor が Gemini CLI extension から **Conductor Plugin** へ進化し、Antigravity CLI など複数の AI coding agent 環境で使えるようになると説明した。公式説明では、Conductor は project awareness を ephemeral chat logs から persistent, version-controlled markdown files へ移す発想で始まり、今回の plugin 化によって厳密な command sequence に依存しない conversational な体験へ寄せる。

このサイトではすでに [Gemini Code Assist の Antigravity 移行](/blog/google-antigravity-code-assist-migration-2026/)、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/)、[Google ADK と A2A](/blog/google-adk-a2a-cross-language-agents-2026/) を扱ってきた。これらはそれぞれ、開発者の操作面、API 側の実行基盤、agent 間通信の境界を扱う話だった。Conductor Plugin は、その間にある「人間と coding agent の作業契約」を扱う層として見ると位置づけが分かりやすい。

## 事実: extensionからpluginへ移った意味

Google の発表では、Conductor Plugin は skills、rules、MCP servers、hooks を一つの package として扱える plugin へ移行したと説明されている。Gemini CLI 専用の extension ではなくなることで、Antigravity CLI、Claude、その他の tools へ workflow を広げられる。公式ブログは、どの tool を選んでも foundational documents、architecture、guidelines、goals を agent が理解し、shared configuration と development tracks が継続すると説明している。

ここで重要なのは、plugin 化が単なる packaging の話ではないことだ。Conductor は、AI と自然言語で話しながら context、spec、plan を作れるようになり、必要なときに context 更新や plan の task completion を背後で管理する。つまり、ユーザーが毎回 slash command の順序を守るより、agent が Conductor protocol を認識して作業状態を更新する方向へ寄っている。

一方で、`spec.md` と `plan.md` が消えるわけではない。公式ブログは、persistent Markdown artifacts の利点は維持するとしている。これは設計上かなり大事だ。会話の UX は柔らかくしても、成果物はリポジトリ内に残す。チャット主体の AI 開発が抱えやすい「会話は便利だが証跡が弱い」という問題に対し、Conductor は会話と version control の間に橋を架ける。

README 側を見ると、Conductor は Context、Spec & Plan、Implement という lifecycle を持つ。初回 setup では product、product guidelines、tech stack、workflow を定義し、new track では spec、plan、metadata を生成する。implement では agent が `plan.md` に沿って作業し、status、review、revert も扱える。これは prompt 集ではなく、AI 作業の状態管理モデルである。

## 分析: AI codingの失敗は実装前に始まる

AI コーディングエージェントの失敗は、生成されたコードのバグとして表面化することが多い。しかし根本原因は、その前にあることが多い。要件が曖昧だった。既存設計を読んでいなかった。禁止された依存を使った。レビュー観点を知らなかった。タスクを小さく分けず、一度に大きな変更をした。これらは実装後の lint や test だけでは拾いにくい。

Conductor の Spec-Driven Development は、この問題を実装前に戻す。まず context を持ち、spec を作り、plan を立て、その計画に沿って実装する。これ自体は人間の開発では当たり前に見えるが、AI エージェントでは意識的に設計しないと失われやすい。モデルは即座にコードを書けるため、曖昧な依頼でも実装へ進んでしまうからだ。

日本企業では、この「すぐ書ける」ことがリスクになる。受託開発や社内基幹システムでは、要件定義、基本設計、詳細設計、テスト仕様、レビュー記録が契約や監査と結びつく。AI が Slack や IDE chat で受けた依頼から直接コードを作り、根拠がチャットにしか残らないなら、あとから説明できない。Conductor は、AI を速く動かす前に、何を作るかを残す仕組みとして評価できる。

この点は [Google Jules のプロアクティブ評価](/blog/google-jules-proactive-coding-agent-eval-2026/) の論点ともつながる。Jules の評価では、agent が何を重要と判断し、どの根拠で通知するかを見る必要があった。Conductor でも、agent が plan に対して何を完了したか、どの task を戻したか、どの review fix を追加したかが重要になる。AI 作業の品質は、最終 diff だけでは測れない。

## 企業導入での設計論点

第一の論点は、Conductor artifacts の所有者だ。`conductor/product.md`、`product-guidelines.md`、`tech-stack.md`、`workflow.md` は、AI が判断に使う operating context になる。これを各開発者が自由に書き換えると、AI の行動規範がブレる。プロダクト責任者、アーキテクト、セキュリティ、QA、デザインシステム担当のどこがどの文書を approve するかを決める必要がある。

第二の論点は、track 粒度だ。AI エージェントには大きな作業を任せたくなるが、plan が巨大になるほどレビューしにくく、失敗時の revert も重くなる。Conductor の track は feature や bug fix の単位として扱えるため、組織として「1 track は 1 PR に対応させる」「DB migration を含む track は別承認にする」「認証や権限変更は phase を分ける」といった運用ルールを置くとよい。

第三の論点は、plugin trust である。Conductor Plugin は、Antigravity では GitHub URL から install でき、workspace-level isolation も可能と README にある。これは便利だが、企業では supply chain と設定管理の対象になる。どの repository から plugin を入れてよいか、global install を許すか、workspace の `.agents/plugins/` をレビュー対象にするか、plugin update を誰が検証するかを決めるべきだ。

第四の論点は、MCP と hooks の扱いだ。Google の blog は plugin package に MCP servers や hooks を含められると説明している。Conductor 自体の価値は spec と plan だとしても、plugin という形式は agent の行動範囲を広げられる。社内 API、issue tracker、CI、クラウド、ドキュメント、ファイルシステムへつながる MCP を許す場合、Conductor の track だけでなく接続先の認可も設計対象になる。

第五の論点は、token と latency である。README は、spec-driven approach が context、spec、plan を読み分析するため token consumption を増やし得ると注意している。大規模 repository で全 context を毎回読むと、コストが増え、応答も遅くなる。project context を何に絞るか、track ごとにどの directories を対象にするか、古い plans をどう archive するかが実務上の運用課題になる。

## レビュー工程へどう組み込むか

Conductor を企業で使うなら、PR 前の見え方を設計したい。たとえば、feature track を開始したら、まず `spec.md` と `plan.md` だけを draft PR か design review に出す。実装前レビューで合格したら `/conductor:conductor-implement` 相当の実装へ進む。実装後は、plan の task checkbox、生成された code diff、test result、review notes をまとめて確認する。

この運用では、AI の出力をそのまま信じない。むしろ、AI が作った spec と plan をレビュー対象にする。レビュー担当者は、要件の欠落、設計の過剰さ、既存規約との不整合、リスクの高い task、テスト不足を実装前に指摘する。実装後レビューでは、plan と diff が対応しているかを見る。こうすると、AI による大きな暴走を早く止められる。

レビュー後の修正も、Conductor の `conductor-review` の考え方に合わせられる。README では、完了後に問題が見つかった場合、review command が変更を監査し、plan に Review Fixes の tracking phase を追加して解決すると説明されている。これは、レビュー指摘をチャットで消費せず、plan 上の修正作業として残す発想である。

revert も同じだ。AI エージェントの失敗を戻すとき、単純に git revert だけでなく、どの track、phase、task を pending に戻すかが重要になる。Conductor の safe state reversion は、git history と plan state を結びつける発想を持つ。日本企業の監査では、戻した事実だけでなく、なぜ戻し、どの計画状態へ戻ったかも残したい。

## 既存ツールとの役割分担

Conductor は ticketing system の代替ではない。Jira、GitHub Issues、Linear、Backlog のようなチケットは、優先度、担当者、期限、ビジネス上の承認を持つ。一方、Conductor の spec と plan は、AI agent が実装するための作業契約に近い。チケットを Conductor track へ落とすときに、どの情報を写し、どの情報をチケット側に残すかを決める必要がある。

Conductor は CI の代替でもない。plan に test task があっても、実際の build、unit test、integration test、security scan は CI で実行するべきだ。Conductor の plan は「何を確認すべきか」を書く場所であり、CI は「確認が実際に通ったか」を証明する場所である。この役割を混ぜると、plan にチェックが付いているだけで合格したように見える。

Conductor は architecture decision record の代替にもならない。track ごとの spec は短期作業の文脈に向くが、長期的な設計判断、技術選定、セキュリティ例外、データ保持方針は ADR や design doc に残すべきだ。Conductor の product context や tech stack がそれらを参照する形にすれば、AI agent は最新の判断を読みやすくなる。

最後に、Conductor は agent 実行基盤そのものでもない。Managed Agents、Antigravity CLI、Claude Code、Codex のような実行面と組み合わせて使うものだ。実行権限、sandbox、network、secrets、approval は別途設計する必要がある。Conductor が plan を持っていても、危険な command を止める仕組みがなければ企業利用としては弱い。

## 30日で試す導入手順

最初の 1 週は、既存の小さな repository を一つ選ぶ。顧客データを含まず、テストがあり、機能追加や bug fix の流れが分かりやすいものがよい。Conductor setup で product、tech stack、workflow を作り、既存の README、coding standards、test command を context に反映する。

2 週目は、1 つの bug fix track を作る。spec には再現条件、期待動作、非対象範囲を書く。plan には調査、修正、テスト、レビュー観点を分ける。実装に入る前に、人間が spec と plan だけをレビューし、足りない前提を直す。ここで AI の計画品質を測る。

3 週目は、実装後の trace を見る。plan の task と git diff が対応しているか、不要なファイル変更がないか、test が plan に沿って実行されたか、レビュー指摘が plan に戻ったかを確認する。失敗したら、chat で口頭修正するだけでなく Review Fixes のような追加 phase として残す。

4 週目は、運用ルールを文書化する。どの track は自動実装可、どの track は plan 承認必須、どの plugin source を許すか、workspace-level install を許すか、MCP と hooks をどう承認するかを決める。PoC の評価は、生成コードの量ではなく、レビュー前の手戻り、説明しやすさ、差分の読みやすさ、token cost で見る。

## まとめ

Conductor Plugin は、Google の agent platform 戦略の中で、作業状態管理の役割を持つ更新だ。Antigravity CLI などの開発者向け agent 面が広がるほど、AI が何を前提に、どの計画で、どの task を完了したかを残す仕組みが必要になる。Conductor は、その証跡を `spec.md`、`plan.md`、tracks、project context として repository に置く。

日本企業が見るべき価値は、AI が速く実装することだけではない。要件、設計、計画、レビュー、revert をチームの管理対象へ戻せるかである。Conductor を入れるなら、plugin trust、MCP、hooks、track 粒度、plan 承認、CI、ADR との役割分担を同時に決める必要がある。

この更新は `google-gemini-api-agent-platform-2026` シリーズの pillar 候補になり得る。理由は、Managed Agents や Antigravity が実行面を扱うのに対し、Conductor は作業状態と仕様管理を扱い、シリーズ全体の「Google の agent 基盤をどう企業運用へ落とすか」という軸を補強するからだ。ただし、pillar 指定は人間判断に委ねる。

## 出典

- [Evolving Spec-Driven Development: Conductor Now Supports Antigravity](https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/) - Google Developers Blog, 2026-07-16
- [gemini-cli-extensions/conductor](https://github.com/gemini-cli-extensions/conductor) - GitHub
- [Getting started with Spec Driven Development in Antigravity](https://codelabs.developers.google.com/codelabs/getting-started-with-spec-driven-development-in-antigravity) - Google Codelabs
