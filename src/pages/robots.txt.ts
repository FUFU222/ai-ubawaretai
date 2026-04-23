import type { APIRoute } from 'astro';
import { SITE_URL, SITEMAP_PATH } from '../consts';

function buildRobotsTxt(sitemapURL: URL) {
	return `User-agent: *
Allow: /
Disallow: /article-levels/
Sitemap: ${sitemapURL.href}

# AI Search Crawlers (allow citation in AI search results)
User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Google-Extended
Allow: /

# AI Training Crawlers (block training data scraping)
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /
`;
}

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL(SITEMAP_PATH, site ?? SITE_URL);

	return new Response(buildRobotsTxt(sitemapURL), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
