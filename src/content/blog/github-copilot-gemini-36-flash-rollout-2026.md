---
title: 'Gemini 3.6 FlashがCopilotへ、価格連動の移行線'
description: 'GitHub CopilotでGemini 3.6 Flashが段階展開。provider list pricing、Business/Enterpriseの管理者ポリシー、Google API側の移行条件を整理し、日本企業のモデル選定と予算統制を解説する。'
pubDate: '2026-07-22'
category: 'news'
tags: ['GitHub Copilot', 'Gemini', 'AIコーディング', '開発者ツール', 'エンタープライズAI', '管理者設定']
draft: false
series: 'github-copilot-2026'
---

GitHubは2026年7月21日、**Gemini 3.6 FlashをGitHub Copilotへ段階展開**すると発表した。対象はCopilot Pro、Pro+、Max、Business、Enterpriseで、Visual Studio Code、Visual Studio、Copilot CLI、Copilot cloud agent、GitHub Copilot app、JetBrains、Xcode、Eclipseのモデルピッカーから選べるようになる。

今回の更新は、単なるモデル追加ではない。GitHubはGemini 3.6 Flashを、web/app開発、coding、長めのagentic task向けのFlashモデルとして説明し、課金は**provider list pricing under usage-based billing**になると明記している。さらにBusiness/Enterpriseでは、管理者がCopilot設定でGemini 3.6 Flash Preview policyを有効化する必要がある。

日本の開発組織は、これを「Gemini 3.5 Flashの次が来た」とだけ読まないほうがよい。5月の[Gemini 3.5 Flash Copilot GA](/blog/github-copilot-gemini-35-flash-ga-2026/)では14倍のpremium request multiplierが論点だった。7月の[Gemini 2モデル終了](/blog/github-copilot-gemini-25-pro-3-flash-retirement-2026/)では旧モデル固定の棚卸しが論点だった。今回の3.6 Flashは、その延長で「モデル選定、予算、移行、管理者ポリシー」を同時に見直す更新である。

## 事実: Copilotでは段階展開、管理者ポリシーが必要

GitHub Changelogで確認できる事実は、まず提供面だ。Gemini 3.6 FlashはCopilot Pro、Pro+、Max、Business、Enterpriseの利用者に順次提供される。ロールアウトは段階的で、すぐに見えない利用者は後日確認する必要がある。

選択できる面は広い。VS CodeやVisual StudioのIDEだけでなく、Copilot CLI、Copilot cloud agent、GitHub Copilot app、JetBrains、Xcode、Eclipseも列挙されている。つまり、ローカルIDEでの相談、CLIでの作業、クラウド上のagent作業まで、同じモデル追加の影響を受ける可能性がある。

ただし、BusinessとEnterpriseでは管理者ポリシーが前提になる。GitHubは、組織内の利用者が選択できるようにするには、管理者がGemini 3.6 Flash Preview policyをCopilot設定で有効化する必要があると説明している。これは重要だ。全社契約があるから即座に全員へ開くのではなく、管理者が対象範囲を決められる。

ここは直近のCopilot運用とつながる。[AI Creditsの当月表示](/blog/github-copilot-ai-credits-cycle-visibility-2026/)のように、GitHubは利用者本人にも消費状況を見せる方向へ進んでいる。一方で、モデル解禁そのものは管理者側の責任として残る。利用者の見える化と、管理者の解禁判断を分けて考える必要がある。

## 事実: Google API側では3.6 Flashが最新Flash枠

Google AI for Developersの「Using the latest Gemini models」では、Gemini 3.6 FlashのモデルIDが `gemini-3.6-flash` とされ、default thinking levelは `medium`、価格は100万input tokensあたり1.50ドル、100万output tokensあたり7.50ドルと示されている。説明では、agentic and multimodal tasksに向けて速度と知能のバランスを取るモデルと位置付けられている。

同ページでは、Gemini 3.5 Flash-Liteも同時に新モデルとして示されている。こちらは `gemini-3.5-flash-lite`、default thinking levelは `minimal`、100万input tokensあたり0.30ドル、100万output tokensあたり2.50ドルで、高スループット向けの低コスト枠と読める。

Gemini APIのモデル一覧でも、Gemini 3.6 FlashはGemini 3のStable枠に置かれている。Googleの説明では、agentic and multimodal tasksで速度と知能を両立する最新モデルである。一方、モデルページの記載はGoogle APIの利用条件であり、Copilot内の価格や提供面をそのまま意味するわけではない。GitHub上ではGitHubのusage-based billingとモデルポリシーを確認する必要がある。

