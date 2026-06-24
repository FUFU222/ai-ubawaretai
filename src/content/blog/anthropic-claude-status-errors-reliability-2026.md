---
title: 'Claude障害連発、AI開発基盤の代替経路とSLO点検'
description: 'Claude障害連発を公式StatusとAPIエラー仕様から整理。日本企業がClaude CodeやAPIを単一障害点にしないための代替経路、SLO、リトライ設計を情シスとSRE向けに点検する。'
pubDate: '2026-06-24'
category: 'news'
tags: ['Anthropic', 'Claude', 'Claude Code', 'AIガバナンス', '開発基盤', 'レート制限']
series: 'anthropic-japan-2026'
draft: false
---

Anthropic の Claude Status は、2026年6月22日から24日にかけて、Claude Opus 4.8、複数モデル、Claude.ai、Claude API、Claude Code、Claude Cowork などに関わる複数の elevated error incidents を記録した。すべての記事化時点では resolved だが、短時間の単発ではなく、複数日にわたりモデル面とサービス面の両方でエラー率上昇が出た点が重要だ。

これは「Claude が不安定だから使うべきではない」という話ではない。むしろ、Claude Code や Claude API が日本企業の開発、調査、法務、金融、顧客対応に入り始めたことで、AI 基盤も通常の業務 SaaS やクラウド基盤と同じように SLO、縮退運転、代替経路、障害時の説明責任を持つ段階に入ったと見るべきだ。

このサイトでは、[Claude Compliance API統合](/blog/anthropic-claude-compliance-api-integrations-2026/) で監査ログと既存セキュリティ基盤への接続を扱い、[Claude containment](/blog/anthropic-claude-containment-agent-security-2026/) で実行環境の境界設計を整理した。今回の Claude Status の連続更新は、そこに「可用性」というもう一つの管理軸を足すものだ。[Claude Code権限ルール](/blog/claude-code-2178-subagent-permissions-2026/) のような細かい権限設計も、基盤が落ちた時に誰が何を止めるか、何へ切り替えるかと一緒に設計しなければ運用としては足りない。

## 事実: Claude Statusに連続したエラー率上昇が出た

Claude Status の history feed では、2026年6月22日に Opus 4.8、Opus 4.7、Opus 4.6、Sonnet 4.6、Haiku 4.5 に関わる elevated error rates が記録された。同日には Opus 4.8 単体の elevated errors と、many models across errors の incident も続いた。

2026年6月23日には、Opus 4.8 の elevated errors、multiple models の elevated error rate、Claude.ai の elevated error rates が記録された。特に multiple models の incident では、Claude.ai、Claude Console、Claude API、Claude Code、Claude Cowork の各 component が status update の対象になっている。Status の更新では、複数モデルへの request でエラー率上昇が起きた時間帯も示されている。

2026年6月24日にも、Claude Opus 4.8 と Opus 4.8 Fast の elevated errors が記録された。24日の Opus 4.8 incident では、Claude.ai、Claude Console、Claude API、Claude Code、Claude Cowork が degraded performance から operational へ戻ったことが status API 上で確認できる。

ここで分けておきたい事実は二つある。第一に、Status 上の各 incident は記事化時点で resolved になっている。第二に、対象は「チャット画面だけ」でも「API だけ」でもなく、モデル、API、Console、Claude Code、Claude Cowork をまたぐ形で影響範囲が示された回がある。つまり、Claude を業務ワークフローの部品にしている企業は、エンドユーザー画面と開発者 API を別々に監視するだけでは足りない。

## 事実: エラー仕様とレート制限は利用側の設計対象

Anthropic の API errors docs は、HTTP status と error type の形式を整理している。400 系ではリクエスト形式、認証、権限、存在しない resource、request body size、rate limit などの扱いが分かれる。500 系では internal server error と overloaded error があり、529 は API が一時的に過負荷の状態であることを示す。

Rate limits docs では、API 利用には spend limits と rate limits があり、rate limits は一定期間内に組織が実行できる API request 数を制限するものだと説明されている。制限は organization level で強制され、workspace に user-configurable limits を設定できる。Standard と Priority Tier の両方に適用され、Priority Tier は committed spend と引き換えに service level を高める選択肢として説明されている。

これらは障害報告とは別の文書だが、利用側の復旧設計には直結する。429、500、529 を同じ「失敗」として扱うと、再試行、待機、キュー投入、人間への通知、別モデルへの切り替え、処理中止の判断を誤る。Rate limit は使いすぎに対する制御であり、overloaded はサービス側の一時的な過負荷を示す。どちらもユーザーからは「Claude が返ってこない」に見えるが、運用側の対応は違う。

## 分析: 日本企業はClaudeを単一障害点にしない

ここからは分析だ。

日本企業で Claude を使う範囲は広がっている。開発チームでは Claude Code、社内業務では Claude Enterprise、プロダクト組み込みでは Claude API、クラウド調達では Bedrock や Vertex AI 経由の Claude 利用が候補になる。さらに [Claude Code Auto modeのクラウド経由運用](/blog/claude-code-auto-mode-bedrock-vertex-foundry-2026/) で扱ったように、Bedrock、Vertex AI、Foundry、LLM gateway をまたぐ経路も現実的になっている。

