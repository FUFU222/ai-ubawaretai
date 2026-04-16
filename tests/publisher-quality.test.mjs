import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const moduleUrl = new URL('../scripts/publisher-quality.mjs', import.meta.url);

function makeFrontmatter(fields) {
	return `---\n${fields.join('\n')}\n---\n\n`;
}

test('scoreCandidate accepts well-sourced, high-interest topic metadata', async () => {
	const { scoreCandidate } = await import(moduleUrl);
	const result = scoreCandidate({
		slug: 'google-search-live-japan-gemini-31-flash-live-2026',
		title: 'Google 検索 Live 日本提供開始',
		company: 'Google',
		date: '2026-03-27',
		intent: '検索 Live 日本開始の意味を解説',
		searchIntent: '検索 Live 日本 提供 開始',
		whyUnique: '検索UIと開発者APIをまとめて扱う',
		japaneseRelevance: 5,
		interestScore: 4,
		sources: [
			{ url: 'https://blog.google/intl/ja-jp/products/explore-get-answers/search-live-global-expansion/', type: 'primary' },
			{ url: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-live/', type: 'primary' },
			{ url: 'https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-3-1-flash-live/', type: 'secondary' },
		],
	});

	assert.equal(result.ok, true);
	assert.ok(result.score >= 8);
});

test('scoreCandidate rejects weak metadata without primary source and relevance', async () => {
	const { scoreCandidate } = await import(moduleUrl);
	const result = scoreCandidate({
		slug: 'generic-ai-roundup',
		title: 'AI roundup',
		company: '',
		date: '',
		intent: '',
		searchIntent: '',
		whyUnique: '',
		japaneseRelevance: 1,
		interestScore: 2,
		sources: [{ url: 'https://example.com/post', type: 'secondary' }],
	});

	assert.equal(result.ok, false);
	assert.ok(result.errors.some((error) => /primary/i.test(error)));
	assert.ok(result.errors.some((error) => /japanese relevance/i.test(error)));
});

test('auditStagedArticleSet accepts complete staged article package', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-quality-'));
	const slug = 'sample-slug';
	const stagedDir = join(root, '.publisher-staging', slug);

	try {
		mkdirSync(stagedDir, { recursive: true });
		writeFileSync(
			join(stagedDir, 'plan.md'),
			[
				'# Plan',
				'- slug: sample-slug',
				'- 日本語タイトル: サンプル記事',
				'- 想定検索意図: OpenAI 新機能 日本',
				'- 見出し案: 何が起きたか / なぜ重要か / 日本への影響',
				'- ソース一覧: source-a, source-b',
			].join('\n'),
		);
		writeFileSync(
			join(stagedDir, 'candidate.json'),
			JSON.stringify({
				slug,
				title: 'OpenAI 新機能の日本市場への影響',
				company: 'OpenAI',
				date: '2026-04-17',
				intent: 'OpenAI 新機能の意味を整理',
				searchIntent: 'OpenAI 新機能 日本',
				whyUnique: '日本企業の導入観点を入れる',
				japaneseRelevance: 5,
				interestScore: 4,
				sources: [
					{ url: 'https://openai.com/index/example', type: 'primary' },
					{ url: 'https://www.theverge.com/example', type: 'secondary' },
				],
			}, null, 2),
		);

		const mainBody = '導入文'.repeat(340) + '\n\n## 何が起きたのか\n' + '本文'.repeat(320) + '\n\n## なぜ重要か\n' + '本文'.repeat(320) + '\n\n## 日本への影響\n' + '本文'.repeat(320) + '\n\n## 今後の論点\n' + '本文'.repeat(320) + '\n\n## 出典\n- [一次](https://openai.com/index/example)\n- [二次](https://www.theverge.com/example)\n';
		const childBody = '導入文'.repeat(190) + '\n\n## 何が起きたの？\n' + '本文'.repeat(160) + '\n\n## なぜ大事？\n' + '本文'.repeat(160) + '\n\n## 日本にどう関係する？\n' + '本文'.repeat(160) + '\n\n## 出典\n- [一次](https://openai.com/index/example)\n- [二次](https://www.theverge.com/example)\n';
		const expertBody = '導入文'.repeat(360) + '\n\n## 何が起きたのか\n' + '本文'.repeat(440) + '\n\n## 技術的な意味\n' + '本文'.repeat(440) + '\n\n## 市場への影響\n' + '本文'.repeat(440) + '\n\n## 日本企業への示唆\n' + '本文'.repeat(440) + '\n\n## 出典\n- [一次](https://openai.com/index/example)\n- [二次](https://www.theverge.com/example)\n';

		writeFileSync(
			join(stagedDir, 'main.md'),
			makeFrontmatter([
				"title: 'OpenAI新機能は日本企業の導入判断をどう変える？'",
				"description: 'OpenAIの新機能を日本市場の導入観点から整理し、何が重要でどこを見極めるべきかを詳しく解説する。'",
				"pubDate: '2026-04-17'",
				"category: 'news'",
				"tags: ['OpenAI', '日本市場', 'AI導入']",
				'draft: false',
			]) + mainBody,
		);
		writeFileSync(
			join(stagedDir, 'child.md'),
			makeFrontmatter([`article: '${slug}'`, "level: 'child'"]) + childBody,
		);
		writeFileSync(
			join(stagedDir, 'expert.md'),
			makeFrontmatter([`article: '${slug}'`, "level: 'expert'"]) + expertBody,
		);

		const { auditStagedArticleSet } = await import(moduleUrl);
		const result = auditStagedArticleSet({ cwd: root, slug });

		assert.equal(result.ok, true);
		assert.equal(result.errors.length, 0);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('auditStagedArticleSet rejects short article package with weak SEO metadata', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-quality-fail-'));
	const slug = 'weak-slug';
	const stagedDir = join(root, '.publisher-staging', slug);

	try {
		mkdirSync(stagedDir, { recursive: true });
		writeFileSync(join(stagedDir, 'plan.md'), '# weak plan\n');
		writeFileSync(
			join(stagedDir, 'candidate.json'),
			JSON.stringify({
				slug,
				title: '弱い記事',
				company: 'OpenAI',
				date: '2026-04-17',
				intent: '弱い記事',
				searchIntent: 'OpenAI',
				whyUnique: '',
				japaneseRelevance: 2,
				interestScore: 2,
				sources: [{ url: 'https://example.com', type: 'secondary' }],
			}, null, 2),
		);
		writeFileSync(
			join(stagedDir, 'main.md'),
			makeFrontmatter([
				"title: '短い'",
				"description: '短い説明'",
				"pubDate: '2026-04-17'",
				"category: 'news'",
				"tags: ['AI']",
				'draft: false',
			]) + '短い本文\n## 出典\n- [one](https://example.com)\n',
		);
		writeFileSync(
			join(stagedDir, 'child.md'),
			makeFrontmatter([`article: '${slug}'`, "level: 'child'"]) + '短い本文\n',
		);
		writeFileSync(
			join(stagedDir, 'expert.md'),
			makeFrontmatter([`article: '${slug}'`, "level: 'expert'"]) + '短い本文\n',
		);

		const { auditStagedArticleSet } = await import(moduleUrl);
		const result = auditStagedArticleSet({ cwd: root, slug });

		assert.equal(result.ok, false);
		assert.ok(result.errors.some((error) => /title/i.test(error)));
		assert.ok(result.errors.some((error) => /3500/i.test(error)));
		assert.ok(result.errors.some((error) => /primary source/i.test(error)));
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
