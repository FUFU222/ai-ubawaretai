/**
 * RSS フィードからニュースを取得し、新着・重要度でフィルタリングする
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import Parser from 'rss-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const parser = new Parser({ timeout: 10000 });

/**
 * 全RSSフィードを取得して直近のニュースを返す
 * @param {number} hoursBack - 何時間前までのニュースを取得するか
 * @returns {Promise<Array>} ニュース項目の配列
 */
export async function fetchAllFeeds(hoursBack = 48) {
  const sources = JSON.parse(
    readFileSync(resolve(__dirname, 'sources.json'), 'utf-8'),
  );

  const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  const allItems = [];

  const results = await Promise.allSettled(
    sources.feeds.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return (feed.items || []).map((item) => ({
          title: item.title?.trim() || '',
          link: item.link || '',
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          summary:
            item.contentSnippet?.slice(0, 500) ||
            item.content?.slice(0, 500) ||
            '',
          source: source.name,
          sourceType: source.type,
          tier: source.tier,
        }));
      } catch (err) {
        console.error(`[WARN] ${source.name} の取得失敗: ${err.message}`);
        return [];
      }
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  // フィルタ: cutoff以降 & タイトルあり
  const recent = allItems.filter(
    (item) => item.pubDate >= cutoff && item.title.length > 0,
  );

  // ソート: 公式ブログ > ニュース > エキスパート > コミュニティ、新しい順
  const typePriority = { official: 4, news: 3, expert: 2, newsletter: 2, community: 1 };
  recent.sort((a, b) => {
    const pDiff = (typePriority[b.sourceType] || 0) - (typePriority[a.sourceType] || 0);
    if (pDiff !== 0) return pDiff;
    return b.pubDate - a.pubDate;
  });

  return recent;
}

/**
 * 既存記事のスラッグ一覧を取得して重複チェック用に返す
 */
export function getExistingSlugs() {
  const blogDir = resolve(__dirname, '../src/content/blog');
  try {
    return readdirSync(blogDir)
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
      .map((f) => f.replace(/\.(md|mdx)$/, ''));
  } catch {
    return [];
  }
}

/**
 * タイトルからスラッグ候補を生成（重複チェック用）
 */
export function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

// CLI 実行時
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const items = await fetchAllFeeds(48);
  console.log(`\n📰 ${items.length} 件のニュースを取得\n`);
  items.slice(0, 15).forEach((item, i) => {
    console.log(
      `${i + 1}. [${item.source}] ${item.title}`,
    );
    console.log(`   ${item.link}`);
    console.log(`   ${item.pubDate.toISOString()}\n`);
  });
}
