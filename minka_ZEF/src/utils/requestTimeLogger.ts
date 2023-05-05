import { NextFunction } from "express";
import { logger } from "./logging";

export default function requestTimeLogger(req: any, res: any, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    logger.info(message);
  });

  next();
};