import { inject, Service } from '@angular/core';
import { CACHE_TTL_MS, NOW } from '../config/api.config';
import { SafeStorage } from '../storage/safe-storage';

const KEY_PREFIX = 'http-cache:v1:';

interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number;
}

function isCacheEntry<T>(value: unknown): value is CacheEntry<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'expiresAt' in value &&
    typeof (value as CacheEntry<T>).expiresAt === 'number'
  );
}

@Service()
export class HttpCacheStore {
  private readonly storage = inject(SafeStorage);
  private readonly ttlMs = inject(CACHE_TTL_MS);
  private readonly now = inject(NOW);

  read<T>(key: string): T | null {
    const entry = this.storage.getItem<CacheEntry<T>>(KEY_PREFIX + key);

    if (!isCacheEntry<T>(entry)) {
      return null;
    }

    if (this.now() >= entry.expiresAt) {
      this.storage.removeItem(KEY_PREFIX + key);
      return null;
    }

    return entry.value;
  }

  write<T>(key: string, value: T): void {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: this.now() + this.ttlMs,
    };
    this.storage.setItem(KEY_PREFIX + key, entry);
  }

  remove(key: string): void {
    this.storage.removeItem(KEY_PREFIX + key);
  }
}
