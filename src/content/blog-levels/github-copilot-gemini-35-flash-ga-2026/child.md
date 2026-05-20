---
article: 'github-copilot-gemini-35-flash-ga-2026'
level: 'child'
---

GitHubは2026年5月19日、Gemini 3.5 FlashをGitHub Copilotで一般提供すると発表した。Googleの新しいFlash-tierモデルがCopilotの選択肢に入り、Copilot Pro、Pro+、Business、Enterpriseで順次使えるようになる。

大事なのは、ただ新しいモデルが増えたという話ではない。GitHubは、このモデルが14倍のpremium request multiplierで始まると説明している。つまり、使い方を決めずに広げると、Copilotの利用コストが読みづらくなる。

## 何が使えるようになるのか

Gemini 3.5 Flashは、GitHub Copilotのモデルとして選べるようになる。対応クライアントには、Visual Studio Code、Visual Studio、JetBrains、Xcode、Eclipse、GitHub Mobile iOS / Androidが含まれる。

GitHubは、強いtool use、速い応答、cache効率があり、反復的なagentic coding workflowに向くと説明している。簡単に言えば、単発の質問よりも、AIに何度も確認しながらコード作業を進める場面を意識したモデルだ。

ただし、BusinessとEnterpriseでは管理者がポリシーを有効にする必要がある。会社で契約しているから全員がすぐ使える、というものではない。

## なぜ14倍課金が重要なのか

Copilotのpremium request multiplierは、モデルごとの消費量を考えるための数字だ。Gemini 3.5 Flashは14倍で始まる。GitHubは価格が暫定だとしているが、少なくとも最初は高倍率モデルとして扱うべきだ。

たとえば、短いコード補完や軽い質問に毎回使うと、費用に対する効果が見えにくい。逆に、難しい不具合調査、複数ファイルにまたがる修正、CI失敗の原因分析、設計変更の下調べのような作業なら、人間の時間を減らせる可能性がある。

日本企業では、Copilotの費用を部門やプロジェクトで説明する場面が多い。そのため、最初から「どの作業で使ってよいか」を決めておくことが大切になる。

## 管理者が見るポイント

まず、全員に一斉公開しないこと。Tech Lead、Platform Engineering、SRE、検証担当など、利用結果を振り返れる人から始めるほうがよい。

次に、対象クライアントを決めること。VS Codeだけで試すのか、JetBrainsやXcodeも含めるのかで、利用場面は変わる。社内標準IDEや端末管理ルールに合わせて進める必要がある。

最後に、効果測定を決めること。速かったかどうかだけでは不十分だ。レビューで戻された回数、修正の採用率、消費したpremium request、人間の調査時間がどれだけ減ったかを見るべきだ。

## 日本のチームでの使いどころ

Gemini 3.5 Flashは、毎日の軽い補完を置き換えるモデルというより、速い反復が必要な作業に向く高倍率モデルとして見るのが現実的だ。

たとえば、既存モデルでまず作業し、失敗したり時間がかかったりするタスクだけGemini 3.5 Flashへ切り替える。あるいは、agentic codingの検証チームだけに解禁し、数週間のログを見て広げるか判断する。

モデルが増えるほど、現場はどれを選ぶか迷う。管理者は、日常補完、PRレビュー、設計相談、障害調査、agent作業のように用途別の推奨モデルを用意するとよい。

## 出典

- [Gemini 3.5 Flash is generally available for GitHub Copilot](https://github.blog/changelog/2026-05-19-gemini-3-5-flash-is-generally-available-for-github-copilot/) - GitHub Changelog, 2026-05-19
- [Gemini 3.5: frontier intelligence with action](https://blog.google/intl/ja-jp/company-news/technology/gemini-3-5/) - Google Japan Blog, 2026-05-19
- [Building the agentic future: Developer highlights from I/O 2026](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/) - Google, 2026-05-19
