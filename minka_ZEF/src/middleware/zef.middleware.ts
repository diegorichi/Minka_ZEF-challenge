import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { redisClient } from "../app";
import { User } from "../models/user";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try{
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user:  any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }

      const { id } = user;
      User.findOneBy(id).then(aUser =>{
        if (!aUser){
          return res.status(403).json({ error: "Invalid token" });
        }else{
          req.user = aUser;
        }
      });
      redisClient.exists(id+"").then( (exists) => {
        if (exists !== 1) {
          return res.status(401).send('Unauthorized');
        }else{
          next();
        }
      });

    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
} catch (error) {
  console.error(error);
  res.status(401).json({ message: "Unauthorized" });
}};
