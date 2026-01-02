import { parseMarkdown } from '$lib/markdown';
import homeMd from '../../content/home.md?raw';

export const prerender = true;

export function load() {
	const content = parseMarkdown(homeMd);
	return {
		content
	};
}
