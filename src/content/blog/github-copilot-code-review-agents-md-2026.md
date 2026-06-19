---
title: 'Copilot code review、AGENTS.mdでPR規約を反映'
description: 'Copilot code reviewがAGENTS.md対応。日本の開発チームがPR規約、custom instructions、MCP連携、draft PRレビューをどう管理すべきか整理する。'
pubDate: '2026-06-19'
category: 'news'
tags: ['GitHub Copilot', 'コードレビュー', 'AIエージェント', '開発者ツール', '管理者設定']
draft: false
series: 'github-copilot-2026'
---

GitHub は **2026年6月18日**、Copilot code review が repository root の `AGENTS.md` を読めるようになったと発表した。あわせて、draft pull request でも reviewer picker から Copilot へ review request しやすくなり、PR timeline 上の Copilot review event も折りたたまれる。

これは小さな UI 改善だけの話ではない。`AGENTS.md` は、コーディング agent にリポジトリの前提、テスト手順、禁止操作、レビュー観点を伝えるための指示ファイルとして広がっている。Copilot code review がそのファイルを使うようになると、AI レビューの品質はモデル選択だけでなく、repository に置いた運用ルールの品質にも左右される。

すでに [Copilot code review組織統制、PR監査の新設定](/blog/github-copilot-code-review-org-controls-2026/) では runner、content exclusion、custom instructions の管理面を扱った。今回の更新はその続きである。[Copilot code review一括修正、PR運用の設計論点](/blog/github-copilot-code-review-batch-fix-agent-2026/) や [Copilot cloud agent自動実行](/blog/github-copilot-cloud-agent-automations-2026/) と合わせると、GitHub は PR レビュー、修正、agent 実行を同じリポジトリ指示で束ねる方向へ進んでいる。

## 事実: Copilot code reviewがroot AGENTS.mdを読む

GitHub Changelog は、Copilot code review が repository-level `AGENTS.md` files を support し、root に置いた `AGENTS.md` から関連 instructions を使って review feedback を生成すると説明している。すでに `AGENTS.md` がある repository では、Copilot code review が workflow の一部としてその context を自動利用する。

ここで重要なのは、対象が「root の `AGENTS.md`」と明記されている点だ。GitHub Docs の repository custom instructions では、従来から `.github/copilot-instructions.md` に repository-wide instructions を置き、`.github/instructions/**/*.instructions.md` に path-specific instructions を置く方法が説明されている。さらに agent instructions として、repository 内の `AGENTS.md` を使う考え方も示されている。

つまり、Copilot に渡す指示は一枚岩ではない。従来の custom instructions は引き続きあり、path-specific instructions も使える。その上で、今回の Changelog は、Copilot code review が root `AGENTS.md` も読むようになったことを知らせている。日本企業の開発基盤チームは、どのファイルに何を書くかを整理しないと、レビューAIへの指示が重複したり、矛盾したりしやすい。

## 事実: draft PRレビューとtimeline表示も変わった

同じ Changelog では、draft pull request で Copilot code review を依頼しやすくなったことも示されている。従来も draft PR に Copilot review を依頼できたが、今回から reviewer picker の Copilot の横に Request button が表示され、Copilot を検索しなくても依頼しやすくなる。

これは地味だが、開発運用には効く。公開前の draft PR で AI に最初の指摘を出させ、人間 reviewer へ回す前に obvious な修正を片付ける流れが作りやすくなるからだ。[Copilot CLI security review](/blog/github-copilot-cli-security-review-2026/) が commit 前の確認なら、draft PR の Copilot review は人間レビュー前の中間点になる。

また、PR の Conversation tab では Copilot code review events が timeline に並びやすい。GitHub は今回、特定の review event をまとめて折りたたむことで、重要な会話を見つけやすくすると説明している。Copilot review を常用するチームほど、timeline の騒がしさはレビュー体験に影響する。AI レビューを増やすなら、コメント品質だけでなく、PR 上の情報量も管理対象になる。

## 分析: AGENTS.mdはレビュー規約の入口になる

ここからは分析だ。

`AGENTS.md` 対応の意味は、AI レビューの設定が GitHub settings だけでなく、repository の version-controlled file に寄ることだ。設定画面での on/off ではなく、Pull Request でレビューし、差分として管理し、チームの合意を残せるファイルになる。

これは日本企業に向いている。多くの組織では、レビュー観点が Wiki、設計標準、セキュリティチェックリスト、プロジェクト README、委託先向け手順書に分散している。Copilot code review に一貫した feedback を出させたいなら、まずそれらを AI が読める形に要約する必要がある。`AGENTS.md` は、その入口として使いやすい。

