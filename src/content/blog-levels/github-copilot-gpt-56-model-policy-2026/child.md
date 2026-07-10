---
article: 'github-copilot-gpt-56-model-policy-2026'
level: 'child'
---

GitHub は 2026年7月9日、OpenAI の **GPT-5.6 Sol、Terra、Luna** を GitHub Copilot で使えるようにしていくと発表しました。

大事なのは「新しいAIモデルが増えた」だけではありません。会社で GitHub Copilot を使っている場合、誰が使えるのか、どの画面で使えるのか、管理者がオンにする必要があるのか、費用はどう増えるのかを確認する必要があります。

## 何が増えたのか

GPT-5.6 には Sol、Terra、Luna という3つのモデルがあります。

Sol は一番重い仕事向けです。大きなコードベースを調べたり、長い時間かかる修正を agent に任せたりする場面が想定されています。

Terra は日常の開発向けです。普通のコード相談、修正案、説明、レビュー補助などに使いやすい位置づけです。

Luna は軽くて速い仕事向けです。短い説明、簡単な分類、低リスクな下書きのような作業から試しやすいモデルです。

GitHub は、これらを VS Code、Visual Studio、Copilot CLI、cloud agent、Copilot app、github.com、GitHub Mobile、JetBrains、Xcode、Eclipse などに順次広げると説明しています。ただし、すぐ全員の画面に出るとは限りません。

## 会社では管理者の設定が必要

Copilot Business や Copilot Enterprise では、管理者が GPT-5.6 モデルのポリシーを有効にする必要があります。GitHub の発表では、このポリシーは最初からオンではなく、オフが既定です。

これは少し面倒に見えますが、会社にとっては大切です。強いモデルを全員に急に開放すると、費用が増えたり、どの作業で使ってよいか分からなくなったりします。まず一部のチームで試し、結果を見て広げるほうが安全です。

同じ Copilot でも、個人プランでは見えるのに会社アカウントでは見えないことがあります。VS Code では選べるのに、別のIDEではまだ選べないこともあります。これは故障とは限らず、契約、管理者設定、段階的な提供の違いかもしれません。

## 費用も確認する

GitHub は、GPT-5.6 モデルが usage-based billing のもとで provider list pricing に基づいて課金されると説明しています。つまり、席数だけを見ていればよい時代ではありません。

会社では、どのチームが、どのモデルを、どんな作業に使ったかを確認する必要があります。軽い作業まで強いモデルに流すと、費用に見合う効果を説明しにくくなります。

たとえば、短い説明や簡単な下書きは Luna、日常の修正相談は Terra、大きな調査や複雑な agent 作業は Sol、という仮ルールを作ると始めやすくなります。実際に使ってみて、品質や費用が合わなければルールを変えます。

## 日本企業で気をつけること

日本企業では、部署ごとに標準IDEが違ったり、外部委託先も Copilot を使ったり、部門別に費用を説明する必要があったりします。そのため、モデルを増やすだけでは運用が追いつきません。

まず、管理者は「どのモデルを、誰に、どの作業で使わせるか」を決めるべきです。次に、社内FAQで「モデルが見えないときは、管理者設定、契約プラン、利用している画面、段階提供を確認する」と案内します。

強いモデルを使う場合でも、レビューや承認はなくしません。AI がコードを直しても、人間が差分を確認し、テストを見て、必要なレビューを通す流れは残します。

## まとめ

Copilot への GPT-5.6 追加は、便利なモデルが増えたという話であると同時に、会社の管理ルールを更新する話です。

日本の開発チームは、いきなり全員に解禁するより、小さく試し、作業ごとの使い分け、費用、レビュー責任を確認してから広げるのが現実的です。

## 出典

- [OpenAI's GPT-5.6 Sol, Terra, and Luna are now available in GitHub Copilot](https://github.blog/changelog/2026-07-09-openais-gpt-5-6-sol-terra-and-luna-are-now-available-in-github-copilot/) - GitHub Changelog
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) - GitHub Docs
