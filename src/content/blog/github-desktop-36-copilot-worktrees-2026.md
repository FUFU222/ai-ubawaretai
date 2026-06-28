---
title: 'GitHub Desktop 3.6、競合解消と並列開発の新標準'
description: 'GitHub Desktop 3.6のCopilot競合解消、AGENTS.md対応、BYOK、worktreeを整理。日本の開発チームがAI支援を安全なレビューと並列作業へ組み込む実務を解説する。'
pubDate: '2026-06-28'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'AIエージェント', '開発者ツール', 'コードレビュー', '開発生産性', 'BYOK']
draft: false
series: 'github-copilot-2026'
---

GitHubは**2026年6月26日**、GitHub Desktop 3.6を発表した。中心となる変更は、Copilotを使ったコミット作成とマージ競合の説明・解消提案、モデル選択とBYOK、Git worktreeのGUI対応である。macOSとWindowsで利用でき、Copilot機能にはGitHub Copilotへのアクセスが必要だ。

今回の更新は、GitHub Desktopに便利なAIボタンが増えただけではない。[Copilot appのcanvases](/blog/github-copilot-app-canvases-agent-work-2026/)がagent作業の確認面を広げ、[Copilot appのBYOK](/blog/github-copilot-app-byok-model-providers-2026/)がモデル調達の選択肢を広げたのに対し、Desktop 3.6はコミット、競合解消、branch並列作業という日常のGit操作へ同じ流れを持ち込む。

日本の開発チームが見るべき点は、競合をAIが解けるかどうかだけではない。提案された解消内容を誰が確認するか、`AGENTS.md`をコミット規約にどう使うか、BYOKの鍵と費用を誰が管理するか、worktreeを本当に分離環境として扱ってよいかである。

## 事実: GitHub Desktop 3.6の4つの変更

第一の変更は、GitHub Desktop内のCopilot機能がCopilot SDKを共通基盤として使うようになったことだ。GitHubの発表では、強化されたコミットメッセージ生成と、新しいマージ競合ワークフローがこの基盤上で動くと説明されている。

第二は、コミットメッセージ生成の文脈が増えたことだ。Desktop 3.6は、リポジトリの`.github/copilot-instructions.md`と`AGENTS.md`からcustom instructionsを読み、repositoryに設定されたcommit metadata rulesも考慮する。すでに[Copilot code reviewのAGENTS.md対応](/blog/github-copilot-code-review-agents-md-2026/)で見た指示ファイルが、PRレビューだけでなくローカルのコミット作成にも関係する。

第三は、Copilotによるマージ競合の支援だ。競合が起きたとき、Desktopは衝突した変更を説明し、解消案を提示できる。利用者は提案を確認し、そのまま受け入れるだけでなく、編集してから競合解消を完了できる。

第四は、Git worktreeの対応である。同じrepositoryに複数のworking directoryを作り、branchを切り替えたり作業途中の変更をstashしたりせず、複数の作業を並行できる。GitHub Desktop 3.6.0のrelease notesでも、worktree対応とCopilot競合解消が新機能として明記されている。

加えて、GitHub DesktopのCopilot機能にはmodel pickerが入り、GitHub上で利用可能なモデルを選べる。BYOKで第三者providerやローカルモデルへ接続する選択肢も示された。これは、モデルの性能比較だけでなく、コードを送る先、契約主体、費用、ログの所在を確認する必要があるという意味だ。

## Copilot競合解消で人間が確認する境界

ここからは分析だ。

マージ競合は、単純に左右どちらの行を残すか決めれば終わるとは限らない。認可条件、DB schema、API contract、feature flag、設定値、テストfixtureのように、テキスト上は自然でも意味が壊れる競合がある。Copilotが衝突理由を説明し、解消案を作ることで初動は速くなるが、意味上の正しさを保証するものではない。

