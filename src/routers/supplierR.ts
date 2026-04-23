import { Router } from "express";
import {
    createSupplier,
    deleteSupplier,
    getSupplierById,
    getSuppliers,
    updateSupplier,
} from "../controllers/supplierC";
import { isNsameUnique, supplierExists } from "../middleware/supplierM";
import { validateRequest } from "../middleware/validate";
import { createSupplierSchema, supplierIdSchema,updateSupplierSchema } from "../validations/supplier.validation";

const router = Router();

router.post("/", validateRequest(createSupplierSchema), isNsameUnique, createSupplier);

router.get("/", getSuppliers);

router.get("/:id",validateRequest(supplierIdSchema), supplierExists, getSupplierById);

router.put("/:id",validateRequest(updateSupplierSchema), supplierExists, isNsameUnique, updateSupplier);

router.delete("/:id",validateRequest(supplierIdSchema), supplierExists, deleteSupplier);

export default router;