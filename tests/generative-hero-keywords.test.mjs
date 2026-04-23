import assert from 'node:assert/strict';
import test from 'node:test';

import { buildHeroCopy, generateHeroSvg } from '../src/utils/generative-hero.ts';

function getTextNodes(svg) {
	return [...svg.matchAll(/>([^<>]+)</g)]
		.map((match) => match[1])
		.filter((text) => /\S/.test(text));
}

test('hero output keeps the full leading AI phrase for Sakana AI titles', () => {
	const copy = buildHeroCopy('Sakana AIがSNS可視化・ファクトチェック・拡散を発表');

	assert.equal(copy.brand, 'Sakana AI');
	assert.ok(copy.topic.includes('SNS可視化') || copy.topic.includes('ファクトチェック'));
});

test('hero output prefers the leading AI phrase over later known brands', () => {
	const copy =
		buildHeroCopy('Perplexity AIに集団訴訟——ユーザーの会話データがMetaとGoogleに流れていた疑惑の深層');

	assert.equal(copy.brand, 'Perplexity AI');
	assert.ok(copy.deck.includes('ユーザーの会話データ') || copy.topic.includes('集団訴訟'));
});

test('hero copy preserves quoted product names and practical deck lines', () => {
	const copy = buildHeroCopy('OpenAI 「ChatGPT Images 2.0」とは？ 何が変わり、日本の実務にどう効くか');

	assert.equal(copy.brand, 'OpenAI');
	assert.equal(copy.topic, 'ChatGPT Images 2.0');
	assert.ok(copy.deck.includes('日本の実務'));
});

test('hero svg no longer emits visibly truncated fragments like Ope for Codex Labs titles', () => {
	const svg = generateHeroSvg('OpenAI「Codex Labs」とは？ SI連携で進む企業導入の要点を整理');
	const textNodes = getTextNodes(svg);
	const joined = textNodes.join(' ');

	assert.ok(joined.includes('OpenAI'));
	assert.ok(joined.includes('Codex Labs'));
	assert.ok(joined.includes('企業導入') || joined.includes('SI連携'));
	assert.ok(!textNodes.includes('Ope'), `Unexpected truncated token in SVG text nodes: ${JSON.stringify(textNodes)}`);
});

test('hero copy falls back from the side-by-side layout when brand and topic would collide', () => {
	const copy =
		buildHeroCopy('OpenAI Codexがプラグイン機能を導入——コーディングツールから「開発プラットフォーム」への転換点か？');

	assert.equal(copy.variant, 0);
	assert.ok(copy.brandLines.join(' ').includes('OpenAI Codex'));
	assert.ok(copy.topicLines.join(' ').includes('開発プラットフォーム'));
});

test('hero copy wraps long latin phrases by word instead of leaving a stray one-letter line', () => {
	const copy = buildHeroCopy('Google Gemini API Docs MCPで開発者スキルはどう変わるか');

	assert.ok(copy.brandLines.every((line) => line.trim().length > 1), `Unexpected brand lines: ${JSON.stringify(copy.brandLines)}`);
	assert.ok(!copy.brandLines.includes('s'), `Unexpected single-letter line in brand lines: ${JSON.stringify(copy.brandLines)}`);
});
