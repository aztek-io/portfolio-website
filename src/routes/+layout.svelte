<script lang="ts">
  import '../lib/styles/design-system.css';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import linkedinIcon from '$lib/assets/linkedin.svg';
  import githubIcon from '$lib/assets/github.svg';
  import youtubeIcon from '$lib/assets/youtube.svg';
  import stackoverflowIcon from '$lib/assets/stackoverflow.svg';

  // Root layout: shared header/footer
  let { children } = $props();

  let darkMode = $state(true);
  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;

    // Prevent body scroll when menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Close mobile menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (mobileMenuOpen) {
      const target = event.target as Element;
      const nav = document.querySelector('.nav');
      const toggle = document.querySelector('.mobile-menu-toggle');

      if (nav && toggle && !nav.contains(target) && !toggle.contains(target)) {
        closeMobileMenu();
      }
    }
  }

  // Close mobile menu on escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
  }

  // Reactive effect to update DOM when darkMode changes
  $effect(() => {
    if (browser) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', darkMode.toString());
    }
  });

  // Initialize dark mode from localStorage on mount
  onMount(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'false') {
      darkMode = false;
    } else {
      // Default to dark mode if no preference stored
      darkMode = true;
    }

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
      <a href="/Resume.pdf" onclick={closeMobileMenu} target="_blank" rel="noopener noreferrer">Resume</a>
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
          <li><a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a></li>
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

