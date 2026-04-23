import {
	GITHUB_URL,
	SITE_AUTHOR,
	SITE_AUTHOR_DESCRIPTION,
	SITE_DESCRIPTION,
	SITE_LANGUAGE,
	SITE_TITLE,
	SITE_URL,
} from '../consts';

export function personJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_AUTHOR,
		description: SITE_AUTHOR_DESCRIPTION,
		url: `${SITE_URL}/about`,
		jobTitle: 'フルスタックエンジニア',
		worksFor: {
			'@type': 'Organization',
			name: SITE_TITLE,
			url: SITE_URL,
		},
		sameAs: [GITHUB_URL],
	};
}

export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_TITLE,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		inLanguage: SITE_LANGUAGE,
		publisher: {
			'@type': 'Person',
			name: SITE_AUTHOR,
			url: `${SITE_URL}/about`,
		},
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
		dateModified: (params.updatedDate ?? params.pubDate).toISOString(),
		...(params.image && { image: params.image }),
		author: {
			'@type': 'Person',
			name: SITE_AUTHOR,
			url: `${SITE_URL}/about`,
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_TITLE,
			url: SITE_URL,
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
