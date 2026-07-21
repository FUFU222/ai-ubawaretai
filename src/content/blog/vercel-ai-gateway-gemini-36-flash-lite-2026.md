---
title: 'Vercel AI Gateway、Gemini新モデルを実装する要点'
description: 'Vercel AI GatewayでGemini 3.6 Flashと3.5 Flash-Liteが利用可能になった。日本のWeb開発チームがAI SDKのmodel指定、サブエージェント用途、BYOK、予算タグ、ログをどう整理するか解説する。'
pubDate: '2026-07-22'
category: 'news'
tags: ['Vercel', 'Gemini', 'AIエージェント', '開発者ツール', 'AIコーディング', 'AIガバナンス']
draft: false
---

Vercelは2026年7月21日、**Vercel AI GatewayでGemini 3.6 FlashとGemini 3.5 Flash-Liteを利用可能にした**と発表した。AI SDKでは、`google/gemini-3.6-flash` または `google/gemini-3.5-flash-lite` を `model` に指定するだけで、Gateway経由の呼び出しにできる。

この更新は、Geminiの新モデルが増えたという話にとどまらない。GitHub Copilot内でGemini 3.6 Flashを使う話は、すでに[Gemini 3.6 FlashがCopilotへ、価格連動の移行線](/blog/github-copilot-gemini-36-flash-rollout-2026/)で整理した。今回のVercel側の論点は、Copilotのモデルピッカーではなく、自社Webアプリや社内AIエージェントが、モデル、予算、ログ、BYOK、fallbackをどう扱うかである。

日本の開発チームにとっては、特に実装運用の意味が大きい。AI SDKでモデル名を差し替えれば試せる一方、Gatewayを通すなら、誰がどの機能でどのモデルを使ったか、予算をどこで止めるか、入力ログをどこまで残すかを先に決める必要がある。

## 事実: AI GatewayにGemini 2モデルが追加

VercelのChangelogで確認できる事実は明確だ。Gemini 3.6 FlashとGemini 3.5 Flash-LiteがAI Gatewayで利用可能になった。VercelはGemini 3.6 Flashについて、coding、agentic tasks、web developmentでGemini 3.5 Flashより改善し、tokenやmodel callを減らせる可能性があると説明している。

一方、Gemini 3.5 Flash-Liteは、範囲を絞ったsubagentに向く低コスト、低レイテンシの選択肢として説明されている。つまり、1つの大きなモデルですべてを処理するより、重い推論と軽い分担処理を分ける設計に向いている。

GoogleのGemini APIリリースノートでも、2026年7月21日にGemini 3.6 FlashとGemini 3.5 Flash-Liteが一般提供になったことが示されている。Google側の説明では、Gemini 3.6 Flashはコードやagentic planningで効率を上げ、Gemini 3.5 Flash-Liteは低レイテンシで費用を抑えたsubagent向けの選択肢として位置づけられる。

Vercel AI Gateway自体は、複数プロバイダーのモデルを単一APIで扱うための基盤である。Vercel Docsでは、AI Gatewayはモデルへのアクセス、利用量とコストの監視、budget、load balancing、fallback、OpenAI互換やAnthropic互換API、AI SDKとの連携を提供すると説明されている。

## 分析: モデル追加よりルーティング設計が重要

ここからは分析である。

今回の更新で一番重要なのは、アプリケーション側のモデル選択をコードと運用の両方で扱えるようになる点だ。Gemini 3.6 Flashを「高性能な新モデル」として全リクエストに使うと、効果も費用も見えにくい。逆に、用途ごとに役割を分けると、検証しやすくなる。

たとえば、Gemini 3.6 Flashは、複数ファイルのコード理解、長めのWebアプリ実装修正、仕様からタスク分解するagentic workflowに寄せる。Gemini 3.5 Flash-Liteは、入力分類、短い要約、定型チェック、サブエージェントの一次判断に寄せる。こうすると、速度、品質、費用の差分を比較しやすい。

この考え方は、Google側のエージェント基盤を扱った[Gemini API Managed Agents、社内エージェント基盤の設計線](/blog/google-gemini-api-managed-agents-2026/)ともつながる。Managed Agentsは実行基盤やツール連携の話だが、Vercel AI Gatewayはモデル呼び出しの入口を統制する話である。両方を混ぜず、実行基盤、モデルルーティング、ログ、予算を分けて設計するほうが現実的だ。

