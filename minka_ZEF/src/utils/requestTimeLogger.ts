import { NextFunction } from "express";
import { container } from "../index";
import { Logger } from "./logger";

export default function requestTimeLogger(
  req: any,
  res: any,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const logger = container.resolve<Logger>(Logger);

    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    logger.info(message);
  });

  next();
}
