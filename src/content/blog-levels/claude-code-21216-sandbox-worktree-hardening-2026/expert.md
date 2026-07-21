---
article: 'claude-code-21216-sandbox-worktree-hardening-2026'
level: 'expert'
---

Claude Code 2.1.216 は、AI コーディングエージェントを組織基盤として運用しているチームほど読む価値が高い更新です。新しいモデルの発表ではありません。むしろ、sandbox、worktree、symlink、background agent、長時間セッション、shell permission parsing のように、事故が起きた時に説明責任が問われる境界が並んでいます。

前回の [Claude Code 2.1.215、権限修正と監査ログの実務点検](/blog/claude-code-21215-permission-otel-heartbeat-2026/) は、`/verify` と `/code-review` の明示実行、2.1.214 の permission checks、OpenTelemetry 属性、heartbeat が中心でした。2.1.216 はその続きですが、より execution environment 側に寄っています。AI が何を提案するかではなく、AI がどの作業場所で何を実行したのかを信頼できるか、という話です。

[Claude Code 2.1.208の端末統制](/blog/claude-code-21208-wrapper-accessibility-reliability-2026/) で扱った `CLAUDE_CODE_PROCESS_WRAPPER` や background session 復旧、[Claude Code 2.1.196のMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) で扱った managed settings / MCP 承認と合わせると、Claude Code はすでに単体 CLI ではありません。端末、認証、MCP、worktree、background daemon、scheduled task、workflow save、監査ログを持つ、分散した開発実行基盤です。

## 事実: 2.1.216で注目すべき修正

公式 changelog の 2.1.216 で最初に目を引くのは、`sandbox.filesystem.disabled` setting です。説明上は、network egress control を維持しながら filesystem isolation を skip する設定です。これは、filesystem sandbox が既存 toolchain と衝突するケースや、特殊な monorepo / build system で例外運用をしたいケースを想定していると読めます。

次に、長時間セッションの性能修正があります。message normalization の処理コストが会話ターン数に対して二乗的に増え、resume や会話中に複数秒の stall が出る問題が修正されました。大規模 repository の調査、修正、テスト、再試行、レビューまで 1 session で走らせる運用では、これは無視できません。session が長くなるほど遅くなる設計は、エージェントを長時間の仕事へ割り当てる時のボトルネックになります。

worktree-isolated subagents の修正も重要です。changelog では、`git -C`、`--git-dir`、`GIT_DIR` / `GIT_WORK_TREE` によって Git 操作が shared checkout 側へ向く問題が修正されたとされています。worktree isolation は、複数 agent や複数作業を並行させるための基本部品です。ここが破れると、agent が隔離された作業場で動いているという前提が崩れます。

さらに、working directory が選択 project と合っていない時、別 project の leftover worktree に session が入る問題も修正されています。これは multi-repo や複数 project を扱う heavy user、あるいは共有端末や VDI で起きると厄介です。利用者は Claude Code 上の project 名を見て安心していても、実際の filesystem context が違えば、差分や読み取り対象がずれます。

`.claude` symlink 経由の書き込み防止も見逃せません。workflow saves と scheduled-task writes が `.claude` symlink をたどり、project 外へ書き込む経路が塞がれました。`/rewind` についても、tracked path の symlink / hard link を通じて restore / delete しないようになり、skip した path 数を報告するようになっています。これは、設定保存や巻き戻しのような「便利機能」が project 境界を越えないための修正です。

## 境界を外す設定はリスク分類が必要

`sandbox.filesystem.disabled` は、便利ですが危険な設定です。企業の開発基盤では、この設定を単なる troubleshooting option として広げるべきではありません。filesystem isolation を無効化するということは、Claude Code が操作しうるローカルファイル範囲の前提を変えるということです。

重要なのは、network egress control と filesystem isolation を分けて考えることです。ネットワークを閉じていても、ローカルに顧客情報、社内設計書、別案件の checkout、SSH key、cloud credentials、ログ、契約関連ファイルがあれば、ファイル側の境界は依然として重要です。逆に、filesystem isolation が強くても、MCP server や browser tool、external API へ出られるなら、network 側の境界がリスクになります。

このため、例外は少なくとも四つに分類するべきです。第一に、legacy build や code generation のために local filesystem 全体へアクセスが必要な repository。第二に、monorepo の部分 checkout や external dependency cache が sandbox と衝突する repository。第三に、委託先や外部協力者が触る repository。第四に、秘密情報や規制対象データへ近い repository です。

