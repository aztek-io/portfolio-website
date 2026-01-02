import { marked } from 'marked';

/**
 * Load a markdown file from the content directory and render it to HTML
 * This uses Vite's ?raw import which works at build time
 */
export function parseMarkdown(markdown: string): string {
	return marked(markdown) as string;
}

/**
 * Extract title from markdown (first H1)
 */
export function extractTitle(html: string): string | null {
	const match = html.match(/<h1[^>]*>(.*?)<\/h1>/);
	return match ? match[1] : null;
}
