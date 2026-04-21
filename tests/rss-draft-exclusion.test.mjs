import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const fixturePath = join(rootDir, 'src', 'content', 'blog', '__rss-draft-fixture.md');

const fixture = `---
title: 'RSS draft fixture'
description: 'RSS should not expose draft content'
pubDate: '2026-04-21'
category: 'news'
tags: ['RSS']
draft: true
---

この下書き記事はRSSに含まれてはいけません。
`;

test('rss feed excludes draft articles', () => {
	writeFileSync(fixturePath, fixture, 'utf8');

	try {
		execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

		const rssXml = readFileSync(join(rootDir, 'dist', 'rss.xml'), 'utf8');

		assert.doesNotMatch(rssXml, /RSS draft fixture/);
		assert.doesNotMatch(rssXml, /__rss-draft-fixture/);
	} finally {
		rmSync(fixturePath, { force: true });
	}
});
