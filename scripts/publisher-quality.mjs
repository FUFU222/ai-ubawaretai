import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function parseMarkdown(path) {
	const raw = readFileSync(path, 'utf8');
	const match = raw.match(/^---\n([\s\S]*?)\n---\n*([\s\S]*)$/);
	if (!match) {
		throw new Error(`missing frontmatter: ${path}`);
	}

	const frontmatter = {};
	for (const line of match[1].split('\n')) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;
		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		frontmatter[key] = value;
	}

	return {
		frontmatter,
		body: match[2],
		raw,
	};
}

function stripQuotes(value) {
	return String(value || '').replace(/^['"]|['"]$/g, '');
}

function countH2(body) {
	return (body.match(/^## /gm) || []).length;
}

function countSourceLinks(body) {
	const sectionMatch = body.match(/## 出典[\s\S]*$/);
	if (!sectionMatch) return 0;
	return (sectionMatch[0].match(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g) || []).length;
}

function hasPlaceholderText(body) {
	return /(TODO|TBD|本文をここに書く|<slug>|あとで書く)/i.test(body);
}

function asNumber(value) {
	return Number(value || 0);
}

export function scoreCandidate(candidate) {
	const errors = [];
	const sources = Array.isArray(candidate.sources) ? candidate.sources : [];
	const primarySources = sources.filter((source) => source.type === 'primary');

	if (!candidate.slug) errors.push('candidate slug is required');
	if (!candidate.title) errors.push('candidate title is required');
	if (!candidate.company) errors.push('candidate company is required');
	if (!candidate.date) errors.push('candidate date is required');
	if (!candidate.intent) errors.push('candidate intent is required');
	if (!candidate.searchIntent) errors.push('candidate search intent is required');
	if (!candidate.whyUnique) errors.push('candidate unique angle is required');
	if (sources.length < 2) errors.push('candidate must include at least 2 sources');
	if (primarySources.length < 1) errors.push('candidate must include at least 1 primary source');
	if (asNumber(candidate.japaneseRelevance) < 3) errors.push('candidate japanese relevance score must be 3 or higher');
	if (asNumber(candidate.interestScore) < 3) errors.push('candidate interest score must be 3 or higher');

	const score =
		Math.min(sources.length, 3) +
		(asNumber(candidate.japaneseRelevance) || 0) +
		(asNumber(candidate.interestScore) || 0) +
		(primarySources.length > 0 ? 1 : 0) +
		(candidate.whyUnique ? 1 : 0);

	if (score < 8) {
		errors.push(`candidate score must be at least 8, got ${score}`);
	}

	return {
		ok: errors.length === 0,
		score,
		errors,
	};
}

function auditPlan(planPath) {
	const errors = [];
	const text = readFileSync(planPath, 'utf8');
	for (const keyword of ['slug', '日本語タイトル', '想定検索意図', '見出し', 'ソース']) {
		if (!text.includes(keyword)) {
			errors.push(`plan is missing ${keyword}`);
		}
	}
	return errors;
}

function auditMainArticle(mainPath, candidate) {
	const errors = [];
	const { frontmatter, body } = parseMarkdown(mainPath);
	const title = stripQuotes(frontmatter.title);
	const description = stripQuotes(frontmatter.description);
	const tags = frontmatter.tags || '';
	const category = stripQuotes(frontmatter.category);
	const draft = stripQuotes(frontmatter.draft);

	if (title.length < 20 || title.length > 80) errors.push(`main title length must be 20-80 chars, got ${title.length}`);
	if (description.length < 40 || description.length > 160) errors.push(`main description length must be 40-160 chars, got ${description.length}`);
	if (!category) errors.push('main category is required');
	if (draft !== 'false') errors.push('main draft must be false');
	if ((tags.match(/,/g) || []).length < 2) errors.push('main tags must include at least 3 items');
	if (body.length < 3500) errors.push(`main article must be at least 3500 chars, got ${body.length}`);
	if (countH2(body) < 3) errors.push('main article must include at least 3 H2 sections');
	if (countSourceLinks(body) < 2) errors.push('main article must include at least 2 source links');
	if (hasPlaceholderText(body)) errors.push('main article contains placeholder text');

	const keywordHaystack = `${title} ${description} ${body.slice(0, 600)}`;
	const searchTokens = String(candidate.searchIntent || '')
		.split(/\s+/)
		.map((token) => token.trim())
		.filter((token) => token.length >= 2);
	const matchedKeywords = searchTokens.filter((token) => keywordHaystack.includes(token));
	if (searchTokens.length > 0 && matchedKeywords.length === 0) {
		errors.push('main article does not reflect search intent keywords');
	}

	return errors;
}

function auditLevelArticle(levelPath, slug, expectedLevel, minChars) {
	const errors = [];
	const { frontmatter, body } = parseMarkdown(levelPath);
	const article = stripQuotes(frontmatter.article);
	const level = stripQuotes(frontmatter.level);

	if (article !== slug) errors.push(`${expectedLevel} article frontmatter must match slug`);
	if (level !== expectedLevel) errors.push(`${expectedLevel} level frontmatter is invalid`);
	if (body.length < minChars) errors.push(`${expectedLevel} article must be at least ${minChars} chars, got ${body.length}`);
	if (countH2(body) < 3) errors.push(`${expectedLevel} article must include at least 3 H2 sections`);
	if (countSourceLinks(body) < 2) errors.push(`${expectedLevel} article must include at least 2 source links`);
	if (hasPlaceholderText(body)) errors.push(`${expectedLevel} article contains placeholder text`);

	return errors;
}

export function auditStagedArticleSet({ cwd = process.cwd(), slug, stagingDir = '.publisher-staging' }) {
	const stagedDir = resolve(cwd, stagingDir, slug);
	const paths = {
		plan: resolve(stagedDir, 'plan.md'),
		candidate: resolve(stagedDir, 'candidate.json'),
		main: resolve(stagedDir, 'main.md'),
		child: resolve(stagedDir, 'child.md'),
		expert: resolve(stagedDir, 'expert.md'),
	};

	const errors = [];
	for (const [name, filePath] of Object.entries(paths)) {
		if (!existsSync(filePath)) {
			errors.push(`missing ${name} file: ${filePath}`);
		}
	}
	if (errors.length > 0) {
		return { ok: false, errors };
	}

	const candidate = readJson(paths.candidate);
	const candidateResult = scoreCandidate(candidate);
	errors.push(...candidateResult.errors);
	errors.push(...auditPlan(paths.plan));
	errors.push(...auditMainArticle(paths.main, candidate));
	errors.push(...auditLevelArticle(paths.child, slug, 'child', 1600));
	errors.push(...auditLevelArticle(paths.expert, slug, 'expert', 4500));

	return {
		ok: errors.length === 0,
		score: candidateResult.score,
		errors,
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
		if (command === 'score-candidate') {
			const result = scoreCandidate(readJson(resolve(args.file)));
			printJson(result);
			process.exit(result.ok ? 0 : 1);
		} else if (command === 'audit-stage') {
			const result = auditStagedArticleSet({
				cwd: args.cwd || process.cwd(),
				slug: args.slug,
				stagingDir: args['staging-dir'] || '.publisher-staging',
			});
			printJson(result);
			process.exit(result.ok ? 0 : 1);
		} else {
			throw new Error(`unknown command: ${command}`);
		}
	} catch (error) {
		process.stderr.write(`${error.message}\n`);
		process.exit(1);
	}
}
