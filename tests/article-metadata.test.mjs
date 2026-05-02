import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build renders article info with author, updated date, and source links', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const articleHtml = readFileSync(
		join(rootDir, 'dist', 'blog', 'openai-cloudflare-agent-cloud-gpt54-codex-2026', 'index.html'),
		'utf8',
	);

	assert.match(articleHtml, /記事情報/);
	assert.match(articleHtml, /Article Brief/);
	assert.match(articleHtml, /class="article-header article-brief"/);
	assert.match(articleHtml, /著者/);
	assert.match(articleHtml, /更新日/);
	assert.match(articleHtml, /出典リンク/);
	assert.match(articleHtml, /Cloudflare expands its Agent Cloud to power the next generation of agents/);
	assert.match(articleHtml, /The next phase of enterprise AI/);
	assert.match(articleHtml, /href="\/about"/);
	assert.match(articleHtml, /href="\/contact"/);
	assert.match(articleHtml, /href="\/category\/OpenAI\/" class="category-badge"/);
	assert.doesNotMatch(articleHtml, /href="\/category\/news\/" class="category-badge"/);
	assert.match(articleHtml, /<meta property="og:image" content="https:\/\/ai-ubawaretai\.com\/header_image\.webp"/);
});
