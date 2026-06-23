---
title: 'Copilot JetBrains版、Claude Agent統合の実務'
description: 'Copilot JetBrains版でClaude Agent providerがpreviewになった。日本のJava/Kotlin開発組織が権限、組織agent配布、Cloud agent GAをどう見るか整理する。'
pubDate: '2026-06-23'
category: 'news'
tags: ['GitHub Copilot', 'GitHub', 'JetBrains', 'Claude', 'AIコーディング', '開発者ツール', '管理者設定']
series: 'github-copilot-2026'
draft: false
---

GitHub は 2026年6月22日、GitHub Copilot for JetBrains IDEs 向けに **Claude as agent provider の public preview**、組織/Enterprise agents の利用、Copilot CLI セッションの queue / steer、agent debug logs summary、そして **Cloud agent の一般提供**をまとめて発表した。これは単なる JetBrains プラグインの小改修ではない。Copilot の中で、GitHub の cloud agent、組織が配布する custom agents、Anthropic Claude agent が同じ IDE 体験へ近づく更新である。

このサイトでは以前、[Copilot JetBrains版の inline agent mode と global auto-approve](/blog/github-copilot-jetbrains-inline-agent-mode-2026/) を、IDE 上で agent にどこまで実行権限を渡すかという論点として扱った。今回の更新は、その次の段階だ。JetBrains のエディタ内で agent を起動できるだけでなく、**どの agent を選び、誰が配布し、どの権限で動かすか**が前面に出てきた。

日本の Java / Kotlin / IntelliJ 中心の開発組織にとって重要なのは、Claude が使えるようになったというモデル比較だけではない。[GitHub Copilot Agent Finder と ARD](/blog/github-copilot-agent-finder-ard-2026/) で見た agent 発見・配布の問題、[Copilot code review の AGENTS.md 対応](/blog/github-copilot-code-review-agents-md-2026/) で見たリポジトリ指示の標準化、そして [MAI-Code-1-Flash の surface 拡大](/blog/github-copilot-mai-code-flash-surfaces-2026/) で見た複数モデル運用が、JetBrains IDE の中で重なり始めていることだ。

## 事実: Claude agent providerがJetBrainsでpreview

GitHub の changelog によると、Claude as agent provider は JetBrains IDEs 向け GitHub Copilot の public preview として提供される。利用するには、ローカル環境に Claude Code CLI をインストールし、JetBrains の Settings から GitHub Copilot Chat に Claude Code CLI のパスを設定する。その後、Copilot Chat の agent picker で Claude を選び、セッションを開始できる。

ここで特に重要なのは、GitHub が明示した注意書きだ。Claude agent は現時点で **bypass permissions mode** で動き、ファイル編集と tool calls が自動承認される。GitHub は、設定可能な permissions は今後提供予定だとしている。また Copilot Business / Enterprise の利用者では、管理者が Editor preview features policy を有効にする必要がある。

つまり今回の preview は、単に「Claude も選べます」ではない。JetBrains IDE の中で別 agent provider を選べる一方、現時点では権限確認の粒度が未完成であり、企業利用では管理者ポリシーを通す必要がある。日本企業が読むべき箇所はここだ。

## 事実: 組織/Enterprise agentsとCloud agent GAも同時に進んだ

同じ発表では、GitHub の organization / enterprise レベルで定義された agents を JetBrains IDE から使えるようになったことも示されている。管理者は curated な agent set を公開し、組織または Enterprise の開発者がそれを agent picker から使える。これは、個々の開発者が自分の IDE で自由に agent を作る話とは違い、組織として標準 agent を配布する話である。

GitHub Docs の custom agents 説明では、agent profile を `.agent.md` として定義し、description、tools、prompts などを設定できる。public preview の対象には JetBrains IDEs、Eclipse、Xcode も含まれる。今回の changelog は、その custom agents を組織・Enterprise 単位で JetBrains 側へ出す導線を強めたものと読める。

また changelog は、Cloud agent が now generally available になったとも書いている。GitHub Docs では、Copilot cloud agent はリポジトリを調査し、実装計画を作り、ブランチ上でコード変更を行い、利用者が diff を確認して PR に進められる agent と説明されている。今回の JetBrains 更新は、IDE 内での agent 選択、組織配布、クラウド実行が同時に整ってきたサインだ。

