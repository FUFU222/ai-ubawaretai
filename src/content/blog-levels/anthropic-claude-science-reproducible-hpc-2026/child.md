---
article: 'anthropic-claude-science-reproducible-hpc-2026'
level: 'child'
---

Anthropicは2026年6月30日、科学研究向けのアプリ「Claude Science」をベータ公開しました。論文や科学データベースを調べる、PythonやRでデータを分析する、図を作る、文章を書く、HPCという大きな計算機へ仕事を送る、といった作業を1つの場所で進める製品です。

使えるのはmacOSとLinuxです。Claude Pro、Max、Team、Enterpriseの利用者が対象で、TeamとEnterpriseでは管理者が機能を有効にする必要があります。

## 何が新しいの？

研究では、論文検索、データ整理、計算、図の作成、原稿執筆に別々の道具を使います。Claude Scienceは、それらを1つの会話と作業環境につなげようとしています。

ゲノミクス、タンパク質、化学構造などに対応する60を超える科学データベースや道具が用意されています。たとえば、論文を調べたあとにデータを分析し、図を作り、その図の説明を書くところまで同じsessionで進められます。

図の軸を変えたい場合も、画像だけを描き直すのではありません。自然言語で変更を頼むと、Claude Scienceは図を作ったcodeを直します。どの処理で図ができたかを後から確認しやすくするためです。

## 「再現できる」とはどういうこと？

Claude Scienceは、図やtable、notebookに、使ったcode、実行環境、会話の履歴を付けます。別の人が「この数字はどこから来たのか」「なぜこの図になったのか」を調べやすくなります。

さらにreviewer agentが、間違った引用、元をたどれない数字、codeと一致しない図を探します。問題を見つけると、修正も試みます。

ただし、これだけで研究結果が正しいと証明されるわけではありません。AIのreviewerも間違える可能性があります。研究者による確認、同じ解析の再実行、必要なら別の実験や査読が残ります。

本当に再現するには、codeだけでなく、データベースのversion、packageのversion、乱数seed、計算機の設定も必要です。Claude Scienceの履歴は便利ですが、研究室で決めている記録方法と組み合わせることが重要です。

## HPCやGPUはどう使うの？

Claude Scienceは、手元のcomputerだけでなく、SSHで接続するLinux machineやHPCのlogin nodeでも使えます。大きな計算が必要なときは計画を作り、許可を得てからbatch scriptを書き、jobを送ります。Modalを使ったオンデマンドGPUにも接続できます。

ここでは権限管理が重要です。AIが自由に高価なGPUを使ったり、共有データを書き換えたりすると、費用や事故につながります。最初は専用account、少ないquota、read-onlyのデータ、人間の承認を用意します。

また「研究データが必ず外へ出ない」とは考えないでください。大きなデータを研究室のcomputerに置いたまま使える設計でも、作業に必要な文脈はClaudeへ送られます。何が送信され、どこに保存されるかを管理者が確認します。

## 日本の研究室はどう試す？

最初は公開論文や公開データベースだけを使います。すでに答えが分かっているテーマを選び、引用が正しいか、重要な論文を見落としていないかを人間と比べます。

次に、以前作った図をもう一度作らせます。元データ、code、設定、図がつながっているか、別の人が同じ手順を実行できるかを確認します。

そのあとで、制限したHPC環境を試します。jobを送る前に人間がscriptを確認し、使えるCPU、GPU、時間、保存場所に上限を付けます。失敗したjobを停止できるか、ログが残るかも見ます。

新しい研究に使うのは、ここまでの確認が終わってからです。AIは調査や計算を助けますが、仮説を採用する判断、実験の安全、研究倫理、知的財産の責任は人間に残ります。

## まとめ

Claude Scienceは、論文検索、科学データベース、分析code、図表、原稿、HPCを1つにつなぐ研究向けアプリです。作業履歴を成果物に付けるため、AIが作った結果を後から調べやすくなります。

大切なのは、履歴があることと、研究結果が正しいことを分けることです。公開データから小さく試し、再現性、引用、権限、費用を測り、人間の確認を残せば、研究AIを安全に評価できます。

## 出典

- [Claude Science, an AI workbench for scientists, is now available](https://www.anthropic.com/news/claude-science-ai-workbench) - Anthropic, 2026-06-30
- [Claude Science beta](https://claude.com/product/claude-science) - Anthropic
- [NVIDIA Announces BioNeMo Agent Toolkit](https://nvidianews.nvidia.com/news/nvidia-launches-bionemo-agent-toolkit-giving-ai-agents-the-tools-to-accelerate-scientific-discovery) - NVIDIA, 2026-06-23
