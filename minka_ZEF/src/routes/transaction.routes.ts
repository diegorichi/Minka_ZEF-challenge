import { Router } from "express";
import { verifyToken } from "../middleware/zef.middleware";
import {
  getTransaction,
  postTransaction,
} from "../controllers/transactions.controller";

const router = Router();

router.get("/transactions/:id", verifyToken, getTransaction);
router.post("/transactions", verifyToken, postTransaction);

export default router;
