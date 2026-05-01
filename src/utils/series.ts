import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export type SeriesSummary = {
	slug: string;
	title: string;
	posts: BlogEntry[];
	pillar: BlogEntry | undefined;
	latestPubDate: Date;
};

export function getSeriesPath(slug: string) {
	return `/series/${encodeURIComponent(slug)}/`;
}

export function getSeriesSlug(post: BlogEntry): string | undefined {
	const value = post.data.series;
	return value && value.length > 0 ? value : undefined;
}

function deriveSeriesTitle(slug: string, posts: BlogEntry[]): string {
	const explicit = posts.find((post) => post.data.seriesTitle?.trim());
	if (explicit?.data.seriesTitle) {
		return explicit.data.seriesTitle.trim();
	}
	const pillar = posts.find((post) => post.data.pillar);
	if (pillar) {
		return pillar.data.title;
	}
	return slug;
}

export function getSeriesSummaries(posts: BlogEntry[]): SeriesSummary[] {
	const grouped = new Map<string, BlogEntry[]>();

	for (const post of posts) {
		const slug = getSeriesSlug(post);
		if (!slug) continue;
		const existing = grouped.get(slug);
		if (existing) {
			existing.push(post);
		} else {
			grouped.set(slug, [post]);
		}
	}

	const summaries: SeriesSummary[] = [];
	for (const [slug, group] of grouped) {
		const sorted = [...group].sort(
			(a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime(),
		);
		const pillar = sorted.find((post) => post.data.pillar);
		const latestPubDate = sorted.reduce(
			(latest, post) => (post.data.pubDate > latest ? post.data.pubDate : latest),
			sorted[0].data.pubDate,
		);
		summaries.push({
			slug,
			title: deriveSeriesTitle(slug, sorted),
			posts: sorted,
			pillar,
			latestPubDate,
		});
	}

	return summaries.sort((left, right) => left.title.localeCompare(right.title, 'ja'));
}

export function getSeriesForPost(
	post: BlogEntry,
	allPosts: BlogEntry[],
): SeriesSummary | undefined {
	const slug = getSeriesSlug(post);
	if (!slug) return undefined;
	const summaries = getSeriesSummaries(allPosts);
	return summaries.find((summary) => summary.slug === slug);
}
