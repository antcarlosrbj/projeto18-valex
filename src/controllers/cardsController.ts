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

export async function cardsActivatePOST(req: Request, res: Response) {
  
  const { cardNumber, cardholderName, expirationDate, securityCode, password } = req.body;
  
  const result = await cardsService.validateActivation(cardNumber, cardholderName, expirationDate, securityCode, password);
  if (!result.res) {
    res.status(401).send(result.text);
    return;
  }

  await cardsService.savePassword(cardNumber, cardholderName, expirationDate, password);

  res.sendStatus(200);
}