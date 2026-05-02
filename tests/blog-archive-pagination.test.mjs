import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build paginates the blog archive and limits the first page payload', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const firstPageHtml = readFileSync(join(rootDir, 'dist', 'blog', 'index.html'), 'utf8');
	const secondPagePath = join(rootDir, 'dist', 'blog', 'page', '2', 'index.html');

	assert.equal(existsSync(secondPagePath), true, 'expected a second archive page');
	assert.match(firstPageHtml, /AI Dispatch/);
	assert.match(firstPageHtml, /class="archive-dispatch"/);
	assert.match(firstPageHtml, /記事一覧ページネーション/);
	assert.match(firstPageHtml, /href="\/blog\/page\/2"/);

	const dispatchCount = (firstPageHtml.match(/class="dispatch-item"/g) ?? []).length;
	assert.ok(dispatchCount <= 12, `expected at most 12 posts on the first page, got ${dispatchCount}`);
});
