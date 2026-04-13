import { Document, Schema } from "mongoose";

export interface ISItem extends Document {
    name: string,
    consumerPrice: number,
    stock: number,
    category: string,
    supplierId: Schema.Types.ObjectId
}