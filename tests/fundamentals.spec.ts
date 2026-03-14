import { test, expect } from '@playwright/test';

test.describe('Phase 2: Fundamentals Topics', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate between fundamentals topics and update content correctly', async ({ page }) => {
    // 1. Go to Latency vs Throughput
    await page.click('text=Latency vs Throughput');
    await expect(page).toHaveURL(/\/fundamentals\/latency-throughput/);
    await expect(page.locator('main h1')).toHaveText('Latency Throughput');
    await expect(page.getByRole('heading', { name: "Little's Law" })).toBeVisible();

    // 2. Go to CAP Theorem
    await page.click('text=CAP Theorem');
    await expect(page).toHaveURL(/\/fundamentals\/cap-theorem/);
    await expect(page.locator('main h1')).toHaveText('Cap Theorem');
    await expect(page.getByText('Interactive Triangle')).toBeVisible();

    // 3. Go to Consistency Models
    await page.click('text=Consistency Models');
    await expect(page).toHaveURL(/\/fundamentals\/consistency-models/);
    await expect(page.locator('main h1')).toHaveText('Consistency Models');
    await expect(page.getByText('Eventual Consistency', { exact: false }).first()).toBeVisible();
  });

  test('Latency simulation sliders should update stats', async ({ page }) => {
    await page.goto('/fundamentals/latency-throughput');
    
    // Check initial state (default is 2.0s latency)
    const latencyDisplay = page.locator('span.text-2xl.font-mono.text-blue-400');
    await expect(latencyDisplay).toHaveText('2.0s');

    // Interact with Latency slider (input[type="range"] at index 0)
    const latencySlider = page.locator('input[type="range"]').first();
    await latencySlider.fill('4000');
    await expect(latencyDisplay).toHaveText('4.0s');

    // Interact with Throughput slider (input[type="range"] at index 1)
    const throughputSlider = page.locator('input[type="range"]').nth(1);
    await throughputSlider.fill('10');
    await expect(page.locator('span.text-2xl.font-mono.text-purple-400')).toHaveText('10 req/s');
  });

  test('CAP Theorem triangle should update info panel', async ({ page }) => {
    await page.goto('/fundamentals/cap-theorem');
    
    // Initial state should show "Pick a Strategy"
    await expect(page.locator('text=Pick a Strategy')).toBeVisible();

    // Click on CP edge using data-testid
    await page.getByTestId('cap-cp-path').click({ force: true });
    
    // Verify CP Info Panel
    await expect(page.locator('text=CP Strategy')).toBeVisible();
    await expect(page.locator('text=Common Examples')).toBeVisible();
  });

  test('Consistency Models should log stale reads in eventual mode', async ({ page }) => {
    await page.goto('/fundamentals/consistency-models');
    
    // Switch to Eventual Consistency
    await page.click('button:has-text("Eventual Consistency")');

    // Perform a Write
    await page.click('button:has-text("Write Value")');
    
    // Immediately perform a Read on Follower (within the 2s delay window)
    await page.click('button:has-text("Read Follower")');

    // Verify Log shows (STALE)
    await expect(page.locator('text=(STALE)')).toBeVisible();
  });

});
