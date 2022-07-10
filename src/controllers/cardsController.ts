import { Request, Response } from "express";
import * as cardsService from "../services/cardsService.js";

export async function cardsCreatePOST(req: Request, res: Response) {
  const answer = await cardsService.find();
  res.send(answer);
}