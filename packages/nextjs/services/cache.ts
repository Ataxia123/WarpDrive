// services/cache.ts
export type CacheData = {
  messageId: string;
  imageUrl?: string;
  description?: string;
  buttonMessageId?: string;
};

const cache = new Map<string, CacheData>();

export default cache;
