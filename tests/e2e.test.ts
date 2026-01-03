/**
 * End-to-end tests for the portfolio site using Selenium WebDriver
 * Run with: npx tsx tests/e2e.test.ts
 *
 * Prerequisites:
 * - Docker container running: docker compose up --build -d
 * - Site available at http://localhost:8080
 */

import { log } from './logger';
import type { TestResult } from './utils';
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
  errorDemoTests
];

async function runTests(): Promise<void> {
  log.start();

  // Run all test suites
  for (const suite of allSuites) {
    await runSuite(suite, results);
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

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
