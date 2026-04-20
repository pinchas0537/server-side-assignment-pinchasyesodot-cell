import { z } from "zod";

export const orderValidationSchema = z.object({
    address: z.string().min(1, "Address is required"),
    items: z.array(
        z.object({
            itemId: z.string().min(1, "Item ID is required").length(24, "Item ID must be a valid MongoDB ObjectId"),
            quantity: z.number().int().min(1, "Quantity must be at least 1"),
        })
    ).min(1, "Order must have at least one item")
    .max(10, "Order cannot have more than 10 items"),
    shopProfit: z.number().positive().optional(),
})
.refine((data) => {
    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity <= 50 
    }, { message: "Total quantity of items in the order cannot exceed 50" }
);

export type IOrderBase = z.infer<typeof orderValidationSchema>;