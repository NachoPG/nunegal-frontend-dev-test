import { inject, Service } from '@angular/core';
import { BROWSER_STORAGE } from './browser-storage.token';

@Service()
export class SafeStorage {
  private readonly storage = inject(BROWSER_STORAGE);
  private readonly memory = new Map<string, string>();

  getItem<T>(key: string): T | null {
    const raw = this.storage ? this.storage.getItem(key) : (this.memory.get(key) ?? null);
    if (raw === null) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    const raw = JSON.stringify(value);

    if (!this.storage) {
      this.memory.set(key, raw);
      return true;
    }

    try {
      this.storage.setItem(key, raw);
      return true;
    } catch {
      return false;
    }
  }

  removeItem(key: string): void {
    if (this.storage) {
      this.storage.removeItem(key);
    } else {
      this.memory.delete(key);
    }
  }
}
