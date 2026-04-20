import { UpdateQuery } from "mongoose";
import { ISupplier } from "../interfaces/Supplier";
import { Supplier } from "../models/Supplier";

export const createNewSupplier = async (supplierData: Partial<ISupplier>): Promise<ISupplier> => {
    try {
        const newSupplier = new Supplier(supplierData);
        return await newSupplier.save();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to create new supplier: ${errorMessage}`);
    }
};

export const getAllSuppliers = async (): Promise<ISupplier[]> => {
    try {
        return await Supplier.find().select("-__v").lean();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch suppliers: ${errorMessage}`);
    }
};

export const getSupplierById = async (id: string): Promise<ISupplier | null> => {
    try {
        return await Supplier.findById(id).select("-__v").lean();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch supplier: ${errorMessage}`);
    }
};

export const getSupplierByName = async (name: string): Promise<ISupplier | null> => {
    try {
        return await Supplier.findOne({ name }).select("-__v").lean();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to fetch supplier: ${errorMessage}`);
    }
};

export const updateSupplierInDB = async (id: string, updateData: Partial<ISupplier>): Promise<ISupplier | null> => {
    try {
        const { items, ...supplierData } = updateData;
        const finalUpdateData: UpdateQuery<ISupplier> = {};
        if (Object.keys(supplierData).length > 0) {
            finalUpdateData.$set = supplierData;
        }
        if (items && items.length > 0) {
            finalUpdateData.$push = { items:{ $each: items } };
        }
        return await Supplier.findByIdAndUpdate(id, finalUpdateData, { new: true, runValidators: true })
            .select("-__v")
            .lean();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to update supplier: ${errorMessage}`);
    }
};

export const deleteSupplierById = async (id: string): Promise<ISupplier | null> => {
    try {
        return await Supplier.findByIdAndDelete(id).select("-__v").lean();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        throw new Error(`Failed to delete supplier: ${errorMessage}`);
    }
};
