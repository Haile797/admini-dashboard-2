import { describe, it, expect } from "vitest";

// Mock util giống trong project
function calcOrderTotal(
  items: { price: number; quantity: number }[]
) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

describe("calcOrderTotal", () => {
  it("calculates total correctly", () => {
    const total = calcOrderTotal([
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ]);

    expect(total).toBe(250);
  });

  it("returns 0 for empty items", () => {
    expect(calcOrderTotal([])).toBe(0);
  });

  it("handles quantity greater than 1", () => {
    const total = calcOrderTotal([
      { price: 10, quantity: 5 },
    ]);

    expect(total).toBe(50);
  });

  it("handles multiple items correctly", () => {
    const total = calcOrderTotal([
      { price: 20, quantity: 2 },
      { price: 30, quantity: 3 },
    ]);

    expect(total).toBe(130);
  });
});
