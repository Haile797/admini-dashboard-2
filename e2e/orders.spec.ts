import { test, expect } from "@playwright/test";

test("admin can view order detail (order management flow)", async ({ page }) => {
  // Login
  await page.goto("/auth/login");
  await page.fill('input[type="email"]', "admin@example.com");
  await page.fill('input[type="password"]', "123456");
  await page.click('button[type="submit"]');

  // Go to orders list
  await page.goto("/admin/orders");

  /**
   * ✅ CLICK ĐÚNG FLOW THỰC TẾ:
   * Click nút "Xem", KHÔNG click row
   */
  await page.getByRole("link", { name: "Xem" }).first().click();

  // Chỉ cần chứng minh đã vào detail page
  await expect(page).toHaveURL(/\/admin\/orders\/.+/);
});
