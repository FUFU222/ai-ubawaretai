---
title: 'Copilot code review組織統制、PR監査の新設定'
description: 'GitHub Copilot code reviewの組織runner設定、content exclusion対応、custom instructions制限撤廃を整理。日本企業がPR監査と機密ファイル除外をどう運用すべきか解説する。'
pubDate: '2026-06-13'
category: 'news'
tags: ['GitHub Copilot', 'コードレビュー', 'AIエージェント', '開発者ツール', 'エンタープライズAI', '管理者設定']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年6月12日**、GitHub Copilot code reviewに新しい管理設定を追加した。主な変更は、組織単位のrunner設定、Copilot content exclusionの尊重、そして`.github/copilot-instructions.md`や`*.instructions.md`に対する従来の文字数制限撤廃である。これはPRレビューAIの機能追加というより、Copilot code reviewを企業の標準レビュー基盤に入れるための統制面の更新だ。

このサイトでは、[Copilot code review一括修正、PR運用の設計論点](/blog/github-copilot-code-review-batch-fix-agent-2026/)でレビューコメントをcloud agentへ渡す流れを扱い、[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/)で実行コストを整理した。今回の更新はその続きにある。AIがPRを読むだけでなく、どのrunnerで動き、どのファイルを読まず、どのレビュー規約を守るかを組織側が設計する段階に入った。

また、[GitHub Copilot CLI security review public preview](/blog/github-copilot-cli-security-review-2026/)がcommit前の点検線なら、今回のCopilot code review更新はPR上の点検線である。[GitHub Agentic Workflows Actions認証と組織課金](/blog/github-agentic-workflows-actions-token-2026/)で見たように、GitHubのagentic機能はActions、権限、組織課金と近づいている。Copilot code reviewも例外ではない。

## 事実: 6月12日に何が変わったか

GitHub Changelogによると、今回の更新は3つに分けられる。

1つ目は、Copilot code reviewのrunner typeを組織単位で設定できるようになったことだ。Copilot code reviewのagentic architectureはGitHub Actionsを使う。標準ではGitHub-hosted runnerで動くが、チームはself-hosted runnerやlarge runnerを使う構成も選べる。今回、組織管理者はCopilotのRunner type設定で、全リポジトリに適用される既定runnerを設定し、個別リポジトリ側の上書きをロックできるようになった。

2つ目は、Copilot code reviewがrepository、organization、enterprise levelのCopilot content exclusion設定を尊重するようになったことだ。GitHub Docsでは、repository administrators、organization owners、enterprise ownersがcontent exclusionを設定できると説明されている。機密ファイル、生成物、顧客別設定、外部に出したくないディレクトリをAIレビューの文脈から外す設計が、PRレビューにもつながる。

3つ目は、custom instructionsの文字数制限撤廃である。従来、Copilot code reviewは`.github`配下の`copilot-instructions.md`や`*.instructions.md`を読む際、4000文字に達するとそれ以上を読まない制約があった。今回、その制限がなくなった。長いレビュー規約、言語別ルール、セキュリティ観点、テスト方針をより素直に渡せる。

## 事実: runner設定はレビュー品質と内部到達性に効く

Copilot code reviewがGitHub Actions上で動くことは、企業にとって重要である。なぜなら、レビューAIが何を見られるか、どのネットワークへ出られるか、どの性能で動くかがrunnerに依存するからだ。

GitHub Docsのrunner設定ページでは、GitHub-hosted runnerを無効化している組織ではagentic capabilitiesが利用できず、より限定的なreviewへfallbackすると説明されている。self-hosted runnerを使う場合、GitHubはActions Runner Controller、つまりARCで管理されたrunner scale setを公式に支える形を示している。これは単なる性能設定ではなく、内部パッケージ、private dependency、社内ネットワーク、監査ログ、runner isolationをどう扱うかの設計である。

