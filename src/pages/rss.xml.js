import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../config';

export async function GET(context) {
	// Get all blog posts using glob import
	const posts = await import.meta.glob('./blog/**/*.{md,mdx}', { eager: true });
	
	// Process posts to extract frontmatter and generate RSS items
	const items = Object.entries(posts)
		.map(([path, post]) => {
			// Extract slug from path (e.g., './blog/2024-01-21-deploy-astro-static-on-deno-deploy/index.md' -> '2024-01-21-deploy-astro-static-on-deno-deploy')
			const slug = path.replace('./blog/', '').replace('/index.md', '').replace('/index.mdx', '');
			
			return {
				...post.frontmatter,
				slug,
				url: path
			};
		})
		// Filter out draft posts
		.filter(post => post.status === 'published')
		// Sort by publication date (newest first)
		.sort((a, b) => {
			const dateA = new Date(a.pubDate || a.published || a.createdDate);
			const dateB = new Date(b.pubDate || b.published || b.createdDate);
			return dateB - dateA;
		})
		// Map to RSS item format
		.map(post => ({
			title: post.title,
			description: post.description,
			pubDate: new Date(post.pubDate || post.published || post.createdDate),
			link: `/blog/${post.slug}/`,
		}));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: items,
	});
}
