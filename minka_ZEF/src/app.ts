import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { DataSource } from "typeorm";
import userRoutes from "./routes/users.routes";
import loginRoutes from "./routes/login.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(loginRoutes);
app.use(userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
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
    console.log(`Data Source has been initialized`);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });

export default connectDB;


import * as redis from 'redis';

export const redisClient = redis.createClient({
  socket: { 
    port: 6379,//parseInt(process.env.REDIS_PORT!, 10),
    host: "localhost"//process.env.REDIS_HOST
  },
  //username: "redis_user",//process.env.REDIS_USER,
  password: "supersecretpassword"//process.env.REDIS_PASSWORD
});

redisClient.on("connect", function () {
    console.log("Redis plugged in.");
});

redisClient.connect();