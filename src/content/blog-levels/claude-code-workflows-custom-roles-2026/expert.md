---
article: 'claude-code-workflows-custom-roles-2026'
level: 'expert'
---

Claude Code dynamic workflows の 2026年6月8日デフォルト有効化は、開発者体験の更新であると同時に、Enterprise 管理者にとっては権限モデルの棚卸しイベントである。

Anthropic の Help Center は、Enterprise custom roles の文脈で dynamic workflows を扱っている。そこでは、long-running tasks、multiple subagents、large token consumption に関係する Claude Code capability として workflows が説明され、管理者が organization toggle、custom roles、managed settings を組み合わせて制御できるとされている。Claude Code settings docs でも `disableWorkflows` が managed settings の項目として確認できる。

重要なのは、これは [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) の単なる続報ではないという点だ。前回の焦点は、モデル性能、長時間タスク、Fast mode、開発ワークフローの評価だった。今回は、Enterprise でその能力を誰に許すか、どの接続先と組み合わせるか、どの設定で抑止するかが焦点になる。

また、[Claude Code監査ラベル追加](/blog/claude-code-otel-agents-mcp-security-2026/) で扱ったように、Claude Code は OpenTelemetry、MCP、background agents、parallel tool calls など、運用の観測対象を増やしている。dynamic workflows は、その上で動く高負荷・高権限になりやすい機能として扱うべきだ。

## 事実整理: 管理レイヤーは三つある

今回の管理レイヤーは、大きく三つに分けられる。

第一は、organization-level toggle である。Help Center の説明では、組織全体で dynamic workflows を有効または無効にできる。ここが無効なら、個別の custom role で workflows を許可しても実行できない。したがって、最初に決めるべきなのは、組織として workflows を原則許可するのか、原則停止するのかである。

第二は、custom roles である。Enterprise 管理者はロールを作り、ユーザーやグループへ割り当て、feature access や connector permissions を管理できる。dynamic workflows は、この role-based access control の一部として扱われる。全員ではなく、先行評価チーム、標準開発者、制限ユーザーのように分けられる。

第三は、Claude Code managed settings である。settings docs には `disableWorkflows` があり、組織が Claude Code の設定を配布することで workflows を無効化できる。これは、端末、プロジェクト、開発環境、VDI、devcontainer、社内 wrapper のような配布面と関係する。

この三層は、同じものではない。organization toggle は最上位の方針、custom roles はユーザー・グループ単位の許可、managed settings は実行環境での抑止に近い。日本企業で運用するなら、この三層を混ぜずに設計したほうがよい。

## なぜdynamic workflowsは通常機能と違うのか

dynamic workflows は、単に UI のボタンが一つ増える機能ではない。Claude Code workflows docs は、複数の subagents を使って作業を分解し、長時間のタスクを進める構成を示している。これは、開発作業の実行形態を変える。

通常の補完や質問応答では、ユーザーが短い単位で入力し、結果を見て、次の指示を出す。責任の境界は比較的見えやすい。一方、workflows では、調査、計画、実装、検証、再試行が長い流れになる。途中で複数の subagents がファイルを読み、ツールを呼び、結果を統合する。

この性質により、リスクは四つに分かれる。

一つ目は費用リスクである。long-running tasks と large token consumption が想定される以上、1回の実行が短いチャットより高くなる可能性がある。利用者ごとの月額だけを見ても、repo や作業分類ごとの費用は説明しにくい。

二つ目は接続先リスクである。Claude の connector permissions と Claude Code の MCP/server settings が重なると、AIが参照できる情報範囲は広がる。GitHub、Drive、Slack、チケット管理、社内API、DBが組み合わさると、単なるコード補助ではなく業務横断エージェントになる。

三つ目は変更リスクである。workflows が複数ファイルを変更し、テストを実行し、修正を繰り返すなら、人間レビューは最終差分だけでは足りない。どの前提で計画し、どの失敗を許容し、どこで人間承認を挟むかを決める必要がある。

四つ目は説明責任である。監査、障害、情報漏えい、費用超過、品質問題が起きたとき、「誰が workflows を許可したのか」「どの設定で走ったのか」「どの connector と MCP が有効だったのか」を説明できなければならない。

## 権限モデルは利用者ではなく作業分類で設計する

実務では、利用者属性だけで workflows を許可すると失敗しやすい。シニアエンジニアだから常に許可、ジュニアだから禁止、という分け方だけでは、作業リスクを表現できないからだ。

より現実的なのは、作業分類を軸にすることだ。

低リスク分類では、コード読解、ログ要約、テスト失敗の仮説出し、ドキュメント整理、限定された sandbox repo の調査を許可する。この分類では workflows の価値が出やすく、直接の本番影響は小さい。

中リスク分類では、通常のバグ修正、テスト追加、軽いリファクタリング、依存更新の調査を扱う。ここでは workflows を使ってもよいが、変更可能ディレクトリ、実行可能コマンド、PR作成条件、レビュー必須領域を決める。

高リスク分類では、認証、認可、課金、個人情報、暗号鍵、インフラ、顧客データ、セキュリティ修正、データ移行を扱う。この領域では workflows を禁止するか、人間承認を途中で挟み、モデル、経路、ログ、実行環境を固定するほうが説明しやすい。

[Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で整理したモデル選択の論点も、ここに重なる。Auto mode やクラウド経路が動的になるほど、workflows の実行条件を作業分類で固定しないと、後から「なぜそのモデルと経路が選ばれたのか」を説明しにくい。

## custom rolesとmanaged settingsの設計例

日本企業で始めるなら、最小構成は四つのロールでよい。

一つ目は `ai-platform-evaluator` に相当する先行評価ロールである。このロールには dynamic workflows を許可し、対象 repo を限定し、OpenTelemetry や利用ログを必須にする。connector は検証用の GitHub organization、ドキュメント、チケットに限定する。MCP server も台帳登録済みのものだけを許可する。

二つ目は `standard-developer` に相当する通常開発者ロールである。ここでは workflows を段階的に許可する。低リスク作業では利用可、中リスク作業では PR 前レビュー必須、高リスク作業では `disableWorkflows` を配る、という運用にする。

三つ目は `restricted-contractor` に相当する制限ロールである。委託先や一時メンバーには、connector permissions を絞り、workflows を無効化し、必要なら通常の Claude Code 利用も readonly に近い形へ寄せる。

四つ目は `regulated-workload` に相当する規制業務ロールである。金融、医療、公共、重要インフラ、個人情報処理などでは、workflows の許可を個別申請にし、ログ保存先、保存期間、閲覧権限、データ分類を明示する。

このロール設計では、managed settings が最後の防波堤になる。organization toggle と custom roles で許可されていても、特定の端末やプロジェクトで `disableWorkflows` を配れば、実行環境側で止められる。たとえば、本番障害対応用端末、共有端末、顧客データを扱う開発環境では無効にし、検証用 devcontainer では有効にする、という分け方ができる。

## connector permissionsとMCPを同じ台帳に載せる

Enterprise の custom roles では connector permissions が重要になる。だが、Claude Code の実務では MCP server、local tools、shell permissions、managed settings も同じくらい重要だ。これらを別々のチームが別々の表で管理すると、AIエージェントの実際のアクセス範囲が見えなくなる。

台帳に最低限入れるべき項目は、role name、対象ユーザー・グループ、dynamic workflows 許可、`disableWorkflows` 配布有無、connector permissions、MCP server、対象 repo、許可 command、ログ保存先、費用配賦先、risk_class、承認者である。

特に MCP server は、server 名だけでは足りない。接続先、認証方式、OAuth scope、read/write 権限、tool calls のログ範囲、secret の保管場所、利用可能な端末を合わせて記録する。`claude mcp` の secrets redaction が改善されていても、MCP の存在自体が機微情報になる場合がある。

また、connector permissions と MCP の重複も見るべきだ。たとえば GitHub connector と GitHub MCP server の両方がある場合、どちらの経路で issue、PR、code、secret scanning alerts に触れるのかが曖昧になる。ログや権限が片方にしか残らないなら、監査上の穴になる。

## 移行手順: 6月8日以降にやること

移行手順は、短くてもよいので順序を固定したほうがよい。

第一に、現在の organization toggle を確認する。デフォルト有効になっている前提で、実際の管理画面と組織ポリシーを照合する。

第二に、既存 custom roles とグループ割り当てを export し、workflows 許可の有無を確認する。古いロール名に新しい機能許可が混ざっていないかを見る。

第三に、`disableWorkflows` を配布できる経路を検証する。macOS、Windows、Linux、VDI、devcontainer、社内 CLI wrapper、管理対象端末で同じように効くとは限らない。

第四に、先行評価ロールで workflows を実行し、ログ、費用、失敗例、レビュー負荷を記録する。評価対象は、低リスク調査、中リスク修正、高リスク領域の dry-run のように分ける。

第五に、connector permissions と MCP server を一つの台帳に統合する。ロールごとに「AIが読める情報」と「AIが変更できる範囲」を見えるようにする。

第六に、運用ルールを短く書く。workflows を使ってよい作業、禁止する作業、人間承認が必要な作業、ログ確認者、費用アラート、停止手順を明文化する。

## 日本企業への示唆

日本企業では、AIツールの導入時に「使えるか」「価格はいくらか」「情報漏えいしないか」が先に議論されやすい。しかし Claude Code workflows のような機能では、それだけでは足りない。

必要なのは、開発プロセスの中で AIエージェントに任せる作業単位を定義することだ。誰でも使える便利ツールにすると、成功例は早く出る一方で、費用、レビュー、責任、接続先の管理が後追いになる。逆に、最初から禁止だけに寄せると、実務でどこに価値があるかが分からない。

最初の落としどころは、先行評価ロール、低リスク作業、限定 repo、限定 connector、限定 MCP、明示ログで始めることだ。そのうえで、レビュー指摘の少なさ、手戻り、実行時間、費用、事故未遂、開発者満足度を見て広げる。

[AnthropicとNECの戦略協業](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/) のように、日本市場では Claude Code を人材育成や業種別AI開発へ組み込む動きがある。だからこそ、dynamic workflows を単発の機能更新としてではなく、企業の開発権限モデルを見直す材料として扱いたい。

## まとめ

Claude Code dynamic workflows の既定有効化は、AIコーディングの作業範囲を広げる一方で、Enterprise 管理者に新しい責任を置く。organization toggle、custom roles、`disableWorkflows`、connector permissions、MCP、OpenTelemetry、費用配賦は別々の話ではない。すべて「AIエージェントにどこまで任せるか」を説明するための部品である。

日本企業が取るべき実務対応は、全社オンか全面禁止かの二択ではない。ロールと作業分類で許可範囲を決め、managed settings で抑止し、接続先とログを台帳化し、低リスク作業から広げることだ。Claude Code の能力が上がるほど、勝負はモデル比較ではなく、権限設計と運用品質に移っていく。

## 出典

- [Manage custom roles on Enterprise plans](https://support.claude.com/en/articles/13930452-manage-custom-roles-on-enterprise-plans) - Anthropic Help Center
- [Claude Code settings](https://code.claude.com/docs/en/settings) - Claude Code Docs
- [Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows) - Claude Code Docs
