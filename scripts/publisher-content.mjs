import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

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

export function checkDuplicateCandidate({ candidate, blogDir, memoryPath }) {
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

	if (memoryPath && existsSync(memoryPath)) {
		const memoryText = normalize(readFileSync(memoryPath, 'utf8'));
		const reasons = collectReasons(candidate, memoryText);
		if (reasons.includes('title') || reasons.length >= 2) {
			matches.push({ type: 'memory', source: resolve(memoryPath), reasons });
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
} = {}) {
	const stagedDir = resolve(cwd, stagingDir, slug);
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
			});
			printJson(result);
			process.exit(result.isDuplicate ? 1 : 0);
		} else if (command === 'promote') {
			printJson(
				promoteStagedArticle({
					cwd: args.cwd || process.cwd(),
					slug: args.slug,
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
