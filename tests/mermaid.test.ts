/**
 * Mermaid Diagram Tests
 * Tests for Mermaid diagram rendering on the CI/CD philosophy page
 */

import type { WebDriver, TestSuite } from './utils';
import { By, until, BASE_URL, TIMEOUT } from './utils';

async function testCicdPageLoads(driver: WebDriver): Promise<void> {
	await driver.get(`${BASE_URL}/cicd/`);
	await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

	const heading = await driver.findElement(By.css('h1'));
	const text = await heading.getText();

	if (!text.includes('CI/CD')) {
		throw new Error(`Expected heading to contain "CI/CD", got: ${text}`);
	}
}

async function testMermaidDiagramsRender(driver: WebDriver): Promise<void> {
	await driver.get(`${BASE_URL}/cicd/`);
	await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

	// Wait for Mermaid to initialize and render
	await driver.sleep(2000);

	// Check that SVG elements were rendered (Mermaid outputs SVG)
	const svgElements = await driver.findElements(By.css('svg'));

	if (svgElements.length === 0) {
		throw new Error('No SVG elements found - Mermaid diagrams did not render');
	}

	// Check that we have at least 2 diagrams (CI and CD)
	// Mermaid adds a specific class to its SVGs
	const mermaidSvgs = await driver.findElements(By.css('svg[id^="mermaid"]'));

	if (mermaidSvgs.length < 2) {
		throw new Error(`Expected at least 2 Mermaid diagrams, found: ${mermaidSvgs.length}`);
	}
}

async function testMermaidNotRawCss(driver: WebDriver): Promise<void> {
	await driver.get(`${BASE_URL}/cicd/`);
	await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

	// Wait for Mermaid to initialize
	await driver.sleep(2000);

	// Get page content and check it doesn't contain raw Mermaid CSS
	const content = await driver.findElement(By.css('.cicd-container'));
	const text = await content.getText();

	// If Mermaid fails, it outputs raw CSS like "font-family:trebuchet ms"
	if (text.includes('font-family:"trebuchet ms"') || text.includes('stroke-dasharray')) {
		throw new Error('Mermaid diagrams rendered as raw CSS instead of SVG');
	}

	// Check for expected diagram node text
	if (!text.includes('init') || !text.includes('lint') || !text.includes('build')) {
		throw new Error('Mermaid diagram nodes not visible - diagrams may not have rendered');
	}
}

async function testMermaidClickableLinks(driver: WebDriver): Promise<void> {
	await driver.get(`${BASE_URL}/cicd/`);
	await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

	// Wait for Mermaid to initialize
	await driver.sleep(2000);

	// Check that sections exist for navigation
	const ciLintSection = await driver.findElements(By.css('#ci-lint-stage, [id="ci-lint-stage"]'));
	const cdDeploySection = await driver.findElements(By.css('#cd-deploy-stage, [id="cd-deploy-stage"]'));

	if (ciLintSection.length === 0) {
		throw new Error('CI Lint Stage section not found');
	}

	if (cdDeploySection.length === 0) {
		throw new Error('CD Deploy Stage section not found');
	}
}

async function testPrinciplesSectionExists(driver: WebDriver): Promise<void> {
	await driver.get(`${BASE_URL}/cicd/`);
	await driver.wait(until.elementLocated(By.css('.content')), TIMEOUT);

	const content = await driver.findElement(By.css('.cicd-container'));
	const text = await content.getText();

	// Check for the 6 principles
	const principles = [
		'Fail Fast',
		'Artifact Integrity',
		'Immutable Artifacts',
		'Gated Progression',
		'Observability',
		'Reproducibility'
	];

	for (const principle of principles) {
		if (!text.includes(principle)) {
			throw new Error(`Missing principle: ${principle}`);
		}
	}
}

export const mermaidTests: TestSuite = {
	name: 'Mermaid Diagrams',
	tests: [
		{ name: 'CI/CD page loads', fn: testCicdPageLoads },
		{ name: 'Mermaid diagrams render as SVG', fn: testMermaidDiagramsRender },
		{ name: 'Mermaid not showing raw CSS', fn: testMermaidNotRawCss },
		{ name: 'Mermaid clickable links have targets', fn: testMermaidClickableLinks },
		{ name: 'Principles section exists', fn: testPrinciplesSectionExists }
	]
};
