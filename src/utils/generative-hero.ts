/**
 * Generate Evangelion-style title card SVG from article title.
 * Pure black background + white bold serif text.
 * Short extracted keywords placed in dramatic asymmetric layouts.
 * Deterministic: same seed always produces the same image.
 */

function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s * 16807 + 0) % 2147483647;
		return s / 2147483647;
	};
}

function escapeXml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Extract short, punchy keywords from article title.
 * Returns { main: string (2-8 chars), sub: string (short phrase), accent?: string }
 */
function extractKeywords(title: string): { main: string; sub: string; accent?: string } {
	// Split on dashes and punctuation first
	const chunks = title
		.replace(/[——–]/g, '|')
		.replace(/[「」『』（）【】\[\]]/g, '')
		.split(/[|、。？！?!,]/g)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);

	let main = '';
	let sub = '';
	let accent = '';

	// Find the brand name that appears earliest in the title
	let earliestPos = Infinity;
	for (const brand of BRANDS) {
		const pos = title.indexOf(brand);
		if (pos !== -1 && pos < earliestPos) {
			earliestPos = pos;
			main = brand;
		}
	}

	// Try to find an impact word for accent
	for (const word of IMPACT_WORDS) {
		if (title.includes(word) && word !== main) {
			accent = word;
			break;
		}
	}

	// If no brand found, extract first short meaningful chunk
	if (!main) {
		// Take the shortest chunk that's 2-10 chars as main
		const sorted = [...chunks].sort((a, b) => a.length - b.length);
		for (const chunk of sorted) {
			if (chunk.length >= 2 && chunk.length <= 10) {
				main = chunk;
				break;
			}
		}
		if (!main && chunks[0]) {
			// Take first few chars of first chunk
			main = chunks[0].slice(0, 8);
		}
	}

	// Sub: use a different chunk from main, or derive from title
	for (const chunk of chunks) {
		if (chunk !== main && chunk.length > 0 && !chunk.includes(main)) {
			sub = chunk.length > 20 ? chunk.slice(0, 18) : chunk;
			break;
		}
	}
	if (!sub && chunks.length > 1) {
		sub = chunks[1].length > 20 ? chunks[1].slice(0, 18) : chunks[1];
	}
	if (!sub) {
		sub = '';
	}

	// If accent is same as main, clear it
	if (accent === main) accent = '';

	return { main: main || title.slice(0, 6), sub, accent };
}

// Known brand/product names to prioritize as main keyword
const BRANDS = [
	'OpenAI', 'Claude', 'Gemini', 'GPT', 'Copilot', 'Sora', 'Codex',
	'Anthropic', 'Google', 'Meta', 'Apple', 'Microsoft', 'GitHub',
	'Shopify', 'Wikipedia', 'Mistral', 'Arm', 'Alibaba', 'Qwen',
	'ChatGPT', 'Mythos', 'Lyria', 'Voxtral', 'Cursor', 'Jira',
];

// Action/impact words that make good main keywords
const IMPACT_WORDS = [
	'発表', '公開', '登場', '開始', '終了', '撤退', '買収', '連携',
	'革命', '衝撃', '転換', '進化', '崩壊', '対決', '決戦', '変革',
	'禁止', '制限', '解禁', '参入', '独占', '統合', '分裂',
	'誕生', '消滅', '復活', '挑戦', '突破', '逆転', '加速',
];

const FF = `'Noto Serif JP','Hiragino Mincho ProN','Yu Mincho','MS PMincho',serif`;

function t(
	text: string, x: number, y: number, size: number,
	anchor: 'start' | 'middle' | 'end' = 'start',
	opts: { opacity?: number; vertical?: boolean; letterSpacing?: number } = {},
): string {
	const op = opts.opacity && opts.opacity < 1 ? ` opacity="${opts.opacity}"` : '';
	const ls = opts.letterSpacing ? ` letter-spacing="${opts.letterSpacing}"` : '';
	return `<text x="${x}" y="${y}" font-family="${FF}" font-weight="900" font-size="${size}" fill="#fff" text-anchor="${anchor}"${op}${ls}>${escapeXml(text)}</text>`;
}

function vt(text: string, x: number, startY: number, size: number, opts: { opacity?: number } = {}): string {
	let svg = '';
	const chars = [...text];
	const lh = size * 1.2;
	chars.forEach((ch, i) => {
		const y = startY + i * lh;
		if (y < 620) svg += t(ch, x, y, size, 'middle', opts);
	});
	return svg;
}

// ---- 16 layout functions ----
type LFn = (m: string, s: string, a: string, r: () => number) => string;

