import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const moduleUrl = new URL('../scripts/publisher-state.mjs', import.meta.url);

test('ensurePublisherState creates a sibling structured state file from memory path', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-state-'));
	const memoryPath = join(root, 'memory.md');

	try {
		writeFileSync(memoryPath, '# memory\n');

		const { ensurePublisherState } = await import(moduleUrl);
		const statePath = ensurePublisherState({ memoryPath });

		assert.equal(statePath, join(root, 'publisher-state.jsonl'));
		assert.equal(existsSync(statePath), true);
		assert.equal(readFileSync(statePath, 'utf8'), '');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('recordCandidateState appends machine-readable candidate history', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-state-'));
	const memoryPath = join(root, 'memory.md');
	const candidatePath = join(root, 'candidate.json');

	try {
		writeFileSync(memoryPath, '# memory\n');
		writeFileSync(
			candidatePath,
			JSON.stringify(
				{
					slug: 'sample-candidate',
					title: 'サンプル候補',
					company: 'OpenAI',
					date: '2026-04-21',
					intent: 'サンプル候補の意味を解説',
					searchIntent: 'OpenAI サンプル候補',
					whyUnique: '候補の比較軸が明確',
					sources: [{ url: 'https://openai.com/example', type: 'primary' }],
				},
				null,
				2,
			),
		);

		const { loadPublisherState, recordCandidateState } = await import(moduleUrl);
		recordCandidateState({
			memoryPath,
			candidateFile: candidatePath,
			outcome: 'published',
			publishStatus: 'published',
			topicsToAvoid: ['OpenAI サンプル候補'],
		});

		const entries = loadPublisherState({ memoryPath });
		assert.equal(entries.length, 1);
		assert.equal(entries[0].slug, 'sample-candidate');
		assert.equal(entries[0].outcome, 'published');
		assert.equal(entries[0].publishStatus, 'published');
		assert.deepEqual(entries[0].topicsToAvoid, ['OpenAI サンプル候補']);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
