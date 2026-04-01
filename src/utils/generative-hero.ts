/**
 * Generate Evangelion-style title card SVG from article title.
 * Pure black background + white bold serif text in asymmetric layout.
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
 * Extract key phrases from a Japanese article title.
 * Splits on punctuation, returns 2-4 meaningful chunks.
 */
function extractKeyPhrases(title: string): string[] {
	const chunks = title
		.replace(/[——–]/g, '|')
		.replace(/[「」『』（）【】\[\]]/g, '')
		.split(/[|、。？！?!,]/g)
		.map((s) => s.trim())
		.filter((s) => s.length > 0);

	if (chunks.length >= 2) {
		return chunks.slice(0, 4);
	}

	// Fallback: split long title at roughly midpoint on a space or particle boundary
	const t = title;
	if (t.length > 15) {
		const mid = Math.floor(t.length / 2);
		// Try to find a natural break point near the middle
		let breakAt = mid;
		for (let i = mid; i >= mid - 8 && i >= 1; i--) {
			const ch = t[i];
			if ('のがをにはでと '.includes(ch)) {
				breakAt = i + 1;
				break;
			}
		}
		return [t.slice(0, breakAt), t.slice(breakAt)];
	}

	return [title];
}

/**
 * Estimate text width in pixels. CJK chars ~= fontSize, latin ~= 0.6*fontSize
 */
function estimateWidth(text: string, fontSize: number): number {
	let w = 0;
	for (const ch of text) {
		w += ch.charCodeAt(0) > 127 ? fontSize * 0.95 : fontSize * 0.58;
	}
	return w;
}

/**
 * Auto-scale font size to fit text within maxWidth, with a floor.
 */
function fitFontSize(text: string, idealSize: number, maxWidth: number, minSize: number = 24): number {
	let size = idealSize;
	while (size > minSize && estimateWidth(text, size) > maxWidth) {
		size -= 2;
	}
	return size;
}

/**
 * Break text into lines fitting maxWidth at given fontSize.
 */
function breakText(text: string, fontSize: number, maxWidth: number): string[] {
	const lines: string[] = [];
	let currentLine = '';
	let currentWidth = 0;

	for (const char of text) {
		const charWidth = char.charCodeAt(0) > 127 ? fontSize * 0.95 : fontSize * 0.58;
		if (currentWidth + charWidth > maxWidth && currentLine.length > 0) {
			lines.push(currentLine);
			currentLine = char;
			currentWidth = charWidth;
		} else {
			currentLine += char;
			currentWidth += charWidth;
		}
	}
	if (currentLine) lines.push(currentLine);
	return lines;
}

const FONT_FAMILY = `"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif`;

// ---- Layout system ----
// Each layout is a function that takes phrases + rand and returns SVG text elements.
// This gives full control over positioning without overlap.

type LayoutFn = (phrases: string[], rand: () => number) => string;

