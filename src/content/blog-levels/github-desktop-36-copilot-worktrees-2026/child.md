---
article: 'github-desktop-36-copilot-worktrees-2026'
level: 'child'
---

GitHub Desktop 3.6では、普段のGit操作にCopilotとworktreeが深く入るようになりました。大きな変更は、コミットメッセージの生成、マージ競合の説明と解消提案、モデル選択とBYOK、複数branchを並行して開くworktree対応です。

便利になる一方で、AIの提案をそのまま正解として扱わないことが重要です。GitHub Desktopは解消案を見せますが、変更の意味や業務ルールまで自動で保証するわけではありません。

## GitHub Desktop 3.6で増えたこと

GitHubの公式発表では、Desktop内のCopilot機能がCopilot SDKを共通基盤として使います。コミットメッセージ生成は、repositoryにある`.github/copilot-instructions.md`や`AGENTS.md`を読み、commit metadata rulesも考慮します。

たとえば、commit messageにissue番号を入れる、変更の種類を先頭に書く、チームで決めた用語を使うといった規約へ合わせやすくなります。ただし、署名付きcommitやmainへの直接push禁止のような必須ルールは、AIへの指示ではなくGitHubのrulesetやCIで強制する必要があります。

マージ競合が起きたときは、Copilotが衝突内容を説明し、解消案を提案します。利用者は提案を確認し、受け入れるか、編集してから完了できます。これは初心者が競合の意味を理解する助けになりますが、最終確認は人間が行います。

## 競合解消で確認すること

競合は、二つのbranchが同じ場所を変えたときに起きます。どちらかの行を残せばよい場合もありますが、認証、料金計算、DB変更、設定ファイルでは、見た目が自然でも動作が壊れることがあります。

Copilotの案を使った後は、差分を見て片方の変更が消えていないか確認します。次にtest、lint、type check、buildを実行します。認証、個人情報、決済、DB migrationの変更は、元の担当者か領域に詳しいreviewerへ回します。

大切なのは、AI支援をbranch protectionの代わりにしないことです。競合を早く解けても、通常のPull Request、required review、CIを通します。

## worktreeは並列作業のためのdirectory

Git worktreeを使うと、一つのrepositoryに複数のworking directoryを作れます。今のfeature作業を開いたまま、別directoryで緊急修正を始められます。stashしてbranchを切り替える回数が減り、AI agentと人間が別branchで並行作業しやすくなります。

ただし、worktreeはcontainerではありません。directoryは分かれても、Gitの情報、端末のcredential、networkなどを共有する場合があります。「別folderだから完全に隔離された」と考えないでください。

また、worktreeごとに`node_modules`やPython環境を作るとdiskを多く使います。作業が終わったfolderの削除、命名ルール、secret fileの扱いを決めておく必要があります。同じbranchを二つのworktreeで同時にcheckoutできないというGitの制限もあります。

## BYOKを使う前に決めること

Desktop 3.6のCopilot機能にはmodel pickerがあり、利用可能なモデルを選べます。BYOKでは第三者providerやローカルモデルを使う選択肢もあります。

会社で使う場合は、個人のAPI keyを業務コードへ使ってよいか、コードをどのproviderへ送れるか、費用を誰の予算で払うかを決めます。ローカルモデルでも、入力履歴やcacheが端末に残る可能性があります。外部へ送らないことと、管理不要であることは同じではありません。

最初は、低リスクのコミットメッセージ作成やdocsの競合から試すのが安全です。便利さだけで全repositoryへ広げず、失敗したときの影響が小さい場所で評価します。

## 導入時の確認手順

最初にGitHub Desktop 3.6を少人数へ配布します。次に、`AGENTS.md`と`.github/copilot-instructions.md`の内容を確認し、矛盾や秘密情報を削ります。

その後、Copilot競合解消を使ってよいコード領域と、人間reviewを必須にする領域を分けます。BYOKを許可するならprovider、API key、費用、退職時の失効手順を決めます。worktreeには作成場所、名前、最大数、削除期限を設定します。

効果を見るときは、AIの利用回数ではなく、競合解消にかかった時間、解消後の不具合、commit messageの修正回数、review待ち、disk使用量を確認します。作業開始が速くても、reviewやcleanupが増えれば全体の生産性は上がりません。

## まとめ

GitHub Desktop 3.6は、コミット、競合解消、モデル選択、並列branch作業を一つのGUIへ近づけました。Gitに慣れていない人にも役立ちますが、AIが最終責任を持つ機能ではありません。

競合解消は人間が差分とtestを確認し、強制ルールはrulesetとCIへ置きます。BYOKは鍵とデータ送信先を管理し、worktreeは完全なsandboxではないと理解します。この前提があれば、安全に試せます。

## 出典

- [GitHub Desktop 3.6: Worktrees and deeper Copilot integration](https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/) - GitHub Changelog
- [GitHub Desktop 3.6.0 release](https://github.com/desktop/desktop/releases/tag/release-3.6.0) - GitHub
- [What are git worktrees, and why should I use them?](https://github.blog/ai-and-ml/github-copilot/what-are-git-worktrees-and-why-should-i-use-them/) - GitHub Blog
