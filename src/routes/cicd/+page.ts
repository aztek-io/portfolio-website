import { parseMarkdown } from '$lib/markdown';
import cicdMd from '../../../content/cicd.md?raw';

export const prerender = true;

export function load() {
	const content = parseMarkdown(cicdMd);
	return {
		content
	};
}
