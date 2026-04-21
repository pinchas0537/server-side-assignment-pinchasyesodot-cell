import { Request, Response, NextFunction } from "express";
import { Supplier } from "../models/Supplier.js";
import { isValidObjectId } from "mongoose";
import { Item } from "../models/Item.js";

export const verifySupplierExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { supplierId } = req.body;

        if (!isValidObjectId(supplierId)) {
            return res.status(400).json({ error: "Invalid Supplier ID format" });
        }

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        return next();
    } catch (error) {
        res.status(500).json({ error: "Database error while verifying supplier" });
    }
};

export const validateItemId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid Item ID format" });
        }
        const item = await Item.findById(id).populate("supplierId");
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.locals.item = item;
        return next();
    } catch (error) {
        res.status(500).json({ error: "Server error during item verification" });
    }
};