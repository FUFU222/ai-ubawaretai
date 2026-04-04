import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build uses structured footer sections and polished About copy', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const aboutHtml = readFileSync(join(rootDir, 'dist', 'about', 'index.html'), 'utf8');

	assert.match(aboutHtml, /class="footer-link-grid"/);
	assert.match(aboutHtml, /class="footer-meta"/);
	assert.match(aboutHtml, /class="footer-eyebrow"/);

	assert.match(aboutHtml, /本ブログでは/);
	assert.match(aboutHtml, /ご覧いただける/);
	assert.doesNotMatch(aboutHtml, /でも僕は/);
	assert.doesNotMatch(aboutHtml, /割と本気で/);
	assert.doesNotMatch(aboutHtml, /うわ、まじか/);
});
