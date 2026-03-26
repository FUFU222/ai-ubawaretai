# Cowork タスク指示書: AI ニュース記事自動生成

## タスク概要
海外の AI 関連ニュースソースを調査し、日本語のブログ記事を1本生成して push する。

## 実行手順

### Step 1: ニュースソース調査
以下のソースから直近24時間の注目ニュースを WebSearch で調査する:

**Tier 1（公式ブログ — 最優先）**
- OpenAI Blog (openai.com/blog)
- Anthropic Blog (anthropic.com/news)
- Google AI Blog (blog.google/technology/ai)
- GitHub Blog (github.blog)
- Hugging Face Blog (huggingface.co/blog)
- Meta AI Blog (ai.meta.com/blog)

**Tier 2（テック系メディア）**
- TechCrunch AI (techcrunch.com/category/artificial-intelligence)
- The Verge AI (theverge.com/ai-artificial-intelligence)
- MIT Technology Review (technologyreview.com)
- Ars Technica (arstechnica.com/ai)

**Tier 3（開発者・エキスパート）**
- Simon Willison (simonwillison.net)
- Hacker News の AI 関連で100pt超の投稿

検索クエリ例:
- "AI tool launch site:techcrunch.com OR site:theverge.com"
- "OpenAI announcement 2026"
- "Claude new feature 2026"
- "GitHub Copilot update 2026"

### Step 2: トピック選定
以下の基準で1つ選ぶ:

**選定基準（優先度順）**
1. AI ツールの新規リリース・大型アップデート（Claude, ChatGPT, Copilot, Cursor 等）
2. 開発者向け AI サービスの新機能（API, SDK, プラットフォーム）
3. AI 業界の重要な動き（資金調達, 規制, オープンソース）
4. 実務に影響する AI 技術の進展

**除外基準**
- 既に src/content/blog/ に類似記事がある話題
- 日本のユーザーに関係が薄い地域限定ニュース
- 純粋な学術論文（実用性が低いもの）

### Step 3: 詳細調査
選んだトピックについて:
1. 公式ソース（プレスリリース、ブログ記事）を WebSearch で読む
2. 関連する技術的な詳細を確認する
3. 競合や類似サービスとの違いを把握する

### Step 4: 記事執筆
以下のフォーマットで Markdown ファイルを作成する。

**ファイルパス:** `src/content/blog/{スラッグ}.md`
**スラッグ:** 英語のケバブケース（例: `openai-gpt5-release-2026`）

```markdown
---
title: "日本語タイトル（30〜40文字）"
description: "メタディスクリプション（80〜120文字）"
pubDate: "YYYY-MM-DD"
category: "news"
tags: ["タグ1", "タグ2", "タグ3"]
draft: false
---

（本文）
```

**記事のトーン・スタイル:**
- 一人称は「自分」または「僕」
- 知的カジュアル。「これ、めちゃくちゃ面白いんですけど」的なテンション
- 一文の長さにバラつきを出す

**重要: 記事のスタンス**
「使ってみた」体験談ではない。事実情報 + 考察の記事。
- ✅「〇〇が発表されたようです」
- ✅「これは〇〇に使えそうだ」
- ✅「公式ブログによると〜」
- ✅「〇〇という使い方ができるかもしれない」
- ❌「実際に使ってみた」
- ❌「試してみたところ」

**記事の構造:**
- リード文: 3〜5行で何が起きたかを簡潔に
- H2 見出し: 3〜5個
- 各セクション: 300〜600字
- 合計: 2,000〜3,500字
- まとめ: 今後の展望や注目ポイントを1〜2文
- 出典: 記事末尾にソース URL を明記

**禁止事項:**
- 「〜になります」「〜となっております」等の過剰な敬語
- 「いかがでしたか？」「参考になれば幸いです」
- 箇条書きの多用（使うなら3項目まで）
- 同じ語尾の連続（「〜です。〜です。〜です。」は禁止）
- 「筆者」「当サイト」
- 「調べてみたところ」「ある調査によると」

### Step 5: コミット & プッシュ
```
git add src/content/blog/{作成したファイル}
git commit -m "article: {記事タイトルの要約}"
git push origin main
```

## 実行条件
- 新しいニュースが見つからない場合は何もせずに終了する（無理に記事を作らない）
- 1回の実行で生成する記事は **1本のみ**
- category は基本 "news" だが、内容に応じて "ai-tools" や "comparison" も可

## 推奨スケジュール
- 3時間おき（1日8本ペース）
- または6時間おき（1日4本ペース）で様子を見て調整
