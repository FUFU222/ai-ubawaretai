import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

function isPublishedArticle(entry) {
	const source = readFileSync(join(rootDir, 'src', 'content', 'blog', entry), 'utf8');
	return !/^draft:\s*true\s*$/m.test(source);
}

test('build exposes article level switcher for every article', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const slugs = readdirSync(join(rootDir, 'src', 'content', 'blog'))
		.filter((entry) => /\.(md|mdx)$/.test(entry))
		.filter(isPublishedArticle)
		.map((entry) => entry.replace(/\.(md|mdx)$/, ''))
		.sort();
	const supportedSlug = 'openai-cloudflare-agent-cloud-gpt54-codex-2026';
	const supportedNewsSlug = 'cursor-security-review-beta-2026';
	const supportedArticle = readFileSync(join(rootDir, 'dist', 'blog', supportedSlug, 'index.html'), 'utf8');
	const supportedNewsArticle = readFileSync(join(rootDir, 'dist', 'blog', supportedNewsSlug, 'index.html'), 'utf8');
	const childFragmentPath = join(rootDir, 'dist', 'article-levels', supportedSlug, 'child', 'index.html');
	const expertFragmentPath = join(rootDir, 'dist', 'article-levels', supportedSlug, 'expert', 'index.html');
	const childNewsFragmentPath = join(rootDir, 'dist', 'article-levels', supportedNewsSlug, 'child', 'index.html');
	const expertNewsFragmentPath = join(rootDir, 'dist', 'article-levels', supportedNewsSlug, 'expert', 'index.html');
	const supportedCss = Array.from(supportedArticle.matchAll(/href="(\/_astro\/[^"]+\.css)"/g))
		.map((match) => readFileSync(join(rootDir, 'dist', match[1].slice(1)), 'utf8'))
		.join('\n');
	const switcherSource = readFileSync(join(rootDir, 'src', 'components', 'ArticleLevelSwitcher.astro'), 'utf8');

	assert.match(supportedArticle, /解説レベル/);
	assert.match(supportedArticle, /やさしく/);
	assert.match(supportedArticle, /標準/);
	assert.match(supportedArticle, /深掘り/);
	assert.doesNotMatch(supportedArticle, /幼児向け/);
	assert.doesNotMatch(supportedArticle, /玄人向け/);
	assert.match(supportedArticle, /data-article-level-switcher/);
	assert.match(supportedArticle, /data-article-level-scrim/);
	assert.match(supportedArticle, /data-article-level-behavior="dock-on-read"/);
	assert.match(supportedArticle, /data-article-level-target/);
	assert.match(supportedArticle, /data-article-level-article/);
	assert.match(supportedArticle, /data-article-level-toc/);
	assert.match(supportedArticle, /data-article-level-toc-list/);
	assert.match(supportedArticle, /data-article-level-toc-nav/);
	assert.match(supportedArticle, /document\.readyState === 'loading'/);
	assert.match(supportedArticle, /DOMContentLoaded/);
	assert.match(supportedArticle, /DOMParser/);
	assert.match(supportedArticle, /sanitizeHtml/);
	assert.match(supportedArticle, /replaceChildren/);
	assert.match(supportedArticle, /Rejected article level route/);
	assert.match(supportedArticle, /updateToc/);
	assert.doesNotMatch(supportedArticle, /prose\.innerHTML = html/);
	assert.match(supportedCss, /article-level-menu[^\{]+\[hidden\]\{display:none\}/);
	assert.match(supportedCss, /article-level-scrim[^\{]+\[hidden\]\{display:none\}/);
	assert.match(switcherSource, /background: rgba\(15, 23, 42, 0\.3\)/);
	assert.match(switcherSource, /backdrop-filter: blur\(3px\) saturate\(0\.92\)/);
	assert.match(switcherSource, /-webkit-backdrop-filter: blur\(3px\) saturate\(0\.92\)/);
	assert.match(supportedCss, /--article-level-progress/);
	assert.match(switcherSource, /scrim\.addEventListener\('click'/);
	assert.match(switcherSource, /getDesktopRailMetrics/);
	assert.match(switcherSource, /preferredLeft > maxLeft/);
	assert.match(switcherSource, /is-dock-disabled/);
	assert.doesNotMatch(switcherSource, /transform 0\.14s linear/);
	assert.match(supportedNewsArticle, /解説レベル/);
	assert.match(supportedNewsArticle, /data-article-level-switcher/);
	assert.match(supportedNewsArticle, /data-article-level-behavior="dock-on-read"/);
	assert.equal(existsSync(childFragmentPath), true, 'expected child fragment build output');
	assert.equal(existsSync(expertFragmentPath), true, 'expected expert fragment build output');
	assert.equal(existsSync(childNewsFragmentPath), true, 'expected child news fragment build output');
	assert.equal(existsSync(expertNewsFragmentPath), true, 'expected expert news fragment build output');

	for (const slug of slugs) {
		const articleHtml = readFileSync(join(rootDir, 'dist', 'blog', slug, 'index.html'), 'utf8');
		const childPath = join(rootDir, 'dist', 'article-levels', slug, 'child', 'index.html');
		const expertPath = join(rootDir, 'dist', 'article-levels', slug, 'expert', 'index.html');

		assert.match(articleHtml, /解説レベル/, `expected switcher on ${slug}`);
		assert.match(articleHtml, /data-article-level-switcher/, `expected switcher marker on ${slug}`);
		assert.equal(existsSync(childPath), true, `expected child fragment build output for ${slug}`);
		assert.equal(existsSync(expertPath), true, `expected expert fragment build output for ${slug}`);
	}

	const childFragment = readFileSync(childFragmentPath, 'utf8');
	const expertFragment = readFileSync(expertFragmentPath, 'utf8');
	const childNewsFragment = readFileSync(childNewsFragmentPath, 'utf8');
	const expertNewsFragment = readFileSync(expertNewsFragmentPath, 'utf8');

	assert.match(childFragment, /Cloudflare/);
	assert.match(expertFragment, /Agent Cloud/);
	assert.match(childNewsFragment, /Cursor/);
	assert.match(expertNewsFragment, /security review/i);
});
