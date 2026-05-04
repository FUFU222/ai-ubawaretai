import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const remediationDraftSlugs = [
	'ai-coding-tools-comparison-2026',
	'claude-code-review',
	'chatgpt-workflow-guide',
	'github-copilot-jira-coding-agent-2026',
	'openai-acquires-astral-uv-ruff-2026',
	'arm-agi-cpu-first-in-house-chip-2026',
];

test('AdSense remediation hides low-value articles and their level fragments from public output', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const sitemap = readFileSync(join(rootDir, 'dist', 'sitemap.xml'), 'utf8');

	for (const slug of remediationDraftSlugs) {
		assert.equal(
			existsSync(join(rootDir, 'dist', 'blog', slug, 'index.html')),
			false,
			`expected ${slug} article page to be excluded from public build`,
		);
		assert.equal(
			existsSync(join(rootDir, 'dist', 'article-levels', slug, 'child', 'index.html')),
			false,
			`expected ${slug} child fragment to be excluded from public build`,
		);
		assert.equal(
			existsSync(join(rootDir, 'dist', 'article-levels', slug, 'expert', 'index.html')),
			false,
			`expected ${slug} expert fragment to be excluded from public build`,
		);
		assert.doesNotMatch(sitemap, new RegExp(`/blog/${slug}/`));
	}
});

test('AdSense account metadata and strengthened trust copy are rendered', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const indexHtml = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');
	const aboutHtml = readFileSync(join(rootDir, 'dist', 'about', 'index.html'), 'utf8');
	const contactHtml = readFileSync(join(rootDir, 'dist', 'contact', 'index.html'), 'utf8');
	const privacyHtml = readFileSync(join(rootDir, 'dist', 'privacy', 'index.html'), 'utf8');

	assert.match(indexHtml, /<meta name="google-adsense-account" content="ca-pub-5853088582174174">/);
	assert.match(aboutHtml, /編集方針/);
	assert.match(aboutHtml, /AIの利用/);
	assert.match(aboutHtml, /一次情報/);
	assert.match(aboutHtml, /https:\/\/x\.com\/fufu_phoenix/);
	assert.match(contactHtml, /GitHubプロフィール/);
	assert.match(contactHtml, /Xアカウント/);
	assert.match(contactHtml, /https:\/\/x\.com\/fufu_phoenix/);
	assert.match(contactHtml, /訂正依頼/);
	assert.match(privacyHtml, /Google AdSense/);
	assert.match(privacyHtml, /Cookie/);
	assert.match(privacyHtml, /制定日/);
});
