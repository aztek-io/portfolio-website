import { marked } from 'marked';

/**
 * Generate a slug from text for use as an ID
 */
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove non-word chars
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/--+/g, '-') // Replace multiple - with single -
		.trim();
}

// Configure marked to add IDs to headings
const renderer = new marked.Renderer();

renderer.heading = function ({ text, depth, tokens }) {
	// Use raw text for slug generation (strips HTML)
	const slug = slugify(text);
	// Parse inline tokens to get proper HTML (bold, italic, etc.)
	const content = this.parser.parseInline(tokens);
	return `<h${depth} id="${slug}">${content}</h${depth}>`;
};

marked.setOptions({
	renderer
});

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
