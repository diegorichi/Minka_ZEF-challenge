import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { container } from "../index";
import { Logger } from "./logger";

dotenv.config();

const connectDB = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: true,
  entities: ["../**/*entity.{js,ts}"],
  ssl: false,
});

connectDB
  .initialize()
  .then(() => {
    const logger = container.resolve<Logger>(Logger);

    logger.info(`Data Source has been initialized`);
  })
  .catch((err) => {
    const logger = container.resolve<Logger>(Logger);

    logger.error(`Data Source initialization error`, err);
  });

export default connectDB;
