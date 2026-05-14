---
article: 'github-copilot-max-flex-individual-plans-2026'
level: 'child'
---

GitHub Copilot の個人向けプランに、2026年6月1日から **Copilot Max** と **flex allotment** が加わります。むずかしく聞こえますが、ざっくり言うと「毎月どれくらいAIを使えるか」を、今までより細かく決める仕組みです。

これまでは、Copilot を月額で契約すると、補完やチャットをかなり気軽に使える印象がありました。でも最近の Copilot は、ただ1行のコードを提案するだけではありません。長い作業をAIエージェントに任せたり、CLIで複数ステップの調査をさせたり、cloud agent にPRの下書きを作らせたりできます。そうなると、GitHub 側の計算コストも大きくなります。

## 何が変わるのか

GitHub は、個人向けの有料プランに **base credits** と **flex allotment** を入れると説明しています。

base credits は、月額料金に対応する基本の利用枠です。Copilot Pro なら10ドル分、Pro+ なら39ドル分、Max なら100ドル分です。これは固定の枠です。

flex allotment は、その上に追加される利用枠です。Pro なら5ドル分、Pro+ なら31ドル分、Max なら100ドル分が、2026年6月1日時点の数字として示されています。ただし、この flex はずっと同じとは限りません。モデルの価格や効率が変われば、GitHub が将来調整する可能性があります。

AI Credits の数字で見ると、Pro は月1,500 credits、Pro+ は月7,000 credits、Max は月20,000 credits です。1 AI Credit は0.01ドルとして扱われます。

## 何がAI Creditsを使うのか

ここで大事なのは、すべての Copilot 利用が AI Credits を使うわけではないことです。GitHub Docs では、paid plan の code completions と next edit suggestions は AI Credits を消費しないと説明されています。

AI Credits を使うのは、Copilot Chat、Copilot CLI、Copilot cloud agent、Spaces、Spark、third-party coding agents などです。つまり、普通の補完よりも、チャットやエージェント的な作業のほうが予算管理の対象になります。

たとえば、短い質問を軽いモデルに投げるなら、消費は小さくなりやすいです。一方で、大きなコードベースをまたいで、エージェントに何度も調査、修正、再確認をさせると、消費は増えます。

## Maxは誰向けか

Copilot Max は、毎日かなり重く Copilot を使う人向けだと考えるとわかりやすいです。たとえば、個人開発で大きなアプリを作っている人、フリーランスで複数案件を持っている人、CLI や cloud agent を長時間使う人には候補になります。

ただし、Max にすれば何でも無限に使えるわけではありません。月20,000 credits という大きな枠はありますが、高性能モデルや長いエージェント作業をたくさん回せば消費します。Max は「何も考えなくていいプラン」ではなく、「重い作業を多めに回すための大きな枠」です。

## 日本の開発者が見るべきこと

日本の開発者や小さなチームは、まず自分の使い方を分けて考えるとよいです。

補完中心なら、Pro や Pro+ で十分かもしれません。チャットや軽い相談が中心なら、AI Credits の消費も急には増えにくいでしょう。

でも、Copilot CLI、cloud agent、複数ファイルの自動修正、高性能モデルをよく使うなら、Pro+ や Max の比較が必要になります。会社の仕事で個人プランを使っている場合は、追加利用の上限も先に決めたほうが安全です。

## まとめ

今回の変更は、「Copilot が高くなった」という単純な話ではありません。GitHub Copilot が、補完ツールから、AIエージェントや高性能モデルを動かす開発基盤に変わってきたため、使った分を credits で見る仕組みへ移っているという話です。

6月1日以降は、どのプランにするかだけでなく、どの作業に Copilot を使うか、どのモデルを使うか、使い切った後に追加で払うかを考える必要があります。個人でも小さなチームでも、まずは1か月の使い方を見ながら、Pro、Pro+、Max のどれが合うかを判断するのが現実的です。

## 出典

- [GitHub Copilot individual plans: Introducing flex allotments in Pro and Pro+, and a new Max plan](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/) - GitHub Blog, 2026-05-12
- [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals) - GitHub Docs
- [Changes to GitHub Copilot Individual plans](https://github.blog/news-insights/company-news/changes-to-github-copilot-individual-plans/) - GitHub Blog
