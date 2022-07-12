import { Router } from "express";
import { cardsCreatePOST, cardsActivatePOST, cardsExtractPOST, cardsBlockPOST, cardsUnblockPOST } from "./../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards/create", cardsCreatePOST);
cardsRouter.post("/cards/activate", cardsActivatePOST);
cardsRouter.post("/cards/extract", cardsExtractPOST);
cardsRouter.post("/cards/block", cardsBlockPOST);
cardsRouter.post("/cards/unblock", cardsUnblockPOST);

export default cardsRouter;
