---
article: 'google-gemini-api-managed-agents-2026'
level: 'child'
---

Google が Gemini API に **Managed Agents** を追加した。これは、開発者が 1 回の API call で、推論、ツール利用、コード実行を行うエージェントを立ち上げられるようにするものだ。

ポイントは、エージェントが隔離された Linux 環境で動くことだ。Google の説明では、Antigravity agent という新しいエージェントハーネスを使い、Gemini 3.5 Flash を土台にしている。Interactions API と Google AI Studio から使える。

## 何が便利なのか

普通の Gemini API は、質問を送り、答えを受け取る使い方が中心だ。一方でエージェントは、途中でファイルを作ったり、Web を見たり、コードを実行したり、何段階も計画を進めたりする。

これを自前で作ると、サンドボックス、ファイル保存、再開、ツール実行、ログ、権限管理が必要になる。Managed Agents は、その実行基盤を Google 側でかなり引き受けようとする仕組みだ。

エージェントの振る舞いは、`AGENTS.md` や `SKILL.md` のような Markdown ファイルで定義できると説明されている。つまり、コードだけでなく、指示やスキルもバージョン管理しやすくなる。

## 日本のチームで使えそうな場面

1つ目は、開発支援だ。リポジトリを読ませ、テストを動かし、修正案を作らせるような作業では、ファイルを扱える環境が必要になる。Managed Agents は、こうした作業を試す足場になりうる。

2つ目は、調査自動化だ。Web から情報を集め、途中メモを作り、最後にレポートへまとめるような処理では、状態を持って再開できることが役に立つ。

3つ目は、社内ツールや SaaS への組み込みだ。顧客ごとに作業空間を分け、許可された資料だけを使わせるような用途で、隔離環境の考え方が重要になる。

## 注意点

便利だからといって、何でも任せるべきではない。コード実行や Web ブラウジングができるエージェントは、権限設計を間違えると危険だ。

最初に決めるべきなのは、どのファイルを読めるか、どの外部サイトへアクセスできるか、結果を自動反映してよいか、人間がどこで確認するかだ。特に日本企業では、顧客情報、個人情報、契約文書、社外秘資料の扱いを先に決める必要がある。

また、Managed Agents はプレビュー提供だ。正式な本番導入では、料金、ログ、データ保持、リージョン、企業向け契約条件を確認したほうがよい。

## まとめ

Gemini API Managed Agents は、AI エージェントを作るための「実行環境」を API 側へ寄せる動きだ。モデルだけでなく、エージェントが動く場所、状態を保つ仕組み、ツールを使う仕組みが重要になっている。

日本の開発チームは、まず社内向けの小さな検証から始めるのがよい。開発支援、調査、社内レポート作成のように、失敗しても影響が限定される領域で、権限とレビューを明確にした上で試すべきだ。

## 出典

- [Introducing Managed Agents in the Gemini API](https://blog.google/innovation-and-ai/technology/developers-tools/managed-agents-gemini-api/) - Google, 2026-05-19
- [Agents Overview](https://ai.google.dev/gemini-api/docs/agents) - Google AI for Developers
- [I/O 2026: Antigravity 2.0 と新しい Gemini のエージェントツール](https://blog.google/intl/ja-jp/company-news/technology/google-io-2026-developer-highlights/) - Google Japan, 2026-05-20
