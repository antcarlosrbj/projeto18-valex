import { Router } from "express";
import { paymentInsertPOST } from "./../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.post("/payment/insert", paymentInsertPOST);

export default paymentRouter;
