import type { CollectionEntry } from 'astro:content';
import { CATEGORIES } from '../consts';

export type BlogEntry = CollectionEntry<'blog'>;

export type CategorySummary = {
	slug: string;
	label: string;
	count: number;
	latestPubDate: Date;
};

export function getCategoryLabel(category: string) {
	return CATEGORIES[category as keyof typeof CATEGORIES] ?? category;
}

export function getCategoryPath(category: string) {
	return `/category/${encodeURIComponent(category)}/`;
}

export function getCategorySummaries(posts: BlogEntry[]) {
	const summaries = new Map<string, CategorySummary>();

	for (const post of posts) {
		const slug = post.data.category;
		const existing = summaries.get(slug);

		if (existing) {
			existing.count += 1;
			if (post.data.pubDate > existing.latestPubDate) {
				existing.latestPubDate = post.data.pubDate;
			}
			continue;
		}

		summaries.set(slug, {
			slug,
			label: getCategoryLabel(slug),
			count: 1,
			latestPubDate: post.data.pubDate,
		});
	}

	return Array.from(summaries.values()).sort((left, right) => {
		const countDiff = right.count - left.count;
		if (countDiff !== 0) {
			return countDiff;
		}

		const dateDiff = right.latestPubDate.valueOf() - left.latestPubDate.valueOf();
		if (dateDiff !== 0) {
			return dateDiff;
		}

		return left.label.localeCompare(right.label, 'ja');
	});
}
