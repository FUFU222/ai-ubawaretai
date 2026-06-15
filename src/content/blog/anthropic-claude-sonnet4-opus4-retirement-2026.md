---
title: 'Claude Sonnet 4退役、Opus 4移行の即時点検'
description: 'Claude Sonnet 4とOpus 4が2026年6月15日にAPI退役。日本企業がモデルID棚卸し、Bedrock/Vertex経由、Sonnet 4.6/Opus 4.8移行評価を今すぐ確認する手順を整理する。'
pubDate: '2026-06-16'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'AIエージェント', '開発者ツール', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の model deprecations ドキュメントで、**Claude Sonnet 4 と Claude Opus 4 の direct Anthropic API retirement が 2026年6月15日** と整理されている。日本時間ではすでに期限後であり、これは「近いうちに対応する」話ではなく、API、社内LLMゲートウェイ、評価基盤、Claude Code 周辺設定を今すぐ点検する運用イベントである。

以前の [Claude Opus 4.1廃止、8月5日移行の実務手順](/blog/anthropic-claude-opus-41-retirement-2026/) は、2026年8月5日に向けた移行計画の話だった。今回の Sonnet 4 / Opus 4 は、すでに 6月15日の retirement 日を迎えている点が違う。さらに [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) で見たように、Anthropic は 4.8 系や Claude Code の実行設計を前に進めており、古い 4 系モデルを残す理由は急速に小さくなっている。

[Claude Code Auto mode、クラウド経由運用の要点](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) でも扱った通り、Claude の利用経路は Anthropic API だけではない。Bedrock、Vertex AI、Microsoft Foundry、社内プロキシ、SaaS 組み込みが混ざる企業ほど、退役済みモデルの確認は単純なコード検索では終わらない。

## 事実: Sonnet 4とOpus 4は6月15日にAPI退役

Anthropic の model deprecations ページは、モデルごとに deprecated date、direct Anthropic API retirement date、クラウドプロバイダー経由の retirement date を分けて示している。その表で Claude Sonnet 4 と Claude Opus 4 は、direct Anthropic API の retirement date が **2026年6月15日** とされている。推奨先は、用途に応じて Sonnet 4.6、Opus 4.8、あるいは現行の Claude モデル群を検討する形になる。

ここで注意したいのは、退役対象が「Claude 4 全体」ではないことだ。Anthropic の models overview では、現行モデルとして Sonnet、Opus、Haiku などの系統が並び、モデルごとに用途、価格、機能、コンテキスト長が異なる。つまり、対応は「Claude をやめる」ではなく、古い Sonnet 4 / Opus 4 指定を、現行のモデルIDと評価基準に置き換える作業である。

また、Anthropic のドキュメントは direct API とクラウド経由を分けている。日本企業では AWS Bedrock や Google Vertex AI を経由して Claude を使うケースが多い。クラウド経由の終了日、提供リージョン、モデルID表記、監査ログ、データ保持条件は、Anthropic 直結の API と同じとは限らない。退役済みかどうかの確認は、契約経路ごとに行うべきだ。

## 事実: Opus 4.1の8月期限とは別の棚卸しが必要

Opus 4.1 の retirement は 8月5日に予定されており、まだ移行期間が残っている。一方で、Sonnet 4 と Opus 4 は 6月15日で direct API の retirement 日を迎えた。したがって、同じ Claude 4 系の話でも、優先順位は違う。Sonnet 4 / Opus 4 は、すでに本番障害の原因になりうる設定として扱う必要がある。

特に Sonnet 4 は、軽めの開発支援、要約、社内検索、分類、顧客対応文の下書きなどに広く使われていた可能性がある。Opus 4 は、長い文脈、複雑な推論、エージェント実行、コード変更のような高価値タスクに使われやすい。片方だけを確認して終わると、低コストの日常処理か、高価値の重要処理のどちらかに古い指定が残る。

