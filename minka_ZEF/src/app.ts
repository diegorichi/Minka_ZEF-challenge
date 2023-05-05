import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as redis from "redis";
import loginRoutes from "./routes/login.routes";
import projectRoutes from "./routes/project.routes";
import currencyRoutes from "./routes/currency.routes";
import { logger } from "./utils/logging";
import requestTimeLogger from "./utils/requestTimeLogger";
import responseTime from "response-time";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(responseTime());
app.use(requestTimeLogger);

app.use(cors());
app.use(bodyParser.json());
app.use(loginRoutes);
app.use(userRoutes);
app.use(projectRoutes);
app.use(currencyRoutes);
app.use(projectRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to ZEF!");
});

app.use(function (req, res, next) {
  res.status(404).send({ message: "Lo siento, no se encontró la página" });
  logger.error(`404 error: ${req.originalUrl}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

const connectDB = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: true,
  entities: ["./src/models/**/*.ts"],
  ssl: false,
});

connectDB
  .initialize()
  .then(() => {
    logger.info(`Data Source has been initialized`);
  })
  .catch((err) => {
    logger.error(`Data Source initialization error`, err);
  });

export default connectDB;

export const redisClient = redis.createClient({
  socket: {
    port: 6379, //parseInt(process.env.REDIS_PORT!, 10),
    host: "localhost", //process.env.REDIS_HOST
  },
  //username: "redis_user",//process.env.REDIS_USER,
  password: "supersecretpassword", //process.env.REDIS_PASSWORD
});

redisClient.on("connect", function () {
  logger.info("Redis plugged in.");
});

redisClient.connect();
