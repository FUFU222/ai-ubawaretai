import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build output includes security headers, security.txt, and noindex utility pages', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const headersPath = join(rootDir, 'dist', '_headers');
	const securityTxtPath = join(rootDir, 'dist', '.well-known', 'security.txt');
	const notFoundHtml = readFileSync(join(rootDir, 'dist', '404.html'), 'utf8');
	const paginatedArchiveHtml = readFileSync(join(rootDir, 'dist', 'blog', 'page', '2', 'index.html'), 'utf8');
	const headers = readFileSync(headersPath, 'utf8');

	assert.equal(existsSync(headersPath), true, 'expected _headers to be copied to dist');
	assert.equal(existsSync(securityTxtPath), true, 'expected security.txt to be copied to dist');
	assert.match(headers, /Content-Security-Policy:/);
	assert.match(headers, /X-Frame-Options: DENY/);
	assert.match(headers, /\/article-levels\/\*/);
	assert.match(notFoundHtml, /<meta name="robots" content="noindex,follow,noarchive,max-image-preview:large,max-snippet:-1,max-video-preview:-1">/);
	assert.match(paginatedArchiveHtml, /<meta name="robots" content="noindex,follow,noarchive,max-image-preview:large,max-snippet:-1,max-video-preview:-1">/);
});
