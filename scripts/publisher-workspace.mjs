import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

function run(command, args, options = {}) {
	const output = execFileSync(command, args, {
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		...options,
	});
	return typeof output === 'string' ? output.trim() : '';
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
		execFileSync(command, args, {
			stdio: 'ignore',
			...options,
		});
		return true;
	} catch {
		return false;
	}
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

function ensureCleanWorktree(cwd) {
	const status = run('git', ['status', '--porcelain'], { cwd });
	if (status.length > 0) {
		throw new Error('worktree has uncommitted changes');
	}
}

function ensureOnMain(cwd) {
	const hasMain = commandSucceeds('git', ['show-ref', '--verify', '--quiet', 'refs/heads/main'], { cwd });
	if (!hasMain) {
		run('git', ['switch', '--track', '-c', 'main', 'origin/main'], { cwd });
		return;
	}

	run('git', ['switch', 'main'], { cwd });
}

function ensureNodeModules(cwd) {
	const nodeModulesPath = resolve(cwd, 'node_modules');
	if (existsSync(nodeModulesPath)) {
		return false;
	}

	run('npm', ['install'], { cwd, stdio: 'inherit' });
	return true;
}

export function getWorkspaceStatus({ cwd = process.cwd(), memoryPath }) {
	const resolvedMemoryPath = memoryPath ? resolve(memoryPath) : null;
	return {
		cwd,
		branch: tryRun('git', ['branch', '--show-current'], { cwd }),
		detached: tryRun('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], { cwd }) === '',
		head: tryRun('git', ['rev-parse', 'HEAD'], { cwd }),
		originMain: tryRun('git', ['rev-parse', 'origin/main'], { cwd }),
		clean: tryRun('git', ['status', '--porcelain'], { cwd }) === '',
		memoryReadable: resolvedMemoryPath ? existsSync(resolvedMemoryPath) : false,
		memoryPath: resolvedMemoryPath,
	};
}

export function preflight({
	cwd = process.cwd(),
	memoryPath,
	skipInstall = false,
	skipChecks = false,
} = {}) {
	const resolvedMemoryPath = assertReadableFile(memoryPath);

	ensureCleanWorktree(cwd);
	run('git', ['fetch', 'origin', 'main'], { cwd, stdio: 'inherit' });
	ensureOnMain(cwd);
	run('git', ['merge', '--ff-only', 'origin/main'], { cwd });

	const head = run('git', ['rev-parse', 'HEAD'], { cwd });
	const originMain = run('git', ['rev-parse', 'origin/main'], { cwd });
	if (head !== originMain) {
		throw new Error(`workspace base mismatch: HEAD=${head} origin/main=${originMain}`);
	}

	run('npm', ['--version'], { cwd });
	const installed = skipInstall ? false : ensureNodeModules(cwd);

	if (!skipChecks) {
		run('npm', ['test'], { cwd, stdio: 'inherit' });
		run('npm', ['run', 'build'], { cwd, stdio: 'inherit' });
	}

	return {
		...getWorkspaceStatus({ cwd, memoryPath: resolvedMemoryPath }),
		installedDependencies: installed,
	};
}

export function cleanPublisherState({ cwd = process.cwd(), stagingDir = '.publisher-staging' } = {}) {
	const resolvedStagingDir = resolve(cwd, stagingDir);
	rmSync(resolvedStagingDir, { recursive: true, force: true });
	return { cleaned: true, stagingDir: resolvedStagingDir };
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