また、Geminiのgroundingや検索機能を使う場合も、Gatewayのモデル指定だけでは十分ではない。[Gemini API parallel web search grounding](/blog/google-gemini-parallel-web-search-grounding-2026/)で扱ったように、外部情報を参照する処理では、出典、検索範囲、監査、再現性が別の論点になる。Gatewayはモデル利用の入口であり、データ取得や根拠管理まで自動で解決するわけではない。

## 実装時に決めるべき4項目

第一に、モデル名を直接散らさない。AI SDKのサンプルでは `model: 'google/gemini-3.6-flash'` のように指定できるが、本番アプリでは機能ごとの設定値として持つほうがよい。チャット、コード生成、要約、分類、RAG、サブエージェントでモデルを分け、環境変数や設定テーブルから切り替えられるようにする。

第二に、利用量の属性を先に設計する。Gatewayを通すなら、部署、顧客、機能、環境、ユーザー種別のどれで費用を見るのかを決めたい。日本企業では、生成AIのPoCが本番化した後に「どの機能の費用か分からない」状態になりやすい。予算タグやAPI key単位の境界を、最初から運用設計に入れるべきだ。

第三に、BYOKとログの方針を決める。VercelはAI GatewayでBYOKやzero data retention、custom reporting、budget、routing rulesを説明している。ただし、社内規程では「プロバイダーに送るデータ」「Vercel側で見るメタデータ」「自社が保存するログ」を分けて説明する必要がある。個人情報、顧客データ、ソースコード、障害ログを扱うなら、入力そのものを保存しない選択も検討したい。

第四に、fallbackを品質管理として扱う。Gatewayのfallbackは可用性を上げる一方、モデルが変われば回答品質も変わる。Gemini 3.6 Flashで想定したプロンプトを、別モデルへ自動で落としたときに、コードの安全性や日本語説明の品質が保てるとは限らない。fallback先ごとに、テスト、評価プロンプト、失敗時のユーザー表示を用意する必要がある。

## 日本チームの試し方

最初のPoCは、社内向けの低リスク機能に限定するのがよい。たとえば、PR説明の下書き、エラーログの要約、問い合わせの一次分類、社内ドキュメント検索の回答下書きである。顧客へ直接返す生成文や、課金、認可、医療、法務の判断に直結する処理から始めるべきではない。

RAGやファイル検索を組み合わせる場合は、[Gemini File Searchのmultimodal RAG](/blog/google-gemini-file-search-multimodal-rag-2026/)で整理したように、ファイル投入、検索対象、引用、削除、アクセス権の管理が別に必要になる。Gatewayでモデルを呼べることと、正しい文書だけを根拠にすることは別問題である。

評価では、モデル別の成功率だけでなく、1タスクあたりの呼び出し回数、再試行回数、fallback発生率、利用者ごとの費用、レビュー差し戻し率を見る。Gemini 3.6 Flashでmodel callが減るなら、単価だけでなく完了までの総コストを見る価値がある。Gemini 3.5 Flash-Liteでは、低価格でも失敗再試行が増えないかを見る必要がある。

同じ7月21日には、Vercel AI Gatewayにcoding向けのLaguna S 2.1も追加されている。これは、VercelがAI Gatewayを単なるモデルカタログではなく、コーディングエージェントや開発者向けAIの実行面に寄せているサインとして読める。ただし、今回の導入判断では、まずGemini 2モデルの用途と費用線を切るほうが先である。

## まとめ

Vercel AI GatewayでGemini 3.6 FlashとGemini 3.5 Flash-Liteが使えるようになったことで、AI SDKを使うWeb開発チームはGeminiの最新モデルをアプリ実装に組み込みやすくなった。

ただし、重要なのはモデル名の追加ではなく、ルーティング、予算、ログ、BYOK、fallbackの設計である。日本のチームは、Gemini 3.6 Flashを長めのcodingやagentic workflowへ、Gemini 3.5 Flash-Liteを低コストなsubagentや分類処理へ寄せ、Gatewayの監視とbudgetを使って小さく検証するのが現実的だ。

## 出典

- [Gemini 3.6 Flash and Gemini 3.5 Flash-Lite are now available on AI Gateway](https://vercel.com/changelog/gemini-3-6-flash-3-5-flash-lite-on-ai-gateway) - Vercel Changelog, 2026-07-21
- [AI Gateway](https://vercel.com/docs/ai-gateway) - Vercel Docs
- [Release notes | Gemini API](https://ai.google.dev/gemini-api/docs/changelog) - Google AI for Developers, 2026-07-21
- [Laguna S 2.1 is now available on AI Gateway](https://vercel.com/changelog/laguna-s-2-1-is-now-available-on-ai-gateway) - Vercel Changelog, 2026-07-21
