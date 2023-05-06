import { Request, Response } from "express";
import { Project } from "../models/project.entity";
import { FindOneOptions } from "typeorm";
import { Logger } from "../utils/logger";
import { verifyToken } from "../middleware/zef.middleware";
import { body, param, validationResult } from "express-validator";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
} from "inversify-express-utils";
import { inject } from "inversify";
import { ProjectService } from "../services/project.service";

@controller("/projects", verifyToken)
export class ProjectController {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(ProjectService) private projectService: ProjectService
  ) {}

  @httpPost("",
    body("name").notEmpty(),
    body("currency").isInt(),
    body("currency").notEmpty()
  )
  public async createProject(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, owner, currency, description } = req.body;

      const userId = req.user ? req.user.id : undefined;

      const newProject = await this.projectService.createProject(
        name,
        userId,
        currency,
        description
      );

      if (!newProject) {
        return res.status(400).json();
      }
      return res.status(200).send(newProject);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).json(err.message);
    }
  }

  @httpGet("")
  public async getAllProjects(req: Request, res: Response): Promise<Response> {
    try {
      const projects = await this.projectService.getProjects();
      return res.status(200).json(projects);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpGet("/:id", param("id").isInt({ min: 1 }))
  public async getProject(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;
      const project = await this.projectService.getProject(id);
      if (!project) {
        return res.status(404).send("Project not found");
      } else {
        return res.status(200).json(project);
      }
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpDelete("/:id", param("id").isInt({ min: 1 }))
  public async deleteProject(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;

      await this.projectService.deleteProject(id);
      return res.status(200).send("Project deleted successfully");
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }

  @httpPut("/:id", param("id").isInt({ min: 1 }))
  public async putProject(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params;
      const { owner, currency, transations } = req.body;
      const updatedProject = this.projectService.updateProject(
        parseInt(id),
        owner,
        currency,
        transations
      );
      return res.status(200).json(updatedProject);
    } catch (err) {
      this.logger.error(err);
      return res.status(500).send("Internal server error");
    }
  }
}
