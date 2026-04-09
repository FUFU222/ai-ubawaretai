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
tags: ['TaxonomyFixtureTag', '半導体']
draft: false
---

タグ自動表示テスト用の記事です。
`;

test('tag index reflects actual tags, auto-creates tag pages, and links article tags', () => {
	writeFileSync(fixturePath, fixture, 'utf8');

	try {
		execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

		const categoryIndex = readFileSync(join(rootDir, 'dist', 'category', 'index.html'), 'utf8');
		const dynamicTagPage = join(rootDir, 'dist', 'category', 'TaxonomyFixtureTag', 'index.html');
		const articlePage = readFileSync(join(rootDir, 'dist', 'blog', '__tag-auto-test', 'index.html'), 'utf8');

		assert.match(categoryIndex, /タグ/);
		assert.match(categoryIndex, /TaxonomyFixtureTag/);
		assert.match(categoryIndex, /半導体/);
		assert.match(categoryIndex, /1件/);
		assert.equal(existsSync(dynamicTagPage), true, 'expected dynamic tag page build output');
		assert.match(articlePage, /href="\/category\/TaxonomyFixtureTag\/"/);
		assert.match(articlePage, /href="\/category\/%E5%8D%8A%E5%B0%8E%E4%BD%93\/"/);
		assert.doesNotMatch(categoryIndex, /Category Guide/);
	} finally {
		rmSync(fixturePath, { force: true });
	}
});
