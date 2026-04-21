import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublisherState, recordCandidateState } from './publisher-state.mjs';

function normalize(value) {
	return String(value || '')
		.normalize('NFKC')
		.toLowerCase()
		.replace(/[\s\-_]+/g, ' ')
		.replace(/[^\p{L}\p{N} ]/gu, '')
		.trim();
}

function readFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		return {};
	}

	const frontmatter = {};
	for (const line of match[1].split('\n')) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;
		const key = line.slice(0, separator).trim();
		const rawValue = line.slice(separator + 1).trim();
		frontmatter[key] = rawValue.replace(/^"(.*)"$/, '$1');
	}

	return frontmatter;
}

function listBlogEntries(blogDir) {
	if (!existsSync(blogDir)) {
		return [];
	}

	return readdirSync(blogDir)
		.filter((entry) => /\.(md|mdx)$/.test(entry))
		.map((entry) => {
			const content = readFileSync(resolve(blogDir, entry), 'utf8');
			const frontmatter = readFrontmatter(content);
			return {
				slug: entry.replace(/\.(md|mdx)$/, ''),
				title: frontmatter.title || '',
				description: frontmatter.description || '',
				pubDate: frontmatter.pubDate || '',
				content,
			};
		});
}

function collectReasons(candidate, haystack) {
	const reasons = [];
	const normalizedTitle = normalize(candidate.title);
	const normalizedSlug = normalize(candidate.slug);
	const normalizedCompany = normalize(candidate.company);
	const normalizedDate = normalize(candidate.date);
	const normalizedIntent = normalize(candidate.intent);

	if (normalizedSlug && haystack.includes(normalizedSlug)) {
		reasons.push('slug');
	}
	if (normalizedTitle && haystack.includes(normalizedTitle)) {
		reasons.push('title');
	}
	if (normalizedCompany && haystack.includes(normalizedCompany)) {
		reasons.push('company');
	}
	if (normalizedDate && haystack.includes(normalizedDate)) {
		reasons.push('date');
	}
	if (normalizedIntent && haystack.includes(normalizedIntent)) {
		reasons.push('intent');
	}

	return reasons;
}

function splitMemorySections(memoryText) {
	const sections = memoryText
		.split(/^## /m)
		.filter(Boolean)
		.map((section) => `## ${section}`.trim());

	return sections.length > 0 ? sections : [memoryText];
}

function isUnpublishedRetrySection(sectionText, candidate) {
	const haystack = normalize(sectionText);
	const slug = normalize(candidate.slug);
	if (!slug || !haystack.includes(slug)) {
		return false;
	}

	for (const marker of [
		'publish 成否 未公開',
		'publish成否未公開',
		'staging 残存',
		'staging残存',
		'unpublished commit なし',
		'unpublished commitなし',
	]) {
		if (haystack.includes(normalize(marker))) {
			return true;
		}
	}

	return false;
}

function sanitizeMemoryReasons(reasons) {
	if (!reasons.includes('slug')) {
		return reasons;
	}

	// Memory often logs staged slugs during recovery/status reporting. Treat the slug itself
	// as bookkeeping unless the section also repeats the exact title.
	return reasons.filter((reason) => reason === 'title');
}

export function checkDuplicateCandidate({ candidate, blogDir, memoryPath, statePath }) {
	const matches = [];
	const blogEntries = listBlogEntries(blogDir);
	for (const entry of blogEntries) {
		const haystack = normalize(
			`${entry.slug} ${entry.title} ${entry.description} ${entry.pubDate} ${entry.content}`,
		);
		const reasons = collectReasons(candidate, haystack);
		if (reasons.includes('slug') || reasons.includes('title') || reasons.length >= 2) {
			matches.push({ type: 'post', source: entry.slug, reasons });
		}
	}

	const stateEntries = memoryPath || statePath ? loadPublisherState({ memoryPath, statePath }) : [];
	if (stateEntries.length > 0) {
		for (const entry of stateEntries) {
			if (entry.slug === candidate.slug && entry.publishStatus !== 'published') {
				continue;
			}

			const reasons = collectReasons(
				candidate,
				normalize(
					[
						entry.slug,
						entry.title,
						entry.company,
						entry.date,
						entry.intent,
						entry.searchIntent,
						entry.whyUnique,
						...(entry.topicsToAvoid || []),
						...(entry.duplicateReasons || []),
					].join(' '),
				),
			);

			if (reasons.includes('title') || reasons.length >= 2) {
				matches.push({ type: 'state', source: 'publisher-state.jsonl', reasons });
				break;
			}
		}
	} else if (memoryPath && existsSync(memoryPath)) {
		const memoryText = readFileSync(memoryPath, 'utf8');
		for (const sectionText of splitMemorySections(memoryText)) {
			if (isUnpublishedRetrySection(sectionText, candidate)) {
				continue;
			}

			const reasons = sanitizeMemoryReasons(
				collectReasons(candidate, normalize(sectionText)),
			);
			if (reasons.includes('title') || reasons.length >= 2) {
				matches.push({ type: 'memory', source: resolve(memoryPath), reasons });
				break;
			}
		}
	}

	return {
		isDuplicate: matches.length > 0,
		matches,
	};
}

export function promoteStagedArticle({
	cwd = process.cwd(),
	slug,
	stagingDir = '.publisher-staging',
	memoryPath,
	statePath,
} = {}) {
	const stagedDir = resolve(cwd, stagingDir, slug);
	const candidateSource = resolve(stagedDir, 'candidate.json');
	const mainSource = resolve(stagedDir, 'main.md');
	const childSource = resolve(stagedDir, 'child.md');
	const expertSource = resolve(stagedDir, 'expert.md');

	for (const file of [mainSource, childSource, expertSource]) {
		if (!existsSync(file)) {
			throw new Error(`missing staged file: ${file}`);
		}
	}

	const blogTarget = resolve(cwd, 'src', 'content', 'blog', `${slug}.md`);
	const levelsTargetDir = resolve(cwd, 'src', 'content', 'blog-levels', slug);
	mkdirSync(levelsTargetDir, { recursive: true });

	copyFileSync(mainSource, blogTarget);
	copyFileSync(childSource, resolve(levelsTargetDir, 'child.md'));
	copyFileSync(expertSource, resolve(levelsTargetDir, 'expert.md'));
	if ((memoryPath || statePath) && existsSync(candidateSource)) {
		recordCandidateState({
			candidateFile: candidateSource,
			memoryPath,
			statePath,
			outcome: 'published',
			publishStatus: 'published',
		});
	}
	rmSync(stagedDir, { recursive: true, force: true });

	return {
		slug,
		blogTarget,
		levelsTargetDir,
	};
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
		if (command === 'check-duplicate') {
			const candidate = JSON.parse(readFileSync(resolve(args.file), 'utf8'));
			const result = checkDuplicateCandidate({
				candidate,
				blogDir: resolve(args.cwd || process.cwd(), 'src', 'content', 'blog'),
				memoryPath: args.memory,
				statePath: args.state,
			});
			printJson(result);
			process.exit(result.isDuplicate ? 1 : 0);
		} else if (command === 'promote') {
			printJson(
				promoteStagedArticle({
					cwd: args.cwd || process.cwd(),
					slug: args.slug,
					stagingDir: args['staging-dir'] || '.publisher-staging',
					memoryPath: args.memory,
					statePath: args.state,
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
