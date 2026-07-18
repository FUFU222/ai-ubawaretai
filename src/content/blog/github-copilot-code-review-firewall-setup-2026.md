---
title: 'Copilot code review Firewall、PR監査の実装線'
description: 'Copilot code reviewのFirewall既定化とsetup専用設定を整理。日本企業がPR監査、runner、指示ファイル検証、AI Creditsをどう統制するか解説する。'
pubDate: '2026-07-18'
category: 'news'
tags: ['GitHub Copilot', 'コードレビュー', 'AIエージェント', '開発者ツール', '管理者設定', 'セキュリティ', 'SaaSコスト管理']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月17日**、Copilot code review のカスタマイズと実行環境設定を強化した。主な変更は、custom instructions を pull request の head branch から読むこと、`REVIEW.md`、`GEMINI.md`、`CLAUDE.md` も読むこと、専用の `.github/workflows/copilot-code-review.yml` で setup steps を定義できること、code review が既定で firewall の背後で動くこと、そして Copilot code review と Copilot cloud agent の runner 設定を分けられることである。

これは単なるレビューAIの精度改善ではない。Copilot code review を、企業の PR 監査、ネットワーク制御、runner 標準化、レビュー規約の検証サイクルへ組み込む更新である。以前の [Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/) では runner、content exclusion、custom instructions の組織統制を扱った。今回の更新は、その実装面をさらに細かくし、レビュー環境を repository ごとに設計しやすくする。

費用面も切り離せない。[Copilot code reviewのActions minutes課金](/blog/github-copilot-code-review-actions-minutes-2026/) で見た通り、private repository の code review は AI Credits だけでなく Actions minutes も意識する必要がある。さらに [GitHub Copilot repo指標、PR効果を測る実務](/blog/github-copilot-repo-usage-metrics-ga-2026/) により、どの repository で code review activity が起きているかも見えるようになった。今回の変更は、見える化した PR activity に対して、どの実行環境とルールでレビューさせるかを詰める段階の更新だ。

## 事実: code review専用の実行制御が増えた

GitHub Changelog によると、Copilot code review は firewall、custom setup steps、独立した runner configuration を使うようになった。これまでも Copilot cloud agent 側には実行環境やネットワークの統制論点があったが、今回の発表では code review を cloud agent と同じ箱で扱うのではなく、PRレビュー専用の実行面として分けている。

専用 setup steps は `.github/workflows/copilot-code-review.yml` で定義する。GitHub は、このファイルにより、Copilot code review がレビュー時に使う依存関係、runner、tooling、準備処理を repository レベルで設定できると説明している。ファイルがない場合は、既存の `copilot-setup-steps.yml` があればそれを fallback として使う。

Firewall は既定で有効になる。GitHub は、Copilot code review が default で firewall の背後で動き、レビュー中の network access を制限すると説明している。設定は repository と organization の Copilot settings から、Copilot cloud agent とは別に行う。つまり、cloud agent は外部アクセスを許可しつつ、code review は閉じる、といった分離が可能になる。

ただし self-hosted runners では注意が必要だ。Changelog は、self-hosted runners は現在 firewall を support しないため、self-hosted runner を使う code review は従来通り firewall なしで走ると明記している。日本企業で「self-hosted runner だから安全」と考えている場合、ネットワーク制御の責任が GitHub 側ではなく自社 runner 管理へ寄る点を見落としてはいけない。

## 事実: custom instructionsの検証線が変わる

もう1つ大きいのは、custom instructions を head branch から読む点である。GitHub は、`copilot-instructions.md`、`*.instructions.md`、agent skills、`AGENTS.md` を pull request の head branch から読むため、merge 前に指示変更を試せると説明している。

従来型のレビュー規約では、base branch にあるルールが正とされやすい。これは安定している一方、レビュー規約の改善を試すには、いったん main に取り込む必要がある。今回の変更では、feature branch 上で instruction の変更を入れ、その PR 自体で Copilot code review の挙動を検証しやすくなる。

さらに、Copilot code review は `REVIEW.md`、`GEMINI.md`、`CLAUDE.md` も読むようになった。すでにリポジトリ内で人間向け review guideline、Gemini 向けの作業指示、Claude 向けの repository instructions を持っているチームでは、同じ文書を Copilot code review にも拾わせられる可能性がある。

一方で、これは便利さとリスクが同時にある。head branch の instruction を読むということは、PR 作成者が review behavior に影響するファイルを同じ PR で変更できるということでもある。もちろん GitHub Docs の code review の位置づけでは、Copilot のコメントは人間承認の代替ではない。だが、レビューの観点、厳しさ、読み込む前提が PR 内で変わるなら、人間 reviewer は instruction 変更そのものをレビュー対象に入れる必要がある。

## 分析: 日本企業では「検証しやすさ」と「迂回耐性」を分ける

ここからは分析だ。

今回の head branch instruction は、開発基盤チームにとってかなり実用的である。たとえば、セキュリティレビュー観点を増やす、TypeScript と Java で別のレビュー規約を入れる、テスト不足へのコメント基準を調整する、社内設計原則を `REVIEW.md` に移す、といった変更を PR 上で試しやすくなる。

