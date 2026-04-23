/**
 * Deterministic SVG thumbnail generator for article cards.
 * It favors readability and topic clarity over dramatic random layouts.
 */

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const SANS = `'Avenir Next','Hiragino Sans','Noto Sans JP','Yu Gothic','Meiryo',sans-serif`;

type HeroTheme = {
	key: string;
	bgFrom: string;
	bgTo: string;
	accent: string;
	accentSoft: string;
	glow: string;
	panel: string;
};

type HeroVariant = 0 | 1 | 2;

export type HeroCopy = {
	brand: string;
	brandLines: string[];
	topic: string;
	topicLines: string[];
	deck: string;
	deckLines: string[];
	kicker: string;
	theme: HeroTheme;
	variant: HeroVariant;
};

const THEME_FALLBACKS: HeroTheme[] = [
	{
		key: 'teal',
		bgFrom: '#041311',
		bgTo: '#020605',
		accent: '#2dd4bf',
		accentSoft: '#99f6e4',
		glow: '#0f766e',
		panel: '#0d1f1c',
	},
	{
		key: 'blue',
		bgFrom: '#07111f',
		bgTo: '#03060b',
		accent: '#60a5fa',
		accentSoft: '#bfdbfe',
		glow: '#1d4ed8',
		panel: '#101c30',
	},
	{
		key: 'amber',
		bgFrom: '#171009',
		bgTo: '#080503',
		accent: '#f59e0b',
		accentSoft: '#fde68a',
		glow: '#b45309',
		panel: '#2a1908',
	},
	{
		key: 'violet',
		bgFrom: '#12091f',
		bgTo: '#06030a',
		accent: '#a78bfa',
		accentSoft: '#ddd6fe',
		glow: '#6d28d9',
		panel: '#201231',
	},
];

const BRAND_THEME_OVERRIDES: Array<{ match: string[]; theme: HeroTheme }> = [
	{
		match: ['OpenAI', 'ChatGPT', 'Codex', 'Sora', 'GPT'],
		theme: {
			key: 'openai',
			bgFrom: '#041512',
			bgTo: '#020504',
			accent: '#10a37f',
			accentSoft: '#a7f3d0',
			glow: '#0f766e',
			panel: '#0d201b',
		},
	},
	{
		match: ['Google', 'Gemini', 'NotebookLM', 'Veo', 'Lyria', 'Gemma'],
		theme: {
			key: 'google',
			bgFrom: '#07111f',
			bgTo: '#040608',
			accent: '#4285f4',
			accentSoft: '#8ab4f8',
			glow: '#34a853',
			panel: '#0f1d32',
		},
	},
	{
		match: ['AWS', 'Bedrock'],
		theme: {
			key: 'aws',
			bgFrom: '#17110a',
			bgTo: '#080603',
			accent: '#ff9900',
			accentSoft: '#fcd34d',
			glow: '#b45309',
			panel: '#24170a',
		},
	},
	{
		match: ['Anthropic', 'Claude'],
		theme: {
			key: 'anthropic',
			bgFrom: '#18120d',
			bgTo: '#070503',
			accent: '#d97706',
			accentSoft: '#fcd34d',
			glow: '#92400e',
			panel: '#26180d',
		},
	},
	{
		match: ['GitHub', 'Copilot', 'Dependabot', 'Jira'],
		theme: {
			key: 'github',
			bgFrom: '#0d1020',
			bgTo: '#04050a',
			accent: '#8b5cf6',
			accentSoft: '#c4b5fd',
			glow: '#4f46e5',
			panel: '#171b33',
		},
	},
	{
		match: ['Microsoft', 'Azure'],
		theme: {
			key: 'microsoft',
			bgFrom: '#07121c',
			bgTo: '#030609',
			accent: '#38bdf8',
			accentSoft: '#bae6fd',
			glow: '#2563eb',
			panel: '#10202d',
		},
	},
	{
		match: ['Meta', 'Llama', 'Perplexity'],
		theme: {
			key: 'meta',
			bgFrom: '#0d0d1d',
			bgTo: '#040409',
			accent: '#818cf8',
			accentSoft: '#c7d2fe',
			glow: '#4f46e5',
			panel: '#171733',
		},
	},
];