今回の組織単位設定により、各リポジトリがばらばらにrunnerを選ぶ状態を減らせる。たとえば、金融系の基幹リポジトリはself-hosted runner、一般的な社内ツールはGitHub-hosted large runner、OSS寄りの公開リポジトリは標準runner、といった方針を組織で決めやすくなる。さらにロック設定により、現場が便利さを優先して別runnerへ変えることも抑えられる。

ただし、runnerを重くすれば安全になるわけではない。self-hosted runnerは内部資産へ近づける一方、運用責任も増える。ARC、runner image、ネットワーク、secret、ログ、削除タイミングを管理しなければならない。Copilot code reviewを導入するなら、通常のCI runner管理とは別に、AIレビューが読む情報と実行する環境を棚卸しする必要がある。

## 分析: content exclusionはPRレビューの境界線になる

ここからは分析だ。

Content exclusion対応は、日本企業にとって大きい。AIレビューに見せてよいファイルと、見せるべきでないファイルを分けられるからだ。機密情報が含まれる設定ファイル、顧客別の導入設定、セキュリティ検証用のサンプル、契約上外部処理できないデータ、巨大な生成物などは、レビューAIの文脈から外したい場面がある。

ただし、除外すればすべて解決するわけではない。除外したファイルを参照しないと正しいレビューができないケースもある。たとえば、認可ロジックの変更をreviewするにはpolicy fileやroute設定が必要かもしれない。DB migrationをreviewするにはschemaやseed dataが必要かもしれない。除外設定はセキュリティのための壁だが、同時にレビュー品質へ影響する制約でもある。

実務では、content exclusionを「AIに読ませないリスト」としてだけ運用しないほうがよい。除外対象ごとに、なぜ除外するのか、代替として何をレビューに渡すのか、人間reviewerがどこを見るのかを決めたい。たとえば、本番秘密情報を含む設定ディレクトリは除外し、代わりにsanitized sampleをレビュー対象にする。顧客別設定は除外し、共通schemaとvalidation testだけを見せる。こうした設計がないと、AIレビューは安全にはなるが浅くなる。

日本企業では、委託先やグループ会社との共同開発で、リポジトリ内に複数の情報区分が混在することがある。Copilot code reviewを一律に有効化する前に、repository、organization、enterpriseのどのレイヤーで除外を置くかを決めるべきだ。enterprise側で広く除外しすぎると現場のレビューが弱くなる。repository側だけに任せると統制が効きにくい。組織共通の禁止パターンと、リポジトリ固有の除外を分けるのが現実的だ。

## 分析: custom instructions制限撤廃は便利だが、規約の品質が問われる

Custom instructionsの文字数制限撤廃は、多くのチームにとって歓迎される。これまでは、長いレビュー規約やpath-specific instructionsを書いても、Copilot code reviewが途中までしか読まない前提で短く保つ必要があった。制限が外れれば、言語別のレビュー観点、テスト方針、アクセシビリティ、セキュリティ、依存関係、命名規約をより丁寧に書ける。

しかし、長く書けることと、良い指示になることは別である。レビュー規約が散らかっていると、AIは重要な優先順位を判断しにくい。人間が読む規約でも同じだが、AI向けinstructionsでは特に、必須ルール、推奨ルール、例外条件、レビュー時にコメントすべき重大度を分けたほうがよい。

たとえば、`must`として「認証境界を変える差分ではテストを要求する」、`should`として「public APIの命名は既存規約に合わせる」、`ignore`として「生成済みsnapshotの差分にはstyleコメントしない」と書く。さらに、path-specific instructionsで`src/auth/**`、`src/billing/**`、`docs/**`のように領域ごとの観点を分ける。長い1枚の規約より、責任領域ごとの短い規約のほうが保守しやすい。

この更新により、レビュー規約そのものがソフトウェア資産になる。誰が更新し、どのPRで変更し、Copilotのコメント品質がどう変わったかを追う必要がある。AIレビューの品質が悪いとき、モデルだけでなくinstructionsを疑う運用が必要になる。

## 開発チームへの意味