この構成で一番避けたいのは、Claude が便利になった結果、業務の停止点が Claude 一つに集まることだ。コードレビュー、リリース前調査、顧客問い合わせの下書き、契約書レビュー、障害対応のログ要約、営業資料作成をすべて Claude 前提にすると、短いエラー率上昇でも現場は止まる。人間が手作業へ戻れる業務ならよいが、AI 呼び出しを前提にしたワークフローやバッチ処理では、失敗が蓄積して後続処理を詰まらせる。

したがって、Claude の導入判断は「精度が高いか」だけではなく、「落ちた時にどこまで落とすか」を含めるべきだ。たとえば、顧客向け回答の最終生成は止めるが社内検索は続ける、Claude Code の自動修正は止めるが人間のレビューは継続する、長文推論は翌朝へ回すが短い分類処理は別モデルへ切り替える、といった縮退運転を先に決める。

## Claude CodeとAPIで復旧設計を分ける

Claude Code の障害影響と、Claude API を組み込んだ自社サービスの障害影響は同じではない。Claude Code は開発者の生産性や修正速度に効く。API はユーザー向け機能や社内業務処理そのものに効く。どちらも重要だが、SLO と通知先は分けるべきだ。

Claude Code では、まず人間への戻し方を決める。AI が PR を作れないなら、既存の issue、test、review 流程へ戻す。subagent や MCP を使うチームでは、agent が途中で止まった時に workspace が半端な状態で残らないかを確認する。権限設定や MCP 接続が強いほど、停止時の後始末も重要になる。

API では、クライアント実装が鍵になる。429、500、529 を分類し、指数バックオフ、jitter、タイムアウト、idempotency、キュー再投入、ユーザー向けエラーメッセージを実装する。長時間の batch は再開可能にし、同期 UI では待たせすぎない。高いリクエスト数を出す社内ツールでは、workspace ごとの上限と優先度を決め、重要度の低いジョブが本番機能の quota を食いつぶさないようにする。

クラウド経由利用では、さらに入口が増える。Anthropic 直結、Bedrock、Vertex AI、Foundry、社内 LLM gateway では、認証、ログ、請求、レート制限、モデル名、利用可能機能が違う。障害時に切り替えるなら、平時から request schema、tool use、system prompt、監査ログ、費用を比較しておく必要がある。緊急時に初めて別経路を試すのは遅い。

## 今週点検すること

第一に、Claude を使っている業務棚卸しを作る。Claude.ai、Claude Code、Claude API、Claude Enterprise、Claude Cowork、Bedrock や Vertex 経由の Claude 利用を分け、誰が、どの業務で、どの頻度で、どのデータを扱っているかを確認する。

第二に、SLO を業務別に置く。すべての Claude 利用に同じ稼働率を求める必要はない。顧客向け機能、社内承認、開発支援、調査、文書作成では求める復旧時間が違う。AI が落ちた時に業務を止めるのか、遅延させるのか、人間に戻すのか、別モデルへ切り替えるのかを決める。

第三に、エラー処理を点検する。429、500、529 を区別してログに残しているか。リトライが同時に走ってさらに負荷を上げていないか。UI が無限に待たないか。batch 処理が重複実行していないか。API key や workspace の制限に当たった時、管理者が原因を追えるかを見る。

第四に、内部監査とセキュリティの観点で障害ログを残す。Claude が止まった時に、誰がどの業務を手動へ戻したか、どのジョブが失敗したか、どの顧客対応が遅れたかを記録できるようにする。[AnthropicとNECの協業](/blog/anthropic-nec-ai-engineering-workforce-japan-2026/) のような大規模展開を目指すなら、AI 利用の拡大と同時に、障害時の説明責任も組織で持つ必要がある。

第五に、代替経路を小さく検証する。すべてのワークロードを即座にマルチモデル化する必要はない。まずは重要業務の一部で、別モデル、別リージョン、別クラウド、社内 fallback、手動レビューへの切り替え手順を試す。出力品質だけでなく、ログ、権限、費用、データ保持、監査証跡が同じレベルで確保できるかを確認する。

## まとめ

Claude Status の連続した elevated errors は、Claude を企業 AI 基盤として使うチームにとって、可用性設計を見直す合図になる。記事化時点で各 incident は resolved だが、複数日にわたりモデル、API、Claude Code、Claude Cowork を含む範囲でエラー率上昇が出た事実は軽くない。

日本企業が取るべき対応は、Claude 利用を止めることではない。Claude を重要な業務部品として扱い、SLO、エラー分類、リトライ、縮退運転、代替経路、障害ログを整えることだ。生成 AI は精度だけでなく、落ちた時に業務を壊さない設計まで含めて本番基盤になる。

## 出典

- [Claude Status - Incident History Atom Feed](https://status.claude.com/history.atom) - Claude Status, accessed 2026-06-24
- [Claude Status API - Incidents](https://status.claude.com/api/v2/incidents.json) - Claude Status, accessed 2026-06-24
- [Errors](https://docs.anthropic.com/en/api/errors) - Anthropic Docs
- [Rate limits](https://docs.anthropic.com/en/api/rate-limits) - Anthropic Docs
