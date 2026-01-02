import { parseMarkdown } from '$lib/markdown';
import { certs } from '$lib/data/certs';
import certsMd from '../../../content/certs.md?raw';

export const prerender = true;

export function load() {
	const content = parseMarkdown(certsMd);
	return {
		content,
		certs
	};
}