ただし、`AGENTS.md` にすべてを書けばよいわけではない。root `AGENTS.md` は全体方針、`.github/copilot-instructions.md` は Copilot 向けの repository-wide rules、path-specific instructions は領域別の細かい観点、`.github/skills` は特定作業の手順、というように役割を分けたほうが保守しやすい。

たとえば root `AGENTS.md` には、使用言語、必須テスト、禁止コマンド、レビュー時の重大度方針を書く。`src/auth/**` の path-specific instructions には認可境界、監査ログ、権限昇格の確認を書く。`docs/**` には外部公開文書の表現ルールを書く。レビューAIが「どの観点をどこで読むか」を人間が設計する必要がある。

## 分析: 矛盾するinstructionsは品質劣化の原因になる

GitHub Docs は、複数種類の instructions が同じ request に適用され得ると説明している。関連する instructions は Copilot に渡されるが、矛盾を避けるべきだとも述べている。これは、Copilot code review の運用品質に直結する。

たとえば、root `AGENTS.md` に「テスト未追加なら必ず指摘」と書き、path-specific instructions に「UI copy の小修正ではテスト不要」と書いた場合、優先順位や例外条件が曖昧だと、AI は一貫しないコメントを出しやすい。人間 reviewer なら文脈で判断できるが、AI レビューでは指示の構造がそのまま出力品質に影響する。

実務では、instructions を次のように分けるとよい。必須の blocking concern、推奨の improvement、コメントしない ignore rule、領域別の観点、セキュリティ・個人情報・課金など重大変更の escalation rule である。長い文章で「品質を高めること」と書くより、AI がコメントすべき条件を具体化するほうが効く。

また、instructions には秘密情報を書かない。内部URL、credential、顧客名、未公開案件、脆弱性の詳細を入れると、AI レビューの context として扱われる可能性がある。AI に知らせたいのは「何を守るか」であり、秘密そのものではない。

## 日本企業での運用ポイント

日本の開発チームが最初にやるべきことは、`AGENTS.md` を「AI向け社内規約の置き場」として乱用しないことだ。まず既存の `.github/copilot-instructions.md`、`.github/instructions/`、`AGENTS.md`、README、開発標準を棚卸しする。それぞれの所有者と用途を決める。

次に、Copilot code review がどの branch の instructions を読むかを確認する。GitHub Docs は、PR review 時に base branch の custom instructions を使う例を示している。つまり、feature branch にだけ新しい rules を足しても、レビュー時に期待どおり効かない可能性がある。レビュー規約の変更は、先に main へ入れるか、導入PRを分けて扱うほうがよい。

第三に、draft PR の使い方を決める。Copilot に draft PR を見せるなら、人間レビュー前の一次点検として扱うのか、作業者のセルフレビューとして扱うのか、セキュリティや認可変更では必ず人間 review を追加するのかを決める。AI review は approve でも request changes でもなく comment review であり、required approval を置き換えない。

第四に、MCP と agent skills の扱いを確認する。GitHub Docs は、Copilot code review が repository に設定された MCP servers や agent skills を、関連する場合に使えると説明している。Playwright や GitHub MCP が既定で有効になる領域もあるため、PR review に外部 context を使わせるか、cloud agent だけに閉じるかを repository settings で決める必要がある。

## まとめ

Copilot code review の `AGENTS.md` 対応は、AI レビューを repository の運用ルールへ近づける更新だ。root `AGENTS.md` を読めるようになったことで、レビューAIにリポジトリ固有の期待値を伝えやすくなる。一方で、既存 custom instructions、path-specific instructions、MCP、agent skills と重なるため、指示ファイルの設計を怠ると品質がぶれる。

日本企業にとっての焦点は、AIにレビューさせること自体ではない。PR規約をどのファイルで管理し、誰が更新し、どのbranchから効き、どの領域では人間レビューを必須にするかだ。Copilot code reviewを本番運用に入れるなら、`AGENTS.md` は便利なメモではなく、開発基盤の一部として扱うべきである。

## 出典

- [Copilot code review: AGENTS.md support and UI improvements](https://github.blog/changelog/2026-06-18-copilot-code-review-agents-md-support-and-ui-improvements/) - GitHub Changelog, 2026-06-18
- [Using GitHub Copilot code review](https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review) - GitHub Docs
- [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) - GitHub Docs
- [Using custom instructions to unlock the power of Copilot code review](https://docs.github.com/en/copilot/tutorials/customize-code-review) - GitHub Docs