<style>
  /* Layout-specific styles only */
  .site-header {
    background: var(--color-bg-primary);
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
  }

  .site-header .container {
    padding: var(--spacing-md);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .logo a {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .logo a:hover {
    color: var(--color-primary);
  }

  .nav {
    display: flex;
    gap: var(--spacing-xl);
    align-items: center;
  }

  /* Mobile menu toggle button */
  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    z-index: 10;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }

  .mobile-menu-toggle:hover {
    background: var(--color-bg-secondary);
  }

  .mobile-menu-toggle:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .hamburger-line {
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform-origin: center;
    border-radius: 1px;
  }

  .nav a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-base);
    padding: 0.5rem 0.25rem;
    position: relative;
    transition: color var(--transition-fast);
  }

  .nav a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--color-primary);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform var(--transition-normal);
  }

  .nav a:hover {
    color: var(--color-primary);
  }

  .nav a:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .nav a:active {
    color: var(--color-primary-hover);
  }

  .content {
    flex: 1;
    padding: var(--spacing-2xl) 0;
    background: var(--color-bg-primary);
  }

  .site-footer {
    background: var(--color-footer-bg);
    color: var(--color-footer-text);
    padding: var(--spacing-2xl) 0 var(--spacing-md);
    backdrop-filter: blur(10px);
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }

  .footer-section h3 {
    color: var(--color-footer-text-light);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
    font-weight: var(--font-weight-semibold);
  }

  .footer-section p {
    color: var(--color-footer-text-muted);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-section ul li {
    margin-bottom: var(--spacing-sm);
  }

  .footer-section ul li a {
    color: var(--color-footer-text-muted);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: color var(--transition-fast);
  }

  .footer-section ul li a:hover {
    color: var(--color-footer-text-light);
  }

  .social-links {
    display: flex;
    gap: var(--spacing-md);
  }

  .social-links a {
    color: var(--color-footer-text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .social-links a:hover {
    color: var(--color-footer-text-light);
  }

  .footer-bottom {
    border-top: 1px solid var(--color-footer-border);
    padding-top: var(--spacing-md);
    text-align: center;
  }

  .footer-bottom p {
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    margin: 0;
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .theme-toggle__wrapper {
    position: relative;
    margin: 0;
  }

  .theme-toggle__input {
    position: relative;
    display: block;
    appearance: none;
    -webkit-appearance: none;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border: 2px solid var(--color-border);
    border-radius: 2rem;
    padding: 0.25rem;
    width: 5rem;
    height: 2.5rem;
    cursor: pointer;
    transition: all var(--transition-normal);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
  }

  .theme-toggle__input:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0.125rem;
    transform: translateY(-50%);
    display: block;
    background: #ffffff;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    transition: all var(--transition-normal);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  }

  .theme-toggle__input:hover {
    border-color: var(--color-primary);
    box-shadow: 
      0 4px 12px rgba(59, 130, 246, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
  }

  .theme-toggle__input:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .theme-toggle__input:checked {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    border-color: var(--color-primary);
  }

  .theme-toggle__input:checked:before {
    transform: translateX(2.5rem) translateY(-50%);
    background: #e0f2fe;
  }

  @supports selector(:focus-visible) {
    .theme-toggle__input:focus {
      outline: none;
    }

    .theme-toggle__input:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .container {
      padding: 0 var(--spacing-lg);
    }

    .header-content {
      padding: var(--spacing-md) 0;
    }

    .mobile-menu-toggle {
      display: flex;
      position: relative;
    }

    .hamburger-line {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .hamburger-line.open:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger-line.open:nth-child(2) {
      opacity: 0;
      transform: scale(0);
    }

    .hamburger-line.open:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    .nav {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-bg-primary);
      border-top: 1px solid var(--color-border);
      flex-direction: column;
      gap: 0;
      max-height: 0;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(20px);
      z-index: 1000;
    }

    .nav.mobile-open {
      max-height: 400px;
      border-bottom: 1px solid var(--color-border);
    }

    .nav a {
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid var(--color-border-light);
      width: 100%;
      text-align: left;
      font-size: var(--font-size-base);
      min-height: 56px;
      display: flex;
      align-items: center;
      position: relative;
    }

    .nav a:last-child {
      border-bottom: none;
    }

    .nav a::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      height: 100%;
      background: var(--color-primary);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--transition-normal);
    }

    .nav a:hover,
    .nav a:focus {
      background: var(--color-bg-secondary);
      color: var(--color-primary);
    }

    .nav a:hover::after,
    .nav a:focus::after {
      transform: scaleX(1);
    }

    .nav a:active {
      background: var(--color-bg-muted);
    }

    .theme-toggle__input {
      width: 4.5rem;
      height: 2.25rem;
      padding: 0.2rem;
    }

    .theme-toggle__input:before {
      width: 1.75rem;
      height: 1.75rem;
    }

    .theme-toggle__input:checked:before {
      transform: translateX(2.25rem) translateY(-50%);
    }

    .content {
      padding: var(--spacing-lg) 0;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
      text-align: center;
    }

    .social-links {
      justify-content: center;
    }
  }

  /* Extra small devices */
  @media (max-width: 480px) {
    .container {
      padding: 0 var(--spacing-md);
    }

    .header-content {
      padding: var(--spacing-sm) 0;
    }

    .logo a {
      font-size: var(--font-size-lg);
    }

    .nav a {
      padding: var(--spacing-md) var(--spacing-lg);
      min-height: 48px;
      font-size: var(--font-size-sm);
    }

    .theme-toggle__input {
      width: 4rem;
      height: 2rem;
      padding: 0.175rem;
    }

    .theme-toggle__input:before {
      width: 1.5rem;
      height: 1.5rem;
    }

    .theme-toggle__input:checked:before {
      transform: translateX(2rem) translateY(-50%);
    }
  }

  @media (max-width: 480px) {
    .header-content {
      padding: 0 var(--spacing-sm);
    }

    .header-actions {
      gap: var(--spacing-sm);
    }

    .nav a {
      padding: var(--spacing-md) var(--spacing-lg);
      font-size: var(--font-size-sm);
    }

    .theme-toggle__input {
      width: 3.5rem;
      height: 1.75rem;
      padding: 0.15rem;
    }

    .theme-toggle__input:before {
      width: 1.35rem;
      height: 1.35rem;
    }

    .theme-toggle__input:checked:before {
      transform: translateX(1.75rem) translateY(-50%);
    }

    .mobile-menu-toggle {
      width: 20px;
      height: 20px;
    }

    .hamburger-line {
      width: 20px;
    }

    .hamburger-line.open:nth-child(1) {
      transform: rotate(45deg) translate(4px, 4px);
    }

    .hamburger-line.open:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -5px);
    }
  }
</style>
