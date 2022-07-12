import { Router } from "express";
import { cardsCreatePOST, cardsActivatePOST, cardsExtractPOST, cardsBlockPOST } from "./../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards/create", cardsCreatePOST);
cardsRouter.post("/cards/activate", cardsActivatePOST);
cardsRouter.post("/cards/extract", cardsExtractPOST);
cardsRouter.post("/cards/block", cardsBlockPOST);

export default cardsRouter;
