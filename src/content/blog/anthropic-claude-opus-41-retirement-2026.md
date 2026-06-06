---
title: 'Claude Opus 4.1廃止、8月5日移行の実務手順'
description: 'Claude Opus 4.1廃止が2026年6月5日に告知。日本企業がAPI、Claude Code、Bedrock/Vertex/Foundry経由の利用を8月5日までに棚卸し、Opus 4.8へ移行する手順を整理する。'
pubDate: '2026-06-06'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'AIエージェント', '開発者ツール', '企業導入']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic は 2026年6月5日のリリースノートで、**Claude Opus 4.1 を deprecated にし、2026年8月5日に retirement する**と告知した。推奨移行先は Claude Opus 4.8 である。これは新モデル発表ほど目立たないが、API、Claude Code、社内LLMゲートウェイ、クラウド経由のClaude利用を持つ日本企業には期限付きの運用イベントになる。

以前の [Claude Opus 4.8と動的ワークフロー](/blog/anthropic-claude-opus-48-dynamic-workflows-2026/) では、Opus 4.8を長時間タスクやコーディングエージェントでどう評価するかを扱った。今回の主題はその裏側だ。新モデルを試すかどうかではなく、**古いモデルIDをいつまでに消すか**である。

さらに [Claude Code Auto modeのクラウド経路拡大](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で見たように、Claudeの利用経路はAnthropic直結だけではない。Bedrock、Vertex、Foundry、社内プロキシを通す企業ほど、モデル廃止対応は単純な文字列置換では終わらない。

## 事実: Opus 4.1は2026年8月5日にretirement予定

Anthropic の Claude Code release notes は、2026年6月5日の項目として Claude Opus 4.1 の非推奨化と retirement 予定を示している。移行先として挙げられているのは Claude Opus 4.8 だ。モデル deprecations ドキュメントでも、Opus 4.1 の direct Anthropic API retirement は 2026年8月5日として整理されている。

ここで大事なのは、deprecated と retirement を分けて読むことだ。deprecated は「もう新規採用すべきではない」という合図で、retirement は「そのモデルを呼ぶ設計が失敗し始める期限」と考えたほうがよい。既存の本番処理、評価ジョブ、社内ツール、デモ環境、古いドキュメントが Opus 4.1 を指しているなら、8月5日までに棚卸しと差し替えを終える必要がある。

クラウド経由では日付の扱いにも注意がいる。Anthropic の model deprecations ページは、direct API と AWS Bedrock / Google Vertex AI で retirement 日が異なる場合があることを示している。日本企業ではクラウド経由の利用が多いため、「Anthropic APIは8月5日、クラウド経由は別日かもしれない」という前提で、契約経路ごとに確認したほうがよい。

## 事実: 推奨先はOpus 4.8だが、評価なしの差し替えは危ない

Opus 4.8 は、Anthropic が 2026年5月28日に公開した上位モデルで、長時間タスク、コーディング、エージェント作業を主な改善領域としている。API価格は前世代と同じと説明され、Claude Code の動的ワークフローとも組み合わさる。つまり、Opus 4.1 からの移行先として自然ではある。

ただし、自然な移行先だからといって、本番ワークロードで即時差し替えしてよいわけではない。モデル更新では、出力品質が上がる一方で、文章の長さ、ツール呼び出しの傾向、失敗時の粘り方、コード修正の粒度、セキュリティ境界への触れ方が変わることがある。開発支援や顧客向け文章生成では、この差がレビュー負荷や監査ログに影響する。

[Anthropic Series Hと企業導入の記事](/blog/anthropic-series-h-compute-enterprise-japan-2026/) でも書いたように、Claudeは単なるチャットモデルではなく、開発、業務、セキュリティ、資料作成の基盤へ広がっている。基盤として使うなら、モデル廃止は障害対応に近い。期限前に対応できなければ、利用者の手元で突然ジョブが止まる。

## 分析: 日本企業はまずモデルIDの所在を洗い出すべきだ

ここからは分析だ。

日本の開発組織で一番危ないのは、公式SDKの設定だけを見て「移行済み」と判断することだ。モデルIDは、環境変数、Terraform、Helm chart、GitHub Actions、社内LLMゲートウェイ、プロンプト評価ツール、Notebook、デモ用リポジトリ、営業資料、委託先のサンプルコードに散る。

特に Claude Code を社内標準にし始めている場合、モデル選択はユーザー端末の設定、チームテンプレート、クラウド経由設定、Auto mode の候補モデル、コスト配賦ルールにまたがる。Opus 4.1 を直接指定していなくても、古い profile や wrapper が暗黙に選んでいる可能性がある。

そのため、最初にやることは移行PRを作ることではない。まず grep、コード検索、設定管理、利用ログ、請求ログを使って、`opus-4-1` 相当のモデル指定がどこに残っているかを見る。次に、用途を分類する。開発者支援、顧客向け生成、社内検索、評価、バッチ処理、セキュリティ分析、デモのどれなのかで、移行の優先度と検証方法が変わる。

## 実務: 8月5日までの移行チェックリスト

第一に、本番経路を洗い出す。Anthropic直結、Bedrock、Vertex AI、Foundry、社内ゲートウェイ、SaaS組み込みのどれを使っているかを表にする。契約経路ごとに retirement 日、利用可能な代替モデル、リージョン、ログ仕様、データ保持条件を確認する。

第二に、モデルID検索を行う。リポジトリ、CI設定、IaC、Secrets管理、Runbook、NotionやConfluence、Notebook、社内SDKのデフォルト値を対象にする。検索対象は厳密なモデルIDだけでなく、`Opus 4.1`、`opus41`、古い alias、社内独自名も含める。

第三に、代替モデル評価を小さく行う。推奨先は Opus 4.8 だが、すべての用途で同じ評価指標にはならない。コード修正ではテスト通過率と不要差分、問い合わせ回答では根拠表示と禁止表現、社内検索では引用の正確さ、バッチ処理ではコストと失敗率を見る。

第四に、切り戻し手順を決める。8月5日以降はOpus 4.1へ戻せない前提で、切り戻し先は別の現行モデルや保守済みプロンプトにする必要がある。古いモデルへ戻す設計では、retirement後の障害に耐えられない。

第五に、開発者へ期限を伝える。Slackで一度通知するだけでは足りない。社内CLIの警告、PRチェック、テンプレート更新、利用ログからの該当チーム通知を組み合わせる。委託先や子会社が別リポジトリでClaudeを使っている場合も対象に含める。

## まとめ

Claude Opus 4.1 の廃止告知は、Opus 4.8を試す話ではなく、既存利用を止めないための移行管理である。Anthropic直結のAPIでは2026年8月5日が重要な期限になり、クラウド経由では提供元ごとの日付確認が必要になる。

日本企業が今やるべきことは、モデルIDの棚卸し、用途別評価、クラウド経路の確認、切り戻し先の設計だ。[Claudeのコンテインメント設計](/blog/anthropic-claude-containment-agent-security-2026/) で見たように、エージェントが強くなるほど統制も必要になる。モデル廃止対応も同じで、便利な新モデルへ移るだけでなく、古いモデルを確実に消す運用を作るべきだ。

## 出典

- [Claude Code release notes](https://docs.anthropic.com/en/release-notes/claude-code) - Anthropic Docs, 2026-06-05
- [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations) - Anthropic Docs
- [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) - Anthropic Docs