特に日本企業では、長期運用された基幹システム、複数ベンダーが触るrepository、リリースbranchを長く維持する製品で競合が複雑になりやすい。AIの提案を使う場合も、変更元のissue、設計書、migration順序、既存テスト、人間reviewerの責任を外してはいけない。

実務では、競合解消後に少なくとも三段階を置きたい。まず差分を見て、片側の変更が意図せず消えていないか確認する。次に、対象領域のtest、lint、type check、buildを実行する。最後に、認可、課金、個人情報、migration、外部APIのような高リスク領域は、元の変更者かCODEOWNERが確認する。

GitHub Desktopの提案は、競合解消を自動承認する仕組みではなく、review可能な案を作る仕組みとして使うのが妥当だ。branch protectionやrequired reviewを維持し、AIが作った解消コミットも通常のPR品質ゲートへ通すべきである。

## AGENTS.mdとmetadata rulesをコミット規約へ接続する

Desktop 3.6が`AGENTS.md`と`.github/copilot-instructions.md`を読むことで、コミットメッセージをrepositoryの用語や規約に近づけやすくなる。Conventional Commits、issue番号、変更種別、影響範囲、破壊的変更の表記などをチーム標準にしている場合、AI生成文を毎回手直しする負担を減らせる可能性がある。

ただし、指示ファイルへ長大な社内規程を貼り付けるのは逆効果だ。rootの`AGENTS.md`には全体に効く短い原則を置き、Copilot固有の指示は`.github/copilot-instructions.md`へ寄せ、より厳格な形式はrepository rulesで機械的に強制するほうがよい。自然言語による生成支援と、サーバ側で拒否できる規則を分ける必要がある。

たとえば「日本語で分かりやすく書く」はAI向けの指示になる。一方で「署名付きコミットを必須にする」「特定のcommit message patternを満たす」「mainへの直接pushを禁止する」といった条件は、rulesetやCIで強制すべきだ。AIが規約に沿ったように見えるメッセージを作っても、統制そのものを置き換えることはできない。

指示ファイルの所有者も決めたい。Platform Engineeringが共通規約を管理し、各product teamが領域固有の説明を追加する形にすると、Desktop、Copilot code review、coding agentで同じ語彙を共有しやすい。変更はPRでレビューし、矛盾する指示や秘密情報が入らないようにする。

## BYOKとmodel pickerの調達・データ管理

model pickerとBYOKは、利用者には柔軟性を与えるが、企業には管理対象を増やす。[Copilot appのBYOK運用](/blog/github-copilot-app-byok-model-providers-2026/)と同じく、第三者providerやローカルモデルを選べるなら、どのモデルが使えるかだけでなく、どの契約、どのtenant、どのregion、どのAPI keyで動くかを記録する必要がある。

コミットメッセージや競合解消では、未公開コード、branch名、issue文脈、設定値が入力に含まれる可能性がある。BYOKを許可する場合、個人のAPI keyを業務repositoryで使ってよいか、OS credential storeの端末管理をどうするか、退職・異動時にどう失効するか、provider側のログと保存期間をどう確認するかを決めるべきだ。

ローカルモデルも無条件に安全ではない。外部送信を減らせても、端末上にモデル、入力履歴、cacheが残る可能性がある。品質が足りないモデルで競合解消を繰り返せば、再試行とレビュー負荷が増える。低リスクのコミット文案と、認可コードの競合解消を同じ許可表で扱わないほうがよい。

費用も分かれる。GitHub提供モデルはCopilot側の契約と利用量に寄るが、BYOKは外部providerの請求へ出る可能性がある。情シスと開発基盤チームは、Desktopでの利用を含めたprovider別の費用と、誰が利用を承認したかを追えるようにしたい。

## worktreeで並列作業を標準化する際の注意点

worktreeは、同じrepositoryの複数branchを別directoryへ展開する。緊急修正のために現在の作業をstashし、branchを切り替え、依存関係を入れ直す流れを減らせる。AI agentが複数作業を並列に進める現在、GUIからworktreeを扱える価値は大きい。

