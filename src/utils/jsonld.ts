import {
	ABOUT_PAGE_DESCRIPTION,
	ABOUT_PAGE_TITLE,
	HOME_PAGE_DESCRIPTION,
	SITE_DOMAIN,
	GITHUB_URL,
	SITE_AUTHOR,
	SITE_AUTHOR_DESCRIPTION,
	SITE_DESCRIPTION,
	SITE_LANGUAGE,
	SITE_TITLE,
	SITE_URL,
} from '../consts';

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

export function organizationJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': organizationId,
		name: SITE_TITLE,
		alternateName: SITE_DOMAIN,
		description: HOME_PAGE_DESCRIPTION,
		url: SITE_URL,
		logo: {
			'@type': 'ImageObject',
			url: `${SITE_URL}/favicon.svg`,
		},
		sameAs: [GITHUB_URL],
	};
}

export function personJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_AUTHOR,
		description: SITE_AUTHOR_DESCRIPTION,
		url: `${SITE_URL}/about`,
		jobTitle: 'フルスタックエンジニア',
		worksFor: {
			'@id': organizationId,
		},
		sameAs: [GITHUB_URL],
	};
}

export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': websiteId,
		name: SITE_TITLE,
		alternateName: SITE_DOMAIN,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		inLanguage: SITE_LANGUAGE,
		publisher: {
			'@id': organizationId,
		},
	};
}

export function aboutPageJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: ABOUT_PAGE_TITLE,
		description: ABOUT_PAGE_DESCRIPTION,
		url: `${SITE_URL}/about`,
		inLanguage: SITE_LANGUAGE,
		isPartOf: {
			'@id': websiteId,
		},
		about: {
			'@id': organizationId,
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
			'@id': organizationId,
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
