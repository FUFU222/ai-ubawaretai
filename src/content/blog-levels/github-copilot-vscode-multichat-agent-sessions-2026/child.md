---
article: 'github-copilot-vscode-multichat-agent-sessions-2026'
level: 'child'
---

GitHub CopilotのVS Code 1.128更新では、Agents windowの中で**1つのagent sessionに複数のchatを持てる**ようになった。対象は、Copilot CLIやClaude agentのような対応済みagent host sessionから始まる。新しいchatは同じworkspaceとworktreeを共有するが、会話履歴、title、進行状況、agentやmodelの選択はchatごとに分かれる。

## 何が便利になるのか

いちばん分かりやすい使い方は、同じ開発タスクの中で役割を分けることだ。たとえば、1つ目のchatで既存コードを調査し、2つ目のchatで実装方針を考え、3つ目のchatで差分レビューをさせる。全部を1本の会話に混ぜるより、後から「どこで何を決めたか」を追いやすい。

また、fork機能を使うと、ある会話の途中から別案を試せる。A案では小さく直す、B案では設計を整理し直す、といった比較がしやすくなる。これは、AIに1つの答えを急がせるより、人間が複数案を見て選ぶ使い方に向いている。

## 気をつけること

複数chatは、複数の安全な作業場所を自動で作る機能ではない。同じsessionの中ではworkspaceとworktreeを共有するため、別々のchatが同じfileを触ると前提がずれることがある。大きな修正を完全に並行させたい場合は、別sessionや別branchを使うほうが安全だ。

もう1つの注意点は、chatを増やしすぎないことだ。最初は「調査」「実装案」「レビュー」の3つくらいで十分である。chat名を決め、何を任せるかを明確にしておくと、あとでPR説明やレビューに使いやすい。

## 日本のチームならどう始めるか

まずは低リスクなrepositoryで試すのがよい。調査chatには「fileを変更せず、分かった事実と未確認点だけ出す」と指示する。実装案chatには、調査結果を渡して修正方針を作らせる。レビューchatには、実際のdiffを見せて、テスト不足や破壊的変更がないかを確認させる。

会社で使う場合は、VS Codeのversion、Copilot plan、Claude agentやCopilot CLIが使えるかも確認する。さらに、どの権限を自動承認するか、terminalやbrowserを許可するか、ログをどこへ残すかも先に決めたい。便利だから全員に自由に使わせるのではなく、作業の区切り方を決めてから広げるほうが失敗しにくい。

## まとめ

VS Code 1.128の複数チャットagent sessionは、AIをただ並列に走らせる機能ではない。調査、実装、レビュー、代替案を分けて管理し、人間が判断しやすくするための機能である。日本の開発チームでは、まず小さなrepositoryで役割を固定して試し、PRに残す説明やレビュー手順と一緒に整えるのが現実的だ。

## 出典

- [GitHub Copilot in Visual Studio Code, June 2026 releases](https://github.blog/changelog/2026-07-08-github-copilot-in-visual-studio-code-june-2026-releases/) - GitHub Changelog, 2026-07-08
- [Visual Studio Code 1.128](https://code.visualstudio.com/updates/v1_128) - Visual Studio Code, 2026-07-08
- [Use the Agents window (Preview)](https://code.visualstudio.com/docs/agents/agents-window) - Visual Studio Code Docs, accessed 2026-07-10
