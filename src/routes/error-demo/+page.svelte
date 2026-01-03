<script lang="ts">
  import { onMount } from 'svelte';
  import { setupErrorAnimation } from '$lib/animations/errorAnimation';

  let statusCode = $state(404);
  let canvasKey = $state(0);

  const commonCodes = [
    { code: 400, label: '400 Bad Request' },
    { code: 401, label: '401 Unauthorized' },
    { code: 403, label: '403 Forbidden' },
    { code: 404, label: '404 Not Found' },
    { code: 418, label: "418 I'm a Teapot" },
    { code: 500, label: '500 Internal Server Error' },
    { code: 502, label: '502 Bad Gateway' },
    { code: 503, label: '503 Service Unavailable' }
  ];

  function updateAnimation(): void {
    // Increment key to force canvas re-render
    canvasKey++;
  }

  function handleCustomInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    // Only update if we have a valid integer between 100-999
    if (!isNaN(value) && value >= 0 && value <= 9999999) {
      statusCode = value;
      updateAnimation();
    } else if (input.value === '') {
      // Reset to default if field is cleared
      statusCode = 404;
      input.value = '404';
      updateAnimation();
    }
  }

  onMount(() => {
    const canvas = document.getElementById('demoCanvas') as HTMLCanvasElement;
    if (canvas) {
      return setupErrorAnimation(canvas, statusCode);
    }
  });

  // Re-run animation when statusCode changes
  $effect(() => {
    // Access statusCode to create dependency
    const code = statusCode;
    // Only run after initial mount and with valid code
    if (canvasKey > 0 && typeof code === 'number' && !isNaN(code) && code >= 0) {
      const canvas = document.getElementById('demoCanvas') as HTMLCanvasElement;
      if (canvas) {
        // Small delay to ensure canvas is ready
        const cleanup = setupErrorAnimation(canvas, code);
        return cleanup;
      }
    }
  });
</script>

<svelte:head>
  <title>Error Animation Demo</title>
  <meta name="description" content="Interactive demonstration of the animated error page with bouncing balls displaying HTTP status codes.">
</svelte:head>

<div class="demo-container">
  <h1>Error Animation Demo</h1>
  <p class="intro">Watch the bouncing balls form HTTP status codes! Move your mouse over the canvas to interact with the animation.</p>

  <div class="controls">
    <label for="status-select">Select Status Code:</label>
    <select id="status-select" bind:value={statusCode} onchange={updateAnimation}>
      {#each commonCodes as { code, label } (code)}
        <option value={code}>{label}</option>
      {/each}
    </select>

    <div class="custom-input">
      <label for="custom-code">Or enter custom code:</label>
      <input
        id="custom-code"
        type="number"
        min="100"
        max="999"
        value={statusCode}
        oninput={handleCustomInput}
      />
    </div>
  </div>

  <div class="canvas-container">
    {#key canvasKey}
      <canvas id="demoCanvas" width="600" height="200"></canvas>
    {/key}
  </div>

  <div class="info">
    <h2>How it works</h2>
    <p>Each digit of the status code is rendered using a 5×7 grid of bouncing balls. The balls are attracted back to their original positions but respond to mouse movement, creating an interactive physics-based animation.</p>
    <p>This animation is used on the site's error pages to make encountering errors a bit more fun!</p>
  </div>
</div>

<style>
  .demo-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  h1 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .intro {
    color: var(--color-text-muted);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xl);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: center;
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-surface);
    border-radius: var(--radius-md);
  }

  label {
    font-weight: 500;
    color: var(--color-text);
  }

  select, input[type="number"] {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: var(--font-size-base);
  }

  select:focus, input[type="number"]:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Hide number input spinners */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .custom-input {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  input[type="number"] {
    width: 100px;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-xl);
  }

  #demoCanvas {
    max-width: 100%;
    height: auto;
  }

  .info {
    padding: var(--spacing-lg);
    background: var(--color-surface);
    border-radius: var(--radius-md);
  }

  .info h2 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-xl);
  }

  .info p {
    color: var(--color-text-muted);
    line-height: var(--line-height-normal);
    margin-bottom: var(--spacing-sm);
  }

  .info p:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .demo-container {
      padding: var(--spacing-md);
    }

    .controls {
      flex-direction: column;
      align-items: flex-start;
    }

    .custom-input {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    input[type="number"] {
      width: 100%;
    }
  }
</style>
