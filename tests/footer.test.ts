/**
 * Footer Tests
 * Tests for footer content and links
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testFooterExists(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.site-footer')), TIMEOUT);

  const footer = await driver.findElement(By.css('.site-footer'));
  const isDisplayed = await footer.isDisplayed();

  if (!isDisplayed) {
    throw new Error('Footer should be visible');
  }
}

async function testFooterSocialLinks(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.social-links')), TIMEOUT);

  const socialLinks = await driver.findElements(By.css('.social-links a'));

  if (socialLinks.length !== 5) {
    throw new Error(`Expected 5 social links (including email), found ${socialLinks.length}`);
  }

  // Verify external social links open in new tab (skip email link)
  for (const link of socialLinks) {
    const href = await link.getAttribute('href');
    const ariaLabel = await link.getAttribute('aria-label');

    if (!ariaLabel) {
      throw new Error('Social links should have aria-label');
    }

    // Email link uses mailto: and doesn't need target/rel
    if (href.startsWith('mailto:')) {
      continue;
    }

    const target = await link.getAttribute('target');
    const rel = await link.getAttribute('rel');

    if (target !== '_blank') {
      throw new Error(`Social link ${href} should open in new tab`);
    }
    if (!rel || !rel.includes('noopener')) {
      throw new Error('Social links should have noopener');
    }
  }
}

async function testFooterQuickLinks(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.footer-section ul')), TIMEOUT);

  const quickLinks = await driver.findElements(By.css('.footer-section ul li a'));

  if (quickLinks.length < 4) {
    throw new Error(`Expected at least 4 quick links, found ${quickLinks.length}`);
  }

  // Verify expected links exist
  const hrefs: string[] = [];
  for (const link of quickLinks) {
    hrefs.push(await link.getAttribute('href'));
  }

  const expectedPaths = ['/', '/about', '/certs', '/error-demo'];
  for (const path of expectedPaths) {
    const found = hrefs.some(href => href.endsWith(path) || href.endsWith(path + '/'));
    if (!found) {
      throw new Error(`Quick link to ${path} not found in footer`);
    }
  }
}

async function testFooterSourceCodeLink(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.source-code a')), TIMEOUT);

  const sourceLink = await driver.findElement(By.css('.source-code a'));
  const href = await sourceLink.getAttribute('href');
  const target = await sourceLink.getAttribute('target');

  if (!href.includes('github.com/aztek-io/portfolio-website')) {
    throw new Error(`Source code link should point to GitHub repo, got: ${href}`);
  }

  if (target !== '_blank') {
    throw new Error('Source code link should open in new tab');
  }
}

export const footerTests: TestSuite = {
  name: 'Footer Tests',
  tests: [
    { name: 'Footer exists', fn: testFooterExists },
    { name: 'Footer social links', fn: testFooterSocialLinks },
    { name: 'Footer quick links', fn: testFooterQuickLinks },
    { name: 'Footer source code link', fn: testFooterSourceCodeLink }
  ]
};
