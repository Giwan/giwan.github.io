export async function GET(context) {
	const robotsTxt = `
User-agent: *
Allow: /

# Disallow draft pages
Disallow: /drafts/

# Allow important pages
Allow: /blog/
Allow: /tools/
Allow: /search/
Allow: /about/

# Crawl-delay for better server performance
Crawl-delay: 1

# Sitemap location (when available)
Sitemap: ${context.site}sitemap-index.xml

# RSS feed
# Note: RSS feeds are discoverable via <link> tags in HTML head
`.trim();

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}