import { describe, it, expect } from "vitest";

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN") + " ₫";
}

describe("formatPrice", () => {
  it("formats number to VND", () => {
    expect(formatPrice(1000000)).toBe("1.000.000 ₫");
  });
});
it("formats large number correctly", () => {
  expect(formatPrice(123456789)).toBe("123.456.789 ₫");
});

it("formats negative number correctly", () => {
  expect(formatPrice(-5000)).toBe("-5.000 ₫");
});

it("formats decimal by keeping locale behavior", () => {
  expect(formatPrice(1000.5)).toBe("1.000,5 ₫");
})