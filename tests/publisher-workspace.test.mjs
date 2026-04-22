import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
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

	return { root, remoteDir, workerDir, memoryPath };
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
			if (command === 'git' && args[0] === 'fetch' && args[1] === 'origin' && args[2] === '+main:refs/remotes/origin/main') {
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

test('preflight prefers derived HTTPS fetch target for GitHub SSH remotes', async () => {
	const { root, remoteDir, workerDir, memoryPath } = setupRepos();

	try {
		git(workerDir, ['remote', 'set-url', 'origin', 'git@github.com:FUFU222/ai-ubawaretai.git']);

		const { preflight } = await import(moduleUrl);
		const originalExecFileSync = execFileSync;
		const seenFetchTargets = [];

		function transportAwareExec(command, args, options = {}) {
			if (command === 'git' && args[0] === 'fetch') {
				seenFetchTargets.push(args[1]);
				if (args[1] === 'https://github.com/FUFU222/ai-ubawaretai.git') {
					return originalExecFileSync(
						'git',
						['fetch', remoteDir, '+main:refs/remotes/origin/main'],
						options,
					);
				}
			}

			return originalExecFileSync(command, args, options);
		}

		const report = preflight({
			cwd: workerDir,
			memoryPath,
			skipInstall: true,
			skipChecks: true,
			execFileSyncImpl: transportAwareExec,
		});

		assert.equal(report.branch, 'main');
		assert.deepEqual(seenFetchTargets, ['https://github.com/FUFU222/ai-ubawaretai.git']);
		assert.equal(git(workerDir, ['rev-parse', 'HEAD']), git(workerDir, ['rev-parse', 'origin/main']));
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('preflight updates origin/main when using derived HTTPS fetch target', async () => {
	const { root, remoteDir, workerDir, memoryPath } = setupRepos();

	try {
		git(workerDir, ['remote', 'set-url', 'origin', 'git@github.com:FUFU222/ai-ubawaretai.git']);

		const { preflight } = await import(moduleUrl);
		const originalExecFileSync = execFileSync;
		const seenFetchArgs = [];

		function transportAwareExec(command, args, options = {}) {
			if (command === 'git' && args[0] === 'fetch') {
				seenFetchArgs.push(args.slice(1));
				if (args[1] === 'https://github.com/FUFU222/ai-ubawaretai.git') {
					return originalExecFileSync(
						'git',
						['fetch', remoteDir, '+main:refs/remotes/origin/main'],
						options,
					);
				}
			}

			return originalExecFileSync(command, args, options);
		}

		preflight({
			cwd: workerDir,
			memoryPath,
			skipInstall: true,
			skipChecks: true,
			execFileSyncImpl: transportAwareExec,
		});

		assert.deepEqual(seenFetchArgs, [
			[
				'https://github.com/FUFU222/ai-ubawaretai.git',
				'+main:refs/remotes/origin/main',
			],
		]);
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

test('cleanPublisherState records a structured rejection when memory path is provided', async () => {
	const { root, workerDir, memoryPath } = setupRepos();

	try {
		const slug = 'remove-me';
		const stagedDir = join(workerDir, '.publisher-staging', slug);
		mkdirSync(stagedDir, { recursive: true });
		for (const filename of ['main.md', 'child.md', 'expert.md']) {
			writeFileSync(join(stagedDir, filename), `${slug}-${filename}\n`);
		}
		writeFileSync(
			join(stagedDir, 'candidate.json'),
			JSON.stringify({
				slug,
				title: '削除テスト候補',
				company: 'OpenAI',
				date: '2026-04-21',
				intent: '削除理由の記録確認',
				searchIntent: 'OpenAI 削除テスト候補',
				whyUnique: '削除理由の記録',
			}, null, 2),
		);

		const { cleanPublisherState } = await import(moduleUrl);
		cleanPublisherState({
			cwd: workerDir,
			slug,
			memoryPath,
			reason: 'duplicate_rejected',
		});

		const entries = readFileSync(join(root, 'publisher-state.jsonl'), 'utf8')
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line));
		assert.equal(entries.length, 1);
		assert.equal(entries[0].slug, slug);
		assert.equal(entries[0].outcome, 'duplicate_rejected');
		assert.equal(entries[0].publishStatus, 'unpublished');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('preflight can initialize structured state without legacy memory file', async () => {
	const { root, workerDir } = setupRepos();
	const statePath = join(root, 'shared', 'publisher-state.jsonl');

	try {
		const { preflight } = await import(moduleUrl);
		const report = preflight({
			cwd: workerDir,
			statePath,
			skipInstall: true,
			skipChecks: true,
		});

		assert.equal(report.branch, 'main');
		assert.equal(readFileSync(statePath, 'utf8'), '');
		assert.equal(report.statePath, statePath);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('preflight reports a local commit ahead of origin/main without failing', async () => {
	const { root, workerDir } = setupRepos();
	const statePath = join(root, 'shared', 'publisher-state.jsonl');

	try {
		git(workerDir, ['pull', '--ff-only', 'origin', 'main']);
		git(workerDir, ['config', 'user.name', 'Codex Test']);
		git(workerDir, ['config', 'user.email', 'codex@example.com']);
		writeFileSync(join(workerDir, 'LOCAL_ONLY.md'), 'pending publish\n');
		git(workerDir, ['add', 'LOCAL_ONLY.md']);
		git(workerDir, ['commit', '-m', 'pending local commit']);

		const { preflight } = await import(moduleUrl);
		const report = preflight({
			cwd: workerDir,
			statePath,
			skipInstall: true,
			skipChecks: true,
		});

		assert.equal(report.aheadOfOriginMain, true);
		assert.notEqual(report.head, report.originMain);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('preflight falls back to an explicit local fetch target when the primary remote is unavailable', async () => {
	const { root, remoteDir, workerDir } = setupRepos();

	try {
		git(workerDir, ['remote', 'set-url', 'origin', 'git@github.com:FUFU222/ai-ubawaretai.git']);

		const { preflight } = await import(moduleUrl);
		const originalExecFileSync = execFileSync;
		const seenFetchTargets = [];

		function flakyPrimaryExec(command, args, options = {}) {
			if (command === 'git' && args[0] === 'fetch') {
				seenFetchTargets.push(args[1]);
				if (args[1] === 'https://github.com/FUFU222/ai-ubawaretai.git') {
					const error = new Error('simulated primary fetch failure');
					error.stderr = 'fatal: Could not resolve host: github.com';
					throw error;
				}
			}

			return originalExecFileSync(command, args, options);
		}

		const report = preflight({
			cwd: workerDir,
			statePath: join(root, 'shared', 'publisher-state.jsonl'),
			skipInstall: true,
			skipChecks: true,
			fallbackFetchTarget: remoteDir,
			execFileSyncImpl: flakyPrimaryExec,
		});

		assert.deepEqual(seenFetchTargets, [
			'https://github.com/FUFU222/ai-ubawaretai.git',
			remoteDir,
		]);
		assert.equal(report.fetchSource, remoteDir);
		assert.equal(git(workerDir, ['rev-parse', 'HEAD']), git(workerDir, ['rev-parse', 'origin/main']));
		assert.equal(git(workerDir, ['show', 'HEAD:README.md']).trim(), 'updated upstream');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('status can read staged candidates from an explicit shared staging directory', async () => {
	const { root, workerDir } = setupRepos();
	const stagingDir = join(root, 'shared', 'staging');

	try {
		const slug = 'shared-stage';
		const dir = join(stagingDir, slug);
		mkdirSync(dir, { recursive: true });
		for (const filename of ['candidate.json', 'main.md', 'child.md', 'expert.md']) {
			writeFileSync(join(dir, filename), `${slug}-${filename}\n`);
		}

		const { getWorkspaceStatus } = await import(moduleUrl);
		const status = getWorkspaceStatus({ cwd: workerDir, stagingDir });

		assert.equal(status.stagedCandidates.length, 1);
		assert.equal(status.stagedCandidates[0].slug, slug);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
