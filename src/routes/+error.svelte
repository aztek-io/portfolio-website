<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { setupErrorAnimation } from '$lib/animations/errorAnimation';

  // Access error and status directly from page state (reactive by default)
  const error = $derived(page.error);
  const status = $derived(page.status);

  onMount(() => {
    const canvas = document.getElementById('errorCanvas') as HTMLCanvasElement;
    if (canvas) {
      return setupErrorAnimation(canvas, status);
    }
  });
</script>

<svelte:head>
  <title>{status} - Error</title>
</svelte:head>

<div class="error-container">
  <div class="canvas-container">
    <canvas id="errorCanvas" width="600" height="200"></canvas>
  </div>
  <div class="error-content content-container text-center">
    {#if status === 404}
      <h2>Oops! Page Not Found</h2>
      <p>The page you're looking for seems to have wandered off. Watch the bouncing balls spell out your error!</p>
    {:else}
      <h1>{status}</h1>
      <p>{error?.message || 'An unexpected error occurred'}</p>
    {/if}
    <p>
      <a href="/" class="btn btn-primary">← Back to Home</a>
    </p>
  </div>
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: var(--spacing-xl);
    text-align: center;
  }

  .canvas-container {
    margin-bottom: var(--spacing-xl);
  }

  #errorCanvas {
    max-width: 100%;
    height: auto;
  }

  .error-content {
    max-width: 600px;
  }

  .error-content h1,
  .error-content h2 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-3xl);
  }

  .error-content p {
    color: var(--color-text-muted);
    font-size: 1.1rem;
    line-height: var(--line-height-normal);
    margin-bottom: var(--spacing-md);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .error-container {
      padding: var(--spacing-md);
    }

    #errorCanvas {
      width: 100%;
      max-width: 400px;
      height: 150px;
    }

    .error-content h1,
    .error-content h2 {
      font-size: var(--font-size-2xl);
    }

    .error-content p {
      font-size: var(--font-size-base);
    }
  }
</style>
