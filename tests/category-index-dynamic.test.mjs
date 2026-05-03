import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const fixturePath = join(rootDir, 'src', 'content', 'blog', '__tag-auto-test.md');

const fixture = `---
title: 'タグ自動表示テスト'
description: 'タグ一覧の動的生成を確認するための一時記事'
pubDate: '2026-04-05'
category: 'news'
tags: ['TaxonomyFixtureTag', 'OpenAI']
draft: false
---

タグ自動表示テスト用の記事です。
`;

test('category index exposes only indexable tags and avoids thin one-off tag pages', () => {
	writeFileSync(fixturePath, fixture, 'utf8');

	try {
		execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

		const categoryIndex = readFileSync(join(rootDir, 'dist', 'category', 'index.html'), 'utf8');
		const dynamicTagPage = join(rootDir, 'dist', 'category', 'TaxonomyFixtureTag', 'index.html');
		const articlePage = readFileSync(join(rootDir, 'dist', 'blog', '__tag-auto-test', 'index.html'), 'utf8');
		const indexableTagHtml = readFileSync(join(rootDir, 'dist', 'category', 'OpenAI', 'index.html'), 'utf8');

		assert.match(categoryIndex, /Topic Index/);
		assert.match(categoryIndex, /タグ/);
		assert.doesNotMatch(categoryIndex, /TaxonomyFixtureTag/);
		assert.match(categoryIndex, /OpenAI/);
		assert.match(categoryIndex, /class="topic-index"/);
		assert.match(categoryIndex, /class="topic-row"/);
		assert.equal(existsSync(dynamicTagPage), false, 'expected one-off tag page to be excluded');
		assert.match(indexableTagHtml, /Topic Dispatch/);
		assert.match(indexableTagHtml, /class="topic-post-list"/);
		assert.match(indexableTagHtml, /class="topic-post-row"/);
		assert.doesNotMatch(
			indexableTagHtml,
			/<meta name="robots" content="noindex,follow,noarchive,max-image-preview:large,max-snippet:-1,max-video-preview:-1">/,
		);
		assert.match(articlePage, /TaxonomyFixtureTag/);
		assert.doesNotMatch(articlePage, /href="\/category\/TaxonomyFixtureTag\/"/);
		assert.match(articlePage, /href="\/category\/OpenAI\/"/);
		assert.doesNotMatch(categoryIndex, /Category Guide/);
		assert.doesNotMatch(categoryIndex, /category-card/);
	} finally {
		rmSync(fixturePath, { force: true });
	}
});
