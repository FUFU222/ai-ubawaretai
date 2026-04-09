/**
 * AI ニュース記事自動生成パイプライン
 *
 * 1. RSS フィードからニュースを取得
 * 2. 既存記事との重複を除外
 * 3. 最もニュース性の高い話題を選定
 * 4. ソースURLから詳細情報を取得
 * 5. Claude API で日本語記事を生成
 * 6. MDX ファイルとして保存
 */
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchAllFeeds, getExistingSlugs, hasLikelyDuplicateSlug, titleToSlug } from './fetch-news.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- 設定 ----------
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;
const HOURS_BACK = Number(process.env.HOURS_BACK) || 48;

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY が設定されていません');
  process.exit(1);
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ---------- 記事生成プロンプト ----------
function buildPrompt(newsItem, sourceContent) {
  return `あなたはAI業界ニュース分析ブログ「AIに仕事を奪われたい」の記事を執筆するライターです。

## ブログの人格・トーン
- 一人称は「自分」または「僕」
- 元消防士 → SNSマーケ会社のエンジニアに転身した人物
- 丁寧だけど堅すぎない。知的な話題でテンションが上がる時は崩す
- 「これ、めちゃくちゃ面白いんですけど」「ここが本質的に難しいところで」のようなゆる言語学ラジオ的な知的カジュアルトーン
- 乱暴な言葉遣いはしない
- 一文の長さにバラつきを出す。短くバンと切る文と、ちょっと長めに続く文を混ぜる

## 重要: 記事のスタンス
この記事は「使ってみた体験談」ではありません。
海外ソースから得た事実情報に基づく報道 + 考察記事です。

以下のトーンで書いてください:
- 「〇〇が発表されたようです」「〇〇という機能が追加されました」
- 「これは〇〇に使えそうだ」「〇〇という使い方ができるかもしれない」
- 「公式ブログによると〜」「TechCrunchの報道では〜」
- 事実と考察を明確に分ける。推測は「〜かもしれない」「〜と考えられる」で統一

## 記事の構造ルール
- タイトル: 30〜40文字。日本語。検索キーワードを含む
- リード文: 3〜5行で何が起きたかを簡潔に伝える
- H2見出し: 3〜5個。見出しだけで記事の流れがわかるように
- 本文: 各H2セクション300〜600字。合計2,000〜3,500字
- まとめ: 短く。今後の展望や注目ポイントを1〜2文
- 出典: 記事末尾にソースURLを明記

## 禁止事項
- 「〜になります」「〜となっております」等の過剰な敬語
- 「いかがでしたか？」「参考になれば幸いです」等の定型フレーズ
- 箇条書きの多用（使うなら3項目まで）
- 同じ語尾の連続
- 「調べてみたところ」「ある調査によると」等のAI記事っぽいフレーズ
- 「筆者」「当サイト」等のメディア的一人称
- 「自分が使ってみた」「試してみた」等の体験談フレーズ

## ソース情報
タイトル: ${newsItem.title}
ソース: ${newsItem.source}
URL: ${newsItem.link}
公開日: ${newsItem.pubDate.toISOString()}
概要: ${newsItem.summary}

${sourceContent ? `## ソースの詳細内容（抜粋）\n${sourceContent.slice(0, 3000)}` : ''}

## 出力形式
以下のフォーマットでMarkdownを出力してください。frontmatter（---で囲まれたYAML）から始めてください。
コードブロック(\`\`\`)で囲まないでください。

---
title: "日本語タイトル（30〜40文字）"
description: "メタディスクリプション（80〜120文字）"
pubDate: "${new Date().toISOString().split('T')[0]}"
category: "news"
tags: [企業名またはプロダクト名を1つ以上 + テーマタグを2〜4個]
draft: false
---

（本文をここに書く。H2見出しから始める。）`;
}

// ---------- ソース詳細取得 ----------
async function fetchSourceContent(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; AiUbawaretaiBot/1.0; +https://ai-ubawaretai.pages.dev)',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return '';
    const html = await res.text();
    // HTMLタグを除去して本文テキストを取得
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);
  } catch {
    return '';
  }
}

// ---------- メイン ----------
async function main() {
  console.log('📰 ニュースフィードを取得中...');
  const items = await fetchAllFeeds(HOURS_BACK);
  console.log(`   ${items.length} 件取得`);

  if (items.length === 0) {
    console.log('⚠️ 新しいニュースがありません。終了します。');
    process.exit(0);
  }

  // 既存記事との重複チェック
  const existingSlugs = getExistingSlugs();
  const candidates = items.filter((item) => !hasLikelyDuplicateSlug(existingSlugs, item.title));

  console.log(`   重複除外後: ${candidates.length} 件`);

  if (candidates.length === 0) {
    console.log('⚠️ 新しいネタがありません。終了します。');
    process.exit(0);
  }

  // 上位の候補を表示
  const top = candidates.slice(0, 5);
  console.log('\n🔥 記事候補トップ5:');
  top.forEach((item, i) => {
    console.log(`   ${i + 1}. [${item.source}] ${item.title}`);
  });

  // 1位のニュースで記事を生成
  const selected = top[0];
  console.log(`\n✍️  記事生成中: ${selected.title}`);

  // ソース詳細を取得
  console.log('   ソース詳細を取得中...');
  const sourceContent = await fetchSourceContent(selected.link);

  // Claude API で記事生成
  console.log('   Claude API で記事を生成中...');
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: 'user',
        content: buildPrompt(selected, sourceContent),
      },
    ],
  });

  const articleContent = message.content[0].text;

  // frontmatter からスラッグを生成
  const titleMatch = articleContent.match(/title:\s*"([^"]+)"/);
  const articleTitle = titleMatch ? titleMatch[1] : selected.title;
  const slug = titleToSlug(articleTitle) || `news-${Date.now()}`;

  // ソース出典を末尾に追加
  const sourceAttribution = `\n\n---\n\n**出典:** [${selected.title}](${selected.link}) — ${selected.source}`;
  const finalContent = articleContent + sourceAttribution;

  // ファイル保存
  const outputPath = resolve(
    __dirname,
    `../src/content/blog/${slug}.md`,
  );
  writeFileSync(outputPath, finalContent, 'utf-8');

  console.log(`\n✅ 記事を保存しました: ${outputPath}`);
  console.log(`   タイトル: ${articleTitle}`);
  console.log(`   スラッグ: ${slug}`);
  console.log(`   ソース: ${selected.source} - ${selected.link}`);

  return { slug, title: articleTitle, path: outputPath };
}

main().catch((err) => {
  console.error('❌ エラー:', err.message);
  process.exit(1);
});
