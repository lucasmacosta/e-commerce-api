import { z } from "zod";

export const fieldsSchema = z.enum([
  "id",
  "quantity",
  "productId",
  "text",
  "unitPrice",
  "total",
  "updatedAt",
  "createdAt",
]);
