/**
 * Shared test utilities and configuration
 */

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import { log } from './logger';

export { By, until };
export type { WebDriver };

export const BASE_URL = 'http://localhost:8080';
export const TIMEOUT = 10000;

export type BrowserType = 'chrome' | 'firefox';

export type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
  browser?: BrowserType;
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
export async function createChromeDriver(): Promise<WebDriver> {
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
 * Create a new WebDriver instance for Firefox
 */
export async function createFirefoxDriver(): Promise<WebDriver> {
  const options = new firefox.Options();
  options.addArguments('--headless');
  options.addArguments('--width=1920');
  options.addArguments('--height=1080');

  return new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
}

/**
 * Create a WebDriver instance for the specified browser
 */
export async function createDriver(browser: BrowserType = 'chrome'): Promise<WebDriver> {
  if (browser === 'firefox') {
    return createFirefoxDriver();
  }
  return createChromeDriver();
}

/**
 * Run a single test case
 */
export async function runTest(
  name: string,
  fn: (driver: WebDriver) => Promise<void>,
  results: TestResult[],
  browser: BrowserType = 'chrome'
): Promise<void> {
  const driver = await createDriver(browser);
  const testName = `[${browser}] ${name}`;
  try {
    await fn(driver);
    results.push({ name: testName, passed: true, browser });
    log.pass(testName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name: testName, passed: false, error: errorMessage, browser });
    log.fail(testName, errorMessage);
  } finally {
    await driver.quit();
  }
}

/**
 * Run a test suite (collection of test cases) for a specific browser
 */
export async function runSuite(
  suite: TestSuite,
  results: TestResult[],
  browser: BrowserType = 'chrome'
): Promise<void> {
  log.section(`${suite.name} (${browser})`);
  for (const testCase of suite.tests) {
    await runTest(testCase.name, testCase.fn, results, browser);
  }
}

/**
 * Run a test suite for all browsers
 */
export async function runSuiteAllBrowsers(
  suite: TestSuite,
  results: TestResult[],
  browsers: BrowserType[] = ['chrome', 'firefox']
): Promise<void> {
  for (const browser of browsers) {
    await runSuite(suite, results, browser);
  }
}
