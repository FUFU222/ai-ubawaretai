import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build emits a curated sitemap.xml route', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const sitemapPath = join(rootDir, 'dist', 'sitemap.xml');
	const sitemap = readFileSync(sitemapPath, 'utf8');

	assert.ok(existsSync(sitemapPath), 'dist/sitemap.xml should exist after build');
	assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
	assert.match(sitemap, /https:\/\/ai-ubawaretai\.com\/blog\//);
	assert.doesNotMatch(sitemap, /https:\/\/ai-ubawaretai\.com\/article-levels\//);
	assert.doesNotMatch(sitemap, /https:\/\/ai-ubawaretai\.com\/blog\/page\/2\//);
});

test('source metadata points crawlers to sitemap.xml and blocks article-level fragments', () => {
	const robotsRoute = readFileSync(join(rootDir, 'src', 'pages', 'robots.txt.ts'), 'utf8');
	const baseHead = readFileSync(join(rootDir, 'src', 'components', 'BaseHead.astro'), 'utf8');

	assert.match(robotsRoute, /Disallow: \/article-levels\//);
	assert.match(robotsRoute, /Sitemap: \$\{sitemapURL\.href\}/);
	assert.match(baseHead, /<link rel="sitemap" href=\{SITEMAP_PATH\} \/>/);
});
