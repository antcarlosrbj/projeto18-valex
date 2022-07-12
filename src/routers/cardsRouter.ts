import { Router } from "express";
import { cardsCreatePOST, cardsActivatePOST } from "./../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/cards/create", cardsCreatePOST);
cardsRouter.post("/cards/activate", cardsActivatePOST);


export default cardsRouter;
