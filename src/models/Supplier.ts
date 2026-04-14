import { Schema, model } from "mongoose";
import { ISupplier } from "../interfaces/Supplier";

const SupplierSchema = new Schema<ISupplier>({
    name: { type: String,
         required: true,
         unique: true,
         index: true 
        },
        items:[{
           itemName: { type: String, required: true },
           price: { type: Number, required: true ,min: 0 }
        }]
    },{timestamps: true});

export const Supplier = model<ISupplier>("Supplier", SupplierSchema);