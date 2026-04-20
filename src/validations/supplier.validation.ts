import { z } from "zod";

export const supplierSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long").optional(),
    items: z
        .array(
            z.object({
                itemName: z.string().trim().min(2, "Item name must be at least 2 characters long"),
                price: z.number().positive("Price must be a positive number"),
            })
        )
        .optional()
        .default([]),
});

export type ISupplier = z.infer<typeof supplierSchema>;

export type ISupplierItem = z.infer<typeof supplierSchema>["items"][number];