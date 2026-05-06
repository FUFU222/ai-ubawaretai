import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('article pages render blog navigation rails without leading with series navigation', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const articleHtml = readFileSync(
		join(rootDir, 'dist', 'blog', 'github-copilot-gpt-55-general-availability-2026', 'index.html'),
		'utf8',
	);

	const shellIndex = articleHtml.indexOf('class="article-shell"');
	const primaryIndex = articleHtml.indexOf('class="article-primary"');
	const leftRailIndex = articleHtml.indexOf('class="article-left-rail"');
	const rightRailIndex = articleHtml.indexOf('class="article-right-rail"');
	const seriesNavIndex = articleHtml.indexOf('class="series-nav');
	const proseIndex = articleHtml.indexOf('data-article-level-target');

	assert.notEqual(shellIndex, -1, 'expected article shell layout');
	assert.notEqual(primaryIndex, -1, 'expected primary article column');
	assert.notEqual(leftRailIndex, -1, 'expected blog navigation left rail');
	assert.notEqual(rightRailIndex, -1, 'expected series right rail');
	assert.notEqual(seriesNavIndex, -1, 'expected series nav in a side rail');
	assert.notEqual(proseIndex, -1, 'expected article body target');
	assert.ok(primaryIndex < leftRailIndex, 'primary content should stay first in DOM order');
	assert.ok(seriesNavIndex > rightRailIndex, 'series nav should render inside the right rail');
	assert.ok(proseIndex < seriesNavIndex, 'series nav should no longer sit before the article body');
	assert.match(articleHtml, /ブログ内を移動/);
	assert.match(articleHtml, /カテゴリ/);
	assert.match(articleHtml, /おすすめ記事/);
	assert.match(articleHtml, /最新記事/);
});
