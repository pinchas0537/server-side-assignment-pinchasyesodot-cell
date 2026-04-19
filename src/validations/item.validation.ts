import { z } from "zod";

export const itemValidationSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long").optional(),
    consumerPrice: z.number().positive("Consumer price must be a positive number").optional(),
    stock: z.number().int().min(0, "Stock cannot be negative").optional(),
    category: z.string().trim().min(1, "Category is required").optional(),
    supplierId: z.string().trim().min(1, "Supplier ID is required").length(24, "Supplier ID must be a valid MongoDB ObjectId").optional(),
});

export type IItemBase = z.infer<typeof itemValidationSchema>;