import { Router } from "express";
import { createItem, getItemById, getItems, updateItem } from "../controllers/itemC";
import { validateRequest } from "../middleware/validate";
import { itemValidationSchema } from "../validations/item.validation";
import { validateItemId } from "../middleware/itemM";
import { supplierExists } from "../middleware/supplierM";

const router = Router();

router.post("/", validateRequest(itemValidationSchema),supplierExists, createItem);

router.get("/", getItems);

router.get("/:id", validateItemId, getItemById);

router.put("/:id", validateRequest(itemValidationSchema), validateItemId, updateItem);

export default router;
