import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mock schema giống trong project
const ProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  status: z.enum(["ACTIVE", "DRAFT"]).optional(),
  categoryId: z.string().cuid(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

describe("ProductSchema", () => {
  it("passes with valid product data", () => {
    const result = ProductSchema.safeParse({
      name: "iPhone 15",
      price: 20000000,
      categoryId: "ckx1234567890abcd1234",
      status: "ACTIVE",
    });

    expect(result.success).toBe(true);
  });

  it("fails if name is too short", () => {
    const result = ProductSchema.safeParse({
      name: "a",
      price: 100,
      categoryId: "ckx1234567890abcd1234",
    });

    expect(result.success).toBe(false);
  });

  it("fails if price is negative", () => {
    const result = ProductSchema.safeParse({
      name: "Product",
      price: -10,
      categoryId: "ckx1234567890abcd1234",
    });

    expect(result.success).toBe(false);
  });

  it("fails if categoryId is invalid", () => {
    const result = ProductSchema.safeParse({
      name: "Product",
      price: 100,
      categoryId: "invalid-id",
    });

    expect(result.success).toBe(false);
  });

  it("accepts empty imageUrl", () => {
    const result = ProductSchema.safeParse({
      name: "Product",
      price: 100,
      categoryId: "ckx1234567890abcd1234",
      imageUrl: "",
    });

    expect(result.success).toBe(true);
  });

  it("fails if imageUrl is invalid url", () => {
    const result = ProductSchema.safeParse({
      name: "Product",
      price: 100,
      categoryId: "ckx1234567890abcd1234",
      imageUrl: "not-a-url",
    });

    expect(result.success).toBe(false);
  });
});
