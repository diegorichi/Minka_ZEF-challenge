import { Router } from "express";
import { verifyToken } from "../middleware/zef.middleware";
import {
  deleteCurrency,
  getAllCurrencys,
  getCurrency,
  postCurrency,
  putCurrency,
} from "../controllers/currencies.controller";

const router = Router();

router.get("/currencies", verifyToken, getAllCurrencys);
router.get("/currencies/:id", verifyToken, getCurrency);
router.post("/currencies", verifyToken, postCurrency);
router.put("/currencies/:id", verifyToken, putCurrency);
router.delete("/currencies/:id", verifyToken, deleteCurrency);

export default router;
