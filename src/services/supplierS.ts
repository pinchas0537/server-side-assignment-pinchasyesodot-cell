import { ISupplier } from "../interfaces/Supplier";
import { Supplier } from "../models/Supplier";

export const getSupplierById = async (id: string): Promise<ISupplier | null> => {
    try {
        return await Supplier.findById(id);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch supplier: ${errorMessage}`);
    }
};