const L: LFn[] = [
	// 0: 「涙」style — single huge word, dead center
	(m, s, _a, r) => {
		const sz = m.length <= 3 ? 200 : m.length <= 5 ? 150 : 100;
		let o = t(m, 600, 350 + Math.floor(r() * 30), sz, 'middle');
		if (s) o += t(s, 1100, 580, 28, 'end', { opacity: 0.6 });
		return o;
	},

	// 1: 「決戦、第3新東京市」— large left, small scattered right+top
	(m, s, a, r) => {
		const sz = m.length <= 4 ? 160 : m.length <= 6 ? 120 : 90;
		let o = t(m, 60, 380 + Math.floor(r() * 40), sz, 'start');
		if (s) o += t(s, 750 + Math.floor(r() * 100), 140 + Math.floor(r() * 40), 40, 'start');
		if (a) o += t(a, 900 + Math.floor(r() * 100), 520, 36, 'start', { opacity: 0.7 });
		return o;
	},

	// 2: 「雨、逃げ出した後」— tiny main top-left, long sub bottom-right
	(m, s, _a, r) => {
		const sz = m.length <= 2 ? 180 : m.length <= 4 ? 130 : 90;
		let o = t(m, 80, 200 + Math.floor(r() * 30), sz, 'start');
		if (s) o += t(s, 1120, 520 + Math.floor(r() * 30), 42, 'end');
		return o;
	},

	// 3: vertical main right + horizontal sub left
	(m, s, a, r) => {
		const sz = m.length <= 4 ? 90 : 65;
		let o = vt(m, 1020 + Math.floor(r() * 60), 80 + Math.floor(r() * 30), sz);
		if (s) o += t(s, 80, 400 + Math.floor(r() * 60), 44, 'start');
		if (a) o += t(a, 80, 200, 32, 'start', { opacity: 0.5 });
		return o;
	},

	// 4: 「嘘と沈黙」— center-right, medium-large
	(m, s, a, r) => {
		const sz = m.length <= 5 ? 130 : 90;
		let o = t(m, 700 + Math.floor(r() * 100), 340 + Math.floor(r() * 30), sz, 'start');
		if (s) o += t(s, 100, 150 + Math.floor(r() * 40), 34, 'start', { opacity: 0.7 });
		if (a) o += t(a, 100, 530, 30, 'start', { opacity: 0.5 });
		return o;
	},

	// 5: 「死に至る病、そして」— large bottom, accent top-right
	(m, s, a, r) => {
		const sz = m.length <= 3 ? 170 : m.length <= 6 ? 120 : 85;
		let o = t(m, 80 + Math.floor(r() * 40), 520, sz, 'start');
		if (a) o += t(a, 1100, 100 + Math.floor(r() * 30), 50, 'end');
		if (s) o += t(s, 1100, 180 + Math.floor(r() * 30), 30, 'end', { opacity: 0.5 });
		return o;
	},

	// 6: two vertical columns (like 「レイ、心のむこうに」)
	(m, s, _a, r) => {
		const sz1 = m.length <= 4 ? 85 : 60;
		const sz2 = s.length <= 6 ? 55 : 40;
		let o = vt(m, 900 + Math.floor(r() * 80), 80 + Math.floor(r() * 20), sz1);
		if (s) o += vt(s, 250 + Math.floor(r() * 100), 100 + Math.floor(r() * 40), sz2, { opacity: 0.7 });
		return o;
	},

	// 7: 「マグマダイバー」— large right-aligned, sub small bottom-left
	(m, s, a, r) => {
		const sz = m.length <= 4 ? 150 : m.length <= 7 ? 110 : 80;
		let o = t(m, 1120, 330 + Math.floor(r() * 50), sz, 'end');
		if (s) o += t(s, 80, 560 + Math.floor(r() * 20), 32, 'start', { opacity: 0.6 });
		if (a) o += t(a, 80, 120, 38, 'start', { opacity: 0.5 });
		return o;
	},

	// 8: 「使徒、襲来」— two words stacked with comma feel
	(m, s, _a, r) => {
		const sz = m.length <= 4 ? 140 : 100;
		const x = 150 + Math.floor(r() * 200);
		let o = t(m, x, 260 + Math.floor(r() * 30), sz, 'start');
		if (s) o += t(s, x + 30, 260 + sz + 30 + Math.floor(r() * 20), Math.floor(sz * 0.55), 'start');
		return o;
	},

	// 9: huge single char or very short word + small sub far away
	(m, s, a, r) => {
		const short = m.slice(0, 3);
		const sz = short.length <= 2 ? 240 : 160;
		const x = 200 + Math.floor(r() * 600);
		const y = 300 + Math.floor(r() * 100);
		let o = t(short, x, y, sz, 'middle');
		if (s) o += t(s, 1120, 590, 26, 'end', { opacity: 0.5 });
		if (a) o += t(a, 80, 80, 30, 'start', { opacity: 0.4 });
		return o;
	},

	// 10: 「心のかたち 人のかたち」— two horizontal lines, different sizes, centered
	(m, s, _a, r) => {
		const sz1 = m.length <= 5 ? 110 : 75;
		const sz2 = s.length <= 8 ? 60 : 42;
		const cx = 600 + Math.floor(r() * 100) - 50;
		let o = t(m, cx, 250 + Math.floor(r() * 40), sz1, 'middle');
		if (s) o += t(s, cx, 420 + Math.floor(r() * 30), sz2, 'middle');
		return o;
	},

	// 11: vertical main left + horizontal sub bottom-right
	(m, s, a, r) => {
		const sz = m.length <= 5 ? 80 : 55;
		let o = vt(m, 150 + Math.floor(r() * 60), 60 + Math.floor(r() * 20), sz);
		if (s) o += t(s, 1120, 500 + Math.floor(r() * 40), 44, 'end');
		if (a) o += t(a, 1120, 560 + Math.floor(r() * 20), 28, 'end', { opacity: 0.5 });
		return o;
	},

	// 12: bottom-right corner dramatic (like 「せめて、人間らしく」)
	(m, s, _a, r) => {
		const sz = m.length <= 5 ? 120 : 85;
		let o = t(m, 1120, 480 + Math.floor(r() * 30), sz, 'end');
		if (s) o += t(s, 1120, 480 + sz * 0.3, 36, 'end', { opacity: 0.6 });
		return o;
	},

	// 13: 「奇跡の価値は」— top-left large, nothing else prominent
	(m, s, _a, r) => {
		const sz = m.length <= 4 ? 140 : m.length <= 7 ? 100 : 75;
		let o = t(m, 80 + Math.floor(r() * 30), 180 + Math.floor(r() * 40), sz, 'start');
		if (s) o += t(s, 80, 520 + Math.floor(r() * 30), 30, 'start', { opacity: 0.4 });
		return o;
	},

	// 14: scattered — main center, sub top-left, accent bottom-right
	(m, s, a, r) => {
		const sz = m.length <= 4 ? 130 : 90;
		let o = t(m, 550 + Math.floor(r() * 100), 340 + Math.floor(r() * 30), sz, 'middle');
		if (s) o += t(s, 80 + Math.floor(r() * 40), 100 + Math.floor(r() * 30), 36, 'start', { opacity: 0.6 });
		if (a) o += t(a, 1100, 560, 32, 'end', { opacity: 0.5 });
		return o;
	},

	// 15: mixed vertical + horizontal overlapping feel
	(m, s, a, r) => {
		const sz1 = m.length <= 4 ? 120 : 80;
		let o = t(m, 500 + Math.floor(r() * 200), 350, sz1, 'start');
		if (s) {
			const vsz = s.length <= 6 ? 50 : 36;
			o += vt(s, 160 + Math.floor(r() * 60), 100, vsz, { opacity: 0.7 });
		}
		if (a) o += t(a, 1100, 580, 28, 'end', { opacity: 0.4 });
		return o;
	},
];

