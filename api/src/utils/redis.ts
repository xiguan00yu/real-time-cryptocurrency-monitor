import Redis from "ioredis";
import * as AppConfig from "../config/app";

export default async function createRedisConnect(): Promise<Redis> {
  return new Promise((resolve, reject) => {
    const redisClient = new Redis(AppConfig.REDIS_URL);

    redisClient.on("connect", (msg) => {
      // redis connect success
      resolve(redisClient);
    });

    redisClient.on("error", (error) => {
      if (["ECONNREFUSED", "ENOTFOUND"].includes(error?.code)) {
        // redis connect fail
        redisClient.removeAllListeners();
        redisClient.disconnect();
        reject(error);
      }
    });
  });
}