つまり今回の事実関係は二層で見るべきだ。Google APIを直接使う開発者は、`gemini-3.6-flash`への移行、thinking level、価格、対応ツールを見る。GitHub Copilot利用者は、Copilotのモデルピッカー、対象プラン、管理者ポリシー、GitHub側の課金説明を見る。両方を混ぜると、社内説明が曖昧になる。

## 分析: provider list pricing化で見るべき数字が変わる

ここからは分析である。

Gemini 3.5 FlashのCopilot GA時は、premium request multiplierの倍率が見えやすい論点だった。今回のGitHub Changelogは、Gemini 3.6 Flashについてprovider list pricing under usage-based billingと書いている。これは、管理者が単純な倍率表だけを見るのではなく、プロバイダー側の価格、Copilotの請求面、利用者の作業面を合わせて判断する必要があるということだ。

日本企業では、Copilotの費用を席数だけで説明する段階は終わりつつある。モデル、surface、agent作業、code review、cloud agent、AI Credits、cost centerが絡む。さらにモデルがGoogle API側の価格表と接続して見えるなら、情シス、開発基盤、FinOps、購買が同じ前提で話せるように整理しておきたい。

ただし、ここで避けるべきなのは、価格だけでモデルを決めることだ。Gemini 3.6 Flashは、GitHubの説明では長めのagentic task、parallel tool use、token efficiencyが焦点である。短い質問や軽い補完に常用するより、複数ファイル調査、移行作業、CI失敗の切り分け、クラウドagentでの長めの実装に限定して検証したほうが、費用対効果を見やすい。

逆に、低コスト・高スループットが必要なら、Google API側では3.5 Flash-Liteという別の選択肢がある。Copilot内で同じように使えるかは別問題だが、API直接利用のプロダクトチームは「Copilotのモデル追加」と「自社アプリのGemini API移行」を分けて評価する必要がある。

## 実務: 管理者が先に決める5項目

第一に、対象ユーザーを絞る。全社一斉解禁ではなく、Platform Engineering、SRE、主要プロダクトのTech Lead、AIコーディング検証担当から始める。理由は単純で、利用ログと成果を読み解ける人に先に渡したほうが、次の判断ができるからだ。

第二に、対象surfaceを決める。VS Codeでの対話だけを見るのか、Copilot CLIやcloud agentまで含めるのかで、リスクと費用の出方は変わる。cloud agentまで含めるなら、[Copilot code review Firewall](/blog/github-copilot-code-review-firewall-setup-2026/)で整理したrunner、ネットワーク、指示ファイルの統制とも接続して見るべきだ。

第三に、用途を制限する。日常補完、軽い質問、文章整形は標準モデルへ残す。Gemini 3.6 Flashは、長めの調査、複数ファイル変更、agentic workflow、parallel tool useが効く作業に寄せる。モデルの強みと作業種別を合わせないと、性能評価も費用評価もぼやける。

第四に、評価指標を決める。見るべきなのは、応答速度だけではない。タスク完了率、レビューで戻った重大指摘、テスト成功率、作業完了までの往復回数、利用者あたりの消費、モデル別の採用率を並べたい。特に日本語仕様書や日本語コメントを含むリポジトリでは、日本語文脈での説明品質も確認する。

第五に、社内FAQを更新する。利用者に必要なのは、長いモデル比較表ではない。「どの作業で使うか」「どの作業では使わないか」「見えない場合に誰へ聞くか」「消費量をどこで見るか」である。モデルが増えるほど、現場任せの選択はコストと品質のばらつきになる。

## まとめ

Gemini 3.6 FlashのCopilot展開は、Googleの最新FlashモデルがGitHubの開発ワークフローへ入る実務的な更新だ。対応surfaceは広く、Business/Enterpriseでは管理者ポリシーが必要で、課金はprovider list pricing under usage-based billingとして扱われる。

日本の開発組織は、まず限定解禁、対象surfaceの整理、用途別の推奨、消費量の見える化、API直接利用との切り分けを進めたい。Gemini 3.6 Flashは、日常補完の置き換えではなく、長めのagentic codingとモデル移行の評価対象として扱うのが現実的だ。

## 出典

- [Gemini 3.6 Flash is now available in GitHub Copilot](https://github.blog/changelog/2026-07-21-gemini-3-6-flash-is-now-available-in-github-copilot) - GitHub Changelog, 2026-07-21
- [Using the latest Gemini models](https://ai.google.dev/gemini-api/docs/latest-model) - Google AI for Developers, accessed 2026-07-22
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) - Google AI for Developers, accessed 2026-07-22
- [Models | Gemini API](https://ai.google.dev/gemini-api/docs/models) - Google AI for Developers, accessed 2026-07-22
