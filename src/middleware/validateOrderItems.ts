import { Request, Response, NextFunction } from "express";
import { Item } from "../models/Item.js";
import { ISItem } from "../interfaces/Item.js";
import { Types } from "mongoose";

export const validateOrderItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { items } = req.body;
        const itemIds = items.map((item: { itemId: string }) => new Types.ObjectId(item.itemId));
        const dbItems = (await Item.find({ _id: { $in: itemIds } }).lean()) as ISItem[];
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