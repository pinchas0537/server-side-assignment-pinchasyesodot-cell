import { Router } from "express";
import { AllOrders, createOrder, deleteOrder, getById, updateOrder } from "../controllers/orderC.js";
import { validateOrderItems } from "../middleware/validateOrderItems.js";
import { validateRequest } from "../middleware/validate.js";
import { orderValidationSchema } from "../validations/order.validation.js";

const router = Router();

router.post("/", validateRequest(orderValidationSchema), validateOrderItems, createOrder);

router.get("/", AllOrders);

router.get("/:id", getById);

router.put("/:id", validateRequest(orderValidationSchema), validateOrderItems, updateOrder);

router.delete("/:id", deleteOrder);

export default router;