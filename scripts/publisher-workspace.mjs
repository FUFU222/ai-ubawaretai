import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { ensurePublisherState, recordCandidateState } from './publisher-state.mjs';

function run(command, args, options = {}) {
	const { execFileSyncImpl = execFileSync, ...spawnOptions } = options;
	const output = execFileSyncImpl(command, args, {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		...spawnOptions,
	});
	return typeof output === 'string' ? output.trim() : '';
}

function getGitConfig(key, { cwd, execFileSyncImpl = execFileSync } = {}) {
	try {
		return run('git', ['config', '--get', key], { cwd, execFileSyncImpl });
	} catch {
		return '';
	}
}

function tryRun(command, args, options = {}) {
	try {
		return run(command, args, options);
	} catch {
		return '';
	}
}

function commandSucceeds(command, args, options = {}) {
	try {
		const { execFileSyncImpl = execFileSync, ...spawnOptions } = options;
		execFileSyncImpl(command, args, {
			stdio: 'ignore',
			...spawnOptions,
		});
		return true;
	} catch {
		return false;
	}
}

function errorText(error) {
	return String(error?.stderr || error?.message || '').trim();
}

function isTransientGitRemoteError(error) {
	const text = errorText(error).toLowerCase();
	return [
		'could not resolve hostname',
		'temporary failure',
		'timed out',
		'connection reset',
		'failed to connect',
		'could not read from remote repository',
	].some((fragment) => text.includes(fragment));
}

