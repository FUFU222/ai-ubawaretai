---
article: 'github-copilot-gemini-36-flash-rollout-2026'
level: 'child'
---

GitHubは2026年7月21日、Gemini 3.6 FlashをGitHub Copilotで使えるようにすると発表した。Copilot Pro、Pro+、Max、Business、Enterpriseが対象で、VS Code、Visual Studio、Copilot CLI、Copilot cloud agent、GitHub Copilot app、JetBrains、Xcode、Eclipseで順次選べるようになる。

大事なのは、会社でCopilotを契約していれば全員がすぐ使える、という話ではないことだ。BusinessとEnterpriseでは、管理者がCopilot設定でGemini 3.6 Flash Preview policyを有効にする必要がある。

## 何が変わるのか

Gemini 3.6 Flashは、Googleの新しいFlashモデルとして、web/app開発、coding、長めのagentic task向けに説明されている。GitHubは、parallel tool useやtoken efficiencyも特徴として挙げている。

これまでにもCopilotにはGoogleのGeminiモデルが入っていた。たとえば[Gemini 3.5 FlashのCopilot GA](/blog/github-copilot-gemini-35-flash-ga-2026/)では、高性能モデルをどう予算管理するかが論点になった。また、[Gemini 2モデル終了](/blog/github-copilot-gemini-25-pro-3-flash-retirement-2026/)では、古いモデル名を社内手順や設定から外す必要があった。

今回も同じ流れにある。新しいモデルを見つけた人が自由に使うのではなく、管理者が用途と対象者を決める必要がある。

## 料金で見るポイント

GitHubは、Gemini 3.6 Flashをprovider list pricing under usage-based billingで扱うと説明している。つまり、以前のように倍率だけを見れば十分、とは言い切れない。

Google AI for Developersの資料では、Gemini API側の `gemini-3.6-flash` は100万input tokensあたり1.50ドル、100万output tokensあたり7.50ドルと示されている。ただし、これはGoogle APIを直接使う場合の情報で、Copilotの請求と同じ意味ではない。Copilot利用者はGitHub側の価格説明を見る必要がある。

日本企業では、AI利用費を部門やプロジェクトで説明することが多い。だから、Gemini 3.6 Flashを使うなら、どの作業で使うのか、誰が使えるのか、使用量をどこで見るのかを先に決めたほうがよい。

## どう使い始めるべきか

最初は全員に開放しないほうがよい。Platform Engineering、SRE、Tech Lead、AIコーディング検証担当など、結果を振り返れる人に限定して試すのが現実的だ。

使いどころは、軽い質問や短い補完ではなく、複数ファイルの調査、CI失敗の切り分け、移行作業、cloud agentに任せる長めの作業が向いている。こうした作業なら、速い反復やtool useの効果を測りやすい。

一方で、費用を見るには[Copilot AI Credits表示](/blog/github-copilot-ai-credits-cycle-visibility-2026/)のような利用者側の見える化も役に立つ。本人が使用量を確認できるようにしつつ、管理者はモデル別・部門別の消費を追う必要がある。

## まとめ

Gemini 3.6 FlashのCopilot追加は、新モデルが増えたというニュースであると同時に、管理者ポリシーと予算設計のニュースでもある。Business/Enterpriseではまず対象者を絞り、どのsurfaceで使うか、どの作業に使うか、消費量をどう見るかを決めたい。

日本の開発チームでは、日常補完の標準モデルにするより、長めのagentic codingや移行作業の検証モデルとして扱うほうが始めやすい。

## 出典

- [Gemini 3.6 Flash is now available in GitHub Copilot](https://github.blog/changelog/2026-07-21-gemini-3-6-flash-is-now-available-in-github-copilot) - GitHub Changelog, 2026-07-21
- [Using the latest Gemini models](https://ai.google.dev/gemini-api/docs/latest-model) - Google AI for Developers, accessed 2026-07-22
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) - Google AI for Developers, accessed 2026-07-22
