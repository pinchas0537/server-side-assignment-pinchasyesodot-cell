import { Schema } from "mongoose";

export interface ISItem {
    _id?: Schema.Types.ObjectId,
    name: string,
    consumerPrice: number,
    stock: number,
    category: string,
    supplierId: Schema.Types.ObjectId
}