function sleepMs(ms) {
	if (!ms || ms <= 0) return;
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function toHttpsRemoteUrl(remoteUrl) {
	const value = String(remoteUrl || '').trim();
	if (!value) return '';
	if (value.startsWith('https://')) return value;

	const scpLikeMatch = value.match(/^git@github\.com:(.+)$/);
	if (scpLikeMatch) {
		return `https://github.com/${scpLikeMatch[1]}`;
	}

	const sshLikeMatch = value.match(/^ssh:\/\/git@github\.com\/(.+)$/);
	if (sshLikeMatch) {
		return `https://github.com/${sshLikeMatch[1]}`;
	}

	return '';
}

function resolveFetchTarget({ cwd, remoteName = 'origin', execFileSyncImpl = execFileSync } = {}) {
	const remoteUrl = getGitConfig(`remote.${remoteName}.url`, { cwd, execFileSyncImpl });
	const httpsRemoteUrl = toHttpsRemoteUrl(remoteUrl);
	if (httpsRemoteUrl) {
		return {
			target: httpsRemoteUrl,
			refspec: `+main:refs/remotes/${remoteName}/main`,
		};
	}

	return {
		target: remoteName,
		refspec: '+main:refs/remotes/origin/main',
	};
}

function normalizeFetchTarget(target, cwd = process.cwd()) {
	const value = String(target || '').trim();
	if (!value) return '';
	if (/^(https?|ssh):\/\//.test(value)) return value;
	if (/^[A-Za-z0-9_.-]+$/.test(value)) return value;
	return resolve(cwd, value);
}

function isLocalFetchTarget(target, cwd = process.cwd()) {
	const value = String(target || '').trim();
	if (!value) return false;
	if (/^(https?|ssh):\/\//.test(value)) return false;
	if (/^[A-Za-z0-9_.-]+$/.test(value)) return false;
	return normalizeFetchTarget(value, cwd) !== value || value.startsWith('/');
}

function buildFetchPlan({
	cwd = process.cwd(),
	fetchTarget = null,
	fallbackFetchTarget = null,
	execFileSyncImpl = execFileSync,
} = {}) {
	const primarySpec = fetchTarget
		? {
				target: normalizeFetchTarget(fetchTarget, cwd),
				refspec: '+main:refs/remotes/origin/main',
			}
		: resolveFetchTarget({ cwd, execFileSyncImpl });
	const fallbackTarget = normalizeFetchTarget(fallbackFetchTarget, cwd);

	if (
		fetchTarget &&
		fallbackTarget &&
		isLocalFetchTarget(fetchTarget, cwd) &&
		!isLocalFetchTarget(fallbackFetchTarget, cwd)
	) {
		return {
			primary: {
				target: fallbackTarget,
				refspec: '+main:refs/remotes/origin/main',
			},
			fallback: primarySpec,
			refreshTarget: primarySpec.target,
		};
	}

	return {
		primary: primarySpec,
		fallback: fallbackTarget
			? {
					target: fallbackTarget,
					refspec: primarySpec.refspec,
				}
			: null,
		refreshTarget: null,
	};
}

function runGitWithRetry(commandArgs, options = {}) {
	const { retries = 3, retryDelayMs = 1500, cwd } = options;
	let lastError;

	for (let attempt = 1; attempt <= retries; attempt += 1) {
		try {
			return run('git', commandArgs, options);
		} catch (error) {
			lastError = error;
			if (!isTransientGitRemoteError(error) || attempt === retries) {
				throw error;
			}
			process.stderr.write(
				`transient git failure (${attempt}/${retries}) in ${cwd || process.cwd()}: ${errorText(error)}\n`,
			);
			sleepMs(retryDelayMs);
		}
	}

	throw lastError;
}

function assertReadableFile(path) {
	const resolved = resolve(path);
	if (!existsSync(resolved)) {
		throw new Error(`memory file is missing: ${resolved}`);
	}

	if (!statSync(resolved).isFile()) {
		throw new Error(`memory path is not a file: ${resolved}`);
	}

	return resolved;
}

function resolvePublisherContext({ memoryPath = null, statePath = null, ensureState = false } = {}) {
	const resolvedMemoryPath = memoryPath ? assertReadableFile(memoryPath) : null;
	const resolvedStatePath = ensureState
		? ensurePublisherState({ memoryPath: resolvedMemoryPath, statePath })
		: statePath
			? resolve(statePath)
			: null;

	return {
		memoryPath: resolvedMemoryPath,
		statePath: resolvedStatePath,
	};
}

function ensureCleanWorktree(cwd, options = {}) {
	const status = run('git', ['status', '--porcelain'], { cwd, ...options });
	if (status.length > 0) {
		throw new Error('worktree has uncommitted changes');
	}
}

function ensureOnMain(cwd, options = {}) {
	const hasMain = commandSucceeds('git', ['show-ref', '--verify', '--quiet', 'refs/heads/main'], {
		cwd,
		...options,
	});
	if (!hasMain) {
		run('git', ['switch', '--track', '-c', 'main', 'origin/main'], { cwd, ...options });
		return;
	}

	run('git', ['switch', 'main'], { cwd, ...options });
}

function ensureNodeModules(cwd, options = {}) {
	const nodeModulesPath = resolve(cwd, 'node_modules');
	if (existsSync(nodeModulesPath)) {
		return false;
	}

	run('npm', ['install'], { cwd, stdio: 'inherit', ...options });
	return true;
}

function isAncestorCommit(ancestor, descendant, { cwd, execFileSyncImpl = execFileSync } = {}) {
	if (!ancestor || !descendant) return false;
	return commandSucceeds('git', ['merge-base', '--is-ancestor', ancestor, descendant], {
		cwd,
		execFileSyncImpl,
	});
}

function syncMainToOriginMain(cwd, { execFileSyncImpl = execFileSync } = {}) {
	let rebasedOntoOriginMain = false;
	let head = run('git', ['rev-parse', 'HEAD'], { cwd, execFileSyncImpl });
	let originMain = run('git', ['rev-parse', 'origin/main'], { cwd, execFileSyncImpl });

	if (head === originMain) {
		return { head, originMain, rebasedOntoOriginMain };
	}

	if (isAncestorCommit(head, originMain, { cwd, execFileSyncImpl })) {
		run('git', ['merge', '--ff-only', 'origin/main'], { cwd, execFileSyncImpl });
		head = run('git', ['rev-parse', 'HEAD'], { cwd, execFileSyncImpl });
		return { head, originMain, rebasedOntoOriginMain };
	}

	if (isAncestorCommit(originMain, head, { cwd, execFileSyncImpl })) {
		return { head, originMain, rebasedOntoOriginMain };
	}

	run('git', ['rebase', 'origin/main'], { cwd, stdio: 'inherit', execFileSyncImpl });
	rebasedOntoOriginMain = true;
	head = run('git', ['rev-parse', 'HEAD'], { cwd, execFileSyncImpl });
	originMain = run('git', ['rev-parse', 'origin/main'], { cwd, execFileSyncImpl });

	return { head, originMain, rebasedOntoOriginMain };
}

export function listStagedCandidates({ cwd = process.cwd(), stagingDir = '.publisher-staging' } = {}) {
	const resolvedStagingDir = resolve(cwd, stagingDir);
	if (!existsSync(resolvedStagingDir)) {
		return [];
	}

	return readdirSync(resolvedStagingDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => {
			const slug = entry.name;
			const dirPath = resolve(resolvedStagingDir, slug);
			const files = ['candidate.json', 'main.md', 'child.md', 'expert.md'];
			const missingFiles = files.filter((file) => !existsSync(resolve(dirPath, file)));
			return {
				slug,
				dir: dirPath,
				complete: missingFiles.length === 0,
				missingFiles,
				mtimeMs: statSync(dirPath).mtimeMs,
			};
		})
		.filter((candidate) => candidate.complete)
		.sort((left, right) => left.mtimeMs - right.mtimeMs);
}

export function getWorkspaceStatus({ cwd = process.cwd(), memoryPath = null, statePath = null, stagingDir = '.publisher-staging' }) {
	const { memoryPath: resolvedMemoryPath, statePath: resolvedStatePath } = resolvePublisherContext({
		memoryPath,
		statePath,
	});
	const stagedCandidates = listStagedCandidates({ cwd, stagingDir });
	return {
		cwd,
		branch: tryRun('git', ['branch', '--show-current'], { cwd }),
		detached: tryRun('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd }) === '',
		head: tryRun('git', ['rev-parse', 'HEAD'], { cwd }),
		originMain: tryRun('git', ['rev-parse', 'origin/main'], { cwd }),
		clean: tryRun('git', ['status', '--porcelain'], { cwd }) === '',
		memoryReadable: resolvedMemoryPath ? existsSync(resolvedMemoryPath) : false,
		memoryPath: resolvedMemoryPath,
		statePath: resolvedStatePath,
		stagedCandidates,
		nextStagedCandidate: stagedCandidates[0] || null,
	};
}

function parseStatusPath(line) {
	if (!line) return '';
	if (line.startsWith('?? ')) return line.slice(3);

	const pathFragment = line.slice(3).trim();
	const renamedParts = pathFragment.split(' -> ');
	return renamedParts.at(-1) || '';
}

function listChangedPaths(cwd, options = {}) {
	const { execFileSyncImpl = execFileSync, ...spawnOptions } = options;
	const output = execFileSyncImpl('git', ['status', '--porcelain', '--untracked-files=all'], {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		cwd,
		...spawnOptions,
	});
	const status = typeof output === 'string' ? output.replace(/\n$/, '') : '';
	if (!status) return [];

	return status
		.split('\n')
		.map((line) => parseStatusPath(line))
		.filter(Boolean)
		.sort();
}

export function classifyPublishDiff({ cwd = process.cwd(), slug, execFileSyncImpl = execFileSync } = {}) {
	if (!slug) {
		throw new Error('slug is required');
	}

	const expectedPaths = [
		`src/content/blog/${slug}.md`,
		`src/content/blog-levels/${slug}/child.md`,
		`src/content/blog-levels/${slug}/expert.md`,
	].sort();
	const changedPaths = listChangedPaths(cwd, { execFileSyncImpl });
	const unexpectedPaths = changedPaths.filter((path) => !expectedPaths.includes(path));
	const missingPaths = expectedPaths.filter((path) => !changedPaths.includes(path));
	const articleOnly = changedPaths.length === expectedPaths.length && unexpectedPaths.length === 0 && missingPaths.length === 0;

	return {
		slug,
		changedPaths,
		expectedPaths,
		unexpectedPaths,
		missingPaths,
		articleOnly,
		requiresFullTest: !articleOnly,
	};
}

export function preflight({
	cwd = process.cwd(),
	memoryPath,
	statePath,
	skipInstall = false,
	skipChecks = false,
	fetchTarget = null,
	fallbackFetchTarget = null,
	execFileSyncImpl = execFileSync,
	retryDelayMs = 1500,
} = {}) {
	const {
		memoryPath: resolvedMemoryPath,
		statePath: resolvedStatePath,
	} = resolvePublisherContext({ memoryPath, statePath, ensureState: true });
	const fetchPlan = buildFetchPlan({
		cwd,
		fetchTarget,
		fallbackFetchTarget,
		execFileSyncImpl,
	});
	let fetchSource = fetchPlan.primary.target;
	let refreshedFetchTarget = false;

	ensureCleanWorktree(cwd, { execFileSyncImpl });
	try {
		runGitWithRetry(['fetch', fetchPlan.primary.target, fetchPlan.primary.refspec], {
			cwd,
			stdio: 'inherit',
			execFileSyncImpl,
			retryDelayMs,
		});
	} catch (error) {
		if (!fetchPlan.fallback) {
			throw error;
		}
		process.stderr.write(
			`primary fetch failed in ${cwd}: ${errorText(error)}\nfalling back to local fetch target: ${fetchPlan.fallback.target}\n`,
		);
		run('git', ['fetch', fetchPlan.fallback.target, fetchPlan.fallback.refspec], {
			cwd,
			stdio: 'inherit',
			execFileSyncImpl,
		});
		fetchSource = fetchPlan.fallback.target;
	}
	ensureOnMain(cwd, { execFileSyncImpl });
	const syncReport = syncMainToOriginMain(cwd, { execFileSyncImpl });

	const head = syncReport.head;
	const originMain = syncReport.originMain;
	const aheadOfOriginMain = head !== originMain && isAncestorCommit(originMain, head, { cwd, execFileSyncImpl });
	if (head !== originMain && !aheadOfOriginMain) {
		throw new Error(`workspace base mismatch: HEAD=${head} origin/main=${originMain}`);
	}

	if (fetchPlan.refreshTarget && fetchSource === fetchPlan.primary.target && !aheadOfOriginMain) {
		run('git', ['push', fetchPlan.refreshTarget, 'main'], { cwd, stdio: 'inherit', execFileSyncImpl });
		refreshedFetchTarget = true;
	}

	run('npm', ['--version'], { cwd, execFileSyncImpl });
	const installed = skipInstall ? false : ensureNodeModules(cwd, { execFileSyncImpl });

	if (!skipChecks) {
		run('npm', ['test'], { cwd, stdio: 'inherit', execFileSyncImpl });
		run('npm', ['run', 'build'], { cwd, stdio: 'inherit', execFileSyncImpl });
	}

	return {
		...getWorkspaceStatus({
			cwd,
			memoryPath: resolvedMemoryPath,
			statePath: resolvedStatePath,
		}),
		aheadOfOriginMain,
		rebasedOntoOriginMain: syncReport.rebasedOntoOriginMain,
		fetchSource,
		refreshedFetchTarget,
		installedDependencies: installed,
	};
}

export function pushMain({
	cwd = process.cwd(),
	execFileSyncImpl = execFileSync,
	retryDelayMs = 1500,
} = {}) {
	runGitWithRetry(['push', 'origin', 'main'], {
		cwd,
		stdio: 'inherit',
		execFileSyncImpl,
		retryDelayMs,
	});
	return getWorkspaceStatus({ cwd });
}

export function cleanPublisherState({
	cwd = process.cwd(),
	stagingDir = '.publisher-staging',
	slug = null,
	memoryPath = null,
	statePath = null,
	reason = 'cleaned',
	notes = '',
} = {}) {
	const resolvedStagingDir = resolve(cwd, stagingDir);
	const resolvedTarget = slug ? resolve(resolvedStagingDir, slug) : resolvedStagingDir;
	const candidateFile = slug ? resolve(resolvedTarget, 'candidate.json') : null;
	if (slug && (memoryPath || statePath) && existsSync(candidateFile)) {
		recordCandidateState({
			candidateFile,
			memoryPath,
			statePath,
			outcome: reason,
			publishStatus: 'unpublished',
			notes,
		});
	}
	rmSync(resolvedTarget, { recursive: true, force: true });
	return { cleaned: true, stagingDir: resolvedTarget };
}

function parseArgs(argv) {
	const args = { _: [] };
	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];
		if (!token.startsWith('--')) {
			args._.push(token);
			continue;
		}

		const key = token.slice(2);
		const next = argv[index + 1];
		if (!next || next.startsWith('--')) {
			args[key] = true;
			continue;
		}

		args[key] = next;
		index += 1;
	}

	return args;
}

function printJson(payload) {
	process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [command] = process.argv.slice(2);
	const args = parseArgs(process.argv.slice(3));

	try {
		if (command === 'status') {
			printJson(
				getWorkspaceStatus({
					cwd: args.cwd || process.cwd(),
					memoryPath: args.memory,
					statePath: args.state,
					stagingDir: args['staging-dir'] || '.publisher-staging',
				}),
			);
		} else if (command === 'preflight') {
			printJson(
				preflight({
					cwd: args.cwd || process.cwd(),
					memoryPath: args.memory,
					statePath: args.state,
					skipInstall: Boolean(args['skip-install']),
					skipChecks: Boolean(args['skip-checks']),
					fetchTarget: args['fetch-target'] || null,
					fallbackFetchTarget: args['fallback-fetch-target'] || null,
				}),
			);
		} else if (command === 'classify-publish-diff') {
			printJson(
				classifyPublishDiff({
					cwd: args.cwd || process.cwd(),
					slug: args.slug,
				}),
			);
		} else if (command === 'clean') {
			printJson(
				cleanPublisherState({
					cwd: args.cwd || process.cwd(),
					stagingDir: args['staging-dir'] || '.publisher-staging',
					slug: args.slug,
					memoryPath: args.memory,
					statePath: args.state,
					reason: args.reason || 'cleaned',
					notes: args.notes || '',
				}),
			);
		} else if (command === 'push-main') {
			printJson(
				pushMain({
					cwd: args.cwd || process.cwd(),
					retryDelayMs: Number(args['retry-delay-ms'] || 1500),
				}),
			);
		} else {
			throw new Error(`unknown command: ${command}`);
		}
	} catch (error) {
		process.stderr.write(`${error.message}\n`);
		process.exit(1);
	}
}
