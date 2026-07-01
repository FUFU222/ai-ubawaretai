---
article: 'github-copilot-jetbrains-ai-assistant-native-agent-2026'
level: 'child'
---

GitHub CopilotをJetBrainsのAI Chatから直接選べるようになりました。2026年6月30日の発表で、CopilotはJetBrains AI Assistantのagent pickerに入るネイティブ統合エージェントになっています。

以前もACPという共通規格を使えば接続できましたが、今回の統合ではCopilot用のACP設定が不要です。ただし、JetBrains AIの契約だけでCopilotを使えるわけではありません。GitHubアカウントでOAuth認証し、有効なGitHub Copilot契約が別に必要です。

## 何ができるのか

JetBrains IDEでAI Chatを開き、agent pickerからGitHub Copilotを選びます。Copilotは質問に答えるだけでなく、プロジェクトを確認し、複数の手順がある作業を考え、コード変更やコマンド実行を進められます。

対応するCopilotモデルを選び、推論の深さも調整できます。軽い質問なら速さを優先し、複雑な修正なら深く考える設定にするといった使い分けができます。

今後はNext Edit Suggestionsやskills、複数ツールをまたぐ作業も強化予定だとGitHubは説明しています。ただし、これは今後の計画です。現在使える機能と混同しないようにしましょう。

## ACP接続と何が違うのか

ACPは、異なるAI agentをIDEなどへ接続するための仕組みです。Copilotも以前はACP RegistryからAI Assistantへ追加できました。ネイティブ統合では、Copilotが最初からagent pickerの選択肢になり、個別設定の手間が減ります。

ACPがなくなるわけではありません。会社で別のACP agentを使っているなら、それらは残せます。Copilotだけをネイティブ統合へ移すと考えると分かりやすいです。

以前の[JetBrains版CopilotのClaude provider](/blog/github-copilot-jetbrains-claude-provider-2026/)では、ローカルCLIやpreview権限が重要でした。今回のCopilotネイティブ統合は導入経路がより簡単ですが、契約と認証の確認は必要です。

## 会社で使うときの注意点

1つ目は契約です。JetBrains AIを契約していても、GitHub Copilotは別契約です。会社でseatを配る担当者と、JetBrains IDEを管理する担当者が違う場合は、申請先を明確にします。

2つ目は認証です。CopilotはGitHubアカウントのOAuthでログインします。個人のGitHubアカウントを業務に使ってよいのか、会社管理アカウントを使うのかを確認してください。

3つ目はモデル設定です。モデルと推論深度を選べると、速度や利用量が変わります。全員が自由に選ぶ前に、軽い質問、通常の修正、難しい調査で推奨設定を分けると運用しやすくなります。

4つ目は実行権限です。agentは複数ファイルを編集し、コマンドを実行する場合があります。最初は検証用リポジトリで試し、変更差分と実行コマンドを人が確認しましょう。[inline agent modeと自動承認](/blog/github-copilot-jetbrains-inline-agent-mode-2026/)の記事も、権限を考える参考になります。

## 最初の試し方

まず少人数でAI AssistantとCopilotを更新し、agent pickerにCopilotが出るか確認します。GitHub OAuthでログインし、Copilot seatが正しく割り当てられているかも確認します。

次に、コード説明、テスト追加、小さな不具合修正の順で試します。いきなり大規模な変更を任せず、どのファイルを触ったか、どのコマンドを実行したか、レビューで何を直したかを記録します。

すでにACP経由でCopilotを使っている場合は、ネイティブ統合と両方を同時に標準にしない方がよいです。短い比較期間を設け、問題がなければ社内手順をネイティブ統合へ更新します。

## まとめ

GitHub CopilotはJetBrains AI Assistantのagent pickerから直接使えるようになりました。ACPの個別設定が不要になる一方、GitHub OAuthと別のCopilot契約は必要です。

会社で導入するなら、seat、利用アカウント、モデル設定、実行権限を先に決めましょう。少人数で小さなタスクから試し、既存ACP構成との比較を終えてから標準手順を切り替えるのが安全です。

## 出典

- [Copilot Agent is now available in JetBrains AI Assistant](https://github.blog/changelog/2026-06-30-copilot-agent-is-now-available-in-jetbrains-ai-assistant/) - GitHub Changelog, 2026-06-30
- [GitHub Copilot now an Integrated Agent in JetBrains IDEs](https://blog.jetbrains.com/ai/2026/06/github-copilot-now-an-integrated-agent/) - The JetBrains Blog, 2026-06
- [About AI Assistant](https://www.jetbrains.com/help/ai-assistant/about-ai-assistant.html) - JetBrains AI Assistant Documentation
