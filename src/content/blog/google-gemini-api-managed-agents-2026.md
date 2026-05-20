---
title: 'Gemini API Managed Agentsで変わる開発基盤'
description: 'GoogleがGemini API Managed Agentsを公開。隔離Linux環境で動くエージェント基盤を、日本の開発チームがどう評価し運用設計に落とすか整理する。AI StudioやInteractions APIとの関係も見る。'
pubDate: '2026-05-20'
category: 'news'
tags: ['Google', 'Gemini API', 'AIエージェント', '開発者ツール', '開発基盤']
series: 'google-gemini-api-agent-platform-2026'
seriesTitle: 'Google Gemini APIエージェント基盤アップデート'
draft: false
---

Google が **2026年5月19日**、Gemini API に **Managed Agents** を追加した。これは単なる新しいサンプルエージェントではない。1 回の API call で、推論し、ツールを使い、コードを実行するエージェントを、隔離された Linux 環境内で立ち上げられるようにする更新だ。

これまで Gemini API の開発者向け更新では、[Gemini API Docs MCP と Agent Skills](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) のようにエージェントへ最新の公式知識を渡す話や、[Gemini API File Search のマルチモーダルRAG](/blog/google-gemini-file-search-multimodal-rag-2026/) のように文脈を検索する話が続いていた。今回の Managed Agents は、その一段下にある「実行環境」へ踏み込んだものだ。

日本の開発チームにとって重要なのは、「Google がエージェントを作れるようにした」ことではない。エージェントを本番運用するときに重い、サンドボックス、ファイル状態、ツール実行、Web 参照、長いセッションの再開を、Gemini API 側のマネージド基盤へ寄せられる可能性が出てきたことだ。

## 事実: Gemini APIにManaged Agentsが入った

Google の公式発表によると、Managed Agents は Gemini API でプレビュー提供される。中核にあるのは、新しい **Antigravity agent** だ。Google はこれを Gemini 3.5 Flash 上に構築されたエージェントハーネスとして説明し、Interactions API と Google AI Studio から使えるとしている。

このエージェントは、リモートの Linux 環境をプロビジョニングし、その中で計画、ツール呼び出し、コード実行、ファイル管理、Web ブラウジングを行える。さらに、後続の呼び出しで同じ環境を受け取って再開できるため、ファイルと状態を保ったまま複数ターンの作業を続けられる。

もう一つのポイントは、エージェント定義の置き方だ。Google は、複雑なオーケストレーションコードを書く代わりに、`AGENTS.md` や `SKILL.md` のような Markdown ファイルで instructions や skills を定義し、managed agent として登録できると説明している。これは、コーディングエージェントの文脈で広がってきた「リポジトリにエージェント向け仕様を置く」流れを、API 商品の側へ持ち込む動きだ。

企業向けには、Gemini Enterprise Agent Platform 上の managed agents が private preview とされている。これは [Gemini Enterprise Agent Platform](/blog/google-gemini-enterprise-agent-platform-2026-04-23/) で見えていた企業向け統制基盤と、開発者向け Gemini API の間を近づける発表でもある。

## 分析: 自前agent harnessをどこまで持つべきか

今回の本質は、エージェント開発の面倒な部分を Google がどこまで引き受けるか、という話だ。

チャット API を呼ぶだけなら、アプリ側の責任は比較的分かりやすい。入力を作り、モデルへ送り、出力を受け取り、必要なら関数呼び出しを実行する。しかしエージェントになると一気に責任範囲が広がる。作業ディレクトリをどう隔離するか。コード実行をどこで許すか。Web 取得をどこまで許可するか。失敗時にどの状態から再開するか。長いタスクのログをどう見るか。

多くのチームは、ここを最初は小さなスクリプトで作る。ところが本番に近づくほど、サンドボックス、ジョブキュー、ストレージ、秘密情報、監査ログ、権限、ネットワーク制御、コスト制限が必要になる。Managed Agents は、この重い足場を Gemini API 側へ寄せる提案だと読める。

ただし、全部を任せればよいわけではない。エージェントが動く環境を Google が用意しても、どのデータを渡すか、どのツールを許すか、どの結果を人間承認に回すかは、利用側が設計しなければならない。[Gemini API の Flex と Priority](/blog/google-gemini-api-flex-priority-2026/) でも見たように、エージェント時代の設計は「モデルの性能」だけでなく、実行の重要度、待ち時間、失敗時の扱いまで含めて考える必要がある。

