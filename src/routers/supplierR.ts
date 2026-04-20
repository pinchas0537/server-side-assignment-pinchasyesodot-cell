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
import { supplierSchema } from "../validations/supplier.validation";

const router = Router();

router.post("/", validateRequest(supplierSchema), isNsameUnique, createSupplier);

router.get("/", getSuppliers);

router.get("/:id", supplierExists, getSupplierById);

router.put("/:id", supplierExists, validateRequest(supplierSchema.partial()), isNsameUnique, updateSupplier);

router.delete("/:id", supplierExists, deleteSupplier);

export default router;