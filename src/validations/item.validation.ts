import { z } from "zod";

export const itemValidationSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long"),
    consumerPrice: z.number().positive("Consumer price must be a positive number"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    category: z.string().trim().min(1, "Category is required"),
    supplierId: z
        .string()
        .trim()
        .min(1, "Supplier ID is required")
        .length(24, "Supplier ID must be a valid MongoDB ObjectId"),
});

export const createItemSchema = itemValidationSchema;

export const updateItemSchema = itemValidationSchema.partial();

export type IItemBase = z.infer<typeof itemValidationSchema>;