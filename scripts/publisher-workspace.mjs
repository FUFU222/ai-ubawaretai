import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { recordCandidateState } from './publisher-state.mjs';

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
			refspec: `main:refs/remotes/${remoteName}/main`,
		};
	}

	return {
		target: remoteName,
		refspec: 'main',
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

export function getWorkspaceStatus({ cwd = process.cwd(), memoryPath }) {
	const resolvedMemoryPath = memoryPath ? resolve(memoryPath) : null;
	const stagedCandidates = listStagedCandidates({ cwd });
	return {
		cwd,
		branch: tryRun('git', ['branch', '--show-current'], { cwd }),
		detached: tryRun('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd }) === '',
		head: tryRun('git', ['rev-parse', 'HEAD'], { cwd }),
		originMain: tryRun('git', ['rev-parse', 'origin/main'], { cwd }),
		clean: tryRun('git', ['status', '--porcelain'], { cwd }) === '',
		memoryReadable: resolvedMemoryPath ? existsSync(resolvedMemoryPath) : false,
		memoryPath: resolvedMemoryPath,
		stagedCandidates,
		nextStagedCandidate: stagedCandidates[0] || null,
	};
}

export function preflight({
	cwd = process.cwd(),
	memoryPath,
	skipInstall = false,
	skipChecks = false,
	execFileSyncImpl = execFileSync,
	retryDelayMs = 1500,
} = {}) {
	const resolvedMemoryPath = assertReadableFile(memoryPath);
	const fetchSpec = resolveFetchTarget({ cwd, execFileSyncImpl });

	ensureCleanWorktree(cwd, { execFileSyncImpl });
	runGitWithRetry(['fetch', fetchSpec.target, fetchSpec.refspec], {
		cwd,
		stdio: 'inherit',
		execFileSyncImpl,
		retryDelayMs,
	});
	ensureOnMain(cwd, { execFileSyncImpl });
	run('git', ['merge', '--ff-only', 'origin/main'], { cwd, execFileSyncImpl });

	const head = run('git', ['rev-parse', 'HEAD'], { cwd, execFileSyncImpl });
	const originMain = run('git', ['rev-parse', 'origin/main'], { cwd, execFileSyncImpl });
	if (head !== originMain) {
		throw new Error(`workspace base mismatch: HEAD=${head} origin/main=${originMain}`);
	}

	run('npm', ['--version'], { cwd, execFileSyncImpl });
	const installed = skipInstall ? false : ensureNodeModules(cwd, { execFileSyncImpl });

	if (!skipChecks) {
		run('npm', ['test'], { cwd, stdio: 'inherit', execFileSyncImpl });
		run('npm', ['run', 'build'], { cwd, stdio: 'inherit', execFileSyncImpl });
	}

	return {
		...getWorkspaceStatus({ cwd, memoryPath: resolvedMemoryPath }),
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
	reason = 'cleaned',
	notes = '',
} = {}) {
	const resolvedStagingDir = resolve(cwd, stagingDir);
	const resolvedTarget = slug ? resolve(resolvedStagingDir, slug) : resolvedStagingDir;
	const candidateFile = slug ? resolve(resolvedTarget, 'candidate.json') : null;
	if (slug && memoryPath && existsSync(candidateFile)) {
		recordCandidateState({
			candidateFile,
			memoryPath,
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
				}),
			);
		} else if (command === 'preflight') {
			printJson(
				preflight({
					cwd: args.cwd || process.cwd(),
					memoryPath: args.memory,
					skipInstall: Boolean(args['skip-install']),
					skipChecks: Boolean(args['skip-checks']),
				}),
			);
		} else if (command === 'clean') {
			printJson(
				cleanPublisherState({
					cwd: args.cwd || process.cwd(),
					stagingDir: args['staging-dir'] || '.publisher-staging',
					slug: args.slug,
					memoryPath: args.memory,
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
