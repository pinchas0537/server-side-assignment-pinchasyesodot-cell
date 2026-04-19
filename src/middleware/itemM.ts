import { Request, Response, NextFunction } from "express";
import { Supplier } from "../models/Supplier.js";
import { isValidObjectId } from "mongoose";

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
        
        next(); 
    } catch (error) {
        res.status(500).json({ error: "Database error while verifying supplier" });
    }
};