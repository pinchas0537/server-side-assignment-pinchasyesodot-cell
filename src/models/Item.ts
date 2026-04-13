import {model, Schema} from 'mongoose'
import { ISItem } from '../interfaces/Item';

const ItemSchema = new Schema<ISItem>({
    name: { type: String, required: true, unique: true, index: true },
    consumerPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true }
}, { timestamps: true });

export const Item = model<ISItem>("Item", ItemSchema);