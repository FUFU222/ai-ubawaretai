---
title: 'Copilot GPT-5.6解禁、管理者ポリシー導入実務'
description: 'Copilot GPT-5.6のSol、Terra、Luna提供を整理。日本企業が管理者ポリシー、対象SKU、IDE横断展開、AI Credits予算をどう確認し、段階導入すべきか解説する。'
pubDate: '2026-07-11'
category: 'news'
tags: ['GitHub Copilot', 'AI モデル', 'OpenAI', 'SaaSコスト管理', '管理者設定', '開発者ツール']
series: 'github-copilot-2026'
draft: false
---

GitHub は **2026年7月9日**、OpenAI の **GPT-5.6 Sol、Terra、Luna** を GitHub Copilot に順次展開すると発表した。OpenAI 側の一般提供はすでに [GPT-5.6一般提供、WorkとAPI移行の実務チェック](/blog/openai-gpt-56-ga-work-codex-api-2026/) で整理したが、Copilot 管理者にとっては別の論点がある。

今回の焦点は、モデル性能そのものよりも、Copilot のどの利用面で、どの契約プランに、どの管理者ポリシーで、どの費用体系として出てくるかである。特に Business と Enterprise では、GPT-5.6 モデルのポリシーは既定でオフとされ、管理者が明示的に有効化する必要がある。

日本企業では、Copilot が補完ツールから、IDE、CLI、GitHub.com、mobile、cloud agent、デスクトップアプリをまたぐ開発 AI 基盤に変わりつつある。だからこそ GPT-5.6 の追加は「新しいモデル名が増えた」ではなく、モデル解禁、費用配賦、標準IDE、レビュー責任を同時に見直す更新として扱うべきだ。

## 事実: GPT-5.6がCopilotのモデル棚に入った

GitHub Changelog によると、GPT-5.6 は Sol、Terra、Luna の3種類で Copilot に入る。Sol は大規模コードベースの複雑な推論や長時間の agentic work 向け、Terra は日常的な対話・agentic coding 向けのバランス型、Luna は小さく速い作業向けの低コスト型という位置づけだ。

対象プランはモデルごとに違う。Sol は Copilot Pro+、Max、Business、Enterprise に提供される。一方、Terra と Luna は Pro、Pro+、Max、Business、Enterprise に提供される。つまり、個人プランでも組織プランでも見える可能性はあるが、Sol はより上位の契約に寄る。

利用面も広い。GitHub は、Visual Studio Code、Visual Studio、Copilot CLI、GitHub Copilot cloud agent、GitHub Copilot app、github.com、GitHub Mobile、JetBrains、Xcode、Eclipse を挙げている。ただしロールアウトは段階的だ。社内で「発表されたのに見えない」という問い合わせが出る前提で案内したほうがよい。

もう一つの事実は課金だ。GitHub は、これらのモデルが Usage Based Billing のもとで provider list pricing に基づいて課金されると説明している。ここは [Gemini 3.5 FlashがCopilotにGA、14倍課金の論点](/blog/github-copilot-gemini-35-flash-ga-2026/) や [Copilot MAI-Code-1-Flash、IDE横断運用の実務](/blog/github-copilot-mai-code-flash-surfaces-2026/) と同じく、モデル追加を予算設計の話として読む必要がある。

## 事実: BusinessとEnterpriseでは既定オフ

今回の更新で最も実務に効くのは、Business と Enterprise の管理者が GPT-5.6 モデルポリシーを有効化しなければならない点だ。GitHub の発表では、このポリシーはオフが既定とされている。

これは良い設計でもある。高性能モデルが出るたびに全社員へ自動解禁されると、費用、品質、監査、利用教育が追いつかない。管理者が明示的にオンにする仕組みなら、検証チーム、対象リポジトリ、対象IDE、利用ルールを先に決められる。

ただし、既定オフは現場の混乱にもつながる。個人の Pro+ や Max では見えるが、会社アカウントでは見えない。VS Code では見えるが JetBrains ではまだ見えない。cloud agent では選べるが mobile ではロールアウト待ち。このような差分が起きると、利用者は契約不備、障害、管理者制限、段階展開を切り分けられない。

以前の [GitHub Copilot Webモデル削減で管理者が見る点](/blog/github-copilot-web-models-limited-2026/) でも書いた通り、Copilot のモデル可用性は、モデル名だけでなくプラン、クライアント、管理者ポリシー、ロールアウト状態に左右される。今回の GPT-5.6 追加でも、同じ前提で社内FAQを作るべきだ。

## 分析: OpenAI記事とは別にCopilot運用として読む

ここからは分析である。

