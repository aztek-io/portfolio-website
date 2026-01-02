<script lang="ts">
  let { data } = $props();
</script>

<div class="markdown-content">
  {@html data.content}
</div>

<div class="certs-grid grid-auto mt-lg">
  {#each data.certs as cert}
    <div class="cert-card card">
      <div class="cert-header">
        <h3>{cert.title}</h3>
        {#if cert.pdfUrl}
          <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" class="view-cert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            View Certificate
          </a>
        {/if}
      </div>
      {#if cert.issuer}
        <p class="issuer">{cert.issuer}</p>
      {/if}
      {#if cert.issued}
        <p class="issued">Issued: {cert.issued}</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  .cert-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    gap: var(--spacing-md);
  }

  .cert-card h3 {
    margin: 0;
    color: var(--color-primary);
    font-size: 1.125rem;
    line-height: var(--line-height-tight);
    flex: 1;
  }

  .view-cert {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-secondary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .view-cert:hover {
    background-color: #ecfdf5;
    color: var(--color-secondary-hover);
    transform: scale(1.05);
  }

  .issuer {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin: var(--spacing-sm) 0;
    font-size: var(--font-size-base);
  }

  .issued {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    margin: var(--spacing-sm) 0;
  }

  .view-cert svg {
    flex-shrink: 0;
  }

  /* Dark mode adjustments for certificate-specific colors */
  :global(.dark .view-cert:hover) {
    background-color: #064e3b;
    color: var(--color-secondary-light);
  }
</style>
