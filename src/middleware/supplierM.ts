import { Request, Response, NextFunction } from "express";
import { getSupplierById } from "../services/supplierS.js";

export async function supplierExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const supplierId = req.body.supplierId || req.params.supplierId;
        if (!supplierId) {
            res.status(400).json({ error: "Supplier ID is required" });
            return;
        }
        const supplier = await getSupplierById(supplierId);
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