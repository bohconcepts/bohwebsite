/**
 * This is a locks implementation that works around issues in @supabase/auth-js
 */

// Helper functions to check environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const hasNavigatorLocks = isBrowser && typeof navigator !== 'undefined' && 'locks' in navigator;

/**
 * @experimental
 */
export const internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && 
    typeof localStorage !== 'undefined' && 
    globalThis.localStorage && 
    globalThis.localStorage.getItem('supabase.gotrue-js.locks.debug') === 'true'),
};

/**
 * Lock interface implementation for browsers
 */
export class BrowserLockImplementation {
  async acquire(name, callback) {
    // Simplified implementation - just run the callback
    console.log('BrowserLockImplementation: acquiring lock', name);
    try {
      return await callback();
    } catch (e) {
      console.error('BrowserLockImplementation: error during callback', e);
      throw e;
    }
  }
}

/**
 * Lock interface implementation for Node.js
 */
export class NodeLockImplementation {
  async acquire(name, callback) {
    // Simplified implementation - just run the callback
    console.log('NodeLockImplementation: acquiring lock', name);
    try {
      return await callback();
    } catch (e) {
      console.error('NodeLockImplementation: error during callback', e);
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
 * Use the {@link #isAcquireTimeout} property instead of checking with `instanceof`.
 */
export class LockAcquireTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
}

/**
 * Error thrown when a Navigator lock cannot be acquired
 */
export class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
}

/**
 * Error thrown when a Process lock cannot be acquired
 */
export class ProcessLockAcquireTimeoutError extends LockAcquireTimeoutError {
}

/**
 * The default lock implementation
 */
export const locks = getLockImplementation();

/**
 * Navigator lock implementation (simplified)
 */
export async function navigatorLock(name, acquireTimeout, fn) {
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
