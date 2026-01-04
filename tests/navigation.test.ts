/**
 * Navigation Tests
 * Tests for page loading and navigation functionality
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testHomePageLoads(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

  const heading = await driver.findElement(By.css('h1'));
  const text = await heading.getText();

  if (!text) {
    throw new Error('Home page heading not found');
  }
}

async function testAboutPageLoads(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/about/`);
  await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

  const heading = await driver.findElement(By.css('h1'));
  const text = await heading.getText();

  if (!text) {
    throw new Error('About page heading not found');
  }
}

async function testCertsPageLoads(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/certs/`);
  await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

  const cards = await driver.findElements(By.css('.cert-card'));

  if (cards.length === 0) {
    throw new Error('No certification cards found');
  }
}

async function testCicdPageLoads(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/cicd/`);
  await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

  const heading = await driver.findElement(By.css('h1'));
  const text = await heading.getText();

  if (!text) {
    throw new Error('CI/CD page heading not found');
  }
}

async function testNavLinksWork(driver: WebDriver): Promise<void> {
  await driver.get(BASE_URL);
  await driver.wait(until.elementLocated(By.css('nav.nav')), TIMEOUT);

  // Click About link
  const aboutLink = await driver.findElement(By.css('nav.nav a[href="/about"]'));
  await aboutLink.click();
  await driver.wait(until.urlContains('/about'), TIMEOUT);

  // Click CI/CD link
  const cicdLink = await driver.findElement(By.css('nav.nav a[href="/cicd"]'));
  await cicdLink.click();
  await driver.wait(until.urlContains('/cicd'), TIMEOUT);

  // Click Certs link
  const certsLink = await driver.findElement(By.css('nav.nav a[href="/certs"]'));
  await certsLink.click();
  await driver.wait(until.urlContains('/certs'), TIMEOUT);

  // Click Error Demo link
  const errorDemoLink = await driver.findElement(By.css('nav.nav a[href="/error-demo"]'));
  await errorDemoLink.click();
  await driver.wait(until.urlContains('/error-demo'), TIMEOUT);

  // Click Home link
  const homeLink = await driver.findElement(By.css('nav.nav a[href="/"]'));
  await homeLink.click();
  await driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);
}

async function testLogoLinksToHome(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/about/`);
  await driver.wait(until.elementLocated(By.css('.logo a')), TIMEOUT);

  const logo = await driver.findElement(By.css('.logo a'));
  await logo.click();
  await driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);
}

export const navigationTests: TestSuite = {
  name: 'Navigation Tests',
  tests: [
    { name: 'Home page loads', fn: testHomePageLoads },
    { name: 'About page loads', fn: testAboutPageLoads },
    { name: 'CI/CD page loads', fn: testCicdPageLoads },
    { name: 'Certs page loads', fn: testCertsPageLoads },
    { name: 'Nav links work', fn: testNavLinksWork },
    { name: 'Logo links to home', fn: testLogoLinksToHome }
  ]
};
