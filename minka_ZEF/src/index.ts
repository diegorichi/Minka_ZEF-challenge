import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import requestTimeLogger from "./utils/requestTimeLogger";
import responseTime from "response-time";

import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import { Logger } from "./utils/logger";
import { ZEFRedisClient } from "./utils/redis.connection";
import "./controllers/users.controller";
import "./controllers/login.controller";
import "./controllers/projects.controller";
import "./controllers/currencies.controller";
import "./controllers/transactions.controller";
import { CurrencyService } from "./services/currency.service";
import { ProjectService } from "./services/project.service";
import { TransactionService } from "./services/transaction.service";
import { LoginService } from "./services/login.service";
import { UserService } from "./services/user.service";

export const TYPES = {
  Logger: Symbol.for("Logger"),
  ZEFRedisClient: Symbol.for("ZEFRedisClient"),
};

dotenv.config();

export const container = new Container();
container.bind<CurrencyService>(CurrencyService).toSelf();
container.bind<LoginService>(LoginService).toSelf();
container.bind<ProjectService>(ProjectService).toSelf();
container.bind<TransactionService>(TransactionService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<Logger>(Logger).toSelf();
container.bind<ZEFRedisClient>(ZEFRedisClient).toSelf();

// Creación del servidor Express
const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(responseTime());
  app.use(requestTimeLogger);
  app.use(cors());
  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send("Welcome to ZEF!");
  });
  
});

const app = server.build();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const logger = container.resolve<Logger>(Logger);
  logger.info(`Server listening on port ${PORT}`);
});
