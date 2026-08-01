---
article: 'github-copilot-cli-1078-permissions-cache-2026'
level: 'expert'
---

GitHub Copilot CLI `v1.0.78-0` は、prerelease としてはかなり運用寄りの更新である。headline にしやすい新モデル追加ではなく、`/permissions`、`allowDevToolCaches`、ACP `closeSession`、長大 transcript の progressive rendering と resume 改善、MCP toolset / OAuth / hook lifecycle 修正が並ぶ。これは、Copilot CLI が単体の chat command から、開発端末上の agent runtime へ寄っていることを示す。

この更新を読むとき、機能をばらばらに見ると意味が薄い。`/permissions` は人間の承認境界、`allowDevToolCaches` は sandbox と性能の境界、ACP `closeSession` は外部 client と session lifecycle の境界、MCP 修正は外部 tool 権限の境界、transcript 改善は長時間作業の証跡境界である。すべて「agent が作業を続けるための境界管理」に関係している。

既存の [Copilot CLI 1.0.71記事](/blog/github-copilot-cli-1071-autopilot-plan-2026/) では、Autopilot と MCP 構成の鮮度を扱った。[Copilot MDM管理設定](/blog/github-copilot-mdm-managed-settings-2026/) では端末配布と標準設定を見た。[Copilot OTel管理export](/blog/github-copilot-opentelemetry-managed-export-2026/) では CLI や IDE の実行面を観測する論点を整理した。今回の 1.0.78 は、それらを現場の terminal session の中でどう回すかという話である。

## 事実: release noteの主要差分

GitHub の `v1.0.78-0` release note は、追加機能として `/permissions` command と ACP mode の `closeSession` request 対応を挙げている。`/permissions` は session 中に approval mode を切り替える操作であり、agent の自律度や tool 実行の承認線を作業途中で変えられる。ACP `closeSession` は、外部 client が session の終了を protocol として伝えられるようにするものだ。

改善項目では、`allowDevToolCaches` が既定で有効になった。release note は、sandboxed builds が toolchain caches、package registries、installation directories にアクセスしやすくなると説明している。opt out は設定で可能である。これは、sandbox を厳しくしすぎて build / test が毎回遅くなる問題への実務的な回答と読める。

長大 transcript については、progressive rendering によって UI 側の体感を改善し、resume 時の速度と memory usage も改善したとされる。agent が長く動くほど transcript は巨大になる。AI agent を単発質問ではなく実装、修正、検証、レビューの session として使う場合、ここが重いと利用体験も監査確認も崩れる。

MCP 関連では、明示的に設定した GitHub MCP toolset と tool config を尊重する修正、OAuth 後に deferred MCP server を refresh する修正、session 切り替え時に MCP server や hook を再起動しない修正が含まれる。これらは見た目の bugfix だが、企業運用では tool 権限、token 更新、hook side effect、session 境界の安定性に直結する。

さらに startup 時に unknown settings key を警告する改善、shell completion で `--model` に `auto` と supported model names を提示する改善、`/allow-all` の auto safety judge model を user configurable ではなく自動選択へ戻す変更も含まれる。設定の typo、モデル選択の誤解、安全判定モデルのばらつきを減らす方向である。

## 分析: /permissionsは便利機能ではなく変更管理である

`/permissions` の価値は、session を壊さずに approval mode を切り替えられることだ。典型的な agent 作業では、最初に repository を読む。次に実装方針を作る。次に file を編集する。最後に test や formatter を実行する。必要な権限は段階ごとに違う。

従来の弱い運用は、最初から強い権限で session を始めることだった。これなら途中で止まらないが、調査段階から shell や write 権限を広く渡すことになる。逆に、最後まで弱い権限のままだと、人間の承認待ちが増え、agent を使う意味が薄くなる。`/permissions` は、その間を取るための操作になる。

ただし、企業ではこの切り替えを個人の気分に任せてはいけない。production repository、顧客コード、規制業務、委託先端末では、強い mode にした事実そのものが change event である。誰が、どの repo で、どの目的で、どの mode へ切り替え、どの command や file edit を許したかを後から説明できる必要がある。

