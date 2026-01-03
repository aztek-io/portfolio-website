/**
 * Layout utility functions for mobile menu and theme management
 */

export interface MobileMenuHandlers {
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  handleClickOutside: (event: MouseEvent) => void;
  handleKeydown: (event: KeyboardEvent) => void;
}

/**
 * Creates mobile menu handlers with encapsulated state
 */
export function createMobileMenuHandlers(
  getMobileMenuOpen: () => boolean,
  setMobileMenuOpen: (value: boolean) => void
): MobileMenuHandlers {
  function toggleMobileMenu() {
    const newState = !getMobileMenuOpen();
    setMobileMenuOpen(newState);

    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }

  function handleClickOutside(event: MouseEvent) {
    if (getMobileMenuOpen()) {
      const target = event.target as Element;
      const nav = document.querySelector('.nav');
      const toggle = document.querySelector('.mobile-menu-toggle');

      if (nav && toggle && !nav.contains(target) && !toggle.contains(target)) {
        closeMobileMenu();
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && getMobileMenuOpen()) {
      closeMobileMenu();
    }
  }

  return {
    toggleMobileMenu,
    closeMobileMenu,
    handleClickOutside,
    handleKeydown
  };
}

/**
 * Initialize dark mode from localStorage
 * @returns true if dark mode should be enabled, false otherwise
 */
export function initDarkMode(): boolean {
  if (typeof localStorage === 'undefined') {
    return true; // Default to dark mode if localStorage unavailable
  }

  const stored = localStorage.getItem('darkMode');
  if (stored === 'false') {
    return false;
  }
  return true; // Default to dark mode
}

/**
 * Apply dark mode to document and save preference
 */
export function applyDarkMode(darkMode: boolean): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('darkMode', darkMode.toString());
  }
}
