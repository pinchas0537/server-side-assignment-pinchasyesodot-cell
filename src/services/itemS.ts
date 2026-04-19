import { Item } from "../models/Item.js";
import { IItemBase } from "../validations/item.validation.js";
import { ISItem } from "../interfaces/Item.js";
import { ISupplier, ISupplierItem } from "../interfaces/Supplier.js";

export async function createNewItem(itemData: IItemBase): Promise<ISItem> {
    try {
        const newItem = new Item(itemData as unknown as ISItem);
        return await newItem.save();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to create new item: ${errorMessage}`);
    }
}

export const getAllItems = async (): Promise<ISItem[]> => {
    try {
        return await Item.find().populate("supplierId");
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch items: ${errorMessage}`);
    }
};

export const getItemById = async (itemId: string): Promise<ISItem | null> => {
    try {
        return await Item.findById(itemId).populate("supplierId");
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch item: ${errorMessage}`);
    }
};

export const verifyProfitMargin = (item: { name: string; supplierId: ISupplier }, newPrice: number): void => {
    const supplier = item.supplierId;
    const supplierItem = supplier.items.find((si: ISupplierItem) => si.itemName === item.name);
    if (!supplierItem) {
        throw new Error(`Item ${item.name} not found in supplier's catalog`);
    }
    const minPrice = supplierItem.price * 1.3;
    if (newPrice < minPrice) {
        throw new Error(
            `Price too low. According to store rules, price must be at least 30% above supplier price (${minPrice.toFixed(2)})`
        );
    }
};

export const updateItemInDB = async (id: string, updateData: Partial<IItemBase>): Promise<ISItem | null> => {
    try {
        return await Item.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update item: ${errorMessage}`);
    }
};
