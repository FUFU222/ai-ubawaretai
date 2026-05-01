---
title: 'GitHub CopilotのJetBrains版でinline agent modeが公開。日本チームはauto-approveをどう扱うべきか'
description: 'GitHubが2026年4月24日、JetBrains IDEs向けCopilotでinline agent mode previewとglobal auto-approveを公開。管理者設定、Next Edit Suggestions、運用上の注意点を日本の開発チーム向けに整理する。'
pubDate: '2026-04-25'
category: 'news'
tags: ['GitHub', 'GitHub Copilot', 'JetBrains', 'AIコーディング', '開発者ツール', 'セキュリティ']
draft: false
series: 'github-copilot-2026'
---

GitHubが2026年4月24日に公開した更新で、**GitHub Copilot for JetBrains IDEs に inline agent mode のプレビュー、Next Edit Suggestions の強化、global auto-approve** が一度に入った。GitHub Copilot JetBrains inline agent mode とは何かを一言でいえば、**JetBrains のエディタ内で、Copilot にファイル編集やコマンド実行を伴うエージェント的な作業を、チャットパネルへ移らず始められるようにした** ということだ。

今回のニュースは、モデル追加とは性質が違う。大事なのは性能比較ではなく、**JetBrains を使う開発現場で、Copilot がどこまで自律的に動き、誰がその権限を許可し、どこで止めるか** が前面に出てきた点にある。

## 何が公開されたのか

GitHub Changelogで明示された更新は大きく3つある。

1つ目は、**inline agent mode の public preview** だ。これまで agent mode は主にチャットパネル中心の体験だったが、今回の更新で既存の inline chat から agent mode を呼び出せるようになった。GitHubは、これにより「より強力で文脈に即した支援」を、エディタから離れずに使えると説明している。

2つ目は、**Next Edit Suggestions の強化** だ。JetBrains版では、提案された編集を inlay preview で確認できるようになり、さらに離れた場所にある次の編集候補へ gutter の方向表示で飛びやすくなった。これは単なる見た目の改善ではない。複数箇所にまたがる変更で、編集候補を追いかけるストレスを減らす更新だ。

3つ目は、**global auto-approve と、terminal command / file edit 向けの granular control 追加** である。GitHubは global auto-approve を有効にすると、すべての workspace に対してすべての tool call を自動承認し、ファイル編集、ターミナルコマンド、外部ツール呼び出しのような潜在的に破壊的な操作も含めて、カテゴリ別設定より優先すると説明している。

この3つが同日に一緒に出た意味は大きい。GitHubは JetBrains 版 Copilot を、単なる補完機能ではなく、**インラインで起動できるエージェント実行面** へ近づけようとしている。

## inline agent modeで何が変わるのか

GitHub Docs の IDE向け説明では、agent mode を使うと Copilot は**どのファイルを変更するかを自分で判断し、コード変更やターミナルコマンドを提案し、必要なら追加の修正を繰り返しながら元のタスク完了を目指す** とされている。つまり、単発の質問応答ではなく、タスク完了型の振る舞いだ。

今回の JetBrains 更新では、その体験が inline chat 側へ入った。実務ではここが効く。日本の Java / Kotlin チームや IntelliJ 利用チームでは、チャット専用パネルへ移るより、**今見ているコードのその場で頼めること** のほうが利用率を押し上げやすいからだ。レビューしながら軽い修正を頼む、メソッド単位で意図を伝える、周辺ファイルへ変更が必要かを見せてもらう、といった使い方に自然につながる。

ただし、便利さと一緒に、**Premium Request と権限の話** が前に出る。GitHub Docs では、agent mode でユーザーが送る各 prompt は 1 回分の premium request として数えられ、モデルの multiplier が掛かると説明している。フォローアップのツール呼び出し自体は別課金ではなくても、上位モデルを agent mode で回し始めると、コストは確実に意識対象になる。

## 一番注意すべきはglobal auto-approve

今回の発表で最も見落とされやすいのはここだと思う。GitHubは changelog 上で、global auto-approve は**すべての workspace にまたがって、すべての tool call を自動承認する** とかなり強く書いている。しかも対象には、**file edits、terminal commands、external tool calls のような潜在的に破壊的な操作** が含まれる。

さらに GitHub 自身が、「**リスクを理解し受け入れる場合にのみ有効化してほしい**」と注意書きを付けている。つまりこれは、便利な既定値ではなく、明確に上級者向けの設定だ。

