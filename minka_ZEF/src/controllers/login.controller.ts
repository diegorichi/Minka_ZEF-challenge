import { Request, Response } from "express";
import { User } from "../models/user";
import { createHash } from "crypto";
import { sign } from "jsonwebtoken";
import { redisClient } from "../app";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logging";


export const logout = async (req: Request, res: Response): Promise<void> => {
  try{
    logger.debug("starting loggin out");
    const authHeader = req.headers.authorization;
    if (authHeader) {
      logger.debug("auth header finded");
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err){
          logger.debug("error verifying token");
        }
        const { id } = user;
        logger.debug(`removing token from cache user_id: ${id}`);
        redisClient.del(`authN_${id}`);
      });
    }
  }catch(error){
    logger.error("something went wrong:" +error);
  }
  logger.debug("removing token from cache");
  res.clearCookie("access_token");
  logger.debug("logged out");
  res.status(200).send({ message: "Logged out" });
  
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    logger.debug("starting loggin in");

    const passwordHash = createHash("md5").update(password).digest("hex");

    const userFinded = await User.findOneBy({ email, password: passwordHash });

    if (userFinded) {
      logger.info(`user finded:${email}`);

      const token = sign(
        { id: userFinded.id, email: userFinded.email },
        process.env.JWT_SECRET!,
        { expiresIn: "24h"}//"1h" }
      );

      logger.info(`set cookie and add to cache:${email}`);

      res.cookie("access_token", token, {
        httpOnly: true,
      });

      await redisClient.set(`authN_${userFinded.id}`, JSON.stringify({ token }), {
        //EX: 60 * 60 * 1, // 1 hour
        EX: 60 * 60 * 1,
      });

      res.status(200).json({ token });
      return;
    }
    logger.info(`inexistent user:${email}`);

    res.status(401).json({ message: "Unauthorized"});
  } catch (error) {
    logger.error(`something went wrong:${error}`);
    res.status(500).json({ error: "Error loggin in" });
  }
};
