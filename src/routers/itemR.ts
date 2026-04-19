import { Router } from "express";
import { createItem } from "../controllers/itemC";
import { validateRequest } from "../middleware/validate";
import { itemValidationSchema } from "../validations/item.validation";

const router = Router();

router.post("/",validateRequest(itemValidationSchema), createItem);

export default router;