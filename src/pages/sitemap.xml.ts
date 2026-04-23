import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../consts';
import { getTagPath, getTagSummaries } from '../utils/tags';

type SitemapEntry = {
	loc: string;
	lastmod?: Date;
};

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function serializeEntry(entry: SitemapEntry) {
	return [
		'<url>',
		`<loc>${escapeXml(entry.loc)}</loc>`,
		entry.lastmod ? `<lastmod>${entry.lastmod.toISOString()}</lastmod>` : '',
		'</url>',
	].join('');
}

export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site ?? SITE_URL;
	const allPosts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	const tagSummaries = getTagSummaries(allPosts).filter((tag) => tag.isIndexable);
	const latestPostDate = allPosts[0]?.data.updatedDate ?? allPosts[0]?.data.pubDate;

	const entries: SitemapEntry[] = [
		{ loc: new URL('/', siteUrl).href, ...(latestPostDate && { lastmod: latestPostDate }) },
		{ loc: new URL('/blog/', siteUrl).href, ...(latestPostDate && { lastmod: latestPostDate }) },
		{ loc: new URL('/category/', siteUrl).href, ...(latestPostDate && { lastmod: latestPostDate }) },
		{ loc: new URL('/about/', siteUrl).href },
		{ loc: new URL('/contact/', siteUrl).href },
		{ loc: new URL('/privacy/', siteUrl).href },
		...allPosts.map((post) => ({
			loc: new URL(`/blog/${post.id}/`, siteUrl).href,
			lastmod: post.data.updatedDate ?? post.data.pubDate,
		})),
		...tagSummaries.map((tag) => ({
			loc: new URL(getTagPath(tag.slug), siteUrl).href,
			lastmod: tag.latestPubDate,
		})),
	];

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
		entries.map(serializeEntry).join('') +
		`</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
};
