---
article: 'github-copilot-evaluation-models-auto-individual-2026'
level: 'child'
---

GitHub Copilotの個人プランで、Auto model selectionがevaluation modelsを選ぶ可能性が出てきた。対象は個人向けの非Enterpriseユーザーで、使いたくない場合はGitHub Copilot settingsから無効化できる。

要点は、「Autoを選ぶと常に安定した一般提供モデルだけが使われる」とは限らないことだ。GitHub Docsでは、evaluation modelsがコードネームで表示される場合、予告なく追加・更新・削除される場合、rate limitやavailabilityが一般提供モデルと異なる場合があると説明している。

## 何が変わったのか

2026年6月1日のGitHub Changelogは、GitHub Copilotが個人向け非Enterpriseユーザーにevaluation modelsへのアクセスを提供し、それらがAuto model selectionで配信され得ると発表した。

Auto model selectionは、タスクやシステム状態に応じてモデルを選ぶ機能だ。GitHub Docsは、Autoがタスク複雑度、モデルのhealth、availabilityを見ながら選択し、Chat、Copilot CLI、cloud agentなどで使われると説明している。paid planでは、Auto利用時にモデルコストの10% discountもある。

ただし、Autoの対象モデルは固定ではない。plan、subscription type、管理者ポリシー、data residencyやFedRAMP制約、evaluation modelsの設定によって変わる。今回の変更は、その中でも個人プランの設定確認を促すものだ。

## 個人開発者が確認すること

最初に、GitHubの個人設定でEvaluation models in Copilot auto model selectionが有効か無効かを見る。学習やOSSで新しいモデルを試したいなら有効のままでもよいが、本番コードやセキュリティ修正で使うなら慎重に扱う。

次に、Autoで使われたモデルを確認する。Copilot Chatでは応答にhoverし、CLIやcloud agentでは表示されるモデル名を見る。評価モデルらしいコードネームが出た場合は、出力をそのまま採用せず、別モデルや人間レビューで確認する。

最後に、会社のコードを個人契約のCopilotに持ち込まないルールを明確にする。会社がBusinessやEnterpriseで[Copilot model rules](/blog/github-copilot-targeted-model-rules-2026/)を設定していても、個人契約の設定までは直接管理できない。個人のAuto設定と会社の統制は別物だと考える必要がある。

## 企業側の注意点

日本企業では、個人契約のCopilotを学習や検証で使う開発者がいる。会社支給のCopilotだけを管理しても、個人契約から社内コードを扱う運用が残ると説明責任が弱くなる。

社内ルールでは、会社コードは会社契約のCopilotで扱う、個人契約はOSSや学習に限る、例外的に個人契約を使う場合はevaluation modelsをDisabledにする、といった短い基準があるとよい。[Copilot Auto選択](/blog/github-copilot-auto-model-selection-vscode-2026/)や[AI Credits課金](/blog/github-copilot-ai-credits-billing-budgets-2026/)と同じく、モデル選択は費用だけでなく品質管理の問題でもある。

## 出典

- [Evaluation models in auto for individual plans](https://github.blog/changelog/2026-06-01-evaluation-models-in-auto-for-individual-plans/) - GitHub Changelog, 2026-06-01
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models) - GitHub Docs
- [About Copilot auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection) - GitHub Docs
