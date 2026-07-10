---
title: 'GitHub Copilot複数チャット、VS Code分岐運用'
description: 'GitHub CopilotのVS Code 1.128更新を解説。複数チャットagent sessionを日本の開発チームが調査、実装、レビューでどう使い分けるか実務視点で整理する。'
pubDate: '2026-07-10'
category: 'news'
tags: ['GitHub Copilot', 'VS Code', 'Claude', 'Copilot CLI', 'AIエージェント', '開発者ツール', '管理者設定']
series: 'github-copilot-2026'
draft: false
---

GitHubは**2026年7月8日**、GitHub Copilot in Visual Studio Code の6月から7月上旬にかけた更新をまとめて公開した。中心にあるのは、VS Code 1.128のAgents windowで、1つのagent host sessionに複数のchatを持てるようになった点だ。Claude agentやCopilot CLI sessionで、同じworkspaceとworktreeを共有しながら、会話だけを分けて並行に進められる。

これは単なるタブ追加ではない。以前の[GitHub CopilotにAutopilot登場](/blog/github-copilot-autopilot-vscode-2026/)では、AIが承認待ちで止まりにくくなる高自律モードを扱った。今回の複数チャットは、自律性を上げるというより、人間が同じ作業単位の中で「調査」「実装案」「レビュー」「代替案」を分けて管理するための更新だ。[GitHub Copilot OTel管理](/blog/github-copilot-opentelemetry-managed-export-2026/)や[GitHub Copilot MDM設定](/blog/github-copilot-mdm-managed-settings-2026/)と合わせると、CopilotはIDE機能から、企業が管理するagent作業面へ寄っている。

## 事実: 1つのsessionに複数chatを持てる

VS Code 1.128のリリースノートは、Agents windowでClaude agent sessionの複数chatに対応したと説明している。各chatは同じsessionに属しながら、conversation history、title、model selectionを別々に持つ。フォークしたchatで別案を試したり、peer chatでテスト作成や調査を並行させたりできる。

Agents windowのドキュメントでは、複数chatはagent host sessionで使える機能として説明されている。新しいchatは空の入力から始まり、他のchatの履歴を自動では引き継がない。ただし、forkを使うと特定時点までの会話を引き継いだpeer chatを作れる。つまり、完全に独立した新規sessionを増やすのではなく、同じ作業領域の中で「ここから別の方向を試す」操作がしやすくなる。

重要なのは、複数chatが同じworkspaceとworktreeを共有することだ。これは便利だが、同時に設計を間違えると競合が起きる。たとえば、1つのchatにAPI設計を変えさせ、別のchatに同じfileのテストを直させると、変更の前提がずれる可能性がある。並列化できるのは会話であって、必ずしも安全に同じfileを同時編集できるという意味ではない。

対象も限定されている。ドキュメントは、複数chatがCopilot CLIとClaude sessionsのような対応済みagent host sessionで利用でき、他のsession typeでは単一chatになると説明している。日本の開発チームが社内展開するなら、まず対象client、VS Code version、Copilot plan、Claude agent利用可否を確認する必要がある。

## 事実: Agents windowは作業の観測面でもある

Agents windowは、単にchatを並べる画面ではない。VS Codeのドキュメントでは、session list、chat area、changes panel、files viewを中心に、複数workspaceのagent sessionを追跡できる面として説明されている。main editor windowとsession、settings、keybindingsを共有するため、通常の編集作業とagent-firstの作業を行き来できる。

この設計は、従来の「IDEの横にチャット欄がある」体験とは少し違う。Agents windowでは、sessionごとの変更file、diff、feedback、task実行、terminal、integrated browserを同じ面で扱える。VS Code 1.128では、統合browser tabの配置や、OS-level keyboard shortcutsも入り、agent作業を通常の編集作業から切り出して管理しやすくしている。

複数chatでは、session headerのchanges pillが複数chatからの変更をまとめて見せる。これは便利だが、レビュー時には注意が必要だ。どのchatがどの変更を作ったのか、どの指示から来たのかを追わないまま一括commitすると、変更理由の説明が弱くなる。日本企業では、PR説明や監査で「どの依頼に基づく変更か」を求められる場面が多い。chatを増やすほど、命名、担当、目的を明確にする価値が上がる。

## 分析: 並列実行より比較と分岐に価値がある

ここからは分析だ。

複数chatと聞くと、最初に思い浮かぶのは並列作業である。1つ目のchatで実装、2つ目でテスト、3つ目でドキュメントを書かせれば速くなる、という使い方だ。しかし実務では、同じworktreeを共有する以上、無制限の並列編集は危ない。とくに小さなrepositoryやfeature branchでは、同じfileへ触る確率が高い。

むしろ価値が出やすいのは、比較と分岐である。最初のchatで要件を整理し、forkしたchat Aで最小変更案、chat Bで将来拡張を見た案、chat Cでリスクだけを洗い出す。人間が3案を見比べ、1つを採用してから実装へ進める。この流れなら、AIに複数案を出させつつ、最終判断は人間が持てる。

