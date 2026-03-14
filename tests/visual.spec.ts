import { test, expect } from '@playwright/test';

test.describe('Visual Regression: Core UI & Content', () => {

  test('Homepage Visual Stability', async ({ page }) => {
    await page.goto('/');
    // Wait for animations to settle
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  });

  test('Fundamentals: Latency Hero Section', async ({ page }) => {
    await page.goto('/fundamentals/latency-throughput');
    await page.waitForSelector('main');
    const hero = page.locator('main').first();
    await expect(hero).toHaveScreenshot('latency-hero.png');
  });

  test('Fundamentals: Little\'s Law Math (Current Bug)', async ({ page }) => {
    await page.goto('/fundamentals/latency-throughput');
    const heading = page.locator('h2:has-text("Little\'s Law")');
    await heading.scrollIntoViewIfNeeded();
    // Capture the parent div which contains the heading and the following raw text/list
    const section = heading.locator('..').locator('..'); 
    await expect(section).toHaveScreenshot('littles-law-math.png');
  });

  test('Scaling: Consistent Hashing Simulation', async ({ page }) => {
    await page.goto('/scaling/consistent-hashing');
    const heading = page.locator('h2:has-text("The Hash Ring Solution")');
    await heading.scrollIntoViewIfNeeded();
    await page.waitForSelector('canvas, svg');
    await page.waitForTimeout(3000); // Wait for initial animation to settle
    const section = heading.locator('..').locator('..');
    await expect(section).toHaveScreenshot('consistent-hashing-sim.png');
  });

  test('Component: FAQ Accordion', async ({ page }) => {
    await page.goto('/fundamentals/load-balancers');
    const heading = page.locator('h2:has-text("Common Questions")');
    await heading.scrollIntoViewIfNeeded();
    const section = heading.locator('..');
    await expect(section).toHaveScreenshot('faq-accordion.png');
  });

});
