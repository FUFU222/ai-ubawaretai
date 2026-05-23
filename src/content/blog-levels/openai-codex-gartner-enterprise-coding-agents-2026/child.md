---
article: 'openai-codex-gartner-enterprise-coding-agents-2026'
level: 'child'
---

OpenAI は2026年5月22日に、Codex が Gartner の Enterprise AI Coding Agents というカテゴリで Leader として評価されたと発表しました。同じ日に、Virgin Atlantic が Codex を使ってアプリ開発やレガシーコードの整理を進めた事例も公開されています。

大事なのは、「OpenAI が評価された」というニュースそのものではありません。AIにコードを書かせる道具が、企業の調達や監査の対象になるくらい大きなカテゴリになってきたことです。

## 何が発表されたの？

OpenAI の発表では、Codex は週次400万人超に使われ、Cisco、Datadog、Dell Technologies、NVIDIA などの企業で使われていると説明されています。

また、Codex の価値として、ただコードを書く力だけでなく、承認ゲート、RBAC、ポリシー、サンドボックス、監査できるワークスペース統制が挙げられています。

これは、日本企業にとってかなり重要です。会社でAIコーディングツールを使うときは、「便利かどうか」だけでは決められません。誰が使えるのか、どのコードに触れるのか、変更は記録されるのか、失敗したときに誰が責任を持つのかを決める必要があります。

この流れは、[OpenAI Codex Goalモード](/blog/openai-codex-goal-appshots-browser-2026/) や [OpenAI Codex Security](/blog/openai-codex-security-workflow-2026/) とつながっています。Codex は短いコード補完だけでなく、長い作業、画面確認、脆弱性対応まで扱う道具になりつつあります。

## Virgin Atlantic事例は何を示している？

OpenAI が同日に出した Virgin Atlantic の事例では、Codex がモバイルアプリのテスト、レガシーコードの整理、データ基盤を使った社内ツール開発に使われています。

紹介されている数字も具体的です。レガシーコードの整理でコード量が78〜80%減った例、単体テストカバレッジがほぼ100%になった新アプリ、2週間かかっていたリファクタリングが30分から1時間になった例が挙げられています。

ただし、これは「どの会社でも同じ結果が出る」という意味ではありません。見るべきなのは、Codex が得意そうな仕事の種類です。

たとえば、テストを増やす、古いコードを整理する、データを使った小さな社内アプリを作る、既存の開発フローの中でレビュー材料を作る。こうした仕事は、日本の開発チームにも多いはずです。

## なぜ調達の話になるの？

個人がAIツールを試すだけなら、使いやすさや出力の良さで選べます。しかし会社で標準ツールにするなら、話は変わります。

会社では、ソースコードは機密情報です。顧客情報や個人情報に関わるコードもあります。外部サービスに何を送るのか、ログが残るのか、退職者の権限は消えるのか、委託先にも使わせるのかを確認しなければなりません。

だから OpenAI が、承認、権限、サンドボックス、監査を前に出していることには意味があります。これは、Codex が開発者向けの便利ツールから、企業が買って管理する基盤へ近づいているというサインです。

[OpenAI Codexオンプレ連携](/blog/openai-dell-codex-hybrid-onprem-2026/) で扱ったように、日本企業ではクラウドだけでなく、オンプレミス、ハイブリッド、既存端末、SI支援との関係も問題になります。

## GitHub Copilotとの関係は？

同じ日に GitHub も、GitHub Copilot が Gartner の同カテゴリで Leader として評価されたと発表しています。

ここから分かるのは、AIコーディングエージェント市場が、OpenAI だけの話ではないということです。GitHub は、Issues、Projects、code review、security、repository workflows など、GitHub上の開発作業と強くつながっています。OpenAI は、Codex app、CLI、IDE、SDK、クラウド実行、Bedrock、Codex Labs など、より広い作業面を打ち出しています。

日本企業は、「どちらのAIが賢いか」だけで比べるべきではありません。自社が GitHub 中心なのか、複数の開発基盤を使っているのか、セキュリティ部門が何を求めるのか、委託先も使うのかで選び方が変わります。

## まず確認すべきこと

最初に、どの作業に使うのかを分けるとよいです。補完、チャット、CLI、長時間の開発作業、セキュリティスキャン、UI確認ではリスクが違います。

次に、誰が何を許可するのかを決めます。AIが勝手に本番コードを変えるのではなく、人間のレビュー、テスト、承認を通す流れが必要です。

最後に、費用対効果を単純な時間短縮だけで見ないことです。テスト不足を減らせるか、レビュー材料を作れるか、古いコードの属人化を減らせるか、監査に説明できるかまで見るべきです。

## まとめ

今回の OpenAI 発表は、Codex が企業向けAIコーディングエージェントとして本格的に調達対象になってきたことを示しています。

日本企業が注目すべきなのは、Gartner の評価そのものより、評価軸が「コードを書く力」から「統制された開発作業を任せられるか」に広がっていることです。Codex や Copilot を選ぶ前に、自社の権限、ログ、レビュー、費用、開発基盤との相性を整理する必要があります。

## 出典

- [OpenAI named a Leader in enterprise coding agents by Gartner](https://openai.com/index/gartner-2026-agentic-coding-leader/) - OpenAI, 2026-05-22
- [How Virgin Atlantic ships faster with Codex](https://openai.com/index/virgin-atlantic/) - OpenAI, 2026-05-22
- [GitHub recognized as a Leader in the Gartner Magic Quadrant for Enterprise AI Coding Agents](https://github.blog/ai-and-ml/github-copilot/github-recognized-as-a-leader-in-the-gartner-magic-quadrant-for-enterprise-ai-coding-agents-for-the-third-year-in-a-row/) - GitHub, 2026-05-22
