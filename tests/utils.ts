/**
 * Shared test utilities and configuration
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { log } from './logger';

export { By, until };
export type { WebDriver };

export const BASE_URL = 'http://localhost:8080';
export const TIMEOUT = 10000;

export type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

export type TestCase = {
  name: string;
  fn: (driver: WebDriver) => Promise<void>;
};

export type TestSuite = {
  name: string;
  tests: TestCase[];
};

/**
 * Create a new WebDriver instance for Chrome
 */
export async function createDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

/**
 * Run a single test case
 */
export async function runTest(
  name: string,
  fn: (driver: WebDriver) => Promise<void>,
  results: TestResult[]
): Promise<void> {
  const driver = await createDriver();
  try {
    await fn(driver);
    results.push({ name, passed: true });
    log.pass(name);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMessage });
    log.fail(name, errorMessage);
  } finally {
    await driver.quit();
  }
}

/**
 * Run a test suite (collection of test cases)
 */
export async function runSuite(suite: TestSuite, results: TestResult[]): Promise<void> {
  log.section(suite.name);
  for (const testCase of suite.tests) {
    await runTest(testCase.name, testCase.fn, results);
  }
}
