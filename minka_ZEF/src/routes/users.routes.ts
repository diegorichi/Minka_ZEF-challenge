import { Router } from "express";
import { login, retrieveUser, createUser, retrieveAllUsers } from "../controllers/users.controller";

const router = Router();

router.post("/users", createUser);
router.get("/users/:id", retrieveUser);
router.get("/users", retrieveAllUsers);
router.post("/login", login);

export default router;
