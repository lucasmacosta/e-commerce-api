import { z } from "zod";

export const orderDirSchema = z.enum(["asc", "desc"]);

export const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  perPage: z.coerce.number().min(1).max(100).optional(),
  orderDir: orderDirSchema.optional(),
});
