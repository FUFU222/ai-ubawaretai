---
article: 'github-copilot-jetbrains-claude-provider-2026'
level: 'child'
---

GitHub Copilot の JetBrains IDEs 版で、Claude を agent provider として選べる public preview が始まりました。GitHub は 2026年6月22日の changelog で、Claude agent provider、組織や Enterprise で配布された agents、Copilot CLI の新しい操作、Cloud agent の一般提供をまとめて発表しています。

これは「JetBrains で Claude が使える」というだけの話ではありません。開発者が IDE の中で、GitHub の agent、組織が用意した agent、Claude agent を選べる方向に進んでいるという話です。

## 何が変わったのか

Claude agent provider を使うには、Claude Code CLI をローカルに入れ、JetBrains の GitHub Copilot 設定で CLI のパスを指定します。その後、Copilot Chat の agent picker から Claude を選びます。

注意点もあります。GitHub は、Claude agent が現時点では bypass permissions mode で動くと説明しています。つまり、ファイル編集や tool call が自動承認されます。細かい permission 設定は今後提供予定です。

また、Copilot Business や Enterprise の場合は、管理者が Editor preview features policy を有効にする必要があります。会社の環境では、開発者が勝手に preview を使えるとは限りません。

## 組織でagentを配る話でもある

今回の更新では、組織や Enterprise レベルで定義された agents を JetBrains IDE から使えることも示されています。管理者が curated な agent を用意し、チーム全体に配る形です。

これは、以前の [JetBrains inline agent mode](/blog/github-copilot-jetbrains-inline-agent-mode-2026/) の続きとして見ると分かりやすいです。4月の更新では、JetBrains 上で agent 的に作業できる入口が広がりました。今回は、その agent を誰が用意し、どれを選ばせるかが論点になっています。

[Copilot Agent Finder](/blog/github-copilot-agent-finder-ard-2026/) のように agent を見つける仕組みや、[AGENTS.md を読む code review](/blog/github-copilot-code-review-agents-md-2026/) のように指示を標準化する動きともつながります。

## 日本のチームが見るべき点

日本の Java / Kotlin 開発では JetBrains IDE を標準にしているチームが多くあります。そうした組織では、Claude agent を全員に開く前に、どのリポジトリで試すか、誰が許可するか、どの作業だけに使うかを決めるべきです。

特に bypass permissions mode は慎重に見る必要があります。検証用リポジトリや低機密コードなら試しやすいですが、認証、決済、顧客データ、基幹系のコードでいきなり使うのは危険です。

また、agent が増えると、開発者はどれを選ぶべきか迷います。[MAI-Code-1-Flash の Copilot surface 拡大](/blog/github-copilot-mai-code-flash-surfaces-2026/) と同じように、モデルや agent が増えるほど、チーム側の標準ルールが必要になります。

## まとめ

今回の GitHub Copilot JetBrains 更新は、Claude を IDE 内の agent provider として試せるようにし、組織単位の agent 配布と Cloud agent 一般提供も前に進めたものです。

日本企業では、便利さだけで判断しない方がよいです。まず preview を使うチームを絞り、Claude Code CLI の導入経路を管理し、bypass permissions mode で触ってよいリポジトリを限定する。そこから効果とリスクを見るのが現実的です。

## 出典

- [New features and Claude as agent provider preview in JetBrains IDEs](https://github.blog/changelog/2026-06-22-new-features-and-claude-as-agent-provider-preview-in-jetbrains-ides/) - GitHub Changelog, 2026-06-22
- [Creating custom agents for Copilot cloud agent in your IDE](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-custom-agents-in-your-ide) - GitHub Docs
- [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents) - GitHub Docs
