import { parseMarkdown } from '$lib/markdown';
import aboutMd from '../../../content/about.md?raw';

export const prerender = true;

export function load() {
	const content = parseMarkdown(aboutMd);
	return {
		content
	};
}
