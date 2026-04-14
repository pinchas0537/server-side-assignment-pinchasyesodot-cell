import { Request, Response } from "express";
import { IOrderBase } from "../validations/order.validation";

export function createOrder(req: Request, res: Response) {
    
    const orderData: IOrderBase = req.body;
   
}
