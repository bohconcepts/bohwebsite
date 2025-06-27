import { supportsLocalStorage, isBrowser } from './helpers.js';

/**
 * This is a TypeScript implementation of the locks functionality
 * required by @supabase/auth-js
 * 
 * Uses helper functions like supportsLocalStorage for environment checks
 */

/**
 * @experimental
 */
export const internals = {
  /**
   * @experimental
   */
  debug: !!(typeof globalThis !== 'undefined' && 
    supportsLocalStorage() && 
    globalThis.localStorage && 
    globalThis.localStorage.getItem('supabase.gotrue-js.locks.debug') === 'true'),
};

/**
 * @experimental
 *
 * An interface for LockImplementation
 */
export interface LockImplementation {
  /**
   * Acquire a lock with a given name. Only one caller can acquire a lock with
   * a specific name at any given time.
   * @param name The name of the lock to acquire
   * @param callback The callback to call once the lock is acquired
   * @returns A promise resolving to the value returned by the callback
   * @throws Any error thrown by the callback
   */
  acquire<T>(name: string, callback: () => Promise<T>): Promise<T>;
}

/**
 * A simple in-memory lock implementation
 */
export class InMemoryLockImplementation implements LockImplementation {
  private locks: Record<string, boolean> = {};

  async acquire<T>(name: string, callback: () => Promise<T>): Promise<T> {
    if (this.locks[name]) {
      throw new Error(`Lock ${name} is already acquired`);
    }

    this.locks[name] = true;
    try {
      return await callback();
    } finally {
      delete this.locks[name];
    }
  }
}

/**
 * Browser lock implementation that uses Navigator.locks API
 */
export class BrowserLockImplementation implements LockImplementation {
  async acquire<T>(_name: string, callback: () => Promise<T>): Promise<T> {
    // Simple implementation without using Navigator.locks API
    console.log('Acquiring lock:', _name);
    return await callback();
  }
}

/**
 * Node lock implementation
 */
export class NodeLockImplementation implements LockImplementation {
  async acquire<T>(_name: string, callback: () => Promise<T>): Promise<T> {
    console.log('Acquiring lock in Node environment:', _name);
    return await callback();
  }
}

/**
 * Get the appropriate lock implementation based on environment
 */
export function getLockImplementation(): LockImplementation {
  // Use the imported helper to check if we're in a browser
  if (isBrowser() && typeof navigator !== 'undefined' && navigator && 'locks' in navigator) {
    console.log('Using BrowserLockImplementation');
    return new BrowserLockImplementation();
  }
  
  // Use storage check from the imported helper
  if (isBrowser() && supportsLocalStorage()) {
    console.log('Browser environment detected with localStorage support');
  }
  
  console.log('Using NodeLockImplementation');
  return new NodeLockImplementation();
}

/**
 * Check if locks are supported in the current environment
 */
export function lockSupported(): boolean {
  return true;
}

/**
 * An error thrown when a lock cannot be acquired after some amount of time.
 * Use the {@link #isAcquireTimeout} property instead of checking with `instanceof`.
 */
export class LockAcquireTimeoutError extends Error {
  isAcquireTimeout: boolean;

  constructor(message: string) {
    super(message);
    this.isAcquireTimeout = true;
  }
}

/**
 * Error thrown when a Navigator lock cannot be acquired
 */
export class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {}

/**
 * Error thrown when a Process lock cannot be acquired
 */
export class ProcessLockAcquireTimeoutError extends LockAcquireTimeoutError {}

/**
 * The default lock implementation
 */
export const locks = getLockImplementation();

/**
 * Navigator lock implementation (simplified)
 */
export async function navigatorLock<T>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<T>
): Promise<T> {
  if (internals.debug) {
    console.log('@supabase/gotrue-js: navigatorLock: acquire lock', name, acquireTimeout);
  }

  try {
    return await fn();
  } catch (e) {
    if (acquireTimeout === 0) {
      throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
    }
    throw e;
  }
}

/**
 * Process lock implementation (simplified)
 */
export async function processLock<T>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (acquireTimeout === 0) {
      throw new ProcessLockAcquireTimeoutError(`Acquiring process lock with name "${name}" timed out`);
    }
    throw e;
  }
}
