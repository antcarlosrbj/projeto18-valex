import { Router } from "express";
import { paymentInsertPOST } from "./../controllers/paymentController.js";
var paymentRouter = Router();
paymentRouter.post("/payment/insert", paymentInsertPOST);
export default paymentRouter;
