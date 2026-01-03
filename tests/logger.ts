/**
 * Winston logger configuration for test output
 * Uses ANSI colors sparingly for log levels and pass/fail indicators
 */

import winston from 'winston';

const { combine, printf, timestamp } = winston.format;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

// Colorize log level only
function colorizeLevel(level: string): string {
  switch (level) {
    case 'error': return `${colors.red}${level}${colors.reset}`;
    case 'warn': return `${colors.yellow}${level}${colors.reset}`;
    case 'info': return `${colors.green}${level}${colors.reset}`;
    case 'debug': return `${colors.blue}${level}${colors.reset}`;
    default: return level;
  }
}

// Custom format with timestamp and colorized level
const testFormat = printf(({ level, message, timestamp }) => {
  const ts = colors.gray + timestamp + colors.reset;
  const coloredLevel = colorizeLevel(level);
  return `${ts} ${coloredLevel}: ${message}`;
});

// Create logger instance
export const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp({ format: 'HH:mm:ss.SSS' }),
    testFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Convenience methods for test-specific output
export const log = {
  section: (name: string) => {
    console.log('');
    logger.info(`--- ${name} ---`);
  },

  pass: (testName: string) => {
    const indicator = `${colors.green}PASS${colors.reset}`;
    logger.info(`${indicator}: ${testName}`);
  },

  fail: (testName: string, error: string) => {
    const indicator = `${colors.red}FAIL${colors.reset}`;
    logger.error(`${indicator}: ${testName}: ${error}`);
  },

  summary: (passed: number, failed: number) => {
    console.log('');
    console.log('='.repeat(50));
    console.log('');
    const passText = `${colors.green}${passed} passed${colors.reset}`;
    const failText = failed > 0
      ? `${colors.red}${failed} failed${colors.reset}`
      : `${failed} failed`;
    logger.info(`Results: ${passText}, ${failText}`);
    console.log('');
  },

  failedList: (failures: Array<{ name: string; error?: string }>) => {
    logger.error('Failed tests:');
    failures.forEach(f => {
      logger.error(`  ${f.name}: ${f.error}`);
    });
  },

  start: () => {
    console.log('');
    logger.info('Running E2E Tests...');
    console.log('');
    console.log('='.repeat(50));
  },

  fatalError: (err: Error | string) => {
    logger.error(`Test runner failed: ${err}`);
  }
};
