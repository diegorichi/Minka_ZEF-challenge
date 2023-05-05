import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../app";
import { User } from "../models/user";
import { logger } from "../utils/logging";
import { FindOneOptions } from "typeorm";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try{
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user:  any) => {
      if (err) {
        logger.error("Invalid token err: "+err.message);
        return res.status(403).json({ error: "Forbidden" });
      }

      const { id } = user;
      const optionsUser: FindOneOptions<User> = {
        where: { id: parseInt(id) },
      };
      User.findOne(optionsUser).then(aUser =>{
        if (!aUser){
          logger.error(`Invalid token. User id does not exist: ${id}`);
          return res.status(403).json({ error: "Forbidden" });
        }else{
          req.user = aUser;
        }
      }).then( user =>
        redisClient.exists(`authN_${id}`).then( (exists) => {
        if (exists !== 1) {
          logger.error(`Unauthorized: No user stored in cache id:${id}`);
          res.status(401).json({ error: "Unauthorized" });
        }else{
          logger.info(`Update expires cache +60min:${id}`);
          redisClient.expire(`authN_${id}`, 60*60);
          next();
        }
      }));

    });
  } else {
    logger.error('Unauthorized: No header in request');
    res.status(401).json({ error: "Unauthorized" });
  }
} catch (error) {
  logger.error(error);
  res.status(401).json({ error: "Unauthorized" });
}};
