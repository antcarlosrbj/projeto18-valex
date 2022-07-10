import { Router } from "express";
import { cardsCreatePOST } from "./../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.get("/cards/create", cardsCreatePOST);

export default cardsRouter;
