import { Item } from "../models/Item";
import { OrderModel } from "../models/Order";
import { PipelineStage } from "mongoose";

interface RevenueResult {
    totalRevenue: number;
}

interface CategoryProfitResult {
    _id: string;
    totalProfit: number;
}

interface ItemProfitResult {
    _id: string;
    name: string;
    totalProfit: number;
}

interface ItemMarginResult {
    name: string;
    margin: number;
}

interface SupplierProfitResult {
    _id: string;
    totalProfit: number;
}

export const getMonthlyRevenue = async (): Promise<number> => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const result = await OrderModel.aggregate<RevenueResult>([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
        ]);
        return result.length > 0 ? result[0].totalRevenue : 0;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to calculate monthly revenue: ${errorMessage}`);
    }
};

export const getWeeklyTopCategory = async (): Promise<CategoryProfitResult | null> => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const result = await OrderModel.aggregate<CategoryProfitResult>([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $unwind: "$items",
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "itemDetails",
                },
            },
            { $unwind: "$itemDetails" },
            {
                $group: {
                    _id: "$itemDetails.category",
                    totalProfit: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                { $subtract: ["$itemDetails.price", "$itemDetails.supplierPrice"] },
                            ],
                        },
                    },
                },
            },
            {
                $sort: { totalProfit: -1 },
            },
            {
                $limit: 1,
            },
        ]);
        return result.length > 0 ? result[0] : null;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to calculate weekly profitable category: ${errorMessage}`);
    }
};

export const getDailyTopItem = async (): Promise<ItemProfitResult | null> => {
    try {
        const twentyFoutHoursAgo = new Date();
        twentyFoutHoursAgo.setHours(twentyFoutHoursAgo.getHours() - 24);
        const result = await OrderModel.aggregate<ItemProfitResult>([
            {
                $match: {
                    createdAt: { $gte: twentyFoutHoursAgo },
                },
            },
            {
                $unwind: "$items",
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "itemDetails",
                },
            },
            { $unwind: "$itemDetails" },
            {
                $group: {
                    _id: "$itemDetails._id",
                    name: { $first: "$itemDetails.name" },
                    totalProfit: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                { $subtract: ["$itemDetails.price", "$itemDetails.supplierPrice"] },
                            ],
                        },
                    },
                },
            },
            { $sort: { totalProfit: -1 } },
            { $limit: 1 },
        ]);
        return result.length > 0 ? result[0] : null;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to calculate daily top item: ${errorMessage}`);
    }
};

export const getItemMargins = async (): Promise<{
    highest: ItemMarginResult | null;
    lowest: ItemMarginResult | null;
}> => {
    try {
        const pipeline: PipelineStage[] = [
            {
                $project: {
                    name: 1,
                    margin: {
                        $subtract: ["$price", "$supplierPrice"],
                    },
                },
            },
            {
                $sort: { margin: -1 },
            },
        ];
        const result = await Item.aggregate<ItemMarginResult>(pipeline);
        return {
            highest: result.length > 0 ? result[0] : null,
            lowest: result.length > 1 ? result[1] : null,
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to calculate item margins: ${errorMessage}`);
    }
};

export const getMostProfitableSupplier = async (): Promise<SupplierProfitResult | null> => {
    try {
        const result = await OrderModel.aggregate<SupplierProfitResult>([
            {
                $unwind: "$items",
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items.itemId",
                    foreignField: "_id",
                    as: "itemDetails",
                },
            },
            { $unwind: "$itemDetails" },
            {
                $group: {
                    _id: "$itemDetails.supplierName",
                    totalProfit: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                { $subtract: ["$itemDetails.price", "$itemDetails.supplierPrice"] },
                            ],
                        },
                    },
                },
            },
            { $sort: { totalProfit: -1 } },
            { $limit: 1 },
        ]);
        return result.length > 0 ? result[0] : null;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to calculate top supplier: ${errorMessage}`);
    }
};