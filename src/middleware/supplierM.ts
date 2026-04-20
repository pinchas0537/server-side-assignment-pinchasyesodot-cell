import { Request, Response, NextFunction } from "express";
import { getSupplierById, getSupplierByName } from "../services/supplierS.js";

export const isNsameUnique = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name } = req.body;
        if (!name) {
            return next();
        }
        const existingSupplier = await getSupplierByName(name);
        if (existingSupplier) {
            res.status(409).json({ error: "Supplier name must be unique" });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Server error during name validation" });
    }
};

export async function supplierExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = req.params.id || req.body.id || req.body.supplierId;
        if (!id) {
            res.status(400).json({ error: "Supplier ID is required" });
            return;
        }
        const supplier = await getSupplierById(id);
        if (!supplier) {
            res.status(404).json({ error: "Supplier not found" });
            return;
        }
        res.locals.supplier = supplier;
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error during supplier validation" });
    }
}