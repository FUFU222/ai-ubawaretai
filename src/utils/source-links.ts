export type SourceLink = {
	label: string;
	url: string;
};

const SOURCE_SECTION_PATTERN = /(?:^|\n)(?:##+\s*出典\s*$|\*\*出典:\*\*)/m;
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+(?:\([^\s)]*\)[^\s)]*)*)\)/g;

export function extractSourceLinks(content: string): SourceLink[] {
	if (!content) return [];

	const sectionMatch = content.match(SOURCE_SECTION_PATTERN);
	if (!sectionMatch || sectionMatch.index === undefined) return [];

	const sourceSection = content.slice(sectionMatch.index);
	const links: SourceLink[] = [];
	const seenUrls = new Set<string>();

	for (const match of sourceSection.matchAll(MARKDOWN_LINK_PATTERN)) {
		const [, rawLabel, rawUrl] = match;
		if (!rawLabel || !rawUrl || seenUrls.has(rawUrl)) continue;
		seenUrls.add(rawUrl);
		links.push({ label: rawLabel.trim(), url: rawUrl.trim() });
	}

	return links;
}
