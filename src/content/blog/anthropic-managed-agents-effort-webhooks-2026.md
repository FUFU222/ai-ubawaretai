---
title: 'Claude Managed Agents、effortとWebhook運用'
description: 'Claude Managed Agentsのeffort、webhook、initial_events更新を整理。日本企業が長時間エージェントの費用、監査、起動設計をどう見直すべきか解説する。'
pubDate: '2026-07-23'
category: 'news'
tags: ['Anthropic', 'Claude', 'AIエージェント', 'API', '監査ログ', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Platform release notes は、2026年7月22日の更新として Claude Managed Agents に複数の実装機能を追加した。中心は、agent の model configuration に `effort` を設定できること、environment と memory store の lifecycle webhook が増えたこと、session 作成時に `initial_events` を渡せること、session thread stream で event deltas を受け取れることだ。

この更新は、新しいモデル発表ほど目立たない。しかし Claude Managed Agents を業務エージェント基盤として評価している日本企業には重要である。[Claude Agent Memory移行](/blog/anthropic-agent-memory-header-2026/) では memory store の header と一覧取得の互換性を扱った。今回の更新は、その memory や environment をどう監視し、どの effort で agent を走らせ、どの initial event から長時間作業を始めるかという運用設計に関わる。

同じ Anthropic の実務文脈では、[Anthropic AIネイティブSDLC](/blog/anthropic-ai-native-sdlc-security-2026/) が開発工程全体の監査ループを扱い、[Claude CISOガイド](/blog/anthropic-ciso-agentic-ai-governance-2026/) が非信頼入力、実行権限、blast radius、観測性を承認条件として整理した。Managed Agents の今回の更新は、まさにその承認条件を API と運用基盤へ落とし込む材料である。

## 事実: 7月22日の更新で何が増えたか

Anthropic の release notes は、Claude Managed Agents の agent 作成時に model object の中で `effort` を指定できるようになったと説明している。`effort` は `low`、`medium`、`high`、`xhigh`、`max` などの段階で、応答品質、推論深度、速度、token 消費のバランスを変えるための設定である。

重要なのは、これは session ごとの上書きではなく、agent の model configuration に置く点だ。agent setup の documentation では、per-session の model override に `effort` を入れても適用されず、agent 側に設定する必要があると説明されている。つまり、長時間タスク用 agent、低遅延の問い合わせ agent、検証用 subagent を分けるなら、それぞれ別の agent definition として管理するのが自然になる。

同じ release notes は、Claude Managed Agents の webhook が environment と memory store の lifecycle も扱うようになったと説明している。従来の session、agent、deployment まわりの通知に加えて、environment や memory store の状態変化を polling なしで受け取れる。webhook documentation は、event payload では type と id を受け取り、詳細は GET で取り直す設計だと説明している。再送時の stale data を避け、delivery を小さく保つためである。

さらに、session 作成時に `initial_events` を渡せるようになった。Start a session の documentation では、`initial_events` は `user.message` と `user.define_outcome` を最大 50 件まで受け取り、空でない list を渡すと session 作成と同時に agent loop が始まると説明している。これにより、session を作ってから別 API で user event を送る二段階処理をまとめられる。

最後に、session thread event stream が event deltas を扱えるようになった。subagent thread の text を生成途中で preview できるため、multiagent 構成で child agent の進捗を UI や監視に出しやすくなる。これは見た目の streaming 改善だけではなく、長時間 agent の途中状態をどう見せ、いつ止めるかという運用にも関係する。

## 事実: effortは費用制御の単純な上限ではない

Anthropic の Effort documentation は、`effort` を token 使用量、速度、応答の徹底度を調整する behavioral signal として説明している。lower effort は token や tool call を抑えやすいが、厳密な token budget ではない。難しい問題では低 effort でも一定の thinking が起きる。

この点は、日本企業の費用管理では誤解しやすい。`effort: low` を設定したから月額予算が一定額で止まる、という話ではない。budget、rate limit、usage analytics、承認フローとは別に、agent の作業スタイルを調整するつまみとして見るべきだ。

Effort documentation は、agentic coding や複雑な reasoning では `high` 以上を使い、速度や費用を優先する単純作業では `low` や `medium` を検討する考え方を示している。Claude Sonnet 5 は API と Claude Code で `high` effort が既定で、Opus 系の coding や agentic work では `xhigh` を starting point とする guidance もある。

したがって、実務上の設計は「全社で high にする」でも「全部 low にする」でもない。分類、抽出、軽い問い合わせ、定型の status 確認は low または medium。設計レビュー、コード修正、incident triage、法務・監査文書の下書きは high 以上。特に長時間の coding agent や複数 tool を使う agent は、品質を落としすぎると人間レビューの手戻りが増え、結果的に安くならない。

## 分析: 日本企業はagent definitionを運用単位にする

ここからは分析である。

今回の更新で最も重要なのは、effort を agent definition の一部として扱うべきだという点だ。日本企業では、AI エージェント導入時に「Claude を使う部署」「GitHub connector を許可する部署」のように、ツール単位や部署単位で議論しがちである。しかし Managed Agents では、system prompt、tools、MCP servers、skills、model、effort、metadata を束ねた agent definition が実際の運用単位になる。

たとえば、社内規程を読むだけの FAQ agent と、GitHub issue を読み shell を動かす開発 agent は同じ Claude 利用でもリスクが違う。前者は `low` または `medium` effort で十分かもしれない。後者は `high` 以上を使い、tool permission、sandbox、egress、監査ログ、human approval を強くする必要がある。

[Claude Enterprise管理API](/blog/anthropic-claude-enterprise-user-management-api-2026/) の文脈で見れば、誰に agent を使わせるかは ID 統制の問題である。一方、どの agent がどの effort、tool、memory、environment を持つかは実行統制の問題である。この2つを混ぜると、利用者は正しい group にいるのに、agent 側の設定が強すぎる、または弱すぎる状態が起きる。

日本企業が最初に作るべきなのは、agent definition 台帳だ。agent 名、用途、対象部署、model、effort、tools、MCP、environment、memory store、read/write action、webhook 送信先、owner、変更承認者、rollback 手順を1行で見られる形にする。これがないと、effort の変更が単なる性能調整なのか、監査対象の production agent 設定変更なのか判断できない。

## webhookは監視ではなく制御点になる

Managed Agents の webhook 拡張は、polling を減らすだけの改善ではない。environment と memory store の lifecycle が通知対象になることで、agent の作業場所と永続状態が変わった瞬間を運用基盤で拾えるようになる。

これは [Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で扱った監査ログ連携と合わせて考えるべきだ。session の開始や終了だけを見ても、agent がどの environment で動き、どの memory store を使い、いつ状態が変わったかが見えなければ、長時間作業の説明は弱くなる。

たとえば、開発 agent が新しい environment を使い始めた、memory store が更新された、deployment run が失敗した、subagent thread が開始された、といった event を SIEM や internal dashboard に流せると、利用者問い合わせや incident 対応が速くなる。逆に webhook を受け取るだけで GET による再取得をしない設計では、最新状態を誤って読む可能性がある。

webhook endpoint 自体も管理対象である。documentation は HTTPS endpoint、subscription event type、signing secret、署名検証を前提としている。日本企業では、社内 network へ直接 webhook を受けられない場合、public endpoint、relay、queue、private connectivity、secret rotation、再送処理を決める必要がある。AI agent の監視経路が、未管理の小さな serverless function になってしまうと本末転倒である。

## initial_eventsは自動実行の境界を変える

`initial_events` は便利だ。session 作成と同時に user message や outcome を入れ、agent loop を開始できる。scheduled task、社内申請、incident triage、pull request review、定例レポート生成のように、同じ雛形で session を起動する用途では実装が単純になる。

一方で、これは自動実行の境界を変える。以前は session 作成と作業開始が別 API だったため、作成後に確認や追加 metadata を挟む余地があった。`initial_events` を使うと、session は最初から running status になる。起動前の承認、入力検証、outcome 定義、利用者 identity、billing tag、監査 context を作成 request の前にそろえなければならない。

特に `user.define_outcome` を初期 event に入れる場合、agent が何を成功条件として動くかが session 開始時に固定される。これは業務品質には良いが、誤った outcome を大量投入すると、agent が間違った目標へ向けて長時間動く。日本企業では、initial event template を code review 対象にし、部署ごとの自由記述だけで production agent が起動しないようにしたほうがよい。

thread event deltas も同じである。subagent の途中生成を UI に出せることは、作業の透明性を高める。しかし、途中の text は最終結論ではない。監査ログ、利用者通知、顧客向け表示にそのまま流すと、未確定の案や内部推論に近い内容を誤って扱う可能性がある。preview は preview として表示し、保存・通知・承認に使う event type を分けるべきだ。

## 日本企業が今週確認すること

第一に、agent definition ごとの effort 方針を決める。既定値に任せる agent、明示的に low/medium に落とす agent、high/xhigh 以上を要求する agent を分類する。費用削減のために一律で下げるのではなく、eval、失敗率、人間レビュー時間、latency、tool call 数を見て調整する。

第二に、effort 変更を change management に入れる。agent の system prompt や tool permission ほどではないにしても、effort は agent の探索量や tool call に影響する。production agent では、変更理由、対象 agent、期待する費用・遅延影響、rollback 手順を記録する。

第三に、webhook を polling の代替ではなく監査 event source として設計する。受信 endpoint、署名検証、GET 再取得、重複処理、dead letter queue、SIEM 連携、保存期間を決める。environment と memory store lifecycle event は、session event と同じ dashboard で見られるようにする。

第四に、`initial_events` の template を固定する。定例作業や incident triage で使う user message、outcome、metadata、承認条件を version 管理し、自由入力だけで production session が動かないようにする。最大 50 events という上限も、複雑な初期文脈を詰め込みすぎない設計上の制約として扱う。

第五に、subagent thread の streaming 表示を監査と分ける。途中 preview は利用者体験には有効だが、最終成果物や承認証跡ではない。UI 上の表示、ログ保存、通知、監査 evidence を event type ごとに分ける必要がある。

## まとめ

Claude Managed Agents の 2026年7月22日更新は、agent を本番運用に近づけるための部品がそろってきたことを示している。`effort` は費用と品質の設計点になり、webhook は environment と memory store の lifecycle を監視できるようにし、`initial_events` は session 起動を自動化する。

日本企業は、この更新を単なる API 追加として扱わないほうがよい。agent definition を運用単位にし、effort、memory、environment、webhook、initial event、subagent stream を同じ台帳で管理する。AI エージェントが長時間働くほど、成功の条件はモデル性能だけでなく、費用、監査、承認、停止、再開を説明できる運用基盤になる。

## 出典

- [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview) - Anthropic Docs, 2026-07-22
- [Define your agent](https://platform.claude.com/docs/en/managed-agents/agent-setup) - Anthropic Docs
- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) - Anthropic Docs
- [Start a session](https://platform.claude.com/docs/en/managed-agents/sessions) - Anthropic Docs
- [Subscribe to webhooks](https://platform.claude.com/docs/en/managed-agents/webhooks) - Anthropic Docs
