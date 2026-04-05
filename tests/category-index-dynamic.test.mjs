import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const fixturePath = join(rootDir, 'src', 'content', 'blog', '__category-auto-test.md');

const fixture = `---
title: 'カテゴリ自動表示テスト'
description: 'カテゴリ一覧の動的生成を確認するための一時記事'
pubDate: '2026-04-05'
category: 'playbook'
tags: ['test']
draft: false
---

カテゴリ自動表示テスト用の記事です。
`;

test('category index reflects actual categories and auto-creates new category pages', () => {
	writeFileSync(fixturePath, fixture, 'utf8');

	try {
		execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

		const categoryIndex = readFileSync(join(rootDir, 'dist', 'category', 'index.html'), 'utf8');
		const dynamicCategoryPage = join(rootDir, 'dist', 'category', 'playbook', 'index.html');

		assert.match(categoryIndex, /playbook/);
		assert.match(categoryIndex, /1件/);
		assert.equal(existsSync(dynamicCategoryPage), true, 'expected dynamic category page build output');
		assert.doesNotMatch(categoryIndex, /ワークフロー/);
	} finally {
		rmSync(fixturePath, { force: true });
	}
});
