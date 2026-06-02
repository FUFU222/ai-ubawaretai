---
article: 'google-gemini-35-flash-api-stable-agents-2026'
level: 'expert'
---

Gemini API のモデル一覧で **Gemini 3.5 Flash** が `gemini-3.5-flash` の Stable モデルとして示されたことは、モデル性能ニュースとしてだけ読むと少し見誤る。より重要なのは、Google が Gemini API をエージェント開発基盤として整えていく中で、どのモデルを本番候補に置くのかが見え始めたことだ。

直近の Google は、[Gemini API Managed Agents](/blog/google-gemini-api-managed-agents-2026/) で隔離 Linux 環境とエージェント実行を示し、[Gemini API Docs MCP と Agent Skills](/blog/google-gemini-api-docs-mcp-agent-skills-2026/) で公式知識をエージェントに渡す仕組みを整え、[Gemini API File Search](/blog/google-gemini-file-search-multimodal-rag-2026/) でマルチモーダルRAGの部品を出してきた。Gemini 3.5 Flash の Stable 表示は、この一連の部品を動かすモデル選定の問題と見るべきだ。

## 事実関係の整理

一次情報として確認できる点は次の通りだ。

Google AI for Developers の Models ページは 2026年6月1日 UTC に更新され、Gemini 3.5 Flash を Gemini 3 系列に掲載している。説明では、agentic and coding tasks に対する sustained frontier performance が強調され、ステータスは Stable とされる。同じページでは Stable / Preview / Latest / Experimental の扱いも説明され、production app では specific stable model の利用が推奨される文脈がある。

Google DeepMind の Gemini 3.5 Flash ページでは、モデルの用途として agentic coding、advanced reasoning、multimodal understanding、long context understanding が挙げられている。モデル情報には、1M input tokens、64k output tokens、January 2025 knowledge cutoff、function calling、structured output、Search as a tool、code execution が記載される。利用面では Gemini App、Gemini API、Gemini Enterprise、Gemini Enterprise Agent Platform、Google AI Mode、Google AI Studio、Google Antigravity、Android Studio が並ぶ。

評価情報では、Terminal-Bench 2.1、SWE-Bench Pro、MCP Atlas、Toolathlon、OSWorld-Verified、Finance Agent v2、GDPval-AA、CharXiv、MMMU-Pro、MRCR v2、Humanity's Last Exam、ARC-AGI-2 などが示されている。DeepMind の evaluation methodology PDF は、Gemini API の `gemini-3.5-flash` を用いた default sampling settings を前提に結果を整理していると説明する。

## Stable IDは技術より運用の話

Stable ID の価値は、技術的な新しさというより、変更管理のしやすさにある。

企業の本番AIシステムでは、モデル名は単なる設定値ではない。セキュリティレビュー、顧客説明、社内AI利用規程、障害時の切り戻し、コスト配賦、品質監査の対象になる。`gemini-flash-latest` のような alias を使えば新しい改善を追いやすいが、モデルの中身が変わる前提で監視しなければならない。`gemini-3.5-flash` のような Stable ID は、少なくとも「この機能はこのモデルを使っている」と説明しやすい。

ただし、Stable を絶対視するのも危ない。Stable は production app に向きやすいモデル指定という意味であって、企業ごとの契約、リージョン、データ保持、利用制限、障害時SLO、価格、レート制限まで自動で保証するものではない。日本企業で使うなら、モデルIDと同じくらい、契約条件と監査ログの保存方法を確認する必要がある。

設計上は、モデル指定をアプリコードに直書きするより、モデル台帳と設定管理に分けるほうがよい。たとえば、用途ごとに `general_chat`, `agentic_coding`, `document_rag`, `background_research` のような論理名を持ち、その裏に `gemini-3.5-flash` を割り当てる。移行時には論理名単位で評価をやり直し、差分を記録する。これなら、モデルを入れ替えても利用者向けの機能説明と変更管理が崩れにくい。

## エージェント用途での評価軸

Gemini 3.5 Flash を評価するなら、通常のチャット回答だけでは足りない。DeepMind が示す強みも、単発回答より agentic coding、tool use、long horizon tasks、multimodal understanding に寄っている。

まず見るべきは、タスク完了率ではなく、完了までの過程だ。エージェントは途中で検索し、コードを実行し、ファイルを書き換え、再試行する。最終出力が正しくても、途中で不要な外部アクセスをしたり、権限外のファイルを読もうとしたり、危険なコマンドを提案したりするなら、本番運用では問題になる。

次に、ツール呼び出しの安定性を見る必要がある。function calling と structured output に対応しているなら、JSON schema への適合率、引数の欠落、再試行時の自己修正、失敗時の説明を測る。Search as a tool を使う場合は、検索結果の根拠と本文の整合を確認する。code execution を使う場合は、実行環境の権限、タイムアウト、ネットワーク、ファイル保持、ログの可視性をセットで見る。

3つ目は、日本語要件での挙動だ。日本のプロダクト開発では、仕様書の主語が曖昧だったり、社内用語が多かったり、顧客要件と法務条件が同じ文書に混ざったりする。英語ベンチマークで良いモデルでも、日本語の曖昧さを勝手に補うと危険だ。評価セットには、日本語のIssue、障害報告、設計レビュー、ユーザー問い合わせ、法務コメントを匿名化して入れるべきだ。

