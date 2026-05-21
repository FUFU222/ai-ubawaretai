---
article: 'github-copilot-auto-model-selection-vscode-2026'
level: 'child'
---

GitHub Copilotの **Auto model selection** は、Copilotが使うAIモデルを自動で選ぶ機能です。2026年5月20日の更新で、VS Codeでは「今の作業がどれくらい難しいか」も見てモデルを選ぶようになりました。

これは、単に新しいモデルが増えたという話ではありません。最近のCopilotには、GPT系、Claude系、Gemini系など、いろいろなモデルが入っています。強いモデルほど高いこともあります。だから、毎回人間が「今回はどのモデルにするか」を選ぶのは大変です。

## 何を自動で見ているのか

GitHubの説明では、Autoはモデルの混み具合や信頼性だけでなく、作業そのものも見ます。

たとえば、ただコードの意味を聞くだけなら軽いモデルで十分かもしれません。一方で、難しいバグ調査、複数ファイルの修正、ツールを使う作業では、より強いモデルが必要になるかもしれません。Autoは、こうした違いを見てモデルを選ぼうとします。

VS Codeでは、どのモデルが使われたかをあとから確認できます。自動で選ばれても、完全に見えなくなるわけではありません。

## なぜ会社で重要なのか

会社でCopilotを使う場合、モデル選択は「便利だから」だけでは決められません。お金、管理者の設定、使ってよいモデル、データの扱いなどが関係します。

このサイトでも、[GitHub CopilotのAI Credits予算確認](/blog/github-copilot-ai-credits-usage-report-2026/)や[Gemini 3.5 Flashの14倍課金](/blog/github-copilot-gemini-35-flash-ga-2026/)を扱いました。モデルによって消費が違うので、強いモデルを何でも使うと費用が増えやすくなります。

Autoは、有料プランでは10%の割引があると説明されています。また、今のAutoは主に0倍から1倍のモデルを使う設計です。つまり、高額なモデルを勝手にどんどん使う機能というより、ふだん使いの標準設定に近いものです。

## でも任せきりにはしない

Autoを使えば、開発者はモデル選びで迷いにくくなります。しかし、会社としてのルールは必要です。

たとえば、日常の質問や軽い修正はAutoでよいでしょう。でも、大きな設計変更、セキュリティに関わる調査、重要な障害対応では、どのモデルを使ったか、なぜそのモデルを使ったかを残したほうがよいです。

また、Autoは管理者が許可しているモデルからしか選びません。会社があるモデルを禁止していれば、Autoもそれを使いません。データレジデンシーやFedRAMPのような制約を入れている場合も、選べるモデルは変わります。

## どう使い始めるとよいか

まずは、VS CodeでAutoを標準にするチームを小さく決めるのがよいです。いきなり全社展開するより、1つか2つのチームで使い、品質と費用を見ます。

次に、社内ルールを短く作ります。たとえば、「迷ったらAuto」「高いモデルを使うときは理由を書く」「重要なPRでは使ったモデルを確認する」くらいです。

さらに、[GPT-5.5の一般提供](/blog/github-copilot-gpt-55-general-availability-2026/)のような高性能モデルと、Autoの役割を分けて考えます。Autoは日常作業の入口、高性能モデルは難しい仕事の例外レーン、と考えるとわかりやすいです。

## まとめ

今回のCopilot Auto model selection更新は、AIモデルを自動で賢く選ぶためのものです。VS Codeでは、作業の難しさも見て選ぶようになりました。

子ども向けに言えば、これは「道具箱から、その作業に合った道具を選んでくれる係」です。ただし、会社で使うときは、どの道具を使ってよいか、どれくらいお金を使ってよいかを先に決める必要があります。Autoは便利ですが、会社のルール作りも一緒に必要です。

## 出典

- [Auto model selection now routes based on your task in VS Code](https://github.blog/changelog/2026-05-20-auto-model-selection-now-routes-based-on-your-task-in-vs-code/) - GitHub Changelog, 2026-05-20
- [About Copilot auto model selection](https://docs.github.com/en/copilot/concepts/auto-model-selection) - GitHub Docs
- [Requests in GitHub Copilot](https://docs.github.com/en/copilot/concepts/billing/copilot-requests) - GitHub Docs