最初の二つは、技術的な例外として承認できる場合があります。三つ目と四つ目は、原則としてより慎重に扱うべきです。特に委託先開発では、社内の通常端末と同じ前提で filesystem isolation を外すと、アクセス境界の説明が難しくなります。契約、貸与端末、VDI、DLP、ログ保管、MCP 制限を合わせて見なければなりません。

## worktree isolationはレビュー責任と直結する

worktree-isolated subagents は、AI agent を並列に動かすために便利です。親 session が一つの修正を進めながら、別 agent に調査やテスト、別案作成を任せる。複数の候補を比較する。大きな移行を分割する。このような使い方では、worktree が isolation boundary になります。

しかし Git は柔軟です。`git -C`、`--git-dir`、`GIT_DIR`、`GIT_WORK_TREE` があれば、現在の `cwd` と違う repository や worktree を操作できます。人間が意図して使う分には強力ですが、AI agent と permission analyzer の世界では事故経路になります。許可された command が、隔離 worktree ではなく shared checkout へ向くなら、差分の出所を誤認します。

企業運用で問題になるのは、レビュー責任です。agent が作った差分を人間がレビューする時、前提は「この task 用の worktree に閉じた差分」です。実際には shared checkout へ書かれていた、別 project の leftover worktree に入っていた、environment variable で Git 操作が別方向へ向いていた、となると、レビュー対象の完全性が崩れます。

これは [Claude障害連発、AI開発基盤の代替経路とSLO点検](/blog/anthropic-claude-status-errors-reliability-2026/) の可用性論点ともつながります。AI 基盤は落ちた時だけが問題ではありません。静かに違う場所へ書く、resume 後に違う agent として動く、削除できない worktree が残る、といった状態も運用品質の問題です。SLO を考えるなら、成功率だけでなく「期待した境界内で完了した率」も見るべきです。

## symlinkとhard linkは設定境界を崩しやすい

`.claude` symlink の修正は、地味ですが企業ではかなり重要です。多くのチームは、設定を共有するために symlink を使います。dotfiles 管理、社内標準テンプレート、個人 profile、教育用 repository、CI worker の共通設定などです。これ自体は悪くありません。しかし AI agent が workflow saves や scheduled-task writes を行う場合、symlink の先が project 外なら、repository 境界を越えた書き込みになります。

scheduled task は特に注意が必要です。人間がその場で見ている command と違い、時間差で実行されます。設定や workflow が project 外に保存されると、どの repository の policy で実行されたのかが曖昧になります。過去の検証 project に残った symlink、共有された home directory、委託先へ渡した template が絡むと、追跡はさらに難しくなります。

`/rewind` の symlink / hard link 対応も、同じ考え方です。巻き戻しは便利ですが、tracked path の外へ効果が及ぶなら危険です。AI が編集したファイルを戻すつもりで、別の path へ復元や削除が及ぶと、事故の範囲が広がります。skip 件数を報告するようになった点は、利用者が「何が戻されなかったか」を認識するためにも重要です。

日本企業では、プロジェクトごとに設定境界を明確にする文化がまだ弱い場合があります。個人の dotfiles、チームの template、会社の managed settings、repository 内設定が混ざると、どれが正なのか分からなくなります。Claude Code のような agentic tool では、その曖昧さが実行境界の曖昧さになります。

## background agentとresumeの同一性を見る

2.1.216 では、background agent まわりの修正も複数入っています。resume した background agent sessions が default agent に戻り、agent の prompt と tool restrictions が復元されない問題が修正されました。startup window 中に high-priority message が来ると background subagents が cancel される問題も修正されています。git repository を持たない worktree の background session が削除できない問題も直っています。

これらは、企業で agent を長時間使う場合に効きます。たとえば、ある agent には read-only 調査だけを許可し、別 agent には test 実行まで許可し、さらに別 agent には修正案作成を許可する、といった運用を考えます。resume 後に tool restrictions が戻らないなら、その権限設計は信頼できません。

また、background session の削除や復旧は、運用衛生の問題です。完了済み、失敗済み、repository が消えた、worktree が壊れた、daemon が死んだ、という session が残り続けると、利用者は何が現在進行中なのか分からなくなります。AI agent を増やすほど、session lifecycle 管理は重要になります。

ここは単なる UI の整頓ではありません。agent がまだ作業中なのか、止まったのか、再開可能なのか、削除してよいのかを判断できることは、二重実行や古い差分の混入を防ぐための基礎です。特に release branch、hotfix、顧客別 branch、委託先作業 branch では、古い background session が勝手に戻るような状態を避ける必要があります。