開発チームにとって、今回の更新はCopilot code reviewを「個人が試す機能」から「組織標準に入れる機能」へ近づける。特に、PRレビューの自動化を進める企業では、次の3点を同時に見たい。

第一に、runner標準化である。どのリポジトリで標準runner、large runner、self-hosted runnerを使うかを決める。Copilot cloud agentも有効な組織では、今回のrunner設定がcloud agentにも適用される点に注意する。PRレビューだけを考えて設定すると、agent作業の実行条件にも影響する可能性がある。

第二に、content exclusionの棚卸しである。すでにCopilot ChatやIDE向けに除外設定を入れている企業でも、それがPRレビューに入ったときに何が変わるかを確認する。除外対象が多いリポジトリでは、AIレビューが見落としやすい領域を人間reviewerへ明示する必要がある。

第三に、custom instructionsの整備である。4000文字制限がなくなったからといって、既存規約をそのまま貼るだけでは足りない。AIレビュー向けに、重大度、必須条件、コメントしない条件、領域別の注意点へ整理する。これは[Copilot CLIの/security-review](/blog/github-copilot-cli-security-review-2026/)にも通じる。commit前とPR上で、同じ品質観点を別の形で使えるようにするのが理想だ。

## 日本市場での読み方

日本市場では、GitHub Copilotの導入が個人利用から組織標準へ移る段階で、レビューAIの扱いが課題になりやすい。コード生成は開発者個人の生産性として説明しやすい。一方、PRレビューはチーム品質、監査、委託先管理、責任分界に直結する。AIが出したコメントをどこまで採用するか、AIに見せないファイルを誰が決めるか、AIレビューで通ったPRを人間がどう承認するかは、現場だけで決めにくい。

今回の更新は、そうした管理部門の懸念に答える材料になる。組織runnerをロックできるなら、社内ネットワークや実行環境の統制を説明しやすい。Content exclusionをPRレビューにも効かせられるなら、機密ファイルをAI文脈から外す方針を作りやすい。Custom instructionsの制限が外れるなら、社内のレビュー規約をAIに反映しやすい。

ただし、導入判断では「GitHubが管理機能を追加したから安全」と短絡しないほうがよい。管理機能は運用されて初めて意味がある。誰がrunner設定を変更できるのか、content exclusionの変更をどうレビューするのか、instructions変更でレビュー品質が落ちたときにどう戻すのかを決める必要がある。

日本企業がまずやるべきことは、Copilot code reviewを有効化しているリポジトリを一覧化し、runner、content exclusion、instructions、Actions minutes、AI Creditsの状態を同じ表に並べることだ。PRレビューAIはコード品質だけでなく、実行基盤、文脈管理、費用、証跡の交点にある。その交点を見える化できる組織ほど、Copilot code reviewを安全に広げられる。

## 実務チェックリスト

まず、組織のCopilot runner設定を確認する。標準runnerでよいリポジトリ、large runnerが必要なリポジトリ、self-hosted runnerを使うべきリポジトリを分ける。ロック設定を使うなら、例外申請の流れも決める。

次に、content exclusionを棚卸しする。除外パスの目的、対象レイヤー、影響するレビュー観点、人間が補完すべき確認を記録する。除外した結果、Copilot code reviewが重要な文脈を読めなくなる領域は、人間reviewerのチェックリストに戻す。

最後に、custom instructionsをAIレビュー向けに書き直す。長くなった規約をそのまま渡すのではなく、必須、推奨、無視、領域別ルールに分ける。変更はPRで管理し、Copilotのコメント品質が変わったらinstructions差分も確認する。

## 出典

- [Copilot code review: New configurations and controls](https://github.blog/changelog/2026-06-12-copilot-code-review-new-configurations-and-controls/) - GitHub Changelog, 2026-06-12
- [Excluding content from GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot) - GitHub Docs
- [Configuring runners for GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-runners) - GitHub Docs
- [Using GitHub Copilot code review](https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review) - GitHub Docs
