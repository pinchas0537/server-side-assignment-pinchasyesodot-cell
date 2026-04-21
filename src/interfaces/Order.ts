import { Schema } from "mongoose";
import { IOrderBase } from "../validations/order.validation";
interface IOrderItem {
    itemId: Schema.Types.ObjectId,
    quantity: number
}
export interface IOrder extends Omit<IOrderBase, 'items'> {
    _id?: Schema.Types.ObjectId,
    items: IOrderItem[],
    orderDate?: Date,
}