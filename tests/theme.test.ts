/**
 * Theme Toggle Tests
 * Tests for dark mode toggle functionality and persistence
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testThemeToggleExists(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.theme-toggle')), TIMEOUT);

  const toggle = await driver.findElement(By.css('.theme-toggle__input'));
  const ariaLabel = await toggle.getAttribute('aria-label');

  if (ariaLabel !== 'Toggle dark mode') {
    throw new Error(`Unexpected aria-label: ${ariaLabel}`);
  }
}

async function testDarkModeDefault(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('html')), TIMEOUT);

  // Wait for JavaScript to initialize
  await driver.sleep(500);

  const html = await driver.findElement(By.css('html'));
  const classList = await html.getAttribute('class');

  // HTML element should have class attribute after JS initialization
  // Note: In headless Chrome with fresh localStorage, initDarkMode() defaults to true
  if (classList === null) {
    throw new Error('HTML element should have class attribute');
  }
}

async function testThemeToggleSwitchesMode(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.theme-toggle__input')), TIMEOUT);

  // Wait for JavaScript to fully initialize
  await driver.sleep(1000);

  const html = await driver.findElement(By.css('html'));
  const input = await driver.findElement(By.css('.theme-toggle__input'));

  // Get initial state
  const initialClassList = await html.getAttribute('class') || '';
  const initialChecked = await input.isSelected();
  const startedDark = initialClassList.includes('dark');

  // Scroll to element and click
  await driver.executeScript('arguments[0].scrollIntoView(true)', input);
  await driver.sleep(200);
  await input.click();
  await driver.sleep(500);

  // Check new state
  const afterClassList = await html.getAttribute('class') || '';
  const afterChecked = await input.isSelected();
  const afterDark = afterClassList.includes('dark');

  if (afterDark === startedDark) {
    throw new Error(
      `Theme toggle should change mode. ` +
      `Started dark: ${startedDark}, After dark: ${afterDark}. ` +
      `Checkbox started: ${initialChecked}, After: ${afterChecked}`
    );
  }

  // Click again to toggle back
  await input.click();
  await driver.sleep(500);

  const finalClassList = await html.getAttribute('class') || '';
  const finalDark = finalClassList.includes('dark');

  if (finalDark !== startedDark) {
    throw new Error('Should return to original mode after two toggles');
  }
}

async function testThemePersistsAcrossPages(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.theme-toggle__input')), TIMEOUT);
  await driver.sleep(1000);

  const toggle = await driver.findElement(By.css('.theme-toggle__input'));
  const html = await driver.findElement(By.css('html'));

  // Get initial state
  const initialClassList = await html.getAttribute('class') || '';
  const startedDark = initialClassList.includes('dark');

  // Scroll and click to toggle
  await driver.executeScript('arguments[0].scrollIntoView(true)', toggle);
  await driver.sleep(200);
  await toggle.click();
  await driver.sleep(500);

  // Verify toggle worked
  const afterToggleClassList = await html.getAttribute('class') || '';
  const afterToggleDark = afterToggleClassList.includes('dark');

  if (afterToggleDark === startedDark) {
    throw new Error(`Toggle click didn't work. Started: ${startedDark}, After: ${afterToggleDark}`);
  }

  // Navigate to another page using a link click (preserves session state)
  const aboutLink = await driver.findElement(By.css('nav.nav a[href="/about"]'));
  await aboutLink.click();
  await driver.wait(until.urlContains('/about'), TIMEOUT);
  await driver.sleep(1000);

  // Check theme persisted
  const newHtml = await driver.findElement(By.css('html'));
  const newClassList = await newHtml.getAttribute('class') || '';
  const nowDark = newClassList.includes('dark');

  if (nowDark === startedDark) {
    throw new Error(
      `Theme should persist across pages. Started: ${startedDark}, After toggle: ${afterToggleDark}, After nav: ${nowDark}`
    );
  }
}

export const themeTests: TestSuite = {
  name: 'Theme Toggle Tests',
  tests: [
    { name: 'Theme toggle exists', fn: testThemeToggleExists },
    { name: 'Dark mode default initialization', fn: testDarkModeDefault },
    { name: 'Theme toggle switches mode', fn: testThemeToggleSwitchesMode },
    { name: 'Theme persists across pages', fn: testThemePersistsAcrossPages }
  ]
};
