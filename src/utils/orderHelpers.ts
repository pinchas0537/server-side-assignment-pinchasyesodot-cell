import { QueryFilter, Schema } from "mongoose";
import { ISItem } from "../interfaces/Item.js";
import { IOrder } from "../interfaces/Order.js";
import { ISupplier } from "../interfaces/Supplier.js";
import { Item } from "../models/Item.js";

type IOrderItemInput = IOrder["items"][number];

export const calculateOrderProfoit = (itemsFromDB: ISItem[], orderItems: IOrderItemInput[]): number => {
    try {
        let total = 0;
        for (const orderItem of orderItems) {
            const item = itemsFromDB.find((dbItem) => dbItem._id!.toString() === orderItem.itemId.toString());
            if (item) {
                const supplier = item.supplierId as unknown as ISupplier;
                const supplierItem = supplier.items.find((supplierItem) => supplierItem.itemName === item.name);
                if (!supplierItem) {
                    throw new Error(`Item ${item.name} not found in supplier ${supplier.name} catalog`);
                }
                const profitPerUnit = item.consumerPrice - supplierItem.price;
                total += profitPerUnit * orderItem.quantity;
            } else {
                throw new Error(`Calculation failed: Item with ID ${orderItem.itemId} not found in database.`);
            }
        }
        return total;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch calculate Order Profoit : ${errorMessage}`);
    }
};

export const validateStock = (itemsFromDB: ISItem[], orderItems: IOrderItemInput[]): void => {
    try {
        for (const orderItem of orderItems) {
            const item = itemsFromDB.find((dbItem) => dbItem._id!.toString() === orderItem.itemId.toString());
            if (!item) {
                throw new Error(`Item with ID ${orderItem.itemId} not found`);
            }
            if (item.stock < orderItem.quantity) {
                throw new Error(`Not enough stock for ${item.name}. Available: ${item.stock}`);
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch validate Stock: ${errorMessage}`);
    }
};

export const updateItemStock = async (itemId: string, quantityChange: number): Promise<void> => {
    try {
        if (quantityChange === 0) return;
        const updateQuery: QueryFilter<ISItem> = {
            _id: itemId as unknown as Schema.Types.ObjectId,
            ...(quantityChange > 0 ? { stock: { $gte: quantityChange } } : {}),
        };
        const updateItem = await Item.findOneAndUpdate(
            updateQuery,
            { $inc: { stock: -quantityChange } },
            { new: true }
        );
        if (!updateItem) {
            throw new Error(`Not enough stock for item ${itemId}`);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update item stock: ${errorMessage}`);
    }
};

export const getValidatedProfit = async (orderItems: IOrder["items"]): Promise<number> => {
    try {
        const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
        if (totalQuantity > 50) throw new Error("Total quantity of items in an order cannot exceed 50");
        if (orderItems.length > 10) throw new Error("An order cannot contain more than 10 different items");
        const itemIds = orderItems.map((item) => item.itemId);
        const dbItems: ISItem[] = await Item.find({ _id: { $in: itemIds } })
            .populate("supplierId")
            .select("-__v")
            .lean();
        validateStock(dbItems, orderItems);
        const totalProfit = calculateOrderProfoit(dbItems, orderItems);
        return totalProfit;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update order profit: ${errorMessage}`);
    }
};
