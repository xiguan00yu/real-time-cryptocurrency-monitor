import koaCash from "koa-cash";
import LRU from "lru-cache";

const cache = new LRU({
  sizeCalculation: () => 1,
  maxSize: 1000,
  // free accout 24hour only 100 request, so 24h / 100  = 86400ms/1
  ttl: 86400,
});

export default koaCash({
  async get(key, maxAge) {
    return cache.get(key);
  },
  async set(key, value) {
    cache.set(key, value);
  },
});
