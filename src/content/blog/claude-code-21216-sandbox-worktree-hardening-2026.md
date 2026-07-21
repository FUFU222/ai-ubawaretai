---
title: 'Claude Code 2.1.216、worktree隔離の実務点検'
description: 'Claude Code 2.1.216のsandboxとworktree隔離修正を整理。日本企業が委託先開発、長時間セッション、symlink経路、更新前検証をどう点検するか解説する。'
pubDate: '2026-07-21'
category: 'news'
tags: ['Anthropic', 'Claude Code', 'AIエージェント', 'セキュリティ', '開発者ツール', '管理者設定', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の `@anthropic-ai/claude-code` **2.1.216** が npm 上で 2026年7月20日 UTC に公開された。公式 changelog では、`sandbox.filesystem.disabled` 設定、長時間セッションの slowdown 修正、worktree-isolated subagents の Git 経路修正、`.claude` symlink 経由の workflow / scheduled task 書き込み防止、background agent の復旧、Bash / PowerShell の権限判定修正などが並んでいる。

今回の記事は、直前の [Claude Code 2.1.215の権限修正と監査ログ](/blog/claude-code-21215-permission-otel-heartbeat-2026/) の続きだ。ただし焦点は少し違う。2.1.215/2.1.214 では permission check、OpenTelemetry、heartbeat が中心だった。2.1.216 では、AI コーディングエージェントが「どの作業ツリーで」「どのファイル境界を守り」「長時間セッションをどれだけ安定して再開できるか」が前面に出ている。

この流れは [Claude Code 2.1.208の端末統制と可用性](/blog/claude-code-21208-wrapper-accessibility-reliability-2026/) や [Claude Code 2.1.196の組織既定モデルとMCP安全化](/blog/claude-code-2196-org-default-mcp-security-2026/) と同じ文脈にある。Claude Code は個人の補助 CLI から、MCP、background agent、worktree、remote session、managed settings を持つ開発基盤へ近づいている。日本企業は、最新版へ上げるかどうかだけでなく、隔離境界をどう検証するかを運用項目に入れる必要がある。

## 事実: 2.1.216は隔離境界と長時間セッションを直した

まず事実を分ける。

公式 changelog の 2.1.216 では、`sandbox.filesystem.disabled` 設定が追加された。これは filesystem isolation を無効化しつつ、network egress control は維持するための設定として記載されている。つまり、ファイルシステムの隔離だけを外したい例外ケースが想定されている一方で、ネットワーク側の制御は別の境界として残す設計である。

同じ更新では、長時間セッションで message normalization の計算量が会話ターン数に対して二乗的に増え、resume や処理に複数秒の stall が出る問題が修正された。AI エージェントを小さな補完ではなく、調査、修正、テスト、再実行まで任せるほど、セッションは長くなる。長い会話ほど遅くなる問題は、利用者体験だけでなく、夜間作業や background agent の信頼性にも影響する。

worktree まわりの修正も重要だ。changelog は、worktree-isolated subagents が `git -C`、`--git-dir`、`GIT_DIR` / `GIT_WORK_TREE` を通じて shared checkout 側へ Git 操作を向けてしまう問題を修正したと説明している。さらに、working directory が選択中 project と一致しない場合に、別 project の leftover worktree へ session が入る問題も直している。

symlink も明示的に扱われた。workflow saves と scheduled-task writes が `.claude` symlink をたどり、project 外へ書き込む可能性がある経路が修正された。`/rewind` についても tracked path の symlink や hard link を通じて file restore / delete しないようになり、skip 件数を報告する。これらは、AI がファイルを編集する時の実行境界そのものに関わる。

## 事実: background agentと権限判定の小さな修正も重い

2.1.216 は隔離だけの更新ではない。background sessions whose worktree has no git repository が削除できない問題、agent prompt と tool restrictions が resume 後に default agent へ戻る問題、startup window 中に high-priority message が来ると background subagents が cancel される問題も修正された。

これは、複数 agent を並べて使うチームほど効く。background agent を動かし、途中で別の質問を送り、あとから resume する運用では、agent の prompt、tool restrictions、worktree、session の同一性が崩れると、結果の信頼性が落ちる。人間は「同じ agent が続けている」と思っていても、実際には権限や作業場所が戻っていれば、レビューできない差分が生まれる。

Bash / PowerShell の権限判定も追加で直っている。compound statements with redirects inside `&&` lists or negations、PowerShell commands with invisible Unicode characters、non-ASCII shell word boundaries など、細かな parser 差分が対象である。これは [Claude Code 2.1.215の権限修正](/blog/claude-code-21215-permission-otel-heartbeat-2026/) の延長だが、2.1.216 では worktree と隔離の話と一緒に読むべきだ。AI が出した command を許可する仕組みと、実際に触る checkout がずれると、被害範囲を説明しにくくなる。

また、Claude in Chrome の 403 loop、MCP re-authenticate が既存 credential を先に revoke する問題、read-only commands on Windows accessing network paths without a permission prompt なども修正されている。日本企業の環境では、ブラウザ拡張、社内 IdP、Windows network share、proxy、MCP 認証が混ざりやすい。ひとつずつは小さくても、実務では「どこで止まったのか」「どの credential が消えたのか」「どのパスに触ったのか」が重要になる。

## 分析: filesystem isolation無効化は便利設定ではない

ここからは分析である。

`sandbox.filesystem.disabled` は、名前だけを見ると便利な逃げ道に見える。しかし日本企業の運用では、これを標準設定にするべきではない。filesystem isolation は、AI エージェントが想定外のファイルへ触れないようにする基本線である。無効化は、どうしても隔離が邪魔になる一部の legacy repository、特殊な build system、monorepo、外部 toolchain だけに限定するのが妥当だ。

重要なのは、無効化しても network egress control は別に残る点である。これは、ファイルとネットワークを同じリスクとして扱わない設計と読める。たとえば、社内の巨大 monorepo で sandbox が toolchain を壊すため filesystem isolation を外すとしても、その agent が外部へ自由に通信してよい理由にはならない。逆に、ネットワークを閉じていても、ファイルシステムを広く開ければ、秘密情報、顧客データ、別案件の checkout、認証 material へ触るリスクは残る。

したがって、設定の名前を運用台帳に入れるだけでは足りない。どの repository、どの端末、どの agent、どの利用者、どの期間で無効化するのかを明示する必要がある。委託先や外部協力会社に Claude Code を使わせる場合は特に、filesystem isolation を外した作業を同じルールで許可してよいかを先に決めるべきだ。

[Claude障害連発の記事](/blog/anthropic-claude-status-errors-reliability-2026/) で扱った可用性と同じで、AI 基盤は「動けばよい」だけでは本番運用にならない。隔離を強くすると一部の作業が動かない。隔離を弱くすると安全性と説明責任が落ちる。ここは開発者だけでなく、情シス、セキュリティ、委託先管理、内部監査が同じ言葉で扱うべき判断である。

## worktreeとsymlinkはagentic開発の事故経路になる

worktree-isolated subagents の修正は、agentic 開発を本番に入れる企業ほど重い。worktree isolation の目的は、複数 agent や複数作業を同じ repository で並行しても、互いの checkout を壊しにくくすることだ。ところが Git の環境変数や引数で shared checkout 側へ操作が向くなら、見た目の隔離と実際の書き込み先がずれる。

人間の開発者なら、`pwd`、`git status`、branch 名、diff を見て違和感に気づくことがある。AI agent は、与えられた tool result と許可範囲をもとに進む。作業場所がずれても、出力だけ見ると自然に見える場合がある。だからこそ、worktree isolation の破れは、単なる Git 操作の不具合ではなく、レビュー困難な差分を作る事故経路として見る必要がある。

symlink も同じだ。`.claude` が symlink の場合、workflow saves や scheduled-task writes が project 外へ流れると、repository ごとの設定境界が崩れる。これは攻撃だけでなく、偶発的な運用ミスでも起きる。たとえば、複数 project で共通の `.claude` 設定を symlink している、home directory 配下の共通設定へ向けている、検証用 repository で古い symlink が残っている、といった状態は珍しくない。

日本企業では、社内標準テンプレート、教育用 repository、委託先配布用 project、monorepo の部分 checkout が絡むと、symlink や worktree の扱いが曖昧になりやすい。2.1.216 は製品側の修正だが、組織側も「どのような project layout を Claude Code に許可するか」を決める必要がある。

## 日本企業が更新前後で確認すること

第一に、Claude Code の最低バージョンを `2.1.216` 以上へ上げるかを判断する。npm metadata では 2.1.216 が 2026年7月20日 UTC に公開されている。既に 2.1.214/2.1.215 の権限修正を検証している組織は、同じ検証 ring に 2.1.216 を入れ、worktree と symlink の確認を追加するのが自然だ。

第二に、filesystem isolation 無効化の例外基準を作る。標準では有効、例外は repository 単位または端末単位、期限付き、承認付きにする。無効化が必要な理由、代替の network egress control、扱うデータ種別、委託先可否、ログ保管を台帳化する。

第三に、worktree-isolated subagent の確認セットを作る。`git -C`、`--git-dir`、`GIT_DIR`、`GIT_WORK_TREE` を使う script、monorepo tool、release helper、custom hooks がある場合、subagent が main checkout へ戻らないかを小さな repository で試す。`git status` の結果だけでなく、実際の diff がどの checkout に出るかを見る。

第四に、`.claude` symlink を棚卸しする。project template、社内雛形、個人 dotfiles、教育用 repository、CI worker の checkout に symlink が残っていないかを確認する。workflow saves、scheduled tasks、`/rewind` の対象が project 外へ流れないことを検証する。

第五に、長時間セッションの resume 時間と background agent の同一性を見る。2.1.216 は slowdown を直しているが、自社の repository、MCP、画像、巨大 log、長い transcript で十分かは別問題である。prompt と tool restrictions が resume 後も維持されるか、background agent が別の agent として再開しないか、完了済み session を削除できるかを確認する。

## まとめ

Claude Code 2.1.216 は、派手な新機能よりも、企業利用で事故になりやすい境界を直す更新である。filesystem isolation、worktree-isolated subagents、`.claude` symlink、background agent resume、長時間セッションの slowdown、Bash / PowerShell の権限判定は、どれも AI コーディングエージェントを本番開発へ入れる時の基盤品質に関わる。

日本企業が取るべき対応は、単に最新版へ追随することではない。隔離を外す例外基準、worktree の検証、symlink の棚卸し、background agent の復旧、長時間 session の観測をまとめて確認することだ。Claude Code を個人の便利ツールではなく、委託先や複数チームが使う開発基盤として扱うなら、2.1.216 は更新管理の優先度が高い。

## 出典

- [Claude Code CHANGELOG.md](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) - Anthropic / GitHub, accessed 2026-07-21
- [@anthropic-ai/claude-code 2.1.216](https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2.1.216) - npm, 2026-07-20
- [What's new - Claude Code Docs](https://code.claude.com/docs/en/whats-new) - Anthropic, accessed 2026-07-21
