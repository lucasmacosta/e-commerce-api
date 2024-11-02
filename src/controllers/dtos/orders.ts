import { z } from "zod";

import { searchParamsSchema } from "./common";
import { fieldsSchema as lineItemFieldsSchema } from "./line-items";
import { fieldsSchema as productFieldsSchema } from "./products";

const fieldsSchema = z.enum([
  "id",
  "total",
  "shippingFee",
  "updatedAt",
  "createdAt",
]);

export const getOrdersSchema = searchParamsSchema.extend({
  fields: z.array(fieldsSchema).min(1).optional(),
  lineItemFields: z.array(lineItemFieldsSchema).min(1).optional(),
  productFields: z.array(productFieldsSchema).min(1).optional(),
  orderBy: fieldsSchema.optional(),
});

export const createOrderSchema = z.object({
  lineItems: z
    .array(
      z.object({
        quantity: z.number().min(1),
        productId: z.number(),
      })
    )
    .min(1),
});

export type GetOrdersDto = z.infer<typeof getOrdersSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
