import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.CLIENT_SECRET as string, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }

      // Agregar el objeto user al objeto request para usar en la función de controlador correspondiente
      //req.user = user;

      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
