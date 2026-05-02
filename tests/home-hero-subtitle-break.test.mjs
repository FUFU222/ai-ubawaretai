import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build presents the home page as an editorial news radar', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const homeHtml = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');
	const homeSource = readFileSync(join(rootDir, 'src', 'pages', 'index.astro'), 'utf8');

	assert.match(homeHtml, /AI News Radar/);
	assert.match(homeHtml, /最初に読む/);
	assert.match(homeHtml, /次に読む/);
	assert.match(homeHtml, /注目テーマ/);
	assert.match(homeHtml, /最新記事を読む/);
	assert.match(homeHtml, /class="home-secondary-grid"/);
	assert.match(homeSource, /--home-desktop-width: 1280px/);
	assert.match(homeSource, /width: min\(var\(--home-desktop-width\), calc\(100% - 3rem\)\)/);
	assert.doesNotMatch(homeHtml, /class="hero-sub-break"/);
	assert.doesNotMatch(homeHtml, /このサイトの基準/);
	assert.doesNotMatch(homeHtml, /公式ソース優先 \/ 日本市場への意味を整理 \/ 開発者目線の実務分析/);
});
