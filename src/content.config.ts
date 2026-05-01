import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.string().min(1),
			tags: z.array(z.string()).default([]),
			heroImage: z.string().optional(),
			amazonProducts: z
				.array(
					z.object({
						asin: z.string(),
						title: z.string(),
					}),
				)
				.optional(),
			draft: z.boolean().default(false),
			series: z.string().optional(),
			seriesTitle: z.string().optional(),
			pillar: z.boolean().default(false),
		}),
});

const blogLevels = defineCollection({
	loader: glob({ base: './src/content/blog-levels', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			article: z.string().min(1),
			level: z.enum(['child', 'expert']),
		}),
});

export const collections = { blog, blogLevels };
