/**
 * End-to-end tests for the portfolio site using Selenium WebDriver
 * Run with: npx tsx tests/e2e.test.ts
 *
 * Prerequisites:
 * - Docker container running: docker compose up --build -d
 * - Site available at http://localhost:8080
 * - Chrome and Firefox browsers installed
 */

import { log } from './logger';
import type { TestResult, BrowserType } from './utils';
import { runSuite } from './utils';

// Import test suites
import { navigationTests } from './navigation.test';
import { themeTests } from './theme.test';
import { mobileMenuTests } from './mobile-menu.test';
import { externalLinksTests } from './external-links.test';
import { footerTests } from './footer.test';
import { certificationsTests } from './certifications.test';
import { errorPageTests } from './error-page.test';
import { errorDemoTests } from './error-demo.test';
import { mermaidTests } from './mermaid.test';

const results: TestResult[] = [];

// All test suites in order
const allSuites = [
  navigationTests,
  themeTests,
  mobileMenuTests,
  externalLinksTests,
  footerTests,
  certificationsTests,
  errorPageTests,
  errorDemoTests,
  mermaidTests
];

// Browsers to test
const browsers: BrowserType[] = ['chrome', 'firefox'];

async function runTests(): Promise<void> {
  log.start();

  // Run all test suites for each browser
  for (const browser of browsers) {
    log.info(`\n${'='.repeat(50)}`);
    log.info(`Running tests in ${browser.toUpperCase()}`);
    log.info(`${'='.repeat(50)}\n`);

    for (const suite of allSuites) {
      await runSuite(suite, results, browser);
    }
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  // Browser-specific summary
  log.info('\n--- Browser Summary ---');
  for (const browser of browsers) {
    const browserResults = results.filter(r => r.browser === browser);
    const browserPassed = browserResults.filter(r => r.passed).length;
    const browserFailed = browserResults.filter(r => !r.passed).length;
    log.info(`${browser}: ${browserPassed} passed, ${browserFailed} failed`);
  }

  log.summary(passed, failed);

  if (failed > 0) {
    log.failedList(results.filter(r => !r.passed));
    process.exit(1);
  }
}

runTests().catch(err => {
  log.fatalError(err);
  process.exit(1);
});
