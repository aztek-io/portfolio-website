<script lang="ts">
	let { data } = $props();
</script>

<div class="home-content markdown-content">
	{@html data.content}
</div>
