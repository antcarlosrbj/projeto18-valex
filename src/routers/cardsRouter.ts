import { Router } from "express";
import { cardsCreatePOST, cardsActivatePOST, cardsExtractPOST } from "./../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards/create", cardsCreatePOST);
cardsRouter.post("/cards/activate", cardsActivatePOST);
cardsRouter.post("/cards/extract", cardsExtractPOST);

export default cardsRouter;
