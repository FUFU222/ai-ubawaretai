import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

test('legacy direct-publish scripts are removed from the repo', () => {
	const root = process.cwd();

	assert.equal(existsSync(resolve(root, 'scripts', 'generate-article.js')), false);
	assert.equal(existsSync(resolve(root, 'scripts', 'fetch-news.js')), false);
});
