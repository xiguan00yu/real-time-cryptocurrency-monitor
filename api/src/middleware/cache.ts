import koaCash from "koa-cash";
import createRedisConnect from "../utils/redis";
import createLRUCache from "../utils/lru";

const CacheMiddleware = () => {
  let cache:
    | ReturnType<typeof decorateRedis>
    | ReturnType<typeof decorateLRU>
    | null = null;

  /**
   * new set/get function
   */
  const decorateRedis = (
    redis: Awaited<ReturnType<typeof createRedisConnect>>
  ) => {
    return {
      set: (key: string, value: string) =>
        redis.set(
          key,
          JSON.stringify(value),
          // free accout 24hour only 100 request, so 24h / 100  = 864s/1
          "EX",
          864
        ),
      get: async (key: string) => JSON.parse((await redis.get(key)) || "{}"),
    };
  };

  const decorateLRU = (lru: ReturnType<typeof createLRUCache>) => ({
    set: (key: string, value: string) =>
      lru.set(key, value, {
        // free accout 24hour only 100 request, so 24h / 100  = 86400ms/1
        ttl: 86400,
      }),
    get: (key: string) => {
      return lru.get(key);
    },
  });

  const getCache = async () => {
    if (cache !== null) {
      return cache;
    }
    try {
      const redis = await createRedisConnect();
      console.info("api cache will use redis store");
      return (cache = decorateRedis(redis));
    } catch (error) {
      console.info("redis connect fail! api cache will use memory store");
      return (cache = decorateLRU(createLRUCache()));
    }
  };

  return koaCash({
    async get(key, maxAge) {
      const cache = await getCache();
      return cache.get(key);
    },
    async set(key, value: string) {
      const cache = await getCache();
      await cache.set(key, value);
    },
  });
};

export default CacheMiddleware();
