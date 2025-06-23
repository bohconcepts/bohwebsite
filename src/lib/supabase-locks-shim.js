// This file is a shim for @supabase/auth-js/dist/module/lib/locks.js
// It provides a simplified version of the locks implementation without the syntax error

class LockImplementation {
  async acquire(name, callback) {
    try {
      return await callback();
    } catch (e) {
      throw e;
    }
  }
}

export class BrowserLockImplementation extends LockImplementation {
  async acquire(name, callback) {
    // Simple implementation without using Navigator.locks API
    return await callback();
  }
}

export class NodeLockImplementation extends LockImplementation {
  async acquire(name, callback) {
    return await callback();
  }
}

export function getLockImplementation() {
  if (typeof navigator !== 'undefined' && navigator && 'locks' in navigator) {
    return new BrowserLockImplementation();
  }
  
  return new NodeLockImplementation();
}

export function lockSupported() {
  return true;
}

export const locks = getLockImplementation();
