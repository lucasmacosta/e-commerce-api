import { z } from "zod";

import { searchParamsSchema } from "./common";

export const fieldsSchema = z.enum([
  "id",
  "title",
  "description",
  "price",
  "updatedAt",
  "createdAt",
]);

export const getProductsSchema = searchParamsSchema.extend({
  fields: z.array(fieldsSchema).min(1).optional(),
  orderBy: fieldsSchema.optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(128).optional(),
  price: z.number().min(0),
});

export const updateProductSchema = createProductSchema.extend({
  title: createProductSchema.shape.title.optional(),
  price: createProductSchema.shape.price.optional(),
});

export const productParamsSchema = z.object({
  id: z.coerce.number(),
});

export type GetProductsDto = z.infer<typeof getProductsSchema>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductParamsDto = z.infer<typeof productParamsSchema>;
