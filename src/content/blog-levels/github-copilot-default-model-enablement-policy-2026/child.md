---
article: 'github-copilot-default-model-enablement-policy-2026'
level: 'child'
---

GitHub Copilotでは、使えるAIモデルがどんどん増えている。OpenAI、Anthropic、Google、xAIなどのモデルが、VS Code、Copilot Chat、CLI、Copilot app、cloud agentなどで使われるようになった。便利だが、会社の管理者から見ると「どのモデルを誰に使わせるか」を毎回決める必要がある。

今回のGitHubの更新は、その管理方法を少し変えるものだ。2026年8月26日から、Copilot BusinessとCopilot Enterpriseで、まだ管理者が何も設定していない一般提供モデルは、GitHubのdefault policyに従うようになる。

## 何が変わるのか

これまでは、管理者が新しいモデルを個別に有効化していた会社も多い。今回の変更後は、まだ明示的に設定していないモデルが、default policyに従って利用可能になる場合がある。

ただし、すでに管理者が有効または無効にしたモデルは、そのまま残る。会社が「このモデルは使わせない」と決めているなら、その判断が急に消えるわけではない。

また、すべてのモデルが自動で対象になるわけでもない。一般提供前のモデル、open-weightモデル、データ保持条件が通常のCopilotと違うモデルなどは、別に確認が必要になる。

## なぜ会社で確認が必要なのか

AIモデルは、性能だけで選ぶものではない。会社では、費用、データ保持、地域制限、利用できる開発ツール、社内ルールとの相性を見なければならない。

たとえば、強いモデルほどAI Creditsを多く使う場合がある。便利だからといって全員が重いモデルを使うと、請求が読みにくくなる。これは[Copilot AI Credits課金開始](/blog/github-copilot-ai-credits-billing-budgets-2026/)で整理した費用管理とつながる。

また、モデルごとに使える場所が違うこともある。VS Codeでは選べるが、別のIDEではまだ出てこない、ということもあり得る。利用者から見ると不具合に見えるが、実際には管理者設定や提供状況の違いかもしれない。

## 日本企業でやること

まず、GitHubのAI Controlsを確認する。未設定のモデルが残っているなら、8月26日以降にdefault policyへ任せるのか、明示的に止めるのかを決める。

次に、部門ごとに分ける。研究開発チームは新しいモデルを試したいかもしれない。一方、顧客データや規制業務を扱うチームでは、保守的にしたほうがよい場合がある。このときは[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)のような組織別の設定が役に立つ。

さらに、利用者向けの説明を用意する。「モデルが増えた」「前と違うモデルが選ばれた」「表示されない」といった問い合わせに、管理者設定、client対応、rollout、費用のどれが原因かを答えられるようにする。

## 覚えておくポイント

default model enablementは、Auto model selectionと同じではない。default policyは、会社として使えるモデルの候補を決める仕組みだ。Auto model selectionは、その候補の中から作業に合うモデルを選ぶ仕組みである。

つまり、管理者は「候補に入れてよいモデル」を決める。利用者やAuto機能は、その候補から実際に使うモデルを選ぶ。この順番を分けて理解すると、設定の意味が分かりやすい。

今回の更新は、Copilotを本格的に使う会社ほど重要になる。8月26日までに未設定モデルを見直し、使わせたいモデル、止めたいモデル、部門ごとの例外を整理しておくとよい。

## 出典

- [Default model enablement for Copilot Business and Enterprise](https://github.blog/changelog/2026-07-29-default-model-enablement-for-copilot-business-and-enterprise/) - GitHub Changelog, 2026-07-29
- [About default availability of Copilot models](https://docs.github.com/en/copilot/concepts/models/default-availability) - GitHub Docs
- [Supported AI models in GitHub Copilot](https://docs.github.com/copilot/reference/ai-models/supported-models) - GitHub Docs
