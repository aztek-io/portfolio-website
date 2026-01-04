<script lang="ts">
	import { onMount } from 'svelte';
	import mermaid from 'mermaid';

	let { data } = $props();
	let rendered = $state(false);

	onMount(async () => {
		mermaid.initialize({
			startOnLoad: false,
			theme: 'neutral',
			look: 'handDrawn',
			flowchart: {
				useMaxWidth: true,
				htmlLabels: true
			},
			securityLevel: 'loose' // Required for click handlers
		});

		// Find all mermaid code blocks and render them properly
		const codeBlocks = document.querySelectorAll('pre > code.language-mermaid');

		for (const codeBlock of codeBlocks) {
			const pre = codeBlock.parentElement;
			if (!pre) continue;

			const code = codeBlock.textContent || '';
			const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

			try {
				const { svg } = await mermaid.render(id, code);
				const container = document.createElement('div');
				container.className = 'mermaid-diagram';
				container.innerHTML = svg;
				pre.replaceWith(container);
			} catch (error) {
				console.error('Mermaid render error:', error);
				// Keep the code block visible if rendering fails
			}
		}

		rendered = true;
	});
</script>

<svelte:head>
	<title>CI/CD Philosophy | Portfolio</title>
	<meta name="description" content="My philosophy on Continuous Integration and Continuous Deployment pipelines." />
</svelte:head>

<div class="cicd-container content-container markdown-content" class:rendered>
	{@html data.content}
</div>

<style>
	/* Hide raw mermaid code until rendered */
	.cicd-container :global(pre:has(code.language-mermaid)) {
		visibility: hidden;
		height: 0;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.cicd-container.rendered :global(pre:has(code.language-mermaid)) {
		display: none;
	}

	.cicd-container :global(.mermaid-diagram) {
		display: flex;
		justify-content: center;
		margin: var(--spacing-lg) 0;
	}

	.cicd-container :global(.mermaid-diagram svg) {
		max-width: 100%;
		height: auto;
	}
</style>