同時に追加された granular controls も重要だ。`rules` に明示していないコマンドやファイル編集に対して、既定で自動承認するかどうかを個別に決められるようになった。ここから見えるのは、GitHub が自動承認を「全面オン/オフ」だけではなく、**現場ごとの許可境界を細かく設計する前提** で出してきていることだ。

## ここまでは事実、ここからは分析

ここから先は分析だが、今回の更新は JetBrains 利用者向けの UX 改善に見えて、実際には **Copilot の責任境界をどこまで広げるか** の話になっている。

日本の開発組織では、JetBrains は個人利用よりも、金融、製造、SI、業務システム、エンタープライズ SaaS の Java / Kotlin 開発で根強い。そうした現場では、VS Code 文化圏よりも、IDE 標準機能、管理者設定、社内ルールが重いことが多い。だから inline agent mode の本当の論点は「便利になった」ではなく、**その IDE 上でエージェントにどこまで実行権限を渡してよいか** になる。

特に Business / Enterprise では、inline agent mode と Next Edit Suggestions の一部機能に **Editor preview features policy** が絡む。GitHub Docs の policies 説明でも、Copilot には feature policy、privacy policy、models policy があり、どの機能やモデルを使えるかを組織・エンタープライズ側で制御できるとされている。つまり、利用者が IDE を更新しただけでは終わらず、**管理者判断が1枚挟まる設計** だ。

これは日本企業にはむしろ合う。いきなり全社解禁するより、まず一部チームで preview feature を許可し、ログ、費用、事故リスク、レビュー工数を見たうえで広げる方が現実的だからだ。

## 日本の開発チームは何を決めるべきか

少なくとも次の4点は先に決めたほうがいい。

1つ目は、**global auto-approve を既定で有効にしないこと**。これは試験利用段階では特に重要だ。まずは明示ルールで許可した安全な操作だけに限定し、未知のコマンドや広範なファイル編集は人間承認を残した方がよい。

2つ目は、**preview feature を許可する対象チームを絞ること**。JetBrains 利用者全員へ開放するより、IDE に慣れていて、変更レビュー文化があり、CI や権限管理が整ったチームから始める方が事故が少ない。

3つ目は、**モデルと権限を分けて考えること**。高性能モデルを使えることと、ファイル編集やコマンド実行を自動承認することは別問題だ。モデルの許可は開けても、auto-approve は閉じるという設計が普通にありうる。

4つ目は、**JetBrains 上での利用場面を限定して始めること**。たとえば新規実装全体ではなく、テスト追加、リネーム、ローカルな補助修正、説明生成などから始めれば、効果と危険の両方を測りやすい。

## どう動くのが現実的か

もし日本の開発組織がこの更新を試すなら、最初の1週間でやるべきことは比較的はっきりしている。

- 使っている JetBrains IDE と Copilot plugin の更新可否を確認する
- Business / Enterprise なら Editor preview features policy の管理者を明確にする
- global auto-approve は切ったまま、限定ルールだけで pilot を始める
- Java / Kotlin の一部チームで、inline agent mode の利用場面を 2 から 3 種類に絞る
- premium request の消費と、レビューで差し戻した変更の傾向を記録する

この順なら、「便利そうだから入れる」ではなく、**権限・費用・レビュー負荷の3点で運用判断** ができる。

## まとめ

GitHub Copilot の JetBrains 更新は、2026年4月24日に inline agent mode preview、Next Edit Suggestions 強化、global auto-approve をまとめて出した発表だった。事実として重要なのは、**エディタ内で agent mode を呼び出せるようになり、複数箇所編集の追従性が上がり、同時に自動承認の権限が大きく広がった** ことだ。

分析として言えば、これは JetBrains 版 Copilot の UX 改善というより、**日本の開発チームが IDE 上のエージェントにどこまで裁量を渡すかを問う更新** である。特に global auto-approve は便利さより先に運用設計が必要だ。まずは preview を絞って許可し、自動承認は狭く、レビューは厚く。その順番で見るのが妥当だろう。

## 出典

- [Inline agent mode in preview and more in GitHub Copilot for JetBrains IDEs](https://github.blog/changelog/2026-04-24-inline-agent-mode-in-preview-and-more-in-github-copilot-for-jetbrains-ides/) - GitHub Changelog, 2026-04-24
- [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/how-tos/chat-with-copilot/chat-in-ide?tool=jetbrains) - GitHub Docs
- [GitHub Copilot policies to control availability of features and models](https://docs.github.com/en/copilot/concepts/policies) - GitHub Docs
- [Getting code suggestions in your IDE with GitHub Copilot](https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions?tool=jetbrains) - GitHub Docs
