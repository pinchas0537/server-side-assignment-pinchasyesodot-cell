import { Document } from "mongoose";

export interface ISupplierItem {
    itemName: string;
    price: number;
}

export interface ISupplier extends Document {
    name: string;
    items: ISupplierItem[];
}