import { Request, Response } from "express";
import * as cardsService from "../services/cardsService.js";

export async function cardsCreatePOST(req: Request, res: Response) {
  
  const apiKey = req.headers['x-api-key'];
  const { employeeId, cardType } = req.body;
  
  const result = await cardsService.validateCreation(apiKey, employeeId, cardType);
  if (!result.res) {
    res.status(404).send(result.text);
    return;
  }

  await cardsService.createCard(employeeId, cardType)

  res.sendStatus(200);
}