## 日本の開発チームで効く領域

まず効きやすいのは、社内向けの開発支援エージェントだ。たとえば、リポジトリを読み、Issue を整理し、テストを動かし、修正案を作るような処理では、ファイル状態を持つ実行環境が必要になる。Managed Agents がその足場を提供できるなら、小規模チームでも自前のサンドボックス基盤を作る前に検証できる。

次に、調査とレポート作成の自動化がある。Web から最新情報を集め、社内の指示ファイルに従い、途中生成物をファイルとして残し、最後に Markdown や JSON で返すようなワークフローだ。日本企業では、規制、補助金、競合、セキュリティ情報、SaaS 更新を継続監視する用途が多い。毎回 stateless にやり直すより、環境とファイルを保持できるほうが実装しやすい。

3つ目は、AI エージェントを組み込む SaaS だ。顧客ごとに安全に隔離された作業空間を作り、許可されたファイルだけを渡し、ツール実行の結果を UI に戻す。ここでは、Managed Agents の「隔離された環境」という位置づけが効く。ただし、顧客データを扱う場合は、Google 側のプレビュー条件、データ保持、リージョン、ログ、契約条項を確認する必要がある。

## 導入前に決めるべきこと

最初に決めるべきは、エージェントへ渡す権限の境界だ。Web ブラウジング、ファイル編集、コード実行ができるエージェントは便利だが、同時に危険でもある。社内データを読むだけなのか、外部 API を叩けるのか、生成物を自動で反映してよいのかを、ユースケースごとに切る必要がある。

次に、状態の扱いだ。Managed Agents は後続呼び出しで環境を再開できると説明されている。これは長い作業には便利だが、保持されるファイルに個人情報や顧客情報が含まれる可能性がある。日本企業では、セッション終了時の削除、保存期間、再開権限、監査ログの範囲を先に確認したほうがよい。

3つ目は、人間レビューの位置だ。コード修正、設定変更、顧客向け文章、法務・金融判断のような領域では、エージェントが最後まで走れることと、自動で採用してよいことは別だ。Managed Agents を使う場合でも、最終反映前の diff、出典、実行ログ、承認者を UI に出す設計が必要になる。

4つ目は、コストと優先度だ。エージェントは一問一答より長く走る。調査、コード実行、再試行、Web 参照、ファイル処理が入るため、トークンだけでなく実行時間や呼び出し回数も設計対象になる。高優先の顧客対応と、夜間に回せる調査タスクを同じ扱いにすると、コストも体験も崩れやすい。

## まとめ

Gemini API Managed Agents は、Google がエージェント開発を「モデル呼び出し」から「実行基盤」へ広げた発表だ。Antigravity agent、隔離 Linux 環境、Interactions API、Google AI Studio、`AGENTS.md` / `SKILL.md` による定義を組み合わせ、開発者が自前で作っていた agent harness の一部をマネージド化しようとしている。

日本の開発者やプロダクトチームは、すぐ本番投入するより、まず限定された用途で検証するのがよい。社内開発支援、調査自動化、SaaS 内の作業エージェントのように、ファイル状態と実行環境が必要な領域から試す価値がある。一方で、権限、データ保持、人間レビュー、コスト制御は自動では解けない。

Google は Docs MCP、File Search、Flex/Priority、Enterprise Agent Platform、そして今回の Managed Agents を通じて、Gemini API をエージェント基盤へ寄せている。モデル比較だけで判断する段階は終わりつつある。これからは、どのベンダーのエージェント基盤に、どの作業を、どの権限で置くかが設計論点になる。

## 出典

- [Introducing Managed Agents in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/managed-agents-gemini-api/) - Google, 2026-05-19
- [Agents Overview](https://ai.google.dev/gemini-api/docs/agents) - Google AI for Developers
- [Interactions API](https://ai.google.dev/gemini-api/docs/interactions) - Google AI for Developers
- [I/O 2026: Antigravity 2.0 と新しい Gemini のエージェントツール](https://blog.google/intl/ja-jp/company-news/technology/google-io-2026-developer-highlights/) - Google Japan, 2026-05-20
