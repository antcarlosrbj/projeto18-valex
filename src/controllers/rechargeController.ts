import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function rechargeInsertPOST(req: Request, res: Response) {
  
    const apiKey = req.headers['x-api-key'];
    const { cardId, amount } = req.body;

    const result = await rechargeService.validateRecharge(apiKey, cardId, amount);
    if (!result.res) {
        res.status(401).send(result.text);
        return;
    }

    await rechargeService.insertRecharge(cardId, amount);

    res.sendStatus(200);
}