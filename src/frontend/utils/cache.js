const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getCached = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

export const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (key) => {
  if (key) cache.delete(key);
  else cache.clear();
};
