import * as redis from "redis";
import { Logger } from "./logger";
import { injectable, inject } from "inversify";

@injectable()
export class ZEFRedisClient {
  public redisClient: redis.RedisClientType;

  constructor(@inject(Logger) private logger: Logger) {
    this.redisClient = redis.createClient({
      socket: {
        port: parseInt(process.env.REDIS_PORT!, 10),
        host: process.env.REDIS_HOST,
      },
      password: process.env.REDIS_PASSWORD,
    });
    this.redisClient
      .on("connect", function () {
        logger.info("Redis plugged in.");
      })
      .connect();
  }
}