Claude Code でも注意がいる。[Claude CodeのfallbackModel権限制御](/blog/claude-code-fallback-model-permission-hardening-2026/) で見たように、モデル選択は明示指定だけでなく、fallback、Auto mode、管理設定、ローカル profile にも現れる。退役済みモデルは「通常時は使っていない」だけでは不十分で、障害時や低頻度ジョブで呼ばれないことまで確認したい。

## 分析: 日本企業が最初に見るべきはモデルIDの所在

ここからは分析だ。

日本企業で最も起きやすい失敗は、アプリケーションコードだけを検索して「該当なし」と判断することだ。モデルIDは、環境変数、Secrets、Terraform、Helm values、GitHub Actions、Notebook、評価ジョブ、社内プロンプト管理、SaaS 連携設定、委託先のサンプルコード、営業デモ環境に残る。

さらに、社内では正式なモデルIDではなく、`claude-sonnet`、`standard-claude`、`opus-high` のような抽象名で管理していることがある。抽象化は便利だが、実体が Sonnet 4 や Opus 4 のままなら退役リスクを隠すだけになる。社内LLMゲートウェイを持つ組織は、alias がどのモデルへ解決されるか、変更履歴が残るか、利用者へ通知されるかを確認する必要がある。

まず見るべき順序は、実利用ログ、コード検索、設定管理、請求ログ、評価基盤である。実利用ログは、今も呼ばれているモデルを示す。コード検索は、低頻度処理や非常時スクリプトを拾う。請求ログは、部署別・プロジェクト別の影響範囲を示す。評価基盤は、移行後の品質比較に必要な基準が古いモデルへ固定されていないかを教えてくれる。

## 実務: 今週やるべき移行点検

第一に、Sonnet 4 と Opus 4 の指定を検索する。正確なモデルIDだけでなく、社内 alias、古いドキュメント表記、サンプルコード、Notebook、CI、プロンプト評価設定を含める。検索結果には用途、所有チーム、提供経路、利用頻度、代替候補、期限後の影響を付ける。

第二に、用途別に代替先を決める。日常的な要約や分類なら Sonnet 4.6 系、長時間のコード調査やエージェント実行なら Opus 4.8 系、軽量処理なら別の低コストモデルを候補にする。価格ページと models overview を見て、単価だけでなくコンテキスト長、ツール利用、レイテンシ、出力品質を合わせて比較する。

第三に、クラウド経由の提供条件を確認する。Bedrock / Vertex / Foundry 経由では、同じ Claude 名でもモデルID、リージョン、ログ、データ境界、終了日が異なる可能性がある。クラウド管理者と開発チームが別に動いている場合、片方の確認だけでは足りない。

第四に、切り戻し先を古いモデルにしない。retirement 後の切り戻しは、Sonnet 4 や Opus 4 へ戻すのではなく、現行モデル、プロンプト調整、人間レビュー、キュー保留、機能停止の組み合わせで設計する。古いモデルへ戻す手順は、期限後には実行不能になる可能性が高い。

## まとめ

Claude Sonnet 4 と Claude Opus 4 の API 退役は、目立つ新機能ではないが、日本企業のAI運用には重要な期限である。2026年6月15日を過ぎた今、対応は移行計画ではなく、退役済みモデルが残っていないかの確認に近い。

まず、モデルIDと alias の所在を棚卸しする。次に、Sonnet 4.6、Opus 4.8、その他の現行モデルへ用途別に移す。最後に、Anthropic 直結、Bedrock、Vertex、Foundry、社内ゲートウェイの責任分界を確認する。Claude の利用が開発・業務基盤へ広がるほど、モデル退役を通常のライフサイクル管理として扱う必要がある。

## 出典

- [Model deprecations](https://docs.anthropic.com/en/docs/about-claude/model-deprecations) - Anthropic Docs
- [Claude models overview](https://docs.anthropic.com/en/docs/about-claude/models/overview) - Anthropic Docs
- [Migrating to Claude 4](https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4) - Anthropic Docs
- [Anthropic pricing](https://www.anthropic.com/pricing#anthropic-api) - Anthropic
