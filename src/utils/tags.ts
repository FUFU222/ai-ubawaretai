import type { CollectionEntry } from 'astro:content';
import { INDEXABLE_TAG_MIN_POSTS, NEWS_LABEL } from '../consts';

export type BlogEntry = CollectionEntry<'blog'>;

export type TagSummary = {
	slug: string;
	label: string;
	count: number;
	latestPubDate: Date;
	isIndexable: boolean;
};

export function getTagPath(tag: string) {
	return `/category/${encodeURIComponent(tag)}/`;
}

export function getPrimaryTag(tags: string[] = []) {
	return tags[0] ?? NEWS_LABEL;
}

export function isTagIndexable(count: number) {
	return count >= INDEXABLE_TAG_MIN_POSTS;
}

export function getTagSummaries(posts: BlogEntry[]) {
	const summaries = new Map<string, TagSummary>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			const existing = summaries.get(tag);

			if (existing) {
				existing.count += 1;
				if (post.data.pubDate > existing.latestPubDate) {
					existing.latestPubDate = post.data.pubDate;
				}
				continue;
			}

				summaries.set(tag, {
					slug: tag,
					label: tag,
					count: 1,
					latestPubDate: post.data.pubDate,
					isIndexable: true,
				});
			}
		}

	return Array.from(summaries.values())
		.map((summary) => ({
			...summary,
			isIndexable: isTagIndexable(summary.count),
		}))
		.sort((left, right) => {
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