運用設計としては、approval mode を少なくとも4段階に分けたい。第一は read-only 調査。第二は workspace 内 file edit。第三は test / build / package install を含む local command。第四は network、credential、PR、issue、release、deployment に触る action である。`/permissions` は段階を越える入口であり、単なるショートカットではない。

## sandboxed build cacheの評価軸

`allowDevToolCaches` の既定有効化は、開発者体験の改善として強い。sandboxed build が毎回 package を取り直し、compiler cache を使えず、tool install を繰り返すなら、agent の変更検証は遅くなる。遅い agent は現場で使われないか、sandbox を外した形で使われる。どちらも望ましくない。

一方、cache は隔離境界を曖昧にする。開発 toolchain cache には、package tarball、compiled object、download metadata、private registry の package name、生成物、場合によっては社内 package の構造が残る。agent が sandbox 内からそれらを読むなら、sandbox の filesystem 境界は実質的に広がる。

社員の専用端末と共有 CI worker では判断が違う。専用端末では、同一 user が同一会社の repo を扱う前提なら cache 共有は合理的である。共有 worker では、job ごと、repository ごと、顧客ごとの cache isolation が必要になる。委託先端末では、複数顧客の cache 混在を避ける契約・技術両面の制約がある。

CI での実務案は、cache key を repository、branch class、lockfile hash、tool version で分けることだ。secret や credential が cache に入らないことを確認し、private package の token は package manager の credential store と cache artifact を分離する。失敗時は cache purge を runbook 化する。agent session のためだけに global cache を丸ごと開くべきではない。

端末側では、MDM や標準 dotfiles で `allowDevToolCaches` の既定を定義する。高リスク repo や顧客別 VDI では false を検討し、一般的な社内 repo では true で速度を優先する。重要なのは一律判断ではなく、端末種別と repo class で分けることだ。

## MCP修正はtool drift対策として読む

MCP は agent の能力を増やす。GitHub MCP、社内 issue tracker、SaaS、security scanner、DB viewer、CI dashboard などを agent から呼べるようにする。一方で、MCP は権限の入口でもある。どの server、どの toolset、どの OAuth scope、どの user identity で接続しているかが曖昧だと、agent の実行範囲を説明できない。

今回の release にある「明示的に設定した GitHub MCP toolset と tool config を尊重する」修正は、この観点で重要だ。企業が設定した toolset を CLI が別の状態で扱えば、承認済み権限と実行権限がずれる。OAuth 後の deferred MCP refresh も同じで、認可状態が変わったのに tool list が古いままだと、利用者には原因が分からない。

session 切り替え時に MCP server や hook を再起動しない修正も、運用上は大きい。再起動は状態を壊す可能性がある。hook が audit event を出す設計なら、session 切り替えだけで余計な event が出るかもしれない。MCP server が rate limit や token refresh を持つ場合、再起動が多いほど障害も増える。

日本企業では、MCP toolset を設定ファイルだけで管理しないほうがよい。CLI 起動時の実際の tool list、OAuth state、server version、policy version を session metadata として残す。差分があれば warning にする。これは [GitHub MCP Serverの事前検査](/blog/github-mcp-server-security-scanning-2026/) で扱った toolset 権限の考え方ともつながる。

## transcriptとresumeは監査証跡である

長大 transcript の progressive rendering と resume 改善は、利用者には「重くならない」更新として見える。しかし企業運用では、session transcript は監査証跡そのものである。どの指示を受け、どの file を読み、どの command を提案し、どの error を見て、どの修正を入れたかがそこに残る。

agent session が短い間は、履歴は個人メモに近い。しかし、長時間作業、remote control、cloud / local hybrid、CI agent、社内 wrapper が絡むと、transcript は incident response と review の材料になる。resume が速くなるほど、古い session を再利用する運用も増える。便利さと同時に、履歴の保持期間、アクセス権、削除条件を決める必要がある。

注意すべきは、transcript が最終成果物ではないことだ。途中の仮説、未確定の security finding、顧客名、社内 URL、tool output が含まれる場合がある。PR 本文、監査ログ、顧客説明へそのまま転記してよいものではない。transcript は evidence であり、外部共有用の説明ではない。

