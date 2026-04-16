import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const moduleUrl = new URL('../scripts/publisher-workspace.mjs', import.meta.url);

function git(cwd, args) {
	return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function setupRepos() {
	const root = mkdtempSync(join(tmpdir(), 'publisher-workspace-'));
	const remoteDir = join(root, 'remote.git');
	const seedDir = join(root, 'seed');
	const workerDir = join(root, 'worker');
	const memoryPath = join(root, 'memory.md');

	mkdirSync(seedDir, { recursive: true });
	git(root, ['init', '--bare', remoteDir]);
	git(root, ['clone', remoteDir, seedDir]);
	git(seedDir, ['config', 'user.name', 'Codex Test']);
	git(seedDir, ['config', 'user.email', 'codex@example.com']);
	writeFileSync(join(seedDir, 'package.json'), JSON.stringify({ name: 'fixture', version: '1.0.0' }));
	writeFileSync(join(seedDir, 'README.md'), 'initial\n');
	git(seedDir, ['add', 'package.json', 'README.md']);
	git(seedDir, ['commit', '-m', 'initial']);
	git(seedDir, ['branch', '-M', 'main']);
	git(seedDir, ['push', '-u', 'origin', 'main']);

	git(root, ['clone', remoteDir, workerDir]);
	git(workerDir, ['switch', 'main']);

	writeFileSync(join(seedDir, 'README.md'), 'updated upstream\n');
	git(seedDir, ['add', 'README.md']);
	git(seedDir, ['commit', '-m', 'upstream update']);
	git(seedDir, ['push', 'origin', 'main']);

	writeFileSync(memoryPath, '# memory\n');

	return { root, workerDir, memoryPath };
}

test('preflight reattaches detached HEAD and fast-forwards main to origin/main', async () => {
	const { root, workerDir, memoryPath } = setupRepos();

	try {
		const initialHead = git(workerDir, ['rev-parse', 'HEAD']);
		git(workerDir, ['checkout', initialHead]);

		const { preflight } = await import(moduleUrl);
		const report = preflight({
			cwd: workerDir,
			memoryPath,
			skipInstall: true,
			skipChecks: true,
		});

		assert.equal(report.branch, 'main');
		assert.equal(git(workerDir, ['branch', '--show-current']), 'main');
		assert.equal(git(workerDir, ['rev-parse', 'HEAD']), git(workerDir, ['rev-parse', 'origin/main']));
		assert.equal(report.clean, true);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('preflight fails on dirty worktree', async () => {
	const { root, workerDir, memoryPath } = setupRepos();

	try {
		writeFileSync(join(workerDir, 'dirty.txt'), 'dirty\n');

		const { preflight } = await import(moduleUrl);

		assert.throws(
			() =>
				preflight({
					cwd: workerDir,
					memoryPath,
					skipInstall: true,
					skipChecks: true,
				}),
			/worktree has uncommitted changes/i,
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('status reports detached HEAD state as JSON-friendly data', async () => {
	const { root, workerDir, memoryPath } = setupRepos();

	try {
		const initialHead = git(workerDir, ['rev-parse', 'HEAD']);
		git(workerDir, ['checkout', initialHead]);

		const { getWorkspaceStatus } = await import(moduleUrl);
		const status = getWorkspaceStatus({ cwd: workerDir, memoryPath });

		assert.equal(status.branch, '');
		assert.equal(status.detached, true);
		assert.equal(typeof status.head, 'string');
		assert.equal(typeof status.memoryReadable, 'boolean');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
