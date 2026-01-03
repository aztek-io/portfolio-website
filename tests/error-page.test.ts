/**
 * Error Page Tests
 * Tests for error page handling
 */

import type { WebDriver, TestSuite } from './utils';
import { BASE_URL } from './utils';

async function testErrorPageLoads(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/nonexistent-page-12345`);

  // Wait a moment for page to load
  await driver.sleep(500);

  // Look for error indication or redirect
  const currentUrl = await driver.getCurrentUrl();
  const pageSource = await driver.getPageSource();

  // Either we get redirected to a valid page or we see error content
  const hasErrorIndication =
    pageSource.toLowerCase().includes('not found') ||
    pageSource.toLowerCase().includes('error') ||
    pageSource.toLowerCase().includes('404') ||
    currentUrl.includes('/certs'); // Current CloudFront error redirect

  if (!hasErrorIndication) {
    throw new Error('Error page should show error indication or redirect');
  }
}

export const errorPageTests: TestSuite = {
  name: 'Error Page Tests',
  tests: [
    { name: 'Error page loads', fn: testErrorPageLoads }
  ]
};
