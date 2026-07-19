---
title: 'Conductor Plugin、Antigravityで仕様駆動AI開発へ'
description: 'Conductor PluginがAntigravity対応で仕様駆動AI開発を拡張。日本の開発チームがspec、plan、レビュー、プラグイン統制をどう設計すべきか実務で整理する。'
pubDate: '2026-07-19'
category: 'news'
tags: ['Google', 'AIエージェント', '開発者ツール', '開発基盤', 'コーディングエージェント', 'MCP']
series: 'google-gemini-api-agent-platform-2026'
draft: false
---

Google Developers Blog は **2026年7月16日**、**Conductor Plugin** を発表した。Conductor は、AI コーディングエージェントに仕様駆動開発、つまり Spec-Driven Development を持ち込むための仕組みで、今回の更新では Gemini CLI 拡張からポータブルな plugin へ移行し、Antigravity CLI など複数の開発者向け AI ツールで使える方向になった。

この更新は「また一つ AI コーディング用プラグインが増えた」という話ではない。重要なのは、AI との作業状態を一時的なチャット履歴ではなく、リポジトリ内の Markdown 成果物へ移す点にある。すでに [Gemini Code Assist の Antigravity 移行](/blog/google-antigravity-code-assist-migration-2026/) で見たように、Google は開発者の作業面を Antigravity へ寄せている。今回の Conductor Plugin は、その上で「何を作るか」「どう作るか」「どこまで終わったか」を残す層になる。

日本の開発チームにとっての論点は、AI が速くコードを書くことだけではない。仕様が曖昧なまま実装へ進む、担当者のチャット履歴にしか判断理由が残らない、レビュー時に AI がどの前提で差分を作ったか分からない、という問題をどう抑えるかだ。Conductor Plugin は、この問題を spec、plan、track といった管理対象へ落とす実務上の入口として読める。

## 事実: Conductorがポータブルなpluginになった

Google の発表によると、Conductor はもともと Gemini CLI 向けの extension として提供されていた。今回の更新では、skills、rules、MCP servers、hooks を一つの package に含められる plugin へ移行した。これにより、厳密なコマンド列を順番に覚える運用から、AI アシスタントと自然言語で会話しながら context、spec、plan を作る運用へ寄せる、と説明されている。

公式ブログで強調されているのは、`spec.md` や `plan.md` のような永続 Markdown 成果物は残るという点だ。会話が自然になっても、設計と計画をリポジトリ側へ保存する思想は維持される。AI が必要に応じて context を更新し、完了した task を plan 上でチェックするため、人間はアーキテクチャやレビュー判断へ集中しやすくなる、という狙いである。

もう一つの事実は、利用対象の広がりだ。公式ブログは、Conductor が Gemini CLI 専用の extension から、Antigravity CLI、Claude などで使える portable capability になると説明している。README でも、Antigravity では `agy plugins install` で導入でき、Claude Code では plugin marketplace 経由の導入が案内されている。

この方向性は [Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) と同じ流れにある。Managed Agents は agent 実行環境の足場を API 側へ寄せた話だった。Conductor Plugin は、開発者がローカルや IDE で agent に任せる作業の状態を、リポジトリで管理できる形へ寄せる話である。どちらも、AI エージェントを一問一答ではなく、継続する作業単位として扱うための更新だ。

## 事実: specとplanがレビュー可能な成果物になる

Conductor の README は、作業ライフサイクルを Context、Spec & Plan、Implement の流れとして説明している。プロジェクト初期設定では product、product guidelines、tech stack、workflow などの文脈を作り、feature や bug fix では track を開始して `conductor/tracks/<track_id>/spec.md`、`plan.md`、`metadata.json` を生成する。

実装時には、AI エージェントが `plan.md` に沿って作業し、進捗を更新する。完了後には review や revert のコマンドも用意される。特に revert は、単なる commit hash ではなく track、phase、task のような論理単位を意識する設計として説明されている。これは、AI が作った差分を「どの機能の、どの段階の、どの計画に対応するか」で扱いたい開発チームにとって重要だ。

ここから分かるのは、Conductor が単に prompt template を配るものではないということだ。仕様、計画、進捗、レビュー、戻し方を一つの作業管理モデルへ置く。従来のチケット、設計メモ、PR description、AI チャット、レビュー指摘が分散していたチームでは、この整理が効く可能性がある。

ただし、これは万能ではない。`spec.md` が存在するだけで仕様が正しくなるわけではないし、`plan.md` があっても計画の粒度が悪ければレビューしにくい。Conductor は作業状態を残す枠を提供するが、何を合格条件にするか、誰が plan を承認するか、どの変更を人間レビューに戻すかはチーム側の設計である。