ただし、すべての repository で自由に instruction を変えられると、レビューAIの統制は弱くなる。悪意がなくても、「この PR では migration なので細かい指摘は不要」といった文言が入り、重要な指摘が薄まる可能性がある。委託先や複数会社が同じ repository を触る場合、instruction 変更の承認者を明確にしないと、AIレビューの品質が branch ごとに揺れる。

現実的には、instruction file を2層に分けるのがよい。1つ目は organization または base branch 側で守る固定ルールで、セキュリティ、個人情報、依存関係、テスト、CODEOWNERS、禁止事項を置く。2つ目は repository や branch で試す補助ルールで、言語別観点、migration 方針、PR サイズ、domain 特有の注意点を置く。

Copilot code review が `REVIEW.md`、`GEMINI.md`、`CLAUDE.md` を読むようになったことも、ドキュメント統合の機会になる。これまで AI ツールごとに別々の指示ファイルを増やしていた組織は、同じレビュー原則を一箇所に寄せられるかもしれない。ただし、ツールごとの解釈差は残る。ファイル名が拾われるからといって、すべてのモデルが同じ品質で同じ優先順位を守るとは限らない。

## 実務: firewallとrunnerを同じ台帳で見る

最初にやるべきことは、Copilot code review の対象 repository 台帳を作ることだ。repository、visibility、data classification、CODEOWNERS、code review 有効化状態、runner type、firewall 設定、self-hosted runner 有無、custom instructions の場所、`copilot-code-review.yml` の有無を並べる。

特に firewall は、設定値だけでなく runner とセットで見る必要がある。GitHub-hosted runner であれば firewall 既定化の恩恵を受けやすい。一方、self-hosted runner は firewall support の外にあるため、自社の network egress 制御、artifact access、secret handling、proxy policy を確認する必要がある。ここを曖昧にすると、「Copilot code review は firewall behind で動く」という一般論を、self-hosted runner に誤って適用してしまう。

次に、`.github/workflows/copilot-code-review.yml` の用途を限定する。依存関係の install、monorepo の対象 package 解決、言語別 toolchain、静的解析の前処理などは有効だ。しかし、本番 secret を読ませる、社内ネットワークへ広く接続する、review のために過剰な build を走らせる、といった設計は避けるべきである。Copilot code review は PR の助言であり、本番環境に近い権限を持つ必要は通常ない。

3つ目に、instruction file の変更を CODEOWNERS で保護する。`AGENTS.md`、`REVIEW.md`、`.github/copilot-instructions.md`、`*.instructions.md`、`.github/workflows/copilot-code-review.yml` は、レビューAIの挙動や実行環境を変える設定ファイルである。アプリコードと同じ承認ルールでは弱い repository では、開発基盤、セキュリティ、または repository owner の承認を必須にする。

4つ目に、費用を見る。[GitHub MobileでCopilotレビューコメント修正を依頼できる更新](/blog/github-mobile-copilot-review-comments-agent-2026/) のように、Copilot code review は cloud agent による修正導線とも近づいている。レビューを増やし、setup steps を重くし、runner を分け、さらに Fix with Copilot までつなぐと、AI Credits と Actions minutes の両方が増えやすい。code review の品質だけでなく、月次の usage metrics と billing report を合わせて確認する必要がある。

## 注意点: docsとchangelogの差分を運用メモに残す

今回のような Copilot 更新では、Changelog が最新の挙動を先に説明し、Docs の細部が後追いで更新されることがある。記事執筆時点では、Changelog が head branch instruction、expanded instruction files、firewall default、runner 分離を明確に述べている。一方、Docs の code review ページは、Copilot code review の使い方や人間レビューとの関係を説明する基礎資料として読むのが安全だ。

運用上は、設定変更の根拠を Changelog と Docs の両方で残すとよい。導入メモには、いつの Changelog に基づいて firewall と setup file を見直したか、Docs のどのページで Copilot code review の性質を確認したか、self-hosted runner の例外を誰が承認したかを書く。

また、Copilot code review のコメントを「必須レビュー」と誤解しないことも重要だ。GitHub Docs は、Copilot code review が pull request にコメントや suggested changes を出すものとして説明している。最終的な承認、Request changes、merge 可否、設計判断は人間の reviewer と repository owner が担う。AIレビューの環境が強化されても、責任分界は自動で変わらない。

## まとめ

Copilot code review の 2026年7月17日更新は、レビューAIを企業の PR 監査基盤へ近づける変更である。head branch で custom instructions を検証でき、`REVIEW.md`、`GEMINI.md`、`CLAUDE.md` も拾えるようになり、専用の setup workflow と firewall 既定化、runner 分離が入った。

日本企業にとっての実務価値は、レビューの品質改善だけではない。どの repository で code review を走らせ、どの runner と network access を許し、どの instruction file を誰が変更でき、AI Credits と Actions minutes をどの部門が見るかを設計できる点にある。今回の更新を機に、Copilot code review を「便利なPRコメント」ではなく、PR監査と開発基盤統制の一部として棚卸ししたほうがよい。

## 出典

- [Copilot code review: Customization and configurability improvements](https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/) - GitHub Changelog, 2026-07-17
- [Using GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review) - GitHub Docs
- [Repository-level GitHub Copilot usage metrics generally available](https://github.blog/changelog/2026-07-17-repository-level-github-copilot-usage-metrics-generally-available/) - GitHub Changelog, 2026-07-17
