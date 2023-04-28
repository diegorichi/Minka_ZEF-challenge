import { Router } from "express";
import { retrieveUser, createUser, retrieveAllUsers } from "../controllers/users.controller";
import { verifyToken } from "../middleware/zef.middleware";

const router = Router();

router.post("/users", createUser);
router.get("/users/:id",verifyToken, retrieveUser);
router.get("/users",verifyToken, retrieveAllUsers);

export default router;
