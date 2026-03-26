import { SITE_AUTHOR, SITE_AUTHOR_DESCRIPTION, SITE_TITLE, GITHUB_URL } from '../consts';

export function personJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_AUTHOR,
		description: SITE_AUTHOR_DESCRIPTION,
		url: GITHUB_URL,
		jobTitle: 'フルスタックエンジニア',
		sameAs: [GITHUB_URL],
	};
}

export function articleJsonLd(params: {
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	url: string;
	image?: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: params.title,
		description: params.description,
		datePublished: params.pubDate.toISOString(),
		...(params.updatedDate && { dateModified: params.updatedDate.toISOString() }),
		...(params.image && { image: params.image }),
		author: {
			'@type': 'Person',
			name: SITE_AUTHOR,
			url: GITHUB_URL,
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_TITLE,
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': params.url,
		},
	};
}

export function breadcrumbJsonLd(
	items: Array<{ name: string; url: string }>,
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