const BRANDS = [
	'Perplexity AI',
	'Sakana AI',
	'OpenAI',
	'ChatGPT',
	'Anthropic',
	'Claude',
	'Google',
	'Gemini',
	'NotebookLM',
	'GitHub',
	'Copilot',
	'Microsoft',
	'Azure',
	'AWS',
	'Bedrock',
	'Meta',
	'Wikipedia',
	'Shopify',
	'Mistral',
	'Arm',
	'Alibaba',
	'Qwen',
	'Codex',
	'Sora',
	'Veo',
	'Lyria',
	'Gemma',
	'NICT',
];

const KICKER_RULES = [
	{ label: '価格', pattern: /価格|料金|課金|値上げ|値下げ|コスト/i },
	{ label: '提携', pattern: /提携|連携|パートナー|協業|統合/i },
	{ label: '規制', pattern: /規制|法案|監督|訴訟|審査|ポリシー/i },
	{ label: '防御', pattern: /セキュリティ|サイバー|脆弱性|漏えい|攻撃|防御/i },
	{ label: '更新', pattern: /何が変わ|変わる|刷新|改善|強化|アップデート/i },
	{ label: '導入', pattern: /導入|企業|SI|実務|事業|業務/i },
	{ label: '公開', pattern: /公開|発表|提供|開始|リリース|新機能|アップデート/i },
	{ label: '研究', pattern: /研究|論文|推論|性能|評価|モデル/i },
];

const TOPIC_HINTS = [
	'AgentCore',
	'ChatGPT Images',
	'Codex Labs',
	'NotebookLM',
	'Search Live',
	'AIサイバー防御',
	'データレジデンシー',
	'企業導入',
	'動画生成',
	'音声生成',
	'音声タグ',
	'Deep Think',
	'Flex',
	'Priority',
	'Docs MCP',
	'Developer Skills',
];

function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i += 1) {
		hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
	let value = seed % 2147483647;
	if (value <= 0) value += 2147483646;

	return () => {
		value = (value * 16807) % 2147483647;
		return value / 2147483647;
	};
}

