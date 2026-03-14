import { test, expect } from '@playwright/test';

test.describe('Load Balancer Simulation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Load Balancers page
    await page.goto('/fundamentals/load-balancers');
    // Ensure the simulation is playing for logic tests
    const playBtn = page.locator('#sim-play-btn');
    const isPlaying = await playBtn.evaluate(el => el.querySelector('svg')?.classList.contains('lucide-square'));
    if (!isPlaying) {
      await playBtn.click();
    }
  });

  test('should allow switching load balancing algorithms', async ({ page }) => {
    const roundRobinBtn = page.locator('#algo-round-robin');
    const leastConnBtn = page.locator('#algo-least-conn');
    const ipHashBtn = page.locator('#algo-ip-hash');

    await expect(roundRobinBtn).toBeVisible();
    
    // Switch to Least Conn
    await leastConnBtn.click();
    await expect(leastConnBtn).toHaveClass(/text-primary/); // Active state
    
    // Switch to IP Hash
    await ipHashBtn.click();
    await expect(ipHashBtn).toHaveClass(/text-primary/); // Active state
  });

  test('should handle server failover when a server is toggled offline', async ({ page }) => {
    const serverPower0 = page.locator('#server-power-0');
    
    // Initially online
    await expect(page.locator('text=Web Server 1').first()).not.toContainText('[OFFLINE]');
    
    // Toggle Offline
    await serverPower0.click();
    
    // Optimistic UI should reflect offline state immediately
    await expect(page.locator('text=Web Server 1 [OFFLINE]').first()).toBeVisible();
    
    // Verify specific log message for health check after transition (period optional in regex)
    await expect(page.getByText(/LOG:.*Health Check: Server 1 is now marked as Down/i)).toBeVisible({ timeout: 5000 });
  });

  test('should drop requests if all servers are down', async ({ page }) => {
    // Kill all 3 servers
    await page.locator('#server-power-0').click();
    await page.locator('#server-power-1').click();
    await page.locator('#server-power-2').click();
    
    // Wait for logic to process and show critical log
    // Regex allows for "LOG:" prefix in a separate span and the period at the end
    await expect(page.getByText(/LOG:.*CRITICAL: All servers are DOWN/i)).toBeVisible({ timeout: 10000 });
  });
});
