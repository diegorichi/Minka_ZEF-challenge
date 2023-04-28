import { Router } from "express";
import { verifyToken } from "../middleware/zef.middleware";
import { login, logout } from "../controllers/login.controller";

const router = Router();

router.post("/login", login);
router.get("/logout",verifyToken, logout);

export default router;
