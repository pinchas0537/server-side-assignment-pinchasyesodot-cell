import { Request, Response } from "express";
import {createNewSupplier, deleteSupplierById, getAllSuppliers, updateSupplierInDB} from "../services/supplierS.js";
import logger from "../utils/Logger.js";

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const supplierData = req.body;
        const newSupplier = await createNewSupplier(supplierData);
        res.status(201).json(newSupplier);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        logger.error("Failed to create supplier", { error: errorMessage });
        res.status(500).json({ error: errorMessage });
    }
};

export const getSuppliers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const suppliers = await getAllSuppliers();
        res.status(200).json(suppliers);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        logger.error("Failed to fetch suppliers", { error: errorMessage });
        res.status(500).json({ error: errorMessage });
    }
};

export const getSupplierById = async (_req: Request, res: Response): Promise<void> => {
    try {
        const supplier = res.locals.supplier;
        res.status(200).json(supplier);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        logger.error("Failed to fetch supplier", { error: errorMessage });
        res.status(500).json({ error: errorMessage });
        }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const updateData = req.body;
        const updatedSupplier = await updateSupplierInDB(id, updateData);
        res.status(200).json(updatedSupplier);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        logger.error("Failed to update supplier", { error: errorMessage, body: req.body });
        res.status(500).json({ error: errorMessage });
    }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const deletedSupplier = await deleteSupplierById(id);
        res.status(200).json({deletedSupplier, message: "Supplier deleted successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        logger.error("Failed to delete supplier", { error: errorMessage });
        res.status(500).json({ error: errorMessage });      
    }
};