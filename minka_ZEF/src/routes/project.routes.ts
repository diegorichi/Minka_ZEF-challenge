import { Router } from "express";
import { verifyToken } from "../middleware/zef.middleware";
import { login, logout } from "../controllers/login.controller";
import {
  deleteProject,
  getAllProjects,
  getProject,
  postProject,
  putProject,
} from "../controllers/projects.controller";

const router = Router();

router.get("/projects", verifyToken, getAllProjects);
router.get("/projects/:id", verifyToken, getProject);
router.post("/projects", verifyToken, postProject);
router.put("/projects/:id", verifyToken, putProject);
router.delete("/projects/:id", verifyToken, deleteProject);

export default router;
