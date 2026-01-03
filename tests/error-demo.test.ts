/**
 * Error Demo Tests
 * Tests for the interactive error animation demo page
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testErrorDemoPageLoads(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/error-demo/`);
  await driver.wait(until.elementLocated(By.css('.demo-container')), TIMEOUT);

  const heading = await driver.findElement(By.css('h1'));
  const text = await heading.getText();

  if (!text.includes('Error Animation Demo')) {
    throw new Error('Error demo page heading not found');
  }
}

async function testErrorDemoCanvasExists(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/error-demo/`);
  await driver.wait(until.elementLocated(By.css('#demoCanvas')), TIMEOUT);

  const canvas = await driver.findElement(By.css('#demoCanvas'));
  const isDisplayed = await canvas.isDisplayed();

  if (!isDisplayed) {
    throw new Error('Demo canvas should be visible');
  }
}

async function testErrorDemoStatusSelector(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/error-demo/`);
  await driver.wait(until.elementLocated(By.css('#status-select')), TIMEOUT);

  const select = await driver.findElement(By.css('#status-select'));
  const options = await select.findElements(By.css('option'));

  if (options.length < 5) {
    throw new Error(`Expected at least 5 status code options, found ${options.length}`);
  }
}

export const errorDemoTests: TestSuite = {
  name: 'Error Demo Tests',
  tests: [
    { name: 'Error demo page loads', fn: testErrorDemoPageLoads },
    { name: 'Error demo canvas exists', fn: testErrorDemoCanvasExists },
    { name: 'Error demo status selector works', fn: testErrorDemoStatusSelector }
  ]
};
