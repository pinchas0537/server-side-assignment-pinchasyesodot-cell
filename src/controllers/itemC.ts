import { Request, Response } from "express";
import { createNewItem, getAllItems, updateItemInDB, verifyProfitMargin } from "../services/itemS.js";
import logger from "../utils/Logger.js";
import { IItemBase } from "../validations/item.validation.js";
import { ISupplier } from "../interfaces/Supplier.js";
import { ISItem } from "../interfaces/Item.js";

export async function createItem(req: Request, res: Response): Promise<void> {
    try {
        const itemData: IItemBase = req.body;
        const supplier = res.locals.supplier as ISupplier;
        verifyProfitMargin({ name: itemData.name!, supplierId: supplier }, itemData.consumerPrice!);
        const newItem = await createNewItem(itemData);
        logger.info("Item created successfully", { itemId: newItem._id });
        res.status(201).json(newItem);
    } catch (error) {
        logger.error("Failed to create item", { error: (error as Error).message, body: req.body });
        res.status(400).json({ error: (error as Error).message });
    }
}

export const getItems = async (_req: Request, res: Response): Promise<void> => {
    try {
        const items = await getAllItems();
        res.status(200).json(items);
    } catch (error) {
        logger.error("Failed to fetch items", { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getItemById = (_req: Request, res: Response): void => {
    try {
        const item = res.locals.item;
        res.status(200).json(item);
    } catch (error) {
        logger.error("Failed to fetch item", { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
    }
};


export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params as { id: string };
        const itemData: Partial<IItemBase> = req.body;
        const currentItem = res.locals.item as ISItem & {supplierId:ISupplier};
        if(itemData.consumerPrice !== undefined){
          verifyProfitMargin(currentItem,itemData.consumerPrice)
        }
        const updatedItem = await updateItemInDB(id,itemData);
        if(!updatedItem){
            res.status(404).json({ error: "Item not found" });
            return;
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        logger.error("Failed to update item", { error: (error as Error).message, body: req.body });
        res.status(400).json({ error: (error as Error).message });
    }
};
