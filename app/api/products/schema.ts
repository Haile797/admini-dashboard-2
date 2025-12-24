import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  status: z.enum(["ACTIVE", "DRAFT"]).optional(),
  categoryId: z.string().cuid(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});
