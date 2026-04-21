import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build includes a mobile-only line break in the home hero subtitle', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const homeHtml = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');

	assert.match(homeHtml, /AI業界の最新ニュースを/);
	assert.match(homeHtml, /現役エンジニアの視点で読み解く/);
	assert.match(homeHtml, /class="hero-sub-break"/);
	assert.match(homeHtml, /記事一覧を見る/);
	assert.doesNotMatch(homeHtml, /このサイトの基準/);
	assert.doesNotMatch(homeHtml, /公式ソース優先 \/ 日本市場への意味を整理 \/ 開発者目線の実務分析/);
});
