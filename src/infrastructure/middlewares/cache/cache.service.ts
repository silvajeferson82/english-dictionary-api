import { Injectable } from '@nestjs/common';

type CacheEntry<T> = {
  data: T;
  expiry: number;
};

@Injectable()
export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const cached = this.store.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiry) {
      this.store.delete(key);
      return null;
    }
    return cached.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiry: Date.now() + ttlMs });
  }

  generateKey(method: string, url: string): string {
    return `${method.toUpperCase()}:${url}`;
  }
}