## 分析: 主題はモデル選択ではなくagent配布の統制

ここからは分析だ。

Claude を JetBrains で使えること自体は分かりやすいニュースだが、企業導入で本当に重いのはモデル比較ではない。重要なのは、開発者が IDE から選べる agent が増えたとき、どれを標準にし、どれを preview とし、どれを禁止し、どのリポジトリで使えるようにするかである。

日本のエンタープライズ開発では、JetBrains は Java / Kotlin / Spring / Android / 業務システムの現場で強い。そこでは IDE が個人の趣味ではなく、チームの標準環境になっていることが多い。標準環境に複数 agent が入ると、開発プロセス、レビュー、セキュリティ、教育、費用管理に影響が出る。

特に、組織/Enterprise agents の配布は便利だが、責任境界も生む。誰が agent profile を作るのか。どの tools を許すのか。どのプロンプトを標準化するのか。古い agent をいつ廃止するのか。Claude provider のような外部 agent との使い分けをどう説明するのか。ここを決めずに広げると、開発者ごとに違う agent が違う指示でコードを触り、レビューの再現性が落ちる。

## bypass permissions modeをどう扱うか

今回の発表で最も保守的に見るべきなのは、Claude agent provider が bypass permissions mode で動く点だ。GitHub の文言では、file edits と tool calls が automatically approved される。企業では、この一点だけで全社展開を見送る判断も十分あり得る。

ただし、これは「使うべきではない」という意味ではない。preview として小さく試すなら、価値はある。たとえば、低機密な検証リポジトリ、sandbox 用のブランチ、CI が整ったサンプルサービス、教育用コードベースで、Claude agent が JetBrains 内でどこまで有効かを見る。逆に、顧客データ、決済、認証、基幹系、リリース直前ブランチでは、permissions が細かく設定できるまで避けるのが妥当だ。

ここは4月の global auto-approve 論点ともつながる。auto-approve は便利さを上げるが、未知のコマンド、広範なファイル編集、外部ツール呼び出しを人間の確認なしに進める可能性がある。Claude provider preview は、まさにこの権限設計を再確認する機会である。

## 日本企業の導入チェックリスト

まず、Editor preview features policy の管理者を確認する。Business / Enterprise では、開発者が勝手に preview を使えるとは限らない。誰が許可し、どの組織・チーム・リポジトリに開くかを先に決める。

次に、agent picker に出す agent を棚卸しする。GitHub cloud agent、組織 custom agents、Claude agent provider が並ぶと、開発者は「どれを選べばよいか」で迷う。用途別に、軽い補助、リポジトリ横断修正、セキュリティ調査、リファクタリング、テスト追加などの推奨 agent を決めるべきだ。

第三に、Claude Code CLI の導入経路を管理する。ローカル CLI のパス設定が必要になるため、端末標準、バージョン管理、プロキシ、認証、ログ、アンインストール手順を確認する。個人が任意に入れる形にすると、サポートや監査が難しくなる。

第四に、preview の成功条件を PR 数だけにしない。確認すべきなのは、レビュー差し戻し率、意図しないファイル編集、tool call の範囲、テスト通過率、開発者の理解度、管理者ポリシーとの整合だ。

## まとめ

2026年6月22日の GitHub Copilot JetBrains 更新は、Claude agent provider preview、組織/Enterprise agents、Copilot CLI の queue / steer、debug logs summary、Cloud agent GA をまとめたものだった。事実としては、JetBrains IDE 上で選べる agent と管理面が一段広がった。

日本企業にとっての読みどころは、Claude か GitHub かという単純比較ではない。JetBrains 標準環境の中で、どの agent を誰に出し、どの権限で動かし、どの preview をどこまで許すかである。特に Claude provider の bypass permissions mode は、検証リポジトリから始め、権限設計が固まるまでは本番コードに広げない判断が現実的だ。

## 出典

- [New features and Claude as agent provider preview in JetBrains IDEs](https://github.blog/changelog/2026-06-22-new-features-and-claude-as-agent-provider-preview-in-jetbrains-ides/) - GitHub Changelog, 2026-06-22
- [Creating custom agents for Copilot cloud agent in your IDE](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-custom-agents-in-your-ide) - GitHub Docs
- [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents) - GitHub Docs
