<script lang="ts">
  import '../lib/styles/design-system.css';
  import './+layout.css';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { createMobileMenuHandlers, initDarkMode, applyDarkMode } from '$lib/layout';

  import linkedinIcon from '$lib/assets/linkedin.svg';
  import githubIcon from '$lib/assets/github.svg';
  import youtubeIcon from '$lib/assets/youtube.svg';
  import stackoverflowIcon from '$lib/assets/stackoverflow.svg';

  // Root layout: shared header/footer
  let { children } = $props();

  let darkMode = $state(true);
  let mobileMenuOpen = $state(false);

  // Create mobile menu handlers
  const { toggleMobileMenu, closeMobileMenu, handleClickOutside, handleKeydown } =
    createMobileMenuHandlers(
      () => mobileMenuOpen,
      (value) => { mobileMenuOpen = value; }
    );

  // Reactive effect to update DOM when darkMode changes
  $effect(() => {
    if (browser) {
      applyDarkMode(darkMode);
    }
  });

  // Initialize dark mode from localStorage on mount
  onMount(() => {
    darkMode = initDarkMode();

    // Add event listeners for mobile menu
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<header class="site-header">
  <div class="container">
    <div class="header-content">
      <div class="logo">
        <a href="/" onclick={closeMobileMenu}>Portfolio</a>
      </div>

      <div class="header-actions">
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

    <nav class="nav" class:mobile-open={mobileMenuOpen} id="mobile-nav" aria-label="Main navigation">
      <a href="/" onclick={closeMobileMenu}>Home</a>
      <a href="/about" onclick={closeMobileMenu}>About</a>
      <a href="/certs" onclick={closeMobileMenu}>Certifications</a>
      <a href="/Resume.pdf" class="external-link" onclick={closeMobileMenu} target="_blank" rel="noopener noreferrer">Resume</a>
    </nav>
  </div>
</header>

<main class="content">
  <div class="container">
    {@render children()}
  </div>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Portfolio</h3>
        <p>Professional portfolio showcasing expertise and certifications.</p>
      </div>
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/certs">Certifications</a></li>
          <li><a href="/Resume.pdf" class="external-link" target="_blank" rel="noopener noreferrer">Resume</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>Connect</h3>
        <div class="social-links">
          <a href="https://www.linkedin.com/in/robert-jackson-ii/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src={linkedinIcon} alt="LinkedIn" width="20" height="20" />
          </a>
          <a href="https://github.com/unacceptable" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <img src={githubIcon} alt="GitHub" width="20" height="20" />
          </a>
          <a href="https://www.youtube.com/@robert.jackson/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <img src={youtubeIcon} alt="YouTube" width="20" height="20" />
          </a>
          <a href="https://stackoverflow.com/users/6382401/robert-j" target="_blank" rel="noopener noreferrer" aria-label="Stack Overflow">
            <img src={stackoverflowIcon} alt="Stack Overflow" width="20" height="20" />
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
    </div>
  </div>
</footer>

