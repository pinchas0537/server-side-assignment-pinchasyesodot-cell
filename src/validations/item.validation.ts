import { z } from "zod";
import { paramsIdSchema, objectIdSchema } from "./common.validation.js";

const itemValidationSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long"),
    consumerPrice: z.number().positive("Consumer price must be a positive number"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    category: z.string().trim().min(1, "Category is required"),
    supplierId: objectIdSchema,
});

export const createItemSchema = z.object({
    body: itemValidationSchema
});

export const updateItemSchema = z.object({
    params: paramsIdSchema,
    body: itemValidationSchema.partial()
});

export const itemIdSchema = z.object({
    params: paramsIdSchema
});

export type IItemBase = z.infer<typeof itemValidationSchema>;