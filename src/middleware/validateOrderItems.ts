import { Request, Response, NextFunction } from "express";
import { Item } from "../models/Item.js";
import { ISItem } from "../interfaces/Item.js";
import { Types } from "mongoose";

export const validateOrderItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: "No items provided" });
            return;
        }
        const itemIds = items.map((item: { itemId: string }) => {
            if (!Types.ObjectId.isValid(item.itemId)) {
                throw new Error(`Invalid ID format: ${item.itemId}`);
            }
            return new Types.ObjectId(item.itemId);
        });
        const query: Record<string, unknown> = { _id: { $in: itemIds } };
        const dbItems = (await Item.find(query).lean()) as ISItem[];
        if (dbItems.length !== itemIds.length) {
            res.status(400).json({ error: "One or more items not found" });
            return;
        }
        res.locals.dbItems = dbItems;
        return next();
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};