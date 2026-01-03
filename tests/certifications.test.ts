/**
 * Certifications Tests
 * Tests for certifications page content
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testCertCardsHaveRequiredInfo(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/certs`);
  await driver.wait(until.elementLocated(By.css('.cert-card')), TIMEOUT);

  const certCards = await driver.findElements(By.css('.cert-card'));

  if (certCards.length === 0) {
    throw new Error('No certification cards found');
  }

  // Check first card has required elements
  const firstCard = certCards[0];

  const title = await firstCard.findElement(By.css('h3'));
  const issuer = await firstCard.findElement(By.css('.issuer'));

  const titleText = await title.getText();
  const issuerText = await issuer.getText();

  if (!titleText || titleText.trim().length === 0) {
    throw new Error('Cert card should have a title');
  }
  if (!issuerText || issuerText.trim().length === 0) {
    throw new Error('Cert card should have an issuer');
  }
}

async function testCertPDFLinksExist(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/certs`);
  await driver.wait(until.elementLocated(By.css('.cert-card')), TIMEOUT);

  const pdfLinks = await driver.findElements(By.css('.cert-card a[href$=".pdf"]'));

  // At least some certs should have PDF links
  if (pdfLinks.length === 0) {
    throw new Error('Expected at least one cert with a PDF link');
  }

  // Verify PDF links open in new tab
  for (const link of pdfLinks) {
    const target = await link.getAttribute('target');
    if (target !== '_blank') {
      const href = await link.getAttribute('href');
      throw new Error(`PDF link ${href} should open in new tab`);
    }
  }
}

export const certificationsTests: TestSuite = {
  name: 'Certifications Tests',
  tests: [
    { name: 'Cert cards have required info', fn: testCertCardsHaveRequiredInfo },
    { name: 'Cert PDF links exist', fn: testCertPDFLinksExist }
  ]
};