一方、worktreeはcontainerではない。repositoryのobject databaseやGit設定を共有し、同じ端末上のcredentialやnetworkへ到達できる場合がある。directoryが分かれたことを、process、secret、networkまで隔離されたことと混同してはいけない。[Copilot cloud agentの自動実行](/blog/github-copilot-cloud-agent-automations-2026/)のようなcloud sandboxとも性質が異なる。

GitHubのworktree解説は、各worktreeで依存関係のcopyが必要になりdisk使用量が増えること、不要なfolderのcleanupが必要なこと、main repository内へ作る場合は`.gitignore`への配慮が必要なこと、同じbranchを複数worktreeで同時checkoutできないことを注意点として挙げている。

日本の開発チームでは、作成場所、命名、依存関係cache、secret file、cleanup期限を標準化するとよい。たとえばworktreeはrepository外の決めたrootへ作り、branch名とissue番号をdirectory名へ含め、`.env`はcopyせず必要な値だけ安全な仕組みから供給し、merge後に削除する。CI artifactやbuild cacheが別作業を汚さないかも確認する。

並列度を上げれば生産性が自動で上がるわけでもない。agentや人間が同じmoduleを同時に変更すれば、最後に競合とレビュー待ちが集中する。worktree数だけでなく、レビュー可能な同時作業数、CI容量、環境数、担当者の認知負荷を上限として設計すべきだ。

## 日本企業向け導入チェックリスト

まず、GitHub Desktop 3.6を少数チームへ配布し、対象repositoryを決める。コミット文案は広めに試せるが、Copilot競合解消はdocs、test、低リスクなapplication codeから始める。認可、決済、個人情報、DB migrationは、人間の領域責任者を必須にする。

次に、`AGENTS.md`と`.github/copilot-instructions.md`を棚卸しする。重複や矛盾をなくし、コミット文に必要な規約だけを短く書く。強制条件はrulesetとCIへ置き、AI向け指示だけに依存しない。

三つ目に、model policyを作る。GitHub提供モデル、承認済みBYOK provider、ローカルモデルを分け、repositoryのデータ分類ごとに利用可否を決める。API keyの発行、保存、失効、費用配賦も同じ表に含める。

四つ目に、worktree運用を決める。作成root、命名、最大数、依存関係、secret、cleanup、disk監視を標準化する。GUIで作れるようになったからこそ、放置されたworking directoryと古いbranchを増やさない仕組みが必要だ。

最後に、効果を「生成回数」だけで測らない。競合解消時間、解消後の不具合、commit messageの修正率、stash由来の手戻り、review待ち時間、worktreeのcleanup漏れを見る。AI支援が速くても、後段のレビューとCIが詰まるなら運用全体は改善していない。

## まとめ

GitHub Desktop 3.6は、Copilotによるコミット作成とマージ競合支援、model pickerとBYOK、Git worktree対応を、日常のデスクトップGit操作へまとめた更新だ。GUI利用者もagent時代の並列開発へ入りやすくなる一方、AI提案の確認、指示ファイルの所有、モデル調達、worktreeの境界管理が新しい実務になる。

日本企業は、Copilotの提案を自動承認に使うのではなく、review可能な初稿として使うべきだ。`AGENTS.md`は短く保ち、強制規則はrulesetとCIへ置く。BYOKはproviderと鍵を管理し、worktreeはcontainerではないと理解する。この4点を揃えれば、Desktop 3.6を単なるUI改善ではなく、AI時代の安全な並列開発標準として評価できる。

## 出典

- [GitHub Desktop 3.6: Worktrees and deeper Copilot integration](https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/) - GitHub Changelog, 2026-06-26
- [GitHub Desktop 3.6.0 release](https://github.com/desktop/desktop/releases/tag/release-3.6.0) - GitHub, 2026-06-24
- [What are git worktrees, and why should I use them?](https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/) - GitHub Blog, 2026-06-16
