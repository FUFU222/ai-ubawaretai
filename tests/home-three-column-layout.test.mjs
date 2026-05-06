import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('home page renders as a three-column blog layout on desktop', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const homeHtml = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');
	const homeSource = readFileSync(join(rootDir, 'src', 'pages', 'index.astro'), 'utf8');

	const shellIndex = homeHtml.indexOf('class="home-shell"');
	const mainIndex = homeHtml.indexOf('class="home-main-column"');
	const leftRailIndex = homeHtml.indexOf('class="home-left-rail"');
	const rightRailIndex = homeHtml.indexOf('class="home-right-rail"');

	assert.notEqual(shellIndex, -1, 'expected home page shell');
	assert.notEqual(mainIndex, -1, 'expected central home content column');
	assert.notEqual(leftRailIndex, -1, 'expected left blog navigation rail');
	assert.notEqual(rightRailIndex, -1, 'expected right recommendation rail');
	assert.ok(mainIndex < leftRailIndex, 'main content should remain first in DOM order');
	assert.ok(leftRailIndex < rightRailIndex, 'left rail should render before right rail after main content');
	assert.match(homeHtml, /カテゴリ \/ トピック/);
	assert.match(homeHtml, /おすすめ記事/);
	assert.match(homeHtml, /最新記事/);
	assert.match(homeSource, /grid-template-areas:\s*'left main right'/);
});
