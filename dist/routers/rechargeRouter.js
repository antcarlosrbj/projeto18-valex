import { Router } from "express";
import { rechargeInsertPOST } from "./../controllers/rechargeController.js";
var rechargeRouter = Router();
rechargeRouter.post("/recharge/insert", rechargeInsertPOST);
export default rechargeRouter;
