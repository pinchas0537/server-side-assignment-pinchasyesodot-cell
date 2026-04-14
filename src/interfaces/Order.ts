import { Document, Schema } from "mongoose";
import { IOrderBase } from "../validations/order.validation";
interface IOrderItem {
    itemId: Schema.Types.ObjectId,
    quantity: number
}
export interface IOrder extends Omit<IOrderBase, 'items'>, Document {
    items: IOrderItem[],
    orderDate: Date,
}