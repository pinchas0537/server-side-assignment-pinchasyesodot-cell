import { z } from "zod";
import { paramsIdSchema, objectIdSchema } from "./common.validation.js";

const orderValidationSchema = z
    .object({
        address: z.string().min(1, "Address is required"),
        items: z
            .array(
                z.object({
                    itemId:objectIdSchema,
                    quantity: z.number().int().min(1, "Quantity must be at least 1"),
                })
            )
            .min(1, "Order must have at least one item")
            .max(10, "Order cannot have more than 10 items"),
        shopProfit: z.number().positive().optional(),
    })
    .refine(
        (data) => {
            const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
            return totalQuantity <= 50;
        },
        { message: "Total quantity of items in the order cannot exceed 50" }
    );


export const createOrderSchema = z.object({
    body: orderValidationSchema
});

export const updateOrderSchema = z.object({
    params: paramsIdSchema,
    body: orderValidationSchema.partial()
});

export const orderIdSchema = z.object({
    params: paramsIdSchema
});

export type IOrderBase = z.infer<typeof orderValidationSchema>;