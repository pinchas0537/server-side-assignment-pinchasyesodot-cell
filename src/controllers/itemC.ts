import { Request, Response } from "express";
import { createNewItem } from "../services/itemS.js";
import logger from "../utils/Logger.js";
import { IItemBase } from "../validations/item.validation.js";

export async function createItem(req: Request, res: Response): Promise<void> {
    try {
        const itemData: IItemBase = req.body;
        const newItem = await createNewItem(itemData);
        logger.info("Item created successfully", { itemId: newItem._id });
        res.status(201).json(newItem);
    } catch (error) {
        logger.error("Failed to create item", { error: (error as Error).message, body: req.body });
        res.status(400).json({ error: (error as Error).message });
    }
}