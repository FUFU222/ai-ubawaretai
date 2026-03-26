import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.enum(['ai-tools', 'how-to', 'comparison', 'workflow', 'news']),
			tags: z.array(z.string()).default([]),
			heroImage: z.optional(image()),
			amazonProducts: z
				.array(
					z.object({
						asin: z.string(),
						title: z.string(),
					}),
				)
				.optional(),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
