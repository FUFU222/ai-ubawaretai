---
article: 'github-copilot-visual-studio-cloud-agent-2026'
level: 'child'
---

GitHub Copilot の **Visual Studio 2026 April update** では、Visual Studio から **cloud agent** を直接起動できるようになりました。日本の.NET開発チームにとって大事なのは、「AIが少し便利になった」ではなく、**PRのたたき台を非同期で作らせる使い方** がやりやすくなったことです。

## 何が変わったの？

GitHub の 2026年4月30日 changelog では、今回の中心を agentic workflows と説明しています。主な変更は次の通りです。

- Visual Studio の agent picker から Cloud を選んで cloud agent を開始できる
- 個人用 custom agent を `%USERPROFILE%/.github/agents/` に置ける
- skills を `.github/skills/` だけでなく `.claude/skills/` や `.agents/skills/` からも読める
- Debugger agent によって、失敗したテストやバグ修正の流れを補助できる

ただし、日付は少し分けて理解したほうがよいです。GitHub changelog が出たのは **2026年4月30日** ですが、Visual Studio の April Update 18.5.0 自体は **2026年4月14日** に公開されています。つまり、4月30日は要点の再整理に近い位置づけです。

## cloud agent は何が便利なの？

Visual Studio の release notes では、Cloud を選んで指示すると、agent がまず issue 作成の許可を求め、その後 pull request を準備すると説明されています。作業中に開発者は別の仕事を続けられ、Visual Studio を閉じてもよい流れです。

ここが従来のローカル補助と違います。GitHub Docs では、Copilot cloud agent は **GitHub Actions powered の一時的な開発環境** で動くと説明されています。つまり、ローカル PC の中で AI が直接全部触るのではなく、GitHub 側の隔離環境でコードを調べ、変更し、テストや lint まで進める設計です。

そのため、日本の現場では「AIに全部任せる」よりも、**下書きPRを作らせて人がレビューする** 使い方が自然です。

## custom agents と skills はどう使い分ける？

ここも実務では重要です。

custom agents は、役割ごとの人格や振る舞いを作るイメージです。たとえば「C#コードレビュー担当」「テスト修正担当」のような agent を `.agent.md` で定義できます。チーム共有なら repo 配下の `.github/agents/`、個人用なら `%USERPROFILE%/.github/agents/` が基本です。

skills は、agent が必要に応じて読み込む再利用可能な作業ルールです。GitHub Docs では project skills を `.github/skills/`, `.claude/skills/`, `.agents/skills/` に、personal skills を `~/.copilot/skills/` や `~/.agents/skills/` に置けるとしています。

簡単に言うと、

- custom agents は「誰として振る舞うか」
- skills は「どう作業するか」

を分ける仕組みです。

## 日本の.NET開発チームは何に注意すべき？

注意点は3つです。

1つ目は、**GitHub権限** です。Visual Studio からの cloud agent でも issue と PR を扱うので、どの repo で使うか、誰が許可するかを先に決める必要があります。

2つ目は、**コスト** です。GitHub Docs では cloud agent は GitHub Actions minutes と Copilot premium requests を使うと明記されています。IDE補助のつもりで広げると、後から費用説明が必要になります。

3つ目は、**再現性** です。個人用設定ばかり増やすとチーム内で動きがそろいません。最初は repo 側に最低限の shared rules を置き、個人最適化は user 側に分けるほうが安全です。

## まとめ

今回の更新は、Visual Studio で Copilot が少し便利になった話ではなく、**GitHub 上で動く cloud agent を IDE から呼べるようになった** 話です。

日本の.NET開発チームなら、まずは小さな bug fix、テスト修正、ドキュメント更新のような GitHub 完結タスクで試すのが現実的です。agent を「実装の完全自動化」ではなく、「PRの一次作成を任せる相手」と見ると導入判断をしやすくなります。

## 出典

- [GitHub Copilot in Visual Studio — April update](https://github.blog/changelog/2026-04-30-github-copilot-in-visual-studio-april-update/)
- [About GitHub Copilot cloud agent](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/cloud-agent/about-cloud-agent)
- [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Visual Studio 2026 release notes](https://learn.microsoft.com/en-us/visualstudio/releases/2026/release-notes)
