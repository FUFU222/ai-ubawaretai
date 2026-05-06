import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

function countMatches(html, pattern) {
	return (html.match(pattern) ?? []).length;
}

function assertEveryListedArticleHasThumbnail(html, itemPattern, context) {
	const itemCount = countMatches(html, itemPattern);
	const thumbnailCount = countMatches(
		html,
		new RegExp(`data-post-thumbnail-context="${context}"`, 'g'),
	);

	assert.ok(itemCount > 0, `expected ${context} to render article items`);
	assert.equal(
		thumbnailCount,
		itemCount,
		`expected every ${context} item to render a post thumbnail`,
	);
}

test('article list sections render a thumbnail for every listed post', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const homeHtml = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');
	const archiveHtml = readFileSync(join(rootDir, 'dist', 'blog', 'index.html'), 'utf8');
	const articleHtml = readFileSync(
		join(rootDir, 'dist', 'blog', 'github-copilot-gpt-55-general-availability-2026', 'index.html'),
		'utf8',
	);
	const categoryHtml = readFileSync(join(rootDir, 'dist', 'category', 'OpenAI', 'index.html'), 'utf8');
	const seriesHtml = readFileSync(
		join(rootDir, 'dist', 'series', 'github-copilot-2026', 'index.html'),
		'utf8',
	);
	const seriesPageSource = readFileSync(join(rootDir, 'src', 'pages', 'series', '[slug].astro'), 'utf8');

	assertEveryListedArticleHasThumbnail(homeHtml, /class="next-item"/g, 'home-next');
	assertEveryListedArticleHasThumbnail(homeHtml, /class="dispatch-row"/g, 'home-latest');
	assertEveryListedArticleHasThumbnail(archiveHtml, /class="dispatch-item"/g, 'archive-list');
	assertEveryListedArticleHasThumbnail(articleHtml, /class="recommended-link"/g, 'sidebar-recommended');
	assertEveryListedArticleHasThumbnail(articleHtml, /class="latest-link"/g, 'sidebar-latest');
	assertEveryListedArticleHasThumbnail(articleHtml, /class="series-item(?:\s|")/g, 'series-nav');
	assertEveryListedArticleHasThumbnail(articleHtml, /class="related-card"/g, 'related-posts');
	assertEveryListedArticleHasThumbnail(categoryHtml, /class="topic-post-row"/g, 'category-list');
	assertEveryListedArticleHasThumbnail(seriesHtml, /class="series-list-link"/g, 'series-list-page');
	assert.doesNotMatch(seriesPageSource, /series-list-thumb[\s\S]{0,120}display:\s*none/);
});
