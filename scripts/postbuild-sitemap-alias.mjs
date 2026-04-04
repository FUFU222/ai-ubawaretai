import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const sitemapIndexPath = join(rootDir, 'dist', 'sitemap-index.xml');
const sitemapAliasPath = join(rootDir, 'dist', 'sitemap.xml');

if (!existsSync(sitemapIndexPath)) {
	throw new Error(`Expected sitemap index at ${sitemapIndexPath}`);
}

copyFileSync(sitemapIndexPath, sitemapAliasPath);
