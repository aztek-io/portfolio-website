/**
 * Mobile Menu Tests
 * Tests for responsive mobile navigation menu
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testMobileMenuToggle(driver: WebDriver): Promise<void> {
  // Set mobile viewport
  await driver.manage().window().setRect({ width: 375, height: 667 });
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.mobile-menu-toggle')), TIMEOUT);

  const menuButton = await driver.findElement(By.css('.mobile-menu-toggle'));
  const nav = await driver.findElement(By.css('nav.nav'));

  // Menu should be closed initially
  let navClass = await nav.getAttribute('class');
  if (navClass.includes('mobile-open')) {
    throw new Error('Menu should be closed initially');
  }

  // Open menu
  await menuButton.click();
  await driver.sleep(300);

  navClass = await nav.getAttribute('class');
  if (!navClass.includes('mobile-open')) {
    throw new Error('Menu should be open after click');
  }

  // Close menu
  await menuButton.click();
  await driver.sleep(300);

  navClass = await nav.getAttribute('class');
  if (navClass.includes('mobile-open')) {
    throw new Error('Menu should be closed after second click');
  }
}

async function testMobileMenuClosesOnNavigation(driver: WebDriver): Promise<void> {
  await driver.manage().window().setRect({ width: 375, height: 667 });
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.mobile-menu-toggle')), TIMEOUT);

  // Open menu
  const menuButton = await driver.findElement(By.css('.mobile-menu-toggle'));
  await menuButton.click();
  await driver.sleep(300);

  // Click a nav link
  const aboutLink = await driver.findElement(By.css('nav.nav a[href="/about"]'));
  await aboutLink.click();
  await driver.wait(until.urlContains('/about'), TIMEOUT);

  // Menu should be closed
  const nav = await driver.findElement(By.css('nav.nav'));
  const navClass = await nav.getAttribute('class');

  if (navClass.includes('mobile-open')) {
    throw new Error('Menu should close after navigation');
  }
}

async function testMobileMenuButtonAccessibility(driver: WebDriver): Promise<void> {
  await driver.manage().window().setRect({ width: 375, height: 667 });
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.mobile-menu-toggle')), TIMEOUT);

  const menuButton = await driver.findElement(By.css('.mobile-menu-toggle'));

  // Check aria attributes when closed
  const ariaLabel = await menuButton.getAttribute('aria-label');
  const ariaExpanded = await menuButton.getAttribute('aria-expanded');
  const ariaControls = await menuButton.getAttribute('aria-controls');

  if (ariaLabel !== 'Open navigation menu') {
    throw new Error(`Unexpected aria-label: ${ariaLabel}`);
  }
  if (ariaExpanded !== 'false') {
    throw new Error(`aria-expanded should be false initially: ${ariaExpanded}`);
  }
  if (ariaControls !== 'mobile-nav') {
    throw new Error(`Unexpected aria-controls: ${ariaControls}`);
  }

  // Open menu and check again
  await menuButton.click();
  await driver.sleep(300);

  const updatedAriaLabel = await menuButton.getAttribute('aria-label');
  const updatedAriaExpanded = await menuButton.getAttribute('aria-expanded');

  if (updatedAriaLabel !== 'Close navigation menu') {
    throw new Error(`aria-label should update when open: ${updatedAriaLabel}`);
  }
  if (updatedAriaExpanded !== 'true') {
    throw new Error(`aria-expanded should be true when open: ${updatedAriaExpanded}`);
  }
}

export const mobileMenuTests: TestSuite = {
  name: 'Mobile Menu Tests',
  tests: [
    { name: 'Mobile menu toggle works', fn: testMobileMenuToggle },
    { name: 'Mobile menu closes on navigation', fn: testMobileMenuClosesOnNavigation },
    { name: 'Mobile menu button accessibility', fn: testMobileMenuButtonAccessibility }
  ]
};
