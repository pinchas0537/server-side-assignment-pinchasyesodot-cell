import { Router } from "express";
import { createOrder } from "../controllers/orderC";

const router = Router();

router.post("/orders", createOrder);

export default router;