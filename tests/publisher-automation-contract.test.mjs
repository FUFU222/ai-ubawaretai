import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('publisher automation contract includes durable title hook guidance', () => {
	const contract = readFileSync(join(rootDir, 'docs', 'automations', 'publisher-system.md'), 'utf8');

	assert.match(contract, /直近5本のタイトル/);
	assert.match(contract, /日本企業は.*どう/);
	assert.match(contract, /日本チーム/);
	assert.match(contract, /具体フック/);
	assert.match(contract, /数字.*期限.*具体ツール.*職種.*導入シナリオ.*比較軸/);
});