OpenAI の GPT-5.6 一般提供は、ChatGPT Work、Codex、API、Programmatic Tool Calling、Multi-agent、価格、System Card を横断する大きな更新だった。Copilot 側の記事で同じ説明を繰り返しても価値は薄い。GitHub Copilot 管理者が見るべきなのは、OpenAI のモデル群が Copilot の実行面へ入ったとき、どの統制が必要になるかである。

第一に、モデル選択のガイドを更新する必要がある。Sol、Terra、Luna は、単に強い順に並ぶ名前ではない。Sol は重い設計変更、複数ファイルの原因調査、長時間 agent 作業に寄せる。Terra は日常の実装相談、通常の修正案、PR周辺の説明に置く。Luna は短い説明、軽い分類、素早い下書き、低リスクな定型作業から試す。こうしたタスク分類がないと、現場は新しいモデルを好奇心で選び、費用と品質の説明が難しくなる。

第二に、Auto model selection との関係を決める必要がある。GitHub Docs では、Copilot のモデルは速度、費用、精度、推論、マルチモーダルなど得意分野が違い、利用できるモデルはプランや利用場所に依存すると説明されている。Auto を標準にする組織なら、GPT-5.6 を明示選択させる場面と、Auto に任せる場面を分けるべきだ。

第三に、AI Credits や usage-based billing の監視に入れる必要がある。[GitHub Copilot AI Credits課金開始、予算管理の実務](/blog/github-copilot-ai-credits-billing-budgets-2026/) で整理した通り、Copilot は席数だけでは費用を説明できない段階に入っている。GPT-5.6 のような新モデルを使えるようにするなら、どのチームが、どの利用面で、どのモデルを選んだかを月次で見られる状態にしたい。

第四に、モデルの強さと実行権限を分ける必要がある。Sol が強いからといって、cloud agent に本番変更、秘密情報、外部通信、破壊的コマンドまで広く許す理由にはならない。むしろ強いモデルほど、広い文脈を読んで長い作業を進められるため、リポジトリ権限、branch protection、CODEOWNERS、required checks、agent 設定の監査が重要になる。

## 日本企業が最初に決める5項目

最初に決めるべきことは、全社解禁かどうかではない。まず検証対象を決める。プラットフォームチーム、SRE、基幹リポジトリの tech lead、AIコーディング検証担当など、結果を社内に戻せる小さな集団から始めるほうがよい。

次に、対象クライアントを決める。VS Code、JetBrains、Visual Studio、Copilot CLI、GitHub.com、GitHub Mobile、cloud agent、Copilot app では使い方もリスクも違う。日本企業では標準IDEが部門で分かれることもあるため、まず標準IDEと CLI、cloud agent の3面に絞って確認すると進めやすい。

三つ目は、タスク分類だ。Luna は短い説明や低リスクな下書き、Terra は日常の修正やレビュー補助、Sol は複雑な調査や長時間の agent work という仮説を置く。使ってみて品質や費用が合わなければ変える。最初から完璧な分類を求めるより、実績を残して更新できる運用にする。

四つ目は、費用とログの見方だ。provider list pricing のもとでは、モデルごとの単価や消費が変わる。部門別の予算、cost center、個人上限、AI Credits の月次推移を見ないまま高性能モデルを解禁すると、後から説明が難しい。

五つ目は、社内告知だ。告知には、GPT-5.6 が段階ロールアウトであること、Business/Enterprise では管理者ポリシーが必要なこと、見えるモデルはクライアントや契約で違うこと、高リスク作業では人間レビューと既存の開発統制を維持することを入れる。長い説明より、問い合わせを減らす短いFAQのほうが効く。

## まとめ

GitHub Copilot への GPT-5.6 Sol、Terra、Luna 追加は、OpenAI のモデル一般提供ニュースの後追いではない。Copilot を企業の開発基盤として運用するなら、モデル追加は管理者ポリシー、利用面、費用、レビュー責任の更新になる。

日本企業は、まず全員に強いモデルを配る発想を避けるべきだ。GPT-5.6 を使う価値がある作業を定義し、Business/Enterprise のポリシーを段階的に有効化し、AI Credits と利用ログで効果を確認する。Copilot のモデル棚は今後も増減する。だからこそ、モデル名に振り回されない運用ルールを先に作ることが重要になる。

## 出典

- [OpenAI's GPT-5.6 Sol, Terra, and Luna are now available in GitHub Copilot](https://github.blog/changelog/2026-07-09-openais-gpt-5-6-sol-terra-and-luna-are-now-available-in-github-copilot/) - GitHub Changelog, 2026年7月9日
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) - GitHub Docs
- [GPT-5.6: Frontier intelligence that scales with your ambition](https://openai.com/index/gpt-5-6/) - OpenAI, 2026年7月9日
