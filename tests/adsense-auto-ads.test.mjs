import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('production build keeps AdSense script but removes placeholder ad boxes', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const articleHtml = readFileSync(
		join(rootDir, 'dist', 'blog', 'openai-cloudflare-agent-cloud-gpt54-codex-2026', 'index.html'),
		'utf8',
	);

	assert.match(articleHtml, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/);
	assert.doesNotMatch(articleHtml, /ad-placeholder/);
	assert.doesNotMatch(articleHtml, /Ad: 記事上/);
	assert.doesNotMatch(articleHtml, /Ad: 記事下/);
});