もう1つの使い方は、調査と実装の分離だ。調査chatにはread-onlyに近い指示を与え、既存コード、設計、issue、類似bugだけを確認させる。実装chatには採用済み方針だけを渡す。レビューchatにはdiffを読ませ、仕様、テスト、セキュリティ、破壊的変更の観点で指摘させる。これは、[GitHub Copilot vision一般提供](/blog/github-copilot-vision-image-pdf-ga-2026/)で画像やPDFを渡すときにも同じで、入力を増やすほど役割を分けたほうが根拠を追いやすい。

日本の受託開発、SI、金融、製造の開発現場では、スピードだけでなく変更理由の説明が重要になる。複数chatは「AIがたくさん働く」機能としてではなく、「AIとの会話を作業単位に分け、後から見返せる」機能として扱うほうが定着しやすい。

## 日本チームの導入手順

最初の導入は、低リスクなrepositoryで3つのchat名を固定するのがよい。たとえば「調査」「実装案」「レビュー」だ。調査chatではfile変更を避け、設計の事実、変更候補、未確認点だけを出させる。実装案chatでは、調査結果を前提にpatch方針を作らせる。レビューchatでは、実際のdiffが出てから、テスト不足、互換性、認可、ログ、migrationの有無を見る。

次に、forkの使いどころを決める。要件整理の途中で迷ったときだけforkし、A案とB案を比較する。すべての思いつきをforkすると、chatが増えすぎて管理不能になる。forkは「同じ前提から別ルートを試す」ための機能であり、単なるメモ欄ではない。

3つ目は、changes panelでのレビュー手順を標準化する。複数chatの変更が1つのsessionに集まるため、commit前にfile単位で「どのchatが触ったか」「どの指示に対応するか」を確認する。PR本文には、採用した案、捨てた案、AIに任せた範囲、人間が確認した範囲を短く残す。これは監査だけでなく、後から同じ失敗を避けるためにも効く。

4つ目は、権限とログを先に決めることだ。複数chatが便利でも、Autopilot、tool approval、terminal、browser、MCP、外部networkを無制限に許す必要はない。MDMやmanaged settingsで標準設定を配り、OpenTelemetryやGitHub側のusage metricsで利用傾向を見る。AI agentの利用面が増えるほど、個人設定だけに任せる運用は弱くなる。

## 見落としやすい制約

第一に、複数chatは複数worktreeではない。同じsessionの中で同じ作業領域を共有するため、競合しやすい変更はchatを分けても安全にならない。大きな実装を完全に並列化したい場合は、別session、別branch、別worktreeを使うほうがよい。

第二に、chatごとにagentやmodelを変えられることは、品質保証を自動化するものではない。Claude agentで設計案を出し、Copilot CLIで修正し、別modelでレビューする構成は魅力的だが、モデル差による判断のばらつきも増える。採用基準、テスト、レビュー観点がなければ、単に出力が増えるだけになる。

第三に、quick chatとworkspace sessionを混同しないことだ。quick chatはworkspaceに紐づかない軽い質問に向く。一方、file変更、diff、test、browser確認を伴う作業はworkspace sessionで扱うべきだ。社内手順では、設計相談、コード変更、障害調査のどれをどの面で行うかを分けたほうがよい。

## まとめ

VS Code 1.128の複数チャットagent sessionは、GitHub Copilotを「1つの質問に1つ答える補助」から、「同じ作業領域の中で調査、分岐、比較、レビューを分ける作業面」へ近づける更新である。対応はClaude agentやCopilot CLI sessionから始まり、同じworkspaceとworktreeを共有しながら、chatごとに会話、title、model selectionを分けられる。

日本の開発チームにとって重要なのは、並列化の速さだけではない。役割を決めたchat名、forkの使いどころ、changes panelでのレビュー、PR説明、managed settings、OpenTelemetryをセットで設計することだ。Copilotを本番開発へ広げるほど、勝負は「どのAIが賢いか」ではなく、AIとの作業をどれだけ説明可能な単位へ分けられるかに移っていく。

## 出典

- [GitHub Copilot in Visual Studio Code, June 2026 releases](https://github.blog/changelog/2026-07-08-github-copilot-in-visual-studio-code-june-2026-releases/) - GitHub Changelog, 2026-07-08
- [Visual Studio Code 1.128](https://code.visualstudio.com/updates/v1_128) - Visual Studio Code, 2026-07-08
- [Use the Agents window (Preview)](https://code.visualstudio.com/docs/agents/agents-window) - Visual Studio Code Docs, accessed 2026-07-10
- [Third-party agents in Visual Studio Code](https://code.visualstudio.com/docs/agents/agent-types/third-party-agents) - Visual Studio Code Docs, accessed 2026-07-10