## 分析: 日本企業ではAI作業の説明責任に効く

ここからは分析だ。

日本企業で AI コーディングエージェントを入れるとき、最初に見える価値は実装速度である。しかし、本番に近づくほど問題になるのは速度より説明責任だ。なぜこの設計にしたのか。ユーザー要件をどこまで満たしたのか。既存の設計規約を読んだのか。レビューで見つかった懸念をどう直したのか。これらがチャット履歴の奥に埋もれると、チームの知識として残らない。

Conductor Plugin の価値は、この作業文脈をリポジトリへ引き戻す点にある。仕様書、計画、進捗が version control の対象になれば、PR で差分を確認できる。新しい担当者が入っても、前回の AI セッションを再現しやすい。委託先や別チームへ引き継ぐときも、口頭説明ではなく track と plan を渡せる。

この観点は [Google ADK と A2A のクロス言語連携](/blog/google-adk-a2a-cross-language-agents-2026/) ともつながる。A2A が agent 間の契約を明示する話だとすれば、Conductor は人間と coding agent の間の作業契約を明示する話に近い。どちらも「AI が何となく動いた」状態から、契約、成果物、ログを持つ状態へ寄せる。

特に効くのは、要件の解釈ミスが高くつく領域だ。業務システム、金融、医療、自治体、製造業の社内ツールでは、仕様の小さな誤解が監査、運用、顧客説明へ波及する。AI に実装を任せるなら、実装前に spec と plan を見て止められる設計が必要になる。Conductor は、その「実装前に止める」工程を AI ワークフロー内へ入れる候補になる。

## 導入前に決めるべき統制

第一に、Conductor の成果物を誰が所有するかを決める。`conductor/product.md` や `workflow.md` は、単なる開発者メモではなく、AI が作業判断に使うルールになる。プロダクト責任者、開発基盤、セキュリティ、デザイン、QA のどの領域がどこまでレビューするかを決めなければならない。

第二に、plugin と MCP と hooks の承認範囲を分ける。Conductor Plugin は plugin package として skills、rules、MCP servers、hooks を扱える。便利な一方で、AI エージェントの能力を広げる入口でもある。社内で許可する plugin source、更新タイミング、workspace-level installation の扱い、外部サービス接続、hooks の変更権限を明確にすべきだ。

第三に、plan 承認を必須にする範囲を決める。小さな文言修正なら AI がそのまま実装してよいかもしれない。一方、データモデル変更、認証、課金、権限、顧客データ、インフラ変更は、実装前に spec と plan を人間が確認するべきだ。Conductor を入れるなら、どの track は自動実装可、どの track は承認必須かを分けたい。

第四に、レビューと revert を運用に入れる。AI が plan 通りに作ったとしても、結果が正しいとは限らない。[Google Jules のプロアクティブ評価](/blog/google-jules-proactive-coding-agent-eval-2026/) でも、agent の価値は実行結果だけでなく、何を根拠に判断したかで測る必要があった。Conductor の review や revert は、その評価と修正の入口になる。

第五に、トークン消費と作業粒度を見る。README は、spec-driven approach は context、spec、plan を読み分析するため、特に大きな project や長い計画で token consumption が増え得ると注意している。大規模リポジトリでは、track の粒度、読む文書、実行対象ディレクトリを絞らないと、コストと待ち時間が増える。

## まとめ

Conductor Plugin の Antigravity 対応は、AI コーディングを「チャットでお願いしてコードを書かせる」段階から、仕様、計画、進捗、レビューをリポジトリ上で扱う段階へ進める更新だ。Google は Antigravity、Managed Agents、ADK/A2A のように agent 実行面を広げてきたが、Conductor はその作業状態を人間が確認できる形へ戻す役割を持つ。

日本の開発チームは、Conductor を単なる便利プラグインとしてではなく、AI エージェント作業の統制層として評価すべきだ。spec と plan を誰が承認し、plugin と hooks を誰が管理し、どの track まで自動実装を許し、どの差分を人間レビューに戻すかを決める。モデル性能の比較だけではなく、AI が作った作業状態をチームの資産として残せるかが、導入判断の分かれ目になる。

## 出典

- [Evolving Spec-Driven Development: Conductor Now Supports Antigravity](https://developers.googleblog.com/evolving-spec-driven-development-conductor-now-supports-antigravity/) - Google Developers Blog, 2026-07-16
- [gemini-cli-extensions/conductor](https://github.com/gemini-cli-extensions/conductor) - GitHub
- [Getting started with Spec Driven Development in Antigravity](https://codelabs.developers.google.com/codelabs/getting-started-with-spec-driven-development-in-antigravity) - Google Codelabs
