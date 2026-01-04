<script lang="ts">
  /**
   * Root Layout
   *
   * Provides the site shell: header, footer, and theme management.
   * All content data is externalized to $lib/data modules.
   */

  // ─────────────────────────────────────────────────────────────
  // Imports
  // ─────────────────────────────────────────────────────────────

  import '../lib/styles/design-system.css';
  import './+layout.css';

  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  import { createMobileMenuHandlers, initDarkMode, applyDarkMode } from '$lib/layout';
  import { footerData, socialLinks } from '$lib/data/footer';
  import { navLinks } from '$lib/data/navigation';
  import { seo } from '$lib/data/seo';
  import { icons } from '$lib/data/icons';

  // ─────────────────────────────────────────────────────────────
  // State & Props
  // ─────────────────────────────────────────────────────────────

  let { children } = $props();
  let darkMode = $state(false);
  let mobileMenuOpen = $state(false);

  // ─────────────────────────────────────────────────────────────
  // Mobile Menu Handlers
  // ─────────────────────────────────────────────────────────────

  const { toggleMobileMenu, closeMobileMenu, handleClickOutside, handleKeydown } =
    createMobileMenuHandlers(
      () => mobileMenuOpen,
      (value) => { mobileMenuOpen = value; }
    );

  // ─────────────────────────────────────────────────────────────
  // Effects & Lifecycle
  // ─────────────────────────────────────────────────────────────

  $effect(() => {
    if (browser) applyDarkMode(darkMode);
  });

  onMount(() => {
    darkMode = initDarkMode();
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- SEO Meta Tags                                               -->
<!-- ═══════════════════════════════════════════════════════════ -->

<svelte:head>
  <meta name="title" content={seo.title}>
  <meta name="description" content={seo.description}>
  <meta name="author" content={seo.author}>
  <meta name="keywords" content={seo.keywords}>

  <meta property="og:type" content="website">
  <meta property="og:url" content={seo.url}>
  <meta property="og:title" content={seo.title}>
  <meta property="og:description" content={seo.shortDescription}>
  <meta property="og:site_name" content={seo.siteName}>

  <meta property="twitter:card" content="summary">
  <meta property="twitter:url" content={seo.url}>
  <meta property="twitter:title" content={seo.title}>
  <meta property="twitter:description" content={seo.shortDescription}>

  <link rel="canonical" href={seo.url}>
</svelte:head>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- Header                                                      -->
<!-- ═══════════════════════════════════════════════════════════ -->

<header class="site-header">
  <div class="container">
    <div class="header-content">
      <div class="logo">
        <a href="/" onclick={closeMobileMenu}>
          <img src="/favicon.svg" alt="" width="28" height="28" class="logo-icon" />
          Portfolio
        </a>
      </div>

      <div class="header-actions">
        <!-- Theme Toggle -->
        <label class="theme-toggle" for="theme-toggle-input">
          <span class="theme-toggle__wrapper">
            <input
              id="theme-toggle-input"
              class="theme-toggle__input"
              type="checkbox"
              role="switch"
              bind:checked={darkMode}
              aria-label="Toggle dark mode"
            >
          </span>
        </label>

        <!-- Mobile Menu Button -->
        <button
          class="mobile-menu-toggle"
          onclick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span class="hamburger-line" class:open={mobileMenuOpen}></span>
          <span class="hamburger-line" class:open={mobileMenuOpen}></span>
          <span class="hamburger-line" class:open={mobileMenuOpen}></span>
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="nav" class:mobile-open={mobileMenuOpen} id="mobile-nav" aria-label="Main navigation">
      {#each navLinks as link (link.url)}
        {#if link.external}
          <a href={link.url} class="external-link" onclick={closeMobileMenu} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        {:else}
          <a href={link.url} onclick={closeMobileMenu}>{link.label}</a>
        {/if}
      {/each}
    </nav>
  </div>
</header>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- Main Content                                                -->
<!-- ═══════════════════════════════════════════════════════════ -->

<main class="content">
  <div class="container">
    {@render children()}
  </div>
</main>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- Footer                                                      -->
<!-- ═══════════════════════════════════════════════════════════ -->

<footer class="site-footer">
  <div class="container">
    <div class="footer-content">
      <!-- About Section -->
      <div class="footer-section">
        <h3>{footerData.title}</h3>
        <p>{footerData.description}</p>
        <p class="source-code">
          <a href={footerData.sourceCode.url} target="_blank" rel="noopener noreferrer">
            {footerData.sourceCode.label}
          </a>
        </p>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          {#each footerData.quickLinks as link (link.url)}
            <li>
              {#if link.external}
                <a href={link.url} class="external-link" target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              {:else}
                <a href={link.url}>{link.label}</a>
              {/if}
            </li>
          {/each}
        </ul>
      </div>

      <!-- Social Links -->
      <div class="footer-section">
        <h3>Connect</h3>
        <div class="social-links">
          {#each socialLinks as social (social.name)}
            <a
              href={social.url}
              aria-label={social.name}
              class:email-link={social.url.startsWith('mailto:')}
              target={social.url.startsWith('mailto:') ? undefined : '_blank'}
              rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            >
              <img src={icons[social.icon]} alt={social.name} width="20" height="20" />
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} {footerData.title}. All rights reserved.</p>
    </div>
  </div>
</footer>