const layouts: LayoutFn[] = [
	// Layout 0: Large main phrase top-left, second phrase bottom-right (small)
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			const size = fitFontSize(phrases[0], 80, 950);
			const lines = breakText(phrases[0], size, 950);
			const startY = 160 + Math.floor(rand() * 60);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 70, startY + i * size * 1.25, size, 'start');
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 42, 550);
			const lines = breakText(phrases[1], size, 550);
			const startY = 480 - (lines.length - 1) * size * 1.2;
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 1130, startY + i * size * 1.2, size, 'end');
			});
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 32, 400);
			svg += txt(escapeXml(phrases[2]), 70, 560, size, 'start', 0.5);
		}
		return svg;
	},

	// Layout 1: Right-aligned large, left-aligned small top
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			const size = fitFontSize(phrases[0], 85, 900);
			const lines = breakText(phrases[0], size, 900);
			const startY = 200 + Math.floor(rand() * 80);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 1130, startY + i * size * 1.25, size, 'end');
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 40, 500);
			svg += txt(escapeXml(phrases[1]), 70, 100 + Math.floor(rand() * 30), size, 'start');
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 34, 500);
			svg += txt(escapeXml(phrases[2]), 70, 560, size, 'start', 0.5);
		}
		return svg;
	},

	// Layout 2: Bottom-heavy — large text at bottom, small at top-right
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			const size = fitFontSize(phrases[0], 78, 1000);
			const lines = breakText(phrases[0], size, 1000);
			const startY = 520 - (lines.length - 1) * size * 1.25;
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 70, startY + i * size * 1.25, size, 'start');
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 44, 500);
			svg += txt(escapeXml(phrases[1]), 1130, 120 + Math.floor(rand() * 40), size, 'end');
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 30, 400);
			svg += txt(escapeXml(phrases[2]), 1130, 200, size, 'end', 0.5);
		}
		return svg;
	},

	// Layout 3: Center dramatic — main phrase large centered, sub below
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			const size = fitFontSize(phrases[0], 90, 1050);
			const lines = breakText(phrases[0], size, 1050);
			const totalH = lines.length * size * 1.25;
			const startY = (630 - totalH) / 2 + size - 20 + Math.floor(rand() * 40) - 20;
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 600, startY + i * size * 1.25, size, 'middle');
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 38, 700);
			svg += txt(escapeXml(phrases[1]), 600, 520 + Math.floor(rand() * 30), size, 'middle', 0.7);
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 28, 400);
			svg += txt(escapeXml(phrases[2]), 1130, 590, size, 'end', 0.4);
		}
		return svg;
	},

	// Layout 4: Vertical main text on right + horizontal sub on left
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			// Vertical text
			const charSize = Math.min(72, Math.floor(520 / Math.max(phrases[0].length, 1)));
			const finalSize = Math.max(36, charSize);
			const x = 1020 + Math.floor(rand() * 60);
			const chars = [...phrases[0]];
			const startY = Math.max(50, (630 - chars.length * finalSize * 1.15) / 2);
			chars.forEach((ch, i) => {
				const y = startY + i * finalSize * 1.15;
				if (y < 610) {
					svg += txt(escapeXml(ch), x, y, finalSize, 'middle');
				}
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 56, 700);
			const lines = breakText(phrases[1], size, 700);
			const startY = 280 + Math.floor(rand() * 60);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 70, startY + i * size * 1.25, size, 'start');
			});
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 32, 500);
			svg += txt(escapeXml(phrases[2]), 70, 520, size, 'start', 0.5);
		}
		return svg;
	},

	// Layout 5: Split — left half large, right half stacked small
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			const size = fitFontSize(phrases[0], 72, 550);
			const lines = breakText(phrases[0], size, 550);
			const startY = 250 + Math.floor(rand() * 60);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 70, startY + i * size * 1.25, size, 'start');
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 42, 450);
			const lines = breakText(phrases[1], size, 450);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 700, 180 + i * size * 1.2, size, 'start');
			});
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 36, 450);
			const lines = breakText(phrases[2], size, 450);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 700, 380 + i * size * 1.2, size, 'start', 0.6);
			});
		}
		return svg;
	},

	// Layout 6: Top-heavy large with bottom-right accent
	(phrases, rand) => {
		let svg = '';
		if (phrases[0]) {
			const size = fitFontSize(phrases[0], 88, 1060);
			const lines = breakText(phrases[0], size, 1060);
			const startY = 130 + Math.floor(rand() * 50);
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 70, startY + i * size * 1.25, size, 'start');
			});
		}
		if (phrases[1]) {
			const size = fitFontSize(phrases[1], 44, 600);
			const lines = breakText(phrases[1], size, 600);
			const startY = 450;
			lines.forEach((line, i) => {
				svg += txt(escapeXml(line), 1130, startY + i * size * 1.2, size, 'end');
			});
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 30, 400);
			svg += txt(escapeXml(phrases[2]), 1130, 570, size, 'end', 0.4);
		}
		return svg;
	},

	// Layout 7: Two vertical columns
	(phrases, rand) => {
		let svg = '';
		const renderVertical = (text: string, x: number, maxChars: number, size: number, opacity: number = 1) => {
			const chars = [...text].slice(0, maxChars);
			const startY = Math.max(60, (630 - chars.length * size * 1.15) / 2);
			chars.forEach((ch, i) => {
				const y = startY + i * size * 1.15;
				if (y < 610) {
					svg += txt(escapeXml(ch), x, y, size, 'middle', opacity);
				}
			});
		};

		if (phrases[0]) {
			const size = Math.min(68, Math.floor(500 / Math.max(phrases[0].length, 1)));
			renderVertical(phrases[0], 800 + Math.floor(rand() * 100), 12, Math.max(40, size));
		}
		if (phrases[1]) {
			const size = Math.min(52, Math.floor(480 / Math.max(phrases[1].length, 1)));
			renderVertical(phrases[1], 300 + Math.floor(rand() * 100), 14, Math.max(32, size), 0.7);
		}
		if (phrases[2]) {
			const size = fitFontSize(phrases[2], 30, 500);
			svg += txt(escapeXml(phrases[2]), 600, 590, size, 'middle', 0.4);
		}
		return svg;
	},
];

function txt(
	content: string,
	x: number,
	y: number,
	fontSize: number,
	anchor: 'start' | 'middle' | 'end',
	opacity: number = 1,
): string {
	const opStr = opacity < 1 ? ` opacity="${opacity}"` : '';
	return `<text x="${x}" y="${y}" font-family='${FONT_FAMILY}' font-weight="900" font-size="${fontSize}" fill="#ffffff" text-anchor="${anchor}" dominant-baseline="auto"${opStr}>${content}</text>`;
}

export function generateHeroSvg(seed: string): string {
	const hash = hashCode(seed);
	const rand = seededRandom(hash);

	const phrases = extractKeyPhrases(seed);
	const layoutIndex = Math.floor(rand() * layouts.length);
	const layoutFn = layouts[layoutIndex];

	let svg = '';

	// --- Pure black background ---
	svg += `<rect width="1200" height="630" fill="#000000"/>`;

	// --- Optional subtle accent line (30% chance) ---
	if (rand() < 0.3) {
		const ly = 50 + Math.floor(rand() * 530);
		const lx = Math.floor(rand() * 300);
		const lw = 200 + Math.floor(rand() * 500);
		svg += `<line x1="${lx}" y1="${ly}" x2="${lx + lw}" y2="${ly}" stroke="#ffffff" stroke-width="0.8" opacity="0.12"/>`;
	}

	// --- Text layout ---
	svg += layoutFn(phrases, rand);

	// --- Subtle noise for film grain ---
	svg += `<defs><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>`;
	svg += `<rect width="1200" height="630" filter="url(#n)" opacity="0.025"/>`;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${svg}</svg>`;
}

export function generateHeroDataUri(seed: string): string {
	const svg = generateHeroSvg(seed);
	const encoded = Buffer.from(svg).toString('base64');
	return `data:image/svg+xml;base64,${encoded}`;
}
