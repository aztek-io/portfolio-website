<script lang="ts">
	let { data } = $props();
</script>

<div class="about-container content-container markdown-content">
	{@html data.content}
</div>