運用としては、session id、repository、user、approval mode 変更、MCP toolset、主要 command、diff summary、test result、PR link を構造化して別に持つとよい。raw transcript は必要時に参照できるようにし、日常の dashboard では構造化 summary を使う。これにより、詳細を残しつつ過剰な閲覧を減らせる。

## ACP closeSessionが意味すること

ACP `closeSession` 対応は、editor や外部 client が Copilot CLI session を扱う場合に効く。明示的に session を閉じられることは、UI の片付けだけでなく、resource release、hook、audit event、transcript finalization、cost attribution の終了点を作ることにつながる。

社内 agent launcher を作る組織では、session lifecycle を曖昧にしないほうがよい。開始、権限昇格、toolset 確定、作業中、close requested、closed、aborted、failed、resumed を状態として持つ。`closeSession` を受けたら、未保存 diff、未完了 command、pending approval、open network connection、temporary file、cache cleanup をどう扱うかを決める。

これは [Copilotセッション監査API](/blog/github-copilot-agent-session-streaming-api-2026/) のような GitHub 側の session 記録とも接続できる。local CLI session と remote / web session が増えるほど、終了状態の定義が重要になる。UI で閉じた、agent が完了した、human が中止した、policy が止めた、timeout した、network failure で切れた、を区別しなければ、後から作業結果を判断できない。

## 導入検証の手順

まず prerelease を検証対象として扱う。全社標準へ入れる前に、代表 repo を3種類選ぶ。小規模な Node / Python repo、大きな monorepo、private registry や社内 MCP を使う repo である。OS は macOS、Windows、Linux を分ける。VDI や委託先標準端末があるなら別枠にする。

次に approval mode の切り替えを試す。調査から編集、編集から test 実行、test 実行から network を伴う操作へ移るとき、`/permissions` の UI、ログ、戻し方、誤操作時の挙動を確認する。権限を上げた後に session を再開した場合、mode がどう保持されるかも見る。

3つ目に cache を見る。`allowDevToolCaches` true / false で build time、cache hit、読み取り path、生成 artifact、private package の扱いを比較する。CI では job をまたいだ cache leakage がないか、端末では顧客別・repo 別に cache を消せるかを確認する。

4つ目に MCP を見る。明示 toolset、OAuth refresh、deferred server、session switching、hook lifecycle を検証する。設定した tool だけが表示されるか、認可後に正しく更新されるか、session を切り替えても余計な server restart が起きないかを確認する。

5つ目に transcript を見る。長い session を作り、resume 時間、memory 使用量、表示の崩れ、履歴検索、権限ある利用者だけが見られるかを確認する。raw transcript と summary の保管場所を分け、セキュリティレビューで必要な情報が取れるかを見る。

## まとめ

Copilot CLI `v1.0.78-0` は、AI コーディングの派手な機能追加ではなく、agent CLI を企業運用に近づけるための境界調整である。`/permissions` は承認境界、`allowDevToolCaches` は sandbox と速度の境界、MCP 修正は tool 権限の境界、transcript 改善は証跡の境界、ACP `closeSession` は lifecycle の境界を扱う。

日本企業がこの release から学ぶべきことは、Copilot CLI を個人の便利ツールとしてだけ配らないことだ。端末種別、repo class、approval mode、cache policy、MCP toolset、session lifecycle、transcript retention を一つの運用表にする。prerelease の検証では、速くなったかだけでなく、境界が説明できるかを確認する。

特に `github-copilot-2026` series では、Copilot が IDE、CLI、cloud agent、MCP、MDM、metrics へ広がる流れを追っている。今回の 1.0.78 は pillar というより、既存の管理・観測・端末統制記事を現場 CLI 運用へ接続する補助線である。

## 出典

- [Release 1.0.78-0](https://github.com/github/copilot-cli/releases/tag/v1.0.78-0) - GitHub Copilot CLI, 2026年7月31日
- [GitHub Copilot CLI README](https://github.com/github/copilot-cli) - GitHub
- [Copilot CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference) - GitHub Docs
