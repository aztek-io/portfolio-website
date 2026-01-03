/**
 * External Links Tests
 * Tests for external link behavior (Resume, etc.)
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testResumeOpensNewTab(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('a[href="/Resume.pdf"]')), TIMEOUT);

  const resumeLink = await driver.findElement(By.css('a[href="/Resume.pdf"]'));
  const target = await resumeLink.getAttribute('target');
  const rel = await resumeLink.getAttribute('rel');

  if (target !== '_blank') {
    throw new Error(`Resume link should open in new tab, got target: ${target}`);
  }
  if (!rel || !rel.includes('noopener')) {
    throw new Error(`Resume link should have rel="noopener", got: ${rel}`);
  }
}

async function testExternalLinkIconClass(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('a[href="/Resume.pdf"]')), TIMEOUT);

  const resumeLink = await driver.findElement(By.css('a[href="/Resume.pdf"]'));
  const linkClass = await resumeLink.getAttribute('class');

  if (!linkClass.includes('external-link')) {
    throw new Error(`Resume link should have external-link class, got: ${linkClass}`);
  }
}

export const externalLinksTests: TestSuite = {
  name: 'External Links Tests',
  tests: [
    { name: 'Resume opens in new tab', fn: testResumeOpensNewTab },
    { name: 'External link icon class', fn: testExternalLinkIconClass }
  ]
};