## 長いコンテキストは設計責任を増やす

1M input tokens は大きな魅力だが、長いコンテキストを渡せるほど、利用側の責任も増える。

大きな入力上限があると、開発者はリポジトリや資料を丸ごと渡したくなる。しかし、AIがどの部分を根拠にしたのか分からなければ、レビューができない。さらに、古い仕様、廃止済みAPI、未公開の顧客情報、不要な個人情報が混ざると、モデルの出力品質だけでなくコンプライアンス上の問題になる。

そのため、長文入力はRAGや文脈選定と組み合わせるべきだ。File Search で候補を絞り、Docs MCP で公式ドキュメントを渡し、必要なファイルだけをプロンプトに含める。回答には根拠リンクやファイル名を残す。長いコンテキストは「全部入れれば安心」ではなく、「必要な根拠を失わずに絞れる」ことが重要になる。

この点は [Gemini API Flex/Priority](/blog/google-gemini-api-flex-priority-2026/) の設計とも関係する。長い文脈を扱うエージェントはコストとレイテンシが伸びやすい。リアルタイムでユーザーが待つ処理と、夜間に回せる調査処理を同じモデル・同じティアで流すと、費用対効果が見えなくなる。モデル、文脈量、service tier、実行時間をまとめて測る必要がある。

## 本番採用前のチェックリスト

実務では、次の観点を最低限そろえたい。

1つ目は、モデル指定のポリシーだ。本番は Stable ID を使うのか、特定の実験機能だけ latest を許すのかを決める。モデルID、利用機能、対象システム、データ分類、承認者、変更日を台帳化する。

2つ目は、タスク別の評価だ。一般チャット、コード修正、設計レビュー、障害調査、RAG回答、バックグラウンド調査を同じ指標で見ない。用途ごとに成功条件、許容レイテンシ、最大コスト、人間レビューの必要性を分ける。

3つ目は、権限境界だ。Gemini 3.5 Flash は tool use と code execution に対応するが、対応するから使ってよいとは限らない。どのツールを許すか、外部ネットワークへ出られるか、ファイルを書けるか、機密情報へアクセスできるかを用途ごとに切る。

4つ目は、根拠管理だ。長文入力やRAGを使う場合、出力に根拠を残す。モデルが答えた結論だけではなく、どのドキュメント、どの検索結果、どのログを使ったのかをレビュー可能にする。

5つ目は、失敗時の扱いだ。モデルがタイムアウトしたとき、ツール呼び出しが失敗したとき、予算上限に達したとき、別モデルへフォールバックするのか、人間へ渡すのかを決める。エージェント用途では、失敗時の途中状態とログが特に重要になる。

## 日本市場での位置づけ

日本企業にとって、Gemini 3.5 Flash は「速いモデル」以上の意味を持つ可能性がある。Google Workspace、Google Cloud、Android、Gemini Enterprise、AI Studio との接点が多く、既存のGoogle導入企業では検証しやすい導線があるからだ。

一方で、導線が多いほどガバナンスは難しくなる。開発者が Google AI Studio で試し、別チームが Vertex AI や Gemini Enterprise を使い、業務部門が Workspace や Gemini App で触ると、同じモデル名でも利用目的、データの種類、管理者、ログの場所が分散する。日本企業では、部署ごとのPoCが乱立しやすい。モデルが Stable になった段階で、PoCごとの利用条件を棚卸しする価値がある。

特にエージェント用途では、開発チームだけで完結しない。セキュリティ、法務、情報システム、データ管理、監査、現場部門が関わる。Gemini 3.5 Flash の評価は、ベンチマーク表を共有して終わりではなく、どの業務で、どのデータを、どの権限で、どのログを残して動かすかを決める場に持ち込むべきだ。

## まとめ

Gemini 3.5 Flash が Gemini API の Stable モデルとして示されたことは、Google のエージェント基盤が一段実務寄りになったサインだ。Managed Agents、Docs MCP、File Search、Flex/Priority といった周辺部品がある中で、`gemini-3.5-flash` は高速な agentic coding と tool use の本番候補になり得る。

ただし、採用判断は「ベンチマークで強い」だけでは足りない。Stable ID の変更管理、日本語要件での評価、ツール権限、長いコンテキストの根拠管理、コストとレイテンシ、失敗時のフォールバックをセットで見る必要がある。日本企業にとっての正しい初動は、全面展開ではなく、用途を絞った評価セットと運用ルールを作ることだ。

## 出典

- [Models | Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/models) - Google AI for Developers, last updated 2026-06-01 UTC
- [Gemini 3.5 Flash](https://deepmind.google/models/gemini/flash/) - Google DeepMind
- [Gemini 3.5](https://deepmind.google/models/gemini/) - Google DeepMind
- [Gemini 3.5 Flash - Evaluations Approach, Methodology & Results](https://deepmind.google/models/evals-methodology/gemini-3-5-flash) - Google DeepMind
