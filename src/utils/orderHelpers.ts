import { ISItem } from "../interfaces/Item.js";
import { IOrder } from "../interfaces/Order.js";
import {ISupplier} from "../interfaces/Supplier.js"

type IOrderItemInput = IOrder["items"][number];

export function calculateOrderProfoit(itemsFromDB: ISItem[], orderItems: IOrderItemInput[]): number {
    let total = 0;
    for (const orderItem of orderItems) {
        const item = itemsFromDB.find((dbItem) => dbItem._id!.toString() === orderItem.itemId.toString());
        if (item) {
            const supplier = item.supplierId as unknown as ISupplier;
            const supplierItem = supplier.items.find(supplierItem => supplierItem.itemName === item.name);
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
}

export function validateStock(itemsFromDB: ISItem[], orderItems: IOrderItemInput[]): void {
    for (const orderItem of orderItems) {
        const item = itemsFromDB.find((dbItem) => dbItem._id!.toString() === orderItem.itemId.toString());
        if (!item) {
            throw new Error(`Item with ID ${orderItem.itemId} not found`);
        }
        if (item.stock < orderItem.quantity) {
            throw new Error(`Not enough stock for ${item.name}. Available: ${item.stock}`);
        }
    }
}