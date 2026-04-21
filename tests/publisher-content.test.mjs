import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const moduleUrl = new URL('../scripts/publisher-content.mjs', import.meta.url);

test('duplicate check flags same company and intent across memory and recent posts', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-content-'));
	const blogDir = join(root, 'src', 'content', 'blog');
	const memoryPath = join(root, 'memory.md');

	try {
		mkdirSync(blogDir, { recursive: true });
		writeFileSync(
			join(blogDir, 'openai-cloudflare-agent-cloud-gpt54-codex-2026.md'),
			`---
title: "OpenAIとCloudflareのAgent Cloud拡張"
description: "desc"
pubDate: "2026-04-14"
category: "news"
tags: ["OpenAI"]
draft: false
---

OpenAI が Cloudflare と組んで Agent Cloud を拡張した話。`,
		);
		writeFileSync(
			memoryPath,
			`## 2026-04-14\n- OpenAI / 2026-04-14 / Agent Cloud expansion covered`,
		);

		const { checkDuplicateCandidate } = await import(moduleUrl);
		const result = checkDuplicateCandidate({
			blogDir,
			memoryPath,
			candidate: {
				slug: 'openai-agent-cloud-followup-2026',
				title: 'OpenAI Agent Cloud expansion follow-up',
				company: 'OpenAI',
				date: '2026-04-14',
				intent: 'Agent Cloud expansion',
			},
		});

		assert.equal(result.isDuplicate, true);
		assert.ok(result.matches.length >= 1);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('duplicate check ignores memory entry for same unpublished staged candidate', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-content-'));
	const blogDir = join(root, 'src', 'content', 'blog');
	const memoryPath = join(root, 'memory.md');

	try {
		mkdirSync(blogDir, { recursive: true });
		writeFileSync(
			memoryPath,
			`## 2026-04-18 12:17 JST

- 採用候補: \`anthropic-claude-opus-47-agentic-coding-2026\`
- publish 成否: 未公開
- staging 残存: \`.publisher-staging/anthropic-claude-opus-47-agentic-coding-2026/\` を保持したまま停止
`,
		);

		const { checkDuplicateCandidate } = await import(moduleUrl);
		const result = checkDuplicateCandidate({
			blogDir,
			memoryPath,
			candidate: {
				slug: 'anthropic-claude-opus-47-agentic-coding-2026',
				title: 'AnthropicのClaude Opus 4.7公開',
				company: 'Anthropic',
				date: '2026-04-16',
				intent: 'Claude Opus 4.7の一般提供開始と実務インパクト',
			},
		});

		assert.equal(result.isDuplicate, false);
		assert.deepEqual(result.matches, []);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('duplicate check ignores status-only memory sections that merely mention the staged slug', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-content-'));
	const blogDir = join(root, 'src', 'content', 'blog');
	const memoryPath = join(root, 'memory.md');

	try {
		mkdirSync(blogDir, { recursive: true });
		writeFileSync(
			memoryPath,
			`## 2026-04-20T14:04:16Z local-start-gate-failure

- 判定: \`nextStagedCandidate\` は \`cyberagent-chatgpt-enterprise-codex-japan-2026\` だったが、dirty worktree のため再開不可。
`,
		);

		const { checkDuplicateCandidate } = await import(moduleUrl);
		const result = checkDuplicateCandidate({
			blogDir,
			memoryPath,
			candidate: {
				slug: 'cyberagent-chatgpt-enterprise-codex-japan-2026',
				title: 'サイバーエージェントがChatGPT EnterpriseとCodexを導入',
				company: 'CyberAgent',
				date: '2026-04-20',
				intent: 'ChatGPT EnterpriseとCodexの導入事例',
			},
		});

		assert.equal(result.isDuplicate, false);
		assert.deepEqual(result.matches, []);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('duplicate check prefers structured state over freeform memory when state exists', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-content-'));
	const blogDir = join(root, 'src', 'content', 'blog');
	const memoryPath = join(root, 'memory.md');
	const statePath = join(root, 'publisher-state.jsonl');

	try {
		mkdirSync(blogDir, { recursive: true });
		writeFileSync(
			memoryPath,
			`## 2026-04-21T00:00:00Z note

- nextStagedCandidate: \`cyberagent-chatgpt-enterprise-codex-japan-2026\`
`,
		);
		writeFileSync(
			statePath,
			`${JSON.stringify({
				recordedAt: '2026-04-21T00:00:00Z',
				slug: 'other-entry',
				title: 'Other entry',
				company: 'Other',
				date: '2026-04-20',
				intent: 'Other intent',
				outcome: 'quality_rejected',
				publishStatus: 'unpublished',
				stagingRetained: false,
			})}\n`,
		);

		const { checkDuplicateCandidate } = await import(moduleUrl);
		const result = checkDuplicateCandidate({
			blogDir,
			memoryPath,
			candidate: {
				slug: 'cyberagent-chatgpt-enterprise-codex-japan-2026',
				title: 'サイバーエージェントがChatGPT EnterpriseとCodexを導入',
				company: 'CyberAgent',
				date: '2026-04-20',
				intent: 'ChatGPT EnterpriseとCodexの導入事例',
			},
		});

		assert.equal(result.isDuplicate, false);
		assert.deepEqual(result.matches, []);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('promoteStagedArticle copies staged files into publish locations and removes staging', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-promote-'));
	const stagingRoot = join(root, '.publisher-staging');
	const slug = 'test-slug';
	const stagedDir = join(stagingRoot, slug);

	try {
		mkdirSync(join(root, 'src', 'content', 'blog'), { recursive: true });
		mkdirSync(join(root, 'src', 'content', 'blog-levels', slug), { recursive: true });
		mkdirSync(stagedDir, { recursive: true });

		writeFileSync(join(stagedDir, 'main.md'), '# main\n');
		writeFileSync(join(stagedDir, 'child.md'), '# child\n');
		writeFileSync(join(stagedDir, 'expert.md'), '# expert\n');

		const { promoteStagedArticle } = await import(moduleUrl);
		const result = promoteStagedArticle({ cwd: root, slug });

		assert.equal(result.slug, slug);
		assert.equal(readFileSync(join(root, 'src', 'content', 'blog', `${slug}.md`), 'utf8'), '# main\n');
		assert.equal(
			readFileSync(join(root, 'src', 'content', 'blog-levels', slug, 'child.md'), 'utf8'),
			'# child\n',
		);
		assert.equal(
			readFileSync(join(root, 'src', 'content', 'blog-levels', slug, 'expert.md'), 'utf8'),
			'# expert\n',
		);
		assert.equal(existsSync(stagedDir), false);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('promoteStagedArticle records a published entry in structured state when memory path is provided', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-promote-'));
	const stagingRoot = join(root, '.publisher-staging');
	const memoryPath = join(root, 'memory.md');
	const slug = 'test-slug';
	const stagedDir = join(stagingRoot, slug);

	try {
		writeFileSync(memoryPath, '# memory\n');
		mkdirSync(join(root, 'src', 'content', 'blog'), { recursive: true });
		mkdirSync(join(root, 'src', 'content', 'blog-levels', slug), { recursive: true });
		mkdirSync(stagedDir, { recursive: true });

		writeFileSync(
			join(stagedDir, 'candidate.json'),
			JSON.stringify({
				slug,
				title: 'テスト候補',
				company: 'OpenAI',
				date: '2026-04-21',
				intent: 'テスト候補の意味を解説',
				searchIntent: 'OpenAI テスト候補',
				whyUnique: 'テスト',
			}, null, 2),
		);
		writeFileSync(join(stagedDir, 'main.md'), '# main\n');
		writeFileSync(join(stagedDir, 'child.md'), '# child\n');
		writeFileSync(join(stagedDir, 'expert.md'), '# expert\n');

		const { promoteStagedArticle } = await import(moduleUrl);
		promoteStagedArticle({ cwd: root, slug, memoryPath });

		const stateEntries = readFileSync(join(root, 'publisher-state.jsonl'), 'utf8')
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line));
		assert.equal(stateEntries.length, 1);
		assert.equal(stateEntries[0].slug, slug);
		assert.equal(stateEntries[0].outcome, 'published');
		assert.equal(stateEntries[0].publishStatus, 'published');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('duplicate check can read structured state without legacy memory path', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-content-'));
	const blogDir = join(root, 'src', 'content', 'blog');
	const statePath = join(root, 'publisher-state.jsonl');

	try {
		mkdirSync(blogDir, { recursive: true });
		writeFileSync(
			statePath,
			`${JSON.stringify({
				recordedAt: '2026-04-21T00:00:00Z',
				slug: 'openai-enterprise-ai-followup-2026',
				title: 'OpenAI enterprise AI follow-up',
				company: 'OpenAI',
				date: '2026-04-21',
				intent: 'enterprise AI follow-up',
				outcome: 'published',
				publishStatus: 'published',
				stagingRetained: false,
			})}\n`,
		);

		const { checkDuplicateCandidate } = await import(moduleUrl);
		const result = checkDuplicateCandidate({
			blogDir,
			statePath,
			candidate: {
				slug: 'openai-enterprise-ai-followup-2026-second-angle',
				title: 'OpenAI enterprise AI follow-up',
				company: 'OpenAI',
				date: '2026-04-21',
				intent: 'enterprise AI follow-up',
			},
		});

		assert.equal(result.isDuplicate, true);
		assert.equal(result.matches[0].type, 'state');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('promoteStagedArticle records a published entry when explicit state path is provided', async () => {
	const root = mkdtempSync(join(tmpdir(), 'publisher-promote-'));
	const stagingRoot = join(root, '.publisher-staging');
	const statePath = join(root, 'publisher-state.jsonl');
	const slug = 'state-path-slug';
	const stagedDir = join(stagingRoot, slug);

	try {
		mkdirSync(join(root, 'src', 'content', 'blog'), { recursive: true });
		mkdirSync(join(root, 'src', 'content', 'blog-levels', slug), { recursive: true });
		mkdirSync(stagedDir, { recursive: true });

		writeFileSync(
			join(stagedDir, 'candidate.json'),
			JSON.stringify({
				slug,
				title: 'state path test',
				company: 'OpenAI',
				date: '2026-04-21',
				intent: 'state path promotion',
				searchIntent: 'OpenAI state path promotion',
				whyUnique: 'state path test',
			}, null, 2),
		);
		writeFileSync(join(stagedDir, 'main.md'), '# main\n');
		writeFileSync(join(stagedDir, 'child.md'), '# child\n');
		writeFileSync(join(stagedDir, 'expert.md'), '# expert\n');

		const { promoteStagedArticle } = await import(moduleUrl);
		promoteStagedArticle({ cwd: root, slug, statePath });

		const stateEntries = readFileSync(statePath, 'utf8')
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line));
		assert.equal(stateEntries.length, 1);
		assert.equal(stateEntries[0].slug, slug);
		assert.equal(stateEntries[0].outcome, 'published');
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
