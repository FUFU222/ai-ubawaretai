import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build uses structured footer sections and trust-oriented About copy', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const aboutHtml = readFileSync(join(rootDir, 'dist', 'about', 'index.html'), 'utf8');

	assert.match(aboutHtml, /class="footer-link-grid"/);
	assert.match(aboutHtml, /class="footer-meta"/);
	assert.match(aboutHtml, /class="footer-eyebrow"/);

	assert.match(aboutHtml, /日本の事業・開発の現場でどう受け止めるべきかを整理するブログ/);
	assert.match(aboutHtml, /更新と訂正/);
	assert.match(aboutHtml, /\/about/);
	assert.match(aboutHtml, /\/contact/);
	assert.match(aboutHtml, /\/privacy/);
	assert.doesNotMatch(aboutHtml, /このブログが大事にしていること/);
	assert.doesNotMatch(aboutHtml, /記事の作り方/);
	assert.doesNotMatch(aboutHtml, /\/editorial-policy/);
	assert.doesNotMatch(aboutHtml, /\/terms/);
	assert.doesNotMatch(aboutHtml, /でも僕は/);
	assert.doesNotMatch(aboutHtml, /割と本気で/);
	assert.doesNotMatch(aboutHtml, /うわ、まじか/);
});
