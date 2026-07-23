---
article: 'anthropic-managed-agents-effort-webhooks-2026'
level: 'child'
---

Anthropic は Claude Managed Agents に、エージェントの動かし方を細かく管理するための更新を追加しました。主な内容は、agent に `effort` を設定できること、environment や memory store の変化を webhook で受け取れること、session 作成時に最初の message を一緒に渡せることです。

これは、Claude をただのチャットとして使う話ではありません。会社の中で、Claude の agent に調査、開発、レビュー、レポート作成、問い合わせ対応などを任せるときの運用ルールに関係します。

## effortとは何か

`effort` は、Claude がどれくらい深く考え、どれくらい token を使って作業するかを調整する設定です。低い effort は速く安くなりやすい一方、難しい作業では品質が下がる可能性があります。高い effort は複雑な推論や agentic coding に向きますが、時間と費用が増えやすくなります。

大事なのは、Claude Managed Agents では、この effort を agent の model configuration に設定する点です。つまり、毎回の会話でなんとなく変えるのではなく、「この agent は軽い問い合わせ用」「この agent はコード修正用」「この agent は監査レビュー用」のように、agent ごとに決める使い方が向いています。

たとえば、社内 FAQ を読む agent は low や medium で十分かもしれません。GitHub を読み、shell を使い、複数ファイルを修正する agent は high 以上を使うほうがよい場合があります。

## webhookで何が見えるのか

webhook は、何か大事な状態変化が起きたときに、外部のシステムへ通知する仕組みです。Claude Managed Agents では、session の状態だけでなく、environment や memory store の lifecycle も通知対象になりました。

environment は agent が作業する場所です。memory store は agent が次回以降も読む情報を保存する場所です。この2つの状態が変わったことを知れると、会社の管理者は「どの agent が、どの作業場所で、どの記憶を使っているのか」を追いやすくなります。

ただし、webhook の通知だけで全部が分かるわけではありません。Anthropic の documentation では、webhook event は type と id を返し、詳しい内容は GET で取り直す形です。受け取った通知をそのまま信じるのではなく、最新状態を取りに行く処理が必要です。

## initial_eventsとは何か

`initial_events` は、session を作るときに最初の user message や outcome を一緒に渡せる機能です。空でない `initial_events` を渡すと、session 作成と同時に agent が動き始めます。

これは定型作業に便利です。たとえば、毎朝の障害ログ確認、Pull Request の一次レビュー、定例レポート、社内申請の下書きなどでは、session を作ってから別の API で message を送るより、最初から必要な指示を入れて起動できます。

一方で、注意も必要です。session が作られた瞬間に agent が動き始めるため、入力内容、成功条件、承認者、ログに残す情報を先に確認しておく必要があります。間違った指示を自動で大量に流すと、agent も間違った方向へ動きます。

## 日本企業が見るべき点

日本企業では、まず agent の一覧表を作ると分かりやすくなります。agent 名、用途、対象部署、effort、使える tool、memory store、webhook 送信先、管理者、変更手順を並べます。

次に、effort を費用上限と勘違いしないことが大切です。effort は「作業の深さ」を調整する設定であり、予算を止める機能ではありません。費用を管理するには、usage monitoring、rate limit、承認フロー、請求レポートも別に必要です。

最後に、webhook と `initial_events` は自動化の入口として扱います。便利だからすぐ本番に入れるのではなく、署名検証、再送処理、ログ保存、失敗時の停止方法、誰が再実行できるかを決めておく必要があります。

## 覚えておきたいこと

今回の Claude Managed Agents 更新は、モデルの賢さそのものより、会社で agent を安全に運用するための更新です。effort で作業の深さを決め、webhook で状態変化を受け取り、`initial_events` で定型作業を起動しやすくなりました。

日本企業が使うなら、「Claude を使うかどうか」だけでなく、「どの agent が、どの effort で、どの記憶と作業場所を使い、どのログで説明できるか」を決めることが重要です。

## 出典

- [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) - Anthropic Docs
- [Define your agent](https://platform.claude.com/docs/en/managed-agents/agent-setup) - Anthropic Docs
- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) - Anthropic Docs
- [Start a session](https://platform.claude.com/docs/en/managed-agents/sessions) - Anthropic Docs
