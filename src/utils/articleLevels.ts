import type { CollectionEntry } from 'astro:content';

export const ARTICLE_LEVEL_LABELS = {
	child: '幼児向け',
	standard: '標準',
	expert: '玄人向け',
} as const;

export const ARTICLE_LEVEL_SEQUENCE = ['child', 'standard', 'expert'] as const;

export type ArticleLevel = (typeof ARTICLE_LEVEL_SEQUENCE)[number];
export type ArticleLevelVariant = Exclude<ArticleLevel, 'standard'>;
export type ArticleLevelEntry = CollectionEntry<'blogLevels'>;

export type ArticleLevelAvailability = Partial<Record<ArticleLevelVariant, ArticleLevelEntry>>;

export function isArticleLevelVariant(value: string): value is ArticleLevelVariant {
	return value === 'child' || value === 'expert';
}

export function parseArticleLevelId(id: string) {
	const segments = id.split('/');
	const level = segments.at(-1);

	if (!level || !isArticleLevelVariant(level)) {
		return null;
	}

	const articleId = segments.slice(0, -1).join('/');

	if (!articleId) {
		return null;
	}

	return { articleId, level };
}

export function getArticleLevelAvailability(entries: ArticleLevelEntry[], articleId: string): ArticleLevelAvailability {
	return entries.reduce<ArticleLevelAvailability>((availability, entry) => {
		const parsed = parseArticleLevelId(entry.id);
		if (!parsed || parsed.articleId !== articleId) {
			return availability;
		}

		availability[parsed.level] = entry;
		return availability;
	}, {});
}

export function hasArticleLevelSwitcher(availability: ArticleLevelAvailability) {
	return Boolean(availability.child && availability.expert);
}

export function getArticleLevelPath(articleId: string, level: ArticleLevelVariant) {
	return `/article-levels/${articleId}/${level}/`;
}
