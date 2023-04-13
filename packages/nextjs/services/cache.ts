// services/cache.ts
interface CacheData {
  messageId: string;
  imageUrl: string;
}

const cache = new Map<string, CacheData>();

export default cache;
