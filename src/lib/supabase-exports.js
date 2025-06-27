/**
 * This file provides explicit exports of all Supabase auth functions 
 * that might be imported from different locations.
 * 
 * This is a direct implementation to avoid circular dependencies.
 */

// Helper functions to check environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const hasNavigatorLocks = isBrowser && typeof navigator !== 'undefined' && 'locks' in navigator;

// Export helper functions
export function supportsLocalStorage() {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    // Test if localStorage is actually usable
    const key = 'supabase.test';
    localStorage.setItem(key, 'test');
    localStorage.removeItem(key);
    
    return true;
  } catch (e) {
    return false;
  }
}

export { isBrowser };

/**
 * Resolve fetch implementation
 * Required by @supabase/storage-js
 */
export const resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    // This is a simplified version that doesn't attempt to import node-fetch
    _fetch = (...args) => {
      console.warn('Fetch is not available in this environment');
      return Promise.reject(new Error('Fetch is not available in this environment'));
    };
  } else {
    _fetch = fetch;
  }
  
  return (...args) => _fetch(...args);
};

/**
 * Resolve Response object for Supabase Storage
 * Required by @supabase/storage-js
 */
export const resolveResponse = async () => {
  if (typeof Response === 'undefined') {
    // In environments without Response, return a shim
    return class ResponseShim {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = new Map(Object.entries(init.headers || {}));
      }
      
      json() {
        return Promise.resolve(JSON.parse(this.body));
      }
      
      text() {
        return Promise.resolve(this.body);
      }
    };
  }
  return Response;
};

/**
 * Recursive camelCase keys for Supabase Storage
 * Required by @supabase/storage-js
 */
export const recursiveToCamel = (item) => {
  if (Array.isArray(item)) {
    return item.map(el => recursiveToCamel(el));
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item;
  }
  
  const result = {};
  Object.entries(item).forEach(([key, value]) => {
    const newKey = key.replace(/([-_][a-z])/gi, c => 
      c.toUpperCase().replace(/[-_]/g, '')
    );
    result[newKey] = recursiveToCamel(value);
  });
  
  return result;
};

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
 * Lock interface implementation for browsers
 */
export class BrowserLockImplementation {
  async acquire(name, callback) {
    // Simplified implementation - just run the callback
    if (internals.debug) {
      console.log('BrowserLockImplementation: acquiring lock', name);
    }
    try {
      return await callback();
    } catch (e) {
      if (internals.debug) {
        console.error('BrowserLockImplementation: error during callback', e);
      }
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
    if (internals.debug) {
      console.log('NodeLockImplementation: acquiring lock', name);
    }
    try {
      return await callback();
    } catch (e) {
      if (internals.debug) {
        console.error('NodeLockImplementation: error during callback', e);
      }
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

// Default export for compatibility
export default {
  locks,
  lockSupported,
  getLockImplementation,
  BrowserLockImplementation,
  NodeLockImplementation,
  navigatorLock,
  processLock,
  LockAcquireTimeoutError,
  NavigatorLockAcquireTimeoutError,
  ProcessLockAcquireTimeoutError,
  internals,
  supportsLocalStorage,
  isBrowser,
  resolveResponse,
  resolveFetch,
  recursiveToCamel
};
