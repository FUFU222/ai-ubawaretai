import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build exposes a sitemap.xml alias', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const sitemapAliasPath = join(rootDir, 'dist', 'sitemap.xml');
	const sitemapIndexPath = join(rootDir, 'dist', 'sitemap-index.xml');

	assert.ok(existsSync(sitemapAliasPath), 'dist/sitemap.xml should exist after build');
	assert.equal(
		readFileSync(sitemapAliasPath, 'utf8'),
		readFileSync(sitemapIndexPath, 'utf8'),
		'dist/sitemap.xml should mirror dist/sitemap-index.xml',
	);
});

test('source metadata points crawlers to sitemap.xml', () => {
	const robotsTxt = readFileSync(join(rootDir, 'public', 'robots.txt'), 'utf8');
	const baseHead = readFileSync(join(rootDir, 'src', 'components', 'BaseHead.astro'), 'utf8');

	assert.match(robotsTxt, /Sitemap: https:\/\/ai-ubawaretai\.com\/sitemap\.xml/);
	assert.match(baseHead, /<link rel="sitemap" href="\/sitemap\.xml" \/>/);
});
