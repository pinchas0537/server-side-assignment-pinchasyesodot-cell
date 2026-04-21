import { IOrder } from "../interfaces/Order.js";
import { OrderModel } from "../models/Order.js";
import { getValidatedProfit, updateItemStock } from "../utils/orderHelpers.js";

export const processNewOrder = async (orderData: IOrder): Promise<IOrder> => {
    try {
        const totalProfit = await getValidatedProfit(orderData.items);
        const finalOrder = new OrderModel({
            ...orderData,
            shopProfit: totalProfit,
        });
        const savedOrder = await finalOrder.save();
        for (const orderItem of orderData.items) {
            await updateItemStock(orderItem.itemId.toString(), orderItem.quantity);
        }
        return savedOrder;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch order: ${errorMessage}`);
    }
};

export const getAllOrders = async (): Promise<IOrder[]> => {
    try {
        const orders = await OrderModel.find().select("-__v").lean();
        return orders;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch order: ${errorMessage}`);
    }
};

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
    try {
        const order = await OrderModel.findById(orderId).select("-__v").lean();
        if (!order) {
            return null;
        }
        return order;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch order: ${errorMessage}`);
    }
};

export const updateOrderInDB = async (orderId: string, orderData: IOrder): Promise<IOrder | null> => {
    try {
        const existingOrder = await OrderModel.findById(orderId).lean();
        if (!existingOrder) throw new Error(`Order with ID ${orderId} not found`);
        for (const newItem of orderData.items) {
            const oldItem = existingOrder.items.find((item) => item.itemId.toString() === newItem.itemId.toString());
            const quantityDiff = oldItem ? newItem.quantity - oldItem.quantity : newItem.quantity;
            if (quantityDiff !== 0) {
                await updateItemStock(newItem.itemId.toString(), quantityDiff);
            }
        }
        for (const oldItem of existingOrder.items) {
            const stillExists = orderData.items.find(
                (newItem) => newItem.itemId.toString() === oldItem.itemId.toString()
            );
            if (!stillExists) {
                await updateItemStock(oldItem.itemId.toString(), -oldItem.quantity);
            }
        }
        const totalProfit = await getValidatedProfit(orderData.items);
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { ...orderData, shopProfit: totalProfit },
            { new: true, runValidators: true }
        )
            .select("-__v")
            .lean();
        return updatedOrder;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch order: ${errorMessage}`);
    }
};

export const deleteOrderById = async (orderId: string): Promise<IOrder | null> => {
    try {
        const deletedOrder = await OrderModel.findByIdAndDelete(orderId).lean();
        return deletedOrder;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch order: ${errorMessage}`);
    }
};