## BashとPowerShellの解析差分も境界問題である

2.1.216 では、Bash command permission checking for compound statements with redirects inside `&&` lists or negations、PowerShell tool permission validation of commands containing invisible Unicode characters、Bash command parsing of non-ASCII characters なども修正されています。

これらは細かい parser 修正に見えますが、実際には実行境界の問題です。permission analyzer は command 文字列を読んで、許可、拒否、確認を判断します。一方で shell は、その文字列を実際の構文として解釈します。両者の理解がずれると、許可したつもりの範囲と実行された範囲がずれます。

日本語環境では、non-ASCII path、全角文字、見えない Unicode、Windows PowerShell、Git Bash、WSL、社内 script が混ざります。英語圏の単純な path だけで検証すると、実運用で踏む問題を見落とします。2.1.216 の non-ASCII / invisible Unicode 修正は、日本企業にとって単なる国際化ではなく、権限判定の信頼性に関わる更新です。

特に PowerShell は、Windows 端末の標準運用で避けにくいです。PowerShell 5.1 と 7、エンコーディング、network path、標準入力待ち、ANSI escape、戻り値の扱いは、AI が生成した command の再現性に影響します。2.1.214/2.1.215 から続く PowerShell 修正と合わせて、Windows 検証を別枠にするべきです。

## 実務チェックリスト

最初に、バージョン配布の ring を決めます。Claude Code heavy user、MCP 管理者、Windows 利用者、monorepo 利用者、委託先と同じ repository を扱うチーム、background agent を使うチームを含めます。macOS の単一 repository だけで確認して全社配布すると、今回の修正が効く領域を見落とします。

次に、filesystem isolation の例外申請を作ります。項目は、対象 repository、理由、期間、承認者、扱うデータ種別、委託先可否、network egress control の状態、ログ保管、失効日です。設定を外すこと自体より、なぜ外したのかを後から説明できることが重要です。

三つ目に、worktree 検証を自動化します。subagent に簡単な変更をさせ、`git status` と実ファイルの path を確認します。`git -C`、`--git-dir`、`GIT_DIR`、`GIT_WORK_TREE` を使う社内 script があるなら、その script を通した場合も確認します。shared checkout に差分が出ないことを見ます。

四つ目に、`.claude` symlink と hard link を棚卸しします。dotfiles、project template、教育用 repository、CI worker、VDI の home directory、古い checkout を対象にします。workflow saves、scheduled task、`/rewind` を小さな検証 project で試し、project 外への書き込みや復元が起きないことを確認します。

五つ目に、background agent の lifecycle を試します。agent prompt と tool restrictions を分けた session を作り、途中で high-priority message を送り、daemon restart や resume を挟みます。戻ってきた agent が同じ restrictions を持つか、削除できるか、完了状態が正しく表示されるかを確認します。

六つ目に、長時間セッションの性能を測ります。大きな repository、長い transcript、複数 MCP server、画像や大きな log を含む session で、resume 時間、turn latency、memory、disk、checkpoint を見る。2.1.216 で一般問題が直っていても、自社構成で十分かは別に確認します。

最後に、Windows / PowerShell / non-ASCII path の回帰テストを作ります。日本語 directory、空白を含む path、不可視文字を含む疑似入力、network path、PowerShell 5.1 / 7、Git Bash、WSL を分けます。AI コーディングの安全性は、英数字 path の happy path だけでは判断できません。

## まとめ

Claude Code 2.1.216 は、AI コーディングエージェントの実行境界を固める更新です。filesystem isolation、worktree-isolated subagents、`.claude` symlink、`/rewind`、background agent resume、長時間セッション性能、Bash / PowerShell parser の修正は、いずれも企業運用では事故の芽になり得ます。

日本企業は、これを通常の CLI パッチとして扱うより、agentic 開発基盤の境界点検として扱うべきです。特に、委託先開発、monorepo、複数 worktree、scheduled task、MCP、Windows 端末を含む組織では、2.1.216 を検証 ring に入れ、隔離例外、worktree 差分、symlink、resume、長時間 session を確認する価値があります。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic / GitHub, accessed 2026-07-21
- [@anthropic-ai/claude-code 2.1.216](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.216) - npm, 2026-07-20
- [What's new - Claude Code Docs](https://code.claude.com/docs/en/whats-new) - Anthropic, accessed 2026-07-21
