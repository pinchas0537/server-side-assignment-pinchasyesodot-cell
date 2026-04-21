import { Request, Response } from "express";
import { IOrderBase } from "../validations/order.validation.js";
import { deleteOrderById, getAllOrders, getOrderById, processNewOrder, updateOrderInDB } from "../services/orderS.js";
import { IOrder } from "../interfaces/Order.js";
import logger from "../utils/Logger.js";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderData: IOrderBase = req.body;
        const createdOrder = await processNewOrder(orderData as unknown as IOrder);
        res.status(201).json(createdOrder);
    } catch (error) {
        logger.error("Failed to create order", { error: (error as Error).message });
        res.status(400).json({ error: (error as Error).message });
    }
};

export const AllOrders = async (_req: Request, res: Response): Promise<void> => {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch (error) {
        logger.error("Failed to get all orders", { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id as string;
        const orders = await getOrderById(orderId);
        if (orders === null) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(orders);
    } catch (error) {
        logger.error(`Failed to get order with ID ${req.params.id}`, { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id as string;
        const orderData: IOrderBase = req.body;
        const updatedOrder = await updateOrderInDB(orderId, orderData as unknown as IOrder);
        if (updatedOrder === null) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(updatedOrder);
    } catch (error) {
        logger.error(`Failed to update order with ID ${req.params.id}`, { error: (error as Error).message });
        res.status(400).json({ error: (error as Error).message });
    }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id as string;
        const deletedOrder = await deleteOrderById(orderId);
        if (deletedOrder === null) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(deletedOrder);
    } catch (error) {
        logger.error(`Failed to delete order with ID ${req.params.id}`, { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
    }
};