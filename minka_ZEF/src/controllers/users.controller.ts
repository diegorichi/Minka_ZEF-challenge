import { Request, Response } from "express";
import { inject } from "inversify";
import { UserService } from "../services/user.service";
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
  requestParam,
} from "inversify-express-utils";
import { verifyToken } from "../middleware/zef.middleware";
import { body, validationResult } from "express-validator";

@controller("/users")
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  @httpGet("", verifyToken)
  public async getUsers(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.getUsers();
    return res.json(users);
  }

  @httpDelete("/:id", verifyToken)
  public async deleteUser(
    @requestParam("id") id: string,
    req: Request,
    res: Response
  ): Promise<Response> {
    const users = await this.userService.deleteUser(id);
    return res.json(users);
  }

  @httpGet("/:id", verifyToken)
  public async getUser(
    @requestParam("id") id: string,
    req: Request,
    res: Response
  ): Promise<Response> {
    const user = await this.userService.getUser(id);
    if (!user) {
      return res.status(404).json();
    }
    return res.json(user);
  }

  @httpPost(
    "",
    body("name").isLength({ min: 3 }),
    body("role").custom(async (typedDeclaration, { req }) => {
      if (
        req.body.role == "member" &&
        req.body.type !== "individual" &&
        req.body.type !== "company"
      ) {
        return Promise.reject("type and role has wrong values");
      }
    }),
    body("role").isIn(["member", "domainOwner"]),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  )
  public async createUser(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role, type } = req.body;

    try {
      const user = await this.userService.createUser(
        name,
        email,
        password,
        role,
        type
      );
      return res.status(201).json(user);
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
