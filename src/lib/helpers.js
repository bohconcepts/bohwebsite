/**
 * This file provides helper functions used by the locks shim and other Supabase Auth components
 */

/**
 * Check if localStorage is supported and usable
 */
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

/**
 * Check if the current environment is a browser
 */
export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

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
 * Check if an object looks like a fetch Response
 * Required by @supabase/auth-js
 */
export function looksLikeFetchResponse(maybeResponse) {
  return (
    typeof maybeResponse === 'object' &&
    maybeResponse !== null &&
    'status' in maybeResponse &&
    'ok' in maybeResponse &&
    'json' in maybeResponse &&
    typeof maybeResponse.json === 'function'
  );
}

/**
 * Calculate expiry timestamp
 * Required by @supabase/auth-js
 */
export function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1000);
  return timeNow + expiresIn;
}

/**
 * Parse API version from response headers
 * Required by @supabase/auth-js
 */
export function parseResponseAPIVersion(response) {
  const version = response.headers.get('x-version');
  if (!version) {
    return '1';
  }
  return version;
}
