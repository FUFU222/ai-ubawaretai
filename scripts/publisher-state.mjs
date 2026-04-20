import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

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

function normalizeStringArray(values) {
	return [...new Set(
		(values || [])
			.flatMap((value) => String(value || '').split('|'))
			.map((value) => value.trim())
			.filter(Boolean),
	)];
}

function printJson(payload) {
	process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

export function deriveStatePath({ memoryPath, statePath } = {}) {
	if (statePath) {
		return resolve(statePath);
	}

	if (!memoryPath) {
		throw new Error('memory path or state path is required');
	}

	return resolve(dirname(resolve(memoryPath)), 'publisher-state.jsonl');
}

export function ensurePublisherState({ memoryPath, statePath } = {}) {
	const resolvedStatePath = deriveStatePath({ memoryPath, statePath });
	mkdirSync(dirname(resolvedStatePath), { recursive: true });
	if (!existsSync(resolvedStatePath)) {
		writeFileSync(resolvedStatePath, '');
	}
	return resolvedStatePath;
}

export function loadPublisherState({ memoryPath, statePath } = {}) {
	const resolvedStatePath = deriveStatePath({ memoryPath, statePath });
	if (!existsSync(resolvedStatePath)) {
		return [];
	}

	return readFileSync(resolvedStatePath, 'utf8')
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => JSON.parse(line));
}

export function recordCandidateState({
	candidateFile,
	memoryPath,
	statePath,
	outcome,
	publishStatus = 'unpublished',
	stagingRetained = false,
	duplicateReasons = [],
	topicsToAvoid = [],
	notes = '',
	recordedAt = new Date().toISOString(),
} = {}) {
	if (!candidateFile) {
		throw new Error('candidate file is required');
	}
	if (!outcome) {
		throw new Error('outcome is required');
	}

	const resolvedStatePath = ensurePublisherState({ memoryPath, statePath });
	const candidate = JSON.parse(readFileSync(resolve(candidateFile), 'utf8'));
	const entry = {
		recordedAt,
		slug: candidate.slug || '',
		title: candidate.title || '',
		company: candidate.company || '',
		date: candidate.date || '',
		intent: candidate.intent || '',
		searchIntent: candidate.searchIntent || '',
		whyUnique: candidate.whyUnique || '',
		outcome,
		publishStatus,
		stagingRetained: Boolean(stagingRetained),
		duplicateReasons: normalizeStringArray(duplicateReasons),
		topicsToAvoid: normalizeStringArray(topicsToAvoid),
		notes: String(notes || ''),
	};

	appendFileSync(resolvedStatePath, `${JSON.stringify(entry)}\n`);
	return {
		statePath: resolvedStatePath,
		entry,
	};
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [command] = process.argv.slice(2);
	const args = parseArgs(process.argv.slice(3));

	try {
		if (command === 'ensure') {
			printJson({
				statePath: ensurePublisherState({
					memoryPath: args.memory,
					statePath: args.state,
				}),
			});
		} else if (command === 'record') {
			printJson(
				recordCandidateState({
					candidateFile: args.file,
					memoryPath: args.memory,
					statePath: args.state,
					outcome: args.outcome,
					publishStatus: args['publish-status'] || 'unpublished',
					stagingRetained: Boolean(args['staging-retained']),
					duplicateReasons: args['duplicate-reasons']
						? args['duplicate-reasons'].split(',')
						: [],
					topicsToAvoid: args['topics-to-avoid']
						? args['topics-to-avoid'].split('|')
						: [],
					notes: args.notes || '',
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
