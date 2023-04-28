import { Request, Response } from "express";
import { User } from "../models/user";
import { createHash } from "crypto";
import { sign } from "jsonwebtoken";
import { redisClient } from "../app";
import jwt from "jsonwebtoken";

export const logout = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      const { id } = user;
      redisClient.del(id+"");
    });

    res.clearCookie("access_token");
    res.status(200).send({ message: "Logged out" });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const passwordHash = createHash("md5").update(password).digest("hex");

    const userFinded = await User.findOneBy({ email, password: passwordHash });

    if (userFinded) {
      const token = sign(
        { id: userFinded.id, email: userFinded.email },
        process.env.JWT_SECRET!,
        { expiresIn: 120}//"1h" }
      );

      //add to redis

      res.cookie("access_token", token, {
        httpOnly: true,
      });

      await redisClient.set(userFinded.id + "", JSON.stringify({ token }), {
        //EX: 60 * 60 * 1,
        EX: 120,
      });

      res.status(200).json({ token });
      return;
    }
    res.status(401).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error login in" });
  }
};
