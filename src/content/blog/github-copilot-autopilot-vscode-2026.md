---
title: "GitHub CopilotにAutopilot登場——VS Codeが「多エージェント開発OS」になるのか"
description: "GitHubが2026年4月7日〜8日にCopilot Autopilot、BYOK/ローカルモデル、GitHub Mobile対応を連続投入。VS Code、CLI、cloud agentが一体化する意味を開発者目線で整理する。"
pubDate: "2026-04-09"
category: "news"
tags: ["GitHub", "GitHub Copilot", "Autopilot", "VS Code", "Copilot CLI", "cloud agent", "AIエージェント", "開発者ツール"]
draft: false
---

GitHubが2026年4月8日に出した[「GitHub Copilot in Visual Studio Code, March Releases」](https://github.blog/changelog/2026-04-08-github-copilot-in-visual-studio-code-march-releases/)を見て、正直最初は「月例まとめか」と思った。でも中身はかなり違う。今回の本質は、GitHub CopilotがIDEの中で提案するだけの相棒から、**VS Code、CLI、cloud agent、GitHub Mobileをまたいで仕事を分担する開発エージェント基盤**へ寄ってきたことだ。特にAutopilotの登場は大きい。AIが承認待ちで止まらず、自分で再試行し、完了まで走り切る前提がついにStable系リリースへ入ってきたからだ。

この話が日本の開発者に効くのは、単に「Copilotが便利になった」からではない。GitHubをすでに使っているチームにとっては、別の専用エディタや独立エージェント製品を追加しなくても、**既存のGitHub運用の上に多エージェント開発を載せられる可能性**が見えてきた、というニュースだからだ。

## 何が発表されたのか

まず事実関係を整理する。

GitHubの4月8日付Changelogによると、VS Codeの2026年3月から4月上旬リリース群では、**Autopilotによる完全自律セッションの公開プレビュー**、**統合ブラウザでのデバッグ**、**画像・動画の入出力**、そして**チャット用カスタマイズを一元管理する新しいエディタ**が主要アップデートとして挙げられている。

その中でも中心にあるのがAutopilotだ。Changelogでは、Autopilotについて「エージェントが自分の行動を承認し、エラー時に自動再試行し、タスク完了まで自律的に動く」と説明している。さらに[Visual Studio Code 1.111のリリースノート](https://code.visualstudio.com/updates/v1_111)では、権限レベルが `Default Approvals`、`Bypass Approvals`、`Autopilot` の3段階になり、Autopilotでは**ツール呼び出しの自動承認、エラー時の自動再試行、自動応答、タスク完了までの継続実行**が行われると明記された。裏側では、エージェントが `task_complete` ツールを呼ぶまで走り続ける。

同じ2026年4月8日には[GitHub Mobile向けの更新](https://github.blog/changelog/2026-04-08-github-mobile-research-and-code-with-copilot-cloud-agent-anywhere/)も出ている。ここではCopilot cloud agentがモバイルでも、**コードベースの調査、実装計画の作成、ブランチ上でのコード変更、差分確認、必要時のPR作成**まで扱えるようになった。つまり、ローカルPCの前にいなくても、エージェントの仕事を継続できる。

さらに前日の2026年4月7日には[Copilot CLIのBYOK/ローカルモデル対応](https://github.blog/changelog/2026-04-07-copilot-cli-now-supports-byok-and-local-models/)が公開された。GitHubは、Azure OpenAI、Anthropic、OpenAI互換エンドポイントに加え、Ollama、vLLM、Foundry Localのようなローカル実行モデルも使えると説明している。`COPILOT_OFFLINE=true` を有効にすればGitHubサーバーと通信しない完全オフライン動作も可能で、GitHub認証さえ必須ではなくなった。

これを単発の改善として見るのはかなりもったいない。2026年4月1日には[Copilot CLIの `/fleet`](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)が複数subagentの並列実行に対応し、2026年4月6日には[Rubber Duck](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/)が別モデル系統による二重チェックを実験提供し、2026年4月8日にはVS Code側へAutopilotとネスト可能なsubagentが入った。1週間で見れば、GitHubはかなり意図的にピースを並べている。

## Autopilotとは何か

Autopilotを一番ざっくり言うと、**「確認のたびに止まるAI」から「終わるまで進み続けるAI」への切り替えスイッチ**だ。

従来のエージェント利用では、途中で「このコマンドを実行していいか」「この修正を適用していいか」と頻繁に人間が承認する場面があった。もちろんそれは安全側に倒した設計として合理的だが、一方で複数ファイルにまたがる改修や調査では、どうしても人間が交通整理係になりやすい。

Autopilotはそこを崩しにきた。VS Codeのドキュメントでは、Autopilotはすべてのツールを自動承認し、タスク完了までエージェントが進み続けるモードとされている。GitHub Changelogでも「No manual approvals required」とかなりはっきり書いている。

ただし、ここは便利さと同時に注意点でもある。リリースノートでは、AutopilotとBypass Approvalsは**ファイル編集、ターミナル実行、外部ツール呼び出しのような潜在的に破壊的な操作でも、手動承認をバイパスする**と警告している。つまりAutopilotは「安全になった自動化」ではなく、**責任を持って使う前提の高自律モード**だ。ここは勘違いしないほうがいい。

## 何がそんなに大きいのか

ここからは僕の見方だけど、今回いちばん重要なのはAutopilot単体ではない。**GitHubが“エージェントをどこで動かすか”の選択肢を一気につないだ**ことだと思う。

VS Codeではローカルに近い場所で対話しながら動かせる。CLIでは `/fleet` やsubagentを使ってターミナル中心の開発に乗せられる。cloud agentはGitHub上で非同期にPR仕事を進められる。GitHub Mobileではその続きを外出先から確認できる。そしてBYOK/ローカルモデル対応によって、推論の実行先はGitHub hostedに固定されなくなった。

要するにGitHubは、モデルそのものよりも**開発ワークフローの制御面**を取りにいっている。以前このサイトで書いた[GitHub Copilot SDKがパブリックプレビュー公開。自社アプリにCopilotエージェントを組み込める時代へ](/blog/github-copilot-sdk-public-preview-2026/)もそうだったけど、最近のCopilotはIDE内の補完機能ではなく、**共通ランタイムと共通UIを持ったエージェント実行面**として伸びている。

この方向は、[GitHub CopilotがJiraと連携——チケットを渡すだけでPRが生成される時代に](/blog/github-copilot-jira-coding-agent-2026/)で見えた「GitHubが既存開発フローに食い込む動き」ともきれいにつながる。Jiraで起票し、GitHubで実装し、VS CodeやCLIで介入し、必要ならMobileで進捗を見る。今回のアップデート群は、その全体像を一段くっきりさせた。

## 技術的に見るべきポイント

技術的に面白いのは3つある。

1つ目は、**自律性の単なる強化ではなく、権限モデルとして整理していること**だ。[VS Codeのセキュリティ文書](https://code.visualstudio.com/docs/copilot/security)では、permission picker、ターミナル承認、MCPツール承認、URL/ドメイン承認、diffレビューなどが明示されている。つまりGitHubは「AIを勝手に動かす」ではなく、「どこまで自律させるかをセッション単位で切り替える」UIを前面に出している。

2つ目は、**subagentの扱いが一気に本格化したこと**だ。[VS Codeのsubagentドキュメント](https://code.visualstudio.com/docs/copilot/agents/subagents)では、メインエージェントが複雑なタスクを必要に応じて分割し、サブエージェントへ渡し、結果を取り込む流れが説明されている。しかも4月8日付Changelogでは、subagentからさらにsubagentを呼べるネスト対応まで入った。これは単なる「エージェントが賢くなった」ではなく、**タスク分解そのものを製品機能にした**という話だ。

3つ目は、**モデル層と操作体験の分離**である。4月7日のCLI更新で、CopilotはAnthropicやAzure OpenAI、OpenAI互換エンドポイント、Ollamaのようなローカルモデルの上でも同じエージェント体験を保てるようになった。しかもGitHubは、explore、task、code-reviewといったbuilt-in sub-agentsがprovider設定をそのまま継承すると説明している。つまりGitHubは、モデル提供者としてではなく、**開発エージェントのフロントエンド兼オーケストレーション層**として振る舞い始めている。

## 日本の開発者と企業にどう効くか

日本市場では、この動きはかなり現実的に効くと思う。

スタートアップや小規模チームにとっては、まず道具の数を減らせる可能性がある。今までは「IDEはA、CLIエージェントはB、バックグラウンドPR作成はC、モバイル確認はD」という分裂が起きやすかった。もしGitHub Copilotがその大半を吸収できるなら、学習コストも運用もかなり軽くなる。

大企業やSIer、金融・製造のような規制や統制が重い組織では、BYOK/ローカルモデル対応が大きい。GitHubはCLIでオフラインモードまで用意し、cloud agent側では**既定でセキュリティ問題の検査とCopilot code reviewによる第二の目**を入れている。また、[cloud agent導入ガイド](https://docs.github.com/en/copilot/tutorials/cloud-agent/pilot-cloud-agent)では、まず低リスクなリポジトリで試し、第二承認者を必須にするブランチルールを勧めている。このあたりは、日本企業がPoCから本番へ進めるときに気にする論点をかなり理解している設計に見える。

一方で、Autopilotそのものはどの組織にもすぐ向くわけではない。日本企業では特に「誰が承認したか」「なぜその変更が入ったか」の説明責任が重い。だから実際には、いきなり全社でAutopilotを解放するより、まずは**低リスクなリポジトリ、限定メンバー、明確なコマンドルール**から始めるのが自然だろう。

## まとめ

GitHub CopilotのAutopilotは、単独の便利機能として見るより、GitHubがVS Code、CLI、cloud agent、Mobileを貫く**多エージェント開発の制御面**を作り始めた合図として見るほうがしっくりくる。

2026年4月7日と8日の更新でGitHubは、モデル選択、権限、サブエージェント、レビュー、モバイル継続作業までを一気につないできた。自分はこれを、AIコーディングツールの機能競争というより、**「どの会社が開発エージェントの標準作業面を握るか」**の勝負だと見ている。日本の開発チームにとっても、そろそろ「どのモデルが一番賢いか」だけで道具を選ぶ時期は終わり始めたのかもしれない。

## 出典

- [GitHub Copilot in Visual Studio Code, March Releases](https://github.blog/changelog/2026-04-08-github-copilot-in-visual-studio-code-march-releases/) — GitHub Changelog, 2026-04-08
- [Visual Studio Code 1.111](https://code.visualstudio.com/updates/v1_111) — Visual Studio Code, 2026-03-09
- [Security](https://code.visualstudio.com/docs/copilot/security) — Visual Studio Code Docs, accessed 2026-04-09
- [Subagents in Visual Studio Code](https://code.visualstudio.com/docs/copilot/agents/subagents) — Visual Studio Code Docs, accessed 2026-04-09
- [GitHub Mobile: Research and code with Copilot cloud agent anywhere](https://github.blog/changelog/2026-04-08-github-mobile-research-and-code-with-copilot-cloud-agent-anywhere/) — GitHub Changelog, 2026-04-08
- [Copilot CLI now supports BYOK and local models](https://github.blog/changelog/2026-04-07-copilot-cli-now-supports-byok-and-local-models/) — GitHub Changelog, 2026-04-07
- [Run multiple agents at once with /fleet in Copilot CLI](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) — GitHub Blog, 2026-04-01
- [GitHub Copilot CLI combines model families for a second opinion](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/) — GitHub Blog, 2026-04-06
- [Piloting GitHub Copilot cloud agent in your organization](https://docs.github.com/en/copilot/tutorials/cloud-agent/pilot-cloud-agent) — GitHub Docs, accessed 2026-04-09
- [Configuring settings for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/configuring-agent-settings) — GitHub Docs, accessed 2026-04-09
