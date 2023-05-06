import { Request, Response } from "express";
import { inject } from "inversify";
import { UserService } from "../services/user.service";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middleware/zef.middleware";
import { Logger } from "../utils/logger";
import { ZEFRedisClient } from "../utils/redis.connection";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { sign } from "jsonwebtoken";
import { body, validationResult } from "express-validator";

@controller("/auth")
export class LoginController {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(UserService) private userService: UserService,
    @inject(ZEFRedisClient) private zefRedisClient: ZEFRedisClient
  ) {}

  @httpGet("/logout", verifyToken)
  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      this.logger.debug("starting loggin out");
      const authHeader = req.headers.authorization;
      if (authHeader) {
        this.logger.debug("auth header finded");
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
          if (err) {
            this.logger.debug("error verifying token");
          }
          const {id} = user;
          this.logger.debug(`removing token from cache user_id: ${id}`);
          this.zefRedisClient.redisClient.del(`authN_${id}`);
        });
      }
    } catch (error) {
      this.logger.error("something went wrong:" + error);
    }
    this.logger.debug("removing token from cache");
    res.clearCookie("access_token");
    this.logger.debug("logged out");
    return res.status(200).send({ message: "Logged out" });
  }

  @httpPost("/login",
  body("email").isEmail(),
  body("password").isLength({min:6}),
  )
  public async login(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      this.logger.debug("starting loggin in");

      const passwordHash = createHash("md5").update(password).digest("hex");

      const userFinded = await this.userService.findOneBy({
        email,
        password: passwordHash,
      });

      if (userFinded) {
        this.logger.info(`user finded:${email}`);

        const token = sign(
          { id: userFinded.id, email: userFinded.email },
          process.env.JWT_SECRET!,
          { expiresIn: "24h" } //"1h" }
        );

        this.logger.info(`set cookie and add to cache:${email}`);

        res.cookie("access_token", token, {
          httpOnly: true,
        });

        await this.zefRedisClient.redisClient.set(
          `authN_${userFinded.id}`,
          JSON.stringify({ token }),
          {
            //EX: 60 * 60 * 1, // 1 hour
            EX: 60 * 60 * 1,
          }
        );

        return res.status(200).json({ token });
      }
      this.logger.info(`inexistent user:${email}`);
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      this.logger.error(`something went wrong:${error}`);
      return res.status(500).json({ error: "Error loggin in" });
    }
  }
}