export function generateHeroSvg(seed: string): string {
	const hash = hashCode(seed);
	const rand = seededRandom(hash);

	const { main, sub, accent } = extractKeywords(seed);
	const layoutIndex = Math.floor(rand() * L.length);

	let svg = '';
	svg += `<rect width="1200" height="630" fill="#000"/>`;

	// Optional thin accent line (25% chance)
	if (rand() < 0.25) {
		if (rand() > 0.5) {
			const y = 50 + Math.floor(rand() * 530);
			const x1 = Math.floor(rand() * 400);
			svg += `<line x1="${x1}" y1="${y}" x2="${x1 + 150 + Math.floor(rand() * 400)}" y2="${y}" stroke="#fff" stroke-width="0.7" opacity="0.1"/>`;
		} else {
			const x = 100 + Math.floor(rand() * 1000);
			const y1 = Math.floor(rand() * 200);
			svg += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y1 + 150 + Math.floor(rand() * 300)}" stroke="#fff" stroke-width="0.7" opacity="0.1"/>`;
		}
	}

	// Text layout
	svg += L[layoutIndex](main, sub, accent || '', rand);

	// Film grain
	svg += `<defs><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>`;
	svg += `<rect width="1200" height="630" filter="url(#n)" opacity="0.025"/>`;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${svg}</svg>`;
}

export function generateHeroDataUri(seed: string): string {
	const svg = generateHeroSvg(seed);
	const encoded = Buffer.from(svg).toString('base64');
	return `data:image/svg+xml;base64,${encoded}`;
}