function escapeXml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeTitle(title: string): string {
	return title
		.replace(/[“”]/g, '"')
		.replace(/[‘’]/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function cleanSegment(segment: string): string {
	return normalizeTitle(
		segment
			.replace(/[【】]/g, ' ')
			.replace(/\s*[|｜]\s*/g, ' ')
			.replace(/\s*[-–—]+\s*/g, ' ')
			.replace(/^[\s、,:：・]+/, '')
			.replace(/[\s、,:：・]+$/, ''),
	);
}

function splitClauses(title: string): string[] {
	return normalizeTitle(title)
		.replace(/[?!？！]/g, '。')
		.replace(/[—–]/g, '。')
		.split(/[。]/)
		.map((part) => cleanSegment(part))
		.filter(Boolean);
}

function fitWordsWithinLimit(phrase: string, maxChars: number): string {
	const words = phrase.trim().split(/\s+/).filter(Boolean);
	if (words.length <= 1) return phrase.trim().slice(0, maxChars);

	let result = '';
	for (const word of words) {
		const candidate = result ? `${result} ${word}` : word;
		if (candidate.length > maxChars) break;
		result = candidate;
	}

	return result || words[0];
}

function extractLeadingLatinPhrase(text: string, maxChars = 22): string {
	const match = text.trim().match(/^[A-Za-z0-9][A-Za-z0-9.+&/#-]*(?:\s+[A-Za-z0-9][A-Za-z0-9.+&/#-]*)*/);
	if (!match) return '';

	const phrase = match[0].trim();
	if (phrase.length <= maxChars) return phrase;
	return fitWordsWithinLimit(phrase, maxChars);
}

function extractQuotedPhrase(text: string): string {
	const match = text.match(/[「『"]([^」』"]{2,36})[」』"]/);
	return match ? cleanSegment(match[1]) : '';
}

function measureUnits(text: string): number {
	let total = 0;

	for (const ch of text) {
		if (/\s/.test(ch)) total += 0.35;
		else if (/[A-Z]/.test(ch)) total += 0.72;
		else if (/[a-z0-9]/.test(ch)) total += 0.62;
		else if (/[.+&/#-]/.test(ch)) total += 0.48;
		else if (/[、，。,:：!?？！]/.test(ch)) total += 0.5;
		else total += 1;
	}

	return total;
}

function tokenizeText(text: string): string[] {
	return text.match(/[A-Za-z0-9.+&/#-]+|[一-龠ぁ-んァ-ヶー・]+|[^\s]/g) ?? [];
}

function needsSeparator(left: string, right: string): boolean {
	if (!left || !right) return false;

	const leftChar = left.at(-1) ?? '';
	const rightChar = right[0] ?? '';
	const leftAscii = /[A-Za-z0-9)]/.test(leftChar);
	const rightAscii = /[(A-Za-z0-9]/.test(rightChar);
	const rightPunctuation = /[、，。,:：!?？！・]/.test(rightChar);

	return leftAscii && rightAscii && !rightPunctuation;
}

function appendToken(line: string, token: string): string {
	if (!line) return token;
	return `${line}${needsSeparator(line, token) ? ' ' : ''}${token}`;
}

function splitToken(token: string, maxUnits: number): string[] {
	const chars = [...token];
	const parts: string[] = [];
	let current = '';

	for (const ch of chars) {
		const candidate = `${current}${ch}`;
		if (current && measureUnits(candidate) > maxUnits) {
			parts.push(current);
			current = ch;
			continue;
		}
		current = candidate;
	}

	if (current) parts.push(current);
	return parts;
}

function clampDisplayLines(text: string, maxUnits: number, maxLines: number): string[] {
	const tokens = tokenizeText(cleanSegment(text));
	if (tokens.length === 0) return [];

	const lines: string[] = [];
	let current = '';

	function pushCurrent() {
		if (current.trim()) lines.push(current.trim());
		current = '';
	}

	for (const token of tokens) {
		const segments = measureUnits(token) > maxUnits ? splitToken(token, maxUnits) : [token];

		for (const segment of segments) {
			const candidate = appendToken(current, segment);
			if (current && measureUnits(candidate) > maxUnits) {
				pushCurrent();
				current = segment;
			} else {
				current = candidate;
			}

			if (lines.length === maxLines) break;
		}

		if (lines.length === maxLines) break;
	}

	pushCurrent();

	const trimmed = lines.slice(0, maxLines).map((line) => line.replace(/\s+/g, ' ').trim());
	if (trimmed.length === 0) return [];

	const consumed = trimmed.join(' ');
	const normalized = cleanSegment(text);
	if (trimmed.length === maxLines && consumed.length < normalized.length) {
		const lastIndex = trimmed.length - 1;
		trimmed[lastIndex] = `${trimmed[lastIndex].replace(/[・、,:：.\s]+$/, '')}…`;
	}

	return trimmed;
}

function stripLeadingBrand(text: string, brand: string): string {
	if (!brand) return cleanSegment(text);

	const escapedBrand = escapeRegExp(brand);
	return cleanSegment(
		text
			.replace(new RegExp(`^${escapedBrand}\\s*`), '')
			.replace(new RegExp(`^${escapedBrand}(?:の|が|は|を|と|で|に)?`), '')
			.replace(/^[のがはをとでに、,:：・\s]+/, '')
			.replace(/^[「『"]/, ''),
	);
}

function removeTrailingBoilerplate(text: string): string {
	return cleanSegment(
		text
			.replace(/とは$/i, '')
			.replace(/とは何か$/i, '')
			.replace(/を整理.*$/i, '')
			.replace(/を解説.*$/i, '')
			.replace(/の要点.*$/i, '')
			.replace(/まとめ.*$/i, '')
			.replace(/詳しく見る.*$/i, '')
			.replace(/どうなる.*$/i, '')
			.replace(/何が変わる.*$/i, ''),
	);
}

function extractBrand(title: string): string {
	const normalized = normalizeTitle(title);
	const leadingPhrase = extractLeadingLatinPhrase(normalized, 24);
	let selected = '';
	let earliestPos = Infinity;

	for (const brand of BRANDS) {
		const pos = normalized.indexOf(brand);
		if (pos !== -1 && pos < earliestPos) {
			selected = brand;
			earliestPos = pos;
		}
	}

	if (leadingPhrase) {
		const leadingPos = normalized.indexOf(leadingPhrase);
		if (!selected || (leadingPos !== -1 && leadingPos <= earliestPos)) {
			return leadingPhrase;
		}
	}

	if (selected) return selected;

	const clauses = splitClauses(normalized);
	const firstClause = clauses[0] ?? normalized;
	return clampDisplayLines(firstClause, 10, 1)[0] ?? normalized.slice(0, 10);
}

function extractTopic(title: string, brand: string): string {
	const quoted = extractQuotedPhrase(title);
	if (quoted) return quoted;

	const clauses = splitClauses(title);
	const leadClause = stripLeadingBrand(clauses[0] ?? title, brand);
	const mixedLead = leadClause.match(/^[A-Za-z0-9.+&/#-]+[一-龠ぁ-んァ-ヶー][A-Za-z0-9ぁ-んァ-ヶ一-龠ー・]*/);
	if (mixedLead) return cleanSegment(mixedLead[0].split('・')[0] ?? mixedLead[0]);
	const leadingLatin = extractLeadingLatinPhrase(leadClause, 24);
	if (leadingLatin && leadingLatin !== brand) return leadingLatin;

	for (const hint of TOPIC_HINTS) {
		if (leadClause.includes(hint)) return hint;
	}

	const latinAnywhere = leadClause.match(/[A-Za-z0-9][A-Za-z0-9.+&/#-]*(?:\s+[A-Za-z0-9][A-Za-z0-9.+&/#-]*)*/g) ?? [];
	const preferredLatin = latinAnywhere
		.map((candidate) => candidate.trim())
		.find((candidate) => candidate && candidate !== brand && !BRANDS.includes(candidate));
	if (preferredLatin) return fitWordsWithinLimit(preferredLatin, 24);

	return removeTrailingBoilerplate(leadClause) || leadClause;
}

function extractDeck(title: string, brand: string, topic: string): string {
	const clauses = splitClauses(title);
	const followClause = clauses[1] ? cleanSegment(clauses[1]) : '';
	if (followClause) return followClause;

	let leadClause = stripLeadingBrand(clauses[0] ?? title, brand);
	if (topic) {
		const escapedTopic = escapeRegExp(topic);
		leadClause = cleanSegment(leadClause.replace(new RegExp(escapedTopic, 'i'), ''));
	}

	return cleanSegment(
		leadClause
			.replace(/^とは\b/i, '')
			.replace(/^の\b/i, '')
			.replace(/^が\b/i, '')
			.replace(/^を\b/i, '')
			.replace(/^[、,:：・\s]+/, '')
			.replace(/[?!？！]+$/, ''),
	);
}

function extractKicker(title: string): string {
	for (const rule of KICKER_RULES) {
		if (rule.pattern.test(title)) return rule.label;
	}
	return '分析';
}

function pickTheme(brand: string, seed: number): HeroTheme {
	for (const rule of BRAND_THEME_OVERRIDES) {
		if (rule.match.some((term) => brand.includes(term))) return rule.theme;
	}

	return THEME_FALLBACKS[seed % THEME_FALLBACKS.length];
}

function renderTextLine(
	text: string,
	x: number,
	y: number,
	size: number,
	opts: {
		weight?: number;
		fill?: string;
		opacity?: number;
		anchor?: 'start' | 'middle' | 'end';
		letterSpacing?: number;
		fontFamily?: string;
	} = {},
): string {
	const {
		weight = 800,
		fill = '#f8fafc',
		opacity,
		anchor = 'start',
		letterSpacing = 0,
		fontFamily = SANS,
	} = opts;

	const opacityAttr = opacity !== undefined ? ` opacity="${opacity}"` : '';
	const spacingAttr = letterSpacing ? ` letter-spacing="${letterSpacing}"` : '';

	return `<text x="${x}" y="${y}" font-family="${fontFamily}" font-weight="${weight}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${opacityAttr}${spacingAttr}>${escapeXml(text)}</text>`;
}

function renderTextBlock(
	lines: string[],
	x: number,
	y: number,
	size: number,
	lineHeight: number,
	opts: Parameters<typeof renderTextLine>[4] = {},
): string {
	return lines.map((line, index) => renderTextLine(line, x, y + index * lineHeight, size, opts)).join('');
}

function renderKicker(label: string, theme: HeroTheme): string {
	const width = Math.max(122, 54 + Math.ceil(measureUnits(label) * 18));

	return [
		`<rect x="56" y="48" width="${width}" height="38" rx="19" fill="${theme.panel}" stroke="${theme.accent}" stroke-opacity="0.45"/>`,
		renderTextLine(label, 56 + width / 2, 74, 20, {
			weight: 700,
			anchor: 'middle',
			fill: theme.accentSoft,
			letterSpacing: 0.8,
		}),
	].join('');
}

function renderBackground(theme: HeroTheme, hash: number, variant: HeroVariant, rand: () => number): string {
	const gradientId = `hero-bg-${hash}`;
	const glowId = `hero-glow-${hash}`;
	const noiseId = `hero-noise-${hash}`;
	const gridId = `hero-grid-${hash}`;
	const glowCx = variant === 0 ? '78%' : variant === 1 ? '22%' : '72%';
	const glowCy = variant === 2 ? '20%' : '28%';
	const stripeX = variant === 1 ? 792 : 944;
	const stripeY = variant === 2 ? 368 : 86;
	const stripeHeight = variant === 2 ? 184 : 442;
	const ringX = variant === 0 ? 980 : 1040;
	const ringY = variant === 2 ? 136 : 108;
	const panelX = variant === 1 ? 706 : 860;
	const panelY = variant === 2 ? 72 : 410;
	const panelWidth = variant === 1 ? 428 : 280;
	const panelHeight = variant === 1 ? 184 : 126;
	const randomOffset = Math.floor(rand() * 28);

	return `
<defs>
	<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
		<stop offset="0%" stop-color="${theme.bgFrom}"/>
		<stop offset="100%" stop-color="${theme.bgTo}"/>
	</linearGradient>
	<radialGradient id="${glowId}" cx="${glowCx}" cy="${glowCy}" r="72%">
		<stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.28"/>
		<stop offset="58%" stop-color="${theme.glow}" stop-opacity="0.08"/>
		<stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
	</radialGradient>
	<pattern id="${gridId}" width="64" height="64" patternUnits="userSpaceOnUse">
		<path d="M 64 0 L 0 0 0 64" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
	</pattern>
	<filter id="${noiseId}">
		<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
		<feColorMatrix type="saturate" values="0"/>
	</filter>
</defs>
<rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#${gradientId})"/>
<rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#${gridId})" opacity="0.55"/>
<rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#${glowId})"/>
<rect x="${stripeX}" y="${stripeY}" width="2" height="${stripeHeight}" fill="${theme.accent}" fill-opacity="0.44"/>
<circle cx="${ringX}" cy="${ringY}" r="${84 + randomOffset}" fill="none" stroke="${theme.accent}" stroke-opacity="0.26" stroke-width="1.5"/>
<rect x="${panelX}" y="${panelY}" width="${panelWidth}" height="${panelHeight}" rx="18" fill="${theme.panel}" fill-opacity="0.72" stroke="${theme.accent}" stroke-opacity="0.18"/>
<rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" filter="url(#${noiseId})" opacity="0.035"/>
`;
}

function brandFontSize(lines: string[]): number {
	const longest = Math.max(...lines.map((line) => measureUnits(line)), 0);
	if (lines.length >= 2) return longest > 10 ? 84 : 92;
	if (longest <= 5) return 116;
	if (longest <= 8) return 100;
	if (longest <= 12) return 90;
	return 78;
}

function topicFontSize(lines: string[]): number {
	const longest = Math.max(...lines.map((line) => measureUnits(line)), 0);
	if (lines.length >= 3) return 32;
	if (longest <= 10) return 48;
	if (longest <= 16) return 42;
	return 36;
}

function estimateTextWidth(text: string, size: number): number {
	return measureUnits(text) * size * 0.92;
}

function estimateBlockWidth(lines: string[], size: number): number {
	return Math.max(...lines.map((line) => estimateTextWidth(line, size)), 0);
}

function hasEllipsis(lines: string[]): boolean {
	return lines.some((line) => line.endsWith('…'));
}

function variantOneHasCollisionRisk(brandLines: string[], topicLines: string[]): boolean {
	const brandSize = brandFontSize(brandLines);
	const topicSize = Math.max(34, topicFontSize(topicLines) - 2);
	const brandEnd = 60 + estimateBlockWidth(brandLines, brandSize);
	const topicEnd = 740 + estimateBlockWidth(topicLines, topicSize);

	return brandEnd > 680 || topicEnd > CANVAS_WIDTH - 44;
}

function renderVariant(copy: HeroCopy): string {
	const brandSize = brandFontSize(copy.brandLines);
	const topicSize = topicFontSize(copy.topicLines);
	const deckSize = 28;

	if (copy.variant === 0) {
		return [
			renderKicker(copy.kicker, copy.theme),
			renderTextBlock(copy.brandLines, 60, 182, brandSize, brandSize * 0.98, {
				weight: 800,
				fill: '#f8fafc',
			}),
			renderTextBlock(copy.topicLines, 60, 330, topicSize, topicSize * 1.18, {
				weight: 700,
				fill: '#ffffff',
			}),
			copy.deckLines.length > 0
				? renderTextBlock(copy.deckLines, 60, 532, deckSize, deckSize * 1.25, {
						weight: 500,
						fill: '#dbe4f0',
						opacity: 0.84,
					})
				: '',
		].join('');
	}

	if (copy.variant === 1) {
		return [
			renderKicker(copy.kicker, copy.theme),
			renderTextBlock(copy.brandLines, 60, 214, brandSize, brandSize * 0.98, {
				weight: 800,
				fill: '#f8fafc',
			}),
			renderTextBlock(copy.topicLines, 740, 190, Math.max(34, topicSize - 2), Math.max(42, topicSize * 1.18), {
				weight: 700,
				fill: '#ffffff',
			}),
			copy.deckLines.length > 0
				? renderTextBlock(copy.deckLines, 60, 548, deckSize, deckSize * 1.25, {
						weight: 500,
						fill: '#dbe4f0',
						opacity: 0.84,
					})
				: '',
		].join('');
	}

	return [
		renderKicker(copy.kicker, copy.theme),
		renderTextBlock(copy.topicLines, 60, 196, topicSize, topicSize * 1.16, {
			weight: 700,
			fill: '#ffffff',
		}),
		renderTextBlock(copy.brandLines, 60, 454, brandSize, brandSize * 0.98, {
			weight: 800,
			fill: '#f8fafc',
		}),
		copy.deckLines.length > 0
			? renderTextBlock(copy.deckLines, 1120, 560, deckSize, deckSize * 1.2, {
					weight: 500,
					fill: '#dbe4f0',
					opacity: 0.84,
					anchor: 'end',
				})
			: '',
	].join('');
}

export function buildHeroCopy(title: string): HeroCopy {
	const normalized = normalizeTitle(title);
	const hash = hashCode(normalized);
	const brand = extractBrand(normalized);
	const topic = extractTopic(normalized, brand);
	const rawDeck = extractDeck(normalized, brand, topic);
	const kicker = extractKicker(normalized);
	const theme = pickTheme(brand, hash);
	let variant = (hash % 3) as HeroVariant;
	let brandLines = clampDisplayLines(brand, 13, 2);
	let topicLines = clampDisplayLines(topic || normalized, variant === 1 ? 17 : 19, 2);

	if (variant === 1) {
		const compactBrandLines = clampDisplayLines(brand, 8, 2);
		const compactTopicLines = clampDisplayLines(topic || normalized, 15, 2);

		if (
			!hasEllipsis(compactBrandLines) &&
			!hasEllipsis(compactTopicLines) &&
			!variantOneHasCollisionRisk(compactBrandLines, compactTopicLines)
		) {
			brandLines = compactBrandLines;
			topicLines = compactTopicLines;
		} else if (variantOneHasCollisionRisk(brandLines, topicLines)) {
			variant = 0;
			brandLines = clampDisplayLines(brand, 13, 2);
			topicLines = clampDisplayLines(topic || normalized, 19, 2);
		}
	}

	const deckText = rawDeck && rawDeck !== topic ? rawDeck : '';
	const deckLines = deckText ? clampDisplayLines(deckText, variant === 2 ? 19 : 21, variant === 2 ? 2 : 1) : [];

	return {
		brand,
		brandLines,
		topic,
		topicLines,
		deck: deckText,
		deckLines,
		kicker,
		theme,
		variant,
	};
}

export function generateHeroSvg(seed: string): string {
	const copy = buildHeroCopy(seed);
	const hash = hashCode(seed);
	const rand = seededRandom(hash);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" role="img" aria-label="${escapeXml(seed)}">${renderBackground(copy.theme, hash, copy.variant, rand)}${renderVariant(copy)}</svg>`;
}

export function generateHeroDataUri(seed: string): string {
	const svg = generateHeroSvg(seed);
	const encoded = Buffer.from(svg).toString('base64');
	return `data:image/svg+xml;base64,${encoded}`;
}
