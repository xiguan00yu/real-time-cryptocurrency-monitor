import LRU from "lru-cache";

export default function createLRUCache() {
  return new LRU({
    sizeCalculation: () => 1,
    maxSize: 1000,
    // free accout 24hour only 100 request, so 24h / 100  = 86400ms/1
    ttl: 86400,
  });
}
