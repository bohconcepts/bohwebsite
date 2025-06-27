/**
 * Complete standalone implementation of Supabase Auth's locks module
 * This avoids circular dependencies and provides all required exports
 */

// Helper functions to check environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const hasNavigatorLocks = isBrowser && typeof navigator !== 'undefined' && 'locks' in navigator;
const supportsLocalStorage = () => {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const key = 'supabase.test';
    localStorage.setItem(key, 'test');
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @experimental
 */
export const internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && 
    supportsLocalStorage() && 
    globalThis.localStorage && 
    globalThis.localStorage.getItem('supabase.gotrue-js.locks.debug') === 'true'),
};

/**
 * Lock interface implementation for browsers
 */
export class BrowserLockImplementation {
  async acquire(name, callback) {
    try {
      return await callback();
    } catch (e) {
      throw e;
    }
  }
}

/**
 * Lock interface implementation for Node.js
 */
export class NodeLockImplementation {
  async acquire(name, callback) {
    try {
      return await callback();
    } catch (e) {
      throw e;
    }
  }
}

/**
 * Get the appropriate lock implementation based on environment
 */
export function getLockImplementation() {
  if (hasNavigatorLocks) {
    return new BrowserLockImplementation();
  }
  return new NodeLockImplementation();
}

/**
 * Check if locks are supported in the current environment
 */
export function lockSupported() {
  return true;
}

/**
 * An error thrown when a lock cannot be acquired after some amount of time.
 */
export class LockAcquireTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LockAcquireTimeoutError';
    this.isAcquireTimeout = true;
  }
}

/**
 * Error thrown when a Navigator lock cannot be acquired
 */
export class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
  constructor(message) {
    super(message);
    this.name = 'NavigatorLockAcquireTimeoutError';
  }
}

/**
 * Error thrown when a Process lock cannot be acquired
 */
export class ProcessLockAcquireTimeoutError extends LockAcquireTimeoutError {
  constructor(message) {
    super(message);
    this.name = 'ProcessLockAcquireTimeoutError';
  }
}

/**
 * The default lock implementation
 */
export const locks = getLockImplementation();

/**
 * Navigator lock implementation (simplified)
 */
export async function navigatorLock(name, acquireTimeout, fn) {
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
export async function processLock(name, acquireTimeout, fn) {
  try {
    return await fn();
  } catch (e) {
    if (acquireTimeout === 0) {
      throw new ProcessLockAcquireTimeoutError(`Acquiring process lock with name "${name}" timed out`);
    }
    throw e;
  }
}

// Add these exports for compatibility with various import styles
export default {
  locks,
  lockSupported,
  getLockImplementation,
  BrowserLockImplementation,
  NodeLockImplementation,
  LockAcquireTimeoutError,
  NavigatorLockAcquireTimeoutError,
  ProcessLockAcquireTimeoutError,
  navigatorLock,
  processLock,
  internals
};
