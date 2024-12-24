const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private store: Map<string, CacheItem<any>>;

  constructor() {
    this.store = new Map();
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.store.delete(key);
      return null;
    }
    
    return item.data;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }
}

export const cache = new Cache();