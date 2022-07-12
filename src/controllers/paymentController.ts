import { Request, Response } from "express";
import * as paymentService from "../services/paymentService.js";

export async function paymentInsertPOST(req: Request, res: Response) {
  
    const apiKey = req.headers['x-api-key'];
    const { cardId, password, businessId, amount } = req.body;

    const result = await paymentService.validatePayment(cardId, password, businessId, amount);
    if (!result.res) {
        res.status(401).send(result.text);
        return;
    }

    await paymentService.insertPayment(cardId, businessId, amount);

    res.sendStatus(200);
}