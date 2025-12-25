import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mock Order schema giống logic project
const OrderItemSchema = z.object({
  productId: z.string().cuid(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

const OrderSchema = z.object({
  userId: z.string().cuid(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
  items: z.array(OrderItemSchema).min(1),
});

describe("OrderSchema", () => {
  it("passes with valid order data", () => {
    const result = OrderSchema.safeParse({
      userId: "ckx1234567890abcd1234",
      status: "PENDING",
      items: [
        {
          productId: "ckxabcdef1234567890abcd",
          price: 100,
          quantity: 2,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("fails if items array is empty", () => {
    const result = OrderSchema.safeParse({
      userId: "ckx1234567890abcd1234",
      status: "PENDING",
      items: [],
    });

    expect(result.success).toBe(false);
  });

  it("fails if quantity is zero", () => {
    const result = OrderSchema.safeParse({
      userId: "ckx1234567890abcd1234",
      status: "PENDING",
      items: [
        {
          productId: "ckxabcdef1234567890abcd",
          price: 100,
          quantity: 0,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("fails if price is negative", () => {
    const result = OrderSchema.safeParse({
      userId: "ckx1234567890abcd1234",
      status: "PENDING",
      items: [
        {
          productId: "ckxabcdef1234567890abcd",
          price: -10,
          quantity: 1,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("fails if status is invalid", () => {
    const result = OrderSchema.safeParse({
      userId: "ckx1234567890abcd1234",
      status: "DONE",
      items: [
        {
          productId: "ckxabcdef1234567890abcd",
          price: 100,
          quantity: 1,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("fails if productId is invalid", () => {
    const result = OrderSchema.safeParse({
      userId: "ckx1234567890abcd1234",
      status: "PAID",
      items: [
        {
          productId: "invalid-id",
          price: 100,
          quantity: 1,
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
