import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build exposes article level switcher only for supported articles', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const supportedArticle = readFileSync(join(rootDir, 'dist', 'blog', 'chatgpt-workflow-guide', 'index.html'), 'utf8');
	const unsupportedArticle = readFileSync(join(rootDir, 'dist', 'blog', 'openai-sora-shutdown-2026', 'index.html'), 'utf8');
	const childFragmentPath = join(rootDir, 'dist', 'article-levels', 'chatgpt-workflow-guide', 'child', 'index.html');
	const expertFragmentPath = join(rootDir, 'dist', 'article-levels', 'chatgpt-workflow-guide', 'expert', 'index.html');

	assert.match(supportedArticle, /解説レベル/);
	assert.match(supportedArticle, /data-article-level-switcher/);
	assert.match(supportedArticle, /data-article-level-target/);

	assert.doesNotMatch(unsupportedArticle, /解説レベル/);
	assert.equal(existsSync(childFragmentPath), true, 'expected child fragment build output');
	assert.equal(existsSync(expertFragmentPath), true, 'expected expert fragment build output');

	const childFragment = readFileSync(childFragmentPath, 'utf8');
	const expertFragment = readFileSync(expertFragmentPath, 'utf8');

	assert.match(childFragment, /ChatGPTは仕事を手伝ってくれる道具/);
	assert.match(expertFragment, /レビュー観点の抽出/);
});
