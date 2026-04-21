import assert from 'node:assert/strict';
import test from 'node:test';

import { generateHeroSvg } from '../src/utils/generative-hero.ts';

function getTextNodes(svg) {
	return [...svg.matchAll(/>([^<>]+)</g)]
		.map((match) => match[1])
		.filter((text) => /\S/.test(text));
}

test('hero output keeps the full leading AI phrase for Sakana AI titles', () => {
	const svg = generateHeroSvg('Sakana AIがSNS可視化・ファクトチェック・拡散を発表');
	const textNodes = getTextNodes(svg);

	assert.ok(
		textNodes.includes('Sakana AI'),
		`Expected full "Sakana AI" label in SVG text nodes, got: ${JSON.stringify(textNodes)}`,
	);
});

test('hero output prefers the leading AI phrase over later known brands', () => {
	const svg =
		generateHeroSvg('Perplexity AIに集団訴訟——ユーザーの会話データがMetaとGoogleに流れていた疑惑の深層');
	const textNodes = getTextNodes(svg);

	assert.ok(
		textNodes.includes('Perplexity AI'),
		`Expected full "Perplexity AI" label in SVG text nodes, got: ${JSON.stringify(textNodes)}`,
	);
});
