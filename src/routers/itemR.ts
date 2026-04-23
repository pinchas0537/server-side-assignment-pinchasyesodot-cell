import { Router } from "express";
import { createItem, deleteItem, getItemById, getItems, updateItem } from "../controllers/itemC";
import { validateRequest } from "../middleware/validate";
import { createItemSchema, updateItemSchema, itemIdSchema } from "../validations/item.validation";
import { checkItemExists } from "../middleware/itemM";
import { supplierExists } from "../middleware/supplierM";

const router = Router();

router.post("/", validateRequest(createItemSchema), supplierExists, createItem);

router.get("/", getItems);

router.get("/:id", validateRequest(itemIdSchema),checkItemExists, getItemById);

router.put("/:id", validateRequest(updateItemSchema), checkItemExists, updateItem);

router.delete("/:id", validateRequest(itemIdSchema), checkItemExists,deleteItem);

export default router;