import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
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

test('preflight retries a transient git fetch failure before succeeding', async () => {
	const { root, workerDir, memoryPath } = setupRepos();

	try {
		const { preflight } = await import(moduleUrl);
		const originalExecFileSync = execFileSync;
		let fetchAttempts = 0;

		function flakyExec(command, args, options = {}) {
			if (command === 'git' && args[0] === 'fetch' && args[1] === 'origin' && args[2] === 'main') {
				fetchAttempts += 1;
				if (fetchAttempts === 1) {
					const error = new Error('simulated fetch failure');
					error.stderr = 'ssh: Could not resolve hostname github.com: temporary failure';
					throw error;
				}
			}

			return originalExecFileSync(command, args, options);
		}

		const report = preflight({
			cwd: workerDir,
			memoryPath,
			skipInstall: true,
			skipChecks: true,
			execFileSyncImpl: flakyExec,
			retryDelayMs: 0,
		});

		assert.equal(report.branch, 'main');
		assert.equal(fetchAttempts, 2);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('status lists complete staged candidates in oldest-first order', async () => {
	const { root, workerDir, memoryPath } = setupRepos();

	try {
		const stagingDir = join(workerDir, '.publisher-staging');
		const olderSlug = 'older-candidate';
		const newerSlug = 'newer-candidate';

		for (const slug of [olderSlug, newerSlug]) {
			const dir = join(stagingDir, slug);
			mkdirSync(dir, { recursive: true });
			for (const filename of ['candidate.json', 'main.md', 'child.md', 'expert.md']) {
				writeFileSync(join(dir, filename), `${slug}-${filename}\n`);
			}
		}

		utimesSync(join(stagingDir, olderSlug), new Date('2026-04-18T00:00:00Z'), new Date('2026-04-18T00:00:00Z'));
		utimesSync(join(stagingDir, newerSlug), new Date('2026-04-19T00:00:00Z'), new Date('2026-04-19T00:00:00Z'));

		const { getWorkspaceStatus } = await import(moduleUrl);
		const status = getWorkspaceStatus({ cwd: workerDir, memoryPath });

		assert.deepEqual(
			status.stagedCandidates.map((candidate) => candidate.slug),
			[olderSlug, newerSlug],
		);
		assert.equal(status.nextStagedCandidate.slug, olderSlug);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('pushMain retries a transient git push failure before succeeding', async () => {
	const { root, workerDir } = setupRepos();

	try {
		git(workerDir, ['config', 'user.name', 'Codex Test']);
		git(workerDir, ['config', 'user.email', 'codex@example.com']);
		git(workerDir, ['pull', '--ff-only', 'origin', 'main']);
		writeFileSync(join(workerDir, 'README.md'), 'worker change\n');
		git(workerDir, ['add', 'README.md']);
		git(workerDir, ['commit', '-m', 'worker update']);

		const { pushMain } = await import(moduleUrl);
		const originalExecFileSync = execFileSync;
		let pushAttempts = 0;

		function flakyExec(command, args, options = {}) {
			if (command === 'git' && args[0] === 'push' && args[1] === 'origin' && args[2] === 'main') {
				pushAttempts += 1;
				if (pushAttempts === 1) {
					const error = new Error('simulated push failure');
					error.stderr = 'ssh: Could not resolve hostname github.com: temporary failure';
					throw error;
				}
			}

			return originalExecFileSync(command, args, options);
		}

		const report = pushMain({
			cwd: workerDir,
			execFileSyncImpl: flakyExec,
			retryDelayMs: 0,
		});

		assert.equal(report.branch, 'main');
		assert.equal(pushAttempts, 2);
		assert.equal(git(workerDir, ['rev-parse', 'HEAD']), git(workerDir, ['rev-parse', 'origin/main']));
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('cleanPublisherState removes only the targeted staged candidate when slug is provided', async () => {
	const { root, workerDir } = setupRepos();

	try {
		const stagingDir = join(workerDir, '.publisher-staging');
		for (const slug of ['keep-me', 'remove-me']) {
			const dir = join(stagingDir, slug);
			mkdirSync(dir, { recursive: true });
			for (const filename of ['candidate.json', 'main.md', 'child.md', 'expert.md']) {
				writeFileSync(join(dir, filename), `${slug}-${filename}\n`);
			}
		}

		const { cleanPublisherState, listStagedCandidates } = await import(moduleUrl);
		cleanPublisherState({ cwd: workerDir, slug: 'remove-me' });

		assert.deepEqual(
			listStagedCandidates({ cwd: workerDir }).map((candidate) => candidate.slug),
			['keep-me'],
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
