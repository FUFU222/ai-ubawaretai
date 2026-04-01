/**
 * Generate a unique SVG hero image based on a seed string (e.g. post title/slug).
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

const PALETTES = [
	{ bg: '#0a0a1a', colors: ['#667eea', '#764ba2', '#f093fb', '#a78bfa'] },
	{ bg: '#0d1117', colors: ['#00c6ff', '#0072ff', '#7c3aed', '#38bdf8'] },
	{ bg: '#0f0a1e', colors: ['#7f00ff', '#e100ff', '#00d2ff', '#c084fc'] },
	{ bg: '#0a1628', colors: ['#0cebeb', '#20e3b2', '#29ffc6', '#06b6d4'] },
	{ bg: '#1a0a0a', colors: ['#f12711', '#f5af19', '#feb47b', '#ef4444'] },
	{ bg: '#0a1a0a', colors: ['#11998e', '#38ef7d', '#0cebeb', '#22c55e'] },
	{ bg: '#1a0a1a', colors: ['#ee0979', '#ff6a00', '#ffd200', '#f472b6'] },
	{ bg: '#0a0a2e', colors: ['#4facfe', '#00f2fe', '#43e97b', '#818cf8'] },
	{ bg: '#120a1e', colors: ['#c471f5', '#fa71cd', '#f093fb', '#a855f7'] },
	{ bg: '#0e1a2e', colors: ['#fc466b', '#3f5efb', '#667eea', '#fb7185'] },
	{ bg: '#0a1a1a', colors: ['#00b09b', '#96c93d', '#00b4db', '#2dd4bf'] },
	{ bg: '#1a1a0a', colors: ['#f5af19', '#f12711', '#ff6348', '#fbbf24'] },
	{ bg: '#0d0d2b', colors: ['#536976', '#667eea', '#a78bfa', '#6366f1'] },
	{ bg: '#0a0f1e', colors: ['#2193b0', '#6dd5ed', '#00cdac', '#67e8f9'] },
	{ bg: '#1e0a14', colors: ['#cc2b5e', '#753a88', '#c471f5', '#e879f9'] },
];

function escapeXml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractKeywords(title: string): string[] {
	const stopWords = new Set([
		'の', 'が', 'を', 'に', 'は', 'で', 'と', 'も', 'から', 'まで', 'より',
		'する', 'した', 'して', 'される', 'された', 'させる', 'できる',
		'ある', 'いる', 'なる', 'ない', 'れる', 'られる',
		'この', 'その', 'あの', 'どの', 'こと', 'もの', 'ため', 'よう',
		'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
		'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
		'and', 'or', 'but', 'not', 'that', 'this', 'it', 'as',
	]);
	return title
		.replace(/[「」『』（）【】\[\]—–・、。？！,.:;]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length >= 2 && !stopWords.has(w.toLowerCase()))
		.slice(0, 5);
}

export function generateHeroSvg(seed: string): string {
	const hash = hashCode(seed);
	const rand = seededRandom(hash);

	const palette = PALETTES[Math.floor(rand() * PALETTES.length)];
	const { bg, colors } = palette;
	const pick = () => colors[Math.floor(rand() * colors.length)];
	const gradAngle = Math.floor(rand() * 360);
	const keywords = extractKeywords(seed);

	let svg = '';

	// --- Defs ---
	svg += `<defs>
		<linearGradient id="bg" gradientTransform="rotate(${gradAngle})">
			<stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.3"/>
			<stop offset="100%" stop-color="${colors[1]}" stop-opacity="0.3"/>
		</linearGradient>
		<radialGradient id="glow1" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.6"/>
			<stop offset="100%" stop-color="${colors[0]}" stop-opacity="0"/>
		</radialGradient>
		<radialGradient id="glow2" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="${colors[2]}" stop-opacity="0.5"/>
			<stop offset="100%" stop-color="${colors[2]}" stop-opacity="0"/>
		</radialGradient>
		<filter id="blur-lg"><feGaussianBlur stdDeviation="80"/></filter>
		<filter id="blur-md"><feGaussianBlur stdDeviation="40"/></filter>
		<filter id="blur-sm"><feGaussianBlur stdDeviation="12"/></filter>
		<filter id="glow-filter">
			<feGaussianBlur stdDeviation="6" result="blur"/>
			<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
		</filter>
		<filter id="noise">
			<feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
			<feColorMatrix type="saturate" values="0"/>
		</filter>
		<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
			<path d="M 60 0 L 0 0 0 60" fill="none" stroke="${colors[0]}" stroke-width="0.5" opacity="0.12"/>
		</pattern>
		<pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
			<circle cx="15" cy="15" r="1" fill="${colors[3] || colors[0]}" opacity="0.2"/>
		</pattern>
	</defs>`;

	// --- Background ---
	svg += `<rect width="1200" height="630" fill="${bg}"/>`;
	svg += `<rect width="1200" height="630" fill="url(#bg)"/>`;

	// --- Large blurred orbs for depth ---
	const orbCount = 3 + Math.floor(rand() * 3);
	for (let i = 0; i < orbCount; i++) {
		const cx = Math.floor(rand() * 1400) - 100;
		const cy = Math.floor(rand() * 830) - 100;
		const r = 150 + Math.floor(rand() * 300);
		const c = pick();
		const op = 0.15 + rand() * 0.25;
		svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${op}" filter="url(#blur-lg)"/>`;
	}

	// --- Grid / dot pattern overlay ---
	const patternType = rand();
	if (patternType < 0.4) {
		svg += `<rect width="1200" height="630" fill="url(#grid)"/>`;
	} else if (patternType < 0.7) {
		svg += `<rect width="1200" height="630" fill="url(#dots)"/>`;
	} else {
		// Diagonal lines
		const spacing = 40 + Math.floor(rand() * 40);
		for (let x = -630; x < 1200 + 630; x += spacing) {
			svg += `<line x1="${x}" y1="0" x2="${x + 630}" y2="630" stroke="${pick()}" stroke-width="0.5" opacity="0.08"/>`;
		}
	}

	// --- Wireframe geometric shapes ---
	const wireCount = 2 + Math.floor(rand() * 4);
	for (let i = 0; i < wireCount; i++) {
		const cx = Math.floor(rand() * 1200);
		const cy = Math.floor(rand() * 630);
		const shapeType = rand();

		if (shapeType < 0.3) {
			// Wireframe circle with neon glow
			const r = 40 + Math.floor(rand() * 120);
			const c = pick();
			svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4" filter="url(#glow-filter)"/>`;
			if (rand() > 0.5) {
				svg += `<circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.2" stroke-dasharray="8 4"/>`;
			}
		} else if (shapeType < 0.55) {
			// Wireframe hexagon
			const r = 30 + Math.floor(rand() * 80);
			const c = pick();
			const rotation = Math.floor(rand() * 60);
			const pts = Array.from({ length: 6 }, (_, j) => {
				const angle = (Math.PI / 3) * j + (rotation * Math.PI) / 180;
				return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
			}).join(' ');
			svg += `<polygon points="${pts}" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.35" filter="url(#glow-filter)"/>`;
		} else if (shapeType < 0.75) {
			// Wireframe triangle
			const size = 50 + Math.floor(rand() * 100);
			const c = pick();
			const pts = Array.from({ length: 3 }, (_, j) => {
				const angle = (Math.PI * 2 * j) / 3 - Math.PI / 2;
				return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
			}).join(' ');
			svg += `<polygon points="${pts}" fill="${c}" fill-opacity="0.05" stroke="${c}" stroke-width="1.5" opacity="0.4" filter="url(#glow-filter)"/>`;
		} else {
			// Concentric rings
			const c = pick();
			for (let j = 0; j < 3; j++) {
				const r = 20 + j * 25 + Math.floor(rand() * 20);
				svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${1.5 - j * 0.4}" opacity="${0.35 - j * 0.1}"/>`;
			}
		}
	}

	// --- Connecting lines between shapes ---
	const lineCount = 3 + Math.floor(rand() * 5);
	for (let i = 0; i < lineCount; i++) {
		const x1 = Math.floor(rand() * 1200);
		const y1 = Math.floor(rand() * 630);
		const x2 = Math.floor(rand() * 1200);
		const y2 = Math.floor(rand() * 630);
		const c = pick();
		svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="0.8" opacity="0.15"/>`;
		// Node dots at endpoints
		svg += `<circle cx="${x1}" cy="${y1}" r="3" fill="${c}" opacity="0.5"/>`;
		svg += `<circle cx="${x2}" cy="${y2}" r="3" fill="${c}" opacity="0.5"/>`;
	}

	// --- Floating particles ---
	const particleCount = 15 + Math.floor(rand() * 25);
	for (let i = 0; i < particleCount; i++) {
		const cx = Math.floor(rand() * 1200);
		const cy = Math.floor(rand() * 630);
		const r = 1 + rand() * 3;
		const c = pick();
		const op = 0.2 + rand() * 0.5;
		svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${op}"/>`;
	}

	// --- Neon accent lines (horizontal/vertical) ---
	const accentCount = 1 + Math.floor(rand() * 3);
	for (let i = 0; i < accentCount; i++) {
		const c = pick();
		if (rand() > 0.5) {
			const y = Math.floor(rand() * 630);
			const x1 = Math.floor(rand() * 600);
			const len = 100 + Math.floor(rand() * 400);
			svg += `<line x1="${x1}" y1="${y}" x2="${x1 + len}" y2="${y}" stroke="${c}" stroke-width="2" opacity="0.5" filter="url(#glow-filter)"/>`;
		} else {
			const x = Math.floor(rand() * 1200);
			const y1 = Math.floor(rand() * 300);
			const len = 80 + Math.floor(rand() * 300);
			svg += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y1 + len}" stroke="${c}" stroke-width="2" opacity="0.5" filter="url(#glow-filter)"/>`;
		}
	}

	// --- Title keywords as background typography ---
	if (keywords.length > 0) {
		svg += `<g opacity="0.06">`;
		for (let i = 0; i < Math.min(keywords.length, 4); i++) {
			const word = escapeXml(keywords[i]);
			const x = Math.floor(rand() * 900) + 50;
			const y = Math.floor(rand() * 500) + 80;
			const size = 60 + Math.floor(rand() * 100);
			const rotation = -15 + Math.floor(rand() * 30);
			svg += `<text x="${x}" y="${y}" font-family="sans-serif" font-weight="900" font-size="${size}" fill="${pick()}" transform="rotate(${rotation} ${x} ${y})">${word}</text>`;
		}
		svg += `</g>`;
	}

	// --- Noise texture overlay ---
	svg += `<rect width="1200" height="630" fill="url(#noise)" opacity="0.04"/>`;

	// --- Vignette ---
	svg += `<rect width="1200" height="630" fill="url(#bg)" opacity="0.1"/>`;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${svg}</svg>`;
}

export function generateHeroDataUri(seed: string): string {
	const svg = generateHeroSvg(seed);
	const encoded = Buffer.from(svg).toString('base64');
	return `data:image/svg+xml;base64,${encoded}`;
}
