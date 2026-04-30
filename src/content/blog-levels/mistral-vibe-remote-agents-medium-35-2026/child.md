---
article: 'mistral-vibe-remote-agents-medium-35-2026'
level: 'child'
---

Mistralが出した **Vibe remote agents** と **Mistral Medium 3.5** は、「AIがコードを少し手伝う」段階から一歩進んだ更新です。

いちばん分かりやすく言うと、**自分のPCで見張っていなくても、クラウド上でコーディング作業を続けて、終わったらPR候補を返してくる** 方向へ進みました。

## 何が出たの？

今回の更新は、主に3つあります。

1つ目は、**Vibe Code Workflow** です。これはGitHubリポジトリを対象にした遠隔コーディング機能で、クラウドsandboxの中でAIが作業します。Mistral Docsでは、リポジトリをcloneし、コードを読んで、ブランチを作り、変更して、draft pull requestまで出せると説明されています。

2つ目は、**Mistral Medium 3.5** です。これは今回の中心モデルで、Mistral公式では128B dense model、256k context、agentic / coding向け、open weightsと説明されています。API価格も出ていて、入力100万トークンあたり1.5ドル、出力100万トークンあたり7.5ドルです。

3つ目は、**Le ChatのWork mode** です。これはコーディング専用ではなく、Web検索やコネクタを使って、調査、要約、会議準備、返信下書きなどをまとめて進めるモードです。Mistralは「複数ツールをまたぐ仕事を1つの会話で終える」使い方を想定しています。

## 何が便利なの？

便利なのは、**待ち時間を人が抱えなくてよくなる** ことです。

今までのAIコーディングは、ローカル端末を開いたまま、結果を見守る場面が多くありました。Vibe remote agentsでは、CLIから `&` を付けてクラウドへ送ったり、途中のローカルセッションを `/teleport` で移したりできます。つまり、長めの作業をクラウドへ預けて、その間に別の仕事ができます。

また、Mistral Docsではセッションの流れも明確です。

- 新しいcloud sandboxが作られる
- GitHub repoがcloneされる
- AIがファイルを読み、コマンドを実行し、編集する
- 必要なら質問してくる
- 最後に成果物を返し、通常はdraft PRになる

この形なら、AIに全部丸投げするというより、**下書きや一次対応を任せて最後は人がレビューする** 使い方がしやすいです。

## 注意点は？

注意点もかなりはっきりしています。

まず、Vibe Code WorkflowはPreviewです。DocsではProとTeamsへ段階ロールアウト中と書かれています。Work modeもPreviewで、Free、Pro、Teamへ段階的に開放中です。つまり、まだ完成版ではありません。

次に、AIが扱える範囲には線引きがあります。Vibe Code Workflowはローカルマシンやローカルfilesystemにはアクセスできません。触れるのは、あなたが認可したGitHubリポジトリだけです。逆に言うと、GitHub権限はそれなりに重要で、`repo` や `workflow` なども要求されます。

さらに、セッション上限もあります。Docsでは最大24時間、返信待ちのtimeoutは3時間、コマンドtimeoutは30秒です。大規模で依存の重いプロジェクトだと、そのままでは相性が悪いことがあります。

## 日本のチームはどう使うべき？

ここからは考え方です。

日本の開発チームなら、最初は**既存のGitHub repo上で、範囲の狭いタスク**から試すのが自然です。たとえば、

- テスト修正
- 小さなバグ修正
- 単一モジュールのリファクタ
- ドキュメント更新

のような仕事です。

逆に、社内閉域システムや、GPU依存の開発、ローカル機材が必要な案件はすぐには向きません。まずは「PRの叩き台をどこまで安定して作れるか」を見るのが良いです。

Work modeについては、コーディングより**周辺業務**で試すほうが分かりやすいです。調査、会議準備、資料要約、連絡文案づくりのような用途です。

## まとめ

Mistralの今回の更新で大きいのは、AIがローカル補助から**クラウド常駐の非同期作業**へ進んだことです。

日本の現場では、まず小さなrepo作業をVibeで試し、調査や社内ドキュメント系はWork modeで試す、という分け方が現実的です。性能だけでなく、**GitHub権限、レビュー責任、sandbox制約**まで含めて評価すると失敗しにくいです。

## 出典

- [Remote agents in Vibe. Powered by Mistral Medium 3.5.](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5)
- [Mistral Medium 3.5](https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04)
- [Vibe Code Workflow](https://docs.mistral.ai/le-chat/content-creation/vibe-code-workflow)
- [Work mode](https://docs.mistral.ai/le-chat/conversation/work-mode)
- [Pricing](https://mistral.ai/pricing)
